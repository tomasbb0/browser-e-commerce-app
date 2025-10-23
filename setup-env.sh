#!/bin/bash

# Setup script for Netlify environment variables
# Run this script after adding your actual keys to .env file

echo "🚀 Setting up Netlify environment variables..."
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please copy .env.example to .env and fill in your actual values:"
    echo "  cp .env.example .env"
    echo "  # Then edit .env with your actual Stripe and database credentials"
    exit 1
fi

# Source the .env file
export $(cat .env | grep -v '^#' | xargs)

# Check if required variables are set
if [ -z "$STRIPE_SECRET_KEY" ] || [ "$STRIPE_SECRET_KEY" = "sk_test_your_stripe_secret_key_here" ]; then
    echo "❌ Error: STRIPE_SECRET_KEY not set in .env file"
    exit 1
fi

if [ -z "$STRIPE_PRICE_ID" ] || [ "$STRIPE_PRICE_ID" = "price_your_price_id_here" ]; then
    echo "❌ Error: STRIPE_PRICE_ID not set in .env file"
    exit 1
fi

if [ -z "$URL" ]; then
    echo "❌ Error: URL not set in .env file"
    exit 1
fi

# Set environment variables in Netlify
echo "📝 Setting STRIPE_SECRET_KEY..."
npx netlify env:set STRIPE_SECRET_KEY "$STRIPE_SECRET_KEY"

echo "📝 Setting STRIPE_PRICE_ID..."
npx netlify env:set STRIPE_PRICE_ID "$STRIPE_PRICE_ID"

echo "📝 Setting URL..."
npx netlify env:set URL "$URL"

if [ ! -z "$DATABASE_URL" ] && [ "$DATABASE_URL" != "postgresql://user:password@host/database" ]; then
    echo "📝 Setting DATABASE_URL..."
    npx netlify env:set DATABASE_URL "$DATABASE_URL"
fi

echo ""
echo "✅ Environment variables set successfully!"
echo ""
echo "🔄 Triggering a new deployment..."
npx netlify deploy --prod

echo ""
echo "✨ Done! Your site will redeploy with the new environment variables."
echo "Check your Netlify dashboard to monitor the deployment."
