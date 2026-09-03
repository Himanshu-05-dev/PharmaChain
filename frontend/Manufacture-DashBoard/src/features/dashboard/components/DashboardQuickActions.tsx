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
      title: 'Create Production Batch',
      description: 'Register formula & sign cryptographic block',
      icon: <PlusCircle className="w-5 h-5 text-amber-500" />,
      action: () => navigateTo('create-batch'),
      badge: 'New',
    },
    {
      title: 'GS1 QR Code Hub',
      description: 'Export 2D DataMatrix print-ready packages',
      icon: <QrCode className="w-5 h-5 text-amber-500" />,
      action: () => navigateTo('qr-codes'),
    },
    {
      title: 'Medicine Inventory',
      description: 'Real-time SKU stock levels and warehouse silos',
      icon: <Layers className="w-5 h-5 text-amber-500" />,
      action: () => navigateTo('inventory'),
    },
    {
      title: 'Traceability Explorer',
      description: 'Zero-trust custody hops and dispensary verification',
      icon: <Search className="w-5 h-5 text-amber-500" />,
      action: () => navigateTo('traceability'),
    },
    {
      title: 'Regulatory Audit Dossiers',
      description: 'Generate GMP compliance & batch audit logs',
      icon: <FileSpreadsheet className="w-5 h-5 text-amber-500" />,
      action: () => navigateTo('reports'),
    },
    {
      title: 'Initiate Recall Notice',
      description: 'Trigger statutory batch isolation protocol',
      icon: <AlertOctagon className="w-5 h-5 text-rose-500" />,
      action: () => setIsRecallModalOpen(true),
      danger: true,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-black uppercase tracking-wider text-[var(--text-primary)]">
            Operational Workflows
          </h2>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--bg-element)] text-[var(--text-muted)] border border-[var(--border)]">
            Core Actions
          </span>
        </div>
        <span className="text-xs text-[var(--text-muted)]">Instant Execution</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {actions.map((item, idx) => (
          <div
            key={idx}
            onClick={item.action}
            className={`p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] hover:bg-[var(--bg-element)] hover:border-amber-500/40 transition-all duration-200 cursor-pointer group flex flex-col justify-between space-y-3 shadow-xs hover:shadow-md hover:-translate-y-0.5 ${
              item.danger ? 'hover:border-rose-500/40' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-[var(--bg-element)] border border-[var(--border)] group-hover:border-amber-500/30 transition-colors">
                {item.icon}
              </div>
              <ArrowUpRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-amber-500 transition-colors transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-[var(--text-primary)] group-hover:text-amber-500 transition-colors truncate">
                  {item.title}
                </h4>
              </div>
              <p className="text-[10px] text-[var(--text-muted)] mt-1 line-clamp-2 leading-tight">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardQuickActions;
