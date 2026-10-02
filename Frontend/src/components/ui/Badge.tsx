import React, { HTMLAttributes } from 'react';

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'accent'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'outline';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-0.5 text-xs',
  };

  const variantStyles: Record<BadgeVariant, string> = {
    default: 'bg-[#171717] text-white',
    primary: 'bg-[#171717] text-white',
    accent: 'bg-[#F8EBE6] text-[#C66A4A] font-medium border border-[#C66A4A]/10',
    secondary: 'bg-[#F5F5F2] text-[#222222] border border-[#E2E2DF]',
    success: 'bg-emerald-50 text-[#16A34A] border border-emerald-200/60',
    warning: 'bg-amber-50 text-[#B45309] border border-amber-200/60',
    error: 'bg-rose-50 text-[#DC2626] border border-rose-200/60',
    outline: 'border border-[#A3A3A3] text-[#222222] bg-white',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium tracking-wide transition-colors ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
