import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { XCircle, AlertCircle, ShieldAlert } from 'lucide-react';

interface RejectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onReject: (reason: string) => Promise<void> | void;
  title: string;
  targetName: string;
  isSuspension?: boolean;
  loading?: boolean;
}

const REJECTION_REASONS = [
  'Invalid or unverifiable Drug License number on State portal',
  'Mandatory Form 20B/21B wholesale license scan missing or illegible',
  'Mismatched corporate name or unverified manufacturing plant location',
  'License expired or revoked by State Licensing Authority (SLA)',
  'Suspected distribution of unregistered / recalled medicine batches',
  'Failed physical inspection by State Drug Inspector',
  'Custom audit reason (specified below)',
];

export const RejectDialog: React.FC<RejectDialogProps> = ({
  isOpen,
  onClose,
  onReject,
  title,
  targetName,
  isSuspension = false,
  loading = false,
}) => {
  const [selectedReason, setSelectedReason] = useState(REJECTION_REASONS[0]);
  const [customRemarks, setCustomRemarks] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    let finalReason = selectedReason;
    if (selectedReason === 'Custom audit reason (specified below)') {
      if (!customRemarks.trim()) {
        setError('Please enter detailed compliance remarks for the audit trail.');
        return;
      }
      finalReason = customRemarks.trim();
    } else if (customRemarks.trim()) {
      finalReason = `${selectedReason} — Remarks: ${customRemarks.trim()}`;
    }

    if (!finalReason.trim()) {
      setError('A valid rejection reason is mandatory under CDSCO audit compliance.');
      return;
    }

    setError('');
    await onReject(finalReason);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
              isSuspension
                ? 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400'
                : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
            }`}
          >
            {isSuspension ? <ShieldAlert className="w-6 h-6" /> : <XCircle className="w-6 h-6 text-rose-600 dark:text-rose-400" />}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">{title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Mandatory CDSCO Regulatory Audit Record</p>
          </div>
        </div>

        {/* Target Entity */}
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3.5 border border-slate-200 dark:border-slate-700">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Applicant / Entity</span>
          <h4 className="text-sm font-bold text-navy-800 dark:text-white mt-0.5">{targetName}</h4>
        </div>

        {/* Reason Code Dropdown */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Select Regulatory Reason Code <span className="text-rose-500">*</span>
          </label>
          <select
            className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 focus:border-navy-700 dark:focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-navy-700"
            value={selectedReason}
            onChange={(e) => {
              setSelectedReason(e.target.value);
              setError('');
            }}
          >
            {REJECTION_REASONS.map((r, idx) => (
              <option key={idx} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Additional Audit Comments */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Audit Remarks & Guidance for Applicant <span className="text-slate-400 font-normal">(Recorded in Ledger)</span>
          </label>
          <textarea
            rows={3}
            className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-navy-700 dark:focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-navy-700 resize-none"
            placeholder="Enter specific license deficiencies or inspection findings..."
            value={customRemarks}
            onChange={(e) => {
              setCustomRemarks(e.target.value);
              setError('');
            }}
          />
        </div>

        {/* Validation Error Banner */}
        {error && (
          <div className="bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-lg p-2.5 flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800 mt-2">
          <Button variant="outline" size="md" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="destructive" size="md" loading={loading} onClick={handleSubmit}>
            {isSuspension ? 'Confirm Emergency Suspension' : 'Reject Application'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
