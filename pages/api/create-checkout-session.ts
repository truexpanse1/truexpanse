// pages/api/create-checkout-session.ts
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { priceId, email } = req.body;

    // Force email from frontend (we’ll collect it in PricingCard)
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    if (!priceId) {
      return res.status(400).json({ error: 'Price ID is required' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: email,                                   // Pre-fill email
      subscription_data: {
        trial_period_days: 7,                                  // 7-day free trial
        trial_settings: {
          end_behavior: { missing_payment_method: 'cancel' }, // Cancel if no card
        },
      },
      success_url: `${req.headers.origin}/trial-success`,     // We’ll create this page
      cancel_url: `${req.headers.origin}/#pricing`,
      metadata: {
        note: '7-day card-upfront trial',
      },
    });

    res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe session error:', err);
    res.status(500).json({ error: err.message });
  }
}
