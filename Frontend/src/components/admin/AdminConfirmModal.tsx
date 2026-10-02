import React from 'react';
import { AlertTriangle, LucideIcon } from 'lucide-react';
import { Button } from '../ui/Button';

export interface AdminConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary' | 'warning';
  icon?: LucideIcon;
  onConfirm: () => void;
  onCancel: () => void;
}

export const AdminConfirmModal: React.FC<AdminConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  icon: Icon = AlertTriangle,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#171717]/60 backdrop-blur-xs transition-opacity"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl border border-[#E2E2DF] shadow-2xl p-6 max-w-md w-full z-10 space-y-4 animate-in zoom-in-95">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            variant === 'danger'
              ? 'bg-red-50 text-[#DC2626]'
              : variant === 'warning'
              ? 'bg-amber-50 text-amber-700'
              : 'bg-[#F8EBE6] text-[#C66A4A]'
          }`}
        >
          <Icon className="w-6 h-6" />
        </div>

        <div>
          <h3 className="text-lg font-bold text-[#171717]">{title}</h3>
          <p className="text-xs sm:text-sm text-[#737373] mt-1.5 leading-relaxed">
            {message}
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E2DF]">
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            {cancelLabel}
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={onConfirm}
            className={
              variant === 'danger'
                ? 'bg-[#DC2626] hover:bg-[#B91C1C] border-[#DC2626] text-white'
                : ''
            }
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
