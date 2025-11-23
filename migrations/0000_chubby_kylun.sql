CREATE TABLE "bloqueios_estoque" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "bloqueios_estoque_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"produto_id" integer NOT NULL,
	"orcamento_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"quantidade_bloqueada" integer NOT NULL,
	"data_bloqueio" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "caixas" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "caixas_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"funcionario_id" text,
	"data_abertura" text NOT NULL,
	"data_fechamento" text,
	"saldo_inicial" real DEFAULT 0 NOT NULL,
	"saldo_final" real,
	"total_vendas" real DEFAULT 0 NOT NULL,
	"total_retiradas" real DEFAULT 0 NOT NULL,
	"total_suprimentos" real DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'aberto' NOT NULL,
	"observacoes_abertura" text,
	"observacoes_fechamento" text
);
--> statement-breakpoint
CREATE TABLE "client_communications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"admin_id" text NOT NULL,
	"type" text NOT NULL,
	"subject" text,
	"content" text NOT NULL,
	"metadata" jsonb,
	"sent_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "client_documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"admin_id" text NOT NULL,
	"file_name" text NOT NULL,
	"file_url" text NOT NULL,
	"file_type" text NOT NULL,
	"file_size" integer,
	"description" text,
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "client_interactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"admin_id" text,
	"interaction_type" text NOT NULL,
	"description" text NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "client_notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"admin_id" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "clientes" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "clientes_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"nome" text NOT NULL,
	"cpf_cnpj" text,
	"telefone" text,
	"email" text,
	"endereco" text,
	"observacoes" text,
	"percentual_desconto" real,
	"data_cadastro" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "compras" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "compras_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"fornecedor_id" integer NOT NULL,
	"produto_id" integer NOT NULL,
	"quantidade" integer NOT NULL,
	"valor_unitario" real NOT NULL,
	"valor_total" real NOT NULL,
	"data" text NOT NULL,
	"observacoes" text
);
--> statement-breakpoint
CREATE TABLE "config_fiscal" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "config_fiscal_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"cnpj" text NOT NULL,
	"razao_social" text NOT NULL,
	"focus_nfe_api_key" text NOT NULL,
	"ambiente" text DEFAULT 'homologacao' NOT NULL,
	"updated_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "config_mercadopago" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "config_mercadopago_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"access_token" text NOT NULL,
	"public_key" text,
	"webhook_url" text,
	"ultima_sincronizacao" text,
	"status_conexao" text DEFAULT 'desconectado',
	"updated_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contas_pagar" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "contas_pagar_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"descricao" text NOT NULL,
	"valor" real NOT NULL,
	"data_vencimento" text NOT NULL,
	"data_pagamento" text,
	"categoria" text,
	"status" text DEFAULT 'pendente',
	"data_cadastro" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contas_receber" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "contas_receber_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"descricao" text NOT NULL,
	"valor" real NOT NULL,
	"data_vencimento" text NOT NULL,
	"data_recebimento" text,
	"categoria" text,
	"status" text DEFAULT 'pendente',
	"data_cadastro" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cupons" (
	"id" serial PRIMARY KEY NOT NULL,
	"codigo" text NOT NULL,
	"tipo" text NOT NULL,
	"valor" real NOT NULL,
	"planos_aplicaveis" jsonb,
	"data_inicio" text NOT NULL,
	"data_expiracao" text NOT NULL,
	"quantidade_maxima" integer,
	"quantidade_utilizada" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'ativo' NOT NULL,
	"descricao" text,
	"criado_por" text NOT NULL,
	"data_criacao" text NOT NULL,
	"data_atualizacao" text,
	CONSTRAINT "cupons_codigo_unique" UNIQUE("codigo")
);
--> statement-breakpoint
CREATE TABLE "devolucoes" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "devolucoes_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"venda_id" integer,
	"produto_id" integer NOT NULL,
	"produto_nome" text NOT NULL,
	"quantidade" integer NOT NULL,
	"valor_total" real NOT NULL,
	"motivo" text NOT NULL,
	"status" text DEFAULT 'pendente' NOT NULL,
	"data_devolucao" text NOT NULL,
	"observacoes" text,
	"cliente_nome" text,
	"operador_nome" text,
	"operador_id" text
);
--> statement-breakpoint
CREATE TABLE "employee_packages" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"package_type" text NOT NULL,
	"quantity" integer NOT NULL,
	"price" real NOT NULL,
	"status" text DEFAULT 'ativo' NOT NULL,
	"payment_id" text,
	"data_compra" text NOT NULL,
	"data_vencimento" text NOT NULL,
	"data_cancelamento" text
);
--> statement-breakpoint
CREATE TABLE "fornecedores" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "fornecedores_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"nome" text NOT NULL,
	"cnpj" text,
	"telefone" text,
	"email" text,
	"endereco" text,
	"observacoes" text,
	"data_cadastro" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "funcionarios" (
	"id" text PRIMARY KEY NOT NULL,
	"conta_id" text NOT NULL,
	"nome" text NOT NULL,
	"email" text NOT NULL,
	"senha" text NOT NULL,
	"cargo" text,
	"status" text DEFAULT 'ativo' NOT NULL,
	"data_criacao" text
);
--> statement-breakpoint
CREATE TABLE "logs_admin" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "logs_admin_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"usuario_id" text NOT NULL,
	"conta_id" text NOT NULL,
	"acao" text NOT NULL,
	"detalhes" text,
	"data" text NOT NULL,
	"ip_address" text,
	"user_agent" text
);
--> statement-breakpoint
CREATE TABLE "movimentacoes_caixa" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "movimentacoes_caixa_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"caixa_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"tipo" text NOT NULL,
	"valor" real NOT NULL,
	"descricao" text,
	"data" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orcamentos" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"numero" text NOT NULL,
	"cliente_id" integer,
	"cliente_nome" text NOT NULL,
	"cliente_email" text,
	"cliente_telefone" text,
	"cliente_cpf_cnpj" text,
	"cliente_endereco" text,
	"itens" jsonb NOT NULL,
	"subtotal" real NOT NULL,
	"desconto" real DEFAULT 0 NOT NULL,
	"valor_total" real NOT NULL,
	"observacoes" text,
	"condicoes_pagamento" text,
	"prazo_entrega" text,
	"validade" text NOT NULL,
	"status" text NOT NULL,
	"data_criacao" text NOT NULL,
	"data_atualizacao" text,
	"vendedor" text,
	"venda_id" integer
);
--> statement-breakpoint
CREATE TABLE "permissoes_funcionarios" (
	"id" serial PRIMARY KEY NOT NULL,
	"funcionario_id" text NOT NULL,
	"dashboard" text DEFAULT 'false' NOT NULL,
	"pdv" text DEFAULT 'false' NOT NULL,
	"caixa" text DEFAULT 'false' NOT NULL,
	"produtos" text DEFAULT 'false' NOT NULL,
	"inventario" text DEFAULT 'false' NOT NULL,
	"relatorios" text DEFAULT 'false' NOT NULL,
	"clientes" text DEFAULT 'false' NOT NULL,
	"fornecedores" text DEFAULT 'false' NOT NULL,
	"financeiro" text DEFAULT 'false' NOT NULL,
	"config_fiscal" text DEFAULT 'false' NOT NULL,
	"historico_caixas" text DEFAULT 'false' NOT NULL,
	"configuracoes" text DEFAULT 'false' NOT NULL,
	"devolucoes" text DEFAULT 'false' NOT NULL,
	"contas_pagar" text DEFAULT 'false' NOT NULL,
	"contas_receber" text DEFAULT 'false' NOT NULL,
	"orcamentos" text DEFAULT 'false' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plan_changes_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"from_plan" text,
	"to_plan" text NOT NULL,
	"changed_by" text NOT NULL,
	"reason" text,
	"metadata" jsonb,
	"changed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "planos" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "planos_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"nome" text NOT NULL,
	"preco" real NOT NULL,
	"duracao_dias" integer NOT NULL,
	"descricao" text,
	"ativo" text DEFAULT 'true' NOT NULL,
	"data_criacao" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "produtos" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "produtos_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"nome" text NOT NULL,
	"categoria" text NOT NULL,
	"preco" real NOT NULL,
	"quantidade" integer NOT NULL,
	"estoque_minimo" integer NOT NULL,
	"codigo_barras" text,
	"vencimento" text
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "subscriptions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"plano" text NOT NULL,
	"status" text DEFAULT 'pendente' NOT NULL,
	"valor" real DEFAULT 0 NOT NULL,
	"data_inicio" text,
	"data_vencimento" text,
	"mercadopago_payment_id" text,
	"mercadopago_preference_id" text,
	"forma_pagamento" text,
	"status_pagamento" text,
	"init_point" text,
	"external_reference" text,
	"prazo_limite_pagamento" text,
	"tentativas_cobranca" integer DEFAULT 0,
	"motivo_cancelamento" text,
	"data_criacao" text NOT NULL,
	"data_atualizacao" text
);
--> statement-breakpoint
CREATE TABLE "system_config" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "system_config_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"chave" text NOT NULL,
	"valor" text NOT NULL,
	"updated_at" text NOT NULL,
	CONSTRAINT "system_config_chave_unique" UNIQUE("chave")
);
--> statement-breakpoint
CREATE TABLE "system_owner" (
	"id" serial PRIMARY KEY NOT NULL,
	"owner_user_id" text NOT NULL,
	"data_configuracao" text NOT NULL,
	"observacoes" text,
	CONSTRAINT "system_owner_owner_user_id_unique" UNIQUE("owner_user_id")
);
--> statement-breakpoint
CREATE TABLE "user_customization" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"logo_url" text,
	"pdv_background_url" text,
	"primary_color" text DEFAULT '#3B82F6',
	"secondary_color" text DEFAULT '#10B981',
	"accent_color" text DEFAULT '#F59E0B',
	"background_color" text DEFAULT '#000000',
	"store_name" text DEFAULT 'Pavisoft Sistemas',
	"font_size" text DEFAULT 'medium',
	"border_radius" text DEFAULT 'medium',
	"language" text DEFAULT 'pt-BR',
	"currency" text DEFAULT 'BRL',
	"date_format" text DEFAULT 'DD/MM/YYYY',
	"enable_animations" text DEFAULT 'true',
	"enable_sounds" text DEFAULT 'false',
	"compact_mode" text DEFAULT 'false',
	"show_welcome_message" text DEFAULT 'true',
	"auto_save_interval" integer DEFAULT 30,
	"low_stock_threshold" integer DEFAULT 10,
	"items_per_page" integer DEFAULT 10,
	"enable_notifications" text DEFAULT 'true',
	"enable_email_alerts" text DEFAULT 'false',
	"email_for_alerts" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_customization_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"senha" text NOT NULL,
	"nome" text NOT NULL,
	"plano" text DEFAULT 'free',
	"is_admin" text DEFAULT 'false',
	"data_criacao" text,
	"data_expiracao_trial" text,
	"data_expiracao_plano" text,
	"status" text DEFAULT 'ativo',
	"cpf_cnpj" text,
	"telefone" text,
	"endereco" text,
	"asaas_customer_id" text,
	"permissoes" text,
	"ultimo_acesso" text,
	"max_funcionarios" integer DEFAULT 1,
	"max_funcionarios_base" integer DEFAULT 1,
	"data_expiracao_pacote_funcionarios" text,
	"meta_mensal" real DEFAULT 15000,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "uso_cupons" (
	"id" serial PRIMARY KEY NOT NULL,
	"cupom_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"subscription_id" integer,
	"valor_desconto" real NOT NULL,
	"data_uso" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vendas" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "vendas_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"produto" text NOT NULL,
	"quantidade_vendida" integer DEFAULT 0 NOT NULL,
	"valor_total" real DEFAULT 0 NOT NULL,
	"data" text NOT NULL,
	"itens" text,
	"cliente_id" integer,
	"forma_pagamento" text,
	"orcamento_id" integer,
	"vendedor" text
);
--> statement-breakpoint
ALTER TABLE "bloqueios_estoque" ADD CONSTRAINT "bloqueios_estoque_produto_id_produtos_id_fk" FOREIGN KEY ("produto_id") REFERENCES "public"."produtos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bloqueios_estoque" ADD CONSTRAINT "bloqueios_estoque_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_communications" ADD CONSTRAINT "client_communications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_communications" ADD CONSTRAINT "client_communications_admin_id_users_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_documents" ADD CONSTRAINT "client_documents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_documents" ADD CONSTRAINT "client_documents_admin_id_users_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_interactions" ADD CONSTRAINT "client_interactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_interactions" ADD CONSTRAINT "client_interactions_admin_id_users_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_notes" ADD CONSTRAINT "client_notes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_notes" ADD CONSTRAINT "client_notes_admin_id_users_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compras" ADD CONSTRAINT "compras_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compras" ADD CONSTRAINT "compras_fornecedor_id_fornecedores_id_fk" FOREIGN KEY ("fornecedor_id") REFERENCES "public"."fornecedores"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compras" ADD CONSTRAINT "compras_produto_id_produtos_id_fk" FOREIGN KEY ("produto_id") REFERENCES "public"."produtos"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cupons" ADD CONSTRAINT "cupons_criado_por_users_id_fk" FOREIGN KEY ("criado_por") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employee_packages" ADD CONSTRAINT "employee_packages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fornecedores" ADD CONSTRAINT "fornecedores_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_changes_history" ADD CONSTRAINT "plan_changes_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_changes_history" ADD CONSTRAINT "plan_changes_history_changed_by_users_id_fk" FOREIGN KEY ("changed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "produtos" ADD CONSTRAINT "produtos_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "system_owner" ADD CONSTRAINT "system_owner_owner_user_id_users_id_fk" FOREIGN KEY ("owner_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_customization" ADD CONSTRAINT "user_customization_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uso_cupons" ADD CONSTRAINT "uso_cupons_cupom_id_cupons_id_fk" FOREIGN KEY ("cupom_id") REFERENCES "public"."cupons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uso_cupons" ADD CONSTRAINT "uso_cupons_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uso_cupons" ADD CONSTRAINT "uso_cupons_subscription_id_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscriptions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendas" ADD CONSTRAINT "vendas_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendas" ADD CONSTRAINT "vendas_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "client_communications_user_id_sent_at_idx" ON "client_communications" USING btree ("user_id","sent_at");--> statement-breakpoint
CREATE INDEX "client_documents_user_id_uploaded_at_idx" ON "client_documents" USING btree ("user_id","uploaded_at");--> statement-breakpoint
CREATE INDEX "client_interactions_user_id_created_at_idx" ON "client_interactions" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "client_notes_user_id_created_at_idx" ON "client_notes" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "cupons_codigo_idx" ON "cupons" USING btree ("codigo");--> statement-breakpoint
CREATE INDEX "cupons_status_idx" ON "cupons" USING btree ("status");--> statement-breakpoint
CREATE INDEX "employee_packages_user_id_idx" ON "employee_packages" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "employee_packages_status_idx" ON "employee_packages" USING btree ("status");--> statement-breakpoint
CREATE INDEX "plan_changes_history_user_id_changed_at_idx" ON "plan_changes_history" USING btree ("user_id","changed_at");--> statement-breakpoint
CREATE INDEX "user_customization_user_id_idx" ON "user_customization" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "uso_cupons_cupom_id_idx" ON "uso_cupons" USING btree ("cupom_id");--> statement-breakpoint
CREATE INDEX "uso_cupons_user_id_idx" ON "uso_cupons" USING btree ("user_id");