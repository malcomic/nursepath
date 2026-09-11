'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import {
  formatGuidePriceKes,
  formatKes,
  formatUsd,
  usdToKes,
} from '@/lib/currency/format';

interface CurrencyContextValue {
  usdToKesRate: number;
  formatPrice: (usd: number) => string;
  toKes: (usd: number) => number;
  formatKesAmount: (kes: number) => string;
  formatUsdAmount: (usd: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({
  usdToKesRate,
  children,
}: {
  usdToKesRate: number;
  children: ReactNode;
}) {
  const value = useMemo<CurrencyContextValue>(
    () => ({
      usdToKesRate,
      formatPrice: (usd: number) => formatGuidePriceKes(usd, usdToKesRate),
      toKes: (usd: number) => usdToKes(usd, usdToKesRate),
      formatKesAmount: formatKes,
      formatUsdAmount: formatUsd,
    }),
    [usdToKesRate]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return ctx;
}
