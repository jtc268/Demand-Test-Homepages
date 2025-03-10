import React from 'react';
import { GetServerSideProps } from 'next';
import dbConnect from '@/utils/database';
import Campaign from '@/utils/models/Campaign';
import ModernTemplate from '@/components/templates/ModernTemplate';
import { ICampaignData } from '@/types';

interface CampaignPageProps {
  campaign: ICampaignData | null;
  error?: string;
}

export default function CampaignPage({ campaign, error }: CampaignPageProps) {
  if (error || !campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Campaign Not Found</h1>
          <p className="text-gray-600 mb-6">
            {error || 'The campaign you are looking for does not exist or has been removed.'}
          </p>
          <a
            href="/"
            className="block w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  return <ModernTemplate campaign={campaign} />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params || {};

  if (!slug || typeof slug !== 'string') {
    return {
      props: {
        campaign: null,
        error: 'Invalid campaign URL',
      },
    };
  }

  try {
    await dbConnect();

    const campaign = await Campaign.findOne({ slug, active: true });

    if (!campaign) {
      return {
        props: {
          campaign: null,
          error: 'Campaign not found',
        },
      };
    }

    // Convert MongoDB document to plain object and handle _id
    const campaignObj = JSON.parse(JSON.stringify(campaign));
    
    return {
      props: {
        campaign: {
          id: campaignObj._id,
          name: campaignObj.name,
          slug: campaignObj.slug,
          description: campaignObj.description,
          active: campaignObj.active,
          template: campaignObj.template,
          config: campaignObj.config,
          createdAt: campaignObj.createdAt,
        },
      },
    };
  } catch (error) {
    console.error('Error fetching campaign:', error);
    
    return {
      props: {
        campaign: null,
        error: 'Failed to load campaign',
      },
    };
  }
}; 