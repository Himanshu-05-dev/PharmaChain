export const PharmaTheme = {
  colors: {
    // Hyper-Minimalist Titanium & Electric Cobalt Blue
    primary: '#2563eb', // Electric Cobalt Blue
    primaryDark: '#1d4ed8', // Deep Royal Cobalt
    primaryLight: '#dbeafe', // Soft Cobalt Frost
    primarySurface: '#eff6ff', // Ultra-Light Cobalt Ice
    primaryGlow: '#3b82f6', // Bright Cobalt Glow

    accentCyan: '#06b6d4', // Electric Cyan
    accentIndigo: '#4f46e5', // Deep Indigo

    background: '#f8fafc', // Titanium Ice Canvas
    card: '#ffffff', // Pure Titanium White Surface
    surfaceElevated: '#f1f5f9', // Frosted Titanium Card Surface
    surfaceSubtle: '#e2e8f0', // Titanium Border Tint

    text: '#0f172a', // Titanium Slate High-Contrast Text
    textSecondary: '#475569', // Muted Titanium Gray
    textMuted: '#94a3b8', // Subtle Metadata Gray

    border: '#e2e8f0', // Hairline Titanium Border
    borderStrong: '#cbd5e1', // Defined Titanium Border
    borderGlow: 'rgba(37, 99, 235, 0.25)', // Cobalt Glow Border

    success: '#10b981', // Emerald Success
    successLight: '#ecfdf5',
    successBorder: '#a7f3d0',

    warning: '#f59e0b', // Amber Warning
    warningLight: '#fffbeb',
    warningBorder: '#fde68a',

    danger: '#ef4444', // Crimson Alert
    dangerLight: '#fef2f2',
    dangerBorder: '#fecaca',

    white: '#ffffff',
    black: '#000000',
    titaniumDark: '#0b0f17',
  },
  typography: {
    sizes: {
      xs: 11,
      sm: 13,
      md: 15,
      lg: 18,
      xl: 22,
      xxl: 26,
    },
    weights: {
      regular: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
      heavy: '800' as const,
    },
  },
  shadows: {
    sm: {
      shadowColor: '#0f172a',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 3,
      elevation: 1,
    },
    md: {
      shadowColor: '#0f172a',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
    lg: {
      shadowColor: '#0f172a',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
      elevation: 4,
    },
    floating: {
      shadowColor: '#0f172a',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 24,
      elevation: 8,
    },
    glowCobalt: {
      shadowColor: '#2563eb',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 16,
      elevation: 8,
    },
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 26,
    full: 9999,
  },
};

export const Colors = {
  light: {
    text: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#94a3b8',
    background: '#f8fafc',
    backgroundSelected: '#e2e8f0',
    backgroundElement: '#f1f5f9',
    card: '#ffffff',
    primary: '#2563eb',
    tint: '#2563eb',
    icon: '#64748b',
    tabIconDefault: '#64748b',
    tabIconSelected: '#2563eb',
    border: '#e2e8f0',
  },
  dark: {
    text: '#f8fafc',
    textSecondary: '#cbd5e1',
    textMuted: '#64748b',
    background: '#0b0f17',
    backgroundSelected: '#334155',
    backgroundElement: '#1e293b',
    card: '#1e293b',
    primary: '#3b82f6',
    tint: '#3b82f6',
    icon: '#94a3b8',
    tabIconDefault: '#94a3b8',
    tabIconSelected: '#3b82f6',
    border: '#334155',
  },
};

export type ThemeColor = keyof typeof Colors.light;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 20,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const Fonts = {
  regular: { fontWeight: '400' as const },
  medium: { fontWeight: '500' as const },
  semibold: { fontWeight: '600' as const },
  bold: { fontWeight: '700' as const },
  mono: 'monospace',
};

