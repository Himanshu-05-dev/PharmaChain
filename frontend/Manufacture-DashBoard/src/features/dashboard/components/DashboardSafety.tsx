import React from 'react';
import { useDashboard } from '../Hooks/dashboard.hooks';
import {
  AlertOctagon,
  ShieldAlert,
  ArrowRight,
  Plus,
  BellRing,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Check,
} from 'lucide-react';

export const DashboardSafety: React.FC = () => {
  const { recalls, alerts, navigateTo, setIsRecallModalOpen, resolveAlert } = useDashboard();

  const activeRecalls = recalls.filter((r) => r.status === 'ACTIVE');

  return (
    <div className="space-y-6">
      {/* 1. Active Recall Banner */}
      <div className="rounded-2xl border border-[var(--alert-danger-border)] bg-[var(--alert-danger-bg)] p-5 sm:p-6 shadow-subtle relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-[var(--alert-danger-badge-bg)] text-[var(--alert-danger-icon)] border border-[var(--alert-danger-border)] shrink-0">
              <AlertOctagon className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-[var(--alert-danger-heading)]">
                  Active Supply Chain Recalls ({activeRecalls.length})
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--alert-danger-badge-bg)] text-[var(--alert-danger-badge-text)] border border-[var(--alert-danger-border)]">
                  CDSCO Form 28-A Enforced
                </span>
              </div>
              <p className="text-xs text-[var(--alert-danger-text)] max-w-2xl font-medium">
                Batch quarantine is synchronized across all pharmacy terminals. Retail POS checkouts for recalled serials are rejected.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsRecallModalOpen(true)}
              className="btn-danger text-xs cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Initiate Recall</span>
            </button>

            <button
              onClick={() => navigateTo('recalls')}
              className="btn-secondary text-xs cursor-pointer"
            >
              <span>Recall Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Recalled Cards Mini Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-[var(--alert-danger-border)]">
          {activeRecalls.map((recall) => (
            <div
              key={recall.id}
              onClick={() => navigateTo('recalls')}
              className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--alert-danger-border)] hover:border-rose-500 transition-colors cursor-pointer shadow-xs"
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-mono font-bold text-[var(--alert-danger-text)]">{recall.batchId}</span>
                <span className="text-[10px] text-[var(--text-muted)]">
                  {recall.affectedPacks.toLocaleString()} units
                </span>
              </div>
              <p className="text-xs font-semibold text-[var(--text-primary)] truncate">
                {recall.medicineName}
              </p>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5 line-clamp-1">
                {recall.reason}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Quality Alerts & Fraud Interception */}
      <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border)] p-5 shadow-subtle space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[var(--bg-element)] text-[var(--brand-primary)]">
              <BellRing className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                Security & Fraud Interception Telemetry
              </h3>
              <p className="text-[11px] text-[var(--text-muted)]">
                Live verification logs from consumer mobile and retail POS terminals
              </p>
            </div>
          </div>

          <button
            onClick={() => navigateTo('alerts')}
            className="text-xs font-semibold text-[var(--brand-primary)] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({alerts.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {alerts.slice(0, 3).map((alert) => {
            const isCritical = alert.type === 'CRITICAL';
            const isWarning = alert.type === 'WARNING';

            const bgClass = isCritical
              ? 'bg-[var(--alert-danger-bg)] border-[var(--alert-danger-border)]'
              : isWarning
              ? 'bg-[var(--alert-warning-bg)] border-[var(--alert-warning-border)]'
              : 'bg-[var(--alert-success-bg)] border-[var(--alert-success-border)]';

            const badgeBg = isCritical
              ? 'bg-[var(--alert-danger-badge-bg)] text-[var(--alert-danger-icon)]'
              : isWarning
              ? 'bg-[var(--alert-warning-badge-bg)] text-[var(--alert-warning-icon)]'
              : 'bg-[var(--alert-success-badge-bg)] text-[var(--alert-success-icon)]';

            return (
              <div
                key={alert.id}
                className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${bgClass}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${badgeBg}`}>
                    {isCritical ? (
                      <ShieldAlert className="w-4 h-4" />
                    ) : isWarning ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-[var(--text-primary)]">
                      {alert.title}
                    </h4>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5 line-clamp-1">
                      {alert.description}
                    </p>
                    {alert.location && (
                      <div className="flex items-center gap-1 text-[10px] text-[var(--text-muted)] mt-1">
                        <MapPin className="w-3 h-3 text-rose-500" />
                        <span>{alert.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {!alert.resolved ? (
                    <button
                      onClick={() => resolveAlert(alert.id)}
                      className="px-2.5 py-1 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-active)] text-xs font-semibold text-[var(--text-primary)] border border-[var(--border)] transition-colors cursor-pointer shadow-xs"
                    >
                      Resolve
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      <Check className="w-3.5 h-3.5" /> Resolved
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
