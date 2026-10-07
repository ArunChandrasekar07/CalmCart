import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, fonts, radius } from '../../theme/colors';
import { getRecommendations } from '../../data/products';
import { useCart } from '../../context/CartContext';
import PrimaryButton from '../../components/PrimaryButton';

const FILTERS = ['Last 5 orders', 'Frequently bought', 'Seasonal picks', 'Price drops'] as const;

export default function RecommendationsScreen() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('Last 5 orders');
  const { addToCart } = useCart();
  const data = getRecommendations();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Text style={styles.title}>Recommended for you</Text>
      <Text style={styles.subtitle}>Personalized picks based on your shopping habits</Text>

      <View style={styles.filterList}>
        {FILTERS.map((f) => {
          const active = f === filter;
          return (
            <Pressable key={f} onPress={() => setFilter(f)} style={styles.filterRow}>
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
        renderItem={({ item }) => (
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
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                addToCart(item.id);
              }}
              style={styles.addBtn}
              hitSlop={8}
            >
              <Text style={styles.addBtnText}>+</Text>
            </Pressable>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  title: { fontFamily: fonts.bold, fontSize: 22, color: colors.text, paddingHorizontal: 20, paddingTop: 12 },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 13,
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
  radioActive: { borderColor: colors.dark },
  radioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.dark },
  filterText: { fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary },
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
  name: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.text },
  price: { fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  whyBtn: { height: 32, paddingHorizontal: 12 },
  addBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.dark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { color: colors.white, fontFamily: fonts.semiBold, fontSize: 16, marginTop: -1 },
});
