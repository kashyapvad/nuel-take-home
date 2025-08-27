
import { TrendingUp, Package, Target } from 'lucide-react';
import { useQuery } from '@apollo/client';
import { useReactiveVar } from '@apollo/client';
import { GET_KPIS } from '../../graphql/queries';
import { filtersVar } from '../../graphql/client';

function KPICard({ title, value, icon: Icon, color, suffix = '' }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}{suffix}</p>
        </div>
        <div className={`p-3 rounded-lg ${color} text-white`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

function KPICards() {
  const filters = useReactiveVar(filtersVar);
  const { data, loading } = useQuery(GET_KPIS, { variables: { range: filters.dateRange }, pollInterval: 5000 });

  if (loading && !data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[0,1,2].map((i) => (
          <div key={i} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const kpis = data?.kpis ?? { totalStock: 0, totalDemand: 0, fillRate: 0 };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <KPICard title="Total Stock" value={kpis.totalStock.toLocaleString()} icon={Package} color="bg-blue-500" />
      <KPICard title="Total Demand" value={kpis.totalDemand.toLocaleString()} icon={Target} color="bg-purple-500" />
      <KPICard
        title="Fill Rate"
        value={kpis.fillRate}
        suffix="%"
        icon={TrendingUp}
        color={kpis.fillRate >= 80 ? 'bg-green-500' : kpis.fillRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'}
      />
    </div>
  );
}

export default KPICards;
