# Docker Sample app

## Quick Start

```shell
pnpm install
cp .env.sample .env
```

## Excercise

### Docker process

- Write a simple Dockerfile to build this Hono app into a Docker image
- Run this image into a Docker Container

```shell
docker build -t docker-sample-app .
docker run docker-sample-app
```

### Docker Compose

- Write docker-compose file that can boot up both this app and a postgres db

```shell
docker compose up -d db
pnpm run drizzle:migrate:dev
pnpm run drizzle:seed
docker compose up app
```

### Advanced

A "production-ready" Docker image has to be lean & runs only 1 thing. It should also be fast
to build.

Explore the ways to improve your current Docker file. Keywords & articles to look for:

- Layer caching
- Multi-stage builds
- Minimal base image

## References

- [Docker Node.js official guide](https://docs.docker.com/guides/nodejs/)
- [Docker build best practices](https://docs.docker.com/build/building/best-practices/)
- [Docker build cache](https://docs.docker.com/build/cache/)
- [Dockerfile syntax](https://docs.docker.com/reference/dockerfile/)
- [Docker Compose syntax](https://docs.docker.com/reference/compose-file/)
