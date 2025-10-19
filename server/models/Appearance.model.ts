import mongoose, { Schema, Document } from 'mongoose';

export interface IAppearance extends Document {
  userId: mongoose.Types.ObjectId;
  logo?: string;
  primaryColor: string;
  glowingBorder: boolean;
  avatar?: string;
  showFloatingAvatar: boolean;
  title: string;
  placeholder: string;
  suggestedQuestions: string[];
  createdAt: Date;
  updatedAt: Date;
}

const AppearanceSchema = new Schema<IAppearance>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    logo: {
      type: String,
    },
    primaryColor: {
      type: String,
      default: '#17B26A',
    },
    glowingBorder: {
      type: Boolean,
      default: true,
    },
    avatar: {
      type: String,
    },
    showFloatingAvatar: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: 'Chat with us',
    },
    placeholder: {
      type: String,
      default: 'Ask me anything...',
    },
    suggestedQuestions: {
      type: [String],
      default: [
        'How can I get started?',
        'What are your pricing plans?',
        'Do you offer support?',
      ],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IAppearance>('Appearance', AppearanceSchema);
