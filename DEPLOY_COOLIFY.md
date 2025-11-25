
# 🚀 Deploy no Coolify - Guia Passo a Passo

## ⚠️ Pré-requisitos

1. **VPS com Coolify instalado**
2. **Repositório Git** (GitHub, GitLab, Bitbucket, etc.)
3. **PostgreSQL** configurado (pode usar Neon, Supabase ou PostgreSQL no Coolify)

## 📋 Passo 1: Preparar o Repositório

Certifique-se que estes arquivos estão no repositório:
- ✅ `docker-compose.yml`
- ✅ `Dockerfile`
- ✅ `.dockerignore`

## 🔧 Passo 2: Criar Aplicação no Coolify

1. **Acesse o Coolify** → Dashboard
2. Clique em **"+ New"** ou **"Add Resource"**
3. Selecione **"Application"**

## 🔗 Passo 3: Conectar Git

1. Escolha **"Public Repository"** ou **"Private Repository"**
2. Cole a URL do seu repositório Git
3. Selecione a branch (geralmente `main` ou `master`)

## 🐳 Passo 4: Configurar Build

1. **Build Pack**: Selecione **"Docker Compose"**
2. **Compose File Path**: Deixe `/docker-compose.yml` (padrão)
3. **Dockerfile Path**: Deixe `/Dockerfile` (padrão)

## 🔐 Passo 5: Configurar Variáveis de Ambiente

Na aba **"Environment Variables"**, adicione:

### **Obrigatórias:**
```
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://usuario:senha@host:5432/database?sslmode=require
MASTER_USER_EMAIL=admin@seudominio.com
MASTER_USER_PASSWORD=SuaSenhaSuperSegura123!
MASTER_ADMIN_PASSWORD=AdminSenhaSegura123!
PUBLIC_ADMIN_PASSWORD=PublicSenhaSegura123!
```

### **Opcionais (Configure depois se necessário):**
```
# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu.email@gmail.com
SMTP_PASSWORD=sua-senha-app
SMTP_FROM=seu.email@gmail.com

# Pagamentos
MERCADOPAGO_ACCESS_TOKEN=seu_token
ASAAS_API_KEY=sua_chave
```

## 🌐 Passo 6: Configurar Domínio e Portas

1. **Port Mapping**: 
   - Container Port: `5000`
   - Public Port: `80` (ou `443` para HTTPS)

2. **Domínio** (opcional):
   - Adicione seu domínio personalizado
   - O Coolify pode configurar SSL automático via Let's Encrypt

## 🚀 Passo 7: Deploy!

1. Clique em **"Deploy"**
2. Aguarde o build (pode levar alguns minutos)
3. Acompanhe os logs em tempo real

## ✅ Passo 8: Verificar Deploy

Após o deploy:
1. Acesse a URL fornecida pelo Coolify
2. Teste o login com as credenciais do `MASTER_USER_EMAIL` e `MASTER_USER_PASSWORD`
3. Verifique se o sistema está funcionando

## 📊 Monitoramento

O Coolify monitora automaticamente:
- ✅ Health checks (via `/api/health`)
- 📈 Uso de CPU e memória
- 📋 Logs em tempo real

## 🔄 Atualizações Futuras

Para atualizar a aplicação:
1. Faça push das mudanças para o Git
2. No Coolify, clique em **"Redeploy"**
3. O Coolify vai fazer pull automático e rebuild

## 🆘 Troubleshooting

### Aplicação não inicia
- ✅ Verifique os logs no Coolify
- ✅ Confirme que todas variáveis de ambiente estão configuradas
- ✅ Teste a `DATABASE_URL` manualmente

### Erro de conexão com banco
- ✅ Verifique se o PostgreSQL está acessível
- ✅ Confirme que a connection string está correta
- ✅ Teste a conexão diretamente

### Porta não acessível
- ✅ Verifique o mapeamento de portas
- ✅ Confirme que o firewall permite tráfego na porta

## 💡 Dicas

1. **Use PostgreSQL externo** (Neon, Supabase) para facilitar backups
2. **Configure SSL/HTTPS** via Coolify para segurança
3. **Monitore os logs** regularmente
4. **Faça backups** do banco de dados periodicamente

## 🔒 Segurança

- 🔐 Use senhas fortes para todas as variáveis
- 🔑 Nunca commite senhas no Git
- 🛡️ Configure SSL/HTTPS sempre que possível
- 📝 Limite acesso às variáveis de ambiente

## 📞 Suporte

Se precisar de ajuda:
- 📚 Documentação do Coolify: https://coolify.io/docs
- 💬 Comunidade Coolify: https://coolify.io/discord
