import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import { fonts } from '../theme/colors';

// Continues straight out of the native splash screen (app.json's
// expo-splash-screen config: dark bg, logo at 220pt wide, centered) with
// zero jump — this renders the SAME mark at the SAME size and opacity
// first, then smoothly shrinks it into the small logo+wordmark lockup, so
// the two screens read as one continuous motion instead of a hard cut.
// Built with RN's built-in Animated API only (no extra native dependency),
// so it can't affect native build time.
const DARK_BG = '#161616';
const NATIVE_SPLASH_LOGO_SIZE = 220; // must match app.json's imageWidth
const RESTING_LOGO_SIZE = 104;
const RESTING_SCALE = RESTING_LOGO_SIZE / NATIVE_SPLASH_LOGO_SIZE;

export default function AnimatedSplash({ onFinish }: { onFinish: () => void }) {
  const logoScale = useRef(new Animated.Value(1)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslate = useRef(new Animated.Value(8)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const shrink = Animated.timing(logoScale, {
      toValue: RESTING_SCALE,
      duration: 520,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    const textIn = Animated.parallel([
      Animated.timing(textOpacity, { toValue: 1, duration: 360, useNativeDriver: true }),
      Animated.timing(textTranslate, { toValue: 0, duration: 360, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]);

    const sequence = Animated.sequence([
      // Brief beat at full (native-splash-matching) size before the motion
      // starts, so the handoff reads as a continuation, not a restart.
      Animated.delay(90),
      Animated.parallel([
        shrink,
        // Wordmark starts fading in while the logo is still mid-shrink —
        // slight overlap feels like one connected motion, not two steps.
        Animated.sequence([Animated.delay(220), textIn]),
      ]),
      Animated.delay(420),
      Animated.timing(screenOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]);

    sequence.start(({ finished }) => {
      if (finished) onFinish();
    });
    return () => sequence.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]} pointerEvents="none">
      <Animated.Image
        source={require('../../assets/splash-icon.png')}
        style={[styles.logo, { transform: [{ scale: logoScale }] }]}
        resizeMode="contain"
      />
      <Animated.Text
        style={[styles.wordmark, { opacity: textOpacity, transform: [{ translateY: textTranslate }] }]}
      >
        CalmCart
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: DARK_BG,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  // Fixed at the native splash's own logo size — only `transform: scale`
  // animates, never width/height, so there's no layout reflow/jump. The
  // box stays 220 even once scaled down to ~104 visually, so a negative
  // margin pulls the wordmark up to sit just under the shrunk mark instead
  // of leaving a big gap where the box's invisible top/bottom used to be.
  logo: {
    width: NATIVE_SPLASH_LOGO_SIZE,
    height: NATIVE_SPLASH_LOGO_SIZE,
    marginBottom: -((NATIVE_SPLASH_LOGO_SIZE - RESTING_LOGO_SIZE) / 2) + 14,
  },
  wordmark: { fontFamily: fonts.semiBold, fontSize: 24, color: '#FFFFFF', letterSpacing: 0.5 },
});
