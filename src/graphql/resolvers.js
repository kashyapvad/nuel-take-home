import { mockProducts, warehouses, kpiTrends } from './mockData.js';

const getProductStatus = (stock, demand) => {
  if (stock > demand) return 'healthy';
  if (stock === demand) return 'low';
  return 'critical';
};

export const resolvers = {
  Query: {
    products: (_, { search, warehouse, status, offset = 0, limit = 10 }) => {
      let filtered = [...mockProducts];
      
      if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(searchLower) ||
          p.sku.toLowerCase().includes(searchLower) ||
          p.id.toLowerCase().includes(searchLower)
        );
      }
      
      if (warehouse) {
        filtered = filtered.filter(p => p.warehouse === warehouse);
      }
      
      if (status && status !== 'all') {
        filtered = filtered.filter(p => {
          const productStatus = getProductStatus(p.stock, p.demand);
          return productStatus === status.toLowerCase();
        });
      }
      
      return filtered.slice(offset, offset + limit);
    },
    
    product: (_, { id }) => {
      return mockProducts.find(p => p.id === id);
    },
    
    warehouses: () => warehouses,
    
    kpis: (_, { range }) => {
      const totalStock = mockProducts.reduce((sum, p) => sum + p.stock, 0);
      const totalDemand = mockProducts.reduce((sum, p) => sum + p.demand, 0);
      
      const filledDemand = mockProducts.reduce((sum, p) => 
        sum + Math.min(p.stock, p.demand), 0
      );
      
      const fillRate = totalDemand > 0 
        ? (filledDemand / totalDemand) * 100 
        : 0;
      
      return {
        totalStock,
        totalDemand,
        fillRate: Math.round(fillRate * 10) / 10
      };
    },
    
    trends: (_, { range }) => {
      return kpiTrends[range] || kpiTrends['7d'];
    }
  },
  
  Mutation: {
    updateDemand: (_, { id, demand }) => {
      const product = mockProducts.find(p => p.id === id);
      if (!product) {
        throw new Error('Product not found');
      }
      
      product.demand = demand;
      product.lastUpdated = new Date().toISOString();
      
      return product;
    },
    
    transferStock: (_, { fromWarehouse, toWarehouse, productId, quantity }) => {
      const product = mockProducts.find(p => 
        p.id === productId && p.warehouse === fromWarehouse
      );
      
      if (!product) {
        throw new Error('Product not found in source warehouse');
      }
      
      if (product.stock < quantity) {
        throw new Error('Insufficient stock for transfer');
      }
      
      product.stock -= quantity;
      
      let targetProduct = mockProducts.find(p => 
        p.id === productId && p.warehouse === toWarehouse
      );
      
      if (!targetProduct) {
        targetProduct = {
          ...product,
          warehouse: toWarehouse,
          stock: quantity
        };
        mockProducts.push(targetProduct);
      } else {
        targetProduct.stock += quantity;
      }
      
      product.lastUpdated = new Date().toISOString();
      targetProduct.lastUpdated = new Date().toISOString();
      
      return targetProduct;
    }
  }
};