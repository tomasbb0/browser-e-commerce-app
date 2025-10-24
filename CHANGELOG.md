# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2024-10-24

### 🎉 Major Platform Migration: Netlify → Vercel

**Reason**: Exceeded Netlify's 300 free build minutes/month. Vercel offers unlimited deployments.

### ✅ Added

- **Stripe Webhook Handler** (`api/stripe-webhook.js`)
  - Automatically upgrades users to premium after successful payment
  - Handles subscription cancellations
  - Listens for `checkout.session.completed` and `customer.subscription.deleted` events
  
- **Welcome Tutorial Modal**
  - Interactive 4-step tutorial for new premium users
  - Displays after successful payment via `?welcome=true` parameter
  - Shows benefits: Save results, Compare tools, Email support, Early access
  
- **Promo Code Support**
  - `FREEMONTH` code gives 100% off first month
  - Applied at Stripe checkout
  
- **Success Page** (`success.html`)
  - Shows after payment completion
  - Auto-redirects to homepage with welcome tutorial
  - 2-second delay to allow webhook processing
  
- **Comprehensive Documentation**
  - `DEPLOYMENT.md` - Platform comparison and deployment guides for both Vercel and Netlify
  - `SETUP_GUIDE.md` - Updated for Vercel with Netlify alternative
  - `CONTRIBUTING.md` - Contribution guidelines
  - `setup-google-oauth-guide.html` - Interactive OAuth setup guide
  
- **Database Integration**
  - Neon PostgreSQL for user data persistence
  - Stores subscription status, saved results, quiz count
  - Automatic user creation on first login

### 🔄 Changed

- **Serverless Functions Format** (Netlify → Vercel)
  - `api/user-data.js`: Converted to Vercel format with Pool connection
  - `api/save-user-data.js`: Converted to Vercel format
  - `api/create-checkout.js`: Already in Vercel format
  - Changed from `exports.handler` to `module.exports`
  - Changed from `Client` to `Pool` for database connections
  - Updated request/response handling

- **Function Call Paths in app.js**
  - `/.netlify/functions/user-data` → `/api/user-data`
  - `/.netlify/functions/save-user-data` → `/api/save-user-data`
  - `/.netlify/functions/create-checkout` → `/api/create-checkout`

- **Environment Variables**
  - Added `STRIPE_WEBHOOK_SECRET` for webhook signature verification
  - Updated `URL` from Netlify to Vercel domain
  - Cleaned up all environment variables (removed hidden newlines)
  - Updated `.env.example` with all required variables

- **Package.json Scripts**
  - `npm run dev` now uses `vercel dev` instead of `netlify dev`
  - `npm run deploy` now uses `vercel --prod` instead of `netlify deploy --prod`
  - Updated devDependencies to use `vercel` instead of `netlify-cli`

- **Documentation**
  - Updated README.md with Vercel deployment instructions
  - Added Netlify compatibility section (95% compatible)
  - Updated all URL references from `elaborate-queijadas-7f9028.netlify.app` to `browser-e-commerce-app.vercel.app`
  - Updated API endpoint documentation

### 🐛 Fixed

- **Checkout Session Creation** (resolved ~15 deployment attempts)
  - Fixed URL environment variable pointing to old Netlify URL
  - Removed hidden newline characters from `STRIPE_PRICE_ID`
  - Fixed mismatched Stripe API keys (frontend vs backend)
  
- **Success Page 404**
  - Changed redirect URL from `/success` to `/success.html`
  - Committed and deployed success.html

- **Premium Activation**
  - Created webhook to automatically upgrade users after payment
  - Fixed database function calls (were pointing to Netlify paths)
  
- **Placeholder Values**
  - Removed `price_YOUR_STRIPE_PRICE_ID` from app.js
  - Price ID now comes from environment variable in backend

### 🗑️ Removed

- Netlify-specific function format from active codebase
- Old Netlify URL references
- Placeholder price ID in frontend code
- Unnecessary STRIPE_PUBLISHABLE_KEY (not used in backend)

### 📝 Migration Notes

**Netlify Compatibility**: The project is 95% compatible with Netlify. To redeploy on Netlify:

1. Convert function format:
   - `module.exports` → `exports.handler`
   - `req.body` → `JSON.parse(event.body)`
   - `res.status(200).json()` → `return {statusCode: 200, body: JSON.stringify()}`
   - `Pool` → `Client`

2. Move functions from `api/` to `netlify/functions/`

3. Update app.js function calls back to `/.netlify/functions/`

4. Use `netlify.toml` instead of `vercel.json`

See `DEPLOYMENT.md` for detailed instructions.

### 🚀 Deployment

**Current Platform**: Vercel  
**Production URL**: https://browser-e-commerce-app.vercel.app  
**Status**: ✅ Deployed and working

### 🔐 Environment Variables Required

- `STRIPE_SECRET_KEY` - Stripe test/live secret key
- `STRIPE_PRICE_ID` - Subscription price ID
- `STRIPE_WEBHOOK_SECRET` - Webhook signing secret
- `DATABASE_URL` - Neon PostgreSQL connection string (pooled)
- `URL` - Deployment URL

### 🧪 Testing

To test the full premium flow:

1. Visit https://browser-e-commerce-app.vercel.app
2. Sign in with Google
3. Click "Upgrade to Premium"
4. Use test card: `4242 4242 4242 4242`
5. Or use promo code: `FREEMONTH`
6. Verify success page appears
7. Verify welcome tutorial shows
8. Verify premium badge displays
9. Test saving quiz results

### 📊 Statistics

- **Files Changed**: 9 files
- **Insertions**: 517 lines
- **Deletions**: 139 lines
- **New Files**: 3 (DEPLOYMENT.md, CONTRIBUTING.md, CHANGELOG.md)
- **Commits**: 3 major commits
- **Deployments**: ~18 total (including debugging attempts)

---

## [1.0.0] - 2024-10-23

### Initial Release

- Google OAuth authentication
- Interactive quiz system
- Stripe payment integration (basic)
- Netlify deployment
- Basic serverless functions
- PostgreSQL database setup
