import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/env.js';
import { prisma, enablePgVector } from './lib/prisma.js';
import { apiLimiter } from './middleware/rateLimit.middleware.js';

// Routes
import authRoutes from './routes/auth.routes.js';
import chatRoutes from './routes/chat.routes.js';
import botRoutes from './routes/bot.routes.js';
import trainingRoutes from './routes/training.routes.js';
import conversationRoutes from './routes/conversation.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ============================================
// MIDDLEWARE
// ============================================

app.use(cors({
  origin: config.server.nodeEnv === 'production' 
    ? [config.server.frontendUrl] 
    : '*',
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// API ROUTES
// ============================================

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/bot', botRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Rate limiting for all API routes
app.use('/api', apiLimiter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: config.server.nodeEnv,
  });
});

// ============================================
// SERVE FRONTEND (Production)
// ============================================

if (config.server.nodeEnv === 'production') {
  const distPath = path.join(__dirname, '../../dist');
  
  app.use(express.static(distPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// ============================================
// ERROR HANDLING
// ============================================

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// ============================================
// START SERVER
// ============================================

async function start() {
  try {
    // Enable pgvector extension
    await enablePgVector();
    
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected');

    // Start server
    const port = config.server.port;
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`📦 Environment: ${config.server.nodeEnv}`);
      console.log(`🔗 API: http://localhost:${port}/api`);
      
      if (config.server.nodeEnv === 'production') {
        console.log(`🌐 Frontend: http://localhost:${port}`);
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

start();
