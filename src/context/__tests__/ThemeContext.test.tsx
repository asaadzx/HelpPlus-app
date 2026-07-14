jest.mock('@react-native-async-storage/async-storage', () =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('expo-speech', () => ({
  speak: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn(), dismiss: jest.fn() }),
  useLocalSearchParams: () => ({}),
}));

jest.mock('expo-updates', () => ({
  reloadAsync: jest.fn(),
}));

jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn((cb: () => void) => { cb(); }),
}));

import React from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from 'react-native';
import { ThemeProvider, useTheme } from '../ThemeContext';

let captured: any = {};

function ThemeCapture() {
  captured = useTheme();
  return null;
}

beforeEach(() => {
  AsyncStorage.clear();
  captured = {};
});

async function renderAndWait() {
  render(
    <ThemeProvider>
      <Text>placeholder</Text>
      <ThemeCapture />
    </ThemeProvider>
  );
  await waitFor(() => expect(captured.toggleTheme).toBeDefined());
}

describe('ThemeContext — persistence', () => {
  it('defaults to light theme', async () => {
    await renderAndWait();
    expect(captured.isDark).toBe(false);
  });

  it('toggles theme and persists to AsyncStorage', async () => {
    await renderAndWait();

    await act(async () => {
      await captured.toggleTheme();
    });

    expect(captured.isDark).toBe(true);
    const stored = await AsyncStorage.getItem('theme');
    expect(stored).toBe('dark');
  });

  it('persists autoSpeakDelay', async () => {
    await renderAndWait();

    await act(async () => {
      await captured.setAutoSpeakDelay(200);
    });

    expect(captured.autoSpeakDelay).toBe(200);
    const stored = await AsyncStorage.getItem('autoSpeakDelay');
    expect(stored).toBe('200');
  });

  it('clamps autoSpeakDelay minimum to 10ms', async () => {
    await renderAndWait();

    await act(async () => {
      await captured.setAutoSpeakDelay(1);
    });

    expect(captured.autoSpeakDelay).toBe(10);
  });

  it('persists user on login', async () => {
    await renderAndWait();

    await act(async () => {
      await captured.login('test@example.com', 'password');
    });

    expect(captured.user.email).toBe('test@example.com');
    expect(captured.user.name).toBe('test');
    const stored = await AsyncStorage.getItem('user');
    expect(JSON.parse(stored!).email).toBe('test@example.com');
  });

  it('clears user on logout', async () => {
    await renderAndWait();

    await act(async () => {
      await captured.login('test@example.com', 'password');
    });
    expect(captured.user).not.toBeNull();

    await act(async () => {
      await captured.logout();
    });

    expect(captured.user).toBeNull();
    const stored = await AsyncStorage.getItem('user');
    expect(stored).toBeNull();
  });

  it('restores theme from AsyncStorage on mount', async () => {
    await AsyncStorage.setItem('theme', 'dark');
    await renderAndWait();
    expect(captured.isDark).toBe(true);
  });

  it('restores autoSpeakDelay from AsyncStorage on mount', async () => {
    await AsyncStorage.setItem('autoSpeakDelay', '300');
    await renderAndWait();
    expect(captured.autoSpeakDelay).toBe(300);
  });

  it('restores user from AsyncStorage on mount', async () => {
    await AsyncStorage.setItem(
      'user',
      JSON.stringify({ name: 'Ahmed', email: 'ahmed@test.com' }),
    );
    await renderAndWait();
    expect(captured.user.name).toBe('Ahmed');
    expect(captured.user.email).toBe('ahmed@test.com');
  });

  it('handles corrupted user data in AsyncStorage gracefully', async () => {
    await AsyncStorage.setItem('user', 'NOT_JSON{');
    await renderAndWait();
    expect(captured.user).toBeNull();
  });

  it('updates user profile and persists', async () => {
    await renderAndWait();

    await act(async () => {
      await captured.login('test@example.com', 'password');
    });

    await act(async () => {
      await captured.updateUser({ imageUri: 'file:///photo.jpg' });
    });

    expect(captured.user.imageUri).toBe('file:///photo.jpg');
    const stored = await AsyncStorage.getItem('user');
    expect(JSON.parse(stored!).imageUri).toBe('file:///photo.jpg');
  });
});
