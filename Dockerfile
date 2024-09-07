# Base block
FROM node:20.17.0-alpine3.20 AS base

ENV DIR /app
WORKDIR $DIR

# Build stage
FROM base AS build

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

COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init
COPY --from=build $DIR/node_modules $DIR/node_modules
COPY --from=build $DIR/dist $DIR/dist
COPY --from=build $DIR/package.json $DIR/package.json
COPY --from=build $DIR/seyfert.config.js $DIR/seyfert.config.js

ENV USER node
ENV NODE_ENV production

# Restricts user permissions
USER $USER

CMD ["dumb-init", "node", "dist/index.js"]