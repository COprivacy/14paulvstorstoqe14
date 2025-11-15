
# Sistema de Bloqueio de Estoque - Orçamentos

## 📋 Visão Geral

Este documento descreve o **contrato de transação e locking** do sistema de reserva de estoque para orçamentos aprovados.

## 🔒 Garantias de Concorrência

### Row-Level Locking

Todas as operações críticas utilizam `SELECT ... FOR UPDATE` para garantir locks exclusivos:

```sql
-- Lock do orçamento
SELECT * FROM orcamentos WHERE id = $1 FOR UPDATE;

-- Lock de TODOS os produtos afetados
SELECT * FROM produtos 
WHERE id = ANY($1) AND user_id = $2 
FOR UPDATE;
```

### Transações Atômicas

**REGRA FUNDAMENTAL:** Toda operação de aprovação/edição/conversão DEVE acontecer dentro de uma única transação do PostgreSQL.

```typescript
return await this.db.transaction(async (tx) => {
  // 1. Lock do orçamento
  const [orcamentoOriginal] = await tx.select()
    .from(orcamentos)
    .where(eq(orcamentos.id, id))
    .for('update');

  // 2. Lock dos produtos
  await tx.select()
    .from(produtos)
    .where(inArray(produtos.id, produtosParaTravar))
    .for('update');

  // 3. Validações
  // 4. Atualizações
  // 5. Recálculo de bloqueios
});
```

## 🎯 Cenários de Uso

### 1. Aprovar Orçamento

**Entrada:** `status: 'pendente'` → `status: 'aprovado'`

**Fluxo:**
1. Lock do orçamento
2. Lock de todos os produtos nos itens
3. Para cada produto:
   - Buscar estoque total
   - Calcular bloqueios de OUTROS orçamentos
   - Validar: `estoque - bloqueios_outros >= quantidade_solicitada`
   - Se insuficiente: ROLLBACK com erro
4. Criar bloqueios para este orçamento
5. COMMIT

**Garantia:** Nenhum outro orçamento poderá aprovar os mesmos produtos simultaneamente devido aos locks.

### 2. Editar Orçamento Aprovado

**Entrada:** Orçamento com `status: 'aprovado'` + novos itens

**Fluxo:**
1. Lock do orçamento
2. Detectar mudança nos itens: `JSON.stringify(itens_novos) !== JSON.stringify(itens_antigos)`
3. Se mudou:
   - Lock de TODOS os produtos (novos + antigos)
   - Excluir bloqueios antigos deste orçamento: `WHERE orcamento_id != $id`
   - Validar estoque disponível
   - Criar novos bloqueios
4. Se não mudou: apenas atualizar outros campos
5. COMMIT

**Garantia:** Locks previnem race conditions entre múltiplas edições simultâneas.

### 3. Rejeitar/Arquivar/Deletar Orçamento

**Entrada:** Qualquer status → `status: 'rejeitado'` ou `'arquivado'` ou DELETE

**Fluxo:**
1. Lock do orçamento (se UPDATE)
2. Deletar bloqueios: `WHERE orcamento_id = $id`
3. COMMIT

**Garantia:** Liberação imediata de estoque bloqueado.

### 4. Converter em Venda

**Entrada:** Orçamento `status: 'aprovado'`

**Fluxo:**
1. Validar estoque disponível (considerando bloqueios)
2. Criar venda
3. Deduzir estoque: `UPDATE produtos SET quantidade = quantidade - $qtd`
4. Deletar bloqueios
5. Atualizar orçamento: `status: 'convertido'`
6. COMMIT

**Garantia:** Bloqueios garantem que o estoque reservado está disponível.

## ⚠️ Regras Críticas para Desenvolvedores

### ❌ NUNCA FAÇA ISSO:

```typescript
// ❌ ERRADO: Validação fora de transação
const estoque = await validarEstoque();
await db.transaction(async (tx) => {
  await aprovarOrcamento();
});
```

### ✅ SEMPRE FAÇA ISSO:

```typescript
// ✅ CORRETO: Tudo dentro de uma transação
await db.transaction(async (tx) => {
  const estoque = await validarEstoque(tx);
  await aprovarOrcamento(tx);
});
```

### ❌ NUNCA FAÇA ISSO:

```typescript
// ❌ ERRADO: Lock parcial
await tx.select().from(produtos)
  .where(eq(produtos.id, produto1))
  .for('update');
// Faltou travar produto2!
```

### ✅ SEMPRE FAÇA ISSO:

```typescript
// ✅ CORRETO: Lock de TODOS os produtos
const produtosIds = [produto1, produto2, produto3];
await tx.select().from(produtos)
  .where(inArray(produtos.id, produtosIds))
  .for('update');
```

## 📊 Query para Calcular Estoque Disponível

```sql
SELECT 
  p.quantidade AS estoque_total,
  COALESCE(SUM(
    CASE WHEN be.orcamento_id != $orcamento_atual 
    THEN be.quantidade_bloqueada 
    ELSE 0 END
  ), 0) AS bloqueios_outros,
  (p.quantidade - COALESCE(SUM(...), 0)) AS disponivel
FROM produtos p
LEFT JOIN bloqueios_estoque be ON be.produto_id = p.id
WHERE p.id = $produto_id AND p.user_id = $user_id
GROUP BY p.id, p.quantidade;
```

**Importante:** Sempre excluir bloqueios do próprio orçamento na contagem.

## 🔧 Manutenção

### Limpeza de Bloqueios Órfãos

Em caso de falha no sistema, pode haver bloqueios sem orçamento correspondente:

```sql
DELETE FROM bloqueios_estoque
WHERE orcamento_id NOT IN (SELECT id FROM orcamentos);
```

### Auditoria de Integridade

```sql
-- Verificar se há bloqueios sem produto
SELECT * FROM bloqueios_estoque be
LEFT JOIN produtos p ON be.produto_id = p.id
WHERE p.id IS NULL;

-- Verificar se há bloqueios sem orçamento
SELECT * FROM bloqueios_estoque be
LEFT JOIN orcamentos o ON be.orcamento_id = o.id
WHERE o.id IS NULL;
```

## 📈 Telemetria Recomendada

Métricas importantes para monitorar:

1. **Latência de Aprovação:** Tempo médio para aprovar orçamento
2. **Contenção de Locks:** Frequência de waits em locks
3. **Taxa de Rejeição por Estoque:** % de aprovações que falham por estoque
4. **Bloqueios Ativos:** Quantidade de produtos com estoque bloqueado

## 🚀 Performance

### Índices Essenciais

```sql
CREATE INDEX idx_bloqueios_produto_id ON bloqueios_estoque(produto_id);
CREATE INDEX idx_bloqueios_orcamento_id ON bloqueios_estoque(orcamento_id);
CREATE INDEX idx_bloqueios_user_id ON bloqueios_estoque(user_id);
```

### Limites Recomendados

- Máximo 100 itens por orçamento
- Timeout de transação: 10 segundos
- Retry automático: 3 tentativas com backoff exponencial

## 📝 Changelog

| Versão | Data | Mudanças |
|--------|------|----------|
| 1.0.0 | 2025-11-15 | Implementação inicial com locks e transações |

---

**⚠️ ATENÇÃO:** Qualquer modificação neste sistema DEVE ser revisada por um arquiteto técnico para garantir que as garantias de concorrência sejam mantidas.
