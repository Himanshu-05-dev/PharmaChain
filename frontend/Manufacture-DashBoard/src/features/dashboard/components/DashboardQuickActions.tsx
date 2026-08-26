import React from 'react';
import { useDashboard } from '../Hooks/dashboard.hooks';
import {
  PlusCircle,
  QrCode,
  Layers,
  AlertOctagon,
  Search,
  FileSpreadsheet,
  ArrowUpRight,
} from 'lucide-react';

export const DashboardQuickActions: React.FC = () => {
  const { navigateTo, setIsRecallModalOpen } = useDashboard();

  const actions = [
    {
      title: 'Create Batch',
      description: 'Register and mint serialized medicine batch',
      icon: <PlusCircle className="w-5 h-5 text-emerald-400" />,
      iconBg: 'bg-emerald-950/40 border-emerald-800/50',
      action: () => navigateTo('create-batch'),
      primary: true,
    },
    {
      title: 'Generate QR Codes',
      description: 'Export thermal print-ready ZIP & CSV packages',
      icon: <QrCode className="w-5 h-5 text-sky-400" />,
      iconBg: 'bg-sky-950/40 border-sky-800/50',
      action: () => navigateTo('qr-codes'),
    },
    {
      title: 'Medicine Inventory',
      description: 'Track 84 finished product SKUs and stock levels',
      icon: <Layers className="w-5 h-5 text-indigo-400" />,
      iconBg: 'bg-indigo-950/40 border-indigo-800/50',
      action: () => navigateTo('inventory'),
    },
    {
      title: 'Initiate Recall',
      description: 'Trigger CDSCO compliant batch isolation',
      icon: <AlertOctagon className="w-5 h-5 text-rose-400" />,
      iconBg: 'bg-rose-950/40 border-rose-800/50',
      action: () => setIsRecallModalOpen(true),
      danger: true,
    },
    {
      title: 'Traceability Explorer',
      description: 'Verify pack hashes and supply chain hops',
      icon: <Search className="w-5 h-5 text-cyan-400" />,
      iconBg: 'bg-cyan-950/40 border-cyan-800/50',
      action: () => navigateTo('traceability'),
    },
    {
      title: 'Regulatory Reports',
      description: 'Generate GMP compliance & batch audit logs',
      icon: <FileSpreadsheet className="w-5 h-5 text-amber-400" />,
      iconBg: 'bg-amber-950/40 border-amber-800/50',
      action: () => navigateTo('reports'),
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-[var(--text-primary)]">Quick Operations</h3>
        <span className="text-[11px] text-[var(--text-muted)]">Core Manufacturing Workflows</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {actions.map((item, idx) => (
          <div
            key={idx}
            onClick={item.action}
            className={`p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] hover:bg-[var(--bg-overlay)] hover:border-[var(--border-strong)] transition-all cursor-pointer group flex flex-col justify-between space-y-3 shadow-subtle ${item.danger
                ? 'hover:border-rose-500/50'
                : item.primary
                  ? 'hover:border-[var(--brand-primary)]'
                  : ''
              }`}
          >
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg border ${item.iconBg}`}>
                {item.icon}
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors opacity-0 group-hover:opacity-100" />
            </div>

            <div>
              <h4 className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors">
                {item.title}
              </h4>
              <p className="text-[10px] text-[var(--text-muted)] mt-0.5 line-clamp-2 leading-tight">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
