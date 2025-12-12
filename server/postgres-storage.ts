import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { eq, and, or, gte, lte, lt, desc, sql, inArray, isNull } from 'drizzle-orm';
import {
  users,
  produtos,
  vendas,
  fornecedores,
  clientes,
  compras,
  configFiscal,
  planos,
  configMercadoPago,
  logsAdmin,
  subscriptions,
  funcionarios,
  permissoesFuncionarios,
  contasPagar,
  contasReceber,
  caixas,
  movimentacoesCaixa,
  systemConfig,
  devolucoes,
  orcamentos,
  bloqueiosEstoque,
  clientNotes,
  clientDocuments,
  clientInteractions,
  planChangesHistory,
  clientCommunications,
  cupons,
  usoCupons,
  userCustomization,
  employeePackages,
  type User,
  type InsertUser,
  type Produto,
  type InsertProduto,
  type BloqueioEstoque,
  type InsertBloqueioEstoque,
  type Venda,
  type InsertVenda,
  type Fornecedor,
  type InsertFornecedor,
  type Cliente,
  type InsertCliente,
  type Compra,
  type InsertCompra,
  type ConfigFiscal,
  type InsertConfigFiscal,
  type Plano,
  type InsertPlano,
  type ConfigMercadoPago,
  type InsertConfigMercadoPago,
  type LogAdmin,
  type InsertLogAdmin,
  type Funcionario,
  type InsertFuncionario,
  type PermissaoFuncionario,
  type Subscription,
  type InsertSubscription,
  type Caixa,
  type InsertCaixa,
  type MovimentacaoCaixa,
  type InsertMovimentacaoCaixa,
  type ContasPagar,
  type InsertContasPagar,
  type ContasReceber,
  type InsertContasReceber,
  type Devolucao,
  type InsertDevolucao,


  type Orcamento,
  type InsertOrcamento,
  type ClientNote,
  type InsertClientNote,
  type ClientDocument,
  type InsertClientDocument,
  type ClientInteraction,
  type InsertClientInteraction,
  type PlanChangeHistory,
  type InsertPlanChangeHistory,
  type ClientCommunication,
  type InsertClientCommunication,
  type Cupom,
  type InsertCupom,
  type UsoCupom,
  type InsertUsoCupom,
  type UserCustomization,
  type InsertUserCustomization,
} from '@shared/schema';
import type { IStorage } from './storage';
import { randomUUID } from 'crypto';
import ws from 'ws';
import { logger } from './logger';

// Helper para obter data UTC atual no formato ISO
function getUTCNow(): string {
  return new Date().toISOString();
}

neonConfig.webSocketConstructor = ws;

// Verificar se DATABASE_URL está configurada
if (!process.env.DATABASE_URL) {
  console.error('❌ ERRO: Variável de ambiente DATABASE_URL não está configurada!');
  console.error('📝 Configure a variável DATABASE_URL com a string de conexão do PostgreSQL.');
  console.error('📝 Exemplo: postgresql://usuario:senha@host:porta/database');
  throw new Error('DATABASE_URL não está configurada. Configure esta variável de ambiente antes de continuar.');
}

// Log de debug (sem expor a senha)
const dbUrl = process.env.DATABASE_URL;
const maskedUrl = dbUrl.replace(/:([^@]+)@/, ':****@');
console.log(`🔌 Conectando ao PostgreSQL: ${maskedUrl}`);

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export class PostgresStorage implements IStorage {
  private db;

  constructor() {
    this.db = drizzle(pool);
    console.log('✅ PostgreSQL conectado com sucesso');

    // Testar conexão e seed de dados
    this.testConnection();
    this.seedInitialData();
    this.ensureCuponsTablesExist();
  }

  private async ensureCuponsTablesExist() {
    try {
      // Verificar se a tabela de cupons já existe
      const checkTableQuery = sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'cupons'
        );
      `;

      const result = await this.db.execute(checkTableQuery);
      const tableExists = result.rows[0]?.exists;

      if (!tableExists) {
        console.log('📦 Criando tabelas de cupons...');

        // Criar tabela de cupons
        await this.db.execute(sql`
          CREATE TABLE IF NOT EXISTS cupons (
            id SERIAL PRIMARY KEY,
            codigo TEXT NOT NULL UNIQUE,
            tipo TEXT NOT NULL CHECK (tipo IN ('percentual', 'valor_fixo')),
            valor REAL NOT NULL CHECK (valor > 0),
            planos_aplicaveis JSONB DEFAULT '[]'::jsonb,
            data_inicio TEXT NOT NULL,
            data_expiracao TEXT NOT NULL,
            quantidade_maxima INTEGER,
            quantidade_utilizada INTEGER NOT NULL DEFAULT 0,
            status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'expirado')),
            descricao TEXT,
            criado_por TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            data_criacao TEXT NOT NULL,
            data_atualizacao TEXT
          );
        `);

        // Criar índices
        await this.db.execute(sql`
          CREATE INDEX IF NOT EXISTS cupons_codigo_idx ON cupons(codigo);
        `);

        await this.db.execute(sql`
          CREATE INDEX IF NOT EXISTS cupons_status_idx ON cupons(status);
        `);

        // Criar tabela de uso de cupons
        await this.db.execute(sql`
          CREATE TABLE IF NOT EXISTS uso_cupons (
            id SERIAL PRIMARY KEY,
            cupom_id INTEGER NOT NULL REFERENCES cupons(id) ON DELETE CASCADE,
            user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            subscription_id INTEGER REFERENCES subscriptions(id) ON DELETE SET NULL,
            valor_desconto REAL NOT NULL,
            data_uso TEXT NOT NULL
          );
        `);

        // Criar índices para uso_cupons
        await this.db.execute(sql`
          CREATE INDEX IF NOT EXISTS uso_cupons_cupom_id_idx ON uso_cupons(cupom_id);
        `);

        await this.db.execute(sql`
          CREATE INDEX IF NOT EXISTS uso_cupons_user_id_idx ON uso_cupons(user_id);
        `);

        console.log('✅ Tabelas de cupons criadas com sucesso');
      } else {
        console.log('✅ Tabelas de cupons já existem');
      }
    } catch (error: any) {
      logger.error('[DB] Erro ao criar tabelas de cupons:', {
        error: error.message,
        stack: error.stack
      });
      // Não lançar erro - apenas logar. O sistema pode funcionar sem cupons.
      console.warn('⚠️ Sistema iniciará sem suporte a cupons');
    }
  }

  async getCupons(): Promise<Cupom[]> {
    try {
      const results = await this.db.select().from(cupons).orderBy(desc(cupons.id));
      return results.map(cupom => ({
        ...cupom,
        planos_aplicaveis: Array.isArray(cupom.planos_aplicaveis) 
          ? cupom.planos_aplicaveis 
          : (cupom.planos_aplicaveis ? JSON.parse(cupom.planos_aplicaveis as any) : [])
      }));
    } catch (error: any) {
      logger.error('[DB] Erro ao buscar cupons:', { error: error.message });
      return [];
    }
  }

  async getCupom(id: number): Promise<Cupom | undefined> {
    try {
      const [cupom] = await this.db.select().from(cupons).where(eq(cupons.id, id)).limit(1);
      if (!cupom) return undefined;

      return {
        ...cupom,
        planos_aplicaveis: Array.isArray(cupom.planos_aplicaveis) 
          ? cupom.planos_aplicaveis 
          : (cupom.planos_aplicaveis ? JSON.parse(cupom.planos_aplicaveis as any) : [])
      };
    } catch (error: any) {
      logger.error('[DB] Erro ao buscar cupom:', { error: error.message });
      return undefined;
    }
  }

  async createCupom(data: InsertCupom): Promise<Cupom> {
    try {
      const [cupom] = await this.db.insert(cupons).values({
        ...data,
        planos_aplicaveis: Array.isArray(data.planos_aplicaveis) 
          ? data.planos_aplicaveis as any
          : [],
        data_criacao: new Date().toISOString(),
      }).returning();

      return {
        ...cupom,
        planos_aplicaveis: Array.isArray(cupom.planos_aplicaveis) 
          ? cupom.planos_aplicaveis 
          : []
      };
    } catch (error: any) {
      logger.error('[DB] Erro ao criar cupom:', { error: error.message });
      throw error;
    }
  }

  async updateCupom(id: number, updates: Partial<Cupom>): Promise<Cupom | undefined> {
    try {
      const updateData = { ...updates, data_atualizacao: new Date().toISOString() };
      if (updateData.planos_aplicaveis) {
        updateData.planos_aplicaveis = Array.isArray(updateData.planos_aplicaveis)
          ? updateData.planos_aplicaveis as any
          : [];
      }

      const [cupom] = await this.db
        .update(cupons)
        .set(updateData)
        .where(eq(cupons.id, id))
        .returning();

      if (!cupom) return undefined;

      return {
        ...cupom,
        planos_aplicaveis: Array.isArray(cupom.planos_aplicaveis) 
          ? cupom.planos_aplicaveis 
          : []
      };
    } catch (error: any) {
      logger.error('[DB] Erro ao atualizar cupom:', { error: error.message });
      throw error;
    }
  }

  async deleteCupom(id: number): Promise<boolean> {
    try {
      const result = await this.db.delete(cupons).where(eq(cupons.id, id)).returning();
      return result.length > 0;
    } catch (error: any) {
      logger.error('[DB] Erro ao deletar cupom:', { error: error.message });
      return false;
    }
  }

  async validarCupom(codigo: string, plano: string, userId: string): Promise<{ valido: boolean; cupom?: Cupom; erro?: string }> {
    try {
      const [cupom] = await this.db
        .select()
        .from(cupons)
        .where(eq(cupons.codigo, codigo.toUpperCase()))
        .limit(1);

      if (!cupom) {
        return { valido: false, erro: 'Cupom não encontrado' };
      }

      if (cupom.status !== 'ativo') {
        return { valido: false, erro: 'Cupom inativo' };
      }

      const hoje = new Date();
      const dataInicio = new Date(cupom.data_inicio);
      const dataExpiracao = new Date(cupom.data_expiracao);

      if (hoje < dataInicio) {
        return { valido: false, erro: 'Cupom ainda não está disponível' };
      }

      if (hoje > dataExpiracao) {
        return { valido: false, erro: 'Cupom expirado' };
      }

      const planosAplicaveis = Array.isArray(cupom.planos_aplicaveis) 
        ? cupom.planos_aplicaveis 
        : [];

      if (planosAplicaveis.length > 0 && !planosAplicaveis.includes(plano)) {
        return { valido: false, erro: 'Cupom não aplicável para este plano' };
      }

      if (cupom.quantidade_maxima && cupom.quantidade_utilizada >= cupom.quantidade_maxima) {
        return { valido: false, erro: 'Cupom esgotado' };
      }

      return { 
        valido: true, 
        cupom: {
          ...cupom,
          planos_aplicaveis: planosAplicaveis
        }
      };
    } catch (error: any) {
      logger.error('[DB] Erro ao validar cupom:', { error: error.message });
      return { valido: false, erro: 'Erro ao validar cupom' };
    }
  }

  async registrarUsoCupom(data: InsertUsoCupom): Promise<void> {
    try {
      await this.db.insert(usoCupons).values({
        ...data,
        data_uso: new Date().toISOString(),
      });

      await this.db
        .update(cupons)
        .set({ 
          quantidade_utilizada: sql`${cupons.quantidade_utilizada} + 1` 
        })
        .where(eq(cupons.id, data.cupom_id));
    } catch (error: any) {
      logger.error('[DB] Erro ao registrar uso de cupom:', { error: error.message });
      throw error;
    }
  }

  async getUsoCupons(cupomId: number): Promise<UsoCupom[]> {
    try {
      return await this.db
        .select()
        .from(usoCupons)
        .where(eq(usoCupons.cupom_id, cupomId))
        .orderBy(desc(usoCupons.data_uso));
    } catch (error: any) {
      logger.error('[DB] Erro ao buscar uso de cupons:', { error: error.message });
      return [];
    }
  }

  private async testConnection() {
    try {
      const result = await this.db.select().from(users).limit(1);
      logger.info('[DB] Teste de conexão bem-sucedido', {
        usuariosEncontrados: result.length
      });
    } catch (error: any) {
      logger.error('[DB] Erro no teste de conexão:', {
        error: error.message,
        stack: error.stack
      });
    }
  }

  private async seedInitialData() {
    try {
      const existingUsers = await this.db.select().from(users);

      // Apenas logar quantos usuários existem, não criar nenhum automaticamente
      console.log(`📊 Usuários existentes no banco: ${existingUsers.length}`);

      if (existingUsers.length === 0) {
        console.log('ℹ️  Banco vazio. Use o script seed-database.ts para criar usuários iniciais se necessário.');
      }

    } catch (error: any) {
      logger.error('[DB] Erro ao verificar dados:', {
        error: error.message,
        stack: error.stack
      });
    }
  }

  async getUsers(): Promise<User[]> {
    return await this.db.select().from(users);
  }

  async getUserById(userId: string): Promise<User | undefined> {
    try {
      const result = await this.db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      return result[0];
    } catch (error: any) {
      logger.error('[DB] Erro ao buscar usuário por ID:', {
        userId,
        error: error.message
      });
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      logger.info('[DB] Buscando usuário por email:', { email });

      const result = await this.db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      logger.info('[DB] Resultado da busca:', {
        encontrado: result.length > 0,
        usuario: result[0] ? { id: result[0].id, email: result[0].email, nome: result[0].nome } : null
      });

      return result[0];
    } catch (error: any) {
      logger.error('[DB] Erro ao buscar usuário por email:', {
        email,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const newUser = {
      ...insertUser,
      id: randomUUID(),
      data_criacao: new Date().toISOString(),
      plano: this.normalizePlanName(insertUser.plano || 'trial'),
    };
    const result = await this.db.insert(users).values(newUser).returning();
    return result[0];
  }

  private normalizePlanName(plano: string): string {
    const planMap: Record<string, string> = {
      'trial': 'trial',
      'mensal': 'premium_mensal',
      'anual': 'premium_anual',
      'premium': 'premium_mensal',
      'premium_mensal': 'premium_mensal',
      'premium_anual': 'premium_anual'
    };
    return planMap[plano.toLowerCase()] || 'trial';
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    try {
      // Remover campos undefined do objeto updates
      const cleanUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, value]) => value !== undefined)
      );

      if (Object.keys(cleanUpdates).length === 0) {
        return await this.getUserById(id);
      }

      // Normalizar plano se estiver sendo atualizado
      if (cleanUpdates.plano) {
        cleanUpdates.plano = this.normalizePlanName(cleanUpdates.plano as string);
      }

      const result = await this.db
        .update(users)
        .set(cleanUpdates)
        .where(eq(users.id, id))
        .returning();

      return result[0];
    } catch (error: any) {
      logger.error('[DB] Erro ao atualizar usuário:', {
        userId: id,
        updates,
        error: error.message
      });
      throw error;
    }
  }

  async deleteUser(id: string): Promise<void> {
    await this.db.delete(users).where(eq(users.id, id));
  }

  async getProdutos(): Promise<Produto[]> {
    return await this.db.select().from(produtos);
  }

  async getProduto(id: number): Promise<Produto | undefined> {
    const result = await this.db.select().from(produtos).where(eq(produtos.id, id)).limit(1);
    return result[0];
  }

  async getProdutoByCodigoBarras(codigo: string): Promise<Produto | undefined> {
    const result = await this.db.select().from(produtos).where(eq(produtos.codigo_barras, codigo)).limit(1);
    return result[0];
  }

  async createProduto(insertProduto: InsertProduto): Promise<Produto> {
    const result = await this.db.insert(produtos).values(insertProduto).returning();
    return result[0];
  }

  async updateProduto(id: number, updates: Partial<Produto>): Promise<Produto | undefined> {
    const result = await this.db.update(produtos).set(updates).where(eq(produtos.id, id)).returning();
    return result[0];
  }

  async deleteProduto(id: number): Promise<boolean> {
    const result = await this.db.delete(produtos).where(eq(produtos.id, id)).returning();
    return result.length > 0;
  }

  async getVendas(startDate?: string, endDate?: string): Promise<Venda[]> {
    if (startDate && endDate) {
      return await this.db.select().from(vendas).where(
        and(
          gte(vendas.data, startDate),
          lte(vendas.data, endDate)
        )
      );
    }
    return await this.db.select().from(vendas);
  }

  async getVendasByUser(userId: string): Promise<Venda[]> {
    try {
      const result = await this.db
        .select({
          id: vendas.id,
          user_id: vendas.user_id,
          data: vendas.data,
          produto: vendas.produto,
          quantidade_vendida: vendas.quantidade_vendida,
          valor_total: vendas.valor_total,
          forma_pagamento: vendas.forma_pagamento,
          itens: vendas.itens,
          cliente_id: vendas.cliente_id,
          orcamento_id: vendas.orcamento_id,
          vendedor: vendas.vendedor,
          cupom_texto: vendas.cupom_texto,
          orcamento_numero: orcamentos.numero,
        })
        .from(vendas)
        .leftJoin(orcamentos, eq(vendas.orcamento_id, orcamentos.id))
        .where(eq(vendas.user_id, userId))
        .orderBy(desc(vendas.data));

      return result as any[];
    } catch (error) {
      logger.error('[DB] Erro ao buscar vendas:', error);
      throw error;
    }
  }

  async createVenda(insertVenda: InsertVenda): Promise<Venda> {
    const result = await this.db.insert(vendas).values(insertVenda).returning();
    return result[0];
  }

  async deleteVenda(id: number): Promise<boolean> {
    const result = await this.db.delete(vendas).where(eq(vendas.id, id)).returning();
    return result.length > 0;
  }

  async clearVendas(): Promise<void> {
    await this.db.delete(vendas);
  }

  async getVenda(id: number): Promise<Venda | undefined> {
    const result = await this.db.select().from(vendas).where(eq(vendas.id, id)).limit(1);
    return result[0];
  }

  async updateVendaCupom(id: number, cupomTexto: string): Promise<boolean> {
    const result = await this.db.update(vendas).set({ cupom_texto: cupomTexto }).where(eq(vendas.id, id)).returning();
    return result.length > 0;
  }

  async getFornecedores(): Promise<Fornecedor[]> {
    return await this.db.select().from(fornecedores);
  }

  async getFornecedor(id: number): Promise<Fornecedor | undefined> {
    const result = await this.db.select().from(fornecedores).where(eq(fornecedores.id, id)).limit(1);
    return result[0];
  }

  async createFornecedor(insertFornecedor: InsertFornecedor): Promise<Fornecedor> {
    const newFornecedor = {
      ...insertFornecedor,
      data_cadastro: new Date().toISOString(),
    };
    const result = await this.db.insert(fornecedores).values(newFornecedor).returning();
    return result[0];
  }

  async updateFornecedor(id: number, updates: Partial<Fornecedor>): Promise<Fornecedor | undefined> {
    const result = await this.db.update(fornecedores).set(updates).where(eq(fornecedores.id, id)).returning();
    return result[0];
  }

  async deleteFornecedor(id: number): Promise<boolean> {
    const result = await this.db.delete(fornecedores).where(eq(fornecedores.id, id)).returning();
    return result.length > 0;
  }

  async getClientes(): Promise<Cliente[]> {
    return await this.db.select().from(clientes);
  }

  async getCliente(id: number): Promise<Cliente | undefined> {
    const result = await this.db.select().from(clientes).where(eq(clientes.id, id)).limit(1);
    return result[0];
  }

  async createCliente(insertCliente: InsertCliente): Promise<Cliente> {
    const newCliente = {
      ...insertCliente,
      data_cadastro: insertCliente.data_cadastro || new Date().toISOString(),
    };
    const result = await this.db.insert(clientes).values(newCliente).returning();
    return result[0];
  }

  async updateCliente(id: number, updates: Partial<Cliente>): Promise<Cliente | undefined> {
    const result = await this.db.update(clientes).set(updates).where(eq(clientes.id, id)).returning();
    return result[0];
  }

  async deleteCliente(id: number): Promise<boolean> {
    const result = await this.db.delete(clientes).where(eq(clientes.id, id)).returning();
    return result.length > 0;
  }

  async getCompras(fornecedorId?: number, startDate?: string, endDate?: string): Promise<Compra[]> {
    let query = this.db.select().from(compras);

    if (fornecedorId && startDate && endDate) {
      return await query.where(
        and(
          eq(compras.fornecedor_id, fornecedorId),
          gte(compras.data, startDate),
          lte(compras.data, endDate)
        )
      );
    } else if (fornecedorId) {
      return await query.where(eq(compras.fornecedor_id, fornecedorId));
    } else if (startDate && endDate) {
      return await query.where(
        and(
          gte(compras.data, startDate),
          lte(compras.data, endDate)
        )
      );
    }

    return await query;
  }

  async createCompra(insertCompra: InsertCompra): Promise<Compra> {
    const result = await this.db.insert(compras).values(insertCompra).returning();
    return result[0];
  }

  async updateCompra(id: number, updates: Partial<Compra>): Promise<Compra | undefined> {
    const result = await this.db.update(compras).set(updates).where(eq(compras.id, id)).returning();
    return result[0];
  }

  async getConfigFiscal(): Promise<ConfigFiscal | undefined> {
    const result = await this.db.select().from(configFiscal).limit(1);
    return result[0];
  }

  async saveConfigFiscal(insertConfig: InsertConfigFiscal): Promise<ConfigFiscal> {
    const existing = await this.getConfigFiscal();

    if (existing) {
      const result = await this.db.update(configFiscal)
        .set({
          ...insertConfig,
          updated_at: new Date().toISOString(),
        })
        .where(eq(configFiscal.id, existing.id))
        .returning();
      return result[0];
    }

    const result = await this.db.insert(configFiscal).values({
      ...insertConfig,
      updated_at: new Date().toISOString(),
    }).returning();
    return result[0];
  }

  async getPlanos(): Promise<Plano[]> {
    return await this.db.select().from(planos).orderBy(desc(planos.id));
  }

  async createPlano(plano: InsertPlano): Promise<Plano> {
    const result = await this.db.insert(planos).values({
      ...plano,
      data_criacao: new Date().toISOString(),
    }).returning();
    return result[0];
  }

  async updatePlano(id: number, updates: Partial<Plano>): Promise<Plano | undefined> {
    const result = await this.db.update(planos).set(updates).where(eq(planos.id, id)).returning();
    return result[0];
  }

  async deletePlano(id: number): Promise<boolean> {
    const result = await this.db.delete(planos).where(eq(planos.id, id)).returning();
    return result.length > 0;
  }

  async getConfigMercadoPago(): Promise<ConfigMercadoPago | null> {
    const result = await this.db.select().from(configMercadoPago).limit(1);
    return result[0] || null;
  }

  async saveConfigMercadoPago(config: InsertConfigMercadoPago): Promise<ConfigMercadoPago> {
    const existing = await this.getConfigMercadoPago();

    if (existing) {
      const result = await this.db.update(configMercadoPago)
        .set({
          ...config,
          updated_at: new Date().toISOString(),
        })
        .where(eq(configMercadoPago.id, existing.id))
        .returning();
      return result[0];
    }

    const result = await this.db.insert(configMercadoPago).values({
      ...config,
      updated_at: new Date().toISOString(),
    }).returning();
    return result[0];
  }

  async updateConfigMercadoPagoStatus(status: string): Promise<void> {
    const existing = await this.getConfigMercadoPago();
    if (existing) {
      await this.db.update(configMercadoPago)
        .set({
          status_conexao: status,
          ultima_sincronizacao: new Date().toISOString(),
        })
        .where(eq(configMercadoPago.id, existing.id));
    }
  }

  async getLogsAdmin(): Promise<LogAdmin[]> {
    const result = await this.db.select().from(logsAdmin).orderBy(desc(logsAdmin.id));
    return result;
  }

  async getLogsAdminByAccount(contaId: string): Promise<LogAdmin[]> {
    const funcionariosIds = await this.db
      .select({ id: funcionarios.id })
      .from(funcionarios)
      .where(eq(funcionarios.conta_id, contaId));

    const ids = [contaId, ...funcionariosIds.map(f => f.id)];

    return await this.db
      .select()
      .from(logsAdmin)
      .where(inArray(logsAdmin.usuario_id, ids))
      .orderBy(desc(logsAdmin.data))
      .limit(500);
  }

  async createLogAdmin(log: InsertLogAdmin): Promise<LogAdmin> {
    const result = await this.db.insert(logsAdmin).values({
      usuario_id: log.usuario_id,
      conta_id: log.conta_id,
      acao: log.acao,
      detalhes: log.detalhes || null,
      data: new Date().toISOString(),
      ip_address: log.ip_address || null,
      user_agent: log.user_agent || null,
    }).returning();
    return result[0];
  }

  async logAdminAction(actorId: string, action: string, details?: string, context?: { ip?: string; userAgent?: string; contaId?: string }): Promise<void> {
    try {
      let contaId = context?.contaId || actorId;

      const funcionario = await this.db.select().from(funcionarios).where(eq(funcionarios.id, actorId)).limit(1);
      if (funcionario[0]) {
        contaId = funcionario[0].conta_id;
      }

      await this.createLogAdmin({
        usuario_id: actorId,
        conta_id: contaId,
        acao: action,
        detalhes: details || null,
        ip_address: context?.ip || null,
        user_agent: context?.userAgent || null,
      });
    } catch (error) {
      console.error('[AUDIT_LOG] Erro ao registrar ação:', error);
    }
  }

  async deleteAllLogsAdmin(contaId?: string): Promise<number> {
    try {
      let result;

      if (contaId) {
        // Deletar apenas logs de uma conta específica
        result = await this.db
          .delete(logsAdmin)
          .where(eq(logsAdmin.conta_id, contaId))
          .returning();
      } else {
        // Deletar todos os logs (master admin)
        result = await this.db
          .delete(logsAdmin)
          .returning();
      }

      // Contar os registros deletados
      const deletedCount = result.length;

      logger.info('[DB] Logs de auditoria limpos', { contaId: contaId || 'todos', deletedCount });

      return deletedCount;
    } catch (error) {
      logger.error('[DB] Erro ao limpar logs de auditoria:', { error });
      throw error;
    }
  }

  async getSubscriptions(): Promise<Subscription[]> {
    try {
      return await this.db.select().from(subscriptions).orderBy(desc(subscriptions.id));
    } catch (error: any) {
      // Se der erro de coluna não existente (cupom_codigo), fazer SELECT manual sem essas colunas
      if (error.code === '42703') {
        logger.warn('[DB] Executando SELECT básico de subscriptions (campos de cupom não disponíveis)', { error: error.message });
        const result = await this.db.execute(sql`
          SELECT 
            id, user_id, plano, valor, status, status_pagamento, 
            payment_id, preference_id, data_criacao, data_vencimento, 
            data_atualizacao, data_cancelamento, motivo_cancelamento, 
            auto_renovacao, tentativas_cobranca, prazo_limite_pagamento
          FROM subscriptions 
          ORDER BY id DESC
        `);
        return result.rows as any[];
      }
      throw error;
    }
  }

  async getSubscription(id: number): Promise<Subscription | undefined> {
    const result = await this.db.select().from(subscriptions).where(eq(subscriptions.id, id)).limit(1);
    return result[0];
  }

  async getSubscriptionsByUser(userId: string): Promise<Subscription[]> {
    return await this.db.select().from(subscriptions).where(eq(subscriptions.user_id, userId));
  }

  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const result = await this.db.insert(subscriptions).values({
      ...subscription,
      data_criacao: new Date().toISOString(),
    }).returning();
    return result[0];
  }

  async updateSubscription(id: number, updates: Partial<Subscription>): Promise<Subscription | undefined> {
    const result = await this.db.update(subscriptions)
      .set({
        ...updates,
        data_atualizacao: new Date().toISOString(),
      })
      .where(eq(subscriptions.id, id))
      .returning();
    return result[0];
  }

  async deleteSubscription(id: number): Promise<boolean> {
    const result = await this.db.delete(subscriptions)
      .where(eq(subscriptions.id, id))
      .returning();
    return result.length > 0;
  }

  async getFuncionarios(): Promise<Funcionario[]> {
    return await this.db.select().from(funcionarios);
  }

  async getFuncionariosByContaId(contaId: string): Promise<Funcionario[]> {
    return await this.db.select().from(funcionarios).where(eq(funcionarios.conta_id, contaId));
  }

  async getFuncionario(id: string): Promise<Funcionario | undefined> {
    const result = await this.db.select().from(funcionarios).where(eq(funcionarios.id, id)).limit(1);
    return result[0];
  }

  async getFuncionarioByEmail(email: string): Promise<Funcionario | undefined> {
    const result = await this.db.select().from(funcionarios).where(eq(funcionarios.email, email)).limit(1);
    return result[0];
  }

  async createFuncionario(funcionario: InsertFuncionario): Promise<Funcionario> {
    const newFunc = {
      ...funcionario,
      id: funcionario.id || randomUUID(),
      data_criacao: new Date().toISOString(),
    };

    console.log(`📝 [DB] Inserindo funcionário no banco:`, {
      id: newFunc.id,
      nome: newFunc.nome,
      email: newFunc.email,
      conta_id: newFunc.conta_id,
      status: newFunc.status
    });

    const result = await this.db.insert(funcionarios).values(newFunc).returning();

    console.log(`✅ [DB] Funcionário inserido com sucesso - ID: ${result[0].id}`);

    return result[0];
  }

  async updateFuncionario(id: string, updates: Partial<Funcionario>): Promise<Funcionario | undefined> {
    const result = await this.db.update(funcionarios).set(updates).where(eq(funcionarios.id, id)).returning();
    return result[0];
  }

  async deleteFuncionario(id: string): Promise<boolean> {
    const result = await this.db.delete(funcionarios).where(eq(funcionarios.id, id)).returning();
    return result.length > 0;
  }

  async getPermissoesFuncionario(funcionarioId: string): Promise<PermissaoFuncionario | undefined> {
    const result = await this.db.select().from(permissoesFuncionarios)
      .where(eq(permissoesFuncionarios.funcionario_id, funcionarioId))
      .limit(1);
    return result[0];
  }

  async savePermissoesFuncionario(funcionarioId: string, permissoes: Partial<PermissaoFuncionario>): Promise<PermissaoFuncionario> {
    const existing = await this.getPermissoesFuncionario(funcionarioId);

    if (existing) {
      const result = await this.db.update(permissoesFuncionarios)
        .set(permissoes)
        .where(eq(permissoesFuncionarios.funcionario_id, funcionarioId))
        .returning();
      return result[0];
    }

    const result = await this.db.insert(permissoesFuncionarios).values({
      funcionario_id: funcionarioId,
      ...permissoes,
    } as any).returning();
    return result[0];
  }

  async getContasPagar(): Promise<ContasPagar[]> {
    return await this.db.select().from(contasPagar).orderBy(desc(contasPagar.id));
  }

  async createContaPagar(conta: InsertContasPagar): Promise<ContasPagar> {
    const result = await this.db.insert(contasPagar).values({
      ...conta,
      data_cadastro: new Date().toISOString(),
    }).returning();
    return result[0];
  }

  async updateContaPagar(id: number, updates: Partial<ContasPagar>): Promise<ContasPagar | undefined> {
    const result = await this.db.update(contasPagar).set(updates).where(eq(contasPagar.id, id)).returning();
    return result[0];
  }

  async deleteContaPagar(id: number): Promise<boolean> {
    const result = await this.db.delete(contasPagar).where(eq(contasPagar.id, id)).returning();
    return result.length > 0;
  }

  async getContasReceber(): Promise<ContasReceber[]> {
    return await this.db.select().from(contasReceber).orderBy(desc(contasReceber.id));
  }

  async createContaReceber(conta: InsertContasReceber): Promise<ContasReceber> {
    const result = await this.db.insert(contasReceber).values({
      ...conta,
      data_cadastro: new Date().toISOString(),
    }).returning();
    return result[0];
  }

  async updateContaReceber(id: number, updates: Partial<ContasReceber>): Promise<ContasReceber | undefined> {
    const result = await this.db.update(contasReceber).set(updates).where(eq(contasReceber.id, id)).returning();
    return result[0];
  }

  async deleteContaReceber(id: number): Promise<boolean> {
    const result = await this.db.delete(contasReceber).where(eq(contasReceber.id, id)).returning();
    return result.length > 0;
  }

  async getCaixas(userId: string): Promise<Caixa[]> {
    return await this.db.select().from(caixas).where(eq(caixas.user_id, userId)).orderBy(desc(caixas.id));
  }

  async getCaixaAberto(userId: string, funcionarioId?: string): Promise<Caixa | undefined> {
    // Se for funcionário, busca o caixa específico dele
    if (funcionarioId) {
      const result = await this.db.select().from(caixas)
        .where(and(
          eq(caixas.user_id, userId),
          eq(caixas.funcionario_id, funcionarioId),
          eq(caixas.status, 'aberto')
        ))
        .limit(1);
      return result[0];
    }

    // Se for dono da conta, busca caixa sem funcionário_id
    const result = await this.db.select().from(caixas)
      .where(and(
        eq(caixas.user_id, userId),
        sql`${caixas.funcionario_id} IS NULL`,
        eq(caixas.status, 'aberto')
      ))
      .limit(1);
    return result[0];
  }

  async getCaixa(id: number): Promise<Caixa | undefined> {
    const result = await this.db.select().from(caixas).where(eq(caixas.id, id)).limit(1);
    return result[0];
  }

  async abrirCaixa(caixa: InsertCaixa): Promise<Caixa> {
    const result = await this.db.insert(caixas).values(caixa).returning();
    return result[0];
  }

  async fecharCaixa(id: number, dados: Partial<Caixa>): Promise<Caixa | undefined> {
    const result = await this.db.update(caixas)
      .set({
        ...dados,
        data_fechamento: new Date().toISOString(),
        status: 'fechado',
      })
      .where(eq(caixas.id, id))
      .returning();
    return result[0];
  }

  async updateCaixa(id: number, updates: Partial<Caixa>): Promise<Caixa | undefined> {
    const result = await this.db.update(caixas).set(updates).where(eq(caixas.id, id)).returning();
    return result[0];
  }

  async arquivarCaixasAntigos(dataLimite: string): Promise<number> {
    const result = await this.db.update(caixas)
      .set({ status: 'arquivado' })
      .where(and(
        eq(caixas.status, 'fechado'),
        or(
          lt(caixas.data_fechamento, dataLimite),
          and(
            isNull(caixas.data_fechamento),
            lt(caixas.data_abertura, dataLimite)
          )
        )
      ))
      .returning();

    // Log detalhado dos caixas arquivados
    if (result.length > 0) {
      const userCounts = result.reduce((acc: Record<string, number>, caixa: any) => {
        acc[caixa.user_id] = (acc[caixa.user_id] || 0) + 1;
        return acc;
      }, {});

      console.log('[ARQUIVAMENTO] Caixas arquivados:', {
        total: result.length,
        porUsuario: userCounts,
        dataLimite,
        ids: result.map((c: any) => c.id).slice(0, 10)
      });
    }

    return result.length;
  }

  async atualizarTotaisCaixa(id: number, campo: 'total_vendas' | 'total_suprimentos' | 'total_retiradas', valor: number): Promise<Caixa | undefined> {
    const caixa = await this.getCaixa(id);
    if (!caixa) return undefined;

    const updates: Partial<Caixa> = {
      [campo]: (caixa[campo] || 0) + valor,
    };

    const result = await this.db.update(caixas)
      .set(updates)
      .where(eq(caixas.id, id))
      .returning();
    return result[0];
  }

  async getMovimentacoesCaixa(caixaId: number): Promise<MovimentacaoCaixa[]> {
    return await this.db.select().from(movimentacoesCaixa)
      .where(eq(movimentacoesCaixa.caixa_id, caixaId))
      .orderBy(desc(movimentacoesCaixa.id));
  }

  async createMovimentacaoCaixa(movimentacao: InsertMovimentacaoCaixa): Promise<MovimentacaoCaixa> {
    const result = await this.db.insert(movimentacoesCaixa).values(movimentacao).returning();
    return result[0];
  }

  async limparHistoricoCaixas(userId: string): Promise<{ deletedCount: number }> {
    // Deletar todas as movimentações dos caixas fechados do usuário
    await this.db.delete(movimentacoesCaixa).where(
      eq(movimentacoesCaixa.caixa_id,
        this.db.select({ id: caixas.id })
          .from(caixas)
          .where(and(eq(caixas.user_id, userId), eq(caixas.status, 'fechado')))
          .limit(1) as any
      )
    );

    // Deletar todos os caixas fechados do usuário
    const result = await this.db.delete(caixas)
      .where(and(eq(caixas.user_id, userId), eq(caixas.status, 'fechado')))
      .returning();

    return { deletedCount: result.length };
  }

  async getSystemConfig(chave: string): Promise<{ chave: string; valor: string; updated_at: string } | undefined> {
    const result = await this.db.select().from(systemConfig).where(eq(systemConfig.chave, chave));
    return result[0];
  }

  async setSystemConfig(chave: string, valor: string): Promise<void> {
    const existing = await this.getSystemConfig(chave);
    const now = new Date().toISOString();

    if (existing) {
      await this.db.update(systemConfig)
        .set({ valor, updated_at: now })
        .where(eq(systemConfig.chave, chave));
    } else {
      await this.db.insert(systemConfig).values({
        chave,
        valor,
        updated_at: now
      });
    }
  }

  async upsertSystemConfig(chave: string, valor: string): Promise<{ chave: string; valor: string; updated_at: string }> {
    const existing = await this.getSystemConfig(chave);
    const now = new Date().toISOString();

    if (existing) {
      await this.db.update(systemConfig)
        .set({ valor, updated_at: now })
        .where(eq(systemConfig.chave, chave));
    } else {
      await this.db.insert(systemConfig).values({
        chave,
        valor,
        updated_at: now
      });
    }

    const result = await this.getSystemConfig(chave);
    if (!result) {
      throw new Error('Erro ao salvar configuração');
    }
    return result;
  }

  // Métodos para Customização do Usuário
  async getUserCustomization(userId: string): Promise<UserCustomization | null> {
    try {
      const result = await this.db
        .select()
        .from(userCustomization)
        .where(eq(userCustomization.user_id, userId))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      logger.error('[DB] Erro ao buscar customização do usuário:', { userId, error });
      throw error;
    }
  }

  async upsertUserCustomization(userId: string, data: Partial<InsertUserCustomization>): Promise<UserCustomization> {
    try {
      const existing = await this.getUserCustomization(userId);

      if (existing) {
        // Atualizar customização existente
        const result = await this.db
          .update(userCustomization)
          .set({
            ...data,
            updated_at: sql`NOW()`,
          })
          .where(eq(userCustomization.user_id, userId))
          .returning();

        return result[0];
      } else {
        // Criar nova customização
        const result = await this.db
          .insert(userCustomization)
          .values({
            user_id: userId,
            ...data,
          })
          .returning();

        return result[0];
      }
    } catch (error) {
      logger.error('[DB] Erro ao salvar customização do usuário:', { userId, error });
      throw error;
    }
  }

  async deleteUserCustomization(userId: string): Promise<void> {
    try {
      await this.db
        .delete(userCustomization)
        .where(eq(userCustomization.user_id, userId));

      logger.info('[DB] Customização resetada com sucesso:', { userId });
    } catch (error) {
      logger.error('[DB] Erro ao resetar customização do usuário:', { userId, error });
      throw error;
    }
  }

  async getDevolucoes(): Promise<Devolucao[]> {
    return await this.db.select().from(devolucoes).orderBy(desc(devolucoes.id));
  }

  async getDevolucao(id: number): Promise<Devolucao | undefined> {
    try {
      const result = await this.db.select().from(devolucoes).where(eq(devolucoes.id, id)).limit(1);
      return result[0];
    } catch (error) {
      logger.error('[DB] Erro ao buscar devolução:', { id, error });
      throw error;
    }
  }

  async createDevolucao(devolucao: InsertDevolucao): Promise<Devolucao> {
    const result = await this.db.insert(devolucoes).values(devolucao).returning();
    return result[0];
  }

  async updateDevolucao(id: number, updates: Partial<Devolucao>): Promise<Devolucao | undefined> {
    const result = await this.db.update(devolucoes)
      .set(updates)
      .where(eq(devolucoes.id, id))
      .returning();
    return result[0];
  }

  async deleteDevolucao(id: number): Promise<boolean> {
    const result = await this.db.delete(devolucoes)
      .where(eq(devolucoes.id, id))
      .returning();
    return result.length > 0;
  }

  // Métodos de Orçamentos
  async getOrcamentos(): Promise<Orcamento[]> {
    const result = await this.db
      .select()
      .from(orcamentos)
      .orderBy(desc(orcamentos.data_criacao));
    return result;
  }

  async getOrcamento(id: number): Promise<Orcamento | undefined> {
    const result = await this.db
      .select()
      .from(orcamentos)
      .where(eq(orcamentos.id, id))
      .limit(1);
    return result[0];
  }

  async createOrcamento(data: any): Promise<Orcamento> {
    const dataAtual = new Date().toISOString();
    const [orcamento] = await this.db
      .insert(orcamentos)
      .values({
        user_id: data.user_id,
        numero: data.numero,
        data_criacao: data.data_criacao || dataAtual,
        data_atualizacao: data.data_atualizacao || dataAtual,
        validade: data.validade || null,
        cliente_id: data.cliente_id || null,
        cliente_nome: data.cliente_nome,
        cliente_email: data.cliente_email || null,
        cliente_telefone: data.cliente_telefone || null,
        cliente_cpf_cnpj: data.cliente_cpf_cnpj || null,
        cliente_endereco: data.cliente_endereco || null,
        status: data.status || 'pendente',
        itens: data.itens,
        subtotal: data.subtotal,
        desconto: data.desconto || 0,
        valor_total: data.valor_total,
        observacoes: data.observacoes || null,
        condicoes_pagamento: data.condicoes_pagamento || null,
        prazo_entrega: data.prazo_entrega || null,
        vendedor: data.vendedor || null,
        venda_id: data.venda_id || null,
      })
      .returning();

    return orcamento;
  }

  async updateOrcamento(id: number, data: any): Promise<Orcamento> {
    const startTime = Date.now();
    let sucesso = false;

    try {
      const resultado = await this.db.transaction(async (tx) => {
        const [orcamentoOriginal] = await tx
          .select()
          .from(orcamentos)
          .where(eq(orcamentos.id, id))
          .for('update');

        if (!orcamentoOriginal) {
          throw new Error("Orçamento não encontrado");
        }

      const statusOriginal = orcamentoOriginal.status;
      const statusFinal = data.status !== undefined ? data.status : statusOriginal;
      const itensAtualizados = data.itens ? (Array.isArray(data.itens) ? data.itens : []) : (Array.isArray(orcamentoOriginal.itens) ? orcamentoOriginal.itens : []);

      const itensMudaram = data.itens !== undefined && 
        JSON.stringify(data.itens) !== JSON.stringify(orcamentoOriginal.itens);
      const precisaRecalcularBloqueios = 
        (statusFinal === 'aprovado' && statusOriginal !== 'aprovado') ||
        (statusFinal === 'aprovado' && statusOriginal === 'aprovado' && itensMudaram);

      // SEMPRE criar bloqueios quando status for aprovado (independente do status anterior)
      if (statusFinal === 'aprovado') {
        // Remover bloqueios antigos primeiro (se existirem)
        await tx.delete(bloqueiosEstoque).where(eq(bloqueiosEstoque.orcamento_id, id));

        // Criar novos bloqueios
        const dataBloqueio = new Date().toISOString();
        for (const item of itensAtualizados) {
          await tx.insert(bloqueiosEstoque).values({
            produto_id: item.produto_id,
            orcamento_id: id,
            user_id: orcamentoOriginal.user_id,
            quantidade_bloqueada: item.quantidade,
            data_bloqueio: dataBloqueio,
          });
        }
      }

      const [orcamento] = await tx
        .update(orcamentos)
        .set({
          validade: data.validade !== undefined ? data.validade : orcamentoOriginal.validade,
          cliente_id: data.cliente_id !== undefined ? data.cliente_id : orcamentoOriginal.cliente_id,
          cliente_nome: data.cliente_nome !== undefined ? data.cliente_nome : orcamentoOriginal.cliente_nome,
          cliente_email: data.cliente_email !== undefined ? data.cliente_email : orcamentoOriginal.cliente_email,
          cliente_telefone: data.cliente_telefone !== undefined ? data.cliente_telefone : orcamentoOriginal.cliente_telefone,
          cliente_cpf_cnpj: data.cliente_cpf_cnpj !== undefined ? data.cliente_cpf_cnpj : orcamentoOriginal.cliente_cpf_cnpj,
          cliente_endereco: data.cliente_endereco !== undefined ? data.cliente_endereco : orcamentoOriginal.cliente_endereco,
          status: data.status !== undefined ? data.status : orcamentoOriginal.status,
          itens: data.itens !== undefined ? data.itens : orcamentoOriginal.itens,
          subtotal: data.subtotal !== undefined ? data.subtotal : orcamentoOriginal.subtotal,
          desconto: data.desconto !== undefined ? data.desconto : orcamentoOriginal.desconto,
          valor_total: data.valor_total !== undefined ? data.valor_total : orcamentoOriginal.valor_total,
          observacoes: data.observacoes !== undefined ? data.observacoes : orcamentoOriginal.observacoes,
          condicoes_pagamento: data.condicoes_pagamento !== undefined ? data.condicoes_pagamento : orcamentoOriginal.condicoes_pagamento,
          prazo_entrega: data.prazo_entrega !== undefined ? data.prazo_entrega : orcamentoOriginal.prazo_entrega,
          data_atualizacao: new Date().toISOString(),
        })
        .where(eq(orcamentos.id, id))
        .returning();

      // Se o status deixou de ser aprovado, remover os bloqueios
      if (orcamento.status !== 'aprovado') {
        await tx.delete(bloqueiosEstoque).where(eq(bloqueiosEstoque.orcamento_id, id));
      }

      sucesso = true;
      return orcamento;
    });

      const latencia = Date.now() - startTime;
      const produtosAfetados = resultado.itens ? resultado.itens.map((i: any) => i.produto_id) : [];
      logger.trackAprovacao(latencia, sucesso, produtosAfetados);

      return resultado;
    } catch (error) {
      const latencia = Date.now() - startTime;
      logger.trackAprovacao(latencia, false, []);
      throw error;
    }
  }

  async deleteOrcamento(id: number): Promise<void> {
    await this.removerBloqueiosOrcamento(id);
    await this.db
      .delete(orcamentos)
      .where(eq(orcamentos.id, id));
  }

  async criarBloqueioEstoque(orcamentoId: number, userId: string, itens: any[]): Promise<void> {
    const dataBloqueio = new Date().toISOString();

    for (const item of itens) {
      await this.db
        .insert(bloqueiosEstoque)
        .values({
          produto_id: item.produto_id,
          orcamento_id: orcamentoId,
          user_id: userId,
          quantidade_bloqueada: item.quantidade,
          data_bloqueio: dataBloqueio,
        });

      logger.trackBloqueio('criado', item.produto_id, item.quantidade);
    }
  }

  async removerBloqueiosOrcamento(orcamentoId: number): Promise<void> {
    const bloqueiosRemovidos = await this.db
      .select()
      .from(bloqueiosEstoque)
      .where(eq(bloqueiosEstoque.orcamento_id, orcamentoId));

    await this.db
      .delete(bloqueiosEstoque)
      .where(eq(bloqueiosEstoque.orcamento_id, orcamentoId));

    bloqueiosRemovidos.forEach(bloqueio => {
      logger.trackBloqueio('removido', bloqueio.produto_id, bloqueio.quantidade_bloqueada);
    });
  }

  async getBloqueiosPorProduto(produtoId: number, userId: string): Promise<BloqueioEstoque[]> {
    const bloqueios = await this.db
      .select()
      .from(bloqueiosEstoque)
      .where(
        and(
          eq(bloqueiosEstoque.produto_id, produtoId),
          eq(bloqueiosEstoque.user_id, userId)
        )
      );
    return bloqueios;
  }

  async getQuantidadeBloqueadaPorProduto(produtoId: number, userId: string): Promise<number> {
    try {
      const result = await this.db
        .select({
          total: sql<number>`COALESCE(SUM(${bloqueiosEstoque.quantidade_bloqueada}), 0)`,
        })
        .from(bloqueiosEstoque)
        .where(
          and(
            eq(bloqueiosEstoque.produto_id, produtoId),
            eq(bloqueiosEstoque.user_id, userId)
          )
        );

      return Number(result[0]?.total || 0);
    } catch (error) {
      logger.error('[DB] Erro ao buscar quantidade bloqueada:', { error, produtoId, userId });
      return 0;
    }
  }

  async getQuantidadeDisponivelProduto(produtoId: number, userId: string): Promise<number> {
    const produto = await this.getProduto(produtoId);
    if (!produto) return 0;

    const quantidadeBloqueada = await this.getQuantidadeBloqueadaPorProduto(produtoId, userId);
    return Math.max(0, produto.quantidade - quantidadeBloqueada);
  }

  async converterOrcamentoEmVenda(
    orcamentoId: number,
    userId: string,
    vendedor: string,
    formaPagamento: string
  ): Promise<Venda> {
    return await this.db.transaction(async (tx) => {
      // 1. Buscar orçamento e fazer lock
      const [orcamento] = await tx
        .select()
        .from(orcamentos)
        .where(
          and(
            eq(orcamentos.id, orcamentoId),
            eq(orcamentos.user_id, userId)
          )
        )
        .for('update');

      if (!orcamento) {
        throw new Error('Orçamento não encontrado');
      }

      if (orcamento.status !== 'aprovado') {
        throw new Error('Apenas orçamentos aprovados podem ser convertidos em venda');
      }

      const itens = Array.isArray(orcamento.itens) ? orcamento.itens : [];

      // 2. Buscar cliente se não houver ID, ou criar se não existir
      let clienteId = orcamento.cliente_id;
      if (!clienteId && orcamento.cliente_nome) {
        const clientesEncontrados = await tx
          .select()
          .from(clientes)
          .where(
            and(
              eq(clientes.user_id, userId),
              eq(clientes.nome, orcamento.cliente_nome)
            )
          );

        if (clientesEncontrados.length > 0) {
          clienteId = clientesEncontrados[0].id;
        } else {
          // Se não encontrar, criar um novo cliente
          const [novoCliente] = await tx.insert(clientes).values({
            user_id: userId,
            nome: orcamento.cliente_nome,
            email: orcamento.cliente_email,
            telefone: orcamento.cliente_telefone,
            cpf_cnpj: orcamento.cliente_cpf_cnpj,
            data_cadastro: new Date().toISOString(),
          }).returning();
          clienteId = novoCliente.id;
        }
      }

      // 3. Criar a venda
      const [venda] = await tx
        .insert(vendas)
        .values({
          user_id: userId,
          data: new Date().toISOString(),
          valor_total: orcamento.valor_total,
          forma_pagamento: formaPagamento || 'dinheiro',
          itens: JSON.stringify(itens),
          cliente_id: clienteId || undefined,
          produto: itens.map((i: any) => i.nome).join(', '),
          quantidade_vendida: itens.reduce((sum: number, i: any) => sum + i.quantidade, 0),
          orcamento_id: orcamentoId,
          orcamento_numero: orcamento.numero,
          vendedor: vendedor || orcamento.vendedor || 'Sistema',
        })
        .returning();

      // 4. Atualizar status do orçamento para "convertido"
      await tx
        .update(orcamentos)
        .set({
          status: 'convertido',
          data_atualizacao: new Date().toISOString(),
          venda_id: venda.id,
        })
        .where(eq(orcamentos.id, orcamentoId));

      // 5. PRIMEIRO deduzir do estoque real
      for (const item of itens) {
        const [produtoAtual] = await tx
          .select()
          .from(produtos)
          .where(
            and(
              eq(produtos.id, item.produto_id),
              eq(produtos.user_id, userId)
            )
          )
          .for('update');

        if (!produtoAtual) {
          throw new Error(`Produto ${item.produto_id} não encontrado`);
        }

        if (produtoAtual.quantidade < item.quantidade) {
          throw new Error(`Estoque insuficiente para ${item.nome}. Disponível: ${produtoAtual.quantidade}, Solicitado: ${item.quantidade}`);
        }

        await tx
          .update(produtos)
          .set({
            quantidade: sql`${produtos.quantidade} - ${item.quantidade}`,
          })
          .where(eq(produtos.id, item.produto_id));
      }

      // 6. DEPOIS remover bloqueios do orçamento
      await tx
        .delete(bloqueiosEstoque)
        .where(eq(bloqueiosEstoque.orcamento_id, orcamentoId));

      return venda;
    });
  }

  // ============================================
  // MÉTODOS DE GESTÃO DE CLIENTE 360°
  // ============================================

  async getClientNotes(userId: string, limit = 50, offset = 0): Promise<ClientNote[]> {
    const results = await this.db
      .select()
      .from(clientNotes)
      .where(eq(clientNotes.user_id, userId))
      .orderBy(desc(clientNotes.created_at))
      .limit(limit)
      .offset(offset);
    return results;
  }

  async createClientNote(note: InsertClientNote): Promise<ClientNote> {
    const [created] = await this.db
      .insert(clientNotes)
      .values(note)
      .returning();
    return created;
  }

  async updateClientNote(id: number, updates: Partial<ClientNote>): Promise<ClientNote | undefined> {
    // Sanitizar: permitir apenas campos mutáveis
    const { content } = updates;
    const sanitizedUpdates: any = {};

    if (content !== undefined) sanitizedUpdates.content = content;
    sanitizedUpdates.updated_at = sql`NOW()`;

    const [updated] = await this.db
      .update(clientNotes)
      .set(sanitizedUpdates)
      .where(eq(clientNotes.id, id))
      .returning();
    return updated;
  }

  async deleteClientNote(id: number): Promise<boolean> {
    const result = await this.db
      .delete(clientNotes)
      .where(eq(clientNotes.id, id))
      .returning();
    return result.length > 0;
  }

  async getClientDocuments(userId: string, limit = 50, offset = 0): Promise<ClientDocument[]> {
    const results = await this.db
      .select()
      .from(clientDocuments)
      .where(eq(clientDocuments.user_id, userId))
      .orderBy(desc(clientDocuments.uploaded_at))
      .limit(limit)
      .offset(offset);
    return results;
  }

  async createClientDocument(document: InsertClientDocument): Promise<ClientDocument> {
    const [created] = await this.db
      .insert(clientDocuments)
      .values(document)
      .returning();
    return created;
  }

  async deleteClientDocument(id: number): Promise<boolean> {
    const result = await this.db
      .delete(clientDocuments)
      .where(eq(clientDocuments.id, id))
      .returning();
    return result.length > 0;
  }

  async createEmployeePackage(data: any): Promise<any> {
    try {
      const packageData = {
        user_id: data.user_id,
        package_type: data.package_type,
        quantity: data.quantity,
        price: data.price,
        status: data.status || 'ativo',
        payment_id: data.payment_id || null,
        data_compra: new Date().toISOString(),
        data_vencimento: data.data_vencimento,
        data_cancelamento: data.data_cancelamento || null,
      };

      const result = await this.db.execute(sql`
        INSERT INTO employee_packages (
          user_id, package_type, quantity, price, status, 
          payment_id, data_compra, data_vencimento, data_cancelamento
        ) VALUES (
          ${packageData.user_id}, ${packageData.package_type}, 
          ${packageData.quantity}, ${packageData.price}, ${packageData.status},
          ${packageData.payment_id}, ${packageData.data_compra}, 
          ${packageData.data_vencimento}, ${packageData.data_cancelamento}
        )
        RETURNING *
      `);

      return result.rows[0];
    } catch (error) {
      logger.error('[DB] Erro ao criar pacote de funcionários:', { error });
      throw error;
    }
  }

  async getEmployeePackages(userId: string): Promise<any[]> {
    try {
      const result = await this.db.execute(sql`
        SELECT * FROM employee_packages 
        WHERE user_id = ${userId} 
        ORDER BY data_compra DESC
      `);
      return result.rows;
    } catch (error) {
      logger.error('[DB] Erro ao buscar pacotes de funcionários:', { error });
      return [];
    }
  }

  async updateEmployeePackageStatus(packageId: number, status: string, dataCancelamento?: string): Promise<any> {
    try {
      const updateFields: any = { status };
      if (dataCancelamento) {
        updateFields.data_cancelamento = dataCancelamento;
      }

      const [result] = await this.db
        .update(employeePackages)
        .set(updateFields)
        .where(eq(employeePackages.id, packageId))
        .returning();

      logger.info('[DB] Status do pacote de funcionários atualizado', { packageId, status });
      return result;
    } catch (error: any) {
      logger.error('[DB] Erro ao atualizar status do pacote:', { error: error.message, packageId, status });
      throw error;
    }
  }

  async getAllEmployeePackages(): Promise<any[]> {
    try {
      const result = await this.db.execute(sql`
        SELECT * FROM employee_packages 
        ORDER BY data_compra DESC
      `);
      return result.rows;
    } catch (error) {
      logger.error('[DB] Erro ao buscar todos os pacotes de funcionários:', { error });
      return [];
    }
  }

  async deleteEmployeePackage(packageId: number): Promise<boolean> {
    try {
      const result = await this.db
        .delete(employeePackages)
        .where(eq(employeePackages.id, packageId))
        .returning();
      
      logger.info('[DB] Pacote de funcionários deletado', { packageId });
      return result.length > 0;
    } catch (error: any) {
      logger.error('[DB] Erro ao deletar pacote de funcionários:', { error: error.message, packageId });
      return false;
    }
  }

  async getClientInteractions(userId: string, limit = 50, offset = 0): Promise<ClientInteraction[]> {
    const results = await this.db
      .select()
      .from(clientInteractions)
      .where(eq(clientInteractions.user_id, userId))
      .orderBy(desc(clientInteractions.created_at))
      .limit(limit)
      .offset(offset);
    return results;
  }

  async createClientInteraction(interaction: InsertClientInteraction): Promise<ClientInteraction> {
    const [created] = await this.db
      .insert(clientInteractions)
      .values(interaction)
      .returning();
    return created;
  }

  async getPlanChangesHistory(userId: string, limit = 50, offset = 0): Promise<PlanChangeHistory[]> {
    const results = await this.db
      .select()
      .from(planChangesHistory)
      .where(eq(planChangesHistory.user_id, userId))
      .orderBy(desc(planChangesHistory.changed_at))
      .limit(limit)
      .offset(offset);
    return results;
  }

  async createPlanChangeHistory(change: InsertPlanChangeHistory): Promise<PlanChangeHistory> {
    const [created] = await this.db
      .insert(planChangesHistory)
      .values(change)
      .returning();
    return created;
  }

  async getClientCommunications(userId: string, limit = 50, offset = 0): Promise<ClientCommunication[]> {
    const results = await this.db
      .select()
      .from(clientCommunications)
      .where(eq(clientCommunications.user_id, userId))
      .orderBy(desc(clientCommunications.sent_at))
      .limit(limit)
      .offset(offset);
    return results;
  }

  async createClientCommunication(communication: InsertClientCommunication): Promise<ClientCommunication> {
    const [created] = await this.db
      .insert(clientCommunications)
      .values(communication)
      .returning();
    return created;
  }

  async getClientTimeline(userId: string, limit = 50, offset = 0): Promise<any[]> {
    // Query usando UNION ALL para combinar todas as tabelas de eventos do cliente
    const timeline = await this.db.execute(sql`
      SELECT 
        'note' as event_type,
        id,
        admin_id as actor_id,
        content as description,
        NULL::text as subject,
        NULL::jsonb as metadata,
        created_at as event_date
      FROM client_notes
      WHERE user_id = ${userId}

      UNION ALL

      SELECT 
        'document' as event_type,
        id,
        admin_id as actor_id,
        file_name as description,
        description as subject,
        jsonb_build_object('file_url', file_url, 'file_type', file_type, 'file_size', file_size) as metadata,
        uploaded_at as event_date
      FROM client_documents
      WHERE user_id = ${userId}

      UNION ALL

      SELECT 
        'interaction' as event_type,
        id,
        admin_id as actor_id,
        description,
        interaction_type as subject,
        metadata,
        created_at as event_date
      FROM client_interactions
      WHERE user_id = ${userId}

      UNION ALL

      SELECT 
        'plan_change' as event_type,
        id,
        changed_by as actor_id,
        CONCAT('De ', COALESCE(from_plan, 'nenhum'), ' para ', to_plan) as description,
        reason as subject,
        metadata,
        changed_at as event_date
      FROM plan_changes_history
      WHERE user_id = ${userId}

      UNION ALL

      SELECT 
        'communication' as event_type,
        id,
        admin_id as actor_id,
        content as description,
        subject,
        jsonb_build_object('type', type) as metadata,
        sent_at as event_date
      FROM client_communications
      WHERE user_id = ${userId}

      ORDER BY event_date DESC
      LIMIT ${limit} OFFSET ${offset}
    `);

    return timeline.rows;
  }

  // Métodos para códigos de reset de senha
  async createPasswordResetCode(email: string, code: string, expiresAt: string): Promise<void> {
    await this.db.execute(sql`
      INSERT INTO password_reset_codes (email, code, expires_at, used) 
      VALUES (${email}, ${code}, ${expiresAt}, false)
    `);
  }

  async getPasswordResetCode(email: string): Promise<{ code: string; expires_at: string } | null> {
    const result = await this.db.execute(sql`
      SELECT code, expires_at 
      FROM password_reset_codes 
      WHERE email = ${email} AND used = false 
      ORDER BY created_at DESC 
      LIMIT 1
    `);

    return result.rows[0] as any || null;
  }

  async markPasswordResetCodeAsUsed(email: string, code: string): Promise<void> {
    await this.db.execute(sql`
      UPDATE password_reset_codes 
      SET used = true 
      WHERE email = ${email} AND code = ${code}
    `);
  }

  // Métodos para System Owner (Dono do Sistema)
  async getSystemOwner(): Promise<any | undefined> {
    try {
      const result = await this.db.execute(sql`
        SELECT * FROM system_owner LIMIT 1
      `);
      return result.rows[0];
    } catch (error) {
      logger.error('[DB] Erro ao buscar system owner:', { error });
      return undefined;
    }
  }

  async setSystemOwner(data: any): Promise<any> {
    try {
      const existing = await this.getSystemOwner();

      if (existing) {
        // Atualizar existente
        const result = await this.db.execute(sql`
          UPDATE system_owner 
          SET owner_user_id = ${data.owner_user_id},
              observacoes = ${data.observacoes || null}
          WHERE id = ${existing.id}
          RETURNING *
        `);
        logger.info('[DB] System owner atualizado', { owner_user_id: data.owner_user_id });
        return result.rows[0];
      } else {
        // Criar novo
        const result = await this.db.execute(sql`
          INSERT INTO system_owner (owner_user_id, data_configuracao, observacoes)
          VALUES (${data.owner_user_id}, ${new Date().toISOString()}, ${data.observacoes || null})
          RETURNING *
        `);
        logger.info('[DB] System owner criado', { owner_user_id: data.owner_user_id });
        return result.rows[0];
      }
    } catch (error) {
      logger.error('[DB] Erro ao configurar system owner:', { error });
      throw error;
    }
  }

  // ============================================
  // MÉTODOS PARA SESSÕES E FINGERPRINTING
  // ============================================

  async createSession(data: {
    user_id: string;
    user_type: string;
    session_token: string;
    device_fingerprint: string;
    device_info?: any;
    ip_address?: string;
    user_agent?: string;
    expires_at: Date;
  }): Promise<any> {
    try {
      const result = await this.db.execute(sql`
        INSERT INTO user_sessions (
          user_id, user_type, session_token, device_fingerprint,
          device_info, ip_address, user_agent, expires_at, is_active
        ) VALUES (
          ${data.user_id},
          ${data.user_type},
          ${data.session_token},
          ${data.device_fingerprint},
          ${JSON.stringify(data.device_info || {})}::jsonb,
          ${data.ip_address || null},
          ${data.user_agent || null},
          ${data.expires_at.toISOString()},
          'true'
        )
        RETURNING *
      `);
      logger.info('[SESSION] Nova sessão criada', { 
        userId: data.user_id, 
        userType: data.user_type,
        fingerprint: data.device_fingerprint.substring(0, 16) + '...'
      });
      return result.rows[0];
    } catch (error) {
      logger.error('[SESSION] Erro ao criar sessão:', { error });
      throw error;
    }
  }

  async getSessionByToken(token: string): Promise<any | undefined> {
    try {
      const result = await this.db.execute(sql`
        SELECT * FROM user_sessions 
        WHERE session_token = ${token} AND is_active = 'true'
        LIMIT 1
      `);
      return result.rows[0];
    } catch (error) {
      logger.error('[SESSION] Erro ao buscar sessão:', { error });
      return undefined;
    }
  }

  async getActiveSessionsByUser(userId: string, userType?: string): Promise<any[]> {
    try {
      if (userType) {
        const result = await this.db.execute(sql`
          SELECT * FROM user_sessions 
          WHERE user_id = ${userId} 
            AND user_type = ${userType}
            AND is_active = 'true'
            AND expires_at > NOW()
          ORDER BY created_at DESC
        `);
        return result.rows as any[];
      } else {
        const result = await this.db.execute(sql`
          SELECT * FROM user_sessions 
          WHERE user_id = ${userId} 
            AND is_active = 'true'
            AND expires_at > NOW()
          ORDER BY created_at DESC
        `);
        return result.rows as any[];
      }
    } catch (error) {
      logger.error('[SESSION] Erro ao buscar sessões ativas:', { error });
      return [];
    }
  }

  async getActiveSessionCount(userId: string, userType?: string): Promise<number> {
    try {
      const sessions = await this.getActiveSessionsByUser(userId, userType);
      return sessions.length;
    } catch (error) {
      logger.error('[SESSION] Erro ao contar sessões:', { error });
      return 0;
    }
  }

  async updateSessionActivity(token: string): Promise<void> {
    try {
      await this.db.execute(sql`
        UPDATE user_sessions 
        SET last_activity = NOW()
        WHERE session_token = ${token} AND is_active = 'true'
      `);
    } catch (error) {
      logger.error('[SESSION] Erro ao atualizar atividade:', { error });
    }
  }

  async invalidateSession(token: string): Promise<void> {
    try {
      await this.db.execute(sql`
        UPDATE user_sessions 
        SET is_active = 'false'
        WHERE session_token = ${token}
      `);
      logger.info('[SESSION] Sessão invalidada', { token: token.substring(0, 16) + '...' });
    } catch (error) {
      logger.error('[SESSION] Erro ao invalidar sessão:', { error });
    }
  }

  async invalidateAllUserSessions(userId: string, userType?: string): Promise<void> {
    try {
      if (userType) {
        await this.db.execute(sql`
          UPDATE user_sessions 
          SET is_active = 'false'
          WHERE user_id = ${userId} AND user_type = ${userType}
        `);
      } else {
        await this.db.execute(sql`
          UPDATE user_sessions 
          SET is_active = 'false'
          WHERE user_id = ${userId}
        `);
      }
      logger.info('[SESSION] Todas as sessões invalidadas', { userId, userType });
    } catch (error) {
      logger.error('[SESSION] Erro ao invalidar sessões:', { error });
    }
  }

  async invalidateOldestSession(userId: string, userType?: string): Promise<void> {
    try {
      if (userType) {
        await this.db.execute(sql`
          UPDATE user_sessions 
          SET is_active = 'false'
          WHERE id = (
            SELECT id FROM user_sessions 
            WHERE user_id = ${userId} 
              AND user_type = ${userType}
              AND is_active = 'true'
            ORDER BY created_at ASC
            LIMIT 1
          )
        `);
      } else {
        await this.db.execute(sql`
          UPDATE user_sessions 
          SET is_active = 'false'
          WHERE id = (
            SELECT id FROM user_sessions 
            WHERE user_id = ${userId} AND is_active = 'true'
            ORDER BY created_at ASC
            LIMIT 1
          )
        `);
      }
      logger.info('[SESSION] Sessão mais antiga invalidada', { userId, userType });
    } catch (error) {
      logger.error('[SESSION] Erro ao invalidar sessão antiga:', { error });
    }
  }

  async cleanExpiredSessions(): Promise<number> {
    try {
      const result = await this.db.execute(sql`
        UPDATE user_sessions 
        SET is_active = 'false'
        WHERE expires_at < NOW() AND is_active = 'true'
        RETURNING id
      `);
      const count = result.rows.length;
      if (count > 0) {
        logger.info('[SESSION] Sessões expiradas limpas', { count });
      }
      return count;
    } catch (error) {
      logger.error('[SESSION] Erro ao limpar sessões expiradas:', { error });
      return 0;
    }
  }
}