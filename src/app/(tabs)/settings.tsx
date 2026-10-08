import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '../../context/SettingsContext';
import { useTheme, fs } from '../../theme/useTheme';

const LINKS = [
  { icon: 'logo-github', label: 'GitHub', value: 'ArunChandrasekar07', url: 'https://github.com/ArunChandrasekar07' },
  { icon: 'globe-outline', label: 'Portfolio', value: 'arunc.vercel.app', url: 'https://arunc.vercel.app' },
  { icon: 'code-slash-outline', label: 'LeetCode', value: 'ArunCodez', url: 'https://leetcode.com/ArunCodez' },
] as const;

export default function SettingsScreen() {
  const {
    darkMode,
    setDarkMode,
    largeText,
    setLargeText,
    highContrast,
    setHighContrast,
    hapticFeedback,
    setHapticFeedback,
    pushNotifications,
    setPushNotifications,
    tap,
  } = useSettings();
  const { colors, fonts, radius, scale } = useTheme();
  const styles = useMemo(() => makeStyles(colors, radius, fonts, scale), [colors, radius, fonts, scale]);

  const toggleRow = (
    icon: string,
    label: string,
    value: boolean,
    onChange: (v: boolean) => void,
    isLast = false
  ) => (
    <View key={label} style={[styles.linkRow, !isLast && styles.linkRowBorder]}>
      <View style={styles.linkIcon}>
        <Ionicons name={icon as any} size={18} color={colors.text} />
      </View>
      <Text style={[styles.linkLabel, { flex: 1 }]}>{label}</Text>
      <Switch
        value={value}
        onValueChange={(v) => {
          tap();
          onChange(v);
        }}
        trackColor={{ true: colors.primary, false: colors.border }}
        thumbColor={colors.bg}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Settings</Text>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AR</Text>
          </View>
          <Text style={styles.name}>Arun C.</Text>
          <Text style={styles.role}>Integrated M.Tech Software Engineering · VIT Vellore</Text>
          <Text style={styles.email}>arun.c2023@vitstudent.ac.in</Text>
        </View>

        <Text style={styles.sectionLabel}>LINKS</Text>
        <View style={styles.card}>
          {LINKS.map((l, i) => (
            <Pressable
              key={l.label}
              onPress={() => Linking.openURL(l.url)}
              style={[styles.linkRow, i < LINKS.length - 1 && styles.linkRowBorder]}
            >
              <View style={styles.linkIcon}>
                <Ionicons name={l.icon as any} size={18} color={colors.text} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.linkLabel}>{l.label}</Text>
                <Text style={styles.linkValue}>{l.value}</Text>
              </View>
              <Ionicons name="open-outline" size={16} color={colors.textMuted} />
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionLabel}>APPEARANCE</Text>
        <View style={styles.card}>
          {toggleRow('moon-outline', 'Dark Mode', darkMode, setDarkMode)}
          {toggleRow('text-outline', 'Large Text', largeText, setLargeText)}
          {toggleRow('contrast-outline', 'High Contrast', highContrast, setHighContrast, true)}
        </View>

        <Text style={styles.sectionLabel}>NOTIFICATIONS & FEEDBACK</Text>
        <View style={styles.card}>
          {toggleRow('notifications-outline', 'Push Notifications', pushNotifications, setPushNotifications)}
          {toggleRow('hand-left-outline', 'Haptic Feedback (Interaction Mode)', hapticFeedback, setHapticFeedback, true)}
        </View>

        <Text style={styles.sectionLabel}>ABOUT</Text>
        <View style={styles.card}>
          <View style={[styles.linkRow, styles.linkRowBorder]}>
            <View style={styles.linkIcon}>
              <Ionicons name="basket-outline" size={18} color={colors.text} />
            </View>
            <Text style={[styles.linkLabel, { flex: 1 }]}>CalmCart</Text>
            <Text style={styles.linkValue}>v1.1.0</Text>
          </View>
          <View style={styles.linkRow}>
            <View style={styles.linkIcon}>
              <Ionicons name="build-outline" size={18} color={colors.text} />
            </View>
            <Text style={[styles.linkLabel, { flex: 1 }]}>Built with</Text>
            <Text style={styles.linkValue}>React Native + Expo</Text>
          </View>
        </View>

        <Text style={styles.footer}>Designed & built by Arun C. for VIT Vellore coursework.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(colors: ReturnType<typeof useTheme>['colors'], radius: ReturnType<typeof useTheme>['radius'], fonts: ReturnType<typeof useTheme>['fonts'], scale: number) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    content: { padding: 20, paddingBottom: 60 },
    title: { fontFamily: fonts.bold, fontSize: fs(22, scale), color: colors.text, marginBottom: 20 },
    profileCard: {
      backgroundColor: colors.card,
      borderRadius: radius.lg,
      alignItems: 'center',
      paddingVertical: 28,
      marginBottom: 24,
    },
    avatar: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.avatar,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    avatarText: { fontFamily: fonts.bold, fontSize: fs(20, scale), color: colors.text },
    name: { fontFamily: fonts.bold, fontSize: fs(18, scale), color: colors.text },
    role: {
      fontFamily: fonts.regular,
      fontSize: fs(12, scale),
      color: colors.textSecondary,
      marginTop: 4,
      textAlign: 'center',
      paddingHorizontal: 20,
    },
    email: { fontFamily: fonts.regular, fontSize: fs(12, scale), color: colors.textMuted, marginTop: 6 },
    sectionLabel: {
      fontFamily: fonts.semiBold,
      fontSize: fs(11, scale),
      color: colors.textMuted,
      letterSpacing: 0.5,
      marginBottom: 8,
      marginTop: 4,
    },
    card: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      marginBottom: 20,
      overflow: 'hidden',
    },
    linkRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
    linkRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.divider },
    linkIcon: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: colors.card,
      alignItems: 'center',
      justifyContent: 'center',
    },
    linkLabel: { fontFamily: fonts.medium, fontSize: fs(14, scale), color: colors.text },
    linkValue: { fontFamily: fonts.regular, fontSize: fs(12, scale), color: colors.textSecondary, marginTop: 2 },
    footer: { fontFamily: fonts.regular, fontSize: fs(11, scale), color: colors.textMuted, textAlign: 'center', marginTop: 12 },
  });
}
