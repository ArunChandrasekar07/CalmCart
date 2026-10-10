import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import { fonts } from '../theme/colors';

// A proper animated logo reveal — the two halves of the mark (the green
// handle arc, the basket outline) fly in from opposite sides and snap
// together with a little bounce, the way a Tata Play/Swiggy-calibre app
// opens: pieces assemble into the brand mark rather than just fading one
// static image in. Built with RN's own Animated API (no extra native
// dependency), so it can't affect native build time.
//
// The native splash screen (app.json) is now JUST the background color,
// with no logo image at all — on purpose. Any static native logo would
// have to match this component's very first frame exactly or the handoff
// would visibly jump (that was the whole source of the earlier splash
// bugs). A blank background matches a blank background with zero
// possible mismatch, and the real reveal — the part worth watching —
// happens entirely here, the instant JS takes over.
const DARK_BG = '#161616';
const LOGO_BOX = 220; // square box both logo layers render into
const RESTING_LOGO_WIDTH = 104;
const RESTING_SCALE = RESTING_LOGO_WIDTH / LOGO_BOX;
// `transform: scale` shrinks what's drawn but NOT the element's own layout
// box, so once shrunk there's invisible space above/below the now-smaller
// glyph equal to half the height it gave up. Pull the wordmark up through
// that invisible space, leaving only a small, deliberate gap beneath the
// glyph's actual (shrunk) edge.
const DESIRED_GAP = 14;
const LOGO_MARGIN_BOTTOM = -((LOGO_BOX * (1 - RESTING_SCALE)) / 2) + DESIRED_GAP;
// How far off-screen each half starts, as its own translateX.
const TRAVEL = 130;

export default function AnimatedSplash({ onFinish }: { onFinish: () => void }) {
  const arcX = useRef(new Animated.Value(-TRAVEL)).current;
  const arcOpacity = useRef(new Animated.Value(0)).current;
  const basketX = useRef(new Animated.Value(TRAVEL)).current;
  const basketOpacity = useRef(new Animated.Value(0)).current;
  // One value carries both the "pieces just snapped together" impact
  // pulse and, later, the shrink into the resting logo+wordmark lockup —
  // it's the same mark the whole time, so it's the same Animated.Value.
  const markScale = useRef(new Animated.Value(1)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslate = useRef(new Animated.Value(8)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const flyIn = Animated.parallel([
      Animated.spring(arcX, { toValue: 0, useNativeDriver: true, speed: 14, bounciness: 9 }),
      Animated.timing(arcOpacity, { toValue: 1, duration: 260, useNativeDriver: true }),
      Animated.sequence([
        // Basket trails the arc by a beat so the two reads as "this piece,
        // then that piece", not one simultaneous blob landing.
        Animated.delay(70),
        Animated.parallel([
          Animated.spring(basketX, { toValue: 0, useNativeDriver: true, speed: 14, bounciness: 9 }),
          Animated.timing(basketOpacity, { toValue: 1, duration: 260, useNativeDriver: true }),
        ]),
      ]),
    ]);

    const mergeImpact = Animated.sequence([
      Animated.timing(markScale, { toValue: 1.1, duration: 90, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(markScale, { toValue: 1, duration: 150, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]);

    const textIn = Animated.parallel([
      Animated.timing(textOpacity, { toValue: 1, duration: 360, useNativeDriver: true }),
      Animated.timing(textTranslate, { toValue: 0, duration: 360, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]);

    const shrink = Animated.timing(markScale, {
      toValue: RESTING_SCALE,
      duration: 480,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });

    const sequence = Animated.sequence([
      // A brief beat on the blank background before anything appears — an
      // instant jump-cut right as JS mounts would read as a glitch, not a
      // reveal.
      Animated.delay(120),
      flyIn,
      mergeImpact,
      Animated.delay(60),
      Animated.parallel([shrink, Animated.sequence([Animated.delay(200), textIn])]),
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
      <Animated.View style={[styles.logoWrap, { transform: [{ scale: markScale }] }]}>
        <Animated.Image
          source={require('../../assets/splash-basket.png')}
          style={[styles.layer, { opacity: basketOpacity, transform: [{ translateX: basketX }] }]}
          resizeMode="contain"
        />
        <Animated.Image
          source={require('../../assets/splash-arc.png')}
          style={[styles.layer, { opacity: arcOpacity, transform: [{ translateX: arcX }] }]}
          resizeMode="contain"
        />
      </Animated.View>
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
  logoWrap: {
    width: LOGO_BOX,
    height: LOGO_BOX,
    marginBottom: LOGO_MARGIN_BOTTOM,
  },
  // Both halves stack in the exact same box so their resting positions
  // line up pixel-for-pixel into the one complete mark — they were split
  // from that single final image, so there's nothing to misalign.
  layer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  wordmark: { fontFamily: fonts.semiBold, fontSize: 24, color: '#FFFFFF', letterSpacing: 0.5 },
});
