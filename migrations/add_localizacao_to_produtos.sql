-- Adicionar coluna de localização aos produtos
ALTER TABLE produtos ADD COLUMN IF NOT EXISTS localizacao TEXT;

-- Criar índice para busca rápida por localização
CREATE INDEX IF NOT EXISTS idx_produtos_localizacao ON produtos(localizacao) WHERE localizacao IS NOT NULL;
