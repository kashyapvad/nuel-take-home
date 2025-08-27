
import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { filtersVar } from '../../graphql/client';
import { useReactiveVar } from '@apollo/client';
import { useDebounce } from '../../hooks/useDebounce';

function SearchBar() {
  const filters = useReactiveVar(filtersVar);
  const [value, setValue] = useState(filters.search);
  const debounced = useDebounce(value, 300);

  useEffect(() => {
    if (debounced !== filters.search) {
      filtersVar({ ...filters, search: debounced });
    }
  }, [debounced]);

  return (
    <div className="relative flex-1 min-w-[240px]">
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search by name, SKU, or ID"
        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
      />
    </div>
  );
}

export default SearchBar;
