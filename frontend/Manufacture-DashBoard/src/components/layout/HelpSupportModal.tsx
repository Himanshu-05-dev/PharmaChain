import React, { useState } from 'react';
import { useDashboard } from '../../features/dashboard/Hooks/dashboard.hooks';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../common/Modal';
import {
  HelpCircle,
  FileText,
  Send,
  CheckCircle2,
  Phone,
  Mail,
  Shield,
  LifeBuoy,
} from 'lucide-react';

export const HelpSupportModal: React.FC = () => {
  const { isHelpModalOpen, setIsHelpOpen } = useDashboard();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'sop' | 'contact' | 'ticket'>('sop');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('BLOCKCHAIN_SYNC');
  const [ticketMessage, setTicketMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isHelpModalOpen) return null;

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsHelpOpen(false);
      setTicketSubject('');
      setTicketMessage('');
      showToast({
        type: 'success',
        title: 'Support Ticket Dispatched',
        message: 'Ticket #TCK-2026-9812 logged. Support engineer assigned.',
      });
    }, 800);
  };

  const sops = [
    {
      code: 'SOP-MFR-01',
      title: 'Batch Creation & ES256 Key Signing',
      description: 'Standard procedure for generating batch tokens and committing to Hyperledger Fabric.',
      category: 'Production',
    },
    {
      code: 'SOP-MFR-04',
      title: 'Supply Chain Recall Cascade (CDSCO Form 28-A)',
      description: 'Regulatory action steps for broadcasting batch recalls and enforcing POS locks.',
      category: 'Quality & Safety',
    },
    {
      code: 'SOP-MFR-07',
      title: 'Thermal QR Code Export & Verification',
      description: 'Guidelines for 300 DPI thermal packaging printing and optical readability QA.',
      category: 'Packaging',
    },
    {
      code: 'SOP-MFR-12',
      title: 'Audit Logging & Compliance Dossier Filing',
      description: 'Annual statutory records export adhering to CDSCO Good Manufacturing Practices.',
      category: 'Regulatory',
    },
  ];

  return (
    <Modal
      isOpen={isHelpModalOpen}
      onClose={() => setIsHelpOpen(false)}
      title="Help Center & Manufacturer Support"
      subtitle="Standard Operating Procedures (SOPs) & Technical Desk"
      icon={<HelpCircle className="w-5 h-5 text-[var(--brand-primary)]" />}
      size="lg"
    >
      <div className="space-y-4">
        {/* Navigation Tabs */}
        <div className="flex border-b border-[var(--border)] gap-2">
          {[
            { id: 'sop', label: 'Compliance SOPs' },
            { id: 'ticket', label: 'Open Support Ticket' },
            { id: 'contact', label: 'Hotlines & Contacts' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-2 text-xs font-semibold border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-[var(--brand-primary)] text-[var(--brand-primary)]'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: SOP Guides */}
        {activeTab === 'sop' && (
          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {sops.map((sop) => (
              <div
                key={sop.code}
                className="p-3.5 rounded-xl bg-[var(--bg-element)] border border-[var(--border)] hover:border-[var(--brand-primary)] transition-all space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[var(--brand-primary)] text-[11px]">
                    {sop.code}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--bg-surface)] text-[var(--text-muted)] font-medium">
                    {sop.category}
                  </span>
                </div>
                <h4 className="font-bold text-[var(--text-primary)]">{sop.title}</h4>
                <p className="text-[11px] text-[var(--text-muted)]">{sop.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Support Ticket */}
        {activeTab === 'ticket' && (
          <form onSubmit={handleTicketSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-medium text-[var(--text-primary)] mb-1">Issue Category</label>
              <select
                value={ticketCategory}
                onChange={(e) => setTicketCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-element)] text-[var(--text-primary)] font-medium focus:outline-none"
              >
                <option value="BLOCKCHAIN_SYNC">Fabric Ledger Sync & Block Delay</option>
                <option value="QR_EXPORT">QR Code Export Archive Corrupted</option>
                <option value="RECALL_REVERSAL">Recall Quarantine Audit Discrepancy</option>
                <option value="KEY_ROTATION">ECDSA P-256 Key Rotation Assistance</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-[var(--text-primary)] mb-1">Subject</label>
              <input
                type="text"
                required
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                placeholder="Brief summary of the issue..."
                className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-element)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-[var(--text-primary)] mb-1">Description</label>
              <textarea
                required
                rows={4}
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                placeholder="Include batch ID, error code, or node endpoint..."
                className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-element)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none resize-none"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Dispatching Ticket...' : 'Submit Support Ticket'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Contacts */}
        {activeTab === 'contact' && (
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[var(--bg-element)] border border-[var(--border)] space-y-2">
              <div className="font-bold text-[var(--text-primary)] flex items-center gap-2">
                <LifeBuoy className="w-4 h-4 text-[var(--brand-primary)]" />
                <span>PharmaChain Technical NOC</span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                24/7 dedicated engineering desk for node connectivity and ledger endorsing peers.
              </p>
              <div className="flex items-center gap-4 text-xs font-mono text-[var(--text-primary)] pt-1">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[var(--text-muted)]" /> +91 11 2894 1100
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[var(--text-muted)]" /> noc@pharmachain.gov.in
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--bg-element)] border border-[var(--border)] space-y-2">
              <div className="font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-400" />
                <span>CDSCO National Pharmacovigilance Helpdesk</span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                State licensing authority liaison and statutory recall notification office.
              </p>
              <div className="flex items-center gap-4 text-xs font-mono text-[var(--text-primary)] pt-1">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[var(--text-muted)]" /> pv-alerts@cdsco.nic.in
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
