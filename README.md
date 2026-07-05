# Cadastre Data ETL Workspace

North Macedonia cadastre and address-register ETL with the backend under `api/` and the React app under `web/`.

---

## Prerequisites

- Node.js >= 20
- PostgreSQL >= 16 with PostGIS extension
or
- Docker Engine & Docker Compose (preferable over server like pgadmin because of drizzle)

---

## Quick Setup

### 1. Clone and install dependencies

```bash
git clone <repo-url>
cd cadastre-data-loading
npm install
```

Workspace layout:

- `api/` backend ETL and Hono API
- `web/` Vite React dashboard (Geist UI + Apache ECharts)
- `shared/` values used by both `api` and `web` (e.g. the list of valid filter values), so the two stay in sync
- root `package.json` forwards the existing backend commands and adds frontend workspace commands

### 2. Configure environment

The frontend needs no configuration — Vite's dev server proxies `/api` requests to the backend (see `web/vite.config.ts`). Only the backend needs an env file.

```bash
cp .env.example .env
```

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=cadastre_user
DB_PASSWORD=cadastre_pass_local
DB_NAME=cadastre

DATASET_PATH=/path/to/katastar_harvest_output/data

PORT=3000
```

These are also the credentials `docker-compose.yml` uses to create the database, so leave them matching unless you have your own PostgreSQL instance.

The backend reads this file through the `api` npm scripts, and `docker-compose.yml` reads it too.

### 3. Start the database (Docker)

```bash
docker-compose up -d
```

### 4. Run database migrations

```bash
npm run db:migrate
```

---

## Loading Data

Point `DATASET_PATH` in the root `.env` file to the data, for example:

```env
   DATASET_PATH='/path/to/katastar_harvest_output/data' 
```

```bash
# Load all tables
npm run load:data

# or
npm run load:data:opstini
npm run load:data:naselen
npm run load:data:ulici
npm run load:data:kukni
npm run load:data:parceli
npm run load:data:zgradi
npm run load:data:objekti

# Run full load in background with logs
nohup npm run load:data --workspace api -- --verbose --batch-size=1000 > /tmp/full_load.log 2>&1 &
tail -f /tmp/full_load.log
```

Loader flags:

| Flag | Description |
|---|---|
| `--table=<name>` | Load only this table |
| `--batch-size=<n>` | Insert batch size (default 500) |
| `--limit=<n>` | Stop after N records per source |
| `--no-geometry` | Skip geometry columns |
| `--verbose` | Print progress per file |

---

## Running the apps

```bash
# Backend only
npm run dev

# Frontend only
npm run dev:web

# Backend + frontend together
npm run dev:all

# Backend production entry
npm start

# Frontend production preview
npm run preview:web
```

Backend starts on `http://localhost:3000` by default.
Frontend starts on `http://localhost:5173` by default and proxies API requests to the backend during development.

The frontend is a dashboard (`web/src/Dashboard.tsx`) showing aggregate cadastre stats: buildings by construction year, properties by municipality, land usage breakdown, citizen applications over time, and parcel area distribution. A sticky filter bar at the top controls date range, land usage type, and application type across the relevant charts.

---

## API

### Swagger UI

```
http://localhost:3000/docs
```

### OpenAPI JSON spec

```
http://localhost:3000/openapi.json
```

### Endpoints

All entity endpoints follow the same pattern:

```
GET /api/<entity>?page=1&limit=50   — paginated list (includes FK relations)
GET /api/<entity>/:id               — single record by ID (includes FK relations)
```

| Path | Entity |
|---|---|
| `/api/opstini` | Municipalities |
| `/api/naselen-mesta` | Settlements |
| `/api/ulici` | Streets |
| `/api/ulici-cr` | CR Streets |
| `/api/kukni-broevi` | House numbers / addresses |
| `/api/stanovi` | Apartments |
| `/api/parceli` | Cadastral parcels |
| `/api/parceli-delovi` | Parcel parts |
| `/api/zgradi` | Buildings (eKatastar) |
| `/api/objekti` | Buildings (old cadastre) |
| `/api/log-aktivnosti` | Activity log |
| `/api/korisnici` | Users |
| `/api/prijavi` | Public submissions |
| `/api/ulici-opstini-ref` | Street-municipality reference |

### Stats

Aggregate endpoints backing the frontend dashboard. Unlike the entity endpoints above, these return pre-aggregated `{ ..., count }` rows, not raw records.

| Path | Query params | Description |
|---|---|---|
| `/api/stats/build-years` | `yearFrom`, `yearTo` (numbers) | Building count per construction year |
| `/api/stats/properties-by-municipality` | — | Property count per municipality |
| `/api/stats/usage-breakdown` | `usageType` | Parcel count per land usage type |
| `/api/stats/applications-over-time` | `dateFrom`, `dateTo`, `classification` | Citizen application count per month |
| `/api/stats/parcel-area-distribution` | `usageType` | Parcel count per area bucket |

`usageType` and `classification` only accept the values listed in `shared/cadastre-options.ts` (the same list the frontend's filter dropdowns use) — anything else is rejected with a 400. These are placeholder English values, not confirmed values from the real cadastre source data; update that file once the actual `usage_fullname` / `classification` strings loaded by `api/src/loader.ts` are known.

### Pagination

```
GET /api/opstini?page=2&limit=100
```

Response envelope:

```json
{
  "data": [...],
  "total": 80,
  "page": 2,
  "limit": 100
}
```

---

## Database

```bash
# Open Drizzle Studio (visual DB browser)
npm run db:studio

# Generate migrations after schema changes
npm run db:generate

# Apply migrations
npm run db:migrate
```
