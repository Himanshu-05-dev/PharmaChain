import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { ShieldAlert, Key, AlertTriangle, Calendar, MapPin, Mail, ShieldCheck } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  targetName: string;
  targetId?: string;
  licenseNumber?: string;
  applicationDate?: string;
  email?: string;
  location?: string;
  issuingAuthority?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isKeyProvisioning?: boolean;
  loading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  targetName,
  targetId,
  licenseNumber,
  applicationDate,
  email,
  location,
  issuingAuthority,
  description,
  confirmText = 'Confirm & Provision Key',
  cancelText = 'Cancel',
  isKeyProvisioning = false,
  loading = false,
}) => {
  const formattedDate = applicationDate
    ? (() => {
        try {
          const d = new Date(applicationDate);
          if (isNaN(d.getTime())) return applicationDate;
          return d.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });
        } catch {
          return applicationDate;
        }
      })()
    : null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div className="flex flex-col gap-4">
        {/* Header Icon */}
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${isKeyProvisioning
                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
              }`}
          >
            {isKeyProvisioning ? <Key className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">{title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">National Drug Control Regulatory Verification</p>
          </div>
        </div>

        {/* Target Entity Card with Detailed Submission Info */}
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Application Summary
              </span>
              {formattedDate && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                  <Calendar className="w-3 h-3" />
                  <span>Submitted: {formattedDate}</span>
                </span>
              )}
            </div>

            <h4 className="text-sm font-bold text-navy-800 dark:text-white">{targetName}</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
              {targetId && (
                <div>
                  <span className="text-slate-400 block text-[10px]">Identifier:</span>
                  <code className="text-slate-800 dark:text-slate-200 font-mono font-semibold">{targetId}</code>
                </div>
              )}
              {licenseNumber && (
                <div>
                  <span className="text-slate-400 block text-[10px]">License Number:</span>
                  <code className="text-slate-800 dark:text-slate-200 font-mono font-semibold">{licenseNumber}</code>
                </div>
              )}
              {email && (
                <div>
                  <span className="text-slate-400 block text-[10px]">Contact Email:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-mono truncate block">{email}</span>
                </div>
              )}
              {location && (
                <div>
                  <span className="text-slate-400 block text-[10px]">Plant / Location:</span>
                  <span className="text-slate-800 dark:text-slate-200 truncate block">{location}</span>
                </div>
              )}
            </div>

            {issuingAuthority && (
              <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                Authority: <span className="font-medium text-slate-700 dark:text-slate-300">{issuingAuthority}</span>
              </div>
            )}
          </div>
        </div>

        {/* Security Warning Notice */}
        {isKeyProvisioning ? (
          <div className="bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 rounded-xl p-3.5 flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-950 dark:text-amber-200 leading-relaxed">
              <p className="font-semibold text-amber-900 dark:text-amber-300 mb-1">Cryptographic Authority Endorsement</p>
              Approving will automatically provision an <strong>ECDSA P-256 (SHA-256)</strong> private/public keypair in the <code className="bg-amber-100 dark:bg-amber-900 px-1 py-0.5 rounded font-mono">pharma-core</code> cluster keystore. This authorizes the manufacturer to mint tamper-proof blockchain medicine batches.
            </div>
          </div>
        ) : (
          description && <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{description}</p>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800 mt-2">
          <Button variant="outline" size="md" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            variant={isKeyProvisioning ? 'success' : 'primary'}
            size="md"
            loading={loading}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
