import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDanger?: boolean;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed? This action cannot be undone.',
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  isDanger = true,
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          {isDanger && (
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
          )}
          <p className="text-sm text-neutral-300 leading-relaxed">{message}</p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#262833]">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium rounded-lg text-neutral-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-medium rounded-lg text-white transition-colors flex items-center gap-2 ${
              isDanger
                ? 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800'
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
            }`}
          >
            {isLoading && (
              <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            )}
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
