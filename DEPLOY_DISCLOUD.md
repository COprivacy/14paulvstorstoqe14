# 🚀 Guia de Deploy no Discloud

## 📋 Pré-requisitos

1. **Conta Platinum no Discloud** (websites requerem plano Platinum)
2. **RAM mínima**: 512MB para sites
3. **Node.js**: versão 16 ou superior

## 🔧 Passos para Deploy

### 1. Fazer Build da Aplicação

Antes de fazer o upload, você PRECISA fazer o build localmente:

```bash
npm install
npm run build
```

Isso criará a pasta `dist/` com os arquivos compilados.

### 2. Criar o arquivo .zip para upload

Crie um arquivo .zip contendo:

✅ **INCLUIR:**
- `discloud.config` (na raiz)
- `package.json`
- `package-lock.json`
- Pasta `dist/` (com o build compilado)
- Pasta `server/` (arquivos TypeScript originais)
- Pasta `shared/` (se existir)
- Pasta `migrations/` (se existir)
- `drizzle.config.ts`
- `tsconfig.json`

❌ **NÃO INCLUIR:**
- `node_modules/`
- `.git/`
- `client/` (já está compilado em dist/)
- `.env` (use variáveis de ambiente do Discloud)
- Arquivos de desenvolvimento

### 3. Configurar Variáveis de Ambiente no Discloud

No painel do Discloud, configure as seguintes variáveis:

```env
DATABASE_URL=seu_url_postgresql_aqui
NODE_ENV=production
GMAIL_USER=seu_email_smtp
GMAIL_APP_PASSWORD=sua_senha_app
MERCADOPAGO_ACCESS_TOKEN=seu_token_aqui
ASAAS_API_KEY=sua_chave_api_aqui
```

### 4. Upload no Discloud

1. Acesse: https://discloud.app
2. Faça login
3. Clique em "Upload"
4. Selecione seu arquivo .zip
5. Aguarde o deploy completar

### 5. Verificar Logs

Após o upload, verifique os logs no painel do Discloud para confirmar que o servidor iniciou corretamente.

## 🔍 Estrutura do discloud.config

```ini
ID=pavisoftsistemas
TYPE=site
MAIN=dist/index.js
NAME=Pavisoft Sistemas
RAM=512
AUTORESTART=true
APT=tools
VERSION=latest
START=PORT=8080 node dist/index.js
BUILD=npm install && npm run build
```

### Explicação dos campos:

- **ID**: Subdomínio personalizado (pavisoftsistemas.discloud.app)
- **TYPE**: `site` para aplicações web
- **MAIN**: Arquivo principal após o build (`dist/index.js`)
- **RAM**: Memória alocada (mínimo 512MB para sites)
- **AUTORESTART**: Reiniciar automaticamente em caso de erro
- **APT**: Pacotes do sistema necessários
- **VERSION**: Versão do Node.js (`latest` para a mais recente)
- **START**: Comando de início (define PORT=8080 para o Discloud)
- **BUILD**: Comando executado durante o deploy

## ⚠️ Troubleshooting

### Erro: "index.js não foi encontrado"
- **Causa**: Build não foi incluído no zip
- **Solução**: Execute `npm run build` antes de criar o zip e inclua a pasta `dist/`

### Erro: "Cannot find module"
- **Causa**: Dependências não instaladas
- **Solução**: Certifique-se que `package.json` está no zip

### Site não carrega
- **Causa**: Porta incorreta
- **Solução**: Verifique se está usando PORT=8080 no comando START

### Erro de conexão com banco
- **Causa**: Variáveis de ambiente não configuradas
- **Solução**: Configure DATABASE_URL no painel do Discloud

## 📝 Comandos Úteis

```bash
# Fazer build local
npm run build

# Verificar se o build funciona
npm run start

# Verificar estrutura do dist/
ls -la dist/

# Criar zip (Linux/Mac)
zip -r pavisoft-deploy.zip discloud.config package.json package-lock.json dist/ server/ shared/ migrations/ drizzle.config.ts tsconfig.json

# Criar zip (Windows PowerShell)
Compress-Archive -Path discloud.config,package.json,package-lock.json,dist,server,shared,migrations,drizzle.config.ts,tsconfig.json -DestinationPath pavisoft-deploy.zip
```

## 🎯 Checklist Final

Antes de fazer upload, verifique:

- [ ] Build executado com sucesso (`npm run build`)
- [ ] Pasta `dist/` existe e contém `index.js`
- [ ] `discloud.config` está correto
- [ ] `package.json` incluído no zip
- [ ] `node_modules` NÃO incluído no zip
- [ ] Variáveis de ambiente configuradas no painel
- [ ] RAM configurada para pelo menos 512MB
- [ ] Plano Platinum ativo (requerido para sites)

## 🌐 Acesso

Após deploy bem-sucedido, seu site estará disponível em:
- **URL**: https://pavisoftsistemas.discloud.app

## 📚 Documentação Oficial

- https://docs.discloud.com
- https://docs.discloudbot.com/v/en/discloud.config
