# Deployment Guide

This project is currently optimized for **Vercel** but is 95% compatible with **Netlify**.

## Current Status: ✅ Deployed on Vercel

**Live URL**: https://browser-e-commerce-app.vercel.app

### Why Vercel?
- ✅ Unlimited deployments (no build minute limits)
- ✅ Faster cold starts for serverless functions
- ✅ Automatic HTTPS and CDN
- ✅ Better free tier for this use case

## Quick Deploy to Vercel

### Prerequisites
- GitHub account
- Vercel account (free): https://vercel.com/signup
- Stripe account: https://stripe.com
- Neon PostgreSQL account: https://neon.tech

### Steps

1. **Fork or clone this repository**

2. **Install Vercel CLI** (optional, for local development):
   ```bash
   npm install -g vercel
   ```

3. **Deploy via Vercel Dashboard**:
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Click "Deploy"

4. **Set Environment Variables**:
   
   Go to Project Settings → Environment Variables and add:

   | Variable | Where to get it | Example |
   |----------|----------------|---------|
   | `STRIPE_SECRET_KEY` | [Stripe Dashboard → API Keys](https://dashboard.stripe.com/test/apikeys) | `sk_test_...` |
   | `STRIPE_PRICE_ID` | [Stripe Dashboard → Products](https://dashboard.stripe.com/test/products) | `price_...` |
   | `STRIPE_WEBHOOK_SECRET` | [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/test/webhooks) (create endpoint first) | `whsec_...` |
   | `DATABASE_URL` | [Neon Console](https://console.neon.tech) → Connection Details (pooled) | `postgresql://...` |
   | `URL` | Your Vercel deployment URL | `https://your-app.vercel.app` |

5. **Configure Stripe Webhook**:
   - Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/test/webhooks)
   - Click "Add endpoint"
   - Endpoint URL: `https://your-app.vercel.app/api/stripe-webhook`
   - Select events: `checkout.session.completed`, `customer.subscription.deleted`
   - Copy the signing secret and add it as `STRIPE_WEBHOOK_SECRET` in Vercel

6. **Configure Google OAuth**:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Navigate to your OAuth 2.0 Client
   - Add your Vercel URL to Authorized JavaScript origins
   - Update `data-client_id` in `index.html` if needed

7. **Redeploy** (if you added env vars after first deployment):
   ```bash
   vercel --prod
   # or redeploy from Vercel dashboard
   ```

## Deploy to Netlify (Alternative)

### Why you might choose Netlify:
- You prefer the Netlify dashboard/UX
- You have existing Netlify projects
- You want to use Netlify's other features (Forms, Identity, etc.)

### What needs to change:

Since this project is in Vercel format, you'll need to convert the serverless functions:

#### 1. Convert API Functions

For each file in `api/`:

**Before (Vercel format)**:
```javascript
const { Pool } = require('pg');

module.exports = async (req, res) => {
  const data = req.body;
  
  // ... your code ...
  
  return res.status(200).json({ success: true });
};
```

**After (Netlify format)**:
```javascript
const { Client } = require('pg');

exports.handler = async (event, context) => {
  const data = JSON.parse(event.body);
  
  // ... your code (updated) ...
  
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: true })
  };
};
```

#### 2. Move Files

```bash
mkdir -p netlify/functions
mv api/* netlify/functions/
```

#### 3. Update Function Calls in app.js

Change:
- `/api/user-data` → `/.netlify/functions/user-data`
- `/api/save-user-data` → `/.netlify/functions/save-user-data`
- `/api/create-checkout` → `/.netlify/functions/create-checkout`

#### 4. Update vercel.json → netlify.toml

The `netlify.toml` file is already included. Make sure it has:

```toml
[build]
  command = "npm install"
  publish = "."

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

#### 5. Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Link to site or create new
netlify init

# Set environment variables
netlify env:set STRIPE_SECRET_KEY "sk_test_..."
netlify env:set STRIPE_PRICE_ID "price_..."
netlify env:set STRIPE_WEBHOOK_SECRET "whsec_..."
netlify env:set DATABASE_URL "postgresql://..."
netlify env:set URL "https://your-site.netlify.app"

# Deploy
netlify deploy --prod
```

**⚠️ Warning**: Netlify free tier has 300 build minutes/month. We switched to Vercel because we exceeded this limit.

## Comparison

| Feature | Vercel | Netlify |
|---------|--------|---------|
| Build Minutes | Unlimited | 300/month (free tier) |
| Bandwidth | 100GB/month | 100GB/month |
| Serverless Functions | Yes | Yes |
| Function Timeout | 10s (free) | 10s (free) |
| Easy Rollbacks | Yes | Yes |
| Current Format | ✅ Native | ❌ Needs conversion |
| Deployment Status | ✅ Currently deployed | ❌ Ran out of builds |

## Recommendation

**Stick with Vercel** unless you have a specific reason to use Netlify. The project is already set up and working perfectly on Vercel.

## Troubleshooting

### Vercel Deployment Issues

**Functions not working**:
- Check function logs: `vercel logs [deployment-url]`
- Verify all environment variables are set
- Ensure DATABASE_URL uses pooled connection string

**Stripe checkout fails**:
- Verify `STRIPE_SECRET_KEY` and `STRIPE_PRICE_ID` are correct
- Check Stripe dashboard for error logs
- Ensure you're using test mode keys for testing

**Database connection fails**:
- Use pooled connection string from Neon (not direct)
- Ensure `?sslmode=require` is in connection string
- Check Neon dashboard for connection limits

### Netlify Deployment Issues (if you convert)

**Functions not found**:
- Ensure functions are in `netlify/functions/` directory
- Check `netlify.toml` configuration
- Verify function names match what app.js is calling

**Build minutes exhausted**:
- Upgrade to paid plan
- Switch to Vercel (unlimited builds)
- Reduce deployment frequency

## Local Development

### With Vercel:
```bash
vercel dev
# Runs on http://localhost:3000
```

### With Netlify:
```bash
netlify dev
# Runs on http://localhost:8888
```

## Need Help?

1. Check the [README.md](./README.md) for setup instructions
2. See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for environment variable setup
3. Review [setup-google-oauth-guide.html](./setup-google-oauth-guide.html) for OAuth setup
4. Check Vercel/Netlify function logs for errors
5. Review Stripe dashboard for payment issues
