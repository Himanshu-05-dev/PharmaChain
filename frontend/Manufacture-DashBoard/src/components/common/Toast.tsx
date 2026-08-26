import React from 'react';
import { useToast, ToastItem } from '../../context/ToastContext';
import { CheckCircle2, AlertTriangle, AlertOctagon, Info, X } from 'lucide-react';

const ToastIcon = ({ type }: { type: ToastItem['type'] }) => {
  switch (type) {
    case 'success':
      return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
    case 'error':
      return <AlertOctagon className="w-5 h-5 text-red-500 shrink-0" />;
    case 'warning':
      return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
    case 'info':
    default:
      return <Info className="w-5 h-5 text-blue-500 shrink-0" />;
  }
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 p-4 bg-white/95 backdrop-blur border border-slate-200/90 rounded-xl shadow-lg shadow-slate-900/10 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
          role="alert"
        >
          <ToastIcon type={toast.type} />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-slate-900">{toast.title}</h4>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed break-words">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded-lg hover:bg-slate-100"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
