#!/bin/bash

# Railway Database Migration Script
# Run this after deploying to Railway

echo "🔄 Starting database migration..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERROR: DATABASE_URL is not set"
  exit 1
fi

echo "✅ DATABASE_URL found"

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

echo "📁 Project root: $PROJECT_ROOT"

# Install pgvector extension
echo "📦 Installing pgvector extension..."
psql $DATABASE_URL -c "CREATE EXTENSION IF NOT EXISTS vector;"

if [ $? -eq 0 ]; then
  echo "✅ pgvector extension installed"
else
  echo "❌ Failed to install pgvector extension"
  exit 1
fi

# Run main schema
echo "📝 Running main schema..."
psql $DATABASE_URL < "$PROJECT_ROOT/src/db/schema.sql"

if [ $? -eq 0 ]; then
  echo "✅ Main schema applied"
else
  echo "❌ Failed to apply main schema"
  exit 1
fi

# Run schema updates (SaaS features)
echo "📝 Running schema updates..."
psql $DATABASE_URL < "$PROJECT_ROOT/src/db/schema-updates.sql"

if [ $? -eq 0 ]; then
  echo "✅ Schema updates applied"
else
  echo "❌ Failed to apply schema updates"
  exit 1
fi

echo "🎉 Migration completed successfully!"
