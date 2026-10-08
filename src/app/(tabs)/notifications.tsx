import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, SectionList, Pressable, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { NOTIFICATIONS, NotificationItem } from '../../data/notifications';
import { useSettings } from '../../context/SettingsContext';
import { useTheme, fs } from '../../theme/useTheme';

export default function NotificationsScreen() {
  const [items, setItems] = useState<NotificationItem[]>(NOTIFICATIONS);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const { pushNotifications, setPushNotifications, tap } = useSettings();
  const { colors, fonts, radius, scale } = useTheme();
  const styles = useMemo(() => makeStyles(colors, radius, fonts, scale), [colors, radius, fonts, scale]);

  const sections = useMemo(() => {
    const groups: Record<string, NotificationItem[]> = {};
    items.forEach((n) => {
      groups[n.group] = groups[n.group] || [];
      groups[n.group].push(n);
    });
    return Object.entries(groups).map(([title, data]) => ({ title, data }));
  }, [items]);

  const markAllRead = () => {
    tap();
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        <Pressable onPress={markAllRead}>
          <Text style={styles.markRead}>Mark all read</Text>
        </Pressable>
      </View>

      <View style={styles.settingsCard}>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Push Notifications</Text>
          <Switch
            value={pushNotifications}
            onValueChange={(v) => {
              tap();
              setPushNotifications(v);
            }}
            trackColor={{ true: colors.primary, false: colors.border }}
            thumbColor={colors.bg}
          />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Email Alerts</Text>
          <Switch
            value={emailEnabled}
            onValueChange={(v) => {
              tap();
              setEmailEnabled(v);
            }}
            trackColor={{ true: colors.primary, false: colors.border }}
            thumbColor={colors.bg}
          />
        </View>
      </View>

      {!pushNotifications && (
        <Text style={styles.mutedNote}>
          Push notifications are off — new alerts won't be delivered, but you can still browse your history below.
        </Text>
      )}

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title.toUpperCase()}</Text>
        )}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              setItems((prev) => prev.map((n) => (n.id === item.id ? { ...n, read: true } : n)));
              if (item.productId) router.push(`/product/${item.productId}`);
            }}
            style={styles.row}
          >
            <View style={[styles.dot, !item.read && styles.dotUnread]} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowTitle, !item.read && styles.rowTitleUnread]}>{item.title}</Text>
              <Text style={styles.rowTime}>{item.time}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </Pressable>
        )}
      />
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
    title: { fontFamily: fonts.bold, fontSize: fs(22, scale), color: colors.text },
    markRead: { fontFamily: fonts.medium, fontSize: fs(12, scale), color: colors.textSecondary },
    settingsCard: {
      marginHorizontal: 20,
      backgroundColor: colors.card,
      borderRadius: radius.md,
      padding: 16,
      marginBottom: 12,
      gap: 14,
    },
    settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    settingLabel: { fontFamily: fonts.medium, fontSize: fs(13, scale), color: colors.text },
    mutedNote: {
      fontFamily: fonts.regular,
      fontSize: fs(11, scale),
      color: colors.textMuted,
      paddingHorizontal: 20,
      marginBottom: 12,
      lineHeight: fs(16, scale),
    },
    sectionHeader: {
      fontFamily: fonts.semiBold,
      fontSize: fs(11, scale),
      color: colors.textMuted,
      marginTop: 16,
      marginBottom: 8,
      letterSpacing: 0.5,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'transparent' },
    dotUnread: { backgroundColor: colors.accent },
    rowTitle: { fontFamily: fonts.medium, fontSize: fs(14, scale), color: colors.text },
    rowTitleUnread: { fontFamily: fonts.semiBold },
    rowTime: { fontFamily: fonts.regular, fontSize: fs(11, scale), color: colors.textMuted, marginTop: 2 },
  });
}
