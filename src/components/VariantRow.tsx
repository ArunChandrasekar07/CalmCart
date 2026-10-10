import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Product, ProductVariant } from '../data/products';
import { useCart } from '../context/CartContext';
import { useTheme, fs } from '../theme/useTheme';
import QuantityStepper from './QuantityStepper';

// One pack-size row — "500 ml · ₹65 ₹70 (7% OFF)" with its own live
// stepper. Shared by the variant picker bottom sheet (cards) and the
// product page's inline pack-size list, so both read the exact same
// prices, discounts and "best value" call-out off one cart line.

/** The variant with the steepest MRP discount — the one worth calling out,
 * same as Swiggy's "buy extra, save more" highlight on the bigger pack. */
export function bestDeal(variants: ProductVariant[] | undefined): string | undefined {
  if (!variants?.length) return undefined;
  let bestId: string | undefined;
  let bestPct = 0;
  for (const v of variants) {
    if (!v.mrp) continue;
    const pct = 1 - v.price / v.mrp;
    if (pct > bestPct) {
      bestPct = pct;
      bestId = v.id;
    }
  }
  return bestId;
}

export default function VariantRow({
  product,
  variant,
  highlighted,
}: {
  product: Product;
  variant: ProductVariant;
  highlighted: boolean;
}) {
  const { qtyOf, addToCart, incrementQty, decrementQty } = useCart();
  const { colors, fonts, radius, scale } = useTheme();
  const styles = useMemo(() => makeStyles(colors, radius, fonts, scale), [colors, radius, fonts, scale]);
  const qty = qtyOf(product.id, variant.id);
  const discount = variant.mrp ? Math.round((1 - variant.price / variant.mrp) * 100) : 0;

  return (
    <View style={[styles.row, highlighted && styles.rowBest]}>
      <View style={{ flex: 1 }}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>{variant.label}</Text>
          {highlighted && (
            <View style={styles.bestTag}>
              <Text style={styles.bestTagText}>BEST VALUE</Text>
            </View>
          )}
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{variant.price}</Text>
          {variant.mrp && (
            <>
              <Text style={styles.mrp}>₹{variant.mrp}</Text>
              <Text style={styles.discount}>{discount}% OFF</Text>
            </>
          )}
        </View>
      </View>
      <QuantityStepper
        qty={qty}
        onAdd={() => addToCart(product.id, variant.id)}
        onIncrement={() => incrementQty(product.id, variant.id)}
        onDecrement={() => decrementQty(product.id, variant.id)}
      />
    </View>
  );
}

function makeStyles(
  colors: ReturnType<typeof useTheme>['colors'],
  radius: ReturnType<typeof useTheme>['radius'],
  fonts: ReturnType<typeof useTheme>['fonts'],
  scale: number
) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 14,
      borderRadius: radius.md,
      marginBottom: 8,
      backgroundColor: colors.card,
      gap: 12,
    },
    rowBest: { backgroundColor: colors.accentSoft },
    labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    label: { fontFamily: fonts.semiBold, fontSize: fs(15, scale), color: colors.text },
    bestTag: { backgroundColor: colors.accent, paddingHorizontal: 6, paddingVertical: 2, borderRadius: radius.sm },
    bestTagText: { fontFamily: fonts.bold, fontSize: fs(9, scale), color: colors.onPrimary, letterSpacing: 0.3 },
    priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 4 },
    price: { fontFamily: fonts.bold, fontSize: fs(15, scale), color: colors.text },
    mrp: { fontFamily: fonts.regular, fontSize: fs(12, scale), color: colors.textMuted, textDecorationLine: 'line-through' },
    discount: { fontFamily: fonts.semiBold, fontSize: fs(12, scale), color: colors.accent },
  });
}
