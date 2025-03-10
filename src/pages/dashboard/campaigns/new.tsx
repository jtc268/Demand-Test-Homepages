import React from 'react';
import Head from 'next/head';
import CampaignForm from '@/components/CampaignForm';

export default function NewCampaign() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Create New Campaign | Demand Testing Platform</title>
      </Head>

      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <h1 className="text-2xl font-bold text-gray-900">Create New Campaign</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <CampaignForm />
      </main>
    </div>
  );
} 