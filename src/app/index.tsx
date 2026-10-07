import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, fonts, radius } from '../theme/colors';
import PrimaryButton from '../components/PrimaryButton';

const PREFS = [
  { key: 'textSize', icon: 'text-outline', title: 'Text Size', subtitle: 'Adjust reading comfort' },
  { key: 'contrast', icon: 'contrast-outline', title: 'Contrast', subtitle: 'Improve visibility' },
  { key: 'interaction', icon: 'hand-left-outline', title: 'Interaction Mode', subtitle: 'Tap or Voice' },
] as const;

export default function OnboardingScreen() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    textSize: true,
    contrast: false,
    interaction: false,
  });

  const toggle = (key: string) => setEnabled((p) => ({ ...p, [key]: !p[key] }));
  const enter = () => router.replace('/home');

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
        <Text style={styles.subtitle}>A quick setup so the app works the way you need it to</Text>

        {PREFS.map((p) => (
          <Pressable key={p.key} onPress={() => toggle(p.key)} style={styles.prefCard}>
            <View style={styles.prefIcon}>
              <Ionicons name={p.icon as any} size={20} color={colors.text} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.prefTitle}>{p.title}</Text>
              <Text style={styles.prefSubtitle}>{p.subtitle}</Text>
            </View>
            <View style={[styles.toggle, enabled[p.key] && styles.toggleOn]}>
              <View style={[styles.knob, enabled[p.key] && styles.knobOn]} />
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

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingBottom: 40 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  logo: { fontFamily: fonts.bold, fontSize: 18, color: colors.text },
  skip: { fontFamily: fonts.medium, fontSize: 13, color: colors.textSecondary },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 24 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border },
  dotActive: { backgroundColor: colors.dark, width: 18 },
  hero: {
    height: 200,
    borderRadius: radius.lg,
    backgroundColor: colors.imgPlaceholder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: { fontFamily: fonts.bold, fontSize: 24, color: colors.text, marginBottom: 8 },
  subtitle: { fontFamily: fonts.regular, fontSize: 14, color: colors.textSecondary, marginBottom: 24, lineHeight: 20 },
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
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prefTitle: { fontFamily: fonts.semiBold, fontSize: 15, color: colors.text },
  prefSubtitle: { fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  toggle: { width: 42, height: 24, borderRadius: 12, backgroundColor: colors.border, padding: 2 },
  toggleOn: { backgroundColor: colors.dark },
  knob: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.white },
  knobOn: { transform: [{ translateX: 18 }] },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 18, marginBottom: 32 },
  loginText: { fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary },
  loginLink: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.text },
  whyTitle: { fontFamily: fonts.semiBold, fontSize: 16, color: colors.text, marginBottom: 14 },
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
  featureTitle: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.text, marginBottom: 2 },
  featureSub: { fontFamily: fonts.regular, fontSize: 10, color: colors.textMuted },
});
