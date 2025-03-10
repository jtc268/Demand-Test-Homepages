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
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const campaigns = await Campaign.find({}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: campaigns });
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch campaigns' });
      }
      break;

    case 'POST':
      try {
        const { name, slug, description, active, template, config } = req.body;

        // Check if slug already exists
        const existingCampaign = await Campaign.findOne({ slug });
        if (existingCampaign) {
          return res.status(400).json({
            success: false,
            message: 'A campaign with this slug already exists',
          });
        }

        // Create new campaign
        const campaign = await Campaign.create({
          name,
          slug,
          description,
          active,
          template,
          config,
        });

        res.status(201).json({
          success: true,
          message: 'Campaign created successfully',
          data: campaign,
        });
      } catch (error) {
        console.error('Error creating campaign:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to create campaign',
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({ success: false, message: `Method ${method} Not Allowed` });
  }
} 