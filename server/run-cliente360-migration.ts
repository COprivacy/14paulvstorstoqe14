
import { Pool } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runMigration() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL! });

  try {
    console.log('🚀 Iniciando migration do Cliente 360°...');

    // Ler arquivo de migration
    const migrationSQL = readFileSync(
      join(__dirname, '../migrations/add_cliente360_tables.sql'),
      'utf-8'
    );

    // Executar migration
    await pool.query(migrationSQL);

    console.log('✅ Migration do Cliente 360° executada com sucesso!');
    console.log('📋 Tabelas criadas:');
    console.log('  - client_notes');
    console.log('  - client_documents');
    console.log('  - client_interactions');
    console.log('  - plan_changes_history');
    console.log('  - client_communications');

    // Verificar se as tabelas foram criadas
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN (
        'client_notes', 
        'client_documents', 
        'client_interactions', 
        'plan_changes_history', 
        'client_communications'
      )
      ORDER BY table_name
    `);

    console.log('\n📊 Tabelas encontradas no banco:');
    result.rows.forEach((row: any) => {
      console.log(`  ✓ ${row.table_name}`);
    });

  } catch (error) {
    console.error('❌ Erro ao executar migration:', error);
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
