import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MD3LightTheme } from 'react-native-paper';
import {
  LightColors,
  DarkColors,
  ThemeColors,
  getPaperLightTheme,
  getPaperDarkTheme,
} from '../../constants/theme';
import { User } from '../types';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  colors: ThemeColors;
  paperTheme: typeof MD3LightTheme;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  autoSpeakDelay: number;
  setAutoSpeakDelay: (ms: number) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
  colors: LightColors,
  paperTheme: getPaperLightTheme(),
  user: null,
  login: async () => false,
  logout: () => {},
  updateUser: () => {},
  autoSpeakDelay: 70,
  setAutoSpeakDelay: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [autoSpeakDelay, setAutoSpeakDelayState] = useState(70);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const vals = await AsyncStorage.multiGet([
          'theme',
          'user',
          'autoSpeakDelay',
        ]);
        if (vals[0][1]) setIsDark(vals[0][1] === 'dark');
        if (vals[1][1]) setUser(JSON.parse(vals[1][1]));
        if (vals[2][1]) setAutoSpeakDelayState(Number(vals[2][1]));
      } catch {
        // corrupted storage — keep defaults
      }
      setLoaded(true);
    })();
  }, []);

  const toggleTheme = async () => {
    const next = !isDark;
    setIsDark(next);
    try {
      await AsyncStorage.setItem('theme', next ? 'dark' : 'light');
    } catch {
      // storage write failed — state already updated
    }
  };

  const setAutoSpeakDelay = async (ms: number) => {
    const clamped = Math.max(10, ms);
    setAutoSpeakDelayState(clamped);
    try {
      await AsyncStorage.setItem('autoSpeakDelay', String(clamped));
    } catch {
      // storage write failed — state already updated
    }
  };

  const login = async (email: string, _password: string): Promise<boolean> => {
    const mockUser: User = { name: email.split('@')[0], email };
    setUser(mockUser);
    try {
      await AsyncStorage.setItem('user', JSON.stringify(mockUser));
    } catch {
      // storage write failed — state already updated
    }
    return true;
  };

  const logout = async () => {
    setUser(null);
    try {
      await AsyncStorage.removeItem('user');
    } catch {
      // storage remove failed — state already updated
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    const next = user ? { ...user, ...updates } : null;
    setUser(next);
    if (next) {
      try {
        await AsyncStorage.setItem('user', JSON.stringify(next));
      } catch {
        // storage write failed — state already updated
      }
    }
  };

  const paperTheme = isDark ? getPaperDarkTheme() : getPaperLightTheme();

  if (!loaded) return null;

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        toggleTheme,
        colors: isDark ? DarkColors : LightColors,
        paperTheme,
        user,
        login,
        logout,
        updateUser,
        autoSpeakDelay,
        setAutoSpeakDelay,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
