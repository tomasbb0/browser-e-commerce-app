const { Pool } = require('pg');

/**
 * Stripe webhook handler for payment events
 * 
 * @description Handles Stripe webhook events for subscription lifecycle management.
 * Automatically upgrades users to premium on successful payment and downgrades on cancellation.
 * Uses webhook signatures for security verification.
 * 
 * @param {Object} req - Express request object
 * @param {string} req.headers['stripe-signature'] - Stripe signature for verification
 * @param {Object} req.body - Raw webhook payload from Stripe
 * @param {Object} res - Express response object
 * 
 * @returns {Object} JSON response confirming webhook receipt
 * 
 * @fires checkout.session.completed - Upgrades user to premium
 * @fires customer.subscription.deleted - Downgrades user to free
 * 
 * @throws {400} If webhook signature verification fails
 * @throws {500} If database update fails
 * 
 * @example
 * // Stripe sends this automatically when events occur
 * POST /api/stripe-webhook
 * Headers: { 'stripe-signature': 't=...,v1=...' }
 * Body: { type: 'checkout.session.completed', data: {...} }
 * 
 * @see {@link https://stripe.com/docs/webhooks|Stripe Webhooks Documentation}
 */
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    const sig = req.headers['stripe-signature'];
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('Webhook event received:', event.type);

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Checkout session completed:', session.id);
      console.log('Customer email:', session.customer_email);

      // Update user to premium in database
      try {
        const pool = new Pool({
          connectionString: process.env.DATABASE_URL,
          ssl: { rejectUnauthorized: false }
        });

        const result = await pool.query(
          `INSERT INTO users (email, subscription, updated_at)
           VALUES ($1, 'premium', NOW())
           ON CONFLICT (email)
           DO UPDATE SET subscription = 'premium', updated_at = NOW()
           RETURNING *`,
          [session.customer_email]
        );

        console.log('User upgraded to premium:', result.rows[0]);
        await pool.end();
      } catch (dbError) {
        console.error('Database error:', dbError);
      }
      break;

    case 'customer.subscription.deleted':
      const subscription = event.data.object;
      console.log('Subscription cancelled:', subscription.id);
      
      // Downgrade user to free
      try {
        const pool = new Pool({
          connectionString: process.env.DATABASE_URL,
          ssl: { rejectUnauthorized: false }
        });

        const customerEmail = subscription.metadata?.customer_email;
        if (customerEmail) {
          await pool.query(
            `UPDATE users SET subscription = 'free', updated_at = NOW() WHERE email = $1`,
            [customerEmail]
          );
          console.log('User downgraded to free:', customerEmail);
        }
        await pool.end();
      } catch (dbError) {
        console.error('Database error:', dbError);
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};
