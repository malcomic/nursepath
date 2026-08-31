# NursePath

Next.js application for NCLEX-RN study guides and nursing exam prep.

## Stack

- **Next.js App Router** at repo root — `app/`, `lib/`, `prisma/`
- **Prisma + PostgreSQL** — migrations only under root `prisma/`
- **Stripe** checkout, **Resend** email, **Vercel Blob** uploads

### Legacy archive

The pre-migration Vite frontend (`nursepath/`) and Express API (`backend/`) were removed from `main` after cutover. They are preserved on:

- Branch: `archive/legacy-vite-express`
- Tag: `legacy-pre-cutover` (if pushed)

Restore locally: `git checkout archive/legacy-vite-express`

### Sitemap

The footer links to `/sitemap`, which redirects to `/sitemap.xml`.

## Getting started

1. Copy `.env.example` to `.env.local` and fill in values.
2. Install dependencies: `npm install`
3. Generate Prisma client: `npm run db:generate`
4. Apply migrations: `npm run db:migrate`
5. Start dev server: `npm run dev` → [http://localhost:3000](http://localhost:3000)

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
| Cancel on Stripe | Returns to `/guides/[slug]` |
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

## Phase 7: Blog, sitemap, and legal pages

### Blog (MDX)

Posts live in `content/blog/*.mdx`. Each file needs frontmatter:

```yaml
title: "Post title"
description: "Meta description (150–160 chars)"
publishedAt: "2026-03-01"
keywords: ["keyword1", "keyword2"]
```

After adding or editing a post, redeploy — posts are statically generated at build time. Optional `<Callout>` component is available in MDX for tip/CTA boxes.

### Production SEO

- Set `PUBLIC_APP_URL` to your live domain (e.g. `https://nursepath.com`) so `sitemap.xml`, `robots.txt`, and Open Graph URLs are correct.
- Submit `https://your-domain.com/sitemap.xml` in [Google Search Console](https://search.google.com/search-console).
- Transactional routes (`/purchase/*`, `/payment-success`) are `noindex` and excluded from robots crawling.

### Phase 7 smoke checklist

| Test | Expected |
|------|----------|
| `/blog` | Lists all MDX posts |
| `/blog/[slug]` | Styled prose, internal links work |
| View source on blog post | `BlogPosting` JSON-LD present |
| `/sitemap.xml` | Blog slugs, legal pages, guides, categories |
| `/robots.txt` | Disallows admin, dashboard, api, purchase, payment-success |
| `/privacy`, `/terms`, `/refund`, `/help` | Cross-links footer; help mentions email dashboard |
| `PUBLIC_APP_URL` in production | Sitemap uses live domain |
| `npm run build` | Passes |

## Phase 8: Guide slugs and legacy cutover

### Guide URLs

- Canonical public path: `/guides/{slug}` (persisted unique `Guide.slug`)
- Old `/guides/{cuid}` URLs **301 redirect** to the slug URL
- Purchase/checkout still use **cuid**: `/purchase/{id}`, order FKs, Stripe metadata
- Admin guides form includes optional **Slug** (auto from title when blank)
- Changing the title auto-refreshes the slug unless you set an explicit slug

### Redirects (static)

- `/catalog` → `/services`
- `/order-success` → `/payment-success`

### Phase 8 smoke checklist

| Test | Expected |
|------|----------|
| `/guides/{slug}` | 200 |
| `/guides/{cuid}` | 301 → `/guides/{slug}` |
| GuideCard / services | Links use slug |
| `/purchase/{cuid}` | Still works |
| Stripe cancel | Returns to `/guides/{slug}` |
| Sitemap | Slug URLs only |
| Admin create without slug | Auto slug from title |
| `npm run build` | Passes |
| `main` | No `nursepath/` or `backend/` |
| `archive/legacy-vite-express` | Contains legacy trees |

### Stripe test cards

- **Success:** `4242 4242 4242 4242` (any future expiry, any CVC)
- **Decline:** `4000 0000 0000 0002`
