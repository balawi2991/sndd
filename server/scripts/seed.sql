-- Seed data for testing and initial setup

-- Create test user
INSERT INTO users (id, email, name)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'demo@sanad.com', 'Demo User')
ON CONFLICT (email) DO NOTHING;

-- Create subscription for test user (free tier)
INSERT INTO user_subscriptions (user_id, tier_id, status, current_period_start, current_period_end)
SELECT 
  '00000000-0000-0000-0000-000000000001',
  id,
  'active',
  NOW(),
  NOW() + INTERVAL '30 days'
FROM subscription_tiers
WHERE name = 'free'
ON CONFLICT DO NOTHING;

-- Create test agent for demo user
INSERT INTO agents (id, user_id, name, api_key, is_active)
VALUES 
  ('00000000-0000-0000-0000-000000000002', 
   '00000000-0000-0000-0000-000000000001', 
   'Demo Widget', 
   'agent_demo_key_for_testing_only_change_in_production',
   true)
ON CONFLICT (api_key) DO NOTHING;

-- Create sample training material
INSERT INTO training_materials (user_id, type, title, content)
VALUES 
  ('00000000-0000-0000-0000-000000000001',
   'text',
   'مرحباً بك في Sanad',
   'Sanad هو نظام ذكاء اصطناعي متقدم يساعدك في الإجابة على أسئلة عملائك. يمكنك إضافة مواد تدريبية مثل الملفات والروابط والنصوص لتدريب البوت على معلوماتك الخاصة.')
ON CONFLICT DO NOTHING;

-- Log seed completion
SELECT log_audit(
  '00000000-0000-0000-0000-000000000001',
  'database_seeded',
  'system',
  NULL,
  '{"timestamp": "' || NOW()::text || '"}'::jsonb
);

-- Display summary
SELECT 
  'Seed completed!' as message,
  (SELECT COUNT(*) FROM users) as total_users,
  (SELECT COUNT(*) FROM agents) as total_agents,
  (SELECT COUNT(*) FROM training_materials) as total_materials,
  (SELECT COUNT(*) FROM subscription_tiers) as total_tiers;
