import { useMemo } from 'react';
import { useSettings } from '../context/SettingsContext';
import { getColors, fonts, radius, Colors } from './colors';

export type Theme = {
  colors: Colors;
  fonts: typeof fonts;
  radius: typeof radius;
  /** Multiply any fontSize by this so "Large Text" actually scales type. */
  scale: number;
  darkMode: boolean;
};

export function useTheme(): Theme {
  const { darkMode, highContrast, largeText } = useSettings();

  return useMemo(
    () => ({
      colors: getColors(darkMode, highContrast),
      fonts,
      radius,
      scale: largeText ? 1.15 : 1,
      darkMode,
    }),
    [darkMode, highContrast, largeText]
  );
}

/** Scales a fontSize by the theme's text-size multiplier, rounded to a
 * whole pixel so React Native doesn't warn about fractional font sizes. */
export function fs(size: number, scale: number) {
  return Math.round(size * scale);
}
