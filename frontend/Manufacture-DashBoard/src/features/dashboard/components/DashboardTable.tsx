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
      title: 'Preparing QR Package',
      message: `Packaging 100,000 print QR codes for ${batch.id}...`,
    });
  };

  const handleRecall = (e: React.MouseEvent, batch: Batch) => {
    e.stopPropagation();
    setBatchToRecall(batch);
    setIsRecallModalOpen(true);
  };

  return (
    <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border)] shadow-subtle overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-[var(--border)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[var(--text-primary)]">Recent Batches</h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--bg-element)] text-[var(--text-muted)]">
              Live Production Feed
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Real-time batch lifecycle, digital minting states and verification status
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo('batches')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--brand-primary)] hover:underline px-3 py-1.5 rounded-lg hover:bg-[var(--brand-subtle)] transition-colors"
          >
            <span>View All Batches ({batches.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--bg-element)] border-b border-[var(--border)] text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              <th className="px-4 py-3">Batch ID</th>
              <th className="px-4 py-3">Medicine & Strength</th>
              <th className="px-4 py-3">Mfg Date</th>
              <th className="px-4 py-3">Expiry Date</th>
              <th className="px-4 py-3 text-right">Quantity</th>
              <th className="px-4 py-3 text-right">Packs Minted</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)] text-xs">
            {batches.slice(0, 6).map((batch) => (
              <tr
                key={batch.id}
                onClick={() => setSelectedBatch(batch)}
                className="hover:bg-[var(--bg-active)] cursor-pointer transition-colors group"
              >
                {/* Batch ID */}
                <td className="px-4 py-3.5 font-semibold text-[var(--brand-primary)] whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono">{batch.id}</span>
                    {batch.blockNumber && (
                      <span className="text-[10px] text-[var(--text-muted)] font-mono">
                        #{batch.blockNumber}
                      </span>
                    )}
                  </div>
                </td>

                {/* Medicine */}
                <td className="px-4 py-3.5 font-medium text-[var(--text-primary)]">
                  <div>
                    <div className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors">
                      {batch.medicineName}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)] font-normal">
                      {batch.dosage} • {batch.form}
                    </div>
                  </div>
                </td>

                {/* Mfg Date */}
                <td className="px-4 py-3.5 text-[var(--text-muted)] whitespace-nowrap">
                  {new Date(batch.manufacturingDate).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>

                {/* Expiry Date */}
                <td className="px-4 py-3.5 text-[var(--text-muted)] whitespace-nowrap">
                  {new Date(batch.expiryDate).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>

                {/* Total Quantity */}
                <td className="px-4 py-3.5 text-right font-medium text-[var(--text-primary)] whitespace-nowrap">
                  {batch.totalQuantity.toLocaleString()}
                </td>

                {/* Packs Minted */}
                <td className="px-4 py-3.5 text-right font-semibold text-[var(--text-primary)] whitespace-nowrap">
                  {batch.packsMinted > 0 ? (
                    <span className="text-emerald-500">
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
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBatch(batch);
                      }}
                      title="View batch details"
                      className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--brand-primary)] hover:bg-[var(--bg-element)]"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    {batch.mintStatus !== 'DRAFT' && batch.mintStatus !== 'MINTING' && (
                      <button
                        onClick={(e) => handleDownloadQR(e, batch)}
                        title="Download ZIP QR"
                        className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-emerald-500 hover:bg-[var(--bg-element)]"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {batch.mintStatus !== 'RECALLED' && (
                      <button
                        onClick={(e) => handleRecall(e, batch)}
                        title="Initiate Recall"
                        className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-rose-500 hover:bg-[var(--bg-element)]"
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
