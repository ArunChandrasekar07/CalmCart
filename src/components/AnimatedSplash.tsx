import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet } from 'react-native';
import { fonts } from '../theme/colors';

// A short, simple in-app splash that plays right after the native splash
// hides — logo scales/fades in, the wordmark follows, then the whole thing
// fades out into the app. Built with RN's built-in Animated API only (no
// extra native dependency), so it can't affect native build time.
const DARK_BG = '#161616';

export default function AnimatedSplash({ onFinish }: { onFinish: () => void }) {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.85)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslate = useRef(new Animated.Value(8)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const sequence = Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: 420, useNativeDriver: true }),
        Animated.spring(logoScale, { toValue: 1, friction: 6, tension: 60, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(textOpacity, { toValue: 1, duration: 380, useNativeDriver: true }),
        Animated.timing(textTranslate, { toValue: 0, duration: 380, useNativeDriver: true }),
      ]),
      Animated.delay(350),
      Animated.timing(screenOpacity, { toValue: 0, duration: 320, useNativeDriver: true }),
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
        style={[styles.logo, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}
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
  logo: { width: 110, height: 110, marginBottom: 18 },
  wordmark: { fontFamily: fonts.semiBold, fontSize: 24, color: '#FFFFFF', letterSpacing: 0.5 },
});
