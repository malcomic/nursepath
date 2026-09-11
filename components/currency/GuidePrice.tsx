'use client';

import { useCurrency } from '@/components/currency/CurrencyProvider';

interface GuidePriceProps {
  usd: number;
  className?: string;
  /** Show a small ≈ $USD line under the KES price. */
  showUsdSecondary?: boolean;
  secondaryClassName?: string;
}

export default function GuidePrice({
  usd,
  className = '',
  showUsdSecondary = false,
  secondaryClassName = 'mt-1 text-sm font-normal text-navy-400',
}: GuidePriceProps) {
  const { formatPrice, formatUsdAmount } = useCurrency();
  const price = Number(usd);

  if (!showUsdSecondary) {
    return <span className={className}>{formatPrice(price)}</span>;
  }

  return (
    <span className={`inline-flex flex-col ${className}`}>
      <span>{formatPrice(price)}</span>
      {price > 0 && <span className={secondaryClassName}>≈ {formatUsdAmount(price)}</span>}
    </span>
  );
}
