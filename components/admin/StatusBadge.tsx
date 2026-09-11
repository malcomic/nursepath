interface StatusBadgeProps {
  label: string;
  variant: 'success' | 'warning' | 'danger' | 'neutral';
}

export function StatusBadge({ label, variant }: StatusBadgeProps) {
  const styles: Record<StatusBadgeProps['variant'], string> = {
    success: 'bg-primary-50 text-primary-800 border-primary-100',
    warning: 'bg-amber-50 text-amber-700 border-amber-100',
    danger: 'bg-rose-50 text-rose-700 border-rose-100',
    neutral: 'bg-soft text-navy-700 border-border',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[variant]}`}
    >
      {label}
    </span>
  );
}
