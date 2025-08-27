
import { mockProducts, warehouses, kpiTrends } from './mockData.js';

const statusOf = (stock, demand) => {
  if (stock > demand) return 'healthy';
  if (stock === demand) return 'low';
  return 'critical';
};

export const resolvers = {
  Query: {
    product: (_, { id }) => mockProducts.find(p => p.id === id) || null,
    products: (_, { search = '', warehouse = '', status = 'all', offset = 0, limit = 10 }) => {
      let filtered = [...mockProducts];
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(s) ||
          p.sku.toLowerCase().includes(s) ||
          p.id.toLowerCase().includes(s)
        );
      }
      if (warehouse) {
        filtered = filtered.filter(p => p.warehouse === warehouse);
      }
      if (status && status !== 'all') {
        filtered = filtered.filter(p => {
          const st = statusOf(p.stock, p.demand);
          return st === status;
        });
      }
      const totalCount = filtered.length;
      const items = filtered.slice(offset, offset + limit);
      return { items, totalCount };
    },
    warehouses: () => warehouses,
    kpis: () => {
      const totalStock = mockProducts.reduce((sum, p) => sum + p.stock, 0);
      const totalDemand = mockProducts.reduce((sum, p) => sum + p.demand, 0);
      const filledDemand = mockProducts.reduce((sum, p) => sum + Math.min(p.stock, p.demand), 0);
      const fillRate = totalDemand > 0 ? (filledDemand / totalDemand) * 100 : 0;
      return { totalStock, totalDemand, fillRate: Math.round(fillRate * 10) / 10 };
    },
    trends: (_, { range }) => kpiTrends[range] || kpiTrends['7d']
  },
  Mutation: {
    updateDemand: (_, { id, demand }) => {
      if (demand < 0) throw new Error('Demand cannot be negative');
      const p = mockProducts.find(p => p.id === id);
      if (!p) throw new Error('Product not found');
      p.demand = demand;
      p.lastUpdated = new Date().toISOString();
      return p;
    },
    transferStock: (_, { fromWarehouse, toWarehouse, productId, quantity }) => {
      if (quantity <= 0) throw new Error('Quantity must be positive');
      const product = mockProducts.find(p => p.id === productId && p.warehouse === fromWarehouse);
      if (!product) throw new Error('Source product not found in fromWarehouse');
      if (product.stock < quantity) throw new Error('Insufficient stock');
      product.stock -= quantity;
      product.lastUpdated = new Date().toISOString();

      let target = mockProducts.find(p => p.id === productId && p.warehouse === toWarehouse);
      if (!target) {
        target = { ...product, warehouse: toWarehouse, stock: 0, lastUpdated: new Date().toISOString() };
        mockProducts.push(target);
      }
      target.stock += quantity;
      target.lastUpdated = new Date().toISOString();
      return target;
    }
  }
};
