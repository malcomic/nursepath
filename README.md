# NursePath

Next.js application for NCLEX-RN study guides and nursing exam prep.

## Stack

- **Next.js App Router** at repo root — `app/`, `lib/`, `prisma/`
- **Prisma + PostgreSQL** — migrations only under root `prisma/`
- **Paystack** checkout (card USD + M-Pesa KES), **Resend** email, **Vercel Blob** uploads

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

- `PAYSTACK_SECRET_KEY` — Paystack secret key (test or live)
- `PAYSTACK_WEBHOOK_SECRET` — webhook signing secret from the Paystack Dashboard
- `PUBLIC_APP_URL=http://localhost:3000`
- `RESEND_API_KEY` — optional; emails log to console when unset
- `CONTACT_FROM_EMAIL` — e.g. `NursePath <onboarding@resend.dev>`
- `CONTACT_TO_EMAIL` — where contact form submissions are sent

**Resend sandbox note:** `onboarding@resend.dev` only delivers to verified email addresses until your domain is verified in Resend.

### Local Paystack webhook setup

1. Create a Kenya Paystack business and enable **card** + **mobile_money** (M-Pesa). Enable **USD** if you settle card payments in USD.
2. In Dashboard → Settings → API Keys, copy the **test** secret key into `PAYSTACK_SECRET_KEY`.
3. In Dashboard → Settings → API Keys & Webhooks, add webhook URL:
   - Local tunnel example: `https://<your-tunnel>/api/paystack/webhook`
   - Production: `https://your-domain.com/api/paystack/webhook`
4. Copy the webhook secret into `PAYSTACK_WEBHOOK_SECRET`.
5. In Admin → Settings, set **USD to KES rate** (used when buyers choose M-Pesa).
6. Restart the dev server.

### Guide setup for checkout

Paid guides use the catalog `price` (USD). Free guides (`price === 0`) skip Paystack and go directly to `/payment-success`. At checkout, buyers choose **Card (USD)** or **M-Pesa (KES)**.

### E2E verification checklist

| Test | Expected |
|------|----------|
| `/purchase/[id]` / `/checkout` | Name/email form + Card / M-Pesa selector for paid carts |
| Submit paid checkout (card) | Redirects to Paystack hosted checkout (USD) |
| Submit paid checkout (M-Pesa) | Redirects to Paystack hosted checkout (KES mobile money) |
| Complete test payment | Lands on `/payment-success?order_id=` |
| Poll while PENDING | Resolves to PAID after webhook |
| Download button | `GET /api/download/[token]` redirects to PDF |
| Download email | Received via Resend (or logged if no API key) |
| Free guide (`price === 0`) | Skips Paystack, immediate download on success page |
| Contact form submit | Email to `CONTACT_TO_EMAIL` (or logged in dev) |
| Abandon / cancel Paystack | Orders stay PENDING |
| `npm run build` | Passes |

## Phase 6: Admin panel and uploads

### Environment variables

Add to `.env.local` (see `.env.example`):

- `JWT_SECRET` — secret for admin JWT cookies (required)
- `JWT_EXPIRY` — token lifetime, e.g. `24h` (default: `24h`)
- `BLOB_READ_WRITE_TOKEN` — Vercel Blob token for PDF/thumbnail uploads and review screenshots (optional; guide URL mode works without it; review screenshot upload requires it)

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
| Paid guide checkout | Works with Paystack (no Stripe Price ID) |
| Approve pending review | Appears on `/reviews` |
| Order resend / regenerate / refund | Success toasts; DB updates |
| Save settings (incl. USD→KES rate) | Persists; masked API key on GET |
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
- Purchase/checkout still use **cuid**: `/purchase/{id}`, order FKs, Paystack metadata
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
| Paystack cancel / abandon | Buyer can return and retry |
| Sitemap | Slug URLs only |
| Admin create without slug | Auto slug from title |
| `npm run build` | Passes |
| `main` | No `nursepath/` or `backend/` |
| `archive/legacy-vite-express` | Contains legacy trees |

## Phase 9: Review screenshot uploads

Optional screenshots on `/reviews` submit upload to Vercel Blob, then save as `Review.screenshot_url`. Public review cards stay text-only; admins view images in the reviews lightbox.

Requires `BLOB_READ_WRITE_TOKEN` (same as guide PDF/thumbnail uploads). Flow: `POST /api/reviews/upload-screenshot` → `POST /api/reviews` with `screenshot_url`.

### Phase 9 smoke checklist

| Test | Expected |
|------|----------|
| Submit review, no file | 201 pending; `screenshot_url` null |
| Submit with PNG/JPEG/WebP | Blob URL stored; admin lightbox works |
| Wrong type / >5MB | 400 from upload route |
| Missing Blob token | 503 |
| Rate limit spam upload | 429 |
| `npm run build` | Passes |

## Phase 10: Persisted category slugs

- Canonical public path: `/categories/{slug}` (persisted unique `Category.slug`)
- `/categories/{cuid}` **301 redirects** to the slug URL
- Admin categories form includes optional **Slug** (auto from name when blank)
- Changing the name auto-refreshes the slug unless you set an explicit slug
- Sitemap, homepage, and services SEO use DB slugs

### Phase 10 smoke checklist

| Test | Expected |
|------|----------|
| `/categories/{slug}` | 200 |
| `/categories/{cuid}` | 301 → `/categories/{slug}` |
| Homepage / sitemap | Links use DB slug |
| Admin create without slug | Auto slug from name |
| Admin edit slug | Unique; collision handled |
| Rename with blank slug | Slug regenerates from new name |
| `npm run build` | Passes |

## Phase 11: Blog content push

Ten new detailed MDX posts were added under `content/blog/` (ATI vs NCLEX, NGN clinical judgment, pharmacology, HESI A2, TEAS, SATA, prioritization/delegation, fluids/electrolytes, maternity, mental health). Each includes frontmatter, multi-section depth, optional `<Callout>` tips, and CTAs to `/services` or category pages.

Redeploy after adding posts — blog pages are generated at build time and included in `sitemap.xml`.

### Phase 11 smoke checklist

| Test | Expected |
|------|----------|
| `/blog` | Lists new posts with older ones |
| `/blog/[slug]` for each new post | Renders headings, Callouts, internal links |
| `/sitemap.xml` | Includes all new blog slugs |
| `npm run build` | Passes |

## Phase 12: Admin UI brand alignment

Admin uses the same teal / navy / coral system and Outfit/Figtree fonts as the marketing site:

- Shell + login: navy panel, teal active nav, coral primary CTAs
- Soft page background (`bg-soft`), `border-border`, navy text
- Shared Modal / ConfirmModal / StatusBadge / toasts updated
- Behavior and APIs unchanged — visual only

### Phase 12 smoke checklist

| Test | Expected |
|------|----------|
| `/admin/login` | Brand login; successful sign-in |
| Sidebar + mobile nav | Teal active state |
| Guides / categories create CTAs | Coral primary buttons |
| Orders / reviews / settings | On-brand forms and tables |
| `npm run build` | Passes |

## Phase 13: Magic-link buyer recovery

Buyers reclaim downloads without passwords:

1. Enter checkout email on `/dashboard`
2. Receive a one-time Resend magic link (30 minutes)
3. Link sets an httpOnly `buyer_token` session (~7 days)
4. Dashboard lists PAID orders and download links for that email

APIs: `POST /api/dashboard/request-link`, `GET /api/dashboard/verify`, `GET /api/dashboard/me`, `GET /api/dashboard/orders`, `POST /api/dashboard/logout`. Public email lookup without a session is no longer allowed (`/api/orders/by-email` requires a matching buyer session).

Without `RESEND_API_KEY`, magic links are logged to the server console (dev stub).

### Phase 13 smoke checklist

| Test | Expected |
|------|----------|
| Request link for paid email | Generic success; email (or console stub) with link |
| Open magic link | Cookie set; redirect `/dashboard` with orders |
| Expired / reused link | Error; must request again |
| Sign out | Cookie cleared; request form shown |
| `/api/orders/by-email` without session | 401 |
| Rate-limit spam request-link | 429 |
| `npm run build` | Passes |




