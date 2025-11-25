
# Deploy no Coolify

## Pré-requisitos

1. VPS com Coolify instalado
2. PostgreSQL configurado (pode usar Neon, Supabase ou PostgreSQL no próprio Coolify)
3. Domínio apontando para seu VPS (opcional, mas recomendado)

## Passos para Deploy

### 1. Criar Novo Projeto no Coolify

1. Acesse seu painel Coolify
2. Clique em "New Resource" → "Application"
3. Escolha "Docker Compose" como tipo
4. Cole a URL do seu repositório Git ou faça upload dos arquivos

### 2. Configurar Variáveis de Ambiente

No painel do Coolify, adicione as seguintes variáveis:

**Obrigatórias:**
```
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://usuario:senha@host/database?sslmode=require
MASTER_USER_EMAIL=admin@seudominio.com
MASTER_USER_PASSWORD=SenhaSuperSegura123!
MASTER_ADMIN_PASSWORD=AdminSenha123!
PUBLIC_ADMIN_PASSWORD=PublicSenha123!
```

**Opcionais (Email):**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu.email@gmail.com
SMTP_PASSWORD=sua-senha-app
SMTP_FROM=seu.email@gmail.com
```

**Opcionais (Pagamentos):**
```
MERCADOPAGO_ACCESS_TOKEN=seu_token_mercadopago
ASAAS_API_KEY=sua_chave_asaas
```

### 3. Configurar Porta

No Coolify, configure:
- **Container Port**: 5000
- **Public Port**: 80 (ou 443 se usar SSL)

### 4. Deploy

1. Clique em "Deploy"
2. Aguarde o build e deployment
3. Acesse sua aplicação pelo domínio configurado

## Banco de Dados PostgreSQL

### Opção 1: PostgreSQL no Coolify
1. Crie um serviço PostgreSQL no Coolify
2. Use a URL interna: `postgresql://usuario:senha@postgres:5432/database`

### Opção 2: PostgreSQL Externo (Neon, Supabase)
1. Crie um banco em Neon ou Supabase
2. Use a connection string fornecida
3. Certifique-se de adicionar `?sslmode=require` ao final da URL

## Health Check

A aplicação expõe um endpoint de saúde em `/api/health` que o Coolify pode usar para monitoramento.

## Logs

Acesse os logs diretamente no painel do Coolify para debug e monitoramento.

## SSL/HTTPS

O Coolify pode configurar SSL automaticamente via Let's Encrypt se você tiver um domínio configurado.

## Backup

Configure backups regulares do PostgreSQL através do Coolify ou use a funcionalidade de backup automático do Neon.

## Troubleshooting

### Aplicação não inicia
- Verifique se todas as variáveis de ambiente estão configuradas
- Confira os logs no Coolify
- Certifique-se que a DATABASE_URL está correta

### Erro de conexão com banco
- Verifique se o PostgreSQL está rodando
- Teste a connection string manualmente
- Confira se as credenciais estão corretas

### Porta não acessível
- Verifique se a porta 5000 está exposta no Dockerfile
- Confira o mapeamento de portas no docker-compose.yml
- Certifique-se que o firewall permite tráfego na porta configurada
