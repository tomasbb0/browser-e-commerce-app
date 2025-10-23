# Browser Tool Finder

A premium quiz application that helps startup teams find the perfect browser tools. Built with vanilla JavaScript and deployed on Netlify with Stripe integration for payments.

## Features

- 🔐 Google OAuth authentication
- 📊 Interactive quiz system
- 💳 Stripe payment integration
- 💾 PostgreSQL database (Neon)
- ⚡ Serverless functions via Netlify
- 🎨 Beautiful, responsive UI

## Tech Stack

- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Backend**: Netlify Functions (Node.js)
- **Database**: PostgreSQL (Neon)
- **Authentication**: Google OAuth
- **Payments**: Stripe
- **Hosting**: Netlify

## Project Structure

```
browser-tool-finder/
├── index.html              # Main HTML file
├── app.js                  # Frontend JavaScript
├── netlify/
│   └── functions/
│       ├── user-data.js           # Load user from database
│       ├── save-user-data.js      # Save to database
│       └── create-checkout.js     # Handle Stripe payments
├── package.json            # Dependencies
├── netlify.toml           # Netlify configuration
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## Setup Instructions

### 1. Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Netlify account
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
5. Add authorized JavaScript origins (your Netlify domain)
6. Update the `data-client_id` in `index.html`

### 4. Stripe Setup

1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Dashboard
3. Create a subscription product and price
4. Copy the price ID

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
   ```

7. Open http://localhost:8888

### 6. Deploy to Netlify

1. Push your code to GitHub/GitLab/Bitbucket

2. Connect your repository to Netlify:
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Select your repository
   - Configure build settings (already set in netlify.toml)

3. Set environment variables in Netlify:
   - Go to Site settings → Environment variables
   - Add:
     - `DATABASE_URL`
     - `STRIPE_SECRET_KEY`
     - `STRIPE_PUBLISHABLE_KEY`

4. Deploy!

### 7. Post-Deployment

1. Update Google OAuth authorized origins with your Netlify domain
2. Update Stripe webhook URLs if needed
3. Test the entire flow:
   - Sign in with Google
   - Take a quiz
   - Attempt to upgrade (Stripe checkout)

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Neon PostgreSQL connection string | `postgresql://user:pass@host/db` |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_test_...` |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | `pk_test_...` |
| `URL` | Site URL (auto-set by Netlify) | `https://yoursite.netlify.app` |

## API Endpoints

### POST /.netlify/functions/user-data
Load user data from database
```json
{
  "email": "user@example.com"
}
```

### POST /.netlify/functions/save-user-data
Save user data to database
```json
{
  "email": "user@example.com",
  "subscription": "premium",
  "savedResults": [...],
  "quizzesTaken": 5
}
```

### POST /.netlify/functions/create-checkout
Create Stripe checkout session
```json
{
  "email": "user@example.com",
  "priceId": "price_..."
}
```

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

## License

MIT

## Support

For issues and questions, please open a GitHub issue or contact support.
