import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, serial, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { timestamp, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable("users", {
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
  meta_mensal: real("meta_mensal").default(15000),
});

export const systemOwner = pgTable("system_owner", {
  id: serial("id").primaryKey(),
  owner_user_id: text("owner_user_id").notNull().unique().references(() => users.id),
  data_configuracao: text("data_configuracao").notNull(),
  observacoes: text("observacoes"),
});

export const produtos = pgTable("produtos", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  user_id: text("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  nome: text("nome").notNull(),
  categoria: text("categoria").notNull(),
  preco: real("preco").notNull(),
  quantidade: integer("quantidade").notNull(),
  estoque_minimo: integer("estoque_minimo").notNull(),
  codigo_barras: text("codigo_barras"),
  vencimento: text("vencimento"),
  localizacao: text("localizacao"),
});

// Declarar clientes e fornecedores ANTES de vendas e compras para evitar TDZ
export const clientes = pgTable("clientes", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  user_id: text("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  nome: text("nome").notNull(),
  cpf_cnpj: text("cpf_cnpj"),
  telefone: text("telefone"),
  email: text("email"),
  endereco: text("endereco"),
  observacoes: text("observacoes"),
  percentual_desconto: real("percentual_desconto"),
  data_cadastro: text("data_cadastro").notNull(),
});

export const fornecedores = pgTable("fornecedores", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  user_id: text("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  nome: text("nome").notNull(),
  cnpj: text("cnpj"),
  telefone: text("telefone"),
  email: text("email"),
  endereco: text("endereco"),
  observacoes: text("observacoes"),
  data_cadastro: text("data_cadastro").notNull(),
});

export const bloqueiosEstoque = pgTable("bloqueios_estoque", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  produto_id: integer("produto_id").notNull().references(() => produtos.id, { onDelete: 'cascade' }),
  orcamento_id: integer("orcamento_id").notNull(),
  user_id: text("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  quantidade_bloqueada: integer("quantidade_bloqueada").notNull(),
  data_bloqueio: text("data_bloqueio").notNull(),
});

export const vendas = pgTable("vendas", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  user_id: text("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  produto: text("produto").notNull(),
  quantidade_vendida: integer("quantidade_vendida").notNull().default(0),
  valor_total: real("valor_total").notNull().default(0),
  data: text("data").notNull(),
  itens: text("itens"),
  cliente_id: integer("cliente_id").references(() => clientes.id, { onDelete: 'set null' }),
  forma_pagamento: text("forma_pagamento"),
  orcamento_id: integer("orcamento_id"),
  vendedor: text("vendedor"),
  cupom_texto: text("cupom_texto"),
});

export const compras = pgTable("compras", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  user_id: text("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  fornecedor_id: integer("fornecedor_id").notNull().references(() => fornecedores.id, { onDelete: 'restrict' }),
  produto_id: integer("produto_id").notNull().references(() => produtos.id, { onDelete: 'restrict' }),
  quantidade: integer("quantidade").notNull(),
  valor_unitario: real("valor_unitario").notNull(),
  valor_total: real("valor_total").notNull(),
  data: text("data").notNull(),
  observacoes: text("observacoes"),
});

export const configFiscal = pgTable("config_fiscal", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  user_id: text("user_id").notNull(),
  cnpj: text("cnpj").notNull(),
  razao_social: text("razao_social").notNull(),
  focus_nfe_api_key: text("focus_nfe_api_key").notNull(),
  ambiente: text("ambiente").notNull().default("homologacao"),
  updated_at: text("updated_at").notNull(),
});

export const contasPagar = pgTable("contas_pagar", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  user_id: text("user_id").notNull(),
  descricao: text("descricao").notNull(),
  valor: real("valor").notNull(),
  data_vencimento: text("data_vencimento").notNull(),
  data_pagamento: text("data_pagamento"),
  categoria: text("categoria"),
  status: text("status").default("pendente"), // pendente, pago
  data_cadastro: text("data_cadastro").notNull(),
});

export const contasReceber = pgTable("contas_receber", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  user_id: text("user_id").notNull(),
  descricao: text("descricao").notNull(),
  valor: real("valor").notNull(),
  data_vencimento: text("data_vencimento").notNull(),
  data_recebimento: text("data_recebimento"),
  categoria: text("categoria"),
  status: text("status").default("pendente"), // pendente, recebido
  data_cadastro: text("data_cadastro").notNull(),
});

export const systemConfig = pgTable("system_config", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  chave: text("chave").notNull().unique(),
  valor: text("valor").notNull(),
  updated_at: text("updated_at").notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  data_criacao: true,
}).extend({
  email: z.string().email("Email inválido").toLowerCase(),
  senha: z.string()
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
    .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
    .regex(/[0-9]/, "Senha deve conter pelo menos um número"),
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres").max(100),
  meta_mensal: z.number().optional(),
});

export const insertSystemOwnerSchema = createInsertSchema(systemOwner).omit({
  id: true,
}).extend({
  owner_user_id: z.string().min(1, "ID do usuário é obrigatório"),
  data_configuracao: z.string().optional(),
});

export const insertProdutoSchema = createInsertSchema(produtos).omit({
  id: true,
}).extend({
  preco: z.coerce.number().positive(),
  quantidade: z.coerce.number().int().min(0),
  estoque_minimo: z.coerce.number().int().min(0),
});

export const insertVendaSchema = createInsertSchema(vendas).omit({
  id: true,
}).extend({
  quantidade_vendida: z.coerce.number().int().positive(),
  valor_total: z.coerce.number().positive(),
});

export const insertBloqueioEstoqueSchema = createInsertSchema(bloqueiosEstoque).omit({
  id: true,
  data_bloqueio: true,
}).extend({
  produto_id: z.number().int().positive(),
  orcamento_id: z.number().int().positive(),
  quantidade_bloqueada: z.number().int().positive(),
});

export const insertFornecedorSchema = createInsertSchema(fornecedores).omit({
  id: true,
});

export const insertClienteSchema = createInsertSchema(clientes).omit({
  id: true,
}).extend({
  data_cadastro: z.string().optional(),
});

export const insertCompraSchema = createInsertSchema(compras).omit({
  id: true,
}).extend({
  quantidade: z.coerce.number().int().positive(),
  valor_unitario: z.coerce.number().positive(),
  valor_total: z.coerce.number().positive(),
  fornecedor_id: z.number().int().positive(),
  produto_id: z.number().int().positive(),
});

export const insertConfigFiscalSchema = createInsertSchema(configFiscal).omit({
  id: true,
  updated_at: true,
}).extend({
  cnpj: z.string().min(14, "CNPJ inválido"),
  razao_social: z.string().min(1, "Razão social é obrigatória"),
  focus_nfe_api_key: z.string().min(1, "Chave API é obrigatória"),
  ambiente: z.enum(["homologacao", "producao"]).default("homologacao"),
});

export const planos = pgTable("planos", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  nome: text("nome").notNull(),
  preco: real("preco").notNull(),
  duracao_dias: integer("duracao_dias").notNull(),
  descricao: text("descricao"),
  ativo: text("ativo").notNull().default("true"),
  data_criacao: text("data_criacao").notNull(),
});

export const configMercadoPago = pgTable("config_mercadopago", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  access_token: text("access_token").notNull(),
  public_key: text("public_key"),
  webhook_url: text("webhook_url"),
  ultima_sincronizacao: text("ultima_sincronizacao"),
  status_conexao: text("status_conexao").default("desconectado"),
  updated_at: text("updated_at").notNull(),
});

export const logsAdmin = pgTable("logs_admin", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  usuario_id: text("usuario_id").notNull(),
  conta_id: text("conta_id").notNull(),
  acao: text("acao").notNull(),
  detalhes: text("detalhes"),
  data: text("data").notNull(),
  ip_address: text("ip_address"),
  user_agent: text("user_agent"),
});

export const subscriptions = pgTable("subscriptions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  user_id: text("user_id").notNull(),
  plano: text("plano").notNull(),
  status: text("status").notNull().default("pendente"),
  valor: real("valor").notNull().default(0),
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
  data_atualizacao: text("data_atualizacao"),
});

export const insertPlanoSchema = createInsertSchema(planos).omit({
  id: true,
  data_criacao: true,
});
export type Plano = typeof planos.$inferSelect;
export type InsertPlano = z.infer<typeof insertPlanoSchema>;

export const insertConfigMercadoPagoSchema = createInsertSchema(configMercadoPago).omit({
  id: true,
  updated_at: true,
});
export type ConfigMercadoPago = typeof configMercadoPago.$inferSelect;
export type InsertConfigMercadoPago = z.infer<typeof insertConfigMercadoPagoSchema>;

export const insertLogAdminSchema = createInsertSchema(logsAdmin).omit({
  id: true,
});
export type LogAdmin = typeof logsAdmin.$inferSelect;
export type InsertLogAdmin = z.infer<typeof insertLogAdminSchema>;

export const insertContasPagarSchema = createInsertSchema(contasPagar).omit({
  id: true,
  data_cadastro: true,
});

export const insertContasReceberSchema = createInsertSchema(contasReceber).omit({
  id: true,
  data_cadastro: true,
});

export const insertSystemConfigSchema = createInsertSchema(systemConfig).omit({
  id: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  data_criacao: true,
});
export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;

// Funcionários (multi-tenant)
export const funcionarios = pgTable("funcionarios", {
  id: text("id").primaryKey(),
  conta_id: text("conta_id").notNull(), // ID do usuário dono da conta
  nome: text("nome").notNull(),
  email: text("email").notNull(),
  senha: text("senha").notNull(),
  cargo: text("cargo"),
  status: text("status").notNull().default("ativo"),
  data_criacao: text("data_criacao"),
});

export const insertFuncionarioSchema = createInsertSchema(funcionarios);
export type Funcionario = typeof funcionarios.$inferSelect;
export type InsertFuncionario = z.infer<typeof insertFuncionarioSchema>;

// Permissões dos funcionários
export const permissoesFuncionarios = pgTable("permissoes_funcionarios", {
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
  orcamentos: text("orcamentos").notNull().default("false"),
});

export const insertPermissaoFuncionarioSchema = createInsertSchema(permissoesFuncionarios);
export type PermissaoFuncionario = typeof permissoesFuncionarios.$inferSelect;
export type InsertPermissaoFuncionario = z.infer<typeof insertPermissaoFuncionarioSchema>;

export const caixas = pgTable("caixas", {
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
  observacoes_fechamento: text("observacoes_fechamento"),
});

export const movimentacoesCaixa = pgTable("movimentacoes_caixa", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  caixa_id: integer("caixa_id").notNull(),
  user_id: text("user_id").notNull(),
  tipo: text("tipo").notNull(),
  valor: real("valor").notNull(),
  descricao: text("descricao"),
  data: text("data").notNull(),
});

export const devolucoes = pgTable("devolucoes", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  user_id: text("user_id").notNull(),
  venda_id: integer("venda_id"),
  produto_id: integer("produto_id").notNull(),
  produto_nome: text("produto_nome").notNull(),
  quantidade: integer("quantidade").notNull(),
  valor_total: real("valor_total").notNull(),
  motivo: text("motivo").notNull(),
  status: text("status").notNull().default("pendente"),
  data_devolucao: text("data_devolucao").notNull(),
  observacoes: text("observacoes"),
  cliente_nome: text("cliente_nome"),
  operador_nome: text("operador_nome"),
  operador_id: text("operador_id"),
});

export const insertCaixaSchema = createInsertSchema(caixas).omit({
  id: true,
}).extend({
  saldo_inicial: z.coerce.number().min(0),
  status: z.enum(["aberto", "fechado", "arquivado"]).default("aberto").optional(),
});

export const insertMovimentacaoCaixaSchema = createInsertSchema(movimentacoesCaixa).omit({
  id: true,
}).extend({
  valor: z.coerce.number().positive(),
  tipo: z.enum(["suprimento", "retirada"]),
});

export type InsertCaixa = z.infer<typeof insertCaixaSchema>;
export type Caixa = typeof caixas.$inferSelect;

export type InsertMovimentacaoCaixa = z.infer<typeof insertMovimentacaoCaixaSchema>;
export type MovimentacaoCaixa = typeof movimentacoesCaixa.$inferSelect;

export const insertDevolucaoSchema = createInsertSchema(devolucoes).omit({
  id: true,
}).extend({
  quantidade: z.coerce.number().int().positive(),
  valor_total: z.coerce.number().positive(),
  status: z.enum(["pendente", "aprovada", "rejeitada", "arquivada"]).default("pendente"),
});

export type InsertDevolucao = typeof devolucoes.$inferInsert;
export type Devolucao = typeof devolucoes.$inferSelect;

// Tabela de Orçamentos
export const orcamentos = pgTable("orcamentos", {
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
  venda_id: integer("venda_id"),
});

export const insertOrcamentoSchema = createInsertSchema(orcamentos).omit({
  id: true,
  numero: true,
  data_criacao: true,
  data_atualizacao: true,
}).extend({
  user_id: z.string().optional(),
  cliente_nome: z.string().min(1, "Nome do cliente é obrigatório"),
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
    quantidade: z.number(),
  })).min(1, "Adicione pelo menos um item"),
});

export type InsertOrcamento = z.infer<typeof insertOrcamentoSchema>;
export type Orcamento = typeof orcamentos.$inferSelect;

// ============================================
// GESTÃO DE CLIENTE 360° - NOVAS TABELAS
// ============================================

// Notas sobre clientes
export const clientNotes = pgTable("client_notes", {
  id: serial("id").primaryKey(),
  user_id: text("user_id").notNull().references(() => users.id),
  admin_id: text("admin_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }),
}, (table) => ({
  userIdCreatedAtIdx: index("client_notes_user_id_created_at_idx").on(table.user_id, table.created_at),
}));

// Documentos/Anexos do cliente
export const clientDocuments = pgTable("client_documents", {
  id: serial("id").primaryKey(),
  user_id: text("user_id").notNull().references(() => users.id),
  admin_id: text("admin_id").notNull().references(() => users.id),
  file_name: text("file_name").notNull(),
  file_url: text("file_url").notNull(),
  file_type: text("file_type").notNull(),
  file_size: integer("file_size"),
  description: text("description"),
  uploaded_at: timestamp("uploaded_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  userIdUploadedAtIdx: index("client_documents_user_id_uploaded_at_idx").on(table.user_id, table.uploaded_at),
}));

// Timeline de Interações com cliente
export const clientInteractions = pgTable("client_interactions", {
  id: serial("id").primaryKey(),
  user_id: text("user_id").notNull().references(() => users.id),
  admin_id: text("admin_id").references(() => users.id),
  interaction_type: text("interaction_type").notNull(),
  description: text("description").notNull(),
  metadata: jsonb("metadata"),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  userIdCreatedAtIdx: index("client_interactions_user_id_created_at_idx").on(table.user_id, table.created_at),
}));

// Histórico de Mudanças de Plano
export const planChangesHistory = pgTable("plan_changes_history", {
  id: serial("id").primaryKey(),
  user_id: text("user_id").notNull().references(() => users.id),
  from_plan: text("from_plan"),
  to_plan: text("to_plan").notNull(),
  changed_by: text("changed_by").notNull().references(() => users.id),
  reason: text("reason"),
  metadata: jsonb("metadata"),
  changed_at: timestamp("changed_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  userIdChangedAtIdx: index("plan_changes_history_user_id_changed_at_idx").on(table.user_id, table.changed_at),
}));

// Pacotes de Funcionários Comprados
export const employeePackages = pgTable("employee_packages", {
  id: serial("id").primaryKey(),
  user_id: text("user_id").notNull().references(() => users.id),
  package_type: text("package_type").notNull(), // pacote_5, pacote_10, pacote_20, pacote_50
  quantity: integer("quantity").notNull(), // Quantidade de funcionários adicionados
  price: real("price").notNull(), // Valor pago
  status: text("status").notNull().default("ativo"), // ativo, expirado, cancelado
  payment_id: text("payment_id"), // ID do pagamento (Mercado Pago)
  data_compra: text("data_compra").notNull(),
  data_vencimento: text("data_vencimento").notNull(), // 30 dias após compra
  data_cancelamento: text("data_cancelamento"),
}, (table) => ({
  userIdIdx: index("employee_packages_user_id_idx").on(table.user_id),
  statusIdx: index("employee_packages_status_idx").on(table.status),
}));

// Tabela de Cupons/Promoções
export const cupons = pgTable("cupons", {
  id: serial("id").primaryKey(),
  codigo: text("codigo").notNull().unique(),
  tipo: text("tipo").notNull(), // percentual, valor_fixo
  valor: real("valor").notNull(), // valor do desconto (ex: 10 para 10% ou R$ 10)
  planos_aplicaveis: jsonb("planos_aplicaveis"), // ['premium_mensal', 'premium_anual'] ou null para todos
  data_inicio: text("data_inicio").notNull(),
  data_expiracao: text("data_expiracao").notNull(),
  quantidade_maxima: integer("quantidade_maxima"), // null = ilimitado
  quantidade_utilizada: integer("quantidade_utilizada").notNull().default(0),
  status: text("status").notNull().default("ativo"), // ativo, inativo, expirado
  descricao: text("descricao"),
  criado_por: text("criado_por").notNull().references(() => users.id),
  data_criacao: text("data_criacao").notNull(),
  data_atualizacao: text("data_atualizacao"),
}, (table) => ({
  codigoIdx: index("cupons_codigo_idx").on(table.codigo),
  statusIdx: index("cupons_status_idx").on(table.status),
}));

// Tabela de Uso de Cupons
export const usoCupons = pgTable("uso_cupons", {
  id: serial("id").primaryKey(),
  cupom_id: integer("cupom_id").notNull().references(() => cupons.id),
  user_id: text("user_id").notNull().references(() => users.id),
  subscription_id: integer("subscription_id").references(() => subscriptions.id),
  valor_desconto: real("valor_desconto").notNull(),
  data_uso: text("data_uso").notNull(),
}, (table) => ({
  cupomIdIdx: index("uso_cupons_cupom_id_idx").on(table.cupom_id),
  userIdIdx: index("uso_cupons_user_id_idx").on(table.user_id),
}));

export const insertEmployeePackageSchema = createInsertSchema(employeePackages).omit({
  id: true,
  data_compra: true,
});

export type EmployeePackage = typeof employeePackages.$inferSelect;
export type InsertEmployeePackage = z.infer<typeof insertEmployeePackageSchema>;

export const insertCupomSchema = createInsertSchema(cupons).omit({
  id: true,
  data_criacao: true,
  data_atualizacao: true,
  quantidade_utilizada: true,
}).extend({
  codigo: z.string().min(3, "Código deve ter pelo menos 3 caracteres").max(50),
  tipo: z.enum(["percentual", "valor_fixo"]),
  valor: z.number().positive("Valor deve ser positivo"),
  status: z.enum(["ativo", "inativo", "expirado"]).default("ativo"),
});

export const insertUsoCupomSchema = createInsertSchema(usoCupons).omit({
  id: true,
  data_uso: true,
});

export type Cupom = typeof cupons.$inferSelect;
export type InsertCupom = z.infer<typeof insertCupomSchema>;
export type UsoCupom = typeof usoCupons.$inferSelect;
export type InsertUsoCupom = z.infer<typeof insertUsoCupomSchema>;

// Tabela de Customização do Usuário (multi-tenant)
export const userCustomization = pgTable("user_customization", {
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
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index("user_customization_user_id_idx").on(table.user_id),
}));

export const insertUserCustomizationSchema = createInsertSchema(userCustomization).omit({
  id: true,
  created_at: true,
  updated_at: true,
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
  email_for_alerts: z.string().optional().nullable(),
});

export type UserCustomization = typeof userCustomization.$inferSelect;
export type InsertUserCustomization = z.infer<typeof insertUserCustomizationSchema>;

// Comunicações enviadas ao cliente
export const clientCommunications = pgTable("client_communications", {
  id: serial("id").primaryKey(),
  user_id: text("user_id").notNull().references(() => users.id),
  admin_id: text("admin_id").notNull().references(() => users.id),
  type: text("type").notNull(),
  subject: text("subject"),
  content: text("content").notNull(),
  metadata: jsonb("metadata"),
  sent_at: timestamp("sent_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  userIdSentAtIdx: index("client_communications_user_id_sent_at_idx").on(table.user_id, table.sent_at),
}));

// Schemas de inserção para as novas tabelas
export const insertClientNoteSchema = createInsertSchema(clientNotes).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertClientDocumentSchema = createInsertSchema(clientDocuments).omit({
  id: true,
  uploaded_at: true,
});

export const insertClientInteractionSchema = createInsertSchema(clientInteractions).omit({
  id: true,
  created_at: true,
});

export const insertPlanChangeHistorySchema = createInsertSchema(planChangesHistory).omit({
  id: true,
  changed_at: true,
});

export const insertClientCommunicationSchema = createInsertSchema(clientCommunications).omit({
  id: true,
  sent_at: true,
});

// Types exportados para as novas tabelas
export type InsertClientNote = z.infer<typeof insertClientNoteSchema>;
export type ClientNote = typeof clientNotes.$inferSelect;

export type InsertClientDocument = z.infer<typeof insertClientDocumentSchema>;
export type ClientDocument = typeof clientDocuments.$inferSelect;

export type InsertClientInteraction = z.infer<typeof insertClientInteractionSchema>;
export type ClientInteraction = typeof clientInteractions.$inferSelect;

export type InsertPlanChangeHistory = z.infer<typeof insertPlanChangeHistorySchema>;
export type PlanChangeHistory = typeof planChangesHistory.$inferSelect;

export type InsertClientCommunication = z.infer<typeof insertClientCommunicationSchema>;
export type ClientCommunication = typeof clientCommunications.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertSystemOwner = z.infer<typeof insertSystemOwnerSchema>;
export type SystemOwner = typeof systemOwner.$inferSelect;
export type InsertProduto = z.infer<typeof insertProdutoSchema>;
export type Produto = typeof produtos.$inferSelect;
export type InsertBloqueioEstoque = z.infer<typeof insertBloqueioEstoqueSchema>;
export type BloqueioEstoque = typeof bloqueiosEstoque.$inferSelect;
export type InsertVenda = z.infer<typeof insertVendaSchema>;
export type Venda = typeof vendas.$inferSelect;
export type InsertFornecedor = z.infer<typeof insertFornecedorSchema>;
export type Fornecedor = typeof fornecedores.$inferSelect;
export type InsertCliente = z.infer<typeof insertClienteSchema>;
export type Cliente = typeof clientes.$inferSelect;
export type InsertCompra = z.infer<typeof insertCompraSchema>;
export type Compra = typeof compras.$inferSelect;
export type InsertConfigFiscal = z.infer<typeof insertConfigFiscalSchema>;
export type ConfigFiscal = typeof configFiscal.$inferSelect;
export type InsertContasPagar = z.infer<typeof insertContasPagarSchema>;
export type ContasPagar = typeof contasPagar.$inferSelect;
export type InsertContasReceber = z.infer<typeof insertContasReceberSchema>;
export type ContasReceber = typeof contasReceber.$inferSelect;
export type InsertSystemConfig = z.infer<typeof insertSystemConfigSchema>;
export type SystemConfig = typeof systemConfig.$inferSelect;

// Tabela de Sessões Ativas (para controle de sessões simultâneas e fingerprinting)
export const userSessions = pgTable("user_sessions", {
  id: serial("id").primaryKey(),
  user_id: text("user_id").notNull(),
  user_type: text("user_type").notNull().default("usuario"), // usuario, funcionario
  session_token: text("session_token").notNull().unique(),
  device_fingerprint: text("device_fingerprint").notNull(),
  device_info: jsonb("device_info"), // browser, os, screen, etc
  ip_address: text("ip_address"),
  user_agent: text("user_agent"),
  is_active: text("is_active").notNull().default("true"),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  last_activity: timestamp("last_activity", { withTimezone: true }).notNull().defaultNow(),
  expires_at: timestamp("expires_at", { withTimezone: true }).notNull(),
}, (table) => ({
  userIdIdx: index("user_sessions_user_id_idx").on(table.user_id),
  sessionTokenIdx: index("user_sessions_session_token_idx").on(table.session_token),
  fingerprintIdx: index("user_sessions_fingerprint_idx").on(table.device_fingerprint),
  isActiveIdx: index("user_sessions_is_active_idx").on(table.is_active),
}));

export const insertUserSessionSchema = createInsertSchema(userSessions).omit({
  id: true,
  created_at: true,
  last_activity: true,
});

export type UserSession = typeof userSessions.$inferSelect;
export type InsertUserSession = z.infer<typeof insertUserSessionSchema>;

// Tabela de Templates de Email
export const emailTemplates = pgTable("email_templates", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  assunto: text("assunto").notNull(),
  conteudo: text("conteudo").notNull(),
  tipo: text("tipo").notNull().default("manual"), // manual, boas_vindas, expiracao, renovacao, promocao
  variaveis: text("variaveis"), // JSON com variáveis disponíveis
  ativo: text("ativo").notNull().default("true"),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertEmailTemplateSchema = createInsertSchema(emailTemplates).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export type EmailTemplate = typeof emailTemplates.$inferSelect;
export type InsertEmailTemplate = z.infer<typeof insertEmailTemplateSchema>;

// Tabela de Histórico de Emails Enviados
export const emailHistory = pgTable("email_history", {
  id: serial("id").primaryKey(),
  user_id: text("user_id").references(() => users.id, { onDelete: 'set null' }),
  template_id: integer("template_id").references(() => emailTemplates.id, { onDelete: 'set null' }),
  email_destino: text("email_destino").notNull(),
  assunto: text("assunto").notNull(),
  conteudo: text("conteudo").notNull(),
  tipo: text("tipo").notNull().default("manual"), // manual, automatico, massa
  segmento: text("segmento"), // trial, premium, todos, etc
  status: text("status").notNull().default("enviado"), // enviado, falha, pendente
  erro: text("erro"),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index("email_history_user_id_idx").on(table.user_id),
  tipoIdx: index("email_history_tipo_idx").on(table.tipo),
  statusIdx: index("email_history_status_idx").on(table.status),
}));

export const insertEmailHistorySchema = createInsertSchema(emailHistory).omit({
  id: true,
  created_at: true,
});

export type EmailHistory = typeof emailHistory.$inferSelect;
export type InsertEmailHistory = z.infer<typeof insertEmailHistorySchema>;

// Tabela de Configurações de Automação de Email
export const emailAutomation = pgTable("email_automation", {
  id: serial("id").primaryKey(),
  tipo: text("tipo").notNull().unique(), // boas_vindas, expiracao_3_dias, expiracao_1_dia, renovacao, etc
  template_id: integer("template_id").references(() => emailTemplates.id, { onDelete: 'set null' }),
  ativo: text("ativo").notNull().default("true"),
  dias_antes: integer("dias_antes"), // Para lembretes de expiração
  descricao: text("descricao"),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertEmailAutomationSchema = createInsertSchema(emailAutomation).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export type EmailAutomation = typeof emailAutomation.$inferSelect;
export type InsertEmailAutomation = z.infer<typeof insertEmailAutomationSchema>;

export function hasPermission(user: User, permission: string): boolean {
  // Admin sempre tem todas as permissões
  if (user.is_admin === 'true') return true; // Corrigido para comparar com string 'true'

  // Usuários em trial ou premium têm acesso completo
  if (isPremium(user)) return true;

  // Verifica se o usuário tem a permissão específica
  const userPermissions = user.permissoes || [];
  return userPermissions.includes(permission);
}

export function isPremium(user: User): boolean {
  if (user.plano === 'premium') return true;

  // Verifica se está em trial ativo (7 dias grátis com acesso completo)
  if (user.data_expiracao_trial) {
    const now = new Date();
    const expirationDate = new Date(user.data_expiracao_trial);
    return now < expirationDate;
  }

  return false;
}