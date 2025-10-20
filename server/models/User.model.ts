import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  plan: 'free' | 'pro' | 'enterprise';
  usage: {
    messagesCount: number;
    tokensUsed: number;
    lastReset: Date;
  };
  limits: {
    messagesPerMonth: number;
    tokensPerMonth: number;
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    plan: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
      default: 'free',
    },
    usage: {
      messagesCount: {
        type: Number,
        default: 0,
      },
      tokensUsed: {
        type: Number,
        default: 0,
      },
      lastReset: {
        type: Date,
        default: Date.now,
      },
    },
    limits: {
      messagesPerMonth: {
        type: Number,
        default: 100, // Free plan: 100 messages/month
      },
      tokensPerMonth: {
        type: Number,
        default: 50000, // Free plan: 50k tokens/month
      },
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
