# SupplySight Dashboard

A small, production‑style React app that demonstrates a daily inventory dashboard: KPIs, trends, filters, a paginated table, and simple product operations — all powered by an in‑memory GraphQL layer (Apollo `SchemaLink`).

## Quickstart
```bash
npm install
npm run dev
# open http://localhost:5173
```

## Scripts
- `npm run dev` – start Vite dev server
- `npm run build` – production build to `dist/`
- `npm run preview` – preview the production build
- `npm run lint` – lint the repo

## Tech
- React 18 + Vite
- Tailwind CSS
- Apollo Client (SchemaLink) with InMemoryCache + reactive vars
- Recharts

## How to use
- Search by **name, SKU, or ID**.
- Filter by **warehouse** and **status**.
- Switch **7d/14d/30d** ranges for the chart.
- Click a row to open the drawer → **update demand** or **transfer stock** between warehouses.

See [`NOTES.md`](./NOTES.md) for implementation notes.
