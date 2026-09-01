import React from 'react';
import { ShieldCheck, Clock, AlertTriangle, XCircle, Lock, Key, ShieldAlert } from 'lucide-react';

export type StatusVariant = 'pending' | 'approved' | 'rejected' | 'suspended' | 'blocked' | 'key_active' | 'key_pending' | 'retail' | 'wholesale';

interface BadgeProps {
  variant: StatusVariant | string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant, label, size = 'sm', className = '' }) => {
  const norm = variant.toLowerCase();

  let bg = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
  let Icon: React.ElementType | null = null;
  let text = label || variant;

  if (norm === 'pending') {
    bg = 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700/60';
    Icon = Clock;
    text = label || 'Pending Review';
  } else if (norm === 'approved' || norm === 'verified') {
    bg = 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/60';
    Icon = ShieldCheck;
    text = label || 'Approved / Verified';
  } else if (norm === 'rejected') {
    bg = 'bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700/60';
    Icon = XCircle;
    text = label || 'Rejected';
  } else if (norm === 'suspended' || norm === 'blocked') {
    bg = 'bg-rose-100 dark:bg-rose-950/80 text-rose-900 dark:text-rose-200 border-rose-400 dark:border-rose-700 font-bold';
    Icon = ShieldAlert;
    text = label || (norm === 'blocked' ? 'Blocked' : 'Suspended');
  } else if (norm === 'key_active' || norm === 'p-256 provisioned') {
    bg = 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700';
    Icon = Lock;
    text = label || 'P-256 Provisioned';
  } else if (norm === 'key_pending') {
    bg = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700';
    Icon = Key;
    text = label || 'Key Pending';
  } else if (norm === 'retail') {
    bg = 'bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/60';
    text = label || 'Retail (Form 20/21)';
  } else if (norm === 'wholesale') {
    bg = 'bg-purple-50 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800/60';
    text = label || 'Wholesale (Form 20B/21B)';
  }

  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : size === 'md' ? 'text-xs px-2.5 py-1' : 'text-sm px-3 py-1.5';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border font-medium ${sizeClasses} ${bg} ${className}`}>
      {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
      <span>{text}</span>
    </span>
  );
};
