# SupplySight Dashboard

A real-time inventory management dashboard built for the SupplySight take-home challenge. Track stock levels, monitor demand patterns, and manage supply chain operations through an intuitive interface.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Visit http://localhost:5173 to view the dashboard.

## Features

- **Real-time KPI Monitoring** - Track total stock, demand, and fill rates
- **Interactive Visualizations** - Stock vs demand trend analysis
- **Smart Filtering** - Search by product name, SKU, or ID; filter by warehouse and status
- **Inventory Management** - Update demand and transfer stock between warehouses
- **Status Indicators** - Visual alerts for healthy, low, and critical stock levels

## Tech Stack

- **React 18** with Vite for blazing fast development
- **Apollo Client** for GraphQL state management
- **Tailwind CSS** for responsive styling
- **Recharts** for data visualization
- **Mock GraphQL Server** running in-browser

## Project Structure

```
src/
├── components/       # Reusable UI components
├── graphql/         # GraphQL schema, resolvers, and queries
├── hooks/           # Custom React hooks
└── utils/           # Helper functions
```

## Testing the Application

1. **Search Functionality** - Try searching for "bolt", "LED", or "P-1001"
2. **Filters** - Combine warehouse and status filters
3. **Date Ranges** - Toggle between 7d/14d/30d views
4. **Product Management** - Click any row to update demand or transfer stock

## Development Notes

See [NOTES.md](./NOTES.md) for implementation details, technical decisions, and future improvements.