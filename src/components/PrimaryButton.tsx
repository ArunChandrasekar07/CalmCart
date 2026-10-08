import React, { useMemo } from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, StyleProp, ActivityIndicator } from 'react-native';
import { useTheme } from '../theme/useTheme';
import { fs } from '../theme/useTheme';
import { useSettings } from '../context/SettingsContext';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary';
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  loading?: boolean;
  /** Set false for buttons that already fire their own haptic (rare). */
  haptics?: boolean;
};

export default function PrimaryButton({
  label,
  onPress,
  variant = 'primary',
  style,
  disabled,
  loading,
  haptics = true,
}: Props) {
  const { colors, fonts, radius, scale } = useTheme();
  const { tap } = useSettings();
  const styles = useMemo(() => makeStyles(colors, radius, fonts, scale), [colors, radius, fonts, scale]);
  const isPrimary = variant === 'primary';

  const handlePress = () => {
    if (haptics) tap();
    onPress?.();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        isPrimary ? styles.primary : styles.secondary,
        pressed && { opacity: 0.85 },
        (disabled || loading) && { opacity: 0.5 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.onPrimary : colors.text} />
      ) : (
        <Text style={[styles.label, isPrimary ? styles.labelPrimary : styles.labelSecondary]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

function makeStyles(colors: ReturnType<typeof useTheme>['colors'], radius: ReturnType<typeof useTheme>['radius'], fonts: ReturnType<typeof useTheme>['fonts'], scale: number) {
  return StyleSheet.create({
    base: {
      height: 52,
      borderRadius: radius.sm,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    primary: { backgroundColor: colors.primary },
    secondary: { backgroundColor: colors.card },
    label: { fontFamily: fonts.semiBold, fontSize: fs(15, scale) },
    labelPrimary: { color: colors.onPrimary },
    labelSecondary: { color: colors.text },
  });
}
