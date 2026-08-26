import React from 'react';
import { useDashboard } from '../../features/dashboard/Hooks/dashboard.hooks';
import { useAuth } from '../../features/auth/hooks/auth.hooks';
import { Modal } from '../common/Modal';
import {
  Printer,
  Download,
  CheckCircle2,
  Receipt,
  QrCode,
  ShieldCheck,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const ReceiptModal: React.FC = () => {
  const { isReceiptModalOpen, setIsReceiptModalOpen, activeReceipt } = useDashboard();
  const { user } = useAuth();
  const { showToast } = useToast();

  if (!isReceiptModalOpen || !activeReceipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    showToast({
      type: 'success',
      title: 'Tax Invoice Downloaded',
      message: `${activeReceipt.invoiceNo}_Tax_Invoice.pdf saved.`,
    });
  };

  return (
    <Modal
      isOpen={isReceiptModalOpen}
      onClose={() => setIsReceiptModalOpen(false)}
      title="GST Tax Invoice & Provenance Receipt"
      subtitle={`Invoice #${activeReceipt.invoiceNo} — Committed on Hyperledger Fabric`}
      icon={<Receipt className="w-5 h-5 text-emerald-500" />}
      size="md"
    >
      <div className="space-y-5 text-xs print:p-0">
        {/* Printable Receipt Paper Body */}
        <div className="p-6 rounded-3xl bg-[var(--bg-element)] border border-[var(--border)] space-y-4 font-mono shadow-inner">
          {/* Store Header */}
          <div className="text-center pb-3 border-b border-dashed border-[var(--border)] space-y-1">
            <h2 className="text-sm font-bold text-[var(--text-primary)] font-sans">
              {user?.shopName || 'Apollo MedPlus Pharmacy'}
            </h2>
            <p className="text-[10px] text-[var(--text-muted)] font-sans">
              {user?.address}, {user?.city} - {user?.pincode}
            </p>
            <p className="text-[10px] text-[var(--text-muted)]">
              DL: {user?.licenseNumber || 'DL-20-B-2023-88741'} | GSTIN: {user?.gstin || '07AAAAA0000A1Z5'}
            </p>
          </div>

          {/* Invoice Meta */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-[var(--text-muted)] block">Invoice No:</span>
              <strong className="text-[var(--text-primary)]">{activeReceipt.invoiceNo}</strong>
            </div>
            <div className="text-right">
              <span className="text-[var(--text-muted)] block">Date & Time:</span>
              <span className="text-[var(--text-primary)]">
                {new Date(activeReceipt.timestamp).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-[var(--text-muted)] block">Patient Name:</span>
              <strong className="text-[var(--text-primary)]">{activeReceipt.patientName}</strong>
            </div>
            <div className="text-right">
              <span className="text-[var(--text-muted)] block">Payment Mode:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {activeReceipt.paymentMode}
              </span>
            </div>
          </div>

          {/* Items Table */}
          <div className="pt-2 border-t border-dashed border-[var(--border)]">
            <div className="flex justify-between font-bold text-[10px] text-[var(--text-muted)] uppercase mb-1">
              <span>Item Description</span>
              <span>Qty x Price</span>
              <span>Total</span>
            </div>
            <div className="divide-y divide-[var(--border)]/40">
              {activeReceipt.items.map((item, idx) => (
                <div key={idx} className="py-1.5 flex justify-between text-[11px]">
                  <div className="min-w-0 pr-2">
                    <span className="font-bold text-[var(--text-primary)] block truncate">
                      {item.medicineName}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)]">Batch: {item.batchId}</span>
                  </div>
                  <span className="text-[var(--text-muted)] shrink-0">
                    {item.quantity} x ₹{item.unitPrice.toFixed(2)}
                  </span>
                  <span className="font-bold text-[var(--text-primary)] shrink-0 ml-2">
                    ₹{item.total.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="pt-2 border-t border-dashed border-[var(--border)] space-y-1 text-right">
            <div className="flex justify-between text-[var(--text-muted)]">
              <span>Subtotal:</span>
              <span>₹{activeReceipt.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[var(--text-muted)]">
              <span>CGST (6%) + SGST (6%):</span>
              <span>₹{activeReceipt.taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-[var(--text-primary)] pt-1 border-t border-[var(--border)]">
              <span>Grand Total:</span>
              <span className="text-emerald-600 dark:text-emerald-400">
                ₹{activeReceipt.grandTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Blockchain Provenance Stamp */}
          <div className="pt-3 border-t border-dashed border-[var(--border)] text-center space-y-1.5 font-sans">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Fabric Block #{activeReceipt.blockNumber} • State: SOLD</span>
            </div>
            <p className="font-mono text-[9px] text-[var(--text-muted)] truncate">
              Tx: {activeReceipt.fabricTxId}
            </p>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
          <button
            type="button"
            onClick={handleDownloadPDF}
            className="px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-element)] hover:bg-[var(--bg-active)] text-[var(--text-primary)] font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsReceiptModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-element)] text-[var(--text-primary)] font-semibold cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
