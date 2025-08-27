import { useState, useEffect } from 'react';
import { X, Package, TrendingUp, ArrowRightLeft } from 'lucide-react';
import { useQuery, useMutation } from '@apollo/client';
import { useReactiveVar } from '@apollo/client';
import { GET_PRODUCT, GET_WAREHOUSES, UPDATE_DEMAND, TRANSFER_STOCK, GET_PRODUCTS } from '../../graphql/queries';
import { drawerVar } from '../../graphql/client';
import StatusBadge from '../table/StatusBadge';

function ProductDetailsDrawer() {
  const drawer = useReactiveVar(drawerVar);
  const [demandValue, setDemandValue] = useState('');
  const [transferQuantity, setTransferQuantity] = useState('');
  const [targetWarehouse, setTargetWarehouse] = useState('');
  const [activeTab, setActiveTab] = useState('details');

  const { data: productData, loading } = useQuery(GET_PRODUCT, {
    variables: { id: drawer.productId },
    skip: !drawer.productId
  });

  const { data: warehousesData } = useQuery(GET_WAREHOUSES);

  const [updateDemand, { loading: updatingDemand }] = useMutation(UPDATE_DEMAND, {
    refetchQueries: [GET_PRODUCTS],
    onCompleted: () => {
      setDemandValue('');
      alert('Demand updated successfully');
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    }
  });

  const [transferStock, { loading: transferring }] = useMutation(TRANSFER_STOCK, {
    refetchQueries: [GET_PRODUCTS],
    onCompleted: () => {
      setTransferQuantity('');
      setTargetWarehouse('');
      alert('Stock transferred successfully');
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    }
  });

  useEffect(() => {
    if (productData?.product) {
      setDemandValue(productData.product.demand.toString());
    }
  }, [productData]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    
    if (drawer.isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [drawer.isOpen]);

  const handleClose = () => {
    drawerVar({ isOpen: false, productId: null });
    setActiveTab('details');
  };

  const handleUpdateDemand = (e) => {
    e.preventDefault();
    const demand = parseInt(demandValue);
    if (isNaN(demand) || demand < 0) {
      alert('Please enter a valid demand value');
      return;
    }
    updateDemand({
      variables: {
        id: drawer.productId,
        demand
      }
    });
  };

  const handleTransferStock = (e) => {
    e.preventDefault();
    const quantity = parseInt(transferQuantity);
    if (isNaN(quantity) || quantity <= 0) {
      alert('Please enter a valid transfer quantity');
      return;
    }
    if (!targetWarehouse) {
      alert('Please select a target warehouse');
      return;
    }
    transferStock({
      variables: {
        fromWarehouse: product.warehouse,
        toWarehouse: targetWarehouse,
        productId: drawer.productId,
        quantity
      }
    });
  };

  if (!drawer.isOpen) return null;

  const product = productData?.product;
  const otherWarehouses = warehousesData?.warehouses?.filter(w => w !== product?.warehouse) || [];

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40"
        onClick={handleClose}
      />
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 transform transition-transform animate-slide-in">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Product Details</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {loading ? (
            <div className="flex-1 p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          ) : product ? (
            <>
              <div className="p-6 border-b">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{product.id}</p>
                  </div>
                  <StatusBadge stock={product.stock} demand={product.demand} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">SKU</p>
                    <p className="font-medium">{product.sku}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Warehouse</p>
                    <p className="font-medium">{product.warehouse}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Current Stock</p>
                    <p className="font-medium">{product.stock.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Current Demand</p>
                    <p className="font-medium">{product.demand.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="border-b">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'details'
                        ? 'text-primary-600 border-primary-600'
                        : 'text-gray-500 border-transparent hover:text-gray-700'
                    }`}
                  >
                    <Package className="inline h-4 w-4 mr-2" />
                    Details
                  </button>
                  <button
                    onClick={() => setActiveTab('demand')}
                    className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'demand'
                        ? 'text-primary-600 border-primary-600'
                        : 'text-gray-500 border-transparent hover:text-gray-700'
                    }`}
                  >
                    <TrendingUp className="inline h-4 w-4 mr-2" />
                    Update Demand
                  </button>
                  <button
                    onClick={() => setActiveTab('transfer')}
                    className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'transfer'
                        ? 'text-primary-600 border-primary-600'
                        : 'text-gray-500 border-transparent hover:text-gray-700'
                    }`}
                  >
                    <ArrowRightLeft className="inline h-4 w-4 mr-2" />
                    Transfer
                  </button>
                </div>
              </div>

              <div className="flex-1 p-6 overflow-y-auto">
                {activeTab === 'details' && (
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Inventory Analysis</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Coverage Days</span>
                          <span className="font-medium">
                            {product.demand > 0 ? Math.floor(product.stock / product.demand * 30) : '∞'} days
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Fulfillment Rate</span>
                          <span className="font-medium">
                            {product.demand > 0 ? Math.min(100, Math.round(product.stock / product.demand * 100)) : 100}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Shortage Risk</span>
                          <span className="font-medium">
                            {product.stock < product.demand ? product.demand - product.stock : 0} units
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        <strong>Last Updated:</strong> {new Date(product.lastUpdated).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'demand' && (
                  <form onSubmit={handleUpdateDemand} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Demand Value
                      </label>
                      <input
                        type="number"
                        value={demandValue}
                        onChange={(e) => setDemandValue(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        placeholder="Enter new demand"
                        min="0"
                        required
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={updatingDemand}
                      className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updatingDemand ? 'Updating...' : 'Update Demand'}
                    </button>
                  </form>
                )}

                {activeTab === 'transfer' && (
                  <form onSubmit={handleTransferStock} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Transfer Quantity
                      </label>
                      <input
                        type="number"
                        value={transferQuantity}
                        onChange={(e) => setTransferQuantity(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        placeholder="Enter quantity to transfer"
                        min="1"
                        max={product.stock}
                        required
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Maximum: {product.stock} units
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Target Warehouse
                      </label>
                      <select
                        value={targetWarehouse}
                        onChange={(e) => setTargetWarehouse(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        required
                      >
                        <option value="">Select warehouse</option>
                        {otherWarehouses.map(warehouse => (
                          <option key={warehouse} value={warehouse}>
                            {warehouse}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={transferring}
                      className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {transferring ? 'Transferring...' : 'Transfer Stock'}
                    </button>
                  </form>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 p-6">
              <p className="text-gray-500">Product not found</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ProductDetailsDrawer;