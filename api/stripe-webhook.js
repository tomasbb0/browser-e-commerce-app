const { Pool } = require('pg');

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
