# Web Workspace

The cadastre stats dashboard (`src/Dashboard.tsx`): charts for buildings by construction year, properties by municipality, land usage breakdown, citizen applications over time, and parcel area distribution, with a filter bar for date range, land usage type, and application type.

Built with:

- React + Vite
- Geist UI
- Apache ECharts for React

Use the root workspace commands to run it:

```bash
npm run dev:web
npm run build:web
npm run preview:web
```

No env configuration needed — Vite's dev server proxies `/api` requests to the backend (see `vite.config.ts`).
