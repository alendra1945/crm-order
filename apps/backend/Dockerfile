FROM node:22-bookworm-slim

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN pnpm cache clean --force
RUN pnpm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Generate Prisma Client code
RUN pnpm dlx prisma generate

# Expose the port the app runs on, here, I was using port 3333
EXPOSE 3333

# Command to run the app
CMD [  "pnpm", "start" ]
