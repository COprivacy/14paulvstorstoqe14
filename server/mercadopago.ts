import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

interface MercadoPagoConfigParams {
  accessToken: string;
}

interface MercadoPagoCustomer {
  name: string;
  email: string;
  identification?: {
    type: string;
    number: string;
  };
}

interface MercadoPagoPreferenceItem {
  title: string;
  quantity: number;
  unit_price: number;
  currency_id?: string;
  description?: string;
}

interface MercadoPagoPreferenceParams {
  items: MercadoPagoPreferenceItem[];
  payer: {
    email: string;
    name?: string;
    identification?: {
      type: string;
      number: string;
    };
  };
  back_urls?: {
    success?: string;
    failure?: string;
    pending?: string;
  };
  auto_return?: string;
  external_reference?: string;
  notification_url?: string;
}

export class MercadoPagoService {
  private client: MercadoPagoConfig;
  private preferenceClient: Preference;
  private paymentClient: Payment;

  constructor(config: MercadoPagoConfigParams) {
    this.client = new MercadoPagoConfig({
      accessToken: config.accessToken,
      options: {
        timeout: 5000,
      }
    });

    this.preferenceClient = new Preference(this.client);
    this.paymentClient = new Payment(this.client);
  }

  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const accessToken = this.client.options.accessToken;
      const isTestToken = accessToken?.startsWith('TEST-');
      
      // Usa o endpoint payment_methods que requer apenas permissões básicas
      // Este é o mesmo endpoint usado no teste do painel-publico
      const response = await fetch('https://api.mercadopago.com/v1/payment_methods', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        if (response.status === 401) {
          return {
            success: false,
            message: isTestToken 
              ? 'Token de teste inválido. Verifique se copiou corretamente as credenciais de teste.' 
              : 'Access Token inválido. Verifique suas credenciais no painel do Mercado Pago.'
          };
        }

        if (response.status === 403) {
          return {
            success: false,
            message: isTestToken
              ? 'Token de teste sem permissões. Use credenciais de teste válidas do painel do Mercado Pago.'
              : 'Access Token sem permissões necessárias. Gere um novo token com permissões completas.'
          };
        }

        return {
          success: false,
          message: errorData.message || `Erro HTTP ${response.status}`
        };
      }

      return {
        success: true,
        message: isTestToken 
          ? '✅ Conexão estabelecida com sucesso! (Credenciais de TESTE)' 
          : '✅ Conexão estabelecida com sucesso! (Credenciais de PRODUÇÃO)'
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Erro de conexão: ${error.message}`
      };
    }
  }

  async createPreference(params: MercadoPagoPreferenceParams) {
    try {
      let baseUrl = '';

      if (process.env.APP_URL) {
        baseUrl = process.env.APP_URL.replace(/\/$/, '');
      } else if (process.env.REPLIT_DEV_DOMAIN) {
        baseUrl = `https://${process.env.REPLIT_DEV_DOMAIN}`;
      } else if (process.env.REPLIT_DOMAINS) {
        const domains = process.env.REPLIT_DOMAINS.split(',');
        if (domains.length > 0 && domains[0]) {
          baseUrl = `https://${domains[0].trim()}`;
        }
      }

      if (!baseUrl) {
        baseUrl = 'https://localhost:5000';
      }

      const successUrl = params.back_urls?.success || `${baseUrl}/planos?status=success`;
      const failureUrl = params.back_urls?.failure || `${baseUrl}/planos?status=failure`;
      const pendingUrl = params.back_urls?.pending || `${baseUrl}/planos?status=pending`;

      const body: any = {
        items: params.items,
        payer: params.payer,
        back_urls: {
          success: successUrl,
          failure: failureUrl,
          pending: pendingUrl,
        },
        external_reference: params.external_reference,
      };

      if (successUrl.startsWith('https://') && !successUrl.includes('localhost')) {
        body.auto_return = params.auto_return || 'approved';
      }

      if (params.notification_url) {
        body.notification_url = params.notification_url;
      }

      const result = await this.preferenceClient.create({ body });
      return result;
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao criar preferência de pagamento');
    }
  }

  async getPayment(paymentId: string) {
    try {
      const result = await this.paymentClient.get({ id: paymentId });
      return result;
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao buscar pagamento');
    }
  }

  async searchPayments(params?: { external_reference?: string; limit?: number }) {
    try {
      const result = await this.paymentClient.search({
        options: {
          external_reference: params?.external_reference,
          limit: params?.limit || 10,
        }
      });
      return result;
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao buscar pagamentos');
    }
  }
}

export type { 
  MercadoPagoConfigParams, 
  MercadoPagoCustomer, 
  MercadoPagoPreferenceItem,
  MercadoPagoPreferenceParams
};