module.exports = async (req, res) => {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Debug: Log environment variables
  console.log('STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY);
  console.log('STRIPE_SECRET_KEY first 10 chars:', JSON.stringify(process.env.STRIPE_SECRET_KEY?.substring(0, 10)));
  console.log('STRIPE_SECRET_KEY length:', process.env.STRIPE_SECRET_KEY?.length);
  console.log('STRIPE_PRICE_ID:', process.env.STRIPE_PRICE_ID);
  
  const { email } = req.body;
  const priceId = process.env.STRIPE_PRICE_ID;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  if (!priceId) {
    return res.status(400).json({ error: 'STRIPE_PRICE_ID not configured. Please set environment variables in Vercel.' });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'STRIPE_SECRET_KEY not configured. Please set environment variables in Vercel.' });
  }

  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY.trim());

  try {
    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      automatic_tax: { enabled: true },
      allow_promotion_codes: true, // Enable promo code input
      success_url: `${process.env.URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.URL}/`,
      metadata: {
        customer_email: email,
      },
    });

    return res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe error:', error);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
};
