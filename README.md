## Setup

#### Deployed Site

https://e-commerce-site-coral-delta.vercel.app/

### Set up Vercel and Neon

This project uses Vercel and Neon for hosting and database management. Follow these steps to set up your environment:

1. Create a new project on [Vercel](https://vercel.com).
2. Connect your GitHub repository to Vercel (or create new repo + project directly from vercel).
3. Naviagate to Dashboard.
4. Navigate to Storage and select Neon Serverless Postgres from Marketplace.
5. Fill out the form to create a new Neon database.

### [Setup Prisma](./PRISMA-SETUP.md)

### Setup Stripe

1. Create a new account on [Stripe](https://stripe.com).
2. Create a new project and get your API keys.
3. Add the Stripe publishable key and secret key to your environment variables.
4. Create webhooks in Stripe to handle events like payment success, failure, etc. You can do this in the Stripe dashboard under Developers > Webhooks using your Vercel URL.

### Setup PayPal

1. Create a new account on [PayPal Developer](https://developer.paypal.com).
2. Create a new app in the PayPal Developer dashboard and get your client ID and secret.
3. Add the PayPal client ID and secret to your environment variables.

### Setup Resend

1. Create a new account on [Resend](https://resend.com).
2. Create a new project and get your API key.

### Add Environmental Variables

Create a `.env` file in the root directory and add the following variables:

```env
NEXT_PUBLIC_APP_NAME=
NEXT_PUBLIC_APP_DESCRIPTION=
NEXT_PUBLIC_SERVER_URL=
LATEST_PRODUCTS_LIMIT=
DATABASE_URL=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL_INTERNAL=

PAYMENT_METHODS="PayPal, Stripe, CashOnDelivery"
DEFAULT_PAYMENT_METHOD=

// PAYPAL
PAYPAL_CLIENT_ID=
PAYPAL_APP_SECRET=
PAYPAL_API_URL="https://api-m.sandbox.paypal.com"

// UPLOADTHING
UPLOADTHING_TOKEN=
UPLOADTHING_SECRET=
UPLOADTHING_APPID=

// STRIPE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=

//RESEND
RESEND_API_KEY=
SENDER_EMAIL=
```
