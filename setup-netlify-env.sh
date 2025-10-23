#!/bin/bash

# Interactive setup script for Netlify environment variables

echo "🔧 Netlify Environment Variables Setup"
echo "======================================"
echo ""

# Check if netlify is linked
if [ ! -d .netlify ]; then
    echo "❌ Error: Not linked to a Netlify site."
    echo "Run: npx netlify link"
    exit 1
fi

echo "📝 This script will help you set up environment variables for your Netlify site."
echo ""

# Set URL (we know this one)
echo "✅ Setting URL to: https://elaborate-queijadas-7f9028.netlify.app"
npx netlify env:set URL "https://elaborate-queijadas-7f9028.netlify.app" --silent

# Prompt for Stripe Secret Key
echo ""
echo "🔑 Enter your Stripe Secret Key (starts with sk_test_ or sk_live_):"
echo "   Get it from: https://dashboard.stripe.com/test/apikeys"
read -p "STRIPE_SECRET_KEY: " stripe_key

if [ ! -z "$stripe_key" ]; then
    npx netlify env:set STRIPE_SECRET_KEY "$stripe_key" --silent
    echo "✅ STRIPE_SECRET_KEY set"
else
    echo "⚠️  Skipped STRIPE_SECRET_KEY"
fi

# Prompt for Stripe Price ID
echo ""
echo "💰 Enter your Stripe Price ID (starts with price_):"
echo "   Get it from: https://dashboard.stripe.com/test/products"
read -p "STRIPE_PRICE_ID: " price_id

if [ ! -z "$price_id" ]; then
    npx netlify env:set STRIPE_PRICE_ID "$price_id" --silent
    echo "✅ STRIPE_PRICE_ID set"
else
    echo "⚠️  Skipped STRIPE_PRICE_ID"
fi

# Prompt for Database URL (optional)
echo ""
echo "🗄️  Enter your Database URL (optional, press Enter to skip):"
echo "   Get it from: https://console.neon.tech"
read -p "DATABASE_URL: " db_url

if [ ! -z "$db_url" ]; then
    npx netlify env:set DATABASE_URL "$db_url" --silent
    echo "✅ DATABASE_URL set"
else
    echo "⚠️  Skipped DATABASE_URL"
fi

echo ""
echo "✨ Environment variables have been set!"
echo ""
echo "🔄 Would you like to trigger a new deployment now? (y/n)"
read -p "> " deploy_now

if [ "$deploy_now" = "y" ] || [ "$deploy_now" = "Y" ]; then
    echo "🚀 Deploying to production..."
    npx netlify deploy --prod --build
    echo ""
    echo "✅ Deployment triggered! Check your Netlify dashboard for status."
else
    echo "ℹ️  You can manually deploy later with: npx netlify deploy --prod"
fi

echo ""
echo "🎉 Setup complete!"
