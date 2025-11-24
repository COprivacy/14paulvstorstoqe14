
-- Adicionar campos de cupom na tabela subscriptions
ALTER TABLE subscriptions 
  ADD COLUMN IF NOT EXISTS cupom_codigo TEXT,
  ADD COLUMN IF NOT EXISTS cupom_id INTEGER REFERENCES cupons(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS valor_desconto_cupom REAL;

-- Criar índice para buscar assinaturas por cupom
CREATE INDEX IF NOT EXISTS subscriptions_cupom_id_idx ON subscriptions(cupom_id);
