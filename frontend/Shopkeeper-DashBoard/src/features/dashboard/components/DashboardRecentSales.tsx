import React from 'react';
import { useDashboard } from '../Hooks/dashboard.hooks';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { Receipt, ArrowRight, Eye, Printer, CreditCard } from 'lucide-react';
import { SaleTransaction } from '../../../types';

export const DashboardRecentSales: React.FC = () => {
  const { sales, navigateTo, setActiveReceipt, setIsReceiptModalOpen } = useDashboard();

  const handleViewReceipt = (tx: SaleTransaction) => {
    setActiveReceipt(tx);
    setIsReceiptModalOpen(true);
  };

  return (
    <div className="bg-[var(--bg-surface)] p-6 rounded-3xl border border-[var(--border)] shadow-subtle space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
            <Receipt className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              Recent Point-of-Sale Transactions
            </h3>
            <p className="text-[11px] text-[var(--text-muted)]">
              Latest counter checkouts verified on Fabric blockchain
            </p>
          </div>
        </div>

        <button
          onClick={() => navigateTo('sales')}
          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>View All ({sales.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="divide-y divide-[var(--border)]">
        {sales.slice(0, 4).map((tx) => (
          <div
            key={tx.id}
            className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[var(--bg-element)]/40 px-2 rounded-xl transition-colors"
          >
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono font-bold text-xs text-[var(--text-primary)]">
                  {tx.invoiceNo}
                </span>
                <StatusBadge status={tx.verifiedStatus} size="sm" />
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--bg-element)] text-[var(--text-muted)] border border-[var(--border)]">
                  {tx.paymentMode}
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] truncate">
                Patient: <strong className="text-[var(--text-primary)]">{tx.patientName}</strong> •{' '}
                {tx.items.length} item(s): {tx.items.map((i) => i.medicineName).join(', ')}
              </p>
            </div>

            <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
              <div className="text-right">
                <span className="font-mono font-bold text-sm text-[var(--text-primary)] block">
                  ₹{tx.grandTotal.toFixed(2)}
                </span>
                <span className="text-[10px] text-[var(--text-muted)] font-mono">
                  {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <button
                onClick={() => handleViewReceipt(tx)}
                className="p-2 rounded-xl border border-[var(--border)] bg-[var(--bg-element)] hover:bg-[var(--bg-active)] text-[var(--text-primary)] transition-colors cursor-pointer"
                title="Print Receipt"
              >
                <Printer className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
