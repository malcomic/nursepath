# NursePath

Next.js application for NCLEX-RN study guides and nursing exam prep.

## Migration status

This repo is migrating from a legacy Vite + Express stack to Next.js App Router.

- **Next.js app** (canonical): repo root — `app/`, `lib/`, `prisma/`
- **Legacy frontend**: [`nursepath/`](nursepath/) — Vite + React (do not delete until migration is validated)
- **Legacy backend**: [`backend/`](backend/) — Express API (do not delete until migration is validated)

### Prisma

Prisma migrations at `prisma/` are canonical for the Next.js app. `backend/prisma/` is frozen until Express decommission. **Do not run conflicting migrations against the same database from both locations.**

### Sitemap

The footer links to `/sitemap`, which redirects to `/sitemap.xml` (Next.js sitemap convention).

## Getting started

1. Copy `.env.example` to `.env.local` and fill in values (copy `DATABASE_URL` from `backend/.env` if available).
2. Install dependencies: `npm install`
3. Generate Prisma client: `npm run db:generate`
4. Start dev server: `npm run dev` → [http://localhost:3000](http://localhost:3000)

Legacy apps run independently on ports **5173** (Vite) and **5000** (Express).

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Apply migrations |
| `npm run db:studio` | Open Prisma Studio |

## Phase 4: Checkout and payments

### Environment variables

Add to `.env.local` (see `.env.example`):

- `STRIPE_SECRET_KEY` — Stripe test secret key
- `STRIPE_WEBHOOK_SECRET` — from Stripe CLI (see below)
- `PUBLIC_APP_URL=http://localhost:3000`
- `RESEND_API_KEY` — optional; emails log to console when unset
- `CONTACT_FROM_EMAIL` — e.g. `NursePath <onboarding@resend.dev>`
- `CONTACT_TO_EMAIL` — where contact form submissions are sent

**Resend sandbox note:** `onboarding@resend.dev` only delivers to verified email addresses until your domain is verified in Resend.

### Local Stripe webhook setup

1. Install [Stripe CLI](https://stripe.com/docs/stripe-cli)
2. Run: `stripe listen --forward-to localhost:3000/api/stripe-webhook`
3. Copy the webhook signing secret (`whsec_...`) to `STRIPE_WEBHOOK_SECRET` in `.env.local`
4. Restart the dev server

### Guide setup for checkout

Each paid guide needs a `stripePriceId` in the database pointing to a Stripe Price object. Guides without it show a friendly error on `/purchase/[id]`. Free guides (`price === 0`) skip Stripe and go directly to `/payment-success`.

### E2E verification checklist

| Test | Expected |
|------|----------|
| `/purchase/[id]` loads | Name/email form + order summary sidebar |
| Submit paid checkout | Redirects to Stripe hosted checkout |
| Pay with `4242 4242 4242 4242` | Lands on `/payment-success?order_id=` |
| Poll while PENDING | Resolves to PAID within a few seconds |
| Download button | `GET /api/download/[token]` redirects to PDF |
| Download email | Received via Resend (or logged if no API key) |
| Free guide (`price === 0`) | Skips Stripe, immediate download on success page |
| Contact form submit | Email to `CONTACT_TO_EMAIL` (or logged in dev) |
| Cancel on Stripe | Returns to `/guides/[id]` |
| Decline card `4000 0000 0000 0002` | Payment fails on Stripe side |
| `npm run build` | Passes |

## Phase 6: Admin panel and uploads

### Environment variables

Add to `.env.local` (see `.env.example`):

- `JWT_SECRET` — secret for admin JWT cookies (required)
- `JWT_EXPIRY` — token lifetime, e.g. `24h` (default: `24h`)
- `BLOB_READ_WRITE_TOKEN` — Vercel Blob token for PDF/thumbnail uploads (optional; URL mode works without it)

Admin auth uses an **httpOnly `admin_token` cookie** set on `POST /api/admin/login`. Middleware protects all `/admin/*` routes except `/admin/login`. The public header checks `GET /api/admin/me` to show Dashboard / Logout when signed in.

### Admin smoke checklist

| Test | Expected |
|------|----------|
| Visit `/admin/guides` logged out | Redirect to `/admin/login` |
| Login with valid admin | Cookie set; land on `/admin/dashboard` |
| Valid cookie on `/admin/login` | Redirect to dashboard |
| Logout | Cookie cleared; Header shows Log In |
| Create category + guide (URL mode) | Persists; appears on `/services` |
| Upload PDF + thumbnail | Blob URLs saved on guide |
| Guide with `stripePriceId` | Checkout still works |
| Approve pending review | Appears on `/reviews` |
| Order resend / regenerate / refund | Success toasts; DB updates |
| Save settings | Persists; masked API key on GET |
| `npm run build` | Passes |

### Stripe test cards

- **Success:** `4242 4242 4242 4242` (any future expiry, any CVC)
- **Decline:** `4000 0000 0000 0002`
