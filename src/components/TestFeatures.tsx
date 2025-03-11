import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const PRICE_OPTIONS = [
  { 
    id: 'price_1R1Z9ZFzAAOxCQiQevVmlvel',
    name: 'Basic', 
    price: '$9.99/mo', 
    description: 'Essential browser tools for testing',
    url: 'https://buy.stripe.com/7sIeVs8NldIEfIY3cg'
  },
  { 
    id: 'price_1R1Z9dFzAAOxCQiQY9rw0ZvM',
    name: 'Pro', 
    price: '$19.99/mo', 
    description: 'Advanced features and priority support',
    url: 'https://buy.stripe.com/9AQ7t05B96gcfIY149'
  },
  { 
    id: 'price_1R1Z9iFzAAOxCQiQCcgDgODk',
    name: 'Enterprise', 
    price: '$49.99/mo', 
    description: 'Full access with custom integrations',
    url: 'https://buy.stripe.com/3cseVsaVt340cwM6ou'
  },
];

export default function TestFeatures() {
  const [email, setEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  const handlePayment = async (priceId: string) => {
    try {
      setPaymentStatus('loading');
      const stripe = await stripePromise;
      
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      const { sessionId } = await response.json();
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('error');
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setEmailStatus('loading');
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to send email');
      }

      setEmailStatus('success');
      setEmail('');
    } catch (error) {
      console.error('Email error:', error);
      setEmailStatus('error');
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 mb-16">
      {/* Stripe Payment Options */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Test Stripe Integration</h2>
        <div className="space-y-4">
          {PRICE_OPTIONS.map((option) => (
            <div key={option.id} className="border rounded-lg p-4 hover:border-primary-500 transition-colors">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-lg">{option.name}</h3>
                <span className="text-lg font-semibold text-primary-600">{option.price}</span>
              </div>
              <p className="text-gray-600 mb-4">{option.description}</p>
              <a
                href={option.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full btn btn-primary block text-center"
              >
                Select {option.name}
              </a>
            </div>
          ))}
          {paymentStatus === 'error' && (
            <p className="text-red-500 text-sm mt-2">Error processing payment. Please try again.</p>
          )}
        </div>
      </div>

      {/* SendGrid Email Form */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Test SendGrid Integration</h2>
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={emailStatus === 'loading'}
            className="w-full btn btn-primary"
          >
            {emailStatus === 'loading' ? 'Sending...' : 'Send Test Email'}
          </button>
          {emailStatus === 'success' && (
            <p className="text-green-500 text-sm">Email sent successfully!</p>
          )}
          {emailStatus === 'error' && (
            <p className="text-red-500 text-sm">Error sending email. Please try again.</p>
          )}
        </form>

        <div className="mt-8 pt-8 border-t">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Direct SendGrid Test</h3>
          <form onSubmit={async (e) => {
            e.preventDefault();
            try {
              setEmailStatus('loading');
              const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                  email: 'adorepayments@gmail.com',
                  subject: 'Direct SendGrid Test',
                  text: 'This is a direct test of the SendGrid integration.',
                }),
              });

              const data = await response.json();
              console.log('SendGrid Response:', data);
              
              if (!data.success) {
                throw new Error(data.message || 'Failed to send email');
              }

              setEmailStatus('success');
            } catch (error) {
              console.error('Direct SendGrid error:', error);
              setEmailStatus('error');
            }
          }} className="space-y-4">
            <button
              type="submit"
              disabled={emailStatus === 'loading'}
              className="w-full btn btn-secondary"
            >
              Send Direct Test to adorepayments@gmail.com
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 