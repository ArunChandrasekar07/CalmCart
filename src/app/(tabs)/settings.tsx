import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radius } from '../../theme/colors';

const LINKS = [
  { icon: 'logo-github', label: 'GitHub', value: 'ArunChandrasekar07', url: 'https://github.com/ArunChandrasekar07' },
  { icon: 'globe-outline', label: 'Portfolio', value: 'arunc.vercel.app', url: 'https://arunc.vercel.app' },
  { icon: 'code-slash-outline', label: 'LeetCode', value: 'ArunCodez', url: 'https://leetcode.com/ArunCodez' },
] as const;

export default function SettingsScreen() {
  const [push, setPush] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

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

        <Text style={styles.sectionLabel}>PREFERENCES</Text>
        <View style={styles.card}>
          <View style={[styles.linkRow, styles.linkRowBorder]}>
            <View style={styles.linkIcon}>
              <Ionicons name="notifications-outline" size={18} color={colors.text} />
            </View>
            <Text style={[styles.linkLabel, { flex: 1 }]}>Push Notifications</Text>
            <Switch value={push} onValueChange={setPush} trackColor={{ true: colors.dark }} />
          </View>
          <View style={styles.linkRow}>
            <View style={styles.linkIcon}>
              <Ionicons name="moon-outline" size={18} color={colors.text} />
            </View>
            <Text style={[styles.linkLabel, { flex: 1 }]}>Dark Mode</Text>
            <Switch value={darkMode} onValueChange={setDarkMode} trackColor={{ true: colors.dark }} />
          </View>
        </View>

        <Text style={styles.sectionLabel}>ABOUT</Text>
        <View style={styles.card}>
          <View style={[styles.linkRow, styles.linkRowBorder]}>
            <View style={styles.linkIcon}>
              <Ionicons name="basket-outline" size={18} color={colors.text} />
            </View>
            <Text style={[styles.linkLabel, { flex: 1 }]}>CalmCart</Text>
            <Text style={styles.linkValue}>v1.0.0</Text>
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

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingBottom: 60 },
  title: { fontFamily: fonts.bold, fontSize: 22, color: colors.text, marginBottom: 20 },
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
  avatarText: { fontFamily: fonts.bold, fontSize: 20, color: colors.text },
  name: { fontFamily: fonts.bold, fontSize: 18, color: colors.text },
  role: { fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary, marginTop: 4, textAlign: 'center', paddingHorizontal: 20 },
  email: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted, marginTop: 6 },
  sectionLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.white,
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
  linkLabel: { fontFamily: fonts.medium, fontSize: 14, color: colors.text },
  linkValue: { fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  footer: { fontFamily: fonts.regular, fontSize: 11, color: colors.textMuted, textAlign: 'center', marginTop: 12 },
});
