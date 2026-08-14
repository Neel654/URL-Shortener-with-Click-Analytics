# Shortly — URL Shortener API with Analytics (2026)

A REST API like bit.ly: shorten long URLs, redirect via short codes, and track click analytics (totals, daily breakdown, top referrers).

## Stack

- **Node.js + Express** — REST API
- **PostgreSQL (Neon)** — persistent storage
- **pg** — parameterized queries (SQL injection safe)

## Quick start

```bash
npm install
cp .env.example .env   # add your DATABASE_URL
npm run migrate        # create tables (or run db/schema.sql in Neon)
npm run dev            # start server on http://localhost:3000
npm run test:db        # verify DB connection + tables
```

## Environment variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `PORT` | Server port (default `3000`) |
| `BASE_URL` | Public base URL for generated short links |

## API endpoints

| Method | Path | Status | Description |
|--------|------|--------|-------------|
| GET | `/` | 200 | API info / endpoint index |
| GET | `/health` | 200 | Health check for deployment |
| POST | `/api/shorten` | 201 | Create short URL from `{ "longUrl": "..." }` |
| POST | `/api/shorten` | 400 | Invalid or missing URL |
| GET | `/:shortCode` | 302 | Redirect to long URL + log click |
| GET | `/:shortCode` | 404 | Short code not found |
| GET | `/api/stats/:shortCode` | 200 | Click analytics |
| GET | `/api/stats/:shortCode` | 404 | Short code not found |

### Example: shorten

```bash
curl -X POST http://localhost:3000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"longUrl":"https://example.com"}'
```

```json
{
  "shortCode": "b",
  "shortUrl": "http://localhost:3000/b",
  "longUrl": "https://example.com"
}
```

### Example: stats

```bash
curl http://localhost:3000/api/stats/b
```

## Project structure

```
src/
├── routes/        → HTTP route definitions
├── controllers/   → parse request, call services, send response
├── services/      → business logic (validation, orchestration)
├── db/            → pool + SQL repositories only
├── middleware/    → centralized error handling
└── utils/         → base62 encoding, URL validation, errors
```

## Database schema

- **`urls`** — `short_code` (unique), `long_url`, timestamps
- **`clicks`** — FK to `urls`, `referrer`, `user_agent`, `clicked_at`
- **Index** on `(url_id, clicked_at)` for fast stats aggregation

Short codes are **Base62-encoded auto-increment IDs** — collision-free by construction.

## Testing with Postman

Import `postman/shortly.postman_collection.json`. Set `baseUrl` to your local or deployed URL.

## Deploy to Render

1. Push this repo to GitHub
2. [render.com](https://render.com) → New Web Service → connect repo
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables: `DATABASE_URL`, `BASE_URL` (your Render URL), `PORT=3000`
6. Run `db/schema.sql` in Neon if not already applied

## Resume line

Designed and deployed a REST API for URL shortening with click analytics using Node.js, Express, and PostgreSQL; implemented indexed schema design, parameterized queries, and per-day analytics aggregation.
