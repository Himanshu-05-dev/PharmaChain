import React, { useState } from 'react';
import { useDashboard } from '../../features/dashboard/Hooks/dashboard.hooks';
import { Modal } from '../common/Modal';
import { ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const ReportIncidentModal: React.FC = () => {
  const { isIncidentModalOpen, setIsIncidentModalOpen } = useDashboard();
  const { showToast } = useToast();

  const [packHash, setPackHash] = useState('');
  const [issueType, setIssueType] = useState('CLONED_QR');
  const [medicineName, setMedicineName] = useState('');
  const [notes, setNotes] = useState('');

  if (!isIncidentModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast({
      type: 'success',
      title: 'Incident Dispatched to CDSCO',
      message: 'Suspicious pack telemetry transmitted to State Drug Inspector.',
    });
    setIsIncidentModalOpen(false);
  };

  return (
    <Modal
      isOpen={isIncidentModalOpen}
      onClose={() => setIsIncidentModalOpen(false)}
      title="Report Counterfeit or Cloned Pack"
      subtitle="Escalate suspicious retail barcode or altered packaging directly to State Drug Control"
      icon={<ShieldAlert className="w-5 h-5 text-rose-500" />}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-[var(--text-primary)] mb-1">Detected Issue Type</label>
          <select
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-element)] border border-[var(--border)] text-[var(--text-primary)] font-bold focus:outline-none"
          >
            <option value="CLONED_QR">Double-Dispense / Cloned QR Barcode</option>
            <option value="UNREGISTERED_BATCH">Unregistered Batch / Missing Fabric Genesis</option>
            <option value="INVALID_ECDSA">Cryptographic Signature Forgery</option>
            <option value="PHYSICAL_TAMPERING">Physical Blister Tampering / Broken Seal</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-[var(--text-primary)] mb-1">Medicine Brand Name</label>
          <input
            type="text"
            value={medicineName}
            onChange={(e) => setMedicineName(e.target.value)}
            placeholder="e.g. Azithromycin 500mg"
            className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-element)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-semibold text-[var(--text-primary)] mb-1">Pack Hash / Serial Code</label>
          <input
            type="text"
            value={packHash}
            onChange={(e) => setPackHash(e.target.value)}
            placeholder="0x992288117766554433221100aabbccddeeff0011"
            className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-element)] border border-[var(--border)] text-[var(--text-primary)] font-mono focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-semibold text-[var(--text-primary)] mb-1">Observation Notes</label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Customer presented blister strip with blurred holographic ink or duplicate scan..."
            className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-element)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border)]">
          <button
            type="button"
            onClick={() => setIsIncidentModalOpen(false)}
            className="px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-element)] text-[var(--text-primary)] font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span>Transmit CDSCO Report</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </Modal>
  );
};
