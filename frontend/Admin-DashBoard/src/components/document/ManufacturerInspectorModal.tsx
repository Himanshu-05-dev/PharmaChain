import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { ManufacturerRecord } from '../../types/admin';
import {
  Factory,
  Building,
  Calendar,
  Clock,
  ShieldCheck,
  Award,
  User,
  KeyRound,
  FileText,
  Lock,
  Download,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  ExternalLink,
  MapPin,
  Mail,
  Phone,
  Hash,
  Globe,
  Sparkles,
  Server,
  Unlock,
} from 'lucide-react';

interface ManufacturerInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  manufacturer: ManufacturerRecord | null;
  isLoading?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
  onBlock?: () => void;
  onUnblock?: () => void;
  onViewKey?: () => void;
}

export const ManufacturerInspectorModal: React.FC<ManufacturerInspectorModalProps> = ({
  isOpen,
  onClose,
  manufacturer,
  isLoading = false,
  onApprove,
  onReject,
  onBlock,
  onUnblock,
  onViewKey,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'documents' | 'crypto'>('details');

  if (!manufacturer && !isLoading) return null;

  const isPending = manufacturer?.kycStatus === 'PENDING';
  const isApproved = manufacturer?.kycStatus === 'APPROVED';
  const isRejected = manufacturer?.kycStatus === 'REJECTED';
  const isBlocked = manufacturer?.kycStatus === 'BLOCKED';

  // Format dates safely
  const formatDateTime = (dateStr?: string | null) => {
    if (!dateStr) return 'Not available';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return dateStr;
    }
  };

  const getRelativeTime = (dateStr?: string | null) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '';
      const diffMs = Date.now() - d.getTime();
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHrs < 1) return 'Just now';
      if (diffHrs < 24) return `${diffHrs}h ago`;
      const diffDays = Math.floor(diffHrs / 24);
      return `${diffDays}d ago`;
    } catch {
      return '';
    }
  };

  const isLicenseExpired = manufacturer?.licenseExpiryDate
    ? new Date(manufacturer.licenseExpiryDate) < new Date()
    : false;

  const submissionDateFormatted = formatDateTime(manufacturer?.createdAt);
  const relativeAge = getRelativeTime(manufacturer?.createdAt);

  const plantAddressDisplay =
    manufacturer?.plantAddress ||
    manufacturer?.primaryPlantAddress ||
    [manufacturer?.city, manufacturer?.state, manufacturer?.pincode].filter(Boolean).join(', ') ||
    'Not specified in application';

  const uploadedDocs = manufacturer?.kycDocs || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="4xl">
      {isLoading ? (
        <div className="py-16 text-center text-slate-400">
          <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Fetching live manufacturer dossier via API...</p>
          <p className="text-xs text-slate-400 mt-1">Direct microservice REST request to manufacturer service</p>
        </div>
      ) : manufacturer ? (
        <div className="flex flex-col gap-5 max-h-[85vh] overflow-y-auto pr-1">
          {/* Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800 uppercase inline-flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  {manufacturer.companyType || 'Drug Manufacturer'}
                </span>
                <Badge variant={manufacturer.kycStatus} />
                {manufacturer.gmpStandard && (
                  <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 inline-flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    {manufacturer.gmpStandard}
                  </span>
                )}
                <span className="text-[10px] text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-900 inline-flex items-center gap-1 font-mono">
                  <Server className="w-3 h-3" />
                  Live REST API Payload
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {manufacturer.companyName}
              </h3>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
                <span>Domain ID: <strong className="text-slate-700 dark:text-slate-200">{manufacturer.manufacturerId}</strong></span>
                <span>•</span>
                <span>License: <strong className="text-slate-700 dark:text-slate-200">{manufacturer.licenseNumber}</strong></span>
              </div>
            </div>

            {/* Submission Timestamp Pill */}
            <div className="flex flex-col sm:items-end bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700/80">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                <span>Application Submitted:</span>
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 flex items-center gap-1.5">
                <span>{submissionDateFormatted}</span>
                {relativeAge && (
                  <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/90 px-1.5 py-0.2 rounded">
                    {relativeAge}
                  </span>
                )}
              </div>
              {manufacturer.verifiedAt && (
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Verified: {formatDateTime(manufacturer.verifiedAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Status Callout Banners */}
          {isBlocked && (
            <div className="bg-rose-100/90 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-700 rounded-xl p-4 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-rose-900 dark:text-rose-200 uppercase tracking-wider">
                    Manufacturer Account BLOCKED by CDSCO Regulator
                  </h5>
                  {manufacturer.blockedAt && (
                    <span className="text-[10px] font-mono text-rose-700 dark:text-rose-300">
                      Blocked on: {formatDateTime(manufacturer.blockedAt)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-rose-900 dark:text-rose-200 mt-1 leading-relaxed">
                  <strong>Compliance Violation / Reason:</strong> {manufacturer.blockedReason || 'Emergency account freeze due to regulatory non-compliance.'}
                </p>
                <p className="text-[11px] text-rose-700 dark:text-rose-300/80 mt-1">
                  This manufacturer is barred from authenticating, logging in, or minting batch cryptographic tokens.
                </p>
              </div>
            </div>
          )}

          {isRejected && (
            <div className="bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-xl p-3.5 flex items-start gap-3">
              <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-rose-900 dark:text-rose-300">Registration Rejected in Regulatory Audit Trail</h5>
                <p className="text-xs text-rose-800 dark:text-rose-200/90 mt-0.5 leading-relaxed">
                  <strong>Reason:</strong> {manufacturer.rejectionReason || 'Application documentation failed state regulatory verification standards.'}
                </p>
              </div>
            </div>
          )}

          {isPending && (
            <div className="bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 rounded-xl p-3 flex items-start gap-3">
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-950 dark:text-amber-200 leading-relaxed">
                <strong>Pending CDSCO Endorsement:</strong> Verify manufacturing license number, facility premises, and authorized QA signatory returned from manufacturer service before authorizing ECDSA batch signing key generation.
              </div>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                activeTab === 'details'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>Application Dossier</span>
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                activeTab === 'documents'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Compliance Documents ({uploadedDocs.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('crypto')}
              className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                activeTab === 'crypto'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Cryptographic Keystore</span>
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: Corporate Legal Identity */}
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200 dark:border-slate-700/80 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                  <Building className="w-4 h-4 text-blue-500" />
                  <span>Corporate Legal Identity</span>
                </div>
                <div className="space-y-2 text-xs divide-y divide-slate-200/60 dark:divide-slate-700/60">
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-500 dark:text-slate-400">Company Name:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100 text-right">{manufacturer.companyName}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-500 dark:text-slate-400">Company Code:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">{manufacturer.companyCode || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-500 dark:text-slate-400">CIN Number:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">{manufacturer.cinNumber || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-500 dark:text-slate-400">GSTIN Identification:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">{manufacturer.gstin || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-500 dark:text-slate-400">Corporate HQ:</span>
                    <span className="text-slate-800 dark:text-slate-200 text-right">{manufacturer.headquarters || manufacturer.state || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-500 dark:text-slate-400">Official Website:</span>
                    {manufacturer.website ? (
                      <a href={manufacturer.website} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline truncate max-w-[200px]">
                        {manufacturer.website}
                      </a>
                    ) : (
                      <span className="text-slate-400">Not provided</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card 2: Drug Manufacturing License & CDSCO */}
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200 dark:border-slate-700/80 flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>CDSCO License & Compliance</span>
                  </div>
                  {isLicenseExpired ? (
                    <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950 px-2 py-0.5 rounded">
                      EXPIRED
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">
                      FORM 28-D
                    </span>
                  )}
                </div>
                <div className="space-y-2 text-xs divide-y divide-slate-200/60 dark:divide-slate-700/60">
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-500 dark:text-slate-400">Drug License Number:</span>
                    <span className="font-mono font-bold text-navy-800 dark:text-blue-300">{manufacturer.licenseNumber}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-500 dark:text-slate-400">Issuing Authority:</span>
                    <span className="text-slate-800 dark:text-slate-200 text-right leading-snug">{manufacturer.issuingAuthority || 'State Licensing Authority / CDSCO'}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-500 dark:text-slate-400">License Issue Date:</span>
                    <span className="text-slate-800 dark:text-slate-200">{manufacturer.licenseIssueDate || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-500 dark:text-slate-400">License Expiry Date:</span>
                    <span className={`font-semibold ${isLicenseExpired ? 'text-rose-600' : 'text-slate-800 dark:text-slate-200'}`}>
                      {manufacturer.licenseExpiryDate || 'Not specified'}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-500 dark:text-slate-400">GMP Compliance Standard:</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">{manufacturer.gmpStandard || 'Standard GMP'}</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Manufacturing Facility Location */}
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200 dark:border-slate-700/80 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                  <Factory className="w-4 h-4 text-amber-500" />
                  <span>Manufacturing Facility Location</span>
                </div>
                <div className="space-y-2 text-xs divide-y divide-slate-200/60 dark:divide-slate-700/60">
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-500 dark:text-slate-400">Facility Name:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100">{manufacturer.primaryPlantName || manufacturer.plantName || manufacturer.companyName}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-500 dark:text-slate-400">Facility ID:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">{manufacturer.primaryPlantFacilityId || manufacturer.facilityId || 'Not assigned'}</span>
                  </div>
                  <div className="pt-2">
                    <span className="text-slate-500 dark:text-slate-400 block mb-1">Physical Plant Address:</span>
                    <div className="text-slate-800 dark:text-slate-200 leading-relaxed bg-white dark:bg-slate-900/80 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                        <span>{plantAddressDisplay}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-500 dark:text-slate-400">State / Region:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{manufacturer.state || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Authorized Signatory & Personnel */}
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200 dark:border-slate-700/80 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                  <User className="w-4 h-4 text-purple-500" />
                  <span>Authorized Signatory & Contact</span>
                </div>
                <div className="space-y-2 text-xs divide-y divide-slate-200/60 dark:divide-slate-700/60">
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-500 dark:text-slate-400">Responsible Signatory:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100">{manufacturer.authorizedPersonName || manufacturer.directorName || 'Authorized Officer'}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-500 dark:text-slate-400">Designation / Role:</span>
                    <span className="text-slate-800 dark:text-slate-200">{manufacturer.authorizedPersonRole || 'Signatory'}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-500 dark:text-slate-400">Registered Email:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200 truncate max-w-[200px]">{manufacturer.email}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-500 dark:text-slate-400">Phone Contact:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">{manufacturer.phone || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-500 dark:text-slate-400">Identity Proof:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">
                      {manufacturer.idProofType ? `${manufacturer.idProofType}: ${manufacturer.idProofNumber || ''}` : 'Not provided'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Uploaded Documents */}
          {activeTab === 'documents' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Compliance certificates submitted by the manufacturer via the registration API:
              </p>
              {uploadedDocs.length === 0 ? (
                <div className="p-8 text-center text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                  <FileText className="w-10 h-10 mx-auto mb-2 text-slate-400" />
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">No additional document files uploaded</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Verification proceeds using the registered state drug manufacturing license number.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {uploadedDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-white dark:bg-slate-800/80 rounded-xl p-4 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between gap-3 hover:border-blue-400 transition-colors shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate" title={doc.name}>
                            {doc.name}
                          </h5>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                            {doc.type}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-mono mt-0.5">
                            Uploaded: {doc.uploadDate || 'Recent'} • {doc.size ? `${(doc.size / (1024 * 1024)).toFixed(2)} MB` : '1.50 MB'}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                          {doc.status || 'UPLOADED'}
                        </span>
                        {doc.url && (
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                          >
                            <span>Inspect Scan</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Cryptographic Keystore Details */}
          {activeTab === 'crypto' && (
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200 dark:border-slate-700/80">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-emerald-500" />
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                      Cryptographic Authority Specification
                    </h4>
                  </div>
                  {manufacturer.hasSigningKey ? (
                    <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> KEY ACTIVE IN KEYSTORE
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-300 dark:border-amber-800">
                      PENDING PROVISIONING
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-4">
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 text-[11px] block">Cryptographic Algorithm:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                      ECDSA P-256 (SHA-256)
                    </span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 text-[11px] block">Elliptic Curve:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                      secp256r1 / NIST P-256
                    </span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 text-[11px] block">Storage Vault:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                      pharma-core Keystore
                    </span>
                  </div>
                </div>

                {manufacturer.publicKeyPem ? (
                  <div>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1.5">
                      ECDSA P-256 Public Key Certificate:
                    </span>
                    <pre className="font-mono text-[11px] bg-slate-900 text-emerald-400 p-3 rounded-lg overflow-x-auto leading-relaxed border border-slate-700">
                      {manufacturer.publicKeyPem}
                    </pre>
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-400 dark:text-slate-500 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
                    <Lock className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Public Signing Key will be provisioned on KYC approval</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">The pharma-core service provisions the cryptographic keypair via internal API upon approval.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 mt-2">
            <Button variant="outline" size="md" onClick={onClose}>
              Close Inspection
            </Button>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-wrap">
              {isPending && onReject && (
                <Button variant="destructive" size="md" onClick={onReject}>
                  Reject Application
                </Button>
              )}

              {isPending && onApprove && (
                <Button
                  variant="success"
                  size="md"
                  onClick={onApprove}
                  icon={<Lock className="w-3.5 h-3.5" />}
                >
                  Approve & Provision Key
                </Button>
              )}

              {isApproved && onBlock && (
                <Button
                  variant="destructive"
                  size="md"
                  onClick={onBlock}
                  icon={<ShieldAlert className="w-3.5 h-3.5" />}
                >
                  Block Manufacturer
                </Button>
              )}

              {isBlocked && onUnblock && (
                <Button
                  variant="success"
                  size="md"
                  onClick={onUnblock}
                  icon={<Unlock className="w-3.5 h-3.5" />}
                >
                  Unblock / Restore Access
                </Button>
              )}

              {isApproved && onViewKey && (
                <Button
                  variant="primary"
                  size="md"
                  onClick={onViewKey}
                  icon={<KeyRound className="w-3.5 h-3.5" />}
                >
                  View Public Key Certificate
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </Modal>
  );
};
