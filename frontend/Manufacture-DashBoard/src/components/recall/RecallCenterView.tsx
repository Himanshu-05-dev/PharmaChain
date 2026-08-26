import React from 'react';
import { useDashboard } from '../../features/dashboard/Hooks/dashboard.hooks';
import { StatusBadge } from '../common/StatusBadge';
import {
  AlertOctagon,
  ShieldAlert,
  Radio,
  Lock,
  Plus,
  FileCheck,
  Building2,
  CheckCircle2,
  Download,
  AlertTriangle,
} from 'lucide-react';
import { ActivitySkeleton } from '../common/SkeletonLoader';
import { useToast } from '../../context/ToastContext';

export const RecallCenterView: React.FC = () => {
  const { recalls, loading, setIsRecallModalOpen, setBatchToRecall } = useDashboard();
  const { showToast } = useToast();

  const activeRecalls = recalls.filter((r) => r.status === 'ACTIVE');

  const handleExportRecallReport = (recallId: string) => {
    showToast({
      type: 'success',
      title: 'Regulatory Report Exported',
      message: `CDSCO_Form28A_${recallId}_Report.pdf downloaded.`,
    });
  };

  if (loading) {
    return <ActivitySkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--alert-danger-border)] shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Recall & Safety Command Center</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[var(--alert-danger-badge-bg)] text-[var(--alert-danger-badge-text)] border border-[var(--alert-danger-border)] flex items-center gap-1">
              <Radio className="w-2.5 h-2.5 animate-pulse text-[var(--alert-danger-icon)]" />
              Cascading Enforcement Online
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Immediate supply-chain wide batch isolation, point-of-sale terminal lock, and CDSCO Form 28-A statutory filings
          </p>
        </div>

        <button
          onClick={() => {
            setBatchToRecall(null);
            setIsRecallModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30 transition-all hover:scale-[1.02] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Initiate New Batch Recall</span>
        </button>
      </div>

      {/* 4 Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[var(--alert-danger-bg)] border border-[var(--alert-danger-border)] shadow-subtle">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--alert-danger-text)] block">
            Active Recalls
          </span>
          <span className="text-3xl font-black text-[var(--alert-danger-heading)] mt-1 block">
            {activeRecalls.length}
          </span>
          <span className="text-[10px] text-[var(--alert-danger-text)] font-medium mt-0.5 block">
            Immediate Quarantine Enforced
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-subtle">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
            Affected Batches
          </span>
          <span className="text-3xl font-black text-[var(--text-primary)] mt-1 block">7</span>
          <span className="text-[10px] text-[var(--text-muted)] font-medium mt-0.5 block">
            100% Notified via Fabric
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-subtle">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
            Affected Physical Packs
          </span>
          <span className="text-3xl font-black text-[var(--text-primary)] mt-1 block">12,450</span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5 block">
            92% Retrieved to Warehouses
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[var(--alert-warning-bg)] border border-[var(--alert-warning-border)] shadow-subtle">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--alert-warning-text)] block">
            Pharmacy POS Interceptions
          </span>
          <span className="text-3xl font-black text-[var(--alert-warning-heading)] mt-1 block">48</span>
          <span className="text-[10px] text-[var(--alert-warning-text)] font-medium mt-0.5 block">
            Attempted Sales Blocked
          </span>
        </div>
      </div>

      {/* Recall Cards List */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
          Active & Investigated Recall Records
        </h3>

        {recalls.map((recall) => (
          <div
            key={recall.id}
            className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--alert-danger-border)] shadow-subtle space-y-4 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-rose-600" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-[var(--alert-danger-badge-bg)] text-[var(--alert-danger-badge-text)] border border-[var(--alert-danger-border)]">
                    {recall.batchId}
                  </span>
                  <h4 className="text-base font-extrabold text-[var(--text-primary)]">
                    {recall.medicineName}
                  </h4>
                  <span className="text-xs text-[var(--text-muted)] font-medium">({recall.dosage})</span>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Initiated on {new Date(recall.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })} by {recall.initiatedBy}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-600 text-white flex items-center gap-1 shadow-xs">
                  <Lock className="w-3 h-3" /> ACTIVE RECALL
                </span>

                <button
                  onClick={() => handleExportRecallReport(recall.id)}
                  className="p-2 rounded-xl border border-[var(--border)] hover:bg-[var(--bg-element)] text-[var(--text-primary)] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Export CDSCO Form 28-A Dossier"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Dossier PDF</span>
                </button>
              </div>
            </div>

            {/* Reason Box */}
            <div className="p-3.5 rounded-xl bg-[var(--alert-danger-bg)] border border-[var(--alert-danger-border)] text-xs text-[var(--alert-danger-text)] font-medium">
              <span className="font-bold block mb-0.5 text-[var(--alert-danger-heading)]">Official Root Cause Finding:</span>
              <p>{recall.reason}</p>
            </div>

            {/* Quarantine Enforcement Actions */}
            <div className="space-y-1.5 text-xs">
              <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">
                Automated Supply Chain Cascade Enforcement Log:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {recall.quarantineActionsTaken.map((act, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-[var(--bg-element)] border border-[var(--border)] flex items-center gap-2 text-[var(--text-primary)]"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
