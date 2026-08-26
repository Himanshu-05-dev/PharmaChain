import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { ShopkeeperRecord } from '../../types/admin';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  FileText,
  Building,
  User,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from 'lucide-react';

interface LicenseInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopkeeper: ShopkeeperRecord | null;
  onApprove?: () => void;
  onReject?: () => void;
  onSuspend?: () => void;
}

export const LicenseInspectorModal: React.FC<LicenseInspectorModalProps> = ({
  isOpen,
  onClose,
  shopkeeper,
  onApprove,
  onReject,
  onSuspend,
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  if (!shopkeeper) return null;

  const isExpired = new Date(shopkeeper.licenseExpiryDate) < new Date();
  const isPending = shopkeeper.verificationStatus === 'pending';
  const isApproved = shopkeeper.verificationStatus === 'approved' || shopkeeper.verificationStatus === 'verified';

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.75));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="4xl">
      <div className="flex flex-col gap-5">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-navy-900 dark:text-white">{shopkeeper.shopName}</h3>
              <Badge variant={shopkeeper.verificationStatus} />
              <Badge variant={shopkeeper.licenseType} />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Drug License Verification Certificate Inspector • ID: <code className="font-mono text-slate-700 dark:text-slate-300">{shopkeeper.shopId}</code>
            </p>
          </div>
        </div>

        {/* 2-Column Inspector Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: License & Owner Data (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* License Validity Card */}
            <div className={`p-4 rounded-xl border ${isExpired ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-950 dark:text-rose-200' : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">License Status</span>
                {isExpired ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/60 px-2 py-0.5 rounded">
                    <XCircle className="w-3.5 h-3.5" /> EXPIRED LICENSE
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded">
                    <CheckCircle2 className="w-3.5 h-3.5" /> VALID FORM
                  </span>
                )}
              </div>
              <div className="font-mono text-sm font-bold text-navy-900 dark:text-white bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 mb-2">
                {shopkeeper.drugLicenseNumber}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">Issued On:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{shopkeeper.licenseIssueDate}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">Expires On:</span>
                  <span className={`font-semibold ${isExpired ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'}`}>
                    {shopkeeper.licenseExpiryDate}
                  </span>
                </div>
              </div>
              <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
                <span className="text-slate-500 dark:text-slate-400 block">Issuing Authority:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 leading-snug">{shopkeeper.issuingAuthority}</span>
              </div>
            </div>

            {/* Pharmacy & Owner Info */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 flex flex-col gap-3">
              <div className="flex items-start gap-2.5">
                <Building className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">Physical Premises</span>
                  <span className="text-slate-600 dark:text-slate-300 leading-relaxed block">
                    {shopkeeper.address}, {shopkeeper.city}, {shopkeeper.state} - {shopkeeper.pincode}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 mt-1 block">Phone: {shopkeeper.shopPhone}</span>
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-100 dark:border-slate-700/60 flex items-start gap-2.5">
                <User className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">Registered Pharmacist / Owner</span>
                  <span className="text-slate-800 dark:text-slate-100 font-semibold">{shopkeeper.ownerName}</span>
                  <span className="text-slate-500 dark:text-slate-400 block">{shopkeeper.ownerEmail} • {shopkeeper.ownerPhone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Certificate Document Viewer (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-2">
            {/* Viewer Controls Toolbar */}
            <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-t-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                <FileText className="w-4 h-4 text-navy-800 dark:text-blue-400" />
                <span className="font-medium truncate max-w-[180px]">
                  {shopkeeper.documentMeta?.name || 'Form_20_21_Certificate.pdf'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleZoomIn}
                  className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:text-navy-800 dark:hover:text-white rounded transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:text-navy-800 dark:hover:text-white rounded transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={handleRotate}
                  className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:text-navy-800 dark:hover:text-white rounded transition-colors"
                  title="Rotate 90deg"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
                {shopkeeper.documentUrl && (
                  <a
                    href={shopkeeper.documentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:text-navy-800 dark:hover:text-white rounded transition-colors"
                    title="Open full resolution"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Document Canvas Area */}
            <div className="h-96 bg-slate-900/90 dark:bg-slate-950 rounded-b-xl border-x border-b border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden p-4 relative">
              {shopkeeper.documentUrl ? (
                <div
                  className="transition-transform duration-200 flex items-center justify-center"
                  style={{
                    transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  }}
                >
                  <img
                    src={shopkeeper.documentUrl}
                    alt="Drug License Certificate"
                    className="max-h-80 max-w-full object-contain rounded shadow-2xl bg-white border border-slate-300 dark:border-slate-600"
                  />
                </div>
              ) : (
                <div className="text-center p-6 text-slate-400">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-2 text-amber-500/80" />
                  <p className="text-sm font-semibold text-slate-200">No Document Scan Uploaded</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                    The applicant did not provide a digital scan of the Drug License Certificate.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button variant="outline" size="md" onClick={onClose}>
            Close Inspector
          </Button>

          <div className="flex items-center gap-2.5">
            {isPending && onReject && (
              <Button variant="destructive" size="md" onClick={onReject}>
                Reject Application
              </Button>
            )}
            {isPending && onApprove && (
              <Button variant="success" size="md" onClick={onApprove}>
                Approve Pharmacy License
              </Button>
            )}
            {isApproved && onSuspend && (
              <Button variant="destructive" size="md" onClick={onSuspend}>
                Emergency License Freeze
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
