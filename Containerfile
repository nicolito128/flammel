FROM node:lts-alpine AS base
ENV DIR=/flammel
WORKDIR $DIR

FROM base AS pkg
RUN apk update && apk add --no-cache dumb-init

FROM base AS build
COPY package*.json ./

RUN npm ci 

COPY tsconfig.json ./
COPY seyfert.config.mjs ./
COPY /src ./src

RUN npm run build

RUN npm prune --omit=dev

FROM base AS production

COPY --from=pkg /usr/bin/dumb-init /usr/bin/dumb-init
COPY --from=build $DIR/node_modules ./node_modules
COPY --from=build $DIR/dist ./dist
COPY --from=build $DIR/package.json ./package.json
COPY --from=build $DIR/seyfert.config.mjs ./seyfert.config.mjs

ENV NODE_ENV=production
ENV USER=node
USER $USER

ENTRYPOINT ["dumb-init", "node", "dist/index.js"]