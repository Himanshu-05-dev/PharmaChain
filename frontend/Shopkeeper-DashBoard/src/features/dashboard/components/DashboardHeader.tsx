import React from 'react';
import { useDashboard } from '../Hooks/dashboard.hooks';
import { useAuth } from '../../auth/hooks/auth.hooks';
import {
  QrCode,
  ArrowDownToLine,
  CheckCircle2,
  Calendar,
  Sparkles,
  Store,
} from 'lucide-react';

export const DashboardHeader: React.FC = () => {
  const { user } = useAuth();
  const { navigateTo, setIsScanModalOpen, setActiveScanMode } = useDashboard();

  const handleLaunchPOS = () => {
    setActiveScanMode('DISPENSE');
    navigateTo('pos');
  };

  const handleLaunchIntake = () => {
    setActiveScanMode('RECEIVE');
    navigateTo('intake');
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-[var(--bg-surface)] p-6 rounded-3xl border border-[var(--border)] shadow-subtle">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--text-primary)]">
            {user?.shopName || 'Retail Pharmacy POS Terminal'}
          </h1>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> CDSCO Form 20/21 Licensed
          </span>
        </div>
        <p className="text-xs text-[var(--text-muted)] font-medium">
          License No: <strong className="text-[var(--text-primary)] font-mono">{user?.licenseNumber || 'DL-20-B-2023-88741'}</strong> • Pharmacist in charge: <strong className="text-[var(--text-primary)]">{user?.ownerName || 'Dr. Rajesh Sharma'}</strong>
        </p>
      </div>

      {/* Quick Launch Action Buttons */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <button
          onClick={handleLaunchIntake}
          className="px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-element)] hover:bg-[var(--bg-active)] text-xs font-semibold text-[var(--text-primary)] flex items-center gap-2 transition-all cursor-pointer shadow-xs"
        >
          <ArrowDownToLine className="w-4 h-4 text-sky-500" />
          <span>Receive Inbound Stock</span>
        </button>

        <button
          onClick={handleLaunchPOS}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
        >
          <QrCode className="w-4 h-4" />
          <span>Launch POS Dispenser</span>
        </button>
      </div>
    </div>
  );
};
