import React from 'react';
import { useDashboard } from '../../features/dashboard/Hooks/dashboard.hooks';
import { Modal } from '../common/Modal';
import { HelpCircle, PhoneCall, Mail, BookOpen, ShieldCheck } from 'lucide-react';

export const HelpSupportModal: React.FC = () => {
  const { isHelpOpen, setIsHelpOpen } = useDashboard();

  if (!isHelpOpen) return null;

  return (
    <Modal
      isOpen={isHelpOpen}
      onClose={() => setIsHelpOpen(false)}
      title="Chemist POS & Pharmacovigilance Help"
      subtitle="Operational guides for retail barcode scanning & regulatory compliance"
      icon={<HelpCircle className="w-5 h-5 text-emerald-500" />}
      size="md"
    >
      <div className="space-y-4 text-xs">
        <div className="p-4 rounded-2xl bg-[var(--bg-element)] border border-[var(--border)] space-y-2">
          <h4 className="font-bold text-[var(--text-primary)]">Quick Operating Tips</h4>
          <ul className="list-disc pl-4 space-y-1 text-[var(--text-muted)] leading-relaxed">
            <li><strong>Intake Scan:</strong> Must be performed upon delivery receipt to advance pack status to <code className="text-emerald-500 font-mono">AT_SHOP</code>.</li>
            <li><strong>Counter Dispense:</strong> Scans at checkout automatically verify ECDSA signature and commit <code className="text-blue-500 font-mono">SOLD</code> state.</li>
            <li><strong>Recall Interception:</strong> If a batch is flagged by CDSCO, POS checkout locks immediately to protect patient safety.</li>
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-[var(--bg-element)] border border-[var(--border)] space-y-1">
            <span className="text-[10px] font-bold uppercase text-[var(--text-muted)]">CDSCO Technical Hotline</span>
            <strong className="text-xs text-[var(--text-primary)] block font-mono">1800-11-2244</strong>
          </div>
          <div className="p-3.5 rounded-2xl bg-[var(--bg-element)] border border-[var(--border)] space-y-1">
            <span className="text-[10px] font-bold uppercase text-[var(--text-muted)]">PharmaChain Support</span>
            <strong className="text-xs text-emerald-600 dark:text-emerald-400 block font-mono">help@pharmachain.gov.in</strong>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => setIsHelpOpen(false)}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </Modal>
  );
};
