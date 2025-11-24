
import { Pool } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { join } from 'path';

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });

async function runMigration() {
  try {
    console.log('🔄 Executando migração de cupons...');
    
    // Verificar se as colunas já existem
    const checkColumns = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'subscriptions' 
      AND column_name IN ('cupom_codigo', 'cupom_id', 'valor_desconto_cupom')
    `);

    if (checkColumns.rows.length > 0) {
      console.log('✅ Colunas de cupom já existem!');
      console.log('Colunas encontradas:', checkColumns.rows.map(r => r.column_name));
      process.exit(0);
    }

    // Ler o arquivo SQL
    const migrationSQL = readFileSync(
      join(__dirname, '..', 'migrations', 'add_cupom_to_subscriptions.sql'),
      'utf-8'
    );

    console.log('📝 SQL da migração:', migrationSQL);

    // Executar a migração
    await pool.query(migrationSQL);

    console.log('✅ Migração de cupons executada com sucesso!');
    
    // Verificar novamente
    const verify = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'subscriptions' 
      AND column_name IN ('cupom_codigo', 'cupom_id', 'valor_desconto_cupom')
    `);

    console.log('✅ Verificação final:', verify.rows.map(r => r.column_name));

  } catch (error) {
    console.error('❌ Erro ao executar migração:', error);
    process.exit(1);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

runMigration();
