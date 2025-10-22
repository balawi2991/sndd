import mongoose, { Schema, Document } from 'mongoose';

export interface ITrainingMaterial extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'file' | 'link' | 'text';
  title: string;
  content: string;
  source?: string;
  characters: number;
  status: 'trained' | 'untrained' | 'training';
  lastTrained?: Date;
  metadata?: {
    fileType?: string;
    fileSize?: number;
    url?: string;
  };
  embeddings?: Array<{
    chunk: string;
    embedding: number[];
    metadata: any;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const TrainingMaterialSchema = new Schema<ITrainingMaterial>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['file', 'link', 'text'],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      trim: true,
    },
    characters: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ['trained', 'untrained', 'training'],
      default: 'untrained',
    },
    lastTrained: {
      type: Date,
    },
    metadata: {
      fileType: String,
      fileSize: Number,
      url: String,
    },
    embeddings: [
      {
        chunk: String,
        embedding: [Number],
        metadata: Schema.Types.Mixed,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries and data isolation
TrainingMaterialSchema.index({ userId: 1, status: 1 });
TrainingMaterialSchema.index({ userId: 1, type: 1 });
TrainingMaterialSchema.index({ userId: 1, _id: 1 }); // For secure lookups

export default mongoose.model<ITrainingMaterial>('TrainingMaterial', TrainingMaterialSchema);
