import React, { useState, useMemo } from 'react';
import { useDashboard } from '../../features/dashboard/Hooks/dashboard.hooks';
import { useToast } from '../../context/ToastContext';
import { InventoryItem } from '../../types';
import { DataTable, Column } from '../common/DataTable';
import { StatusBadge } from '../common/StatusBadge';
import {
  Package,
  PlusCircle,
  Download,
  AlertTriangle,
  Layers,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertOctagon,
  Boxes,
} from 'lucide-react';
import { TableSkeleton } from '../common/SkeletonLoader';

export const MedicineInventoryView: React.FC = () => {
  const { inventory, loading, setActiveNav } = useDashboard();
  const { showToast } = useToast();

  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      if (categoryFilter !== 'ALL' && item.category !== categoryFilter) return false;
      if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
      return true;
    });
  }, [inventory, categoryFilter, statusFilter]);

  const handleExportCatalog = () => {
    showToast({
      type: 'success',
      title: 'Catalog Exported',
      message: 'MedCore_Live_Medicine_Inventory.csv downloaded successfully.',
    });
  };

  const columns: Column<InventoryItem>[] = [
    {
      key: 'sku',
      header: 'SKU Code',
      sortable: true,
      render: (item) => (
        <span className="font-mono text-xs font-bold text-emerald-500 dark:text-emerald-400">{item.sku}</span>
      ),
    },
    {
      key: 'medicineName',
      header: 'Medicine & Generic Name',
      sortable: true,
      render: (item) => (
        <div>
          <div className="font-bold text-[var(--text-primary)]">{item.medicineName}</div>
          <div className="text-[11px] text-[var(--text-muted)]">{item.genericName}</div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Therapeutic Category',
      sortable: true,
      render: (item) => (
        <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[var(--bg-element)] text-[var(--text-primary)] border border-[var(--border)]">
          {item.category}
        </span>
      ),
    },
    {
      key: 'form',
      header: 'Dosage Form & Strength',
      render: (item) => (
        <span className="text-[var(--text-muted)]">
          {item.form} ({item.strength})
        </span>
      ),
    },
    {
      key: 'activeBatchesCount',
      header: 'Active Batches',
      sortable: true,
      align: 'center',
      render: (item) => (
        <span className="font-semibold text-[var(--text-primary)]">{item.activeBatchesCount}</span>
      ),
    },
    {
      key: 'totalPacks',
      header: 'Current Available Stock',
      sortable: true,
      align: 'right',
      render: (item) => (
        <div className="text-right">
          <span
            className={`font-bold text-sm ${
              item.status === 'RECALLED'
                ? 'text-rose-500 line-through'
                : item.status === 'LOW_STOCK'
                ? 'text-amber-500'
                : 'text-[var(--text-primary)]'
            }`}
          >
            {item.totalPacks.toLocaleString()}
          </span>
          <span className="text-[10px] text-[var(--text-muted)] block font-mono">packs</span>
        </div>
      ),
    },
    {
      key: 'unitPrice',
      header: 'Unit MRP (₹)',
      sortable: true,
      align: 'right',
      render: (item) => (
        <span className="font-mono font-medium text-[var(--text-primary)]">
          ₹{item.unitPrice.toFixed(2)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Stock Status',
      align: 'center',
      render: (item) => <StatusBadge status={item.status} size="sm" />,
    },
  ];

  if (loading) {
    return <TableSkeleton rows={8} />;
  }

  return (
    <div className="space-y-5">
      {/* Top Overview Banner */}
      <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Medicine Inventory Catalog</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              84 Formulations Active
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Real-time finished pharmaceutical stock across central packaging depots and warehouses
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportCatalog}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[var(--text-primary)] bg-[var(--bg-surface)] hover:bg-[var(--bg-element)] border border-[var(--border)] rounded-xl shadow-subtle transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            <span>Export Catalog CSV</span>
          </button>

          <button
            onClick={() => setActiveNav('create-batch')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-sm shadow-emerald-600/30 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Production Batch</span>
          </button>
        </div>
      </div>

      {/* 6 Top Metric Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-subtle">
          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">
            Total Products
          </span>
          <span className="text-2xl font-black text-[var(--text-primary)] mt-1 block">84</span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5 block">
            +3.2% vs last month
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-subtle">
          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">
            Active Batches
          </span>
          <span className="text-2xl font-black text-[var(--text-primary)] mt-1 block">216</span>
          <span className="text-[10px] text-[var(--text-muted)] font-medium mt-0.5 block">
            Across 3 facilities
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-subtle">
          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">
            Total Packs
          </span>
          <span className="text-2xl font-black text-emerald-500 dark:text-emerald-400 mt-1 block">2.48M</span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5 block">
            100% Cryptographic QR
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[var(--alert-warning-bg)] border border-[var(--alert-warning-border)] shadow-subtle">
          <span className="text-[10px] font-bold text-[var(--alert-warning-text)] uppercase tracking-wider block">
            Low Stock
          </span>
          <span className="text-2xl font-black text-[var(--alert-warning-heading)] mt-1 block">12</span>
          <span className="text-[10px] text-[var(--alert-warning-text)] font-medium mt-0.5 block">
            Threshold below 25k
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-subtle">
          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">
            Expiring Soon
          </span>
          <span className="text-2xl font-black text-[var(--text-primary)] mt-1 block">18</span>
          <span className="text-[10px] text-[var(--text-muted)] font-medium mt-0.5 block">
            Within 90 Days
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[var(--alert-danger-bg)] border border-[var(--alert-danger-border)] shadow-subtle">
          <span className="text-[10px] font-bold text-[var(--alert-danger-text)] uppercase tracking-wider block">
            Recalled
          </span>
          <span className="text-2xl font-black text-[var(--alert-danger-heading)] mt-1 block">3</span>
          <span className="text-[10px] text-[var(--alert-danger-text)] font-medium mt-0.5 block">
            Quarantined in Depots
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[var(--bg-surface)] p-3 rounded-xl border border-[var(--border)]">
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <span className="text-[var(--text-muted)] font-medium flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {['ALL', 'Antibiotics', 'Analgesics', 'Antidiabetic', 'Gastrointestinal', 'Cardiovascular'].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-element)]'
                }`}
              >
                {cat}
              </button>
            )
          )}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-element)] text-[var(--text-primary)] font-medium"
          >
            <option value="ALL" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">All Stock Statuses</option>
            <option value="HEALTHY" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Healthy Stock</option>
            <option value="LOW_STOCK" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Low Stock Alert</option>
            <option value="RECALLED" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Recalled Products</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <DataTable
        data={filteredInventory}
        columns={columns}
        keyExtractor={(item) => item.id}
        searchable={true}
        searchPlaceholder="Search by medicine name, generic formula, SKU code..."
        searchFilter={(item, query) =>
          item.medicineName.toLowerCase().includes(query) ||
          item.genericName.toLowerCase().includes(query) ||
          item.sku.toLowerCase().includes(query)
        }
        pageSize={7}
      />
    </div>
  );
};
