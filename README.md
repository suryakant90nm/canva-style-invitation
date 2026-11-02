# 💌 ShubhInvite — Free Invitation Card Maker

**ShubhInvite** is a free, Canva-style online invitation card maker built for the Indian market. Users pick a
designer template, customise every word, colour and photo in a drag-and-drop editor, then download in HD for
WhatsApp, Instagram or print.

Target keywords: invitation card maker · shadi card design · shubh vivah card · baby shower invitation ·
godh bharai card · birthday invitation card maker with name and photo

## ✨ Features

- **67 ready templates** — 17 marriage, 17 birthday, 17 baby shower, 16 invitation/festival
- **Full editor** — drag, resize, rotate, snap guides, layers, lock, duplicate, undo/redo, shortcuts
- **27 fonts** including Hindi (Yatra One, Rozha One, Tiro Devanagari)
- **Built-in Indian art library** — Ganesha, bride & groom, mandala, diya, balloons (free, no attribution)
- **Photos** — upload your own, or search free stock (curated library included; Pexels/Unsplash optional)
- **10 photo-collage layouts** — polaroid, film strip, circle, arch, grid
- **Download** HD PNG, JPG or print-ready PDF · no watermark
- **SEO** — per-page metadata, JSON-LD, sitemap.xml, robots.txt
- **Community templates** — users can publish their own design

## 🛠 Tech stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · PostgreSQL · Drizzle ORM · html-to-image

## 🚀 Run locally

```bash
npm install
cp .env.example .env.local      # then edit DATABASE_URL
npx drizzle-kit push            # create tables
npm run dev
```

Open http://localhost:3000 — templates seed themselves on first request.

### Environment variables

| Name | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | yes | PostgreSQL connection string |
| `NEXT_PUBLIC_SITE_URL` | yes (prod) | Canonical URL for SEO, sitemap, robots |
| `PEXELS_API_KEY` | no | Optional larger photo search |
| `UNSPLASH_ACCESS_KEY` | no | Optional larger photo search |

## ☁️ Deploy to Vercel

**1. Push to GitHub**

```bash
git init
git add .
git commit -m "feat: ShubhInvite invitation card maker"
git branch -M main
git remote add origin https://github.com/<your-username>/shubhinvite.git
git push -u origin main
```

**2. Create a Postgres database** (any free tier works)

- Vercel Postgres / Neon (https://neon.tech) / Supabase / Railway

Copy the connection string, e.g. `postgresql://user:pass@host/db?sslmode=require`

**3. Import on Vercel**

1. Go to https://vercel.com/new and import the repo
2. Framework preset: Next.js (auto-detected)
3. Add environment variables:
   - `DATABASE_URL` = your Postgres connection string
   - `NEXT_PUBLIC_SITE_URL` = `https://your-app.vercel.app`
4. Click **Deploy**

**4. Create the tables (once)**

```bash
DATABASE_URL="<production-url>" npx drizzle-kit push
```

**5. Custom domain (optional)** — Vercel → Settings → Domains. Then set
`NEXT_PUBLIC_SITE_URL=https://shubhinvite.com` and redeploy so canonical URLs and the sitemap update.

## 🧩 Project structure

```
src/
├─ app/
│  ├─ page.tsx                 home (hero, categories, FAQ, JSON-LD)
│  ├─ templates/               browse + detail pages (SEO metadata)
│  ├─ editor/[id]/             the card editor
│  ├─ my-designs/              saved designs
│  ├─ sitemap.ts, robots.ts    SEO
│  └─ api/                     templates · designs · stock · img proxy · health
├─ components/
│  ├─ DesignView.tsx           renders a design doc (cards + thumbnails)
│  └─ editor/                  Editor, Toolbar, panels, export
├─ db/                         Drizzle schema + client
└─ lib/
   ├─ design.ts  decor.ts  art.ts  curated-photos.ts
   ├─ categories.ts  fonts.ts  site.ts
   └─ templates/               67 template definitions
public/art/                    bundled Indian illustrations
```

## 🔌 Public API

```bash
GET  /api/templates?category=wedding&tag=Hindu&q=gold&sort=popular
POST /api/designs        { "ownerId": "...", "templateSlug": "royal-maroon-shubh-vivah" }
PUT  /api/designs/:id    { "title": "...", "data": { ...doc } }
GET  /api/stock?q=marigold
```

## 📈 SEO

Per-template titles, descriptions, canonical URLs and `Product` JSON-LD; `WebApplication`, `Organization` and
`FAQPage` schema on the home page; dynamic `sitemap.xml`; `robots.txt` that excludes `/editor/*` and `/api/*`.

## 📄 License

MIT — see [LICENSE](./LICENSE).
