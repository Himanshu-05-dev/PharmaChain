import React, { useState } from 'react';
import { useDashboard } from '../../features/dashboard/Hooks/dashboard.hooks';
import { useToast } from '../../context/ToastContext';
import { B2BOrder, OrderStatus } from '../../types';
import { DataTable, Column } from '../common/DataTable';
import { StatusBadge } from '../common/StatusBadge';
import {
  ShoppingCart,
  Truck,
  Package,
  Building2,
  CheckCircle2,
  Clock,
  Printer,
  Download,
  Filter,
  ArrowRight,
  Send,
} from 'lucide-react';

export const OrdersShipmentsView: React.FC = () => {
  const { orders, updateOrderStatus } = useDashboard();
  const { showToast } = useToast();

  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === 'ALL') return true;
    return o.status === statusFilter;
  });

  const handlePrintManifest = (order: B2BOrder) => {
    showToast({
      type: 'info',
      title: 'Printing Shipping Manifest',
      message: `Manifest for ${order.orderNumber} dispatched to warehouse dispatch printer.`,
    });
  };

  const columns: Column<B2BOrder>[] = [
    {
      key: 'orderNumber',
      header: 'Order PO #',
      sortable: true,
      render: (ord) => (
        <div>
          <span className="font-mono text-xs font-bold text-emerald-400">{ord.orderNumber}</span>
          <span className="text-[10px] text-[var(--text-muted)] block">{ord.id}</span>
        </div>
      ),
    },
    {
      key: 'pharmacyName',
      header: 'Pharmacy Client & License',
      sortable: true,
      render: (ord) => (
        <div>
          <div className="font-bold text-[var(--text-primary)]">{ord.pharmacyName}</div>
          <div className="text-[11px] text-[var(--text-muted)] font-mono">{ord.pharmacyLicense}</div>
        </div>
      ),
    },
    {
      key: 'items',
      header: 'Ordered Formulations',
      render: (ord) => (
        <div className="text-xs space-y-0.5">
          {ord.items.map((i, idx) => (
            <div key={idx} className="text-[var(--text-primary)]">
              <span className="font-medium">{i.medicineName}</span>{' '}
              <span className="text-[var(--text-muted)] font-mono">({i.quantity.toLocaleString()} units)</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: 'totalQuantity',
      header: 'Total Units',
      sortable: true,
      align: 'right',
      render: (ord) => (
        <span className="font-bold text-[var(--text-primary)] text-xs">
          {ord.totalQuantity.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'totalAmount',
      header: 'Order Value',
      sortable: true,
      align: 'right',
      render: (ord) => (
        <span className="font-bold text-[var(--text-primary)] text-xs">
          ₹{ord.totalAmount.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Dispatch Status',
      align: 'center',
      render: (ord) => <StatusBadge status={ord.status} size="sm" />,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (ord) => (
        <div className="flex items-center justify-end gap-1.5">
          {ord.status === 'PENDING' && (
            <button
              onClick={() => updateOrderStatus(ord.id, 'PROCESSING')}
              className="px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 text-xs font-semibold border border-sky-500/20 cursor-pointer"
            >
              Start Pick
            </button>
          )}

          {ord.status === 'PROCESSING' && (
            <button
              onClick={() => updateOrderStatus(ord.id, 'SHIPPED')}
              className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm flex items-center gap-1 cursor-pointer"
            >
              <Truck className="w-3 h-3" />
              <span>Dispatch</span>
            </button>
          )}

          <button
            onClick={() => handlePrintManifest(ord)}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-element)] border border-transparent hover:border-[var(--border)] transition-colors cursor-pointer"
            title="Print Shipping Label"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];


  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">B2B Pharmacy Orders & Logistics</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Commercial Fulfillment
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Manage pharmacy orders, automated stock reservations, and serialized dispatch tracking
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-[var(--bg-surface)] p-3 rounded-xl border border-[var(--border)] overflow-x-auto text-xs">
        <span className="text-[var(--text-muted)] font-medium flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Status:
        </span>
        {[
          { id: 'ALL', label: 'All Orders' },
          { id: 'PENDING', label: 'Pending' },
          { id: 'PROCESSING', label: 'Processing' },
          { id: 'SHIPPED', label: 'Dispatched / In Transit' },
          { id: 'DELIVERED', label: 'Delivered' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
              statusFilter === tab.id
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-element)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>


      {/* DataTable */}
      <DataTable
        data={filteredOrders}
        columns={columns}
        keyExtractor={(item) => item.id}
        searchable={true}
        searchPlaceholder="Search by PO number, pharmacy name, license..."
        searchFilter={(item, query) =>
          item.orderNumber.toLowerCase().includes(query) ||
          item.pharmacyName.toLowerCase().includes(query) ||
          item.pharmacyLicense.toLowerCase().includes(query)
        }
        pageSize={6}
      />
    </div>
  );
};
