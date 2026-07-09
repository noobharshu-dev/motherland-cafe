# ☕ Motherland Cafe

> **Escape the Noise. Sip Slowly.** — A full-stack web presence for a boutique café in Kolkata, featuring online reservations, a dynamic menu, a curated gallery, and a password-protected admin panel.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)](https://www.prisma.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwindcss)](https://tailwindcss.com)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://vercel.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## ✨ Key Features

- **Online Table Reservations** — Server Action–powered form with Zod validation, input sanitisation, and automated confirmation emails via Resend.
- **Dynamic Menu** — Categorised menu items sourced from PostgreSQL, with dietary flags (vegetarian, vegan, gluten-free) and featured-item highlights.
- **Photo Gallery** — Admin-managed gallery with Cloudinary image hosting, automatic `c_fill / ar_4:3 / g_auto` transformations, and category filtering.
- **Customer Reviews** — Public review submission with a moderation workflow; approved reviews surface on the homepage via ISR (revalidated every 5 minutes).
- **Admin Dashboard** — Cookie-session–protected panel to manage reservations, reviews, menu items, and the gallery — no external auth service required.
- **Rate Limiting** — Upstash Redis sliding-window limiters protect every public mutation endpoint (5 login attempts / 10 min · 20 submissions / min · 10 uploads / min).
- **Incremental Static Regeneration (ISR)** — Homepage data is cached and revalidated server-side, keeping page loads fast without sacrificing freshness.
- **SEO & Structured Data** — Full `<head>` metadata, Open Graph, Twitter cards, `robots.ts`, `sitemap.ts`, and a `LocalBusiness` JSON-LD schema injected on every page.
- **Security Headers** — `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Referrer-Policy`, and `Permissions-Policy` set globally in `next.config.ts`.
- **Smooth UX** — Framer Motion animations, Lenis smooth-scroll, a macOS-style Dock navigation, and Suspense-powered skeleton loaders throughout.

---

## 🛠 Tech Stack & Architecture

### Core Technologies

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 15](https://nextjs.org) (App Router, React Server Components) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 + vanilla CSS modules |
| **Animation** | Framer Motion 12 + Lenis smooth-scroll |
| **ORM** | Prisma 6 (Prisma Client JS) |
| **Database** | PostgreSQL (Neon / Supabase) |
| **Image Hosting** | Cloudinary (server-side URL transformations) |
| **Email** | Resend (transactional reservation confirmations) |
| **Rate Limiting** | Upstash Redis + `@upstash/ratelimit` (sliding window) |
| **Validation** | Zod |
| **Icons** | Lucide React |
| **Deployment** | Vercel |

### Directory Structure

```
motherland-cafe/
├── prisma/
│   ├── schema.prisma          # PostgreSQL models: Reservation, Review, GalleryImage, MenuCategory, MenuItem
│   └── seed.ts                # Database seed script
├── public/                    # Static assets (images, favicon, OG image)
├── src/
│   ├── app/
│   │   ├── (marketing)/       # Public-facing pages (route group with shared Navbar/Footer layout)
│   │   │   ├── page.tsx       # Homepage — ISR, Suspense streaming for menu & reviews
│   │   │   ├── about/         # About page
│   │   │   ├── menu/          # Full menu with client-side category filtering
│   │   │   ├── gallery/       # Photo gallery with Cloudinary images
│   │   │   ├── reservations/  # Reservation form (Next.js Server Action)
│   │   │   └── contact/       # Contact details & map
│   │   ├── admin/             # Password-protected admin dashboard
│   │   │   ├── page.tsx       # Login / dashboard entry point
│   │   │   ├── reservations/  # Manage & update reservation statuses
│   │   │   ├── reviews/       # Moderate submitted customer reviews
│   │   │   ├── menu/          # CRUD for menu items & categories
│   │   │   └── gallery/       # Upload, reorder & toggle gallery images
│   │   ├── api/
│   │   │   ├── admin/         # Auth endpoints: login, logout, check, stats
│   │   │   ├── reservations/  # GET all reservations; PATCH by ID
│   │   │   ├── reviews/       # GET (admin) / POST (public); PATCH by ID
│   │   │   ├── gallery/       # CRUD gallery images
│   │   │   ├── menu/          # GET categories & items; admin CRUD
│   │   │   └── upload/        # Cloudinary signed-upload signature endpoint
│   │   ├── actions/
│   │   │   └── reservation.ts # createReservation Server Action (Zod + rate limit + Resend)
│   │   ├── layout.tsx         # Root layout: metadata, OG tags, LocalBusiness JSON-LD
│   │   ├── robots.ts          # robots.txt generation
│   │   └── sitemap.ts         # Dynamic XML sitemap
│   ├── components/
│   │   ├── home/              # HeroSection, AboutSnippet, MenuPreview, ReviewsSection, ReservationCTA
│   │   ├── admin/             # AdminLayoutClient — sidebar, auth state management
│   │   └── ui/                # Shared UI: Skeletons, SpotlightCard, AnimatedSection, Dock, etc.
│   ├── config/
│   │   └── cafe.config.ts     # Single source of truth: name, address, hours, socials, SEO URLs
│   ├── lib/
│   │   ├── prisma.ts          # Prisma singleton (dev hot-reload safe)
│   │   ├── cloudinary.ts      # URL transformation helper (auto c_fill / ar_4:3 / g_auto)
│   │   ├── ratelimit.ts       # Upstash Redis limiters: loginLimiter, submissionLimiter, uploadLimiter
│   │   └── sanitize.ts        # Input sanitisation utility
│   └── middleware.ts          # Edge middleware: admin session guard + API auth
├── .env.local.example         # Environment variable template (copy → .env.local)
├── next.config.ts             # Security headers, image optimisation, gzip compression
├── tsconfig.json
└── package.json
```

### Data Models (`prisma/schema.prisma`)

```prisma
model Reservation {
  id              String   @id @default(cuid())
  name            String
  phone           String
  email           String
  guests          Int
  reservationDate String
  reservationTime String
  notes           String?
  status          String   @default("pending")
  createdAt       DateTime @default(now())
}

model Review {
  id         String   @id @default(cuid())
  name       String
  rating     Int
  reviewText String
  source     String   @default("Google")
  status     String   @default("pending")
  createdAt  DateTime @default(now())
}

model GalleryImage {
  id           String  @id @default(cuid())
  imageUrl     String
  title        String
  category     String
  isPublished  Boolean @default(true)
  displayOrder Int     @default(0)
}

model MenuCategory {
  id           String     @id @default(cuid())
  name         String
  displayOrder Int
  items        MenuItem[]
}

model MenuItem {
  id           String       @id @default(cuid())
  categoryId   String
  category     MenuCategory @relation(fields: [categoryId], references: [id])
  name         String
  description  String
  price        Float
  imageUrl     String
  isVegetarian Boolean      @default(false)
  isVegan      Boolean      @default(false)
  isGlutenFree Boolean      @default(false)
  isFeatured   Boolean      @default(false)
  isVisible    Boolean      @default(true)
}
```

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Version / Notes |
|---|---|
| Node.js | ≥ 18.x |
| npm | ≥ 9.x |
| PostgreSQL database | [Neon](https://neon.tech) / [Supabase](https://supabase.com) / self-hosted |
| Cloudinary account | Free tier sufficient |
| Resend account | Free tier sufficient |
| Upstash Redis | Optional — rate limiting degrades gracefully without it |

### 1. Clone the repository

```bash
git clone https://github.com/your-username/motherland-cafe.git
cd motherland-cafe
```

### 2. Install dependencies

```bash
npm install
```

> The `postinstall` script runs `prisma generate` automatically.

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in your values:

```env
# PostgreSQL connection string (Neon, Supabase, or self-hosted)
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

# Resend — transactional emails for reservation confirmations
RESEND_API_KEY="re_your_resend_api_key"
RESEND_FROM_EMAIL="reservations@yourdomain.com"
RESEND_TO_EMAIL="admin@yourdomain.com"

# Public site URL — used for SEO canonical links and Open Graph
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Admin panel password — use a strong, unique value in production
ADMIN_PASSWORD="your_secure_password"

# Cloudinary — required for gallery image uploads
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Upstash Redis — optional, enables sliding-window rate limiting
UPSTASH_REDIS_REST_URL="https://your-upstash-url.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your_upstash_token"
```

### 4. Push the database schema

```bash
npm run db:push
```

### 5. (Optional) Seed the database

Populate with initial menu categories, items, and sample gallery images:

```bash
npm run db:seed
```

### 6. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

---

## 🖥 Usage & Core Endpoints

### Public Pages

| Route | Description |
|---|---|
| `/` | Homepage — Hero, About snippet, Menu preview (ISR), Reviews carousel, Reservation CTA |
| `/menu` | Full categorised menu with client-side dietary/category filtering |
| `/gallery` | Photo gallery with Cloudinary-optimised images |
| `/reservations` | Online table reservation form |
| `/about` | Café story and team |
| `/contact` | Address, phone, map, and social links |

### Admin Panel

Navigate to `/admin` and enter the password from `ADMIN_PASSWORD`. The session is persisted as a secure `admin_session` cookie.

| Admin Route | Description |
|---|---|
| `/admin` | Login + dashboard overview |
| `/admin/reservations` | View, filter, and update reservation statuses |
| `/admin/reviews` | Approve, publish, or delete customer reviews |
| `/admin/menu` | Create, edit, and reorder menu categories and items |
| `/admin/gallery` | Upload images to Cloudinary, adjust display order, toggle visibility |

### REST API Reference

`/api/admin/*` routes require an active `admin_session` cookie. Public `GET` endpoints and `POST /api/reviews` are unauthenticated.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/reservations` | Admin | List all reservations (newest first) |
| `PATCH` | `/api/reservations/[id]` | Admin | Update a reservation's status |
| `GET` | `/api/reviews` | Admin | List all reviews |
| `POST` | `/api/reviews` | Public | Submit a customer review (rate-limited) |
| `PATCH` | `/api/reviews/[id]` | Admin | Approve, publish, or reject a review |
| `GET` | `/api/gallery` | Public | List published gallery images |
| `POST` | `/api/gallery` | Admin | Add a new gallery image record |
| `PATCH` | `/api/gallery/[id]` | Admin | Update image metadata or visibility |
| `DELETE` | `/api/gallery/[id]` | Admin | Remove a gallery image |
| `GET` | `/api/menu/categories` | Public | List all menu categories with items |
| `GET` | `/api/menu/items` | Public | List all visible menu items |
| `POST` | `/api/upload/signature` | Admin | Generate a Cloudinary signed-upload signature |
| `POST` | `/api/admin/login` | — | Authenticate and set session cookie |
| `POST` | `/api/admin/logout` | Admin | Clear the session cookie |
| `GET` | `/api/admin/check` | — | Check whether a valid session cookie exists |
| `GET` | `/api/admin/stats` | Admin | Aggregate dashboard statistics |

### Available npm Scripts

```bash
npm run dev          # Start the Next.js development server
npm run build        # Create a production build
npm run start        # Start the production server
npm run lint         # Run ESLint
npm run db:push      # Push Prisma schema changes to the database
npm run db:seed      # Seed the database with initial data
npm run db:studio    # Open Prisma Studio (browser-based database GUI)
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. **Fork** the repository.
2. **Create** a feature branch: `git checkout -b feat/your-feature-name`
3. **Commit** your changes with a descriptive message: `git commit -m 'feat: add your feature'`
4. **Push** to the branch: `git push origin feat/your-feature-name`
5. **Open** a Pull Request against `main`.

Please ensure your code passes the linter (`npm run lint`) before submitting. For major changes, open an issue first to discuss what you would like to change.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ☕ for <strong>Motherland Cafe</strong>, Kolkata
  <br/>
  <a href="https://motherlandcafe.in">motherlandcafe.in</a> &nbsp;·&nbsp;
  <a href="https://instagram.com/motherland.studios.cafe">Instagram</a> &nbsp;·&nbsp;
  <a href="https://wa.me/919748077790">WhatsApp</a>
</p>
