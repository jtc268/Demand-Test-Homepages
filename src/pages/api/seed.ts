import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/database';
import Campaign from '@/utils/models/Campaign';

type ResponseData = {
  success: boolean;
  message?: string;
  data?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Connect to the database
    await dbConnect();

    // Check if sample campaign already exists
    const existingCampaign = await Campaign.findOne({ slug: 'sample-product' });
    
    if (existingCampaign) {
      return res.status(200).json({
        success: true,
        message: 'Sample campaign already exists',
        data: existingCampaign,
      });
    }

    // Create sample campaign
    const sampleCampaign = await Campaign.create({
      name: 'Sample Product',
      slug: 'sample-product',
      description: 'A sample product to demonstrate the landing page',
      active: true,
      template: 'modern',
      config: {
        title: 'Introducing Our Amazing Product',
        subtitle: 'The revolutionary solution that will transform how you work. Sign up now to get early access and exclusive updates.',
        ctaText: 'Join the Waitlist',
        thankYouMessage: 'Thank you for your interest! We\'ll keep you updated on our progress and let you know when we launch.',
        colors: {
          primary: '#0ea5e9',
          secondary: '#0284c7',
          background: '#f0f9ff',
          text: '#0c4a6e',
        },
        logoUrl: '',
        heroImageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80',
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Sample campaign created successfully',
      data: sampleCampaign,
    });
  } catch (error) {
    console.error('Error creating sample campaign:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while creating the sample campaign',
    });
  }
} 