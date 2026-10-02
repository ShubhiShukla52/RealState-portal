import { useState, forwardRef, InputHTMLAttributes } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { FormError } from './FormError';

export interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, helperText, className = '', id, disabled, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const errorId = inputId ? `${inputId}-error` : undefined;

    const toggleVisibility = () => {
      if (!disabled) {
        setShowPassword((prev) => !prev);
      }
    };

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-[#222222] mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {/* Left Lock Icon */}
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A3A3A3]">
            <Lock className="w-4 h-4" />
          </div>

          {/* Password Input */}
          <input
            id={inputId}
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className={`w-full rounded-lg border bg-white pl-10 pr-11 py-2.5 text-sm text-[#222222] placeholder-[#A3A3A3] transition-colors focus:outline-none focus:ring-2 focus:ring-[#171717] focus:border-[#171717] disabled:bg-[#F5F5F2] disabled:text-[#A3A3A3] disabled:cursor-not-allowed ${
              error ? 'border-[#DC2626] focus:ring-[#DC2626]' : 'border-[#A3A3A3]'
            } ${className}`}
            {...props}
          />

          {/* Right Show/Hide Toggle Button */}
          <button
            type="button"
            onClick={toggleVisibility}
            disabled={disabled}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
            tabIndex={0}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#737373] hover:text-[#171717] transition-colors focus-visible:outline-none focus-visible:text-[#171717] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Eye className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        </div>

        {error && <FormError message={error} id={errorId} />}
        {!error && helperText && <p className="mt-1.5 text-xs text-[#737373]">{helperText}</p>}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
