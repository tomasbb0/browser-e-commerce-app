/**
 * API endpoint to create a Stripe Checkout session for premium subscription
 * 
 * @description Creates a Stripe Checkout session that allows users to upgrade to premium.
 * Handles promo code application and redirects to Stripe's hosted checkout page.
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.email - User's email address (required)
 * @param {Object} res - Express response object
 * 
 * @returns {Object} JSON response containing:
 *   - sessionId {string} - Stripe Checkout session ID for redirect
 * 
 * @throws {400} If email is missing
 * @throws {500} If Stripe configuration is invalid
 * 
 * @example
 * // Request
 * POST /api/create-checkout
 * { "email": "user@example.com" }
 * 
 * // Response
 * { "sessionId": "cs_test_..." }
 * 
 * @see {@link https://stripe.com/docs/api/checkout/sessions|Stripe Checkout Sessions}
 */
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

  // Clean the key more aggressively
  const cleanKey = process.env.STRIPE_SECRET_KEY
    .trim()
    .replace(/[\r\n\t\x00-\x1F\x7F]/g, ''); // Remove all control characters
  
  console.log('Cleaned key length:', cleanKey.length);
  console.log('Cleaned key first 20:', cleanKey.substring(0, 20));
  console.log('Key hex dump:', Buffer.from(cleanKey).toString('hex').substring(0, 100));

  // Try initializing Stripe with explicit config to avoid header issues
  console.log('[STEP 1] About to require stripe package...');
  const Stripe = require('stripe');
  console.log('[STEP 2] Stripe package loaded successfully');
  
  console.log('[STEP 3] Initializing Stripe with cleaned key...');
  const stripe = new Stripe(cleanKey, {
    apiVersion: '2023-10-16',
    maxNetworkRetries: 0, // Disable retries to see the error immediately
  });
  console.log('[STEP 4] Stripe initialized successfully');

  try {
    const successUrl = `${process.env.URL}/success.html?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${process.env.URL}/`;
    
    console.log('[STEP 5] Creating checkout session with params:', {
      email,
      priceId,
      url: process.env.URL,
      successUrl,
      cancelUrl
    });
    
    console.log('[DEBUG] Full success URL:', successUrl);
    console.log('[DEBUG] Full cancel URL:', cancelUrl);
    
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
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        customer_email: email,
      },
    });

    console.log('[STEP 6] Checkout session created successfully! Session ID:', session.id);
    return res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('[ERROR] Stripe error occurred at step:', error.message);
    console.error('[ERROR] Full error:', error);
    console.error('[ERROR] Error type:', error.type);
    console.error('[ERROR] Error code:', error.code);
    console.error('[ERROR] Stack:', error.stack);
    
    // Send detailed error back to browser for debugging
    return res.status(500).json({ 
      error: 'Failed to create checkout session',
      message: error.message,
      type: error.type,
      code: error.code,
      detail: error.detail?.message || 'No additional details'
    });
  }
};
