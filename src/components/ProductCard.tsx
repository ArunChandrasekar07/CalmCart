import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radius } from '../theme/colors';
import { Product } from '../data/products';
import { useCart } from '../context/CartContext';

type Props = {
  product: Product;
  onPress: () => void;
};

export default function ProductCard({ product, onPress }: Props) {
  const { addToCart } = useCart();

  return (
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
        <Text style={styles.price}>
          ₹{product.price}
          <Text style={styles.unit}> {product.unit}</Text>
        </Text>
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            addToCart(product.id);
          }}
          hitSlop={8}
          style={styles.addBtn}
        >
          <Ionicons name="add" size={18} color={colors.white} />
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
  tagText: { color: colors.white, fontFamily: fonts.semiBold, fontSize: 10 },
  name: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.text, marginBottom: 2 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  price: { fontFamily: fonts.medium, fontSize: 13, color: colors.textSecondary },
  unit: { fontFamily: fonts.regular, fontSize: 11, color: colors.textMuted },
  addBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.dark,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
