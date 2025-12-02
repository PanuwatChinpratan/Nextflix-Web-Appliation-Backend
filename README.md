# Nextflix API Gateway (NestJS + Prisma + MongoDB)

API gateway that fronts TMDB, exposes movie endpoints for the Next.js client, and offers a favorites store backed by Prisma (MongoDB) with an in-memory fallback.

## Quick start

1) Install deps
```bash
npm install
```
2) Configure env
```bash
cp .env.example .env
# set TMDB_API_KEY and DATABASE_URL (Mongo connection string)
```
3) Generate Prisma client
```bash
npx prisma generate
```
4) Run locally (port defaults to 4000)
```bash
npm run start:dev
```

## API surface

- `GET /movies/trending?page=1` – trending today (proxied TMDB)
- `GET /movies/popular?page=1` – popular picks
- `GET /movies/search?query=devil&page=1` – text search
- `GET /movies/:id` – detail
- `GET /favorites?userId=guest` – list saved titles (uses Mongo if configured, otherwise in-memory)
- `POST /favorites` – upsert favorite `{ userId, movieId, title, posterUrl? }`
- `DELETE /favorites/:movieId?userId=guest` – remove favorite
- `GET /health` – service heartbeat

Swagger docs live at `http://localhost:4000/docs`.

## Notes

- Frontend calls this API only; it never talks to TMDB directly.
- CORS is open to `FRONTEND_URL` (defaults to `http://localhost:3000`). Adjust `CORS_ORIGINS` for additional origins.
- Prisma is configured for MongoDB. When `DATABASE_URL` is unset, favorites gracefully fall back to an in-memory store so the UI keeps working without a database.
