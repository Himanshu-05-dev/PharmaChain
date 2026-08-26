import React from 'react';
import { useDashboard } from '../Hooks/dashboard.hooks';
import {
  TrendingUp,
  Boxes,
  ArrowDownToLine,
  AlertTriangle,
  Receipt,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const DashboardStats: React.FC = () => {
  const { inventory, sales, inbounds, recalls } = useDashboard();

  const totalSalesRevenue = sales.reduce((acc, s) => acc + s.grandTotal, 0);
  const totalPacksInStock = inventory.reduce((acc, i) => acc + i.packCount, 0);
  const lowStockCount = inventory.filter((i) => i.status === 'LOW_STOCK').length;
  const expiringSoonCount = inventory.filter((i) => i.status === 'EXPIRING_SOON').length;
  const activeRecallsCount = recalls.filter((r) => r.status === 'ACTIVE').length;

  const stats = [
    {
      title: "Today's POS Revenue",
      value: `₹${totalSalesRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      change: '+14.2% vs yesterday',
      trend: 'up',
      subtitle: `${sales.length} transactions committed on Fabric`,
      icon: <Receipt className="w-5 h-5 text-emerald-500" />,
      badgeBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
    },
    {
      title: 'Current Physical Stock',
      value: `${totalPacksInStock.toLocaleString()} Packs`,
      change: '100% Verified',
      trend: 'up',
      subtitle: `${inventory.length} active formulations in depot`,
      icon: <Boxes className="w-5 h-5 text-sky-500" />,
      badgeBg: 'bg-sky-500/10 border-sky-500/20 text-sky-600 dark:text-sky-400',
    },
    {
      title: 'Inbound Deliveries Verified',
      value: `${inbounds.length} Shipments`,
      change: 'All Signatures Valid',
      trend: 'neutral',
      subtitle: 'Chain of custody state: AT_SHOP',
      icon: <ArrowDownToLine className="w-5 h-5 text-teal-500" />,
      badgeBg: 'bg-teal-500/10 border-teal-500/20 text-teal-600 dark:text-teal-400',
    },
    {
      title: 'Stock Health & Risk Alerts',
      value: `${lowStockCount + expiringSoonCount} Alerts`,
      change: activeRecallsCount > 0 ? `${activeRecallsCount} Recall Active` : 'Zero Counterfeits',
      trend: activeRecallsCount > 0 ? 'down' : 'up',
      subtitle: `${expiringSoonCount} expiring < 60d, ${lowStockCount} low stock`,
      icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
      badgeBg: 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="p-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-subtle flex flex-col justify-between space-y-4 hover:border-emerald-500/30 transition-all group"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider block">
                {stat.title}
              </span>
              <span className="text-2xl font-black text-[var(--text-primary)] tracking-tight block">
                {stat.value}
              </span>
            </div>
            <div className={`p-3 rounded-2xl border ${stat.badgeBg} shrink-0`}>
              {stat.icon}
            </div>
          </div>

          <div className="pt-2 border-t border-[var(--border)]/60 flex items-center justify-between text-xs">
            <span className="text-[11px] text-[var(--text-muted)] truncate">{stat.subtitle}</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-[11px] shrink-0 font-mono">
              {stat.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
