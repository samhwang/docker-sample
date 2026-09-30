# Layer caching: copy lock files first, install deps, then copy source. Reuse install layer when code changes.
FROM node:26

RUN npm install -g pnpm@12

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

EXPOSE 3000

CMD ["node", "/app/dist/index.mjs"]
