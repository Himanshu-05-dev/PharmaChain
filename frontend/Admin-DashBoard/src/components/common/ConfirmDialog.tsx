import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { ShieldAlert, Key, AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  targetName: string;
  targetId?: string;
  licenseNumber?: string;
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
  description,
  confirmText = 'Confirm & Provision Key',
  cancelText = 'Cancel',
  isKeyProvisioning = false,
  loading = false,
}) => {
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

        {/* Target Entity Card */}
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Target Entity</span>
            <h4 className="text-sm font-bold text-navy-800 dark:text-white">{targetName}</h4>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-300 mt-1">
              {targetId && <span>ID: <code className="text-slate-800 dark:text-slate-200 font-mono font-semibold">{targetId}</code></span>}
              {licenseNumber && <span>License: <code className="text-slate-800 dark:text-slate-200 font-mono font-semibold">{licenseNumber}</code></span>}
            </div>
          </div>
        </div>

        {/* Security Warning Notice */}
        {isKeyProvisioning ? (
          <div className="bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 rounded-xl p-3.5 flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-950 dark:text-amber-200 leading-relaxed">
              <p className="font-semibold text-amber-900 dark:text-amber-300 mb-1">Cryptographic Authority Warning</p>
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
