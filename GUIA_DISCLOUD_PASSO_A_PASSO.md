# 🚀 Guia Completo: Deploy do PAVISOFT na Discloud

## ✅ Passo 1: Verificar o que Já Funciona

Antes de configurar a Discloud, confirme que tudo está OK aqui no Replit:
- ✅ Aplicação rodando sem erros
- ✅ Banco de dados conectado
- ✅ Login funcionando

## 📋 Passo 2: Preparar as Variáveis de Ambiente

### 2.1 Variáveis OBRIGATÓRIAS

Você PRECISA configurar estas 3 variáveis na Discloud:

```env
DATABASE_URL=postgresql://neondb_owner:SUA_SENHA@ep-soft-river-acq795zw-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require
NODE_ENV=production
PORT=5000
```

⚠️ **IMPORTANTE:** Use a sua DATABASE_URL do Neon (com a senha correta)

### 2.2 Variáveis OPCIONAIS (mas recomendadas)

```env
# Para envio de emails (se quiser ativar)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASSWORD=sua-senha-de-app

# Para pagamentos via MercadoPago (se quiser ativar)
MERCADOPAGO_ACCESS_TOKEN=seu-token-aqui
```

## 🔧 Passo 3: Configurar na Discloud

### Opção A: Via Painel Web da Discloud

1. **Acesse o painel da Discloud:**
   - Vá em https://discloud.app
   - Faça login
   - Clique no seu aplicativo

2. **Configure as variáveis:**
   - Procure por "Environment Variables" ou "Variáveis de Ambiente"
   - Clique em "Adicionar" ou "Add New"
   - Adicione UMA POR UMA:

   ```
   Nome: DATABASE_URL
   Valor: postgresql://neondb_owner:SUA_SENHA@ep-soft-river-acq795zw-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require
   ```

   ```
   Nome: NODE_ENV
   Valor: production
   ```

   ```
   Nome: PORT
   Valor: 5000
   ```

3. **Salve cada variável** antes de adicionar a próxima

4. **Reinicie o aplicativo:**
   - Procure por "Restart" ou "Reiniciar"
   - Clique e aguarde

### Opção B: Via CLI da Discloud

Se você usa a linha de comando da Discloud:

```bash
# Configure cada variável
discloud config set DATABASE_URL "postgresql://neondb_owner:SUA_SENHA@ep-soft-river-acq795zw-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require"
discloud config set NODE_ENV "production"
discloud config set PORT "5000"

# Reinicie o app
discloud restart SEU_APP_ID
```

## ✅ Passo 4: Verificar se Funcionou

### 4.1 Verificar os Logs

```bash
# Via CLI
discloud logs app SEU_APP_ID

# Ou pelo painel web, clique em "Logs"
```

### 4.2 O que você DEVE ver nos logs (sucesso):

```
🔌 Conectando ao PostgreSQL: postgresql:****@ep-soft-river-acq795zw-pooler.sa-east-1.aws.neon.tech/neondb
✅ PostgreSQL conectado com sucesso
✅ Tabelas de cupons já existem
🚀 Servidor rodando em http://0.0.0.0:5000
✅ Servidor iniciado
```

### 4.3 O que você NÃO deve ver (erro):

```
❌ ERRO: Variável de ambiente DATABASE_URL não está configurada!
```

Se ainda aparecer esse erro, significa que a variável não foi configurada corretamente.

## 🔍 Passo 5: Troubleshooting (Resolução de Problemas)

### Problema 1: DATABASE_URL não está configurada

**Solução:**
1. Verifique se você salvou a variável corretamente
2. Certifique-se de que não tem espaços extras no início ou fim
3. Reinicie o aplicativo na Discloud
4. Aguarde 1-2 minutos e verifique os logs novamente

### Problema 2: Erro de conexão com o banco

```
Error: getaddrinfo ENOTFOUND
```

**Possíveis causas e soluções:**

1. **URL do banco incorreta**
   - Verifique se copiou a URL completa do Neon
   - Certifique-se de que tem `?sslmode=require` no final

2. **IP da Discloud bloqueado no Neon**
   - Vá no painel do Neon (https://neon.tech)
   - Acesse seu projeto
   - Em "Settings" → "IP Allow List"
   - Adicione: `0.0.0.0/0` (permite todos os IPs) OU
   - Peça o IP da Discloud e adicione especificamente

3. **Senha incorreta**
   - Verifique se a senha na DATABASE_URL está correta
   - Se necessário, redefina a senha no Neon e atualize a variável

### Problema 3: Aplicação inicia mas dá erro depois

**Verifique:**
- Os logs para ver qual erro específico está acontecendo
- Se todas as tabelas foram criadas no banco
- Se o banco Neon está online e funcionando

### Problema 4: Erro de SSL

```
Error: self signed certificate
```

**Solução:**
Certifique-se de que sua DATABASE_URL tem no final:
```
?sslmode=require
```

## 📝 Checklist Final

Antes de considerar o deploy completo, verifique:

- [ ] DATABASE_URL configurada na Discloud
- [ ] NODE_ENV=production configurado
- [ ] PORT=5000 configurado
- [ ] Aplicação reiniciada na Discloud
- [ ] Logs mostram "PostgreSQL conectado com sucesso"
- [ ] Logs mostram "Servidor rodando"
- [ ] Você consegue acessar a aplicação pelo link da Discloud

## 🔒 Segurança

### ⚠️ NUNCA faça isso:

1. ❌ Compartilhar sua DATABASE_URL publicamente
2. ❌ Colocar senhas no código
3. ❌ Fazer commit de arquivos .env no GitHub
4. ❌ Usar a mesma senha em vários lugares

### ✅ SEMPRE faça isso:

1. ✅ Use variáveis de ambiente (Secrets no Replit, Config na Discloud)
2. ✅ Use senhas fortes e únicas
3. ✅ Ative 2FA no Neon se possível
4. ✅ Configure IP Allow List no Neon quando em produção

## 📞 Próximos Passos se Ainda Não Funcionar

Se mesmo seguindo todos os passos ainda não funcionar:

1. **Copie os logs completos da Discloud**
2. **Verifique se o banco Neon está online** (vá no painel do Neon)
3. **Teste a conexão localmente:**
   ```bash
   # No seu computador
   export DATABASE_URL="postgresql://..."
   npm run start
   ```
4. **Entre em contato com o suporte da Discloud** se for um problema da plataforma

## ✨ Dicas Extras

1. **Monitoramento:**
   - Configure alertas no Neon para uso de recursos
   - Monitore os logs da Discloud regularmente

2. **Backup:**
   - O Neon faz backups automáticos
   - Verifique a política de backups do seu plano

3. **Performance:**
   - Use pooling de conexões (já configurado)
   - Monitore o uso de recursos na Discloud

---

**🎉 Tudo Pronto!**

Se seguir este guia passo-a-passo, sua aplicação deve funcionar perfeitamente na Discloud!

Qualquer dúvida, verifique os logs primeiro - eles sempre mostram o que está acontecendo.
