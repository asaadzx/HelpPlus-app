import { Tabs } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../src/context/ThemeContext';
import { useLanguage } from '../../src/i18n';

export default function TabLayout() {
  const { colors } = useTheme();
  const { t } = useLanguage();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.headerBg },
        headerTintColor: colors.headerText,
        headerTitleStyle: { fontFamily: 'Tajawal_700Bold', fontSize: 18 },
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="talk"
        options={{
          title: t('tabs.talk'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-ellipses" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="entertainment"
        options={{
          title: t('tabs.entertainment'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="play-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('tabs.settings'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
