# Non-root user for security. Runs as node user, chown app directories to node ownership.
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

COPY --from=build --chown=node:node /app/dist ./dist

COPY --from=build --chown=node:node /app/node_modules ./node_modules

USER node

EXPOSE 3000

CMD ["node", "dist/index.mjs"]
