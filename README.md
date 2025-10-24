# Browser Tool Finder

A premium quiz application that helps startup teams find the perfect browser tools. Built with vanilla JavaScript and deployed on Vercel with Stripe integration for payments.

## Features

- 🔐 Google OAuth authentication
- 📊 Interactive quiz system
- 💳 Stripe payment integration
- 💾 PostgreSQL database (Neon)
- ⚡ Serverless functions via Vercel
- 🎨 Beautiful, responsive UI
- 🎓 Interactive welcome tutorial for premium users
- 🎁 Promo code support (FREEMONTH for 100% off first month)
- 🤖 AI-powered code reviews with CodeRabbit

## Tech Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Authentication**: Google OAuth 2.0
- **Payments**: Stripe Checkout & Webhooks
- **Database**: Neon PostgreSQL (serverless)
- **Hosting**: Vercel (serverless functions)
- **AI Code Review**: CodeRabbit

## Quick Start
- **Authentication**: Google OAuth
- **Payments**: Stripe
- **Hosting**: Vercel

## Project Structure

```
browser-tool-finder/
├── index.html              # Main HTML file
├── app.js                  # Frontend JavaScript
├── success.html            # Payment success page
├── api/
│   ├── user-data.js           # Load user from database
│   ├── save-user-data.js      # Save to database
│   ├── create-checkout.js     # Handle Stripe payments
│   └── stripe-webhook.js      # Stripe webhook handler
├── package.json            # Dependencies
├── vercel.json            # Vercel configuration
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## Setup Instructions

### 1. Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Vercel account (or Netlify - see compatibility note below)
- Neon (PostgreSQL) account
- Stripe account
- Google Cloud Console project

### 2. Database Setup (Neon)

1. Create a Neon account at https://neon.tech
2. Create a new project
3. Run this SQL to create the users table:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  subscription VARCHAR(50) DEFAULT 'free',
  saved_results JSONB DEFAULT '[]'::jsonb,
  quizzes_taken INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

4. Copy your connection string

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google Sign-In API
4. Create OAuth 2.0 credentials
5. Add authorized JavaScript origins (your Vercel domain)
6. Update the `data-client_id` in `index.html`

**Quick Guide**: See `setup-google-oauth-guide.html` for step-by-step interactive instructions.

### 4. Stripe Setup

1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Dashboard
3. Create a subscription product and price
4. Copy the price ID
5. (Optional) Create promo codes in Stripe Dashboard

**Webhook Setup** (for automatic premium activation):
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.vercel.app/api/stripe-webhook`
3. Select events: `checkout.session.completed`, `customer.subscription.deleted`
4. Copy the webhook signing secret and add as `STRIPE_WEBHOOK_SECRET` env var

### 5. Local Development

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Fill in your environment variables in `.env`:
   ```
   DATABASE_URL=your_neon_connection_string
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

5. Update `app.js` with your Stripe publishable key

6. Run locally:
   ```bash
   npm run dev
   # or for Vercel:
   vercel dev
   ```

7. Open http://localhost:3000 (Vercel) or http://localhost:8888 (Netlify)

### 6. Deploy to Vercel (Recommended)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Set environment variables:
   ```bash
   vercel env add DATABASE_URL
   vercel env add STRIPE_SECRET_KEY
   vercel env add STRIPE_PRICE_ID
   vercel env add STRIPE_WEBHOOK_SECRET
   vercel env add URL
   ```

4. Deploy to production:
   ```bash
   vercel --prod
   ```

### Alternative: Deploy to Netlify

**Note**: This project is 95% compatible with Netlify. To deploy on Netlify:

1. Convert serverless functions from Vercel to Netlify format:
   - Change `module.exports = async (req, res) => {}` to `exports.handler = async (event, context) => {}`
   - Change `req.body` to `JSON.parse(event.body)`
   - Change `res.status(200).json({})` to `return {statusCode: 200, body: JSON.stringify({})}`
   - Move files from `api/` to `netlify/functions/`

2. Connect your repository to Netlify:
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Select your repository

3. Set environment variables in Netlify:
   - Go to Site settings → Environment variables
   - Add:
     - `DATABASE_URL`
     - `STRIPE_SECRET_KEY`
     - `STRIPE_PRICE_ID`
     - `STRIPE_WEBHOOK_SECRET`
     - `URL`

4. Deploy!

**Warning**: Netlify free tier has 300 build minutes/month limit.

### 7. Post-Deployment

1. Update Google OAuth authorized origins with your Vercel/Netlify domain
2. Configure Stripe webhook endpoint with your domain
3. Test the entire flow:
   - Sign in with Google
   - Take a quiz
   - Upgrade to premium (Stripe checkout)
   - Verify premium badge appears after payment
   - Test welcome tutorial
   - Try promo code: FREEMONTH

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Neon PostgreSQL connection string | `postgresql://user:pass@host/db` |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_test_...` |
| `STRIPE_PRICE_ID` | Stripe subscription price ID | `price_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | `whsec_...` |
| `URL` | Site URL | `https://yoursite.vercel.app` |

## API Endpoints

### POST /api/user-data
Load user data from database
```json
{
  "email": "user@example.com"
}
```

### POST /api/save-user-data
Save user data to database
```json
{
  "email": "user@example.com",
  "subscription": "premium",
  "savedResults": [...],
  "quizzesTaken": 5
}
```

### POST /api/create-checkout
Create Stripe checkout session
```json
{
  "email": "user@example.com"
}
```

### POST /api/stripe-webhook
Stripe webhook handler (called by Stripe, not directly)
- Handles `checkout.session.completed` - upgrades user to premium
- Handles `customer.subscription.deleted` - downgrades to free

## Troubleshooting

### Database Connection Issues
- Verify your DATABASE_URL is correct
- Check Neon dashboard for connection limits
- Ensure SSL is enabled

### Stripe Integration Issues
- Verify API keys are correct (test vs production)
- Check Stripe dashboard for webhook events
- Ensure price ID is correct

### Google OAuth Issues
- Verify client ID in HTML matches Google Console
- Check authorized origins include your domain
- Clear browser cache and cookies

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT

## Support

For issues and questions, please open a GitHub issue or contact support.
