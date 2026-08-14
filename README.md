# Shortly — URL Shortener with Click Analytics

Shortly is a lightweight URL shortener API (like bit.ly) with click tracking and analytics. It provides a web UI to create short links, a JSON API, and endpoints to view daily and aggregate click statistics including top referrers.

Features
- Shorten long URLs to compact short codes (Base62-encoded auto-increment IDs)
- Redirect short codes to original URLs (302)
- Record clicks with referrer, user-agent and timestamp
- Aggregate analytics: total clicks, daily breakdown, top referrers
- Small, dependency-light Node.js + Express codebase
- PostgreSQL-backed storage (tested with Neon)

Live demo
- https://url-shortener-with-click-analytics.onrender.com/

Quick start (development)
1. Install
```bash
npm install
cp .env.example .env   # edit DATABASE_URL and BASE_URL
```
2. Prepare database
```bash
npm run migrate        # creates tables (or run db/schema.sql manually)
npm run test:db        # verify DB connection + tables
```
3. Run server
```bash
npm run dev            # starts server on http://localhost:3000
```

Environment variables
- DATABASE_URL — PostgreSQL connection string (Neon or other)
- PORT — server port (default: 3000)
- BASE_URL — public base URL for generated short links (e.g., https://url-shortener-with-click-analytics.onrender.com)

Usage

Web UI
- Visit GET / in your browser for a simple bit.ly-style page to shorten URLs and view stats.

API Endpoints
- GET /                — Web UI (HTML)
- GET /api             — API info / endpoint index
- GET /health          — Health check
- POST /api/shorten    — Create short URL. Body: { "longUrl": "https://..." } → 201
- GET /:shortCode      — Redirect to long URL (302) and log click
- GET /api/stats/:shortCode — Get click analytics (totals, daily, referrers)

Example: shorten
```bash
curl -X POST https://url-shortener-with-click-analytics.onrender.com/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"longUrl":"https://example.com"}'
```
Response:
```json
{
  "shortCode": "b",
  "shortUrl": "https://url-shortener-with-click-analytics.onrender.com/b",
  "longUrl": "https://example.com"
}
```

Example: stats
```bash
curl https://url-shortener-with-click-analytics.onrender.com/api/stats/b
```

Project structure
```
src/
├── routes/        # HTTP route definitions
├── controllers/   # parse request, call services, send response
├── services/      # business logic (validation, orchestration)
├── db/            # pool + SQL repositories
├── middleware/    # error handling, request parsing
├── utils/         # base62 encoding, URL validation, helpers
└── server.js      # app entry point
public/
└── index.html     # web UI (served at GET /)
postman/
└── shortly.postman_collection.json
db/
└── schema.sql
```

Database schema (overview)
- urls: id (PK), short_code (unique), long_url, created_at
- clicks: id (PK), url_id (FK → urls.id), referrer, user_agent, clicked_at
- Index: (url_id, clicked_at) for efficient aggregation

Implementation notes
- Short codes are Base62-encoded auto-increment IDs (collision-free).
- All SQL uses parameterized queries (pg) to prevent injection.
- Analytics are aggregated by date and referrer for performant dashboards.

Testing
- Use the provided Postman collection (postman/shortly.postman_collection.json). Set baseUrl to your local or deployed URL.
- npm run test:db verifies DB setup.

Deploy
- Deploy anywhere that runs Node.js and can connect to PostgreSQL (Neon, Render, Heroku, etc.).
- Example: Render
  - Connect repo as a Web Service
  - Build command: npm install
  - Start command: npm start
  - Set DATABASE_URL and BASE_URL in Render env
  - Run db/schema.sql against your DB once

Contributing
- Pull requests welcome. Open an issue for larger changes first.
- Keep changes small and focused; add tests where appropriate.

License
- Add your preferred license (e.g., MIT). Update LICENSE file as needed.

About / Resume line
Designed and deployed a REST API for URL shortening with click analytics using Node.js, Express, and PostgreSQL; implemented indexed schema design, parameterized queries, Base62 short codes, and per-day analytics.
