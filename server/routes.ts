// Usar notification_url fornecido ou gerar padrão
      // Em PRODUÇÃO com domínio próprio, configure esta URL no painel do Mercado Pago:
      // https://seu-dominio.com/api/webhook/mercadopago
      if (params.notification_url) {
        body.notification_url = params.notification_url;
      } else if (process.env.NODE_ENV === 'production' && process.env.PRODUCTION_DOMAIN) {
        // Apenas em produção com domínio configurado
        body.notification_url = `https://${process.env.PRODUCTION_DOMAIN}/api/webhook/mercadopago`;
      }

export { registerRoutes };