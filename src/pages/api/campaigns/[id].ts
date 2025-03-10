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
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const campaign = await Campaign.findById(id);
        
        if (!campaign) {
          return res.status(404).json({ success: false, message: 'Campaign not found' });
        }
        
        res.status(200).json({ success: true, data: campaign });
      } catch (error) {
        console.error('Error fetching campaign:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch campaign' });
      }
      break;

    case 'PUT':
      try {
        const { name, slug, description, active, template, config } = req.body;

        // Check if slug already exists and belongs to a different campaign
        const existingCampaign = await Campaign.findOne({ slug, _id: { $ne: id } });
        if (existingCampaign) {
          return res.status(400).json({
            success: false,
            message: 'A campaign with this slug already exists',
          });
        }

        // Update campaign
        const updatedCampaign = await Campaign.findByIdAndUpdate(
          id,
          {
            name,
            slug,
            description,
            active,
            template,
            config,
          },
          { new: true, runValidators: true }
        );

        if (!updatedCampaign) {
          return res.status(404).json({ success: false, message: 'Campaign not found' });
        }

        res.status(200).json({
          success: true,
          message: 'Campaign updated successfully',
          data: updatedCampaign,
        });
      } catch (error) {
        console.error('Error updating campaign:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to update campaign',
        });
      }
      break;

    case 'DELETE':
      try {
        const deletedCampaign = await Campaign.findByIdAndDelete(id);
        
        if (!deletedCampaign) {
          return res.status(404).json({ success: false, message: 'Campaign not found' });
        }
        
        res.status(200).json({
          success: true,
          message: 'Campaign deleted successfully',
        });
      } catch (error) {
        console.error('Error deleting campaign:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to delete campaign',
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).json({ success: false, message: `Method ${method} Not Allowed` });
  }
} 