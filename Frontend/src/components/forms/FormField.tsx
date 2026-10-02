import React from 'react';
import { FormError } from './FormError';

export interface FormFieldProps {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  helperText?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  required,
  optional,
  error,
  helperText,
  children,
  className = '',
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor={htmlFor} className="block text-sm font-medium text-[#222222]">
            {label}
            {required && <span className="text-[#C66A4A] ml-1">*</span>}
          </label>
          {optional && <span className="text-xs text-[#A3A3A3]">Optional</span>}
        </div>
      )}

      {children}

      {error && <FormError message={error} />}
      {!error && helperText && <p className="mt-1.5 text-xs text-[#737373]">{helperText}</p>}
    </div>
  );
};
