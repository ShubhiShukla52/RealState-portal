import React, { HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-xl border border-[#E2E2DF] text-[#222222] p-5 shadow-sm transition-all duration-200 ${
        hoverable ? 'hover:border-[#C66A4A] hover:shadow' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
