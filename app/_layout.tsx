import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {
  Tajawal_400Regular,
  Tajawal_500Medium,
  Tajawal_700Bold,
} from '@expo-google-fonts/tajawal';
import {
  Fredoka_300Light,
  Fredoka_400Regular,
  Fredoka_500Medium,
  Fredoka_600SemiBold,
  Fredoka_700Bold,
} from '@expo-google-fonts/fredoka';
import { ThemeProvider, useTheme } from '../src/context/ThemeContext';

SplashScreen.preventAutoHideAsync();

function RootLayoutInner() {
  const { colors } = useTheme();
  const [fontsLoaded] = useFonts({
    Tajawal_400Regular,
    Tajawal_500Medium,
    Tajawal_700Bold,
    Fredoka_300Light,
    Fredoka_400Regular,
    Fredoka_500Medium,
    Fredoka_600SemiBold,
    Fredoka_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <>
      <StatusBar style={colors.statusBar} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.headerBg },
          headerTintColor: colors.headerText,
          headerTitleStyle: { fontFamily: 'Tajawal_700Bold', fontSize: 20 },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="add-tile"
          options={{
            title: 'إضافة كرت جديد',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="manage-tiles"
          options={{
            title: 'إدارة الكروت',
            presentation: 'modal',
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <PaperProviderWrapper />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function PaperProviderWrapper() {
  const { paperTheme } = useTheme();
  return (
    <PaperProvider theme={paperTheme}>
      <RootLayoutInner />
    </PaperProvider>
  );
}
