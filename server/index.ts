import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { connectDB } from './config/database.js';
import authRoutes from './routes/auth.routes.js';
import chatRoutes from './routes/chat.routes.js';
import trainingRoutes from './routes/training.routes.js';
import conversationRoutes from './routes/conversation.routes.js';
import appearanceRoutes from './routes/appearance.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { rateLimiter } from './middleware/rateLimiter.js';

const __dirname = path.resolve();

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Allow Vite in development
}));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Rate limiting
app.use('/api/', rateLimiter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/appearance', appearanceRoutes);

// Serve static files in production
if (isProduction) {
  // In Railway, the working directory is /app
  // After build: /app/dist/client contains frontend files
  // After build: /app/dist/server contains backend files
  const clientPath = path.resolve(process.cwd(), 'dist', 'client');
  
  console.log('📁 Current working directory:', process.cwd());
  console.log('📁 __dirname:', __dirname);
  console.log('📁 Serving static files from:', clientPath);
  
  app.use(express.static(clientPath));
  
  // Serve index.html for all non-API routes (SPA)
  app.get('*', (req, res) => {
    const indexPath = path.join(clientPath, 'index.html');
    console.log('📄 Serving index.html from:', indexPath);
    res.sendFile(indexPath);
  });
}

// Error handling
app.use(errorHandler);

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
