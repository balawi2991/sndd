import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/database';
import authRoutes from './routes/auth.routes';
import chatRoutes from './routes/chat.routes';
import trainingRoutes from './routes/training.routes';
import conversationRoutes from './routes/conversation.routes';
import appearanceRoutes from './routes/appearance.routes';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  const clientPath = path.join(__dirname, '../client');
  app.use(express.static(clientPath));
  
  // Serve index.html for all non-API routes (SPA)
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
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
