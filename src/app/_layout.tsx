import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { CartProvider } from '../context/CartContext';
import { SettingsProvider, useSettings } from '../context/SettingsContext';
import { useTheme } from '../theme/useTheme';
import AnimatedSplash from '../components/AnimatedSplash';

SplashScreen.preventAutoHideAsync().catch(() => {});

function AppShell() {
  const { colors, darkMode } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style={darkMode ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="product/[id]" options={{ animation: 'slide_from_right' }} />
      </Stack>
    </View>
  );
}

function RootReady({ onReady }: { onReady: () => void }) {
  // Waits for persisted Settings (dark mode etc.) to load before the first
  // paint, so returning users never see a light-mode flash before dark
  // mode kicks in.
  const { ready } = useSettings();
  const [showIntro, setShowIntro] = useState(true);
  useEffect(() => {
    if (ready) onReady();
  }, [ready, onReady]);
  return (
    <View style={{ flex: 1 }}>
      <AppShell />
      {showIntro && <AnimatedSplash onFinish={() => setShowIntro(false)} />}
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const hideSplash = useCallback(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      // Settings load almost instantly from AsyncStorage; RootReady calls
      // hideSplash itself once both fonts and settings are in.
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SettingsProvider>
          <CartProvider>
            <RootReady onReady={hideSplash} />
          </CartProvider>
        </SettingsProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
