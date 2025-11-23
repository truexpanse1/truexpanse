export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export const POST = async (request: Request) => {
  try {
    const { priceId, email } = await request.json();

    if (!priceId || !email) {
      return new NextResponse('Missing priceId or email', { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email,
      subscription_data: {
        trial_period_days: 7,
        trial_settings: {
          end_behavior: { missing_payment_method: 'cancel' },
        },
      },
      success_url: `${new URL(request.url).origin}/trial-success`,
      cancel_url: `${new URL(request.url).origin}/#pricing`,
      metadata: { note: '7-day card-upfront trial' },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return new NextResponse(error.message || 'Internal server error', {
      status: 500,
    });
  }
};
