import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Auto-migration script for Railway deployment
 * Runs database schema automatically on first deploy
 */

async function runMigrations() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('❌ DATABASE_URL environment variable is required');
    process.exit(1);
  }

  const pool = new Pool({ connectionString });

  try {
    console.log('🚀 Starting database migrations...');

    // Check if pgvector extension exists
    console.log('📦 Checking pgvector extension...');
    try {
      await pool.query('CREATE EXTENSION IF NOT EXISTS vector');
      console.log('✅ pgvector extension ready');
    } catch (error) {
      console.warn('⚠️  Could not create pgvector extension. You may need to use Railway pgvector template.');
      console.warn('   Error:', error);
    }

    // Check if tables exist
    const tablesCheck = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'conversations', 'messages', 'training_materials', 'chunks')
    `);

    if (tablesCheck.rows.length === 5) {
      console.log('✅ Database schema already exists. Skipping migration.');
      await pool.end();
      return;
    }

    // Read schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    
    if (!fs.existsSync(schemaPath)) {
      console.error('❌ schema.sql file not found at:', schemaPath);
      process.exit(1);
    }

    const schema = fs.readFileSync(schemaPath, 'utf-8');

    console.log('📝 Running schema.sql...');
    await pool.query(schema);

    console.log('✅ Database migrations completed successfully!');
    console.log('');
    console.log('📊 Created tables:');
    console.log('   - users');
    console.log('   - conversations');
    console.log('   - messages');
    console.log('   - training_materials');
    console.log('   - chunks (with vector support)');
    console.log('   - usage_stats');
    console.log('   - chat_logs');

    await pool.end();
    console.log('✅ Migration complete!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    await pool.end();
    process.exit(1);
  }
}

// Run migrations if called directly
if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { runMigrations };
