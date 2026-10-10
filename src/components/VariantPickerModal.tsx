import React, { useMemo } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../data/products';
import { useTheme, fs } from '../theme/useTheme';
import VariantRow, { bestDeal } from './VariantRow';

// The "choose a pack size" bottom sheet — Swiggy Instamart/Blinkit's
// pattern for anything sold by weight or volume. Each row is its own cart
// line with its own live stepper, so picking 500 ml and then also adding
// 1 L is two independent, correctly-priced lines, not one confused qty.

type Props = {
  product: Product | null;
  visible: boolean;
  onClose: () => void;
};

export default function VariantPickerModal({ product, visible, onClose }: Props) {
  const { colors, fonts, radius, scale } = useTheme();
  const styles = useMemo(() => makeStyles(colors, radius, fonts, scale), [colors, radius, fonts, scale]);

  if (!product) return null;
  const variants = product.variants ?? [];
  const bestId = bestDeal(variants);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <SafeAreaView style={styles.sheet} edges={['bottom']}>
        <View style={styles.handle} />
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{product.name}</Text>
            <Text style={styles.subtitle}>Select a pack size</Text>
          </View>
          <Pressable onPress={onClose} hitSlop={10} style={styles.closeBtn}>
            <Ionicons name="close" size={20} color={colors.text} />
          </Pressable>
        </View>

        {variants.map((v) => (
          <VariantRow key={v.id} product={product} variant={v} highlighted={v.id === bestId} />
        ))}
      </SafeAreaView>
    </Modal>
  );
}

function makeStyles(
  colors: ReturnType<typeof useTheme>['colors'],
  radius: ReturnType<typeof useTheme>['radius'],
  fonts: ReturnType<typeof useTheme>['fonts'],
  scale: number
) {
  return StyleSheet.create({
    backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
    sheet: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: radius.lg,
      borderTopRightRadius: radius.lg,
      paddingHorizontal: 10,
      paddingBottom: 12,
    },
    handle: {
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.border,
      alignSelf: 'center',
      marginTop: 10,
      marginBottom: 8,
    },
    header: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 10, paddingHorizontal: 10 },
    title: { fontFamily: fonts.bold, fontSize: fs(18, scale), color: colors.text },
    subtitle: { fontFamily: fonts.regular, fontSize: fs(12, scale), color: colors.textSecondary, marginTop: 2 },
    closeBtn: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: colors.card,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}
