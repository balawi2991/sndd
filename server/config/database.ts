import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URL;
    
    if (!mongoUri) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }

    await mongoose.connect(mongoUri);
    
    console.log('✅ MongoDB connected successfully');
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    throw error;
  }
};

export default mongoose;
