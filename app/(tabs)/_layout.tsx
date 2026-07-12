import { Tabs } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../src/context/ThemeContext';

export default function TabLayout() {
  const { colors } = useTheme();

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
          title: 'الرئيسية',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="talk"
        options={{
          title: 'اكتب لتتحدث',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-ellipses" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="entertainment"
        options={{
          title: 'الترفيه',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="play-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'الإعدادات',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
