# ✅ Solução para o Erro "Cannot find module '/home/node/dist/index.js'"

## 🔍 O que aconteceu?

O Discloud estava tentando executar `dist/index.js`, mas esse arquivo não existia porque:
1. O build não foi incluído no ZIP
2. O comando BUILD estava falhando no servidor do Discloud

## ✅ Como foi resolvido?

Mudei a abordagem para **executar o TypeScript diretamente** usando `tsx`, eliminando a necessidade de build compilado.

### Mudanças feitas:

1. **discloud.config atualizado:**
```ini
MAIN=server/index.ts          # Antes: dist/index.js
START=npx tsx server/index.ts # Executa TypeScript diretamente (sem PORT no comando)
BUILD=npm install             # Antes: npm install && npm run build
```

2. **Variável de ambiente PORT:**
```
PORT=8080  # Configure no painel do Discloud (NÃO no comando START)
```

2. **Arquivos a incluir no ZIP mudaram:**
- ✅ INCLUIR: `server/`, `client/`, `shared/` (código fonte TypeScript)
- ❌ NÃO incluir: `dist/` (não é mais necessário)

## 🚀 Como fazer deploy agora

### Passo 1: Criar o ZIP correto

**Opção A - Usar o script automático (RECOMENDADO):**
```bash
create-deploy-zip.bat
```

**Opção B - Manualmente (Windows PowerShell):**
```powershell
Compress-Archive -Path discloud.config,package.json,package-lock.json,server,client,shared,migrations,drizzle.config.ts,tsconfig.json,vite.config.ts,postcss.config.js,tailwind.config.ts,components.json -DestinationPath pavisoft-deploy.zip -Force
```

### Passo 2: Fazer upload no Discloud

1. Acesse: https://discloud.app
2. Faça login
3. Clique em "Upload"
4. Selecione: **pavisoft-deploy.zip**

### Passo 3: Configurar variáveis de ambiente

No painel do Discloud, adicione:
```env
PORT=8080
DATABASE_URL=sua_url_postgresql_aqui
NODE_ENV=production
GMAIL_USER=seu_email_smtp
GMAIL_APP_PASSWORD=sua_senha_app
MERCADOPAGO_ACCESS_TOKEN=seu_token
ASAAS_API_KEY=sua_chave
```

⚠️ **CRÍTICO:** A variável `PORT=8080` DEVE estar nas variáveis de ambiente, NÃO no comando START!

## ⚠️ IMPORTANTE

### O que DEVE estar no ZIP:
- ✅ `discloud.config`
- ✅ `package.json` e `package-lock.json`
- ✅ Pasta `server/` (TypeScript)
- ✅ Pasta `client/` (React)
- ✅ Pasta `shared/` (schemas)
- ✅ Arquivos de configuração (tsconfig, vite.config, etc)

### O que NÃO deve estar no ZIP:
- ❌ `node_modules/` (será instalado automaticamente)
- ❌ `dist/` (não é mais necessário)
- ❌ `.git/` (histórico git)
- ❌ `.env` (use variáveis de ambiente do Discloud)

## 🎯 Diferenças da abordagem anterior

| Aspecto | ANTES (❌ com erro) | AGORA (✅ correto) |
|---------|---------------------|-------------------|
| Arquivo principal | `dist/index.js` | `server/index.ts` |
| Comando START | `node dist/index.js` | `npx tsx server/index.ts` |
| Variável PORT | No comando START | Nas variáveis de ambiente |
| Build necessário? | Sim (`npm run build`) | Não |
| Incluir `dist/`? | Sim | Não |
| Incluir `server/`? | Opcional | Obrigatório |

## ⚠️ Erros Comuns e Soluções

### Erro 1: "Cannot find module '/home/node/dist/index.js'"
**Causa:** Tentando executar arquivo compilado que não existe  
**Solução:** Use `tsx` para executar TypeScript diretamente

### Erro 2: "Cannot find module '/home/node/PORT=8080'"
**Causa:** Variável PORT definida no comando START  
**Solução:** Mova `PORT=8080` para as variáveis de ambiente do painel

## 🔧 Por que essa solução funciona?

1. **tsx** é um executor TypeScript que compila e executa em tempo real
2. Elimina problemas de build falhando no servidor
3. Código fonte é enviado diretamente (mais simples)
4. O Vite faz o build do frontend automaticamente quando necessário

## 📚 Documentação completa

Para mais detalhes, consulte: **DEPLOY_DISCLOUD.md**
