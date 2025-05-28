# syntax=docker/dockerfile:1

ARG NODE_VERSION=21.7.1

# ---------- BUILDER STAGE ----------
FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /home/node/app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---------- RUNNER STAGE ----------
FROM node:${NODE_VERSION}-alpine AS runner

USER node
WORKDIR /home/node/app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm set-script prepare "" && npm ci --omit=dev

COPY --from=builder --chown=node:node /home/node/app/dist ./dist
COPY --from=builder --chown=node:node /home/node/app/public ./public

EXPOSE 5501

CMD ["node", "dist/server.js"]
