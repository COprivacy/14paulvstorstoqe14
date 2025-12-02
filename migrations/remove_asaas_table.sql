
-- Remover coluna asaas_payment_id da tabela subscriptions
ALTER TABLE subscriptions DROP COLUMN IF EXISTS asaas_payment_id;

-- Remover tabela config_asaas
DROP TABLE IF EXISTS config_asaas;
