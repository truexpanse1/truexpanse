// src/services/billingService.ts
// Helper function to start Stripe Checkout from the frontend

export async function startStripeCheckout(priceId: string, email: string) {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ priceId, email }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Checkout error:', errorText);
      throw new Error('Failed to start checkout');
    }

    const data = await response.json();

    if (!data.url) {
      throw new Error('No checkout URL returned from server');
    }

    // Redirect user to Stripe Checkout
    window.location.href = data.url;

  } catch (err) {
    console.error('Stripe Checkout error:', err);
    throw err;
  }
}
