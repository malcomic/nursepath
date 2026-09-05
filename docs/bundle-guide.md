# Complete NCLEX-RN Prep Bundle

The homepage **Special Bundle Offer** section links to a real Guide with slug:

`complete-nclex-rn-prep-bundle`

## Create / update the product

### Option A — Seed script

```bash
npx tsx scripts/seed-bundle-guide.ts
```

Then in **Admin → Guides**, edit the bundle: upload the PDF, set a Stripe Price ID (for paid checkout), and optionally a thumbnail.

### Option B — Admin UI

1. Create a guide titled **The Complete NCLEX-RN Prep Bundle**
2. Set slug to `complete-nclex-rn-prep-bundle` (or let the system slugify and rename)
3. Price: `79`
4. Upload PDF + set Stripe Price ID

If no guide with that slug exists, the homepage hides the bundle section (no broken link).
