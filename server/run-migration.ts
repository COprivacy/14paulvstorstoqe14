import { Pool } from '@neondatabase/serverless';
import * as fs from 'fs';
import * as path from 'path';

async function runMigration() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
  
  try {
    console.log('🔄 Executando migração...');

    const migrationSQL = fs.readFileSync(
      path.join(__dirname, 'migrations', 'add_vendas_orcamento_fields.sql'),
      'utf-8'
    );

    await pool.query(migrationSQL);

    console.log('✅ Migração executada com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao executar migração:', error);
    throw error;
  } finally {
    await pool.end();
    process.exit(0);
  }
}

runMigration().catch((error) => {
  console.error('Erro fatal:', error);
  process.exit(1);
});