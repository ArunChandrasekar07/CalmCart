import React, { createContext, useContext, useEffect, useMemo, useRef, useState, PropsWithChildren } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PRODUCTS, Product } from '../data/products';

// A cart line is keyed by product + which pack size was chosen (undefined
// variantId = the product has no pack sizes, or none was picked). "500 ml"
// and "1 L" of the same oat milk are deliberately two different lines —
// they're different prices and different physical items.
type CartLine = { productId: string; variantId?: string; qty: number };

type CartItemDetails = {
  product: Product;
  variantId?: string;
  variantLabel?: string;
  qty: number;
  unitPrice: number;
  unitMrp?: number;
  lineTotal: number;
};

type CartContextValue = {
  lines: CartLine[];
  addToCart: (productId: string, variantId?: string, qty?: number) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  incrementQty: (productId: string, variantId?: string) => void;
  decrementQty: (productId: string, variantId?: string) => void;
  clearCart: () => void;
  /** Quantity of one exact product+variant line (what a stepper shows). */
  qtyOf: (productId: string, variantId?: string) => number;
  /** Total quantity across every pack size of a product (what a card's
   * "N in cart" badge shows when the product has several variants). */
  totalQtyOf: (productId: string) => number;
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  itemsWithDetails: CartItemDetails[];
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const DELIVERY_FEE = 20;
const STORAGE_KEY = '@calmcart/cart/v2';

const sameLine = (l: CartLine, productId: string, variantId?: string) =>
  l.productId === productId && l.variantId === variantId;

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

  const addToCart = (productId: string, variantId?: string, qty: number = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => sameLine(l, productId, variantId));
      if (existing) {
        return prev.map((l) => (sameLine(l, productId, variantId) ? { ...l, qty: l.qty + qty } : l));
      }
      return [...prev, { productId, variantId, qty }];
    });
  };

  const removeFromCart = (productId: string, variantId?: string) => {
    setLines((prev) => prev.filter((l) => !sameLine(l, productId, variantId)));
  };

  const incrementQty = (productId: string, variantId?: string) => {
    setLines((prev) =>
      prev.map((l) => (sameLine(l, productId, variantId) ? { ...l, qty: l.qty + 1 } : l))
    );
  };

  const decrementQty = (productId: string, variantId?: string) => {
    setLines((prev) =>
      prev
        .map((l) => (sameLine(l, productId, variantId) ? { ...l, qty: l.qty - 1 } : l))
        .filter((l) => l.qty > 0)
    );
  };

  const clearCart = () => setLines([]);

  const qtyOf = (productId: string, variantId?: string) =>
    lines.find((l) => sameLine(l, productId, variantId))?.qty ?? 0;

  const totalQtyOf = (productId: string) =>
    lines.filter((l) => l.productId === productId).reduce((sum, l) => sum + l.qty, 0);

  const itemsWithDetails = useMemo(
    () =>
      lines
        .map((l): CartItemDetails | null => {
          const product = PRODUCTS.find((p) => p.id === l.productId);
          if (!product) return null;
          const variant = l.variantId ? product.variants?.find((v) => v.id === l.variantId) : undefined;
          const unitPrice = variant?.price ?? product.price;
          return {
            product,
            variantId: l.variantId,
            variantLabel: variant?.label,
            qty: l.qty,
            unitPrice,
            unitMrp: variant?.mrp,
            lineTotal: unitPrice * l.qty,
          };
        })
        .filter((x): x is CartItemDetails => x !== null),
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
    qtyOf,
    totalQtyOf,
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
