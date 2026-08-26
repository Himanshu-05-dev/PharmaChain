import React, { useMemo } from 'react';
import { useDashboard } from '../Hooks/dashboard.hooks';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ExternalLink,
  Award,
  Key,
  Pill,
} from 'lucide-react';

export const DashboardCompany: React.FC = () => {
  const { profile, batches, navigateTo } = useDashboard();

  const topProducts = useMemo(() => {
    if (batches.length === 0) return [];
    const grouped: Record<string, { medicineName: string; count: number }> = {};
    for (const b of batches) {
      if (!grouped[b.medicineName]) {
        grouped[b.medicineName] = { medicineName: b.medicineName, count: 0 };
      }
      grouped[b.medicineName].count += b.packsMinted || 0;
    }
    const sorted = Object.values(grouped).sort((a, b) => b.count - a.count);
    const maxCount = sorted[0]?.count || 1;
    return sorted.slice(0, 4).map((p, idx) => ({
      id: `TOP-${idx}`,
      medicineName: p.medicineName,
      packsCount: p.count,
      revenueShare: Math.min(100, Math.round((p.count / maxCount) * 100)),
    }));
  }, [batches]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* 1. Manufacturer Digital Verification Card (6 Cols) */}
      <div className="lg:col-span-6 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border)] p-5 shadow-subtle flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
                <Building2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">Digital Manufacturer Identity</h3>
            </div>

            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
              <CheckCircle2 className="w-3 h-3" />
              CDSCO Verified
            </span>
          </div>

          <div className="mt-4 space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-[var(--bg-element)] border border-[var(--border)] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold block">Company Name</span>
                <span className="font-bold text-[var(--text-primary)] mt-0.5 block">{profile.name || 'Verified Manufacturer'}</span>
              </div>
              <span className="font-mono text-xs text-[var(--brand-primary)] bg-[var(--brand-subtle)] px-2 py-0.5 rounded">
                {profile.id || 'MFR_CDSCO'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-[var(--bg-element)] border border-[var(--border)]">
                <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold block">CDSCO License</span>
                <span className="font-mono font-bold text-[var(--text-primary)] text-[11px] block mt-0.5">
                  {profile.licenseNumber || 'CDSCO-MFG-PENDING'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--bg-element)] border border-[var(--border)]">
                <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold block">ES256 Key Status</span>
                <span className="font-semibold text-emerald-400 text-[11px] block mt-0.5 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Hardware Vault
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => navigateTo('profile')}
            className="btn-secondary flex-1 text-xs justify-center"
          >
            Company Profile
          </button>
          <button
            onClick={() => navigateTo('security')}
            className="btn-secondary flex-1 text-xs justify-center"
          >
            Cryptographic Vault
          </button>
        </div>
      </div>

      {/* 2. Top Products Production Summary (6 Cols) */}
      <div className="lg:col-span-6 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border)] p-5 shadow-subtle flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-950/40 text-indigo-400 border border-indigo-800/50">
                <Pill className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">Top Formulations Velocity</h3>
            </div>
            <span className="text-[11px] text-[var(--text-muted)]">By Volume Minted</span>
          </div>

          <div className="mt-3 space-y-2.5">
            {topProducts.length > 0 ? (
              topProducts.map((product) => (
                <div key={product.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[var(--text-primary)]">{product.medicineName}</span>
                    <span className="font-bold text-[var(--text-primary)]">{product.packsCount.toLocaleString()} packs</span>
                  </div>
                  <div className="w-full bg-[var(--bg-element)] rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-[var(--brand-primary)] h-1.5 rounded-full"
                      style={{ width: `${product.revenueShare}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-xs text-[var(--text-muted)]">
                No production batches registered yet.
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => navigateTo('batches')}
          className="btn-secondary w-full text-xs justify-center"
        >
          View All Active Batches ({batches.length})
        </button>
      </div>
    </div>
  );
};
