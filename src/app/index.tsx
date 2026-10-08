import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme, fs } from '../theme/useTheme';
import { useSettings } from '../context/SettingsContext';
import PrimaryButton from '../components/PrimaryButton';

const PREFS = [
  {
    key: 'largeText' as const,
    icon: 'text-outline',
    title: 'Text Size',
    subtitle: 'Larger type across the whole app',
  },
  {
    key: 'highContrast' as const,
    icon: 'contrast-outline',
    title: 'Contrast',
    subtitle: 'Darker borders & text for visibility',
  },
  {
    key: 'hapticFeedback' as const,
    icon: 'hand-left-outline',
    title: 'Interaction Mode',
    subtitle: 'Haptic buzz confirms every tap',
  },
];

export default function OnboardingScreen() {
  const { colors, fonts, radius, scale } = useTheme();
  const settings = useSettings();
  const styles = useMemo(() => makeStyles(colors, radius, fonts, scale), [colors, radius, fonts, scale]);

  const setters: Record<string, (v: boolean) => void> = {
    largeText: settings.setLargeText,
    highContrast: settings.setHighContrast,
    hapticFeedback: settings.setHapticFeedback,
  };
  const values: Record<string, boolean> = {
    largeText: settings.largeText,
    highContrast: settings.highContrast,
    hapticFeedback: settings.hapticFeedback,
  };

  const toggle = (key: string) => {
    settings.tap();
    setters[key](!values[key]);
  };
  const enter = () => {
    settings.tap();
    router.replace('/home');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <Text style={styles.logo}>CalmCart</Text>
          <Pressable onPress={enter}>
            <Text style={styles.skip}>Skip</Text>
          </Pressable>
        </View>

        <View style={styles.dots}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        <View style={styles.hero}>
          <Ionicons name="basket-outline" size={64} color={colors.textMuted} />
        </View>

        <Text style={styles.title}>Let's set up CalmCart for you</Text>
        <Text style={styles.subtitle}>
          These change the app immediately — and you can revisit them anytime from Settings.
        </Text>

        {PREFS.map((p) => (
          <Pressable key={p.key} onPress={() => toggle(p.key)} style={styles.prefCard}>
            <View style={styles.prefIcon}>
              <Ionicons name={p.icon as any} size={20} color={colors.text} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.prefTitle}>{p.title}</Text>
              <Text style={styles.prefSubtitle}>{p.subtitle}</Text>
            </View>
            <View style={[styles.toggle, values[p.key] && styles.toggleOn]}>
              <View style={[styles.knob, values[p.key] && styles.knobOn]} />
            </View>
          </Pressable>
        ))}

        <PrimaryButton label="Continue" style={{ marginTop: 28 }} onPress={enter} />

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <Pressable onPress={enter}>
            <Text style={styles.loginLink}>Log in</Text>
          </Pressable>
        </View>

        <Text style={styles.whyTitle}>Why CalmCart?</Text>
        <View style={styles.featureRow}>
          {[
            ['flash-outline', 'Fast Delivery', 'Under 30 minutes'],
            ['leaf-outline', 'Fresh Products', 'Sourced locally'],
            ['shield-checkmark-outline', 'Secure Payments', 'Always protected'],
          ].map(([icon, title, sub]) => (
            <View key={title} style={styles.feature}>
              <View style={styles.featureIcon}>
                <Ionicons name={icon as any} size={18} color={colors.text} />
              </View>
              <Text style={styles.featureTitle}>{title}</Text>
              <Text style={styles.featureSub}>{sub}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(colors: ReturnType<typeof useTheme>['colors'], radius: ReturnType<typeof useTheme>['radius'], fonts: ReturnType<typeof useTheme>['fonts'], scale: number) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    content: { padding: 20, paddingBottom: 40 },
    topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    logo: { fontFamily: fonts.bold, fontSize: fs(18, scale), color: colors.text },
    skip: { fontFamily: fonts.medium, fontSize: fs(13, scale), color: colors.textSecondary },
    dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 24 },
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border },
    dotActive: { backgroundColor: colors.primary, width: 18 },
    hero: {
      height: 200,
      borderRadius: radius.lg,
      backgroundColor: colors.imgPlaceholder,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
    },
    title: { fontFamily: fonts.bold, fontSize: fs(24, scale), color: colors.text, marginBottom: 8 },
    subtitle: {
      fontFamily: fonts.regular,
      fontSize: fs(14, scale),
      color: colors.textSecondary,
      marginBottom: 24,
      lineHeight: fs(20, scale),
    },
    prefCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: radius.md,
      padding: 14,
      marginBottom: 12,
      gap: 12,
    },
    prefIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surfaceRaised,
      alignItems: 'center',
      justifyContent: 'center',
    },
    prefTitle: { fontFamily: fonts.semiBold, fontSize: fs(15, scale), color: colors.text },
    prefSubtitle: { fontFamily: fonts.regular, fontSize: fs(12, scale), color: colors.textSecondary, marginTop: 2 },
    toggle: { width: 42, height: 24, borderRadius: 12, backgroundColor: colors.border, padding: 2 },
    toggleOn: { backgroundColor: colors.primary },
    knob: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.bg },
    knobOn: { transform: [{ translateX: 18 }] },
    loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 18, marginBottom: 32 },
    loginText: { fontFamily: fonts.regular, fontSize: fs(13, scale), color: colors.textSecondary },
    loginLink: { fontFamily: fonts.semiBold, fontSize: fs(13, scale), color: colors.text },
    whyTitle: { fontFamily: fonts.semiBold, fontSize: fs(16, scale), color: colors.text, marginBottom: 14 },
    featureRow: { flexDirection: 'row', justifyContent: 'space-between' },
    feature: { width: '31%', alignItems: 'flex-start' },
    featureIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
    },
    featureTitle: { fontFamily: fonts.semiBold, fontSize: fs(12, scale), color: colors.text, marginBottom: 2 },
    featureSub: { fontFamily: fonts.regular, fontSize: fs(10, scale), color: colors.textMuted },
  });
}
