
-- Migration: Sistema de Cupons e Promoções
-- Data: 2025-11-17

-- Tabela de Cupons/Promoções
CREATE TABLE IF NOT EXISTS cupons (
  id SERIAL PRIMARY KEY,
  codigo TEXT NOT NULL UNIQUE,
  tipo TEXT NOT NULL CHECK (tipo IN ('percentual', 'valor_fixo')),
  valor REAL NOT NULL CHECK (valor > 0),
  planos_aplicaveis JSONB,
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

-- Tabela de Uso de Cupons
CREATE TABLE IF NOT EXISTS uso_cupons (
  id SERIAL PRIMARY KEY,
  cupom_id INTEGER NOT NULL REFERENCES cupons(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subscription_id INTEGER REFERENCES subscriptions(id) ON DELETE SET NULL,
  valor_desconto REAL NOT NULL,
  data_uso TEXT NOT NULL
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS cupons_codigo_idx ON cupons(codigo);
CREATE INDEX IF NOT EXISTS cupons_status_idx ON cupons(status);
CREATE INDEX IF NOT EXISTS uso_cupons_cupom_id_idx ON uso_cupons(cupom_id);
CREATE INDEX IF NOT EXISTS uso_cupons_user_id_idx ON uso_cupons(user_id);

-- Comentários
COMMENT ON TABLE cupons IS 'Armazena cupons de desconto e promoções do sistema';
COMMENT ON TABLE uso_cupons IS 'Registra o histórico de uso de cupons pelos usuários';
COMMENT ON COLUMN cupons.tipo IS 'Tipo do desconto: percentual (%) ou valor_fixo (R$)';
COMMENT ON COLUMN cupons.planos_aplicaveis IS 'Array JSON com planos que aceitam o cupom. null = todos os planos';
COMMENT ON COLUMN cupons.quantidade_maxima IS 'Limite de usos do cupom. null = ilimitado';
