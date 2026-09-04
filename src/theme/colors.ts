/**
 * Placeholder TTC brand palette — warm cigar-lounge tones (walnut brown, cream,
 * brass accent) so the app doesn't ship looking like a generic Expo starter.
 *
 * Swap these for The Tobacco Center's real brand colors once logo/brand
 * assets are available (see the App Store prep milestone in the plan).
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#2B1B12',
    background: '#FAF6F0',
    backgroundElement: '#F0E6D8',
    backgroundSelected: '#E4D2B8',
    textSecondary: '#7A6350',
    tint: '#8C4A2F',
    danger: '#B3261E',
  },
  dark: {
    text: '#F5EFE6',
    background: '#1B140F',
    backgroundElement: '#2A2019',
    backgroundSelected: '#3A2C20',
    textSecondary: '#B8A691',
    tint: '#C9A66B',
    danger: '#FF6B5B',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'ui-sans-serif, system-ui, sans-serif',
    serif: 'Georgia, "Times New Roman", serif',
    rounded: '"SF Pro Rounded", ui-rounded, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
