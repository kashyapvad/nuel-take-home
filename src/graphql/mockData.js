
const nowIso = () => new Date().toISOString();

export let mockProducts = [
  { id: "P-1001", name: "12mm Hex Bolt", sku: "HEX-12-100", warehouse: "BLR-A", stock: 180, demand: 120, lastUpdated: nowIso() },
  { id: "P-1002", name: "Steel Washer", sku: "WSR-08-500", warehouse: "BLR-A", stock: 50, demand: 80, lastUpdated: nowIso() },
  { id: "P-1003", name: "Aluminium Plate 5mm", sku: "ALP-05-010", warehouse: "DEL-B", stock: 20, demand: 35, lastUpdated: nowIso() },
  { id: "P-1004", name: "Nylon Spacer 3mm", sku: "NYL-03-200", warehouse: "DEL-B", stock: 120, demand: 70, lastUpdated: nowIso() },
  { id: "P-1005", name: "Bearing 608ZZ", sku: "BRG-608-100", warehouse: "PNQ-C", stock: 300, demand: 140, lastUpdated: nowIso() },
  { id: "P-1006", name: "Cable Tie 200mm", sku: "CBT-200-100", warehouse: "PNQ-C", stock: 90, demand: 110, lastUpdated: nowIso() },
  { id: "P-1007", name: "Copper Wire 1.5mm", sku: "CWR-15-050", warehouse: "BLR-A", stock: 60, demand: 60, lastUpdated: nowIso() },
  { id: "P-1008", name: "Thermal Paste 5g", sku: "THP-05-010", warehouse: "DEL-B", stock: 15, demand: 40, lastUpdated: nowIso() },
  { id: "P-1009", name: "Fan 80mm", sku: "FAN-80-020", warehouse: "PNQ-C", stock: 75, demand: 50, lastUpdated: nowIso() },
  { id: "P-1010", name: "PCB Board 10x10", sku: "PCB-10-050", warehouse: "DEL-B", stock: 30, demand: 25, lastUpdated: nowIso() },
  { id: "P-1011", name: "Screw M3x10", sku: "SCR-M3-500", warehouse: "BLR-A", stock: 400, demand: 450, lastUpdated: nowIso() },
  { id: "P-1012", name: "Spring 20mm", sku: "SPR-20-200", warehouse: "PNQ-C", stock: 90, demand: 75, lastUpdated: nowIso() }
];

export const warehouses = ["BLR-A", "DEL-B", "PNQ-C"];

const rng = (seed) => {
  let x = Math.sin(seed) * 10000;
  return () => {
    x = Math.sin(x) * 10000;
    return x - Math.floor(x);
  };
};

const generateTrendData = (days) => {
  const data = [];
  const rand = rng(days);
  let totalStock = mockProducts.reduce((s, p) => s + p.stock, 0);
  let totalDemand = mockProducts.reduce((s, p) => s + p.demand, 0);

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    // vary up to ±10%
    const stockVariation = (rand() - 0.5) * 0.2;
    const demandVariation = (rand() - 0.5) * 0.2;

    data.push({
      date: date.toISOString().split('T')[0],
      stock: Math.max(0, Math.round(totalStock * (1 + stockVariation))),
      demand: Math.max(0, Math.round(totalDemand * (1 + demandVariation)))
    });
  }
  return data;
};

export const kpiTrends = {
  '7d': generateTrendData(7),
  '14d': generateTrendData(14),
  '30d': generateTrendData(30)
};
