import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { useReactiveVar } from '@apollo/client';
import { GET_PRODUCTS } from '../../graphql/queries';
import { filtersVar, drawerVar } from '../../graphql/client';
import StatusBadge from './StatusBadge';
import Pagination from './Pagination';
import { mockProducts } from '../../graphql/mockData';

const ITEMS_PER_PAGE = 10;

function ProductsTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const filters = useReactiveVar(filtersVar);
  
  const { data, loading, error } = useQuery(GET_PRODUCTS, {
    variables: {
      search: filters.search,
      warehouse: filters.warehouse,
      status: filters.status,
      offset: (currentPage - 1) * ITEMS_PER_PAGE,
      limit: ITEMS_PER_PAGE
    },
    pollInterval: 5000
  });

  const handleRowClick = (productId) => {
    drawerVar({ isOpen: true, productId });
  };

  const getTotalCount = () => {
    let filtered = [...mockProducts];
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.sku.toLowerCase().includes(searchLower) ||
        p.id.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters.warehouse) {
      filtered = filtered.filter(p => p.warehouse === filters.warehouse);
    }
    
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(p => {
        const stock = p.stock;
        const demand = p.demand;
        if (filters.status === 'healthy') return stock > demand;
        if (filters.status === 'low') return stock === demand;
        if (filters.status === 'critical') return stock < demand;
        return true;
      });
    }
    
    return filtered.length;
  };

  if (loading && !data) {
    return (
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="animate-pulse p-6">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-6">
        <p className="text-red-600">Error loading products: {error.message}</p>
      </div>
    );
  }

  const products = data?.products || [];
  const totalCount = getTotalCount();

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SKU
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Warehouse
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Demand
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                  No products found matching your filters
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const isCritical = product.stock < product.demand;
                return (
                  <tr
                    key={product.id}
                    onClick={() => handleRowClick(product.id)}
                    className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                      isCritical ? 'bg-red-50 hover:bg-red-100' : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.warehouse}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.stock.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.demand.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge stock={product.stock} demand={product.demand} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {products.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={totalCount}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}

export default ProductsTable;