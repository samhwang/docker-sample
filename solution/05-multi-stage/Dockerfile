# Multi-stage build: final slim image carries only dist and production dependencies.
# Build stage installs all deps, then 'pnpm install --prod' prunes development deps.
FROM node:26 AS build

RUN npm install -g pnpm@12

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

RUN pnpm install --frozen-lockfile --prod --ignore-scripts

FROM node:26-slim

WORKDIR /app

COPY --from=build /app/dist ./dist

COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "/app/dist/index.mjs"]
