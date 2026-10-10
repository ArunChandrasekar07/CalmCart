import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { getProduct, PRODUCTS } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';
import PrimaryButton from '../../components/PrimaryButton';
import QuantityStepper from '../../components/QuantityStepper';
import { useTheme, fs } from '../../theme/useTheme';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = getProduct(id);
  const { addToCart, incrementQty, decrementQty, itemsWithDetails, itemCount, total } = useCart();
  const { tap } = useSettings();
  // The stepper below IS the cart line for this product — there's no
  // separate "how many to add" number anymore. That second number was the
  // bug: picking a quantity here only ever added on top of whatever was
  // already in the cart (and reset to 1 every time you reopened the page),
  // so the product page and the cart could drift out of sync with each
  // other. Now there's exactly one number, shared everywhere.
  const qty = itemsWithDetails.find((i) => i.product.id === id)?.qty ?? 0;
  const { colors, fonts, radius, scale } = useTheme();
  const styles = useMemo(() => makeStyles(colors, radius, fonts, scale), [colors, radius, fonts, scale]);

  if (!product) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={{ padding: 20, color: colors.text }}>Product not found.</Text>
      </SafeAreaView>
    );
  }

  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>
        <View style={styles.topBarActions}>
          <Pressable style={styles.iconBtn}>
            <Ionicons name="share-outline" size={20} color={colors.text} />
          </Pressable>
          <Pressable style={styles.iconBtn}>
            <Ionicons name="bookmark-outline" size={20} color={colors.text} />
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>{product.emoji}</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>
            ₹{product.price} <Text style={styles.unit}>{product.unit}</Text>
          </Text>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>{product.confidence}</Text>
            <Ionicons name="checkmark-circle-outline" size={16} color={colors.accent} />
          </View>

          <View style={styles.stepperRow}>
            <QuantityStepper
              qty={qty}
              onAdd={() => addToCart(product.id)}
              onIncrement={() => incrementQty(product.id)}
              onDecrement={() => decrementQty(product.id)}
            />
            {qty > 0 && <Text style={styles.inCart}>in your cart</Text>}
          </View>

          <Text style={styles.description}>{product.description}</Text>

          {related.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>You might also like</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 14 }}>
                {related.map((p) => (
                  <Pressable
                    key={p.id}
                    onPress={() => router.push(`/product/${p.id}`)}
                    style={styles.relatedCard}
                  >
                    <View style={styles.relatedImg}>
                      <Text style={{ fontSize: 28 }}>{p.emoji}</Text>
                    </View>
                    <Text style={styles.relatedName}>{p.name}</Text>
                    <Text style={styles.relatedPrice}>₹{p.price}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label={qty === 0 ? `Add to Cart — ₹${product.price}` : `Go to Cart — ${itemCount} item${itemCount === 1 ? '' : 's'} · ₹${total}`}
          onPress={() => {
            if (qty === 0) {
              tap();
              addToCart(product.id);
            } else {
              router.push('/cart');
            }
          }}
          haptics={false}
        />
      </View>
    </SafeAreaView>
  );
}

function makeStyles(colors: ReturnType<typeof useTheme>['colors'], radius: ReturnType<typeof useTheme>['radius'], fonts: ReturnType<typeof useTheme>['fonts'], scale: number) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    topBar: {
      position: 'absolute',
      top: 50,
      left: 0,
      right: 0,
      zIndex: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
    },
    topBarActions: { flexDirection: 'row', gap: 8 },
    iconBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.overlay,
      alignItems: 'center',
      justifyContent: 'center',
    },
    hero: {
      height: 320,
      backgroundColor: colors.imgPlaceholder,
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroEmoji: { fontSize: 96 },
    content: { padding: 20 },
    name: { fontFamily: fonts.bold, fontSize: fs(26, scale), color: colors.text },
    price: { fontFamily: fonts.medium, fontSize: fs(16, scale), color: colors.textSecondary, marginTop: 4 },
    unit: { fontSize: fs(13, scale), color: colors.textMuted },
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.accentSoft,
      borderRadius: radius.md,
      paddingHorizontal: 16,
      height: 44,
      marginTop: 16,
    },
    badgeText: { fontFamily: fonts.semiBold, fontSize: fs(13, scale), color: colors.accent },
    stepperRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 20 },
    inCart: { fontFamily: fonts.regular, fontSize: fs(12, scale), color: colors.textMuted },
    description: {
      fontFamily: fonts.regular,
      fontSize: fs(14, scale),
      color: colors.textSecondary,
      lineHeight: fs(21, scale),
      marginTop: 20,
    },
    sectionTitle: { fontFamily: fonts.semiBold, fontSize: fs(16, scale), color: colors.text, marginTop: 28, marginBottom: 14 },
    relatedCard: { width: 120 },
    relatedImg: {
      height: 90,
      borderRadius: radius.md,
      backgroundColor: colors.imgPlaceholder,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 6,
    },
    relatedName: { fontFamily: fonts.medium, fontSize: fs(12, scale), color: colors.text },
    relatedPrice: { fontFamily: fonts.regular, fontSize: fs(11, scale), color: colors.textSecondary },
    footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.bg,
      padding: 20,
      paddingBottom: 28,
      borderTopWidth: 1,
      borderTopColor: colors.divider,
    },
  });
}
