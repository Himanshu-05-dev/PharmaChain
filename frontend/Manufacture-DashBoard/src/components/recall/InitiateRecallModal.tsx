import React, { useState } from 'react';
import { useDashboard } from '../../features/dashboard/Hooks/dashboard.hooks';
import { Modal } from '../common/Modal';
import {
  AlertOctagon,
  ShieldAlert,
  Lock,
} from 'lucide-react';

export const InitiateRecallModal: React.FC = () => {
  const {
    isRecallModalOpen,
    setIsRecallModalOpen,
    batchToRecall,
    batches,
    triggerRecall,
    profile,
  } = useDashboard();

  const [selectedBatchId, setSelectedBatchId] = useState<string>(
    batchToRecall?.id || batches[0]?.id || ''
  );
  const [recallReason, setRecallReason] = useState<string>('');
  const [severity, setSeverity] = useState<'CRITICAL' | 'MAJOR' | 'MODERATE'>('CRITICAL');
  const [confirmedRiskAcknowledgement, setConfirmedRiskAcknowledgement] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isRecallModalOpen) return null;

  const targetBatch = batches.find((b) => b.id === (batchToRecall?.id || selectedBatchId));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetBatch || !recallReason || !confirmedRiskAcknowledgement) return;

    setIsSubmitting(true);
    triggerRecall(targetBatch.id, recallReason, severity)
      .then(() => {
        setIsSubmitting(false);
        setIsRecallModalOpen(false);
        setRecallReason('');
        setConfirmedRiskAcknowledgement(false);
      })
      .catch(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <Modal
      isOpen={isRecallModalOpen}
      onClose={() => setIsRecallModalOpen(false)}
      title="Initiate Global Supply Chain Recall"
      subtitle="Broadcast immutable recall transition & enforce instant pharmacy checkout lock"
      icon={<AlertOctagon className="w-5 h-5 text-rose-500" />}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* High-Contrast Warning Banner */}
        <div className="p-4 rounded-2xl bg-[var(--alert-danger-bg)] border border-[var(--alert-danger-border)] flex items-start gap-3.5 text-xs">
          <div className="p-2 rounded-xl bg-[var(--alert-danger-badge-bg)] text-[var(--alert-danger-icon)] border border-[var(--alert-danger-border)] shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-[var(--alert-danger-heading)]">
              Mandatory CDSCO Regulatory Action (Form 28-A)
            </h4>
            <p className="leading-relaxed text-[var(--alert-danger-text)] font-medium">
              Initiating a recall commits an immutable <code className="font-mono font-bold px-1.5 py-0.5 rounded bg-[var(--alert-danger-badge-bg)] text-[var(--alert-danger-badge-text)] border border-[var(--alert-danger-border)]">:RECALL</code> event key to the Hyperledger Fabric ledger. All connected pharmacy POS scanners and consumer mobile apps will immediately reject this batch.
            </p>
          </div>
        </div>

        {/* Batch Selector */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-[var(--text-primary)] mb-1">
                Target Production Batch <span className="text-rose-500">*</span>
              </label>
              <select
                disabled={!!batchToRecall}
                value={batchToRecall?.id || selectedBatchId}
                onChange={(e) => setSelectedBatchId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-element)] font-mono font-bold text-[var(--text-primary)] focus:bg-[var(--bg-overlay)] focus:outline-none disabled:opacity-80 cursor-pointer"
              >
                {batches
                  .filter((b) => b.mintStatus !== 'RECALLED')
                  .map((b) => (
                    <option key={b.id} value={b.id} className="bg-[var(--bg-surface)] text-[var(--text-primary)]">
                      {b.id} — {b.medicineName} ({b.totalQuantity.toLocaleString()} units)
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[var(--text-primary)] mb-1">
                Recall Severity Level <span className="text-rose-500">*</span>
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-element)] font-bold text-[var(--text-primary)] focus:bg-[var(--bg-overlay)] focus:outline-none cursor-pointer"
              >
                <option value="CRITICAL" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Class I (Critical - Life threatening risk)</option>
                <option value="MAJOR" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Class II (Major - Temporary health hazard)</option>
                <option value="MODERATE" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Class III (Moderate - Packaging / Label defect)</option>
              </select>
            </div>
          </div>

          {targetBatch && (
            <div className="p-3.5 rounded-xl bg-[var(--bg-element)] border border-[var(--border)] grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold block">Medicine</span>
                <span className="font-bold text-[var(--text-primary)] truncate block">{targetBatch.medicineName}</span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold block">Affected Units</span>
                <span className="font-bold text-rose-600 dark:text-rose-400 block">{targetBatch.totalQuantity.toLocaleString()} Units</span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold block">Plant Site</span>
                <span className="font-medium text-[var(--text-primary)] truncate block">{targetBatch.productionSite}</span>
              </div>
            </div>
          )}
        </div>

        {/* Reason Text */}
        <div className="text-xs space-y-1">
          <label className="block font-semibold text-[var(--text-primary)]">
            Official Regulatory Recall Justification <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            rows={3}
            value={recallReason}
            onChange={(e) => setRecallReason(e.target.value)}
            placeholder="Document exact laboratory audit findings, stability failure reasons, or packaging defects..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-element)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none resize-none"
          />
        </div>

        {/* Confirmation Checkbox */}
        <div className="p-3.5 rounded-xl bg-[var(--bg-element)] border border-[var(--border)] text-xs">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmedRiskAcknowledgement}
              onChange={(e) => setConfirmedRiskAcknowledgement(e.target.checked)}
              className="mt-0.5 rounded border-[var(--border)] text-rose-600 focus:ring-rose-500 cursor-pointer"
            />
            <span className="text-[var(--text-muted)] leading-relaxed">
              I certify as an authorized signatory for <strong className="text-[var(--text-primary)] font-semibold">{profile.name}</strong> that this recall order has been validated by Quality Assurance and complies with national pharmacovigilance standards.
            </span>
          </label>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--border)]">
          <button
            type="button"
            onClick={() => setIsRecallModalOpen(false)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-primary)] bg-[var(--bg-element)] hover:bg-[var(--bg-active)] border border-[var(--border)] transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={!confirmedRiskAcknowledgement || !recallReason || isSubmitting}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 active:bg-rose-700 shadow-md shadow-rose-600/30 flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Enforcing Global Recall...' : 'Confirm & Broadcast Recall'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
