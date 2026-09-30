# Smaller base image. Slim variant removes unnecessary system packages, reducing image size.
FROM node:26-slim

RUN npm install -g pnpm@12

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

EXPOSE 3000

CMD ["node", "dist/index.mjs"]
