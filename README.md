# NestJS + NextJS S

## Overview

This monorepo contains:

- Backend: NestJS (apps/backend)
- Frontend: Next.js (apps/frontend)

Package manager: pnpm  
Database: PostgreSQL (via Prisma)

## Prerequisites

- Node.js 18+ (recommended LTS)
- pnpm 8+
- A running PostgreSQL instance and a valid DATABASE_URL

## 1) Install dependencies (workspace root)

```bash
pnpm install
```

## 2) Configure environment (backend)

Copy the example env and adjust values (especially DATABASE_URL).

```bash
cp apps/backend/.env.example apps/backend/.env
```

Example .env content:

```plaintext
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mydb?schema=public"
```

## 3) Initialize database (Prisma)

Generate schema and create/update your database tables. If there are no migrations yet, this will create them.

```bash
pnpm -C apps/backend prisma migrate dev --name init
```

(Optional) Seed the database if your prisma/seed.ts sets up initial data.

```bash
pnpm -C apps/backend db:seed
```

## 4) Run the backend (NestJS)

Starts the API server with file watching.

```bash
pnpm start:backend
```

- Base URL: http://localhost:3001
- Global API prefix: /api (e.g., http://localhost:3001/api)
- Swagger UI: http://localhost:3001/api
- Scalar API Reference: http://localhost:3001/scalar

## 5) Run the frontend (Next.js)

Starts the Next.js dev server.

```bash
pnpm start:frontend
```

- Frontend URL: http://localhost:3000
- API calls: frontend uses a Next.js rewrite from /api to http://localhost:3001/api (no extra config needed for local dev)

## Build commands

Build backend:

```bash
pnpm build:backend
```

Build frontend:

```bash
pnpm build:frontend
```

## Lint and format

Lint both apps:

```bash
pnpm lint
```

Auto-fix lint (targets apps/\* for .ts/.tsx):

```bash
pnpm lint:fix
```

Format code with Prettier:

```bash
pnpm format
```

## Troubleshooting

- Port conflicts:
  - Backend: 3001 by default (set PORT in apps/backend/.env to override)
  - Frontend: 3000 by default (set PORT when running Next.js if needed)
- CORS: Not an issue in dev since Next.js proxies /api to the backend.
- Auth: Backend uses JWT guard; ensure your seed or signup/login flow creates a user to obtain a token.
