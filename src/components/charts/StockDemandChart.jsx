
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useQuery, useReactiveVar } from '@apollo/client';
import { GET_TRENDS } from '../../graphql/queries';
import { filtersVar } from '../../graphql/client';

function StockDemandChart() {
  const filters = useReactiveVar(filtersVar);
  const { data, loading } = useQuery(GET_TRENDS, { variables: { range: filters.dateRange }, pollInterval: 10000 });

  if (loading && !data) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="animate-pulse space-y-4">
          <div className="h-5 bg-gray-200 rounded w-40"></div>
          <div className="h-64 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  const chartData = data?.trends ?? [];

  const formatDate = (d) => {
    const date = new Date(d);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock vs Demand</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tickFormatter={formatDate} stroke="#6b7280" fontSize={12} />
          <YAxis stroke="#6b7280" fontSize={12} />
          <Tooltip labelFormatter={formatDate} />
          <Legend />
          <Line type="monotone" dataKey="stock" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="Stock" />
          <Line type="monotone" dataKey="demand" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} name="Demand" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StockDemandChart;
