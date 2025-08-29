# ---------------- Base ----------------
FROM node:22-bookworm AS base
WORKDIR /app
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
RUN corepack enable



# ---------------- Builder ----------------
FROM base AS builder
WORKDIR /app


COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json apps/backend/

COPY apps/backend/prisma ./apps/backend/prisma

RUN pnpm install  --frozen-lockfile


COPY apps/backend ./apps/backend

WORKDIR /app/apps/backend
RUN pnpm build

# ---------------- Runtime ----------------
FROM base AS runner
WORKDIR /app/apps/backend

COPY apps/backend/package.json ./

COPY apps/backend/prisma ./prisma

RUN pnpm install --prod

# Copy built artifacts
COPY --from=builder /app/apps/backend/dist ./dist

EXPOSE 3001
CMD ["node", "dist/src/main.js"]
