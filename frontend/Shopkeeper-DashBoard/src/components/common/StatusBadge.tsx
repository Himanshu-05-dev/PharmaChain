import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldAlert,
  Lock,
  Boxes,
} from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const normalized = status.toUpperCase();

  const config: Record<
    string,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    IN_STOCK: {
      label: 'In Stock',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-500/20',
      icon: <CheckCircle2 className="w-3 h-3" />,
    },
    LOW_STOCK: {
      label: 'Low Stock',
      bg: 'bg-amber-500/10',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-500/20',
      icon: <AlertTriangle className="w-3 h-3" />,
    },
    EXPIRING_SOON: {
      label: 'Expiring Soon',
      bg: 'bg-orange-500/10',
      text: 'text-orange-600 dark:text-orange-400',
      border: 'border-orange-500/20',
      icon: <Clock className="w-3 h-3" />,
    },
    OUT_OF_STOCK: {
      label: 'Out of Stock',
      bg: 'bg-slate-500/10',
      text: 'text-slate-600 dark:text-slate-400',
      border: 'border-slate-500/20',
      icon: <Boxes className="w-3 h-3" />,
    },
    RECALLED: {
      label: 'Recalled (Locked)',
      bg: 'bg-rose-500/10',
      text: 'text-rose-600 dark:text-rose-400',
      border: 'border-rose-500/20',
      icon: <Lock className="w-3 h-3" />,
    },
    SOLD_ON_CHAIN: {
      label: 'Sold on Chain',
      bg: 'bg-blue-500/10',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-500/20',
      icon: <CheckCircle2 className="w-3 h-3" />,
    },
    APPROVED: {
      label: 'CDSCO Licensed',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-500/20',
      icon: <CheckCircle2 className="w-3 h-3" />,
    },
    PENDING: {
      label: 'Verification Pending',
      bg: 'bg-amber-500/10',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-500/20',
      icon: <Clock className="w-3 h-3" />,
    },
  };

  const current = config[normalized] || {
    label: status,
    bg: 'bg-slate-500/10',
    text: 'text-[var(--text-muted)]',
    border: 'border-[var(--border)]',
    icon: null,
  };

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold border ${current.bg} ${current.text} ${current.border} ${sizeClasses[size]}`}
    >
      {current.icon}
      <span>{current.label}</span>
    </span>
  );
};
