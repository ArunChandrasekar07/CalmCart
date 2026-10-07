import React, { createContext, useContext, useMemo, useState, PropsWithChildren } from 'react';
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

export function CartProvider({ children }: PropsWithChildren) {
  const [lines, setLines] = useState<CartLine[]>([
    { productId: 'oat-milk', qty: 2 },
    { productId: 'bread', qty: 1 },
    { productId: 'eggs', qty: 1 },
  ]);

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
