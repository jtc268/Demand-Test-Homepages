import mongoose, { Schema, Document } from 'mongoose';

export interface ICampaign extends Document {
  name: string;
  slug: string;
  description?: string;
  active: boolean;
  template: string;
  config: {
    title: string;
    subtitle?: string;
    ctaText?: string;
    thankYouMessage?: string;
    colors?: {
      primary?: string;
      secondary?: string;
      background?: string;
      text?: string;
    };
    logoUrl?: string;
    heroImageUrl?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

const CampaignSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    template: {
      type: String,
      required: [true, 'Template is required'],
      default: 'default',
    },
    config: {
      title: {
        type: String,
        required: [true, 'Title is required'],
      },
      subtitle: String,
      ctaText: String,
      thankYouMessage: String,
      colors: {
        primary: String,
        secondary: String,
        background: String,
        text: String,
      },
      logoUrl: String,
      heroImageUrl: String,
    },
    metadata: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

// Create a text index for search functionality
CampaignSchema.index({ name: 'text', description: 'text' });

// Check if model already exists to prevent overwriting during hot reloads
export default mongoose.models.Campaign || mongoose.model<ICampaign>('Campaign', CampaignSchema); 