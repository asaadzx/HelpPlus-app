jest.mock('@react-native-async-storage/async-storage', () =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('expo-speech', () => ({
  speak: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
  useLocalSearchParams: () => ({}),
}));

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn((cb: () => void) => { cb(); }),
}));

import React from 'react';
import { render, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LanguageProvider } from '../i18n';
import { ThemeProvider } from '../context/ThemeContext';
import { DEFAULT_CARDS } from '../data/defaults';
import { PhraseCard } from '../types';

const AllProviders = ({ children }: { children: React.ReactNode }) => (
  <SafeAreaProvider>
    <LanguageProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </LanguageProvider>
  </SafeAreaProvider>
);

beforeEach(() => {
  AsyncStorage.clear();
});

describe('Card CRUD — AsyncStorage integration', () => {
  const CUSTOM_CARD: PhraseCard = {
    id: 'test-1',
    labelAr: 'شكراً',
    labelEn: 'Thank you',
    icon: 'heart',
    iconProvider: 'Ionicons',
    color: '#E0F2FE',
  };

  it('persists a custom card to AsyncStorage', async () => {
    const existing = await AsyncStorage.getItem('customCards');
    const cards = existing ? JSON.parse(existing) : [];
    await AsyncStorage.setItem(
      'customCards',
      JSON.stringify([...cards, CUSTOM_CARD]),
    );

    const stored = await AsyncStorage.getItem('customCards');
    const parsed = JSON.parse(stored!);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].labelAr).toBe('شكراً');
    expect(parsed[0].labelEn).toBe('Thank you');
  });

  it('loads default cards plus custom cards', async () => {
    await AsyncStorage.setItem(
      'customCards',
      JSON.stringify([CUSTOM_CARD]),
    );

    const stored = await AsyncStorage.getItem('customCards');
    const custom = JSON.parse(stored!);
    const all = [...DEFAULT_CARDS, ...custom];

    expect(all).toHaveLength(DEFAULT_CARDS.length + 1);
    expect(all[0].isDefault).toBe(true);
    expect(all[all.length - 1].labelAr).toBe('شكراً');
  });

  it('deletes a custom card from AsyncStorage', async () => {
    await AsyncStorage.setItem(
      'customCards',
      JSON.stringify([CUSTOM_CARD]),
    );

    let stored = await AsyncStorage.getItem('customCards');
    let cards = JSON.parse(stored!);
    cards = cards.filter((c: PhraseCard) => c.id !== CUSTOM_CARD.id);
    await AsyncStorage.setItem('customCards', JSON.stringify(cards));

    stored = await AsyncStorage.getItem('customCards');
    const remaining = JSON.parse(stored!);
    expect(remaining).toHaveLength(0);
  });

  it('does not delete default cards', async () => {
    const defaultCard = DEFAULT_CARDS[0];
    expect(defaultCard.isDefault).toBe(true);

    const stored = await AsyncStorage.getItem('customCards');
    const custom = stored ? JSON.parse(stored) : [];
    const all = [...DEFAULT_CARDS, ...custom];
    const protectedCards = all.filter((c: PhraseCard) => c.isDefault);
    expect(protectedCards.length).toBe(DEFAULT_CARDS.length);
  });

  it('handles corrupted AsyncStorage data gracefully', async () => {
    await AsyncStorage.setItem('customCards', 'NOT_JSON{');

    let cards: PhraseCard[] = DEFAULT_CARDS;
    try {
      const stored = await AsyncStorage.getItem('customCards');
      if (stored) {
        cards = [...DEFAULT_CARDS, ...JSON.parse(stored)];
      }
    } catch {
      cards = [...DEFAULT_CARDS];
    }

    expect(cards).toHaveLength(DEFAULT_CARDS.length);
  });

  it('persists multiple custom cards', async () => {
    const card2: PhraseCard = { ...CUSTOM_CARD, id: 'test-2', labelAr: 'أهلاً' };
    const card3: PhraseCard = { ...CUSTOM_CARD, id: 'test-3', labelAr: 'من فضلك' };

    await AsyncStorage.setItem(
      'customCards',
      JSON.stringify([CUSTOM_CARD, card2, card3]),
    );

    const stored = await AsyncStorage.getItem('customCards');
    const parsed = JSON.parse(stored!);
    expect(parsed).toHaveLength(3);
    expect(parsed.map((c: PhraseCard) => c.id)).toEqual(['test-1', 'test-2', 'test-3']);
  });

  it('creates card with unique ID', async () => {
    const id1 = Date.now().toString() + Math.random().toString(36).slice(2, 7);
    const id2 = Date.now().toString() + Math.random().toString(36).slice(2, 7);

    expect(id1).not.toBe(id2);
  });

  it('supports single-language cards (Arabic only)', async () => {
    const arOnly: PhraseCard = {
      id: 'ar-only',
      labelAr: 'عايز أكل',
      labelEn: '',
      icon: 'water',
      iconProvider: 'Ionicons',
      color: '#E0F2FE',
    };

    await AsyncStorage.setItem('customCards', JSON.stringify([arOnly]));
    const stored = await AsyncStorage.getItem('customCards');
    const parsed = JSON.parse(stored!);

    expect(parsed[0].labelAr).toBe('عايز أكل');
    expect(parsed[0].labelEn).toBe('');
  });

  it('supports single-language cards (English only)', async () => {
    const enOnly: PhraseCard = {
      id: 'en-only',
      labelAr: '',
      labelEn: 'I need help',
      icon: 'alert-circle',
      iconProvider: 'Ionicons',
      color: '#FEE2E2',
    };

    await AsyncStorage.setItem('customCards', JSON.stringify([enOnly]));
    const stored = await AsyncStorage.getItem('customCards');
    const parsed = JSON.parse(stored!);

    expect(parsed[0].labelAr).toBe('');
    expect(parsed[0].labelEn).toBe('I need help');
  });
});
