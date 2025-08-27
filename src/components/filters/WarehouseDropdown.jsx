import { ChevronDown } from 'lucide-react';
import { useQuery } from '@apollo/client';
import { useReactiveVar } from '@apollo/client';
import { GET_WAREHOUSES } from '../../graphql/queries';
import { filtersVar } from '../../graphql/client';

function WarehouseDropdown() {
  const filters = useReactiveVar(filtersVar);
  const { data } = useQuery(GET_WAREHOUSES);

  const handleChange = (e) => {
    filtersVar({ ...filters, warehouse: e.target.value });
  };

  return (
    <div className="relative">
      <select
        value={filters.warehouse}
        onChange={handleChange}
        className="appearance-none px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
      >
        <option value="">All Warehouses</option>
        {data?.warehouses?.map(warehouse => (
          <option key={warehouse} value={warehouse}>
            {warehouse}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
    </div>
  );
}

export default WarehouseDropdown;