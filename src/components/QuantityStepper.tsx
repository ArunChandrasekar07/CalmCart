import React, { useEffect, useRef } from 'react';
import { Animated, GestureResponderEvent, Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, fs } from '../theme/useTheme';
import { useSettings } from '../context/SettingsContext';

// The "ADD" ⇄ "− qty +" pill used everywhere a product card lets you add
// straight from a list (home, recommendations) — the Swiggy/Instamart
// pattern. At qty 0 it's a flat ADD button; the moment something's in the
// cart it morphs in place into a live stepper showing the real quantity,
// so + / − edits the cart right there instead of silently stacking up
// taps with no feedback.

type Props = {
  qty: number;
  onAdd: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
};

export default function QuantityStepper({ qty, onAdd, onIncrement, onDecrement }: Props) {
  const { colors, fonts, radius, scale } = useTheme();
  const { tap } = useSettings();
  const pop = useRef(new Animated.Value(1)).current;
  const styles = useMemoStyles(colors, radius, fonts, scale);

  useEffect(() => {
    if (qty === 0) return;
    // A small pop on every quantity change is the feedback that was
    // missing — it's the difference between "did that register?" and
    // actually seeing the number move.
    pop.setValue(1.22);
    Animated.spring(pop, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 9 }).start();
  }, [qty, pop]);

  const stop = (e: GestureResponderEvent) => e.stopPropagation();

  if (qty === 0) {
    return (
      <Pressable
        onPress={(e) => {
          stop(e);
          tap();
          onAdd();
        }}
        hitSlop={8}
        style={({ pressed }) => [styles.addPill, pressed && { opacity: 0.85 }]}
      >
        <Ionicons name="add" size={15} color={colors.onPrimary} />
        <Text style={styles.addText}>ADD</Text>
      </Pressable>
    );
  }

  return (
    <Animated.View style={[styles.stepperPill, { transform: [{ scale: pop }] }]}>
      <Pressable
        onPress={(e) => {
          stop(e);
          tap();
          onDecrement();
        }}
        hitSlop={8}
        style={({ pressed }) => [styles.stepBtn, pressed && { opacity: 0.7 }]}
      >
        <Ionicons name="remove" size={14} color={colors.onPrimary} />
      </Pressable>
      <Text style={styles.qtyText}>{qty}</Text>
      <Pressable
        onPress={(e) => {
          stop(e);
          tap();
          onIncrement();
        }}
        hitSlop={8}
        style={({ pressed }) => [styles.stepBtn, pressed && { opacity: 0.7 }]}
      >
        <Ionicons name="add" size={14} color={colors.onPrimary} />
      </Pressable>
    </Animated.View>
  );
}

function useMemoStyles(
  colors: ReturnType<typeof useTheme>['colors'],
  radius: ReturnType<typeof useTheme>['radius'],
  fonts: ReturnType<typeof useTheme>['fonts'],
  scale: number
) {
  return StyleSheet.create({
    addPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
      height: 30,
      paddingHorizontal: 10,
      borderRadius: radius.pill,
      backgroundColor: colors.primary,
    },
    addText: { color: colors.onPrimary, fontFamily: fonts.bold, fontSize: fs(11, scale), letterSpacing: 0.3 },
    stepperPill: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 30,
      borderRadius: radius.pill,
      backgroundColor: colors.primary,
      paddingHorizontal: 3,
    },
    stepBtn: {
      width: 24,
      height: 24,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    qtyText: {
      minWidth: 20,
      textAlign: 'center',
      color: colors.onPrimary,
      fontFamily: fonts.semiBold,
      fontSize: fs(13, scale),
    },
  });
}
