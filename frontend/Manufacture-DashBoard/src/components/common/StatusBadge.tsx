import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  AlertOctagon,
  Package,
  Truck,
  FileText,
  ShieldCheck,
  ShieldAlert,
  Loader2
} from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  className = '',
  showIcon = true,
}) => {
  const normStatus = status.toUpperCase();

  const getStyle = () => {
    switch (normStatus) {
      // Mint & Batch Statuses
      case 'DRAFT':
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
          icon: <FileText className="w-3 h-3" />,
          label: 'Draft',
        };
      case 'MINTING':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          dot: 'bg-blue-500 animate-ping',
          icon: <Loader2 className="w-3 h-3 animate-spin" />,
          label: 'Minting',
        };
      case 'MINTED':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
          icon: <ShieldCheck className="w-3 h-3" />,
          label: 'Minted',
        };
      case 'PACKAGED':
        return {
          bg: 'bg-teal-50 text-teal-700 border-teal-200',
          dot: 'bg-teal-500',
          icon: <Package className="w-3 h-3" />,
          label: 'Packaged',
        };
      case 'DISTRIBUTED':
        return {
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          dot: 'bg-indigo-500',
          icon: <Truck className="w-3 h-3" />,
          label: 'Distributed',
        };
      case 'RECALLED':
        return {
          bg: 'bg-red-50 text-red-700 border-red-200 ring-1 ring-red-300',
          dot: 'bg-red-500 animate-pulse',
          icon: <AlertOctagon className="w-3 h-3" />,
          label: 'Recalled',
        };

      // Consumer / Verification States
      case 'GENUINE':
      case 'VERIFIED':
      case 'APPROVED':
      case 'ACTIVE':
      case 'HEALTHY':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
          icon: <CheckCircle2 className="w-3 h-3" />,
          label: 'Verified / Active',
        };
      case 'AT_SHOP':
      case 'ATSHOP':
        return {
          bg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
          dot: 'bg-cyan-500',
          icon: <Package className="w-3 h-3" />,
          label: 'At Shop (Intake)',
        };
      case 'SOLD':
      case 'ALREADY_SOLD':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500',
          icon: <Clock className="w-3 h-3" />,
          label: 'Sold to Consumer',
        };
      case 'EXPIRED':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-500',
          icon: <AlertTriangle className="w-3 h-3" />,
          label: 'Expired',
        };
      case 'COUNTERFEIT':
      case 'INVALID':
      case 'INVALID_SIGNATURE':
        return {
          bg: 'bg-red-100 text-red-800 border-red-300 animate-pulse-subtle',
          dot: 'bg-red-600',
          icon: <ShieldAlert className="w-3 h-3" />,
          label: 'Counterfeit / Invalid',
        };
      case 'NOT_FOUND':
        return {
          bg: 'bg-yellow-50 text-yellow-700 border-yellow-200',
          dot: 'bg-yellow-500',
          icon: <AlertTriangle className="w-3 h-3" />,
          label: 'Not Found',
        };

      // Order Statuses
      case 'PENDING':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-400',
          icon: <Clock className="w-3 h-3" />,
          label: 'Pending',
        };
      case 'PROCESSING':
        return {
          bg: 'bg-sky-50 text-sky-700 border-sky-200',
          dot: 'bg-sky-500',
          icon: <Loader2 className="w-3 h-3 animate-spin" />,
          label: 'Processing',
        };
      case 'SHIPPED':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          dot: 'bg-blue-500',
          icon: <Truck className="w-3 h-3" />,
          label: 'Dispatched',
        };
      case 'DELIVERED':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
          icon: <CheckCircle2 className="w-3 h-3" />,
          label: 'Delivered',
        };
      case 'CANCELLED':
        return {
          bg: 'bg-slate-100 text-slate-600 border-slate-200',
          dot: 'bg-slate-400',
          icon: <AlertOctagon className="w-3 h-3" />,
          label: 'Cancelled',
        };

      default:
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
          icon: <FileText className="w-3 h-3" />,
          label: status,
        };
    }
  };

  const style = getStyle();

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-sm ${style.bg} ${sizeClasses[size]} ${className}`}
    >
      {showIcon && style.icon}
      <span>{style.label}</span>
    </span>
  );
};
