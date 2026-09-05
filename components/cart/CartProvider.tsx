'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export interface CartItem {
  guideId: string;
  title: string;
  price: number;
  thumbnailUrl: string | null;
  slug: string;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (guideId: string) => void;
  clearCart: () => void;
  replaceCart: (items: CartItem[]) => void;
  isInCart: (guideId: string) => boolean;
  hydrated: boolean;
}

const CART_KEY = 'nursepath_cart';

const CartContext = createContext<CartContextValue | null>(null);

function readCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readCart());
    setHydrated(true);
  }, []);

  const persist = useCallback((next: CartItem[]) => {
    setItems(next);
    writeCart(next);
  }, []);

  const addItem = useCallback(
    (item: CartItem) => {
      setItems((prev) => {
        if (prev.some((i) => i.guideId === item.guideId)) return prev;
        const next = [...prev, item];
        writeCart(next);
        return next;
      });
    },
    []
  );

  const removeItem = useCallback(
    (guideId: string) => {
      setItems((prev) => {
        const next = prev.filter((i) => i.guideId !== guideId);
        writeCart(next);
        return next;
      });
    },
    []
  );

  const clearCart = useCallback(() => {
    persist([]);
  }, [persist]);

  const replaceCart = useCallback(
    (next: CartItem[]) => {
      persist(next);
    },
    [persist]
  );

  const isInCart = useCallback(
    (guideId: string) => items.some((i) => i.guideId === guideId),
    [items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.length,
      total: items.reduce((sum, i) => sum + Number(i.price), 0),
      addItem,
      removeItem,
      clearCart,
      replaceCart,
      isInCart,
      hydrated,
    }),
    [items, addItem, removeItem, clearCart, replaceCart, isInCart, hydrated]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
}
