// CalmCart design tokens — mirrors the Figma low-fi → high-fi system
// (dark primary actions, soft gray panels, generous whitespace).
//
// Colors are generated per-theme (light/dark × normal/high-contrast) via
// getColors() below, rather than being one static object, so Settings →
// Dark Mode / High Contrast actually repaint the whole app.

export type Colors = {
  bg: string;
  surface: string;
  card: string;
  surfaceRaised: string; // an icon/chip circle that should "pop" off a card
  imgPlaceholder: string;
  border: string;
  divider: string;

  text: string;
  textSecondary: string;
  textMuted: string;

  primary: string; // primary button fill / active tab / active chip
  onPrimary: string; // text or icon drawn on top of `primary`

  accent: string; // CalmCart green accent (price drops, confidence, success)
  accentSoft: string;
  danger: string;
  dangerSoft: string;
  avatar: string;
  shadow: string;
  /** Translucent circular-button fill for controls floating over an image
   * (e.g. the back/share/bookmark buttons over a product photo) — needs to
   * stay legible on both a light and a dark photo placeholder. */
  overlay: string;
};

const light: Colors = {
  bg: '#FFFFFF',
  surface: '#FFFFFF',
  card: '#F2F2F2',
  surfaceRaised: '#FFFFFF',
  imgPlaceholder: '#E3E3E3',
  border: '#E6E6E6',
  divider: '#ECECEC',

  text: '#161616',
  textSecondary: '#6B6B6B',
  textMuted: '#9A9A9A',

  primary: '#161616',
  onPrimary: '#FFFFFF',

  accent: '#2E7D4F',
  accentSoft: '#E6F4EC',
  danger: '#D1453B',
  dangerSoft: '#FBE9E8',
  avatar: '#D6D6D6',
  shadow: 'rgba(22,22,22,0.08)',
  overlay: 'rgba(255,255,255,0.9)',
};

const dark: Colors = {
  bg: '#121212',
  surface: '#1A1A1A',
  card: '#1E1E1E',
  surfaceRaised: '#272727',
  imgPlaceholder: '#2A2A2A',
  border: '#2E2E2E',
  divider: '#292929',

  text: '#F2F2F2',
  textSecondary: '#B3B3B3',
  textMuted: '#858585',

  primary: '#F2F2F2',
  onPrimary: '#161616',

  accent: '#52B37D',
  accentSoft: 'rgba(82,179,125,0.16)',
  danger: '#E5675D',
  dangerSoft: 'rgba(229,103,93,0.16)',
  avatar: '#3A3A3A',
  shadow: 'rgba(0,0,0,0.5)',
  overlay: 'rgba(38,38,38,0.88)',
};

/** Returns the active color scheme. High contrast sharpens borders and
 * secondary text so every element reads clearly, in either light or dark. */
export function getColors(darkMode: boolean, highContrast: boolean): Colors {
  const base = darkMode ? dark : light;
  if (!highContrast) return base;
  return {
    ...base,
    border: darkMode ? '#5C5C5C' : '#9E9E9E',
    divider: darkMode ? '#5C5C5C' : '#9E9E9E',
    textSecondary: darkMode ? '#EDEDED' : '#2B2B2B',
    textMuted: darkMode ? '#D8D8D8' : '#3A3A3A',
  };
}

export const radius = {
  sm: 8,
  md: 12,
  lg: 18,
  pill: 999,
};

export const spacing = (n: number) => n * 4;

export const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};
