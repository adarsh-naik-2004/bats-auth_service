# syntax=docker/dockerfile:1

FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies using legacy-peer-deps to bypass conflicts
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy the entire project (including src, public, keys, .env.dev, etc.)
COPY . .

# Build the project (this runs your build script which copies public, keys, and .env.dev to dist)
RUN npm run build

FROM node:18-alpine AS production

ENV NODE_ENV=production

WORKDIR /app

# Copy package files and install production dependencies with legacy-peer-deps flag and ignoring scripts
COPY package*.json ./
RUN npm ci --ignore-scripts --legacy-peer-deps

# Copy built files (including public, keys, .env.dev, logs, etc.) from the builder stage
COPY --from=builder /app/dist ./

EXPOSE 7373

# Since your built structure has src/server.js relative to /app,
# we run the server with:
CMD ["node", "src/server.js"]
