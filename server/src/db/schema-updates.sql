-- Additional tables for Multi-tenancy & SaaS

-- ============================================
-- AGENTS TABLE (for API keys and widget embedding)
-- ============================================
CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  api_key VARCHAR(255) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for agents
CREATE INDEX idx_agents_user_id ON agents(user_id);
CREATE INDEX idx_agents_api_key ON agents(api_key);
CREATE INDEX idx_agents_is_active ON agents(is_active);

-- Trigger for updated_at
CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON agents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all user-specific tables
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own conversations
CREATE POLICY conversations_isolation_policy ON conversations
  FOR ALL
  USING (user_id = current_setting('app.current_user_id')::uuid);

-- Policy: Users can only see their own training materials
CREATE POLICY materials_isolation_policy ON training_materials
  FOR ALL
  USING (user_id = current_setting('app.current_user_id')::uuid);

-- Policy: Users can only see their own agents
CREATE POLICY agents_isolation_policy ON agents
  FOR ALL
  USING (user_id = current_setting('app.current_user_id')::uuid);

-- ============================================
-- HELPER FUNCTIONS FOR RLS
-- ============================================

-- Function to set current user context
CREATE OR REPLACE FUNCTION set_current_user(user_id UUID)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.current_user_id', user_id::text, false);
END;
$$ LANGUAGE plpgsql;

-- Function to get current user context
CREATE OR REPLACE FUNCTION get_current_user()
RETURNS UUID AS $$
BEGIN
  RETURN current_setting('app.current_user_id', true)::uuid;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- USAGE LIMITS TABLE (for SaaS tiers)
-- ============================================
CREATE TABLE IF NOT EXISTS subscription_tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) UNIQUE NOT NULL,
  monthly_price DECIMAL(10, 2) NOT NULL,
  messages_limit INTEGER NOT NULL,
  materials_limit INTEGER NOT NULL,
  agents_limit INTEGER NOT NULL,
  features JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert default tiers
INSERT INTO subscription_tiers (name, monthly_price, messages_limit, materials_limit, agents_limit, features)
VALUES 
  ('free', 0, 100, 5, 1, '{"support": "community", "analytics": false}'),
  ('starter', 29, 1000, 50, 3, '{"support": "email", "analytics": true}'),
  ('professional', 79, 10000, 200, 10, '{"support": "priority", "analytics": true, "custom_domain": true}'),
  ('enterprise', 299, -1, -1, -1, '{"support": "dedicated", "analytics": true, "custom_domain": true, "white_label": true}')
ON CONFLICT (name) DO NOTHING;

-- User subscriptions
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tier_id UUID NOT NULL REFERENCES subscription_tiers(id),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'trial')),
  current_period_start TIMESTAMP DEFAULT NOW(),
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON user_subscriptions(status);

-- Trigger
CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- USAGE TRACKING (for billing)
-- ============================================
CREATE TABLE IF NOT EXISTS daily_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  messages_count INTEGER DEFAULT 0,
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Indexes
CREATE INDEX idx_daily_usage_user_date ON daily_usage(user_id, date);

-- Function to increment usage
CREATE OR REPLACE FUNCTION increment_daily_usage(
  p_user_id UUID,
  p_messages INTEGER DEFAULT 1,
  p_tokens INTEGER DEFAULT 0
)
RETURNS void AS $$
BEGIN
  INSERT INTO daily_usage (user_id, date, messages_count, tokens_used)
  VALUES (p_user_id, CURRENT_DATE, p_messages, p_tokens)
  ON CONFLICT (user_id, date)
  DO UPDATE SET
    messages_count = daily_usage.messages_count + p_messages,
    tokens_used = daily_usage.tokens_used + p_tokens,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to check if user has exceeded limits
CREATE OR REPLACE FUNCTION check_usage_limits(p_user_id UUID)
RETURNS TABLE (
  allowed BOOLEAN,
  current_usage INTEGER,
  limit_value INTEGER,
  tier_name VARCHAR
) AS $$
DECLARE
  v_tier_id UUID;
  v_messages_limit INTEGER;
  v_current_usage INTEGER;
BEGIN
  -- Get user's current tier
  SELECT tier_id INTO v_tier_id
  FROM user_subscriptions
  WHERE user_id = p_user_id
    AND status = 'active'
    AND (current_period_end IS NULL OR current_period_end > NOW())
  ORDER BY created_at DESC
  LIMIT 1;

  -- If no subscription, use free tier
  IF v_tier_id IS NULL THEN
    SELECT id INTO v_tier_id
    FROM subscription_tiers
    WHERE name = 'free';
  END IF;

  -- Get tier limits
  SELECT messages_limit INTO v_messages_limit
  FROM subscription_tiers
  WHERE id = v_tier_id;

  -- Get current month usage
  SELECT COALESCE(SUM(messages_count), 0) INTO v_current_usage
  FROM daily_usage
  WHERE user_id = p_user_id
    AND date >= DATE_TRUNC('month', CURRENT_DATE);

  -- Return result
  RETURN QUERY
  SELECT 
    (v_messages_limit = -1 OR v_current_usage < v_messages_limit) as allowed,
    v_current_usage::INTEGER,
    v_messages_limit,
    st.name
  FROM subscription_tiers st
  WHERE st.id = v_tier_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- AUDIT LOG (for security and compliance)
-- ============================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id UUID,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

-- Function to log actions
CREATE OR REPLACE FUNCTION log_audit(
  p_user_id UUID,
  p_action VARCHAR,
  p_resource_type VARCHAR DEFAULT NULL,
  p_resource_id UUID DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO audit_logs (user_id, action, resource_type, resource_id, metadata)
  VALUES (p_user_id, p_action, p_resource_type, p_resource_id, p_metadata);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE agents IS 'API keys for embedding widgets in external sites';
COMMENT ON TABLE subscription_tiers IS 'SaaS pricing tiers and limits';
COMMENT ON TABLE user_subscriptions IS 'User subscription status and billing periods';
COMMENT ON TABLE daily_usage IS 'Daily usage tracking for billing and limits';
COMMENT ON TABLE audit_logs IS 'Security and compliance audit trail';
