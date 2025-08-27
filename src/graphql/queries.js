
import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
  query GetProducts($search: String, $warehouse: String, $status: String, $offset: Int, $limit: Int) {
    products(search: $search, warehouse: $warehouse, status: $status, offset: $offset, limit: $limit) {
      totalCount
      items {
        id
        name
        sku
        warehouse
        stock
        demand
        lastUpdated
      }
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
      sku
      warehouse
      stock
      demand
      lastUpdated
    }
  }
`;

export const GET_WAREHOUSES = gql`
  query GetWarehouses {
    warehouses
  }
`;

export const GET_KPIS = gql`
  query GetKpis($range: String!) {
    kpis(range: $range) {
      totalStock
      totalDemand
      fillRate
    }
  }
`;

export const GET_TRENDS = gql`
  query GetTrends($range: String!) {
    trends(range: $range) {
      date
      stock
      demand
    }
  }
`;

export const UPDATE_DEMAND = gql`
  mutation UpdateDemand($id: ID!, $demand: Int!) {
    updateDemand(id: $id, demand: $demand) {
      id
      demand
      stock
      lastUpdated
    }
  }
`;

export const TRANSFER_STOCK = gql`
  mutation TransferStock($fromWarehouse: String!, $toWarehouse: String!, $productId: ID!, $quantity: Int!) {
    transferStock(fromWarehouse: $fromWarehouse, toWarehouse: $toWarehouse, productId: $productId, quantity: $quantity) {
      id
      name
      sku
      warehouse
      stock
      demand
      lastUpdated
    }
  }
`;
