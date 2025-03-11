import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Success() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <Head>
        <title>Payment Successful - Demand Testing Platform</title>
      </Head>

      <main className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-16">
          <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Thank you for your purchase. You will receive a confirmation email shortly.
          </p>
          <Link href="/" className="btn btn-primary px-8 py-3">
            Return to Home
          </Link>
        </div>
      </main>
    </div>
  );
} 