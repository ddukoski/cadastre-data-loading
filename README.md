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
- `web/` Vite React app with Geist UI and Apache ECharts installed
- root `package.json` forwards the existing backend commands and adds frontend workspace commands

### 2. Configure environment

There are two env files you should care about:

- root `.env` for backend, database, loader, and `docker-compose`
- `web/.env` for frontend variables exposed by Vite

Copy the examples:

```bash
cp .env.example .env
cp web/.env.example web/.env
```

Backend variables in root `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=cadastre

DATASET_PATH=/path/to/katastar_harvest_output/data

PORT=3000
```

Frontend variables in `web/.env`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Notes:

- The backend reads the root `.env` through the `api` npm scripts.
- `docker-compose.yml` also reads the root `.env`.
- The frontend only exposes variables that start with `VITE_`.

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

The frontend app is intentionally blank so you can start building from a clean canvas.

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
