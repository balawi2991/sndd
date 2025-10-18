#!/usr/bin/env node

/**
 * Setup Environment Variables
 * Generates .env file with secure JWT secret
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', '.env.example');

// Generate secure JWT secret
const generateJWTSecret = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Read .env.example
if (!fs.existsSync(envExamplePath)) {
  console.error('❌ Error: .env.example not found!');
  process.exit(1);
}

const envExample = fs.readFileSync(envExamplePath, 'utf8');

// Generate JWT secret
const jwtSecret = generateJWTSecret();

// Replace placeholder with actual secret
let envContent = envExample.replace(
  'your-super-secret-jwt-key-change-this-in-production',
  jwtSecret
);

// Write .env file
fs.writeFileSync(envPath, envContent);

console.log('✅ .env file created successfully!');
console.log('');
console.log('📝 Generated JWT Secret:');
console.log(`   ${jwtSecret}`);
console.log('');
console.log('⚠️  Important:');
console.log('   1. Add your DeepSeek API key');
console.log('   2. Add your OpenAI API key');
console.log('   3. Update DATABASE_URL if needed');
console.log('');
console.log('📁 File location: server/.env');
console.log('');
console.log('🚀 Ready to run: npm run dev');
