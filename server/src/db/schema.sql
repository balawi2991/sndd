-- Sanad Database Schema
-- PostgreSQL with pgvector extension for vector search

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgvector extension for vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================
-- CONVERSATIONS TABLE
-- ============================================
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_read BOOLEAN DEFAULT FALSE
);

-- Indexes for conversations
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_created_at ON conversations(created_at DESC);
CREATE INDEX idx_conversations_updated_at ON conversations(updated_at DESC);

-- ============================================
-- MESSAGES TABLE
-- ============================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  sources JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for messages
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- ============================================
-- TRAINING MATERIALS TABLE
-- ============================================
CREATE TABLE training_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('file', 'link', 'text')),
  title VARCHAR(255) NOT NULL,
  content TEXT,
  url VARCHAR(500),
  file_path VARCHAR(500),
  file_size INTEGER,
  mime_type VARCHAR(100),
  indexed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for training materials
CREATE INDEX idx_materials_user_id ON training_materials(user_id);
CREATE INDEX idx_materials_type ON training_materials(type);
CREATE INDEX idx_materials_indexed_at ON training_materials(indexed_at);

-- ============================================
-- CHUNKS TABLE (Vector Store)
-- ============================================
CREATE TABLE chunks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  material_id UUID NOT NULL REFERENCES training_materials(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding vector(1536), -- OpenAI text-embedding-3-small dimensions
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for chunks
CREATE INDEX idx_chunks_material_id ON chunks(material_id);

-- Vector similarity search index (IVFFlat for better performance)
-- Adjust lists parameter based on your data size
CREATE INDEX idx_chunks_embedding ON chunks 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- ============================================
-- USAGE STATS TABLE (for future billing/limits)
-- ============================================
CREATE TABLE usage_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  messages_count INTEGER DEFAULT 0,
  words_count INTEGER DEFAULT 0,
  api_calls_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for usage stats
CREATE INDEX idx_usage_user_id ON usage_stats(user_id);
CREATE INDEX idx_usage_period ON usage_stats(period_start, period_end);

-- Unique constraint to prevent duplicate periods
CREATE UNIQUE INDEX idx_usage_user_period ON usage_stats(user_id, period_start, period_end);

-- ============================================
-- CHAT LOGS TABLE (for monitoring and debugging)
-- ============================================
CREATE TABLE chat_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
  question TEXT NOT NULL,
  answer TEXT,
  chunks_retrieved INTEGER,
  response_time_ms INTEGER,
  success BOOLEAN DEFAULT TRUE,
  error_code VARCHAR(50),
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for chat logs
CREATE INDEX idx_logs_user_id ON chat_logs(user_id);
CREATE INDEX idx_logs_created_at ON chat_logs(created_at DESC);
CREATE INDEX idx_logs_success ON chat_logs(success);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_materials_updated_at
  BEFORE UPDATE ON training_materials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usage_updated_at
  BEFORE UPDATE ON usage_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to search similar chunks
CREATE OR REPLACE FUNCTION search_similar_chunks(
  query_embedding vector(1536),
  user_id_param UUID,
  similarity_threshold FLOAT DEFAULT 0.7,
  max_results INTEGER DEFAULT 10
)
RETURNS TABLE (
  chunk_id UUID,
  material_id UUID,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.material_id,
    c.content,
    c.metadata,
    1 - (c.embedding <=> query_embedding) as similarity
  FROM chunks c
  INNER JOIN training_materials tm ON c.material_id = tm.id
  WHERE tm.user_id = user_id_param
    AND (1 - (c.embedding <=> query_embedding)) >= similarity_threshold
  ORDER BY c.embedding <=> query_embedding
  LIMIT max_results;
END;
$$ LANGUAGE plpgsql;

-- Function to get conversation with messages
CREATE OR REPLACE FUNCTION get_conversation_with_messages(conversation_id_param UUID)
RETURNS TABLE (
  conversation_id UUID,
  user_id UUID,
  title VARCHAR,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  is_read BOOLEAN,
  messages JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.user_id,
    c.title,
    c.created_at,
    c.updated_at,
    c.is_read,
    COALESCE(
      json_agg(
        json_build_object(
          'id', m.id,
          'role', m.role,
          'content', m.content,
          'sources', m.sources,
          'createdAt', m.created_at
        )
        ORDER BY m.created_at
      ) FILTER (WHERE m.id IS NOT NULL),
      '[]'::json
    )::jsonb as messages
  FROM conversations c
  LEFT JOIN messages m ON c.id = m.conversation_id
  WHERE c.id = conversation_id_param
  GROUP BY c.id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SAMPLE DATA (for development/testing)
-- ============================================

-- Insert sample user (only in development)
-- INSERT INTO users (id, email, name) 
-- VALUES ('00000000-0000-0000-0000-000000000001', 'demo@sanad.com', 'Demo User')
-- ON CONFLICT (email) DO NOTHING;

-- ============================================
-- GRANTS (adjust based on your user setup)
-- ============================================

-- Grant permissions to application user
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO sanad_app;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO sanad_app;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO sanad_app;
