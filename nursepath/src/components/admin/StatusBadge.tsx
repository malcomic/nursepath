interface StatusBadgeProps {
  label: string;
  variant: 'success' | 'warning' | 'danger' | 'neutral';
}

export function StatusBadge({ label, variant }: StatusBadgeProps) {
  const styles: Record<StatusBadgeProps['variant'], string> = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    warning: 'bg-amber-50 text-amber-700 border-amber-100',
    danger: 'bg-rose-50 text-rose-700 border-rose-100',
    neutral: 'bg-slate-50 text-slate-700 border-slate-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[variant]}`}
    >
      {label}
    </span>
  );
}

