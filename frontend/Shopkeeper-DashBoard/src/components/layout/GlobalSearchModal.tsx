import React, { useState, useEffect } from 'react';
import { useDashboard } from '../../features/dashboard/Hooks/dashboard.hooks';
import { Search, Boxes, Receipt, AlertOctagon, X, ArrowRight } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, inventory, sales, recalls, navigateTo, setActiveReceipt, setIsReceiptModalOpen } = useDashboard();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape') setIsSearchOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const matchedInventory = query.trim()
    ? inventory.filter(
        (i) =>
          i.medicineName.toLowerCase().includes(query.toLowerCase()) ||
          i.genericName.toLowerCase().includes(query.toLowerCase()) ||
          i.batchId.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const matchedSales = query.trim()
    ? sales.filter(
        (s) =>
          s.invoiceNo.toLowerCase().includes(query.toLowerCase()) ||
          s.patientName.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsSearchOpen(false)}
      />

      <div className="relative w-full max-w-xl bg-[var(--bg-surface)] border border-[var(--border)] rounded-3xl shadow-2xl overflow-hidden z-10">
        {/* Search Header */}
        <div className="p-4 border-b border-[var(--border)] flex items-center gap-3">
          <Search className="w-5 h-5 text-emerald-500 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search medicines, batches, invoice numbers..."
            className="w-full bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none font-medium"
            autoFocus
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4 text-xs">
          {query.trim() === '' ? (
            <div className="text-center py-6 text-[var(--text-muted)]">
              Type medicine name, formulation, batch ID, or invoice number...
            </div>
          ) : (
            <>
              {/* Inventory Results */}
              {matchedInventory.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">
                    Medicines & Stock ({matchedInventory.length})
                  </span>
                  {matchedInventory.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setIsSearchOpen(false);
                        navigateTo('inventory');
                      }}
                      className="p-3 rounded-xl bg-[var(--bg-element)] hover:bg-[var(--bg-active)] border border-[var(--border)] cursor-pointer flex items-center justify-between gap-3 transition-colors"
                    >
                      <div>
                        <strong className="text-[var(--text-primary)] block">{item.medicineName}</strong>
                        <span className="text-[11px] text-[var(--text-muted)]">
                          Batch: {item.batchId} • {item.packCount} packs available
                        </span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                    </div>
                  ))}
                </div>
              )}

              {/* Sales Invoices */}
              {matchedSales.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">
                    Sales Invoices ({matchedSales.length})
                  </span>
                  {matchedSales.map((tx) => (
                    <div
                      key={tx.id}
                      onClick={() => {
                        setIsSearchOpen(false);
                        setActiveReceipt(tx);
                        setIsReceiptModalOpen(true);
                      }}
                      className="p-3 rounded-xl bg-[var(--bg-element)] hover:bg-[var(--bg-active)] border border-[var(--border)] cursor-pointer flex items-center justify-between gap-3 transition-colors"
                    >
                      <div>
                        <strong className="text-[var(--text-primary)] block">{tx.invoiceNo}</strong>
                        <span className="text-[11px] text-[var(--text-muted)]">
                          Patient: {tx.patientName} • ₹{tx.grandTotal.toFixed(2)}
                        </span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                    </div>
                  ))}
                </div>
              )}

              {matchedInventory.length === 0 && matchedSales.length === 0 && (
                <div className="text-center py-6 text-[var(--text-muted)]">
                  No records matching "{query}"
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
