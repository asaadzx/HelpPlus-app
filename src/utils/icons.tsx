import { IconProvider } from '../types';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export const iconMap: Record<IconProvider, typeof Ionicons | typeof MaterialCommunityIcons> = {
  Ionicons,
  MaterialCommunityIcons,
};

/**
 * Renders an icon by provider and name.
 * Uses `as any` to bypass strict icon-name typing since names come from
 * user data stored in AsyncStorage. All names are validated at the
 * icon-picker level in the add-tile screen.
 */
export function renderIcon(
  provider: IconProvider,
  name: string,
  size: number,
  color: string,
) {
  const Component = iconMap[provider];
  return <Component name={name as any} size={size} color={color} />;
}
