import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscriber extends Document {
  email: string;
  name?: string;
  campaignId: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

const SubscriberSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      trim: true,
    },
    campaignId: {
      type: String,
      required: [true, 'Campaign ID is required'],
      index: true,
    },
    metadata: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

// Check if model already exists to prevent overwriting during hot reloads
export default mongoose.models.Subscriber || mongoose.model<ISubscriber>('Subscriber', SubscriberSchema); 