# Docker Sample app

## Quick Start

```shell
pnpm install
cp .env.sample .env
```

## Exercise

### Docker process

- Write a simple Dockerfile to build this Hono app into a Docker image
  - To build and run this app in prod, this app needs to be built using this script. How can you put this in the Dockerfile?
  ```shell
  pnpm run build
  node dist/index.mjs
  ```
- Run this image into a Docker Container

```shell
docker build -t docker-sample-app .
docker run -p 3000:3000 --name sample docker-sample-app
```

App should live at port 3000. You should be able to run `curl http://localhost:3000/api/hello` or visit the URL in the browser.

Now tear down.

```shell
docker stop sample
docker rm sample
```

### Docker Compose

- Write docker-compose file that can boot up both this app and a postgres db.
- When done, App should live at port 3000. You should be able to run `curl http://localhost:3000/api/hello` or visit the URL in the browser.

- Trick question: when run in the current state, this app will fail at the `/api/users` route. Try to find the error and fix it.
  - Hint: service containers in the same docker network calls each other by service name, not `localhost`. The `localhost` will be
    the `localhost` within the container.

```shell
docker compose up -d db
pnpm run drizzle:migrate:dev
pnpm run seed
docker compose up app
```

### Advanced

A "production-ready" Docker image has to be lean & runs only 1 thing. It should also be fast
to build.

Explore the ways to improve your current Docker setup. Keywords & articles to look for:

- Layer caching & layer ordering
- Multi-stage builds
- Minimal base image
- Docker ignore (similar to Git ignore)
- Volume & persistence
- Non-root users

### Tear down

```shell
docker compose down -v
```

## References

- [Docker Node.js official guide](https://docs.docker.com/guides/nodejs/)
- [Docker build best practices](https://docs.docker.com/build/building/best-practices/)
- [Docker build cache](https://docs.docker.com/build/cache/)
- [Dockerfile syntax](https://docs.docker.com/reference/dockerfile/)
- [Docker Compose syntax](https://docs.docker.com/reference/compose-file/)
