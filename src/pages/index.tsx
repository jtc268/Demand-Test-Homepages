import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <Head>
        <title>Demand Testing Platform</title>
      </Head>

      <main className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Demand Testing Platform
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Create beautiful landing pages, collect email sign-ups, and validate your business ideas quickly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Landing Pages</h2>
            <p className="text-gray-600 mb-6">
              Quickly create professional landing pages with customizable templates. No coding required.
            </p>
            <Link href="/dashboard" className="btn btn-primary">
              Get Started
            </Link>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Collect Email Sign-ups</h2>
            <p className="text-gray-600 mb-6">
              Gather interest with email sign-up forms. Automatically send confirmation emails.
            </p>
            <Link href="/dashboard" className="btn btn-primary">
              View Dashboard
            </Link>
          </div>
        </div>

        <div className="bg-primary-50 rounded-xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-700 font-bold">1</span>
              </div>
              <h3 className="font-bold mb-2">Create a Campaign</h3>
              <p className="text-gray-600">Set up your landing page with a custom domain, branding, and messaging.</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-700 font-bold">2</span>
              </div>
              <h3 className="font-bold mb-2">Collect Sign-ups</h3>
              <p className="text-gray-600">Drive traffic to your page and collect email sign-ups from interested users.</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-700 font-bold">3</span>
              </div>
              <h3 className="font-bold mb-2">Analyze Results</h3>
              <p className="text-gray-600">Track conversion rates and engagement to validate your business idea.</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link href="/dashboard" className="btn btn-primary px-8 py-3 text-lg">
            Get Started for Free
          </Link>
        </div>
      </main>

      <footer className="bg-gray-50 py-12 mt-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} Demand Testing Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 