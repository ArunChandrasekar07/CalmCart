import React, { createContext, useContext, useEffect, useMemo, useRef, useState, PropsWithChildren } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PRODUCTS, Product } from '../data/products';

type CartLine = { productId: string; qty: number };

type CartContextValue = {
  lines: CartLine[];
  addToCart: (productId: string, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  incrementQty: (productId: string) => void;
  decrementQty: (productId: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  itemsWithDetails: Array<{ product: Product; qty: number; lineTotal: number }>;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const DELIVERY_FEE = 20;
const STORAGE_KEY = '@calmcart/cart/v1';

export function CartProvider({ children }: PropsWithChildren) {
  // Starts empty — no demo items. Real apps don't open with someone else's
  // groceries already sitting in your bag.
  const [lines, setLines] = useState<CartLine[]>([]);
  const loadedRef = useRef(false);

  // Restore whatever was in the cart last time the app was open, so closing
  // and reopening the app never discards it.
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) setLines(parsed);
        }
      })
      .catch(() => {})
      .finally(() => {
        loadedRef.current = true;
      });
  }, []);

  // Persist on every change, once the initial restore has happened (so we
  // never overwrite the saved cart with the empty initial state before it's
  // had a chance to load).
  useEffect(() => {
    if (!loadedRef.current) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(lines)).catch(() => {});
  }, [lines]);

  const addToCart = (productId: string, qty: number = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.productId === productId);
      if (existing) {
        return prev.map((l) => (l.productId === productId ? { ...l, qty: l.qty + qty } : l));
      }
      return [...prev, { productId, qty }];
    });
  };

  const removeFromCart = (productId: string) => {
    setLines((prev) => prev.filter((l) => l.productId !== productId));
  };

  const incrementQty = (productId: string) => {
    setLines((prev) => prev.map((l) => (l.productId === productId ? { ...l, qty: l.qty + 1 } : l)));
  };

  const decrementQty = (productId: string) => {
    setLines((prev) =>
      prev
        .map((l) => (l.productId === productId ? { ...l, qty: l.qty - 1 } : l))
        .filter((l) => l.qty > 0)
    );
  };

  const clearCart = () => setLines([]);

  const itemsWithDetails = useMemo(
    () =>
      lines
        .map((l) => {
          const product = PRODUCTS.find((p) => p.id === l.productId);
          if (!product) return null;
          return { product, qty: l.qty, lineTotal: product.price * l.qty };
        })
        .filter((x): x is { product: Product; qty: number; lineTotal: number } => x !== null),
    [lines]
  );

  const itemCount = lines.reduce((sum, l) => sum + l.qty, 0);
  const subtotal = itemsWithDetails.reduce((sum, i) => sum + i.lineTotal, 0);
  const discount = subtotal > 200 ? 15 : 0;
  const deliveryFee = itemCount > 0 ? DELIVERY_FEE : 0;
  const total = Math.max(0, subtotal + deliveryFee - discount);

  const value: CartContextValue = {
    lines,
    addToCart,
    removeFromCart,
    incrementQty,
    decrementQty,
    clearCart,
    itemCount,
    subtotal,
    deliveryFee,
    discount,
    total,
    itemsWithDetails,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
