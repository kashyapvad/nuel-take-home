import { gql } from '@apollo/client';

export const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    sku: String!
    warehouse: String!
    stock: Int!
    demand: Int!
    lastUpdated: String!
  }

  type KPI {
    totalStock: Int!
    totalDemand: Int!
    fillRate: Float!
  }

  type TrendPoint {
    date: String!
    stock: Int!
    demand: Int!
  }

  type Query {
    products(
      search: String
      warehouse: String
      status: String
      offset: Int
      limit: Int
    ): [Product!]!
    
    product(id: ID!): Product
    
    warehouses: [String!]!
    
    kpis(range: String!): KPI!
    
    trends(range: String!): [TrendPoint!]!
  }

  type Mutation {
    updateDemand(id: ID!, demand: Int!): Product!
    
    transferStock(
      fromWarehouse: String!
      toWarehouse: String!
      productId: ID!
      quantity: Int!
    ): Product!
  }
`;