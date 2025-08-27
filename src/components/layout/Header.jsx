
import { Package } from 'lucide-react';
import { filtersVar } from '../../graphql/client';
import { useReactiveVar } from '@apollo/client';

const dateRanges = [
  { label: '7d', value: '7d' },
  { label: '14d', value: '14d' },
  { label: '30d', value: '30d' }
];

function Header() {
  const filters = useReactiveVar(filtersVar);

  const handleRangeChange = (value) => {
    filtersVar({ ...filters, dateRange: value });
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary-600 text-white">
            <Package className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">SupplySight Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          {dateRanges.map((r) => (
            <button
              key={r.value}
              onClick={() => handleRangeChange(r.value)}
              className={`px-3 py-1.5 text-sm rounded-md border ${
                filters.dateRange === r.value
                  ? 'bg-primary-600 border-primary-600 text-white'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

export default Header;
