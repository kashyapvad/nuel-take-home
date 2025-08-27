function StatusBadge({ stock, demand }) {
  const getStatus = () => {
    if (stock > demand) return { label: 'Healthy', color: 'bg-green-100 text-green-800' };
    if (stock === demand) return { label: 'Low', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Critical', color: 'bg-red-100 text-red-800' };
  };

  const status = getStatus();

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
      <span className={`w-2 h-2 rounded-full mr-1.5 ${
        status.label === 'Healthy' ? 'bg-green-500' :
        status.label === 'Low' ? 'bg-yellow-500' : 'bg-red-500'
      }`}></span>
      {status.label}
    </span>
  );
}

export default StatusBadge;