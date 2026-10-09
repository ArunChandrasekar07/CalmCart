import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Platform, Vibration } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

// CalmCart's accessibility & personalization settings — wired up for real:
// every toggle here actually changes how the app looks/feels, and persists
// across app restarts (AsyncStorage), so it survives closing the app.

type Settings = {
  darkMode: boolean;
  largeText: boolean;
  highContrast: boolean;
  hapticFeedback: boolean;
  pushNotifications: boolean;
};

const DEFAULTS: Settings = {
  darkMode: false,
  largeText: false,
  highContrast: false,
  hapticFeedback: true,
  pushNotifications: true,
};

const STORAGE_KEY = '@calmcart/settings/v1';

type SettingsContextValue = Settings & {
  ready: boolean;
  setDarkMode: (v: boolean) => void;
  setLargeText: (v: boolean) => void;
  setHighContrast: (v: boolean) => void;
  setHapticFeedback: (v: boolean) => void;
  setPushNotifications: (v: boolean) => void;
  /** Fires a light haptic pulse if the user has Haptic Feedback on — call
   * this from meaningful taps (add to cart, checkout, toggles). */
  tap: () => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!cancelled && raw) {
          setSettings((prev) => ({ ...prev, ...JSON.parse(raw) }));
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const update = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const tap = useCallback(() => {
    if (!settings.hapticFeedback) return;
    if (Platform.OS === 'android') {
      // expo-haptics' Android "impact" styles are a short VibrationEffect
      // waveform at a deliberately low, iOS-Taptic-style amplitude
      // (~50/255, ~43ms) — on a lot of real Android phones (especially
      // cheaper ERM vibration motors, which have spin-up lag an effect
      // that short never overcomes) that genuinely doesn't register as a
      // felt vibration, even though it's firing correctly. React Native's
      // own Vibration API drives the OS's default (device-calibrated,
      // normally much stronger) amplitude instead, so it's actually felt.
      Vibration.vibrate(40);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    }
  }, [settings.hapticFeedback]);

  const value: SettingsContextValue = {
    ...settings,
    ready,
    setDarkMode: (v) => update('darkMode', v),
    setLargeText: (v) => update('largeText', v),
    setHighContrast: (v) => update('highContrast', v),
    setHapticFeedback: (v) => update('hapticFeedback', v),
    setPushNotifications: (v) => update('pushNotifications', v),
    tap,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within a SettingsProvider');
  return ctx;
}
