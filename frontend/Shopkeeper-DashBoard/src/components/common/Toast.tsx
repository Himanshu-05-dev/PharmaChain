import React from 'react';
import { useToast, ToastItem } from '../../context/ToastContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

const ToastCard: React.FC<{ toast: ToastItem; onDismiss: () => void }> = ({ toast, onDismiss }) => {
  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />,
    info: <Info className="w-4 h-4 text-sky-500 shrink-0" />,
  };

  const borderStyles = {
    success: 'border-emerald-500/30 bg-[var(--bg-surface)]',
    error: 'border-rose-500/30 bg-[var(--bg-surface)]',
    warning: 'border-amber-500/30 bg-[var(--bg-surface)]',
    info: 'border-sky-500/30 bg-[var(--bg-surface)]',
  };

  return (
    <div
      className={`pointer-events-auto p-3.5 rounded-2xl border ${borderStyles[toast.type]} shadow-2xl backdrop-blur-xl flex items-start justify-between gap-3 animate-fadeIn text-xs`}
    >
      <div className="flex items-start gap-2.5 min-w-0">
        {icons[toast.type]}
        <div className="space-y-0.5 min-w-0">
          <h4 className="font-bold text-[var(--text-primary)] truncate">{toast.title}</h4>
          {toast.message && (
            <p className="text-[11px] text-[var(--text-muted)] line-clamp-2 leading-relaxed">
              {toast.message}
            </p>
          )}
        </div>
      </div>
      <button
        onClick={onDismiss}
        className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
