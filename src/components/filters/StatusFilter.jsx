import { ChevronDown } from 'lucide-react';
import { filtersVar } from '../../graphql/client';
import { useReactiveVar } from '@apollo/client';

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'healthy', label: 'Healthy' },
  { value: 'low', label: 'Low' },
  { value: 'critical', label: 'Critical' }
];

function StatusFilter() {
  const filters = useReactiveVar(filtersVar);

  const handleChange = (e) => {
    filtersVar({ ...filters, status: e.target.value });
  };

  return (
    <div className="relative">
      <select
        value={filters.status}
        onChange={handleChange}
        className="appearance-none px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
      >
        {statusOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
    </div>
  );
}

export default StatusFilter;