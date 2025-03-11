import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY is not set in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

const PRICES = {
  basic: process.env.STRIPE_PRICE_BASIC!,
  pro: process.env.STRIPE_PRICE_PRO!,
  enterprise: process.env.STRIPE_PRICE_ENTERPRISE!,
};

// Log available price IDs
console.log('Available Stripe price IDs:', PRICES);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { priceId } = req.body;
    console.log('Received price ID:', priceId);

    if (!priceId || !Object.values(PRICES).includes(priceId)) {
      console.error('Invalid price ID received:', priceId);
      console.log('Available price IDs:', Object.values(PRICES));
      return res.status(400).json({ 
        message: 'Invalid price ID',
        availablePrices: Object.values(PRICES),
        receivedPrice: priceId
      });
    }

    console.log('Creating checkout session with price:', priceId);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/`,
    });

    console.log('Checkout session created:', session.id);
    res.status(200).json({ sessionId: session.id });
  } catch (error: any) {
    console.error('Detailed error creating checkout session:', {
      error: error.message,
      type: error.type,
      code: error.code,
      param: error.param,
      raw: error.raw,
    });
    res.status(500).json({ 
      message: 'Error creating checkout session',
      error: error.message,
      code: error.code,
      type: error.type
    });
  }
} 