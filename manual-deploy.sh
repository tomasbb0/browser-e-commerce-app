#!/bin/bash

# Manual Netlify Deploy Script (bypasses build minutes)
# This deploys directly without using build minutes

echo "🚀 Manual Netlify Deploy (No Build Minutes Used)"
echo ""

# Just deploy the current directory
npx netlify deploy --prod --dir=.

echo ""
echo "✅ Deployed! This used 0 build minutes."
