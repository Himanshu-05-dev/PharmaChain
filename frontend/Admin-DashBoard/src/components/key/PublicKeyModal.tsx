import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { ManufacturerRecord } from '../../types/admin';
import { Lock, Copy, Check, ShieldCheck } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface PublicKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  manufacturer: ManufacturerRecord | null;
}

export const PublicKeyModal: React.FC<PublicKeyModalProps> = ({ isOpen, onClose, manufacturer }) => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!manufacturer) return null;

  const handleCopy = () => {
    if (manufacturer.publicKeyPem) {
      navigator.clipboard.writeText(manufacturer.publicKeyPem);
      setCopied(true);
      showToast({
        type: 'info',
        title: 'Public Key Copied',
        message: 'ECDSA P-256 Public Key copied to clipboard for JWKS ledger verification.',
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="lg">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center flex-shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
              ECDSA P-256 Cryptographic Key Certificate
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              PharmaChain Hyperledger Trust Anchor • {manufacturer.companyName}
            </p>
          </div>
        </div>

        {/* Key Attributes Card */}
        <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
          <div>
            <span className="text-slate-500 dark:text-slate-400 block">Manufacturer ID:</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{manufacturer.manufacturerId}</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block">Cryptographic Algorithm:</span>
            <span className="font-semibold text-emerald-800 dark:text-emerald-400">ES256 (ECDSA secp256r1)</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block">Key Status:</span>
            <span className="font-semibold text-emerald-700 dark:text-emerald-400 inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Active in Core Keystore
            </span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block">License Mapping:</span>
            <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{manufacturer.licenseNumber}</span>
          </div>
        </div>

        {/* PEM Output */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Public Key PEM</label>
            <button
              onClick={handleCopy}
              className="text-xs text-navy-700 dark:text-blue-400 hover:text-navy-900 dark:hover:text-blue-300 font-semibold inline-flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Key'}</span>
            </button>
          </div>
          <pre className="bg-slate-900 dark:bg-slate-950 text-emerald-400 font-mono text-[11px] p-3 rounded-xl overflow-x-auto leading-relaxed border border-slate-800 selection:bg-emerald-900">
            {manufacturer.publicKeyPem || '// No Public Key Provisioned Yet'}
          </pre>
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
          <Button variant="primary" size="md" onClick={onClose}>
            Close Certificate
          </Button>
        </div>
      </div>
    </Modal>
  );
};
