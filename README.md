# Nolea Mobile App

Premium mobile-first shopping app for nolea.shop digital PDF guides. Now packaged as a **native iOS + Android app** via Capacitor, with the web version still buildable for Vercel.

## What This App Contains

- React 19, Vite, TypeScript, Tailwind CSS
- Mobile shopping experience: Home, Shop, Cart, Favorites, Meine Guides, Account
- Stripe Checkout integration
- Firebase Auth + Firestore
- Server-side download-link APIs with 48-hour access window
- **Capacitor native wrapper** for iOS + Android (Haptics, Share, App lifecycle)
- "Gift Moment" success page with reveal/celebration animation
- "Meine Guides" completion system with share artifacts
- Honest checkout notice (kein Abo, klare Preise)
- Rate-limited API endpoints (AI, Checkout, Download)
- Hardened Firestore rules

## Local Development (Web)

```bash
npm install --legacy-peer-deps
npm run dev          # → http://localhost:3000
npm run build        # → dist/
```

## Native App Builds (Capacitor)

The `android/` and `ios/` folders contain full native projects. **The build (APK / IPA) must happen on the target platform:**

### Android (works on Windows / WSL / Mac / Linux)

1. Install **Android Studio** (https://developer.android.com/studio)
2. Open Android Studio → "Open" → select the `android/` folder
3. Let Gradle sync (first time takes a few minutes)
4. Build → Build Bundle(s) / APK(s) → Build APK(s)
5. Output: `android/app/build/outputs/apk/debug/app-debug.apk`
6. For Play Store: Build → Generate Signed Bundle / APK → release

**Or via command line** (after first Gradle sync in Android Studio):
```bash
cd android
./gradlew assembleDebug          # → app-debug.apk
./gradlew assembleRelease        # → app-release.apk (needs signing config)
```

### iOS (Mac only — Windows/WSL cannot build iOS apps)

1. Install **Xcode** (App Store) and **CocoaPods** (`sudo gem install cocoapods`)
2. Open the `ios/App/App.xcworkspace` in Xcode
3. Set your Apple Developer Team in "Signing & Capabilities"
4. Product → Archive → Distribute App

## Environment Variables

Copy `.env.example` to `.env` and fill in your values. **Never commit real secrets.**

Server-only (Vercel / Capacitor Live Updates):
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `FIREBASE_SERVICE_ACCOUNT_KEY_B64`
- `RESEND_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Public frontend (VITE_*):
- `VITE_STRIPE_PUBLISHABLE_KEY`
- Firebase public app config

## Capacitor Commands

```bash
npm run build              # build web bundle to dist/
npm run sync               # build + cap sync (copies to android/ios)
npm run cap:open:android   # open Android Studio
npm run cap:open:ios       # open Xcode (Mac only)
npm run cap:run:android    # build & run on connected device
```

## Architecture Notes

- `src/lib/native.ts` — Native bridge: Haptics, Share, App lifecycle, with web fallbacks
- `src/components/ui/PurchaseReveal.tsx` — Success page "Gift Moment" animation
- `src/components/ui/ShareArtifact.tsx` — Share with native share-sheet
- `src/components/ui/MotionButton.tsx` — Unified press-state button
- `api/_rateLimit.ts` — IP+user rate limiting for sensitive endpoints
- `firestore.rules` — Users cannot edit roles, purchase status, or download rights

## Security Notes

- All payment and download validation is server-side.
- Download links expire after 48 hours.
- PDFs are stored in private storage; downloads proxy through `/api/download`.
- Stripe secret keys, Firebase Admin keys, Supabase service keys and email provider keys must never be exposed to the frontend.
- Rate limits are in-memory (per serverless instance); upgrade to Redis/Upstash for production scale.

## Known Follow-Ups

- Code-split the main JS bundle (current build warns about >500kB chunk)
- Review `npm audit` advisories and apply safe upgrades
- Add end-to-end tests for checkout, expired links, cross-user access denial
- Replace in-memory rate limiter with Upstash Redis for multi-instance deployments
