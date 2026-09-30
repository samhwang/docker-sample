# Docker Sample app

## Quick Start

```shell
pnpm install
cp .env.sample .env
```

## Prerequisites

- Docker Desktop (`docker --version`).
- Node v26 per `.nvmrc`.
- pnpm version from `packageManager` in `package.json`.

## Concepts

- Image: blueprint with code, dependencies, config.
- Container: running image instance, isolated process.
- Layers: stacked image segments, cached by Docker until changed.
- `-p host:container`: map ports from host to container.
- `--name`: human-readable container name for logs, exec, stop, rm.

## Exercise

### Docker process

- [ ] Create a `.dockerignore` file. Exclude `node_modules` (macOS binaries won't work in Linux) and `.env` (secrets).
- [ ] Write a Dockerfile to build this Hono app. What must the image contain for `node dist/index.mjs` to run? (Hint: where does pnpm come from; what runtime deps are needed?)

```shell
docker build -t docker-sample-app .
```

- [ ] Run the image as a container.

```shell
docker run -p 3000:3000 --name sample docker-sample-app
```

- [ ] Test. App listens on port 3000: `curl http://localhost:3000/api/hello` or browser.
- [ ] Tear down.

```shell
docker stop sample
docker rm sample
```

### Docker Compose

- [ ] Write `docker-compose.yml` with `db` (PostgreSQL) and `app` (this service).
  - `db` must publish port 5432 (migrate and seed run from the host, not in a container).
  - Override `POSTGRES_HOST` via compose `environment:`, not by editing `.env`.
  - Use `depends_on` with `condition: service_healthy` and a healthcheck for the `db` service.
- [ ] Build and start with `docker compose up --build`.

```shell
docker compose up -d db
pnpm run drizzle:migrate:dev
pnpm run seed
docker compose up app
```

- [ ] Test `/api/hello`: `curl http://localhost:3000/api/hello` returns `Hello, World!`.
- [ ] Test `/api/users`: `curl http://localhost:3000/api/users` returns JSON array of 10 users (`id`, `name`, `createdAt`, `updatedAt`) after seed.

Troubleshooting: if `/api/users` fails, check POSTGRES_HOST. Containers in the same network call each other by service name, not `localhost`. `localhost` inside the container means the container itself.

## Debugging

- `docker ps`: list running containers.
- `docker logs <container-name>`: view container output.
- `docker exec -it <container-name> sh`: open a shell inside a container.
- `docker images`: list images.
- `docker history <image-name>`: show layers and their sizes.

### Advanced

- [ ] Build image under 200 MB. Use multi-stage builds and minimal base image (not `node:latest`).
- [ ] Test layer caching: edit `src/app.ts`, rebuild. The pnpm install layer must be skipped (not re-run).
- [ ] Run `docker exec sample whoami` in a running container. Should not be `root`.
- [ ] Final stage contains no devDependencies. Check with `docker run docker-sample-app sh -c 'ls node_modules'` (no `@types`, no `vitest`, etc).
- [ ] Persist database data across `docker compose down` / `up` using a bind mount to `./.docker/postgres/data`. Steps: seed DB, run compose, `docker compose down`, `docker compose up`. Users table persists. Reset: `docker compose down`, `rm -rf ./.docker/postgres/data`, `docker compose up`. Users table is empty.

### Tear down

```shell
docker compose down
```

`-v` removes named volumes only; bind mount data persists until you delete the folder (`rm -rf ./.docker/postgres/data`).

## References

- [Docker Node.js official guide](https://docs.docker.com/guides/nodejs/)
- [Docker build best practices](https://docs.docker.com/build/building/best-practices/)
- [Docker build cache](https://docs.docker.com/build/cache/)
- [Dockerfile syntax](https://docs.docker.com/reference/dockerfile/)
- [Docker Compose syntax](https://docs.docker.com/reference/compose-file/)
