import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { filtersVar } from '../../graphql/client';
import { useReactiveVar } from '@apollo/client';
import { useDebounce } from '../../hooks/useDebounce';

function SearchBar() {
  const filters = useReactiveVar(filtersVar);
  const [searchTerm, setSearchTerm] = useState(filters.search);
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    filtersVar({ ...filters, search: debouncedSearch });
  }, [debouncedSearch]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      <input
        type="text"
        placeholder="Search by name, SKU, or ID..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
      />
    </div>
  );
}

export default SearchBar;