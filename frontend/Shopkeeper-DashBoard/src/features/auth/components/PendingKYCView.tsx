import React from 'react';
import { useAuth } from '../hooks/auth.hooks';
import { Clock, ShieldAlert, CheckCircle2, RefreshCw } from 'lucide-react';

export const PendingKYCView: React.FC = () => {
  const { user, switchDemoAccount } = useAuth();

  return (
    <div className="bg-[var(--bg-surface)] border border-amber-500/30 rounded-3xl p-7 sm:p-9 shadow-2xl relative overflow-hidden backdrop-blur-xl text-center space-y-5">
      <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto shadow-inner">
        <Clock className="w-7 h-7 animate-pulse" />
      </div>

      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          Pharmacy License Verification in Progress
        </h2>
        <p className="text-xs text-[var(--text-muted)] mt-1.5 max-w-sm mx-auto">
          Your retail drug license application for <strong className="text-[var(--text-primary)]">{user?.shopName}</strong> is under review with the State Drug Control Administration (CDSCO Form 20/21).
        </p>
      </div>

      <div className="p-3.5 rounded-2xl bg-[var(--bg-element)] border border-[var(--border)] text-xs text-left space-y-2 max-w-sm mx-auto">
        <div className="flex items-center justify-between">
          <span className="text-[var(--text-muted)]">Application ID:</span>
          <span className="font-mono font-bold text-[var(--text-primary)]">APP-2026-9912</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[var(--text-muted)]">License Applied:</span>
          <span className="font-mono font-semibold text-[var(--text-primary)]">{user?.licenseNumber || 'DL-20-B-PENDING'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[var(--text-muted)]">Estimated Approval:</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">Within 24 Hours</span>
        </div>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={() => switchDemoAccount('APPROVED')}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Fast-Track Demo Approval</span>
        </button>
      </div>
    </div>
  );
};
