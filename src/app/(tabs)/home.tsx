import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { CATEGORIES, Category, Product, searchProducts } from '../../data/products';
import ProductCard from '../../components/ProductCard';
import PrimaryButton from '../../components/PrimaryButton';
import { useSettings } from '../../context/SettingsContext';
import { useTheme, fs } from '../../theme/useTheme';
import { BUILD_ID } from '../../buildInfo';

type FeedMode = 'your' | 'generic';

// "Your Feed" reorders the same catalog toward what looks personalized —
// tagged picks (Frequently bought, Price drop, ...) and High Confidence
// matches first — the way a real grocery app's home feed would rank
// around your habits. "Generic Feed" is the plain, unranked catalog.
// It's a re-sort, not a filter: switching back and forth never hides
// anything, it only reorders what's already there.
function personalizedRank(p: Product) {
  if (p.tag) return 0;
  if (p.confidence === 'High Confidence') return 1;
  if (p.confidence === 'Good Match') return 2;
  return 3;
}

export default function HomeScreen() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category | 'All'>('All');
  const [feed, setFeed] = useState<FeedMode>('your');
  const { tap } = useSettings();
  const { colors, fonts, radius, scale } = useTheme();
  const styles = useMemo(() => makeStyles(colors, radius, fonts, scale), [colors, radius, fonts, scale]);

  const results = useMemo(() => {
    const base = searchProducts(query, category);
    if (feed === 'generic') return base;
    return [...base].sort((a, b) => personalizedRank(a) - personalizedRank(b));
  }, [query, category, feed]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hi, Arun</Text>
          <Text style={styles.subGreeting}>What do you need today?</Text>
          <Text style={styles.buildTag}>build {BUILD_ID}</Text>
        </View>
        <Pressable onPress={() => router.push('/settings')} style={styles.avatar}>
          <Text style={styles.avatarText}>AR</Text>
        </Pressable>
      </View>

      <View style={styles.searchRow}>
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search groceries"
          placeholderTextColor={colors.textMuted}
          style={styles.searchInput}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </Pressable>
        )}
      </View>

      <View style={styles.feedRow}>
        {(
          [
            { key: 'your', label: 'Your Feed' },
            { key: 'generic', label: 'Generic Feed' },
          ] as const
        ).map((f) => {
          const active = feed === f.key;
          return (
            <Pressable
              key={f.key}
              onPress={() => {
                tap();
                setFeed(f.key);
              }}
              style={[styles.feedBtn, active && styles.feedBtnActive]}
            >
              <Text style={[styles.feedBtnText, active && styles.feedBtnTextActive]}>{f.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsScroll}
        contentContainerStyle={styles.chipsRow}
      >
        {(['All', ...CATEGORIES] as const).map((c) => {
          const active = category === c;
          return (
            <Pressable
              key={c}
              onPress={() => setCategory(c)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{c}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.categorySpacer} />

      {query.length > 0 && (
        <Text style={styles.resultCount}>
          {results.length} result{results.length === 1 ? '' : 's'} for "{query}"
        </Text>
      )}

      {results.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="search" size={32} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>No matches</Text>
          <Text style={styles.emptySubtitle}>Try a different search term or category.</Text>
          <PrimaryButton
            label="Clear filters"
            variant="secondary"
            style={{ marginTop: 16, paddingHorizontal: 24, alignSelf: 'center' }}
            onPress={() => {
              setQuery('');
              setCategory('All');
            }}
          />
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ProductCard product={item} onPress={() => router.push(`/product/${item.id}`)} />
          )}
        />
      )}
    </SafeAreaView>
  );
}

function makeStyles(colors: ReturnType<typeof useTheme>['colors'], radius: ReturnType<typeof useTheme>['radius'], fonts: ReturnType<typeof useTheme>['fonts'], scale: number) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 16,
    },
    greeting: { fontFamily: fonts.bold, fontSize: fs(20, scale), color: colors.text },
    subGreeting: { fontFamily: fonts.regular, fontSize: fs(13, scale), color: colors.textSecondary, marginTop: 2 },
    buildTag: { fontFamily: fonts.regular, fontSize: fs(9, scale), color: colors.textMuted, marginTop: 2, opacity: 0.6 },
    avatar: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: colors.avatar,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: { fontFamily: fonts.semiBold, fontSize: fs(13, scale), color: colors.text },
    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: colors.card,
      marginHorizontal: 20,
      borderRadius: radius.pill,
      paddingHorizontal: 16,
      height: 46,
    },
    searchInput: { flex: 1, fontFamily: fonts.regular, fontSize: fs(14, scale), color: colors.text },
    feedRow: { flexDirection: 'row', gap: 10, marginHorizontal: 20, marginTop: 14, marginBottom: 6 },
    feedBtn: {
      flex: 1,
      height: 40,
      borderRadius: radius.pill,
      backgroundColor: colors.card,
      alignItems: 'center',
      justifyContent: 'center',
    },
    feedBtnActive: { backgroundColor: colors.accent },
    feedBtnText: { fontFamily: fonts.semiBold, fontSize: fs(13, scale), color: colors.textSecondary },
    feedBtnTextActive: { color: colors.onPrimary },
    // A *horizontal* ScrollView doesn't reliably self-size its own height
    // to its content on Android — with no explicit height it can
    // mis-measure (too short, or collapsed) on the very first layout
    // pass and clip the top of its content, correcting itself only after
    // a later re-render. The earlier fixed height (76) avoided that but
    // was taller than the actual content (22 + 34 + 10 = 66), so the
    // "no explicit height" first paint and the "explicit height" later
    // paints disagreed on spacing. Setting the height to exactly match
    // the content removes the mismatch in both directions — nothing to
    // mis-measure, nothing to settle later.
    chipsScroll: { height: 66 },
    chipsRow: { paddingHorizontal: 20, paddingTop: 22, paddingBottom: 10, gap: 10 },
    // A plain, fixed-height spacer rather than relying on padding alone —
    // the chips live in their own horizontal ScrollView, and padding on
    // its content container wasn't reading as enough separation from the
    // product grid below it.
    categorySpacer: { height: 24 },
    chip: {
      // A fixed minWidth so short names (All, Fruits, Dairy) and long ones
      // (Beverages) don't read as inconsistently-sized buttons sitting
      // next to each other — short labels now get equal padding either
      // side instead of hugging the text, while long labels still grow
      // past it as needed.
      minWidth: 86,
      paddingHorizontal: 16,
      height: 34,
      borderRadius: radius.pill,
      backgroundColor: colors.card,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    chipActive: { backgroundColor: colors.primary },
    chipText: { fontFamily: fonts.medium, fontSize: fs(13, scale), color: colors.textSecondary, textAlign: 'center' },
    chipTextActive: { color: colors.onPrimary },
    resultCount: {
      fontFamily: fonts.regular,
      fontSize: fs(12, scale),
      color: colors.textMuted,
      paddingHorizontal: 20,
      marginBottom: 8,
    },
    grid: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 100 },
    empty: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 40 },
    emptyTitle: { fontFamily: fonts.semiBold, fontSize: fs(16, scale), color: colors.text, marginTop: 12 },
    emptySubtitle: {
      fontFamily: fonts.regular,
      fontSize: fs(13, scale),
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 4,
    },
  });
}
