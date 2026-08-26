import React from 'react';
import { useDashboard } from '../Hooks/dashboard.hooks';
import {
  QrCode,
  ArrowDownToLine,
  Boxes,
  FileSpreadsheet,
  AlertOctagon,
  History,
  ShieldCheck,
  Search,
} from 'lucide-react';

export const DashboardQuickActions: React.FC = () => {
  const { navigateTo, setActiveScanMode, setIsIncidentModalOpen } = useDashboard();

  const actions = [
    {
      title: 'Counter POS Dispenser',
      desc: 'Point-of-sale checkout & instant sale commitment',
      icon: <QrCode className="w-5 h-5 text-emerald-500" />,
      onClick: () => {
        setActiveScanMode('DISPENSE');
        navigateTo('pos');
      },
      badge: 'Counter Mode',
    },
    {
      title: 'Receive Inbound Stock',
      desc: 'Verify distributor delivery against manufacturer batch',
      icon: <ArrowDownToLine className="w-5 h-5 text-sky-500" />,
      onClick: () => {
        setActiveScanMode('RECEIVE');
        navigateTo('intake');
      },
      badge: '+ Receive',
    },
    {
      title: 'Live Medicine Inventory',
      desc: 'Stock counts, SKU catalog & batch expiry alerts',
      icon: <Boxes className="w-5 h-5 text-teal-500" />,
      onClick: () => navigateTo('inventory'),
      badge: 'Catalog',
    },
    {
      title: 'Sales & Dispensed Ledger',
      desc: 'Audit trail of past counter sales and invoices',
      icon: <History className="w-5 h-5 text-purple-500" />,
      onClick: () => navigateTo('sales'),
      badge: 'Fabric Records',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((act, idx) => (
        <div
          key={idx}
          onClick={act.onClick}
          className="p-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-subtle hover:border-emerald-500/40 hover:bg-[var(--bg-element)]/60 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
        >
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-2xl bg-[var(--bg-element)] border border-[var(--border)] group-hover:border-emerald-500/30 transition-all shrink-0">
              {act.icon}
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--bg-element)] text-[var(--text-muted)] border border-[var(--border)]">
              {act.badge}
            </span>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-emerald-500 transition-colors">
              {act.title}
            </h4>
            <p className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-2 leading-relaxed">
              {act.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
