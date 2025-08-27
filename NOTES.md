# SupplySight Dashboard – Implementation Notes

## Overview
I built a real-time inventory dashboard for SupplySight in about 4 hours. The app gives instant visibility into stock levels, demand patterns, and supply chain health. It uses a mock GraphQL backend but behaves like a production system.

---

## Technical Decisions

### Build Tool: Vite (vs CRA)
- Picked **Vite** for faster dev cycles: instant HMR (<1s vs CRA’s 10–20s) and smaller bundles (≈815KB vs CRA’s >1.2MB).
- Better tree-shaking and splitting out of the box.

### State Management: Apollo Cache (no Redux)
- **Apollo Client cache** covers server state cleanly, with minimal boilerplate.
- Used **reactive vars** (`makeVar`) for local UI state like filters/drawer.
- Skipped Redux to avoid overengineering—though in production with auth/user prefs I’d reconsider Redux Toolkit.

### Charts: Recharts
- React-first, responsive, and lightweight.
- Clean API, no need to dive into D3.
- Good balance between simplicity and features without the overhead of D3.

### Component Architecture
- **Functional components + hooks** throughout.
- Custom hooks for shared logic (e.g., debounced search).
- Compositional style (no prop-drilling).
- Clear folder split: `components/`, `graphql/`, `hooks/`, `utils/`.

---

## Performance Optimizations
1. **Debounced search (300ms)** to avoid spammy queries.  
2. **Pagination** (10 items/page) for efficiency.  
3. **Polling** tuned (5s for KPIs, 10s for trends) for freshness vs load.  
4. **Skeleton loaders** for better perceived performance.  

---

## Enhancements Beyond the Brief

### Expanded Mock Data
- Added 8 extra products (P-1005 → P-1012), including electronic parts, to better showcase pagination and filtering.

### UI/UX Touches
- KPI cards include icons for visual hierarchy.  
- Skeleton loaders for perceived performance.  
- Drawer closes via **Esc** key for quick navigation.
- Critical rows highlighted with red background.  

---

## Trade-offs

### Prioritized
- Clear, readable code over deep abstraction.  
- Business logic correctness and UX polish.  
- Working features > “perfect” architecture.  

### Simplified
- Mock GraphQL server runs in-browser (SchemaLink).  
- Basic validation & feedback (alerts instead of toasts).  
- No tests (time-boxed).  
- Desktop-first (limited mobile responsive).
- Refetch instead of optimistic updates (simpler).

---

## What I'd Improve (with more time)

### Next 2 hours
- Replace `alert()` with proper toast notifications (react-hot-toast)
- Add unit tests for business logic (status calcs, fill rate)
- Optimistic updates with rollback on failure
- Form validation with inline error messages
- Better inventory tracking across warehouses (currently creates unique IDs per warehouse)

### Next day
- Export to CSV/Excel functionality  
- Mobile responsive design
- Dark mode toggle

### Next week
- WebSocket subscriptions for real-time updates (no polling)
- Bulk operations (select multiple products)
- Advanced filters (date ranges, stock thresholds)
- Undo/redo for mutations
- Performance monitoring (Sentry)
- E2E tests with Playwright
