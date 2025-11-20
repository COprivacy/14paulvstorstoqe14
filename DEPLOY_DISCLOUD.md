# 🚀 Guia de Deploy no Discloud

## 📋 Pré-requisitos

1. **Conta Platinum no Discloud** (websites requerem plano Platinum)
2. **RAM mínima**: 512MB para sites
3. **Node.js**: versão 16 ou superior

## 🔧 Passos para Deploy

### 1. Preparar o código fonte

**NÃO É NECESSÁRIO fazer build!** O Discloud executará o TypeScript diretamente usando `tsx`.

### 2. Criar o arquivo .zip para upload

Crie um arquivo .zip contendo:

✅ **INCLUIR:**
- `discloud.config` (na raiz)
- `package.json`
- `package-lock.json`
- Pasta `server/` (código TypeScript)
- Pasta `client/` (código React)
- Pasta `shared/` (schemas compartilhados)
- Pasta `migrations/` (se existir)
- `drizzle.config.ts`
- `tsconfig.json`
- `vite.config.ts`
- `postcss.config.js`
- `tailwind.config.ts`
- `components.json`

❌ **NÃO INCLUIR:**
- `node_modules/`
- `.git/`
- `dist/` (será gerado automaticamente)
- `.env` (use variáveis de ambiente do Discloud)
- Arquivos de desenvolvimento (`.local/`, `docs/`, etc)

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
MAIN=server/index.ts
NAME=Pavisoft Sistemas
RAM=512
AUTORESTART=true
APT=tools
VERSION=latest
START=PORT=8080 npx tsx server/index.ts
BUILD=npm install
```

### Explicação dos campos:

- **ID**: Subdomínio personalizado (pavisoftsistemas.discloud.app)
- **TYPE**: `site` para aplicações web
- **MAIN**: Arquivo principal TypeScript (`server/index.ts`)
- **RAM**: Memória alocada (mínimo 512MB para sites)
- **AUTORESTART**: Reiniciar automaticamente em caso de erro
- **APT**: Pacotes do sistema necessários
- **VERSION**: Versão do Node.js (`latest` para a mais recente)
- **START**: Comando de início usando `tsx` para executar TypeScript diretamente
- **BUILD**: Instalar dependências (o build do Vite acontece automaticamente no servidor)

## ⚠️ Troubleshooting

### Erro: "Cannot find module 'server/index.ts'"
- **Causa**: Pasta `server/` não foi incluída no zip
- **Solução**: Certifique-se de incluir as pastas `server/`, `client/` e `shared/` no zip

### Erro: "Cannot find module"
- **Causa**: Dependências não instaladas ou `package.json` ausente
- **Solução**: Certifique-se que `package.json` está no zip e o BUILD está correto

### Site não carrega
- **Causa**: Porta incorreta
- **Solução**: Verifique se está usando `PORT=8080` no comando START

### Erro de conexão com banco
- **Causa**: Variáveis de ambiente não configuradas
- **Solução**: Configure `DATABASE_URL` no painel do Discloud

### Erro: "tsx not found"
- **Causa**: Dependência `tsx` não instalada
- **Solução**: Verifique se `tsx` está listado em `package.json` (devDependencies)

## 📝 Comandos Úteis

```bash
# Testar localmente antes do deploy
npm run dev

# Criar zip (Linux/Mac)
zip -r pavisoft-deploy.zip discloud.config package.json package-lock.json server/ client/ shared/ migrations/ drizzle.config.ts tsconfig.json vite.config.ts postcss.config.js tailwind.config.ts components.json -x "*.git*" "*/node_modules/*" "*.env*"

# Criar zip (Windows PowerShell)
Compress-Archive -Path discloud.config,package.json,package-lock.json,server,client,shared,migrations,drizzle.config.ts,tsconfig.json,vite.config.ts,postcss.config.js,tailwind.config.ts,components.json -DestinationPath pavisoft-deploy.zip -Force
```

## 🎯 Checklist Final

Antes de fazer upload, verifique:

- [ ] `discloud.config` está correto
- [ ] `package.json` incluído no zip
- [ ] Pastas `server/`, `client/` e `shared/` incluídas no zip
- [ ] `node_modules` NÃO incluído no zip
- [ ] `dist/` NÃO incluído no zip (será gerado automaticamente)
- [ ] Variáveis de ambiente configuradas no painel
- [ ] RAM configurada para pelo menos 512MB
- [ ] Plano Platinum ativo (requerido para sites)

## 🌐 Acesso

Após deploy bem-sucedido, seu site estará disponível em:
- **URL**: https://pavisoftsistemas.discloud.app

## 📚 Documentação Oficial

- https://docs.discloud.com
- https://docs.discloudbot.com/v/en/discloud.config
