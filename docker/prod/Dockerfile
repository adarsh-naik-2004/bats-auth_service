# syntax=docker/dockerfile:1

ARG NODE_VERSION=21.7.1

# ---------- BUILDER STAGE ----------
FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /home/node/app

# Install dependencies with cache and bind mounts
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

# Copy remaining app files and build
COPY . .

RUN npm run build

# ---------- RUNNER STAGE ----------
FROM node:${NODE_VERSION}-alpine AS runner

USER node

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

ENV NODE_ENV=production

# Install production dependencies
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev --ignore-scripts

# Copy build artifacts from builder stage
COPY --from=builder --chown=node:node /home/node/app/dist ./
COPY --from=builder --chown=node:node /home/node/app/package.json ./
COPY --from=builder --chown=node:node /home/node/app/package-lock.json ./
COPY --from=builder --chown=node:node /home/node/app/public ./public

EXPOSE 5501

CMD ["node", "src/server.js"]
