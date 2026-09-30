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

- [ ] Build image under 100 MB CONTENT SIZE (~450 MB DISK USAGE); well under naive baseline. Use multi-stage builds, minimal base image (not `node:latest`).
- [ ] Test layer caching: edit `src/app.ts`, rebuild. The pnpm install layer must be skipped (not re-run).
- [ ] Run `docker exec sample whoami` in a running container. Should not be `root`.
- [ ] Final stage contains no devDependencies. Dev packages can linger in `.pnpm`; check with `docker run --rm --entrypoint sh docker-sample-app -c 'ls /app/node_modules/.pnpm | grep -ci vitest'` (must print 0).
- [ ] Persist database data across `docker compose down` / `up` using a bind mount to `./.docker/postgres/data`. Steps: seed DB, run compose, `docker compose down`, `docker compose up`. Users table persists. Reset: `docker compose down`, `rm -rf ./.docker/postgres/data`, `docker compose up`. Users table is empty.

### Check your work

- `docker images` — which column is DISK USAGE vs CONTENT SIZE.
- `docker image inspect docker-sample-app --format '{{.Size}}'` — exact bytes on disk.
- `docker history docker-sample-app` — per-layer sizes; base image dominates.
- `docker run --rm --entrypoint sh docker-sample-app -c 'ls /app/node_modules/.pnpm | grep -ci vitest'` — must print 0.
- `docker run --rm --entrypoint sh docker-sample-app -c 'du -sh /app/node_modules'` — total size.
- `docker exec sample whoami` — should not be `root`.

### Tear down

```shell
docker compose down
```

`-v` removes named volumes only; bind mount data persists until you delete the folder (`rm -rf ./.docker/postgres/data`).

## References

### Images & Tags

- [Docker Hub `node` official image](https://hub.docker.com/_/node): tags (versions), slim/alpine variants, corepack behaviour in newer Node.
- [Docker Hub `postgres` official image](https://hub.docker.com/_/postgres): tags, environment variables (POSTGRES_USER/PASSWORD/DB), PGDATA location (Postgres 18+ change), data persistence.

### Dockerfile & Build

- [Dockerfile syntax](https://docs.docker.com/reference/dockerfile/): reference for instructions (FROM, RUN, COPY, EXPOSE, CMD, USER, HEALTHCHECK).
- [Docker Node.js official guide](https://docs.docker.com/guides/nodejs/): writing Node Dockerfiles, best practices for this platform.
- [Docker build best practices](https://docs.docker.com/build/building/best-practices/): layer caching, ordering, minimal base images, non-root users, .dockerignore.
- [Docker build cache](https://docs.docker.com/build/cache/): how Docker caches layers, cache invalidation, optimisation.
- [Multi-stage builds](https://docs.docker.com/build/building/multi-stage/): reducing image size by excluding dev dependencies.

### Docker Compose & Orchestration

- [Docker Compose file reference](https://docs.docker.com/reference/compose-file/): service definition, depends_on, healthcheck, environment, volumes, ports, networks.
- [Storage & volumes](https://docs.docker.com/storage/volumes/): bind mounts vs named volumes, persistence, data ownership.
- [Container networking](https://docs.docker.com/network/): service name DNS resolution, container-to-container communication.
