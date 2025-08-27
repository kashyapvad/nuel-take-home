export const mockProducts = [
  { 
    id: "P-1001", 
    name: "12mm Hex Bolt", 
    sku: "HEX-12-100", 
    warehouse: "BLR-A", 
    stock: 180, 
    demand: 120,
    lastUpdated: new Date().toISOString()
  },
  { 
    id: "P-1002", 
    name: "Steel Washer", 
    sku: "WSR-08-500", 
    warehouse: "BLR-A", 
    stock: 50, 
    demand: 80,
    lastUpdated: new Date().toISOString()
  },
  { 
    id: "P-1003", 
    name: "M8 Nut", 
    sku: "NUT-08-200", 
    warehouse: "PNQ-C", 
    stock: 80, 
    demand: 80,
    lastUpdated: new Date().toISOString()
  },
  { 
    id: "P-1004", 
    name: "Bearing 608ZZ", 
    sku: "BRG-608-50", 
    warehouse: "DEL-B", 
    stock: 24, 
    demand: 120,
    lastUpdated: new Date().toISOString()
  },
  { 
    id: "P-1005", 
    name: "Cable Tie 150mm", 
    sku: "CTI-150-1000", 
    warehouse: "BLR-A", 
    stock: 500, 
    demand: 350,
    lastUpdated: new Date().toISOString()
  },
  { 
    id: "P-1006", 
    name: "Switch Button", 
    sku: "SWT-BTN-100", 
    warehouse: "PNQ-C", 
    stock: 65, 
    demand: 90,
    lastUpdated: new Date().toISOString()
  },
  { 
    id: "P-1007", 
    name: "LED 5mm Red", 
    sku: "LED-5R-500", 
    warehouse: "DEL-B", 
    stock: 250, 
    demand: 200,
    lastUpdated: new Date().toISOString()
  },
  { 
    id: "P-1008", 
    name: "Resistor 10K", 
    sku: "RES-10K-1000", 
    warehouse: "BLR-A", 
    stock: 800, 
    demand: 650,
    lastUpdated: new Date().toISOString()
  },
  { 
    id: "P-1009", 
    name: "Capacitor 100uF", 
    sku: "CAP-100U-200", 
    warehouse: "PNQ-C", 
    stock: 120, 
    demand: 150,
    lastUpdated: new Date().toISOString()
  },
  { 
    id: "P-1010", 
    name: "PCB Board 10x10", 
    sku: "PCB-10-50", 
    warehouse: "DEL-B", 
    stock: 30, 
    demand: 25,
    lastUpdated: new Date().toISOString()
  },
  { 
    id: "P-1011", 
    name: "Screw M3x10", 
    sku: "SCR-M3-500", 
    warehouse: "BLR-A", 
    stock: 400, 
    demand: 450,
    lastUpdated: new Date().toISOString()
  },
  { 
    id: "P-1012", 
    name: "Spring 20mm", 
    sku: "SPR-20-200", 
    warehouse: "PNQ-C", 
    stock: 90, 
    demand: 75,
    lastUpdated: new Date().toISOString()
  }
];

export const warehouses = ["BLR-A", "DEL-B", "PNQ-C"];

const generateTrendData = (days) => {
  const data = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const stockVariation = Math.random() * 0.3 - 0.15;
    const demandVariation = Math.random() * 0.4 - 0.2;
    
    const totalStock = mockProducts.reduce((sum, p) => sum + p.stock, 0);
    const totalDemand = mockProducts.reduce((sum, p) => sum + p.demand, 0);
    
    data.push({
      date: date.toISOString().split('T')[0],
      stock: Math.round(totalStock * (1 + stockVariation)),
      demand: Math.round(totalDemand * (1 + demandVariation))
    });
  }
  
  return data;
};

export const kpiTrends = {
  '7d': generateTrendData(7),
  '14d': generateTrendData(14),
  '30d': generateTrendData(30)
};