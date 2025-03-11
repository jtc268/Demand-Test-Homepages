export interface ICampaignColors {
  primary: string;
  secondary: string;
  background: string;
  text?: string;
}

export interface ICampaignConfig {
  title: string;
  subtitle?: string;
  ctaText: string;
  thankYouMessage: string;
  logoUrl?: string;
  heroImageUrl?: string;
  colors?: ICampaignColors;
}

export interface ICampaignData {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  active?: boolean;
  template?: string;
  config: ICampaignConfig;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IEmailSignup {
  email: string;
  campaignId: string;
  createdAt: Date;
} 