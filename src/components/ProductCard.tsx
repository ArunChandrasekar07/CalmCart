import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Product, startingPrice } from '../data/products';
import { useCart } from '../context/CartContext';
import { useTheme, fs } from '../theme/useTheme';
import QuantityStepper, { PackPickerButton } from './QuantityStepper';
import VariantPickerModal from './VariantPickerModal';

type Props = {
  product: Product;
  onPress: () => void;
};

export default function ProductCard({ product, onPress }: Props) {
  const { addToCart, incrementQty, decrementQty, qtyOf, totalQtyOf } = useCart();
  const { colors, fonts, radius, scale } = useTheme();
  const styles = useMemo(() => makeStyles(colors, radius, fonts, scale), [colors, radius, fonts, scale]);
  const hasVariants = !!product.variants?.length;
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <>
      <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && { opacity: 0.9 }]}>
        <View style={styles.imageBox}>
          <Text style={styles.emoji}>{product.emoji}</Text>
          {product.tag && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>{product.tag}</Text>
            </View>
          )}
        </View>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>
        <View style={styles.row}>
          <Text style={styles.price} numberOfLines={1}>
            {hasVariants ? `From ₹${startingPrice(product)}` : `₹${product.price}`}
            {!hasVariants && <Text style={styles.unit}> {product.unit}</Text>}
          </Text>
          {hasVariants ? (
            <PackPickerButton qty={totalQtyOf(product.id)} onPress={() => setPickerOpen(true)} />
          ) : (
            <QuantityStepper
              qty={qtyOf(product.id)}
              onAdd={() => addToCart(product.id)}
              onIncrement={() => incrementQty(product.id)}
              onDecrement={() => decrementQty(product.id)}
            />
          )}
        </View>
      </Pressable>
      {hasVariants && (
        <VariantPickerModal product={product} visible={pickerOpen} onClose={() => setPickerOpen(false)} />
      )}
    </>
  );
}

function makeStyles(colors: ReturnType<typeof useTheme>['colors'], radius: ReturnType<typeof useTheme>['radius'], fonts: ReturnType<typeof useTheme>['fonts'], scale: number) {
  return StyleSheet.create({
    card: { width: '48%', marginBottom: 20 },
    imageBox: {
      height: 110,
      borderRadius: radius.md,
      backgroundColor: colors.imgPlaceholder,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
      overflow: 'hidden',
    },
    emoji: { fontSize: 40 },
    tag: {
      position: 'absolute',
      top: 8,
      left: 8,
      backgroundColor: colors.accent,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: radius.pill,
    },
    tagText: { color: colors.onPrimary, fontFamily: fonts.semiBold, fontSize: fs(10, scale) },
    name: { fontFamily: fonts.semiBold, fontSize: fs(14, scale), color: colors.text, marginBottom: 2 },
    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6 },
    price: { flexShrink: 1, fontFamily: fonts.medium, fontSize: fs(13, scale), color: colors.textSecondary },
    unit: { fontFamily: fonts.regular, fontSize: fs(11, scale), color: colors.textMuted },
  });
}
