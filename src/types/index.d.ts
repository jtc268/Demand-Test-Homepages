import { ReactNode } from 'react';

// JSX related types
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// Campaign related types
export interface ICampaignConfig {
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
}

export interface ICampaignData {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  description?: string;
  active: boolean;
  template: string;
  config: ICampaignConfig;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  subscriberCount?: number;
}

// Subscriber related types
export interface ISubscriberData {
  _id?: string;
  id?: string;
  email: string;
  name?: string;
  campaignId: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  metadata?: Record<string, any>;
} 