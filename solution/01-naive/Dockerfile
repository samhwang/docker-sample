# Naive: copy everything, install, build. No layer caching or optimisations.
FROM node:26

RUN npm install -g pnpm@12

WORKDIR /app

COPY . .

RUN pnpm install

RUN pnpm run build

EXPOSE 3000

CMD ["node", "/app/dist/index.mjs"]
