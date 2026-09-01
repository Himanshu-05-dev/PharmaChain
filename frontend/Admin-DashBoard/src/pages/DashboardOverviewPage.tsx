import React, { useState } from 'react';
import { useAdminData } from '../context/AdminDataContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { RejectDialog } from '../components/common/RejectDialog';
import {
  Factory,
  Store,
  KeyRound,
  ShieldCheck,
  Clock,
  ArrowRight,
  CheckCircle2,
  Lock,
  ChevronRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { ManufacturerRecord } from '../types/admin';

export const DashboardOverviewPage: React.FC = () => {
  const {
    stats,
    manufacturers,
    shopkeepers,
    auditLogs,
    approveManufacturer,
    rejectManufacturer,
  } = useAdminData();
  const navigate = useNavigate();

  // Quick Action Modal states
  const [selectedMfrForApproval, setSelectedMfrForApproval] = useState<ManufacturerRecord | null>(null);
  const [selectedMfrForRejection, setSelectedMfrForRejection] = useState<ManufacturerRecord | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);

  const pendingMfrList = manufacturers.filter((m) => m.kycStatus === 'PENDING');
  const pendingShopList = shopkeepers.filter((s) => s.verificationStatus === 'pending');

  const handleConfirmApproveMfr = async () => {
    if (!selectedMfrForApproval) return;
    setLoadingAction(true);
    try {
      await approveManufacturer(selectedMfrForApproval.manufacturerId);
      setSelectedMfrForApproval(null);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleConfirmRejectMfr = async (reason: string) => {
    if (!selectedMfrForRejection) return;
    setLoadingAction(true);
    try {
      await rejectManufacturer(selectedMfrForRejection.manufacturerId, reason);
      setSelectedMfrForRejection(null);
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner / Executive Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/70 px-3 py-0.5 rounded-full border border-blue-200/80 dark:border-blue-800/80 inline-flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3 h-3 text-amber-500" />
              National Drug Verification Network
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">• Central Registry v2.4</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Executive Regulatory Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Live oversight of licensed pharmaceutical manufacturers, pharmacy compliance, and cryptographic keystore.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/audit-logs')}
            icon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Export Compliance Audit
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/manufacturers')}
            icon={<Factory className="w-3.5 h-3.5" />}
          >
            Review KYC Queue ({stats?.manufacturers.pending ?? 0})
          </Button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Pending MFRs */}
        <div
          onClick={() => navigate('/manufacturers?status=PENDING')}
          className="glass-panel glass-panel-hover rounded-2xl p-5 cursor-pointer group relative overflow-hidden card-highlight"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold border border-amber-500/20 shadow-sm">
              <Factory className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-300/80 dark:border-amber-700/60">
              Action Required
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {stats?.manufacturers.pending ?? 0}
            </h3>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Pending Manufacturer KYC</p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
            <span>{stats?.manufacturers.total ?? 0} total registered</span>
            <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Pending Shops */}
        <div
          onClick={() => navigate('/shopkeepers?status=pending')}
          className="glass-panel glass-panel-hover rounded-2xl p-5 cursor-pointer group relative overflow-hidden card-highlight"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold border border-blue-500/20 shadow-sm">
              <Store className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300 bg-blue-100/70 dark:bg-blue-950/80 px-2.5 py-0.5 rounded-full border border-blue-300/80 dark:border-blue-700/60">
              Review Queue
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {stats?.shopkeepers.pending ?? 0}
            </h3>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Pending Pharmacy Licenses</p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            <span>{stats?.shopkeepers.total ?? 0} total pharmacies</span>
            <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Cryptographic Keys */}
        <div
          onClick={() => navigate('/keys')}
          className="glass-panel glass-panel-hover rounded-2xl p-5 cursor-pointer group relative overflow-hidden card-highlight"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/20 shadow-sm">
              <KeyRound className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-300/80 dark:border-emerald-700/60">
              ECDSA P-256
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {stats?.cryptography.activeKeys ?? 0}
            </h3>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Active Signing Keypairs</p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            <span>Hardware Keystore Active</span>
            <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 4: Active Approved Network */}
        <div
          onClick={() => navigate('/shopkeepers?status=approved')}
          className="glass-panel glass-panel-hover rounded-2xl p-5 cursor-pointer group relative overflow-hidden card-highlight"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-xl bg-slate-500/10 dark:bg-slate-500/20 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold border border-slate-500/20 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-slate-200/80 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
              Live Network
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {(stats?.shopkeepers.approved ?? 0) + (stats?.manufacturers.approved ?? 0)}
            </h3>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Verified Network Nodes</p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
            <span>MFRs & Retail Chemists</span>
            <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Urgent Action Items Queue (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Priority Verification Queue</span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  {pendingMfrList.length + pendingShopList.length} Pending
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Submissions requiring State Drug Inspector review and key provisioning
              </p>
            </div>
          </div>

          <div className="glass-panel rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/80 shadow-sm">
            {pendingMfrList.length === 0 && pendingShopList.length === 0 ? (
              <div className="p-10 text-center text-slate-400 dark:text-slate-500">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3 animate-bounce" />
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">All Queues Cleared</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">There are no pending approvals requiring attention.</p>
              </div>
            ) : (
              <>
                {/* Pending Manufacturers */}
                {pendingMfrList.map((mfr) => (
                  <div key={mfr.manufacturerId} className="p-4 sm:p-5 hover:bg-slate-50/90 dark:hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                        <Factory className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{mfr.companyName}</h4>
                          <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-800">
                            Manufacturer KYC
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2 mt-1">
                          <span>License: <code className="font-mono font-semibold text-slate-700 dark:text-slate-300">{mfr.licenseNumber}</code></span>
                          <span>•</span>
                          <span>{mfr.state || 'India'}</span>
                          {mfr.createdAt && (
                            <>
                              <span>•</span>
                              <span className="text-amber-700 dark:text-amber-400 font-medium">
                                Submitted: {new Date(mfr.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedMfrForRejection(mfr)}
                      >
                        Reject
                      </Button>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => setSelectedMfrForApproval(mfr)}
                        icon={<Lock className="w-3 h-3" />}
                      >
                        Approve & Provision
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Pending Pharmacies */}
                {pendingShopList.map((shop) => (
                  <div key={shop.shopId} className="p-4 sm:p-5 hover:bg-slate-50/90 dark:hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                        <Store className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{shop.shopName}</h4>
                          <span className="text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                            {shop.licenseType}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-1">
                          <span>License: <code className="font-mono font-semibold text-slate-700 dark:text-slate-300">{shop.drugLicenseNumber}</code></span>
                          <span>•</span>
                          <span>{shop.city}, {shop.state}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate('/shopkeepers')}
                      >
                        Inspect License
                      </Button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Right Column: Live Regulatory Audit Feed (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Live Regulatory Decisions</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Real-time ledger of officer actions</p>
            </div>
            <button
              onClick={() => navigate('/audit-logs')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              View Full Log →
            </button>
          </div>

          <div className="glass-panel rounded-2xl p-4 sm:p-5 divide-y divide-slate-100 dark:divide-slate-800/80 shadow-sm">
            {auditLogs.slice(0, 5).map((log) => {
              const isApproved = log.action.includes('APPROVED');
              const isSuspended = log.action.includes('SUSPENDED');

              return (
                <div key={log._id} className="py-3.5 first:pt-0 last:pb-0 flex items-start gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold ${
                      isApproved
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : isSuspended
                        ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    {isApproved ? '✓' : isSuspended ? '⚡' : '✕'}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {log.targetName || log.targetId}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{log.action.replace('_', ' ')}</span> by{' '}
                      <span className="text-slate-600 dark:text-slate-400">{log.performedBy.fullName}</span>
                    </div>

                    {log.reason && (
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg mt-1.5 border border-slate-200/80 dark:border-slate-700/60 leading-relaxed">
                        {log.reason}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Confirmation & Rejection Modals */}
      <ConfirmDialog
        isOpen={!!selectedMfrForApproval}
        onClose={() => setSelectedMfrForApproval(null)}
        onConfirm={handleConfirmApproveMfr}
        title="Confirm Manufacturer Approval & Key Generation"
        targetName={selectedMfrForApproval?.companyName || ''}
        targetId={selectedMfrForApproval?.manufacturerId}
        licenseNumber={selectedMfrForApproval?.licenseNumber}
        applicationDate={selectedMfrForApproval?.createdAt}
        email={selectedMfrForApproval?.email}
        location={selectedMfrForApproval?.plantAddress || selectedMfrForApproval?.state}
        issuingAuthority={selectedMfrForApproval?.issuingAuthority}
        isKeyProvisioning={true}
        loading={loadingAction}
      />

      <RejectDialog
        isOpen={!!selectedMfrForRejection}
        onClose={() => setSelectedMfrForRejection(null)}
        onReject={handleConfirmRejectMfr}
        title="Reject Manufacturer KYC Application"
        targetName={selectedMfrForRejection?.companyName || ''}
        loading={loadingAction}
      />
    </div>
  );
};
