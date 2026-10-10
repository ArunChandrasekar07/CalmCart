import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { getRecommendations } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';
import PrimaryButton from '../../components/PrimaryButton';
import QuantityStepper from '../../components/QuantityStepper';
import { useTheme, fs } from '../../theme/useTheme';

const FILTERS = ['Last 5 orders', 'Frequently bought', 'Seasonal picks', 'Price drops'] as const;

export default function RecommendationsScreen() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('Last 5 orders');
  const { itemsWithDetails, addToCart, incrementQty, decrementQty } = useCart();
  const { tap } = useSettings();
  const data = getRecommendations();
  const { colors, fonts, radius, scale } = useTheme();
  const styles = useMemo(() => makeStyles(colors, radius, fonts, scale), [colors, radius, fonts, scale]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Text style={styles.title}>Recommended for you</Text>
      <Text style={styles.subtitle}>Personalized picks based on your shopping habits</Text>

      <View style={styles.filterList}>
        {FILTERS.map((f) => {
          const active = f === filter;
          return (
            <Pressable
              key={f}
              onPress={() => {
                tap();
                setFilter(f);
              }}
              style={styles.filterRow}
            >
              <View style={[styles.radio, active && styles.radioActive]}>
                {active && <View style={styles.radioDot} />}
              </View>
              <Text style={[styles.filterText, active && styles.filterTextActive]}>{f}</Text>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const qty = itemsWithDetails.find((i) => i.product.id === item.id)?.qty ?? 0;
          return (
            <Pressable onPress={() => router.push(`/product/${item.id}`)} style={styles.card}>
              <View style={styles.thumb}>
                <Text style={{ fontSize: 26 }}>{item.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>₹{item.price}</Text>
              </View>
              <PrimaryButton
                label="Why this?"
                variant="secondary"
                style={styles.whyBtn}
                onPress={() => router.push(`/product/${item.id}`)}
              />
              <QuantityStepper
                qty={qty}
                onAdd={() => addToCart(item.id)}
                onIncrement={() => incrementQty(item.id)}
                onDecrement={() => decrementQty(item.id)}
              />
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}

function makeStyles(colors: ReturnType<typeof useTheme>['colors'], radius: ReturnType<typeof useTheme>['radius'], fonts: ReturnType<typeof useTheme>['fonts'], scale: number) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    title: { fontFamily: fonts.bold, fontSize: fs(22, scale), color: colors.text, paddingHorizontal: 20, paddingTop: 12 },
    subtitle: {
      fontFamily: fonts.regular,
      fontSize: fs(13, scale),
      color: colors.textSecondary,
      paddingHorizontal: 20,
      marginTop: 4,
    },
    filterList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 20,
      marginTop: 16,
      marginBottom: 8,
      gap: 16,
    },
    filterRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    radio: {
      width: 16,
      height: 16,
      borderRadius: 8,
      borderWidth: 1.5,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioActive: { borderColor: colors.primary },
    radioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
    filterText: { fontFamily: fonts.regular, fontSize: fs(12, scale), color: colors.textSecondary },
    filterTextActive: { fontFamily: fonts.semiBold, color: colors.text },
    list: { padding: 20, paddingBottom: 100 },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: colors.card,
      borderRadius: radius.md,
      padding: 12,
      marginBottom: 14,
    },
    thumb: {
      width: 56,
      height: 56,
      borderRadius: radius.sm,
      backgroundColor: colors.imgPlaceholder,
      alignItems: 'center',
      justifyContent: 'center',
    },
    name: { fontFamily: fonts.semiBold, fontSize: fs(14, scale), color: colors.text },
    price: { fontFamily: fonts.regular, fontSize: fs(12, scale), color: colors.textSecondary, marginTop: 2 },
    whyBtn: { height: 32, paddingHorizontal: 12 },
  });
}
