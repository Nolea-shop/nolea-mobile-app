# Nolea Mobile App

Premium mobile-first shopping PWA for nolea.shop digital PDF guides.

## What This App Contains

- React 19, Vite, TypeScript, Tailwind CSS
- Mobile shopping experience with Home, Shop, Cart, Favorites, Meine Guides and Account
- Stripe Checkout integration
- Firebase Auth and Firestore product/order support
- Server-side download-link APIs with 48-hour access window
- PWA manifest, app icon, service worker and offline fallback
- Local analytics event helpers for product, cart, checkout and download events

## Local Development

```powershell
npm.cmd ci
npm.cmd run dev
```

Open:

```text
http://localhost:3000
```

## Production Build

```powershell
npm.cmd run lint
npm.cmd run build
```

## Required Environment Variables

Copy `.env.example` and set real values in your hosting environment. Do not commit real secrets.

Important server-only variables:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `FIREBASE_SERVICE_ACCOUNT_KEY_B64`
- `RESEND_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Public frontend variables:

- `VITE_STRIPE_PUBLISHABLE_KEY`
- Firebase public app config values

## Security Notes

- Keep payment and download validation server-side.
- Download links are valid for 48 hours.
- Store PDFs in private storage and proxy downloads through `/api/download`.
- Do not expose Stripe secret keys, Firebase Admin keys, Supabase service keys or email provider keys to the frontend.
- Run `npm audit` and review dependency upgrades before production deployment.

## Current Known Follow-Ups

- Split the main JavaScript bundle; current production build warns about a large chunk.
- Review dependency advisories and apply safe upgrades in a separate PR.
- Verify Firestore indexes and rules in the production Firebase project.
- Add end-to-end tests for checkout, success/download, expired links and cross-user access denial.
