import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import dbConnect from '@/utils/database';
import Campaign from '@/utils/models/Campaign';
import Subscriber from '@/utils/models/Subscriber';

interface DashboardProps {
  campaigns: Array<{
    id: string;
    name: string;
    slug: string;
    description?: string;
    active: boolean;
    subscriberCount: number;
    createdAt: string;
  }>;
}

export default function Dashboard({ campaigns }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('campaigns');

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Dashboard | Demand Testing Platform</title>
      </Head>

      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <Link href="/dashboard/campaigns/new" className="btn btn-primary">
              Create New Campaign
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('campaigns')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'campaigns'
                    ? 'border-b-2 border-primary-500 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Campaigns
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'analytics'
                    ? 'border-b-2 border-primary-500 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Analytics
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'campaigns' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Your Campaigns</h2>
                
                {campaigns.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">You don't have any campaigns yet.</p>
                    <Link href="/dashboard/campaigns/new" className="btn btn-primary">
                      Create Your First Campaign
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            URL
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Subscribers
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Created
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {campaigns.map((campaign) => (
                          <tr key={campaign.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                              {campaign.description && (
                                <div className="text-sm text-gray-500">{campaign.description}</div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <a
                                href={`/c/${campaign.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary-600 hover:text-primary-900"
                              >
                                /c/{campaign.slug}
                              </a>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                campaign.active
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {campaign.active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {campaign.subscriberCount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(campaign.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Link
                                href={`/dashboard/campaigns/${campaign.id}`}
                                className="text-primary-600 hover:text-primary-900 mr-4"
                              >
                                Edit
                              </Link>
                              <Link
                                href={`/dashboard/campaigns/${campaign.id}/subscribers`}
                                className="text-primary-600 hover:text-primary-900"
                              >
                                Subscribers
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">Analytics dashboard coming soon.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    await dbConnect();

    // Fetch all campaigns
    const campaigns = await Campaign.find({}).sort({ createdAt: -1 });

    // Get subscriber counts for each campaign
    const campaignsWithCounts = await Promise.all(
      campaigns.map(async (campaign) => {
        const subscriberCount = await Subscriber.countDocuments({ campaignId: campaign._id });
        
        // Convert MongoDB document to plain object
        const campaignObj = JSON.parse(JSON.stringify(campaign));
        
        return {
          id: campaignObj._id,
          name: campaignObj.name,
          slug: campaignObj.slug,
          description: campaignObj.description,
          active: campaignObj.active,
          subscriberCount,
          createdAt: campaignObj.createdAt,
        };
      })
    );

    return {
      props: {
        campaigns: campaignsWithCounts,
      },
    };
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    
    return {
      props: {
        campaigns: [],
      },
    };
  }
}; 