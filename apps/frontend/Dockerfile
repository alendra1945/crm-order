# ---------------- Base ----------------
FROM node:22-bookworm-slim AS base
WORKDIR /app
RUN corepack enable

# ---------------- Builder ----------------
FROM base AS builder
WORKDIR /app

# Copy manifests
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/frontend/package.json apps/frontend/

# Install deps
RUN pnpm install  --frozen-lockfile

# Copy frontend source
COPY apps/frontend ./apps/frontend

# Build frontend
WORKDIR /app/apps/frontend
RUN pnpm build

# ---------------- Runtime ----------------
FROM base AS runner
WORKDIR /app/apps/frontend

# Copy only frontend package.json (not root)
COPY apps/frontend/package.json ./

# Install only production deps for frontend
RUN pnpm install --prod

# Copy built Next.js app
COPY --from=builder /app/apps/frontend/.next ./.next
COPY --from=builder /app/apps/frontend/public ./public
COPY apps/frontend/next.config.mjs ./

EXPOSE 3000
CMD ["pnpm", "start"]
