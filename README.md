# Nayak Labs — Official Web Platform

> Production website for **Nayak Labs** — an independent software studio based in Bengaluru building software platforms, engineering services, and technical academies.

---

## 🌟 Overview & Highlights

- **Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with a curated Dark/Light theme token architecture and Swiss editorial typography (*Outfit*, *Plus Jakarta Sans*, *JetBrains Mono*).
- **Motion & Kinetic Choreography**: [GSAP](https://greensock.com/gsap/) with `ScrollTrigger` and [Lenis Smooth Scroll](https://lenis.darkroom.engineering/).
- **3D Interactive Graphics**: Real-time 3D canvas rendering ([Cobe](https://github.com/shuding/cobe) and [Three.js / React Three Fiber](https://r3f.docs.pmnd.rs/)).
- **Ambient Audio Engine**: Generative Web Audio API atmospheric soundscape with user audio controls.
- **SEO & Social Optimization**: Dynamic `SEOHead`, OpenGraph metadata, JSON-LD Schema.org structured data graph, `sitemap.xml`, and `robots.txt`.
- **Multi-Device Responsive**: Unified experience across Mobile (touch snap deck), Tablet (Swiss lookbook grid), and Desktop/Laptop/TV (interactive 3D pinned workbench).

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) `>= 18.0.0`
- [npm](https://www.npmjs.com/) `>= 9.0.0`

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/ZaLuLu/RandomTest.git nayaklabs-site
cd nayaklabs-site
npm install
```

### 2. Local Development
Start the local Vite development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build
Compile and bundle the optimized static production application:
```bash
npm run build
```
The output will be generated in the `dist/` directory.

### 4. Local Production Preview
Preview the production build locally:
```bash
npm run preview
```

---

## 📁 Project Structure

```
nayaklabs-site/
├── public/                     # Static production assets served at root
│   ├── images/peeps/           # Floor avatar sprite textures
│   ├── social-posts/           # Instagram dispatches educational slides & manifest
│   ├── _redirects              # SPA routing fallback for Netlify & Cloudflare Pages
│   ├── robots.txt              # Search engine crawler permissions
│   ├── sitemap.xml             # XML sitemap for SEO indexing
│   ├── Nayaklabs_Logo.jpeg     # Official brandmark & favicon
│   └── NayakLabs.png           # High-resolution social preview image
├── src/
│   ├── assets/                 # Bundled static assets
│   ├── components/             # Reusable UI & section components
│   │   ├── academics/          # Interactive curriculum terminal
│   │   ├── intro/              # Cinematic desktop intro sequence & HUD
│   │   ├── pillars/            # Act 2 interactive division cards (P, S, A)
│   │   ├── products/           # Algorithm visualizer (DI Notes) & 3D event radar
│   │   ├── seo/                # Dynamic SEO head & OpenGraph injector
│   │   ├── services/           # Interactive architecture preview & scope estimator
│   │   ├── ui/                 # Canvas background, target cursor, border beams, loops
│   │   ├── About.tsx           # Studio manifesto & telemetry stats
│   │   ├── Contact.tsx         # Direct founder contact channels & clipboard copy
│   │   ├── Footer.tsx          # Comprehensive site footer & direct links
│   │   ├── Hero3D.tsx          # Canonical responsive hero workbench
│   │   ├── Navbar.tsx          # Responsive floating navbar with mobile drawer
│   │   ├── SocialMediaSection.tsx # Autoscrolling engineering dispatches carousel
│   │   └── WhyChooseUs.tsx     # Delivery blueprint & execution milestones
│   ├── data/                   # Structured static data & JSON-LD schema graphs
│   ├── pages/                  # Page routes (Products, Services, Academics, Coming Soon)
│   ├── utils/                  # Audio engine, theme context, device profile hooks
│   ├── App.tsx                 # Core application layout & routing table
│   ├── index.css               # Global theme tokens, typography, glass panels
│   └── main.tsx                # React application entrypoint
├── SYSTEM_ARCHITECTURE_AND_DESIGN_GUIDE.md # Design system tokens & typography spec
├── WEBSITE_CONTENT_MASTER.md   # Copywriting specification & parameter limits guide
├── index.html                  # HTML shell with synchronous theme FOUC prevention
├── package.json                # Project dependencies & scripts
├── tailwind.config.js          # Tailwind CSS theme extension
├── tsconfig.json               # TypeScript configuration
├── vercel.json                 # SPA routing rewrites for Vercel
└── vite.config.ts              # Vite bundler configuration
```

---

## 🌐 Deployment Guide

This project is a high-performance **Single Page Application (SPA)** ready to be deployed instantly on any major static hosting provider or custom domain:

### Deploying to Vercel
1. Import this repository into [Vercel](https://vercel.com/).
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. The bundled [`vercel.json`](./vercel.json) handles client-side route rewrites automatically.

### Deploying to Cloudflare Pages / Netlify
1. Connect the repository in the provider dashboard.
2. Build Command: `npm run build`.
3. Output Directory: `dist`.
4. The bundled [`public/_redirects`](./public/_redirects) automatically ensures that reloading routes like `/products` or `/services` routes cleanly without 404s.

### Custom Domain DNS Configuration
To link your custom domain (e.g. `nayaklabs.com`):
- **Apex domain (`@`)**: Point an `A` record to your hosting provider's IP address (or `CNAME` flattening).
- **Subdomain (`www`)**: Point a `CNAME` record to your provider hostname.

---

## 📝 Content Updates & Customization

- **Copywriting**: Refer to [`WEBSITE_CONTENT_MASTER.md`](./WEBSITE_CONTENT_MASTER.md) for character limits, formatting guidelines, and section-by-section copywriting instructions.
- **Design Tokens & Colors**: Refer to [`SYSTEM_ARCHITECTURE_AND_DESIGN_GUIDE.md`](./SYSTEM_ARCHITECTURE_AND_DESIGN_GUIDE.md) for color tokens, typography scales, and motion specifications.
- **Social Posts**: Drop new slide images in `public/social-posts/` and update `public/social-posts/manifest.json`.

---

## 📄 License & Attribution

© 2026 Nayak Labs. All rights reserved. Built with precision in Bengaluru, India.
