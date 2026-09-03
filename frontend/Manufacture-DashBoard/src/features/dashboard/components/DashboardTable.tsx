import React from 'react';
import { useDashboard } from '../Hooks/dashboard.hooks';
import { useToast } from '../../../context/ToastContext';
import { Batch } from '../../../types';
import { StatusBadge } from '../../../components/common/StatusBadge';
import {
  Eye,
  QrCode,
  AlertOctagon,
  ArrowRight,
  Database,
  Search,
} from 'lucide-react';

export const DashboardTable: React.FC = () => {
  const {
    batches,
    setSelectedBatch,
    navigateTo,
    setBatchToRecall,
    setIsRecallModalOpen,
  } = useDashboard();
  const { showToast } = useToast();

  const handleDownloadQR = (e: React.MouseEvent, batch: Batch) => {
    e.stopPropagation();
    showToast({
      type: 'info',
      title: 'Packaging GS1 DataMatrix Codes',
      message: `Exporting thermal label print package for ${batch.id}...`,
    });
  };

  const handleRecall = (e: React.MouseEvent, batch: Batch) => {
    e.stopPropagation();
    setBatchToRecall(batch);
    setIsRecallModalOpen(true);
  };

  return (
    <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border)] shadow-xs overflow-hidden">
      {/* Table Card Header */}
      <div className="p-4 sm:p-5 border-b border-[var(--border)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black text-[var(--text-primary)]">Recent Production Batches</h3>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              Live CDSCO Ledger Stream
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Real-time batch lifecycle, digital minting states and verification status
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo('batches')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 hover:text-amber-400 px-3 py-1.5 rounded-xl hover:bg-[var(--bg-element)] transition-colors cursor-pointer border border-[var(--border)]"
          >
            <span>View All Batches ({batches.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Table Data Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--bg-element)] border-b border-[var(--border)] text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
              <th className="px-4 py-3">Batch ID & Block</th>
              <th className="px-4 py-3">Medicine & Formulation</th>
              <th className="px-4 py-3">Mfg Date</th>
              <th className="px-4 py-3">Expiry Date</th>
              <th className="px-4 py-3 text-right">Batch Quantity</th>
              <th className="px-4 py-3 text-right">Minted QRs</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)] text-xs">
            {batches.slice(0, 6).map((batch) => (
              <tr
                key={batch.id}
                onClick={() => setSelectedBatch(batch)}
                className="hover:bg-[var(--bg-element)] cursor-pointer transition-colors group"
              >
                {/* Batch ID */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-[var(--text-primary)] group-hover:text-amber-500 transition-colors">
                      {batch.id}
                    </span>
                    {batch.blockNumber && (
                      <span className="text-[10px] text-[var(--text-muted)] font-mono bg-[var(--bg-element)] px-1.5 py-0.2 rounded border border-[var(--border)]">
                        #{batch.blockNumber}
                      </span>
                    )}
                  </div>
                </td>

                {/* Medicine */}
                <td className="px-4 py-3.5">
                  <div className="min-w-[180px]">
                    <div className="font-bold text-xs text-[var(--text-primary)] truncate">
                      {batch.medicineName}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)] font-medium truncate mt-0.5">
                      {batch.dosage} • {batch.form}
                    </div>
                  </div>
                </td>

                {/* Mfg Date */}
                <td className="px-4 py-3.5 text-[var(--text-muted)] whitespace-nowrap font-mono text-[11px]">
                  {new Date(batch.manufacturingDate).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>

                {/* Expiry Date */}
                <td className="px-4 py-3.5 text-[var(--text-muted)] whitespace-nowrap font-mono text-[11px]">
                  {new Date(batch.expiryDate).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>

                {/* Total Quantity */}
                <td className="px-4 py-3.5 text-right font-mono font-bold text-[var(--text-primary)] whitespace-nowrap">
                  {batch.totalQuantity.toLocaleString()}
                </td>

                {/* Packs Minted */}
                <td className="px-4 py-3.5 text-right whitespace-nowrap font-mono font-bold">
                  {batch.packsMinted > 0 ? (
                    <span className="text-emerald-600 dark:text-emerald-400">
                      {batch.packsMinted.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-[var(--text-muted)]">0</span>
                  )}
                </td>

                {/* Status Badge */}
                <td className="px-4 py-3.5 text-center whitespace-nowrap">
                  <StatusBadge status={batch.mintStatus} size="sm" />
                </td>

                {/* Actions */}
                <td className="px-4 py-3.5 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBatch(batch);
                      }}
                      title="Inspect Batch Details"
                      className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-amber-500 hover:bg-[var(--bg-surface)] border border-transparent hover:border-[var(--border)] transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    {batch.mintStatus !== 'DRAFT' && batch.mintStatus !== 'MINTING' && (
                      <button
                        onClick={(e) => handleDownloadQR(e, batch)}
                        title="Download GS1 Print Package"
                        className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-emerald-500 hover:bg-[var(--bg-surface)] border border-transparent hover:border-[var(--border)] transition-colors cursor-pointer"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {batch.mintStatus !== 'RECALLED' && (
                      <button
                        onClick={(e) => handleRecall(e, batch)}
                        title="Initiate Recall Notice"
                        className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-rose-500 hover:bg-[var(--bg-surface)] border border-transparent hover:border-[var(--border)] transition-colors cursor-pointer"
                      >
                        <AlertOctagon className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardTable;
