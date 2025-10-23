# Quick Setup Guide for Netlify Environment Variables

## You have 2 options:

### Option 1: Interactive Script (Easiest)
Run this command and follow the prompts:
```bash
./setup-netlify-env.sh
```

### Option 2: Manual Commands
Replace the placeholder values with your actual credentials and run:

```bash
# Set the site URL
npx netlify env:set URL "https://elaborate-queijadas-7f9028.netlify.app"

# Set your Stripe secret key (get from https://dashboard.stripe.com/test/apikeys)
npx netlify env:set STRIPE_SECRET_KEY "sk_test_YOUR_ACTUAL_KEY_HERE"

# Set your Stripe price ID (get from https://dashboard.stripe.com/test/products)
npx netlify env:set STRIPE_PRICE_ID "price_YOUR_ACTUAL_PRICE_ID_HERE"

# Set your database URL (optional - get from https://console.neon.tech)
npx netlify env:set DATABASE_URL "postgresql://YOUR_CONNECTION_STRING_HERE"

# Redeploy the site
npx netlify deploy --prod
```

## Where to get your credentials:

### Stripe Credentials:
1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy your **Secret key** (starts with `sk_test_`)
3. Go to https://dashboard.stripe.com/test/products
4. Create a subscription product or use existing one
5. Copy the **Price ID** (starts with `price_`)

### Database (Optional):
1. Go to https://console.neon.tech
2. Select your project
3. Copy the connection string

## After setting variables:
The site will automatically redeploy and your upgrade button will work!

## Check your current env vars:
```bash
npx netlify env:list
```
