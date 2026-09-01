import React, { useState, useMemo } from 'react';
import { useAdminData } from '../context/AdminDataContext';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { RejectDialog } from '../components/common/RejectDialog';
import { PublicKeyModal } from '../components/key/PublicKeyModal';
import { ManufacturerInspectorModal } from '../components/document/ManufacturerInspectorModal';
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
  Calendar,
  Clock,
  MapPin,
  FileText,
  ShieldAlert,
  Unlock,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const ManufacturersPage: React.FC = () => {
  const {
    manufacturers,
    approveManufacturer,
    rejectManufacturer,
    blockManufacturer,
    unblockManufacturer,
    getManufacturerById,
  } = useAdminData();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'ALL' | ManufacturerKycStatus>('PENDING');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLicense, setCopiedLicense] = useState<string | null>(null);

  // Modal states
  const [inspectingMfr, setInspectingMfr] = useState<ManufacturerRecord | null>(null);
  const [inspectingLoading, setInspectingLoading] = useState(false);
  const [approvingMfr, setApprovingMfr] = useState<ManufacturerRecord | null>(null);
  const [rejectingMfr, setRejectingMfr] = useState<ManufacturerRecord | null>(null);
  const [blockingMfr, setBlockingMfr] = useState<ManufacturerRecord | null>(null);
  const [unblockingMfr, setUnblockingMfr] = useState<ManufacturerRecord | null>(null);
  const [viewingKeyMfr, setViewingKeyMfr] = useState<ManufacturerRecord | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const handleOpenReview = async (mfr: ManufacturerRecord) => {
    console.log(`[AdminDashboard Manufacturers] Review requested for ${mfr.manufacturerId} via API GET /api/admin/manufacturers/${mfr.manufacturerId}`);
    setInspectingMfr(mfr);
    setInspectingLoading(true);
    try {
      const detailed = await getManufacturerById(mfr.manufacturerId);
      console.log('[AdminDashboard Manufacturers] Received detailed dossier from API:', detailed);
      setInspectingMfr(detailed);
    } catch (err) {
      console.warn('[AdminDashboard Manufacturers] Could not fetch detailed profile via API, using listing record:', err);
    } finally {
      setInspectingLoading(false);
    }
  };

  // Tab counts
  const pendingCount = manufacturers.filter((m) => m.kycStatus === 'PENDING').length;
  const approvedCount = manufacturers.filter((m) => m.kycStatus === 'APPROVED').length;
  const rejectedCount = manufacturers.filter((m) => m.kycStatus === 'REJECTED').length;
  const blockedCount = manufacturers.filter((m) => m.kycStatus === 'BLOCKED').length;

  const filteredData = useMemo(() => {
    return manufacturers.filter((m) => {
      const matchTab = activeTab === 'ALL' || m.kycStatus === activeTab;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        q === '' ||
        m.companyName.toLowerCase().includes(q) ||
        m.licenseNumber.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.manufacturerId.toLowerCase().includes(q) ||
        (m.state && m.state.toLowerCase().includes(q)) ||
        (m.city && m.city.toLowerCase().includes(q));
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
    console.log(`[AdminDashboard Manufacturers] Approving KYC for manufacturer: ${approvingMfr.manufacturerId} (${approvingMfr.companyName})`);
    setActionLoading(true);
    try {
      await approveManufacturer(approvingMfr.manufacturerId);
      setApprovingMfr(null);
      setInspectingMfr(null);
    } catch (err: any) {
      console.error('[AdminDashboard Manufacturers] Approval failed:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmRejection = async (reason: string) => {
    if (!rejectingMfr) return;
    console.log(`[AdminDashboard Manufacturers] Rejecting KYC for manufacturer: ${rejectingMfr.manufacturerId}, reason: ${reason}`);
    setActionLoading(true);
    try {
      await rejectManufacturer(rejectingMfr.manufacturerId, reason);
      setRejectingMfr(null);
      setInspectingMfr(null);
    } catch (err: any) {
      console.error('[AdminDashboard Manufacturers] Rejection failed:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmBlock = async (reason: string) => {
    if (!blockingMfr) return;
    console.log(`[AdminDashboard Manufacturers] Blocking manufacturer: ${blockingMfr.manufacturerId}, reason: ${reason}`);
    setActionLoading(true);
    try {
      await blockManufacturer(blockingMfr.manufacturerId, reason);
      setBlockingMfr(null);
      setInspectingMfr(null);
    } catch (err: any) {
      console.error('[AdminDashboard Manufacturers] Block failed:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmUnblock = async () => {
    if (!unblockingMfr) return;
    console.log(`[AdminDashboard Manufacturers] Unblocking manufacturer: ${unblockingMfr.manufacturerId}`);
    setActionLoading(true);
    try {
      await unblockManufacturer(unblockingMfr.manufacturerId);
      setUnblockingMfr(null);
      setInspectingMfr(null);
    } catch (err: any) {
      console.error('[AdminDashboard Manufacturers] Unblock failed:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Helper date formatters
  const formatDateDisplay = (dateStr?: string | null) => {
    if (!dateStr) return { formatted: 'N/A', relative: '' };
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return { formatted: dateStr, relative: '' };
      const formatted = d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      const time = d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });

      const diffMs = Date.now() - d.getTime();
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      let relative = '';
      if (diffHrs < 1) relative = 'Just now';
      else if (diffHrs < 24) relative = `${diffHrs}h ago`;
      else {
        const diffDays = Math.floor(diffHrs / 24);
        relative = `${diffDays}d ago`;
      }

      return { formatted: `${formatted} ${time}`, relative };
    } catch {
      return { formatted: dateStr, relative: '' };
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/70 px-3 py-0.5 rounded-full border border-amber-200/80 dark:border-amber-800/80 uppercase inline-flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Core Security Gate
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Manufacturer KYC Approvals & Keystore
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review state drug manufacturing licenses, submission dossiers, manage blocks, and authorize cryptographic batch signing keypairs.
          </p>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-1.5 bg-slate-100/90 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-inner flex-wrap">
          <button
            onClick={() => setActiveTab('PENDING')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'PENDING'
                ? 'bg-white dark:bg-[#15233d] text-slate-900 dark:text-white shadow-sm border border-slate-200/80 dark:border-blue-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Pending Review</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${activeTab === 'PENDING' ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
              {pendingCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('APPROVED')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'APPROVED'
                ? 'bg-white dark:bg-[#15233d] text-slate-900 dark:text-white shadow-sm border border-slate-200/80 dark:border-blue-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Approved</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${activeTab === 'APPROVED' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
              {approvedCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('BLOCKED')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'BLOCKED'
                ? 'bg-white dark:bg-[#15233d] text-slate-900 dark:text-white shadow-sm border border-slate-200/80 dark:border-rose-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Blocked / Frozen</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${activeTab === 'BLOCKED' ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
              {blockedCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('REJECTED')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'REJECTED'
                ? 'bg-white dark:bg-[#15233d] text-slate-900 dark:text-white shadow-sm border border-slate-200/80 dark:border-blue-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Rejected</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${activeTab === 'REJECTED' ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
              {rejectedCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'ALL'
                ? 'bg-white dark:bg-[#15233d] text-slate-900 dark:text-white shadow-sm border border-slate-200/80 dark:border-blue-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>All Records</span>
            <span className="text-[10px] text-slate-400 font-mono">({manufacturers.length})</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search company, license, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white/90 dark:bg-slate-800/90 pl-10 pr-4 py-2.5 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>
      </div>

      {/* Manufacturers Data Table */}
      <div className="glass-panel rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/90 dark:bg-[#0f1b33]/90 border-b border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-4">Company & Identity</th>
                <th className="px-5 py-4">Drug License</th>
                <th className="px-5 py-4">Submitted Date</th>
                <th className="px-5 py-4">Plant Location</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Cryptographic Key</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-slate-400 dark:text-slate-500">
                    <Factory className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">No manufacturer applications found</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Try clearing filters or search query</p>
                  </td>
                </tr>
              ) : (
                filteredData.map((mfr) => {
                  const isPending = mfr.kycStatus === 'PENDING';
                  const isApproved = mfr.kycStatus === 'APPROVED';
                  const isRejected = mfr.kycStatus === 'REJECTED';
                  const isBlocked = mfr.kycStatus === 'BLOCKED';
                  const dateInfo = formatDateDisplay(mfr.createdAt);

                  return (
                    <tr key={mfr.manufacturerId} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group">
                      {/* Company Name & ID */}
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900 dark:text-white text-xs">{mfr.companyName}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">{mfr.email}</div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">ID: {mfr.manufacturerId}</div>
                      </td>

                      {/* License */}
                      <td className="px-5 py-4">
                        <div className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                          <code className="font-mono font-bold text-slate-800 dark:text-slate-200 text-xs">{mfr.licenseNumber}</code>
                          <button
                            onClick={() => handleCopyLicense(mfr.licenseNumber)}
                            className="text-slate-400 hover:text-navy-800 dark:hover:text-white p-0.5 transition-colors"
                            title="Copy License"
                          >
                            {copiedLicense === mfr.licenseNumber ? (
                              <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        {mfr.gmpStandard && (
                          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                            {mfr.gmpStandard}
                          </div>
                        )}
                      </td>

                      {/* Application Submitted Date */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-blue-500 flex-shrink-0" />
                            <span>{dateInfo.formatted}</span>
                          </span>
                          {dateInfo.relative && (
                            <span className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">
                              {dateInfo.relative}
                            </span>
                          )}
                          {isApproved && mfr.verifiedAt && (
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">
                              Approved: {formatDateDisplay(mfr.verifiedAt).formatted}
                            </span>
                          )}
                          {isBlocked && mfr.blockedAt && (
                            <span className="text-[10px] text-rose-600 dark:text-rose-400 mt-0.5 font-medium">
                              Blocked: {formatDateDisplay(mfr.blockedAt).formatted}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Location */}
                      <td className="px-5 py-4">
                        <div className="text-slate-800 dark:text-slate-200 font-semibold flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-500 flex-shrink-0" />
                          <span>{mfr.state || 'India'}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate max-w-[170px]" title={mfr.plantAddress || mfr.primaryPlantAddress}>
                          {mfr.plantAddress || mfr.primaryPlantAddress || 'Formulation Unit'}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <Badge variant={mfr.kycStatus} />
                        {isBlocked && mfr.blockedReason && (
                          <div className="text-[10px] text-rose-600 dark:text-rose-400 font-medium max-w-[160px] truncate mt-1" title={mfr.blockedReason}>
                            Reason: {mfr.blockedReason}
                          </div>
                        )}
                        {isRejected && mfr.rejectionReason && (
                          <div className="text-[10px] text-rose-500 max-w-[150px] truncate mt-1" title={mfr.rejectionReason}>
                            Reason: {mfr.rejectionReason}
                          </div>
                        )}
                      </td>

                      {/* Crypto Key Status */}
                      <td className="px-5 py-4">
                        {mfr.hasSigningKey ? (
                          <button
                            onClick={() => setViewingKeyMfr(mfr)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/80 px-2.5 py-1 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-all shadow-sm"
                          >
                            <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            <span>P-256 Provisioned</span>
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                            <KeyRound className="w-3 h-3" />
                            <span>Key Pending</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          {/* Review Details Button - always available */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenReview(mfr)}
                            icon={<Eye className="w-3.5 h-3.5" />}
                            title="Inspect live KYC application dossier via REST API"
                          >
                            Review
                          </Button>

                          {isPending && (
                            <>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setRejectingMfr(mfr)}
                              >
                                Reject
                              </Button>
                              <Button
                                variant="success"
                                size="sm"
                                onClick={() => setApprovingMfr(mfr)}
                                icon={<Lock className="w-3.5 h-3.5" />}
                              >
                                Approve
                              </Button>
                            </>
                          )}

                          {isApproved && (
                            <>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setBlockingMfr(mfr)}
                                icon={<ShieldAlert className="w-3 h-3" />}
                                title="Block manufacturer from signing tokens or creating batches"
                              >
                                Block
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setViewingKeyMfr(mfr)}
                                icon={<KeyRound className="w-3 h-3" />}
                              >
                                Key
                              </Button>
                            </>
                          )}

                          {isBlocked && (
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => setUnblockingMfr(mfr)}
                              icon={<Unlock className="w-3 h-3" />}
                              title="Restore manufacturer account access"
                            >
                              Unblock
                            </Button>
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

      {/* Detailed Manufacturer Application Inspector Modal */}
      <ManufacturerInspectorModal
        isOpen={!!inspectingMfr}
        onClose={() => setInspectingMfr(null)}
        manufacturer={inspectingMfr}
        isLoading={inspectingLoading}
        onApprove={inspectingMfr?.kycStatus === 'PENDING' ? () => {
          const target = inspectingMfr;
          setInspectingMfr(null);
          setApprovingMfr(target);
        } : undefined}
        onReject={inspectingMfr?.kycStatus === 'PENDING' ? () => {
          const target = inspectingMfr;
          setInspectingMfr(null);
          setRejectingMfr(target);
        } : undefined}
        onBlock={inspectingMfr?.kycStatus === 'APPROVED' ? () => {
          const target = inspectingMfr;
          setInspectingMfr(null);
          setBlockingMfr(target);
        } : undefined}
        onUnblock={inspectingMfr?.kycStatus === 'BLOCKED' ? () => {
          const target = inspectingMfr;
          setInspectingMfr(null);
          setUnblockingMfr(target);
        } : undefined}
        onViewKey={inspectingMfr?.hasSigningKey ? () => {
          const target = inspectingMfr;
          setInspectingMfr(null);
          setViewingKeyMfr(target);
        } : undefined}
      />

      {/* Approval Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!approvingMfr}
        onClose={() => setApprovingMfr(null)}
        onConfirm={handleConfirmApproval}
        title="Authorize Manufacturer & Provision Cryptographic Key"
        targetName={approvingMfr?.companyName || ''}
        targetId={approvingMfr?.manufacturerId}
        licenseNumber={approvingMfr?.licenseNumber}
        applicationDate={approvingMfr?.createdAt}
        email={approvingMfr?.email}
        location={approvingMfr?.plantAddress || approvingMfr?.state}
        issuingAuthority={approvingMfr?.issuingAuthority}
        isKeyProvisioning={true}
        loading={actionLoading}
      />

      {/* Unblock Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!unblockingMfr}
        onClose={() => setUnblockingMfr(null)}
        onConfirm={handleConfirmUnblock}
        title="Restore Manufacturer Account Access & Signing Rights"
        targetName={unblockingMfr?.companyName || ''}
        targetId={unblockingMfr?.manufacturerId}
        licenseNumber={unblockingMfr?.licenseNumber}
        email={unblockingMfr?.email}
        location={unblockingMfr?.plantAddress || unblockingMfr?.state}
        confirmText="Unblock Manufacturer"
        loading={actionLoading}
      />

      {/* KYC Rejection Modal */}
      <RejectDialog
        isOpen={!!rejectingMfr}
        onClose={() => setRejectingMfr(null)}
        onReject={handleConfirmRejection}
        title="Reject Manufacturer KYC Application"
        targetName={rejectingMfr?.companyName || ''}
        loading={actionLoading}
      />

      {/* Regulatory Block Modal */}
      <RejectDialog
        isOpen={!!blockingMfr}
        onClose={() => setBlockingMfr(null)}
        onReject={handleConfirmBlock}
        title="Block Manufacturer & Freeze Token Signing"
        targetName={blockingMfr?.companyName || ''}
        isSuspension={true}
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
