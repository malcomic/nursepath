import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export default function Card({
  children,
  className = '',
  hover = false,
  padding = 'md',
}: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const hoverClass = hover
    ? 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300'
    : '';

  return (
    <div
      className={`bg-white rounded-2xl border border-gray-200 shadow-soft ${paddingClasses[padding]} ${hoverClass} ${className}`}
    >
      {children}
    </div>
  );
}
