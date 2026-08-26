import React, { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'success' | 'destructive' | 'outline' | 'ghost' | 'secondary';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  className = '',
  ...props
}) => {
  let baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';

  let variantStyles = '';
  if (variant === 'primary') {
    variantStyles = 'bg-navy-800 hover:bg-navy-900 dark:bg-blue-600 dark:hover:bg-blue-700 text-white shadow-sm focus:ring-navy-700 dark:focus:ring-blue-500 active:bg-navy-950';
  } else if (variant === 'success') {
    variantStyles = 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm focus:ring-emerald-500 active:bg-emerald-800';
  } else if (variant === 'destructive') {
    variantStyles = 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm focus:ring-rose-500 active:bg-rose-800';
  } else if (variant === 'outline') {
    variantStyles = 'border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 focus:ring-slate-400 active:bg-slate-100 dark:active:bg-slate-600';
  } else if (variant === 'ghost') {
    variantStyles = 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:ring-slate-300 active:bg-slate-200';
  } else if (variant === 'secondary') {
    variantStyles = 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-slate-400';
  }

  let sizeStyles = '';
  if (size === 'sm') {
    sizeStyles = 'text-xs px-3 py-1.5 gap-1.5';
  } else if (size === 'md') {
    sizeStyles = 'text-sm px-4 py-2 gap-2';
  } else if (size === 'lg') {
    sizeStyles = 'text-base px-5 py-2.5 gap-2.5';
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" /> : icon}
      <span>{children}</span>
    </button>
  );
};
