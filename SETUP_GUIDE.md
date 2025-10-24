# Quick Setup Guide for Browser Tool Finder

> 🚀 **Currently deployed on Vercel** - This guide shows you how to deploy your own instance!

## 📋 Prerequisites

Before you begin, make sure you have:
- A [Vercel account](https://vercel.com) (recommended) or [Netlify account](https://netlify.com)
- A [Stripe account](https://stripe.com) (test mode is fine)
- A [Neon PostgreSQL database](https://neon.tech)
- A [Google Cloud account](https://console.cloud.google.com) for OAuth

## Recommended: Deploy with Vercel

### Option 1: Using Vercel CLI (Easiest)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login and deploy:
```bash
vercel login
vercel
```

3. Add environment variables interactively:
```bash
vercel env add STRIPE_SECRET_KEY
# Paste your Stripe secret key (sk_test_...)

vercel env add STRIPE_PRICE_ID
# Paste your Stripe price ID (price_...)

vercel env add DATABASE_URL
# Paste your Neon PostgreSQL connection string

vercel env add STRIPE_WEBHOOK_SECRET
# Paste your Stripe webhook secret (whsec_...)

vercel env add URL
# Type your Vercel deployment URL
```

4. Deploy to production:
```bash
vercel --prod
```

### Option 2: Via Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable:
   - `STRIPE_SECRET_KEY` = `sk_test_YOUR_KEY`
   - `STRIPE_PRICE_ID` = `price_YOUR_PRICE_ID`
   - `DATABASE_URL` = `postgresql://YOUR_CONNECTION_STRING`
   - `STRIPE_WEBHOOK_SECRET` = `whsec_YOUR_WEBHOOK_SECRET`
   - `URL` = `https://your-project.vercel.app`
5. Redeploy from dashboard

## Alternative: Deploy with Netlify

**Note**: Project is currently in Vercel format. To use Netlify, you need to convert the serverless functions:

1. Move files from `api/` to `netlify/functions/`
2. Update function format in each file:
   - Change `module.exports = async (req, res)` to `exports.handler = async (event, context)`
   - Change `req.body` to `JSON.parse(event.body)`
   - Change `req.method` to `event.httpMethod`
   - Change `res.status(200).json({})` to `return {statusCode: 200, body: JSON.stringify({})}`

3. Then use Netlify CLI:
```bash
npx netlify env:set STRIPE_SECRET_KEY "sk_test_YOUR_ACTUAL_KEY_HERE"
npx netlify env:set STRIPE_PRICE_ID "price_YOUR_ACTUAL_PRICE_ID_HERE"
npx netlify env:set DATABASE_URL "postgresql://YOUR_CONNECTION_STRING_HERE"
npx netlify env:set STRIPE_WEBHOOK_SECRET "whsec_YOUR_SECRET_HERE"
npx netlify env:set URL "https://your-site.netlify.app"
npx netlify deploy --prod
```

**Warning**: Netlify free tier has 300 build minutes/month limit.

## Where to get your credentials:

### Stripe Credentials:
1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy your **Secret key** (starts with `sk_test_`)
3. Go to https://dashboard.stripe.com/test/products
4. Create a subscription product or use existing one
5. Copy the **Price ID** (starts with `price_`)

### Stripe Webhook Secret:
1. Go to https://dashboard.stripe.com/test/webhooks
2. Click "Add endpoint"
3. URL: `https://your-domain.vercel.app/api/stripe-webhook` (or `.netlify.app` for Netlify)
4. Select events: `checkout.session.completed`, `customer.subscription.deleted`
5. Click "Add endpoint"
6. Click to reveal the **Signing secret** (starts with `whsec_`)

### Database:
1. Go to https://console.neon.tech
2. Select your project
3. Copy the **Connection string** (use pooled connection)

## After setting variables:
- **Vercel**: Automatically redeploys
- **Netlify**: Run `npx netlify deploy --prod`

## Check your current env vars:
- **Vercel**: `vercel env ls`
- **Netlify**: `npx netlify env:list`

## Testing Your Setup:

1. Visit your deployed site
2. Sign in with Google
3. Click "Upgrade to Premium"
4. Complete checkout with test card: `4242 4242 4242 4242`
5. After payment, you should:
   - See success page
   - Get redirected with welcome tutorial
   - See "⭐ Premium" badge
6. Try promo code `FREEMONTH` for 100% off first month!
