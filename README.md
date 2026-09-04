# MyHumidor — TTC iPhone App

Native iPhone app for The Tobacco Center's customer portal. Talks directly
to the existing `ttc-customer` Cloudflare Worker — this repo has no backend
of its own.

**Status: Milestone 1 — login is wired up and working.** The four tabs
(Vault / Wishlist / Humidor / Profile) exist with placeholder content;
Vault and Profile show real session data, Wishlist and Humidor are "coming
soon" until their backend contracts are confirmed (see below).

## Run it on your iPhone (PowerShell)

You'll need [Node.js 22 LTS](https://nodejs.org/) (22.13.x or newer) and the
free **Expo Go** app installed on your iPhone from the App Store.

```powershell
git checkout claude/ttc-myhumidor-iphone-96abfx
git pull
npm install
npx expo start
```

A QR code appears in the terminal. Open the **Camera** app on your iPhone,
point it at the QR code, and tap the notification that pops up — it opens
in Expo Go automatically. Your phone and computer need to be on the same
Wi-Fi network; if that's not possible (e.g. guest network isolation), run
`npx expo start --tunnel` instead.

To log in for real, you need a phone number + last name that's already
registered in TTC's system (same as the web MyHumidor portal).

## Project structure

```
src/
├── app/                    # Expo Router file-based routes
│   ├── _layout.tsx         # Providers + auth-gated navigation (Stack.Protected)
│   ├── login.tsx           # Phone + last name login screen
│   └── (tabs)/              # Bottom tab bar, shown once logged in
│       ├── index.tsx        # Vault (home)
│       ├── wishlist.tsx
│       ├── humidor.tsx
│       └── profile.tsx      # Name/phone on file + logout
├── api/
│   ├── client.ts            # fetch wrapper for the ttc-customer Worker
│   └── customer.ts          # verify-login (more endpoints land here as contracts are confirmed)
├── auth/
│   ├── SessionContext.tsx   # Session state, login()/logout()
│   └── secureStore.ts       # expo-secure-store wrapper (Keychain-backed)
├── components/               # Shared UI (ThemedText/View, ComingSoonNotice, ExternalLink)
├── theme/colors.ts            # Placeholder brand palette — swap for real TTC colors later
└── types/api.ts                # TypeScript types mirroring the worker's JSON contracts
```

Managed Expo workflow — there's no `ios/`/`android/` folder in this repo.
EAS Build generates those in the cloud when it's time for a real build, so
no Mac is needed at any point.

## Backend contract — open questions

`POST /verify-login` is fully wired and confirmed working. Before the next
milestones (Vault purchase history, Wishlist add/remove, Humidor readings)
can be built, these need to be confirmed against the actual `ttc-customer`
/ `ttc-inv-api` responses (this repo intentionally doesn't guess at them):

1. Does `/verify-login`'s `customerData` already include purchase history /
   wishlist / ratings, or is there a separate call for the full portal
   payload?
2. What identifies the customer on follow-up calls (wishlist add/remove,
   ratings) — phone number resent each time, or an id/token?
3. Exact wishlist add/remove request shape under `POST /customer-portal`.
4. `ttc-inv-api`'s `/humidor-log` and the flipboard endpoint's exact
   path/params, if live restock notices should appear in the Humidor tab.

The easiest way to unblock these: paste a sample JSON response from
`/verify-login` (with a real or test customer) and a screenshot of the web
MyHumidor portal's network tab showing the wishlist/purchase-history calls.

## What's next

See the project plan for the full milestone list (Vault data, Wishlist,
Humidor, push notification readiness, App Store prep, and the TestFlight /
submission walkthrough).
