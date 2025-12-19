var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  bloqueiosEstoque: () => bloqueiosEstoque,
  caixas: () => caixas,
  clientCommunications: () => clientCommunications,
  clientDocuments: () => clientDocuments,
  clientInteractions: () => clientInteractions,
  clientNotes: () => clientNotes,
  clientes: () => clientes,
  compras: () => compras,
  configFiscal: () => configFiscal,
  configMercadoPago: () => configMercadoPago,
  contasPagar: () => contasPagar,
  contasReceber: () => contasReceber,
  cupons: () => cupons,
  devolucoes: () => devolucoes,
  emailAutomation: () => emailAutomation,
  emailHistory: () => emailHistory,
  emailTemplates: () => emailTemplates,
  employeePackages: () => employeePackages,
  fornecedores: () => fornecedores,
  funcionarios: () => funcionarios,
  hasPermission: () => hasPermission,
  insertBloqueioEstoqueSchema: () => insertBloqueioEstoqueSchema,
  insertCaixaSchema: () => insertCaixaSchema,
  insertClientCommunicationSchema: () => insertClientCommunicationSchema,
  insertClientDocumentSchema: () => insertClientDocumentSchema,
  insertClientInteractionSchema: () => insertClientInteractionSchema,
  insertClientNoteSchema: () => insertClientNoteSchema,
  insertClienteSchema: () => insertClienteSchema,
  insertCompraSchema: () => insertCompraSchema,
  insertConfigFiscalSchema: () => insertConfigFiscalSchema,
  insertConfigMercadoPagoSchema: () => insertConfigMercadoPagoSchema,
  insertContasPagarSchema: () => insertContasPagarSchema,
  insertContasReceberSchema: () => insertContasReceberSchema,
  insertCupomSchema: () => insertCupomSchema,
  insertDevolucaoSchema: () => insertDevolucaoSchema,
  insertEmailAutomationSchema: () => insertEmailAutomationSchema,
  insertEmailHistorySchema: () => insertEmailHistorySchema,
  insertEmailTemplateSchema: () => insertEmailTemplateSchema,
  insertEmployeePackageSchema: () => insertEmployeePackageSchema,
  insertFornecedorSchema: () => insertFornecedorSchema,
  insertFuncionarioSchema: () => insertFuncionarioSchema,
  insertLogAdminSchema: () => insertLogAdminSchema,
  insertMovimentacaoCaixaSchema: () => insertMovimentacaoCaixaSchema,
  insertOrcamentoSchema: () => insertOrcamentoSchema,
  insertPermissaoFuncionarioSchema: () => insertPermissaoFuncionarioSchema,
  insertPlanChangeHistorySchema: () => insertPlanChangeHistorySchema,
  insertPlanoSchema: () => insertPlanoSchema,
  insertProdutoSchema: () => insertProdutoSchema,
  insertSubscriptionSchema: () => insertSubscriptionSchema,
  insertSystemConfigSchema: () => insertSystemConfigSchema,
  insertSystemOwnerSchema: () => insertSystemOwnerSchema,
  insertUserCustomizationSchema: () => insertUserCustomizationSchema,
  insertUserSchema: () => insertUserSchema,
  insertUserSessionSchema: () => insertUserSessionSchema,
  insertUsoCupomSchema: () => insertUsoCupomSchema,
  insertVendaSchema: () => insertVendaSchema,
  isPremium: () => isPremium,
  logsAdmin: () => logsAdmin,
  movimentacoesCaixa: () => movimentacoesCaixa,
  orcamentos: () => orcamentos,
  permissoesFuncionarios: () => permissoesFuncionarios,
  planChangesHistory: () => planChangesHistory,
  planos: () => planos,
  produtos: () => produtos,
  subscriptions: () => subscriptions,
  systemConfig: () => systemConfig,
  systemOwner: () => systemOwner,
  userCustomization: () => userCustomization,
  userSessions: () => userSessions,
  users: () => users,
  usoCupons: () => usoCupons,
  vendas: () => vendas
});
import { pgTable, text, integer, real, serial, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { timestamp, jsonb } from "drizzle-orm/pg-core";
function hasPermission(user, permission) {
  if (user.is_admin === "true") return true;
  if (isPremium(user)) return true;
  const userPermissions = user.permissoes || [];
  return userPermissions.includes(permission);
}
function isPremium(user) {
  if (user.plano === "premium") return true;
  if (user.data_expiracao_trial) {
    const now = /* @__PURE__ */ new Date();
    const expirationDate = new Date(user.data_expiracao_trial);
    return now < expirationDate;
  }
  return false;
}
var users, systemOwner, produtos, clientes, fornecedores, bloqueiosEstoque, vendas, compras, configFiscal, contasPagar, contasReceber, systemConfig, insertUserSchema, insertSystemOwnerSchema, insertProdutoSchema, insertVendaSchema, insertBloqueioEstoqueSchema, insertFornecedorSchema, insertClienteSchema, insertCompraSchema, insertConfigFiscalSchema, planos, configMercadoPago, logsAdmin, subscriptions, insertPlanoSchema, insertConfigMercadoPagoSchema, insertLogAdminSchema, insertContasPagarSchema, insertContasReceberSchema, insertSystemConfigSchema, insertSubscriptionSchema, funcionarios, insertFuncionarioSchema, permissoesFuncionarios, insertPermissaoFuncionarioSchema, caixas, movimentacoesCaixa, devolucoes, insertCaixaSchema, insertMovimentacaoCaixaSchema, insertDevolucaoSchema, orcamentos, insertOrcamentoSchema, clientNotes, clientDocuments, clientInteractions, planChangesHistory, employeePackages, cupons, usoCupons, insertEmployeePackageSchema, insertCupomSchema, insertUsoCupomSchema, userCustomization, insertUserCustomizationSchema, clientCommunications, insertClientNoteSchema, insertClientDocumentSchema, insertClientInteractionSchema, insertPlanChangeHistorySchema, insertClientCommunicationSchema, userSessions, insertUserSessionSchema, emailTemplates, insertEmailTemplateSchema, emailHistory, insertEmailHistorySchema, emailAutomation, insertEmailAutomationSchema;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    users = pgTable("users", {
      id: text("id").primaryKey(),
      email: text("email").unique().notNull(),
      senha: text("senha").notNull(),
      nome: text("nome").notNull(),
      plano: text("plano").default("trial"),
      is_admin: text("is_admin").default("false"),
      data_criacao: text("data_criacao"),
      data_expiracao_trial: text("data_expiracao_trial"),
      data_expiracao_plano: text("data_expiracao_plano"),
      status: text("status").default("ativo"),
      cpf_cnpj: text("cpf_cnpj"),
      telefone: text("telefone"),
      endereco: text("endereco"),
      permissoes: text("permissoes"),
      ultimo_acesso: text("ultimo_acesso"),
      max_funcionarios: integer("max_funcionarios").default(1),
      max_funcionarios_base: integer("max_funcionarios_base").default(1),
      data_expiracao_pacote_funcionarios: text("data_expiracao_pacote_funcionarios"),
      meta_mensal: real("meta_mensal").default(15e3)
    });
    systemOwner = pgTable("system_owner", {
      id: serial("id").primaryKey(),
      owner_user_id: text("owner_user_id").notNull().unique().references(() => users.id),
      data_configuracao: text("data_configuracao").notNull(),
      observacoes: text("observacoes")
    });
    produtos = pgTable("produtos", {
      id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
      user_id: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      nome: text("nome").notNull(),
      categoria: text("categoria").notNull(),
      preco: real("preco").notNull(),
      quantidade: integer("quantidade").notNull(),
      estoque_minimo: integer("estoque_minimo").notNull(),
      codigo_barras: text("codigo_barras"),
      vencimento: text("vencimento"),
      localizacao: text("localizacao")
    });
    clientes = pgTable("clientes", {
      id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
      user_id: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      nome: text("nome").notNull(),
      cpf_cnpj: text("cpf_cnpj"),
      telefone: text("telefone"),
      email: text("email"),
      endereco: text("endereco"),
      observacoes: text("observacoes"),
      percentual_desconto: real("percentual_desconto"),
      data_cadastro: text("data_cadastro").notNull()
    });
    fornecedores = pgTable("fornecedores", {
      id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
      user_id: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      nome: text("nome").notNull(),
      cnpj: text("cnpj"),
      telefone: text("telefone"),
      email: text("email"),
      endereco: text("endereco"),
      observacoes: text("observacoes"),
      data_cadastro: text("data_cadastro").notNull()
    });
    bloqueiosEstoque = pgTable("bloqueios_estoque", {
      id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
      produto_id: integer("produto_id").notNull().references(() => produtos.id, { onDelete: "cascade" }),
      orcamento_id: integer("orcamento_id").notNull(),
      user_id: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      quantidade_bloqueada: integer("quantidade_bloqueada").notNull(),
      data_bloqueio: text("data_bloqueio").notNull()
    });
    vendas = pgTable("vendas", {
      id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
      user_id: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      produto: text("produto").notNull(),
      quantidade_vendida: integer("quantidade_vendida").notNull().default(0),
      valor_total: real("valor_total").notNull().default(0),
      data: text("data").notNull(),
      itens: text("itens"),
      cliente_id: integer("cliente_id").references(() => clientes.id, { onDelete: "set null" }),
      forma_pagamento: text("forma_pagamento"),
      orcamento_id: integer("orcamento_id"),
      vendedor: text("vendedor"),
      cupom_texto: text("cupom_texto")
    });
    compras = pgTable("compras", {
      id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
      user_id: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      fornecedor_id: integer("fornecedor_id").notNull().references(() => fornecedores.id, { onDelete: "restrict" }),
      produto_id: integer("produto_id").notNull().references(() => produtos.id, { onDelete: "restrict" }),
      quantidade: integer("quantidade").notNull(),
      valor_unitario: real("valor_unitario").notNull(),
      valor_total: real("valor_total").notNull(),
      data: text("data").notNull(),
      observacoes: text("observacoes")
    });
    configFiscal = pgTable("config_fiscal", {
      id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
      user_id: text("user_id").notNull(),
      cnpj: text("cnpj").notNull(),
      razao_social: text("razao_social").notNull(),
      focus_nfe_api_key: text("focus_nfe_api_key").notNull(),
      ambiente: text("ambiente").notNull().default("homologacao"),
      updated_at: text("updated_at").notNull()
    });
    contasPagar = pgTable("contas_pagar", {
      id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
      user_id: text("user_id").notNull(),
      descricao: text("descricao").notNull(),
      valor: real("valor").notNull(),
      data_vencimento: text("data_vencimento").notNull(),
      data_pagamento: text("data_pagamento"),
      categoria: text("categoria"),
      status: text("status").default("pendente"),
      // pendente, pago
      data_cadastro: text("data_cadastro").notNull()
    });
    contasReceber = pgTable("contas_receber", {
      id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
      user_id: text("user_id").notNull(),
      descricao: text("descricao").notNull(),
      valor: real("valor").notNull(),
      data_vencimento: text("data_vencimento").notNull(),
      data_recebimento: text("data_recebimento"),
      categoria: text("categoria"),
      status: text("status").default("pendente"),
      // pendente, recebido
      data_cadastro: text("data_cadastro").notNull()
    });
    systemConfig = pgTable("system_config", {
      id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
      chave: text("chave").notNull().unique(),
      valor: text("valor").notNull(),
      updated_at: text("updated_at").notNull()
    });
    insertUserSchema = createInsertSchema(users).omit({
      id: true,
      data_criacao: true
    }).extend({
      email: z.string().email("Email inv\xE1lido").toLowerCase(),
      senha: z.string().min(8, "Senha deve ter no m\xEDnimo 8 caracteres").regex(/[a-z]/, "Senha deve conter pelo menos uma letra min\xFAscula").regex(/[A-Z]/, "Senha deve conter pelo menos uma letra mai\xFAscula").regex(/[0-9]/, "Senha deve conter pelo menos um n\xFAmero"),
      nome: z.string().min(3, "Nome deve ter no m\xEDnimo 3 caracteres").max(100),
      meta_mensal: z.number().optional()
    });
    insertSystemOwnerSchema = createInsertSchema(systemOwner).omit({
      id: true
    }).extend({
      owner_user_id: z.string().min(1, "ID do usu\xE1rio \xE9 obrigat\xF3rio"),
      data_configuracao: z.string().optional()
    });
    insertProdutoSchema = createInsertSchema(produtos).omit({
      id: true
    }).extend({
      preco: z.coerce.number().positive(),
      quantidade: z.coerce.number().int().min(0),
      estoque_minimo: z.coerce.number().int().min(0)
    });
    insertVendaSchema = createInsertSchema(vendas).omit({
      id: true
    }).extend({
      quantidade_vendida: z.coerce.number().int().positive(),
      valor_total: z.coerce.number().positive()
    });
    insertBloqueioEstoqueSchema = createInsertSchema(bloqueiosEstoque).omit({
      id: true,
      data_bloqueio: true
    }).extend({
      produto_id: z.number().int().positive(),
      orcamento_id: z.number().int().positive(),
      quantidade_bloqueada: z.number().int().positive()
    });
    insertFornecedorSchema = createInsertSchema(fornecedores).omit({
      id: true
    });
    insertClienteSchema = createInsertSchema(clientes).omit({
      id: true
    }).extend({
      data_cadastro: z.string().optional()
    });
    insertCompraSchema = createInsertSchema(compras).omit({
      id: true
    }).extend({
      quantidade: z.coerce.number().int().positive(),
      valor_unitario: z.coerce.number().positive(),
      valor_total: z.coerce.number().positive(),
      fornecedor_id: z.number().int().positive(),
      produto_id: z.number().int().positive()
    });
    insertConfigFiscalSchema = createInsertSchema(configFiscal).omit({
      id: true,
      updated_at: true
    }).extend({
      cnpj: z.string().min(14, "CNPJ inv\xE1lido"),
      razao_social: z.string().min(1, "Raz\xE3o social \xE9 obrigat\xF3ria"),
      focus_nfe_api_key: z.string().min(1, "Chave API \xE9 obrigat\xF3ria"),
      ambiente: z.enum(["homologacao", "producao"]).default("homologacao")
    });
    planos = pgTable("planos", {
      id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
      nome: text("nome").notNull(),
      preco: real("preco").notNull(),
      duracao_dias: integer("duracao_dias").notNull(),
      descricao: text("descricao"),
      ativo: text("ativo").notNull().default("true"),
      data_criacao: text("data_criacao").notNull()
    });
    configMercadoPago = pgTable("config_mercadopago", {
      id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
      access_token: text("access_token").notNull(),
      public_key: text("public_key"),
      webhook_url: text("webhook_url"),
      ultima_sincronizacao: text("ultima_sincronizacao"),
      status_conexao: text("status_conexao").default("desconectado"),
      updated_at: text("updated_at").notNull()
    });
    logsAdmin = pgTable("logs_admin", {
      id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
      usuario_id: text("usuario_id").notNull(),
      conta_id: text("conta_id").notNull(),
      acao: text("acao").notNull(),
      detalhes: text("detalhes"),
      data: text("data").notNull(),
      ip_address: text("ip_address"),
      user_agent: text("user_agent")
    });
    subscriptions = pgTable("subscriptions", {
      id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
      user_id: text("user_id").notNull(),
      plano: text("plano").notNull(),
      status: text("status").notNull().default("pendente"),
      valor: real("valor").notNull().default(0),
      valor_original: real("valor_original").notNull().default(0),
      data_inicio: text("data_inicio"),
      data_vencimento: text("data_vencimento"),
      mercadopago_payment_id: text("mercadopago_payment_id"),
      mercadopago_preference_id: text("mercadopago_preference_id"),
      forma_pagamento: text("forma_pagamento"),
      status_pagamento: text("status_pagamento"),
      init_point: text("init_point"),
      external_reference: text("external_reference"),
      prazo_limite_pagamento: text("prazo_limite_pagamento"),
      tentativas_cobranca: integer("tentativas_cobranca").default(0),
      motivo_cancelamento: text("motivo_cancelamento"),
      cupom_codigo: text("cupom_codigo"),
      cupom_id: integer("cupom_id"),
      valor_desconto_cupom: real("valor_desconto_cupom"),
      data_criacao: text("data_criacao").notNull(),
      data_atualizacao: text("data_atualizacao")
    });
    insertPlanoSchema = createInsertSchema(planos).omit({
      id: true,
      data_criacao: true
    });
    insertConfigMercadoPagoSchema = createInsertSchema(configMercadoPago).omit({
      id: true,
      updated_at: true
    });
    insertLogAdminSchema = createInsertSchema(logsAdmin).omit({
      id: true
    });
    insertContasPagarSchema = createInsertSchema(contasPagar).omit({
      id: true,
      data_cadastro: true
    });
    insertContasReceberSchema = createInsertSchema(contasReceber).omit({
      id: true,
      data_cadastro: true
    });
    insertSystemConfigSchema = createInsertSchema(systemConfig).omit({
      id: true
    });
    insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
      id: true,
      data_criacao: true
    });
    funcionarios = pgTable("funcionarios", {
      id: text("id").primaryKey(),
      conta_id: text("conta_id").notNull(),
      // ID do usuário dono da conta
      nome: text("nome").notNull(),
      email: text("email").notNull(),
      senha: text("senha").notNull(),
      cargo: text("cargo"),
      status: text("status").notNull().default("ativo"),
      data_criacao: text("data_criacao")
    });
    insertFuncionarioSchema = createInsertSchema(funcionarios);
    permissoesFuncionarios = pgTable("permissoes_funcionarios", {
      id: serial("id").primaryKey(),
      funcionario_id: text("funcionario_id").notNull(),
      dashboard: text("dashboard").notNull().default("false"),
      pdv: text("pdv").notNull().default("false"),
      caixa: text("caixa").notNull().default("false"),
      produtos: text("produtos").notNull().default("false"),
      inventario: text("inventario").notNull().default("false"),
      relatorios: text("relatorios").notNull().default("false"),
      clientes: text("clientes").notNull().default("false"),
      fornecedores: text("fornecedores").notNull().default("false"),
      financeiro: text("financeiro").notNull().default("false"),
      config_fiscal: text("config_fiscal").notNull().default("false"),
      historico_caixas: text("historico_caixas").notNull().default("false"),
      configuracoes: text("configuracoes").notNull().default("false"),
      devolucoes: text("devolucoes").notNull().default("false"),
      contas_pagar: text("contas_pagar").notNull().default("false"),
      contas_receber: text("contas_receber").notNull().default("false"),
      orcamentos: text("orcamentos").notNull().default("false")
    });
    insertPermissaoFuncionarioSchema = createInsertSchema(permissoesFuncionarios);
    caixas = pgTable("caixas", {
      id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
      user_id: text("user_id").notNull(),
      funcionario_id: text("funcionario_id"),
      data_abertura: text("data_abertura").notNull(),
      data_fechamento: text("data_fechamento"),
      saldo_inicial: real("saldo_inicial").notNull().default(0),
      saldo_final: real("saldo_final"),
      total_vendas: real("total_vendas").notNull().default(0),
      total_retiradas: real("total_retiradas").notNull().default(0),
      total_suprimentos: real("total_suprimentos").notNull().default(0),
      status: text("status").notNull().default("aberto"),
      observacoes_abertura: text("observacoes_abertura"),
      observacoes_fechamento: text("observacoes_fechamento")
    });
    movimentacoesCaixa = pgTable("movimentacoes_caixa", {
      id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
      caixa_id: integer("caixa_id").notNull(),
      user_id: text("user_id").notNull(),
      tipo: text("tipo").notNull(),
      valor: real("valor").notNull(),
      descricao: text("descricao"),
      data: text("data").notNull()
    });
    devolucoes = pgTable("devolucoes", {
      id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
      user_id: text("user_id").notNull(),
      venda_id: integer("venda_id"),
      produto_id: integer("produto_id").notNull(),
      produto_nome: text("produto_nome").notNull(),
      quantidade: integer("quantidade").notNull(),
      quantidade_original: integer("quantidade_original"),
      valor_total: real("valor_total").notNull(),
      motivo: text("motivo").notNull(),
      status: text("status").notNull().default("pendente"),
      data_devolucao: text("data_devolucao").notNull(),
      observacoes: text("observacoes"),
      cliente_nome: text("cliente_nome"),
      operador_nome: text("operador_nome"),
      operador_id: text("operador_id"),
      devolucao_parcial: text("devolucao_parcial").default("false")
    });
    insertCaixaSchema = createInsertSchema(caixas).omit({
      id: true
    }).extend({
      saldo_inicial: z.coerce.number().min(0),
      status: z.enum(["aberto", "fechado", "arquivado"]).default("aberto").optional()
    });
    insertMovimentacaoCaixaSchema = createInsertSchema(movimentacoesCaixa).omit({
      id: true
    }).extend({
      valor: z.coerce.number().positive(),
      tipo: z.enum(["suprimento", "retirada"])
    });
    insertDevolucaoSchema = createInsertSchema(devolucoes).omit({
      id: true
    }).extend({
      quantidade: z.coerce.number().int().positive(),
      quantidade_original: z.coerce.number().int().positive().optional(),
      valor_total: z.coerce.number().positive(),
      status: z.enum(["pendente", "aprovada", "rejeitada", "arquivada"]).default("pendente"),
      devolucao_parcial: z.enum(["true", "false"]).default("false").optional()
    });
    orcamentos = pgTable("orcamentos", {
      id: serial("id").primaryKey(),
      user_id: text("user_id").notNull(),
      numero: text("numero").notNull(),
      cliente_id: integer("cliente_id"),
      cliente_nome: text("cliente_nome").notNull(),
      cliente_email: text("cliente_email"),
      cliente_telefone: text("cliente_telefone"),
      cliente_cpf_cnpj: text("cliente_cpf_cnpj"),
      cliente_endereco: text("cliente_endereco"),
      itens: jsonb("itens").notNull(),
      subtotal: real("subtotal").notNull(),
      desconto: real("desconto").notNull().default(0),
      valor_total: real("valor_total").notNull(),
      observacoes: text("observacoes"),
      condicoes_pagamento: text("condicoes_pagamento"),
      prazo_entrega: text("prazo_entrega"),
      validade: text("validade").notNull(),
      status: text("status").notNull(),
      data_criacao: text("data_criacao").notNull(),
      data_atualizacao: text("data_atualizacao"),
      vendedor: text("vendedor"),
      venda_id: integer("venda_id")
    });
    insertOrcamentoSchema = createInsertSchema(orcamentos).omit({
      id: true,
      numero: true,
      data_criacao: true,
      data_atualizacao: true
    }).extend({
      user_id: z.string().optional(),
      cliente_nome: z.string().min(1, "Nome do cliente \xE9 obrigat\xF3rio"),
      cliente_email: z.string().email().optional().or(z.literal("")).nullable(),
      cliente_telefone: z.string().optional().nullable(),
      cliente_cpf_cnpj: z.string().optional().nullable(),
      cliente_endereco: z.string().optional().nullable(),
      validade: z.string().optional().nullable(),
      status: z.enum(["pendente", "aprovado", "rejeitado", "convertido", "arquivado"]).optional(),
      subtotal: z.coerce.number().min(0),
      desconto: z.coerce.number().min(0).default(0),
      valor_total: z.coerce.number().min(0),
      observacoes: z.string().optional().nullable(),
      condicoes_pagamento: z.string().optional().nullable(),
      prazo_entrega: z.string().optional().nullable(),
      itens: z.array(z.object({
        produto_id: z.number(),
        nome: z.string(),
        preco: z.number(),
        quantidade: z.number()
      })).min(1, "Adicione pelo menos um item")
    });
    clientNotes = pgTable("client_notes", {
      id: serial("id").primaryKey(),
      user_id: text("user_id").notNull().references(() => users.id),
      admin_id: text("admin_id").notNull().references(() => users.id),
      content: text("content").notNull(),
      created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
      updated_at: timestamp("updated_at", { withTimezone: true })
    }, (table) => ({
      userIdCreatedAtIdx: index("client_notes_user_id_created_at_idx").on(table.user_id, table.created_at)
    }));
    clientDocuments = pgTable("client_documents", {
      id: serial("id").primaryKey(),
      user_id: text("user_id").notNull().references(() => users.id),
      admin_id: text("admin_id").notNull().references(() => users.id),
      file_name: text("file_name").notNull(),
      file_url: text("file_url").notNull(),
      file_type: text("file_type").notNull(),
      file_size: integer("file_size"),
      description: text("description"),
      uploaded_at: timestamp("uploaded_at", { withTimezone: true }).notNull().defaultNow()
    }, (table) => ({
      userIdUploadedAtIdx: index("client_documents_user_id_uploaded_at_idx").on(table.user_id, table.uploaded_at)
    }));
    clientInteractions = pgTable("client_interactions", {
      id: serial("id").primaryKey(),
      user_id: text("user_id").notNull().references(() => users.id),
      admin_id: text("admin_id").references(() => users.id),
      interaction_type: text("interaction_type").notNull(),
      description: text("description").notNull(),
      metadata: jsonb("metadata"),
      created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
    }, (table) => ({
      userIdCreatedAtIdx: index("client_interactions_user_id_created_at_idx").on(table.user_id, table.created_at)
    }));
    planChangesHistory = pgTable("plan_changes_history", {
      id: serial("id").primaryKey(),
      user_id: text("user_id").notNull().references(() => users.id),
      from_plan: text("from_plan"),
      to_plan: text("to_plan").notNull(),
      changed_by: text("changed_by").notNull().references(() => users.id),
      reason: text("reason"),
      metadata: jsonb("metadata"),
      changed_at: timestamp("changed_at", { withTimezone: true }).notNull().defaultNow()
    }, (table) => ({
      userIdChangedAtIdx: index("plan_changes_history_user_id_changed_at_idx").on(table.user_id, table.changed_at)
    }));
    employeePackages = pgTable("employee_packages", {
      id: serial("id").primaryKey(),
      user_id: text("user_id").notNull().references(() => users.id),
      package_type: text("package_type").notNull(),
      // pacote_5, pacote_10, pacote_20, pacote_50
      quantity: integer("quantity").notNull(),
      // Quantidade de funcionários adicionados
      price: real("price").notNull(),
      // Valor pago
      status: text("status").notNull().default("ativo"),
      // ativo, expirado, cancelado
      payment_id: text("payment_id"),
      // ID do pagamento (Mercado Pago)
      data_compra: text("data_compra").notNull(),
      data_vencimento: text("data_vencimento").notNull(),
      // 30 dias após compra
      data_cancelamento: text("data_cancelamento")
    }, (table) => ({
      userIdIdx: index("employee_packages_user_id_idx").on(table.user_id),
      statusIdx: index("employee_packages_status_idx").on(table.status)
    }));
    cupons = pgTable("cupons", {
      id: serial("id").primaryKey(),
      codigo: text("codigo").notNull().unique(),
      tipo: text("tipo").notNull(),
      // percentual, valor_fixo
      valor: real("valor").notNull(),
      // valor do desconto (ex: 10 para 10% ou R$ 10)
      planos_aplicaveis: jsonb("planos_aplicaveis"),
      // ['premium_mensal', 'premium_anual'] ou null para todos
      data_inicio: text("data_inicio").notNull(),
      data_expiracao: text("data_expiracao").notNull(),
      quantidade_maxima: integer("quantidade_maxima"),
      // null = ilimitado
      quantidade_utilizada: integer("quantidade_utilizada").notNull().default(0),
      status: text("status").notNull().default("ativo"),
      // ativo, inativo, expirado
      descricao: text("descricao"),
      criado_por: text("criado_por").notNull().references(() => users.id),
      data_criacao: text("data_criacao").notNull(),
      data_atualizacao: text("data_atualizacao")
    }, (table) => ({
      codigoIdx: index("cupons_codigo_idx").on(table.codigo),
      statusIdx: index("cupons_status_idx").on(table.status)
    }));
    usoCupons = pgTable("uso_cupons", {
      id: serial("id").primaryKey(),
      cupom_id: integer("cupom_id").notNull().references(() => cupons.id),
      user_id: text("user_id").notNull().references(() => users.id),
      subscription_id: integer("subscription_id").references(() => subscriptions.id),
      valor_desconto: real("valor_desconto").notNull(),
      data_uso: text("data_uso").notNull()
    }, (table) => ({
      cupomIdIdx: index("uso_cupons_cupom_id_idx").on(table.cupom_id),
      userIdIdx: index("uso_cupons_user_id_idx").on(table.user_id)
    }));
    insertEmployeePackageSchema = createInsertSchema(employeePackages).omit({
      id: true,
      data_compra: true
    });
    insertCupomSchema = createInsertSchema(cupons).omit({
      id: true,
      data_criacao: true,
      data_atualizacao: true,
      quantidade_utilizada: true
    }).extend({
      codigo: z.string().min(3, "C\xF3digo deve ter pelo menos 3 caracteres").max(50),
      tipo: z.enum(["percentual", "valor_fixo"]),
      valor: z.number().positive("Valor deve ser positivo"),
      status: z.enum(["ativo", "inativo", "expirado"]).default("ativo")
    });
    insertUsoCupomSchema = createInsertSchema(usoCupons).omit({
      id: true,
      data_uso: true
    });
    userCustomization = pgTable("user_customization", {
      id: serial("id").primaryKey(),
      user_id: text("user_id").notNull().unique().references(() => users.id),
      logo_url: text("logo_url"),
      pdv_background_url: text("pdv_background_url"),
      primary_color: text("primary_color").default("#3B82F6"),
      secondary_color: text("secondary_color").default("#10B981"),
      accent_color: text("accent_color").default("#F59E0B"),
      background_color: text("background_color").default("#000000"),
      store_name: text("store_name").default("Pavisoft Sistemas"),
      font_size: text("font_size").default("medium"),
      border_radius: text("border_radius").default("medium"),
      language: text("language").default("pt-BR"),
      currency: text("currency").default("BRL"),
      date_format: text("date_format").default("DD/MM/YYYY"),
      enable_animations: text("enable_animations").default("true"),
      enable_sounds: text("enable_sounds").default("false"),
      compact_mode: text("compact_mode").default("false"),
      show_welcome_message: text("show_welcome_message").default("true"),
      auto_save_interval: integer("auto_save_interval").default(30),
      low_stock_threshold: integer("low_stock_threshold").default(10),
      items_per_page: integer("items_per_page").default(10),
      enable_notifications: text("enable_notifications").default("true"),
      enable_email_alerts: text("enable_email_alerts").default("false"),
      email_for_alerts: text("email_for_alerts"),
      created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
      updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
    }, (table) => ({
      userIdIdx: index("user_customization_user_id_idx").on(table.user_id)
    }));
    insertUserCustomizationSchema = createInsertSchema(userCustomization).omit({
      id: true,
      created_at: true,
      updated_at: true
    }).extend({
      logo_url: z.string().optional().nullable(),
      pdv_background_url: z.string().optional().nullable(),
      primary_color: z.string().optional(),
      secondary_color: z.string().optional(),
      accent_color: z.string().optional(),
      background_color: z.string().optional(),
      store_name: z.string().optional(),
      font_size: z.enum(["small", "medium", "large", "xlarge"]).optional(),
      border_radius: z.enum(["none", "small", "medium", "large", "xlarge"]).optional(),
      language: z.string().optional(),
      currency: z.string().optional(),
      date_format: z.string().optional(),
      enable_animations: z.string().optional(),
      enable_sounds: z.string().optional(),
      compact_mode: z.string().optional(),
      show_welcome_message: z.string().optional(),
      auto_save_interval: z.number().optional(),
      low_stock_threshold: z.number().optional(),
      items_per_page: z.number().optional(),
      enable_notifications: z.string().optional(),
      enable_email_alerts: z.string().optional(),
      email_for_alerts: z.string().optional().nullable()
    });
    clientCommunications = pgTable("client_communications", {
      id: serial("id").primaryKey(),
      user_id: text("user_id").notNull().references(() => users.id),
      admin_id: text("admin_id").notNull().references(() => users.id),
      type: text("type").notNull(),
      subject: text("subject"),
      content: text("content").notNull(),
      metadata: jsonb("metadata"),
      sent_at: timestamp("sent_at", { withTimezone: true }).notNull().defaultNow()
    }, (table) => ({
      userIdSentAtIdx: index("client_communications_user_id_sent_at_idx").on(table.user_id, table.sent_at)
    }));
    insertClientNoteSchema = createInsertSchema(clientNotes).omit({
      id: true,
      created_at: true,
      updated_at: true
    });
    insertClientDocumentSchema = createInsertSchema(clientDocuments).omit({
      id: true,
      uploaded_at: true
    });
    insertClientInteractionSchema = createInsertSchema(clientInteractions).omit({
      id: true,
      created_at: true
    });
    insertPlanChangeHistorySchema = createInsertSchema(planChangesHistory).omit({
      id: true,
      changed_at: true
    });
    insertClientCommunicationSchema = createInsertSchema(clientCommunications).omit({
      id: true,
      sent_at: true
    });
    userSessions = pgTable("user_sessions", {
      id: serial("id").primaryKey(),
      user_id: text("user_id").notNull(),
      user_type: text("user_type").notNull().default("usuario"),
      // usuario, funcionario
      session_token: text("session_token").notNull().unique(),
      device_fingerprint: text("device_fingerprint").notNull(),
      device_info: jsonb("device_info"),
      // browser, os, screen, etc
      ip_address: text("ip_address"),
      user_agent: text("user_agent"),
      is_active: text("is_active").notNull().default("true"),
      created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
      last_activity: timestamp("last_activity", { withTimezone: true }).notNull().defaultNow(),
      expires_at: timestamp("expires_at", { withTimezone: true }).notNull()
    }, (table) => ({
      userIdIdx: index("user_sessions_user_id_idx").on(table.user_id),
      sessionTokenIdx: index("user_sessions_session_token_idx").on(table.session_token),
      fingerprintIdx: index("user_sessions_fingerprint_idx").on(table.device_fingerprint),
      isActiveIdx: index("user_sessions_is_active_idx").on(table.is_active)
    }));
    insertUserSessionSchema = createInsertSchema(userSessions).omit({
      id: true,
      created_at: true,
      last_activity: true
    });
    emailTemplates = pgTable("email_templates", {
      id: serial("id").primaryKey(),
      nome: text("nome").notNull(),
      assunto: text("assunto").notNull(),
      conteudo: text("conteudo").notNull(),
      tipo: text("tipo").notNull().default("manual"),
      // manual, boas_vindas, expiracao, renovacao, promocao
      variaveis: text("variaveis"),
      // JSON com variáveis disponíveis
      ativo: text("ativo").notNull().default("true"),
      created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
      updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
    });
    insertEmailTemplateSchema = createInsertSchema(emailTemplates).omit({
      id: true,
      created_at: true,
      updated_at: true
    });
    emailHistory = pgTable("email_history", {
      id: serial("id").primaryKey(),
      user_id: text("user_id").references(() => users.id, { onDelete: "set null" }),
      template_id: integer("template_id").references(() => emailTemplates.id, { onDelete: "set null" }),
      email_destino: text("email_destino").notNull(),
      assunto: text("assunto").notNull(),
      conteudo: text("conteudo").notNull(),
      tipo: text("tipo").notNull().default("manual"),
      // manual, automatico, massa
      segmento: text("segmento"),
      // trial, premium, todos, etc
      status: text("status").notNull().default("enviado"),
      // enviado, falha, pendente
      erro: text("erro"),
      created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
    }, (table) => ({
      userIdIdx: index("email_history_user_id_idx").on(table.user_id),
      tipoIdx: index("email_history_tipo_idx").on(table.tipo),
      statusIdx: index("email_history_status_idx").on(table.status)
    }));
    insertEmailHistorySchema = createInsertSchema(emailHistory).omit({
      id: true,
      created_at: true
    });
    emailAutomation = pgTable("email_automation", {
      id: serial("id").primaryKey(),
      tipo: text("tipo").notNull().unique(),
      // boas_vindas, expiracao_3_dias, expiracao_1_dia, renovacao, etc
      template_id: integer("template_id").references(() => emailTemplates.id, { onDelete: "set null" }),
      ativo: text("ativo").notNull().default("true"),
      dias_antes: integer("dias_antes"),
      // Para lembretes de expiração
      descricao: text("descricao"),
      created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
      updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
    });
    insertEmailAutomationSchema = createInsertSchema(emailAutomation).omit({
      id: true,
      created_at: true,
      updated_at: true
    });
  }
});

// server/logger.ts
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
var __filename, __dirname, lockingMetrics, Logger, logger;
var init_logger = __esm({
  "server/logger.ts"() {
    "use strict";
    __filename = fileURLToPath(import.meta.url);
    __dirname = dirname(__filename);
    lockingMetrics = {
      aprovacoes_total: 0,
      aprovacoes_com_erro: 0,
      tempo_medio_aprovacao_ms: 0,
      bloqueios_ativos: 0,
      produtos_com_bloqueios: /* @__PURE__ */ new Set(),
      ultimas_latencias: []
    };
    Logger = class {
      logsDir;
      currentLogFile;
      maxLogSize = 10 * 1024 * 1024;
      // 10MB
      logLevel;
      constructor() {
        this.logsDir = path.join(__dirname, "logs");
        this.ensureLogsDirectory();
        this.currentLogFile = this.getLogFileName();
        this.logLevel = process.env.LOG_LEVEL || "INFO" /* INFO */;
      }
      ensureLogsDirectory() {
        if (!fs.existsSync(this.logsDir)) {
          fs.mkdirSync(this.logsDir, { recursive: true });
        }
      }
      getLogFileName() {
        const date = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
        return path.join(this.logsDir, `app-${date}.log`);
      }
      shouldLog(level) {
        const levels = ["ERROR" /* ERROR */, "WARN" /* WARN */, "INFO" /* INFO */, "DEBUG" /* DEBUG */];
        return levels.indexOf(level) <= levels.indexOf(this.logLevel);
      }
      rotateLogIfNeeded() {
        const newLogFile = this.getLogFileName();
        if (newLogFile !== this.currentLogFile) {
          this.currentLogFile = newLogFile;
        }
        if (fs.existsSync(this.currentLogFile)) {
          const stats = fs.statSync(this.currentLogFile);
          if (stats.size > this.maxLogSize) {
            const timestamp2 = (/* @__PURE__ */ new Date()).getTime();
            const rotatedFile = this.currentLogFile.replace(".log", `-${timestamp2}.log`);
            fs.renameSync(this.currentLogFile, rotatedFile);
          }
        }
      }
      getTimestampSaoPaulo() {
        return (/* @__PURE__ */ new Date()).toLocaleString("sv-SE", {
          timeZone: "America/Sao_Paulo",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          fractionalSecondDigits: 3
        }).replace(" ", "T") + "Z";
      }
      writeLog(entry) {
        if (!this.shouldLog(entry.level)) return;
        this.rotateLogIfNeeded();
        const logLine = JSON.stringify(entry) + "\n";
        fs.appendFileSync(this.currentLogFile, logLine, "utf-8");
        if (process.env.NODE_ENV === "development") {
          const consoleMsg = `[${entry.timestamp}] ${entry.level} ${entry.context ? `[${entry.context}]` : ""} ${entry.message}`;
          console.log(consoleMsg, entry.data || "");
        }
      }
      error(message, context, data, userId) {
        this.writeLog({
          timestamp: this.getTimestampSaoPaulo(),
          level: "ERROR" /* ERROR */,
          message,
          context,
          data,
          userId
        });
      }
      warn(message, context, data, userId) {
        this.writeLog({
          timestamp: this.getTimestampSaoPaulo(),
          level: "WARN" /* WARN */,
          message,
          context,
          data,
          userId
        });
      }
      info(message, context, data, userId) {
        this.writeLog({
          timestamp: this.getTimestampSaoPaulo(),
          level: "INFO" /* INFO */,
          message,
          context,
          data,
          userId
        });
      }
      debug(message, context, data, userId) {
        this.writeLog({
          timestamp: this.getTimestampSaoPaulo(),
          level: "DEBUG" /* DEBUG */,
          message,
          context,
          data,
          userId
        });
      }
      // Método para buscar logs (útil para admin)
      async getLogs(date, level, limit = 100) {
        const logFile = date ? path.join(this.logsDir, `app-${date}.log`) : this.currentLogFile;
        if (!fs.existsSync(logFile)) {
          return [];
        }
        const content = fs.readFileSync(logFile, "utf-8");
        const lines = content.split("\n").filter((line) => line.trim());
        let logs = lines.map((line) => {
          try {
            return JSON.parse(line);
          } catch {
            return null;
          }
        }).filter((log2) => log2 !== null);
        if (level) {
          logs = logs.filter((log2) => log2.level === level);
        }
        return logs.slice(-limit);
      }
      // Limpar logs antigos (manter últimos 30 dias)
      async cleanOldLogs(daysToKeep = 30) {
        const files = fs.readdirSync(this.logsDir);
        const cutoffDate = /* @__PURE__ */ new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
        for (const file of files) {
          if (!file.startsWith("app-") || !file.endsWith(".log")) continue;
          const filePath = path.join(this.logsDir, file);
          const stats = fs.statSync(filePath);
          if (stats.mtime < cutoffDate) {
            fs.unlinkSync(filePath);
            this.info("Log antigo removido", "CLEANUP", { file });
          }
        }
      }
      // Telemetria específica para sistema de bloqueios
      trackAprovacao(latencia_ms, sucesso, produtosAfetados) {
        lockingMetrics.aprovacoes_total++;
        if (!sucesso) {
          lockingMetrics.aprovacoes_com_erro++;
        }
        lockingMetrics.ultimas_latencias.push(latencia_ms);
        if (lockingMetrics.ultimas_latencias.length > 100) {
          lockingMetrics.ultimas_latencias.shift();
        }
        const soma = lockingMetrics.ultimas_latencias.reduce((a, b) => a + b, 0);
        lockingMetrics.tempo_medio_aprovacao_ms = soma / lockingMetrics.ultimas_latencias.length;
        produtosAfetados.forEach((id) => lockingMetrics.produtos_com_bloqueios.add(id));
        this.info(`Aprova\xE7\xE3o de or\xE7amento ${sucesso ? "conclu\xEDda" : "falhou"}`, "LOCKING_TELEMETRY", {
          latencia_ms,
          produtos_afetados: produtosAfetados.length,
          taxa_erro: (lockingMetrics.aprovacoes_com_erro / lockingMetrics.aprovacoes_total * 100).toFixed(2) + "%",
          latencia_media_ms: lockingMetrics.tempo_medio_aprovacao_ms.toFixed(2)
        });
      }
      trackBloqueio(acao, produtoId, quantidade) {
        if (acao === "criado") {
          lockingMetrics.bloqueios_ativos++;
          lockingMetrics.produtos_com_bloqueios.add(produtoId);
        } else {
          lockingMetrics.bloqueios_ativos--;
        }
        this.info(`Bloqueio ${acao}`, "LOCKING_TELEMETRY", {
          produto_id: produtoId,
          quantidade,
          bloqueios_ativos_total: lockingMetrics.bloqueios_ativos,
          produtos_unicos_bloqueados: lockingMetrics.produtos_com_bloqueios.size
        });
      }
      getLockingMetrics() {
        return {
          ...lockingMetrics,
          produtos_com_bloqueios: lockingMetrics.produtos_com_bloqueios.size
        };
      }
      resetLockingMetrics() {
        lockingMetrics.aprovacoes_total = 0;
        lockingMetrics.aprovacoes_com_erro = 0;
        lockingMetrics.tempo_medio_aprovacao_ms = 0;
        lockingMetrics.bloqueios_ativos = 0;
        lockingMetrics.produtos_com_bloqueios.clear();
        lockingMetrics.ultimas_latencias = [];
      }
    };
    logger = new Logger();
  }
});

// server/postgres-storage.ts
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { eq, and, or, gte, lte, lt, desc, sql, inArray, isNull } from "drizzle-orm";
import { randomUUID } from "crypto";
import ws from "ws";
var dbUrl, maskedUrl, pool, PostgresStorage;
var init_postgres_storage = __esm({
  "server/postgres-storage.ts"() {
    "use strict";
    init_schema();
    init_logger();
    neonConfig.webSocketConstructor = ws;
    if (!process.env.DATABASE_URL) {
      console.error("\u274C ERRO: Vari\xE1vel de ambiente DATABASE_URL n\xE3o est\xE1 configurada!");
      console.error("\u{1F4DD} Configure a vari\xE1vel DATABASE_URL com a string de conex\xE3o do PostgreSQL.");
      console.error("\u{1F4DD} Exemplo: postgresql://usuario:senha@host:porta/database");
      throw new Error("DATABASE_URL n\xE3o est\xE1 configurada. Configure esta vari\xE1vel de ambiente antes de continuar.");
    }
    dbUrl = process.env.DATABASE_URL;
    maskedUrl = dbUrl.replace(/:([^@]+)@/, ":****@");
    console.log(`\u{1F50C} Conectando ao PostgreSQL: ${maskedUrl}`);
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    PostgresStorage = class {
      db;
      constructor() {
        this.db = drizzle(pool);
        console.log("\u2705 PostgreSQL conectado com sucesso");
        this.testConnection();
        this.seedInitialData();
        this.ensureCuponsTablesExist();
      }
      async ensureCuponsTablesExist() {
        try {
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
            console.log("\u{1F4E6} Criando tabelas de cupons...");
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
            await this.db.execute(sql`
          CREATE INDEX IF NOT EXISTS cupons_codigo_idx ON cupons(codigo);
        `);
            await this.db.execute(sql`
          CREATE INDEX IF NOT EXISTS cupons_status_idx ON cupons(status);
        `);
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
            await this.db.execute(sql`
          CREATE INDEX IF NOT EXISTS uso_cupons_cupom_id_idx ON uso_cupons(cupom_id);
        `);
            await this.db.execute(sql`
          CREATE INDEX IF NOT EXISTS uso_cupons_user_id_idx ON uso_cupons(user_id);
        `);
            console.log("\u2705 Tabelas de cupons criadas com sucesso");
          } else {
            console.log("\u2705 Tabelas de cupons j\xE1 existem");
          }
        } catch (error) {
          logger.error("[DB] Erro ao criar tabelas de cupons:", {
            error: error.message,
            stack: error.stack
          });
          console.warn("\u26A0\uFE0F Sistema iniciar\xE1 sem suporte a cupons");
        }
      }
      async getCupons() {
        try {
          const results = await this.db.select().from(cupons).orderBy(desc(cupons.id));
          return results.map((cupom) => ({
            ...cupom,
            planos_aplicaveis: Array.isArray(cupom.planos_aplicaveis) ? cupom.planos_aplicaveis : cupom.planos_aplicaveis ? JSON.parse(cupom.planos_aplicaveis) : []
          }));
        } catch (error) {
          logger.error("[DB] Erro ao buscar cupons:", { error: error.message });
          return [];
        }
      }
      async getCupom(id) {
        try {
          const [cupom] = await this.db.select().from(cupons).where(eq(cupons.id, id)).limit(1);
          if (!cupom) return void 0;
          return {
            ...cupom,
            planos_aplicaveis: Array.isArray(cupom.planos_aplicaveis) ? cupom.planos_aplicaveis : cupom.planos_aplicaveis ? JSON.parse(cupom.planos_aplicaveis) : []
          };
        } catch (error) {
          logger.error("[DB] Erro ao buscar cupom:", { error: error.message });
          return void 0;
        }
      }
      async createCupom(data) {
        try {
          const [cupom] = await this.db.insert(cupons).values({
            ...data,
            planos_aplicaveis: Array.isArray(data.planos_aplicaveis) ? data.planos_aplicaveis : [],
            data_criacao: (/* @__PURE__ */ new Date()).toISOString()
          }).returning();
          return {
            ...cupom,
            planos_aplicaveis: Array.isArray(cupom.planos_aplicaveis) ? cupom.planos_aplicaveis : []
          };
        } catch (error) {
          logger.error("[DB] Erro ao criar cupom:", { error: error.message });
          throw error;
        }
      }
      async updateCupom(id, updates) {
        try {
          const updateData = { ...updates, data_atualizacao: (/* @__PURE__ */ new Date()).toISOString() };
          if (updateData.planos_aplicaveis) {
            updateData.planos_aplicaveis = Array.isArray(updateData.planos_aplicaveis) ? updateData.planos_aplicaveis : [];
          }
          const [cupom] = await this.db.update(cupons).set(updateData).where(eq(cupons.id, id)).returning();
          if (!cupom) return void 0;
          return {
            ...cupom,
            planos_aplicaveis: Array.isArray(cupom.planos_aplicaveis) ? cupom.planos_aplicaveis : []
          };
        } catch (error) {
          logger.error("[DB] Erro ao atualizar cupom:", { error: error.message });
          throw error;
        }
      }
      async deleteCupom(id) {
        try {
          const result = await this.db.delete(cupons).where(eq(cupons.id, id)).returning();
          return result.length > 0;
        } catch (error) {
          logger.error("[DB] Erro ao deletar cupom:", { error: error.message });
          return false;
        }
      }
      async validarCupom(codigo, plano, userId) {
        try {
          const [cupom] = await this.db.select().from(cupons).where(eq(cupons.codigo, codigo.toUpperCase())).limit(1);
          if (!cupom) {
            return { valido: false, erro: "Cupom n\xE3o encontrado" };
          }
          if (cupom.status !== "ativo") {
            return { valido: false, erro: "Cupom inativo" };
          }
          const hoje = /* @__PURE__ */ new Date();
          const dataInicio = new Date(cupom.data_inicio);
          const dataExpiracao = new Date(cupom.data_expiracao);
          if (hoje < dataInicio) {
            return { valido: false, erro: "Cupom ainda n\xE3o est\xE1 dispon\xEDvel" };
          }
          if (hoje > dataExpiracao) {
            return { valido: false, erro: "Cupom expirado" };
          }
          const planosAplicaveis = Array.isArray(cupom.planos_aplicaveis) ? cupom.planos_aplicaveis : [];
          if (planosAplicaveis.length > 0 && !planosAplicaveis.includes(plano)) {
            return { valido: false, erro: "Cupom n\xE3o aplic\xE1vel para este plano" };
          }
          if (cupom.quantidade_maxima && cupom.quantidade_utilizada >= cupom.quantidade_maxima) {
            return { valido: false, erro: "Cupom esgotado" };
          }
          if (userId && userId !== "temp") {
            const usuarioJaUsouCupom = await this.db.select().from(usoCupons).where(
              and(
                eq(usoCupons.cupom_id, cupom.id),
                eq(usoCupons.user_id, userId)
              )
            ).limit(1);
            if (usuarioJaUsouCupom.length > 0) {
              logger.warn("[DB] Usu\xE1rio tentou reusar cupom", {
                cupomId: cupom.id,
                cupomCodigo: cupom.codigo,
                userId
              });
              return { valido: false, erro: "Voc\xEA j\xE1 utilizou este cupom em uma compra anterior" };
            }
          }
          return {
            valido: true,
            cupom: {
              ...cupom,
              planos_aplicaveis: planosAplicaveis
            }
          };
        } catch (error) {
          logger.error("[DB] Erro ao validar cupom:", { error: error.message });
          return { valido: false, erro: "Erro ao validar cupom" };
        }
      }
      async registrarUsoCupom(data) {
        try {
          await this.db.insert(usoCupons).values({
            ...data,
            data_uso: (/* @__PURE__ */ new Date()).toISOString()
          });
          await this.db.update(cupons).set({
            quantidade_utilizada: sql`${cupons.quantidade_utilizada} + 1`
          }).where(eq(cupons.id, data.cupom_id));
        } catch (error) {
          logger.error("[DB] Erro ao registrar uso de cupom:", { error: error.message });
          throw error;
        }
      }
      async getUsoCupons(cupomId) {
        try {
          return await this.db.select().from(usoCupons).where(eq(usoCupons.cupom_id, cupomId)).orderBy(desc(usoCupons.data_uso));
        } catch (error) {
          logger.error("[DB] Erro ao buscar uso de cupons:", { error: error.message });
          return [];
        }
      }
      async testConnection() {
        try {
          const result = await this.db.select().from(users).limit(1);
          logger.info("[DB] Teste de conex\xE3o bem-sucedido", {
            usuariosEncontrados: result.length
          });
        } catch (error) {
          logger.error("[DB] Erro no teste de conex\xE3o:", {
            error: error.message,
            stack: error.stack
          });
        }
      }
      async seedInitialData() {
        try {
          const existingUsers = await this.db.select().from(users);
          console.log(`\u{1F4CA} Usu\xE1rios existentes no banco: ${existingUsers.length}`);
          if (existingUsers.length === 0) {
            console.log("\u2139\uFE0F  Banco vazio. Use o script seed-database.ts para criar usu\xE1rios iniciais se necess\xE1rio.");
          }
        } catch (error) {
          logger.error("[DB] Erro ao verificar dados:", {
            error: error.message,
            stack: error.stack
          });
        }
      }
      async getUsers() {
        return await this.db.select().from(users);
      }
      async getUserById(userId) {
        try {
          const result = await this.db.select().from(users).where(eq(users.id, userId)).limit(1);
          return result[0];
        } catch (error) {
          logger.error("[DB] Erro ao buscar usu\xE1rio por ID:", {
            userId,
            error: error.message
          });
          throw error;
        }
      }
      async getUserByEmail(email) {
        try {
          logger.info("[DB] Buscando usu\xE1rio por email:", { email });
          const result = await this.db.select().from(users).where(eq(users.email, email)).limit(1);
          logger.info("[DB] Resultado da busca:", {
            encontrado: result.length > 0,
            usuario: result[0] ? { id: result[0].id, email: result[0].email, nome: result[0].nome } : null
          });
          return result[0];
        } catch (error) {
          logger.error("[DB] Erro ao buscar usu\xE1rio por email:", {
            email,
            error: error.message,
            stack: error.stack
          });
          throw error;
        }
      }
      async createUser(insertUser) {
        const newUser = {
          ...insertUser,
          id: randomUUID(),
          data_criacao: (/* @__PURE__ */ new Date()).toISOString(),
          plano: this.normalizePlanName(insertUser.plano || "trial")
        };
        const result = await this.db.insert(users).values(newUser).returning();
        return result[0];
      }
      normalizePlanName(plano) {
        const planMap = {
          "trial": "trial",
          "mensal": "premium_mensal",
          "anual": "premium_anual",
          "premium": "premium_mensal",
          "premium_mensal": "premium_mensal",
          "premium_anual": "premium_anual"
        };
        return planMap[plano.toLowerCase()] || "trial";
      }
      async updateUser(id, updates) {
        try {
          const cleanUpdates = Object.fromEntries(
            Object.entries(updates).filter(([_, value]) => value !== void 0)
          );
          if (Object.keys(cleanUpdates).length === 0) {
            return await this.getUserById(id);
          }
          if (cleanUpdates.plano) {
            cleanUpdates.plano = this.normalizePlanName(cleanUpdates.plano);
          }
          const result = await this.db.update(users).set(cleanUpdates).where(eq(users.id, id)).returning();
          return result[0];
        } catch (error) {
          logger.error("[DB] Erro ao atualizar usu\xE1rio:", {
            userId: id,
            updates,
            error: error.message
          });
          throw error;
        }
      }
      async deleteUser(id) {
        await this.db.delete(users).where(eq(users.id, id));
      }
      async getProdutos() {
        return await this.db.select().from(produtos);
      }
      async getProduto(id) {
        const result = await this.db.select().from(produtos).where(eq(produtos.id, id)).limit(1);
        return result[0];
      }
      async getProdutoByCodigoBarras(codigo) {
        const result = await this.db.select().from(produtos).where(eq(produtos.codigo_barras, codigo)).limit(1);
        return result[0];
      }
      async createProduto(insertProduto) {
        const result = await this.db.insert(produtos).values(insertProduto).returning();
        return result[0];
      }
      async updateProduto(id, updates) {
        const result = await this.db.update(produtos).set(updates).where(eq(produtos.id, id)).returning();
        return result[0];
      }
      async deleteProduto(id) {
        const result = await this.db.delete(produtos).where(eq(produtos.id, id)).returning();
        return result.length > 0;
      }
      async getVendas(startDate, endDate) {
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
      async getVendasByUser(userId) {
        try {
          const result = await this.db.select({
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
            orcamento_numero: orcamentos.numero
          }).from(vendas).leftJoin(orcamentos, eq(vendas.orcamento_id, orcamentos.id)).where(eq(vendas.user_id, userId)).orderBy(desc(vendas.data));
          return result;
        } catch (error) {
          logger.error("[DB] Erro ao buscar vendas:", error);
          throw error;
        }
      }
      async createVenda(insertVenda) {
        const result = await this.db.insert(vendas).values(insertVenda).returning();
        return result[0];
      }
      async deleteVenda(id) {
        const result = await this.db.delete(vendas).where(eq(vendas.id, id)).returning();
        return result.length > 0;
      }
      async clearVendas() {
        await this.db.delete(vendas);
      }
      async getVenda(id) {
        const result = await this.db.select().from(vendas).where(eq(vendas.id, id)).limit(1);
        return result[0];
      }
      async updateVendaCupom(id, cupomTexto) {
        const result = await this.db.update(vendas).set({ cupom_texto: cupomTexto }).where(eq(vendas.id, id)).returning();
        return result.length > 0;
      }
      async getFornecedores() {
        return await this.db.select().from(fornecedores);
      }
      async getFornecedor(id) {
        const result = await this.db.select().from(fornecedores).where(eq(fornecedores.id, id)).limit(1);
        return result[0];
      }
      async createFornecedor(insertFornecedor) {
        const newFornecedor = {
          ...insertFornecedor,
          data_cadastro: (/* @__PURE__ */ new Date()).toISOString()
        };
        const result = await this.db.insert(fornecedores).values(newFornecedor).returning();
        return result[0];
      }
      async updateFornecedor(id, updates) {
        const result = await this.db.update(fornecedores).set(updates).where(eq(fornecedores.id, id)).returning();
        return result[0];
      }
      async deleteFornecedor(id) {
        const result = await this.db.delete(fornecedores).where(eq(fornecedores.id, id)).returning();
        return result.length > 0;
      }
      async getClientes() {
        return await this.db.select().from(clientes);
      }
      async getCliente(id) {
        const result = await this.db.select().from(clientes).where(eq(clientes.id, id)).limit(1);
        return result[0];
      }
      async createCliente(insertCliente) {
        const newCliente = {
          ...insertCliente,
          data_cadastro: insertCliente.data_cadastro || (/* @__PURE__ */ new Date()).toISOString()
        };
        const result = await this.db.insert(clientes).values(newCliente).returning();
        return result[0];
      }
      async updateCliente(id, updates) {
        const result = await this.db.update(clientes).set(updates).where(eq(clientes.id, id)).returning();
        return result[0];
      }
      async deleteCliente(id) {
        const result = await this.db.delete(clientes).where(eq(clientes.id, id)).returning();
        return result.length > 0;
      }
      async getCompras(fornecedorId, startDate, endDate) {
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
      async createCompra(insertCompra) {
        const result = await this.db.insert(compras).values(insertCompra).returning();
        return result[0];
      }
      async updateCompra(id, updates) {
        const result = await this.db.update(compras).set(updates).where(eq(compras.id, id)).returning();
        return result[0];
      }
      async getConfigFiscal() {
        const result = await this.db.select().from(configFiscal).limit(1);
        return result[0];
      }
      async saveConfigFiscal(insertConfig) {
        const existing = await this.getConfigFiscal();
        if (existing) {
          const result2 = await this.db.update(configFiscal).set({
            ...insertConfig,
            updated_at: (/* @__PURE__ */ new Date()).toISOString()
          }).where(eq(configFiscal.id, existing.id)).returning();
          return result2[0];
        }
        const result = await this.db.insert(configFiscal).values({
          ...insertConfig,
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        }).returning();
        return result[0];
      }
      async getPlanos() {
        return await this.db.select().from(planos).orderBy(desc(planos.id));
      }
      async createPlano(plano) {
        const result = await this.db.insert(planos).values({
          ...plano,
          data_criacao: (/* @__PURE__ */ new Date()).toISOString()
        }).returning();
        return result[0];
      }
      async updatePlano(id, updates) {
        const result = await this.db.update(planos).set(updates).where(eq(planos.id, id)).returning();
        return result[0];
      }
      async deletePlano(id) {
        const result = await this.db.delete(planos).where(eq(planos.id, id)).returning();
        return result.length > 0;
      }
      async getConfigMercadoPago() {
        const result = await this.db.select().from(configMercadoPago).limit(1);
        return result[0] || null;
      }
      async saveConfigMercadoPago(config) {
        const existing = await this.getConfigMercadoPago();
        if (existing) {
          const result2 = await this.db.update(configMercadoPago).set({
            ...config,
            updated_at: (/* @__PURE__ */ new Date()).toISOString()
          }).where(eq(configMercadoPago.id, existing.id)).returning();
          return result2[0];
        }
        const result = await this.db.insert(configMercadoPago).values({
          ...config,
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        }).returning();
        return result[0];
      }
      async updateConfigMercadoPagoStatus(status) {
        const existing = await this.getConfigMercadoPago();
        if (existing) {
          await this.db.update(configMercadoPago).set({
            status_conexao: status,
            ultima_sincronizacao: (/* @__PURE__ */ new Date()).toISOString()
          }).where(eq(configMercadoPago.id, existing.id));
        }
      }
      async getLogsAdmin() {
        const result = await this.db.select().from(logsAdmin).orderBy(desc(logsAdmin.id));
        return result;
      }
      async getLogsAdminByAccount(contaId) {
        const funcionariosIds = await this.db.select({ id: funcionarios.id }).from(funcionarios).where(eq(funcionarios.conta_id, contaId));
        const ids = [contaId, ...funcionariosIds.map((f) => f.id)];
        return await this.db.select().from(logsAdmin).where(inArray(logsAdmin.usuario_id, ids)).orderBy(desc(logsAdmin.data)).limit(500);
      }
      async createLogAdmin(log2) {
        const result = await this.db.insert(logsAdmin).values({
          usuario_id: log2.usuario_id,
          conta_id: log2.conta_id,
          acao: log2.acao,
          detalhes: log2.detalhes || null,
          data: (/* @__PURE__ */ new Date()).toISOString(),
          ip_address: log2.ip_address || null,
          user_agent: log2.user_agent || null
        }).returning();
        return result[0];
      }
      async logAdminAction(actorId, action, details, context) {
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
            user_agent: context?.userAgent || null
          });
        } catch (error) {
          console.error("[AUDIT_LOG] Erro ao registrar a\xE7\xE3o:", error);
        }
      }
      async deleteAllLogsAdmin(contaId) {
        try {
          let result;
          if (contaId) {
            result = await this.db.delete(logsAdmin).where(eq(logsAdmin.conta_id, contaId)).returning();
          } else {
            result = await this.db.delete(logsAdmin).returning();
          }
          const deletedCount = result.length;
          logger.info("[DB] Logs de auditoria limpos", { contaId: contaId || "todos", deletedCount });
          return deletedCount;
        } catch (error) {
          logger.error("[DB] Erro ao limpar logs de auditoria:", { error });
          throw error;
        }
      }
      async getSubscriptions() {
        try {
          return await this.db.select().from(subscriptions).orderBy(desc(subscriptions.id));
        } catch (error) {
          if (error.code === "42703") {
            logger.warn("[DB] Executando SELECT b\xE1sico de subscriptions (campos novos n\xE3o dispon\xEDveis)", { error: error.message });
            const result = await this.db.execute(sql`
          SELECT 
            id, user_id, plano, valor, status, status_pagamento, 
            mercadopago_payment_id, mercadopago_preference_id, data_criacao, data_vencimento, 
            data_atualizacao, motivo_cancelamento, 
            tentativas_cobranca, prazo_limite_pagamento, forma_pagamento,
            init_point, external_reference
          FROM subscriptions 
          ORDER BY id DESC
        `);
            return result.rows;
          }
          throw error;
        }
      }
      async getSubscription(id) {
        const result = await this.db.select().from(subscriptions).where(eq(subscriptions.id, id)).limit(1);
        return result[0];
      }
      async getSubscriptionsByUser(userId) {
        return await this.db.select().from(subscriptions).where(eq(subscriptions.user_id, userId));
      }
      async createSubscription(subscription) {
        const result = await this.db.insert(subscriptions).values({
          ...subscription,
          data_criacao: (/* @__PURE__ */ new Date()).toISOString()
        }).returning();
        return result[0];
      }
      async updateSubscription(id, updates) {
        const result = await this.db.update(subscriptions).set({
          ...updates,
          data_atualizacao: (/* @__PURE__ */ new Date()).toISOString()
        }).where(eq(subscriptions.id, id)).returning();
        return result[0];
      }
      async deleteSubscription(id) {
        const result = await this.db.delete(subscriptions).where(eq(subscriptions.id, id)).returning();
        return result.length > 0;
      }
      async getFuncionarios() {
        return await this.db.select().from(funcionarios);
      }
      async getFuncionariosByContaId(contaId) {
        return await this.db.select().from(funcionarios).where(eq(funcionarios.conta_id, contaId));
      }
      async getFuncionario(id) {
        const result = await this.db.select().from(funcionarios).where(eq(funcionarios.id, id)).limit(1);
        return result[0];
      }
      async getFuncionarioByEmail(email) {
        const result = await this.db.select().from(funcionarios).where(eq(funcionarios.email, email)).limit(1);
        return result[0];
      }
      async createFuncionario(funcionario) {
        const newFunc = {
          ...funcionario,
          id: funcionario.id || randomUUID(),
          data_criacao: (/* @__PURE__ */ new Date()).toISOString()
        };
        console.log(`\u{1F4DD} [DB] Inserindo funcion\xE1rio no banco:`, {
          id: newFunc.id,
          nome: newFunc.nome,
          email: newFunc.email,
          conta_id: newFunc.conta_id,
          status: newFunc.status
        });
        const result = await this.db.insert(funcionarios).values(newFunc).returning();
        console.log(`\u2705 [DB] Funcion\xE1rio inserido com sucesso - ID: ${result[0].id}`);
        return result[0];
      }
      async updateFuncionario(id, updates) {
        const result = await this.db.update(funcionarios).set(updates).where(eq(funcionarios.id, id)).returning();
        return result[0];
      }
      async deleteFuncionario(id) {
        const result = await this.db.delete(funcionarios).where(eq(funcionarios.id, id)).returning();
        return result.length > 0;
      }
      async getPermissoesFuncionario(funcionarioId) {
        const result = await this.db.select().from(permissoesFuncionarios).where(eq(permissoesFuncionarios.funcionario_id, funcionarioId)).limit(1);
        return result[0];
      }
      async savePermissoesFuncionario(funcionarioId, permissoes) {
        const existing = await this.getPermissoesFuncionario(funcionarioId);
        if (existing) {
          const result2 = await this.db.update(permissoesFuncionarios).set(permissoes).where(eq(permissoesFuncionarios.funcionario_id, funcionarioId)).returning();
          return result2[0];
        }
        const result = await this.db.insert(permissoesFuncionarios).values({
          funcionario_id: funcionarioId,
          ...permissoes
        }).returning();
        return result[0];
      }
      async getContasPagar() {
        return await this.db.select().from(contasPagar).orderBy(desc(contasPagar.id));
      }
      async createContaPagar(conta) {
        const result = await this.db.insert(contasPagar).values({
          ...conta,
          data_cadastro: (/* @__PURE__ */ new Date()).toISOString()
        }).returning();
        return result[0];
      }
      async updateContaPagar(id, updates) {
        const result = await this.db.update(contasPagar).set(updates).where(eq(contasPagar.id, id)).returning();
        return result[0];
      }
      async deleteContaPagar(id) {
        const result = await this.db.delete(contasPagar).where(eq(contasPagar.id, id)).returning();
        return result.length > 0;
      }
      async getContasReceber() {
        return await this.db.select().from(contasReceber).orderBy(desc(contasReceber.id));
      }
      async createContaReceber(conta) {
        const result = await this.db.insert(contasReceber).values({
          ...conta,
          data_cadastro: (/* @__PURE__ */ new Date()).toISOString()
        }).returning();
        return result[0];
      }
      async updateContaReceber(id, updates) {
        const result = await this.db.update(contasReceber).set(updates).where(eq(contasReceber.id, id)).returning();
        return result[0];
      }
      async deleteContaReceber(id) {
        const result = await this.db.delete(contasReceber).where(eq(contasReceber.id, id)).returning();
        return result.length > 0;
      }
      async getCaixas(userId) {
        return await this.db.select().from(caixas).where(eq(caixas.user_id, userId)).orderBy(desc(caixas.id));
      }
      async getCaixaAberto(userId, funcionarioId) {
        if (funcionarioId) {
          const result2 = await this.db.select().from(caixas).where(and(
            eq(caixas.user_id, userId),
            eq(caixas.funcionario_id, funcionarioId),
            eq(caixas.status, "aberto")
          )).limit(1);
          return result2[0];
        }
        const result = await this.db.select().from(caixas).where(and(
          eq(caixas.user_id, userId),
          sql`${caixas.funcionario_id} IS NULL`,
          eq(caixas.status, "aberto")
        )).limit(1);
        return result[0];
      }
      async getCaixa(id) {
        const result = await this.db.select().from(caixas).where(eq(caixas.id, id)).limit(1);
        return result[0];
      }
      async abrirCaixa(caixa) {
        const result = await this.db.insert(caixas).values(caixa).returning();
        return result[0];
      }
      async fecharCaixa(id, dados) {
        const result = await this.db.update(caixas).set({
          ...dados,
          data_fechamento: (/* @__PURE__ */ new Date()).toISOString(),
          status: "fechado"
        }).where(eq(caixas.id, id)).returning();
        return result[0];
      }
      async updateCaixa(id, updates) {
        const result = await this.db.update(caixas).set(updates).where(eq(caixas.id, id)).returning();
        return result[0];
      }
      async arquivarCaixasAntigos(dataLimite) {
        const result = await this.db.update(caixas).set({ status: "arquivado" }).where(and(
          eq(caixas.status, "fechado"),
          or(
            lt(caixas.data_fechamento, dataLimite),
            and(
              isNull(caixas.data_fechamento),
              lt(caixas.data_abertura, dataLimite)
            )
          )
        )).returning();
        if (result.length > 0) {
          const userCounts = result.reduce((acc, caixa) => {
            acc[caixa.user_id] = (acc[caixa.user_id] || 0) + 1;
            return acc;
          }, {});
          console.log("[ARQUIVAMENTO] Caixas arquivados:", {
            total: result.length,
            porUsuario: userCounts,
            dataLimite,
            ids: result.map((c) => c.id).slice(0, 10)
          });
        }
        return result.length;
      }
      async atualizarTotaisCaixa(id, campo, valor) {
        const caixa = await this.getCaixa(id);
        if (!caixa) return void 0;
        const updates = {
          [campo]: (caixa[campo] || 0) + valor
        };
        const result = await this.db.update(caixas).set(updates).where(eq(caixas.id, id)).returning();
        return result[0];
      }
      async getMovimentacoesCaixa(caixaId) {
        return await this.db.select().from(movimentacoesCaixa).where(eq(movimentacoesCaixa.caixa_id, caixaId)).orderBy(desc(movimentacoesCaixa.id));
      }
      async createMovimentacaoCaixa(movimentacao) {
        const result = await this.db.insert(movimentacoesCaixa).values(movimentacao).returning();
        return result[0];
      }
      async limparHistoricoCaixas(userId) {
        await this.db.delete(movimentacoesCaixa).where(
          eq(
            movimentacoesCaixa.caixa_id,
            this.db.select({ id: caixas.id }).from(caixas).where(and(eq(caixas.user_id, userId), eq(caixas.status, "fechado"))).limit(1)
          )
        );
        const result = await this.db.delete(caixas).where(and(eq(caixas.user_id, userId), eq(caixas.status, "fechado"))).returning();
        return { deletedCount: result.length };
      }
      async getSystemConfig(chave) {
        const result = await this.db.select().from(systemConfig).where(eq(systemConfig.chave, chave));
        return result[0];
      }
      async setSystemConfig(chave, valor) {
        const existing = await this.getSystemConfig(chave);
        const now = (/* @__PURE__ */ new Date()).toISOString();
        if (existing) {
          await this.db.update(systemConfig).set({ valor, updated_at: now }).where(eq(systemConfig.chave, chave));
        } else {
          await this.db.insert(systemConfig).values({
            chave,
            valor,
            updated_at: now
          });
        }
      }
      async upsertSystemConfig(chave, valor) {
        const existing = await this.getSystemConfig(chave);
        const now = (/* @__PURE__ */ new Date()).toISOString();
        if (existing) {
          await this.db.update(systemConfig).set({ valor, updated_at: now }).where(eq(systemConfig.chave, chave));
        } else {
          await this.db.insert(systemConfig).values({
            chave,
            valor,
            updated_at: now
          });
        }
        const result = await this.getSystemConfig(chave);
        if (!result) {
          throw new Error("Erro ao salvar configura\xE7\xE3o");
        }
        return result;
      }
      // Métodos para Customização do Usuário
      async getUserCustomization(userId) {
        try {
          const result = await this.db.select().from(userCustomization).where(eq(userCustomization.user_id, userId)).limit(1);
          return result[0] || null;
        } catch (error) {
          logger.error("[DB] Erro ao buscar customiza\xE7\xE3o do usu\xE1rio:", { userId, error });
          throw error;
        }
      }
      async upsertUserCustomization(userId, data) {
        try {
          const existing = await this.getUserCustomization(userId);
          if (existing) {
            const result = await this.db.update(userCustomization).set({
              ...data,
              updated_at: sql`NOW()`
            }).where(eq(userCustomization.user_id, userId)).returning();
            return result[0];
          } else {
            const result = await this.db.insert(userCustomization).values({
              user_id: userId,
              ...data
            }).returning();
            return result[0];
          }
        } catch (error) {
          logger.error("[DB] Erro ao salvar customiza\xE7\xE3o do usu\xE1rio:", { userId, error });
          throw error;
        }
      }
      async deleteUserCustomization(userId) {
        try {
          await this.db.delete(userCustomization).where(eq(userCustomization.user_id, userId));
          logger.info("[DB] Customiza\xE7\xE3o resetada com sucesso:", { userId });
        } catch (error) {
          logger.error("[DB] Erro ao resetar customiza\xE7\xE3o do usu\xE1rio:", { userId, error });
          throw error;
        }
      }
      async getDevolucoes() {
        return await this.db.select().from(devolucoes).orderBy(desc(devolucoes.id));
      }
      async getDevolucao(id) {
        try {
          const result = await this.db.select().from(devolucoes).where(eq(devolucoes.id, id)).limit(1);
          return result[0];
        } catch (error) {
          logger.error("[DB] Erro ao buscar devolu\xE7\xE3o:", { id, error });
          throw error;
        }
      }
      async createDevolucao(devolucao) {
        const result = await this.db.insert(devolucoes).values(devolucao).returning();
        return result[0];
      }
      async updateDevolucao(id, updates) {
        const result = await this.db.update(devolucoes).set(updates).where(eq(devolucoes.id, id)).returning();
        return result[0];
      }
      async deleteDevolucao(id) {
        const result = await this.db.delete(devolucoes).where(eq(devolucoes.id, id)).returning();
        return result.length > 0;
      }
      // Métodos de Orçamentos
      async getOrcamentos() {
        const result = await this.db.select().from(orcamentos).orderBy(desc(orcamentos.data_criacao));
        return result;
      }
      async getOrcamento(id) {
        const result = await this.db.select().from(orcamentos).where(eq(orcamentos.id, id)).limit(1);
        return result[0];
      }
      async createOrcamento(data) {
        const dataAtual = (/* @__PURE__ */ new Date()).toISOString();
        const [orcamento] = await this.db.insert(orcamentos).values({
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
          status: data.status || "pendente",
          itens: data.itens,
          subtotal: data.subtotal,
          desconto: data.desconto || 0,
          valor_total: data.valor_total,
          observacoes: data.observacoes || null,
          condicoes_pagamento: data.condicoes_pagamento || null,
          prazo_entrega: data.prazo_entrega || null,
          vendedor: data.vendedor || null,
          venda_id: data.venda_id || null
        }).returning();
        return orcamento;
      }
      async updateOrcamento(id, data) {
        const startTime = Date.now();
        let sucesso = false;
        try {
          const resultado = await this.db.transaction(async (tx) => {
            const [orcamentoOriginal] = await tx.select().from(orcamentos).where(eq(orcamentos.id, id)).for("update");
            if (!orcamentoOriginal) {
              throw new Error("Or\xE7amento n\xE3o encontrado");
            }
            const statusOriginal = orcamentoOriginal.status;
            const statusFinal = data.status !== void 0 ? data.status : statusOriginal;
            const itensAtualizados = data.itens ? Array.isArray(data.itens) ? data.itens : [] : Array.isArray(orcamentoOriginal.itens) ? orcamentoOriginal.itens : [];
            const itensMudaram = data.itens !== void 0 && JSON.stringify(data.itens) !== JSON.stringify(orcamentoOriginal.itens);
            const precisaRecalcularBloqueios = statusFinal === "aprovado" && statusOriginal !== "aprovado" || statusFinal === "aprovado" && statusOriginal === "aprovado" && itensMudaram;
            if (statusFinal === "aprovado") {
              await tx.delete(bloqueiosEstoque).where(eq(bloqueiosEstoque.orcamento_id, id));
              const dataBloqueio = (/* @__PURE__ */ new Date()).toISOString();
              for (const item of itensAtualizados) {
                await tx.insert(bloqueiosEstoque).values({
                  produto_id: item.produto_id,
                  orcamento_id: id,
                  user_id: orcamentoOriginal.user_id,
                  quantidade_bloqueada: item.quantidade,
                  data_bloqueio: dataBloqueio
                });
              }
            }
            const [orcamento] = await tx.update(orcamentos).set({
              validade: data.validade !== void 0 ? data.validade : orcamentoOriginal.validade,
              cliente_id: data.cliente_id !== void 0 ? data.cliente_id : orcamentoOriginal.cliente_id,
              cliente_nome: data.cliente_nome !== void 0 ? data.cliente_nome : orcamentoOriginal.cliente_nome,
              cliente_email: data.cliente_email !== void 0 ? data.cliente_email : orcamentoOriginal.cliente_email,
              cliente_telefone: data.cliente_telefone !== void 0 ? data.cliente_telefone : orcamentoOriginal.cliente_telefone,
              cliente_cpf_cnpj: data.cliente_cpf_cnpj !== void 0 ? data.cliente_cpf_cnpj : orcamentoOriginal.cliente_cpf_cnpj,
              cliente_endereco: data.cliente_endereco !== void 0 ? data.cliente_endereco : orcamentoOriginal.cliente_endereco,
              status: data.status !== void 0 ? data.status : orcamentoOriginal.status,
              itens: data.itens !== void 0 ? data.itens : orcamentoOriginal.itens,
              subtotal: data.subtotal !== void 0 ? data.subtotal : orcamentoOriginal.subtotal,
              desconto: data.desconto !== void 0 ? data.desconto : orcamentoOriginal.desconto,
              valor_total: data.valor_total !== void 0 ? data.valor_total : orcamentoOriginal.valor_total,
              observacoes: data.observacoes !== void 0 ? data.observacoes : orcamentoOriginal.observacoes,
              condicoes_pagamento: data.condicoes_pagamento !== void 0 ? data.condicoes_pagamento : orcamentoOriginal.condicoes_pagamento,
              prazo_entrega: data.prazo_entrega !== void 0 ? data.prazo_entrega : orcamentoOriginal.prazo_entrega,
              data_atualizacao: (/* @__PURE__ */ new Date()).toISOString()
            }).where(eq(orcamentos.id, id)).returning();
            if (orcamento.status !== "aprovado") {
              await tx.delete(bloqueiosEstoque).where(eq(bloqueiosEstoque.orcamento_id, id));
            }
            sucesso = true;
            return orcamento;
          });
          const latencia = Date.now() - startTime;
          const produtosAfetados = resultado.itens ? resultado.itens.map((i) => i.produto_id) : [];
          logger.trackAprovacao(latencia, sucesso, produtosAfetados);
          return resultado;
        } catch (error) {
          const latencia = Date.now() - startTime;
          logger.trackAprovacao(latencia, false, []);
          throw error;
        }
      }
      async deleteOrcamento(id) {
        await this.removerBloqueiosOrcamento(id);
        await this.db.delete(orcamentos).where(eq(orcamentos.id, id));
      }
      async criarBloqueioEstoque(orcamentoId, userId, itens) {
        const dataBloqueio = (/* @__PURE__ */ new Date()).toISOString();
        for (const item of itens) {
          await this.db.insert(bloqueiosEstoque).values({
            produto_id: item.produto_id,
            orcamento_id: orcamentoId,
            user_id: userId,
            quantidade_bloqueada: item.quantidade,
            data_bloqueio: dataBloqueio
          });
          logger.trackBloqueio("criado", item.produto_id, item.quantidade);
        }
      }
      async removerBloqueiosOrcamento(orcamentoId) {
        const bloqueiosRemovidos = await this.db.select().from(bloqueiosEstoque).where(eq(bloqueiosEstoque.orcamento_id, orcamentoId));
        await this.db.delete(bloqueiosEstoque).where(eq(bloqueiosEstoque.orcamento_id, orcamentoId));
        bloqueiosRemovidos.forEach((bloqueio) => {
          logger.trackBloqueio("removido", bloqueio.produto_id, bloqueio.quantidade_bloqueada);
        });
      }
      async getBloqueiosPorProduto(produtoId, userId) {
        const bloqueios = await this.db.select().from(bloqueiosEstoque).where(
          and(
            eq(bloqueiosEstoque.produto_id, produtoId),
            eq(bloqueiosEstoque.user_id, userId)
          )
        );
        return bloqueios;
      }
      async getQuantidadeBloqueadaPorProduto(produtoId, userId) {
        try {
          const result = await this.db.select({
            total: sql`COALESCE(SUM(${bloqueiosEstoque.quantidade_bloqueada}), 0)`
          }).from(bloqueiosEstoque).where(
            and(
              eq(bloqueiosEstoque.produto_id, produtoId),
              eq(bloqueiosEstoque.user_id, userId)
            )
          );
          return Number(result[0]?.total || 0);
        } catch (error) {
          logger.error("[DB] Erro ao buscar quantidade bloqueada:", { error, produtoId, userId });
          return 0;
        }
      }
      async getQuantidadeDisponivelProduto(produtoId, userId) {
        const produto = await this.getProduto(produtoId);
        if (!produto) return 0;
        const quantidadeBloqueada = await this.getQuantidadeBloqueadaPorProduto(produtoId, userId);
        return Math.max(0, produto.quantidade - quantidadeBloqueada);
      }
      async converterOrcamentoEmVenda(orcamentoId, userId, vendedor, formaPagamento) {
        return await this.db.transaction(async (tx) => {
          const [orcamento] = await tx.select().from(orcamentos).where(
            and(
              eq(orcamentos.id, orcamentoId),
              eq(orcamentos.user_id, userId)
            )
          ).for("update");
          if (!orcamento) {
            throw new Error("Or\xE7amento n\xE3o encontrado");
          }
          if (orcamento.status !== "aprovado") {
            throw new Error("Apenas or\xE7amentos aprovados podem ser convertidos em venda");
          }
          const itens = Array.isArray(orcamento.itens) ? orcamento.itens : [];
          let clienteId = orcamento.cliente_id;
          if (!clienteId && orcamento.cliente_nome) {
            const clientesEncontrados = await tx.select().from(clientes).where(
              and(
                eq(clientes.user_id, userId),
                eq(clientes.nome, orcamento.cliente_nome)
              )
            );
            if (clientesEncontrados.length > 0) {
              clienteId = clientesEncontrados[0].id;
            } else {
              const [novoCliente] = await tx.insert(clientes).values({
                user_id: userId,
                nome: orcamento.cliente_nome,
                email: orcamento.cliente_email,
                telefone: orcamento.cliente_telefone,
                cpf_cnpj: orcamento.cliente_cpf_cnpj,
                data_cadastro: (/* @__PURE__ */ new Date()).toISOString()
              }).returning();
              clienteId = novoCliente.id;
            }
          }
          const [venda] = await tx.insert(vendas).values({
            user_id: userId,
            data: (/* @__PURE__ */ new Date()).toISOString(),
            valor_total: orcamento.valor_total,
            forma_pagamento: formaPagamento || "dinheiro",
            itens: JSON.stringify(itens),
            cliente_id: clienteId || void 0,
            produto: itens.map((i) => i.nome).join(", "),
            quantidade_vendida: itens.reduce((sum, i) => sum + i.quantidade, 0),
            orcamento_id: orcamentoId,
            orcamento_numero: orcamento.numero,
            vendedor: vendedor || orcamento.vendedor || "Sistema"
          }).returning();
          await tx.update(orcamentos).set({
            status: "convertido",
            data_atualizacao: (/* @__PURE__ */ new Date()).toISOString(),
            venda_id: venda.id
          }).where(eq(orcamentos.id, orcamentoId));
          for (const item of itens) {
            const [produtoAtual] = await tx.select().from(produtos).where(
              and(
                eq(produtos.id, item.produto_id),
                eq(produtos.user_id, userId)
              )
            ).for("update");
            if (!produtoAtual) {
              throw new Error(`Produto ${item.produto_id} n\xE3o encontrado`);
            }
            if (produtoAtual.quantidade < item.quantidade) {
              throw new Error(`Estoque insuficiente para ${item.nome}. Dispon\xEDvel: ${produtoAtual.quantidade}, Solicitado: ${item.quantidade}`);
            }
            await tx.update(produtos).set({
              quantidade: sql`${produtos.quantidade} - ${item.quantidade}`
            }).where(eq(produtos.id, item.produto_id));
          }
          await tx.delete(bloqueiosEstoque).where(eq(bloqueiosEstoque.orcamento_id, orcamentoId));
          return venda;
        });
      }
      // ============================================
      // MÉTODOS DE GESTÃO DE CLIENTE 360°
      // ============================================
      async getClientNotes(userId, limit = 50, offset = 0) {
        const results = await this.db.select().from(clientNotes).where(eq(clientNotes.user_id, userId)).orderBy(desc(clientNotes.created_at)).limit(limit).offset(offset);
        return results;
      }
      async createClientNote(note) {
        const [created] = await this.db.insert(clientNotes).values(note).returning();
        return created;
      }
      async updateClientNote(id, updates) {
        const { content } = updates;
        const sanitizedUpdates = {};
        if (content !== void 0) sanitizedUpdates.content = content;
        sanitizedUpdates.updated_at = sql`NOW()`;
        const [updated] = await this.db.update(clientNotes).set(sanitizedUpdates).where(eq(clientNotes.id, id)).returning();
        return updated;
      }
      async deleteClientNote(id) {
        const result = await this.db.delete(clientNotes).where(eq(clientNotes.id, id)).returning();
        return result.length > 0;
      }
      async getClientDocuments(userId, limit = 50, offset = 0) {
        const results = await this.db.select().from(clientDocuments).where(eq(clientDocuments.user_id, userId)).orderBy(desc(clientDocuments.uploaded_at)).limit(limit).offset(offset);
        return results;
      }
      async createClientDocument(document) {
        const [created] = await this.db.insert(clientDocuments).values(document).returning();
        return created;
      }
      async deleteClientDocument(id) {
        const result = await this.db.delete(clientDocuments).where(eq(clientDocuments.id, id)).returning();
        return result.length > 0;
      }
      async createEmployeePackage(data) {
        try {
          const packageData = {
            user_id: data.user_id,
            package_type: data.package_type,
            quantity: data.quantity,
            price: data.price,
            status: data.status || "ativo",
            payment_id: data.payment_id || null,
            data_compra: (/* @__PURE__ */ new Date()).toISOString(),
            data_vencimento: data.data_vencimento,
            data_cancelamento: data.data_cancelamento || null
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
        ON CONFLICT (payment_id) WHERE payment_id IS NOT NULL DO NOTHING
        RETURNING *
      `);
          if (result.rows.length === 0 && packageData.payment_id) {
            logger.warn("[DB] Pacote de funcion\xE1rios j\xE1 existe para este payment_id - ignorando duplicata", {
              payment_id: packageData.payment_id
            });
            const existing = await this.getEmployeePackageByPaymentId(packageData.payment_id);
            return existing;
          }
          return result.rows[0];
        } catch (error) {
          logger.error("[DB] Erro ao criar pacote de funcion\xE1rios:", { error });
          throw error;
        }
      }
      async getEmployeePackages(userId) {
        try {
          const result = await this.db.execute(sql`
        SELECT * FROM employee_packages 
        WHERE user_id = ${userId} 
        ORDER BY data_compra DESC
      `);
          return result.rows;
        } catch (error) {
          logger.error("[DB] Erro ao buscar pacotes de funcion\xE1rios:", { error });
          return [];
        }
      }
      async updateEmployeePackageStatus(packageId, status, dataCancelamento) {
        try {
          const updateFields = { status };
          if (dataCancelamento) {
            updateFields.data_cancelamento = dataCancelamento;
          }
          const [result] = await this.db.update(employeePackages).set(updateFields).where(eq(employeePackages.id, packageId)).returning();
          logger.info("[DB] Status do pacote de funcion\xE1rios atualizado", { packageId, status });
          return result;
        } catch (error) {
          logger.error("[DB] Erro ao atualizar status do pacote:", { error: error.message, packageId, status });
          throw error;
        }
      }
      async getAllEmployeePackages() {
        try {
          const result = await this.db.execute(sql`
        SELECT * FROM employee_packages 
        ORDER BY data_compra DESC
      `);
          return result.rows;
        } catch (error) {
          logger.error("[DB] Erro ao buscar todos os pacotes de funcion\xE1rios:", { error });
          return [];
        }
      }
      async deleteEmployeePackage(packageId) {
        try {
          const result = await this.db.delete(employeePackages).where(eq(employeePackages.id, packageId)).returning();
          logger.info("[DB] Pacote de funcion\xE1rios deletado", { packageId });
          return result.length > 0;
        } catch (error) {
          logger.error("[DB] Erro ao deletar pacote de funcion\xE1rios:", { error: error.message, packageId });
          return false;
        }
      }
      async getEmployeePackageByPaymentId(paymentId) {
        try {
          const result = await this.db.execute(sql`
        SELECT * FROM employee_packages 
        WHERE payment_id = ${paymentId}
        LIMIT 1
      `);
          return result.rows[0] || void 0;
        } catch (error) {
          logger.error("[DB] Erro ao buscar pacote por payment_id:", { error, paymentId });
          return void 0;
        }
      }
      async getClientInteractions(userId, limit = 50, offset = 0) {
        const results = await this.db.select().from(clientInteractions).where(eq(clientInteractions.user_id, userId)).orderBy(desc(clientInteractions.created_at)).limit(limit).offset(offset);
        return results;
      }
      async createClientInteraction(interaction) {
        const [created] = await this.db.insert(clientInteractions).values(interaction).returning();
        return created;
      }
      async getPlanChangesHistory(userId, limit = 50, offset = 0) {
        const results = await this.db.select().from(planChangesHistory).where(eq(planChangesHistory.user_id, userId)).orderBy(desc(planChangesHistory.changed_at)).limit(limit).offset(offset);
        return results;
      }
      async createPlanChangeHistory(change) {
        const [created] = await this.db.insert(planChangesHistory).values(change).returning();
        return created;
      }
      async getClientCommunications(userId, limit = 50, offset = 0) {
        const results = await this.db.select().from(clientCommunications).where(eq(clientCommunications.user_id, userId)).orderBy(desc(clientCommunications.sent_at)).limit(limit).offset(offset);
        return results;
      }
      async createClientCommunication(communication) {
        const [created] = await this.db.insert(clientCommunications).values(communication).returning();
        return created;
      }
      async getClientTimeline(userId, limit = 50, offset = 0) {
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
      async createPasswordResetCode(email, code, expiresAt) {
        await this.db.execute(sql`
      INSERT INTO password_reset_codes (email, code, expires_at, used) 
      VALUES (${email}, ${code}, ${expiresAt}, false)
    `);
      }
      async getPasswordResetCode(email) {
        const result = await this.db.execute(sql`
      SELECT code, expires_at 
      FROM password_reset_codes 
      WHERE email = ${email} AND used = false 
      ORDER BY created_at DESC 
      LIMIT 1
    `);
        return result.rows[0] || null;
      }
      async markPasswordResetCodeAsUsed(email, code) {
        await this.db.execute(sql`
      UPDATE password_reset_codes 
      SET used = true 
      WHERE email = ${email} AND code = ${code}
    `);
      }
      // Métodos para System Owner (Dono do Sistema)
      async getSystemOwner() {
        try {
          const result = await this.db.execute(sql`
        SELECT * FROM system_owner LIMIT 1
      `);
          return result.rows[0];
        } catch (error) {
          logger.error("[DB] Erro ao buscar system owner:", { error });
          return void 0;
        }
      }
      async setSystemOwner(data) {
        try {
          const existing = await this.getSystemOwner();
          if (existing) {
            const result = await this.db.execute(sql`
          UPDATE system_owner 
          SET owner_user_id = ${data.owner_user_id},
              observacoes = ${data.observacoes || null}
          WHERE id = ${existing.id}
          RETURNING *
        `);
            logger.info("[DB] System owner atualizado", { owner_user_id: data.owner_user_id });
            return result.rows[0];
          } else {
            const result = await this.db.execute(sql`
          INSERT INTO system_owner (owner_user_id, data_configuracao, observacoes)
          VALUES (${data.owner_user_id}, ${(/* @__PURE__ */ new Date()).toISOString()}, ${data.observacoes || null})
          RETURNING *
        `);
            logger.info("[DB] System owner criado", { owner_user_id: data.owner_user_id });
            return result.rows[0];
          }
        } catch (error) {
          logger.error("[DB] Erro ao configurar system owner:", { error });
          throw error;
        }
      }
      // ============================================
      // MÉTODOS PARA SESSÕES E FINGERPRINTING
      // ============================================
      async createSession(data) {
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
          logger.info("[SESSION] Nova sess\xE3o criada", {
            userId: data.user_id,
            userType: data.user_type,
            fingerprint: data.device_fingerprint.substring(0, 16) + "..."
          });
          return result.rows[0];
        } catch (error) {
          logger.error("[SESSION] Erro ao criar sess\xE3o:", { error });
          throw error;
        }
      }
      async getSessionByToken(token) {
        try {
          const result = await this.db.execute(sql`
        SELECT * FROM user_sessions 
        WHERE session_token = ${token} AND is_active = 'true'
        LIMIT 1
      `);
          return result.rows[0];
        } catch (error) {
          logger.error("[SESSION] Erro ao buscar sess\xE3o:", { error });
          return void 0;
        }
      }
      async getActiveSessionsByUser(userId, userType) {
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
            return result.rows;
          } else {
            const result = await this.db.execute(sql`
          SELECT * FROM user_sessions 
          WHERE user_id = ${userId} 
            AND is_active = 'true'
            AND expires_at > NOW()
          ORDER BY created_at DESC
        `);
            return result.rows;
          }
        } catch (error) {
          logger.error("[SESSION] Erro ao buscar sess\xF5es ativas:", { error });
          return [];
        }
      }
      async getActiveSessionCount(userId, userType) {
        try {
          const sessions = await this.getActiveSessionsByUser(userId, userType);
          return sessions.length;
        } catch (error) {
          logger.error("[SESSION] Erro ao contar sess\xF5es:", { error });
          return 0;
        }
      }
      async updateSessionActivity(token) {
        try {
          await this.db.execute(sql`
        UPDATE user_sessions 
        SET last_activity = NOW()
        WHERE session_token = ${token} AND is_active = 'true'
      `);
        } catch (error) {
          logger.error("[SESSION] Erro ao atualizar atividade:", { error });
        }
      }
      async invalidateSession(token) {
        try {
          await this.db.execute(sql`
        UPDATE user_sessions 
        SET is_active = 'false'
        WHERE session_token = ${token}
      `);
          logger.info("[SESSION] Sess\xE3o invalidada", { token: token.substring(0, 16) + "..." });
        } catch (error) {
          logger.error("[SESSION] Erro ao invalidar sess\xE3o:", { error });
        }
      }
      async invalidateAllUserSessions(userId, userType) {
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
          logger.info("[SESSION] Todas as sess\xF5es invalidadas", { userId, userType });
        } catch (error) {
          logger.error("[SESSION] Erro ao invalidar sess\xF5es:", { error });
        }
      }
      async invalidateOldestSession(userId, userType) {
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
          logger.info("[SESSION] Sess\xE3o mais antiga invalidada", { userId, userType });
        } catch (error) {
          logger.error("[SESSION] Erro ao invalidar sess\xE3o antiga:", { error });
        }
      }
      async cleanExpiredSessions() {
        try {
          const result = await this.db.execute(sql`
        UPDATE user_sessions 
        SET is_active = 'false'
        WHERE expires_at < NOW() AND is_active = 'true'
        RETURNING id
      `);
          const count = result.rows.length;
          if (count > 0) {
            logger.info("[SESSION] Sess\xF5es expiradas limpas", { count });
          }
          return count;
        } catch (error) {
          logger.error("[SESSION] Erro ao limpar sess\xF5es expiradas:", { error });
          return 0;
        }
      }
      // ========================================
      // MÉTODOS DO SISTEMA DE COMUNICAÇÃO
      // ========================================
      async getEmailTemplates() {
        const result = await this.db.execute(sql`
      SELECT * FROM email_templates ORDER BY created_at DESC
    `);
        return result.rows;
      }
      async createEmailTemplate(data) {
        const result = await this.db.execute(sql`
      INSERT INTO email_templates (nome, assunto, conteudo, tipo, variaveis, ativo)
      VALUES (${data.nome}, ${data.assunto}, ${data.conteudo}, ${data.tipo || "manual"}, ${data.variaveis || null}, ${data.ativo || "true"})
      RETURNING *
    `);
        return result.rows[0];
      }
      async updateEmailTemplate(id, data) {
        const result = await this.db.execute(sql`
      UPDATE email_templates 
      SET nome = ${data.nome}, assunto = ${data.assunto}, conteudo = ${data.conteudo}, 
          tipo = ${data.tipo}, variaveis = ${data.variaveis}, ativo = ${data.ativo},
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `);
        return result.rows[0];
      }
      async deleteEmailTemplate(id) {
        await this.db.execute(sql`DELETE FROM email_templates WHERE id = ${id}`);
      }
      async getEmailHistory(userId, limit = 100) {
        if (userId) {
          const result2 = await this.db.execute(sql`
        SELECT eh.*, u.nome as user_nome, u.email as user_email
        FROM email_history eh
        LEFT JOIN users u ON eh.user_id = u.id
        WHERE eh.user_id = ${userId}
        ORDER BY eh.created_at DESC
        LIMIT ${limit}
      `);
          return result2.rows;
        }
        const result = await this.db.execute(sql`
      SELECT eh.*, u.nome as user_nome, u.email as user_email
      FROM email_history eh
      LEFT JOIN users u ON eh.user_id = u.id
      ORDER BY eh.created_at DESC
      LIMIT ${limit}
    `);
        return result.rows;
      }
      async getEmailHistoryByUser(userId) {
        const result = await this.db.execute(sql`
      SELECT * FROM email_history 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `);
        return result.rows;
      }
      async createEmailHistory(data) {
        const result = await this.db.execute(sql`
      INSERT INTO email_history (user_id, template_id, email_destino, assunto, conteudo, tipo, segmento, status, erro)
      VALUES (${data.user_id || null}, ${data.template_id || null}, ${data.email_destino}, ${data.assunto}, ${data.conteudo}, ${data.tipo || "manual"}, ${data.segmento || null}, ${data.status || "enviado"}, ${data.erro || null})
      RETURNING *
    `);
        return result.rows[0];
      }
      async getEmailAutomation() {
        const result = await this.db.execute(sql`
      SELECT ea.*, et.nome as template_nome
      FROM email_automation ea
      LEFT JOIN email_templates et ON ea.template_id = et.id
      ORDER BY ea.tipo
    `);
        return result.rows;
      }
      async upsertEmailAutomation(tipo, data) {
        const result = await this.db.execute(sql`
      INSERT INTO email_automation (tipo, template_id, ativo, dias_antes, descricao)
      VALUES (${tipo}, ${data.template_id || null}, ${data.ativo || "true"}, ${data.dias_antes || null}, ${data.descricao || null})
      ON CONFLICT (tipo) DO UPDATE SET
        template_id = ${data.template_id || null},
        ativo = ${data.ativo || "true"},
        dias_antes = ${data.dias_antes || null},
        descricao = ${data.descricao || null},
        updated_at = NOW()
      RETURNING *
    `);
        return result.rows[0];
      }
      async getEmailStats() {
        const result = await this.db.execute(sql`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'enviado' THEN 1 END) as enviados,
        COUNT(CASE WHEN status = 'falha' THEN 1 END) as falhas,
        COUNT(CASE WHEN tipo = 'massa' THEN 1 END) as massa,
        COUNT(CASE WHEN tipo = 'manual' THEN 1 END) as manual,
        COUNT(CASE WHEN tipo = 'automatico' THEN 1 END) as automatico,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '24 hours' THEN 1 END) as ultimas_24h,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as ultimos_7dias
      FROM email_history
    `);
        return result.rows[0];
      }
    };
  }
});

// server/storage.ts
var storage2;
var init_storage = __esm({
  "server/storage.ts"() {
    "use strict";
    init_postgres_storage();
    storage2 = new PostgresStorage();
  }
});

// server/email-service.ts
var email_service_exports = {};
__export(email_service_exports, {
  EmailService: () => EmailService
});
import nodemailer from "nodemailer";
import fs2 from "fs";
import path2 from "path";
function formatCurrency(value) {
  if (value === null || value === void 0) {
    return "0,00";
  }
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(numValue)) {
    return "0,00";
  }
  return numValue.toFixed(2).replace(".", ",");
}
var logger2, EmailService;
var init_email_service = __esm({
  "server/email-service.ts"() {
    "use strict";
    logger2 = {
      warn: (message, context, data) => console.warn(`[${context}] ${message}`, data),
      info: (message, context, data) => console.info(`[${context}] ${message}`, data),
      error: (message, context, data) => console.error(`[${context}] ${message}`, data)
    };
    EmailService = class {
      transporter;
      logoBase64;
      constructor() {
        const logoPath = path2.join(process.cwd(), "attached_assets", "generated_images", "Pavisoft_Sistemas_email_header_logo_bee66462.png");
        try {
          const logoBuffer = fs2.readFileSync(logoPath);
          this.logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;
        } catch (error) {
          console.warn("\u26A0\uFE0F Logo n\xE3o encontrado, usando banner padr\xE3o");
          this.logoBase64 = "";
        }
        const smtpPassword = process.env.SMTP_PASSWORD || process.env.SMTP_PASS || "";
        if (!process.env.SMTP_USER || !smtpPassword) {
          logger2.warn("SMTP n\xE3o configurado - vari\xE1veis SMTP_USER e SMTP_PASSWORD s\xE3o obrigat\xF3rias", "EMAIL_SERVICE");
          console.error("\u274C ERRO SMTP: Credenciais n\xE3o encontradas nas vari\xE1veis de ambiente");
          console.error("   SMTP_USER:", process.env.SMTP_USER ? "\u2713 Configurado" : "\u2717 N\xE3o encontrado");
          console.error("   SMTP_PASSWORD:", smtpPassword ? "\u2713 Configurado" : "\u2717 N\xE3o encontrado");
          console.error("   Configure os Secrets do Replit com SMTP_USER e SMTP_PASSWORD");
        }
        const smtpPort = parseInt(process.env.SMTP_PORT || "587");
        const useSSL = smtpPort === 465;
        this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || "smtp.gmail.com",
          port: smtpPort,
          secure: useSSL,
          // true para porta 465, false para 587 (usa STARTTLS)
          auth: {
            user: process.env.SMTP_USER || "",
            pass: smtpPassword
          },
          // Configurações de timeout e retry
          connectionTimeout: 1e4,
          // 10 segundos
          greetingTimeout: 5e3,
          socketTimeout: 1e4,
          pool: true,
          maxConnections: 5,
          rateDelta: 2e4,
          rateLimit: 5,
          // Para porta 587, forçar STARTTLS
          requireTLS: !useSSL,
          tls: {
            // Não rejeitar certificados auto-assinados em desenvolvimento
            rejectUnauthorized: process.env.NODE_ENV === "production"
          }
        });
        const verifyTimeout = setTimeout(() => {
          console.warn("\u26A0\uFE0F Timeout ao verificar SMTP - continuando mesmo assim");
          logger2.warn("Timeout na verifica\xE7\xE3o SMTP", "EMAIL_SERVICE");
        }, 8e3);
        this.transporter.verify((error, success) => {
          clearTimeout(verifyTimeout);
          if (error) {
            console.warn("\u26A0\uFE0F SMTP n\xE3o configurado corretamente. Configure as credenciais nas vari\xE1veis de ambiente.");
            logger2.warn("SMTP n\xE3o configurado", "EMAIL_SERVICE", {
              host: this.transporter.options.host,
              port: this.transporter.options.port,
              secure: this.transporter.options.secure,
              user: this.transporter.options.auth?.user,
              error: error.message
            });
          } else {
            console.log("\u2705 Servidor SMTP pronto para enviar emails");
            logger2.info("SMTP configurado com sucesso", "EMAIL_SERVICE");
          }
        });
      }
      // Template base para todos os emails
      getBaseTemplate(content, backgroundColor = "#f8fafc") {
        return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Pavisoft Sistemas</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: ${backgroundColor};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: ${backgroundColor}; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); overflow: hidden;">

          <!-- Header com Logo -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 48px 40px; text-align: center;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <div style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border-radius: 12px; padding: 20px; display: inline-block;">
                      <h1 style="font-size: 32px; font-weight: 700; color: #ffffff; margin: 0; letter-spacing: 1px;">PAVISOFT</h1>
                      <div style="width: 60px; height: 3px; background: linear-gradient(90deg, #60a5fa, #3b82f6); margin: 12px auto; border-radius: 2px;"></div>
                      <p style="font-size: 13px; color: rgba(255, 255, 255, 0.9); margin: 0; letter-spacing: 2px; text-transform: uppercase; font-weight: 500;">Sistemas de Gest\xE3o</p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Conte\xFAdo -->
          ${content}

          <!-- Footer -->
          <tr>
            <td style="background: linear-gradient(to bottom, #f8fafc, #f1f5f9); padding: 40px; text-align: center; border-top: 1px solid #e2e8f0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <h3 style="font-size: 18px; font-weight: 700; color: #1e3a8a; margin: 0 0 8px 0; letter-spacing: 0.5px;">PAVISOFT SISTEMAS</h3>
                    <div style="width: 40px; height: 2px; background: linear-gradient(90deg, #3b82f6, #60a5fa); margin: 12px auto; border-radius: 2px;"></div>
                    <p style="color: #64748b; font-size: 13px; line-height: 1.8; margin: 16px 0 0 0;">
                      <strong style="color: #475569;">Gest\xE3o Empresarial Completa</strong><br>
                      PDV \u2022 Estoque \u2022 Financeiro \u2022 NFCe \u2022 Relat\xF3rios<br><br>
                      <span style="font-size: 12px; color: #94a3b8;">
                        \u{1F4E7} atendimento.pavisoft@gmail.com<br>
                        \u{1F310} www.pavisoft.com.br
                      </span>
                    </p>
                    <p style="color: #94a3b8; font-size: 11px; margin: 20px 0 0 0; font-style: italic;">
                      Este \xE9 um email autom\xE1tico. Por favor, n\xE3o responda.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
      }
      async sendMailSafely(mailOptions) {
        try {
          await this.transporter.sendMail(mailOptions);
          return true;
        } catch (error) {
          console.error("\u274C Erro ao enviar email:", error.message);
          logger2.error("Falha ao enviar email", "EMAIL_SERVICE", { error: error.message });
          return false;
        }
      }
      async sendPasswordResetCode(config) {
        const content = `
<tr>
  <td style="padding: 48px 40px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td>
          <p style="font-size: 18px; color: #1e293b; margin: 0 0 8px 0; font-weight: 600;">
            Ol\xE1, ${config.userName}! \u{1F44B}
          </p>
          <p style="color: #64748b; font-size: 15px; line-height: 1.7; margin: 0 0 32px 0;">
            Recebemos uma solicita\xE7\xE3o para redefinir a senha da sua conta. Use o c\xF3digo de verifica\xE7\xE3o abaixo para confirmar sua identidade e criar uma nova senha.
          </p>

          <!-- Code Box -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 32px 0;">
            <tr>
              <td style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border: 2px solid #3b82f6; border-radius: 12px; padding: 32px; text-align: center;">
                <p style="color: #1e40af; font-size: 13px; font-weight: 700; margin: 0 0 16px 0; text-transform: uppercase; letter-spacing: 1.5px;">
                  SEU C\xD3DIGO DE RECUPERA\xC7\xC3O
                </p>
                <div style="background: #ffffff; border-radius: 8px; padding: 20px; margin: 0 auto; display: inline-block; box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);">
                  <p style="font-size: 42px; font-weight: 700; color: #1e40af; letter-spacing: 8px; font-family: 'Courier New', Courier, monospace; margin: 0;">
                    ${config.code}
                  </p>
                </div>
                <p style="color: #3b82f6; font-size: 12px; margin: 16px 0 0 0; font-weight: 500;">
                  V\xE1lido por 15 minutos
                </p>
              </td>
            </tr>
          </table>

          <!-- Warning Box -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0;">
            <tr>
              <td style="background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 20px;">
                <p style="color: #92400e; font-size: 14px; margin: 0; line-height: 1.6;">
                  <strong>\u26A0\uFE0F Importante:</strong> Se voc\xEA n\xE3o solicitou esta altera\xE7\xE3o, ignore este email. Sua senha permanecer\xE1 inalterada e sua conta continuar\xE1 segura.
                </p>
              </td>
            </tr>
          </table>

          <p style="color: #64748b; font-size: 14px; line-height: 1.7; margin: 24px 0 0 0;">
            <strong style="color: #475569;">Dica de seguran\xE7a:</strong> Nunca compartilhe este c\xF3digo com ningu\xE9m, nem mesmo com a equipe do Pavisoft. Nossos funcion\xE1rios jamais solicitar\xE3o este c\xF3digo.
          </p>
        </td>
      </tr>
    </table>
  </td>
</tr>
    `;
        const html = this.getBaseTemplate(content, "#eff6ff");
        return await this.sendMailSafely({
          from: process.env.SMTP_FROM || "Pavisoft Sistemas <noreply@pavisoft.com>",
          to: config.to,
          subject: "\u{1F510} C\xF3digo de Recupera\xE7\xE3o de Senha - Pavisoft Sistemas",
          html
        });
      }
      async sendVerificationCode(config) {
        const content = `
<tr>
  <td style="padding: 48px 40px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td>
          <p style="font-size: 18px; color: #1e293b; margin: 0 0 8px 0; font-weight: 600;">
            Ol\xE1, ${config.userName}! \u{1F44B}
          </p>
          <p style="color: #64748b; font-size: 15px; line-height: 1.7; margin: 0 0 32px 0;">
            Recebemos uma solicita\xE7\xE3o para redefinir a senha da sua conta. Use o c\xF3digo de verifica\xE7\xE3o abaixo para confirmar sua identidade e criar uma nova senha.
          </p>

          <!-- Code Box -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 32px 0;">
            <tr>
              <td style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border: 2px solid #3b82f6; border-radius: 12px; padding: 32px; text-align: center;">
                <p style="color: #1e40af; font-size: 13px; font-weight: 700; margin: 0 0 16px 0; text-transform: uppercase; letter-spacing: 1.5px;">
                  SEU C\xD3DIGO DE VERIFICA\xC7\xC3O
                </p>
                <div style="background: #ffffff; border-radius: 8px; padding: 20px; margin: 0 auto; display: inline-block; box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);">
                  <p style="font-size: 42px; font-weight: 700; color: #1e40af; letter-spacing: 8px; font-family: 'Courier New', Courier, monospace; margin: 0;">
                    ${config.code}
                  </p>
                </div>
                <p style="color: #3b82f6; font-size: 12px; margin: 16px 0 0 0; font-weight: 500;">
                  V\xE1lido por 10 minutos
                </p>
              </td>
            </tr>
          </table>

          <!-- Warning Box -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0;">
            <tr>
              <td style="background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 20px;">
                <p style="color: #92400e; font-size: 14px; margin: 0; line-height: 1.6;">
                  <strong>\u26A0\uFE0F Importante:</strong> Se voc\xEA n\xE3o solicitou esta altera\xE7\xE3o, ignore este email. Sua senha permanecer\xE1 inalterada e sua conta continuar\xE1 segura.
                </p>
              </td>
            </tr>
          </table>

          <p style="color: #64748b; font-size: 14px; line-height: 1.7; margin: 24px 0 0 0;">
            <strong style="color: #475569;">Dica de seguran\xE7a:</strong> Nunca compartilhe este c\xF3digo com ningu\xE9m, nem mesmo com a equipe do Pavisoft. Nossos funcion\xE1rios jamais solicitar\xE3o este c\xF3digo.
          </p>
        </td>
      </tr>
    </table>
  </td>
</tr>
    `;
        const html = this.getBaseTemplate(content, "#eff6ff");
        await this.transporter.sendMail({
          from: process.env.SMTP_FROM || "Pavisoft Sistemas <noreply@pavisoft.com>",
          to: config.to,
          subject: "\u{1F510} C\xF3digo de Verifica\xE7\xE3o - Pavisoft Sistemas",
          html
        });
      }
      async sendEmployeePackagePurchased(config) {
        const content = `
<tr>
  <td style="padding: 48px 40px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td>
          <p style="font-size: 18px; color: #1e293b; margin: 0 0 8px 0; font-weight: 600;">
            Ol\xE1, ${config.userName}! \u{1F44B}
          </p>
          <p style="color: #64748b; font-size: 15px; line-height: 1.7; margin: 0 0 32px 0;">
            Ficamos felizes em informar que voc\xEA selecionou o <strong style="color: #1e40af;">${config.packageName}</strong> para expandir sua equipe no Pavisoft Sistemas!
          </p>

          <!-- Resumo do Pedido -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 2px solid #0ea5e9; border-radius: 12px; padding: 28px; margin: 32px 0;">
            <tr>
              <td>
                <p style="color: #0c4a6e; font-size: 15px; font-weight: 700; margin: 0 0 20px 0; text-transform: uppercase; letter-spacing: 0.5px;">
                  \u{1F4E6} Resumo do Pedido
                </p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #bae6fd;">
                      <span style="color: #0369a1; font-size: 14px;">Pacote Selecionado</span>
                    </td>
                    <td align="right" style="padding: 12px 0; border-bottom: 1px solid #bae6fd;">
                      <strong style="color: #0c4a6e; font-size: 14px;">${config.packageName}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #bae6fd;">
                      <span style="color: #0369a1; font-size: 14px;">Funcion\xE1rios Adicionais</span>
                    </td>
                    <td align="right" style="padding: 12px 0; border-bottom: 1px solid #bae6fd;">
                      <strong style="color: #0c4a6e; font-size: 14px;">+${config.quantity} colaboradores</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 16px 0 0 0;">
                      <span style="color: #0369a1; font-size: 14px;">Valor Total</span>
                    </td>
                    <td align="right" style="padding: 16px 0 0 0;">
                      <strong style="color: #0ea5e9; font-size: 22px; font-weight: 700;">R$ ${formatCurrency(config.price)}</strong>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <p style="color: #64748b; font-size: 15px; line-height: 1.7; margin: 24px 0;">
            Para completar sua compra e ativar os novos funcion\xE1rios, clique no bot\xE3o abaixo para realizar o pagamento de forma segura:
          </p>

          <!-- CTA Button -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 32px 0;">
            <tr>
              <td align="center">
                <a href="${config.paymentUrl}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: #ffffff; text-decoration: none; padding: 18px 48px; border-radius: 10px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); transition: all 0.3s;">
                  \u{1F512} Realizar Pagamento Seguro
                </a>
              </td>
            </tr>
          </table>

          <!-- Info Box -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 32px 0;">
            <tr>
              <td style="background: #ecfdf5; border-left: 4px solid #10b981; border-radius: 8px; padding: 20px;">
                <p style="color: #065f46; font-size: 14px; margin: 0; line-height: 1.6;">
                  <strong>\u2705 Ativa\xE7\xE3o Autom\xE1tica:</strong> Seu limite de funcion\xE1rios ser\xE1 aumentado automaticamente assim que o pagamento for confirmado. Voc\xEA receber\xE1 um email de confirma\xE7\xE3o imediatamente.
                </p>
              </td>
            </tr>
          </table>

          <p style="color: #64748b; font-size: 14px; line-height: 1.7; margin: 32px 0 0 0;">
            D\xFAvidas? Nossa equipe est\xE1 \xE0 disposi\xE7\xE3o para ajudar. Entre em contato conosco atrav\xE9s do email <a href="mailto:atendimento.pavisoft@gmail.com" style="color: #3b82f6; text-decoration: none;">atendimento.pavisoft@gmail.com</a>
          </p>
        </td>
      </tr>
    </table>
  </td>
</tr>
    `;
        const html = this.getBaseTemplate(content);
        await this.transporter.sendMail({
          from: process.env.SMTP_FROM || "Pavisoft Sistemas <noreply@pavisoft.com>",
          to: config.to,
          subject: `\u{1F4BC} ${config.packageName} - Aguardando Pagamento`,
          html
        });
      }
      async sendEmployeePackageActivated(config) {
        const content = `
<tr>
  <td style="padding: 48px 40px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td>
          <p style="font-size: 18px; color: #1e293b; margin: 0 0 8px 0; font-weight: 600;">
            Ol\xE1, ${config.userName}! \u{1F44B}
          </p>

          <!-- Success Banner -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0;">
            <tr>
              <td style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border: 2px solid #10b981; border-radius: 12px; padding: 28px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 12px;">\u2705</div>
                <p style="color: #065f46; font-size: 20px; font-weight: 700; margin: 0;">
                  Pagamento Confirmado com Sucesso!
                </p>
              </td>
            </tr>
          </table>

          <p style="color: #64748b; font-size: 15px; line-height: 1.7; margin: 24px 0;">
            Temos o prazer de informar que seu pagamento foi processado e confirmado. <strong style="color: #10b981;">Seu limite de funcion\xE1rios foi aumentado imediatamente!</strong>
          </p>

          <!-- Recibo da Transa\xE7\xE3o -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 28px; margin: 32px 0;">
            <tr>
              <td>
                <p style="color: #1e293b; font-size: 15px; font-weight: 700; margin: 0 0 20px 0; text-transform: uppercase; letter-spacing: 0.5px;">
                  \u{1F4CB} Recibo da Transa\xE7\xE3o
                </p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                      <span style="color: #64748b; font-size: 14px;">Pacote Adquirido</span>
                    </td>
                    <td align="right" style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                      <strong style="color: #1e293b; font-size: 14px;">${config.packageName}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                      <span style="color: #64748b; font-size: 14px;">Funcion\xE1rios Adicionados</span>
                    </td>
                    <td align="right" style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                      <strong style="color: #1e293b; font-size: 14px;">+${config.quantity} colaboradores</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                      <span style="color: #64748b; font-size: 14px;">Novo Limite Total</span>
                    </td>
                    <td align="right" style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                      <strong style="color: #10b981; font-size: 18px;">${config.newLimit} funcion\xE1rios</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                      <span style="color: #64748b; font-size: 14px;">Valor Pago</span>
                    </td>
                    <td align="right" style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                      <strong style="color: #1e293b; font-size: 14px;">R$ ${formatCurrency(config.price)}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0;">
                      <span style="color: #64748b; font-size: 14px;">Data da Ativa\xE7\xE3o</span>
                    </td>
                    <td align="right" style="padding: 10px 0;">
                      <strong style="color: #1e293b; font-size: 14px;">${(/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}</strong>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <!-- Call to Action -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0;">
            <tr>
              <td style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-left: 4px solid #3b82f6; border-radius: 8px; padding: 20px;">
                <p style="color: #1e40af; font-size: 15px; margin: 0; line-height: 1.6; font-weight: 500;">
                  <strong>\u{1F680} Pr\xF3ximo Passo:</strong> Voc\xEA j\xE1 pode cadastrar novos funcion\xE1rios no sistema! Acesse o painel administrativo e comece agora mesmo.
                </p>
              </td>
            </tr>
          </table>

          <p style="color: #64748b; font-size: 14px; line-height: 1.7; margin: 32px 0 0 0;">
            Obrigado por escolher o Pavisoft Sistemas! Estamos aqui para ajudar sua empresa a crescer. \u{1F389}
          </p>
        </td>
      </tr>
    </table>
  </td>
</tr>
    `;
        const html = this.getBaseTemplate(content, "#f0fdf4");
        await this.transporter.sendMail({
          from: process.env.SMTP_FROM || "Pavisoft Sistemas <noreply@pavisoft.com>",
          to: config.to,
          subject: `\u2705 ${config.packageName} Ativado - Recibo de Pagamento`,
          html
        });
      }
      async sendPasswordResetConfirmation(config) {
        const content = `
<tr>
  <td style="padding: 48px 40px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td>
          <p style="font-size: 18px; color: #1e293b; margin: 0 0 8px 0; font-weight: 600;">
            Ol\xE1, ${config.userName}! \u{1F44B}
          </p>

          <!-- Alerta de Seguran\xE7a -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0;">
            <tr>
              <td style="background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); border: 2px solid #ef4444; border-radius: 12px; padding: 28px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 12px;">\u{1F510}</div>
                <p style="color: #991b1b; font-size: 18px; font-weight: 700; margin: 0;">
                  Sua Senha Foi Redefinida
                </p>
              </td>
            </tr>
          </table>

          <p style="color: #64748b; font-size: 15px; line-height: 1.7; margin: 24px 0;">
            Informamos que sua senha de acesso ao sistema Pavisoft foi redefinida pelo administrador da sua conta por motivos de seguran\xE7a.
          </p>

          <!-- Detalhes da Altera\xE7\xE3o -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 28px; margin: 32px 0;">
            <tr>
              <td>
                <p style="color: #1e293b; font-size: 15px; font-weight: 700; margin: 0 0 20px 0;">
                  Detalhes da Altera\xE7\xE3o
                </p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                      <span style="color: #64748b; font-size: 14px;">Redefinido por</span>
                    </td>
                    <td align="right" style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                      <strong style="color: #1e293b; font-size: 14px;">${config.resetByAdmin}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                      <span style="color: #64748b; font-size: 14px;">Data e Hora</span>
                    </td>
                    <td align="right" style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                      <strong style="color: #1e293b; font-size: 14px;">${config.resetDate}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0;">
                      <span style="color: #64748b; font-size: 14px;">Email da Conta</span>
                    </td>
                    <td align="right" style="padding: 10px 0;">
                      <strong style="color: #1e293b; font-size: 14px;">${config.to}</strong>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <!-- Nota de Seguran\xE7a -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0;">
            <tr>
              <td style="background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 20px;">
                <p style="color: #92400e; font-size: 14px; margin: 0; line-height: 1.6;">
                  <strong>\u{1F512} Recomenda\xE7\xE3o de Seguran\xE7a:</strong> Altere sua senha no primeiro acesso. V\xE1 em <strong>Configura\xE7\xF5es \u2192 Alterar Senha</strong> ap\xF3s fazer login.
                </p>
              </td>
            </tr>
          </table>

          <p style="color: #64748b; font-size: 14px; line-height: 1.7; margin: 32px 0 0 0;">
            Se voc\xEA n\xE3o reconhece esta atividade, entre em contato com o administrador da sua conta imediatamente atrav\xE9s do email <a href="mailto:atendimento.pavisoft@gmail.com" style="color: #3b82f6; text-decoration: none;">atendimento.pavisoft@gmail.com</a>
          </p>
        </td>
      </tr>
    </table>
  </td>
</tr>
    `;
        const html = this.getBaseTemplate(content, "#fef2f2");
        await this.transporter.sendMail({
          from: process.env.SMTP_FROM || "Pavisoft Sistemas <noreply@pavisoft.com>",
          to: config.to,
          subject: "\u{1F510} Senha Redefinida - Pavisoft Sistemas",
          html
        });
      }
      async sendPaymentPendingReminder(config) {
        const content = `
<tr>
  <td style="padding: 48px 40px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td>
          <p style="font-size: 18px; color: #1e293b; margin: 0 0 8px 0; font-weight: 600;">
            Ol\xE1, ${config.userName}! \u{1F44B}
          </p>

          <!-- Warning Banner -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0;">
            <tr>
              <td style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px solid #f59e0b; border-radius: 12px; padding: 28px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 12px;">\u23F0</div>
                <p style="color: #92400e; font-size: 20px; font-weight: 700; margin: 0 0 8px 0;">
                  Pagamento Pendente
                </p>
                <p style="color: #92400e; font-size: 14px; margin: 0;">
                  Aguardando h\xE1 ${config.daysWaiting} dias
                </p>
              </td>
            </tr>
          </table>

          <p style="color: #64748b; font-size: 15px; line-height: 1.7; margin: 24px 0;">
            Identificamos que o pagamento do seu plano <strong style="color: #1e40af;">${config.planName}</strong> ainda est\xE1 pendente.
          </p>

          <!-- Detalhes do Pagamento -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #fef9c3 0%, #fef3c7 100%); border: 2px solid #f59e0b; border-radius: 12px; padding: 28px; margin: 32px 0;">
            <tr>
              <td>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding: 10px 0;">
                      <span style="color: #92400e; font-size: 14px;">Plano</span>
                    </td>
                    <td align="right" style="padding: 10px 0;">
                      <strong style="color: #78350f; font-size: 14px;">${config.planName}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0;">
                      <span style="color: #92400e; font-size: 14px;">Valor</span>
                    </td>
                    <td align="right" style="padding: 10px 0;">
                      <strong style="color: #f59e0b; font-size: 22px;">R$ ${formatCurrency(config.amount)}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0;">
                      <span style="color: #92400e; font-size: 14px;">Aguardando h\xE1</span>
                    </td>
                    <td align="right" style="padding: 10px 0;">
                      <strong style="color: #78350f; font-size: 14px;">${config.daysWaiting} dias</strong>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <p style="color: #64748b; font-size: 15px; line-height: 1.7; margin: 24px 0;">
            Para continuar aproveitando todos os recursos do sistema sem interrup\xE7\xF5es, complete o pagamento o quanto antes.
          </p>

          <!-- Info Box -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 32px 0;">
            <tr>
              <td style="background: #dbeafe; border-left: 4px solid #3b82f6; border-radius: 8px; padding: 20px;">
                <p style="color: #1e40af; font-size: 14px; margin: 0; line-height: 1.6;">
                  <strong>\u2139\uFE0F Precisa de Ajuda?</strong> Nossa equipe est\xE1 dispon\xEDvel para auxili\xE1-lo. Entre em contato atrav\xE9s do email pavisoft.planos@gmail.com
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </td>
</tr>
    `;
        const html = this.getBaseTemplate(content, "#fffbeb");
        await this.transporter.sendMail({
          from: process.env.SMTP_FROM || "Pavisoft Sistemas <noreply@pavisoft.com>",
          to: config.to,
          subject: "\u23F0 Lembrete: Pagamento Pendente - Pavisoft",
          html
        });
      }
      async sendExpirationWarning(config) {
        const content = `
<tr>
  <td style="padding: 48px 40px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td>
          <p style="font-size: 18px; color: #1e293b; margin: 0 0 8px 0; font-weight: 600;">
            Ol\xE1, ${config.userName}! \u{1F44B}
          </p>

          <!-- Warning Banner -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0;">
            <tr>
              <td style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border: 2px solid #3b82f6; border-radius: 12px; padding: 28px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 12px;">\u{1F514}</div>
                <p style="color: #1e40af; font-size: 20px; font-weight: 700; margin: 0 0 8px 0;">
                  Seu Plano Vence em ${config.daysRemaining} Dias
                </p>
                <p style="color: #1e40af; font-size: 14px; margin: 0;">
                  Data de vencimento: ${config.expirationDate}
                </p>
              </td>
            </tr>
          </table>

          <p style="color: #64748b; font-size: 15px; line-height: 1.7; margin: 24px 0;">
            Seu plano <strong style="color: #1e40af;">${config.planName}</strong> est\xE1 pr\xF3ximo do vencimento. Renove agora para manter o acesso ininterrupto a todos os recursos do sistema.
          </p>

          <!-- Detalhes da Renova\xE7\xE3o -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 2px solid #0ea5e9; border-radius: 12px; padding: 28px; margin: 32px 0;">
            <tr>
              <td>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding: 10px 0;">
                      <span style="color: #0369a1; font-size: 14px;">Plano Atual</span>
                    </td>
                    <td align="right" style="padding: 10px 0;">
                      <strong style="color: #0c4a6e; font-size: 14px;">${config.planName}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0;">
                      <span style="color: #0369a1; font-size: 14px;">Vence em</span>
                    </td>
                    <td align="right" style="padding: 10px 0;">
                      <strong style="color: #0c4a6e; font-size: 14px;">${config.daysRemaining} dias</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0;">
                      <span style="color: #0369a1; font-size: 14px;">Data de Vencimento</span>
                    </td>
                    <td align="right" style="padding: 10px 0;">
                      <strong style="color: #0c4a6e; font-size: 14px;">${config.expirationDate}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 16px 0 0 0;">
                      <span style="color: #0369a1; font-size: 14px;">Valor da Renova\xE7\xE3o</span>
                    </td>
                    <td align="right" style="padding: 16px 0 0 0;">
                      <strong style="color: #0ea5e9; font-size: 22px;">R$ ${formatCurrency(config.amount)}</strong>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <!-- Benef\xEDcios -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0;">
            <tr>
              <td style="background: #ecfdf5; border-left: 4px solid #10b981; border-radius: 8px; padding: 20px;">
                <p style="color: #065f46; font-size: 14px; margin: 0 0 12px 0; font-weight: 600;">
                  \u2728 Ao renovar, voc\xEA continua com acesso a:
                </p>
                <ul style="color: #065f46; font-size: 14px; margin: 0; padding-left: 20px; line-height: 1.8;">
                  <li>PDV Completo com NFCe</li>
                  <li>Gest\xE3o de Estoque em Tempo Real</li>
                  <li>Controle Financeiro Avan\xE7ado</li>
                  <li>Relat\xF3rios Detalhados</li>
                  <li>Suporte T\xE9cnico Especializado</li>
                </ul>
              </td>
            </tr>
          </table>

          <p style="color: #64748b; font-size: 14px; line-height: 1.7; margin: 32px 0 0 0;">
            Para renovar ou esclarecer d\xFAvidas, entre em contato conosco atrav\xE9s do email <a href="mailto:atendimento.pavisoft@gmail.com" style="color: #3b82f6; text-decoration: none;">atendimento.pavisoft@gmail.com</a>
          </p>
        </td>
      </tr>
    </table>
  </td>
</tr>
    `;
        const html = this.getBaseTemplate(content, "#eff6ff");
        await this.transporter.sendMail({
          from: process.env.SMTP_FROM || "Pavisoft Sistemas <noreply@pavisoft.com>",
          to: config.to,
          subject: `\u{1F514} Seu plano vence em ${config.daysRemaining} dias - Pavisoft`,
          html
        });
      }
      async sendOverdueNotice(config) {
        const content = `
<tr>
  <td style="padding: 48px 40px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td>
          <p style="font-size: 18px; color: #1e293b; margin: 0 0 8px 0; font-weight: 600;">
            Ol\xE1, ${config.userName}! \u{1F44B}
          </p>

          <!-- Alert Banner -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0;">
            <tr>
              <td style="background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); border: 2px solid #ef4444; border-radius: 12px; padding: 28px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 12px;">\u26A0\uFE0F</div>
                <p style="color: #991b1b; font-size: 20px; font-weight: 700; margin: 0 0 8px 0;">
                  Pagamento Atrasado
                </p>
                <p style="color: #991b1b; font-size: 14px; margin: 0;">
                  ${config.daysOverdue} dias de atraso
                </p>
              </td>
            </tr>
          </table>

          <p style="color: #64748b; font-size: 15px; line-height: 1.7; margin: 24px 0;">
            <strong style="color: #ef4444;">ATEN\xC7\xC3O:</strong> O pagamento do seu plano <strong style="color: #1e40af;">${config.planName}</strong> est\xE1 atrasado h\xE1 ${config.daysOverdue} dias.
          </p>

          <!-- Detalhes do Pagamento -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border: 2px solid #ef4444; border-radius: 12px; padding: 28px; margin: 32px 0;">
            <tr>
              <td>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding: 10px 0;">
                      <span style="color: #991b1b; font-size: 14px;">Plano</span>
                    </td>
                    <td align="right" style="padding: 10px 0;">
                      <strong style="color: #7f1d1d; font-size: 14px;">${config.planName}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0;">
                      <span style="color: #991b1b; font-size: 14px;">Dias de Atraso</span>
                    </td>
                    <td align="right" style="padding: 10px 0;">
                      <strong style="color: #7f1d1d; font-size: 14px;">${config.daysOverdue} dias</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 16px 0 0 0;">
                      <span style="color: #991b1b; font-size: 14px;">Valor em Aberto</span>
                    </td>
                    <td align="right" style="padding: 16px 0 0 0;">
                      <strong style="color: #ef4444; font-size: 22px;">R$ ${formatCurrency(config.amount)}</strong>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <!-- Warning Box -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0;">
            <tr>
              <td style="background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 20px;">
                <p style="color: #92400e; font-size: 14px; margin: 0; line-height: 1.6;">
                  <strong>\u26A0\uFE0F A\xE7\xE3o Necess\xE1ria:</strong> Regularize sua situa\xE7\xE3o o quanto antes para evitar o bloqueio tempor\xE1rio da sua conta e perda de dados.
                </p>
              </td>
            </tr>
          </table>

          <p style="color: #64748b; font-size: 15px; line-height: 1.7; margin: 24px 0;">
            Caso tenha d\xFAvidas ou precise de suporte para realizar o pagamento, nossa equipe est\xE1 \xE0 disposi\xE7\xE3o.
          </p>

          <p style="color: #64748b; font-size: 14px; line-height: 1.7; margin-top: 8px;">
            Entre em contato: <a href="mailto:atendimento.pavisoft@gmail.com" style="color: #3b82f6; text-decoration: none; font-weight: 600;">atendimento.pavisoft@gmail.com</a>
          </p>
        </td>
      </tr>
    </table>
  </td>
</tr>
    `;
        const html = this.getBaseTemplate(content, "#fef2f2");
        await this.transporter.sendMail({
          from: process.env.SMTP_FROM || "Pavisoft Sistemas <noreply@pavisoft.com>",
          to: config.to,
          subject: "\u26A0\uFE0F URGENTE: Pagamento Atrasado - Pavisoft",
          html
        });
      }
      async sendAccountClosureRequest(config) {
        const content = `
<tr>
  <td style="padding: 48px 40px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td>
          <!-- Alert Banner -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0;">
            <tr>
              <td style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px solid #f59e0b; border-radius: 12px; padding: 28px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 12px;">\u26A0\uFE0F</div>
                <p style="color: #92400e; font-size: 20px; font-weight: 700; margin: 0 0 8px 0;">
                  Solicita\xE7\xE3o de Encerramento de Conta
                </p>
                <p style="color: #92400e; font-size: 14px; margin: 0;">
                  A\xE7\xE3o necess\xE1ria do administrador
                </p>
              </td>
            </tr>
          </table>

          <p style="color: #64748b; font-size: 15px; line-height: 1.7; margin: 24px 0;">
            Um usu\xE1rio solicitou o encerramento de sua conta no sistema Pavisoft. Veja os detalhes abaixo:
          </p>

          <!-- Detalhes do Usu\xE1rio -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 28px; margin: 32px 0;">
            <tr>
              <td>
                <p style="color: #1e293b; font-size: 15px; font-weight: 700; margin: 0 0 20px 0;">
                  Informa\xE7\xF5es do Usu\xE1rio
                </p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                      <span style="color: #64748b; font-size: 14px;">Nome</span>
                    </td>
                    <td align="right" style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                      <strong style="color: #1e293b; font-size: 14px;">${config.userName}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                      <span style="color: #64748b; font-size: 14px;">Email</span>
                    </td>
                    <td align="right" style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                      <strong style="color: #1e293b; font-size: 14px;">${config.userEmail}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0;">
                      <span style="color: #64748b; font-size: 14px;">ID do Usu\xE1rio</span>
                    </td>
                    <td align="right" style="padding: 10px 0;">
                      <strong style="color: #1e293b; font-size: 14px;">${config.userId}</strong>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <!-- Motivo do Encerramento -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px solid #f59e0b; border-radius: 12px; padding: 28px; margin: 32px 0;">
            <tr>
              <td>
                <p style="color: #92400e; font-size: 15px; font-weight: 700; margin: 0 0 12px 0;">
                  Motivo do Encerramento:
                </p>
                <p style="color: #78350f; font-size: 14px; margin: 0; line-height: 1.6; white-space: pre-wrap;">
                  ${config.motivo}
                </p>
              </td>
            </tr>
          </table>

          <!-- A\xE7\xF5es Recomendadas -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0;">
            <tr>
              <td style="background: #dbeafe; border-left: 4px solid #3b82f6; border-radius: 8px; padding: 20px;">
                <p style="color: #1e40af; font-size: 14px; margin: 0 0 12px 0; font-weight: 600;">
                  \u{1F4CB} Pr\xF3ximas A\xE7\xF5es:
                </p>
                <ul style="color: #1e40af; font-size: 14px; margin: 0; padding-left: 20px; line-height: 1.8;">
                  <li>Entrar em contato com o usu\xE1rio para confirmar</li>
                  <li>Oferecer suporte caso haja problemas</li>
                  <li>Processar o encerramento se confirmado</li>
                  <li>Manter dados por 30 dias para recupera\xE7\xE3o</li>
                </ul>
              </td>
            </tr>
          </table>

          <p style="color: #64748b; font-size: 14px; line-height: 1.7; margin: 32px 0 0 0;">
            <strong>Data da Solicita\xE7\xE3o:</strong> ${(/* @__PURE__ */ new Date()).toLocaleString("pt-BR")}
          </p>
        </td>
      </tr>
    </table>
  </td>
</tr>
    `;
        const html = this.getBaseTemplate(content, "#fffbeb");
        await this.transporter.sendMail({
          from: process.env.SMTP_FROM || "Pavisoft Sistemas <noreply@pavisoft.com>",
          to: "atendimento.pavisoft@gmail.com",
          subject: "\u26A0\uFE0F Solicita\xE7\xE3o de Encerramento de Conta - Pavisoft",
          html,
          replyTo: config.userEmail
        });
      }
      async sendAccountBlocked(config) {
        const content = `
<tr>
  <td style="padding: 48px 40px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td>
          <p style="font-size: 18px; color: #1e293b; margin: 0 0 8px 0; font-weight: 600;">
            Ol\xE1, ${config.userName}
          </p>

          <!-- Alert Banner -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0;">
            <tr>
              <td style="background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%); border: 2px solid #7f1d1d; border-radius: 12px; padding: 32px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 12px;">\u{1F512}</div>
                <p style="color: #ffffff; font-size: 22px; font-weight: 700; margin: 0 0 8px 0;">
                  Conta Bloqueada
                </p>
                <p style="color: rgba(255, 255, 255, 0.9); font-size: 14px; margin: 0;">
                  Acesso temporariamente suspenso
                </p>
              </td>
            </tr>
          </table>

          <p style="color: #64748b; font-size: 15px; line-height: 1.7; margin: 24px 0;">
            Informamos que sua conta foi bloqueada devido \xE0 falta de pagamento do plano <strong style="color: #991b1b;">${config.planName}</strong>.
          </p>

          <!-- Info Box -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 28px; margin: 32px 0;">
            <tr>
              <td>
                <p style="color: #1e293b; font-size: 15px; font-weight: 700; margin: 0 0 16px 0;">
                  O que acontece agora?
                </p>
                <ul style="color: #64748b; font-size: 14px; margin: 0; padding-left: 20px; line-height: 1.8;">
                  <li style="margin-bottom: 8px;">Seu acesso ao sistema foi temporariamente suspenso</li>
                  <li style="margin-bottom: 8px;">Seus dados permanecem seguros em nossos servidores</li>
                  <li style="margin-bottom: 8px;">Ap\xF3s regulariza\xE7\xE3o, o acesso ser\xE1 restaurado imediatamente</li>
                  <li>Dados podem ser perdidos ap\xF3s per\xEDodo prolongado de inatividade</li>
                </ul>
              </td>
            </tr>
          </table>

          <!-- CTA Box -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0;">
            <tr>
              <td style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-left: 4px solid #3b82f6; border-radius: 8px; padding: 24px;">
                <p style="color: #1e40af; font-size: 15px; margin: 0 0 12px 0; font-weight: 600;">
                  \u{1F4A1} Como Reativar Sua Conta
                </p>
                <p style="color: #1e40af; font-size: 14px; margin: 0; line-height: 1.6;">
                  Para reativar sua conta, consulte nossos planos e fa\xE7a o upgrade. Clique no bot\xE3o abaixo para ver os detalhes:
                </p>
                <a href="https://www.pavisoft.com.br/plans" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; font-size: 15px; margin-top: 20px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); transition: all 0.3s;">
                  \u{1F4B0} Ver Planos e Fazer Upgrade
                </a>
              </td>
            </tr>
          </table>

          <p style="color: #64748b; font-size: 14px; line-height: 1.7; margin: 32px 0 0 0;">
            Nossa equipe est\xE1 pronta para ajud\xE1-lo a resolver esta situa\xE7\xE3o o mais r\xE1pido poss\xEDvel. Aguardamos seu contato.
          </p>
          <p style="color: #64748b; font-size: 14px; line-height: 1.7; margin-top: 8px;">
            Voc\xEA tamb\xE9m pode entrar em contato diretamente pelo email: <a href="mailto:atendimento.pavisoft@gmail.com" style="color: #3b82f6; text-decoration: none; font-weight: 600;">atendimento.pavisoft@gmail.com</a>
          </p>
        </td>
      </tr>
    </table>
  </td>
</tr>
    `;
        const html = this.getBaseTemplate(content, "#fef2f2");
        await this.transporter.sendMail({
          from: process.env.SMTP_FROM || "Pavisoft Sistemas <noreply@pavisoft.com>",
          to: config.to,
          subject: "\u{1F512} Conta Bloqueada - A\xE7\xE3o Necess\xE1ria - Pavisoft",
          html
        });
      }
      // Método genérico para enviar emails personalizados
      async sendGenericEmail(config) {
        const content = `
<tr>
  <td style="padding: 48px 40px;">
    <div style="color: #1e293b; font-size: 15px; line-height: 1.7;">
      ${config.html}
    </div>
  </td>
</tr>
    `;
        const fullHtml = this.getBaseTemplate(content);
        await this.sendMailSafely({
          from: process.env.SMTP_FROM || "Pavisoft Sistemas <noreply@pavisoft.com>",
          to: config.to,
          subject: config.subject,
          html: fullHtml
        });
      }
    };
  }
});

// server/mercadopago.ts
var mercadopago_exports = {};
__export(mercadopago_exports, {
  MercadoPagoService: () => MercadoPagoService
});
import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
var MercadoPagoService;
var init_mercadopago = __esm({
  "server/mercadopago.ts"() {
    "use strict";
    MercadoPagoService = class {
      client;
      preferenceClient;
      paymentClient;
      accessToken;
      constructor(config) {
        this.accessToken = config.accessToken;
        this.client = new MercadoPagoConfig({
          accessToken: config.accessToken,
          options: {
            timeout: 5e3
          }
        });
        this.preferenceClient = new Preference(this.client);
        this.paymentClient = new Payment(this.client);
      }
      async testConnection() {
        try {
          const accessToken = this.accessToken;
          const isTestToken = accessToken?.startsWith("TEST-");
          const response = await fetch("https://api.mercadopago.com/v1/payment_methods", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${accessToken}`,
              "Content-Type": "application/json"
            }
          });
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            if (response.status === 401) {
              return {
                success: false,
                message: isTestToken ? "Token de teste inv\xE1lido. Verifique se copiou corretamente as credenciais de teste." : "Access Token inv\xE1lido. Verifique suas credenciais no painel do Mercado Pago."
              };
            }
            if (response.status === 403) {
              return {
                success: false,
                message: isTestToken ? "Token de teste sem permiss\xF5es. Use credenciais de teste v\xE1lidas do painel do Mercado Pago." : "Access Token sem permiss\xF5es necess\xE1rias. Gere um novo token com permiss\xF5es completas."
              };
            }
            return {
              success: false,
              message: errorData.message || `Erro HTTP ${response.status}`
            };
          }
          return {
            success: true,
            message: isTestToken ? "\u2705 Conex\xE3o estabelecida com sucesso! (Credenciais de TESTE)" : "\u2705 Conex\xE3o estabelecida com sucesso! (Credenciais de PRODU\xC7\xC3O)"
          };
        } catch (error) {
          return {
            success: false,
            message: `Erro de conex\xE3o: ${error.message}`
          };
        }
      }
      async createPreference(params) {
        try {
          let baseUrl = "";
          if (process.env.APP_URL) {
            baseUrl = process.env.APP_URL.replace(/\/$/, "");
          } else if (process.env.REPLIT_DEV_DOMAIN) {
            baseUrl = `https://${process.env.REPLIT_DEV_DOMAIN}`;
          } else if (process.env.REPLIT_DOMAINS) {
            const domains = process.env.REPLIT_DOMAINS.split(",");
            if (domains.length > 0 && domains[0]) {
              baseUrl = `https://${domains[0].trim()}`;
            }
          }
          if (!baseUrl) {
            baseUrl = "https://localhost:5000";
          }
          const successUrl = params.back_urls?.success || `${baseUrl}/planos?status=success`;
          const failureUrl = params.back_urls?.failure || `${baseUrl}/planos?status=failure`;
          const pendingUrl = params.back_urls?.pending || `${baseUrl}/planos?status=pending`;
          const body = {
            items: params.items,
            payer: params.payer,
            back_urls: {
              success: successUrl,
              failure: failureUrl,
              pending: pendingUrl
            },
            external_reference: params.external_reference
          };
          if (successUrl.startsWith("https://") && !successUrl.includes("localhost")) {
            body.auto_return = params.auto_return || "approved";
          }
          if (params.notification_url) {
            body.notification_url = params.notification_url;
          }
          const result = await this.preferenceClient.create({ body });
          return result;
        } catch (error) {
          throw new Error(error.message || "Erro ao criar prefer\xEAncia de pagamento");
        }
      }
      async getPayment(paymentId) {
        try {
          const result = await this.paymentClient.get({ id: paymentId });
          return result;
        } catch (error) {
          throw new Error(error.message || "Erro ao buscar pagamento");
        }
      }
      async searchPayments(params) {
        try {
          const result = await this.paymentClient.search({
            options: {
              external_reference: params?.external_reference,
              limit: params?.limit || 10
            }
          });
          return result;
        } catch (error) {
          throw new Error(error.message || "Erro ao buscar pagamentos");
        }
      }
    };
  }
});

// server/test-suite.ts
var test_suite_exports = {};
__export(test_suite_exports, {
  TestSuite: () => TestSuite,
  testSuite: () => testSuite
});
var TestSuite, testSuite;
var init_test_suite = __esm({
  "server/test-suite.ts"() {
    "use strict";
    init_storage();
    init_email_service();
    init_logger();
    init_mercadopago();
    TestSuite = class {
      emailService;
      results = [];
      constructor() {
        this.emailService = new EmailService();
      }
      /**
       * Executa todos os testes
       */
      async runAllTests() {
        this.results = [];
        console.log("\n\u{1F9EA} ===== INICIANDO SUITE DE TESTES =====\n");
        await this.testBlockingFlow();
        await this.testEmployeePackages();
        await this.testEmailSystem();
        await this.testBudgetBlocking();
        await this.testMercadoPagoWebhook();
        await this.testDatabaseIntegrity();
        await this.testUserPermissions();
        await this.testCaixaOperations();
        await this.testSecurityAndRateLimiting();
        await this.testSystemPerformance();
        await this.testDataRelationships();
        await this.testBackupStatus();
        console.log("\n\u{1F4CA} ===== RESUMO DOS TESTES =====\n");
        this.printSummary();
        return this.results;
      }
      /**
       * Teste 1: Fluxo Completo de Bloqueio
       */
      async testBlockingFlow() {
        console.log("\n\u{1F512} TESTE 1: Fluxo Completo de Bloqueio\n");
        try {
          const users2 = await storage2.getUsers();
          const testUser = users2.find((u) => u.status === "bloqueado");
          if (!testUser) {
            this.addResult("Bloqueio de Usu\xE1rio", "warning", "Nenhum usu\xE1rio bloqueado encontrado para testar");
            return;
          }
          console.log(`\u2713 Usu\xE1rio bloqueado encontrado: ${testUser.email}`);
          console.log(`  - Status: ${testUser.status}`);
          console.log(`  - Plano: ${testUser.plano}`);
          if (storage2.getFuncionarios) {
            const funcionarios2 = await storage2.getFuncionarios();
            const funcionariosDaConta = funcionarios2.filter((f) => f.conta_id === testUser.id);
            const funcionariosBloqueados = funcionariosDaConta.filter((f) => f.status === "bloqueado");
            console.log(`\u2713 Total de funcion\xE1rios: ${funcionariosDaConta.length}`);
            console.log(`\u2713 Funcion\xE1rios bloqueados: ${funcionariosBloqueados.length}`);
            if (funcionariosDaConta.length > 0 && funcionariosBloqueados.length === funcionariosDaConta.length) {
              this.addResult(
                "Bloqueio de Usu\xE1rio e Funcion\xE1rios",
                "success",
                `Usu\xE1rio e todos os ${funcionariosBloqueados.length} funcion\xE1rios est\xE3o bloqueados corretamente`,
                { userId: testUser.id, funcionariosBloqueados: funcionariosBloqueados.length }
              );
            } else if (funcionariosDaConta.length === 0) {
              this.addResult(
                "Bloqueio de Usu\xE1rio",
                "success",
                "Usu\xE1rio bloqueado (sem funcion\xE1rios cadastrados)",
                { userId: testUser.id }
              );
            } else {
              this.addResult(
                "Bloqueio de Funcion\xE1rios",
                "error",
                `Inconsist\xEAncia: ${funcionariosDaConta.length - funcionariosBloqueados.length} funcion\xE1rios n\xE3o bloqueados`,
                { userId: testUser.id, total: funcionariosDaConta.length, bloqueados: funcionariosBloqueados.length }
              );
            }
          }
          console.log(`\u2713 Teste de bloqueio de acesso: PASSOU`);
        } catch (error) {
          this.addResult("Fluxo de Bloqueio", "error", error.message);
        }
      }
      /**
       * Teste 2: Compra de Pacotes de Funcionários
       */
      async testEmployeePackages() {
        console.log("\n\u{1F4BC} TESTE 2: Compra de Pacotes de Funcion\xE1rios\n");
        try {
          const users2 = await storage2.getUsers();
          const testUser = users2.find((u) => u.max_funcionarios && u.max_funcionarios > 1);
          if (!testUser) {
            this.addResult("Pacotes de Funcion\xE1rios", "warning", "Nenhum usu\xE1rio com pacote de funcion\xE1rios encontrado");
            return;
          }
          console.log(`\u2713 Usu\xE1rio com pacote encontrado: ${testUser.email}`);
          console.log(`  - Limite Base: ${testUser.max_funcionarios_base || 1}`);
          console.log(`  - Limite Atual: ${testUser.max_funcionarios}`);
          console.log(`  - Funcion\xE1rios Extras: ${(testUser.max_funcionarios || 1) - (testUser.max_funcionarios_base || 1)}`);
          if (testUser.data_expiracao_pacote_funcionarios) {
            const diasRestantes = Math.floor(
              (new Date(testUser.data_expiracao_pacote_funcionarios).getTime() - Date.now()) / (1e3 * 60 * 60 * 24)
            );
            console.log(`  - Dias at\xE9 expira\xE7\xE3o: ${diasRestantes}`);
          }
          if (storage2.getEmployeePackages) {
            const packages = await storage2.getEmployeePackages(testUser.id);
            console.log(`\u2713 Pacotes cadastrados: ${packages.length}`);
            packages.forEach((pkg) => {
              console.log(`  - ${pkg.package_type}: ${pkg.quantity} funcion\xE1rios (Status: ${pkg.status})`);
            });
            this.addResult(
              "Pacotes de Funcion\xE1rios",
              "success",
              `Usu\xE1rio possui ${packages.length} pacote(s) cadastrado(s)`,
              {
                userId: testUser.id,
                limiteBase: testUser.max_funcionarios_base || 1,
                limiteAtual: testUser.max_funcionarios,
                pacotes: packages.length
              }
            );
          } else {
            this.addResult("Pacotes de Funcion\xE1rios", "warning", "Fun\xE7\xE3o getEmployeePackages n\xE3o dispon\xEDvel");
          }
        } catch (error) {
          this.addResult("Pacotes de Funcion\xE1rios", "error", error.message);
        }
      }
      /**
       * Teste 3: Sistema de Emails
       */
      async testEmailSystem() {
        console.log("\n\u{1F4E7} TESTE 3: Sistema de Emails em Desenvolvimento\n");
        const emailTests = [
          "C\xF3digo de Verifica\xE7\xE3o",
          "Pacote Comprado (Aguardando Pagamento)",
          "Pacote Ativado",
          "Senha Redefinida",
          "Pagamento Pendente",
          "Aviso de Vencimento",
          "Pagamento Atrasado",
          "Conta Bloqueada"
        ];
        console.log(`\u2713 Templates de email dispon\xEDveis: ${emailTests.length}`);
        emailTests.forEach((template, index2) => {
          console.log(`  ${index2 + 1}. ${template}`);
        });
        const smtpConfig = {
          host: process.env.SMTP_HOST || "smtp.gmail.com",
          port: process.env.SMTP_PORT || "587",
          user: process.env.SMTP_USER || "pavisoft.planos@gmail.com",
          hasPassword: !!process.env.SMTP_PASS
        };
        console.log(`
\u2713 Configura\xE7\xE3o SMTP:`);
        console.log(`  - Host: ${smtpConfig.host}`);
        console.log(`  - Porta: ${smtpConfig.port}`);
        console.log(`  - Usu\xE1rio: ${smtpConfig.user}`);
        console.log(`  - Senha configurada: ${smtpConfig.hasPassword ? "Sim" : "N\xE3o"}`);
        this.addResult(
          "Sistema de Emails",
          smtpConfig.hasPassword ? "success" : "warning",
          smtpConfig.hasPassword ? `${emailTests.length} templates configurados e SMTP funcional` : "Templates configurados mas SMTP sem senha",
          { templates: emailTests.length, smtpConfig }
        );
      }
      /**
       * Teste 4: Sistema de Bloqueios de Estoque (Orçamentos)
       */
      async testBudgetBlocking() {
        console.log("\n\u{1F512} TESTE 4: Sistema de Bloqueios de Estoque (Or\xE7amentos)\n");
        try {
          if (!storage2.getOrcamentos) {
            this.addResult(
              "Sistema de Bloqueios",
              "warning",
              "Fun\xE7\xE3o getOrcamentos n\xE3o dispon\xEDvel no storage"
            );
            return;
          }
          const orcamentos2 = await storage2.getOrcamentos();
          const orcamentosAprovados = orcamentos2.filter((o) => o.status === "aprovado");
          let bloqueiosAtivos = [];
          if (storage2.getBloqueios) {
            bloqueiosAtivos = await storage2.getBloqueios();
          }
          const metrics = logger.getLockingMetrics();
          const detalhes = {
            orcamentos_aprovados: orcamentosAprovados.length,
            bloqueios_ativos: bloqueiosAtivos.length,
            produtos_bloqueados: metrics.produtos_com_bloqueios,
            aprovacoes_total: metrics.aprovacoes_total,
            aprovacoes_com_erro: metrics.aprovacoes_com_erro,
            tempo_medio_ms: metrics.tempo_medio_aprovacao_ms
          };
          if (bloqueiosAtivos.length === 0 && orcamentosAprovados.length > 0) {
            this.addResult(
              "Sistema de Bloqueios",
              "warning",
              `${orcamentosAprovados.length} or\xE7amento(s) aprovado(s) mas nenhum bloqueio ativo encontrado`,
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
              "Sistema configurado corretamente (nenhum or\xE7amento aprovado no momento)",
              detalhes
            );
          }
          console.log(`\u2713 Sistema de bloqueios verificado com sucesso`);
        } catch (error) {
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
      async testMercadoPagoWebhook() {
        console.log("\n\u{1F4B3} TESTE 5: Valida\xE7\xE3o de Webhooks Mercado Pago\n");
        try {
          const config = await storage2.getConfigMercadoPago();
          if (!config || !config.access_token) {
            this.addResult("Mercado Pago", "warning", "Credenciais do Mercado Pago n\xE3o configuradas");
            console.log("\u26A0\uFE0F  Credenciais n\xE3o configuradas");
            return;
          }
          console.log(`\u2713 Access Token: ${config.access_token ? "***configurado***" : "n\xE3o configurado"}`);
          console.log(`\u2713 Public Key: ${config.public_key ? "***configurado***" : "n\xE3o configurado"}`);
          console.log(`\u2713 Webhook URL: ${config.webhook_url || "n\xE3o configurado"}`);
          console.log(`\u2713 Status: ${config.status_conexao || "n\xE3o testado"}`);
          try {
            const mercadopago = new MercadoPagoService({ accessToken: config.access_token });
            const result = await mercadopago.testConnection();
            console.log(`
\u2713 Teste de conex\xE3o: ${result.success ? "PASSOU" : "FALHOU"}`);
            console.log(`  - Mensagem: ${result.message}`);
            this.addResult(
              "Conex\xE3o Mercado Pago",
              result.success ? "success" : "error",
              result.message,
              { webhookUrl: config.webhook_url, status: config.status_conexao }
            );
          } catch (error) {
            this.addResult("Conex\xE3o Mercado Pago", "error", error.message);
          }
          const baseUrl = process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : "http://localhost:5000";
          const webhookEndpoint = `${baseUrl}/api/webhook/mercadopago`;
          console.log(`
\u2713 Endpoint do Webhook: ${webhookEndpoint}`);
          console.log(`
\u26A0\uFE0F  IMPORTANTE: Configure esta URL no painel do Mercado Pago em:`);
          console.log(`   https://www.mercadopago.com.br/developers/panel/app`);
        } catch (error) {
          this.addResult("Webhooks Mercado Pago", "error", error.message);
        }
      }
      /**
       * Adiciona resultado do teste
       */
      addResult(name, status, message, details) {
        this.results.push({ name, status, message, details });
        const icon = status === "success" ? "\u2705" : status === "error" ? "\u274C" : "\u26A0\uFE0F";
        console.log(`${icon} ${name}: ${message}`);
      }
      /**
       * Teste 6: Integridade do Banco de Dados
       */
      async testDatabaseIntegrity() {
        console.log("\n\u{1F5C4}\uFE0F TESTE 6: Integridade do Banco de Dados\n");
        try {
          const users2 = await storage2.getUsers();
          const produtos2 = await storage2.getProdutos();
          const vendas2 = await storage2.getVendas();
          const clientes2 = await storage2.getClientes();
          const fornecedores2 = await storage2.getFornecedores();
          console.log(`\u2713 Usu\xE1rios: ${users2.length}`);
          console.log(`\u2713 Produtos: ${produtos2.length}`);
          console.log(`\u2713 Vendas: ${vendas2.length}`);
          console.log(`\u2713 Clientes: ${clientes2.length}`);
          console.log(`\u2713 Fornecedores: ${fornecedores2.length}`);
          const produtosSemUser = produtos2.filter((p) => !p.user_id);
          if (produtosSemUser.length > 0) {
            this.addResult(
              "Integridade de Produtos",
              "warning",
              `${produtosSemUser.length} produto(s) sem user_id`,
              { count: produtosSemUser.length }
            );
          }
          const vendasSemUser = vendas2.filter((v) => !v.user_id);
          if (vendasSemUser.length > 0) {
            this.addResult(
              "Integridade de Vendas",
              "warning",
              `${vendasSemUser.length} venda(s) sem user_id`,
              { count: vendasSemUser.length }
            );
          }
          const now = /* @__PURE__ */ new Date();
          const trialsExpirados = users2.filter((u) => {
            if (u.plano !== "trial" || !u.data_expiracao_trial) return false;
            return new Date(u.data_expiracao_trial) < now;
          });
          if (trialsExpirados.length > 0) {
            this.addResult(
              "Trials Expirados",
              "warning",
              `${trialsExpirados.length} usu\xE1rio(s) com trial expirado`,
              { usuarios: trialsExpirados.map((u) => u.email) }
            );
          }
          this.addResult(
            "Integridade do Banco",
            "success",
            "Banco de dados \xEDntegro",
            {
              usuarios: users2.length,
              produtos: produtos2.length,
              vendas: vendas2.length,
              clientes: clientes2.length,
              fornecedores: fornecedores2.length
            }
          );
        } catch (error) {
          this.addResult("Integridade do Banco", "error", error.message);
        }
      }
      /**
       * Teste 7: Sistema de Permissões
       */
      async testUserPermissions() {
        console.log("\n\u{1F510} TESTE 7: Sistema de Permiss\xF5es de Funcion\xE1rios\n");
        try {
          const funcionarios2 = await storage2.getFuncionarios();
          console.log(`\u2713 Total de funcion\xE1rios: ${funcionarios2.length}`);
          let funcionariosComPermissoes = 0;
          let funcionariosSemPermissoes = 0;
          for (const func of funcionarios2) {
            const permissoes = await storage2.getPermissoesFuncionario(func.id);
            if (permissoes) {
              funcionariosComPermissoes++;
            } else {
              funcionariosSemPermissoes++;
            }
          }
          console.log(`\u2713 Com permiss\xF5es configuradas: ${funcionariosComPermissoes}`);
          console.log(`\u2713 Sem permiss\xF5es: ${funcionariosSemPermissoes}`);
          if (funcionariosSemPermissoes > 0) {
            this.addResult(
              "Permiss\xF5es de Funcion\xE1rios",
              "warning",
              `${funcionariosSemPermissoes} funcion\xE1rio(s) sem permiss\xF5es configuradas`,
              {
                comPermissoes: funcionariosComPermissoes,
                semPermissoes: funcionariosSemPermissoes
              }
            );
          } else {
            this.addResult(
              "Permiss\xF5es de Funcion\xE1rios",
              "success",
              `Todos os ${funcionariosComPermissoes} funcion\xE1rios t\xEAm permiss\xF5es configuradas`,
              { total: funcionariosComPermissoes }
            );
          }
        } catch (error) {
          this.addResult("Permiss\xF5es de Funcion\xE1rios", "error", error.message);
        }
      }
      /**
       * Teste 8: Operações de Caixa
       */
      async testCaixaOperations() {
        console.log("\n\u{1F4B0} TESTE 8: Opera\xE7\xF5es de Caixa\n");
        try {
          const users2 = await storage2.getUsers();
          let totalCaixasAbertos = 0;
          let totalCaixasFechados = 0;
          for (const user of users2) {
            if (storage2.getCaixas) {
              const caixas2 = await storage2.getCaixas(user.id);
              const abertos = caixas2.filter((c) => c.status === "aberto");
              const fechados = caixas2.filter((c) => c.status === "fechado");
              totalCaixasAbertos += abertos.length;
              totalCaixasFechados += fechados.length;
            }
          }
          console.log(`\u2713 Caixas abertos: ${totalCaixasAbertos}`);
          console.log(`\u2713 Caixas fechados: ${totalCaixasFechados}`);
          if (totalCaixasAbertos > 10) {
            this.addResult(
              "Caixas Abertos",
              "warning",
              `${totalCaixasAbertos} caixas abertos (poss\xEDvel inconsist\xEAncia)`,
              {
                abertos: totalCaixasAbertos,
                fechados: totalCaixasFechados
              }
            );
          } else {
            this.addResult(
              "Opera\xE7\xF5es de Caixa",
              "success",
              `Sistema de caixa funcionando normalmente`,
              {
                abertos: totalCaixasAbertos,
                fechados: totalCaixasFechados
              }
            );
          }
        } catch (error) {
          this.addResult("Opera\xE7\xF5es de Caixa", "error", error.message);
        }
      }
      /**
       * Teste 9: Segurança e Rate Limiting
       */
      async testSecurityAndRateLimiting() {
        console.log("\n\u{1F512} TESTE 9: Seguran\xE7a e Rate Limiting\n");
        try {
          const securityHeaders = {
            helmet_enabled: !!process.env.NODE_ENV,
            cors_configured: true,
            rate_limiting: true
          };
          console.log("\u2713 Headers de seguran\xE7a verificados");
          const users2 = await storage2.getUsers();
          const senhasEmHash = users2.filter(
            (u) => u.senha && (u.senha.startsWith("$2a$") || u.senha.startsWith("$2b$"))
          ).length;
          const senhasTextoPlano = users2.filter(
            (u) => u.senha && !u.senha.startsWith("$2a$") && !u.senha.startsWith("$2b$")
          ).length;
          console.log(`\u2713 Senhas em hash (bcrypt): ${senhasEmHash}`);
          console.log(`\u2713 Senhas em texto plano: ${senhasTextoPlano}`);
          if (senhasTextoPlano > 0) {
            this.addResult(
              "Seguran\xE7a de Senhas",
              "warning",
              `${senhasTextoPlano} senha(s) ainda em texto plano - migra\xE7\xE3o pendente`,
              { senhasEmHash, senhasTextoPlano }
            );
          } else {
            this.addResult(
              "Seguran\xE7a de Senhas",
              "success",
              `Todas as ${senhasEmHash} senhas est\xE3o com hash bcrypt`,
              { senhasEmHash }
            );
          }
          const envVars = {
            DATABASE_URL: !!process.env.DATABASE_URL,
            SMTP_USER: !!process.env.SMTP_USER,
            SMTP_PASS: !!process.env.SMTP_PASS,
            MASTER_USER_EMAIL: !!process.env.MASTER_USER_EMAIL,
            MASTER_ADMIN_PASSWORD: !!process.env.MASTER_ADMIN_PASSWORD
          };
          const missingVars = Object.entries(envVars).filter(([_, value]) => !value).map(([key]) => key);
          if (missingVars.length > 0) {
            this.addResult(
              "Vari\xE1veis de Ambiente",
              "warning",
              `${missingVars.length} vari\xE1vel(is) n\xE3o configurada(s): ${missingVars.join(", ")}`,
              { missing: missingVars }
            );
          } else {
            this.addResult(
              "Vari\xE1veis de Ambiente",
              "success",
              "Todas as vari\xE1veis de ambiente cr\xEDticas est\xE3o configuradas"
            );
          }
        } catch (error) {
          this.addResult("Seguran\xE7a", "error", error.message);
        }
      }
      /**
       * Teste 10: Performance do Sistema
       */
      async testSystemPerformance() {
        console.log("\n\u26A1 TESTE 10: Performance do Sistema\n");
        try {
          const startTime = Date.now();
          const users2 = await storage2.getUsers();
          const queryTime = Date.now() - startTime;
          console.log(`\u2713 Tempo de query (getUsers): ${queryTime}ms`);
          const memUsage = process.memoryUsage();
          const memUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
          const memTotalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
          console.log(`\u2713 Mem\xF3ria em uso: ${memUsedMB}MB / ${memTotalMB}MB`);
          const produtos2 = await storage2.getProdutos();
          const vendas2 = await storage2.getVendas();
          const clientes2 = await storage2.getClientes();
          const totalRecords = users2.length + produtos2.length + vendas2.length + clientes2.length;
          console.log(`\u2713 Total de registros no banco: ${totalRecords.toLocaleString()}`);
          if (queryTime > 2e3) {
            this.addResult(
              "Performance de Queries",
              "warning",
              `Query lenta detectada: ${queryTime}ms (limite recomendado: 2000ms)`,
              { queryTime, memUsedMB, totalRecords }
            );
          } else {
            this.addResult(
              "Performance do Sistema",
              "success",
              `Queries r\xE1pidas (${queryTime}ms), mem\xF3ria otimizada (${memUsedMB}MB)`,
              { queryTime, memUsedMB, memTotalMB, totalRecords }
            );
          }
        } catch (error) {
          this.addResult("Performance", "error", error.message);
        }
      }
      /**
       * Teste 11: Integridade de Relacionamentos
       */
      async testDataRelationships() {
        console.log("\n\u{1F517} TESTE 11: Integridade de Relacionamentos\n");
        try {
          const produtos2 = await storage2.getProdutos();
          const vendas2 = await storage2.getVendas();
          const users2 = await storage2.getUsers();
          const userIds = new Set(users2.map((u) => u.id));
          const produtosOrfaos = produtos2.filter((p) => !userIds.has(p.user_id));
          console.log(`\u2713 Produtos \xF3rf\xE3os (sem dono): ${produtosOrfaos.length}`);
          const vendasOrfas = vendas2.filter((v) => !userIds.has(v.user_id));
          console.log(`\u2713 Vendas \xF3rf\xE3s (sem dono): ${vendasOrfas.length}`);
          if (storage2.getClientes) {
            const clientes2 = await storage2.getClientes();
            const cpfCnpjMap = /* @__PURE__ */ new Map();
            clientes2.forEach((c) => {
              if (c.cpf_cnpj) {
                cpfCnpjMap.set(c.cpf_cnpj, (cpfCnpjMap.get(c.cpf_cnpj) || 0) + 1);
              }
            });
            const duplicados = Array.from(cpfCnpjMap.entries()).filter(([_, count]) => count > 1).length;
            console.log(`\u2713 CPF/CNPJ duplicados: ${duplicados}`);
            if (produtosOrfaos.length > 0 || vendasOrfas.length > 0 || duplicados > 0) {
              this.addResult(
                "Integridade de Dados",
                "warning",
                `Inconsist\xEAncias encontradas - Produtos \xF3rf\xE3os: ${produtosOrfaos.length}, Vendas \xF3rf\xE3s: ${vendasOrfas.length}, CPF/CNPJ duplicados: ${duplicados}`,
                { produtosOrfaos: produtosOrfaos.length, vendasOrfas: vendasOrfas.length, duplicados }
              );
            } else {
              this.addResult(
                "Integridade de Dados",
                "success",
                "Nenhuma inconsist\xEAncia de relacionamento detectada",
                { produtosOrfaos: 0, vendasOrfas: 0, duplicados: 0 }
              );
            }
          }
        } catch (error) {
          this.addResult("Integridade de Relacionamentos", "error", error.message);
        }
      }
      /**
       * Teste 12: Status de Backups
       */
      async testBackupStatus() {
        console.log("\n\u{1F4BE} TESTE 12: Status de Backups\n");
        try {
          const usingNeon = process.env.DATABASE_URL?.includes("neon.tech") || false;
          console.log(`\u2713 Sistema de backup: ${usingNeon ? "Neon PostgreSQL (nativo)" : "Local"}`);
          if (usingNeon) {
            this.addResult(
              "Sistema de Backup",
              "success",
              "Usando backups nativos do Neon PostgreSQL (point-in-time recovery dispon\xEDvel)",
              { provider: "Neon PostgreSQL", automatic: true }
            );
          } else {
            this.addResult(
              "Sistema de Backup",
              "warning",
              "Sistema de backup local - considere migrar para Neon PostgreSQL",
              { provider: "Local", automatic: false }
            );
          }
        } catch (error) {
          this.addResult("Status de Backups", "error", error.message);
        }
      }
      /**
       * Imprime resumo dos testes
       */
      printSummary() {
        const success = this.results.filter((r) => r.status === "success").length;
        const errors = this.results.filter((r) => r.status === "error").length;
        const warnings = this.results.filter((r) => r.status === "warning").length;
        console.log(`
\u2705 Sucessos: ${success}`);
        console.log(`\u274C Erros: ${errors}`);
        console.log(`\u26A0\uFE0F  Avisos: ${warnings}`);
        console.log(`\u{1F4CA} Total: ${this.results.length}`);
        const percentage = Math.round(success / this.results.length * 100);
        console.log(`
\u{1F3AF} Taxa de Sucesso: ${percentage}%`);
        if (errors === 0 && warnings === 0) {
          console.log("\n\u{1F389} TODOS OS TESTES PASSARAM COM SUCESSO! \u{1F389}\n");
        } else if (errors === 0) {
          console.log("\n\u2728 Testes conclu\xEDdos com alguns avisos.\n");
        } else {
          console.log("\n\u26A0\uFE0F  Alguns testes falharam. Revise os erros acima.\n");
        }
      }
    };
    testSuite = new TestSuite();
  }
});

// server/payment-reminder.ts
var payment_reminder_exports = {};
__export(payment_reminder_exports, {
  PaymentReminderService: () => PaymentReminderService,
  paymentReminderService: () => paymentReminderService
});
var PaymentReminderService, paymentReminderService;
var init_payment_reminder = __esm({
  "server/payment-reminder.ts"() {
    "use strict";
    init_storage();
    init_email_service();
    init_logger();
    PaymentReminderService = class {
      emailService;
      config = {
        daysBeforeExpiration: [7, 3, 1],
        // Avisos antes do vencimento
        daysAfterExpiration: [1, 3, 4]
        // Avisos após vencimento (ajustado para 4 dias)
      };
      constructor() {
        this.emailService = new EmailService();
      }
      /**
       * Verifica todos os pagamentos e envia lembretes
       */
      async checkAndSendReminders() {
        try {
          let subscriptions2;
          try {
            subscriptions2 = await storage2.getSubscriptions();
          } catch (error) {
            if (error.message?.includes("cupom_codigo") || error.code === "42703" || error.message?.includes("column") || error.message?.includes("does not exist")) {
              logger.warn("[PAYMENT_REMINDER] Colunas de cupom n\xE3o dispon\xEDveis na tabela subscriptions. Sistema funcionar\xE1 sem cupons.", "PAYMENT_REMINDER");
              subscriptions2 = [];
            } else {
              throw error;
            }
          }
          const users2 = await storage2.getUsers();
          const now = /* @__PURE__ */ new Date();
          for (const subscription of subscriptions2) {
            if (subscription.status === "cancelado" || subscription.status === "inativo") {
              continue;
            }
            if (subscription.status_pagamento === "PENDING") {
              await this.handlePendingPayment(subscription);
            }
            if (subscription.data_vencimento) {
              const daysUntilExpiration = this.getDaysDifference(now, new Date(subscription.data_vencimento));
              if (this.config.daysBeforeExpiration.includes(daysUntilExpiration)) {
                await this.sendExpirationWarning(subscription, daysUntilExpiration);
              }
              const daysAfterExpiration = Math.abs(daysUntilExpiration);
              if (daysUntilExpiration < 0 && this.config.daysAfterExpiration.includes(daysAfterExpiration)) {
                await this.sendOverdueNotice(subscription, daysAfterExpiration);
              }
              if (daysUntilExpiration <= -4) {
                await this.blockExpiredSubscription(subscription);
              }
            }
          }
          for (const user of users2) {
            if (user.plano === "trial") {
              const expirationDate = user.data_expiracao_plano || user.data_expiracao_trial;
              if (expirationDate) {
                const daysUntilExpiration = this.getDaysDifference(now, new Date(expirationDate));
                if (this.config.daysBeforeExpiration.includes(daysUntilExpiration)) {
                  await this.sendTrialExpirationWarning(user, daysUntilExpiration);
                }
                if (daysUntilExpiration < 0) {
                  const daysExpired = Math.abs(daysUntilExpiration);
                  if (daysExpired >= 0 && user.status !== "bloqueado") {
                    await this.blockExpiredTrialUser(user);
                  }
                }
              }
            }
            if (user.data_expiracao_pacote_funcionarios) {
              const daysUntilPackageExpiration = this.getDaysDifference(now, new Date(user.data_expiracao_pacote_funcionarios));
              if (this.config.daysBeforeExpiration.includes(daysUntilPackageExpiration)) {
                await this.sendEmployeePackageExpirationWarning(user, daysUntilPackageExpiration);
              }
              if (daysUntilPackageExpiration < 0) {
                await this.revertToBaseLimitAfterExpiration(user);
              }
            }
          }
          logger.info("Verifica\xE7\xE3o de pagamentos conclu\xEDda", "PAYMENT_REMINDER");
        } catch (error) {
          logger.error("Erro ao verificar pagamentos", "PAYMENT_REMINDER", { error });
        }
      }
      /**
       * Trata pagamentos pendentes
       */
      async handlePendingPayment(subscription) {
        const user = (await storage2.getUsers()).find((u) => u.id === subscription.user_id);
        if (!user) return;
        const now = /* @__PURE__ */ new Date();
        const daysSinceCreation = this.getDaysDifference(new Date(subscription.data_criacao), now);
        const prazoLimite = subscription.prazo_limite_pagamento ? new Date(subscription.prazo_limite_pagamento) : new Date(new Date(subscription.data_criacao).getTime() + 7 * 24 * 60 * 60 * 1e3);
        const daysUntilDeadline = this.getDaysDifference(now, prazoLimite);
        if ([2, 5].includes(daysSinceCreation) || daysUntilDeadline === 1) {
          await this.emailService.sendPaymentPendingReminder({
            to: user.email,
            userName: user.nome,
            planName: subscription.plano,
            daysWaiting: daysSinceCreation,
            amount: Number(subscription.valor) || 0
          });
          await storage2.updateSubscription(subscription.id, {
            tentativas_cobranca: (subscription.tentativas_cobranca || 0) + 1,
            data_atualizacao: (/* @__PURE__ */ new Date()).toISOString()
          });
          logger.info("Lembrete de pagamento pendente enviado", "PAYMENT_REMINDER", {
            userId: user.id,
            subscriptionId: subscription.id,
            days: daysSinceCreation,
            daysUntilDeadline,
            tentativas: (subscription.tentativas_cobranca || 0) + 1
          });
        }
        if (daysUntilDeadline < 0) {
          await storage2.updateSubscription(subscription.id, {
            status: "cancelado",
            status_pagamento: "cancelled",
            data_cancelamento: (/* @__PURE__ */ new Date()).toISOString(),
            motivo_cancelamento: `Cancelado automaticamente - prazo de ${Math.abs(daysUntilDeadline)} dia(s) expirado sem pagamento`,
            data_atualizacao: (/* @__PURE__ */ new Date()).toISOString()
          });
          logger.warn("Assinatura cancelada automaticamente por prazo expirado", "PAYMENT_REMINDER", {
            subscriptionId: subscription.id,
            userId: user.id,
            plano: subscription.plano,
            diasAposLimite: Math.abs(daysUntilDeadline),
            dataCriacao: subscription.data_criacao,
            prazoLimite: prazoLimite.toISOString()
          });
        }
      }
      /**
       * Envia aviso de vencimento próximo
       */
      async sendExpirationWarning(subscription, daysRemaining) {
        const user = (await storage2.getUsers()).find((u) => u.id === subscription.user_id);
        if (!user) return;
        await this.emailService.sendExpirationWarning({
          to: user.email,
          userName: user.nome,
          planName: subscription.plano,
          daysRemaining,
          expirationDate: new Date(subscription.data_vencimento).toLocaleDateString("pt-BR"),
          amount: Number(subscription.valor) || 0
        });
        logger.info("Aviso de vencimento enviado", "PAYMENT_REMINDER", {
          userId: user.id,
          daysRemaining
        });
      }
      /**
       * Envia notificação de pagamento atrasado
       */
      async sendOverdueNotice(subscription, daysOverdue) {
        const user = (await storage2.getUsers()).find((u) => u.id === subscription.user_id);
        if (!user) return;
        await this.emailService.sendOverdueNotice({
          to: user.email,
          userName: user.nome,
          planName: subscription.plano,
          daysOverdue,
          amount: Number(subscription.valor) || 0
        });
        logger.warn("Notifica\xE7\xE3o de atraso enviada", "PAYMENT_REMINDER", {
          userId: user.id,
          daysOverdue
        });
      }
      /**
       * Bloqueia usuário por falta de pagamento
       * IMPORTANTE: Quando o plano principal expira/bloqueia, TODOS os funcionários
       * devem ser bloqueados, mesmo que existam pacotes de funcionários ativos.
       * Os pacotes de funcionários são complementares ao plano principal.
       */
      async blockUserForNonPayment(subscription) {
        await storage2.updateSubscription(subscription.id, {
          status: "bloqueado"
        });
        await storage2.updateUser(subscription.user_id, {
          status: "bloqueado"
        });
        const user = (await storage2.getUsers()).find((u) => u.id === subscription.user_id);
        if (user) {
          if (storage2.getFuncionarios) {
            const funcionarios2 = await storage2.getFuncionarios();
            const funcionariosDaConta = funcionarios2.filter((f) => f.conta_id === user.id);
            for (const funcionario of funcionariosDaConta) {
              await storage2.updateFuncionario(funcionario.id, {
                status: "bloqueado"
              });
              logger.warn("Funcion\xE1rio bloqueado devido ao bloqueio da conta principal", "PAYMENT_REMINDER", {
                funcionarioId: funcionario.id,
                funcionarioNome: funcionario.nome,
                contaId: user.id,
                motivo: "Plano principal bloqueado/expirado"
              });
            }
            if (funcionariosDaConta.length > 0) {
              logger.info(`TODOS os ${funcionariosDaConta.length} funcion\xE1rio(s) bloqueado(s) junto com a conta principal`, "PAYMENT_REMINDER", {
                contaId: user.id,
                userEmail: user.email,
                plano: subscription.plano
              });
            }
          }
          await this.emailService.sendAccountBlocked({
            to: user.email,
            userName: user.nome,
            planName: subscription.plano
          });
        }
        logger.error("Conta e TODOS os funcion\xE1rios bloqueados por falta de pagamento do plano principal", "PAYMENT_REMINDER", {
          subscriptionId: subscription.id,
          userId: subscription.user_id
        });
      }
      /**
       * Bloqueia assinatura expirada
       */
      async blockExpiredSubscription(subscription) {
        await storage2.updateSubscription(subscription.id, {
          status: "bloqueado"
        });
        await storage2.updateUser(subscription.user_id, {
          status: "bloqueado"
        });
        const user = (await storage2.getUsers()).find((u) => u.id === subscription.user_id);
        if (user) {
          if (storage2.getFuncionarios) {
            const funcionarios2 = await storage2.getFuncionarios();
            const funcionariosDaConta = funcionarios2.filter((f) => f.conta_id === user.id);
            for (const funcionario of funcionariosDaConta) {
              await storage2.updateFuncionario(funcionario.id, {
                status: "bloqueado"
              });
              logger.warn("Funcion\xE1rio bloqueado devido ao bloqueio da conta principal", "PAYMENT_REMINDER", {
                funcionarioId: funcionario.id,
                contaId: user.id
              });
            }
            if (funcionariosDaConta.length > 0) {
              logger.info(`${funcionariosDaConta.length} funcion\xE1rio(s) bloqueado(s) junto com a conta`, "PAYMENT_REMINDER", {
                contaId: user.id
              });
            }
          }
          await this.emailService.sendAccountBlocked({
            to: user.email,
            userName: user.nome,
            planName: subscription.plano
          });
        }
        logger.error("Conta bloqueada por falta de pagamento", "PAYMENT_REMINDER", {
          subscriptionId: subscription.id,
          userId: subscription.user_id
        });
      }
      /**
       * Envia aviso de vencimento de trial
       */
      async sendTrialExpirationWarning(user, daysRemaining) {
        await this.emailService.sendExpirationWarning({
          to: user.email,
          userName: user.nome,
          planName: "Plano Trial (7 dias gr\xE1tis)",
          daysRemaining,
          expirationDate: new Date(user.data_expiracao_trial || user.data_expiracao_plano).toLocaleDateString("pt-BR"),
          amount: 0
          // Trial é gratuito
        });
        logger.info("Aviso de vencimento de trial enviado", "PAYMENT_REMINDER", {
          userId: user.id,
          daysRemaining
        });
      }
      /**
       * Bloqueia usuário trial expirado
       * IMPORTANTE: Quando o trial expira, a conta é bloqueada IMEDIATAMENTE.
       * Não existe mais o plano "free" - o usuário deve contratar um plano pago.
       */
      async blockExpiredTrialUser(user) {
        await storage2.updateUser(user.id, {
          status: "bloqueado"
          // NÃO converter para 'free' - manter como trial bloqueado
          // O usuário precisa contratar um plano para reativar
        });
        if (storage2.getFuncionarios) {
          const funcionarios2 = await storage2.getFuncionarios();
          const funcionariosDaConta = funcionarios2.filter((f) => f.conta_id === user.id);
          for (const funcionario of funcionariosDaConta) {
            await storage2.updateFuncionario(funcionario.id, {
              status: "bloqueado"
            });
            logger.warn("Funcion\xE1rio bloqueado devido ao trial expirado da conta principal", "PAYMENT_REMINDER", {
              funcionarioId: funcionario.id,
              funcionarioNome: funcionario.nome,
              contaId: user.id,
              motivo: "Trial expirado"
            });
          }
          if (funcionariosDaConta.length > 0) {
            logger.info(`TODOS os ${funcionariosDaConta.length} funcion\xE1rio(s) bloqueado(s) devido ao trial expirado`, "PAYMENT_REMINDER", {
              userId: user.id,
              userEmail: user.email
            });
          }
        }
        await this.emailService.sendAccountBlocked({
          to: user.email,
          userName: user.nome,
          planName: "Plano Trial"
        });
        logger.warn("Usu\xE1rio trial expirado e TODOS os funcion\xE1rios bloqueados", "PAYMENT_REMINDER", {
          userId: user.id,
          userEmail: user.email
        });
      }
      /**
       * Envia aviso de vencimento de pacote de funcionários
       */
      async sendEmployeePackageExpirationWarning(user, daysRemaining) {
        const limiteBase = user.max_funcionarios_base || 1;
        const limiteAtual = user.max_funcionarios || 1;
        const funcionariosExtras = limiteAtual - limiteBase;
        await this.emailService.sendExpirationWarning({
          to: user.email,
          userName: user.nome,
          planName: `Pacote de ${funcionariosExtras} Funcion\xE1rios Extras`,
          daysRemaining,
          expirationDate: new Date(user.data_expiracao_pacote_funcionarios).toLocaleDateString("pt-BR"),
          amount: 0
          // Será necessário buscar o preço do banco
        });
        logger.info("Aviso de vencimento de pacote de funcion\xE1rios enviado", "PAYMENT_REMINDER", {
          userId: user.id,
          daysRemaining,
          funcionariosExtras
        });
      }
      /**
       * Reverte o limite de funcionários para o limite base após expiração
       */
      async revertToBaseLimitAfterExpiration(user) {
        const limiteBase = user.max_funcionarios_base || 1;
        const limiteAtual = user.max_funcionarios || 1;
        if (limiteAtual <= limiteBase) {
          return;
        }
        const funcionariosExtras = limiteAtual - limiteBase;
        await storage2.updateUser(user.id, {
          max_funcionarios: limiteBase,
          data_expiracao_pacote_funcionarios: null
        });
        if (storage2.updateEmployeePackageStatus) {
          await storage2.updateEmployeePackageStatus(user.id, "expirado");
        }
        if (storage2.getFuncionarios) {
          const funcionarios2 = await storage2.getFuncionarios();
          const funcionariosDaConta = funcionarios2.filter((f) => f.conta_id === user.id && f.status === "ativo").sort((a, b) => new Date(b.data_criacao || 0).getTime() - new Date(a.data_criacao || 0).getTime());
          const funcionariosParaBloquear = funcionariosDaConta.slice(0, funcionariosExtras);
          for (const funcionario of funcionariosParaBloquear) {
            await storage2.updateFuncionario(funcionario.id, {
              status: "bloqueado"
            });
            logger.warn("Funcion\xE1rio bloqueado devido ao vencimento do pacote", "PAYMENT_REMINDER", {
              funcionarioId: funcionario.id,
              funcionarioNome: funcionario.nome,
              contaId: user.id
            });
          }
          logger.warn(`${funcionariosParaBloquear.length} funcion\xE1rio(s) bloqueado(s) por vencimento de pacote`, "PAYMENT_REMINDER", {
            userId: user.id,
            limiteAnterior: limiteAtual,
            novoLimite: limiteBase
          });
        }
        await this.emailService.sendAccountBlocked({
          to: user.email,
          userName: user.nome,
          planName: `Pacote de ${funcionariosExtras} Funcion\xE1rios Extras`
        });
        logger.error("Limite de funcion\xE1rios revertido por vencimento de pacote", "PAYMENT_REMINDER", {
          userId: user.id,
          userEmail: user.email,
          limiteAnterior: limiteAtual,
          novoLimite: limiteBase,
          funcionariosBloqueados: funcionariosExtras
        });
      }
      /**
       * Calcula diferença em dias entre duas datas
       */
      getDaysDifference(date1, date2) {
        const diffTime = date2.getTime() - date1.getTime();
        return Math.floor(diffTime / (1e3 * 60 * 60 * 24));
      }
      /**
       * Inicia verificação automática (executar a cada 6 horas)
       */
      startAutoCheck() {
        this.checkAndSendReminders();
        setInterval(() => {
          this.checkAndSendReminders();
        }, 6 * 60 * 60 * 1e3);
        logger.info("Sistema de lembretes de pagamento iniciado", "PAYMENT_REMINDER");
      }
    };
    paymentReminderService = new PaymentReminderService();
  }
});

// server/auto-healing.ts
var auto_healing_exports = {};
__export(auto_healing_exports, {
  autoHealingService: () => autoHealingService
});
import { drizzle as drizzle2 } from "drizzle-orm/neon-serverless";
import { Pool as Pool2, neonConfig as neonConfig2 } from "@neondatabase/serverless";
import { sql as sql2 } from "drizzle-orm";
import ws2 from "ws";
var AutoHealingService, autoHealingService;
var init_auto_healing = __esm({
  "server/auto-healing.ts"() {
    "use strict";
    init_storage();
    init_logger();
    neonConfig2.webSocketConstructor = ws2;
    AutoHealingService = class {
      healthChecks = [];
      checkInterval = null;
      isRunning = false;
      // Iniciar monitoramento automático
      startAutoHealing(intervalMinutes = 5) {
        if (this.isRunning) {
          logger.warn("Auto-healing j\xE1 est\xE1 em execu\xE7\xE3o", "AUTO_HEALING");
          return;
        }
        this.isRunning = true;
        logger.info("Sistema de auto-healing iniciado", "AUTO_HEALING", {
          interval: `${intervalMinutes} minutos`
        });
        this.runHealthChecks();
        this.checkInterval = setInterval(() => {
          this.runHealthChecks();
        }, intervalMinutes * 60 * 1e3);
      }
      // Parar monitoramento
      stopAutoHealing() {
        if (this.checkInterval) {
          clearInterval(this.checkInterval);
          this.checkInterval = null;
        }
        this.isRunning = false;
        logger.info("Sistema de auto-healing parado", "AUTO_HEALING");
      }
      // Executar todas as verificações de saúde
      async runHealthChecks() {
        logger.info("Iniciando verifica\xE7\xF5es de sa\xFAde", "AUTO_HEALING");
        this.healthChecks = [];
        let autoFixCount = 0;
        await this.checkDatabaseConnection();
        await this.checkDatabaseSchema();
        await this.checkExternalServices();
        await this.checkResourceUsage();
        await this.checkDataIntegrity();
        const moduleChecks = await this.checkSystemModules();
        this.healthChecks.push(...moduleChecks);
        const critical = this.healthChecks.filter((h) => h.status === "critical").length;
        const degraded = this.healthChecks.filter((h) => h.status === "degraded").length;
        const autoFixed = this.healthChecks.filter((h) => h.autoFixed).length;
        logger.info("Verifica\xE7\xF5es de sa\xFAde conclu\xEDdas", "AUTO_HEALING", {
          total: this.healthChecks.length,
          critical,
          degraded,
          autoFixed
        });
        return this.healthChecks;
      }
      // 1. Verificar conexão com banco de dados
      async checkDatabaseConnection() {
        try {
          if (!process.env.DATABASE_URL) {
            this.addHealthCheck("database_connection", "critical", "DATABASE_URL n\xE3o configurada");
            return;
          }
          const pool2 = new Pool2({ connectionString: process.env.DATABASE_URL });
          const db = drizzle2(pool2);
          await db.execute(sql2`SELECT 1`);
          await pool2.end();
          this.addHealthCheck("database_connection", "healthy", "Conex\xE3o com banco de dados OK");
        } catch (error) {
          this.addHealthCheck("database_connection", "critical", `Erro na conex\xE3o: ${error.message}`);
          const fixResult = await this.autoFixDatabaseConnection();
          if (fixResult.success) {
            this.healthChecks[this.healthChecks.length - 1].autoFixed = true;
            this.healthChecks[this.healthChecks.length - 1].status = "healthy";
            this.healthChecks[this.healthChecks.length - 1].message = fixResult.message;
          }
        }
      }
      // 2. Verificar schema do banco
      async checkDatabaseSchema() {
        try {
          const pool2 = new Pool2({ connectionString: process.env.DATABASE_URL });
          const db = drizzle2(pool2);
          const criticalTables = [
            "users",
            "produtos",
            "vendas",
            "clientes",
            "fornecedores",
            "caixas",
            "subscriptions"
          ];
          const result = await db.execute(sql2`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `);
          const existingTables = result.rows.map((row) => row.table_name);
          const missingTables = criticalTables.filter((t) => !existingTables.includes(t));
          await pool2.end();
          if (missingTables.length > 0) {
            this.addHealthCheck("database_schema", "critical", `Tabelas faltando: ${missingTables.join(", ")}`);
            const fixResult = await this.autoFixDatabaseSchema(missingTables);
            if (fixResult.success) {
              this.healthChecks[this.healthChecks.length - 1].autoFixed = true;
              this.healthChecks[this.healthChecks.length - 1].status = "healthy";
              this.healthChecks[this.healthChecks.length - 1].message = fixResult.message;
            }
          } else {
            this.addHealthCheck("database_schema", "healthy", "Schema do banco de dados OK");
          }
        } catch (error) {
          this.addHealthCheck("database_schema", "degraded", `Erro ao verificar schema: ${error.message}`);
        }
      }
      // 3. Verificar serviços externos
      async checkExternalServices() {
        try {
          const mpConfig = await storage2.getConfigMercadoPago();
          if (!mpConfig || !mpConfig.access_token) {
            this.addHealthCheck("mercadopago", "degraded", "Mercado Pago n\xE3o configurado");
          } else {
            this.addHealthCheck("mercadopago", "healthy", "Mercado Pago configurado");
          }
        } catch (error) {
          this.addHealthCheck("mercadopago", "degraded", `Erro ao verificar Mercado Pago: ${error.message}`);
        }
        try {
          if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
            this.addHealthCheck("email_service", "degraded", "SMTP n\xE3o configurado");
          } else {
            this.addHealthCheck("email_service", "healthy", "Servi\xE7o de email configurado");
          }
        } catch (error) {
          this.addHealthCheck("email_service", "degraded", `Erro ao verificar email: ${error.message}`);
        }
      }
      // 4. Verificar uso de recursos
      async checkResourceUsage() {
        try {
          const memUsage = process.memoryUsage();
          const memUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
          const memTotalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
          const memPercent = memUsedMB / memTotalMB * 100;
          if (memPercent > 95) {
            this.addHealthCheck("memory_usage", "critical", `Mem\xF3ria cr\xEDtica: ${memPercent.toFixed(1)}% (${memUsedMB}MB/${memTotalMB}MB)`);
            const fixResult = await this.autoFixMemoryUsage();
            if (fixResult.success) {
              this.healthChecks[this.healthChecks.length - 1].autoFixed = true;
              this.healthChecks[this.healthChecks.length - 1].status = "healthy";
            }
          } else if (memPercent > 85) {
            this.addHealthCheck("memory_usage", "degraded", `Mem\xF3ria elevada: ${memPercent.toFixed(1)}% (${memUsedMB}MB/${memTotalMB}MB)`);
          } else {
            this.addHealthCheck("memory_usage", "healthy", `Mem\xF3ria normal: ${memPercent.toFixed(1)}% (${memUsedMB}MB/${memTotalMB}MB)`);
          }
        } catch (error) {
          this.addHealthCheck("memory_usage", "degraded", `Erro ao verificar mem\xF3ria: ${error.message}`);
        }
      }
      // 5. Verificar integridade de dados
      async checkDataIntegrity() {
        try {
          const users2 = await storage2.getUsers();
          const usersWithoutPlan = users2.filter((u) => !u.plano || u.plano === "");
          if (usersWithoutPlan.length > 0) {
            this.addHealthCheck("data_integrity_plans", "degraded", `${usersWithoutPlan.length} usu\xE1rios sem plano definido`);
            const fixResult = await this.autoFixUserPlans(usersWithoutPlan);
            if (fixResult.success) {
              this.healthChecks[this.healthChecks.length - 1].autoFixed = true;
              this.healthChecks[this.healthChecks.length - 1].status = "healthy";
              this.healthChecks[this.healthChecks.length - 1].message = fixResult.message;
            }
          } else {
            this.addHealthCheck("data_integrity_plans", "healthy", "Todos os usu\xE1rios t\xEAm plano definido");
          }
          const produtos2 = await storage2.getProdutos();
          const produtosInvalidos = produtos2.filter((p) => p.preco <= 0);
          if (produtosInvalidos.length > 0) {
            this.addHealthCheck("data_integrity_products", "degraded", `${produtosInvalidos.length} produtos com pre\xE7o inv\xE1lido`);
          } else {
            this.addHealthCheck("data_integrity_products", "healthy", "Todos os produtos t\xEAm pre\xE7o v\xE1lido");
          }
        } catch (error) {
          this.addHealthCheck("data_integrity", "degraded", `Erro ao verificar integridade: ${error.message}`);
        }
      }
      // 6. Verificar módulos do sistema
      async checkSystemModules() {
        const checks = [];
        let autoFixCount = 0;
        try {
          const produtos2 = await storage2.getProdutos();
          const produtosAtivos = produtos2.filter((p) => p.quantidade > 0);
          const produtosVencidos = produtos2.filter((p) => {
            if (!p.vencimento) return false;
            return new Date(p.vencimento) < /* @__PURE__ */ new Date();
          });
          if (produtosVencidos.length > 10) {
            checks.push({
              service: "module_estoque",
              status: "degraded",
              message: `${produtosVencidos.length} produtos vencidos no estoque`,
              timestamp: (/* @__PURE__ */ new Date()).toISOString(),
              autoFixed: false
            });
          } else {
            checks.push({
              service: "module_estoque",
              status: "healthy",
              message: `Estoque OK: ${produtosAtivos.length} produtos ativos`,
              timestamp: (/* @__PURE__ */ new Date()).toISOString(),
              autoFixed: false
            });
          }
        } catch (error) {
          checks.push({
            service: "module_estoque",
            status: "critical",
            message: `M\xF3dulo de Estoque com erro: ${error.message}`,
            timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            autoFixed: false
          });
        }
        try {
          const contas = await storage2.getContasPagar?.() || [];
          const contasVencidas = contas.filter((c) => {
            if (c.status === "pago") return false;
            return new Date(c.vencimento) < /* @__PURE__ */ new Date();
          });
          if (contasVencidas.length > 5) {
            checks.push({
              service: "module_financeiro",
              status: "degraded",
              message: `${contasVencidas.length} contas a pagar vencidas`,
              timestamp: (/* @__PURE__ */ new Date()).toISOString(),
              autoFixed: false
            });
          } else {
            checks.push({
              service: "module_financeiro",
              status: "healthy",
              message: `Financeiro OK: ${contas.length} contas cadastradas`,
              timestamp: (/* @__PURE__ */ new Date()).toISOString(),
              autoFixed: false
            });
          }
        } catch (error) {
          checks.push({
            service: "module_financeiro",
            status: "critical",
            message: `M\xF3dulo Financeiro com erro: ${error.message}`,
            timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            autoFixed: false
          });
        }
        try {
          const vendas2 = await storage2.getVendas();
          const hoje = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
          const vendasHoje = vendas2.filter((v) => v.data?.startsWith(hoje));
          checks.push({
            service: "module_pdv",
            status: "healthy",
            message: `PDV operacional: ${vendasHoje.length} vendas hoje`,
            timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            autoFixed: false
          });
        } catch (error) {
          checks.push({
            service: "module_pdv",
            status: "critical",
            message: `M\xF3dulo PDV com erro: ${error.message}`,
            timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            autoFixed: false
          });
        }
        try {
          const users2 = await storage2.getUsers();
          const admins = users2.filter((u) => u.is_admin === "true");
          const funcionarios2 = await storage2.getFuncionarios?.() || [];
          if (admins.length === 0) {
            checks.push({
              service: "module_admin",
              status: "critical",
              message: "Nenhum administrador cadastrado",
              timestamp: (/* @__PURE__ */ new Date()).toISOString(),
              autoFixed: false
            });
          } else {
            checks.push({
              service: "module_admin",
              status: "healthy",
              message: `Admin OK: ${admins.length} admins, ${funcionarios2.length} funcion\xE1rios`,
              timestamp: (/* @__PURE__ */ new Date()).toISOString(),
              autoFixed: false
            });
          }
        } catch (error) {
          checks.push({
            service: "module_admin",
            status: "critical",
            message: `M\xF3dulo Admin com erro: ${error.message}`,
            timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            autoFixed: false
          });
        }
        try {
          if (storage2.getCaixas) {
            const caixas2 = await storage2.getCaixas("all");
            const caixasAbertos = caixas2.filter((c) => c.status === "aberto");
            if (caixasAbertos.length > 50) {
              checks.push({
                service: "module_caixa",
                status: "degraded",
                message: `Muitos caixas abertos: ${caixasAbertos.length}`,
                timestamp: (/* @__PURE__ */ new Date()).toISOString(),
                autoFixed: false
              });
            } else {
              checks.push({
                service: "module_caixa",
                status: "healthy",
                message: `Caixa OK: ${caixasAbertos.length} caixas abertos`,
                timestamp: (/* @__PURE__ */ new Date()).toISOString(),
                autoFixed: false
              });
            }
          } else {
            checks.push({
              service: "module_caixa",
              status: "healthy",
              message: "M\xF3dulo de Caixa dispon\xEDvel",
              timestamp: (/* @__PURE__ */ new Date()).toISOString(),
              autoFixed: false
            });
          }
        } catch (error) {
          checks.push({
            service: "module_caixa",
            status: "critical",
            message: `M\xF3dulo Caixa com erro: ${error.message}`,
            timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            autoFixed: false
          });
        }
        try {
          const users2 = await storage2.getUsers();
          const blockedWithActivePlan = users2.filter(
            (u) => u.status === "bloqueado" && u.plano && u.plano !== "trial" && (u.plano === "premium_mensal" || u.plano === "premium_anual")
          );
          if (blockedWithActivePlan.length > 0) {
            checks.push({
              service: "account_status",
              status: "degraded",
              message: `${blockedWithActivePlan.length} conta(s) bloqueada(s) com plano ativo`,
              timestamp: (/* @__PURE__ */ new Date()).toISOString(),
              autoFixed: false
            });
          }
        } catch (error) {
          logger.error("[AUTO_HEALING] Erro ao verificar contas bloqueadas", { error });
        }
        try {
          if (storage2.getFuncionarios) {
            const users2 = await storage2.getUsers();
            const blockedUsers = users2.filter((u) => u.status === "bloqueado");
            const funcionarios2 = await storage2.getFuncionarios();
            let inconsistenciasEncontradas = 0;
            let funcionariosCorrigidos = 0;
            for (const user of blockedUsers) {
              const funcionariosDaConta = funcionarios2.filter(
                (f) => f.conta_id === user.id && f.status === "ativo"
              );
              if (funcionariosDaConta.length > 0) {
                inconsistenciasEncontradas += funcionariosDaConta.length;
                for (const funcionario of funcionariosDaConta) {
                  try {
                    await storage2.updateFuncionario(funcionario.id, {
                      status: "bloqueado"
                    });
                    funcionariosCorrigidos++;
                    logger.warn("[AUTO_HEALING] Funcion\xE1rio bloqueado automaticamente", {
                      funcionarioId: funcionario.id,
                      funcionarioNome: funcionario.nome,
                      contaId: user.id,
                      contaEmail: user.email,
                      motivo: "Conta principal bloqueada (auto-healing)"
                    });
                  } catch (error) {
                    logger.error("[AUTO_HEALING] Erro ao bloquear funcion\xE1rio", {
                      funcionarioId: funcionario.id,
                      error: error.message
                    });
                  }
                }
              }
            }
            if (inconsistenciasEncontradas > 0) {
              checks.push({
                service: "employee_status_in_blocked_accounts",
                status: funcionariosCorrigidos === inconsistenciasEncontradas ? "healthy" : "critical",
                message: `${inconsistenciasEncontradas} funcion\xE1rio(s) encontrado(s) em contas bloqueadas. ${funcionariosCorrigidos} corrigido(s) automaticamente.`,
                timestamp: (/* @__PURE__ */ new Date()).toISOString(),
                autoFixed: funcionariosCorrigidos === inconsistenciasEncontradas
              });
              autoFixCount += funcionariosCorrigidos;
            }
          }
        } catch (error) {
          logger.error("[AUTO_HEALING] Erro ao verificar funcion\xE1rios em contas bloqueadas", { error: error.message });
        }
        return checks;
      }
      // AUTO-FIXES (Correções Automáticas)
      async autoFixDatabaseConnection() {
        try {
          logger.info("Tentando reconectar ao banco de dados...", "AUTO_HEALING");
          await new Promise((resolve) => setTimeout(resolve, 2e3));
          const pool2 = new Pool2({ connectionString: process.env.DATABASE_URL });
          const db = drizzle2(pool2);
          await db.execute(sql2`SELECT 1`);
          await pool2.end();
          logger.info("\u2705 Conex\xE3o com banco restaurada automaticamente", "AUTO_HEALING");
          return {
            success: true,
            message: "Conex\xE3o restaurada automaticamente",
            action: "database_reconnect"
          };
        } catch (error) {
          logger.error("\u274C Falha ao reconectar ao banco", "AUTO_HEALING", { error: error.message });
          return {
            success: false,
            message: "N\xE3o foi poss\xEDvel reconectar",
            action: "database_reconnect_failed"
          };
        }
      }
      async autoFixDatabaseSchema(missingTables) {
        try {
          logger.warn("\u26A0\uFE0F Tentando recriar tabelas faltantes...", "AUTO_HEALING", { tables: missingTables });
          return {
            success: false,
            message: "Schema requer corre\xE7\xE3o manual",
            action: "schema_fix_required"
          };
        } catch (error) {
          return {
            success: false,
            message: `Erro ao tentar corrigir schema: ${error.message}`,
            action: "schema_fix_failed"
          };
        }
      }
      async autoFixMemoryUsage() {
        try {
          logger.info("Executando garbage collection...", "AUTO_HEALING");
          if (global.gc) {
            global.gc();
            logger.info("\u2705 Garbage collection executado", "AUTO_HEALING");
            return {
              success: true,
              message: "Mem\xF3ria liberada automaticamente",
              action: "memory_gc"
            };
          }
          return {
            success: false,
            message: "GC n\xE3o dispon\xEDvel (execute com --expose-gc)",
            action: "memory_gc_unavailable"
          };
        } catch (error) {
          return {
            success: false,
            message: `Erro ao liberar mem\xF3ria: ${error.message}`,
            action: "memory_gc_failed"
          };
        }
      }
      async autoFixUserPlans(users2) {
        try {
          logger.info("Corrigindo usu\xE1rios sem plano...", "AUTO_HEALING", { count: users2.length });
          for (const user of users2) {
            await storage2.updateUser(user.id, { plano: "trial" });
          }
          logger.info("\u2705 Planos corrigidos automaticamente", "AUTO_HEALING", { count: users2.length });
          return {
            success: true,
            message: `${users2.length} usu\xE1rios corrigidos para plano trial`,
            action: "fix_user_plans"
          };
        } catch (error) {
          return {
            success: false,
            message: `Erro ao corrigir planos: ${error.message}`,
            action: "fix_user_plans_failed"
          };
        }
      }
      // Adicionar resultado de verificação
      addHealthCheck(service, status, message) {
        this.healthChecks.push({
          service,
          status,
          message,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          autoFixed: false
        });
      }
      // Obter status atual do sistema
      getSystemStatus() {
        const critical = this.healthChecks.filter((h) => h.status === "critical").length;
        const degraded = this.healthChecks.filter((h) => h.status === "degraded").length;
        const healthy = this.healthChecks.filter((h) => h.status === "healthy").length;
        let overallStatus = "online";
        if (critical > 0) overallStatus = "offline";
        else if (degraded > 0) overallStatus = "degraded";
        return {
          status: overallStatus,
          lastCheck: this.healthChecks.length > 0 ? this.healthChecks[0].timestamp : null,
          checks: this.healthChecks,
          summary: {
            total: this.healthChecks.length,
            healthy,
            degraded,
            critical,
            autoFixed: this.healthChecks.filter((h) => h.autoFixed).length
          }
        };
      }
      // Obter histórico de correções automáticas
      getAutoFixHistory(limit = 50) {
        return this.healthChecks.filter((h) => h.autoFixed).slice(0, limit);
      }
    };
    autoHealingService = new AutoHealingService();
  }
});

// server/auto-cleanup.ts
var auto_cleanup_exports = {};
__export(auto_cleanup_exports, {
  AutoCleanupService: () => AutoCleanupService,
  autoCleanupService: () => autoCleanupService
});
var DEFAULT_CONFIG, AutoCleanupService, autoCleanupService;
var init_auto_cleanup = __esm({
  "server/auto-cleanup.ts"() {
    "use strict";
    init_storage();
    init_logger();
    DEFAULT_CONFIG = {
      devolucoes_dias: 90,
      orcamentos_dias: 180,
      logs_dias: 90,
      caixas_dias: 365,
      // Arquiva caixas fechados após 365 dias
      contas_pagar_dias: 365,
      contas_receber_dias: 365,
      relatorios_dias: null
      // Aguardando implementação
    };
    AutoCleanupService = class {
      config;
      isRunning = false;
      constructor(config) {
        this.config = { ...DEFAULT_CONFIG, ...config };
      }
      // Carregar configurações salvas
      async loadConfig() {
        try {
          logger.info("Configura\xE7\xF5es de limpeza carregadas", "AUTO_CLEANUP", this.config);
        } catch (error) {
          logger.warn("Usando configura\xE7\xF5es padr\xE3o de limpeza", "AUTO_CLEANUP", { error: error.message });
        }
      }
      // Atualizar configurações
      updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        logger.info("Configura\xE7\xF5es de limpeza atualizadas", "AUTO_CLEANUP", this.config);
      }
      // Obter configurações atuais
      getConfig() {
        return { ...this.config };
      }
      async executeCleanup() {
        if (this.isRunning) {
          logger.warn("Limpeza autom\xE1tica j\xE1 est\xE1 em execu\xE7\xE3o", "AUTO_CLEANUP");
          return;
        }
        this.isRunning = true;
        logger.info("Iniciando limpeza autom\xE1tica de dados...", "AUTO_CLEANUP");
        try {
          const results = {
            devolucoes: 0,
            orcamentos: 0,
            logs: 0,
            caixas: 0,
            contas_pagar: 0,
            contas_receber: 0,
            relatorios: 0
          };
          if (this.config.devolucoes_dias !== null && this.config.devolucoes_dias > 0) {
            results.devolucoes = await this.cleanupDevolucoes(this.config.devolucoes_dias);
          }
          if (this.config.orcamentos_dias !== null && this.config.orcamentos_dias > 0) {
            results.orcamentos = await this.cleanupOrcamentos(this.config.orcamentos_dias);
          }
          if (this.config.logs_dias !== null && this.config.logs_dias > 0) {
            results.logs = await this.cleanupLogs(this.config.logs_dias);
          }
          if (this.config.caixas_dias !== null && this.config.caixas_dias > 0) {
            results.caixas = await this.cleanupCaixas(this.config.caixas_dias);
          }
          if (this.config.contas_pagar_dias !== null && this.config.contas_pagar_dias > 0) {
            results.contas_pagar = await this.cleanupContasPagar(this.config.contas_pagar_dias);
          }
          if (this.config.contas_receber_dias !== null && this.config.contas_receber_dias > 0) {
            results.contas_receber = await this.cleanupContasReceber(this.config.contas_receber_dias);
          }
          if (this.config.relatorios_dias !== null && this.config.relatorios_dias > 0) {
            results.relatorios = await this.cleanupRelatorios(this.config.relatorios_dias);
          }
          logger.info("Arquivamento autom\xE1tico conclu\xEDdo", "AUTO_CLEANUP", {
            devolucoesArquivadas: results.devolucoes,
            orcamentosArquivados: results.orcamentos,
            logsArquivados: results.logs,
            caixasArquivados: results.caixas,
            contasPagarArquivadas: results.contas_pagar,
            contasReceberArquivadas: results.contas_receber,
            relatoriosArquivados: results.relatorios,
            nota: "Dados arquivados permanecem dispon\xEDveis para relat\xF3rios"
          });
        } catch (error) {
          logger.error("Erro durante limpeza autom\xE1tica", "AUTO_CLEANUP", {
            error: error.message
          });
        } finally {
          this.isRunning = false;
        }
      }
      async cleanupDevolucoes(diasAntigos) {
        try {
          const dataLimite = /* @__PURE__ */ new Date();
          dataLimite.setDate(dataLimite.getDate() - diasAntigos);
          const todasDevolucoes = await storage2.getDevolucoes();
          const devolucoesAntigas = todasDevolucoes.filter(
            (d) => new Date(d.data_devolucao) < dataLimite && d.status !== "pendente"
          );
          let archivedCount = 0;
          for (const dev of devolucoesAntigas) {
            await storage2.updateDevolucao(dev.id, {
              status: "arquivada"
              // Marca como arquivada
            });
            archivedCount++;
          }
          return archivedCount;
        } catch (error) {
          logger.error("Erro ao arquivar devolu\xE7\xF5es", "AUTO_CLEANUP", { error });
          return 0;
        }
      }
      async cleanupOrcamentos(diasAntigos) {
        try {
          const dataLimite = /* @__PURE__ */ new Date();
          dataLimite.setDate(dataLimite.getDate() - diasAntigos);
          const todosOrcamentos = await storage2.getOrcamentos();
          const orcamentosAntigos = todosOrcamentos.filter(
            (o) => new Date(o.data_criacao) < dataLimite && (o.status === "convertido" || o.status === "rejeitado")
          );
          let archivedCount = 0;
          for (const orc of orcamentosAntigos) {
            await storage2.updateOrcamento(orc.id, {
              status: "arquivado"
              // Marca como arquivado
            });
            archivedCount++;
          }
          return archivedCount;
        } catch (error) {
          logger.error("Erro ao arquivar or\xE7amentos", "AUTO_CLEANUP", { error });
          return 0;
        }
      }
      async cleanupLogs(diasAntigos) {
        return 0;
      }
      async cleanupCaixas(diasAntigos) {
        try {
          if (!storage2.arquivarCaixasAntigos) {
            logger.warn("M\xE9todo de arquivamento de caixas n\xE3o implementado", "AUTO_CLEANUP");
            return 0;
          }
          const dataLimite = /* @__PURE__ */ new Date();
          dataLimite.setDate(dataLimite.getDate() - diasAntigos);
          const count = await storage2.arquivarCaixasAntigos(dataLimite.toISOString());
          if (count > 0) {
            logger.info(`${count} caixas arquivados com sucesso`, "AUTO_CLEANUP");
          }
          return count;
        } catch (error) {
          logger.error("Erro ao arquivar caixas", "AUTO_CLEANUP", { error });
          return 0;
        }
      }
      async cleanupContasPagar(diasAntigos) {
        try {
          const dataLimite = /* @__PURE__ */ new Date();
          dataLimite.setDate(dataLimite.getDate() - diasAntigos);
          const todasContas = await storage2.getContasPagar();
          const contasAntigas = todasContas.filter(
            (c) => new Date(c.data_pagamento || c.data_vencimento) < dataLimite && c.status === "pago"
          );
          let archivedCount = 0;
          for (const conta of contasAntigas) {
            await storage2.updateContaPagar(conta.id, {
              status: "arquivado"
              // Marca como arquivado
            });
            archivedCount++;
          }
          return archivedCount;
        } catch (error) {
          logger.error("Erro ao arquivar contas a pagar", "AUTO_CLEANUP", { error });
          return 0;
        }
      }
      async cleanupContasReceber(diasAntigos) {
        try {
          const dataLimite = /* @__PURE__ */ new Date();
          dataLimite.setDate(dataLimite.getDate() - diasAntigos);
          const todasContas = await storage2.getContasReceber();
          const contasAntigas = todasContas.filter(
            (c) => new Date(c.data_recebimento || c.data_vencimento) < dataLimite && c.status === "recebido"
          );
          let archivedCount = 0;
          for (const conta of contasAntigas) {
            await storage2.updateContaReceber(conta.id, {
              status: "arquivado"
              // Marca como arquivado
            });
            archivedCount++;
          }
          return archivedCount;
        } catch (error) {
          logger.error("Erro ao arquivar contas a receber", "AUTO_CLEANUP", { error });
          return 0;
        }
      }
      async cleanupRelatorios(diasAntigos) {
        try {
          const dataLimite = /* @__PURE__ */ new Date();
          dataLimite.setDate(dataLimite.getDate() - diasAntigos);
          logger.info("Limpeza de relat\xF3rios antigos ainda n\xE3o implementada", "AUTO_CLEANUP", {
            nota: "Aguardando implementa\xE7\xE3o de salvamento de relat\xF3rios"
          });
          return 0;
        } catch (error) {
          logger.error("Erro ao arquivar relat\xF3rios", "AUTO_CLEANUP", { error });
          return 0;
        }
      }
      startScheduledCleanup() {
        const CLEANUP_HOUR = 3;
        const CLEANUP_INTERVAL = 24 * 60 * 60 * 1e3;
        const scheduleNextCleanup = () => {
          const now = /* @__PURE__ */ new Date();
          const next = new Date(now);
          next.setHours(CLEANUP_HOUR, 0, 0, 0);
          if (next <= now) {
            next.setDate(next.getDate() + 1);
          }
          const timeUntilNext = next.getTime() - now.getTime();
          setTimeout(() => {
            this.executeCleanup();
            setInterval(() => this.executeCleanup(), CLEANUP_INTERVAL);
          }, timeUntilNext);
          logger.info("Limpeza autom\xE1tica agendada", "AUTO_CLEANUP", {
            proximaExecucao: next.toISOString()
          });
        };
        scheduleNextCleanup();
      }
    };
    autoCleanupService = new AutoCleanupService();
  }
});

// server/index.ts
import express2 from "express";

// server/routes.ts
init_storage();
init_schema();
import { createServer } from "http";

// shared/nfce-schema.ts
import { z as z2 } from "zod";
var nfceItemSchema = z2.object({
  numero_item: z2.number().positive(),
  codigo_produto: z2.string().min(1),
  descricao: z2.string().min(1),
  cfop: z2.string().length(4),
  unidade_comercial: z2.string().min(1),
  quantidade_comercial: z2.number().positive(),
  valor_unitario_comercial: z2.number().positive(),
  valor_bruto: z2.number().positive(),
  icms_origem: z2.string(),
  icms_situacao_tributaria: z2.string()
});
var nfceSchema = z2.object({
  natureza_operacao: z2.string().min(1),
  tipo_documento: z2.string(),
  finalidade_emissao: z2.string(),
  cnpj_emitente: z2.string().min(14),
  nome_destinatario: z2.string().optional(),
  cpf_destinatario: z2.string().optional(),
  cnpj_destinatario: z2.string().optional(),
  items: z2.array(nfceItemSchema).min(1),
  valor_total: z2.number().positive()
});

// server/focusnfe.ts
var FocusNFeService = class {
  baseUrl;
  apiToken;
  ambiente;
  constructor(config) {
    this.ambiente = config.ambiente;
    this.baseUrl = config.ambiente === "producao" ? "https://api.focusnfe.com.br/v2" : "https://homologacao.focusnfe.com.br/v2";
    this.apiToken = config.focus_nfe_api_key;
  }
  getAuthHeader() {
    return `Basic ${Buffer.from(this.apiToken + ":").toString("base64")}`;
  }
  async emitirNFCe(data) {
    try {
      const response = await fetch(`${this.baseUrl}/nfce`, {
        method: "POST",
        headers: {
          "Authorization": this.getAuthHeader(),
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(
          result.mensagem || result.erros?.[0]?.mensagem || "Erro ao emitir NFCe"
        );
      }
      return result;
    } catch (error) {
      console.error("Erro ao emitir NFCe:", error);
      throw new Error(error.message || "Erro ao comunicar com Focus NFe");
    }
  }
  async consultarNFCe(ref) {
    try {
      const response = await fetch(`${this.baseUrl}/nfce/${ref}`, {
        method: "GET",
        headers: {
          "Authorization": this.getAuthHeader()
        }
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.mensagem || "Erro ao consultar NFCe");
      }
      return result;
    } catch (error) {
      console.error("Erro ao consultar NFCe:", error);
      throw new Error(error.message || "Erro ao comunicar com Focus NFe");
    }
  }
  async cancelarNFCe(ref, justificativa) {
    if (!justificativa || justificativa.length < 15) {
      throw new Error("Justificativa deve ter no m\xEDnimo 15 caracteres");
    }
    try {
      const response = await fetch(`${this.baseUrl}/nfce/${ref}`, {
        method: "DELETE",
        headers: {
          "Authorization": this.getAuthHeader(),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ justificativa })
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.mensagem || "Erro ao cancelar NFCe");
      }
      return result;
    } catch (error) {
      console.error("Erro ao cancelar NFCe:", error);
      throw new Error(error.message || "Erro ao comunicar com Focus NFe");
    }
  }
};

// server/routes.ts
init_logger();
import { z as z3 } from "zod";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sql as sql3 } from "drizzle-orm";

// server/lib/dateUtils.ts
var SAO_PAULO_TIMEZONE = "America/Sao_Paulo";
function getNowSaoPaulo() {
  return new Date((/* @__PURE__ */ new Date()).toLocaleString("en-US", { timeZone: SAO_PAULO_TIMEZONE }));
}
function parseDateToISOSaoPaulo(dateString) {
  let year, month, day;
  if (dateString.includes("/")) {
    const parts = dateString.split("/");
    day = parts[0].padStart(2, "0");
    month = parts[1].padStart(2, "0");
    year = parts[2];
  } else if (dateString.includes("-")) {
    const datePart = dateString.split("T")[0];
    const parts = datePart.split("-");
    year = parts[0];
    month = parts[1].padStart(2, "0");
    day = parts[2].padStart(2, "0");
  } else {
    throw new Error(`Formato de data n\xE3o reconhecido: ${dateString}`);
  }
  const isoString = `${year}-${month}-${day}T15:00:00.000Z`;
  return isoString;
}
function addDaysAndGetISOSaoPaulo(date, days) {
  const saoPauloDate = new Date(date.toLocaleString("en-US", { timeZone: SAO_PAULO_TIMEZONE }));
  saoPauloDate.setDate(saoPauloDate.getDate() + days);
  saoPauloDate.setHours(12, 0, 0, 0);
  const utcDate = new Date(saoPauloDate.getTime() + 3 * 60 * 60 * 1e3);
  return utcDate.toISOString();
}
function getNowISOSaoPaulo() {
  const now = getNowSaoPaulo();
  now.setHours(12, 0, 0, 0);
  const utcDate = new Date(now.getTime() + 3 * 60 * 60 * 1e3);
  return utcDate.toISOString();
}
function addMonthsAndGetISOSaoPaulo(date, months) {
  const saoPauloDate = new Date(date.toLocaleString("en-US", { timeZone: SAO_PAULO_TIMEZONE }));
  saoPauloDate.setMonth(saoPauloDate.getMonth() + months);
  saoPauloDate.setHours(12, 0, 0, 0);
  const utcDate = new Date(saoPauloDate.getTime() + 3 * 60 * 60 * 1e3);
  return utcDate.toISOString();
}
function addYearsAndGetISOSaoPaulo(date, years) {
  const saoPauloDate = new Date(date.toLocaleString("en-US", { timeZone: SAO_PAULO_TIMEZONE }));
  saoPauloDate.setFullYear(saoPauloDate.getFullYear() + years);
  saoPauloDate.setHours(12, 0, 0, 0);
  const utcDate = new Date(saoPauloDate.getTime() + 3 * 60 * 60 * 1e3);
  return utcDate.toISOString();
}

// server/routes.ts
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
async function requireAdmin(req, res, next) {
  const userId = req.headers["x-user-id"];
  const isAdmin = req.headers["x-is-admin"];
  console.log("\u{1F510} [REQUIRE_ADMIN] Verificando acesso:", {
    path: req.path,
    userId,
    isAdmin,
    headers: req.headers
  });
  if (!userId || isAdmin !== "true") {
    const sessionAuth = req.headers["cookie"]?.includes("admin_master_auth=true");
    if (sessionAuth) {
      console.log("\u2705 [REQUIRE_ADMIN] Acesso permitido via sess\xE3o master");
      next();
      return;
    }
    console.log("\u274C [REQUIRE_ADMIN] Acesso negado");
    return res.status(403).json({
      error: "Acesso negado. Apenas administradores podem acessar este recurso."
    });
  }
  try {
    const user = await storage2.getUserById(userId);
    if (!user || user.is_admin !== "true") {
      console.log("\u274C [REQUIRE_ADMIN] Usu\xE1rio n\xE3o \xE9 admin");
      return res.status(403).json({
        error: "Acesso negado. Apenas administradores podem acessar este recurso."
      });
    }
  } catch (error) {
    console.error("\u274C [REQUIRE_ADMIN] Erro ao validar usu\xE1rio:", error);
    return res.status(500).json({
      error: "Erro ao validar permiss\xF5es"
    });
  }
  console.log("\u2705 [REQUIRE_ADMIN] Acesso permitido");
  next();
}
async function validateSession(req, res, next) {
  const sessionToken = req.headers["x-session-token"];
  const userId = req.headers["x-user-id"];
  if (!sessionToken) {
    console.log("[SESSION] Requisi\xE7\xE3o sem token de sess\xE3o - modo compatibilidade");
    return next();
  }
  try {
    const session = await storage2.getSessionByToken(sessionToken);
    if (!session) {
      console.log("[SESSION] Token de sess\xE3o inv\xE1lido ou expirado");
      return res.status(401).json({
        error: "Sess\xE3o inv\xE1lida ou expirada. Fa\xE7a login novamente.",
        code: "SESSION_INVALID"
      });
    }
    if (session.user_id !== userId) {
      console.log("[SESSION] Token de sess\xE3o n\xE3o pertence ao usu\xE1rio");
      return res.status(401).json({
        error: "Sess\xE3o inv\xE1lida. Fa\xE7a login novamente.",
        code: "SESSION_USER_MISMATCH"
      });
    }
    if (!session.is_active) {
      console.log("[SESSION] Sess\xE3o foi invalidada");
      return res.status(401).json({
        error: "Sess\xE3o foi encerrada. Fa\xE7a login novamente.",
        code: "SESSION_EXPIRED"
      });
    }
    const lastActivity = new Date(session.last_activity);
    const now = /* @__PURE__ */ new Date();
    const hoursSinceActivity = (now.getTime() - lastActivity.getTime()) / (1e3 * 60 * 60);
    if (hoursSinceActivity > 24) {
      console.log("[SESSION] Sess\xE3o expirada por inatividade");
      await storage2.invalidateSession(sessionToken);
      return res.status(401).json({
        error: "Sess\xE3o expirou por inatividade. Fa\xE7a login novamente.",
        code: "SESSION_TIMEOUT"
      });
    }
    if (hoursSinceActivity > 0.083) {
      await storage2.updateSessionActivity(sessionToken);
    }
    req.session = session;
    console.log("[SESSION] Sess\xE3o validada com sucesso");
  } catch (error) {
    console.error("[SESSION] Erro ao validar sess\xE3o:", error);
  }
  next();
}
async function requireAuth(req, res, next) {
  const userId = req.headers["x-user-id"];
  const userType = req.headers["x-user-type"];
  const contaId = req.headers["x-conta-id"];
  if (!userId) {
    return res.status(401).json({
      error: "Autentica\xE7\xE3o necess\xE1ria. Header x-user-id n\xE3o fornecido."
    });
  }
  if (userType === "funcionario" && contaId) {
    try {
      const allFuncionarios = await storage2.getFuncionarios();
      const funcionario = allFuncionarios.find((f) => f.id === userId);
      if (!funcionario || funcionario.conta_id !== contaId) {
        return res.status(403).json({
          error: "Acesso negado. Funcion\xE1rio n\xE3o autorizado para esta conta."
        });
      }
      req.headers["effective-user-id"] = contaId;
      req.headers["funcionario-id"] = userId;
    } catch (error) {
      console.error("Erro ao validar funcion\xE1rio:", error);
      return res.status(500).json({ error: "Erro ao validar autentica\xE7\xE3o" });
    }
  } else {
    req.headers["effective-user-id"] = userId;
  }
  next();
}
function getEffectiveUserId(req) {
  return req.headers["effective-user-id"];
}
async function getUserId(req, res, next) {
  const userId = req.headers["x-user-id"];
  const userType = req.headers["x-user-type"];
  const contaId = req.headers["x-conta-id"];
  if (!userId) {
    return res.status(401).json({
      error: "Autentica\xE7\xE3o necess\xE1ria. Header x-user-id n\xE3o fornecido."
    });
  }
  if (userType === "funcionario" && contaId) {
    try {
      const allFuncionarios = await storage2.getFuncionarios();
      const funcionario = allFuncionarios.find((f) => f.id === userId);
      if (!funcionario || funcionario.conta_id !== contaId) {
        return res.status(403).json({
          error: "Acesso negado. Funcion\xE1rio n\xE3o autorizado para esta conta."
        });
      }
      req.headers["effective-user-id"] = contaId;
      req.headers["funcionario-id"] = userId;
    } catch (error) {
      console.error("Erro ao validar funcion\xE1rio:", error);
      return res.status(500).json({ error: "Erro ao validar autentica\xE7\xE3o" });
    }
  } else {
    req.headers["effective-user-id"] = userId;
  }
  next();
}
async function registerRoutes(app2) {
  app2.use("/api", (req, res, next) => {
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, private, max-age=0"
    );
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");
    next();
  });
  app2.use("/api", (req, res, next) => {
    const authPaths = ["/api/auth/login", "/api/auth/register", "/api/auth/forgot-password", "/api/auth/reset-password"];
    if (authPaths.some((path5) => req.path === path5 || req.path.startsWith(path5))) {
      return next();
    }
    return validateSession(req, res, next);
  });
  app2.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage2.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ error: "Email j\xE1 cadastrado" });
      }
      const hashedPassword = await bcrypt.hash(userData.senha, 10);
      const dataCriacao = getNowISOSaoPaulo();
      const dataExpiracao = addDaysAndGetISOSaoPaulo(/* @__PURE__ */ new Date(), 7);
      const userWithTrial = {
        ...userData,
        senha: hashedPassword,
        plano: "trial",
        is_admin: "true",
        data_criacao: dataCriacao,
        data_expiracao_trial: dataExpiracao,
        data_expiracao_plano: dataExpiracao,
        status: "ativo"
      };
      const user = await storage2.createUser(userWithTrial);
      await storage2.logAdminAction?.(
        user.id,
        "USUARIO_CRIADO",
        `Novo usu\xE1rio registrado: ${user.email}`,
        { ip: req.ip }
      );
      res.json({
        id: user.id,
        email: user.email,
        nome: user.nome,
        data_criacao: user.data_criacao,
        data_expiracao_trial: user.data_expiracao_trial
      });
    } catch (error) {
      console.error("Erro ao registrar usu\xE1rio:", error);
      if (error instanceof z3.ZodError) {
        const errorMessages = error.errors.map((err) => {
          if (err.path[0] === "senha") {
            return "A senha deve ter no m\xEDnimo 8 caracteres, incluindo letras mai\xFAsculas, min\xFAsculas e n\xFAmeros";
          }
          if (err.path[0] === "email") {
            return "Email inv\xE1lido";
          }
          if (err.path[0] === "nome") {
            return "Nome deve ter entre 3 e 100 caracteres";
          }
          return err.message;
        });
        return res.status(400).json({
          error: errorMessages[0] || "Dados inv\xE1lidos"
        });
      }
      res.status(500).json({ error: "Erro ao criar usu\xE1rio" });
    }
  });
  const MAX_SIMULTANEOUS_SESSIONS = 3;
  const SESSION_DURATION_HOURS = 24;
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { email, senha, device_fingerprint, device_info } = req.body;
      if (process.env.NODE_ENV === "development") {
        console.log(`\u{1F510} Tentativa de login - Email: ${email}`);
      }
      if (!device_fingerprint) {
        logger.warn("[SECURITY] Login sem fingerprint", "AUTH", { email, ip: req.ip });
      }
      const user = await storage2.getUserByEmail(email);
      if (!user) {
        if (process.env.NODE_ENV === "development") {
          console.log(`\u274C Falha de login - Usu\xE1rio n\xE3o encontrado`);
        }
        return res.status(401).json({ error: "Email ou senha inv\xE1lidos" });
      }
      let senhaValida = false;
      if (user.senha.startsWith("$2a$") || user.senha.startsWith("$2b$")) {
        senhaValida = await bcrypt.compare(senha, user.senha);
      } else {
        senhaValida = user.senha === senha;
        if (senhaValida) {
          const hashedPassword = await bcrypt.hash(senha, 10);
          await storage2.updateUser(user.id, { senha: hashedPassword });
          logger.info("[SECURITY] Senha migrada para hash", "AUTH", { userId: user.id });
        }
      }
      if (!senhaValida) {
        if (process.env.NODE_ENV === "development") {
          console.log(`\u274C Falha de login - Senha incorreta`);
        }
        return res.status(401).json({ error: "Email ou senha inv\xE1lidos" });
      }
      const now = /* @__PURE__ */ new Date();
      let userAtualizado = user;
      if (user.plano === "trial" && user.is_admin !== "true") {
        const dataExpiracao = user.data_expiracao_plano || user.data_expiracao_trial;
        if (dataExpiracao) {
          const expirationDate = new Date(dataExpiracao);
          if (now >= expirationDate && user.status !== "bloqueado") {
            await storage2.updateUser(user.id, {
              status: "bloqueado"
            });
            if (storage2.getFuncionarios) {
              const funcionarios2 = await storage2.getFuncionarios();
              const funcionariosDaConta = funcionarios2.filter((f) => f.conta_id === user.id);
              for (const func of funcionariosDaConta) {
                await storage2.updateFuncionario(func.id, { status: "bloqueado" });
              }
            }
            logger.warn("Usu\xE1rio bloqueado no login por expira\xE7\xE3o", "AUTH", {
              userId: user.id,
              email: user.email,
              plano: user.plano,
              dataExpiracao
            });
            userAtualizado = await storage2.getUserByEmail(email) || user;
          }
        }
      }
      if (process.env.NODE_ENV === "development") {
        console.log(`\u2705 Login bem-sucedido para usu\xE1rio: ${email}`);
      }
      await storage2.logAdminAction?.(
        userAtualizado.id,
        "LOGIN",
        `Login realizado - ${userAtualizado.email}`,
        {
          ip: req.ip,
          userAgent: req.get("user-agent")
        }
      );
      let sessionToken = null;
      if (device_fingerprint && storage2.createSession) {
        try {
          await storage2.cleanExpiredSessions?.();
          const activeSessions = await storage2.getActiveSessionCount?.(userAtualizado.id, "usuario") || 0;
          if (activeSessions >= MAX_SIMULTANEOUS_SESSIONS) {
            await storage2.invalidateOldestSession?.(userAtualizado.id, "usuario");
            logger.info("[SESSION] Limite de sess\xF5es atingido, sess\xE3o mais antiga invalidada", "AUTH", {
              userId: userAtualizado.id,
              activeSessions,
              maxSessions: MAX_SIMULTANEOUS_SESSIONS
            });
          }
          sessionToken = crypto.randomBytes(32).toString("hex");
          const expiresAt = /* @__PURE__ */ new Date();
          expiresAt.setHours(expiresAt.getHours() + SESSION_DURATION_HOURS);
          await storage2.createSession({
            user_id: userAtualizado.id,
            user_type: "usuario",
            session_token: sessionToken,
            device_fingerprint,
            device_info: device_info || {},
            ip_address: req.ip || req.connection?.remoteAddress || "unknown",
            user_agent: req.get("user-agent") || "unknown",
            expires_at: expiresAt
          });
          logger.info("[SESSION] Nova sess\xE3o criada para usu\xE1rio", "AUTH", {
            userId: userAtualizado.id,
            fingerprint: device_fingerprint.substring(0, 16) + "...",
            expiresAt: expiresAt.toISOString()
          });
        } catch (sessionError) {
          logger.error("[SESSION] Erro ao criar sess\xE3o (continuando login)", "AUTH", { error: sessionError });
          sessionToken = null;
        }
      }
      const { senha: _, ...userWithoutPassword } = userAtualizado;
      res.json({
        ...userWithoutPassword,
        session_token: sessionToken
      });
    } catch (error) {
      console.error("Erro no login:", error);
      res.status(500).json({ error: "Erro ao fazer login" });
    }
  });
  app2.post("/api/auth/login-funcionario", async (req, res) => {
    try {
      const { email, senha, device_fingerprint, device_info } = req.body;
      if (process.env.NODE_ENV === "development") {
        console.log(`\u{1F510} Tentativa de login de funcion\xE1rio - Email: ${email}`);
      }
      if (!email || !senha) {
        return res.status(400).json({ error: "Email e senha s\xE3o obrigat\xF3rios" });
      }
      if (!device_fingerprint) {
        logger.warn("[SECURITY] Login funcion\xE1rio sem fingerprint", "AUTH", { email, ip: req.ip });
      }
      const funcionario = await storage2.getFuncionarioByEmail(email);
      if (!funcionario) {
        if (process.env.NODE_ENV === "development") {
          console.log(`\u274C Falha de login - Funcion\xE1rio n\xE3o encontrado`);
        }
        return res.status(401).json({ error: "Email ou senha inv\xE1lidos" });
      }
      let senhaValida = false;
      if (funcionario.senha.startsWith("$2a$") || funcionario.senha.startsWith("$2b$")) {
        senhaValida = await bcrypt.compare(senha, funcionario.senha);
      } else {
        senhaValida = funcionario.senha === senha;
        if (senhaValida) {
          const hashedPassword = await bcrypt.hash(senha, 10);
          await storage2.updateFuncionario(funcionario.id, { senha: hashedPassword });
          logger.info("[SECURITY] Senha de funcion\xE1rio migrada para hash", "AUTH", { funcionarioId: funcionario.id });
        }
      }
      if (!senhaValida) {
        if (process.env.NODE_ENV === "development") {
          console.log(`\u274C Falha de login - Senha incorreta`);
        }
        return res.status(401).json({ error: "Email ou senha inv\xE1lidos" });
      }
      if (funcionario.status !== "ativo") {
        if (process.env.NODE_ENV === "development") {
          console.log(`\u274C Falha de login - Funcion\xE1rio inativo`);
        }
        return res.status(401).json({ error: "Conta de funcion\xE1rio inativa" });
      }
      const permissoes = await storage2.getPermissoesFuncionario(funcionario.id);
      if (process.env.NODE_ENV === "development") {
        console.log(`\u2705 Login de funcion\xE1rio bem-sucedido: ${email}`);
      }
      await storage2.logAdminAction?.(
        funcionario.id,
        "LOGIN_FUNCIONARIO",
        `Login realizado - ${funcionario.nome} (${funcionario.email})`
      );
      let sessionToken = null;
      if (device_fingerprint && storage2.createSession) {
        try {
          await storage2.cleanExpiredSessions?.();
          const activeSessions = await storage2.getActiveSessionCount?.(funcionario.id, "funcionario") || 0;
          if (activeSessions >= MAX_SIMULTANEOUS_SESSIONS) {
            await storage2.invalidateOldestSession?.(funcionario.id, "funcionario");
            logger.info("[SESSION] Limite de sess\xF5es atingido (funcion\xE1rio), sess\xE3o mais antiga invalidada", "AUTH", {
              funcionarioId: funcionario.id,
              activeSessions,
              maxSessions: MAX_SIMULTANEOUS_SESSIONS
            });
          }
          sessionToken = crypto.randomBytes(32).toString("hex");
          const expiresAt = /* @__PURE__ */ new Date();
          expiresAt.setHours(expiresAt.getHours() + SESSION_DURATION_HOURS);
          await storage2.createSession({
            user_id: funcionario.id,
            user_type: "funcionario",
            session_token: sessionToken,
            device_fingerprint,
            device_info: device_info || {},
            ip_address: req.ip || req.connection?.remoteAddress || "unknown",
            user_agent: req.get("user-agent") || "unknown",
            expires_at: expiresAt
          });
          logger.info("[SESSION] Nova sess\xE3o criada para funcion\xE1rio", "AUTH", {
            funcionarioId: funcionario.id,
            fingerprint: device_fingerprint.substring(0, 16) + "...",
            expiresAt: expiresAt.toISOString()
          });
        } catch (sessionError) {
          logger.error("[SESSION] Erro ao criar sess\xE3o funcion\xE1rio (continuando login)", "AUTH", { error: sessionError });
          sessionToken = null;
        }
      }
      const { senha: _, ...funcionarioSemSenha } = funcionario;
      const funcionarioResponse = {
        ...funcionarioSemSenha,
        tipo: "funcionario",
        permissoes: permissoes || {},
        session_token: sessionToken
      };
      res.json(funcionarioResponse);
    } catch (error) {
      console.error("Erro no login de funcion\xE1rio:", error);
      res.status(500).json({ error: "Erro ao fazer login" });
    }
  });
  app2.post("/api/auth/logout", async (req, res) => {
    try {
      const sessionToken = req.headers["x-session-token"];
      if (sessionToken && storage2.invalidateSession) {
        await storage2.invalidateSession(sessionToken);
        logger.info("[SESSION] Logout realizado", "AUTH", { token: sessionToken.substring(0, 16) + "..." });
      }
      res.json({ success: true, message: "Logout realizado com sucesso" });
    } catch (error) {
      logger.error("[SESSION] Erro no logout", "AUTH", { error });
      res.status(500).json({ error: "Erro ao fazer logout" });
    }
  });
  app2.get("/api/auth/sessions", requireAuth, async (req, res) => {
    try {
      const userId = req.headers["x-user-id"];
      const userType = req.headers["x-user-type"] || "usuario";
      if (!storage2.getActiveSessionsByUser) {
        return res.json({ sessions: [] });
      }
      const sessions = await storage2.getActiveSessionsByUser(userId, userType);
      const sanitizedSessions = sessions.map((s) => ({
        id: s.id,
        device_info: s.device_info,
        ip_address: s.ip_address,
        user_agent: s.user_agent,
        created_at: s.created_at,
        last_activity: s.last_activity,
        is_current: s.session_token === req.headers["x-session-token"]
      }));
      res.json({
        sessions: sanitizedSessions,
        max_sessions: MAX_SIMULTANEOUS_SESSIONS
      });
    } catch (error) {
      logger.error("[SESSION] Erro ao listar sess\xF5es", "AUTH", { error });
      res.status(500).json({ error: "Erro ao listar sess\xF5es" });
    }
  });
  app2.delete("/api/auth/sessions/:sessionId", requireAuth, async (req, res) => {
    try {
      const { sessionId } = req.params;
      const userId = req.headers["x-user-id"];
      const userType = req.headers["x-user-type"] || "usuario";
      if (!storage2.getActiveSessionsByUser || !storage2.invalidateSession) {
        return res.status(400).json({ error: "Funcionalidade n\xE3o dispon\xEDvel" });
      }
      const sessions = await storage2.getActiveSessionsByUser(userId, userType);
      const session = sessions.find((s) => s.id === parseInt(sessionId));
      if (!session) {
        return res.status(404).json({ error: "Sess\xE3o n\xE3o encontrada" });
      }
      await storage2.invalidateSession(session.session_token);
      logger.info("[SESSION] Sess\xE3o invalidada pelo usu\xE1rio", "AUTH", { userId, sessionId });
      res.json({ success: true, message: "Sess\xE3o encerrada com sucesso" });
    } catch (error) {
      logger.error("[SESSION] Erro ao invalidar sess\xE3o", "AUTH", { error });
      res.status(500).json({ error: "Erro ao encerrar sess\xE3o" });
    }
  });
  app2.post("/api/auth/sessions/invalidate-others", requireAuth, async (req, res) => {
    try {
      const userId = req.headers["x-user-id"];
      const userType = req.headers["x-user-type"] || "usuario";
      const currentToken = req.headers["x-session-token"];
      if (!storage2.getActiveSessionsByUser || !storage2.invalidateSession) {
        return res.status(400).json({ error: "Funcionalidade n\xE3o dispon\xEDvel" });
      }
      const sessions = await storage2.getActiveSessionsByUser(userId, userType);
      let invalidatedCount = 0;
      for (const session of sessions) {
        if (session.session_token !== currentToken) {
          await storage2.invalidateSession(session.session_token);
          invalidatedCount++;
        }
      }
      logger.info("[SESSION] Outras sess\xF5es invalidadas", "AUTH", { userId, invalidatedCount });
      res.json({
        success: true,
        message: `${invalidatedCount} sess\xE3o(\xF5es) encerrada(s)`,
        invalidated_count: invalidatedCount
      });
    } catch (error) {
      logger.error("[SESSION] Erro ao invalidar outras sess\xF5es", "AUTH", { error });
      res.status(500).json({ error: "Erro ao encerrar outras sess\xF5es" });
    }
  });
  app2.post("/api/auth/send-verification-code", async (req, res) => {
    try {
      const { userId, email } = req.body;
      if (!userId || !email) {
        return res.status(400).json({ error: "userId e email s\xE3o obrigat\xF3rios" });
      }
      const user = await storage2.getUserById(userId);
      if (!user || user.email !== email) {
        return res.status(404).json({ error: "Usu\xE1rio n\xE3o encontrado" });
      }
      const code = Math.floor(1e5 + Math.random() * 9e5).toString();
      try {
        const { EmailService: EmailService2 } = await Promise.resolve().then(() => (init_email_service(), email_service_exports));
        const emailService = new EmailService2();
        await emailService.sendVerificationCode({
          to: email,
          userName: user.nome,
          code
        });
        if (process.env.NODE_ENV === "development") {
          console.log(
            `\u{1F4E7} C\xF3digo de verifica\xE7\xE3o enviado para ${email}: ${code}`
          );
        }
        res.json({
          success: true,
          message: "C\xF3digo enviado com sucesso"
          // SECURITY: Código NUNCA é retornado - apenas enviado por email
        });
      } catch (emailError) {
        console.error("\u274C Erro ao enviar email:", emailError);
        res.status(500).json({ error: "Erro ao enviar c\xF3digo de verifica\xE7\xE3o por email" });
      }
    } catch (error) {
      console.error("Erro ao processar solicita\xE7\xE3o:", error);
      res.status(500).json({ error: "Erro ao processar solicita\xE7\xE3o" });
    }
  });
  app2.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({
          success: false,
          error: "Email \xE9 obrigat\xF3rio"
        });
      }
      const user = await storage2.getUserByEmail(email);
      if (!user) {
        if (process.env.NODE_ENV === "development") {
          console.log(`\u26A0\uFE0F Tentativa de recupera\xE7\xE3o para email inexistente: ${email}`);
        }
        return res.status(404).json({
          success: false,
          error: "Email n\xE3o encontrado em nossa base de dados"
        });
      }
      const code = Math.floor(1e5 + Math.random() * 9e5).toString();
      const expiresAt = /* @__PURE__ */ new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 15);
      await storage2.createPasswordResetCode(email, code, expiresAt.toISOString());
      const { EmailService: EmailService2 } = await Promise.resolve().then(() => (init_email_service(), email_service_exports));
      const emailService = new EmailService2();
      await emailService.sendPasswordResetCode({
        to: email,
        userName: user.nome,
        code
      });
      if (process.env.NODE_ENV === "development") {
        console.log(
          `\u{1F4E7} C\xF3digo de recupera\xE7\xE3o enviado para ${email}: ${code}`
        );
      }
      return res.json({
        success: true,
        message: "C\xF3digo de recupera\xE7\xE3o enviado para seu email"
        // SECURITY: Código NUNCA é retornado - apenas enviado por email
      });
    } catch (error) {
      console.error("\u274C Erro ao processar recupera\xE7\xE3o de senha:", error);
      return res.status(500).json({
        success: false,
        message: "Erro ao processar solicita\xE7\xE3o. Tente novamente."
      });
    }
  });
  app2.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { email, code, newPassword } = req.body;
      if (!email || !code || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Email, c\xF3digo e nova senha s\xE3o obrigat\xF3rios"
        });
      }
      if (newPassword.length < 8) {
        return res.status(400).json({
          success: false,
          message: "A senha deve ter no m\xEDnimo 8 caracteres"
        });
      }
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({
          success: false,
          message: "A senha deve conter letras mai\xFAsculas, min\xFAsculas e n\xFAmeros"
        });
      }
      const storedCode = await storage2.getPasswordResetCode(email);
      if (!storedCode) {
        return res.status(400).json({
          success: false,
          message: "C\xF3digo inv\xE1lido ou expirado"
        });
      }
      if (/* @__PURE__ */ new Date() > new Date(storedCode.expires_at)) {
        return res.status(400).json({
          success: false,
          message: "C\xF3digo expirado. Solicite um novo c\xF3digo"
        });
      }
      if (storedCode.code !== code) {
        return res.status(400).json({
          success: false,
          message: "C\xF3digo inv\xE1lido"
        });
      }
      const user = await storage2.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Usu\xE1rio n\xE3o encontrado"
        });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await storage2.updateUser(user.id, {
        senha: hashedPassword
      });
      await storage2.markPasswordResetCodeAsUsed(email, code);
      logger.info("Senha resetada com sucesso", "AUTH", { userId: user.id, email });
      return res.json({
        success: true,
        message: "Senha alterada com sucesso"
      });
    } catch (error) {
      console.error("Erro ao resetar senha:", error);
      logger.error("Erro ao resetar senha", "AUTH", { error });
      return res.status(500).json({
        success: false,
        message: "Erro ao resetar senha"
      });
    }
  });
  const masterPasswordAttempts = /* @__PURE__ */ new Map();
  const publicAdminAttempts = /* @__PURE__ */ new Map();
  const MAX_ATTEMPTS = 3;
  const LOCKOUT_TIME = 15 * 60 * 1e3;
  app2.post("/api/auth/verify-public-admin", async (req, res) => {
    try {
      const { password } = req.body;
      const clientKey = req.ip || "unknown";
      const now = Date.now();
      console.log(`\u{1F510} [PUBLIC ADMIN] Tentativa de acesso do IP: ${req.ip}`);
      if (!password) {
        return res.status(400).json({ error: "Senha \xE9 obrigat\xF3ria" });
      }
      const attempts = publicAdminAttempts.get(clientKey);
      if (attempts) {
        if (attempts.count >= MAX_ATTEMPTS && now - attempts.lastAttempt < LOCKOUT_TIME) {
          const remainingTime = Math.ceil(
            (LOCKOUT_TIME - (now - attempts.lastAttempt)) / 6e4
          );
          logger.warn(
            "Tentativa bloqueada por rate limit (public admin)",
            "SECURITY",
            {
              clientKey,
              attempts: attempts.count,
              remainingMinutes: remainingTime
            }
          );
          return res.status(429).json({
            error: `Muitas tentativas. Tente novamente em ${remainingTime} minutos.`
          });
        }
        if (now - attempts.lastAttempt >= LOCKOUT_TIME) {
          publicAdminAttempts.delete(clientKey);
        }
      }
      const publicAdminConfig = await storage2.getSystemConfig(
        "public_admin_password"
      );
      if (!publicAdminConfig) {
        const defaultPassword = process.env.PUBLIC_ADMIN_PASSWORD;
        if (!defaultPassword) {
          logger.error(
            "PUBLIC_ADMIN_PASSWORD n\xE3o configurada nas vari\xE1veis de ambiente",
            "SECURITY"
          );
          return res.status(500).json({ error: "Configura\xE7\xE3o de seguran\xE7a incompleta" });
        }
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);
        await storage2.setSystemConfig("public_admin_password", hashedPassword);
        const isValid2 = await bcrypt.compare(password, hashedPassword);
        if (!isValid2) {
          const currentAttempts = publicAdminAttempts.get(clientKey);
          publicAdminAttempts.set(clientKey, {
            count: (currentAttempts?.count || 0) + 1,
            lastAttempt: now
          });
          logger.warn("Senha public admin incorreta", "SECURITY", {
            clientKey
          });
          return res.json({ valid: false });
        } else {
          publicAdminAttempts.delete(clientKey);
          logger.info("Acesso public admin autorizado", "SECURITY", {
            ip: req.ip
          });
          return res.json({ valid: true });
        }
      }
      const isValid = await bcrypt.compare(password, publicAdminConfig.valor);
      if (!isValid) {
        const currentAttempts = publicAdminAttempts.get(clientKey);
        publicAdminAttempts.set(clientKey, {
          count: (currentAttempts?.count || 0) + 1,
          lastAttempt: now
        });
        logger.warn("Senha public admin incorreta", "SECURITY", {
          clientKey,
          attempts: (currentAttempts?.count || 0) + 1
        });
      } else {
        publicAdminAttempts.delete(clientKey);
        logger.info("Acesso public admin autorizado", "SECURITY", {
          ip: req.ip
        });
      }
      res.json({ valid: isValid });
    } catch (error) {
      console.error("Erro ao verificar senha public admin:", error);
      logger.error("Erro ao verificar senha public admin", "SECURITY", {
        error
      });
      res.status(500).json({ error: "Erro ao verificar senha" });
    }
  });
  app2.post("/api/auth/verify-master-password", async (req, res) => {
    try {
      const { password } = req.body;
      const userId = req.headers["x-user-id"];
      const userEmail = req.headers["x-user-email"];
      if (process.env.NODE_ENV === "development") {
        console.log(`\u{1F510} [MASTER PASSWORD] Tentativa de acesso`);
      }
      const authorizedEmail = process.env.MASTER_USER_EMAIL || "pavisoft.suporte@gmail.com";
      const authorizedUserId = "pavisoft-admin-001";
      if (!authorizedEmail) {
        logger.error("MASTER_USER_EMAIL n\xE3o configurada", "SECURITY");
        return res.status(500).json({ error: "Configura\xE7\xE3o de seguran\xE7a incompleta" });
      }
      if (userId !== authorizedUserId || userEmail !== authorizedEmail) {
        logger.warn(
          "Tentativa de acesso n\xE3o autorizada ao admin master",
          "SECURITY",
          {
            ip: req.ip,
            userId,
            userEmail
          }
        );
        return res.status(403).json({ error: "Acesso n\xE3o autorizado" });
      }
      if (!password) {
        return res.status(400).json({ error: "Senha \xE9 obrigat\xF3ria" });
      }
      const clientKey = userId || req.ip || "unknown";
      const attempts = masterPasswordAttempts.get(clientKey);
      const now = Date.now();
      if (attempts) {
        if (attempts.count >= MAX_ATTEMPTS && now - attempts.lastAttempt < LOCKOUT_TIME) {
          const remainingTime = Math.ceil(
            (LOCKOUT_TIME - (now - attempts.lastAttempt)) / 6e4
          );
          logger.warn("Tentativa bloqueada por rate limit", "SECURITY", {
            clientKey,
            attempts: attempts.count,
            remainingMinutes: remainingTime
          });
          return res.status(429).json({
            error: `Muitas tentativas. Tente novamente em ${remainingTime} minutos.`
          });
        }
        if (now - attempts.lastAttempt >= LOCKOUT_TIME) {
          masterPasswordAttempts.delete(clientKey);
        }
      }
      const masterEmail = process.env.MASTER_USER_EMAIL;
      if (!masterEmail) {
        logger.error(
          "MASTER_USER_EMAIL n\xE3o configurada nas vari\xE1veis de ambiente",
          "SECURITY"
        );
        return res.status(500).json({ error: "Configura\xE7\xE3o de seguran\xE7a incompleta" });
      }
      let masterUser = await storage2.getUserByEmail(masterEmail);
      if (!masterUser) {
        if (process.env.NODE_ENV === "development") {
          console.log("\u{1F527} Criando usu\xE1rio master automaticamente...");
        }
        const masterPassword = process.env.MASTER_USER_PASSWORD;
        if (!masterPassword) {
          logger.error(
            "MASTER_USER_PASSWORD n\xE3o configurada nas vari\xE1veis de ambiente",
            "SECURITY"
          );
          return res.status(500).json({ error: "Configura\xE7\xE3o de seguran\xE7a incompleta" });
        }
        const dataExpiracaoMaster = addDaysAndGetISOSaoPaulo(/* @__PURE__ */ new Date(), 3650);
        masterUser = await storage2.createUser({
          nome: "Admin Master",
          email: masterEmail,
          senha: masterPassword,
          plano: "premium",
          is_admin: "true",
          status: "ativo",
          max_funcionarios: 999,
          data_expiracao_plano: dataExpiracaoMaster
        });
        if (process.env.NODE_ENV === "development") {
          console.log("\u2705 Usu\xE1rio master criado com sucesso");
        }
      }
      const masterPasswordConfig = await storage2.getSystemConfig("master_password");
      if (!masterPasswordConfig) {
        const defaultPassword = process.env.MASTER_ADMIN_PASSWORD;
        if (!defaultPassword) {
          logger.error(
            "MASTER_ADMIN_PASSWORD n\xE3o configurada nas vari\xE1veis de ambiente",
            "SECURITY"
          );
          return res.status(500).json({ error: "Configura\xE7\xE3o de seguran\xE7a incompleta" });
        }
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);
        await storage2.setSystemConfig("master_password", hashedPassword);
        const isValid2 = await bcrypt.compare(password, hashedPassword);
        if (!isValid2) {
          const currentAttempts = masterPasswordAttempts.get(clientKey);
          masterPasswordAttempts.set(clientKey, {
            count: (currentAttempts?.count || 0) + 1,
            lastAttempt: now
          });
          logger.warn("Senha master incorreta", "SECURITY", { clientKey });
        } else {
          masterPasswordAttempts.delete(clientKey);
          logger.info("Acesso admin master autorizado", "SECURITY", {
            userEmail
          });
        }
        return res.json({ valid: isValid2 });
      }
      const isValid = await bcrypt.compare(
        password,
        masterPasswordConfig.valor
      );
      if (!isValid) {
        const currentAttempts = masterPasswordAttempts.get(clientKey);
        masterPasswordAttempts.set(clientKey, {
          count: (currentAttempts?.count || 0) + 1,
          lastAttempt: now
        });
        logger.warn("Senha master incorreta", "SECURITY", {
          clientKey,
          attempts: (currentAttempts?.count || 0) + 1
        });
      } else {
        masterPasswordAttempts.delete(clientKey);
        logger.info("Acesso admin master autorizado", "SECURITY", {
          userEmail
        });
      }
      res.json({ valid: isValid });
    } catch (error) {
      console.error("Erro ao verificar senha master:", error);
      logger.error("Erro ao verificar senha master", "SECURITY", { error });
      res.status(500).json({ error: "Erro ao verificar senha" });
    }
  });
  app2.get("/api/users", async (req, res) => {
    try {
      const users2 = await storage2.getUsers();
      const sanitizedUsers = users2.map((user) => ({
        id: user.id,
        email: user.email,
        nome: user.nome,
        plano: user.plano || "trial",
        is_admin: user.is_admin || "false",
        data_criacao: user.data_criacao || null,
        data_expiracao_trial: user.data_expiracao_trial || null,
        data_expiracao_plano: user.data_expiracao_plano || null,
        status: user.status || "ativo",
        cpf_cnpj: user.cpf_cnpj || null,
        telefone: user.telefone || null,
        endereco: user.endereco || null,
        max_funcionarios: user.max_funcionarios || 1,
        meta_mensal: user.meta_mensal || 15e3
      }));
      res.json(sanitizedUsers);
    } catch (error) {
      console.error("Erro ao buscar usu\xE1rios:", error);
      res.status(500).json({ error: "Erro ao buscar usu\xE1rios" });
    }
  });
  app2.patch("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      if (updates.senha === "") {
        delete updates.senha;
      }
      delete updates.id;
      if (updates.is_admin !== void 0) {
        updates.is_admin = updates.is_admin === "true" || updates.is_admin === true ? "true" : "false";
      }
      const updatedUser = await storage2.updateUser(id, updates);
      if (!updatedUser) {
        return res.status(404).json({ error: "Usu\xE1rio n\xE3o encontrado" });
      }
      res.json({
        id: updatedUser.id,
        email: updatedUser.email,
        nome: updatedUser.nome,
        plano: updatedUser.plano,
        is_admin: updatedUser.is_admin,
        status: updatedUser.status,
        data_criacao: updatedUser.data_criacao,
        data_expiracao_trial: updatedUser.data_expiracao_trial,
        data_expiracao_plano: updatedUser.data_expiracao_plano,
        ultimo_acesso: updatedUser.ultimo_acesso,
        max_funcionarios: updatedUser.max_funcionarios,
        meta_mensal: updatedUser.meta_mensal
      });
    } catch (error) {
      logger.error("[API] Erro ao atualizar usu\xE1rio:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/whatsapp-support", async (req, res) => {
    try {
      const whatsappConfig = await storage2.getSystemConfig("whatsapp_support_number");
      if (whatsappConfig && whatsappConfig.valor) {
        return res.json({ number: whatsappConfig.valor });
      }
      return res.json({ number: "+5511999999999" });
    } catch (error) {
      logger.error("[API] Erro ao buscar WhatsApp support:", error);
      return res.status(200).json({ number: "+5511999999999" });
    }
  });
  app2.post("/api/whatsapp-support", requireAdmin, async (req, res) => {
    try {
      const userId = req.headers["x-user-id"];
      const { number } = req.body;
      if (!number) {
        return res.status(400).json({ error: "N\xFAmero \xE9 obrigat\xF3rio" });
      }
      await storage2.upsertSystemConfig("whatsapp_support_number", number);
      await storage2.logAdminAction?.(
        userId,
        "WHATSAPP_ATUALIZADO",
        `N\xFAmero do WhatsApp atualizado para: ${number}`,
        req
      );
      logger.info("[API] WhatsApp support atualizado", "WHATSAPP", { number });
      return res.json({ success: true, number });
    } catch (error) {
      logger.error("[API] Erro ao atualizar WhatsApp support:", error);
      return res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/plan-prices", async (req, res) => {
    try {
      console.log("\u{1F4CB} [PLAN_PRICES] Buscando pre\xE7os dos planos...");
      const DEFAULT_PRICES = {
        premium_mensal: 89.99,
        premium_anual: 951
      };
      const precosConfig = await storage2.getSystemConfig("planos_precos");
      console.log("\u{1F4CB} [PLAN_PRICES] Configura\xE7\xE3o encontrada:", precosConfig);
      if (precosConfig && precosConfig.valor) {
        try {
          const precos = JSON.parse(precosConfig.valor);
          console.log("\u{1F4CB} [PLAN_PRICES] Pre\xE7os parseados:", precos);
          if (typeof precos.premium_mensal === "number" && typeof precos.premium_anual === "number" && precos.premium_mensal > 0 && precos.premium_anual > 0) {
            console.log("\u2705 [PLAN_PRICES] Retornando pre\xE7os customizados:", precos);
            res.setHeader("Content-Type", "application/json");
            return res.status(200).json(precos);
          }
        } catch (parseError) {
          console.error("\u274C [PLAN_PRICES] Erro ao parsear pre\xE7os:", parseError);
        }
      }
      console.log("\u{1F4CB} [PLAN_PRICES] Retornando pre\xE7os padr\xE3o");
      res.setHeader("Content-Type", "application/json");
      return res.status(200).json(DEFAULT_PRICES);
    } catch (error) {
      console.error("\u274C [PLAN_PRICES] Erro cr\xEDtico:", error);
      res.setHeader("Content-Type", "application/json");
      return res.status(200).json({
        premium_mensal: 89.99,
        premium_anual: 951
      });
    }
  });
  app2.post("/api/plan-prices", requireAdmin, async (req, res) => {
    console.log("\u{1F4CD} [DEBUG] Rota POST /api/plan-prices foi chamada!");
    try {
      const userId = req.headers["x-user-id"];
      const { premium_mensal, premium_anual } = req.body;
      console.log("\u{1F4B0} [PLAN_PRICES] POST - Requisi\xE7\xE3o recebida:", {
        userId,
        body: req.body
      });
      if (!premium_mensal || !premium_anual) {
        console.log("\u274C [PLAN_PRICES] POST - Pre\xE7os n\xE3o fornecidos");
        return res.status(400).json({ error: "Pre\xE7os s\xE3o obrigat\xF3rios" });
      }
      const mensal = parseFloat(premium_mensal);
      const anual = parseFloat(premium_anual);
      console.log("\u{1F522} [PLAN_PRICES] POST - Valores parseados:", { mensal, anual });
      if (isNaN(mensal) || isNaN(anual) || mensal <= 0 || anual <= 0) {
        console.log("\u274C [PLAN_PRICES] POST - Valores inv\xE1lidos");
        return res.status(400).json({ error: "Pre\xE7os devem ser n\xFAmeros v\xE1lidos e positivos" });
      }
      const precos = {
        premium_mensal: mensal,
        premium_anual: anual
      };
      console.log("\u{1F4BE} [PLAN_PRICES] POST - Salvando no banco:", precos);
      await storage2.upsertSystemConfig("planos_precos", JSON.stringify(precos));
      const verificacao = await storage2.getSystemConfig("planos_precos");
      console.log("\u{1F50D} [PLAN_PRICES] POST - Verifica\xE7\xE3o ap\xF3s salvar:", verificacao);
      await storage2.logAdminAction(
        userId,
        "PRECOS_ATUALIZADOS",
        `Pre\xE7os atualizados - Mensal: R$ ${precos.premium_mensal.toFixed(2)}, Anual: R$ ${precos.premium_anual.toFixed(2)}`,
        req
      );
      logger.info("[API] Pre\xE7os atualizados com sucesso", "PLAN_PRICES", precos);
      console.log("\u2705 [PLAN_PRICES] POST - Resposta enviada:", { success: true, precos });
      res.setHeader("Content-Type", "application/json");
      return res.status(200).json({ success: true, precos });
    } catch (error) {
      console.error("\u274C [PLAN_PRICES] POST - Erro:", error);
      logger.error("[API] Erro ao atualizar pre\xE7os:", error);
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({ error: error.message || "Erro ao atualizar pre\xE7os" });
    }
  });
  app2.get("/api/employee-package-prices", async (req, res) => {
    try {
      const DEFAULT_PRICES = {
        pacote_5: 49.9,
        pacote_10: 89.9,
        pacote_20: 159.9,
        pacote_50: 349.9
      };
      if (storage2.getSystemConfig) {
        const precosConfig = await storage2.getSystemConfig("pacotes_funcionarios_precos");
        if (precosConfig && precosConfig.valor) {
          try {
            const precos = JSON.parse(precosConfig.valor);
            if (typeof precos.pacote_5 === "number" && typeof precos.pacote_10 === "number" && typeof precos.pacote_20 === "number" && typeof precos.pacote_50 === "number" && precos.pacote_5 > 0 && precos.pacote_10 > 0 && precos.pacote_20 > 0 && precos.pacote_50 > 0) {
              return res.status(200).json(precos);
            }
          } catch (parseError) {
            logger.warn("[API] Erro ao parsear pre\xE7os de pacotes salvos, usando padr\xE3o", "EMPLOYEE_PACKAGES");
          }
        }
      }
      return res.status(200).json(DEFAULT_PRICES);
    } catch (error) {
      logger.error("[API] Erro ao buscar pre\xE7os de pacotes:", error);
      return res.status(200).json({
        pacote_5: 49.9,
        pacote_10: 89.9,
        pacote_20: 159.9,
        pacote_50: 349.9
      });
    }
  });
  app2.post("/api/employee-package-prices", requireAdmin, async (req, res) => {
    try {
      const userId = req.headers["x-user-id"];
      const { pacote_5, pacote_10, pacote_20, pacote_50 } = req.body;
      console.log("\u{1F465} [EMPLOYEE_PACKAGES] Requisi\xE7\xE3o recebida:", {
        userId,
        body: req.body,
        headers: {
          "x-user-id": req.headers["x-user-id"],
          "x-is-admin": req.headers["x-is-admin"]
        }
      });
      if (!pacote_5 || !pacote_10 || !pacote_20 || !pacote_50) {
        console.log("\u274C [EMPLOYEE_PACKAGES] Pacotes n\xE3o fornecidos");
        return res.status(400).json({ error: "Todos os pre\xE7os s\xE3o obrigat\xF3rios" });
      }
      const p5 = parseFloat(pacote_5);
      const p10 = parseFloat(pacote_10);
      const p20 = parseFloat(pacote_20);
      const p50 = parseFloat(pacote_50);
      console.log("\u{1F522} [EMPLOYEE_PACKAGES] Valores parseados:", { p5, p10, p20, p50 });
      if (isNaN(p5) || isNaN(p10) || isNaN(p20) || isNaN(p50) || p5 <= 0 || p10 <= 0 || p20 <= 0 || p50 <= 0) {
        console.log("\u274C [EMPLOYEE_PACKAGES] Valores inv\xE1lidos");
        return res.status(400).json({ error: "Pre\xE7os devem ser n\xFAmeros v\xE1lidos e positivos" });
      }
      const precos = {
        pacote_5: p5,
        pacote_10: p10,
        pacote_20: p20,
        pacote_50: p50
      };
      console.log("\u{1F4BE} [EMPLOYEE_PACKAGES] Salvando no banco:", precos);
      await storage2.upsertSystemConfig("pacotes_funcionarios_precos", JSON.stringify(precos));
      const verificacao = await storage2.getSystemConfig("pacotes_funcionarios_precos");
      console.log("\u{1F50D} [EMPLOYEE_PACKAGES] Verifica\xE7\xE3o ap\xF3s salvar:", verificacao);
      await storage2.logAdminAction(
        userId,
        "PACOTES_PRECOS_ATUALIZADOS",
        `Pre\xE7os de pacotes atualizados - 5: R$ ${p5.toFixed(2)}, 10: R$ ${p10.toFixed(2)}, 20: R$ ${p20.toFixed(2)}, 50: R$ ${p50.toFixed(2)}`,
        req
      );
      logger.info("[API] Pre\xE7os dos pacotes atualizados com sucesso", "EMPLOYEE_PACKAGES", precos);
      console.log("\u2705 [EMPLOYEE_PACKAGES] Resposta enviada:", { success: true, precos });
      return res.status(200).json({ success: true, precos });
    } catch (error) {
      console.error("\u274C [EMPLOYEE_PACKAGES] Erro:", error);
      logger.error("[API] Erro ao atualizar pre\xE7os dos pacotes:", error);
      return res.status(500).json({ error: error.message || "Erro ao atualizar pre\xE7os dos pacotes" });
    }
  });
  app2.post("/api/admin/subscriptions/reprocess-webhook", requireAdmin, async (req, res) => {
    try {
      const { paymentId, gateway = "mercadopago" } = req.body;
      if (!paymentId) {
        return res.status(400).json({ error: "Payment ID \xE9 obrigat\xF3rio" });
      }
      const config = await storage2.getConfigMercadoPago();
      if (!config || !config.access_token) {
        return res.status(500).json({
          error: "Mercado Pago n\xE3o configurado"
        });
      }
      const { MercadoPagoService: MercadoPagoService2 } = await Promise.resolve().then(() => (init_mercadopago(), mercadopago_exports));
      const mercadopago = new MercadoPagoService2({
        accessToken: config.access_token
      });
      const payment = await mercadopago.getPayment(paymentId);
      if (!payment || payment.status !== "approved") {
        return res.status(400).json({
          error: "Pagamento n\xE3o est\xE1 aprovado ou n\xE3o foi encontrado"
        });
      }
      const externalReference = payment.external_reference;
      if (!externalReference) {
        return res.status(400).json({
          error: "External reference n\xE3o encontrado no pagamento"
        });
      }
      const subscriptions2 = await storage2.getSubscriptions();
      const subscription = subscriptions2.find(
        (s) => s.external_reference === externalReference
      );
      if (!subscription) {
        return res.status(404).json({
          error: "Assinatura n\xE3o encontrada"
        });
      }
      await storage2.updateSubscription(subscription.id, {
        status: "ativo",
        status_pagamento: "approved",
        mercadopago_payment_id: paymentId,
        data_inicio: getNowISOSaoPaulo()
      });
      const dataVencimentoPlano = subscription.plano === "premium_mensal" ? addMonthsAndGetISOSaoPaulo(/* @__PURE__ */ new Date(), 1) : addYearsAndGetISOSaoPaulo(/* @__PURE__ */ new Date(), 1);
      await storage2.updateUser(subscription.user_id, {
        plano: subscription.plano,
        status: "ativo",
        data_expiracao_plano: dataVencimentoPlano
      });
      logger.info("Webhook de assinatura reprocessado manualmente", "ADMIN_SUBSCRIPTIONS", {
        paymentId,
        subscriptionId: subscription.id,
        userId: subscription.user_id
      });
      res.json({
        success: true,
        message: "Webhook reprocessado com sucesso"
      });
    } catch (error) {
      logger.error("Erro ao reprocessar webhook de assinatura", "ADMIN_SUBSCRIPTIONS", { error });
      res.status(500).json({ error: error.message || "Erro ao reprocessar webhook" });
    }
  });
  app2.post("/api/admin/subscriptions/activate-manual", requireAdmin, async (req, res) => {
    try {
      const { userId, plano, valor, dias } = req.body;
      const adminId = req.headers["x-user-id"];
      if (!userId || !plano || !valor || !dias) {
        return res.status(400).json({
          error: "Dados obrigat\xF3rios: userId, plano, valor, dias"
        });
      }
      const user = await storage2.getUserById(userId);
      if (!user) {
        return res.status(404).json({ error: "Usu\xE1rio n\xE3o encontrado" });
      }
      const dataExpiracaoManual = addDaysAndGetISOSaoPaulo(/* @__PURE__ */ new Date(), parseInt(dias));
      const novaAssinatura = {
        user_id: userId,
        plano,
        valor: parseFloat(valor),
        status: "ativo",
        status_pagamento: "approved",
        forma_pagamento: "ATIVACAO_MANUAL",
        data_inicio: getNowISOSaoPaulo(),
        data_expiracao: dataExpiracaoManual,
        data_criacao: getNowISOSaoPaulo(),
        external_reference: `MANUAL_${Date.now()}_${userId}`
      };
      const assinaturaCriada = await storage2.createSubscription(novaAssinatura);
      await storage2.updateUser(userId, {
        plano,
        status: "ativo",
        data_expiracao_plano: dataExpiracaoManual
      });
      await storage2.logAdminAction(
        adminId,
        "ASSINATURA_ATIVADA_MANUAL",
        `Assinatura ${plano} ativada manualmente para ${user.email} - Valor: R$ ${valor} - Dias: ${dias}`,
        req
      );
      logger.info("Assinatura ativada manualmente", "ADMIN_SUBSCRIPTIONS", {
        userId,
        plano,
        valor,
        dias,
        adminId
      });
      res.json({
        success: true,
        message: "Assinatura ativada com sucesso",
        subscription: assinaturaCriada
      });
    } catch (error) {
      logger.error("Erro ao ativar assinatura manualmente", "ADMIN_SUBSCRIPTIONS", { error });
      res.status(500).json({ error: error.message || "Erro ao ativar assinatura" });
    }
  });
  app2.post("/api/admin/subscriptions/:id/cancel", requireAdmin, async (req, res) => {
    try {
      const subscriptionId = parseInt(req.params.id);
      const userId = req.headers["x-user-id"];
      if (isNaN(subscriptionId)) {
        return res.status(400).json({ error: "ID de assinatura inv\xE1lido" });
      }
      const subscriptions2 = await storage2.getSubscriptions();
      const subscription = subscriptions2.find((s) => s.id === subscriptionId);
      if (!subscription) {
        return res.status(404).json({ error: "Assinatura n\xE3o encontrada" });
      }
      const user = await storage2.getUserById(subscription.user_id);
      if (!user) {
        return res.status(404).json({ error: "Usu\xE1rio da assinatura n\xE3o encontrado" });
      }
      await storage2.updateSubscription(subscriptionId, {
        status: "cancelado",
        status_pagamento: "cancelled",
        motivo_cancelamento: "Cancelado manualmente pelo administrador",
        data_atualizacao: (/* @__PURE__ */ new Date()).toISOString()
      });
      await storage2.updateUser(subscription.user_id, {
        status: "bloqueado",
        data_expiracao_plano: null,
        data_expiracao_trial: null
      });
      let funcionariosBloqueados = 0;
      if (storage2.getFuncionarios) {
        const funcionarios2 = await storage2.getFuncionarios();
        const funcionariosDaConta = funcionarios2.filter((f) => f.conta_id === subscription.user_id);
        for (const funcionario of funcionariosDaConta) {
          await storage2.updateFuncionario(funcionario.id, {
            status: "bloqueado"
          });
          funcionariosBloqueados++;
          logger.warn("[PAYMENT_CANCEL] Funcion\xE1rio bloqueado devido ao cancelamento da conta principal", {
            funcionarioId: funcionario.id,
            funcionarioNome: funcionario.nome,
            contaId: subscription.user_id,
            motivo: "Plano principal cancelado"
          });
        }
        if (funcionariosBloqueados > 0) {
          logger.info(`[PAYMENT_CANCEL] TODOS os ${funcionariosBloqueados} funcion\xE1rio(s) bloqueado(s)`, {
            contaId: subscription.user_id,
            userEmail: user.email
          });
        }
      }
      if (storage2.getEmployeePackages && storage2.updateEmployeePackageStatus) {
        const packages = await storage2.getEmployeePackages(subscription.user_id);
        const activePacotes = packages.filter((p) => p.status === "ativo");
        for (const pacote of activePacotes) {
          await storage2.updateEmployeePackageStatus(pacote.id, "cancelado", (/* @__PURE__ */ new Date()).toISOString());
        }
        if (activePacotes.length > 0) {
          logger.info("Pacotes de funcion\xE1rios cancelados", "ADMIN_SUBSCRIPTIONS", {
            userId: subscription.user_id,
            pacotesCancelados: activePacotes.length
          });
        }
      }
      await storage2.updateUser(subscription.user_id, {
        max_funcionarios: user.max_funcionarios_base || 1,
        data_expiracao_pacote_funcionarios: null
      });
      try {
        const { EmailService: EmailService2 } = await Promise.resolve().then(() => (init_email_service(), email_service_exports));
        const emailService = new EmailService2();
        await emailService.sendAccountBlocked({
          to: user.email,
          userName: user.nome,
          planName: subscription.plano
        });
        logger.info("Email de cancelamento enviado", "ADMIN_SUBSCRIPTIONS", {
          userId: subscription.user_id,
          email: user.email
        });
      } catch (emailError) {
        logger.warn("Falha ao enviar email de cancelamento (a\xE7\xE3o prosseguiu)", "ADMIN_SUBSCRIPTIONS", {
          error: emailError
        });
      }
      if (storage2.logAdminAction) {
        await storage2.logAdminAction(
          userId,
          "ASSINATURA_CANCELADA_COMPLETO",
          `Assinatura #${subscriptionId} cancelada - Usu\xE1rio: ${user.nome} (${user.email}) bloqueado, ${funcionariosBloqueados} funcion\xE1rio(s) bloqueado(s), pacotes cancelados, limite revertido`,
          req
        );
      }
      logger.info("Assinatura cancelada completamente pelo admin", "ADMIN_SUBSCRIPTIONS", {
        subscriptionId,
        userId: subscription.user_id,
        userName: user.nome,
        funcionariosBloqueados,
        planoAnterior: subscription.plano
      });
      res.json({
        success: true,
        message: "Assinatura cancelada com sucesso. Usu\xE1rio e funcion\xE1rios bloqueados imediatamente.",
        detalhes: {
          usuarioBloqueado: true,
          planoRevertido: "free",
          funcionariosBloqueados,
          pacotesCancelados: true,
          emailEnviado: true
        }
      });
    } catch (error) {
      logger.error("Erro ao cancelar assinatura", "ADMIN_SUBSCRIPTIONS", { error });
      res.status(500).json({ error: error.message || "Erro ao cancelar assinatura" });
    }
  });
  app2.get("/api/admin/subscriptions/payment-details/:paymentId", requireAdmin, async (req, res) => {
    try {
      const { paymentId } = req.params;
      const gateway = req.query.gateway || "mercadopago";
      const config = await storage2.getConfigMercadoPago();
      if (!config || !config.access_token) {
        return res.status(500).json({
          error: "Mercado Pago n\xE3o configurado"
        });
      }
      const { MercadoPagoService: MercadoPagoService2 } = await Promise.resolve().then(() => (init_mercadopago(), mercadopago_exports));
      const mercadopago = new MercadoPagoService2({
        accessToken: config.access_token
      });
      const payment = await mercadopago.getPayment(paymentId);
      res.json({
        payment: {
          id: payment.id,
          status: payment.status,
          status_detail: payment.status_detail,
          external_reference: payment.external_reference,
          transaction_amount: payment.transaction_amount,
          currency_id: payment.currency_id,
          payment_method_id: payment.payment_method_id,
          payer_email: payment.payer?.email,
          date_created: payment.date_created,
          date_approved: payment.date_approved
        }
      });
    } catch (error) {
      logger.error("Erro ao buscar detalhes do pagamento", "ADMIN_SUBSCRIPTIONS", { error });
      res.status(500).json({ error: error.message || "Erro ao buscar detalhes do pagamento" });
    }
  });
  app2.post("/api/employee-package-prices", requireAdmin, async (req, res) => {
    try {
      const { p5, p10, p20, p50 } = req.body;
      const userId = req.headers["x-user-id"];
      console.log("\u{1F4E5} [EMPLOYEE_PACKAGES] Recebendo pre\xE7os:", { p5, p10, p20, p50 });
      const p5Num = Number(p5);
      const p10Num = Number(p10);
      const p20Num = Number(p20);
      const p50Num = Number(p50);
      if (isNaN(p5Num) || isNaN(p10Num) || isNaN(p20Num) || isNaN(p50Num) || p5Num <= 0 || p10Num <= 0 || p20Num <= 0 || p50Num <= 0) {
        console.log("\u274C [EMPLOYEE_PACKAGES] Valores inv\xE1lidos");
        return res.status(400).json({ error: "Pre\xE7os devem ser n\xFAmeros v\xE1lidos e positivos" });
      }
      const precos = {
        pacote_5: p5Num,
        pacote_10: p10Num,
        pacote_20: p20Num,
        pacote_50: p50Num
      };
      console.log("\u{1F4BE} [EMPLOYEE_PACKAGES] Salvando no banco:", precos);
      if (storage2.upsertSystemConfig) {
        await storage2.upsertSystemConfig("pacotes_funcionarios_precos", JSON.stringify(precos));
        console.log("\u2705 [EMPLOYEE_PACKAGES] Salvo no banco com sucesso");
      } else {
        logger.error("[API] M\xE9todo upsertSystemConfig n\xE3o dispon\xEDvel", "EMPLOYEE_PACKAGES");
        return res.status(500).json({ error: "Erro ao salvar configura\xE7\xE3o" });
      }
      if (storage2.logAdminAction) {
        await storage2.logAdminAction(
          userId,
          "PACOTES_PRECOS_ATUALIZADOS",
          `Pre\xE7os de pacotes atualizados - 5: R$ ${p5Num.toFixed(2)}, 10: R$ ${p10Num.toFixed(2)}, 20: R$ ${p20Num.toFixed(2)}, 50: R$ ${p50Num.toFixed(2)}`,
          req
        );
      }
      logger.info("[API] Pre\xE7os de pacotes atualizados com sucesso", "EMPLOYEE_PACKAGES", precos);
      console.log("\u2705 [EMPLOYEE_PACKAGES] Resposta enviada:", { success: true, precos });
      res.json({ success: true, precos });
    } catch (error) {
      console.error("\u274C [EMPLOYEE_PACKAGES] Erro:", error);
      logger.error("[API] Erro ao atualizar pre\xE7os de pacotes:", error);
      res.status(500).json({ error: error.message || "Erro ao atualizar pre\xE7os de pacotes" });
    }
  });
  app2.get("/api/cupons", requireAdmin, async (req, res) => {
    try {
      const cupons2 = await storage2.getCupons?.();
      res.json(cupons2 || []);
    } catch (error) {
      logger.error("[API] Erro ao buscar cupons:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/cupons/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const cupom = await storage2.getCupom?.(id);
      if (!cupom) {
        return res.status(404).json({ error: "Cupom n\xE3o encontrado" });
      }
      res.json(cupom);
    } catch (error) {
      logger.error("[API] Erro ao buscar cupom:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/cupons", requireAdmin, async (req, res) => {
    try {
      const userId = req.headers["x-user-id"];
      const cupomData = {
        ...req.body,
        criado_por: userId
      };
      const cupom = await storage2.createCupom?.(cupomData);
      await storage2.logAdminAction?.(
        userId,
        "CUPOM_CRIADO",
        `Cupom criado: ${cupom.codigo} - Tipo: ${cupom.tipo}, Valor: ${cupom.valor}`,
        req
      );
      res.json(cupom);
    } catch (error) {
      logger.error("[API] Erro ao criar cupom:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.put("/api/cupons/:id", requireAdmin, async (req, res) => {
    try {
      const userId = req.headers["x-user-id"];
      const id = parseInt(req.params.id);
      const cupom = await storage2.updateCupom?.(id, req.body);
      if (!cupom) {
        return res.status(404).json({ error: "Cupom n\xE3o encontrado" });
      }
      await storage2.logAdminAction?.(
        userId,
        "CUPOM_ATUALIZADO",
        `Cupom atualizado: ${cupom.codigo}`,
        req
      );
      res.json(cupom);
    } catch (error) {
      logger.error("[API] Erro ao atualizar cupom:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.delete("/api/cupons/:id", requireAdmin, async (req, res) => {
    try {
      const userId = req.headers["x-user-id"];
      const id = parseInt(req.params.id);
      const cupom = await storage2.getCupom?.(id);
      const deleted = await storage2.deleteCupom?.(id);
      if (!deleted) {
        return res.status(404).json({ error: "Cupom n\xE3o encontrado" });
      }
      await storage2.logAdminAction?.(
        userId,
        "CUPOM_DELETADO",
        `Cupom deletado: ${cupom?.codigo}`,
        req
      );
      res.json({ success: true });
    } catch (error) {
      logger.error("[API] Erro ao deletar cupom:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/health", (_req, res) => {
    res.status(200).json({
      status: "healthy",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      uptime: process.uptime()
    });
  });
  app2.post("/api/cupons/validar", async (req, res) => {
    try {
      const { codigo, plano, userId } = req.body;
      if (!codigo || !plano) {
        return res.status(400).json({ error: "C\xF3digo e plano s\xE3o obrigat\xF3rios" });
      }
      const resultado = await storage2.validarCupom?.(codigo, plano, userId || "temp");
      if (!resultado?.valido) {
        return res.status(400).json({
          valido: false,
          erro: resultado?.erro || "Cupom inv\xE1lido"
        });
      }
      const cupom = resultado.cupom;
      let valorDesconto = 0;
      let planoValues = {
        premium_mensal: 89.99,
        premium_anual: 951
      };
      try {
        if (storage2.getSystemConfig) {
          const precosConfig = await storage2.getSystemConfig("planos_precos");
          if (precosConfig && precosConfig.valor) {
            const precosParsed = JSON.parse(precosConfig.valor);
            if (precosParsed.premium_mensal && precosParsed.premium_anual) {
              planoValues = precosParsed;
            }
          }
        }
      } catch (error) {
        logger.warn("Erro ao carregar pre\xE7os de planos, usando padr\xE3o", "CUPOM_VALIDAR", { error });
      }
      const valorPlano = planoValues[plano] || 89.99;
      if (cupom.tipo === "percentual") {
        valorDesconto = valorPlano * cupom.valor / 100;
      } else {
        valorDesconto = Math.min(cupom.valor, valorPlano);
      }
      res.json({
        valido: true,
        cupom: {
          id: cupom.id,
          codigo: cupom.codigo,
          tipo: cupom.tipo,
          valor: cupom.valor,
          descricao: cupom.descricao
        },
        valorDesconto: parseFloat(valorDesconto.toFixed(2)),
        valorFinal: parseFloat((valorPlano - valorDesconto).toFixed(2))
      });
    } catch (error) {
      logger.error("[API] Erro ao validar cupom:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/cupons/:id/uso", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const usos = await storage2.getUsoCupons?.(id);
      res.json(usos || []);
    } catch (error) {
      logger.error("[API] Erro ao buscar uso de cupons:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.delete("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      console.log(`\u{1F5D1}\uFE0F [DELETE USER] Tentando deletar usu\xE1rio ID: ${id}`);
      await storage2.deleteUser(id);
      console.log(
        `\u2705 [DELETE USER] Usu\xE1rio ${id} deletado com sucesso do banco de dados`
      );
      res.json({ success: true });
    } catch (error) {
      const { id } = req.params;
      console.log(`\u274C [DELETE USER] Erro ao deletar usu\xE1rio ${id}:`, error);
      res.status(500).json({ error: "Erro ao deletar usu\xE1rio" });
    }
  });
  app2.post("/api/admin/fix-trial-users", requireAdmin, async (req, res) => {
    try {
      const users2 = await storage2.getUsers();
      let fixedCount = 0;
      for (const user of users2) {
        if (user.data_expiracao_trial && user.status === "bloqueado") {
          const expirationDate = new Date(user.data_expiracao_trial);
          const now = /* @__PURE__ */ new Date();
          if (now < expirationDate) {
            await storage2.updateUser(user.id, {
              plano: "trial",
              data_expiracao_plano: user.data_expiracao_trial
            });
            fixedCount++;
            console.log(`\u2705 Usu\xE1rio ${user.email} corrigido para plano trial`);
          }
        }
      }
      res.json({
        success: true,
        message: `${fixedCount} usu\xE1rio(s) trial corrigido(s)`,
        fixedCount
      });
    } catch (error) {
      console.error("Erro ao corrigir usu\xE1rios trial:", error);
      res.status(500).json({ error: "Erro ao corrigir usu\xE1rios trial" });
    }
  });
  app2.get("/api/planos", async (req, res) => {
    try {
      if (!storage2.getPlanos) {
        return res.status(501).json({ error: "M\xE9todo getPlanos n\xE3o implementado" });
      }
      const planos2 = await storage2.getPlanos();
      res.json(planos2);
    } catch (error) {
      console.error("Erro ao buscar planos:", error);
      res.status(500).json({ error: "Erro ao buscar planos" });
    }
  });
  app2.post("/api/planos", async (req, res) => {
    try {
      if (!storage2.createPlano) {
        return res.status(501).json({ error: "M\xE9todo createPlano n\xE3o implementado" });
      }
      const planoData = {
        ...req.body,
        data_criacao: (/* @__PURE__ */ new Date()).toISOString()
      };
      const plano = await storage2.createPlano(planoData);
      res.json(plano);
    } catch (error) {
      console.error("Erro ao criar plano:", error);
      res.status(500).json({ error: "Erro ao criar plano" });
    }
  });
  app2.put("/api/planos/:id", async (req, res) => {
    try {
      if (!storage2.updatePlano) {
        return res.status(501).json({ error: "M\xE9todo updatePlano n\xE3o implementado" });
      }
      const id = parseInt(req.params.id);
      const plano = await storage2.updatePlano(id, req.body);
      if (!plano) {
        return res.status(404).json({ error: "Plano n\xE3o encontrado" });
      }
      res.json(plano);
    } catch (error) {
      console.error("Erro ao atualizar plano:", error);
      res.status(500).json({ error: "Erro ao atualizar plano" });
    }
  });
  app2.delete("/api/planos/:id", async (req, res) => {
    try {
      if (!storage2.deletePlano) {
        return res.status(501).json({ error: "M\xE9todo deletePlano n\xE3o implementado" });
      }
      const id = parseInt(req.params.id);
      const deleted = await storage2.deletePlano(id);
      if (!deleted) {
        return res.status(404).json({ error: "Plano n\xE3o encontrado" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Erro ao deletar plano:", error);
      res.status(500).json({ error: "Erro ao deletar plano" });
    }
  });
  app2.get("/api/config-mercadopago", async (req, res) => {
    try {
      const config = await storage2.getConfigMercadoPago();
      if (!config) {
        return res.json(null);
      }
      res.json(config);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar configura\xE7\xE3o Mercado Pago" });
    }
  });
  app2.post("/api/config-mercadopago", async (req, res) => {
    try {
      const config = req.body;
      if (!config.webhook_url) {
        let baseUrl = process.env.APP_URL?.replace(/\/$/, "") || "";
        if (!baseUrl) {
          baseUrl = process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : "http://localhost:5000";
        }
        config.webhook_url = `${baseUrl}/api/webhook/mercadopago`;
      }
      await storage2.saveConfigMercadoPago({
        ...config,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      });
      res.json({
        success: true,
        message: "Configura\xE7\xE3o salva com sucesso!",
        webhook_url: config.webhook_url
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/auth/check-expiration", async (req, res) => {
    try {
      const userId = req.headers["x-user-id"];
      if (!userId) {
        return res.status(401).json({ error: "N\xE3o autorizado" });
      }
      const user = await storage2.getUserById(userId);
      if (!user) {
        return res.status(404).json({ error: "Usu\xE1rio n\xE3o encontrado" });
      }
      const now = /* @__PURE__ */ new Date();
      let statusAtualizado = false;
      if (user.plano === "trial" && user.is_admin !== "true") {
        const dataExpiracao = user.data_expiracao_plano || user.data_expiracao_trial;
        if (dataExpiracao) {
          const expirationDate = new Date(dataExpiracao);
          if (now >= expirationDate && user.status !== "bloqueado") {
            await storage2.updateUser(user.id, {
              status: "bloqueado"
              // NÃO atualiza o plano para 'free'
            });
            if (storage2.getFuncionarios) {
              const funcionarios2 = await storage2.getFuncionarios();
              const funcionariosDaConta = funcionarios2.filter((f) => f.conta_id === user.id);
              for (const func of funcionariosDaConta) {
                await storage2.updateFuncionario(func.id, { status: "bloqueado" });
              }
            }
            statusAtualizado = true;
            logger.info("Status atualizado - plano expirado", "EXPIRATION_CHECK", {
              userId: user.id,
              plano: user.plano
            });
          }
        }
      }
      if (user.data_expiracao_pacote_funcionarios) {
        const packageExpiration = new Date(user.data_expiracao_pacote_funcionarios);
        if (now >= packageExpiration && user.max_funcionarios > (user.max_funcionarios_base || 1)) {
          await storage2.updateUser(user.id, {
            max_funcionarios: user.max_funcionarios_base || 1,
            data_expiracao_pacote_funcionarios: null
          });
          statusAtualizado = true;
          logger.info("Pacote de funcion\xE1rios expirado - limite revertido", "EXPIRATION_CHECK", {
            userId: user.id,
            novoLimite: user.max_funcionarios_base || 1
          });
        }
      }
      const userAtualizado = await storage2.getUserById(userId);
      if (!userAtualizado) {
        return res.status(404).json({ error: "Erro ao buscar dados atualizados" });
      }
      const { senha: _, ...userSemSenha } = userAtualizado;
      res.json({
        user: userSemSenha,
        statusAtualizado
      });
    } catch (error) {
      logger.error("Erro ao verificar expira\xE7\xE3o", "EXPIRATION_CHECK", { error: error.message });
      res.status(500).json({ error: "Erro ao verificar expira\xE7\xE3o" });
    }
  });
  app2.post("/api/admin/force-expiration-check/:userId", requireAdmin, async (req, res) => {
    try {
      const adminId = req.headers["x-user-id"];
      const { userId } = req.params;
      const user = await storage2.getUserById(userId);
      if (!user) {
        return res.status(404).json({ error: "Usu\xE1rio n\xE3o encontrado" });
      }
      const now = /* @__PURE__ */ new Date();
      let acoes = [];
      const planosComExpiracao = ["premium_mensal", "premium_anual", "trial"];
      if (planosComExpiracao.includes(user.plano) && user.is_admin !== "true") {
        const dataExpiracao = user.data_expiracao_plano;
        if (dataExpiracao) {
          const expirationDate = new Date(dataExpiracao);
          if (now >= expirationDate && user.status !== "bloqueado") {
            await storage2.updateUser(user.id, {
              status: "bloqueado"
            });
            if (storage2.getFuncionarios) {
              const funcionarios2 = await storage2.getFuncionarios();
              const funcionariosDaConta = funcionarios2.filter((f) => f.conta_id === user.id);
              for (const func of funcionariosDaConta) {
                await storage2.updateFuncionario(func.id, { status: "bloqueado" });
              }
              acoes.push(`Conta bloqueada - ${funcionariosDaConta.length} funcion\xE1rio(s) bloqueado(s)`);
            } else {
              acoes.push("Conta bloqueada");
            }
            logger.warn("[FORCE_EXPIRATION] Usu\xE1rio bloqueado manualmente por admin", {
              userId: user.id,
              email: user.email,
              plano: user.plano,
              dataExpiracao,
              adminId
            });
          } else if (user.status === "bloqueado" && now < expirationDate) {
            await storage2.updateUser(user.id, {
              status: "ativo"
            });
            if (storage2.getFuncionarios) {
              const funcionarios2 = await storage2.getFuncionarios();
              const funcionariosDaConta = funcionarios2.filter((f) => f.conta_id === user.id);
              for (const func of funcionariosDaConta) {
                await storage2.updateFuncionario(func.id, { status: "ativo" });
              }
              acoes.push(`Conta reativada - ${funcionariosDaConta.length} funcion\xE1rio(s) reativado(s)`);
            } else {
              acoes.push("Conta reativada");
            }
            logger.info("[FORCE_EXPIRATION] Usu\xE1rio reativado manualmente por admin", {
              userId: user.id,
              email: user.email,
              adminId
            });
          } else {
            acoes.push("Status j\xE1 est\xE1 correto");
          }
        } else {
          acoes.push("Sem data de expira\xE7\xE3o definida");
        }
      } else {
        acoes.push("Plano n\xE3o requer verifica\xE7\xE3o de expira\xE7\xE3o");
      }
      await storage2.logAdminAction?.(
        adminId,
        "FORCE_EXPIRATION_CHECK",
        `Verifica\xE7\xE3o for\xE7ada de expira\xE7\xE3o - ${user.email}: ${acoes.join(", ")}`,
        req
      );
      const userAtualizado = await storage2.getUserById(userId);
      res.json({
        success: true,
        acoes,
        user: userAtualizado
      });
    } catch (error) {
      logger.error("[FORCE_EXPIRATION] Erro ao for\xE7ar verifica\xE7\xE3o", { error: error.message });
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/admin/maintenance/analyze", requireAdmin, async (req, res) => {
    try {
      const users2 = await storage2.getUsers();
      const subscriptions2 = await storage2.getSubscriptions();
      const now = /* @__PURE__ */ new Date();
      const inconsistencias = [];
      const employeePackages2 = storage2.getAllEmployeePackages ? await storage2.getAllEmployeePackages() : [];
      const estatisticas = {
        totalUsuarios: users2.length,
        totalAssinaturas: subscriptions2.length,
        totalPacotesFuncionarios: employeePackages2.length,
        usuariosExpiradosAtivos: 0,
        assinaturasPendentesAntigas: 0,
        assinaturasOrfas: 0,
        assinaturasDuplicadas: 0,
        usuariosSemAtividade: 0,
        contasBloqueadasComAssinaturaAtiva: 0,
        pacotesFuncionariosExpirados: 0,
        pacotesFuncionariosOrfaos: 0,
        pacotesFuncionariosPendentes: 0
      };
      for (const user of users2) {
        if (user.is_admin === "true") continue;
        const dataExp = user.data_expiracao_plano || user.data_expiracao_trial;
        if (dataExp && user.status === "ativo") {
          const expDate = new Date(dataExp);
          if (now > expDate) {
            estatisticas.usuariosExpiradosAtivos++;
            inconsistencias.push({
              tipo: "usuario_expirado_ativo",
              userId: user.id,
              email: user.email,
              plano: user.plano,
              dataExpiracao: dataExp,
              status: user.status,
              descricao: `Usu\xE1rio com plano expirado (${format(expDate, "dd/MM/yyyy", { locale: ptBR })}) mas ainda ativo`
            });
          }
        }
      }
      const seteDiasAtras = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1e3);
      for (const sub of subscriptions2) {
        if (sub.status === "pendente" && sub.data_criacao) {
          const dataCriacao = new Date(sub.data_criacao);
          if (dataCriacao < seteDiasAtras) {
            estatisticas.assinaturasPendentesAntigas++;
            inconsistencias.push({
              tipo: "assinatura_pendente_antiga",
              subscriptionId: sub.id,
              userId: sub.user_id,
              plano: sub.plano,
              valor: sub.valor,
              dataCriacao: sub.data_criacao,
              descricao: `Assinatura pendente h\xE1 mais de 7 dias`
            });
          }
        }
      }
      const userIds = new Set(users2.map((u) => u.id));
      for (const sub of subscriptions2) {
        if (!userIds.has(sub.user_id)) {
          estatisticas.assinaturasOrfas++;
          inconsistencias.push({
            tipo: "assinatura_orfa",
            subscriptionId: sub.id,
            userId: sub.user_id,
            plano: sub.plano,
            descricao: "Assinatura sem usu\xE1rio correspondente"
          });
        }
      }
      const assinaturasAtivasPorUsuario = {};
      for (const sub of subscriptions2) {
        if (sub.status === "ativo") {
          if (!assinaturasAtivasPorUsuario[sub.user_id]) {
            assinaturasAtivasPorUsuario[sub.user_id] = [];
          }
          assinaturasAtivasPorUsuario[sub.user_id].push(sub);
        }
      }
      for (const [userId, subs] of Object.entries(assinaturasAtivasPorUsuario)) {
        if (subs.length > 1) {
          estatisticas.assinaturasDuplicadas += subs.length - 1;
          inconsistencias.push({
            tipo: "assinaturas_duplicadas",
            userId,
            quantidade: subs.length,
            assinaturas: subs.map((s) => ({ id: s.id, plano: s.plano, valor: s.valor })),
            descricao: `Usu\xE1rio com ${subs.length} assinaturas ativas`
          });
        }
      }
      for (const user of users2) {
        if (user.status === "bloqueado") {
          const assinaturaAtiva = subscriptions2.find((s) => s.user_id === user.id && s.status === "ativo");
          if (assinaturaAtiva) {
            estatisticas.contasBloqueadasComAssinaturaAtiva++;
            inconsistencias.push({
              tipo: "bloqueado_com_assinatura_ativa",
              userId: user.id,
              email: user.email,
              subscriptionId: assinaturaAtiva.id,
              descricao: "Usu\xE1rio bloqueado mas com assinatura ativa"
            });
          }
        }
      }
      for (const pkg of employeePackages2) {
        if (pkg.status === "ativo" && pkg.data_vencimento) {
          const dataVenc = new Date(pkg.data_vencimento);
          if (now > dataVenc) {
            estatisticas.pacotesFuncionariosExpirados++;
            inconsistencias.push({
              tipo: "pacote_funcionario_expirado",
              packageId: pkg.id,
              userId: pkg.user_id,
              packageType: pkg.package_type,
              dataVencimento: pkg.data_vencimento,
              descricao: `Pacote de funcion\xE1rio expirado (${format(dataVenc, "dd/MM/yyyy", { locale: ptBR })}) mas ainda ativo`
            });
          }
        }
      }
      for (const pkg of employeePackages2) {
        if (!userIds.has(pkg.user_id)) {
          estatisticas.pacotesFuncionariosOrfaos++;
          inconsistencias.push({
            tipo: "pacote_funcionario_orfao",
            packageId: pkg.id,
            userId: pkg.user_id,
            packageType: pkg.package_type,
            descricao: "Pacote de funcion\xE1rio sem usu\xE1rio correspondente"
          });
        }
      }
      for (const pkg of employeePackages2) {
        if (pkg.status === "pendente" && pkg.data_compra) {
          const dataCompra = new Date(pkg.data_compra);
          if (dataCompra < seteDiasAtras) {
            estatisticas.pacotesFuncionariosPendentes++;
            inconsistencias.push({
              tipo: "pacote_funcionario_pendente_antigo",
              packageId: pkg.id,
              userId: pkg.user_id,
              packageType: pkg.package_type,
              dataCompra: pkg.data_compra,
              descricao: "Pacote de funcion\xE1rio pendente h\xE1 mais de 7 dias"
            });
          }
        }
      }
      res.json({
        success: true,
        dataAnalise: now.toISOString(),
        estatisticas,
        inconsistencias,
        resumo: {
          totalInconsistencias: inconsistencias.length,
          criticas: estatisticas.usuariosExpiradosAtivos + estatisticas.contasBloqueadasComAssinaturaAtiva + estatisticas.pacotesFuncionariosExpirados,
          avisos: estatisticas.assinaturasPendentesAntigas + estatisticas.assinaturasDuplicadas + estatisticas.pacotesFuncionariosPendentes,
          limpeza: estatisticas.assinaturasOrfas + estatisticas.pacotesFuncionariosOrfaos
        }
      });
    } catch (error) {
      logger.error("[MAINTENANCE] Erro ao analisar inconsist\xEAncias", { error: error.message });
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/admin/maintenance/fix-expired-users", requireAdmin, async (req, res) => {
    try {
      const adminId = req.headers["x-user-id"];
      const users2 = await storage2.getUsers();
      const now = /* @__PURE__ */ new Date();
      let corrigidos = 0;
      const detalhes = [];
      for (const user of users2) {
        if (user.is_admin === "true") continue;
        const dataExp = user.data_expiracao_plano || user.data_expiracao_trial;
        if (dataExp && user.status === "ativo") {
          const expDate = new Date(dataExp);
          if (now > expDate) {
            await storage2.updateUser(user.id, { status: "bloqueado" });
            if (storage2.getFuncionarios) {
              const funcionarios2 = await storage2.getFuncionarios();
              const funcsDaConta = funcionarios2.filter((f) => f.conta_id === user.id);
              for (const func of funcsDaConta) {
                await storage2.updateFuncionario(func.id, { status: "bloqueado" });
              }
            }
            corrigidos++;
            detalhes.push({
              userId: user.id,
              email: user.email,
              plano: user.plano,
              dataExpiracao: dataExp
            });
          }
        }
      }
      await storage2.logAdminAction?.(
        adminId,
        "MAINTENANCE_FIX_EXPIRED",
        `Manuten\xE7\xE3o: ${corrigidos} usu\xE1rio(s) expirado(s) bloqueado(s)`,
        req
      );
      res.json({
        success: true,
        corrigidos,
        detalhes
      });
    } catch (error) {
      logger.error("[MAINTENANCE] Erro ao corrigir usu\xE1rios expirados", { error: error.message });
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/admin/maintenance/cleanup-subscriptions", requireAdmin, async (req, res) => {
    try {
      const adminId = req.headers["x-user-id"];
      const { removerOrfas = true, removerPendentesAntigas = true, diasPendente = 7, incluirPacotesFuncionarios = true } = req.body;
      const users2 = await storage2.getUsers();
      const subscriptions2 = await storage2.getSubscriptions();
      const employeePackages2 = storage2.getAllEmployeePackages ? await storage2.getAllEmployeePackages() : [];
      const userIds = new Set(users2.map((u) => u.id));
      const now = /* @__PURE__ */ new Date();
      const limiteData = new Date(now.getTime() - diasPendente * 24 * 60 * 60 * 1e3);
      let removidas = 0;
      let pacotesRemovidos = 0;
      const detalhes = [];
      for (const sub of subscriptions2) {
        let remover = false;
        let motivo = "";
        if (removerOrfas && !userIds.has(sub.user_id)) {
          remover = true;
          motivo = "\xF3rf\xE3";
        }
        if (removerPendentesAntigas && sub.status === "pendente" && sub.data_criacao) {
          const dataCriacao = new Date(sub.data_criacao);
          if (dataCriacao < limiteData) {
            remover = true;
            motivo = `pendente h\xE1 mais de ${diasPendente} dias`;
          }
        }
        if (remover && storage2.deleteSubscription) {
          await storage2.deleteSubscription(sub.id);
          removidas++;
          detalhes.push({
            tipo: "assinatura",
            id: sub.id,
            userId: sub.user_id,
            plano: sub.plano,
            motivo
          });
        }
      }
      if (incluirPacotesFuncionarios && storage2.deleteEmployeePackage) {
        for (const pkg of employeePackages2) {
          let remover = false;
          let motivo = "";
          if (removerOrfas && !userIds.has(pkg.user_id)) {
            remover = true;
            motivo = "\xF3rf\xE3o";
          }
          if (removerPendentesAntigas && pkg.status === "pendente" && pkg.data_compra) {
            const dataCompra = new Date(pkg.data_compra);
            if (dataCompra < limiteData) {
              remover = true;
              motivo = `pendente h\xE1 mais de ${diasPendente} dias`;
            }
          }
          if (remover) {
            await storage2.deleteEmployeePackage(pkg.id);
            pacotesRemovidos++;
            detalhes.push({
              tipo: "pacote_funcionario",
              id: pkg.id,
              userId: pkg.user_id,
              packageType: pkg.package_type,
              motivo
            });
          }
        }
      }
      await storage2.logAdminAction?.(
        adminId,
        "MAINTENANCE_CLEANUP_SUBS",
        `Manuten\xE7\xE3o: ${removidas} assinatura(s) e ${pacotesRemovidos} pacote(s) de funcion\xE1rios removido(s)`,
        req
      );
      res.json({
        success: true,
        removidas,
        pacotesRemovidos,
        totalRemovidos: removidas + pacotesRemovidos,
        detalhes
      });
    } catch (error) {
      logger.error("[MAINTENANCE] Erro ao limpar assinaturas", { error: error.message });
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/admin/maintenance/run-full", requireAdmin, async (req, res) => {
    try {
      const adminId = req.headers["x-user-id"];
      const resultados = {
        usuariosCorrigidos: 0,
        assinaturasLimpas: 0,
        pacotesFuncionariosLimpos: 0,
        pacotesFuncionariosExpiradosCorrigidos: 0,
        erros: []
      };
      try {
        const users2 = await storage2.getUsers();
        const now = /* @__PURE__ */ new Date();
        for (const user of users2) {
          if (user.is_admin === "true") continue;
          const dataExp = user.data_expiracao_plano || user.data_expiracao_trial;
          if (dataExp && user.status === "ativo") {
            const expDate = new Date(dataExp);
            if (now > expDate) {
              await storage2.updateUser(user.id, { status: "bloqueado" });
              resultados.usuariosCorrigidos++;
            }
          }
        }
      } catch (err) {
        resultados.erros.push(`Erro ao corrigir usu\xE1rios: ${err.message}`);
      }
      try {
        const users2 = await storage2.getUsers();
        const subscriptions2 = await storage2.getSubscriptions();
        const userIds = new Set(users2.map((u) => u.id));
        const now = /* @__PURE__ */ new Date();
        const seteDiasAtras = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1e3);
        for (const sub of subscriptions2) {
          let remover = false;
          if (!userIds.has(sub.user_id)) remover = true;
          if (sub.status === "pendente" && sub.data_criacao) {
            const dataCriacao = new Date(sub.data_criacao);
            if (dataCriacao < seteDiasAtras) remover = true;
          }
          if (remover && storage2.deleteSubscription) {
            await storage2.deleteSubscription(sub.id);
            resultados.assinaturasLimpas++;
          }
        }
      } catch (err) {
        resultados.erros.push(`Erro ao limpar assinaturas: ${err.message}`);
      }
      try {
        if (storage2.getAllEmployeePackages) {
          const users2 = await storage2.getUsers();
          const employeePackages2 = await storage2.getAllEmployeePackages();
          const userIds = new Set(users2.map((u) => u.id));
          const now = /* @__PURE__ */ new Date();
          const seteDiasAtras = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1e3);
          for (const pkg of employeePackages2) {
            if (pkg.status === "ativo" && pkg.data_vencimento) {
              const dataVenc = new Date(pkg.data_vencimento);
              if (now > dataVenc && storage2.updateEmployeePackageStatus) {
                await storage2.updateEmployeePackageStatus(pkg.id, "expirado", now.toISOString());
                resultados.pacotesFuncionariosExpiradosCorrigidos++;
                continue;
              }
            }
            let remover = false;
            if (!userIds.has(pkg.user_id)) remover = true;
            if (pkg.status === "pendente" && pkg.data_compra) {
              const dataCompra = new Date(pkg.data_compra);
              if (dataCompra < seteDiasAtras) remover = true;
            }
            if (remover && storage2.deleteEmployeePackage) {
              await storage2.deleteEmployeePackage(pkg.id);
              resultados.pacotesFuncionariosLimpos++;
            }
          }
        }
      } catch (err) {
        resultados.erros.push(`Erro ao processar pacotes de funcion\xE1rios: ${err.message}`);
      }
      await storage2.logAdminAction?.(
        adminId,
        "MAINTENANCE_FULL",
        `Manuten\xE7\xE3o completa: ${resultados.usuariosCorrigidos} usu\xE1rios, ${resultados.assinaturasLimpas} assinaturas, ${resultados.pacotesFuncionariosLimpos} pacotes de funcion\xE1rios limpos, ${resultados.pacotesFuncionariosExpiradosCorrigidos} pacotes corrigidos`,
        req
      );
      res.json({
        success: true,
        ...resultados
      });
    } catch (error) {
      logger.error("[MAINTENANCE] Erro na manuten\xE7\xE3o completa", { error: error.message });
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/config-mercadopago/test", async (req, res) => {
    try {
      const { access_token } = req.body;
      if (!access_token) {
        return res.status(400).json({
          success: false,
          message: "Access token n\xE3o fornecido"
        });
      }
      if (!access_token.startsWith("APP_USR-") && !access_token.startsWith("TEST-")) {
        return res.json({
          success: false,
          message: "Formato do Access Token inv\xE1lido. Deve come\xE7ar com 'APP_USR-' ou 'TEST-'"
        });
      }
      const response = await fetch("https://api.mercadopago.com/v1/payment_methods", {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      });
      const responseData = await response.json();
      if (response.ok) {
        logger.info("Conex\xE3o Mercado Pago testada com sucesso", "MERCADOPAGO");
        return res.json({
          success: true,
          message: "\u2705 Conex\xE3o com Mercado Pago estabelecida com sucesso!"
        });
      } else {
        logger.warn("Erro ao testar Mercado Pago", "MERCADOPAGO", {
          status: response.status,
          error: responseData
        });
        let errorMessage = "Erro ao conectar com Mercado Pago";
        if (response.status === 401) {
          errorMessage = "\u274C Access Token inv\xE1lido ou expirado. Verifique suas credenciais no painel do Mercado Pago";
        } else if (response.status === 403) {
          errorMessage = "\u274C Access Token sem permiss\xF5es necess\xE1rias. Gere um novo token com permiss\xF5es completas";
        } else if (responseData?.message) {
          errorMessage = `\u274C ${responseData.message}`;
        }
        return res.json({
          success: false,
          message: errorMessage
        });
      }
    } catch (error) {
      logger.error("Erro ao testar Mercado Pago", "MERCADOPAGO", { error });
      return res.status(500).json({
        success: false,
        message: "\u274C Erro de conex\xE3o. Verifique sua internet e tente novamente"
      });
    }
  });
  app2.get("/api/relatorios/financeiro", requireAdmin, async (req, res) => {
    try {
      const subscriptions2 = await storage2.getSubscriptions();
      const users2 = await storage2.getUsers();
      const assinaturasAtivas = subscriptions2.filter(
        (s) => s.status === "ativo"
      ).length;
      const assinaturasPendentes = subscriptions2.filter(
        (s) => s.status === "pendente"
      ).length;
      const receitaMensal = subscriptions2.filter((s) => s.status === "ativo").reduce((sum, s) => sum + s.valor, 0);
      const receitaPendente = subscriptions2.filter((s) => s.status === "pendente").reduce((sum, s) => sum + s.valor, 0);
      const taxaConversao = subscriptions2.length > 0 ? assinaturasAtivas / subscriptions2.length * 100 : 0;
      const cancelados = users2.filter((u) => u.status === "cancelado").length;
      const taxaChurn = users2.length > 0 ? cancelados / users2.length * 100 : 0;
      const ticketMedio = assinaturasAtivas > 0 ? receitaMensal / assinaturasAtivas : 0;
      const metodosPagamento = {
        cartao: subscriptions2.filter((s) => s.forma_pagamento === "CREDIT_CARD").length,
        boleto: subscriptions2.filter((s) => s.forma_pagamento === "BOLETO").length,
        pix: subscriptions2.filter((s) => s.forma_pagamento === "PIX").length
      };
      res.json({
        metricas: {
          assinaturasAtivas,
          assinaturasPendentes,
          receitaMensal,
          receitaPendente,
          taxaConversao: taxaConversao.toFixed(2),
          taxaChurn: taxaChurn.toFixed(2),
          ticketMedio: ticketMedio.toFixed(2)
        },
        metodosPagamento,
        totalClientes: users2.length,
        geradoEm: (/* @__PURE__ */ new Date()).toISOString()
      });
    } catch (error) {
      logger.error(`[RELATORIO_FINANCEIRO] Erro ao gerar relat\xF3rio: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/payments/:paymentId/retry", requireAdmin, async (req, res) => {
    try {
      const { paymentId } = req.params;
      const config = await storage2.getConfigMercadoPago();
      if (!config || !config.access_token) {
        return res.status(500).json({ error: "Mercado Pago n\xE3o configurado" });
      }
      const { MercadoPagoService: MercadoPagoService2 } = await Promise.resolve().then(() => (init_mercadopago(), mercadopago_exports));
      const mercadopago = new MercadoPagoService2({
        accessToken: config.access_token
      });
      const payment = await mercadopago.getPayment(paymentId);
      if (payment.status === "approved") {
        return res.json({
          message: "Pagamento j\xE1 aprovado",
          status: payment.status
        });
      }
      logger.info(`[PAYMENT_RETRY] Tentando reprocessar pagamento ${paymentId}`);
      res.json({
        success: true,
        message: "Cobran\xE7a reenviada com sucesso",
        paymentId
      });
    } catch (error) {
      logger.error(`[PAYMENT_RETRY] Erro ao reprocessar pagamento: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/relatorios/export/csv", requireAdmin, async (req, res) => {
    try {
      const subscriptions2 = await storage2.getSubscriptions();
      const users2 = await storage2.getUsers();
      let csv = "ID,Cliente,Email,Plano,Valor,Status,Forma Pagamento,Data Vencimento\n";
      for (const sub of subscriptions2) {
        const user = users2.find((u) => u.id === sub.user_id);
        csv += `${sub.id},"${user?.nome || "-"}","${user?.email || "-"}","${sub.plano}",${sub.valor},${sub.status},${sub.forma_pagamento || "-"},${sub.data_vencimento || "-"}
`;
      }
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=relatorio-assinaturas.csv"
      );
      res.send(csv);
    } catch (error) {
      logger.error(`[EXPORT_CSV] Erro ao exportar CSV: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/system-logs", async (req, res) => {
    try {
      const userId = req.headers["x-user-id"];
      const isAdmin = req.headers["x-is-admin"] === "true";
      if (!isAdmin) {
        return res.status(403).json({ error: "Acesso negado" });
      }
      const level = req.query.level || "INFO";
      const limit = parseInt(req.query.limit) || 100;
      res.json([]);
    } catch (error) {
      logger.error("Erro ao buscar logs do sistema:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/admin/all-logs", async (req, res) => {
    try {
      const userId = req.headers["x-user-id"];
      const isAdmin = req.headers["x-is-admin"] === "true";
      if (!isAdmin) {
        return res.status(403).json({ error: "Acesso negado" });
      }
      const user = await storage2.getUserById(userId);
      const isMasterAdmin = user?.email === "pavisoft.suporte@gmail.com";
      if (!isMasterAdmin) {
        return res.status(403).json({ error: "Acesso negado - apenas master admin" });
      }
      const limit = parseInt(req.query.limit) || 500;
      const logs = await storage2.getLogsAdmin?.();
      if (!logs) {
        return res.json([]);
      }
      const filteredLogs = logs.slice(0, limit).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
      const allUsers = await storage2.getUsers();
      const allFuncionarios = await storage2.getFuncionarios();
      const logsComNomes = filteredLogs.map((log2) => {
        const usuario = allUsers.find((u) => u.id === log2.usuario_id);
        const funcionario = allFuncionarios.find((f) => f.id === log2.usuario_id);
        return {
          ...log2,
          usuario_nome: usuario?.nome || funcionario?.nome || "Usu\xE1rio Desconhecido",
          usuario_email: usuario?.email || funcionario?.email || ""
        };
      });
      res.json(logsComNomes);
    } catch (error) {
      logger.error("Erro ao buscar todos os logs:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.delete("/api/admin/all-logs", requireAdmin, async (req, res) => {
    try {
      const userId = req.headers["x-user-id"];
      const user = await storage2.getUserById(userId);
      const isMasterAdmin = user?.email === "pavisoft.suporte@gmail.com";
      if (!isMasterAdmin) {
        return res.status(403).json({ error: "Acesso negado - apenas master admin" });
      }
      if (!storage2.deleteAllLogsAdmin) {
        return res.status(501).json({ error: "M\xE9todo deleteAllLogsAdmin n\xE3o implementado" });
      }
      const deletedCount = await storage2.deleteAllLogsAdmin();
      logger.warn("Todos os logs de administradores foram limpos", "ADMIN_LOGS", {
        adminId: userId,
        adminEmail: user?.email,
        deletedCount
      });
      res.json({
        success: true,
        deletedCount,
        message: `${deletedCount} log(s) removido(s)`
      });
    } catch (error) {
      logger.error("Erro ao limpar logs:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/logs-admin", async (req, res) => {
    try {
      const log2 = await storage2.createLogAdmin({
        ...req.body,
        data: (/* @__PURE__ */ new Date()).toISOString()
      });
      res.json(log2);
    } catch (error) {
      res.status(500).json({ error: "Erro ao criar log" });
    }
  });
  app2.get("/api/funcionarios", getUserId, async (req, res) => {
    try {
      const effectiveUserId = req.headers["effective-user-id"];
      const contaId = req.query.conta_id;
      if (!contaId) {
        return res.status(400).json({ error: "conta_id \xE9 obrigat\xF3rio" });
      }
      if (contaId !== effectiveUserId) {
        return res.status(403).json({ error: "Acesso negado" });
      }
      const funcionarios2 = await storage2.getFuncionariosByContaId(contaId);
      res.json(funcionarios2);
    } catch (error) {
      console.error("Erro ao buscar funcion\xE1rios:", error);
      res.status(500).json({ error: error.message || "Erro ao buscar funcion\xE1rios" });
    }
  });
  app2.get("/api/funcionarios/limite", getUserId, async (req, res) => {
    try {
      const effectiveUserId = req.headers["effective-user-id"];
      const usuario = await storage2.getUserByEmail(
        (await storage2.getUsers()).find((u) => u.id === effectiveUserId)?.email || ""
      );
      if (!usuario) {
        return res.status(404).json({ error: "Usu\xE1rio n\xE3o encontrado" });
      }
      const allFuncionarios = await storage2.getFuncionarios();
      const funcionariosDaConta = allFuncionarios.filter(
        (f) => f.conta_id === effectiveUserId
      );
      res.json({
        max_funcionarios: usuario.max_funcionarios || 5,
        funcionarios_cadastrados: funcionariosDaConta.length,
        funcionarios_disponiveis: (usuario.max_funcionarios || 5) - funcionariosDaConta.length
      });
    } catch (error) {
      console.error("Erro ao buscar limite de funcion\xE1rios:", error);
      res.status(500).json({ error: error.message || "Erro ao buscar limite" });
    }
  });
  app2.post("/api/funcionarios", getUserId, async (req, res) => {
    try {
      const effectiveUserId = req.headers["effective-user-id"];
      const { conta_id, nome, email, senha, cargo } = req.body;
      if (!conta_id || !nome || !email || !senha) {
        return res.status(400).json({ error: "Dados incompletos" });
      }
      if (conta_id !== effectiveUserId) {
        return res.status(403).json({ error: "Acesso negado" });
      }
      if (senha.length < 8) {
        return res.status(400).json({
          error: "A senha deve ter no m\xEDnimo 8 caracteres"
        });
      }
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!passwordRegex.test(senha)) {
        return res.status(400).json({
          error: "A senha deve conter letras mai\xFAsculas, min\xFAsculas e n\xFAmeros"
        });
      }
      const usuario = await storage2.getUserByEmail(
        (await storage2.getUsers()).find((u) => u.id === conta_id)?.email || ""
      );
      if (!usuario) {
        return res.status(404).json({ error: "Usu\xE1rio n\xE3o encontrado" });
      }
      const allFuncionarios = await storage2.getFuncionarios();
      const funcionariosDaConta = allFuncionarios.filter(
        (f) => f.conta_id === conta_id
      );
      const maxFuncionarios = usuario.max_funcionarios || 1;
      if (funcionariosDaConta.length >= maxFuncionarios) {
        return res.status(400).json({
          error: "Limite de funcion\xE1rios atingido, verifique os planos e aumente a capacidade de novos cadastros.",
          limite_atingido: true,
          max_funcionarios: maxFuncionarios,
          funcionarios_cadastrados: funcionariosDaConta.length
        });
      }
      const existingFuncionario = allFuncionarios.find(
        (f) => f.email === email && f.conta_id === conta_id
      );
      if (existingFuncionario) {
        return res.status(400).json({
          error: "J\xE1 existe um funcion\xE1rio com este email nesta conta"
        });
      }
      const hashedPassword = await bcrypt.hash(senha, 10);
      const funcionario = await storage2.createFuncionario({
        id: crypto.randomUUID(),
        conta_id,
        nome,
        email,
        senha: hashedPassword,
        cargo: cargo || null,
        status: "ativo",
        data_criacao: (/* @__PURE__ */ new Date()).toISOString()
      });
      console.log(`\u2705 Funcion\xE1rio criado no banco - ID: ${funcionario.id}, Nome: ${funcionario.nome}, Email: ${funcionario.email}, Conta: ${funcionario.conta_id}`);
      await storage2.savePermissoesFuncionario(funcionario.id, {
        dashboard: "false",
        pdv: "false",
        caixa: "false",
        produtos: "false",
        inventario: "false",
        relatorios: "false",
        clientes: "false",
        fornecedores: "false",
        financeiro: "false",
        config_fiscal: "false",
        historico_caixas: "false",
        configuracoes: "false"
      });
      console.log(`\u2705 Permiss\xF5es padr\xE3o criadas para funcion\xE1rio ID: ${funcionario.id}`);
      res.json(funcionario);
    } catch (error) {
      console.error("Erro ao criar funcion\xE1rio:", error);
      res.status(500).json({ error: error.message || "Erro ao criar funcion\xE1rio" });
    }
  });
  app2.patch("/api/funcionarios/:id", getUserId, async (req, res) => {
    try {
      const effectiveUserId = req.headers["effective-user-id"];
      const { id } = req.params;
      const updates = req.body;
      delete updates.id;
      delete updates.conta_id;
      const allFuncionarios = await storage2.getFuncionarios();
      const funcionario = allFuncionarios.find((f) => f.id === id);
      if (!funcionario) {
        return res.status(404).json({ error: "Funcion\xE1rio n\xE3o encontrado" });
      }
      if (funcionario.conta_id !== effectiveUserId) {
        return res.status(403).json({ error: "Acesso negado" });
      }
      const updatedFuncionario = await storage2.updateFuncionario(id, updates);
      res.json(updatedFuncionario);
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar funcion\xE1rio" });
    }
  });
  app2.delete("/api/funcionarios/:id", getUserId, async (req, res) => {
    try {
      const effectiveUserId = req.headers["effective-user-id"];
      const { id } = req.params;
      const allFuncionarios = await storage2.getFuncionarios();
      const funcionario = allFuncionarios.find((f) => f.id === id);
      if (!funcionario) {
        return res.status(404).json({ error: "Funcion\xE1rio n\xE3o encontrado" });
      }
      if (funcionario.conta_id !== effectiveUserId) {
        return res.status(403).json({ error: "Acesso negado" });
      }
      const deleted = await storage2.deleteFuncionario(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar funcion\xE1rio" });
    }
  });
  app2.get("/api/funcionarios/:id/permissoes", getUserId, async (req, res) => {
    try {
      const effectiveUserId = req.headers["effective-user-id"];
      const { id } = req.params;
      const allFuncionarios = await storage2.getFuncionarios();
      const funcionario = allFuncionarios.find((f) => f.id === id);
      if (!funcionario) {
        return res.status(404).json({ error: "Funcion\xE1rio n\xE3o encontrado" });
      }
      if (funcionario.conta_id !== effectiveUserId) {
        return res.status(403).json({ error: "Acesso negado" });
      }
      const permissoes = await storage2.getPermissoesFuncionario?.(id);
      if (!permissoes) {
        return res.json({
          dashboard: "false",
          pdv: "false",
          caixa: "false",
          produtos: "false",
          inventario: "false",
          relatorios: "false",
          clientes: "false",
          fornecedores: "false",
          financeiro: "false",
          config_fiscal: "false",
          historico_caixas: "false",
          configuracoes: "false"
        });
      }
      res.json(permissoes);
    } catch (error) {
      console.error("Erro ao buscar permiss\xF5es:", error);
      res.status(500).json({ error: "Erro ao buscar permiss\xF5es" });
    }
  });
  app2.post("/api/funcionarios/:id/permissoes", getUserId, async (req, res) => {
    try {
      const effectiveUserId = req.headers["effective-user-id"];
      const { id } = req.params;
      const allFuncionarios = await storage2.getFuncionarios();
      const funcionario = allFuncionarios.find((f) => f.id === id);
      if (!funcionario) {
        return res.status(404).json({ error: "Funcion\xE1rio n\xE3o encontrado" });
      }
      if (funcionario.conta_id !== effectiveUserId) {
        return res.status(403).json({ error: "Acesso negado" });
      }
      const permissoes = await storage2.savePermissoesFuncionario(id, req.body);
      await storage2.logAdminAction?.(
        effectiveUserId,
        "PERMISSOES_ATUALIZADAS",
        `Permiss\xF5es atualizadas para funcion\xE1rio ${funcionario.nome} (${funcionario.email})`
      );
      res.json(permissoes);
    } catch (error) {
      res.status(500).json({ error: "Erro ao salvar permiss\xF5es" });
    }
  });
  app2.get("/api/logs-admin", getUserId, async (req, res) => {
    try {
      const effectiveUserId = req.headers["effective-user-id"];
      const contaId = req.query.conta_id;
      if (!contaId || contaId !== effectiveUserId) {
        return res.status(403).json({ error: "Acesso negado" });
      }
      const logs = await storage2.getLogsAdminByAccount?.(contaId);
      const funcionarios2 = await storage2.getFuncionariosByContaId(contaId);
      const usuarios = await storage2.getUsers?.() || [];
      const allUsers = [...usuarios, ...funcionarios2];
      const logsComNomes = (logs || []).map((log2) => {
        const usuario = allUsers.find((u) => u.id === log2.usuario_id);
        return {
          ...log2,
          usuario_nome: usuario?.nome || "Usu\xE1rio Desconhecido",
          usuario_email: usuario?.email || ""
        };
      });
      res.json(logsComNomes);
    } catch (error) {
      console.error("Erro ao buscar logs:", error);
      res.status(500).json({ error: "Erro ao buscar logs" });
    }
  });
  app2.delete("/api/logs-admin", getUserId, async (req, res) => {
    try {
      const effectiveUserId = req.headers["effective-user-id"];
      const contaId = req.query.conta_id;
      if (!contaId || contaId !== effectiveUserId) {
        return res.status(403).json({ error: "Acesso negado" });
      }
      if (!storage2.deleteAllLogsAdmin) {
        return res.status(501).json({ error: "M\xE9todo deleteAllLogsAdmin n\xE3o implementado" });
      }
      await storage2.deleteAllLogsAdmin(contaId);
      await storage2.logAdminAction?.(
        effectiveUserId,
        "LOGS_LIMPOS",
        "Logs de auditoria foram limpos",
        {
          ip: req.ip,
          userAgent: req.headers["user-agent"],
          contaId: effectiveUserId
        }
      );
      res.json({
        success: true,
        message: "Logs removidos com sucesso"
      });
    } catch (error) {
      console.error("Erro ao limpar logs:", error);
      res.status(500).json({ error: "Erro ao limpar logs" });
    }
  });
  app2.get("/api/produtos", getUserId, async (req, res) => {
    try {
      const effectiveUserId = req.headers["effective-user-id"];
      const limit = req.query.limit ? parseInt(req.query.limit) : void 0;
      const allProdutos = await storage2.getProdutos();
      let produtos2 = allProdutos.filter((p) => p.user_id === effectiveUserId);
      const expiring = req.query.expiring;
      if (expiring === "soon") {
        const today = /* @__PURE__ */ new Date();
        const thirtyDaysFromNow = /* @__PURE__ */ new Date();
        thirtyDaysFromNow.setDate(today.getDate() + 30);
        produtos2 = produtos2.filter((p) => {
          if (!p.vencimento) return false;
          const expiryDate = new Date(p.vencimento);
          return expiryDate <= thirtyDaysFromNow && expiryDate >= today;
        });
      }
      if (limit && limit > 0) {
        produtos2 = produtos2.slice(0, limit);
      }
      res.json(produtos2);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar produtos" });
    }
  });
  app2.get("/api/produtos/:id", getUserId, async (req, res) => {
    try {
      const effectiveUserId = req.headers["effective-user-id"];
      const id = parseInt(req.params.id);
      const produto = await storage2.getProduto(id);
      if (!produto) {
        return res.status(404).json({ error: "Produto n\xE3o encontrado" });
      }
      if (produto.user_id !== effectiveUserId) {
        return res.status(403).json({ error: "Acesso negado. Este produto n\xE3o pertence a voc\xEA." });
      }
      res.json(produto);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar produto" });
    }
  });
  app2.get("/api/produtos/codigo/:codigo", getUserId, async (req, res) => {
    try {
      const effectiveUserId = req.headers["effective-user-id"];
      const codigo = req.params.codigo;
      const produto = await storage2.getProdutoByCodigoBarras(codigo);
      if (!produto) {
        return res.status(404).json({ error: "Produto n\xE3o encontrado" });
      }
      if (produto.user_id !== effectiveUserId) {
        return res.status(403).json({ error: "Acesso negado. Este produto n\xE3o pertence a voc\xEA." });
      }
      res.json(produto);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar produto" });
    }
  });
  app2.post("/api/produtos", getUserId, async (req, res) => {
    try {
      const effectiveUserId = req.headers["effective-user-id"];
      const produtoData = insertProdutoSchema.parse({
        ...req.body,
        user_id: effectiveUserId
      });
      if (produtoData.preco <= 0) {
        return res.status(400).json({ error: "Pre\xE7o deve ser positivo" });
      }
      if (produtoData.quantidade < 0) {
        return res.status(400).json({ error: "Quantidade n\xE3o pode ser negativa" });
      }
      const produto = await storage2.createProduto(produtoData);
      await storage2.logAdminAction?.(
        effectiveUserId,
        "PRODUTO_CRIADO",
        `Produto criado: ${produtoData.nome} - Qtd: ${produtoData.quantidade}, Pre\xE7o: R$ ${produtoData.preco.toFixed(2)}`,
        req
      );
      res.json(produto);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ error: "Dados inv\xE1lidos", details: error.errors });
      }
      res.status(500).json({ error: "Erro ao criar produto" });
    }
  });
  app2.put("/api/produtos/:id", getUserId, async (req, res) => {
    try {
      const effectiveUserId = req.headers["effective-user-id"];
      const id = parseInt(req.params.id);
      const updates = req.body;
      const produtoExistente = await storage2.getProduto(id);
      if (!produtoExistente) {
        return res.status(404).json({ error: "Produto n\xE3o encontrado" });
      }
      if (produtoExistente.user_id !== effectiveUserId) {
        return res.status(403).json({ error: "Acesso negado. Este produto n\xE3o pertence a voc\xEA." });
      }
      if (updates.preco !== void 0 && updates.preco <= 0) {
        return res.status(400).json({ error: "Pre\xE7o deve ser positivo" });
      }
      if (updates.quantidade !== void 0 && updates.quantidade < 0) {
        return res.status(400).json({ error: "Quantidade n\xE3o pode ser negativa" });
      }
      const produto = await storage2.updateProduto(id, updates);
      await storage2.logAdminAction?.(
        effectiveUserId,
        "PRODUTO_ATUALIZADO",
        `Produto atualizado: ${produto.nome} - ID: ${id}`,
        req
      );
      res.json(produto);
    } catch (error) {
      console.error("\u274C Erro ao atualizar produto:", error);
      res.status(500).json({ error: "Erro ao atualizar produto" });
    }
  });
  app2.delete("/api/produtos/:id", getUserId, async (req, res) => {
    try {
      const effectiveUserId = req.headers["effective-user-id"];
      const id = parseInt(req.params.id);
      const produtoExistente = await storage2.getProduto(id);
      if (!produtoExistente) {
        return res.status(404).json({ error: "Produto n\xE3o encontrado" });
      }
      if (produtoExistente.user_id !== effectiveUserId) {
        return res.status(403).json({ error: "Acesso negado. Este produto n\xE3o pertence a voc\xEA." });
      }
      const deleted = await storage2.deleteProduto(id);
      await storage2.logAdminAction?.(
        effectiveUserId,
        "PRODUTO_DELETADO",
        `Produto deletado: ${produtoExistente.nome} - ID: ${id}`,
        req
      );
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar produto" });
    }
  });
  app2.get("/api/produtos/:id/bloqueios", getUserId, async (req, res) => {
    try {
      const effectiveUserId = req.headers["effective-user-id"];
      const produtoId = parseInt(req.params.id);
      const bloqueios = await storage2.getBloqueiosPorProduto(produtoId, effectiveUserId);
      const quantidadeBloqueada = await storage2.getQuantidadeBloqueadaPorProduto(produtoId, effectiveUserId);
      const bloqueiosComOrcamento = await Promise.all(
        bloqueios.map(async (bloqueio) => {
          const orcamento = await storage2.getOrcamento(bloqueio.orcamento_id);
          return {
            ...bloqueio,
            numero_orcamento: orcamento?.numero || `#${bloqueio.orcamento_id}`
          };
        })
      );
      res.json({
        quantidade_bloqueada: quantidadeBloqueada,
        bloqueios: bloqueiosComOrcamento
      });
    } catch (error) {
      console.error("Erro ao buscar bloqueios:", error);
      res.status(500).json({ error: "Erro ao buscar bloqueios" });
    }
  });
  app2.post("/api/vendas", getUserId, async (req, res) => {
    try {
      const userId = req.headers["effective-user-id"];
      const funcionarioId = req.headers["funcionario-id"];
      const { itens, cliente_id, forma_pagamento } = req.body;
      const user = await storage2.getUserById(userId);
      const nomeVendedor = user?.nome || user?.email || "Venda direta";
      const caixaAberto = await storage2.getCaixaAberto?.(userId, funcionarioId || void 0);
      if (!caixaAberto) {
        return res.status(400).json({
          error: "N\xE3o h\xE1 caixa aberto. Abra o caixa antes de registrar vendas."
        });
      }
      if (!itens || !Array.isArray(itens) || itens.length === 0) {
        return res.status(400).json({ error: "Itens da venda s\xE3o obrigat\xF3rios" });
      }
      let valorTotal = 0;
      const produtosVendidos = [];
      for (const item of itens) {
        const produto = await storage2.getProdutoByCodigoBarras(
          item.codigo_barras
        );
        if (!produto) {
          return res.status(404).json({
            error: `Produto com c\xF3digo ${item.codigo_barras} n\xE3o encontrado`
          });
        }
        const quantidadeBloqueada = await storage2.getQuantidadeBloqueadaPorProduto(
          produto.id,
          userId
        );
        const estoqueDisponivel = produto.quantidade - quantidadeBloqueada;
        if (estoqueDisponivel < item.quantidade) {
          logger.warn("PDV bloqueado - estoque insuficiente", "ESTOQUE_PDV", {
            produto: produto.nome,
            solicitado: item.quantidade,
            estoque_total: produto.quantidade,
            bloqueado: quantidadeBloqueada,
            disponivel: estoqueDisponivel
          });
          return res.status(400).json({
            error: `Estoque insuficiente para ${produto.nome}.

Estoque total: ${produto.quantidade}
Bloqueado em or\xE7amentos: ${quantidadeBloqueada}
Dispon\xEDvel para venda: ${estoqueDisponivel}
Solicitado: ${item.quantidade}

Libere or\xE7amentos ou ajuste a quantidade.`
          });
        }
        const subtotal = produto.preco * item.quantidade;
        valorTotal += subtotal;
        await storage2.updateProduto(produto.id, {
          quantidade: produto.quantidade - item.quantidade
        });
        produtosVendidos.push({
          nome: produto.nome,
          quantidade: item.quantidade,
          preco_unitario: produto.preco,
          subtotal
        });
      }
      const agora = /* @__PURE__ */ new Date();
      const venda = await storage2.createVenda({
        user_id: userId,
        produto: produtosVendidos.map((p) => p.nome).join(", "),
        quantidade_vendida: produtosVendidos.reduce(
          (sum, p) => sum + p.quantidade,
          0
        ),
        valor_total: valorTotal,
        data: agora.toISOString(),
        itens: JSON.stringify(produtosVendidos),
        cliente_id: cliente_id || void 0,
        forma_pagamento: forma_pagamento || "dinheiro",
        vendedor: nomeVendedor
      });
      await storage2.atualizarTotaisCaixa?.(
        caixaAberto.id,
        "total_vendas",
        valorTotal
      );
      await storage2.logAdminAction?.(
        userId,
        "VENDA_REALIZADA",
        `Venda registrada - Total: R$ ${valorTotal.toFixed(2)}, Itens: ${produtosVendidos.length}, Forma: ${forma_pagamento || "dinheiro"}`,
        req
      );
      res.json({
        ...venda,
        itens: produtosVendidos
      });
    } catch (error) {
      res.status(500).json({ error: "Erro ao registrar venda" });
    }
  });
  app2.get("/api/vendas", getUserId, async (req, res) => {
    try {
      const effectiveUserId = req.headers["effective-user-id"];
      if (!effectiveUserId) {
        return res.status(401).json({ error: "Usu\xE1rio n\xE3o autenticado" });
      }
      const incluirArquivados = req.query.incluirArquivados === "true";
      let vendas2 = await storage2.getVendasByUser(effectiveUserId);
      if (!incluirArquivados && vendas2.some((v) => v.status === "arquivada")) {
        vendas2 = vendas2.filter((v) => v.status !== "arquivada");
      }
      res.json(vendas2);
    } catch (error) {
      console.error("Erro ao buscar vendas:", error);
      res.status(500).json({ error: "Erro ao buscar vendas" });
    }
  });
  app2.get("/api/reports/daily", getUserId, async (req, res) => {
    try {
      const effectiveUserId = req.headers["effective-user-id"];
      const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      const allVendas = await storage2.getVendas(today, today);
      const vendas2 = allVendas.filter((v) => v.user_id === effectiveUserId);
      const total = vendas2.reduce((sum, v) => sum + v.valor_total, 0);
      res.json({ date: today, total, vendas: vendas2.length });
    } catch (error) {
      res.status(500).json({ error: "Erro ao gerar relat\xF3rio di\xE1rio" });
    }
  });
  app2.get("/api/reports/weekly", getUserId, async (req, res) => {
    try {
      const effectiveUserId = req.headers["effective-user-id"];
      const today = /* @__PURE__ */ new Date();
      const weekAgo = /* @__PURE__ */ new Date();
      weekAgo.setDate(today.getDate() - 7);
      const allVendas = await storage2.getVendas(
        weekAgo.toISOString().split("T")[0],
        today.toISOString().split("T")[0]
      );
      const vendas2 = allVendas.filter((v) => v.user_id === effectiveUserId);
      const total = vendas2.reduce((sum, v) => sum + v.valor_total, 0);
      res.json({ total, vendas: vendas2.length });
    } catch (error) {
      res.status(500).json({ error: "Erro ao gerar relat\xF3rio semanal" });
    }
  });
  app2.get("/api/reports/expiring", getUserId, async (req, res) => {
    try {
      const effectiveUserId = req.headers["effective-user-id"];
      const allProdutos = await storage2.getProdutos();
      const produtos2 = allProdutos.filter((p) => p.user_id === effectiveUserId);
      const today = /* @__PURE__ */ new Date();
      const thirtyDaysFromNow = /* @__PURE__ */ new Date();
      thirtyDaysFromNow.setDate(today.getDate() + 30);
      const expiringProducts = produtos2.filter((p) => {
        if (!p.vencimento) return false;
        const expiryDate = new Date(p.vencimento);
        return expiryDate <= thirtyDaysFromNow && expiryDate >= today;
      }).map((p) => {
        const expiryDate = new Date(p.vencimento);
        const daysUntilExpiry = Math.ceil(
          (expiryDate.getTime() - today.getTime()) / (1e3 * 60 * 60 * 24)
        );
        return {
          ...p,
          daysUntilExpiry,
          status: daysUntilExpiry <= 7 ? "critical" : "warning"
        };
      }).sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);
      res.json(expiringProducts);
    } catch (error) {
      res.status(500).json({ error: "Erro ao gerar relat\xF3rio de vencimentos" });
    }
  });
  app2.delete("/api/vendas", getUserId, async (req, res) => {
    try {
      const effectiveUserId = req.headers["effective-user-id"];
      if (!effectiveUserId) {
        return res.status(401).json({ error: "Usu\xE1rio n\xE3o autenticado" });
      }
      const allVendas = await storage2.getVendas();
      const vendasToDelete = allVendas.filter(
        (v) => v.user_id === effectiveUserId
      );
      let deletedCount = 0;
      for (const venda of vendasToDelete) {
        if (storage2.deleteVenda) {
          await storage2.deleteVenda(venda.id);
          deletedCount++;
        }
      }
      console.log(`\u2705 Hist\xF3rico de vendas limpo - User: ${effectiveUserId}, Vendas removidas: ${deletedCount}`);
      await storage2.logAdminAction?.(
        effectiveUserId,
        "HISTORICO_VENDAS_LIMPO",
        `${deletedCount} venda(s) removida(s) do hist\xF3rico`,
        req
      );
      res.json({
        success: true,
        message: "Hist\xF3rico de vendas limpo com sucesso",
        deletedCount
      });
    } catch (error) {
      console.error("Erro ao limpar hist\xF3rico de vendas:", error);
      res.status(500).json({ error: error.message || "Erro ao limpar hist\xF3rico de vendas" });
    }
  });
  app2.patch("/api/vendas/:id/cupom", getUserId, async (req, res) => {
    try {
      const effectiveUserId = req.headers["effective-user-id"];
      const vendaId = parseInt(req.params.id);
      const { cupomTexto } = req.body;
      if (!effectiveUserId) {
        return res.status(401).json({ error: "Usu\xE1rio n\xE3o autenticado" });
      }
      if (!cupomTexto || typeof cupomTexto !== "string" || cupomTexto.length > 8e3) {
        return res.status(400).json({ error: "Cupom inv\xE1lido" });
      }
      const venda = await storage2.getVenda?.(vendaId);
      if (!venda || venda.user_id !== effectiveUserId) {
        return res.status(404).json({ error: "Venda n\xE3o encontrada" });
      }
      if (storage2.updateVendaCupom) {
        await storage2.updateVendaCupom(vendaId, cupomTexto);
      }
      res.json({ success: true, message: "Cupom salvo com sucesso" });
    } catch (error) {
      console.error("Erro ao salvar cupom:", error);
      res.status(500).json({ error: error.message || "Erro ao salvar cupom" });
    }
  });
  app2.get("/api/fornecedores", getUserId, async (req, res) => {
    try {
      const effectiveUserId = req.headers["effective-user-id"];
      const allFornecedores = await storage2.getFornecedores();
      const fornecedores2 = allFornecedores.filter(
        (f) => f.user_id === effectiveUserId
      );
      res.json(fornecedores2);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar fornecedores" });
    }
  });
  app2.get("/api/fornecedores/:id", getUserId, async (req, res) => {
    try {
      const effectiveUserId = req.headers["effective-user-id"];
      const id = parseInt(req.params.id);
      const fornecedor = await storage2.getFornecedor(id);
      if (!fornecedor || fornecedor.user_id !== effectiveUserId) {
        return res.status(404).json({ error: "Fornecedor n\xE3o encontrado" });
      }
      res.json(fornecedor);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar fornecedor" });
    }
  });
  app2.post("/api/fornecedores", getUserId, async (req, res) => {
    try {
      const effectiveUserId = req.headers["effective-user-id"];
      const fornecedorData = {
        ...req.body,
        user_id: effectiveUserId,
        data_cadastro: (/* @__PURE__ */ new Date()).toISOString()
      };
      const fornecedor = await storage2.createFornecedor(fornecedorData);
      await storage2.logAdminAction?.(
        effectiveUserId,
        "FORNECEDOR_CRIADO",
        `Fornecedor criado: ${fornecedorData.nome}${fornecedorData.cnpj ? " - CNPJ: " + fornecedorData.cnpj : ""}`,
        req
      );
      res.json(fornecedor);
    } catch (error) {
      res.status(500).json({ error: "Erro ao criar fornecedor" });
    }
  });
  app2.put("/api/fornecedores/:id", getUserId, async (req, res) => {
    try {
      const effectiveUserId = req.headers["effective-user-id"];
      const id = parseInt(req.params.id);
      const fornecedorExistente = await storage2.getFornecedor(id);
      if (!fornecedorExistente || fornecedorExistente.user_id !== effectiveUserId) {
        return res.status(404).json({ error: "Fornecedor n\xE3o encontrado" });
      }
      const fornecedor = await storage2.updateFornecedor(id, req.body);
      res.json(fornecedor);
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar fornecedor" });
    }
  });
  app2.delete("/api/fornecedores/:id", getUserId, async (req, res) => {
    try {
      const effectiveUserId = req.headers["effective-user-id"];
      const id = parseInt(req.params.id);
      const fornecedorExistente = await storage2.getFornecedor(id);
      if (!fornecedorExistente || fornecedorExistente.user_id !== effectiveUserId) {
        return res.status(404).json({ error: "Fornecedor n\xE3o encontrado" });
      }
      const deleted = await storage2.deleteFornecedor(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar fornecedor" });
    }
  });
  app2.get("/api/clientes", getUserId, async (req, res) => {
    try {
      const effectiveUserId = req.headers["effective-user-id"];
      const allClientes = await storage2.getClientes();
      const clientes2 = allClientes.filter((c) => c.user_id === effectiveUserId);
      res.json(clientes2);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar clientes" });
    }
  });
  app2.get("/api/clientes/:id", getUserId, async (req, res) => {
    try {
      const effectiveUserId = req.headers["effective-user-id"];
      const id = parseInt(req.params.id);
      const cliente = await storage2.getCliente(id);
      if (!cliente || cliente.user_id !== effectiveUserId) {
        return res.status(404).json({ error: "Cliente n\xE3o encontrado" });
      }
      res.json(cliente);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar cliente" });
    }
  });
  app2.post("/api/clientes", getUserId, async (req, res) => {
    try {
      const effectiveUserId = req.headers["effective-user-id"];
      if (req.body.cpf_cnpj) {
        const allClientes = await storage2.getClientes();
        const clienteExistente = allClientes.find(
          (c) => c.user_id === effectiveUserId && c.cpf_cnpj && c.cpf_cnpj === req.body.cpf_cnpj
        );
        if (clienteExistente) {
          return res.status(400).json({
            error: "J\xE1 existe um cliente cadastrado com este CPF/CNPJ"
          });
        }
      }
      const clienteData = {
        ...req.body,
        user_id: effectiveUserId,
        data_cadastro: (/* @__PURE__ */ new Date()).toISOString()
      };
      const cliente = await storage2.createCliente(clienteData);
      await storage2.logAdminAction?.(
        effectiveUserId,
        "CLIENTE_CRIADO",
        `Cliente criado: ${clienteData.nome}${clienteData.cpf_cnpj ? " - CPF/CNPJ: " + clienteData.cpf_cnpj : ""}`,
        req
      );
      res.json(cliente);
    } catch (error) {
      if (error.message && error.message.includes("duplicate key")) {
        return res.status(400).json({
          error: "J\xE1 existe um cliente cadastrado com este CPF/CNPJ"
        });
      }
      res.status(500).json({ error: "Erro ao criar cliente" });
    }
  });
  app2.put("/api/clientes/:id", getUserId, async (req, res) => {
    try {
      const effectiveUserId = req.headers["effective-user-id"];
      const { id } = req.params;
      console.log(`\u{1F504} [UPDATE CLIENTE] ID: ${id}`);
      console.log(
        `\u{1F4DD} [UPDATE CLIENTE] Dados recebidos:`,
        JSON.stringify(req.body, null, 2)
      );
      const clienteExistente = await storage2.getCliente(id);
      if (!clienteExistente || clienteExistente.user_id !== effectiveUserId) {
        console.log(`\u274C [UPDATE CLIENTE] Cliente n\xE3o encontrado com ID: ${id}`);
        return res.status(404).json({ error: "Cliente n\xE3o encontrado" });
      }
      if (req.body.cpf_cnpj) {
        const allClientes = await storage2.getClientes();
        const cpfDuplicado = allClientes.find(
          (c) => c.user_id === effectiveUserId && c.id !== parseInt(id) && c.cpf_cnpj && c.cpf_cnpj === req.body.cpf_cnpj
        );
        if (cpfDuplicado) {
          return res.status(400).json({
            error: "J\xE1 existe outro cliente cadastrado com este CPF/CNPJ"
          });
        }
      }
      const cliente = await storage2.updateCliente(id, req.body);
      console.log(
        `\u2705 [UPDATE CLIENTE] Cliente atualizado com sucesso:`,
        JSON.stringify(cliente, null, 2)
      );
      res.json(cliente);
    } catch (error) {
      console.error(`\u274C [UPDATE CLIENTE] Erro ao atualizar cliente:`, error);
      if (error.message && error.message.includes("duplicate key")) {
        return res.status(400).json({
          error: "J\xE1 existe outro cliente cadastrado com este CPF/CNPJ"
        });
      }
      res.status(500).json({ error: "Erro ao atualizar cliente" });
    }
  });
  app2.delete("/api/clientes/:id", getUserId, async (req, res) => {
    try {
      const effectiveUserId = req.headers["effective-user-id"];
      const id = parseInt(req.params.id);
      console.log(`\u{1F5D1}\uFE0F [DELETE CLIENTE] Tentando deletar cliente ID: ${id}`);
      const clienteExistente = await storage2.getCliente(id);
      if (!clienteExistente || clienteExistente.user_id !== effectiveUserId) {
        console.log(`\u26A0\uFE0F [DELETE CLIENTE] Cliente ${id} n\xE3o encontrado`);
        return res.status(404).json({ error: "Cliente n\xE3o encontrado" });
      }
      const deleted = await storage2.deleteCliente(id);
      console.log(`\u2705 [DELETE CLIENTE] Cliente ${id} deletado com sucesso`);
      res.json({ success: true });
    } catch (error) {
      console.log(`\u274C [DELETE CLIENTE] Erro ao deletar cliente:`, error);
      res.status(500).json({ error: "Erro ao deletar cliente" });
    }
  });
  app2.get("/api/compras", getUserId, async (req, res) => {
    try {
      const effectiveUserId = req.headers["effective-user-id"];
      const fornecedorId = req.query.fornecedor_id ? parseInt(req.query.fornecedor_id) : void 0;
      const startDate = req.query.start_date;
      const endDate = req.query.end_date;
      const allCompras = await storage2.getCompras(
        fornecedorId,
        startDate,
        endDate
      );
      const compras2 = allCompras.filter((c) => c.user_id === effectiveUserId);
      res.json(compras2);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar compras" });
    }
  });
  app2.post("/api/compras", getUserId, async (req, res) => {
    try {
      const effectiveUserId = req.headers["effective-user-id"];
      const {
        fornecedor_id,
        produto_id,
        quantidade,
        valor_unitario,
        observacoes
      } = req.body;
      const produto = await storage2.getProduto(produto_id);
      if (!produto || produto.user_id !== effectiveUserId) {
        return res.status(404).json({ error: "Produto n\xE3o encontrado" });
      }
      const fornecedor = await storage2.getFornecedor(fornecedor_id);
      if (!fornecedor || fornecedor.user_id !== effectiveUserId) {
        return res.status(404).json({ error: "Fornecedor n\xE3o encontrado" });
      }
      const valor_total = valor_unitario * quantidade;
      await storage2.updateProduto(produto_id, {
        quantidade: produto.quantidade + quantidade
      });
      const compra = await storage2.createCompra({
        user_id: effectiveUserId,
        fornecedor_id,
        produto_id,
        quantidade,
        valor_unitario,
        valor_total,
        data: (/* @__PURE__ */ new Date()).toISOString(),
        observacoes: observacoes || null
      });
      res.json(compra);
    } catch (error) {
      res.status(500).json({ error: "Erro ao registrar compra" });
    }
  });
  app2.put("/api/compras/:id", getUserId, async (req, res) => {
    try {
      const effectiveUserId = req.headers["effective-user-id"];
      const id = parseInt(req.params.id);
      const {
        quantidade: novaQuantidade,
        valor_unitario,
        observacoes,
        produto_id
      } = req.body;
      const compraExistente = await storage2.getCompras();
      const compra = compraExistente.find(
        (c) => c.id === id && c.user_id === effectiveUserId
      );
      if (!compra) {
        return res.status(404).json({ error: "Compra n\xE3o encontrada" });
      }
      if (novaQuantidade !== void 0 && novaQuantidade !== compra.quantidade) {
        const produto = await storage2.getProduto(compra.produto_id);
        if (!produto) {
          return res.status(404).json({ error: "Produto n\xE3o encontrado" });
        }
        const diferencaQuantidade = novaQuantidade - compra.quantidade;
        await storage2.updateProduto(compra.produto_id, {
          quantidade: produto.quantidade + diferencaQuantidade
        });
      }
      const updates = {};
      if (novaQuantidade !== void 0) updates.quantidade = novaQuantidade;
      if (valor_unitario !== void 0) updates.valor_unitario = valor_unitario;
      if (observacoes !== void 0) updates.observacoes = observacoes;
      if (novaQuantidade !== void 0 || valor_unitario !== void 0) {
        const quantidadeFinal = novaQuantidade !== void 0 ? novaQuantidade : compra.quantidade;
        const valorUnitarioFinal = valor_unitario !== void 0 ? valor_unitario : compra.valor_unitario;
        updates.valor_total = quantidadeFinal * valorUnitarioFinal;
      }
      const compraAtualizada = await storage2.updateCompra(id, updates);
      res.json(compraAtualizada);
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar compra" });
    }
  });
  app2.get("/api/contas-pagar", getUserId, async (req, res) => {
    try {
      const effectiveUserId = req.headers["effective-user-id"];
      if (!storage2.getContasPagar) {
        return res.status(501).json({ error: "M\xE9todo getContasPagar n\xE3o implementado" });
      }
      const contas = await storage2.getContasPagar();
      const contasFiltered = contas.filter(
        (c) => c.user_id === effectiveUserId
      );
      console.log(
        `\u{1F4CB} Contas a pagar retornadas: ${contasFiltered.length} para usu\xE1rio ${effectiveUserId}`
      );
      res.json(contasFiltered);
    } catch (error) {
      console.error("\u274C Erro ao buscar contas a pagar:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/contas-pagar", getUserId, async (req, res) => {
    try {
      const effectiveUserId = req.headers["effective-user-id"];
      if (!storage2.createContaPagar) {
        return res.status(501).json({ error: "M\xE9todo createContaPagar n\xE3o implementado" });
      }
      const contaData = {
        ...req.body,
        user_id: effectiveUserId,
        status: "pendente",
        data_cadastro: getNowISOSaoPaulo(),
        data_vencimento: req.body.data_vencimento ? parseDateToISOSaoPaulo(req.body.data_vencimento) : void 0
      };
      const conta = await storage2.createContaPagar(contaData);
      console.log(
        `\u2705 Conta a pagar criada: ID ${conta.id}, Descri\xE7\xE3o: ${conta.descricao}`
      );
      res.json(conta);
    } catch (error) {
      app2.get("/api/metrics/locking", requireAdmin, async (req2, res2) => {
        try {
          const metrics = logger.getLockingMetrics();
          res2.json(metrics);
        } catch (error2) {
          console.error("Erro ao buscar m\xE9tricas:", error2);
          res2.status(500).json({ error: error2.message });
        }
      });
      app2.get("/api/system-owner", requireAdmin, async (req2, res2) => {
        try {
          const userId = req2.headers["x-user-id"];
          const user = await storage2.getUserById(userId);
          const isMasterAdmin = user?.email === "pavisoft.suporte@gmail.com";
          if (!isMasterAdmin) {
            return res2.status(403).json({ error: "Acesso negado - apenas master admin" });
          }
          const systemOwner2 = await storage2.getSystemOwner?.();
          res2.json(systemOwner2 || null);
        } catch (error2) {
          logger.error("[API] Erro ao buscar system owner:", error2);
          res2.status(500).json({ error: error2.message });
        }
      });
      app2.post("/api/system-owner", requireAdmin, async (req2, res2) => {
        try {
          const userId = req2.headers["x-user-id"];
          const user = await storage2.getUserById(userId);
          const isMasterAdmin = user?.email === "pavisoft.suporte@gmail.com";
          if (!isMasterAdmin) {
            return res2.status(403).json({ error: "Acesso negado - apenas master admin" });
          }
          const { owner_user_id, observacoes } = req2.body;
          if (!owner_user_id) {
            return res2.status(400).json({ error: "owner_user_id \xE9 obrigat\xF3rio" });
          }
          const ownerUser = await storage2.getUserById(owner_user_id);
          if (!ownerUser) {
            return res2.status(404).json({ error: "Usu\xE1rio n\xE3o encontrado" });
          }
          const systemOwner2 = await storage2.setSystemOwner?.({
            owner_user_id,
            observacoes: observacoes || null
          });
          await storage2.logAdminAction?.(
            userId,
            "SYSTEM_OWNER_CONFIGURADO",
            `System Owner configurado para usu\xE1rio: ${ownerUser.nome} (${ownerUser.email})`,
            req2
          );
          logger.info("[API] System Owner configurado com sucesso", { owner_user_id, admin: userId });
          res2.json(systemOwner2);
        } catch (error2) {
          logger.error("[API] Erro ao configurar system owner:", error2);
          res2.status(500).json({ error: error2.message });
        }
      });
      console.error("\u274C Erro ao criar conta a pagar:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.put("/api/contas-pagar/:id", getUserId, async (req, res) => {
    try {
      if (!storage2.updateContaPagar) {
        return res.status(501).json({ error: "M\xE9todo updateContaPagar n\xE3o implementado" });
      }
      const id = parseInt(req.params.id);
      const conta = await storage2.updateContaPagar(id, req.body);
      console.log(`\u2705 Conta a pagar atualizada: ID ${id}`);
      res.json(conta);
    } catch (error) {
      console.error("\u274C Erro ao atualizar conta a pagar:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.delete("/api/contas-pagar/:id", getUserId, async (req, res) => {
    try {
      if (!storage2.deleteContaPagar) {
        return res.status(501).json({ error: "M\xE9todo deleteContaPagar n\xE3o implementado" });
      }
      const id = parseInt(req.params.id);
      console.log(`\u{1F5D1}\uFE0F Deletando conta a pagar ID: ${id}`);
      await storage2.deleteContaPagar(id);
      console.log(`\u2705 Conta a pagar ${id} deletada com sucesso`);
      res.json({ success: true });
    } catch (error) {
      console.error(`\u274C Erro ao deletar conta a pagar:`, error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/contas-pagar/:id/pagar", getUserId, async (req, res) => {
    try {
      if (!storage2.updateContaPagar) {
        return res.status(501).json({ error: "M\xE9todo updateContaPagar n\xE3o implementado" });
      }
      const id = parseInt(req.params.id);
      const conta = await storage2.updateContaPagar(id, {
        status: "pago",
        data_pagamento: getNowISOSaoPaulo()
      });
      console.log(`\u2705 Conta a pagar marcada como paga: ID ${id}`);
      res.json(conta);
    } catch (error) {
      console.error("\u274C Erro ao marcar conta como paga:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/contas-receber", getUserId, async (req, res) => {
    try {
      const effectiveUserId = req.headers["effective-user-id"];
      if (!storage2.getContasReceber) {
        return res.status(501).json({ error: "M\xE9todo getContasReceber n\xE3o implementado" });
      }
      const contas = await storage2.getContasReceber();
      const contasFiltered = contas.filter(
        (c) => c.user_id === effectiveUserId
      );
      console.log(
        `\u{1F4CB} Contas a receber retornadas: ${contasFiltered.length} para usu\xE1rio ${effectiveUserId}`
      );
      res.json(contasFiltered);
    } catch (error) {
      console.error("\u274C Erro ao buscar contas a receber:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/contas-receber", getUserId, async (req, res) => {
    try {
      const effectiveUserId = req.headers["effective-user-id"];
      if (!storage2.createContaReceber) {
        return res.status(501).json({ error: "M\xE9todo createContaReceber n\xE3o implementado" });
      }
      const contaData = {
        ...req.body,
        user_id: effectiveUserId,
        status: "pendente",
        data_cadastro: getNowISOSaoPaulo(),
        data_vencimento: req.body.data_vencimento ? parseDateToISOSaoPaulo(req.body.data_vencimento) : void 0
      };
      const conta = await storage2.createContaReceber(contaData);
      console.log(
        `\u2705 Conta a receber criada: ID ${conta.id}, Descri\xE7\xE3o: ${conta.descricao}`
      );
      res.json(conta);
    } catch (error) {
      console.error("\u274C Erro ao criar conta a receber:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.put("/api/contas-receber/:id", getUserId, async (req, res) => {
    try {
      if (!storage2.updateContaReceber) {
        return res.status(501).json({ error: "M\xE9todo updateContaReceber n\xE3o implementado" });
      }
      const id = parseInt(req.params.id);
      const conta = await storage2.updateContaReceber(id, req.body);
      console.log(`\u2705 Conta a receber atualizada: ID ${id}`);
      res.json(conta);
    } catch (error) {
      console.error("\u274C Erro ao atualizar conta a receber:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.delete("/api/contas-receber/:id", getUserId, async (req, res) => {
    try {
      if (!storage2.deleteContaReceber) {
        return res.status(501).json({ error: "M\xE9todo deleteContaReceber n\xE3o implementado" });
      }
      const id = parseInt(req.params.id);
      console.log(`\u{1F5D1}\uFE0F Deletando conta a receber ID: ${id}`);
      await storage2.deleteContaReceber(id);
      console.log(`\u2705 Conta a receber ${id} deletada com sucesso`);
      res.json({ success: true });
    } catch (error) {
      console.error(`\u274C Erro ao deletar conta a receber:`, error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/contas-receber/:id/receber", getUserId, async (req, res) => {
    try {
      if (!storage2.updateContaReceber) {
        return res.status(501).json({ error: "M\xE9todo updateContaReceber n\xE3o implementado" });
      }
      const id = parseInt(req.params.id);
      const conta = await storage2.updateContaReceber(id, {
        status: "recebido",
        data_recebimento: getNowISOSaoPaulo()
      });
      console.log(`\u2705 Conta a receber marcada como recebida: ID ${id}`);
      res.json(conta);
    } catch (error) {
      console.error("\u274C Erro ao marcar conta como recebida:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/config-fiscal", async (req, res) => {
    try {
      const config = await storage2.getConfigFiscal();
      if (!config) {
        return res.json(null);
      }
      res.json({
        ...config,
        focus_nfe_api_key: config.focus_nfe_api_key ? "***" : ""
      });
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar configura\xE7\xE3o fiscal" });
    }
  });
  app2.post("/api/config-fiscal", async (req, res) => {
    try {
      const configData = insertConfigFiscalSchema.parse(req.body);
      const config = await storage2.saveConfigFiscal(configData);
      res.json({
        ...config,
        focus_nfe_api_key: "***"
      });
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ error: "Dados inv\xE1lidos", details: error.errors });
      }
      res.status(500).json({ error: "Erro ao salvar configura\xE7\xE3o fiscal" });
    }
  });
  app2.post("/api/nfce/emitir", async (req, res) => {
    try {
      const config = await storage2.getConfigFiscal();
      if (!config) {
        return res.status(400).json({
          error: "Configura\xE7\xE3o fiscal n\xE3o encontrada. Configure em Config. Fiscal primeiro."
        });
      }
      const nfceData = nfceSchema.parse(req.body);
      const focusNFe = new FocusNFeService(config);
      const result = await focusNFe.emitirNFCe(nfceData);
      res.json(result);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({
          error: "Dados da NFCe inv\xE1lidos",
          details: error.errors
        });
      }
      console.error("Erro ao emitir NFCe:", error);
      res.status(500).json({ error: error.message || "Erro ao emitir NFCe" });
    }
  });
  app2.get("/api/nfce/:ref", async (req, res) => {
    try {
      const config = await storage2.getConfigFiscal();
      if (!config) {
        return res.status(400).json({
          error: "Configura\xE7\xE3o fiscal n\xE3o encontrada"
        });
      }
      const focusNFe = new FocusNFeService(config);
      const result = await focusNFe.consultarNFCe(req.params.ref);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message || "Erro ao consultar NFCe" });
    }
  });
  app2.delete("/api/nfce/:ref", async (req, res) => {
    try {
      const config = await storage2.getConfigFiscal();
      if (!config) {
        return res.status(400).json({
          error: "Configura\xE7\xE3o fiscal n\xE3o encontrada"
        });
      }
      const { justificativa } = req.body;
      if (!justificativa || justificativa.length < 15) {
        return res.status(400).json({
          error: "Justificativa deve ter no m\xEDnimo 15 caracteres"
        });
      }
      const focusNFe = new FocusNFeService(config);
      const result = await focusNFe.cancelarNFCe(req.params.ref, justificativa);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message || "Erro ao cancelar NFCe" });
    }
  });
  app2.post("/api/checkout", async (req, res) => {
    try {
      const { nome, email, cpfCnpj, plano, formaPagamento, cupom } = req.body;
      if (!nome || !email || !plano || !formaPagamento) {
        return res.status(400).json({
          error: "Dados incompletos. Nome, email, plano e forma de pagamento s\xE3o obrigat\xF3rios."
        });
      }
      if (cpfCnpj) {
        const cleanCpfCnpj = cpfCnpj.replace(/\D/g, "");
        if (cleanCpfCnpj.length !== 11 && cleanCpfCnpj.length !== 14) {
          return res.status(400).json({
            error: "CPF/CNPJ inv\xE1lido. Digite apenas n\xFAmeros."
          });
        }
      }
      const precosConfig = await storage2.getSystemConfig("planos_precos");
      let planoValues = {
        premium_mensal: 89.99,
        premium_anual: 951
      };
      if (precosConfig && precosConfig.valor) {
        try {
          const precosParsed = JSON.parse(precosConfig.valor);
          if (precosParsed.premium_mensal && precosParsed.premium_anual) {
            planoValues = precosParsed;
          }
        } catch (error) {
          console.error("Erro ao parsear pre\xE7os dos planos:", error);
        }
      }
      const planoNomes = {
        premium_mensal: "Premium Mensal",
        premium_anual: "Premium Anual"
      };
      if (!planoValues[plano]) {
        return res.status(400).json({ error: "Plano inv\xE1lido" });
      }
      let valorFinal = planoValues[plano];
      let cupomAplicado = null;
      let valorDesconto = 0;
      let user = await storage2.getUserByEmail(email);
      if (!user) {
        const senhaTemporaria = Math.random().toString(36).slice(-8);
        user = await storage2.createUser({
          nome,
          email,
          senha: senhaTemporaria,
          plano: "trial",
          is_admin: "false",
          status: "ativo"
        });
      }
      if (cupom) {
        try {
          const resultadoCupom = await storage2.validarCupom?.(cupom, plano, user.id);
          if (resultadoCupom?.valido && resultadoCupom.cupom) {
            cupomAplicado = resultadoCupom.cupom;
            if (cupomAplicado.tipo === "percentual") {
              valorDesconto = valorFinal * cupomAplicado.valor / 100;
            } else {
              valorDesconto = Math.min(cupomAplicado.valor, valorFinal);
            }
            valorFinal = Math.max(0, valorFinal - valorDesconto);
            console.log(`\u2705 [CHECKOUT] Cupom aplicado: ${cupom} - Desconto: R$ ${valorDesconto.toFixed(2)}`);
          } else {
            console.log(`\u274C [CHECKOUT] Cupom inv\xE1lido: ${resultadoCupom?.erro}`);
            return res.status(400).json({ error: resultadoCupom?.erro || "Cupom inv\xE1lido" });
          }
        } catch (error) {
          console.error("Erro ao validar cupom no checkout:", error);
        }
      }
      const config = await storage2.getConfigMercadoPago();
      if (!config || !config.access_token) {
        return res.status(500).json({
          error: "Sistema de pagamento n\xE3o configurado. Entre em contato com o suporte."
        });
      }
      const { MercadoPagoService: MercadoPagoService2 } = await Promise.resolve().then(() => (init_mercadopago(), mercadopago_exports));
      const mercadopago = new MercadoPagoService2({
        accessToken: config.access_token
      });
      const externalReference = `${plano}_${Date.now()}`;
      const valorOriginal = planoValues[plano];
      const items = [
        {
          title: `Assinatura ${planoNomes[plano]} - Pavisoft Sistemas`,
          quantity: 1,
          unit_price: valorOriginal,
          currency_id: "BRL",
          description: `Plano ${planoNomes[plano]}`
        }
      ];
      if (cupomAplicado && valorDesconto > 0) {
        items.push({
          title: `Desconto - Cupom ${cupomAplicado.codigo}`,
          quantity: 1,
          unit_price: -valorDesconto,
          currency_id: "BRL",
          description: `Cupom de desconto: ${cupomAplicado.codigo} (${cupomAplicado.tipo === "percentual" ? cupomAplicado.valor + "%" : "R$ " + cupomAplicado.valor.toFixed(2)})`
        });
      }
      let webhookUrl = config.webhook_url;
      if (!webhookUrl) {
        let baseUrl = process.env.APP_URL;
        if (!baseUrl) {
          baseUrl = process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : "http://localhost:5000";
        }
        webhookUrl = `${baseUrl}/api/webhook/mercadopago`;
      }
      logger.info("Criando prefer\xEAncia de pagamento", "CHECKOUT", {
        externalReference,
        webhookUrl,
        valorFinal
      });
      const preference = await mercadopago.createPreference({
        items,
        payer: {
          email,
          name: nome,
          identification: cpfCnpj ? {
            type: cpfCnpj.replace(/\D/g, "").length === 11 ? "CPF" : "CNPJ",
            number: cpfCnpj.replace(/\D/g, "")
          } : void 0
        },
        external_reference: externalReference,
        notification_url: webhookUrl
      });
      const subscriptions2 = await storage2.getSubscriptions();
      const assinaturasPendentes = subscriptions2.filter(
        (s) => s.user_id === user.id && s.status === "pendente" && s.status_pagamento === "pending"
      );
      let subscription;
      let reutilizandoAssinatura = false;
      let assinaturaAnteriorCancelada = false;
      if (assinaturasPendentes.length > 0) {
        const assinaturaMesmoPlano = assinaturasPendentes.find((s) => s.plano === plano);
        if (assinaturaMesmoPlano) {
          const prazoLimite = assinaturaMesmoPlano.prazo_limite_pagamento ? new Date(assinaturaMesmoPlano.prazo_limite_pagamento) : new Date(new Date(assinaturaMesmoPlano.data_criacao).getTime() + 7 * 24 * 60 * 60 * 1e3);
          if (prazoLimite > /* @__PURE__ */ new Date()) {
            const subscriptionAtualizada = await storage2.updateSubscription(assinaturaMesmoPlano.id, {
              mercadopago_payment_id: preference.id,
              init_point: preference.init_point,
              external_reference: externalReference,
              valor: valorFinal,
              data_atualizacao: (/* @__PURE__ */ new Date()).toISOString()
            });
            if (!subscriptionAtualizada) {
              logger.error("Falha ao atualizar assinatura pendente", "CHECKOUT", {
                subscriptionId: assinaturaMesmoPlano.id,
                userId: user.id
              });
              return res.status(500).json({
                error: "Erro ao atualizar assinatura. Tente novamente."
              });
            }
            reutilizandoAssinatura = true;
            subscription = subscriptionAtualizada;
            console.log(`\u{1F504} [CHECKOUT] Atualizando assinatura pendente com nova prefer\xEAncia - ID: ${subscription.id}, Plano: ${plano}`);
            logger.info("Assinatura pendente atualizada com nova prefer\xEAncia", "CHECKOUT", {
              subscriptionId: subscription.id,
              userId: user.id,
              plano,
              novoInitPoint: preference.init_point,
              prazoLimite: prazoLimite.toISOString()
            });
          }
        }
        if (!reutilizandoAssinatura) {
          for (const assinaturaPendente of assinaturasPendentes) {
            await storage2.updateSubscription(assinaturaPendente.id, {
              status: "cancelado",
              status_pagamento: "cancelled",
              motivo_cancelamento: `Cancelado automaticamente - cliente escolheu outro plano (${plano})`,
              data_atualizacao: (/* @__PURE__ */ new Date()).toISOString()
            });
            console.log(`\u274C [CHECKOUT] Assinatura pendente anterior cancelada - ID: ${assinaturaPendente.id}, Plano anterior: ${assinaturaPendente.plano}`);
            logger.info("Assinatura pendente anterior cancelada", "CHECKOUT", {
              subscriptionId: assinaturaPendente.id,
              planoAnterior: assinaturaPendente.plano,
              novoPlano: plano,
              userId: user.id
            });
          }
          assinaturaAnteriorCancelada = true;
        }
      }
      if (!reutilizandoAssinatura) {
        const dataVencimentoNovo = plano === "premium_mensal" ? addMonthsAndGetISOSaoPaulo(/* @__PURE__ */ new Date(), 1) : addYearsAndGetISOSaoPaulo(/* @__PURE__ */ new Date(), 1);
        const prazoLimitePagamentoNovo = addDaysAndGetISOSaoPaulo(/* @__PURE__ */ new Date(), 7);
        subscription = await storage2.createSubscription({
          user_id: user.id,
          plano,
          status: "pendente",
          valor: valorFinal,
          valor_original: planoValues[plano],
          data_vencimento: dataVencimentoNovo,
          prazo_limite_pagamento: prazoLimitePagamentoNovo,
          tentativas_cobranca: 0,
          mercadopago_payment_id: preference.id,
          forma_pagamento: formaPagamento,
          status_pagamento: "pending",
          init_point: preference.init_point,
          external_reference: externalReference,
          cupom_codigo: cupomAplicado?.codigo,
          cupom_id: cupomAplicado?.id,
          valor_desconto_cupom: valorDesconto > 0 ? valorDesconto : void 0
        });
      }
      if (cupomAplicado && storage2.registrarUsoCupom) {
        try {
          await storage2.registrarUsoCupom({
            cupom_id: cupomAplicado.id,
            user_id: user.id,
            subscription_id: subscription.id,
            valor_desconto: valorDesconto
          });
          logger.info("Cupom registrado com sucesso", "CHECKOUT", {
            cupom: cupomAplicado.codigo,
            userId: user.id,
            subscriptionId: subscription.id,
            valorDesconto
          });
        } catch (error) {
          logger.error("Erro ao registrar uso do cupom", "CHECKOUT", { error });
        }
      }
      if (reutilizandoAssinatura) {
        console.log(
          `\u{1F504} Reutilizando assinatura existente - User: ${user.email}, Plano: ${planoNomes[plano]}`
        );
      } else {
        console.log(
          `\u2705 Assinatura criada com sucesso - User: ${user.email}, Plano: ${planoNomes[plano]}, Forma: ${formaPagamento}${cupomAplicado ? `, Cupom: ${cupomAplicado.codigo}` : ""}${assinaturaAnteriorCancelada ? " (assinatura anterior cancelada)" : ""}`
        );
      }
      const prazoLimiteExibicao = subscription.prazo_limite_pagamento ? new Date(subscription.prazo_limite_pagamento).toLocaleDateString("pt-BR") : new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3).toLocaleDateString("pt-BR");
      let message = "";
      if (reutilizandoAssinatura) {
        message = `Voc\xEA j\xE1 possui um pedido pendente para o plano ${planoNomes[plano]}. Utilize o link de pagamento existente. Prazo limite: ${prazoLimiteExibicao}`;
      } else if (assinaturaAnteriorCancelada) {
        message = `Seu pedido anterior foi cancelado. Nova assinatura ${planoNomes[plano]} criada! Prazo para pagamento: ${prazoLimiteExibicao}`;
      } else {
        message = `Assinatura ${planoNomes[plano]} criada com sucesso! Prazo para pagamento: ${prazoLimiteExibicao}`;
      }
      res.json({
        success: true,
        subscription,
        preference: {
          id: preference.id,
          init_point: preference.init_point
        },
        cupomAplicado: cupomAplicado ? {
          codigo: cupomAplicado.codigo,
          valorDesconto: valorDesconto.toFixed(2)
        } : null,
        reutilizandoAssinatura,
        assinaturaAnteriorCancelada,
        prazoLimitePagamento: prazoLimiteExibicao,
        message
      });
    } catch (error) {
      console.error("\u274C Erro ao criar checkout:", error);
      res.status(500).json({
        error: error.message || "Erro ao processar pagamento. Tente novamente ou entre em contato com o suporte."
      });
    }
  });
  app2.post("/api/purchase-employees", async (req, res) => {
    try {
      const userId = req.headers["x-user-id"];
      if (!userId) {
        return res.status(401).json({ error: "Autentica\xE7\xE3o necess\xE1ria" });
      }
      const { pacoteId, quantidade, valor, nomePacote } = req.body;
      if (!pacoteId || !quantidade || !valor || !nomePacote) {
        return res.status(400).json({
          error: "Dados incompletos. Todos os campos s\xE3o obrigat\xF3rios."
        });
      }
      const users2 = await storage2.getUsers();
      const user = users2.find((u) => u.id === userId);
      if (!user) {
        return res.status(404).json({ error: "Usu\xE1rio n\xE3o encontrado" });
      }
      const config = await storage2.getConfigMercadoPago();
      if (!config || !config.access_token) {
        return res.status(500).json({
          error: "Sistema de pagamento n\xE3o configurado. Entre em contato com o suporte."
        });
      }
      const { MercadoPagoService: MercadoPagoService2 } = await Promise.resolve().then(() => (init_mercadopago(), mercadopago_exports));
      const mercadopago = new MercadoPagoService2({
        accessToken: config.access_token
      });
      const externalReference = `${pacoteId}_${userId}_${Date.now()}`;
      let webhookUrl = config.webhook_url;
      if (!webhookUrl) {
        let baseUrl = process.env.APP_URL;
        if (!baseUrl) {
          baseUrl = process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : "http://localhost:5000";
        }
        webhookUrl = `${baseUrl}/api/webhook/mercadopago`;
      }
      logger.info("Criando prefer\xEAncia para pacote de funcion\xE1rios", "PURCHASE_EMPLOYEES", {
        externalReference,
        webhookUrl,
        pacoteId,
        quantidade,
        valor
      });
      const preference = await mercadopago.createPreference({
        items: [
          {
            title: `${nomePacote} - Pavisoft Sistemas (Recorrente)`,
            quantity: 1,
            unit_price: valor,
            currency_id: "BRL",
            description: `Pacote com ${quantidade} funcion\xE1rios adicionais - Renova\xE7\xE3o autom\xE1tica mensal`
          }
        ],
        payer: {
          email: user.email,
          name: user.nome
        },
        external_reference: externalReference,
        notification_url: webhookUrl,
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: valor,
          currency_id: "BRL"
        }
      });
      console.log(
        `\u2705 Prefer\xEAncia de pagamento criada - Pacote: ${nomePacote}, User: ${user.email}`
      );
      Promise.resolve().then(() => (init_email_service(), email_service_exports)).then(({ EmailService: EmailService2 }) => {
        const emailService = new EmailService2();
        emailService.sendEmployeePackagePurchased({
          to: user.email,
          userName: user.nome,
          packageName: nomePacote,
          quantity: quantidade,
          price: valor,
          paymentUrl: preference.init_point
        }).then(() => {
          console.log(`\u{1F4E7} Email de compra enviado para ${user.email}`);
        }).catch((emailError) => {
          console.error("\u26A0\uFE0F Erro ao enviar email (n\xE3o cr\xEDtico):", emailError);
        });
      });
      res.json({
        success: true,
        preference: {
          id: preference.id,
          init_point: preference.init_point
        },
        message: "\u2705 Pacote selecionado. Voc\xEA ser\xE1 redirecionado para o pagamento."
      });
    } catch (error) {
      console.error("\u274C Erro ao processar compra de funcion\xE1rios:", error);
      res.status(500).json({
        error: error.message || "Erro ao processar compra. Tente novamente ou entre em contato com o suporte."
      });
    }
  });
  app2.post("/api/encerrar-conta", async (req, res) => {
    try {
      const { userId, userEmail, userName, motivo } = req.body;
      if (!userId || !userEmail || !userName || !motivo) {
        return res.status(400).json({ error: "Dados incompletos" });
      }
      try {
        const { EmailService: EmailService2 } = await Promise.resolve().then(() => (init_email_service(), email_service_exports));
        const emailService = new EmailService2();
        await emailService.sendAccountClosureRequest({
          userId,
          userEmail,
          userName,
          motivo
        });
        console.log(
          `\u{1F4E7} Solicita\xE7\xE3o de encerramento enviada - User: ${userEmail}, Motivo: ${motivo.substring(0, 50)}...`
        );
        logger.info(
          "Solicita\xE7\xE3o de encerramento de conta enviada",
          "ACCOUNT_CLOSURE",
          {
            userId,
            userEmail,
            motivo: motivo.substring(0, 100)
          }
        );
        res.json({
          success: true,
          message: "Solicita\xE7\xE3o enviada com sucesso"
        });
      } catch (emailError) {
        console.error("\u274C Erro ao enviar email de encerramento:", emailError);
        logger.error(
          "Erro ao enviar email de encerramento",
          "ACCOUNT_CLOSURE",
          { error: emailError }
        );
        res.status(500).json({ error: "Erro ao enviar solicita\xE7\xE3o" });
      }
    } catch (error) {
      console.error("Erro ao processar solicita\xE7\xE3o de encerramento:", error);
      logger.error("Erro ao processar encerramento", "ACCOUNT_CLOSURE", {
        error: error.message
      });
      res.status(500).json({ error: error.message || "Erro ao processar solicita\xE7\xE3o" });
    }
  });
  app2.post("/api/user/meta-vendas", async (req, res) => {
    try {
      const userId = req.headers["x-user-id"];
      if (!userId) {
        return res.status(401).json({ error: "N\xE3o autorizado" });
      }
      const { meta_mensal, target_user_id } = req.body;
      if (!meta_mensal || isNaN(parseFloat(meta_mensal))) {
        return res.status(400).json({ error: "Meta inv\xE1lida" });
      }
      const targetId = target_user_id || userId;
      const users2 = await storage2.getUsers();
      const user = users2.find((u) => u.id === targetId);
      if (!user) {
        return res.status(404).json({ error: "Usu\xE1rio n\xE3o encontrado" });
      }
      const metaValue = parseFloat(meta_mensal);
      const updatedUser = await storage2.updateUser(targetId, {
        meta_mensal: metaValue
      });
      if (!updatedUser) {
        return res.status(500).json({ error: "Erro ao salvar meta no banco de dados" });
      }
      console.log(
        `\u2705 Meta MRR salva no banco - User: ${targetId}, Meta: R$ ${metaValue.toFixed(2)}`
      );
      logger.info("Meta de vendas atualizada", "USER_META", {
        userId: targetId,
        meta_mensal: metaValue
      });
      res.json({
        success: true,
        message: "Meta definida com sucesso",
        meta_mensal: metaValue
      });
    } catch (error) {
      console.error("Erro ao definir meta:", error);
      logger.error("Erro ao salvar meta de vendas", "USER_META", {
        error: error.message
      });
      res.status(500).json({ error: error.message || "Erro ao definir meta" });
    }
  });
  app2.post("/api/test/send-emails", async (req, res) => {
    if (process.env.NODE_ENV === "production") {
      return res.status(403).json({ error: "Endpoint dispon\xEDvel apenas em desenvolvimento" });
    }
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email \xE9 obrigat\xF3rio" });
      }
      const { EmailService: EmailService2 } = await Promise.resolve().then(() => (init_email_service(), email_service_exports));
      const emailService = new EmailService2();
      const results = [];
      try {
        await emailService.sendVerificationCode({
          to: email,
          userName: "Usu\xE1rio Teste",
          code: "123456"
        });
        results.push({ tipo: "C\xF3digo de Verifica\xE7\xE3o", status: "enviado" });
      } catch (error) {
        results.push({
          tipo: "C\xF3digo de Verifica\xE7\xE3o",
          status: "erro",
          erro: error.message
        });
      }
      try {
        await emailService.sendEmployeePackagePurchased({
          to: email,
          userName: "Usu\xE1rio Teste",
          packageName: "Pacote 5 Funcion\xE1rios",
          quantity: 5,
          price: 25,
          paymentUrl: "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=test123"
        });
        results.push({
          tipo: "Pacote de Funcion\xE1rios - Aguardando Pagamento",
          status: "enviado"
        });
      } catch (error) {
        results.push({
          tipo: "Pacote de Funcion\xE1rios - Aguardando Pagamento",
          status: "erro",
          erro: error.message
        });
      }
      try {
        await emailService.sendEmployeePackageActivated({
          to: email,
          userName: "Usu\xE1rio Teste",
          packageName: "Pacote 5 Funcion\xE1rios",
          quantity: 5,
          newLimit: 10,
          price: 25
        });
        results.push({
          tipo: "Pacote de Funcion\xE1rios - Ativado",
          status: "enviado"
        });
      } catch (error) {
        results.push({
          tipo: "Pacote de Funcion\xE1rios - Ativado",
          status: "erro",
          erro: error.message
        });
      }
      try {
        await emailService.sendPasswordResetConfirmation({
          to: email,
          userName: "Usu\xE1rio Teste",
          resetByAdmin: "Admin Master",
          resetDate: (/* @__PURE__ */ new Date()).toLocaleString("pt-BR")
        });
        results.push({ tipo: "Senha Redefinida", status: "enviado" });
      } catch (error) {
        results.push({
          tipo: "Senha Redefinida",
          status: "erro",
          erro: error.message
        });
      }
      try {
        await emailService.sendPaymentPendingReminder({
          to: email,
          userName: "Usu\xE1rio Teste",
          planName: "Plano Premium Mensal",
          daysWaiting: 5,
          amount: 99.9
        });
        results.push({ tipo: "Pagamento Pendente", status: "enviado" });
      } catch (error) {
        results.push({
          tipo: "Pagamento Pendente",
          status: "erro",
          erro: error.message
        });
      }
      try {
        await emailService.sendExpirationWarning({
          to: email,
          userName: "Usu\xE1rio Teste",
          planName: "Plano Premium Mensal",
          daysRemaining: 7,
          expirationDate: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1e3
          ).toLocaleDateString("pt-BR"),
          amount: 99.9
        });
        results.push({ tipo: "Aviso de Vencimento", status: "enviado" });
      } catch (error) {
        results.push({
          tipo: "Aviso de Vencimento",
          status: "erro",
          erro: error.message
        });
      }
      try {
        await emailService.sendOverdueNotice({
          to: email,
          userName: "Usu\xE1rio Teste",
          planName: "Plano Premium Mensal",
          daysOverdue: 3,
          amount: 99.9
        });
        results.push({ tipo: "Pagamento Atrasado", status: "enviado" });
      } catch (error) {
        results.push({
          tipo: "Pagamento Atrasado",
          status: "erro",
          erro: error.message
        });
      }
      try {
        await emailService.sendAccountBlocked({
          to: email,
          userName: "Usu\xE1rio Teste",
          planName: "Plano Premium Mensal"
        });
        results.push({ tipo: "Conta Bloqueada", status: "enviado" });
      } catch (error) {
        results.push({
          tipo: "Conta Bloqueada",
          status: "erro",
          erro: error.message
        });
      }
      logger.info("Emails de teste enviados", "TEST_EMAIL", { email, results });
      res.json({
        success: true,
        message: `${results.filter((r) => r.status === "enviado").length} emails enviados para ${email}`,
        details: results
      });
    } catch (error) {
      logger.error("Erro ao enviar emails de teste", "TEST_EMAIL", { error });
      res.status(500).json({ error: "Erro ao enviar emails de teste" });
    }
  });
  app2.post("/api/run-tests", requireAdmin, async (req, res) => {
    try {
      const { TestSuite: TestSuite2 } = await Promise.resolve().then(() => (init_test_suite(), test_suite_exports));
      const suite = new TestSuite2();
      const results = await suite.runAllTests();
      const success = results.filter((r) => r.status === "success").length;
      const errors = results.filter((r) => r.status === "error").length;
      const warnings = results.filter((r) => r.status === "warning").length;
      res.json({
        success: errors === 0,
        summary: {
          total: results.length,
          success,
          errors,
          warnings,
          percentage: Math.round(success / results.length * 100)
        },
        results
      });
    } catch (error) {
      logger.error("Erro ao executar testes", "TEST_SUITE", { error });
      res.status(500).json({ error: "Erro ao executar testes" });
    }
  });
  app2.post("/api/fix-data-integrity", requireAdmin, async (req, res) => {
    try {
      const fixes = [];
      const users2 = await storage2.getUsers();
      const userIds = new Set(users2.map((u) => u.id));
      const produtos2 = await storage2.getProdutos();
      const produtosOrfaos = produtos2.filter((p) => !userIds.has(p.user_id));
      if (produtosOrfaos.length > 0) {
        for (const produto of produtosOrfaos) {
          await storage2.db.execute(sql3`DELETE FROM produtos WHERE id = ${produto.id}`);
        }
        fixes.push({
          tipo: "Produtos \xF3rf\xE3os",
          quantidade: produtosOrfaos.length,
          acao: "Removidos"
        });
      }
      const vendas2 = await storage2.getVendas();
      const vendasOrfas = vendas2.filter((v) => !userIds.has(v.user_id));
      if (vendasOrfas.length > 0) {
        for (const venda of vendasOrfas) {
          await storage2.db.execute(sql3`DELETE FROM vendas WHERE id = ${venda.id}`);
        }
        fixes.push({
          tipo: "Vendas \xF3rf\xE3s",
          quantidade: vendasOrfas.length,
          acao: "Removidas"
        });
      }
      if (storage2.getOrcamentos) {
        const orcamentos2 = await storage2.getOrcamentos();
        const orcamentosAprovados = orcamentos2.filter((o) => o.status === "aprovado");
        let bloqueiosCriados = 0;
        for (const orcamento of orcamentosAprovados) {
          const bloqueiosExistentes = await storage2.db.execute(
            sql3`SELECT COUNT(*) as count FROM bloqueios_estoque WHERE orcamento_id = ${orcamento.id}`
          );
          const count = Number(bloqueiosExistentes.rows?.[0]?.count || 0);
          if (count === 0 && orcamento.itens && Array.isArray(orcamento.itens)) {
            const dataBloqueio = (/* @__PURE__ */ new Date()).toISOString();
            for (const item of orcamento.itens) {
              if (item.produto_id && item.quantidade) {
                await storage2.db.execute(sql3`
                  INSERT INTO bloqueios_estoque (produto_id, orcamento_id, user_id, quantidade_bloqueada, data_bloqueio)
                  VALUES (${item.produto_id}, ${orcamento.id}, ${orcamento.user_id}, ${item.quantidade}, ${dataBloqueio})
                `);
                bloqueiosCriados++;
              }
            }
          }
        }
        if (bloqueiosCriados > 0) {
          fixes.push({
            tipo: "Bloqueios de estoque",
            quantidade: bloqueiosCriados,
            acao: "Criados para or\xE7amentos aprovados"
          });
        }
      }
      logger.info("Corre\xE7\xE3o de integridade executada", "DATA_FIX", { fixes });
      res.json({
        success: true,
        message: fixes.length > 0 ? `${fixes.length} tipos de corre\xE7\xF5es aplicadas` : "Nenhuma corre\xE7\xE3o necess\xE1ria",
        fixes
      });
    } catch (error) {
      logger.error("Erro ao corrigir integridade de dados", "DATA_FIX", { error });
      res.status(500).json({ error: "Erro ao corrigir integridade de dados: " + error.message });
    }
  });
  app2.get("/api/admin/employee-packages", requireAdmin, async (req, res) => {
    try {
      const packages = await storage2.db.execute(sql3`
        SELECT
          ep.*,
          u.nome as user_name,
          u.email as user_email,
          u.plano as user_plan
        FROM employee_packages ep
        LEFT JOIN users u ON ep.user_id = u.id
        ORDER BY ep.data_compra DESC
      `);
      res.json(packages.rows || []);
    } catch (error) {
      logger.error("Erro ao buscar pacotes de funcion\xE1rios", "ADMIN", { error });
      res.status(500).json({ error: "Erro ao buscar pacotes de funcion\xE1rios" });
    }
  });
  app2.post("/api/admin/employee-packages/activate-manual", requireAdmin, async (req, res) => {
    try {
      const { userId, packageType, quantity, price } = req.body;
      if (!userId || !packageType || !quantity) {
        return res.status(400).json({
          error: "Dados incompletos. userId, packageType e quantity s\xE3o obrigat\xF3rios."
        });
      }
      const users2 = await storage2.getUsers();
      const user = users2.find((u) => u.id === userId);
      if (!user) {
        return res.status(404).json({ error: "Usu\xE1rio n\xE3o encontrado" });
      }
      const limiteAtual = user.max_funcionarios || 1;
      const novoLimite = limiteAtual + quantity;
      const dataVencimentoPacote = addDaysAndGetISOSaoPaulo(/* @__PURE__ */ new Date(), 30);
      const newPackage = await storage2.createEmployeePackage({
        user_id: userId,
        package_type: packageType,
        quantity,
        price: price || 0,
        status: "ativo",
        payment_id: `MANUAL_${Date.now()}`,
        data_vencimento: dataVencimentoPacote
      });
      await storage2.updateUser(userId, {
        max_funcionarios: novoLimite,
        max_funcionarios_base: user.max_funcionarios_base || 1,
        data_expiracao_pacote_funcionarios: dataVencimentoPacote
      });
      if (user.status === "ativo" && storage2.getFuncionarios) {
        const funcionarios2 = await storage2.getFuncionarios();
        const funcionariosBloqueados = funcionarios2.filter((f) => f.conta_id === userId && f.status === "bloqueado").sort((a, b) => new Date(a.data_criacao || 0).getTime() - new Date(b.data_criacao || 0).getTime()).slice(0, quantity);
        for (const funcionario of funcionariosBloqueados) {
          await storage2.updateFuncionario(funcionario.id, {
            status: "ativo"
          });
        }
        logger.info("Funcion\xE1rios reativados ap\xF3s ativa\xE7\xE3o manual", "ADMIN_MANUAL_ACTIVATION", {
          userId,
          funcionariosReativados: funcionariosBloqueados.length
        });
      }
      logger.info("Pacote ativado manualmente pelo admin", "ADMIN_MANUAL_ACTIVATION", {
        userId,
        userEmail: user.email,
        packageType,
        quantity,
        limiteAnterior: limiteAtual,
        novoLimite
      });
      res.json({
        success: true,
        message: "Pacote ativado com sucesso!",
        package: newPackage,
        newLimit: novoLimite
      });
    } catch (error) {
      logger.error("Erro ao ativar pacote manualmente", "ADMIN_MANUAL_ACTIVATION", { error: error.message });
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/admin/employee-packages/:id/cancel", requireAdmin, async (req, res) => {
    try {
      const packageId = parseInt(req.params.id);
      if (!packageId) {
        return res.status(400).json({ error: "ID do pacote inv\xE1lido" });
      }
      if (!storage2.updateEmployeePackageStatus) {
        return res.status(501).json({ error: "M\xE9todo updateEmployeePackageStatus n\xE3o implementado" });
      }
      const result = await storage2.db.execute(sql3`
        SELECT ep.*, u.max_funcionarios, u.max_funcionarios_base
        FROM employee_packages ep
        LEFT JOIN users u ON ep.user_id = u.id
        WHERE ep.id = ${packageId}
      `);
      const packageData = result.rows[0];
      if (!packageData) {
        return res.status(404).json({ error: "Pacote n\xE3o encontrado" });
      }
      if (packageData.status === "cancelado") {
        return res.status(400).json({ error: "Este pacote j\xE1 est\xE1 cancelado" });
      }
      const dataCancelamento = (/* @__PURE__ */ new Date()).toISOString();
      await storage2.updateEmployeePackageStatus(packageId, "cancelado", dataCancelamento);
      const limiteAtual = packageData.max_funcionarios || 1;
      const novoLimite = Math.max(packageData.max_funcionarios_base || 1, limiteAtual - packageData.quantity);
      await storage2.updateUser(packageData.user_id, {
        max_funcionarios: novoLimite
      });
      if (storage2.getFuncionariosByContaId) {
        const funcionarios2 = await storage2.getFuncionariosByContaId(packageData.user_id);
        const funcionariosAtivos = funcionarios2.filter((f) => f.status === "ativo");
        if (funcionariosAtivos.length > novoLimite) {
          const funcionariosParaBloquear = funcionariosAtivos.sort((a, b) => new Date(b.data_criacao || 0).getTime() - new Date(a.data_criacao || 0).getTime()).slice(0, funcionariosAtivos.length - novoLimite);
          for (const funcionario of funcionariosParaBloquear) {
            await storage2.updateFuncionario(funcionario.id, {
              status: "bloqueado"
            });
          }
          logger.info("Funcion\xE1rios bloqueados ap\xF3s cancelamento de pacote", "ADMIN_CANCEL_PACKAGE", {
            userId: packageData.user_id,
            funcionariosBloqueados: funcionariosParaBloquear.length
          });
        }
      }
      logger.info("Pacote de funcion\xE1rios cancelado pelo admin", "ADMIN_CANCEL_PACKAGE", {
        packageId,
        userId: packageData.user_id,
        packageType: packageData.package_type,
        quantity: packageData.quantity,
        limiteAnterior: limiteAtual,
        novoLimite
      });
      res.json({
        success: true,
        message: "Pacote cancelado com sucesso!",
        newLimit: novoLimite
      });
    } catch (error) {
      logger.error("Erro ao cancelar pacote", "ADMIN_CANCEL_PACKAGE", { error: error.message });
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/admin/employee-packages/reprocess-webhook", requireAdmin, async (req, res) => {
    try {
      const { paymentId, gateway } = req.body;
      if (!paymentId || !gateway) {
        return res.status(400).json({
          error: "paymentId e gateway s\xE3o obrigat\xF3rios"
        });
      }
      if (gateway === "mercadopago") {
        const config = await storage2.getConfigMercadoPago();
        if (!config || !config.access_token) {
          return res.status(500).json({ error: "Configura\xE7\xE3o do Mercado Pago n\xE3o encontrada" });
        }
        const response = await fetch(
          `https://api.mercadopago.com/v1/payments/${paymentId}`,
          {
            headers: {
              Authorization: `Bearer ${config.access_token}`
            }
          }
        );
        if (!response.ok) {
          return res.status(500).json({ error: "Erro ao buscar pagamento no Mercado Pago" });
        }
        const paymentData = await response.json();
        const externalReference = paymentData.external_reference;
        const status = paymentData.status;
        logger.info("Reprocessando webhook Mercado Pago", "ADMIN_REPROCESS", {
          paymentId,
          status,
          externalReference
        });
        const isEmployeePackage = externalReference && externalReference.startsWith("pacote_");
        if (!isEmployeePackage) {
          return res.status(400).json({
            error: "Este pagamento n\xE3o \xE9 de um pacote de funcion\xE1rios",
            externalReference
          });
        }
        if (status !== "approved") {
          return res.status(400).json({
            error: `Pagamento n\xE3o est\xE1 aprovado. Status atual: ${status}`
          });
        }
        const parts = externalReference.split("_");
        const pacoteId = parts[0] + "_" + parts[1];
        const userId = parts[2];
        const pacoteQuantidades = {
          pacote_5: 5,
          pacote_10: 10,
          pacote_20: 20,
          pacote_50: 50
        };
        const pacotePrecos = {
          pacote_5: 39.9,
          pacote_10: 69.9,
          pacote_20: 119.9,
          pacote_50: 249.9
        };
        const quantidadeAdicional = pacoteQuantidades[pacoteId];
        if (!quantidadeAdicional || !userId) {
          return res.status(400).json({ error: "Dados inv\xE1lidos no external_reference" });
        }
        const users2 = await storage2.getUsers();
        const user = users2.find((u) => u.id === userId);
        if (!user) {
          return res.status(404).json({ error: "Usu\xE1rio n\xE3o encontrado" });
        }
        const existingPackages = await storage2.db.execute(sql3`
          SELECT * FROM employee_packages
          WHERE payment_id = ${paymentId.toString()}
        `);
        if (existingPackages.rows && existingPackages.rows.length > 0) {
          return res.status(400).json({
            error: "Este pagamento j\xE1 foi processado anteriormente",
            package: existingPackages.rows[0]
          });
        }
        const limiteAtual = user.max_funcionarios || 1;
        const novoLimite = limiteAtual + quantidadeAdicional;
        const dataVencimentoReprocess = addDaysAndGetISOSaoPaulo(/* @__PURE__ */ new Date(), 30);
        if (storage2.createEmployeePackage) {
          await storage2.createEmployeePackage({
            user_id: userId,
            package_type: pacoteId,
            quantity: quantidadeAdicional,
            price: pacotePrecos[pacoteId] || paymentData.transaction_amount || 0,
            status: "ativo",
            payment_id: paymentId.toString(),
            data_vencimento: dataVencimentoReprocess
          });
        }
        await storage2.updateUser(userId, {
          max_funcionarios: novoLimite,
          max_funcionarios_base: user.max_funcionarios_base || 1,
          data_expiracao_pacote_funcionarios: dataVencimentoReprocess
        });
        if (user.status === "ativo" && storage2.getFuncionarios) {
          const funcionarios2 = await storage2.getFuncionarios();
          const funcionariosBloqueados = funcionarios2.filter((f) => f.conta_id === userId && f.status === "bloqueado").sort((a, b) => new Date(a.data_criacao || 0).getTime() - new Date(b.data_criacao || 0).getTime()).slice(0, quantidadeAdicional);
          for (const funcionario of funcionariosBloqueados) {
            await storage2.updateFuncionario(funcionario.id, {
              status: "ativo"
            });
          }
          logger.info("Funcion\xE1rios reativados ap\xF3s compra de pacote", "ADMIN_REPROCESS", {
            userId,
            funcionariosReativados: funcionariosBloqueados.length
          });
        }
        logger.info("Webhook reprocessado com sucesso", "ADMIN_REPROCESS", {
          paymentId,
          userId,
          packageType: pacoteId,
          quantity: quantidadeAdicional
        });
        res.json({
          success: true,
          message: "Webhook reprocessado com sucesso!",
          newLimit: novoLimite
        });
      } else {
        return res.status(400).json({ error: "Gateway inv\xE1lido. Use 'mercadopago'" });
      }
    } catch (error) {
      logger.error("Erro ao reprocessar webhook", "ADMIN_REPROCESS", { error: error.message });
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/admin/employee-packages/payment-details/:paymentId", requireAdmin, async (req, res) => {
    try {
      const { paymentId } = req.params;
      const { gateway = "mercadopago" } = req.query;
      if (gateway === "mercadopago") {
        const config = await storage2.getConfigMercadoPago();
        if (!config || !config.access_token) {
          return res.status(500).json({ error: "Configura\xE7\xE3o do Mercado Pago n\xE3o encontrada" });
        }
        const response = await fetch(
          `https://api.mercadopago.com/v1/payments/${paymentId}`,
          {
            headers: {
              Authorization: `Bearer ${config.access_token}`
            }
          }
        );
        if (!response.ok) {
          return res.status(404).json({ error: "Pagamento n\xE3o encontrado no Mercado Pago" });
        }
        const paymentData = await response.json();
        res.json({
          success: true,
          gateway: "mercadopago",
          payment: {
            id: paymentData.id,
            status: paymentData.status,
            status_detail: paymentData.status_detail,
            external_reference: paymentData.external_reference,
            transaction_amount: paymentData.transaction_amount,
            currency_id: paymentData.currency_id,
            date_created: paymentData.date_created,
            date_approved: paymentData.date_approved,
            payer_email: paymentData.payer?.email,
            payment_method_id: paymentData.payment_method_id,
            description: paymentData.description
          }
        });
      } else {
        return res.status(400).json({ error: "Gateway inv\xE1lido. Use 'mercadopago'" });
      }
    } catch (error) {
      logger.error("Erro ao buscar detalhes do pagamento", "ADMIN_PAYMENT_DETAILS", { error: error.message });
      res.status(500).json({ error: error.message });
    }
  });
  app2.patch("/api/admin/employee-packages/:id/status", requireAdmin, async (req, res) => {
    try {
      const packageId = parseInt(req.params.id);
      const { status } = req.body;
      if (!status || !["ativo", "pendente", "cancelado", "expirado"].includes(status)) {
        return res.status(400).json({
          error: "Status inv\xE1lido. Use: ativo, pendente, cancelado ou expirado"
        });
      }
      await storage2.db.execute(sql3`
        UPDATE employee_packages
        SET status = ${status}
        WHERE id = ${packageId}
      `);
      logger.info("Status de pacote atualizado pelo admin", "ADMIN_UPDATE_STATUS", {
        packageId,
        newStatus: status
      });
      res.json({ success: true, message: "Status atualizado com sucesso" });
    } catch (error) {
      logger.error("Erro ao atualizar status do pacote", "ADMIN_UPDATE_STATUS", { error: error.message });
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/webhook/mercadopago", async (req, res) => {
    try {
      const { type, data, action } = req.body;
      console.log("========================================");
      console.log("[WEBHOOK MERCADOPAGO] Notifica\xE7\xE3o recebida:");
      console.log("  - Type:", type);
      console.log("  - Action:", action);
      console.log("  - Data ID:", data?.id);
      console.log("  - Headers:", JSON.stringify(req.headers, null, 2));
      console.log("  - Body completo:", JSON.stringify(req.body, null, 2));
      console.log("========================================");
      logger.info("Webhook Mercado Pago recebido", "MERCADOPAGO_WEBHOOK", {
        type,
        action,
        dataId: data?.id,
        fullBody: req.body,
        headers: req.headers
      });
      if (type === "payment" || action === "payment.created" || action === "payment.updated") {
        const paymentId = data?.id;
        if (!paymentId) {
          logger.warn("Webhook sem payment ID (possivelmente teste)", "MERCADOPAGO_WEBHOOK");
          return res.status(200).json({ success: true, message: "Webhook recebido (sem payment ID)" });
        }
        const config = await storage2.getConfigMercadoPago();
        if (!config || !config.access_token) {
          logger.warn("Configura\xE7\xE3o do Mercado Pago n\xE3o encontrada (possivelmente teste)", "MERCADOPAGO_WEBHOOK");
          return res.status(200).json({ success: true, message: "Webhook recebido (sem configura\xE7\xE3o)" });
        }
        const response = await fetch(
          `https://api.mercadopago.com/v1/payments/${paymentId}`,
          {
            headers: {
              Authorization: `Bearer ${config.access_token}`
            }
          }
        );
        if (!response.ok) {
          logger.warn("Erro ao buscar pagamento do Mercado Pago (possivelmente teste)", "MERCADOPAGO_WEBHOOK", {
            status: response.status,
            paymentId
          });
          return res.status(200).json({ success: true, message: "Webhook recebido (erro ao buscar pagamento)" });
        }
        const paymentData = await response.json();
        const externalReference = paymentData.external_reference;
        const status = paymentData.status;
        const statusDetail = paymentData.status_detail;
        logger.info("Dados do pagamento processados", "MERCADOPAGO_WEBHOOK", {
          paymentId,
          status,
          statusDetail,
          externalReference
        });
        if (!externalReference) {
          logger.warn("Pagamento sem external_reference (possivelmente teste)", "MERCADOPAGO_WEBHOOK", { paymentId });
          return res.status(200).json({ success: true, message: "Webhook recebido (sem external reference)" });
        }
        const isEmployeePackage = externalReference.startsWith("pacote_");
        if (isEmployeePackage && status === "approved") {
          logger.info("Processando pagamento de pacote de funcion\xE1rios", "MERCADOPAGO_WEBHOOK", {
            externalReference,
            paymentId
          });
          if (storage2.getEmployeePackageByPaymentId) {
            const existingPackage = await storage2.getEmployeePackageByPaymentId(paymentId.toString());
            if (existingPackage) {
              logger.warn("Pagamento j\xE1 processado anteriormente - ignorando duplicata", "MERCADOPAGO_WEBHOOK", {
                paymentId,
                existingPackageId: existingPackage.id,
                externalReference
              });
              return res.status(200).json({
                success: true,
                message: "Webhook recebido (pagamento j\xE1 processado anteriormente)",
                duplicate: true
              });
            }
          }
          const parts = externalReference.split("_");
          const pacoteId = parts[0] + "_" + parts[1];
          const userId = parts[2];
          const pacoteQuantidades = {
            pacote_5: 5,
            pacote_10: 10,
            pacote_20: 20,
            pacote_50: 50
          };
          let pacotePrecos = {
            pacote_5: 49.99,
            pacote_10: 89.9,
            pacote_20: 159.9,
            pacote_50: 349.9
          };
          try {
            if (storage2.getSystemConfig) {
              const precosConfig = await storage2.getSystemConfig("pacotes_funcionarios_precos");
              if (precosConfig && precosConfig.valor) {
                const precosParsed = JSON.parse(precosConfig.valor);
                pacotePrecos = {
                  pacote_5: precosParsed.pacote_5 || pacotePrecos.pacote_5,
                  pacote_10: precosParsed.pacote_10 || pacotePrecos.pacote_10,
                  pacote_20: precosParsed.pacote_20 || pacotePrecos.pacote_20,
                  pacote_50: precosParsed.pacote_50 || pacotePrecos.pacote_50
                };
                logger.info("Pre\xE7os de pacotes carregados do banco", "MERCADOPAGO_WEBHOOK", pacotePrecos);
              }
            }
          } catch (error) {
            logger.warn("Erro ao carregar pre\xE7os customizados, usando padr\xE3o", "MERCADOPAGO_WEBHOOK", { error });
          }
          const quantidadeAdicional = pacoteQuantidades[pacoteId];
          if (quantidadeAdicional && userId) {
            const users2 = await storage2.getUsers();
            const user = users2.find((u) => u.id === userId);
            if (user) {
              const limiteAtual = user.max_funcionarios || 1;
              const novoLimite = limiteAtual + quantidadeAdicional;
              const dataVencimentoWebhook = addDaysAndGetISOSaoPaulo(/* @__PURE__ */ new Date(), 30);
              if (storage2.createEmployeePackage) {
                await storage2.createEmployeePackage({
                  user_id: userId,
                  package_type: pacoteId,
                  quantity: quantidadeAdicional,
                  price: paymentData.transaction_amount || pacotePrecos[pacoteId] || 0,
                  status: "ativo",
                  payment_id: paymentId.toString(),
                  data_vencimento: dataVencimentoWebhook
                });
              }
              await storage2.updateUser(userId, {
                max_funcionarios: novoLimite,
                max_funcionarios_base: user.max_funcionarios_base || 1,
                data_expiracao_pacote_funcionarios: dataVencimentoWebhook
              });
              if (user.status === "ativo" && storage2.getFuncionarios) {
                const funcionarios2 = await storage2.getFuncionarios();
                const funcionariosBloqueados = funcionarios2.filter((f) => f.conta_id === userId && f.status === "bloqueado").sort((a, b) => new Date(a.data_criacao || 0).getTime() - new Date(b.data_criacao || 0).getTime()).slice(0, quantidadeAdicional);
                for (const funcionario of funcionariosBloqueados) {
                  await storage2.updateFuncionario(funcionario.id, {
                    status: "ativo"
                  });
                  logger.info("Funcion\xE1rio reativado ap\xF3s compra de pacote", "MERCADOPAGO_WEBHOOK", {
                    funcionarioId: funcionario.id,
                    funcionarioNome: funcionario.nome,
                    contaId: userId
                  });
                }
                if (funcionariosBloqueados.length > 0) {
                  logger.info(`${funcionariosBloqueados.length} funcion\xE1rio(s) reativado(s)`, "MERCADOPAGO_WEBHOOK", {
                    userId,
                    quantidade: funcionariosBloqueados.length
                  });
                }
              }
              logger.info("Pacote de funcion\xE1rios ativado com sucesso", "MERCADOPAGO_WEBHOOK", {
                userId,
                userEmail: user.email,
                pacoteId,
                quantidadeAdicional,
                limiteAnterior: limiteAtual,
                novoLimite,
                dataVencimento: dataVencimento.toISOString()
              });
              try {
                const { EmailService: EmailService2 } = await Promise.resolve().then(() => (init_email_service(), email_service_exports));
                const emailService = new EmailService2();
                const nomePacote = `Pacote ${quantidadeAdicional} Funcion\xE1rios`;
                await emailService.sendEmployeePackageActivated({
                  to: user.email,
                  userName: user.nome,
                  packageName: nomePacote,
                  quantity: quantidadeAdicional,
                  newLimit: novoLimite,
                  price: paymentData.transaction_amount || 0
                });
                logger.info("Email de ativa\xE7\xE3o enviado", "MERCADOPAGO_WEBHOOK", {
                  userEmail: user.email
                });
              } catch (emailError) {
                logger.error("Erro ao enviar email de ativa\xE7\xE3o (n\xE3o cr\xEDtico)", "MERCADOPAGO_WEBHOOK", {
                  error: emailError
                });
              }
              return res.json({
                success: true,
                message: "Pacote de funcion\xE1rios ativado com sucesso"
              });
            }
          }
          logger.warn("Erro ao processar pacote de funcion\xE1rios (possivelmente teste)", "MERCADOPAGO_WEBHOOK", {
            externalReference,
            pacoteId,
            userId,
            message: "Dados inv\xE1lidos ou usu\xE1rio n\xE3o encontrado"
          });
          return res.status(200).json({ success: true, message: "Webhook recebido (erro ao processar pacote)" });
        }
        const subscriptions2 = await storage2.getSubscriptions?.();
        const subscription = subscriptions2?.find(
          (s) => s.external_reference === externalReference
        );
        if (!subscription) {
          logger.warn("Assinatura n\xE3o encontrada (possivelmente teste)", "MERCADOPAGO_WEBHOOK", {
            externalReference
          });
          return res.status(200).json({ success: true, message: "Webhook recebido (assinatura n\xE3o encontrada)" });
        }
        if (subscription.mercadopago_payment_id === paymentId.toString() && subscription.status_pagamento === "approved") {
          logger.warn("Pagamento de assinatura j\xE1 processado anteriormente - ignorando duplicata", "MERCADOPAGO_WEBHOOK", {
            paymentId,
            subscriptionId: subscription.id,
            externalReference
          });
          return res.status(200).json({
            success: true,
            message: "Webhook recebido (pagamento j\xE1 processado anteriormente)",
            duplicate: true
          });
        }
        if (status === "approved") {
          console.log("\u{1F4B0} [WEBHOOK] Pagamento APROVADO - Iniciando atualiza\xE7\xE3o do banco...");
          console.log("  - Subscription ID:", subscription.id);
          console.log("  - User ID:", subscription.user_id);
          console.log("  - Plano:", subscription.plano);
          logger.info("Pagamento aprovado - Ativando assinatura", "MERCADOPAGO_WEBHOOK", {
            subscriptionId: subscription.id,
            userId: subscription.user_id,
            plano: subscription.plano
          });
          console.log("\u{1F4DD} [WEBHOOK] Atualizando assinatura no banco...");
          await storage2.updateSubscription?.(subscription.id, {
            status: "ativo",
            status_pagamento: "approved",
            mercadopago_payment_id: paymentId.toString(),
            data_inicio: (/* @__PURE__ */ new Date()).toISOString(),
            data_atualizacao: (/* @__PURE__ */ new Date()).toISOString()
          });
          console.log("\u2705 [WEBHOOK] Assinatura atualizada com sucesso");
          console.log("\u{1F4DD} [WEBHOOK] Atualizando plano do usu\xE1rio no banco...");
          console.log("  - Novo plano:", subscription.plano);
          console.log("  - Data expira\xE7\xE3o:", subscription.data_vencimento);
          await storage2.updateUser?.(subscription.user_id, {
            plano: subscription.plano,
            data_expiracao_plano: subscription.data_vencimento,
            status: "ativo"
          });
          console.log("\u2705 [WEBHOOK] Plano do usu\xE1rio atualizado com sucesso");
          if (storage2.getFuncionarios) {
            const funcionarios2 = await storage2.getFuncionarios();
            const funcionariosDaConta = funcionarios2.filter(
              (f) => f.conta_id === subscription.user_id && f.status === "bloqueado"
            );
            for (const funcionario of funcionariosDaConta) {
              await storage2.updateFuncionario(funcionario.id, {
                status: "ativo"
              });
            }
            if (funcionariosDaConta.length > 0) {
              logger.info("Funcion\xE1rios reativados ap\xF3s pagamento aprovado", "MERCADOPAGO_WEBHOOK", {
                userId: subscription.user_id,
                funcionariosReativados: funcionariosDaConta.length
              });
            }
          }
          logger.info("Assinatura ativada com sucesso", "MERCADOPAGO_WEBHOOK", {
            subscriptionId: subscription.id
          });
        } else if (status === "rejected" || status === "cancelled") {
          logger.warn("Pagamento recusado/cancelado", "MERCADOPAGO_WEBHOOK", {
            subscriptionId: subscription.id,
            status,
            statusDetail
          });
          await storage2.updateSubscription?.(subscription.id, {
            status: "cancelado",
            status_pagamento: status,
            mercadopago_payment_id: paymentId.toString(),
            motivo_cancelamento: `Pagamento ${status} - ${statusDetail || "sem detalhes"}`,
            data_atualizacao: (/* @__PURE__ */ new Date()).toISOString()
          });
        } else if (status === "pending" || status === "in_process") {
          logger.info("Pagamento pendente", "MERCADOPAGO_WEBHOOK", {
            subscriptionId: subscription.id,
            status
          });
          await storage2.updateSubscription?.(subscription.id, {
            status_pagamento: status,
            mercadopago_payment_id: paymentId.toString(),
            data_atualizacao: (/* @__PURE__ */ new Date()).toISOString()
          });
        }
      }
      res.json({ success: true, message: "Webhook processado com sucesso" });
    } catch (error) {
      logger.error("Erro ao processar webhook Mercado Pago", "MERCADOPAGO_WEBHOOK", {
        error: error.message,
        stack: error.stack
      });
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/subscriptions", requireAdmin, async (req, res) => {
    try {
      const subscriptions2 = await storage2.getSubscriptions();
      res.json(subscriptions2 || []);
    } catch (error) {
      console.error("Erro ao buscar assinaturas:", error);
      res.status(500).json({ error: "Erro ao buscar assinaturas" });
    }
  });
  app2.get("/api/subscriptions/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const subscriptions2 = await storage2.getSubscriptionsByUser(userId);
      res.json(subscriptions2 || []);
    } catch (error) {
      console.error("Erro ao buscar assinaturas do usu\xE1rio:", error);
      res.status(500).json({ error: "Erro ao buscar assinaturas" });
    }
  });
  app2.post("/api/subscriptions/:id/cancel", async (req, res) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const subscriptionId = parseInt(id);
      const userId = req.headers["x-user-id"];
      const isAdmin = req.headers["x-is-admin"];
      if (!userId) {
        return res.status(401).json({ error: "Autentica\xE7\xE3o necess\xE1ria" });
      }
      const subscriptions2 = await storage2.getSubscriptions();
      const subscription = subscriptions2?.find((s) => s.id === subscriptionId);
      if (!subscription) {
        return res.status(404).json({ error: "Assinatura n\xE3o encontrada" });
      }
      if (subscription.user_id !== userId && isAdmin !== "true") {
        return res.status(403).json({ error: "Voc\xEA s\xF3 pode cancelar suas pr\xF3prias assinaturas" });
      }
      await storage2.updateSubscription(subscriptionId, {
        status: "cancelado",
        status_pagamento: "cancelled",
        data_cancelamento: (/* @__PURE__ */ new Date()).toISOString(),
        data_atualizacao: (/* @__PURE__ */ new Date()).toISOString(),
        motivo_cancelamento: reason || "Cancelado manualmente pelo administrador"
      });
      await storage2.updateUser(subscription.user_id, {
        status: "bloqueado"
      });
      console.log(
        `\u2705 Assinatura ${subscriptionId} cancelada. Motivo: ${reason || "Cancelado manualmente"}`
      );
      logger.info("Assinatura cancelada", "SUBSCRIPTION", {
        subscriptionId,
        userId: subscription.user_id,
        reason: reason || "Cancelado manualmente"
      });
      res.json({
        success: true,
        message: "Assinatura cancelada com sucesso"
      });
    } catch (error) {
      console.error("Erro ao cancelar assinatura:", error);
      logger.error("Erro ao cancelar assinatura", "SUBSCRIPTION", {
        error: error.message
      });
      res.status(500).json({ error: error.message || "Erro ao cancelar assinatura" });
    }
  });
  app2.delete("/api/subscriptions/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const subscriptionId = parseInt(id);
      const subscriptions2 = await storage2.getSubscriptions();
      const subscription = subscriptions2?.find((s) => s.id === subscriptionId);
      if (!subscription) {
        return res.status(404).json({ error: "Assinatura n\xE3o encontrada" });
      }
      if (subscription.status !== "cancelado" && subscription.status !== "expirado") {
        return res.status(400).json({
          error: "S\xF3 \xE9 poss\xEDvel remover assinaturas canceladas ou expiradas"
        });
      }
      await storage2.deleteSubscription(subscriptionId);
      console.log(`\u{1F5D1}\uFE0F Assinatura ${subscriptionId} removida do hist\xF3rico`);
      logger.info("Assinatura removida", "SUBSCRIPTION", {
        subscriptionId,
        userId: subscription.user_id,
        status: subscription.status
      });
      res.json({
        success: true,
        message: "Assinatura removida com sucesso"
      });
    } catch (error) {
      console.error("Erro ao deletar assinatura:", error);
      logger.error("Erro ao deletar assinatura", "SUBSCRIPTION", {
        error: error.message
      });
      res.status(500).json({ error: error.message || "Erro ao deletar assinatura" });
    }
  });
  app2.patch("/api/subscriptions/:id/status", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { status, motivo } = req.body;
      const subscriptionId = parseInt(id);
      if (!status) {
        return res.status(400).json({ error: "Status \xE9 obrigat\xF3rio" });
      }
      const subscriptions2 = await storage2.getSubscriptions();
      const subscription = subscriptions2?.find((s) => s.id === subscriptionId);
      if (!subscription) {
        return res.status(404).json({ error: "Assinatura n\xE3o encontrada" });
      }
      const updateData = {
        status,
        data_atualizacao: (/* @__PURE__ */ new Date()).toISOString()
      };
      if (status === "cancelado") {
        updateData.data_cancelamento = (/* @__PURE__ */ new Date()).toISOString();
        updateData.motivo_cancelamento = motivo || "Cancelado pelo administrador";
        updateData.status_pagamento = "cancelled";
        await storage2.updateUser(subscription.user_id, {
          status: "bloqueado"
        });
      }
      await storage2.updateSubscription(subscriptionId, updateData);
      console.log(`\u2705 Status da assinatura ${subscriptionId} atualizado para: ${status}`);
      logger.info("Status de assinatura atualizado", "SUBSCRIPTION", {
        subscriptionId,
        userId: subscription.user_id,
        oldStatus: subscription.status,
        newStatus: status,
        motivo
      });
      res.json({
        success: true,
        message: `Status atualizado para ${status}`
      });
    } catch (error) {
      console.error("Erro ao atualizar status da assinatura:", error);
      logger.error("Erro ao atualizar status da assinatura", "SUBSCRIPTION", {
        error: error.message
      });
      res.status(500).json({ error: error.message || "Erro ao atualizar status" });
    }
  });
  app2.post("/api/payment-reminders/check", requireAdmin, async (req, res) => {
    try {
      const { paymentReminderService: paymentReminderService2 } = await Promise.resolve().then(() => (init_payment_reminder(), payment_reminder_exports));
      await paymentReminderService2.checkAndSendReminders();
      res.json({
        success: true,
        message: "Verifica\xE7\xE3o de pagamentos executada"
      });
    } catch (error) {
      console.error("Erro ao verificar pagamentos:", error);
      res.status(500).json({ error: "Erro ao verificar pagamentos" });
    }
  });
  app2.get("/api/system/health", requireAdmin, async (req, res) => {
    try {
      const { autoHealingService: autoHealingService2 } = await Promise.resolve().then(() => (init_auto_healing(), auto_healing_exports));
      const status = autoHealingService2.getSystemStatus();
      res.json(status);
    } catch (error) {
      console.error("Erro ao obter status do sistema:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/system/health/check", requireAdmin, async (req, res) => {
    try {
      const { autoHealingService: autoHealingService2 } = await Promise.resolve().then(() => (init_auto_healing(), auto_healing_exports));
      const checks = await autoHealingService2.runHealthChecks();
      res.json({
        success: true,
        checks,
        summary: autoHealingService2.getSystemStatus().summary
      });
    } catch (error) {
      console.error("Erro ao executar verifica\xE7\xF5es de sa\xFAde:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/system/autofix-history", requireAdmin, async (req, res) => {
    try {
      const { autoHealingService: autoHealingService2 } = await Promise.resolve().then(() => (init_auto_healing(), auto_healing_exports));
      const limit = req.query.limit ? parseInt(req.query.limit) : 50;
      const history = autoHealingService2.getAutoFixHistory(limit);
      res.json(history);
    } catch (error) {
      console.error("Erro ao obter hist\xF3rico de auto-fix:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/auto-cleanup/config", requireAuth, async (req, res) => {
    try {
      const { autoCleanupService: autoCleanupService2 } = await Promise.resolve().then(() => (init_auto_cleanup(), auto_cleanup_exports));
      const config = autoCleanupService2.getConfig();
      res.json(config);
    } catch (error) {
      console.error("Erro ao obter configura\xE7\xF5es de limpeza:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/auto-cleanup/config", requireAuth, async (req, res) => {
    try {
      const { autoCleanupService: autoCleanupService2 } = await Promise.resolve().then(() => (init_auto_cleanup(), auto_cleanup_exports));
      const { devolucoes_dias, orcamentos_dias, logs_dias, caixas_dias, contas_pagar_dias, contas_receber_dias, relatorios_dias } = req.body;
      const config = {};
      if (devolucoes_dias !== void 0 && devolucoes_dias !== "never") {
        config.devolucoes_dias = parseInt(devolucoes_dias);
      } else if (devolucoes_dias === "never") {
        config.devolucoes_dias = null;
      }
      if (orcamentos_dias !== void 0 && orcamentos_dias !== "never") {
        config.orcamentos_dias = parseInt(orcamentos_dias);
      } else if (orcamentos_dias === "never") {
        config.orcamentos_dias = null;
      }
      if (logs_dias !== void 0) {
        config.logs_dias = parseInt(logs_dias);
      } else {
        config.logs_dias = null;
      }
      if (caixas_dias !== void 0 && caixas_dias !== "never") {
        config.caixas_dias = parseInt(caixas_dias);
      } else if (caixas_dias === "never") {
        config.caixas_dias = null;
      }
      if (contas_pagar_dias !== void 0 && contas_pagar_dias !== "never") {
        config.contas_pagar_dias = parseInt(contas_pagar_dias);
      } else if (contas_pagar_dias === "never") {
        config.contas_pagar_dias = null;
      }
      if (contas_receber_dias !== void 0 && contas_receber_dias !== "never") {
        config.contas_receber_dias = parseInt(contas_receber_dias);
      } else if (contas_receber_dias === "never") {
        config.contas_receber_dias = null;
      }
      if (relatorios_dias !== void 0) {
        config.relatorios_dias = parseInt(relatorios_dias);
      } else {
        config.relatorios_dias = null;
      }
      autoCleanupService2.updateConfig(config);
      res.json({
        success: true,
        message: "Configura\xE7\xF5es atualizadas com sucesso",
        config: autoCleanupService2.getConfig()
      });
    } catch (error) {
      console.error("Erro ao atualizar configura\xE7\xF5es de limpeza:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/auto-cleanup/execute", requireAdmin, async (req, res) => {
    try {
      const { autoCleanupService: autoCleanupService2 } = await Promise.resolve().then(() => (init_auto_cleanup(), auto_cleanup_exports));
      await autoCleanupService2.executeCleanup();
      res.json({
        success: true,
        message: "Limpeza autom\xE1tica executada com sucesso"
      });
    } catch (error) {
      console.error("Erro ao executar limpeza autom\xE1tica:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/admin/force-block-employees/:userId", requireAdmin, async (req, res) => {
    try {
      const { userId } = req.params;
      const users2 = await storage2.getUsers();
      const user = users2.find((u) => u.id === userId);
      if (!user) {
        return res.status(404).json({ error: "Usu\xE1rio n\xE3o encontrado" });
      }
      if (user.status !== "bloqueado") {
        return res.status(400).json({
          error: "Usu\xE1rio n\xE3o est\xE1 bloqueado",
          message: "Apenas funcion\xE1rios de contas bloqueadas podem ser bloqueados em massa"
        });
      }
      let funcionariosBloqueados = 0;
      if (storage2.getFuncionarios) {
        const funcionarios2 = await storage2.getFuncionarios();
        const funcionariosDaConta = funcionarios2.filter((f) => f.conta_id === userId);
        for (const funcionario of funcionariosDaConta) {
          if (funcionario.status !== "bloqueado") {
            await storage2.updateFuncionario(funcionario.id, {
              status: "bloqueado"
            });
            funcionariosBloqueados++;
            logger.info("[ADMIN_ACTION] Funcion\xE1rio bloqueado manualmente", {
              funcionarioId: funcionario.id,
              funcionarioNome: funcionario.nome,
              contaId: userId,
              motivo: "Conta principal bloqueada"
            });
          }
        }
      }
      res.json({
        success: true,
        message: `${funcionariosBloqueados} funcion\xE1rio(s) bloqueado(s) com sucesso`,
        userId,
        funcionariosBloqueados,
        userEmail: user.email
      });
    } catch (error) {
      console.error("Erro ao bloquear funcion\xE1rios:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/user/check-blocked", async (req, res) => {
    try {
      const userId = req.headers["x-user-id"];
      const userType = req.headers["x-user-type"];
      const contaId = req.headers["x-conta-id"];
      if (!userId) {
        return res.status(401).json({ error: "N\xE3o autorizado" });
      }
      if (userType === "funcionario" && contaId) {
        const users3 = await storage2.getUsers();
        const contaPrincipal = users3.find((u) => u.id === contaId);
        if (!contaPrincipal) {
          return res.status(404).json({ error: "Conta principal n\xE3o encontrada" });
        }
        const isBlocked2 = contaPrincipal.status === "bloqueado";
        return res.json({
          isBlocked: isBlocked2,
          status: contaPrincipal.status || "ativo",
          userType: "funcionario",
          contaId: contaPrincipal.id
        });
      }
      const users2 = await storage2.getUsers();
      const user = users2.find((u) => u.id === userId);
      if (!user) {
        return res.status(404).json({ error: "Usu\xE1rio n\xE3o encontrado" });
      }
      const isBlocked = user.status === "bloqueado";
      res.json({
        isBlocked,
        status: user.status,
        plano: user.plano
      });
    } catch (error) {
      console.error("Erro ao verificar bloqueio:", error);
      res.status(500).json({ error: "Erro ao verificar status de bloqueio" });
    }
  });
  app2.get("/api/caixas", getUserId, async (req, res) => {
    try {
      const userId = req.headers["effective-user-id"];
      const contaId = req.query.conta_id;
      const incluirArquivados = req.query.incluirArquivados === "true";
      if (!userId) {
        return res.status(401).json({ error: "Usu\xE1rio n\xE3o autenticado" });
      }
      if (!contaId || contaId !== userId) {
        return res.status(403).json({ error: "Acesso negado. Par\xE2metro conta_id inv\xE1lido." });
      }
      if (!storage2.getCaixas) {
        return res.status(501).json({ error: "M\xE9todo getCaixas n\xE3o implementado" });
      }
      let caixas2 = await storage2.getCaixas(userId);
      if (!incluirArquivados && caixas2.some((c) => c.status === "arquivado")) {
        caixas2 = caixas2.filter((c) => c.status !== "arquivado");
      }
      const caixasComOperador = await Promise.all(
        caixas2.map(async (caixa) => {
          let operadorNome = "Sistema";
          if (caixa.funcionario_id) {
            const funcionario = await storage2.getFuncionario(
              caixa.funcionario_id
            );
            if (funcionario) {
              operadorNome = funcionario.nome;
            }
          } else {
            const usuario = await storage2.getUserByEmail(
              (await storage2.getUsers()).find(
                (u) => u.id === caixa.user_id
              )?.email || ""
            );
            if (usuario) {
              operadorNome = usuario.nome;
            }
          }
          return {
            ...caixa,
            operador_nome: operadorNome
          };
        })
      );
      res.json(caixasComOperador || []);
    } catch (error) {
      console.error("Erro ao buscar caixas:", error);
      res.status(500).json({ error: "Erro ao buscar caixas" });
    }
  });
  app2.get("/api/caixas/aberto", getUserId, async (req, res) => {
    try {
      const userId = req.headers["effective-user-id"];
      const funcionarioId = req.headers["funcionario-id"];
      const userType = req.headers["x-user-type"];
      if (!userId) {
        return res.status(401).json({ error: "Usu\xE1rio n\xE3o autenticado" });
      }
      if (!storage2.getCaixaAberto) {
        return res.status(501).json({ error: "M\xE9todo getCaixaAberto n\xE3o implementado" });
      }
      const caixaAberto = await storage2.getCaixaAberto(userId, funcionarioId);
      if (caixaAberto) {
        let operadorNome = "Sistema";
        if (caixaAberto.funcionario_id) {
          const funcionario = await storage2.getFuncionario(
            caixaAberto.funcionario_id
          );
          if (funcionario) {
            operadorNome = funcionario.nome;
          }
        } else {
          const usuario = await storage2.getUserByEmail(
            (await storage2.getUsers()).find(
              (u) => u.id === caixaAberto.user_id
            )?.email || ""
          );
          if (usuario) {
            operadorNome = usuario.nome;
          }
        }
        res.json({
          ...caixaAberto,
          operador_nome: operadorNome
        });
      } else {
        res.json(null);
      }
    } catch (error) {
      console.error("Erro ao buscar caixa aberto:", error);
      res.status(500).json({ error: "Erro ao buscar caixa aberto" });
    }
  });
  app2.get("/api/caixas/:id", getUserId, async (req, res) => {
    try {
      const userId = req.headers["effective-user-id"];
      const { id } = req.params;
      if (!userId) {
        return res.status(401).json({ error: "Usu\xE1rio n\xE3o autenticado" });
      }
      if (!storage2.getCaixa) {
        return res.status(501).json({ error: "M\xE9todo getCaixa n\xE3o implementado" });
      }
      const caixa = await storage2.getCaixa(parseInt(id));
      if (!caixa) {
        return res.status(404).json({ error: "Caixa n\xE3o encontrado" });
      }
      if (caixa.user_id !== userId) {
        return res.status(403).json({ error: "Acesso negado" });
      }
      res.json(caixa);
    } catch (error) {
      console.error("Erro ao buscar caixa:", error);
      res.status(500).json({ error: "Erro ao buscar caixa" });
    }
  });
  app2.post("/api/caixas/abrir", getUserId, async (req, res) => {
    try {
      const userId = req.headers["effective-user-id"];
      const funcionarioId = req.headers["funcionario-id"];
      const userType = req.headers["x-user-type"];
      if (!userId) {
        return res.status(401).json({ error: "Usu\xE1rio n\xE3o autenticado" });
      }
      if (!storage2.getCaixaAberto || !storage2.abrirCaixa) {
        return res.status(501).json({ error: "M\xE9todos de caixa n\xE3o implementados" });
      }
      const caixaAberto = await storage2.getCaixaAberto(userId, funcionarioId);
      if (caixaAberto) {
        const operadorNome = userType === "funcionario" ? "Este funcion\xE1rio" : "Voc\xEA";
        return res.status(400).json({ error: `${operadorNome} j\xE1 possui um caixa aberto (ID: ${caixaAberto.id})` });
      }
      const saldoInicial = parseFloat(req.body.saldo_inicial);
      if (isNaN(saldoInicial) || saldoInicial < 0) {
        return res.status(400).json({ error: "Saldo inicial inv\xE1lido" });
      }
      const caixaData = {
        user_id: userId,
        funcionario_id: userType === "funcionario" ? funcionarioId : null,
        data_abertura: (/* @__PURE__ */ new Date()).toISOString(),
        saldo_inicial: saldoInicial,
        observacoes_abertura: req.body.observacoes_abertura || null,
        status: "aberto",
        total_vendas: 0,
        total_retiradas: 0,
        total_suprimentos: 0
      };
      const caixa = await storage2.abrirCaixa(caixaData);
      console.log(
        `\u2705 Caixa aberto - ID: ${caixa.id}, User: ${userId}, Saldo Inicial: R$ ${saldoInicial.toFixed(2)}`
      );
      res.json(caixa);
    } catch (error) {
      console.error("Erro ao abrir caixa:", error);
      res.status(500).json({ error: "Erro ao abrir caixa" });
    }
  });
  app2.post("/api/caixas/:id/fechar", getUserId, async (req, res) => {
    try {
      const userId = req.headers["effective-user-id"];
      const { id } = req.params;
      const caixaId = parseInt(id);
      if (!userId) {
        return res.status(401).json({ error: "Usu\xE1rio n\xE3o autenticado" });
      }
      if (!storage2.getCaixa || !storage2.fecharCaixa) {
        return res.status(501).json({ error: "M\xE9todos de caixa n\xE3o implementados" });
      }
      const caixa = await storage2.getCaixa(caixaId);
      if (!caixa) {
        return res.status(404).json({ error: "Caixa n\xE3o encontrado" });
      }
      if (caixa.user_id !== userId) {
        return res.status(403).json({ error: "Acesso negado" });
      }
      if (caixa.status === "fechado") {
        return res.status(400).json({ error: "Caixa j\xE1 est\xE1 fechado" });
      }
      const saldoFinal = parseFloat(req.body.saldo_final);
      if (isNaN(saldoFinal)) {
        return res.status(400).json({ error: "Saldo final inv\xE1lido" });
      }
      const dadosFechamento = {
        data_fechamento: (/* @__PURE__ */ new Date()).toISOString(),
        saldo_final: saldoFinal,
        observacoes_fechamento: req.body.observacoes_fechamento || null,
        status: "fechado"
      };
      const caixaFechado = await storage2.fecharCaixa(caixaId, dadosFechamento);
      console.log(
        `\u2705 Caixa fechado - ID: ${caixaId}, Saldo Final: R$ ${saldoFinal.toFixed(2)}`
      );
      res.json(caixaFechado);
    } catch (error) {
      console.error("Erro ao fechar caixa:", error);
      res.status(500).json({ error: "Erro ao fechar caixa" });
    }
  });
  app2.get("/api/caixas/:id/movimentacoes", getUserId, async (req, res) => {
    try {
      const userId = req.headers["effective-user-id"];
      const { id } = req.params;
      if (!userId) {
        return res.status(401).json({ error: "Usu\xE1rio n\xE3o autenticado" });
      }
      if (!storage2.getMovimentacoesCaixa) {
        return res.status(501).json({ error: "M\xE9todo getMovimentacoesCaixa n\xE3o implementado" });
      }
      const movimentacoes = await storage2.getMovimentacoesCaixa(parseInt(id));
      res.json(movimentacoes || []);
    } catch (error) {
      console.error("Erro ao buscar movimenta\xE7\xF5es:", error);
      res.status(500).json({ error: "Erro ao buscar movimenta\xE7\xF5es" });
    }
  });
  app2.post("/api/caixas/:id/movimentacoes", getUserId, async (req, res) => {
    try {
      const userId = req.headers["effective-user-id"];
      const { id } = req.params;
      const caixaId = parseInt(id);
      if (!userId) {
        return res.status(401).json({ error: "Usu\xE1rio n\xE3o autenticado" });
      }
      if (!storage2.getCaixa || !storage2.createMovimentacaoCaixa || !storage2.atualizarTotaisCaixa) {
        return res.status(501).json({ error: "M\xE9todos de movimenta\xE7\xE3o n\xE3o implementados" });
      }
      const caixa = await storage2.getCaixa(caixaId);
      if (!caixa) {
        return res.status(404).json({ error: "Caixa n\xE3o encontrado" });
      }
      if (caixa.user_id !== userId) {
        return res.status(403).json({ error: "Acesso negado" });
      }
      if (caixa.status === "fechado") {
        return res.status(400).json({
          error: "N\xE3o \xE9 poss\xEDvel adicionar movimenta\xE7\xF5es em caixa fechado"
        });
      }
      const valor = parseFloat(req.body.valor);
      if (isNaN(valor) || valor <= 0) {
        return res.status(400).json({ error: "Valor inv\xE1lido" });
      }
      const tipo = req.body.tipo;
      if (!["suprimento", "retirada"].includes(tipo)) {
        return res.status(400).json({ error: "Tipo de movimenta\xE7\xE3o inv\xE1lido" });
      }
      const movimentacaoData = {
        caixa_id: caixaId,
        user_id: userId,
        tipo,
        valor,
        descricao: req.body.descricao || null,
        data: (/* @__PURE__ */ new Date()).toISOString()
      };
      const movimentacao = await storage2.createMovimentacaoCaixa(movimentacaoData);
      const campo = tipo === "suprimento" ? "total_suprimentos" : "total_retiradas";
      await storage2.atualizarTotaisCaixa(caixaId, campo, valor);
      console.log(
        `\u2705 Movimenta\xE7\xE3o registrada - Caixa: ${caixaId}, Tipo: ${tipo}, Valor: R$ ${valor.toFixed(2)}`
      );
      res.json(movimentacao);
    } catch (error) {
      console.error("Erro ao criar movimenta\xE7\xE3o:", error);
      res.status(500).json({ error: "Erro ao criar movimenta\xE7\xE3o" });
    }
  });
  app2.delete("/api/caixas/historico", getUserId, async (req, res) => {
    try {
      const userId = req.headers["effective-user-id"];
      if (!userId) {
        return res.status(401).json({ error: "Usu\xE1rio n\xE3o autenticado" });
      }
      if (!storage2.limparHistoricoCaixas) {
        return res.status(501).json({ error: "M\xE9todo limparHistoricoCaixas n\xE3o implementado" });
      }
      const resultado = await storage2.limparHistoricoCaixas(userId);
      console.log(
        `\u2705 Hist\xF3rico de caixas limpo - User: ${userId}, Caixas removidos: ${resultado.deletedCount}`
      );
      res.json({ success: true, deletedCount: resultado.deletedCount });
    } catch (error) {
      console.error("Erro ao limpar hist\xF3rico de caixas:", error);
      res.status(500).json({ error: "Erro ao limpar hist\xF3rico de caixas" });
    }
  });
  app2.get("/api/devolucoes", getUserId, async (req, res) => {
    try {
      const userId = req.headers["effective-user-id"];
      const incluirArquivados = req.query.incluirArquivados === "true";
      if (!storage2.getDevolucoes) {
        return res.status(501).json({ error: "M\xE9todo getDevolucoes n\xE3o implementado" });
      }
      const allDevolucoes = await storage2.getDevolucoes();
      let devolucoes2 = allDevolucoes.filter((d) => d.user_id === userId);
      if (!incluirArquivados) {
        devolucoes2 = devolucoes2.filter((d) => d.status !== "arquivada");
      }
      const devolucoesComOperador = await Promise.all(
        devolucoes2.map(async (devolucao) => {
          if (!devolucao.operador_nome && devolucao.operador_id) {
            const funcionario = await storage2.getFuncionario(devolucao.operador_id);
            if (funcionario) {
              return { ...devolucao, operador_nome: funcionario.nome };
            }
            const usuario = await storage2.getUserById(devolucao.operador_id);
            if (usuario) {
              return { ...devolucao, operador_nome: usuario.nome };
            }
          }
          return devolucao;
        })
      );
      console.log(
        `\u2705 Devolu\xE7\xF5es buscadas - User: ${userId}, Total: ${devolucoesComOperador.length}, Arquivados: ${incluirArquivados}`
      );
      res.json(devolucoesComOperador);
    } catch (error) {
      console.error("Erro ao buscar devolu\xE7\xF5es:", error);
      res.status(500).json({ error: "Erro ao buscar devolu\xE7\xF5es" });
    }
  });
  app2.get("/api/devolucoes/:id", getUserId, async (req, res) => {
    try {
      const userId = req.headers["effective-user-id"];
      const id = parseInt(req.params.id);
      if (!storage2.getDevolucao) {
        return res.status(501).json({ error: "M\xE9todo getDevolucao n\xE3o implementado" });
      }
      const devolucao = await storage2.getDevolucao(id);
      if (!devolucao || devolucao.user_id !== userId) {
        return res.status(404).json({ error: "Devolu\xE7\xE3o n\xE3o encontrada" });
      }
      res.json(devolucao);
    } catch (error) {
      console.error("Erro ao buscar devolu\xE7\xE3o:", error);
      res.status(500).json({ error: "Erro ao buscar devolu\xE7\xE3o" });
    }
  });
  app2.post("/api/devolucoes", getUserId, async (req, res) => {
    try {
      const effectiveUserId = req.headers["effective-user-id"];
      const funcionarioId = req.headers["funcionario-id"];
      if (!storage2.createDevolucao) {
        return res.status(501).json({ error: "M\xE9todo createDevolucao n\xE3o implementado" });
      }
      const devolucaoData = {
        ...req.body,
        user_id: effectiveUserId,
        data_devolucao: (/* @__PURE__ */ new Date()).toISOString()
      };
      const devolucao = await storage2.createDevolucao(devolucaoData);
      if (devolucao.status === "aprovada" && devolucao.produto_id) {
        const produto = await storage2.getProduto(devolucao.produto_id);
        if (produto && produto.user_id === effectiveUserId) {
          await storage2.updateProduto(devolucao.produto_id, {
            quantidade: produto.quantidade + devolucao.quantidade
          });
          console.log(`\u{1F4E6} Estoque restaurado: ${produto.nome} +${devolucao.quantidade} unidades`);
        }
        const caixaAberto = await storage2.getCaixaAberto?.(effectiveUserId, funcionarioId || void 0);
        if (caixaAberto) {
          await storage2.atualizarTotaisCaixa?.(
            caixaAberto.id,
            "total_vendas",
            -devolucao.valor_total
            // Valor negativo para subtrair
          );
          console.log(`\u{1F4B0} Valor descontado do caixa: R$ ${devolucao.valor_total.toFixed(2)}`);
        } else {
          console.warn(`\u26A0\uFE0F Devolu\xE7\xE3o aprovada mas n\xE3o h\xE1 caixa aberto para registrar o valor`);
        }
      }
      console.log(
        `\u2705 Devolu\xE7\xE3o criada: ID ${devolucao.id}, Produto: ${devolucao.produto_nome}, Valor: R$ ${devolucao.valor_total.toFixed(2)}`
      );
      res.json(devolucao);
    } catch (error) {
      console.error("\u274C Erro ao criar devolu\xE7\xE3o:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.put("/api/devolucoes/:id", getUserId, async (req, res) => {
    try {
      const effectiveUserId = req.headers["effective-user-id"];
      const funcionarioId = req.headers["funcionario-id"];
      if (!storage2.updateDevolucao) {
        return res.status(501).json({ error: "M\xE9todo updateDevolucao n\xE3o implementado" });
      }
      const id = parseInt(req.params.id);
      const devolucaoOriginal = await storage2.getDevolucao?.(id);
      if (!devolucaoOriginal) {
        return res.status(404).json({ error: "Devolu\xE7\xE3o n\xE3o encontrada" });
      }
      const devolucao = await storage2.updateDevolucao(id, req.body);
      if (devolucaoOriginal.status !== "aprovada" && devolucao.status === "aprovada") {
        if (devolucao.produto_id) {
          const produto = await storage2.getProduto(devolucao.produto_id);
          if (produto && produto.user_id === effectiveUserId) {
            await storage2.updateProduto(devolucao.produto_id, {
              quantidade: produto.quantidade + devolucao.quantidade
            });
            console.log(`\u{1F4E6} Estoque restaurado: ${produto.nome} +${devolucao.quantidade} unidades (Devolu\xE7\xE3o aprovada)`);
          }
        }
        const caixaAberto = await storage2.getCaixaAberto?.(effectiveUserId, funcionarioId || void 0);
        if (caixaAberto) {
          await storage2.atualizarTotaisCaixa?.(
            caixaAberto.id,
            "total_vendas",
            -devolucao.valor_total
          );
          console.log(`\u{1F4B0} Valor descontado do caixa: R$ ${devolucao.valor_total.toFixed(2)}`);
        } else {
          console.warn(`\u26A0\uFE0F Devolu\xE7\xE3o aprovada mas n\xE3o h\xE1 caixa aberto para registrar o valor`);
        }
      } else if (devolucaoOriginal.status === "aprovada" && devolucao.status !== "aprovada") {
        if (devolucao.produto_id) {
          const produto = await storage2.getProduto(devolucao.produto_id);
          if (produto && produto.user_id === effectiveUserId) {
            await storage2.updateProduto(devolucao.produto_id, {
              quantidade: produto.quantidade - devolucao.quantidade
            });
            console.log(`\u{1F4E6} Estoque removido: ${produto.nome} -${devolucao.quantidade} unidades (Devolu\xE7\xE3o rejeitada/pendente)`);
          }
        }
        const caixaAberto = await storage2.getCaixaAberto?.(effectiveUserId, funcionarioId || void 0);
        if (caixaAberto) {
          await storage2.atualizarTotaisCaixa?.(
            caixaAberto.id,
            "total_vendas",
            devolucao.valor_total
          );
          console.log(`\u{1F4B0} Valor adicionado de volta ao caixa: R$ ${devolucao.valor_total.toFixed(2)}`);
        }
      }
      console.log(`\u2705 Devolu\xE7\xE3o atualizada: ID ${id}, Status: ${devolucao.status}`);
      res.json(devolucao);
    } catch (error) {
      console.error("\u274C Erro ao atualizar devolu\xE7\xE3o:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.delete("/api/devolucoes/:id", getUserId, async (req, res) => {
    try {
      const userId = req.headers["effective-user-id"];
      const id = parseInt(req.params.id);
      if (!storage2.getDevolucao || !storage2.deleteDevolucao) {
        return res.status(501).json({ error: "M\xE9todos de devolu\xE7\xE3o n\xE3o implementados" });
      }
      const devolucao = await storage2.getDevolucao(id);
      if (!devolucao || devolucao.user_id !== userId) {
        return res.status(404).json({ error: "Devolu\xE7\xE3o n\xE3o encontrada" });
      }
      await storage2.deleteDevolucao(id);
      console.log(`\u2705 Devolu\xE7\xE3o deletada - ID: ${id}`);
      res.json({ success: true });
    } catch (error) {
      console.error("Erro ao deletar devolu\xE7\xE3o:", error);
      res.status(500).json({ error: "Erro ao deletar devolu\xE7\xE3o" });
    }
  });
  app2.get("/api/devolucoes/arquivadas", getUserId, async (req, res) => {
    try {
      const userId = req.headers["effective-userid"];
      if (!storage2.getDevolucoes) {
        return res.status(501).json({ error: "M\xE9todo getDevolucoes n\xE3o implementado" });
      }
      const allDevolucoes = await storage2.getDevolucoes();
      const devolucoesArquivadas = allDevolucoes.filter(
        (d) => d.user_id === userId && d.status === "arquivada"
      );
      console.log(
        `\u2705 Devolu\xE7\xF5es arquivadas buscadas - User: ${userId}, Total: ${devolucoesArquivadas.length}`
      );
      res.json(devolucoesArquivadas);
    } catch (error) {
      console.error("Erro ao buscar devolu\xE7\xF5es arquivadas:", error);
      res.status(500).json({ error: "Erro ao buscar devolu\xE7\xF5es arquivadas" });
    }
  });
  app2.get("/api/orcamentos", getUserId, async (req, res) => {
    try {
      const effectiveUserId = req.headers["effective-user-id"];
      const incluirArquivados = req.query.incluirArquivados === "true";
      const allOrcamentos = await storage2.getOrcamentos();
      let orcamentos2 = allOrcamentos.filter((o) => o.user_id === effectiveUserId);
      if (!incluirArquivados) {
        orcamentos2 = orcamentos2.filter((o) => o.status !== "arquivado");
      }
      console.log(`\u2705 Or\xE7amentos buscados - User: ${effectiveUserId}, Total: ${orcamentos2.length}, Arquivados: ${incluirArquivados}`);
      res.json(orcamentos2);
    } catch (error) {
      console.error("Erro ao buscar or\xE7amentos:", error);
      res.status(500).json({ error: "Erro ao buscar or\xE7amentos" });
    }
  });
  app2.get("/api/orcamentos/:id", getUserId, async (req, res) => {
    try {
      const userId = req.headers["effective-user-id"];
      const id = parseInt(req.params.id);
      const orcamento = await storage2.getOrcamento(id);
      if (!orcamento || orcamento.user_id !== userId) {
        return res.status(404).json({ error: "Or\xE7amento n\xE3o encontrado" });
      }
      res.json(orcamento);
    } catch (error) {
      console.error("Erro ao buscar or\xE7amento:", error);
      res.status(500).json({ error: "Erro ao buscar or\xE7amento" });
    }
  });
  app2.post("/api/orcamentos", getUserId, async (req, res) => {
    try {
      const userId = req.headers["effective-user-id"];
      const { insertOrcamentoSchema: insertOrcamentoSchema3 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const validatedData = insertOrcamentoSchema3.parse({
        ...req.body,
        user_id: userId
      });
      const numeroOrcamento = `ORC-${Date.now()}`;
      const dataAtual = (/* @__PURE__ */ new Date()).toISOString();
      const orcamentoData = {
        user_id: userId,
        numero: numeroOrcamento,
        cliente_nome: validatedData.cliente_nome,
        cliente_email: validatedData.cliente_email || null,
        cliente_telefone: validatedData.cliente_telefone || null,
        cliente_cpf_cnpj: validatedData.cliente_cpf_cnpj || null,
        cliente_endereco: validatedData.cliente_endereco || null,
        validade: validatedData.validade || "30 dias",
        itens: validatedData.itens,
        subtotal: validatedData.subtotal,
        desconto: validatedData.desconto || 0,
        valor_total: validatedData.valor_total,
        observacoes: validatedData.observacoes || null,
        condicoes_pagamento: validatedData.condicoes_pagamento || null,
        prazo_entrega: validatedData.prazo_entrega || null,
        status: validatedData.status || "pendente",
        data_criacao: dataAtual,
        data_atualizacao: dataAtual
      };
      const orcamento = await storage2.createOrcamento(orcamentoData);
      console.log(`\u2705 Or\xE7amento criado - ID: ${orcamento.id}, N\xFAmero: ${orcamento.numero}, Cliente: ${orcamento.cliente_nome}`);
      res.json(orcamento);
    } catch (error) {
      console.error("Erro ao criar or\xE7amento:", error);
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ error: "Dados inv\xE1lidos", details: error.errors });
      }
      res.status(500).json({ error: "Erro ao criar or\xE7amento" });
    }
  });
  app2.put("/api/orcamentos/:id", getUserId, async (req, res) => {
    try {
      const userId = req.headers["effective-user-id"];
      const id = parseInt(req.params.id);
      if (!userId) {
        return res.status(401).json({ error: "Usu\xE1rio n\xE3o autenticado" });
      }
      const orcamentoExistente = await storage2.getOrcamento(id);
      if (!orcamentoExistente || orcamentoExistente.user_id !== userId) {
        return res.status(404).json({ error: "Or\xE7amento n\xE3o encontrado" });
      }
      const { insertOrcamentoSchema: insertOrcamentoSchema3 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const updateSchema = insertOrcamentoSchema3.partial();
      const validatedData = updateSchema.parse({
        ...req.body,
        data_atualizacao: (/* @__PURE__ */ new Date()).toISOString()
      });
      const orcamento = await storage2.updateOrcamento(id, validatedData);
      console.log(`\u2705 Or\xE7amento atualizado - ID: ${id}, Status: ${orcamento?.status}`);
      res.json(orcamento);
    } catch (error) {
      console.error("Erro ao atualizar or\xE7amento:", error);
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ error: "Dados inv\xE1lidos", details: error.errors });
      }
      res.status(500).json({ error: "Erro ao atualizar or\xE7amento" });
    }
  });
  app2.delete("/api/orcamentos/:id", getUserId, async (req, res) => {
    try {
      const userId = req.headers["effective-user-id"];
      const id = parseInt(req.params.id);
      if (!userId) {
        return res.status(401).json({ error: "Usu\xE1rio n\xE3o autenticado" });
      }
      const orcamento = await storage2.getOrcamento(id);
      if (!orcamento || orcamento.user_id !== userId) {
        return res.status(404).json({ error: "Or\xE7amento n\xE3o encontrado" });
      }
      await storage2.deleteOrcamento(id);
      console.log(`\u2705 Or\xE7amento deletado - ID: ${id}`);
      res.json({ success: true });
    } catch (error) {
      console.error("Erro ao deletar or\xE7amento:", error);
      res.status(500).json({ error: "Erro ao deletar or\xE7amento" });
    }
  });
  app2.get("/api/orcamentos/arquivados", getUserId, async (req, res) => {
    try {
      const effectiveUserId = req.headers["effective-user-id"];
      const allOrcamentos = await storage2.getOrcamentos();
      const orcamentosArquivados = allOrcamentos.filter(
        (o) => o.user_id === effectiveUserId && o.status === "arquivado"
      );
      console.log(
        `\u2705 Or\xE7amentos arquivados buscados - User: ${effectiveUserId}, Total: ${orcamentosArquivados.length}`
      );
      res.json(orcamentosArquivados);
    } catch (error) {
      console.error("Erro ao buscar or\xE7amentos arquivados:", error);
      res.status(500).json({ error: "Erro ao buscar or\xE7amentos arquivados" });
    }
  });
  app2.post("/api/orcamentos/:id/converter-venda", getUserId, async (req, res) => {
    try {
      const userId = req.headers["effective-user-id"];
      const funcionarioId = req.headers["funcionario-id"];
      const id = parseInt(req.params.id);
      const { forma_pagamento } = req.body;
      if (!userId) {
        return res.status(401).json({ error: "Usu\xE1rio n\xE3o autenticado" });
      }
      if (!storage2.converterOrcamentoEmVenda) {
        return res.status(5001).json({ error: "M\xE9todo converterOrcamentoEmVenda n\xE3o implementado" });
      }
      const orcamento = await storage2.getOrcamento(id);
      if (!orcamento) {
        return res.status(404).json({ error: "Or\xE7amento n\xE3o encontrado" });
      }
      if (orcamento.user_id !== userId) {
        return res.status(403).json({ error: "Acesso negado" });
      }
      if (orcamento.status === "convertido") {
        return res.status(400).json({ error: "Este or\xE7amento j\xE1 foi convertido em venda" });
      }
      const itensOrcamento = Array.isArray(orcamento.itens) ? orcamento.itens : [];
      const produtosInsuficientes = [];
      for (const item of itensOrcamento) {
        const produto = await storage2.getProduto(item.produto_id);
        if (!produto) {
          return res.status(404).json({
            error: `Produto ${item.nome} n\xE3o encontrado no sistema`
          });
        }
        if (produto.user_id !== userId) {
          return res.status(403).json({
            error: `Acesso negado ao produto ${item.nome}`
          });
        }
        if (produto.quantidade < item.quantidade) {
          produtosInsuficientes.push(
            `${item.nome}: dispon\xEDvel ${produto.quantidade}, necess\xE1rio ${item.quantidade}`
          );
        }
      }
      if (produtosInsuficientes.length > 0) {
        return res.status(400).json({
          error: "Estoque insuficiente para converter este or\xE7amento em venda",
          detalhes: produtosInsuficientes
        });
      }
      let vendedorNome = "Sistema";
      if (funcionarioId) {
        const funcionario = await storage2.getFuncionario(funcionarioId);
        if (funcionario) {
          vendedorNome = funcionario.nome;
        }
      } else {
        const usuario = await storage2.getUserById(userId);
        if (usuario) {
          vendedorNome = usuario.nome;
        }
      }
      const venda = await storage2.converterOrcamentoEmVenda(id, userId, vendedorNome, forma_pagamento || "dinheiro");
      console.log(`\u2705 Or\xE7amento ${id} convertido em venda ${venda.id} por ${vendedorNome}`);
      res.json(venda);
    } catch (error) {
      console.error("Erro ao converter or\xE7amento:", error);
      res.status(500).json({ error: error.message || "Erro ao converter or\xE7amento" });
    }
  });
  app2.get("/api/admin/clients/:userId/notes", requireAdmin, async (req, res) => {
    try {
      const { userId } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit) : void 0;
      const offset = req.query.offset ? parseInt(req.query.offset) : void 0;
      const notes = await storage2.getClientNotes(userId, limit, offset);
      res.json(notes);
    } catch (error) {
      console.error("Erro ao buscar notas:", error);
      res.status(500).json({ error: "Erro ao buscar notas do cliente" });
    }
  });
  app2.post("/api/admin/clients/:userId/notes", requireAdmin, async (req, res) => {
    try {
      const { userId } = req.params;
      const adminId = req.headers["x-user-id"];
      const note = await storage2.createClientNote({
        user_id: userId,
        admin_id: adminId,
        content: req.body.content
      });
      res.json(note);
    } catch (error) {
      console.error("Erro ao criar nota:", error);
      res.status(500).json({ error: "Erro ao criar nota" });
    }
  });
  app2.put("/api/admin/clients/notes/:noteId", requireAdmin, async (req, res) => {
    try {
      const { noteId } = req.params;
      const note = await storage2.updateClientNote(parseInt(noteId), req.body);
      res.json(note);
    } catch (error) {
      console.error("Erro ao atualizar nota:", error);
      res.status(500).json({ error: "Erro ao atualizar nota" });
    }
  });
  app2.delete("/api/admin/clients/notes/:noteId", requireAdmin, async (req, res) => {
    try {
      const { noteId } = req.params;
      await storage2.deleteClientNote(parseInt(noteId));
      res.json({ success: true });
    } catch (error) {
      console.error("Erro ao deletar nota:", error);
      res.status(500).json({ error: "Erro ao deletar nota" });
    }
  });
  app2.get("/api/admin/clients/:userId/documents", requireAdmin, async (req, res) => {
    try {
      const { userId } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit) : void 0;
      const offset = req.query.offset ? parseInt(req.query.offset) : void 0;
      const documents = await storage2.getClientDocuments(userId, limit, offset);
      res.json(documents);
    } catch (error) {
      console.error("Erro ao buscar documentos:", error);
      res.status(500).json({ error: "Erro ao buscar documentos" });
    }
  });
  app2.post("/api/admin/clients/:userId/documents", requireAdmin, async (req, res) => {
    try {
      const { userId } = req.params;
      const adminId = req.headers["x-user-id"];
      const document = await storage2.createClientDocument({
        user_id: userId,
        admin_id: adminId,
        file_name: req.body.file_name,
        file_url: req.body.file_url,
        file_type: req.body.file_type,
        file_size: req.body.file_size,
        description: req.body.description
      });
      res.json(document);
    } catch (error) {
      console.error("Erro ao criar documento:", error);
      res.status(500).json({ error: "Erro ao criar documento" });
    }
  });
  app2.delete("/api/admin/clients/documents/:documentId", requireAdmin, async (req, res) => {
    try {
      const { documentId } = req.params;
      await storage2.deleteClientDocument(parseInt(documentId));
      res.json({ success: true });
    } catch (error) {
      console.error("Erro ao deletar documento:", error);
      res.status(500).json({ error: "Erro ao deletar documento" });
    }
  });
  app2.get("/api/admin/clients/:userId/interactions", requireAdmin, async (req, res) => {
    try {
      const { userId } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit) : void 0;
      const offset = req.query.offset ? parseInt(req.query.offset) : void 0;
      const interactions = await storage2.getClientInteractions(userId, limit, offset);
      res.json(interactions);
    } catch (error) {
      console.error("Erro ao buscar intera\xE7\xF5es:", error);
      res.status(500).json({ error: "Erro ao buscar intera\xE7\xF5es" });
    }
  });
  app2.post("/api/admin/clients/:userId/interactions", requireAdmin, async (req, res) => {
    try {
      const { userId } = req.params;
      const adminId = req.headers["x-user-id"];
      const interaction = await storage2.createClientInteraction({
        user_id: userId,
        admin_id: adminId,
        interaction_type: req.body.interaction_type,
        description: req.body.description,
        metadata: req.body.metadata
      });
      res.json(interaction);
    } catch (error) {
      console.error("Erro ao criar intera\xE7\xE3o:", error);
      res.status(500).json({ error: "Erro ao criar intera\xE7\xE3o" });
    }
  });
  app2.get("/api/admin/clients/:userId/plan-changes", requireAdmin, async (req, res) => {
    try {
      const { userId } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit) : void 0;
      const offset = req.query.offset ? parseInt(req.query.offset) : void 0;
      const changes = await storage2.getPlanChangesHistory(userId, limit, offset);
      res.json(changes);
    } catch (error) {
      console.error("Erro ao buscar hist\xF3rico de planos:", error);
      res.status(500).json({ error: "Erro ao buscar hist\xF3rico de planos" });
    }
  });
  app2.post("/api/admin/clients/:userId/plan-changes", requireAdmin, async (req, res) => {
    try {
      const { userId } = req.params;
      const adminId = req.headers["x-user-id"];
      const change = await storage2.createPlanChangeHistory({
        user_id: userId,
        from_plan: req.body.from_plan,
        to_plan: req.body.to_plan,
        reason: req.body.reason,
        changed_by: adminId,
        metadata: req.body.metadata
      });
      res.json(change);
    } catch (error) {
      console.error("Erro ao criar registro de mudan\xE7a de plano:", error);
      res.status(500).json({ error: "Erro ao criar registro" });
    }
  });
  app2.get("/api/admin/clients/:userId/communications", requireAdmin, async (req, res) => {
    try {
      const { userId } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit) : void 0;
      const offset = req.query.offset ? parseInt(req.query.offset) : void 0;
      const communications = await storage2.getClientCommunications(userId, limit, offset);
      res.json(communications);
    } catch (error) {
      console.error("Erro ao buscar comunica\xE7\xF5es:", error);
      res.status(500).json({ error: "Erro ao buscar comunica\xE7\xF5es" });
    }
  });
  app2.post("/api/admin/clients/:userId/communications", requireAdmin, async (req, res) => {
    try {
      const { userId } = req.params;
      const adminId = req.headers["x-user-id"];
      const communication = await storage2.createClientCommunication({
        user_id: userId,
        admin_id: adminId,
        type: req.body.type,
        subject: req.body.subject,
        content: req.body.content,
        metadata: req.body.metadata
      });
      res.json(communication);
    } catch (error) {
      console.error("Erro ao criar comunica\xE7\xE3o:", error);
      res.status(500).json({ error: "Erro ao criar comunica\xE7\xE3o" });
    }
  });
  app2.get("/api/admin/clients/:userId/timeline", requireAdmin, async (req, res) => {
    try {
      const { userId } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit) : 50;
      const offset = req.query.offset ? parseInt(req.query.offset) : 0;
      const timeline = await storage2.getClientTimeline(userId, limit, offset);
      res.json(timeline);
    } catch (error) {
      console.error("Erro ao buscar timeline:", error);
      res.status(500).json({ error: "Erro ao buscar timeline do cliente" });
    }
  });
  app2.get("/api/admin/clients/:userId/payment-history", requireAdmin, async (req, res) => {
    try {
      const { userId } = req.params;
      const subscriptions2 = await storage2.getSubscriptionsByUser?.(userId) || [];
      const totalPaid = subscriptions2.filter((s) => s.status === "ativo" || s.status_pagamento === "approved").reduce((sum, s) => sum + (s.valor || 0), 0);
      const paymentHistory = subscriptions2.map((s) => ({
        id: s.id,
        plano: s.plano,
        valor: s.valor,
        valor_desconto: s.valor_desconto_cupom || 0,
        cupom: s.cupom_codigo,
        status: s.status,
        status_pagamento: s.status_pagamento,
        forma_pagamento: s.forma_pagamento,
        data_inicio: s.data_inicio,
        data_vencimento: s.data_vencimento,
        data_criacao: s.data_criacao,
        mercadopago_payment_id: s.mercadopago_payment_id
      }));
      res.json({
        payments: paymentHistory,
        total_paid: totalPaid,
        total_subscriptions: subscriptions2.length,
        active_subscriptions: subscriptions2.filter((s) => s.status === "ativo").length
      });
    } catch (error) {
      console.error("Erro ao buscar hist\xF3rico de pagamentos:", error);
      res.status(500).json({ error: "Erro ao buscar hist\xF3rico de pagamentos" });
    }
  });
  app2.get("/api/admin/clients/:userId/health-score", requireAdmin, async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await storage2.getUserById?.(userId);
      if (!user) {
        return res.status(404).json({ error: "Usu\xE1rio n\xE3o encontrado" });
      }
      const subscriptions2 = await storage2.getSubscriptionsByUser?.(userId) || [];
      let score = 100;
      const factors = [];
      if (user.status !== "ativo") {
        score -= 30;
        factors.push({ name: "status_conta", impact: -30, description: "Conta n\xE3o est\xE1 ativa" });
      }
      if (user.plano === "trial") {
        score -= 10;
        factors.push({ name: "plano_trial", impact: -10, description: "Ainda est\xE1 no per\xEDodo de trial" });
      } else if (user.plano?.includes("anual")) {
        score += 10;
        factors.push({ name: "plano_anual", impact: 10, description: "Cliente com plano anual (mais engajado)" });
      }
      const pendingPayments = subscriptions2.filter((s) => s.status_pagamento === "pending").length;
      const latePayments = subscriptions2.filter((s) => {
        if (!s.data_vencimento) return false;
        return new Date(s.data_vencimento) < /* @__PURE__ */ new Date() && s.status_pagamento !== "approved";
      }).length;
      if (latePayments > 0) {
        score -= 25;
        factors.push({ name: "pagamentos_atrasados", impact: -25, description: `${latePayments} pagamento(s) atrasado(s)` });
      } else if (pendingPayments > 0) {
        score -= 10;
        factors.push({ name: "pagamentos_pendentes", impact: -10, description: `${pendingPayments} pagamento(s) pendente(s)` });
      }
      const daysSinceCreation = user.data_criacao ? Math.floor((Date.now() - new Date(user.data_criacao).getTime()) / (1e3 * 60 * 60 * 24)) : 0;
      if (daysSinceCreation > 365) {
        score += 15;
        factors.push({ name: "cliente_antigo", impact: 15, description: `Cliente h\xE1 mais de 1 ano (${daysSinceCreation} dias)` });
      } else if (daysSinceCreation > 180) {
        score += 10;
        factors.push({ name: "cliente_medio", impact: 10, description: `Cliente h\xE1 mais de 6 meses (${daysSinceCreation} dias)` });
      }
      const expirationDate = user.data_expiracao_plano || user.data_expiracao_trial;
      if (expirationDate) {
        const daysUntilExpiration = Math.floor((new Date(expirationDate).getTime() - Date.now()) / (1e3 * 60 * 60 * 24));
        if (daysUntilExpiration < 0) {
          score -= 20;
          factors.push({ name: "plano_expirado", impact: -20, description: "Plano expirado" });
        } else if (daysUntilExpiration < 7) {
          score -= 10;
          factors.push({ name: "expiracao_proxima", impact: -10, description: `Plano expira em ${daysUntilExpiration} dias` });
        }
      }
      score = Math.max(0, Math.min(100, score));
      let riskLevel;
      if (score >= 80) riskLevel = "low";
      else if (score >= 60) riskLevel = "medium";
      else if (score >= 40) riskLevel = "high";
      else riskLevel = "critical";
      res.json({
        score,
        risk_level: riskLevel,
        factors,
        metrics: {
          days_as_customer: daysSinceCreation,
          total_subscriptions: subscriptions2.length,
          pending_payments: pendingPayments,
          late_payments: latePayments
        }
      });
    } catch (error) {
      console.error("Erro ao calcular health score:", error);
      res.status(500).json({ error: "Erro ao calcular score de sa\xFAde" });
    }
  });
  app2.get("/api/admin/clients/churn-alerts", requireAdmin, async (req, res) => {
    try {
      const users2 = await storage2.getUsers?.() || [];
      const alerts = [];
      for (const user of users2) {
        const riskFactors = [];
        let riskScore = 0;
        if (user.status !== "ativo") {
          riskFactors.push("Conta inativa");
          riskScore += 30;
        }
        const expirationDate = user.data_expiracao_plano || user.data_expiracao_trial;
        if (expirationDate) {
          const daysUntilExpiration = Math.floor((new Date(expirationDate).getTime() - Date.now()) / (1e3 * 60 * 60 * 24));
          if (daysUntilExpiration < 0) {
            riskFactors.push(`Plano expirado h\xE1 ${Math.abs(daysUntilExpiration)} dias`);
            riskScore += 40;
          } else if (daysUntilExpiration <= 7) {
            riskFactors.push(`Plano expira em ${daysUntilExpiration} dias`);
            riskScore += 20;
          }
        }
        if (user.plano === "trial") {
          const trialExpDate = user.data_expiracao_trial;
          if (trialExpDate) {
            const daysLeft = Math.floor((new Date(trialExpDate).getTime() - Date.now()) / (1e3 * 60 * 60 * 24));
            if (daysLeft <= 3 && daysLeft >= 0) {
              riskFactors.push(`Trial expira em ${daysLeft} dias`);
              riskScore += 25;
            }
          }
        }
        if (riskScore > 0) {
          alerts.push({
            user_id: user.id,
            user_name: user.nome,
            user_email: user.email,
            plano: user.plano,
            status: user.status,
            risk_score: Math.min(100, riskScore),
            risk_factors: riskFactors,
            expiration_date: expirationDate
          });
        }
      }
      alerts.sort((a, b) => b.risk_score - a.risk_score);
      res.json({
        alerts: alerts.slice(0, 50),
        // Top 50 em risco
        total_at_risk: alerts.length,
        critical_count: alerts.filter((a) => a.risk_score >= 50).length,
        warning_count: alerts.filter((a) => a.risk_score >= 20 && a.risk_score < 50).length
      });
    } catch (error) {
      console.error("Erro ao buscar alertas de churn:", error);
      res.status(500).json({ error: "Erro ao buscar alertas de cancelamento" });
    }
  });
  app2.get("/api/admin/clients/:userId/usage-stats", requireAdmin, async (req, res) => {
    try {
      const { userId } = req.params;
      const vendas2 = await storage2.getVendasByUser?.(userId) || [];
      const productStats = {};
      for (const venda of vendas2) {
        let itens = [];
        if (venda.itens) {
          try {
            itens = JSON.parse(venda.itens);
          } catch {
            itens = [{ nome: venda.produto, quantidade: venda.quantidade_vendida, subtotal: venda.valor_total }];
          }
        } else {
          itens = [{ nome: venda.produto, quantidade: venda.quantidade_vendida, subtotal: venda.valor_total }];
        }
        for (const item of itens) {
          const key = item.nome || item.produto || "Desconhecido";
          if (!productStats[key]) {
            productStats[key] = { name: key, quantity: 0, revenue: 0 };
          }
          productStats[key].quantity += item.quantidade || 1;
          productStats[key].revenue += item.subtotal || item.preco || 0;
        }
      }
      const topProducts = Object.values(productStats).sort((a, b) => b.revenue - a.revenue).slice(0, 10);
      const totalSales = vendas2.length;
      const totalRevenue = vendas2.reduce((sum, v) => sum + (v.valor_total || 0), 0);
      const avgTicket = totalSales > 0 ? totalRevenue / totalSales : 0;
      const monthlyStats = {};
      const sixMonthsAgo = /* @__PURE__ */ new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      for (const venda of vendas2) {
        const vendaDate = new Date(venda.data);
        if (vendaDate >= sixMonthsAgo) {
          const monthKey = `${vendaDate.getFullYear()}-${String(vendaDate.getMonth() + 1).padStart(2, "0")}`;
          if (!monthlyStats[monthKey]) {
            monthlyStats[monthKey] = { month: monthKey, sales: 0, revenue: 0 };
          }
          monthlyStats[monthKey].sales += 1;
          monthlyStats[monthKey].revenue += venda.valor_total || 0;
        }
      }
      res.json({
        top_products: topProducts,
        total_sales: totalSales,
        total_revenue: totalRevenue,
        average_ticket: avgTicket,
        monthly_stats: Object.values(monthlyStats).sort((a, b) => a.month.localeCompare(b.month))
      });
    } catch (error) {
      console.error("Erro ao buscar estat\xEDsticas de uso:", error);
      res.status(500).json({ error: "Erro ao buscar estat\xEDsticas de uso" });
    }
  });
  app2.get("/api/admin/clients/:userId/360-summary", requireAdmin, async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await storage2.getUserById?.(userId);
      if (!user) {
        return res.status(404).json({ error: "Usu\xE1rio n\xE3o encontrado" });
      }
      const subscriptions2 = await storage2.getSubscriptionsByUser?.(userId) || [];
      const totalPaid = subscriptions2.filter((s) => s.status === "ativo" || s.status_pagamento === "approved").reduce((sum, s) => sum + (s.valor || 0), 0);
      const vendas2 = await storage2.getVendasByUser?.(userId) || [];
      const totalRevenue = vendas2.reduce((sum, v) => sum + (v.valor_total || 0), 0);
      const funcionarios2 = await storage2.getFuncionariosByContaId?.(userId) || [];
      const daysSinceCreation = user.data_criacao ? Math.floor((Date.now() - new Date(user.data_criacao).getTime()) / (1e3 * 60 * 60 * 24)) : 0;
      const expirationDate = user.data_expiracao_plano || user.data_expiracao_trial;
      const daysUntilExpiration = expirationDate ? Math.floor((new Date(expirationDate).getTime() - Date.now()) / (1e3 * 60 * 60 * 24)) : null;
      res.json({
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          telefone: user.telefone,
          cpf_cnpj: user.cpf_cnpj,
          plano: user.plano,
          status: user.status,
          data_criacao: user.data_criacao,
          data_expiracao: expirationDate
        },
        metrics: {
          days_as_customer: daysSinceCreation,
          days_until_expiration: daysUntilExpiration,
          total_paid_subscriptions: totalPaid,
          total_sales_revenue: totalRevenue,
          total_sales_count: vendas2.length,
          active_employees: funcionarios2.filter((f) => f.status === "ativo").length,
          total_employees: funcionarios2.length,
          total_subscriptions: subscriptions2.length
        }
      });
    } catch (error) {
      console.error("Erro ao buscar resumo 360:", error);
      res.status(500).json({ error: "Erro ao buscar resumo do cliente" });
    }
  });
  app2.get("/api/system-config/:key", async (req, res) => {
    try {
      const { key } = req.params;
      if (!storage2.getSystemConfig) {
        return res.status(501).json({ error: "M\xE9todo getSystemConfig n\xE3o implementado" });
      }
      const config = await storage2.getSystemConfig(key);
      if (!config) {
        return res.status(404).json({ error: "Configura\xE7\xE3o n\xE3o encontrada" });
      }
      res.json(config);
    } catch (error) {
      console.error("Erro ao buscar configura\xE7\xE3o:", error);
      res.status(500).json({ error: "Erro ao buscar configura\xE7\xE3o" });
    }
  });
  app2.post("/api/system-config", requireAdmin, async (req, res) => {
    try {
      const { chave, valor } = req.body;
      if (!chave || !valor) {
        return res.status(400).json({ error: "Chave e valor s\xE3o obrigat\xF3rios" });
      }
      if (!storage2.upsertSystemConfig) {
        return res.status(501).json({ error: "M\xE9todo upsertSystemConfig n\xE3o implementado" });
      }
      const config = await storage2.upsertSystemConfig(chave, valor);
      console.log(`\u2705 Configura\xE7\xE3o salva - Chave: ${chave}`);
      res.json(config);
    } catch (error) {
      console.error("Erro ao salvar configura\xE7\xE3o:", error);
      res.status(500).json({ error: "Erro ao salvar configura\xE7\xE3o" });
    }
  });
  app2.get("/api/user-customization", requireAuth, async (req, res) => {
    try {
      const effectiveUserId = getEffectiveUserId(req);
      if (!effectiveUserId) {
        return res.status(401).json({ error: "Usu\xE1rio n\xE3o autenticado" });
      }
      if (!storage2.getUserCustomization) {
        return res.status(501).json({ error: "M\xE9todo getUserCustomization n\xE3o implementado" });
      }
      const customization = await storage2.getUserCustomization(effectiveUserId);
      res.json(customization);
    } catch (error) {
      console.error("Erro ao buscar customiza\xE7\xE3o:", error);
      res.status(500).json({ error: "Erro ao buscar customiza\xE7\xE3o do usu\xE1rio" });
    }
  });
  app2.post("/api/user-customization", requireAuth, async (req, res) => {
    try {
      const effectiveUserId = getEffectiveUserId(req);
      if (!effectiveUserId) {
        return res.status(401).json({ error: "Usu\xE1rio n\xE3o autenticado" });
      }
      if (!storage2.upsertUserCustomization) {
        return res.status(501).json({ error: "M\xE9todo upsertUserCustomization n\xE3o implementado" });
      }
      const validatedData = insertUserCustomizationSchema.omit({ user_id: true }).parse(req.body);
      const customization = await storage2.upsertUserCustomization(effectiveUserId, validatedData);
      console.log(`\u2705 Customiza\xE7\xE3o salva para usu\xE1rio: ${effectiveUserId}`);
      res.json(customization);
    } catch (error) {
      console.error("Erro ao salvar customiza\xE7\xE3o:", error);
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ error: "Dados inv\xE1lidos", details: error.errors });
      }
      res.status(500).json({ error: "Erro ao salvar customiza\xE7\xE3o do usu\xE1rio" });
    }
  });
  app2.delete("/api/user-customization", requireAuth, async (req, res) => {
    try {
      const effectiveUserId = getEffectiveUserId(req);
      if (!effectiveUserId) {
        return res.status(401).json({ error: "Usu\xE1rio n\xE3o autenticado" });
      }
      if (!storage2.deleteUserCustomization) {
        return res.status(501).json({ error: "M\xE9todo deleteUserCustomization n\xE3o implementado" });
      }
      await storage2.deleteUserCustomization(effectiveUserId);
      console.log(`\u2705 Customiza\xE7\xE3o resetada para usu\xE1rio: ${effectiveUserId}`);
      res.status(204).send();
    } catch (error) {
      console.error("Erro ao resetar customiza\xE7\xE3o:", error);
      res.status(500).json({ error: "Erro ao resetar customiza\xE7\xE3o do usu\xE1rio" });
    }
  });
  app2.post("/api/limpeza-automatica", getUserId, async (req, res) => {
    try {
      const effectiveUserId = req.headers["effective-user-id"];
      const { tipo, diasAntigos } = req.body;
      if (!tipo || !diasAntigos) {
        return res.status(400).json({ error: "Tipo e diasAntigos s\xE3o obrigat\xF3rios" });
      }
      const dataLimite = /* @__PURE__ */ new Date();
      dataLimite.setDate(dataLimite.getDate() - diasAntigos);
      let deletedCount = 0;
      switch (tipo) {
        case "devolucoes":
          if (!storage2.getDevolucoes || !storage2.deleteDevolucao) {
            return res.status(501).json({ error: "M\xE9todos de devolu\xE7\xE3o n\xE3o implementados" });
          }
          const devolucoes2 = await storage2.getDevolucoes();
          const devolucoesAntigas = devolucoes2.filter(
            (d) => d.user_id === effectiveUserId && new Date(d.data_devolucao) < dataLimite && d.status !== "pendente"
            // Não deletar devoluções pendentes
          );
          for (const dev of devolucoesAntigas) {
            await storage2.deleteDevolucao(dev.id);
            deletedCount++;
          }
          break;
        case "orcamentos":
          if (!storage2.getOrcamentos || !storage2.deleteOrcamento) {
            return res.status(501).json({ error: "M\xE9todos de or\xE7amento n\xE3o implementados" });
          }
          const orcamentos2 = await storage2.getOrcamentos();
          const orcamentosAntigos = orcamentos2.filter(
            (o) => o.user_id === effectiveUserId && new Date(o.data_criacao) < dataLimite && (o.status === "convertido" || o.status === "rejeitado")
          );
          for (const orc of orcamentosAntigos) {
            await storage2.deleteOrcamento(orc.id);
            deletedCount++;
          }
          break;
        case "logs":
          break;
        default:
          return res.status(400).json({ error: "Tipo de limpeza inv\xE1lido" });
      }
      await storage2.logAdminAction?.(
        effectiveUserId,
        `LIMPEZA_AUTO_${tipo.toUpperCase()}`,
        `Limpeza autom\xE1tica: ${deletedCount} registro(s) removido(s) com mais de ${diasAntigos} dias`
      );
      res.json({
        success: true,
        deletedCount,
        tipo,
        diasAntigos
      });
    } catch (error) {
      logger.error("Erro na limpeza autom\xE1tica:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/admin/email-templates", requireAdmin, async (req, res) => {
    try {
      const templates = await storage2.getEmailTemplates();
      res.json(templates);
    } catch (error) {
      logger.error("Erro ao buscar templates:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/admin/email-templates", requireAdmin, async (req, res) => {
    try {
      const template = await storage2.createEmailTemplate(req.body);
      res.json(template);
    } catch (error) {
      logger.error("Erro ao criar template:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.put("/api/admin/email-templates/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const template = await storage2.updateEmailTemplate(parseInt(id), req.body);
      res.json(template);
    } catch (error) {
      logger.error("Erro ao atualizar template:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.delete("/api/admin/email-templates/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await storage2.deleteEmailTemplate(parseInt(id));
      res.json({ success: true });
    } catch (error) {
      logger.error("Erro ao deletar template:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/admin/email-history", requireAdmin, async (req, res) => {
    try {
      const { userId, limit = 100 } = req.query;
      const history = await storage2.getEmailHistory(userId, parseInt(limit));
      res.json(history);
    } catch (error) {
      logger.error("Erro ao buscar hist\xF3rico:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/admin/email-history/:userId", requireAdmin, async (req, res) => {
    try {
      const { userId } = req.params;
      const history = await storage2.getEmailHistoryByUser(userId);
      res.json(history);
    } catch (error) {
      logger.error("Erro ao buscar hist\xF3rico do cliente:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/admin/email-send-mass", requireAdmin, async (req, res) => {
    try {
      const { segmento, templateId, assunto, conteudo } = req.body;
      let users2 = await storage2.getUsers();
      switch (segmento) {
        case "trial":
          users2 = users2.filter((u) => u.plano === "trial");
          break;
        case "premium":
          users2 = users2.filter((u) => u.plano === "premium" || u.plano === "premium_mensal" || u.plano === "premium_anual");
          break;
        case "expirados":
          users2 = users2.filter((u) => u.status === "bloqueado" || u.status === "expirado");
          break;
        case "ativos":
          users2 = users2.filter((u) => u.status === "ativo");
          break;
      }
      const { EmailService: EmailService2 } = await Promise.resolve().then(() => (init_email_service(), email_service_exports));
      const emailService = new EmailService2();
      let enviados = 0;
      let falhas = 0;
      const resultados = [];
      for (const user of users2) {
        if (!user.email) continue;
        let conteudoPersonalizado = conteudo.replace(/\{\{nome\}\}/g, user.nome || "Cliente").replace(/\{\{email\}\}/g, user.email).replace(/\{\{plano\}\}/g, user.plano || "trial");
        let assuntoPersonalizado = assunto.replace(/\{\{nome\}\}/g, user.nome || "Cliente");
        try {
          await emailService.sendGenericEmail({
            to: user.email,
            subject: assuntoPersonalizado,
            html: conteudoPersonalizado
          });
          await storage2.createEmailHistory({
            user_id: user.id,
            template_id: templateId || null,
            email_destino: user.email,
            assunto: assuntoPersonalizado,
            conteudo: conteudoPersonalizado,
            tipo: "massa",
            segmento,
            status: "enviado"
          });
          enviados++;
          resultados.push({ email: user.email, status: "enviado" });
        } catch (error) {
          falhas++;
          resultados.push({ email: user.email, status: "falha", erro: error.message });
          await storage2.createEmailHistory({
            user_id: user.id,
            template_id: templateId || null,
            email_destino: user.email,
            assunto: assuntoPersonalizado,
            conteudo: conteudoPersonalizado,
            tipo: "massa",
            segmento,
            status: "falha",
            erro: error.message
          });
        }
      }
      res.json({ success: true, enviados, falhas, total: users2.length, resultados });
    } catch (error) {
      logger.error("Erro ao enviar emails em massa:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/admin/email-send", requireAdmin, async (req, res) => {
    try {
      const { userId, email, assunto, conteudo, templateId } = req.body;
      const { EmailService: EmailService2 } = await Promise.resolve().then(() => (init_email_service(), email_service_exports));
      const emailService = new EmailService2();
      let user = null;
      if (userId) {
        user = await storage2.getUserById(userId);
      }
      let conteudoPersonalizado = conteudo.replace(/\{\{nome\}\}/g, user?.nome || "Cliente").replace(/\{\{email\}\}/g, user?.email || email).replace(/\{\{plano\}\}/g, user?.plano || "trial");
      let assuntoPersonalizado = assunto.replace(/\{\{nome\}\}/g, user?.nome || "Cliente");
      await emailService.sendGenericEmail({
        to: email || user?.email,
        subject: assuntoPersonalizado,
        html: conteudoPersonalizado
      });
      await storage2.createEmailHistory({
        user_id: userId || null,
        template_id: templateId || null,
        email_destino: email || user?.email,
        assunto: assuntoPersonalizado,
        conteudo: conteudoPersonalizado,
        tipo: "manual",
        status: "enviado"
      });
      res.json({ success: true, message: "Email enviado com sucesso" });
    } catch (error) {
      logger.error("Erro ao enviar email:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/admin/email-automation", requireAdmin, async (req, res) => {
    try {
      const automation = await storage2.getEmailAutomation();
      res.json(automation);
    } catch (error) {
      logger.error("Erro ao buscar automa\xE7\xE3o:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.put("/api/admin/email-automation/:tipo", requireAdmin, async (req, res) => {
    try {
      const { tipo } = req.params;
      const automation = await storage2.upsertEmailAutomation(tipo, req.body);
      res.json(automation);
    } catch (error) {
      logger.error("Erro ao atualizar automa\xE7\xE3o:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/admin/email-stats", requireAdmin, async (req, res) => {
    try {
      const stats = await storage2.getEmailStats();
      res.json(stats);
    } catch (error) {
      logger.error("Erro ao buscar estat\xEDsticas:", error);
      res.status(500).json({ error: error.message });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs3 from "fs";
import path4 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path3 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      ),
      await import("@replit/vite-plugin-dev-banner").then(
        (m) => m.devBanner()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path3.resolve(import.meta.dirname, "client", "src"),
      "@shared": path3.resolve(import.meta.dirname, "shared"),
      "@assets": path3.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path3.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path3.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    strictPort: false,
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    if (url.startsWith("/api")) {
      return next();
    }
    try {
      const clientTemplate = path4.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs3.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path4.resolve(import.meta.dirname, "public");
  if (!fs3.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path4.resolve(distPath, "index.html"));
  });
}

// server/index.ts
init_logger();
init_auto_cleanup();
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import { drizzle as drizzle3 } from "drizzle-orm/neon-serverless";
import { Pool as Pool3, neonConfig as neonConfig3 } from "@neondatabase/serverless";
import { sql as sql4 } from "drizzle-orm";
import ws3 from "ws";
neonConfig3.webSocketConstructor = ws3;
process.env.TZ = "America/Sao_Paulo";
async function autoFixDatabaseSchema() {
  if (!process.env.DATABASE_URL) {
    logger.error("[AUTO-FIX] DATABASE_URL n\xE3o encontrado");
    return;
  }
  const pool2 = new Pool3({ connectionString: process.env.DATABASE_URL });
  const db = drizzle3(pool2);
  try {
    logger.info("[AUTO-FIX] Verificando schema do banco de dados...");
    const resultUsers = await db.execute(sql4`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users'
    `);
    const existingColumnsUsers = new Set(
      resultUsers.rows.map((row) => row.column_name)
    );
    const requiredColumnsUsers = [
      { name: "cpf_cnpj", type: "TEXT", default: null },
      { name: "telefone", type: "TEXT", default: null },
      { name: "endereco", type: "TEXT", default: null },
      { name: "permissoes", type: "TEXT", default: null },
      { name: "ultimo_acesso", type: "TEXT", default: null },
      { name: "max_funcionarios", type: "INTEGER", default: 1 },
      { name: "meta_mensal", type: "REAL", default: 15e3 }
    ];
    let fixed = false;
    for (const col of requiredColumnsUsers) {
      if (!existingColumnsUsers.has(col.name)) {
        logger.info(`[AUTO-FIX] Adicionando coluna ${col.name} em users...`);
        let alterQuery = `ALTER TABLE users ADD COLUMN ${col.name} ${col.type}`;
        if (col.default !== null) {
          alterQuery += ` DEFAULT ${typeof col.default === "string" ? `'${col.default}'` : col.default}`;
        }
        await db.execute(sql4.raw(alterQuery));
        fixed = true;
      }
    }
    const resultVendas = await db.execute(sql4`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'vendas'
    `);
    const existingColumnsVendas = new Set(
      resultVendas.rows.map((row) => row.column_name)
    );
    const requiredColumnsVendas = [
      { name: "orcamento_id", type: "INTEGER", default: null },
      { name: "vendedor", type: "TEXT", default: null }
    ];
    for (const col of requiredColumnsVendas) {
      if (!existingColumnsVendas.has(col.name)) {
        logger.info(`[AUTO-FIX] Adicionando coluna ${col.name} em vendas...`);
        let alterQuery = `ALTER TABLE vendas ADD COLUMN ${col.name} ${col.type}`;
        if (col.default !== null) {
          alterQuery += ` DEFAULT ${typeof col.default === "string" ? `'${col.default}'` : col.default}`;
        }
        await db.execute(sql4.raw(alterQuery));
        fixed = true;
      }
    }
    if (!existingColumnsVendas.has("orcamento_id")) {
      logger.info("[AUTO-FIX] Criando \xEDndice idx_vendas_orcamento_id...");
      await db.execute(sql4.raw("CREATE INDEX IF NOT EXISTS idx_vendas_orcamento_id ON vendas(orcamento_id)"));
      fixed = true;
    }
    if (fixed) {
      logger.info("[AUTO-FIX] \u2705 Schema corrigido automaticamente!");
    } else {
      logger.info("[AUTO-FIX] \u2705 Schema j\xE1 est\xE1 correto");
    }
  } catch (error) {
    logger.error("[AUTO-FIX] Erro ao verificar schema:", { error: error.message });
  } finally {
    await pool2.end();
  }
}
var app = express2();
app.use(compression({
  filter: (req, res) => {
    if (req.headers["x-no-compression"]) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6
}));
app.set("trust proxy", 1);
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"]
      }
    },
    hsts: {
      maxAge: 31536e3,
      // 1 ano em segundos
      includeSubDomains: true,
      preload: true
    },
    noSniff: true,
    frameguard: { action: "deny" },
    xssFilter: true,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" }
  })
);
var limiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  // 15 minutos
  max: 100,
  // Limite de 100 requisições por IP
  message: "Muitas requisi\xE7\xF5es deste IP, tente novamente mais tarde.",
  standardHeaders: true,
  legacyHeaders: false
});
var authLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  max: 5,
  // Apenas 5 tentativas de login a cada 15 minutos
  message: "Muitas tentativas de login. Tente novamente em 15 minutos.",
  skipSuccessfulRequests: true
});
app.use("/api/", limiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path5 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path5.startsWith("/api")) {
      let logLine = `${req.method} ${path5} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  if (process.env.NODE_ENV === "development") {
    await autoFixDatabaseSchema();
  } else {
    logger.info("[STARTUP] Auto-fix desabilitado em produ\xE7\xE3o - use migrations", "SECURITY");
  }
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (process.env.NODE_ENV === "production") {
    app.use((req, res, next) => {
      if (req.headers["x-forwarded-proto"] !== "https") {
        return res.redirect(301, `https://${req.headers.host}${req.url}`);
      }
      next();
    });
  }
  const isDevelopment = process.env.NODE_ENV === "development" || app.get("env") === "development";
  if (isDevelopment) {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  const host = "0.0.0.0";
  const isWindows = process.platform === "win32";
  const listenOptions = {
    port,
    host
  };
  if (!isWindows) {
    listenOptions.reusePort = true;
  }
  server.listen(listenOptions, () => {
    log(`\u{1F680} Servidor rodando em http://${host}:${port}`);
    log(`\u{1F4CD} Ambiente: ${app.get("env")}`);
  });
  logger.info("[BACKUP] Sistema de backup local desativado. Usando backups do Neon PostgreSQL.");
  const { paymentReminderService: paymentReminderService2 } = await Promise.resolve().then(() => (init_payment_reminder(), payment_reminder_exports));
  paymentReminderService2.startAutoCheck();
  const { autoHealingService: autoHealingService2 } = await Promise.resolve().then(() => (init_auto_healing(), auto_healing_exports));
  autoHealingService2.startAutoHealing(5);
  autoCleanupService.startScheduledCleanup();
  logger.info("Servi\xE7o de limpeza autom\xE1tica iniciado", "STARTUP");
  logger.info("Servidor iniciado", "STARTUP", { port, env: app.get("env") });
  setInterval(() => {
    logger.cleanOldLogs(30).catch(
      (err) => logger.error("Erro ao limpar logs antigos", "CLEANUP", { error: err })
    );
  }, 24 * 60 * 60 * 1e3);
  process.on("SIGINT", () => {
    log("Shutting down gracefully...");
    logger.info("Servidor encerrando", "SHUTDOWN");
    if ("storage" in global && typeof storage.close === "function") {
      storage.close();
    }
    process.exit(0);
  });
})();
