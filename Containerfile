# [ base ] #
FROM node:lts-alpine AS base

ENV DIR /flammel
WORKDIR $DIR

# [ OS packages ] #
FROM base AS pkg

RUN apk update && apk add --no-cache dumb-init

# [ project builder ] #
FROM base AS build

COPY package*.json ./

RUN npm ci
RUN npm prune --production
RUN npm i -g typescript
RUN npm i @types/node

COPY tsconfig.json ./
COPY seyfert.config.mjs ./
COPY /src ./src

## Build typescript
RUN tsc --project tsconfig.json

# [ production ready ] #
FROM base AS production

# Joining stages
## Packages
COPY --from=pkg /usr/bin/dumb-init /usr/bin/dumb-init
## Dependencies
COPY --from=build $DIR/node_modules ./node_modules
## Builder
COPY --from=build $DIR/dist ./dist
COPY --from=build $DIR/package.json ./package.json
COPY --from=build $DIR/seyfert.config.mjs ./seyfert.config.mjs

# Environment permissions
ENV NODE_ENV production
## Remove if your project needs root permissions
ENV USER node
USER $USER

# Run the application
ENTRYPOINT ["dumb-init", "node", "dist/index.js"]
