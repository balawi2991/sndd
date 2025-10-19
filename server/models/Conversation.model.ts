import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{
    title: string;
    url?: string;
    materialId?: mongoose.Types.ObjectId;
  }>;
  timestamp: Date;
}

export interface IConversation extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  messages: IMessage[];
  unread: boolean;
  lastActivity: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    sources: [
      {
        title: String,
        url: String,
        materialId: {
          type: Schema.Types.ObjectId,
          ref: 'TrainingMaterial',
        },
      },
    ],
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const ConversationSchema = new Schema<IConversation>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    messages: [MessageSchema],
    unread: {
      type: Boolean,
      default: false,
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
ConversationSchema.index({ userId: 1, lastActivity: -1 });

export default mongoose.model<IConversation>('Conversation', ConversationSchema);
