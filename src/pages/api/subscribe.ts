import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/database';
import Subscriber from '@/utils/models/Subscriber';
import Campaign from '@/utils/models/Campaign';
import { sendConfirmationEmail } from '@/utils/sendgrid';

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

    const { email, name, campaignId } = req.body;

    // Validate required fields
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    if (!campaignId) {
      return res.status(400).json({ success: false, message: 'Campaign ID is required' });
    }

    // Check if campaign exists
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    // Check if subscriber already exists for this campaign
    const existingSubscriber = await Subscriber.findOne({ email, campaignId });
    if (existingSubscriber) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already signed up for this campaign' 
      });
    }

    // Create new subscriber
    const subscriber = await Subscriber.create({
      email,
      name: name || '',
      campaignId,
    });

    // Send confirmation email
    try {
      await sendConfirmationEmail(email, name, campaign.name);
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // We don't want to fail the subscription if email fails
      // Just log the error and continue
    }

    return res.status(201).json({
      success: true,
      message: 'Subscription successful',
      data: { id: subscriber._id },
    });
  } catch (error) {
    console.error('Subscription error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request',
    });
  }
} 