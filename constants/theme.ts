import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const LightColors = {
  background: '#F4F9F9',
  text: '#1A3038',
  primary: '#0284C7',
  secondary: '#FFB703',
  action: '#10B981',
  emergency: '#EF4444',
  cardDefault: '#E0F2FE',
  cardMedicine: '#FEF3C7',
  cardTired: '#FEE2E2',
  cardIcon: '#1A3038',
  muted: '#64748B',
  border: '#E2E8F0',
  inputBg: '#F8FAFC',
  white: '#FFFFFF',
  disabled: '#94A3B8',
  headerBg: '#0284C7',
  headerText: '#FFFFFF',
  statusBar: 'dark' as const,
  drawerBg: '#FFFFFF',
  drawerText: '#1A3038',
  toggleBg: '#E2E8F0',
  toggleActive: '#0284C7',
  surface: '#FFFFFF',
  surfaceVariant: '#F8FAFC',
  onSurface: '#1A3038',
  onSurfaceVariant: '#64748B',
  outline: '#E2E8F0',
  outlineVariant: '#E2E8F0',
  error: '#EF4444',
  onError: '#FFFFFF',
  errorContainer: '#FEE2E2',
  onErrorContainer: '#991B1B',
  success: '#10B981',
  successContainer: '#D1FAE5',
  onSuccessContainer: '#065F46',
  warning: '#FFB703',
  warningContainer: '#FEF3C7',
  onWarningContainer: '#92400E',
  elevation: {
    level0: 'transparent',
    level1: '#F4F9F9',
    level2: '#F8FAFC',
    level3: '#FFFFFF',
    level4: '#FFFFFF',
    level5: '#FFFFFF',
  },
};

export const DarkColors = {
  background: '#050a0a',
  text: '#e8f0f4',
  primary: '#3abcfd',
  secondary: '#fab300',
  action: '#48efb7',
  emergency: '#ef4444',
  cardDefault: '#0f1a1a',
  cardMedicine: '#1a1a0a',
  cardTired: '#1a0a0a',
  cardIcon: '#1A3038',
  muted: '#a0bac8',
  border: '#263640',
  inputBg: '#0e1e24',
  white: '#0f1a1a',
  disabled: '#4a5a5a',
  headerBg: '#0e1e24',
  headerText: '#e8f0f4',
  statusBar: 'light' as const,
  drawerBg: '#0e1e24',
  drawerText: '#e8f0f4',
  toggleBg: '#263640',
  toggleActive: '#3abcfd',
  surface: '#0e1e24',
  surfaceVariant: '#0a1515',
  onSurface: '#e8f0f4',
  onSurfaceVariant: '#a0bac8',
  outline: '#263640',
  outlineVariant: '#263640',
  error: '#ef4444',
  onError: '#FFFFFF',
  errorContainer: '#2a0a0a',
  onErrorContainer: '#fca5a5',
  success: '#48efb7',
  successContainer: '#0a3a24',
  onSuccessContainer: '#d1fae5',
  warning: '#fab300',
  warningContainer: '#2a2000',
  onWarningContainer: '#fef08a',
  elevation: {
    level0: 'transparent',
    level1: '#0e1e24',
    level2: '#0f1a1a',
    level3: '#0f1a1a',
    level4: '#0f1a1a',
    level5: '#0f1a1a',
  },
};

export type ThemeColors = {
  background: string;
  text: string;
  primary: string;
  secondary: string;
  action: string;
  emergency: string;
  cardDefault: string;
  cardMedicine: string;
  cardTired: string;
  cardIcon: string;
  muted: string;
  border: string;
  inputBg: string;
  white: string;
  disabled: string;
  headerBg: string;
  headerText: string;
  statusBar: 'light' | 'dark';
  drawerBg: string;
  drawerText: string;
  toggleBg: string;
  toggleActive: string;
  surface: string;
  surfaceVariant: string;
  onSurface: string;
  onSurfaceVariant: string;
  outline: string;
  outlineVariant: string;
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;
  success: string;
  successContainer: string;
  onSuccessContainer: string;
  warning: string;
  warningContainer: string;
  onWarningContainer: string;
  elevation: {
    level0: string;
    level1: string;
    level2: string;
    level3: string;
    level4: string;
    level5: string;
  };
};

export function getPaperLightTheme() {
  return {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: LightColors.primary,
      onPrimary: LightColors.white,
      primaryContainer: LightColors.cardDefault,
      onPrimaryContainer: LightColors.text,
      secondary: LightColors.secondary,
      onSecondary: LightColors.text,
      secondaryContainer: LightColors.warningContainer,
      onSecondaryContainer: LightColors.onWarningContainer,
      tertiary: LightColors.action,
      onTertiary: LightColors.white,
      tertiaryContainer: LightColors.successContainer,
      onTertiaryContainer: LightColors.onSuccessContainer,
      error: LightColors.error,
      onError: LightColors.onError,
      errorContainer: LightColors.errorContainer,
      onErrorContainer: LightColors.onErrorContainer,
      background: LightColors.background,
      onBackground: LightColors.text,
      surface: LightColors.surface,
      onSurface: LightColors.onSurface,
      surfaceVariant: LightColors.surfaceVariant,
      onSurfaceVariant: LightColors.onSurfaceVariant,
      outline: LightColors.outline,
      outlineVariant: LightColors.outlineVariant,
      elevation: LightColors.elevation,
    },
  };
}

export function getPaperDarkTheme() {
  return {
    ...MD3DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      primary: DarkColors.primary,
      onPrimary: DarkColors.text,
      primaryContainer: DarkColors.cardDefault,
      onPrimaryContainer: DarkColors.text,
      secondary: DarkColors.secondary,
      onSecondary: DarkColors.text,
      secondaryContainer: DarkColors.warningContainer,
      onSecondaryContainer: DarkColors.onWarningContainer,
      tertiary: DarkColors.action,
      onTertiary: DarkColors.text,
      tertiaryContainer: DarkColors.successContainer,
      onTertiaryContainer: DarkColors.onSuccessContainer,
      error: DarkColors.error,
      onError: DarkColors.onError,
      errorContainer: DarkColors.errorContainer,
      onErrorContainer: DarkColors.onErrorContainer,
      background: DarkColors.background,
      onBackground: DarkColors.text,
      surface: DarkColors.surface,
      onSurface: DarkColors.onSurface,
      surfaceVariant: DarkColors.surfaceVariant,
      onSurfaceVariant: DarkColors.onSurfaceVariant,
      outline: DarkColors.outline,
      outlineVariant: DarkColors.outlineVariant,
      elevation: DarkColors.elevation,
    },
  };
}

export const Fonts = {
  arabic: {
    regular: 'Tajawal_400Regular',
    medium: 'Tajawal_500Medium',
    bold: 'Tajawal_700Bold',
  },
  english: {
    light: 'Fredoka_300Light',
    regular: 'Fredoka_400Regular',
    medium: 'Fredoka_500Medium',
    semiBold: 'Fredoka_600SemiBold',
    bold: 'Fredoka_700Bold',
  },
};

export const ICON_PRESETS = [
  { name: 'water', provider: 'Ionicons' as const, label: 'مية' },
  { name: 'silverware-fork-knife', provider: 'MaterialCommunityIcons' as const, label: 'أكل' },
  { name: 'pill', provider: 'MaterialCommunityIcons' as const, label: 'دوا' },
  { name: 'toilet', provider: 'MaterialCommunityIcons' as const, label: 'حمام' },
  { name: 'coffee', provider: 'MaterialCommunityIcons' as const, label: 'شاي' },
  { name: 'bed', provider: 'Ionicons' as const, label: 'نوم' },
  { name: 'medical-bag', provider: 'MaterialCommunityIcons' as const, label: 'طوارئ' },
  { name: 'hand-heart', provider: 'MaterialCommunityIcons' as const, label: 'مساعدة' },
  { name: 'car', provider: 'MaterialCommunityIcons' as const, label: 'عربية' },
  { name: 'call', provider: 'Ionicons' as const, label: 'تليفون' },
  { name: 'tshirt-crew', provider: 'MaterialCommunityIcons' as const, label: 'هدوم' },
  { name: 'emoticon-happy-outline', provider: 'MaterialCommunityIcons' as const, label: 'مبسوط' },
  { name: 'emoticon-sad-outline', provider: 'MaterialCommunityIcons' as const, label: 'تعبان' },
  { name: 'walk', provider: 'MaterialCommunityIcons' as const, label: 'مشي' },
  { name: 'hospital-box', provider: 'MaterialCommunityIcons' as const, label: 'مستشفى' },
  { name: 'book-open-variant', provider: 'MaterialCommunityIcons' as const, label: 'قراءة' },
];

export const COLOR_PRESETS = [
  '#E0F2FE', '#FEF3C7', '#FEE2E2', '#D1FAE5',
  '#EDE9FE', '#FCE7F3', '#CCFBF1', '#FEF9C3',
];

export const TILE_PRESETS = [
  { labelAr: 'عايز مية', labelEn: 'I want water', icon: 'water', iconProvider: 'Ionicons' as const, color: '#E0F2FE' },
  { labelAr: 'عايز أكل', labelEn: 'I want food', icon: 'silverware-fork-knife', iconProvider: 'MaterialCommunityIcons' as const, color: '#E0F2FE' },
  { labelAr: 'عايز شاي', labelEn: 'I want tea', icon: 'coffee', iconProvider: 'MaterialCommunityIcons' as const, color: '#E0F2FE' },
  { labelAr: 'تعبان', labelEn: 'I am tired', icon: 'emoticon-sad-outline', iconProvider: 'MaterialCommunityIcons' as const, color: '#FEE2E2' },
  { labelAr: 'الدوا', labelEn: 'Medicine', icon: 'pill', iconProvider: 'MaterialCommunityIcons' as const, color: '#FEF3C7' },
  { labelAr: 'الحمام', labelEn: 'Restroom', icon: 'toilet', iconProvider: 'MaterialCommunityIcons' as const, color: '#E0F2FE' },
];
