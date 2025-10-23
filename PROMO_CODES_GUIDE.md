# 🎫 How to Create and Use Promo Codes in Stripe

## Quick Setup (3 Steps)

### 1. Create a Coupon in Stripe
1. Go to: https://dashboard.stripe.com/test/coupons
2. Click **"Create coupon"**
3. Choose your discount:
   - **100% off** = FREE
   - **50% off** = Half price
   - Or any custom amount
4. Set duration:
   - **Once** = Applies to first payment only
   - **Forever** = Applies to all future payments
   - **Repeating** = Applies for X months
5. Give it an ID like: `FREE100`, `HALFOFF`, `LAUNCH50`
6. Click **"Create coupon"**

### 2. Create a Promo Code
1. Go to: https://dashboard.stripe.com/test/promocodes
2. Click **"Create promo code"**
3. Select the coupon you just created
4. Enter a customer-facing code like:
   - `FREEMONTH`
   - `WELCOME100`
   - `EARLYBIRD`
5. (Optional) Set expiration date or usage limits
6. Click **"Create promo code"**

### 3. Test It!
Once your site redeploys (about 1-2 minutes):
1. Go to your site and click **"Upgrade to Premium"**
2. On the Stripe checkout page, you'll see **"Add promotion code"**
3. Enter your promo code (e.g., `FREEMONTH`)
4. The discount will be applied!

## 💡 Example Promo Codes

### Free Trial (First Month Free)
- Coupon: 100% off, duration: repeating for 1 month
- Code: `FREETRIAL`

### Launch Special (50% Off Forever)
- Coupon: 50% off, duration: forever
- Code: `LAUNCH50`

### Limited Time (100% Off, Expires Soon)
- Coupon: 100% off, once
- Code: `WELCOME100`
- Set expiration: 7 days from now

## 🔗 Quick Links

- **Test Coupons**: https://dashboard.stripe.com/test/coupons
- **Test Promo Codes**: https://dashboard.stripe.com/test/promocodes
- **Live Coupons** (when ready): https://dashboard.stripe.com/coupons
- **Live Promo Codes** (when ready): https://dashboard.stripe.com/promocodes

## ✅ What's Already Done

Your checkout now supports promo codes! No need to do anything else on the code side.

## 🎉 Share Your Promo Codes

Once created, you can share your promo codes:
- On social media
- In email campaigns
- On your landing page
- To early adopters

The codes will automatically apply the discount when customers enter them at checkout!
