import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface FormErrorProps {
  message?: string;
  className?: string;
  id?: string;
}

export const FormError: React.FC<FormErrorProps> = ({ message, className = '', id }) => {
  if (!message) return null;

  return (
    <div
      id={id}
      role="alert"
      className={`flex items-center gap-1.5 mt-1.5 text-xs text-[#DC2626] animate-in fade-in duration-150 ${className}`}
    >
      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-[#DC2626]" />
      <span>{message}</span>
    </div>
  );
};
