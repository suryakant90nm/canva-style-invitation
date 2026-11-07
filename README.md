# 💌 ShubhInvite — Free Invitation Card Maker for India

> Canva-style online editor for **wedding, birthday, baby-shower and festival invitations** —
> in **13 Indian languages**, with a one-click **multi-event Story Invite** that exports as a
> **real MP4 video** for WhatsApp. Runs on Vercel with **zero configuration**.

**Live:** https://canva-style-invitation.vercel.app · **Repo:** https://github.com/suryakant90nm/canva-style-invitation

---

## 📚 Documentation

| Document | Who it's for |
| --- | --- |
| [**User Guide**](docs/USER-GUIDE.md) | Anyone using the website — templates, editor, Story Invite, downloads |
| [**Developer Guide**](docs/DEVELOPER-GUIDE.md) | Adding templates, languages, art; architecture; API reference |
| [**Deployment Guide**](docs/DEPLOYMENT.md) | GitHub → Vercel, environment variables, custom domain, database |
| [**Troubleshooting**](docs/TROUBLESHOOTING.md) | Common problems and fixes |
| [**हिंदी गाइड**](docs/HINDI-GUIDE.md) | Quick start in Hindi for non-technical users |

---

## ✨ Features at a glance

| Area | Details |
| --- | --- |
| **70 templates** | 17 wedding · 17 birthday · 17 baby shower · 16 invitation/festival · 3 editable examples |
| **Canva-style editor** | Drag, resize, rotate, snap guides, layers, lock, duplicate, undo/redo, keyboard shortcuts, autosave |
| **Multi-page** | **+ Add page** under the canvas → blank / duplicate / any template. Page strip with reorder & delete |
| **13 languages** | English, हिंदी, मराठी, राजस्थानी, ਪੰਜਾਬੀ, ગુજરાતી, বাংলা, தமிழ், తెలుగు, മലയാളം, ಕನ್ನಡ, ଓଡ଼ିଆ, اردو — UI + native fonts + ready phrases |
| **Story Invite** | Haldi → Mehendi → Sangeet → Shaadi → Reception generated in one click, in the chosen language |
| **🎬 Video Studio** | 12 transitions · 9 motions · 6 overlays · 6 one-click presets · per-page effects · **live preview** · 720p/1080p · real **MP4/WebM**, rendered in the browser (no server, no paid API) |
| **🔐 Super-admin panel** | `/admin` — hide/feature/rename templates, delete community uploads, announcement banner, maintenance notice, usage stats |
| **Downloads** | HD PNG · JPG (per page) · multi-page PDF · MP4 video |
| **Share** | WhatsApp (native share sheet with the video on phones) · Facebook |
| **Art library** | Bundled Indian illustrations — Ganesha, bride & groom, mandala, diya, balloons… |
| **Photos** | Upload your own · free curated stock library · optional Pexels/Unsplash |
| **Mobile** | Fully responsive 360px+; Canva-app-style editor with bottom tab bar |
| **SEO** | Per-page metadata, JSON-LD, sitemap.xml, robots.txt, Indian search keywords |
| **Zero-config hosting** | Works without a database (browser + memory store); PostgreSQL optional |

---

## 🚀 Quick start (local)

```bash
git clone https://github.com/suryakant90nm/canva-style-invitation.git
cd canva-style-invitation
npm install
npm run dev
```

Open <http://localhost:3000>. **No environment variables needed.**

---

## 🛠 Tech stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Drizzle ORM (optional PostgreSQL) · html-to-image · MediaRecorder API

---

## 🗂 Project structure (short)

```
src/
├─ app/            pages + API routes
├─ components/     UI (Header, MegaMenu, editor/…)
├─ lib/
│  ├─ templates/   ← 70 templates · add yours in my-templates.ts
│  ├─ design.ts    document model
│  ├─ decor.ts     template building helpers
│  ├─ languages.ts i18n-copy.ts ui-strings.ts   ← 13 languages
│  └─ data.ts      storage (DB ↔ memory fallback)
└─ public/art/     bundled illustrations
```

Full tree and explanations in the [Developer Guide](docs/DEVELOPER-GUIDE.md).

---

## 📄 License

MIT — see [LICENSE](./LICENSE).
