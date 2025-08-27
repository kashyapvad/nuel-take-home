import { useState } from 'react';
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
  
  const handleRangeChange = (range) => {
    filtersVar({ ...filters, dateRange: range });
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Package className="h-8 w-8 text-primary-600" />
          <h1 className="text-2xl font-bold text-gray-900">SupplySight</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          {dateRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => handleRangeChange(range.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filters.dateRange === range.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

export default Header;