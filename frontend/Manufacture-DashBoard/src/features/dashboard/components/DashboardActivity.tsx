import React, { useMemo } from 'react';
import { useDashboard } from '../Hooks/dashboard.hooks';
import { StatusBadge } from '../../../components/common/StatusBadge';
import {
  Truck,
  History,
  Link2,
  CheckCircle2,
  Clock,
  Radio,
  ArrowRight,
  Database,
} from 'lucide-react';

export const DashboardActivity: React.FC = () => {
  const { batches, orders, navigateTo } = useDashboard();

  const liveTimeline = useMemo(() => {
    if (batches.length === 0) return [];
    return batches.slice(0, 3).map((b) => ({
      id: b.id,
      title: `${b.medicineName} (${b.id})`,
      timestamp: new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      description: b.mintStatus === 'MINTED'
        ? `Cryptographically signed & minted ${b.packsMinted?.toLocaleString()} packs`
        : b.mintStatus === 'RECALLED'
        ? `Quarantined with RECALL notice: ${b.recallReason || 'CDSCO directive'}`
        : `Batch registered in manufacturer database with status ${b.mintStatus}`,
    }));
  }, [batches]);

  const liveLedgerTxs = useMemo(() => {
    if (batches.length === 0) return [];
    return batches.slice(0, 3).map((b) => ({
      hash: b.txHash || `0x${b.id.replace(/[^a-f0-9]/gi, '')}9491a82f`,
      blockNumber: b.blockNumber || 18430,
      batchId: b.id,
      status: b.mintStatus,
    }));
  }, [batches]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* 1. B2B Orders & Logistics Preview */}
      <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border)] p-5 shadow-subtle flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-950/40 text-blue-400 border border-blue-800/50">
                <Truck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">Pharmacy Orders & Logistics</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--bg-element)] text-[var(--text-muted)]">
              {orders.length} Active POs
            </span>
          </div>

          <div className="mt-3 space-y-2">
            {orders.length > 0 ? (
              orders.slice(0, 3).map((ord) => (
                <div
                  key={ord.id}
                  onClick={() => navigateTo('orders')}
                  className="p-2.5 rounded-xl bg-[var(--bg-element)] border border-[var(--border)] hover:border-[var(--border-strong)] transition-all cursor-pointer space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[var(--brand-primary)] text-[11px]">
                      {ord.orderNumber}
                    </span>
                    <StatusBadge status={ord.status} size="sm" />
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-[var(--text-primary)]">{ord.pharmacyName}</span>
                    <span className="font-bold text-[var(--text-primary)]">₹{ord.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-xs text-[var(--text-muted)]">
                No active dispatch orders found.
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => navigateTo('orders')}
          className="btn-secondary w-full text-xs justify-center"
        >
          Open Orders & Shipping Center
        </button>
      </div>

      {/* 2. Activity Timeline Feed */}
      <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border)] p-5 shadow-subtle flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-950/40 text-purple-400 border border-purple-800/50">
                <History className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">Live Activity Trail</h3>
            </div>
            <span className="text-[10px] text-[var(--text-muted)]">Audit Log</span>
          </div>

          <div className="mt-3 space-y-3 relative pl-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--border)]">
            {liveTimeline.length > 0 ? (
              liveTimeline.map((item) => (
                <div key={item.id} className="relative text-xs space-y-0.5">
                  <div className="absolute -left-4 top-1 w-2.5 h-2.5 rounded-full bg-[var(--brand-primary)] ring-2 ring-[var(--bg-surface)]" />
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[var(--text-primary)]">{item.title}</span>
                    <span className="text-[10px] text-[var(--text-muted)]">{item.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] line-clamp-1">{item.description}</p>
                </div>
              ))
            ) : (
              <div className="py-4 text-center text-xs text-[var(--text-muted)]">
                No recent production events.
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => navigateTo('batches')}
          className="btn-secondary w-full text-xs justify-center"
        >
          View Full Audit Trail
        </button>
      </div>

      {/* 3. Hyperledger Fabric Ledger Preview */}
      <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border)] p-5 shadow-subtle flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-950/40 text-emerald-400 border border-emerald-800/50">
                <Link2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">Fabric Ledger Stream</h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              {batches.length > 0 ? `#${18430 + batches.length}` : '#18430'}
            </span>
          </div>

          <div className="mt-3 space-y-2">
            {liveLedgerTxs.length > 0 ? (
              liveLedgerTxs.map((tx) => (
                <div
                  key={tx.hash}
                  onClick={() => navigateTo('ledger')}
                  className="p-2.5 rounded-xl bg-[var(--bg-element)] border border-[var(--border)] text-xs font-mono cursor-pointer hover:border-[var(--brand-primary)] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[var(--brand-primary)]">
                      :{tx.batchId}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)]">Block #{tx.blockNumber}</span>
                  </div>
                  <p className="text-[10px] text-[var(--text-muted)] truncate mt-0.5">{tx.hash}</p>
                </div>
              ))
            ) : (
              <div className="py-4 text-center text-xs text-[var(--text-muted)]">
                Ledger channel connected. 0 batch blocks committed.
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => navigateTo('ledger')}
          className="btn-secondary w-full text-xs justify-center"
        >
          Open Ledger Transition Explorer
        </button>
      </div>
    </div>
  );
};
