# Brutalist SaaS

A full-stack TypeScript SaaS starter built with React, Vite, Express, tRPC, Drizzle ORM, and MySQL.

This repository is best understood as a **developer template / starter kit** for building premium SaaS products. It already includes a polished landing page, backend foundation, database schema, shared typing, and room to grow into a real subscription-based product.

## Repository Classification

This project is currently strongest as a:

- Full-stack SaaS starter
- Developer boilerplate
- Portfolio-ready template
- Foundation for MVPs and internal tools

It is **not** yet a fully finished production SaaS out of the box. Some features are implemented, while others are scaffolded and still need wiring, polish, or product-specific customization.

## What This Project Includes

- React 19 frontend powered by Vite
- Express server with tRPC API setup
- Drizzle ORM schema and migration files for MySQL
- Shared constants and types between frontend and backend
- Premium "brutalist luxury" marketing UI
- Authentication/session foundation
- Subscription, admin, and security-oriented schema design
- Extra helper modules for storage, notifications, AI, maps, and voice transcription

## Current Status

What is in good shape today:

- Frontend project structure
- Reusable UI component system
- Landing-page experience
- Backend server bootstrap
- OAuth/session plumbing
- Database schema foundation
- Setup and roadmap documentation

What still needs product-specific work:

- Finishing and wiring all planned routers into the live app
- Real billing integration
- Email delivery flows
- End-to-end production hardening
- Product-specific dashboard/application screens

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, Framer Motion, Wouter
- Backend: Node.js, Express, tRPC, Zod
- Database: MySQL, Drizzle ORM, Drizzle Kit
- State/Data: TanStack Query, Zustand, SuperJSON
- UI: shadcn/ui, Radix UI, Lucide
- Tooling: pnpm, Vitest, Prettier, esbuild, tsx

## Project Structure

```text
client/    Frontend application
server/    Express + tRPC backend
shared/    Shared constants, errors, and types
drizzle/   Database schema and migrations
patches/   Local dependency patches
```

More specifically:

- `client/src/components`: reusable sections and UI wrappers
- `client/src/pages`: page-level screens
- `client/src/lib`: frontend utilities and tRPC client setup
- `server/_core`: backend runtime, auth/session glue, env, Vite serving, service helpers
- `server/routers`: feature-oriented backend routers
- `drizzle/schema.ts`: core database tables

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Create environment variables

Copy `.env.example` to `.env` and fill in the values for your environment.

### 3. Configure the database

Make sure MySQL is running and `DATABASE_URL` is valid, then run:

```bash
pnpm db:push
```

### 4. Start the app

```bash
pnpm dev
```

### Build for production

```bash
pnpm build
pnpm start
```

## Available Scripts

- `pnpm dev` - start the development server
- `pnpm build` - build frontend and backend output
- `pnpm start` - run the production build
- `pnpm check` - TypeScript type-check
- `pnpm test` - run backend tests with Vitest
- `pnpm format` - format the codebase with Prettier
- `pnpm db:push` - generate and apply Drizzle migrations

## Environment Variables

See `.env.example` for the full list. The main ones are:

- `DATABASE_URL`
- `JWT_SECRET`
- `VITE_APP_ID`
- `VITE_OAUTH_PORTAL_URL`
- `OAUTH_SERVER_URL`
- `OWNER_OPEN_ID`
- `BUILT_IN_FORGE_API_URL`
- `BUILT_IN_FORGE_API_KEY`

## Notes For Windows Users

The current npm scripts use shell-style environment assignment. If you run into issues in Windows PowerShell or CMD, use Git Bash / WSL or adjust the scripts for your shell.

## Best Use Cases

This starter is a good fit for:

- SaaS MVPs
- B2B dashboards
- Premium product landing pages with future login/paywall support
- AI tools with account systems
- Agency/client portal foundations
- Portfolio projects that demonstrate full-stack architecture

## Suggested Positioning On GitHub / LinkedIn

Present this repo as a:

- Full-stack SaaS starter template
- React + Express + tRPC + Drizzle boilerplate
- Premium SaaS foundation

That positioning is more accurate than calling it a fully completed production SaaS.

## License

MIT
