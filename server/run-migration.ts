import { Pool } from '@neondatabase/serverless';
import * as fs from 'fs';
import * as path from 'path';

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });

async function runMigration() {
  try {
    console.log('🔄 Executando migração...');

    const migrationSQL = fs.readFileSync(
      path.join(__dirname, 'migrations', 'add_vendas_orcamento_fields.sql'),
      'utf-8'
    );

    await pool.query(migrationSQL);

    console.log('📝 Executando migration de cupons e promoções...');
    const cuponsSQL = await fs.readFile(
      path.join(__dirname, '../migrations/add_cupons_promocoes.sql'),
      'utf-8'
    );
    await pool.query(cuponsSQL);
    console.log('✅ Migration de cupons concluída\n');

    console.log('✅ Migração executada com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao executar migração:', error);
    process.exit(1);
  }
}

runMigration();