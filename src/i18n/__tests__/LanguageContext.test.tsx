import React from 'react';
import { render, act } from '@testing-library/react-native';
import { Text } from 'react-native';
import { LanguageProvider, useLanguage } from '../index';

jest.mock('@react-native-async-storage/async-storage', () =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

let testResult: any = {};

function TestComponent() {
  const { language, t, isRTL, setLanguage } = useLanguage();
  testResult = { language, isRTL, t, setLanguage };
  return (
    <>
      <Text>{language}</Text>
      <Text>{t('tabs.home')}</Text>
    </>
  );
}

describe('LanguageContext', () => {
  beforeEach(() => { testResult = {}; });

  it('defaults to Arabic', async () => {
    await act(async () => {
      render(<LanguageProvider><TestComponent /></LanguageProvider>);
    });
    expect(testResult.language).toBe('ar');
    expect(testResult.isRTL).toBe(true);
  });

  it('t() returns Arabic translation for known key', async () => {
    await act(async () => {
      render(<LanguageProvider><TestComponent /></LanguageProvider>);
    });
    expect(testResult.t('tabs.home')).toBe('الرئيسية');
  });

  it('t() returns key itself for unknown key', async () => {
    await act(async () => {
      render(<LanguageProvider><TestComponent /></LanguageProvider>);
    });
    expect(testResult.t('unknown.key')).toBe('unknown.key');
  });

  it('switches language to English', async () => {
    await act(async () => {
      render(<LanguageProvider><TestComponent /></LanguageProvider>);
    });
    await act(async () => {
      testResult.setLanguage('en');
    });
    expect(testResult.language).toBe('en');
    expect(testResult.isRTL).toBe(false);
    expect(testResult.t('tabs.home')).toBe('Home');
  });
});
