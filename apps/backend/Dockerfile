# ---------------- Base ----------------
FROM node:22-bookworm-slim AS base
WORKDIR /app
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
RUN corepack enable

# ---------------- Builder ----------------
FROM base AS builder
WORKDIR /app

# Copy manifests first (better caching)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json apps/backend/

# Install deps (include dev for Prisma CLI)
RUN pnpm install

# Copy Prisma schema first
COPY apps/backend/prisma ./apps/backend/prisma
RUN pnpm prisma generate

# Copy entire backend source (tsconfig.json, src/, etc.)
COPY apps/backend ./apps/backend

# Build backend (NestJS -> dist)
WORKDIR /app/apps/backend
RUN pnpm build

# ---------------- Runtime ----------------
FROM base AS runner
WORKDIR /app/apps/backend

# Install only production deps
COPY package.json ../../
RUN pnpm install --prod

# Copy built backend
COPY --from=builder /app/apps/backend/dist ./dist

# Copy generated Prisma client
COPY --from=builder /app/node_modules/.pnpm/node_modules/@prisma/client ./node_modules/@prisma/client

# Copy Prisma schema (needed at runtime for migrations)
COPY apps/backend/prisma ./prisma

EXPOSE 3001
CMD ["node", "dist/main.js"]
