
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Configurar WebSocket para Neon
neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });

async function fixSubscriptionsCupom() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Iniciando migração de cupons na tabela subscriptions...');

    // Verificar se as colunas já existem
    const checkColumns = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'subscriptions' 
      AND column_name IN ('cupom_codigo', 'cupom_id', 'valor_desconto_cupom')
    `);

    if (checkColumns.rows.length === 3) {
      console.log('✅ Todas as colunas de cupom já existem!');
      console.log('Colunas encontradas:', checkColumns.rows.map(r => r.column_name));
      return;
    }

    console.log(`📝 Faltam ${3 - checkColumns.rows.length} coluna(s). Adicionando...`);

    // Adicionar colunas uma por vez para melhor rastreamento
    const existingColumns = checkColumns.rows.map(r => r.column_name);

    if (!existingColumns.includes('cupom_codigo')) {
      await client.query(`
        ALTER TABLE subscriptions 
        ADD COLUMN cupom_codigo TEXT
      `);
      console.log('✅ Coluna cupom_codigo adicionada');
    }

    if (!existingColumns.includes('cupom_id')) {
      await client.query(`
        ALTER TABLE subscriptions 
        ADD COLUMN cupom_id INTEGER REFERENCES cupons(id) ON DELETE SET NULL
      `);
      console.log('✅ Coluna cupom_id adicionada');
    }

    if (!existingColumns.includes('valor_desconto_cupom')) {
      await client.query(`
        ALTER TABLE subscriptions 
        ADD COLUMN valor_desconto_cupom REAL
      `);
      console.log('✅ Coluna valor_desconto_cupom adicionada');
    }

    // Criar índice
    await client.query(`
      CREATE INDEX IF NOT EXISTS subscriptions_cupom_id_idx ON subscriptions(cupom_id)
    `);
    console.log('✅ Índice subscriptions_cupom_id_idx criado');

    // Verificação final
    const verify = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'subscriptions' 
      AND column_name IN ('cupom_codigo', 'cupom_id', 'valor_desconto_cupom')
    `);

    console.log('✅ Migração concluída com sucesso!');
    console.log('✅ Verificação final - Colunas presentes:', verify.rows.map(r => r.column_name));

  } catch (error: any) {
    console.error('❌ Erro durante a migração:', error.message);
    console.error('Stack:', error.stack);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

fixSubscriptionsCupom()
  .then(() => {
    console.log('🎉 Script finalizado com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Falha na execução:', error);
    process.exit(1);
  });
