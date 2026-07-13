import React from 'react';
import { render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LanguageProvider } from '../../../src/i18n';
import { ThemeProvider } from '../../../src/context/ThemeContext';
import SmartDashboard from '../index';

jest.mock('expo-speech', () => ({
  speak: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
  useLocalSearchParams: () => ({}),
}));

const AllProviders = ({ children }: { children: React.ReactNode }) => (
  <SafeAreaProvider>
    <LanguageProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </LanguageProvider>
  </SafeAreaProvider>
);

describe('SmartDashboard', () => {
  it('renders without crashing', () => {
    const result = render(<SmartDashboard />, { wrapper: AllProviders });
    expect(result).toBeTruthy();
  });
});
