# ⚡ CONFIGURAÇÃO RÁPIDA - DISCLOUD

## 🎯 3 Passos para Resolver

### 1️⃣ Acesse o Painel da Discloud
- Entre em https://discloud.app
- Clique no seu aplicativo

### 2️⃣ Adicione Estas 3 Variáveis

**Vá em "Environment Variables" e adicione:**

| Nome | Valor |
|------|-------|
| `DATABASE_URL` | `postgresql://neondb_owner:SUA_SENHA@ep-soft-river-acq795zw-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require` |
| `NODE_ENV` | `production` |
| `PORT` | `5000` |

⚠️ **Troque `SUA_SENHA` pela sua senha real do Neon!**

### 3️⃣ Reinicie o App
- Clique em "Restart" ou "Reiniciar"
- Aguarde 1 minuto
- Veja os logs

## ✅ Como Saber se Funcionou

**Nos logs da Discloud você deve ver:**
```
🔌 Conectando ao PostgreSQL...
✅ PostgreSQL conectado com sucesso
🚀 Servidor rodando em http://0.0.0.0:5000
```

**Se ainda aparecer:**
```
❌ ERRO: Variável de ambiente DATABASE_URL não está configurada!
```
→ A variável não foi salva corretamente. Tente novamente.

## 🆘 Ainda Não Funciona?

### Problema Comum: IP Bloqueado no Neon

1. Vá em https://neon.tech
2. Acesse seu projeto
3. Settings → IP Allow List
4. Adicione: `0.0.0.0/0`
5. Salve
6. Reinicie na Discloud

---

**É só isso!** Se configurar essas 3 variáveis, deve funcionar. 🚀
