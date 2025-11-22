// pages/api/create-checkout-session.ts   ← overwrite the whole file with this
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

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

    // ← THESE TWO LINES ARE CRITICAL – block anyone without email/price
    if (!email) return res.status(400).json({ error: 'Email is required' });
    if (!priceId) return res.status(400).json({ error: 'Price ID is required' });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email,
      subscription_data: {
        trial_period_days: 7,                                 // ← 7-day free trial
        trial_settings: { end_behavior: { missing_payment_method: 'cancel' } },
      },
      success_url: `${req.headers.origin}/trial-success`,     // ← new page (create next)
      cancel_url: `${req.headers.origin}/#pricing`,
      metadata: { note: '7-day card-upfront trial' },
    });

    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe error:', err);
    return res.status(500).json({ error: err.message });
  }
}
