
import { useState, useMemo } from 'react';
import { useQuery, useReactiveVar } from '@apollo/client';
import { GET_PRODUCTS } from '../../graphql/queries';
import { filtersVar, drawerVar } from '../../graphql/client';
import StatusBadge from './StatusBadge';
import Pagination from './Pagination';

const ITEMS_PER_PAGE = 10;

function ProductsTable() {
  const [page, setPage] = useState(1);
  const filters = useReactiveVar(filtersVar);

  const variables = useMemo(() => ({
    search: filters.search || null,
    warehouse: filters.warehouse || null,
    status: filters.status || 'all',
    offset: (page - 1) * ITEMS_PER_PAGE,
    limit: ITEMS_PER_PAGE
  }), [filters, page]);

  const { data, loading, error, refetch } = useQuery(GET_PRODUCTS, { variables });

  const openDrawer = (id) => {
    drawerVar({ isOpen: true, productId: id });
  };

  if (error) {
    return <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded">Error: {error.message}</div>;
  }

  const items = data?.products?.items ?? [];
  const totalCount = data?.products?.totalCount ?? 0;

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Warehouse</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Demand</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(loading && !data) ? (
              [...Array(8)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-40"/></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"/></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"/></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"/></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"/></td>
                  <td className="px-6 py-4"><div className="h-5 bg-gray-200 rounded w-24"/></td>
                </tr>
              ))
            ) : items.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">No products found</td>
              </tr>
            ) : (
              items.map((p) => {
                const isCritical = p.stock < p.demand;
                return (
                  <tr 
                    key={p.id} 
                    className={`cursor-pointer ${isCritical ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'}`}
                    onClick={() => openDrawer(p.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.sku}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.warehouse}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.stock}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.demand}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <StatusBadge stock={p.stock} demand={p.demand} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={page} totalItems={totalCount} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setPage} />
    </div>
  );
}

export default ProductsTable;
