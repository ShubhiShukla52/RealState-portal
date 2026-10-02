import { InputHTMLAttributes, forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: LucideIcon;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon: Icon, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-[#222222] mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A3A3A3]">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-[#222222] placeholder-[#A3A3A3] transition-colors focus:outline-none focus:ring-2 focus:ring-[#171717] focus:border-[#171717] disabled:bg-[#F5F5F2] disabled:text-[#A3A3A3] disabled:cursor-not-allowed ${
              Icon ? 'pl-10' : ''
            } ${error ? 'border-[#DC2626] focus:ring-[#DC2626]' : 'border-[#A3A3A3]'} ${className}`}
            {...props}
          />
        </div>
        {error && <p className="mt-1.5 text-xs text-[#DC2626]">{error}</p>}
        {!error && helperText && <p className="mt-1.5 text-xs text-[#737373]">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
