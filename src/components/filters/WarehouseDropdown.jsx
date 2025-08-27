
import { useQuery, useReactiveVar } from '@apollo/client';
import { GET_WAREHOUSES } from '../../graphql/queries';
import { filtersVar } from '../../graphql/client';

function WarehouseDropdown() {
  const { data } = useQuery(GET_WAREHOUSES);
  const filters = useReactiveVar(filtersVar);
  const warehouses = data?.warehouses ?? [];

  return (
    <select
      value={filters.warehouse}
      onChange={(e) => filtersVar({ ...filters, warehouse: e.target.value })}
      className="px-3 py-2 border border-gray-300 rounded-md bg-white min-w-[160px] focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
    >
      <option value="">All Warehouses</option>
      {warehouses.map((w) => (
        <option key={w} value={w}>{w}</option>
      ))}
    </select>
  );
}

export default WarehouseDropdown;
