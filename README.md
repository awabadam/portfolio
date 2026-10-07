# awab.design

The studio site and business platform of Awab Elkhalil, a designer and developer based in Istanbul. It covers the public portfolio, the lead pipeline behind it and the admin tools that run it.

**Live:** [awab.design](https://www.awab.design)

## Features

**Public site**
- Four locales: English, Arabic (RTL), Turkish and French
- Project case studies, services and a blog
- A pricing page with an interactive quote calculator and region-specific pricing (international, Arabic markets, and native Turkish lira)
- Three.js hero visuals with Lenis smooth scrolling and Framer Motion transitions
- Structured data (JSON-LD), a generated sitemap and per-locale metadata for SEO
- Contact form with email notifications and a thank-you conversion page

**AI assistant**
- A live chat assistant that answers questions about services and pricing from a curated knowledge base
- Runs over a WebSocket server attached to a custom Node server, with models served through OpenRouter
- Conversations are stored and can be reviewed or exported from the admin panel

**Admin panel**
- Dashboard, project and blog management
- Lead inbox for contact, quote and chat leads
- AI-assisted blog drafts generated on a scheduled job
- Site settings

## Tech stack

- [Next.js](https://nextjs.org/) (App Router) and TypeScript, served by a custom `server.ts` for WebSockets
- [Drizzle ORM](https://orm.drizzle.team/) on Postgres ([Neon](https://neon.tech/))
- [Better Auth](https://www.better-auth.com/) for the admin login
- [next-intl](https://next-intl.dev/) for i18n and RTL
- [Tailwind CSS](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/) and [shadcn/ui](https://ui.shadcn.com/)
- [React Three Fiber](https://r3f.docs.pmnd.rs/), [Framer Motion](https://www.framer.com/motion/) and [Lenis](https://lenis.darkroom.engineering/)
- Nodemailer for transactional email

## Getting started

```bash
git clone https://github.com/awabadam/portfolio.git
cd portfolio
npm install
# create .env.local with the variables below
npm run db:migrate
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=change-me npx tsx scripts/create-admin.ts
npm run dev
```

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Postgres connection string |
| `NEXT_PUBLIC_SITE_URL` | Public base URL |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Used by `scripts/create-admin.ts` to create or reset the admin user |
| `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `RECIPIENT_EMAIL` | SMTP settings for contact and lead notifications |
| `OPENROUTER_KEY` | Chat assistant and blog drafts |
| `PEXELS_API_KEY` | Stock imagery for blog drafts |
| `CRON_SECRET` | Protects the scheduled blog-draft endpoint |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp contact links |

| Command | Description |
|---------|-------------|
| `npm run dev` | Custom server with Next.js and WebSockets |
| `npm run build` / `npm run start` | Production build and server |
| `npm run db:generate` / `npm run db:migrate` | Drizzle migrations |
| `npm run db:studio` | Drizzle Studio |

## Author

**Awab Elkhalil** · [awab.design](https://www.awab.design) · [LinkedIn](https://linkedin.com/in/awab-adam)

This repository is shared as a portfolio piece. The design, copy and imagery are not licensed for reuse.
