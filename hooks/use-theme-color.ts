import { useTheme } from '@/src/context/ThemeContext';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: string
) {
  const { isDark, colors } = useTheme();
  const colorFromProps = isDark ? props.dark : props.light;

  if (colorFromProps) {
    return colorFromProps;
  }

  const colorValue = (colors as Record<string, unknown>)[colorName];
  if (typeof colorValue === 'string') {
    return colorValue;
  }
  return '#000000';
}
