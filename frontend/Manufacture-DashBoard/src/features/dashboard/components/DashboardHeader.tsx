import React from 'react';
import { useDashboard } from '../Hooks/dashboard.hooks';
import { useAuth } from '../../auth/hooks/auth.hooks';
import { PlusCircle, Calendar, Sparkles, CheckCircle2, Clock } from 'lucide-react';

export const DashboardHeader: React.FC = () => {
  const { profile, dateRange, setDateRange, navigateTo } = useDashboard();
  const { user, kycStatus } = useAuth();
  const activeProfile = user || profile;

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-[var(--border)]">
      <div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
            {activeProfile.name}
          </h2>
          {kycStatus === 'APPROVED' ? (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              CDSCO Verified
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              KYC Pending Review
            </span>
          )}
        </div>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
          National Drug Traceability & Real-Time Production Command Center
        </p>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        {/* Date Range Selector */}
        <div className="inline-flex items-center p-1 bg-[var(--bg-surface)] rounded-xl border border-[var(--border)] text-xs shadow-subtle">
          <Calendar className="w-3.5 h-3.5 text-[var(--text-muted)] ml-2 mr-1 shrink-0" />
          {(['Today', '7 Days', '30 Days', 'Custom'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                dateRange === range
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-element)]'
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        {/* Primary Action: Create Batch */}
        <button
          onClick={() => navigateTo('create-batch')}
          className="btn-primary flex items-center gap-2 shadow-lg shadow-emerald-600/20"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Production Batch</span>
        </button>
      </div>
    </div>
  );
};

