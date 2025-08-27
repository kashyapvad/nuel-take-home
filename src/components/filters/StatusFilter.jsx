
import { useReactiveVar } from '@apollo/client';
import { filtersVar } from '../../graphql/client';

function StatusFilter() {
  const filters = useReactiveVar(filtersVar);

  return (
    <select
      value={filters.status}
      onChange={(e) => filtersVar({ ...filters, status: e.target.value })}
      className="px-3 py-2 border border-gray-300 rounded-md bg-white min-w-[140px] focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
    >
      <option value="all">All Status</option>
      <option value="healthy">Healthy</option>
      <option value="low">Low</option>
      <option value="critical">Critical</option>
    </select>
  );
}

export default StatusFilter;
