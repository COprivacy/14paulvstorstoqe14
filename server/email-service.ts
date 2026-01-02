import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

const logger = {
  warn: (message: string, context: string, data?: any) => console.warn(`[${context}] ${message}`, data),
  info: (message: string, context: string, data?: any) => console.info(`[${context}] ${message}`, data),
  error: (message: string, context: string, data?: any) => console.error(`[${context}] ${message}`, data),
};

function formatCurrency(value: number | string | null | undefined): string {
  if (value === null || value === undefined) {
    return '0,00';
  }
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) {
    return '0,00';
  }
  return numValue.toFixed(2).replace('.', ',');
}

interface EmailConfig {
  from: string;
  to: string;
  subject: string;
  html: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter;
  private logoBase64: string;

  constructor() {
    const logoPath = path.join(process.cwd(), 'attached_assets', 'generated_images', 'Pavisoft_Sistemas_email_header_logo_bee66462.png');
    try {
      const logoBuffer = fs.readFileSync(logoPath);
      this.logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
    } catch (error) {
      this.logoBase64 = '';
    }

    const smtpPassword = process.env.SMTP_PASSWORD || process.env.SMTP_PASS || '';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587');
    const useSSL = smtpPort === 465;
    
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: smtpPort,
      secure: useSSL,
      auth: {
        user: process.env.SMTP_USER || '',
        pass: smtpPassword,
      },
      connectionTimeout: 10000,
      greetingTimeout: 5000,
      socketTimeout: 10000,
      pool: true,
      maxConnections: 5,
      rateDelta: 20000,
      rateLimit: 5,
      requireTLS: !useSSL,
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === 'production'
      }
    });

    this.transporter.verify((error, success) => {
      if (error) {
        logger.warn('SMTP não configurado', 'EMAIL_SERVICE', { error: error.message });
      } else {
        logger.info('SMTP configurado com sucesso', 'EMAIL_SERVICE');
      }
    });
  }

  private getBaseTemplate(content: string, backgroundColor: string = '#f8fafc'): string {
    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pavisoft Sistemas</title>
</head>
<body style="margin: 0; padding: 0; font-family: sans-serif; background-color: ${backgroundColor};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: ${backgroundColor}; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden;">
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 48px 40px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0;">PAVISOFT</h1>
            </td>
          </tr>
          ${content}
          <tr>
            <td style="background: #f8fafc; padding: 40px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; font-size: 13px;">Pavisoft Sistemas - www.pavisoft.com.br</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  }

  private async sendMailSafely(mailOptions: any) {
    try {
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error: any) {
      logger.error('Falha ao enviar email', 'EMAIL_SERVICE', { error: error.message });
      return false;
    }
  }

  async sendCustomEmail(config: { to: string; subject: string; content: string }) {
    const formattedContent = config.content.includes('<') ? config.content : config.content.replace(/\n/g, '<br>');
    const content = `<tr><td style="padding: 48px 40px;"><div style="color: #334155; font-size: 16px; line-height: 1.7;">${formattedContent}</div></td></tr>`;
    return await this.sendMailSafely({
      from: process.env.SMTP_FROM || 'Pavisoft Sistemas <noreply@pavisoft.com>',
      to: config.to,
      subject: config.subject,
      html: this.getBaseTemplate(content),
    });
  }

  async sendPasswordResetCode(config: { to: string; userName: string; code: string }) {
    const content = `<tr><td style="padding: 48px 40px;"><h2>Olá, ${config.userName}</h2><p>Código: ${config.code}</p></td></tr>`;
    return await this.sendMailSafely({
      from: process.env.SMTP_FROM || 'Pavisoft Sistemas <noreply@pavisoft.com>',
      to: config.to,
      subject: '🔐 Código de Recuperação de Senha',
      html: this.getBaseTemplate(content),
    });
  }
}

export const emailService = new EmailService();
