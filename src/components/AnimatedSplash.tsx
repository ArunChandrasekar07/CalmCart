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
const NATIVE_SPLASH_LOGO_WIDTH = 220; // must match app.json's imageWidth
// splash-icon.png's own (cropped) pixel aspect ratio — width/height. Using
// this instead of a hardcoded height means the JS box's aspect always
// matches what "contain" actually renders, so there's no invisible
// top/bottom padding thrown off the size math.
const LOGO_ASPECT_RATIO = 601 / 400;
const RESTING_LOGO_WIDTH = 104;
const RESTING_SCALE = RESTING_LOGO_WIDTH / NATIVE_SPLASH_LOGO_WIDTH;
const LOGO_BOX_HEIGHT = NATIVE_SPLASH_LOGO_WIDTH / LOGO_ASPECT_RATIO;
// `transform: scale` shrinks what's drawn but NOT the element's own layout
// box, so once shrunk there's invisible space above/below the now-smaller
// glyph equal to half the height it gave up. Pull the wordmark up through
// that invisible space, leaving only a small, deliberate gap beneath the
// glyph's actual (shrunk) edge.
const DESIRED_GAP = 14;
const LOGO_MARGIN_BOTTOM = -((LOGO_BOX_HEIGHT * (1 - RESTING_SCALE)) / 2) + DESIRED_GAP;

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
  // Fixed at the native splash's own logo width — only `transform: scale`
  // animates, never width/height, so there's no layout reflow/jump. Height
  // comes from the asset's real aspect ratio, so the box hugs the glyph
  // with no hidden padding to throw off the shrink math.
  logo: {
    width: NATIVE_SPLASH_LOGO_WIDTH,
    height: LOGO_BOX_HEIGHT,
    marginBottom: LOGO_MARGIN_BOTTOM,
  },
  wordmark: { fontFamily: fonts.semiBold, fontSize: 24, color: '#FFFFFF', letterSpacing: 0.5 },
});
