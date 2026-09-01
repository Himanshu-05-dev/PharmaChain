import React, { useState, useMemo } from 'react';
import { useAdminData } from '../context/AdminDataContext';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { RejectDialog } from '../components/common/RejectDialog';
import { PublicKeyModal } from '../components/key/PublicKeyModal';
import { ManufacturerRecord, ManufacturerKycStatus } from '../types/admin';
import {
  Factory,
  Search,
  Copy,
  Check,
  Lock,
  KeyRound,
  Eye,
  Sparkles,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const ManufacturersPage: React.FC = () => {
  const { manufacturers, approveManufacturer, rejectManufacturer } = useAdminData();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'ALL' | ManufacturerKycStatus>('PENDING');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLicense, setCopiedLicense] = useState<string | null>(null);

  // Modal states
  const [approvingMfr, setApprovingMfr] = useState<ManufacturerRecord | null>(null);
  const [rejectingMfr, setRejectingMfr] = useState<ManufacturerRecord | null>(null);
  const [viewingKeyMfr, setViewingKeyMfr] = useState<ManufacturerRecord | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Tab counts
  const pendingCount = manufacturers.filter((m) => m.kycStatus === 'PENDING').length;
  const approvedCount = manufacturers.filter((m) => m.kycStatus === 'APPROVED').length;
  const rejectedCount = manufacturers.filter((m) => m.kycStatus === 'REJECTED').length;

  const filteredData = useMemo(() => {
    return manufacturers.filter((m) => {
      const matchTab = activeTab === 'ALL' || m.kycStatus === activeTab;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        q === '' ||
        m.companyName.toLowerCase().includes(q) ||
        m.licenseNumber.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.manufacturerId.toLowerCase().includes(q);
      return matchTab && matchSearch;
    });
  }, [manufacturers, activeTab, searchQuery]);

  const handleCopyLicense = (license: string) => {
    navigator.clipboard.writeText(license);
    setCopiedLicense(license);
    showToast({
      type: 'info',
      title: 'License Copied',
      message: `License number ${license} copied to clipboard.`,
    });
    setTimeout(() => setCopiedLicense(null), 2000);
  };

  const handleConfirmApproval = async () => {
    if (!approvingMfr) return;
    setActionLoading(true);
    try {
      await approveManufacturer(approvingMfr.manufacturerId);
      setApprovingMfr(null);
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmRejection = async (reason: string) => {
    if (!rejectingMfr) return;
    setActionLoading(true);
    try {
      await rejectManufacturer(rejectingMfr.manufacturerId, reason);
      setRejectingMfr(null);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn select-none">
      {/* Header with Quick Metric Chips */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/70 px-3 py-0.5 rounded-full border border-amber-200/80 dark:border-amber-800/80 uppercase inline-flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Core Regulatory Keystore Gate
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">• CDSCO Form 25/28</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white tracking-tight">
            Pharmaceutical Manufacturer KYC & Keystore
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl font-medium">
            Statutory validation of manufacturing licenses and cryptographic ECDSA P-256 root keypair provisioning.
          </p>
        </div>

        {/* Quick Summary Pill Meter */}
        <div className="flex items-center gap-3 bg-white dark:bg-[#0b172a] p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm self-start md:self-center">
          <div className="px-3 py-1 text-center border-r border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Pending KYC</span>
            <span className="text-sm font-black text-amber-600 dark:text-amber-400 font-mono">{pendingCount}</span>
          </div>
          <div className="px-3 py-1 text-center border-r border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Approved</span>
            <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">{approvedCount}</span>
          </div>
          <div className="px-3 py-1 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Plants</span>
            <span className="text-sm font-black text-slate-800 dark:text-slate-200 font-mono">{manufacturers.length}</span>
          </div>
        </div>
      </div>

      {/* Tabs Row & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/90 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-inner">
          <button
            onClick={() => setActiveTab('PENDING')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'PENDING'
                ? 'bg-white dark:bg-[#152745] text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-blue-500/40'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Pending Review</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === 'PENDING' ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}>
              {pendingCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('APPROVED')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'APPROVED'
                ? 'bg-white dark:bg-[#152745] text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-blue-500/40'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Approved Plants</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === 'APPROVED' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}>
              {approvedCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('REJECTED')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'REJECTED'
                ? 'bg-white dark:bg-[#152745] text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-blue-500/40'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Rejected</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === 'REJECTED' ? 'bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}>
              {rejectedCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'ALL'
                ? 'bg-white dark:bg-[#152745] text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-blue-500/40'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>All Plants</span>
            <span className="text-[10px] text-slate-400 font-mono">({manufacturers.length})</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search plant, license number, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/90 pl-10 pr-4 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>
      </div>

      {/* Manufacturers Data Table */}
      <div className="bg-white dark:bg-[#0c1527] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-[#0f1b33] border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-4">Manufacturer & ID</th>
                <th className="px-6 py-4">Drug License Number</th>
                <th className="px-6 py-4">State & Plant Address</th>
                <th className="px-6 py-4">KYC Status</th>
                <th className="px-6 py-4">Cryptographic Signing Key</th>
                <th className="px-6 py-4 text-right">Regulatory Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-slate-400 dark:text-slate-500">
                    <Factory className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No manufacturer records matching filter</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Try resetting search or filter tabs</p>
                  </td>
                </tr>
              ) : (
                filteredData.map((mfr) => {
                  const isPending = mfr.kycStatus === 'PENDING';
                  const isApproved = mfr.kycStatus === 'APPROVED';
                  const isRejected = mfr.kycStatus === 'REJECTED';

                  return (
                    <tr key={mfr.manufacturerId} className="hover:bg-slate-50/90 dark:hover:bg-slate-800/40 transition-colors group">
                      {/* Company Name & ID */}
                      <td className="px-6 py-4.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-700 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
                            {mfr.companyName.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 dark:text-white text-xs truncate max-w-[220px]">{mfr.companyName}</div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">{mfr.email}</div>
                            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">ID: {mfr.manufacturerId}</div>
                          </div>
                        </div>
                      </td>

                      {/* License */}
                      <td className="px-6 py-4.5">
                        <div className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/90 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                          <code className="font-mono font-bold text-slate-900 dark:text-slate-100 text-xs">{mfr.licenseNumber}</code>
                          <button
                            onClick={() => handleCopyLicense(mfr.licenseNumber)}
                            className="text-slate-400 hover:text-blue-700 dark:hover:text-white p-0.5 transition-colors"
                            title="Copy License Number"
                          >
                            {copiedLicense === mfr.licenseNumber ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="px-6 py-4.5">
                        <div className="text-slate-900 dark:text-slate-100 font-semibold">{mfr.state || 'India'}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[220px]">
                          {mfr.plantAddress || 'Manufacturing Plant'}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4.5">
                        <Badge variant={mfr.kycStatus} />
                      </td>

                      {/* Crypto Key Status */}
                      <td className="px-6 py-4.5">
                        {mfr.hasSigningKey ? (
                          <button
                            onClick={() => setViewingKeyMfr(mfr)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/80 px-2.5 py-1 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-all shadow-sm"
                          >
                            <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>P-256 Provisioned</span>
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 font-medium">
                            <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                            <span>Key Pending</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isPending && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setRejectingMfr(mfr)}
                              >
                                Reject
                              </Button>
                              <Button
                                variant="success"
                                size="sm"
                                onClick={() => setApprovingMfr(mfr)}
                                icon={<Lock className="w-3 h-3" />}
                              >
                                Approve & Provision
                              </Button>
                            </>
                          )}

                          {isApproved && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setViewingKeyMfr(mfr)}
                              icon={<Eye className="w-3.5 h-3.5" />}
                            >
                              View Key PEM
                            </Button>
                          )}

                          {isRejected && (
                            <span className="text-[11px] text-rose-700 dark:text-rose-400 font-bold italic">
                              Rejection recorded in ledger
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation & Rejection Modals */}
      <ConfirmDialog
        isOpen={!!approvingMfr}
        onClose={() => setApprovingMfr(null)}
        onConfirm={handleConfirmApproval}
        title="Authorize Manufacturer & Provision Cryptographic Key"
        targetName={approvingMfr?.companyName || ''}
        targetId={approvingMfr?.manufacturerId}
        licenseNumber={approvingMfr?.licenseNumber}
        isKeyProvisioning={true}
        loading={actionLoading}
      />

      <RejectDialog
        isOpen={!!rejectingMfr}
        onClose={() => setRejectingMfr(null)}
        onReject={handleConfirmRejection}
        title="Reject Manufacturer KYC Application"
        targetName={rejectingMfr?.companyName || ''}
        loading={actionLoading}
      />

      {/* Public Key Certificate Modal */}
      <PublicKeyModal
        isOpen={!!viewingKeyMfr}
        onClose={() => setViewingKeyMfr(null)}
        manufacturer={viewingKeyMfr}
      />
    </div>
  );
};
