import React, { useState } from 'react';
import { useDashboard } from '../../features/dashboard/Hooks/dashboard.hooks';
import { useToast } from '../../context/ToastContext';
import {
  BellRing,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Filter,
  Check,
  ShieldCheck,
  Radio,
} from 'lucide-react';
import { ActivitySkeleton } from '../common/SkeletonLoader';

export const QualityAlertsView: React.FC = () => {
  const { alerts, loading, resolveAlert } = useDashboard();
  const { showToast } = useToast();

  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const filteredAlerts = alerts.filter((a) => {
    if (categoryFilter === 'ALL') return true;
    return a.category === categoryFilter;
  });

  const handleTriggerInvestigation = (alertId: string) => {
    showToast({
      type: 'info',
      title: 'Investigation Team Dispatched',
      message: `Enforcement protocol triggered for incident ${alertId}. Local CDSCO inspector notified.`,
    });
  };

  if (loading) {
    return <ActivitySkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Quality & Anti-Counterfeiting Incident Hub</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[var(--alert-warning-badge-bg)] text-[var(--alert-warning-text)] border border-[var(--alert-warning-border)]">
              Live Threat Intelligence
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Real-time telemetry gathered from consumer mobile scans, retail POS intake terminals, and cryptographic verification logs
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-[var(--bg-surface)] p-3 rounded-xl border border-[var(--border)] overflow-x-auto text-xs">
        <span className="text-[var(--text-muted)] font-medium flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Filter Category:
        </span>
        {[
          { id: 'ALL', label: 'All Alerts' },
          { id: 'COUNTERFEIT_SCAN', label: 'Counterfeit & Barcode Clones' },
          { id: 'LICENSE_EXPIRY', label: 'License & Compliance' },
          { id: 'MINTING_STATUS', label: 'Minting Confirmations' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCategoryFilter(tab.id)}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
              categoryFilter === tab.id
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-element)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Alerts Grid */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const isCritical = alert.type === 'CRITICAL';
          const isSuccess = alert.type === 'SUCCESS';
          const isWarning = alert.type === 'WARNING';

          const cardBg = isCritical
            ? 'bg-[var(--alert-danger-bg)] border-[var(--alert-danger-border)]'
            : isWarning
            ? 'bg-[var(--alert-warning-bg)] border-[var(--alert-warning-border)]'
            : 'bg-[var(--alert-success-bg)] border-[var(--alert-success-border)]';

          const iconBg = isCritical
            ? 'bg-[var(--alert-danger-badge-bg)] text-[var(--alert-danger-icon)]'
            : isWarning
            ? 'bg-[var(--alert-warning-badge-bg)] text-[var(--alert-warning-icon)]'
            : 'bg-[var(--alert-success-badge-bg)] text-[var(--alert-success-icon)]';

          return (
            <div
              key={alert.id}
              className={`p-6 rounded-2xl border transition-all ${cardBg}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className={`p-3 rounded-xl shrink-0 ${iconBg}`}>
                    {isCritical ? (
                      <ShieldAlert className="w-5 h-5" />
                    ) : isSuccess ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-[var(--text-muted)]">
                        {alert.id}
                      </span>
                      <h4 className="text-sm font-bold text-[var(--text-primary)]">
                        {alert.title}
                      </h4>
                    </div>

                    <p className="text-xs text-[var(--text-muted)] leading-relaxed max-w-2xl">
                      {alert.description}
                    </p>

                    {alert.location && (
                      <div className="flex items-center gap-1 text-xs text-[var(--text-muted)] font-medium pt-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        <span>{alert.location}</span>
                        {alert.reporter && (
                          <span className="text-[var(--text-muted)]"> • Reported by: {alert.reporter}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex sm:flex-col items-end justify-between gap-2 shrink-0">
                  <span className="text-[11px] text-[var(--text-muted)] font-medium">
                    {alert.timestamp}
                  </span>

                  <div className="flex items-center gap-2">
                    {isCritical && (
                      <button
                        onClick={() => handleTriggerInvestigation(alert.id)}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
                      >
                        Trigger Triage
                      </button>
                    )}

                    {!alert.resolved ? (
                      <button
                        onClick={() => resolveAlert(alert.id)}
                        className="px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-active)] border border-[var(--border)] text-[var(--text-primary)] text-xs font-semibold shadow-subtle transition-all cursor-pointer"
                      >
                        Mark Resolved
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[var(--alert-success-badge-bg)] text-[var(--alert-success-text)] border border-[var(--alert-success-border)]">
                        <Check className="w-3.5 h-3.5" /> Resolved
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
