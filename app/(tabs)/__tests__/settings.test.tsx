import React from 'react';
import { render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LanguageProvider } from '../../../src/i18n';
import { ThemeProvider } from '../../../src/context/ThemeContext';
import SettingsScreen from '../settings';

jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('expo-updates', () => ({
  reloadAsync: jest.fn(),
}));

const AllProviders = ({ children }: { children: React.ReactNode }) => (
  <SafeAreaProvider>
    <LanguageProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </LanguageProvider>
  </SafeAreaProvider>
);

describe('SettingsScreen', () => {
  it('renders without crashing', () => {
    const result = render(<SettingsScreen />, { wrapper: AllProviders });
    expect(result).toBeTruthy();
  });
});
