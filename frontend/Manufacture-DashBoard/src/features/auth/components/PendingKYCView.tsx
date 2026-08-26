import React from 'react';
import { useAuth } from '../hooks/auth.hooks';
import { useDashboard } from '../../dashboard/Hooks/dashboard.hooks';
import {
  Clock,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Building2,
  FileCheck2,
  Zap,
  ArrowRight,
  LogOut,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

export const PendingKYCView: React.FC = () => {
  const { user, simulateKYCApproval, logout, loading } = useAuth();
  const { navigateTo } = useDashboard();

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-[var(--bg-surface)] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-400 to-amber-600" />

        {/* Top Icon & Status Pill */}
        <div className="text-center pb-6 border-b border-[var(--border)]">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-3 shadow-lg shadow-amber-500/10 animate-pulse-subtle">
            <Clock className="w-8 h-8" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              KYC Status: Pending CDSCO Approval
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
            {user?.name || 'Manufacturer Account'}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 font-mono">
            License # {user?.licenseNumber || 'CDSCO-MFG-PENDING'} • ID: {user?.id}
          </p>
        </div>

        {/* Regulatory Explanation */}
        <div className="my-6 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs text-[var(--text-secondary)] space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>CDSCO Compliance Verification Protocol</span>
          </div>
          <p>
            Your Form 28-D pharmaceutical manufacturing license and KYC documentation have been submitted. Under Central Drugs Standard Control Organisation guidelines, asymmetric ES256 keypair provisioning on <code className="font-mono text-emerald-400">pharma-core:4000</code> and serialized batch creation are restricted until regulatory clearance is endorsed.
          </p>
        </div>

        {/* Verification Pipeline Timeline */}
        <div className="space-y-3 mb-6">
          <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
            Verification Pipeline Status
          </h3>

          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-[var(--bg-element)] border border-emerald-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                  ✓
                </div>
                <div>
                  <p className="font-bold text-[var(--text-primary)]">Form 28-D & Corporate KYC Uploaded</p>
                  <p className="text-[10px] text-[var(--text-muted)]">Incorporation, GSTIN & SLA filing registered</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">COMPLETED</span>
            </div>

            <div className="p-3 rounded-xl bg-[var(--bg-element)] border border-[var(--border)] opacity-60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[var(--bg-surface)] text-[var(--text-muted)] flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <div>
                  <p className="font-bold text-[var(--text-primary)]">CDSCO Authority Inspection & License Clearance</p>
                  <p className="text-[10px] text-[var(--text-muted)]">Drug Controller General of India approval verification</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-amber-400 font-bold">IN PROGRESS</span>
            </div>

            <div className="p-3 rounded-xl bg-[var(--bg-element)] border border-[var(--border)] opacity-60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[var(--bg-surface)] text-[var(--text-muted)] flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <div>
                  <p className="font-bold text-[var(--text-primary)]">ECDSA NIST P-256 Vault Keypair Provisioning</p>
                  <p className="text-[10px] text-[var(--text-muted)]">Secure hardware-enclave ES256 key generation on pharma-core</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-[var(--text-muted)]">GATE LOCKED</span>
            </div>
          </div>
        </div>

        {/* Action: Trigger CDSCO KYC Approval on Backend */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-emerald-950/40 border border-emerald-500/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-extrabold text-emerald-300 uppercase tracking-wider">
                CDSCO Administrator Clearance
              </span>
            </div>
          </div>

          <p className="text-xs text-[var(--text-muted)]">
            Endorse CDSCO approval on the backend cluster to provision the manufacturer's ES256 keypair and unlock batch creation.
          </p>

          <button
            type="button"
            onClick={simulateKYCApproval}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 active:scale-[0.99] transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Endorsing CDSCO KYC on Backend...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Endorse CDSCO KYC Approval</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Footer Actions: Logout */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-[var(--border)] text-xs">
          <button
            type="button"
            onClick={logout}
            className="text-[var(--text-muted)] hover:text-rose-400 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
