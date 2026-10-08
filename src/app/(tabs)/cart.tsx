import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';
import PrimaryButton from '../../components/PrimaryButton';
import { useTheme, fs } from '../../theme/useTheme';

export default function CartScreen() {
  const { itemsWithDetails, incrementQty, decrementQty, removeFromCart, subtotal, deliveryFee, discount, total, clearCart } =
    useCart();
  const { tap } = useSettings();
  const [promo, setPromo] = useState('');
  const [placing, setPlacing] = useState(false);
  const { colors, fonts, radius, scale } = useTheme();
  const styles = useMemo(() => makeStyles(colors, radius, fonts, scale), [colors, radius, fonts, scale]);

  const handleCheckout = () => {
    tap();
    setPlacing(true);
    setTimeout(() => {
      setPlacing(false);
      Alert.alert('Order placed! 🎉', `Your order of ₹${total} will arrive in ~30 minutes.`, [
        {
          text: 'OK',
          onPress: () => {
            clearCart();
            router.push('/home');
          },
        },
      ]);
    }, 900);
  };

  if (itemsWithDetails.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Text style={styles.title}>Your Cart</Text>
        <View style={styles.emptyWrap}>
          <Ionicons name="cart-outline" size={48} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Add a few groceries and they'll show up here.</Text>
          <PrimaryButton label="Start shopping" style={{ marginTop: 20 }} onPress={() => router.push('/home')} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Text style={styles.title}>Your Cart</Text>
      <FlatList
        data={itemsWithDetails}
        keyExtractor={(item) => item.product.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <View style={styles.thumb}>
              <Text style={{ fontSize: 24 }}>{item.product.emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>
                {item.product.name} — Qty {item.qty}
              </Text>
              <Text style={styles.itemSub}>₹{item.product.price} each</Text>
            </View>
            <View style={styles.stepper}>
              <Pressable
                onPress={() => {
                  tap();
                  decrementQty(item.product.id);
                }}
                style={styles.stepBtn}
              >
                <Text style={styles.stepSymbol}>−</Text>
              </Pressable>
              <Text style={styles.stepQty}>{item.qty}</Text>
              <Pressable
                onPress={() => {
                  tap();
                  incrementQty(item.product.id);
                }}
                style={styles.stepBtn}
              >
                <Text style={styles.stepSymbol}>+</Text>
              </Pressable>
            </View>
            <Text style={styles.lineTotal}>₹{item.lineTotal}</Text>
            <Pressable
              onPress={() => {
                tap();
                removeFromCart(item.product.id);
              }}
              hitSlop={8}
              style={{ marginLeft: 8 }}
            >
              <Ionicons name="close-circle-outline" size={20} color={colors.textMuted} />
            </Pressable>
          </View>
        )}
        ListFooterComponent={
          <View>
            <View style={styles.promoRow}>
              <TextInput
                value={promo}
                onChangeText={setPromo}
                placeholder="Promo code"
                placeholderTextColor={colors.textMuted}
                style={styles.promoInput}
              />
              <PrimaryButton
                label="Apply"
                variant="secondary"
                style={styles.promoBtn}
                onPress={() => Alert.alert('Promo', promo ? `"${promo}" applied where valid.` : 'Enter a code first.')}
              />
            </View>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Order Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>₹{subtotal}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery</Text>
                <Text style={styles.summaryValue}>₹{deliveryFee}</Text>
              </View>
              {discount > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: colors.accent }]}>Discount</Text>
                  <Text style={[styles.summaryValue, { color: colors.accent }]}>−₹{discount}</Text>
                </View>
              )}
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>₹{total}</Text>
              </View>
              <Text style={styles.eta}>
                <Ionicons name="time-outline" size={12} color={colors.textMuted} /> Estimated delivery: ~30 minutes
              </Text>
            </View>
          </View>
        }
      />

      <View style={styles.footer}>
        <PrimaryButton
          label={`Proceed to Checkout — ₹${total}`}
          loading={placing}
          onPress={handleCheckout}
        />
      </View>
    </SafeAreaView>
  );
}

function makeStyles(colors: ReturnType<typeof useTheme>['colors'], radius: ReturnType<typeof useTheme>['radius'], fonts: ReturnType<typeof useTheme>['fonts'], scale: number) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    title: { fontFamily: fonts.bold, fontSize: fs(22, scale), color: colors.text, paddingHorizontal: 20, paddingTop: 12, marginBottom: 12 },
    list: { paddingHorizontal: 20, paddingBottom: 140 },
    itemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      padding: 10,
      marginBottom: 12,
    },
    thumb: {
      width: 48,
      height: 48,
      borderRadius: radius.sm,
      backgroundColor: colors.imgPlaceholder,
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemName: { fontFamily: fonts.semiBold, fontSize: fs(13, scale), color: colors.text },
    itemSub: { fontFamily: fonts.regular, fontSize: fs(11, scale), color: colors.textSecondary, marginTop: 2 },
    stepper: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    stepBtn: {
      width: 26,
      height: 26,
      borderRadius: 13,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepSymbol: { fontFamily: fonts.semiBold, fontSize: fs(14, scale), color: colors.text },
    stepQty: { fontFamily: fonts.semiBold, fontSize: fs(13, scale), color: colors.text, minWidth: 16, textAlign: 'center' },
    lineTotal: { fontFamily: fonts.semiBold, fontSize: fs(13, scale), color: colors.text, marginLeft: 6 },
    promoRow: { flexDirection: 'row', gap: 10, marginTop: 4, marginBottom: 16 },
    promoInput: {
      flex: 1,
      height: 44,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.sm,
      paddingHorizontal: 14,
      fontFamily: fonts.regular,
      fontSize: fs(13, scale),
      color: colors.text,
    },
    promoBtn: { height: 44, paddingHorizontal: 20 },
    summaryCard: { backgroundColor: colors.card, borderRadius: radius.md, padding: 18 },
    summaryTitle: { fontFamily: fonts.semiBold, fontSize: fs(16, scale), color: colors.text, marginBottom: 12 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    summaryLabel: { fontFamily: fonts.regular, fontSize: fs(13, scale), color: colors.text },
    summaryValue: { fontFamily: fonts.medium, fontSize: fs(13, scale), color: colors.text },
    divider: { height: 1, backgroundColor: colors.divider, marginVertical: 8 },
    totalLabel: { fontFamily: fonts.bold, fontSize: fs(16, scale), color: colors.text },
    totalValue: { fontFamily: fonts.bold, fontSize: fs(16, scale), color: colors.text },
    eta: { fontFamily: fonts.regular, fontSize: fs(11, scale), color: colors.textMuted, marginTop: 12 },
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
    emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
    emptyTitle: { fontFamily: fonts.semiBold, fontSize: fs(16, scale), color: colors.text, marginTop: 12 },
    emptySubtitle: { fontFamily: fonts.regular, fontSize: fs(13, scale), color: colors.textSecondary, textAlign: 'center', marginTop: 4 },
  });
}
