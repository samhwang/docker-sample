# Multi-stage build: pnpm --prod reinstall leaves dev packages in node_modules/.pnpm,
# so a separate prod-deps stage keeps them out of the final image.
FROM node:26 AS build

RUN npm install -g pnpm@12

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

FROM node:26-slim AS prod-deps

RUN npm install -g pnpm@12

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile --prod --ignore-scripts

FROM node:26-slim

WORKDIR /app

COPY --from=build /app/dist ./dist

COPY --from=prod-deps /app/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "/app/dist/index.mjs"]
