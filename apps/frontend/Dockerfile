# ---------------- Base ----------------
FROM node:22-bookworm-slim AS base
WORKDIR /app
RUN corepack enable

# ---------------- Builder ----------------
FROM base AS builder
WORKDIR /app


COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/frontend/package.json apps/frontend/


RUN pnpm install  --frozen-lockfile


COPY apps/frontend ./apps/frontend


WORKDIR /app/apps/frontend
RUN pnpm build

# ---------------- Runtime ----------------
FROM base AS runner
WORKDIR /app/apps/frontend

COPY apps/frontend/package.json ./


RUN pnpm install --prod


COPY --from=builder /app/apps/frontend/.next ./.next
COPY --from=builder /app/apps/frontend/public ./public
COPY apps/frontend/next.config.mjs ./

EXPOSE 3000
CMD ["pnpm", "start"]
