/** Convert USD amount to whole Kenyan Shillings. */
export function usdToKes(usd: number, rate: number): number {
  return Math.round(Number(usd) * Number(rate));
}

/** Format a KES amount, e.g. "KES 10,400". */
export function formatKes(kesAmount: number): string {
  return `KES ${Math.round(kesAmount).toLocaleString('en-KE')}`;
}

/** Format a USD amount for secondary display, e.g. "$79.00". */
export function formatUsd(usd: number): string {
  return `$${Number(usd).toFixed(2)}`;
}

/**
 * Primary storefront price label.
 * Prices are stored in USD and converted with Settings.usdToKesRate.
 */
export function formatGuidePriceKes(
  usd: number,
  rate: number | null | undefined
): string {
  if (Number(usd) === 0) return 'FREE';
  if (rate == null || !Number.isFinite(Number(rate)) || Number(rate) <= 0) {
    return formatUsd(usd);
  }
  return formatKes(usdToKes(usd, Number(rate)));
}
