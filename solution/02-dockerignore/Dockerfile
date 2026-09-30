# Use .dockerignore to exclude build artifacts and dev files. Reduces build context size.
FROM node:26

RUN npm install -g pnpm@12

WORKDIR /app

COPY . .

RUN pnpm install

RUN pnpm run build

EXPOSE 3000

CMD ["node", "/app/dist/index.mjs"]
