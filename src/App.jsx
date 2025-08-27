import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './graphql/client';
import Header from './components/layout/Header';
import KPICards from './components/layout/KPICards';
import StockDemandChart from './components/charts/StockDemandChart';
import SearchBar from './components/filters/SearchBar';
import WarehouseDropdown from './components/filters/WarehouseDropdown';
import StatusFilter from './components/filters/StatusFilter';
import ProductsTable from './components/table/ProductsTable';
import ProductDetailsDrawer from './components/drawer/ProductDetailsDrawer';

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <KPICards />
            
            <StockDemandChart />
            
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <SearchBar />
                <WarehouseDropdown />
                <StatusFilter />
              </div>
            </div>
            
            <ProductsTable />
          </div>
        </main>
        
        <ProductDetailsDrawer />
      </div>
    </ApolloProvider>
  );
}

export default App;