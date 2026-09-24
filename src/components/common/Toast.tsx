import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full px-4 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all animate-in slide-in-from-bottom-3 duration-200 ${
            toast.type === 'success'
              ? 'bg-[#121318]/95 border-emerald-500/30 text-emerald-300'
              : toast.type === 'error'
              ? 'bg-[#121318]/95 border-rose-500/30 text-rose-300'
              : 'bg-[#121318]/95 border-blue-500/30 text-blue-300'
          }`}
          role="alert"
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />}
          {toast.type === 'info' && <Info className="w-5 h-5 shrink-0 text-blue-400 mt-0.5" />}

          <div className="flex-1 text-sm font-medium text-white leading-relaxed">
            {toast.message}
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="p-1 rounded text-neutral-400 hover:text-white transition-colors"
            aria-label="Dismiss message"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
