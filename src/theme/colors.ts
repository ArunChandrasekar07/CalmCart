// CalmCart design tokens — mirrors the Figma low-fi → high-fi system
// (dark primary actions, soft gray panels, generous whitespace).

export const colors = {
  bg: '#FFFFFF',
  surface: '#FFFFFF',
  card: '#F2F2F2', // gray panel fill (sidebars, badges, summary cards)
  imgPlaceholder: '#E3E3E3',
  border: '#E6E6E6',
  divider: '#ECECEC',

  dark: '#161616', // primary text / primary button fill
  text: '#161616',
  textSecondary: '#6B6B6B',
  textMuted: '#9A9A9A',

  white: '#FFFFFF',
  accent: '#2E7D4F', // CalmCart green accent (price drops, confidence, success)
  accentSoft: '#E6F4EC',
  danger: '#D1453B',
  dangerSoft: '#FBE9E8',
  avatar: '#D6D6D6',

  shadow: 'rgba(22,22,22,0.08)',
};

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
