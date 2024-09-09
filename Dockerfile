# Base block
FROM node:lts-alpine AS base

ENV DIR /app
WORKDIR $DIR

# Build stage
FROM base AS builder

RUN apk update && apk add --no-cache dumb-init

COPY package*.json ./

RUN npm ci

COPY tsconfig.json ./
COPY seyfert.config.js ./

COPY /src ./src

RUN npm run build && \
    npm prune --production

# Production ready stage
FROM base AS production

COPY --from=builder /usr/bin/dumb-init /usr/bin/dumb-init
COPY --from=builder $DIR/node_modules $DIR/node_modules
COPY --from=builder $DIR/dist $DIR/dist
COPY --from=builder $DIR/package.json $DIR/package.json
COPY --from=builder $DIR/seyfert.config.js $DIR/seyfert.config.js

ENV USER node
ENV NODE_ENV production

USER $USER

CMD ["dumb-init", "node", "dist/index.js"]