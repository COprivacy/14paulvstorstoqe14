
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });

async function fixSubscriptionsCupom() {
  try {
    console.log('🔄 Adicionando colunas de cupom na tabela subscriptions...');

    // Adicionar coluna cupom_codigo
    try {
      await pool.query(`
        ALTER TABLE subscriptions 
        ADD COLUMN IF NOT EXISTS cupom_codigo TEXT
      `);
      console.log('✅ Coluna cupom_codigo adicionada');
    } catch (e) {
      console.log('ℹ️ Coluna cupom_codigo já existe ou erro:', e.message);
    }

    // Adicionar coluna cupom_id
    try {
      await pool.query(`
        ALTER TABLE subscriptions 
        ADD COLUMN IF NOT EXISTS cupom_id INTEGER REFERENCES cupons(id) ON DELETE SET NULL
      `);
      console.log('✅ Coluna cupom_id adicionada');
    } catch (e) {
      console.log('ℹ️ Coluna cupom_id já existe ou erro:', e.message);
    }

    // Adicionar coluna valor_desconto_cupom
    try {
      await pool.query(`
        ALTER TABLE subscriptions 
        ADD COLUMN IF NOT EXISTS valor_desconto_cupom REAL
      `);
      console.log('✅ Coluna valor_desconto_cupom adicionada');
    } catch (e) {
      console.log('ℹ️ Coluna valor_desconto_cupom já existe ou erro:', e.message);
    }

    // Criar índice
    try {
      await pool.query(`
        CREATE INDEX IF NOT EXISTS subscriptions_cupom_id_idx ON subscriptions(cupom_id)
      `);
      console.log('✅ Índice subscriptions_cupom_id_idx criado');
    } catch (e) {
      console.log('ℹ️ Índice já existe ou erro:', e.message);
    }

    console.log('✅ Migração concluída com sucesso!');

  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

fixSubscriptionsCupom();
