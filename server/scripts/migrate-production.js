/**
 * Production Migration Script for Railway
 * Runs database migrations in production environment
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function migrateProduction() {
  log('\n🚀 Starting Production Migration...', 'cyan');

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    log('❌ DATABASE_URL not found', 'red');
    process.exit(1);
  }

  // Railway PostgreSQL requires SSL
  const client = new Client({
    connectionString: dbUrl,
    ssl: process.env.NODE_ENV === 'production' ? {
      rejectUnauthorized: false
    } : false
  });

  try {
    await client.connect();
    log('✅ Connected to database', 'green');

    // Install extensions
    log('\n🔌 Installing extensions...', 'yellow');
    
    try {
      await client.query('CREATE EXTENSION IF NOT EXISTS vector');
      log('✅ pgvector extension installed', 'green');
    } catch (error) {
      log(`⚠️  pgvector: ${error.message}`, 'yellow');
    }

    try {
      await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
      log('✅ uuid-ossp extension installed', 'green');
    } catch (error) {
      log(`⚠️  uuid-ossp: ${error.message}`, 'yellow');
    }

    // Run schema
    log('\n📜 Running schema migrations...', 'yellow');
    const schemaPath = path.join(__dirname, '..', 'src', 'db', 'schema.sql');
    
    if (!fs.existsSync(schemaPath)) {
      log(`❌ Schema file not found: ${schemaPath}`, 'red');
      process.exit(1);
    }

    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split and execute statements
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      try {
        await client.query(statement);
      } catch (error) {
        if (!error.message.includes('already exists')) {
          log(`⚠️  Warning: ${error.message}`, 'yellow');
        }
      }
    }
    
    log('✅ Schema migrations completed', 'green');

    // Verify tables
    log('\n🔍 Verifying tables...', 'yellow');
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    log(`✅ Found ${tables.rows.length} tables`, 'green');

    await client.end();

    log('\n🎉 Production migration completed successfully!', 'green');
    log('');

  } catch (error) {
    log(`\n❌ Migration failed: ${error.message}`, 'red');
    log(`\n💡 Stack trace:`, 'yellow');
    console.error(error);
    process.exit(1);
  }
}

// Run migration
migrateProduction();
