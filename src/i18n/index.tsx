import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language } from '../types';
import ar from './ar.json';
import en from './en.json';

const translations: Record<Language, Record<string, string>> = { ar, en };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'ar',
  setLanguage: () => {},
  t: (key: string) => key,
  isRTL: true,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ar');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('language');
      if (saved === 'ar' || saved === 'en') {
        setLanguageState(saved);
        const isRTL = saved === 'ar';
        I18nManager.allowRTL(isRTL);
        I18nManager.forceRTL(isRTL);
      }
      setLoaded(true);
    })();
  }, []);

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    await AsyncStorage.setItem('language', lang);
    const isRTL = lang === 'ar';
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations['ar'][key] || key;
  };

  const isRTL = language === 'ar';

  if (!loaded) return null;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
