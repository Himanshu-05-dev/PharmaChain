import React from 'react';
import { PackageOpen, AlertCircle, FileSearch, Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: 'package' | 'search' | 'alert' | 'inbox';
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No data available',
  description = 'There are no records matching your criteria.',
  icon = 'package',
  action,
  className = '',
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'search':
        return <FileSearch className="w-8 h-8 text-slate-400" />;
      case 'alert':
        return <AlertCircle className="w-8 h-8 text-amber-400" />;
      case 'inbox':
        return <Inbox className="w-8 h-8 text-slate-400" />;
      case 'package':
      default:
        return <PackageOpen className="w-8 h-8 text-slate-400" />;
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-slate-100/80 flex items-center justify-center mb-3.5 border border-slate-200/60">
        {getIcon()}
      </div>
      <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
      <p className="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-all"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
