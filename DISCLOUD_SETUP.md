# 🚀 Configuração do PAVISOFT na Discloud

## ❌ Problema Identificado

O erro que você está enfrentando acontece porque a variável de ambiente `DATABASE_URL` não está configurada na discloud. O código agora mostra uma mensagem clara quando isso acontece.

## ✅ Solução: Configure as Variáveis de Ambiente

### 1. Configure a DATABASE_URL

Na discloud, você precisa adicionar as seguintes variáveis de ambiente:

**Variável obrigatória:**
- `DATABASE_URL` - String de conexão do PostgreSQL

**Formato da DATABASE_URL:**
```
postgresql://usuario:senha@host:porta/database
```

**Exemplo real (Neon):**
```
postgresql://neondb_owner:senha123@ep-cool-cloud-12345.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### 2. Outras Variáveis de Ambiente Importantes

Configure também estas variáveis na discloud:

```env
# Banco de dados (OBRIGATÓRIO)
DATABASE_URL=postgresql://usuario:senha@host/database

# Configuração do servidor
NODE_ENV=production
PORT=5000

# Email (Opcional - para notificações)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASSWORD=sua-senha-de-app

# MercadoPago (Opcional - se usar pagamentos)
MERCADOPAGO_ACCESS_TOKEN=seu-token-do-mercadopago
```

### 3. Como Adicionar Variáveis na Discloud

1. Acesse o painel da discloud
2. Vá até seu aplicativo
3. Clique em "Configurações" ou "Environment Variables"
4. Adicione cada variável no formato: `NOME_VARIAVEL=valor`
5. Salve as alterações
6. Reinicie o aplicativo

### 4. Verificação do Banco de Dados

Certifique-se de que:

- ✅ Você tem um banco PostgreSQL ativo (Neon, Supabase, Railway, etc.)
- ✅ A string de conexão está correta
- ✅ O banco permite conexões externas
- ✅ O SSL está configurado corretamente (adicione `?sslmode=require` no final da URL se necessário)

### 5. Testando Localmente Antes de Enviar

Antes de fazer o deploy na discloud, teste localmente:

```bash
# 1. Configure a variável no terminal (Linux/Mac)
export DATABASE_URL="postgresql://usuario:senha@host/database"

# Ou no Windows (PowerShell)
$env:DATABASE_URL="postgresql://usuario:senha@host/database"

# 2. Execute o projeto
npm run start
```

Se funcionar localmente, funcionará na discloud com as variáveis configuradas.

### 6. Comandos Úteis da Discloud

```bash
# Ver logs do aplicativo
discloud logs app <app-id>

# Reiniciar aplicativo
discloud restart <app-id>

# Ver status
discloud status <app-id>
```

## 📝 Arquivo discloud.config

Certifique-se de ter um arquivo `discloud.config` na raiz do projeto:

```
NAME=pavisoft
AVATAR=avatar.png
TYPE=bot
MAIN=server/index.ts
RAM=512
AUTORESTART=true
VERSION=recommended
```

## 🔧 Próximos Passos

1. ✅ Configure a variável `DATABASE_URL` na discloud
2. ✅ Configure outras variáveis importantes (SMTP, MercadoPago, etc.)
3. ✅ Faça commit das alterações do código (o erro agora é mais claro)
4. ✅ Faça deploy na discloud
5. ✅ Verifique os logs para confirmar que está funcionando

## 📞 Suporte

Se continuar com problemas, verifique:
- Os logs da discloud para erros específicos
- Se a string de conexão do banco está correta
- Se o banco PostgreSQL está online e acessível
- Se todas as variáveis de ambiente estão configuradas

---

**Observação:** O código foi atualizado para mostrar uma mensagem de erro clara caso a `DATABASE_URL` não esteja configurada, facilitando o diagnóstico de problemas.
