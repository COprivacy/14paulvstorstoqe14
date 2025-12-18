# 🔧 Setup Técnico - PAVISOFT SISTEMAS

Guia técnico para DevOps/Administradores.

---

## 🚀 Deploy em Produção

### **Pré-requisitos**
- Node.js 18+
- PostgreSQL 14+
- Conta Replit ou servidor Linux
- Domínio + SSL

### **Variáveis de Ambiente**

Crie arquivo `.env.production`:

```env
# Database
DATABASE_URL=postgresql://user:pass@db.host:5432/pavisoft

# Server
NODE_ENV=production
PORT=5000

# Focus NFe (opcional, cliente configura)
FOCUS_NFCE_API_URL=https://focusnfe.com.br/api/v2

# Mercado Pago (para assinaturas, opcional)
MP_PUBLIC_KEY=APP_USR_...
MP_ACCESS_TOKEN=...

# Encryption
ENCRYPTION_KEY=seu_secret_key_32_bytes_aqui

# CORS
ALLOWED_ORIGINS=https://sua-domain.com.br

# Email (para reset senha)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-app

# Session
SESSION_SECRET=seu-secret-key-aqui
```

### **Deploy (Replit)**

1. **Importar projeto**
   ```bash
   git clone https://github.com/seuuser/pavisoft.git
   cd pavisoft
   ```

2. **Instalar deps**
   ```bash
   npm install
   ```

3. **Setup banco de dados**
   ```bash
   npm run db:push
   ```

4. **Build**
   ```bash
   npm run build
   ```

5. **Start**
   ```bash
   npm run start
   ```

---

## 📊 Monitoramento

### **Verificar Status**
```bash
curl https://sua-domain/api/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "database": "connected",
  "uptime": 3600
}
```

### **Logs**
- Frontend: Browser Console
- Backend: `/var/log/pavisoft.log`

### **Problemas Comuns**

| Problema | Solução |
|----------|---------|
| Erro 500 | Verificar logs do servidor |
| Banco offline | Testar `npm run db:test` |
| Sessão expirada | Limpar localStorage do cliente |
| NF-e falhando | Verificar credenciais Focus NFe |
| Pagamento duplicado | Verificar webhook do Mercado Pago |

---

## 🔐 Segurança

### **Checklist**
- ✅ SSL/HTTPS habilitado
- ✅ Variáveis sensíveis em `.env`
- ✅ Database backup automático
- ✅ Rate limiting ativado
- ✅ CORS configurado
- ✅ Senhas com bcrypt (✅ já feito)
- ✅ Session token encriptado (✅ já feito)

### **Backup Automático**
```bash
# Script para backup diário
0 2 * * * pg_dump $DATABASE_URL > /backup/pavisoft-$(date +%Y%m%d).sql
```

---

## 📈 Performance

### **Otimizações Já Implementadas**
- ✅ Cache control (no-store)
- ✅ Compression gzip
- ✅ Session management
- ✅ Query optimization
- ✅ Rate limiting

### **Monitorar**
```bash
# Queries lentas (> 1s)
npm run db:slow-queries

# Uso de memória
free -h

# Conexões DB
psql -c "SELECT count(*) FROM pg_stat_activity;"
```

---

## 🐛 Troubleshooting

### **App não inicia**
```bash
npm run clean
npm install
npm run build
npm run start
```

### **Banco desconectado**
```bash
# Testar conexão
npm run db:test

# Rebuild schema
npm run db:push --force
```

### **Webhook Mercado Pago falhando**
- Verificar URL no dashboard Mercado Pago
- Verificar logs: `grep WEBHOOK /var/log/pavisoft.log`
- Testar webhook manualmente: `curl -X POST https://sua-domain/api/webhook/mercadopago`

---

## 📞 Suporte Técnico

- **Documentação:** https://docs.pavisoft.com.br
- **Issues GitHub:** https://github.com/pavisoft/issues
- **Email:** tech-support@pavisoft.com.br

---

**Última atualização:** 18/12/2024
