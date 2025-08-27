
import { useState } from 'react';
import { X, Package, TrendingUp, ArrowRightLeft } from 'lucide-react';
import { useQuery, useMutation, useReactiveVar } from '@apollo/client';
import { GET_PRODUCT, GET_WAREHOUSES, UPDATE_DEMAND, TRANSFER_STOCK, GET_PRODUCTS } from '../../graphql/queries';
import { drawerVar, filtersVar } from '../../graphql/client';
import StatusBadge from '../table/StatusBadge';

function ProductDetailsDrawer() {
  const drawer = useReactiveVar(drawerVar);
  const filters = useReactiveVar(filtersVar);
  const { data, loading } = useQuery(GET_PRODUCT, { skip: !drawer.productId, variables: { id: drawer.productId } });
  const { data: whData } = useQuery(GET_WAREHOUSES);

  const [demand, setDemand] = useState('');
  const [qty, setQty] = useState('');
  const [targetWarehouse, setTargetWarehouse] = useState('');

  const [updateDemand, { loading: updating }] = useMutation(UPDATE_DEMAND, {
    refetchQueries: [{ query: GET_PRODUCT, variables: { id: drawer.productId } }, { query: GET_PRODUCTS, variables: { ...filters, offset: 0, limit: 10 } }]
  });

  const [transferStock, { loading: transferring }] = useMutation(TRANSFER_STOCK, {
    refetchQueries: [{ query: GET_PRODUCT, variables: { id: drawer.productId } }, { query: GET_PRODUCTS, variables: { ...filters, offset: 0, limit: 10 } }]
  });

  const close = () => drawerVar({ isOpen: false, productId: null });

  if (!drawer.isOpen) return null;

  const p = data?.product;

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/30" onClick={close} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-primary-600 text-white"><Package className="w-5 h-5" /></div>
            <h2 className="text-lg font-semibold">{p?.name || 'Loading...'}</h2>
          </div>
          <button onClick={close} className="p-2 hover:bg-gray-100 rounded">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-32 bg-gray-100 rounded" />
          </div>
        ) : p ? (
          <>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <div className="text-xs uppercase text-gray-500">SKU</div>
                <div className="text-sm text-gray-900">{p.sku}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-gray-500">Warehouse</div>
                <div className="text-sm text-gray-900">{p.warehouse}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-gray-500">Stock</div>
                <div className="text-sm text-gray-900">{p.stock}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-gray-500">Demand</div>
                <div className="text-sm text-gray-900">{p.demand}</div>
              </div>
              <div className="col-span-2">
                <StatusBadge stock={p.stock} demand={p.demand} />
              </div>
            </div>

            <div className="space-y-6">
              <section className="border rounded-lg p-4">
                <h3 className="font-medium flex items-center gap-2 mb-3"><TrendingUp className="w-4 h-4" /> Update Demand</h3>
                <div className="flex gap-2">
                  <input type="number" className="flex-1 border rounded px-3 py-2" placeholder="New demand"
                    value={demand} onChange={(e) => setDemand(e.target.value)} />
                  <button
                    onClick={() => { if (demand) updateDemand({ variables: { id: p.id, demand: parseInt(demand, 10) } }); }}
                    disabled={updating || !demand}
                    className="px-3 py-2 rounded bg-primary-600 text-white disabled:opacity-50"
                  >Save</button>
                </div>
              </section>

              <section className="border rounded-lg p-4">
                <h3 className="font-medium flex items-center gap-2 mb-3"><ArrowRightLeft className="w-4 h-4" /> Transfer Stock</h3>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <select className="border rounded px-3 py-2 flex-1" value={targetWarehouse} onChange={(e) => setTargetWarehouse(e.target.value)}>
                      <option value="">Select target warehouse</option>
                      {(whData?.warehouses || []).filter(w => w !== p.warehouse).map((w) => (
                        <option key={w} value={w}>{w}</option>
                      ))}
                    </select>
                    <input type="number" className="border rounded px-3 py-2 w-32" placeholder="Qty"
                      value={qty} onChange={(e) => setQty(e.target.value)} />
                  </div>
                  <button
                    onClick={() => {
                      if (qty && targetWarehouse) {
                        transferStock({
                          variables: { fromWarehouse: p.warehouse, toWarehouse: targetWarehouse, productId: p.id, quantity: parseInt(qty, 10) }
                        });
                      }
                    }}
                    disabled={transferring || !qty || !targetWarehouse}
                    className="self-start px-3 py-2 rounded bg-primary-600 text-white disabled:opacity-50"
                  >Transfer</button>
                </div>
              </section>
            </div>
          </>
        ) : (
          <div className="text-sm text-gray-600">Product not found.</div>
        )}
      </div>
    </div>
  );
}

export default ProductDetailsDrawer;
