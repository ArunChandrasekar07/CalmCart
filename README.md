# CalmCart 🛒

A calm, high-fidelity grocery delivery app — built as a real, working React Native (Expo) app with full in-app functionality: live search & filtering, a product catalog, a working cart with quantities and totals, AI-style recommendations, notifications, and a settings/profile screen.

Built by **Arun C.** — Integrated M.Tech Software Engineering, VIT Vellore.

---

## ✨ Features

| Screen | What it does |
|---|---|
| **Onboarding** | First-run setup with toggleable preferences (Text Size, Contrast, Interaction Mode) |
| **Home** | Live search across the catalog, category filter chips, product grid with one-tap "add to cart" |
| **Product Detail** | Quantity stepper, confidence badge, full description, related products, add-to-cart with live price |
| **Recommendations** | Filterable "For You" picks (Last 5 orders / Frequently bought / Seasonal / Price drops) |
| **Notifications** | Grouped by date, unread indicators, tap-through to the related product, push/email toggle switches |
| **Cart** | Quantities, line totals, promo code field, order summary (subtotal, delivery, discount, total), full checkout flow with a confirmation alert |
| **Settings** | Profile identity, links to GitHub / portfolio / LeetCode, push & dark-mode toggles, app info |

Everything is wired up with real state — the cart badge updates live in the tab bar, search filters as you type, checkout clears the cart and navigates home, etc. Product data is local/mock (no backend yet) — see "Next steps" below for hooking up Supabase.

## 🧱 Tech stack

- **Expo SDK 57** + **React Native 0.86**
- **Expo Router** (file-based navigation — routes live in `src/app/`)
- **TypeScript**
- **Inter** font family (`@expo-google-fonts/inter`)
- `@expo/vector-icons` (Ionicons)
- React Context for cart state (no extra state library needed for this scope)

## 📁 Project structure

```
src/
  app/                  ← routes (file-based navigation)
    _layout.tsx          root layout: fonts, providers, stack
    index.tsx             onboarding (first screen)
    (tabs)/
      _layout.tsx          bottom tab navigator
      home.tsx
      recommendations.tsx
      cart.tsx
      notifications.tsx
      settings.tsx
    product/
      [id].tsx             product detail (dynamic route)
  components/            reusable UI (ProductCard, PrimaryButton)
  context/               CartContext (global cart state)
  data/                  mock products & notifications
  theme/                 colors, spacing, font tokens
```

## 🚀 Run it on your phone (easiest path)

You don't need Xcode or Android Studio for this — Expo Go runs it instantly.

1. **Install Node.js** (v18+) on your computer if you don't have it: https://nodejs.org
2. **Clone this repo**
   ```bash
   git clone https://github.com/ArunChandrasekar07/CalmCart.git
   cd CalmCart
   ```
3. **Install dependencies**
   ```bash
   npm install
   ```
4. **Start the dev server**
   ```bash
   npx expo start
   ```
   This prints a QR code in your terminal (and opens a browser tab with one too).
5. **On your phone:**
   - Install **Expo Go** from the [App Store (iOS)](https://apps.apple.com/app/expo-go/id982107779) or [Play Store (Android)](https://play.google.com/store/apps/details?id=host.exp.exponent).
   - Open Expo Go and scan the QR code (iOS: use the Camera app instead, then tap the banner).
   - CalmCart loads straight onto your phone — no app store, no build step.

Your phone and computer need to be on the **same Wi-Fi network** for this to work. If they can't see each other (e.g. college/office Wi-Fi blocks it), run `npx expo start --tunnel` instead (slower, but works over any network).

### Running on a simulator instead
```bash
npx expo start --ios       # requires a Mac with Xcode
npx expo start --android   # requires Android Studio + an emulator
npx expo start --web       # runs in your browser
```

## 📦 Installing CalmCart as a real, offline app (.apk) — no Expo Go, no login, no WiFi needed

The app already runs 100% offline once it's open — every screen uses local data, there are no network calls anywhere in the code. The only thing that needs internet/WiFi is the Expo Go *development* workflow above.

### Option A — GitHub Actions (recommended: zero accounts, zero terminal)

This repo has a [`.github/workflows/build-apk.yml`](.github/workflows/build-apk.yml) workflow that builds a real, installable `.apk` automatically on GitHub's own cloud servers. No Expo account, no `eas login`, nothing to install on your computer.

1. Go to the **Actions** tab of this repo on GitHub.
2. Click **Build Android APK** in the left sidebar, then **Run workflow** → **Run workflow** (or just push any commit to `main` — it runs automatically).
3. Wait ~5–10 minutes for the run to finish (green checkmark).
4. Open the finished run and scroll to **Artifacts** at the bottom — download **CalmCart-apk**. It's a zip containing `app-release.apk`.
5. Transfer the `.apk` to your Android phone (email it to yourself, Google Drive, USB, WhatsApp — any way you'd move a file), tap it to install (Android will ask you to allow installs from this source once).

That's it — CalmCart is now a normal app icon on your home screen. No computer, no WiFi, no Expo Go needed to use it from then on. (This produces a debug-signed APK, which is perfectly fine for installing on your own device — it's not meant for the Play Store.)

### Option B — EAS Build (Expo's cloud build service)

`eas.json` is also configured in this repo with a `preview` profile, if you'd rather build through Expo's own service (needs a free expo.dev account):

```bash
npm install -g eas-cli
eas login                     # free account at expo.dev — sign up if you don't have one
eas build --platform android --profile preview
```

The build runs in Expo's cloud (5–15 minutes). When it finishes, the terminal prints a link (and a QR code) to a page where you can download the `.apk` straight to your phone.

Full guide: https://docs.expo.dev/build/introduction/

## 🗺️ Next steps (if you want to go further)

- **Real backend**: swap `src/data/products.ts` for calls to Supabase (matches your existing stack) — the `Product` type and `useCart` hook are already shaped so this is a drop-in change, not a rewrite.
- **Auth**: add Supabase Auth and replace the hardcoded "Arun" greeting / avatar initials with the logged-in user.
- **Real product photos**: replace the emoji placeholders in `ProductCard` / product detail with actual images once you have a product image source.
- **Push notifications**: wire up `expo-notifications` to replace the mock notification list with real ones.
- **Persist cart**: add `AsyncStorage` so the cart survives an app restart.

---

<sub>Generated with Claude Code.</sub>
