/**
 * Database Setup Script
 * Automatically creates database, installs extensions, and runs schema
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
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function setupDatabase() {
  log('\n🚀 Starting Database Setup...', 'cyan');
  
  // Parse DATABASE_URL
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    log('❌ DATABASE_URL not found in .env file', 'red');
    process.exit(1);
  }

  // Parse connection details
  const url = new URL(dbUrl);
  const dbName = url.pathname.slice(1);
  const user = url.username;
  const password = url.password;
  const host = url.hostname;
  const port = url.port || 5432;

  log(`\n📊 Database Configuration:`, 'blue');
  log(`   Host: ${host}`);
  log(`   Port: ${port}`);
  log(`   Database: ${dbName}`);
  log(`   User: ${user}`);

  // Connect to postgres database to create our database
  const adminClient = new Client({
    host,
    port,
    user,
    password,
    database: 'postgres'
  });

  try {
    // Step 1: Connect to postgres
    log('\n📡 Connecting to PostgreSQL...', 'yellow');
    await adminClient.connect();
    log('✅ Connected to PostgreSQL', 'green');

    // Step 2: Check if database exists
    log(`\n🔍 Checking if database '${dbName}' exists...`, 'yellow');
    const dbCheck = await adminClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (dbCheck.rows.length === 0) {
      log(`📦 Creating database '${dbName}'...`, 'yellow');
      await adminClient.query(`CREATE DATABASE ${dbName}`);
      log(`✅ Database '${dbName}' created`, 'green');
    } else {
      log(`✅ Database '${dbName}' already exists`, 'green');
    }

    await adminClient.end();

    // Step 3: Connect to our database
    log(`\n📡 Connecting to '${dbName}'...`, 'yellow');
    const client = new Client({
      host,
      port,
      user,
      password,
      database: dbName
    });

    await client.connect();
    log(`✅ Connected to '${dbName}'`, 'green');

    // Step 4: Install pgvector extension
    log('\n🔌 Installing pgvector extension...', 'yellow');
    try {
      await client.query('CREATE EXTENSION IF NOT EXISTS vector');
      log('✅ pgvector extension installed', 'green');
    } catch (error) {
      log('⚠️  pgvector extension not available', 'yellow');
      log('   Install it with: sudo apt install postgresql-16-pgvector', 'yellow');
      log('   Or download from: https://github.com/pgvector/pgvector', 'yellow');
    }

    // Step 5: Install uuid extension
    log('\n🔌 Installing uuid-ossp extension...', 'yellow');
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    log('✅ uuid-ossp extension installed', 'green');

    // Step 6: Run schema
    log('\n📜 Running database schema...', 'yellow');
    const schemaPath = path.join(__dirname, '..', 'src', 'db', 'schema.sql');
    
    if (!fs.existsSync(schemaPath)) {
      log(`❌ Schema file not found: ${schemaPath}`, 'red');
      process.exit(1);
    }

    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      try {
        await client.query(statement);
      } catch (error) {
        // Ignore "already exists" errors
        if (!error.message.includes('already exists')) {
          log(`⚠️  Warning: ${error.message}`, 'yellow');
        }
      }
    }
    
    log('✅ Schema executed successfully', 'green');

    // Step 7: Create demo user
    log('\n👤 Creating demo user...', 'yellow');
    try {
      await client.query(`
        INSERT INTO users (id, email, name) 
        VALUES ('demo-user-id', 'demo@sanad.com', 'Demo User')
        ON CONFLICT (email) DO NOTHING
      `);
      log('✅ Demo user created', 'green');
    } catch (error) {
      log(`⚠️  Demo user: ${error.message}`, 'yellow');
    }

    // Step 8: Verify setup
    log('\n🔍 Verifying setup...', 'yellow');
    
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    log(`✅ Found ${tables.rows.length} tables:`, 'green');
    tables.rows.forEach(row => {
      log(`   - ${row.table_name}`, 'cyan');
    });

    await client.end();

    log('\n🎉 Database setup completed successfully!', 'green');
    log('\n📝 Next steps:', 'cyan');
    log('   1. Add your API keys to server/.env');
    log('   2. Run: npm run dev');
    log('   3. Add training materials');
    log('');

  } catch (error) {
    log(`\n❌ Error: ${error.message}`, 'red');
    log(`\n💡 Troubleshooting:`, 'yellow');
    log('   1. Make sure PostgreSQL is running');
    log('   2. Check your DATABASE_URL in .env');
    log('   3. Verify user has CREATE DATABASE permission');
    log('');
    process.exit(1);
  }
}

// Run setup
setupDatabase();
