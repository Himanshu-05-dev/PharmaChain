import React from 'react';
import { useDashboard } from '../../features/dashboard/Hooks/dashboard.hooks';
import {
  AlertOctagon,
  ShieldAlert,
  Lock,
  Radio,
  FileCheck2,
  CheckCircle2,
  PhoneCall,
  Plus,
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { ReportIncidentModal } from './ReportIncidentModal';

export const RecallHubView: React.FC = () => {
  const { recalls, fraudReports, setIsIncidentModalOpen, isIncidentModalOpen } = useDashboard();

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              CDSCO Quality Recall & Incident Center
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              CDSCO Form 28-A Sync
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Real-time synchronization with Central Drugs Standard Control Organisation (CDSCO) recall notifications & automatic point-of-sale barcode lock
          </p>
        </div>

        <button
          onClick={() => setIsIncidentModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-rose-600/25 transition-all cursor-pointer"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Report Suspicious / Fake Pack</span>
        </button>
      </div>

      {/* Active Recalls List */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
          Active Statutory Recall Directives
        </h3>

        {recalls.map((recall) => (
          <div
            key={recall.id}
            className="p-6 rounded-3xl bg-[var(--alert-danger-bg)] border border-[var(--alert-danger-border)] shadow-subtle space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--alert-danger-border)]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-[var(--alert-danger-badge-bg)] text-[var(--alert-danger-icon)] border border-[var(--alert-danger-border)]">
                  <AlertOctagon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[var(--alert-danger-heading)]">
                    {recall.medicineName}
                  </h4>
                  <p className="text-xs text-[var(--alert-danger-text)] font-medium">
                    Batch: <strong className="font-mono">{recall.batchId}</strong> • Manufacturer: {recall.manufacturer}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--alert-danger-badge-bg)] text-[var(--alert-danger-badge-text)] border border-[var(--alert-danger-border)] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[var(--alert-danger-icon)]" />
                  <span>POS Barcode Locked</span>
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="text-[var(--alert-danger-text)] font-medium leading-relaxed">
                <strong>CDSCO Statutory Directive:</strong> {recall.reason}
              </div>

              <div className="space-y-1 pt-1">
                <span className="text-[11px] font-bold text-[var(--alert-danger-heading)] uppercase tracking-wider block">
                  Mandatory Pharmacy Compliance Checklist:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  {recall.quarantineActionsTaken.map((act, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--alert-danger-border)] text-[var(--text-primary)] flex items-center gap-2 text-xs font-medium"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="truncate">{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fraud Incidents Log */}
      <div className="bg-[var(--bg-surface)] p-6 rounded-3xl border border-[var(--border)] shadow-subtle space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              Counterfeit Interception Log & Drug Inspector Reports
            </h3>
          </div>
        </div>

        <div className="divide-y divide-[var(--border)] text-xs">
          {fraudReports.map((inc) => (
            <div key={inc.id} className="py-3 flex items-center justify-between gap-3">
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[var(--text-primary)]">{inc.medicineName}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400">
                    {inc.detectedIssue}
                  </span>
                </div>
                <p className="font-mono text-[10px] text-[var(--text-muted)] truncate">
                  Hash: {inc.packHash} • Intercepted: {new Date(inc.scannedAt).toLocaleString()}
                </p>
              </div>

              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> CDSCO Inspector Notified
              </span>
            </div>
          ))}
        </div>
      </div>

      {isIncidentModalOpen && <ReportIncidentModal />}
    </div>
  );
};
