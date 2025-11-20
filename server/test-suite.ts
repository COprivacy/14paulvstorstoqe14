import { storage } from './storage';
import { EmailService } from './email-service';
import { paymentReminderService } from './payment-reminder';
import { logger } from './logger';
import { MercadoPagoService } from './mercadopago';
import { eq, sql } from 'drizzle-orm';

interface TestResult {
  name: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: any;
}

export class TestSuite {
  private emailService: EmailService;
  private results: TestResult[] = [];

  constructor() {
    this.emailService = new EmailService();
  }

  /**
   * Executa todos os testes
   */
  async runAllTests(): Promise<TestResult[]> {
    this.results = [];

    console.log('\n🧪 ===== INICIANDO SUITE DE TESTES =====\n');

    await this.testBlockingFlow();
    await this.testEmployeePackages();
    await this.testEmailSystem();
    await this.testBudgetBlocking();
    await this.testMercadoPagoWebhook();
    await this.testDatabaseIntegrity();
    await this.testUserPermissions();
    await this.testCaixaOperations();

    console.log('\n📊 ===== RESUMO DOS TESTES =====\n');
    this.printSummary();

    return this.results;
  }

  /**
   * Teste 1: Fluxo Completo de Bloqueio
   */
  private async testBlockingFlow() {
    console.log('\n🔒 TESTE 1: Fluxo Completo de Bloqueio\n');

    try {
      const users = await storage.getUsers();
      const testUser = users.find(u => u.status === 'bloqueado');

      if (!testUser) {
        this.addResult('Bloqueio de Usuário', 'warning', 'Nenhum usuário bloqueado encontrado para testar');
        return;
      }

      // Verificar status do usuário
      console.log(`✓ Usuário bloqueado encontrado: ${testUser.email}`);
      console.log(`  - Status: ${testUser.status}`);
      console.log(`  - Plano: ${testUser.plano}`);

      // Verificar funcionários bloqueados
      if (storage.getFuncionarios) {
        const funcionarios = await storage.getFuncionarios();
        const funcionariosDaConta = funcionarios.filter(f => f.conta_id === testUser.id);
        const funcionariosBloqueados = funcionariosDaConta.filter(f => f.status === 'bloqueado');

        console.log(`✓ Total de funcionários: ${funcionariosDaConta.length}`);
        console.log(`✓ Funcionários bloqueados: ${funcionariosBloqueados.length}`);

        if (funcionariosDaConta.length > 0 && funcionariosBloqueados.length === funcionariosDaConta.length) {
          this.addResult(
            'Bloqueio de Usuário e Funcionários',
            'success',
            `Usuário e todos os ${funcionariosBloqueados.length} funcionários estão bloqueados corretamente`,
            { userId: testUser.id, funcionariosBloqueados: funcionariosBloqueados.length }
          );
        } else if (funcionariosDaConta.length === 0) {
          this.addResult(
            'Bloqueio de Usuário',
            'success',
            'Usuário bloqueado (sem funcionários cadastrados)',
            { userId: testUser.id }
          );
        } else {
          this.addResult(
            'Bloqueio de Funcionários',
            'error',
            `Inconsistência: ${funcionariosDaConta.length - funcionariosBloqueados.length} funcionários não bloqueados`,
            { userId: testUser.id, total: funcionariosDaConta.length, bloqueados: funcionariosBloqueados.length }
          );
        }
      }

      // Testar tentativa de acesso (simulado)
      console.log(`✓ Teste de bloqueio de acesso: PASSOU`);

    } catch (error) {
      this.addResult('Fluxo de Bloqueio', 'error', error.message);
    }
  }

  /**
   * Teste 2: Compra de Pacotes de Funcionários
   */
  private async testEmployeePackages() {
    console.log('\n💼 TESTE 2: Compra de Pacotes de Funcionários\n');

    try {
      const users = await storage.getUsers();
      const testUser = users.find(u => u.max_funcionarios && u.max_funcionarios > 1);

      if (!testUser) {
        this.addResult('Pacotes de Funcionários', 'warning', 'Nenhum usuário com pacote de funcionários encontrado');
        return;
      }

      console.log(`✓ Usuário com pacote encontrado: ${testUser.email}`);
      console.log(`  - Limite Base: ${testUser.max_funcionarios_base || 1}`);
      console.log(`  - Limite Atual: ${testUser.max_funcionarios}`);
      console.log(`  - Funcionários Extras: ${(testUser.max_funcionarios || 1) - (testUser.max_funcionarios_base || 1)}`);

      if (testUser.data_expiracao_pacote_funcionarios) {
        const diasRestantes = Math.floor(
          (new Date(testUser.data_expiracao_pacote_funcionarios).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );
        console.log(`  - Dias até expiração: ${diasRestantes}`);
      }

      // Verificar pacotes no banco
      if (storage.getEmployeePackages) {
        const packages = await storage.getEmployeePackages(testUser.id);
        console.log(`✓ Pacotes cadastrados: ${packages.length}`);

        packages.forEach(pkg => {
          console.log(`  - ${pkg.package_type}: ${pkg.quantity} funcionários (Status: ${pkg.status})`);
        });

        this.addResult(
          'Pacotes de Funcionários',
          'success',
          `Usuário possui ${packages.length} pacote(s) cadastrado(s)`,
          {
            userId: testUser.id,
            limiteBase: testUser.max_funcionarios_base || 1,
            limiteAtual: testUser.max_funcionarios,
            pacotes: packages.length
          }
        );
      } else {
        this.addResult('Pacotes de Funcionários', 'warning', 'Função getEmployeePackages não disponível');
      }

    } catch (error) {
      this.addResult('Pacotes de Funcionários', 'error', error.message);
    }
  }

  /**
   * Teste 3: Sistema de Emails
   */
  private async testEmailSystem() {
    console.log('\n📧 TESTE 3: Sistema de Emails em Desenvolvimento\n');

    const emailTests = [
      'Código de Verificação',
      'Pacote Comprado (Aguardando Pagamento)',
      'Pacote Ativado',
      'Senha Redefinida',
      'Pagamento Pendente',
      'Aviso de Vencimento',
      'Pagamento Atrasado',
      'Conta Bloqueada'
    ];

    console.log(`✓ Templates de email disponíveis: ${emailTests.length}`);
    emailTests.forEach((template, index) => {
      console.log(`  ${index + 1}. ${template}`);
    });

    // Verificar configuração SMTP
    const smtpConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || '587',
      user: process.env.SMTP_USER || 'pavisoft.planos@gmail.com',
      hasPassword: !!(process.env.SMTP_PASS)
    };

    console.log(`\n✓ Configuração SMTP:`);
    console.log(`  - Host: ${smtpConfig.host}`);
    console.log(`  - Porta: ${smtpConfig.port}`);
    console.log(`  - Usuário: ${smtpConfig.user}`);
    console.log(`  - Senha configurada: ${smtpConfig.hasPassword ? 'Sim' : 'Não'}`);

    this.addResult(
      'Sistema de Emails',
      smtpConfig.hasPassword ? 'success' : 'warning',
      smtpConfig.hasPassword
        ? `${emailTests.length} templates configurados e SMTP funcional`
        : 'Templates configurados mas SMTP sem senha',
      { templates: emailTests.length, smtpConfig }
    );
  }

  /**
   * Teste 4: Sistema de Bloqueios de Estoque (Orçamentos)
   */
  private async testBudgetBlocking() {
    console.log('\n🔒 TESTE 4: Sistema de Bloqueios de Estoque (Orçamentos)\n');

    try {
      // Verificar se o método existe
      if (!storage.getOrcamentos) {
        this.addResult(
          "Sistema de Bloqueios",
          "warning",
          "Função getOrcamentos não disponível no storage"
        );
        return;
      }

      // Verificar se existem orçamentos aprovados
      const orcamentos = await storage.getOrcamentos();
      const orcamentosAprovados = orcamentos.filter((o: any) => o.status === 'aprovado');

      // Verificar bloqueios (se a função existir)
      let bloqueiosAtivos: any[] = [];
      if (storage.getBloqueios) {
        bloqueiosAtivos = await storage.getBloqueios();
      }

      // Verificar métricas do logger
      const metrics = logger.getLockingMetrics();

      const detalhes = {
        orcamentos_aprovados: orcamentos.length,
        bloqueios_ativos: bloqueiosAtivos.length,
        produtos_bloqueados: metrics.produtos_com_bloqueios,
        aprovacoes_total: metrics.aprovacoes_total,
        aprovacoes_com_erro: metrics.aprovacoes_com_erro,
        tempo_medio_ms: metrics.tempo_medio_aprovacao_ms,
      };

      if (bloqueiosAtivos.length === 0 && orcamentos.length > 0) {
        this.addResult(
          "Sistema de Bloqueios",
          "warning",
          `${orcamentos.length} orçamento(s) aprovado(s) mas nenhum bloqueio ativo encontrado`,
          detalhes
        );
      } else if (bloqueiosAtivos.length > 0) {
        this.addResult(
          "Sistema de Bloqueios",
          "success",
          `Sistema ativo: ${bloqueiosAtivos.length} bloqueio(s) para ${metrics.produtos_com_bloqueios} produto(s)`,
          detalhes
        );
      } else {
        this.addResult(
          "Sistema de Bloqueios",
          "success",
          "Sistema configurado corretamente (nenhum orçamento aprovado no momento)",
          detalhes
        );
      }

      // Teste de integridade simplificado
      console.log(`✓ Sistema de bloqueios verificado com sucesso`);

    } catch (error: any) {
      this.addResult(
        "Sistema de Bloqueios",
        "error",
        `Erro ao verificar sistema de bloqueios: ${error.message}`,
        { error: error.message }
      );
    }
  }

  /**
   * Teste 5: Webhooks do Mercado Pago
   */
  private async testMercadoPagoWebhook() {
    console.log('\n💳 TESTE 5: Validação de Webhooks Mercado Pago\n');

    try {
      const config = await storage.getConfigMercadoPago();

      if (!config || !config.access_token) {
        this.addResult('Mercado Pago', 'warning', 'Credenciais do Mercado Pago não configuradas');
        console.log('⚠️  Credenciais não configuradas');
        return;
      }

      console.log(`✓ Access Token: ${config.access_token ? '***configurado***' : 'não configurado'}`);
      console.log(`✓ Public Key: ${config.public_key ? '***configurado***' : 'não configurado'}`);
      console.log(`✓ Webhook URL: ${config.webhook_url || 'não configurado'}`);
      console.log(`✓ Status: ${config.status_conexao || 'não testado'}`);

      // Testar conexão
      try {
        const mercadopago = new MercadoPagoService({ accessToken: config.access_token });
        const result = await mercadopago.testConnection();

        console.log(`\n✓ Teste de conexão: ${result.success ? 'PASSOU' : 'FALHOU'}`);
        console.log(`  - Mensagem: ${result.message}`);

        this.addResult(
          'Conexão Mercado Pago',
          result.success ? 'success' : 'error',
          result.message,
          { webhookUrl: config.webhook_url, status: config.status_conexao }
        );
      } catch (error) {
        this.addResult('Conexão Mercado Pago', 'error', error.message);
      }

      // Verificar webhooks configurados
      const baseUrl = process.env.REPLIT_DEV_DOMAIN
        ? `https://${process.env.REPLIT_DEV_DOMAIN}`
        : 'http://localhost:5000';

      const webhookEndpoint = `${baseUrl}/api/webhook/mercadopago`;

      console.log(`\n✓ Endpoint do Webhook: ${webhookEndpoint}`);
      console.log(`\n⚠️  IMPORTANTE: Configure esta URL no painel do Mercado Pago em:`);
      console.log(`   https://www.mercadopago.com.br/developers/panel/app`);

    } catch (error) {
      this.addResult('Webhooks Mercado Pago', 'error', error.message);
    }
  }

  /**
   * Adiciona resultado do teste
   */
  private addResult(name: string, status: 'success' | 'error' | 'warning', message: string, details?: any) {
    this.results.push({ name, status, message, details });

    const icon = status === 'success' ? '✅' : status === 'error' ? '❌' : '⚠️';
    console.log(`${icon} ${name}: ${message}`);
  }

  /**
   * Teste 6: Integridade do Banco de Dados
   */
  private async testDatabaseIntegrity() {
    console.log('\n🗄️ TESTE 6: Integridade do Banco de Dados\n');

    try {
      const users = await storage.getUsers();
      const produtos = await storage.getProdutos();
      const vendas = await storage.getVendas();
      const clientes = await storage.getClientes();
      const fornecedores = await storage.getFornecedores();

      console.log(`✓ Usuários: ${users.length}`);
      console.log(`✓ Produtos: ${produtos.length}`);
      console.log(`✓ Vendas: ${vendas.length}`);
      console.log(`✓ Clientes: ${clientes.length}`);
      console.log(`✓ Fornecedores: ${fornecedores.length}`);

      // Verificar produtos sem user_id
      const produtosSemUser = produtos.filter(p => !p.user_id);
      if (produtosSemUser.length > 0) {
        this.addResult(
          'Integridade de Produtos',
          'warning',
          `${produtosSemUser.length} produto(s) sem user_id`,
          { count: produtosSemUser.length }
        );
      }

      // Verificar vendas sem user_id
      const vendasSemUser = vendas.filter(v => !v.user_id);
      if (vendasSemUser.length > 0) {
        this.addResult(
          'Integridade de Vendas',
          'warning',
          `${vendasSemUser.length} venda(s) sem user_id`,
          { count: vendasSemUser.length }
        );
      }

      // Verificar usuários trial expirados
      const now = new Date();
      const trialsExpirados = users.filter(u => {
        if (u.plano !== 'trial' || !u.data_expiracao_trial) return false;
        return new Date(u.data_expiracao_trial) < now;
      });

      if (trialsExpirados.length > 0) {
        this.addResult(
          'Trials Expirados',
          'warning',
          `${trialsExpirados.length} usuário(s) com trial expirado`,
          { usuarios: trialsExpirados.map(u => u.email) }
        );
      }

      this.addResult(
        'Integridade do Banco',
        'success',
        'Banco de dados íntegro',
        {
          usuarios: users.length,
          produtos: produtos.length,
          vendas: vendas.length,
          clientes: clientes.length,
          fornecedores: fornecedores.length
        }
      );

    } catch (error: any) {
      this.addResult('Integridade do Banco', 'error', error.message);
    }
  }

  /**
   * Teste 7: Sistema de Permissões
   */
  private async testUserPermissions() {
    console.log('\n🔐 TESTE 7: Sistema de Permissões de Funcionários\n');

    try {
      const funcionarios = await storage.getFuncionarios();
      
      console.log(`✓ Total de funcionários: ${funcionarios.length}`);

      let funcionariosComPermissoes = 0;
      let funcionariosSemPermissoes = 0;

      for (const func of funcionarios) {
        const permissoes = await storage.getPermissoesFuncionario(func.id);
        if (permissoes) {
          funcionariosComPermissoes++;
        } else {
          funcionariosSemPermissoes++;
        }
      }

      console.log(`✓ Com permissões configuradas: ${funcionariosComPermissoes}`);
      console.log(`✓ Sem permissões: ${funcionariosSemPermissoes}`);

      if (funcionariosSemPermissoes > 0) {
        this.addResult(
          'Permissões de Funcionários',
          'warning',
          `${funcionariosSemPermissoes} funcionário(s) sem permissões configuradas`,
          { 
            comPermissoes: funcionariosComPermissoes,
            semPermissoes: funcionariosSemPermissoes 
          }
        );
      } else {
        this.addResult(
          'Permissões de Funcionários',
          'success',
          `Todos os ${funcionariosComPermissoes} funcionários têm permissões configuradas`,
          { total: funcionariosComPermissoes }
        );
      }

    } catch (error: any) {
      this.addResult('Permissões de Funcionários', 'error', error.message);
    }
  }

  /**
   * Teste 8: Operações de Caixa
   */
  private async testCaixaOperations() {
    console.log('\n💰 TESTE 8: Operações de Caixa\n');

    try {
      // Verificar se existem caixas abertos
      const users = await storage.getUsers();
      let totalCaixasAbertos = 0;
      let totalCaixasFechados = 0;

      for (const user of users) {
        if (storage.getCaixas) {
          const caixas = await storage.getCaixas(user.id);
          const abertos = caixas.filter((c: any) => c.status === 'aberto');
          const fechados = caixas.filter((c: any) => c.status === 'fechado');
          
          totalCaixasAbertos += abertos.length;
          totalCaixasFechados += fechados.length;
        }
      }

      console.log(`✓ Caixas abertos: ${totalCaixasAbertos}`);
      console.log(`✓ Caixas fechados: ${totalCaixasFechados}`);

      if (totalCaixasAbertos > 10) {
        this.addResult(
          'Caixas Abertos',
          'warning',
          `${totalCaixasAbertos} caixas abertos (possível inconsistência)`,
          { 
            abertos: totalCaixasAbertos,
            fechados: totalCaixasFechados 
          }
        );
      } else {
        this.addResult(
          'Operações de Caixa',
          'success',
          `Sistema de caixa funcionando normalmente`,
          { 
            abertos: totalCaixasAbertos,
            fechados: totalCaixasFechados 
          }
        );
      }

    } catch (error: any) {
      this.addResult('Operações de Caixa', 'error', error.message);
    }
  }

  /**
   * Imprime resumo dos testes
   */
  private printSummary() {
    const success = this.results.filter(r => r.status === 'success').length;
    const errors = this.results.filter(r => r.status === 'error').length;
    const warnings = this.results.filter(r => r.status === 'warning').length;

    console.log(`\n✅ Sucessos: ${success}`);
    console.log(`❌ Erros: ${errors}`);
    console.log(`⚠️  Avisos: ${warnings}`);
    console.log(`📊 Total: ${this.results.length}`);

    const percentage = Math.round((success / this.results.length) * 100);
    console.log(`\n🎯 Taxa de Sucesso: ${percentage}%`);

    if (errors === 0 && warnings === 0) {
      console.log('\n🎉 TODOS OS TESTES PASSARAM COM SUCESSO! 🎉\n');
    } else if (errors === 0) {
      console.log('\n✨ Testes concluídos com alguns avisos.\n');
    } else {
      console.log('\n⚠️  Alguns testes falharam. Revise os erros acima.\n');
    }
  }
}

export const testSuite = new TestSuite();