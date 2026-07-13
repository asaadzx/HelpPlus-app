# i18n Language Switching & Testing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Arabic/English language switching with RTL/LTR layout, bilingual tiles, TTS language support, and Jest testing infrastructure.

**Architecture:** Custom `LanguageContext` with JSON translation files, `I18nManager` for RTL, bilingual tile rendering, and `jest-expo` + React Native Testing Library for tests.

**Tech Stack:** React Native, Expo SDK 54, AsyncStorage, expo-updates, jest-expo, @testing-library/react-native

## Global Constraints

- Expo SDK 54, React 19.1, React Native 0.81
- TypeScript strict mode
- All files must pass `npx expo lint` and `npx tsc --noEmit`
- RTL requires app restart via `Updates.reloadAsync()`
- Language persisted to AsyncStorage under key `'language'`
- Default language: Arabic (`'ar'`)

---

### Task 1: Testing Infrastructure

**Files:**
- Modify: `package.json`
- Create: `jest.config.js`

**Interfaces:**
- Produces: `npm test` script, Jest configuration

- [ ] **Step 1: Install testing dependencies**

```bash
npx expo install jest-expo @testing-library/react-native @testing-library/jest-native
```

- [ ] **Step 2: Add test script to package.json**

In `package.json`, add to `"scripts"`:
```json
"test": "jest"
```

- [ ] **Step 3: Create jest.config.js**

```js
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterSetup: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|react-native-paper|react-native-vector-icons)',
  ],
};
```

- [ ] **Step 4: Verify Jest runs**

Run: `npx jest --passWithNoTests`
Expected: No tests found, exits cleanly

- [ ] **Step 5: Commit**

```bash
git add package.json jest.config.js package-lock.json
git commit -m "chore: add Jest testing infrastructure with jest-expo"
```

---

### Task 2: Translation Files

**Files:**
- Create: `src/i18n/ar.json`
- Create: `src/i18n/en.json`

**Interfaces:**
- Produces: Translation dictionaries consumed by LanguageContext `t()` function

- [ ] **Step 1: Create Arabic translations**

Create `src/i18n/ar.json`:

```json
{
  "tabs.home": "الرئيسية",
  "tabs.talk": "اكتب لتتحدث",
  "tabs.entertainment": "الترفيه",
  "tabs.settings": "الإعدادات",
  "layout.addTile": "إضافة كرت جديد",
  "layout.manageTiles": "إدارة الكروت",
  "home.greeting": "!أهلاً",
  "home.greetingFallback": "صديقي",
  "home.add": "إضافة",
  "home.ribbon.yes": "ايوه",
  "home.ribbon.no": "لأ",
  "home.ribbon.thanks": "شكراً",
  "home.ribbon.help": "النجدة",
  "home.ribbon.helpPhrase": "يا كابتن لو سمحت المساعدة",
  "talk.placeholder": "اكتب هنا...",
  "talk.clear": "مسح",
  "talk.say": "قُـول",
  "talk.quickPhrases.yes": "ايوه",
  "talk.quickPhrases.no": "لأ",
  "talk.quickPhrases.thanks": "شكراً",
  "talk.quickPhrases.help": "النجدة",
  "talk.quickPhrases.water": "عايز مية",
  "talk.quickPhrases.tired": "تعبان",
  "entertainment.news": "الأخبار",
  "entertainment.trivia": "الألعاب الذهنية",
  "entertainment.latestNews": "آخر الأخبار",
  "entertainment.noSources": "لا توجد مصادر أخبار",
  "entertainment.addSourcesHint": "أضف RSS feeds من الإعدادات",
  "entertainment.listen": "اسمع",
  "entertainment.triviaSubtitle": "اختبر ذكاءك وتمرن على التفكير",
  "entertainment.question": "السؤال",
  "entertainment.score": "النتيجة:",
  "entertainment.nextQuestion": "السؤال التالي",
  "entertainment.finalScore": "النتيجة النهائية:",
  "entertainment.playAgain": "العب مرة تانية",
  "entertainment.correctAnswer": "أحسنت! إجابة صحيحة",
  "entertainment.correctAnswerIs": "الإجابة الصحيحة هي:",
  "settings.login": "تسجيل الدخول",
  "settings.email": "البريد الإلكتروني",
  "settings.password": "كلمة المرور",
  "settings.loginButton": "دخول",
  "settings.userFallback": "مستخدم",
  "settings.themeDay": "النهاري",
  "settings.themeNight": "الليلي",
  "settings.autoSpeakDelay": "تأخير النطق التلقائي",
  "settings.delayPlaceholder": "أي رقم (الحد الأدنى 10)",
  "settings.manageCards": "إدارة الكروت",
  "settings.newsSources": "مصادر الأخبار (RSS)",
  "settings.addFromList": "أضف من القائمة:",
  "settings.addCustomLink": "أضف رابط مخصص:",
  "settings.logout": "تسجيل الخروج",
  "settings.language": "اللغة",
  "addTile.quickAdd": "إضافة سريعة",
  "addTile.createCustom": "إنشاء كرت مخصص",
  "addTile.arabicText": "النص بالعربي",
  "addTile.arabicPlaceholder": "مثال: عايز مية",
  "addTile.englishText": "النص بالإنجليزي",
  "addTile.englishPlaceholder": "e.g. I want water",
  "addTile.icon": "أيقونة",
  "addTile.color": "لون",
  "addTile.add": "إضافة",
  "manageTiles.protected": "الكروت الأساسية محمية ولا يمكن حذفها",
  "manageTiles.deleteWarning": "تنبيه",
  "manageTiles.cannotDelete": "لا يمكن حذف الكروت الأساسية",
  "manageTiles.deleteTitle": "حذف",
  "manageTiles.deleteMessage": "حذف",
  "manageTiles.deleteConfirm": "حذف",
  "manageTiles.deleteCancel": "إلغاء",
  "dialog.restartTitle": "تغيير اللغة",
  "dialog.restartMessage": "يجب إعادة تشغيل التطبيق لتطبيق التغييرات",
  "dialog.restart": "إعادة تشغيل",
  "dialog.cancel": "إلغاء",
  "trivia.q1": "ما هي عاصمة مصر؟",
  "trivia.q2": "كم عدد أرجل العنكبوت؟",
  "trivia.q3": "ما هو أكبر كوكب في المجموعة الشمسية؟",
  "trivia.q4": "ما هو اللون الذي ينتج من خلط الأحمر والأبيض؟",
  "trivia.q5": "كم عدد ألوان قوس قزح؟",
  "trivia.q6": "ما هو الحيوان الأسرع في العالم؟",
  "trivia.q7": "في أي قارة تقع مصر؟",
  "trivia.q8": "ما هو أكبر محيط في العالم؟"
}
```

- [ ] **Step 2: Create English translations**

Create `src/i18n/en.json`:

```json
{
  "tabs.home": "Home",
  "tabs.talk": "Type to Talk",
  "tabs.entertainment": "Entertainment",
  "tabs.settings": "Settings",
  "layout.addTile": "Add New Card",
  "layout.manageTiles": "Manage Cards",
  "home.greeting": "Hello!",
  "home.greetingFallback": "My Friend",
  "home.add": "Add",
  "home.ribbon.yes": "Yes",
  "home.ribbon.no": "No",
  "home.ribbon.thanks": "Thanks",
  "home.ribbon.help": "Help",
  "home.ribbon.helpPhrase": "Captain, please help me",
  "talk.placeholder": "Type here...",
  "talk.clear": "Clear",
  "talk.say": "Say It",
  "talk.quickPhrases.yes": "Yes",
  "talk.quickPhrases.no": "No",
  "talk.quickPhrases.thanks": "Thanks",
  "talk.quickPhrases.help": "Help",
  "talk.quickPhrases.water": "I want water",
  "talk.quickPhrases.tired": "I am tired",
  "entertainment.news": "News",
  "entertainment.trivia": "Brain Games",
  "entertainment.latestNews": "Latest News",
  "entertainment.noSources": "No news sources",
  "entertainment.addSourcesHint": "Add RSS feeds from Settings",
  "entertainment.listen": "Listen",
  "entertainment.triviaSubtitle": "Test your intelligence and practice thinking",
  "entertainment.question": "Question",
  "entertainment.score": "Score:",
  "entertainment.nextQuestion": "Next Question",
  "entertainment.finalScore": "Final Score:",
  "entertainment.playAgain": "Play Again",
  "entertainment.correctAnswer": "Well done! Correct answer",
  "entertainment.correctAnswerIs": "The correct answer is:",
  "settings.login": "Login",
  "settings.email": "Email Address",
  "settings.password": "Password",
  "settings.loginButton": "Login",
  "settings.userFallback": "User",
  "settings.themeDay": "Day Mode",
  "settings.themeNight": "Night Mode",
  "settings.autoSpeakDelay": "Auto-speak Delay",
  "settings.delayPlaceholder": "Any number (minimum 10)",
  "settings.manageCards": "Manage Cards",
  "settings.newsSources": "News Sources (RSS)",
  "settings.addFromList": "Add from list:",
  "settings.addCustomLink": "Add custom link:",
  "settings.logout": "Logout",
  "settings.language": "Language",
  "addTile.quickAdd": "Quick Add",
  "addTile.createCustom": "Create Custom Card",
  "addTile.arabicText": "Arabic Text",
  "addTile.arabicPlaceholder": "e.g. I want water",
  "addTile.englishText": "English Text",
  "addTile.englishPlaceholder": "e.g. I want water",
  "addTile.icon": "Icon",
  "addTile.color": "Color",
  "addTile.add": "Add",
  "manageTiles.protected": "Default cards are protected and cannot be deleted",
  "manageTiles.deleteWarning": "Warning",
  "manageTiles.cannotDelete": "Cannot delete default cards",
  "manageTiles.deleteTitle": "Delete",
  "manageTiles.deleteMessage": "Delete",
  "manageTiles.deleteConfirm": "Delete",
  "manageTiles.deleteCancel": "Cancel",
  "dialog.restartTitle": "Language Changed",
  "dialog.restartMessage": "Please restart the app to apply changes",
  "dialog.restart": "Restart",
  "dialog.cancel": "Cancel",
  "trivia.q1": "What is the capital of Egypt?",
  "trivia.q2": "How many legs does a spider have?",
  "trivia.q3": "What is the largest planet in the solar system?",
  "trivia.q4": "What color do you get from mixing red and white?",
  "trivia.q5": "How many colors are in a rainbow?",
  "trivia.q6": "What is the fastest animal in the world?",
  "trivia.q7": "Which continent is Egypt on?",
  "trivia.q8": "What is the largest ocean in the world?"
}
```

- [ ] **Step 3: Commit**

```bash
git add src/i18n/
git commit -m "feat: add Arabic and English translation JSON files"
```

---

### Task 3: LanguageContext

**Files:**
- Create: `src/i18n/index.ts`
- Modify: `src/types/index.ts`

**Interfaces:**
- Produces: `LanguageProvider`, `useLanguage()` hook with `{ language, setLanguage, t, isRTL }`
- Consumes: `ar.json`, `en.json` translations

- [ ] **Step 1: Add Language type to src/types/index.ts**

Add to the top of `src/types/index.ts`:

```ts
export type Language = 'ar' | 'en';
```

- [ ] **Step 2: Create LanguageContext**

Create `src/i18n/index.ts`:

```ts
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
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/types/index.ts src/i18n/index.ts
git commit -m "feat: add LanguageContext with t() function and RTL support"
```

---

### Task 4: Integrate LanguageProvider into App Layout

**Files:**
- Modify: `app/_layout.tsx`

**Interfaces:**
- Consumes: `LanguageProvider` from `src/i18n`

- [ ] **Step 1: Wrap app with LanguageProvider**

In `app/_layout.tsx`, add import and wrap the provider tree:

```ts
import { LanguageProvider } from '../src/i18n';
```

Wrap the outermost providers in `RootLayout`:

```tsx
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <ThemeProvider>
          <PaperProviderWrapper />
        </ThemeProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add app/_layout.tsx
git commit -m "feat: integrate LanguageProvider into app root layout"
```

---

### Task 5: Language Selector in Settings

**Files:**
- Modify: `app/(tabs)/settings.tsx`

**Interfaces:**
- Consumes: `useLanguage()` from `src/i18n`, `Language` type

- [ ] **Step 1: Add language selector above login gate**

In `app/(tabs)/settings.tsx`, add imports:

```ts
import { useLanguage } from '../../src/i18n';
import { Language } from '../../src/types';
import * as Updates from 'expo-updates';
```

Inside `SettingsScreen`, destructure from `useLanguage`:

```ts
const { language, setLanguage, t } = useLanguage();
```

Replace the return statement's outer `<ScrollView>` to include the language selector **before** the login gate check. The full logged-out view becomes:

```tsx
if (!loggedIn) {
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.centerContent}>
      <LanguageSelector language={language} setLanguage={setLanguage} t={t} colors={colors} />
      <Card style={styles.loginCard}>
        <Card.Content style={styles.loginCardContent}>
          <Avatar.Icon size={64} icon="account-circle" style={{ backgroundColor: colors.primary }} color={colors.white} />
          <Text style={[styles.loginTitle, { color: colors.text, fontFamily: Fonts.arabic.bold }]}>{t('settings.login')}</Text>

          <TextInput
            mode="outlined"
            label={t('settings.email')}
            value={email}
            onChangeText={setEmail}
            placeholder="example@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            outlineColor={colors.border}
            activeOutlineColor={colors.primary}
            theme={{ colors: { background: colors.white, onSurfaceVariant: colors.disabled } }}
            left={<TextInput.Icon icon="email" color={colors.primary} />}
          />

          <TextInput
            mode="outlined"
            label={t('settings.password')}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            style={styles.input}
            outlineColor={colors.border}
            activeOutlineColor={colors.primary}
            theme={{ colors: { background: colors.white, onSurfaceVariant: colors.disabled } }}
            left={<TextInput.Icon icon="lock" color={colors.primary} />}
          />

          <Button
            mode="contained"
            onPress={handleLogin}
            style={styles.loginButton}
            labelStyle={[styles.loginButtonText, { fontFamily: Fonts.arabic.bold }]}
            buttonColor={colors.primary}
          >
            {t('settings.loginButton')}
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}
```

- [ ] **Step 2: Add LanguageSelector component**

Add this component inside `settings.tsx` (before the default export):

```tsx
import { Alert } from 'react-native';
import * as Updates from 'expo-updates';

function LanguageSelector({
  language,
  setLanguage,
  t,
  colors,
}: {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  colors: any;
}) {
  const [visible, setVisible] = useState(false);

  const languages: { code: Language; label: string; nativeName: string }[] = [
    { code: 'ar', label: 'Arabic', nativeName: 'العربية' },
    { code: 'en', label: 'English', nativeName: 'English' },
  ];

  const handleLanguageChange = (lang: Language) => {
    setVisible(false);
    if (lang === language) return;
    setLanguage(lang);
    Alert.alert(
      t('dialog.restartTitle'),
      t('dialog.restartMessage'),
      [
        { text: t('dialog.cancel'), style: 'cancel' },
        { text: t('dialog.restart'), onPress: () => Updates.reloadAsync() },
      ],
    );
  };

  return (
    <Surface style={styles.languageRow} elevation={1}>
      <View style={styles.settingLeft}>
        <Ionicons name="language" size={22} color={colors.primary} />
        <Text style={[styles.settingLabel, { color: colors.text, fontFamily: Fonts.arabic.medium }]}>
          {t('settings.language')}
        </Text>
      </View>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <Button mode="outlined" onPress={() => setVisible(true)} style={styles.languageBtn}>
            {languages.find((l) => l.code === language)?.nativeName}
          </Button>
        }
      >
        {languages.map((lang) => (
          <Menu.Item
            key={lang.code}
            onPress={() => handleLanguageChange(lang.code)}
            title={lang.nativeName}
            leadingIcon={lang.code === language ? 'check' : undefined}
          />
        ))}
      </Menu>
    </Surface>
  );
}
```

Add the `Menu` import:
```ts
import { TextInput, Button, Switch, Card, Text, Avatar, Chip, IconButton, Surface, Menu } from 'react-native-paper';
```

- [ ] **Step 3: Add languageRow and languageBtn styles**

In the `styles` object in `settings.tsx`, add:

```ts
languageRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 16,
  borderRadius: 12,
  marginBottom: 12,
},
languageBtn: {
  minWidth: 100,
},
```

- [ ] **Step 4: Replace all hardcoded Arabic strings in settings with t() calls**

Replace each hardcoded string with its `t()` equivalent:
- `'تسجيل الدخول'` → `t('settings.login')`
- `'البريد الإلكتروني'` → `t('settings.email')`
- `'كلمة المرور'` → `t('settings.password')`
- `'دخول'` → `t('settings.loginButton')`
- `'مستخدم'` → `t('settings.userFallback')`
- `` `الوضع ${isDark ? 'الليلي' : 'النهاري'}` `` → `` `${t('settings.themeDay')} / ${t('settings.themeNight')}` `` (with isDark conditional)
- `'تأخير النطق التلقائي'` → `t('settings.autoSpeakDelay')`
- `'أي رقم (الحد الأدنى 10)'` → `t('settings.delayPlaceholder')`
- `'إدارة الكروت'` → `t('settings.manageCards')`
- `'مصادر الأخبار (RSS)'` → `t('settings.newsSources')`
- `'أضف من القائمة:'` → `t('settings.addFromList')`
- `'أضف رابط مخصص:'` → `t('settings.addCustomLink')`
- `'تسجيل الخروج'` → `t('settings.logout')`

- [ ] **Step 5: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 6: Commit**

```bash
git add app/(tabs)/settings.tsx
git commit -m "feat: add language selector to settings, translate all settings strings"
```

---

### Task 6: Tab Layout & Root Layout Translations

**Files:**
- Modify: `app/(tabs)/_layout.tsx`
- Modify: `app/_layout.tsx`

**Interfaces:**
- Consumes: `useLanguage()` from `src/i18n`

- [ ] **Step 1: Translate tab names in _layout.tsx**

In `app/(tabs)/_layout.tsx`, add:

```ts
import { useLanguage } from '../../src/i18n';
```

Inside `TabLayout`:

```ts
const { t } = useLanguage();
```

Replace tab titles:
- `title: 'الرئيسية'` → `title: t('tabs.home')`
- `title: 'اكتب لتتحدث'` → `title: t('tabs.talk')`
- `title: 'الترفيه'` → `title: t('tabs.entertainment')`
- `title: 'الإعدادات'` → `title: t('tabs.settings')`

- [ ] **Step 2: Translate modal titles in root _layout.tsx**

In `app/_layout.tsx`, add:

```ts
import { useLanguage } from '../src/i18n';
```

Inside `RootLayoutInner`, destructure:

```ts
const { t } = useLanguage();
```

Replace modal titles:
- `title: 'إضافة كرت جديد'` → `title: t('layout.addTile')`
- `title: 'إدارة الكروت'` → `title: t('layout.manageTiles')`

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add app/(tabs)/_layout.tsx app/_layout.tsx
git commit -m "feat: translate tab names and modal titles"
```

---

### Task 7: SmartDashboard Bilingual Tiles & TTS

**Files:**
- Modify: `app/(tabs)/index.tsx`

**Interfaces:**
- Consumes: `useLanguage()` from `src/i18n`

- [ ] **Step 1: Add language imports and destructuring**

In `app/(tabs)/index.tsx`:

```ts
import { useLanguage } from '../../src/i18n';
```

Inside `SmartDashboard`:

```ts
const { language, t, isRTL } = useLanguage();
```

- [ ] **Step 2: Make tiles bilingual**

In `renderTile`, replace the Text elements:

```tsx
<Text style={[styles.tileTextAr, { color: colors.text, fontFamily: Fonts.arabic.bold }]}>
  {item.labelAr}
</Text>
<Text style={[styles.tileTextEn, { color: colors.muted, fontFamily: Fonts.english.regular }]}>
  {item.labelEn}
</Text>
```

With:

```tsx
<Text style={[styles.tileTextPrimary, { color: colors.text, fontFamily: language === 'ar' ? Fonts.arabic.bold : Fonts.english.bold }]}>
  {language === 'ar' ? item.labelAr : item.labelEn}
</Text>
<Text style={[styles.tileTextSecondary, { color: colors.muted, fontFamily: language === 'ar' ? Fonts.english.regular : Fonts.arabic.regular }]}>
  {language === 'ar' ? item.labelEn : item.labelAr}
</Text>
```

Update styles — rename `tileTextAr` to `tileTextPrimary` and `tileTextEn` to `tileTextSecondary`, and set `textAlign` based on `isRTL`:

```ts
tileTextPrimary: { fontSize: 20, textAlign: 'center' },
tileTextSecondary: { fontSize: 14, textAlign: 'center', marginTop: 4 },
```

- [ ] **Step 3: Update TTS to use correct language**

In `onTilePress`:

```ts
const onTilePress = (phrase: string) => {
  const text = language === 'ar' ? item.labelAr : item.labelEn;
  setTimeout(() => {
    Speech.speak(text, { language: language === 'ar' ? 'ar' : 'en', pitch: 1.0, rate: 0.85 });
  }, autoSpeakDelay);
};
```

Wait — `onTilePress` doesn't have access to `item`. Let me fix. Change `onTilePress` to accept the full card:

```ts
const onTilePress = (card: PhraseCard) => {
  const text = language === 'ar' ? card.labelAr : card.labelEn;
  setTimeout(() => {
    Speech.speak(text, { language: language === 'ar' ? 'ar' : 'en', pitch: 1.0, rate: 0.85 });
  }, autoSpeakDelay);
};
```

Update the `TouchableRipple` `onPress`:

```ts
onPress={() => onTilePress(item)}
```

- [ ] **Step 4: Translate greeting and ribbon**

Replace the greeting:

```tsx
<Text style={[styles.greetingText, { color: colors.text, fontFamily: Fonts.arabic.bold }]}>
  !أهلاً {user?.name || 'صديقي'}
</Text>
```

With:

```tsx
<Text style={[styles.greetingText, { color: colors.text, fontFamily: language === 'ar' ? Fonts.arabic.bold : Fonts.english.bold }]}>
  {t('home.greeting')} {user?.name || t('home.greetingFallback')}
</Text>
```

Update `QuickRibbon` calls to use translated labels and TTS:

```tsx
<QuickRibbon
  label={t('home.ribbon.yes')}
  icon="checkmark-circle"
  bg={colors.action}
  textColor="#FFFFFF"
  onPress={() => Speech.speak(t('home.ribbon.yes'), { language: language === 'ar' ? 'ar' : 'en' })}
/>
<QuickRibbon
  label={t('home.ribbon.no')}
  icon="close-circle"
  bg={colors.emergency}
  textColor="#FFFFFF"
  onPress={() => Speech.speak(t('home.ribbon.no'), { language: language === 'ar' ? 'ar' : 'en' })}
/>
<QuickRibbon
  label={t('home.ribbon.thanks')}
  bg={colors.primary}
  textColor="#FFFFFF"
  onPress={() => Speech.speak(t('home.ribbon.thanks'), { language: language === 'ar' ? 'ar' : 'en' })}
/>
<QuickRibbon
  label={t('home.ribbon.help')}
  icon="alert-circle"
  bg={colors.secondary}
  textColor={colors.text}
  onPress={() => Speech.speak(t('home.ribbon.helpPhrase'), { language: language === 'ar' ? 'ar' : 'en' })}
/>
```

- [ ] **Step 5: Translate "Add" button**

```tsx
<Text style={[styles.addCardText, { color: colors.primary, fontFamily: Fonts.arabic.medium }]}>
  {t('home.add')}
</Text>
```

- [ ] **Step 6: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 7: Commit**

```bash
git add app/(tabs)/index.tsx
git commit -m "feat: bilingual tiles, translated greeting/ribbon, TTS language switching"
```

---

### Task 8: Talk Screen Translations & TTS

**Files:**
- Modify: `app/(tabs)/talk.tsx`

**Interfaces:**
- Consumes: `useLanguage()` from `src/i18n`

- [ ] **Step 1: Add language imports**

```ts
import { useLanguage } from '../../src/i18n';
```

Inside `TalkScreen`:

```ts
const { language, t } = useLanguage();
```

- [ ] **Step 2: Translate quick phrases**

Replace the hardcoded `QUICK_PHRASES` array with translations:

```ts
const quickPhrases = [
  { key: 'yes', ar: t('talk.quickPhrases.yes'), en: t('talk.quickPhrases.yes') },
  { key: 'no', ar: t('talk.quickPhrases.no'), en: t('talk.quickPhrases.no') },
  { key: 'thanks', ar: t('talk.quickPhrases.thanks'), en: t('talk.quickPhrases.thanks') },
  { key: 'help', ar: t('talk.quickPhrases.help'), en: t('talk.quickPhrases.help') },
  { key: 'water', ar: t('talk.quickPhrases.water'), en: t('talk.quickPhrases.water') },
  { key: 'tired', ar: t('talk.quickPhrases.tired'), en: t('talk.quickPhrases.tired') },
];
```

Wait — the quick phrases should show in both languages (bilingual). Let me reconsider. The quick phrase chips should show the phrase in the user's language, and speak in that language. Since these are short phrases, just show the translated version:

```ts
const quickPhrases = [
  t('talk.quickPhrases.yes'),
  t('talk.quickPhrases.no'),
  t('talk.quickPhrases.thanks'),
  t('talk.quickPhrases.help'),
  t('talk.quickPhrases.water'),
  t('talk.quickPhrases.tired'),
];
```

Update the chip rendering:

```tsx
{quickPhrases.map((phrase, i) => (
  <Chip
    key={i}
    onPress={() => setText((prev) => (prev ? `${prev} ${phrase}` : phrase))}
    style={styles.quickPill}
    textStyle={[styles.quickPillText, { color: colors.text, fontFamily: language === 'ar' ? Fonts.arabic.medium : Fonts.english.medium }]}
  >
    {phrase}
  </Chip>
))}
```

- [ ] **Step 3: Translate placeholder, buttons, and TTS**

Replace:
- `placeholder="اكتب هنا..."` → `placeholder={t('talk.placeholder')}`
- `مسح` → `{t('talk.clear')}`
- `قُـول` → `{t('talk.say')}`

Update TTS in `speak` and `handleTextChange`:

```ts
const speak = () => {
  if (!text.trim()) return;
  Speech.speak(text, { language: language === 'ar' ? 'ar' : 'en', pitch: 1.0, rate: 0.85 });
};
```

```ts
setTimeout(() => {
  Speech.speak(lastWord, { language: language === 'ar' ? 'ar' : 'en', pitch: 1.0, rate: 0.85 });
}, autoSpeakDelay);
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add app/(tabs)/talk.tsx
git commit -m "feat: translate talk screen, bilingual quick phrases, TTS language"
```

---

### Task 9: Entertainment Screen Translations

**Files:**
- Modify: `app/(tabs)/entertainment.tsx`

**Interfaces:**
- Consumes: `useLanguage()` from `src/i18n`

- [ ] **Step 1: Add language imports**

```ts
import { useLanguage } from '../../src/i18n';
```

Inside `EntertainmentHub`:

```ts
const { language, t } = useLanguage();
```

Pass `t` and `language` to `NewsTab` and `TriviaTab`.

- [ ] **Step 2: Translate NewsTab**

In `NewsTab` component, add `t` and `language` props. Replace:
- `آخر الأخبار 📰` → `{t('entertainment.latestNews')} 📰`
- `لا توجد مصادر أخبار` → `{t('entertainment.noSources')}`
- `أضف RSS feeds من الإعدادات` → `{t('entertainment.addSourcesHint')}`
- `اسمع` → `{t('entertainment.listen')}`

Update the speak button TTS:

```ts
onPress={() => Speech.speak(`${item.title}. ${item.description}`, { language: language === 'ar' ? 'ar' : 'en', rate: 0.85 })}
```

- [ ] **Step 3: Translate TriviaTab**

In `TriviaTab` component, add `t` and `language` props. Replace:
- `الألعاب الذهنية 🧠` → `{t('entertainment.trivia')} 🧠`
- `اختبر ذكاءك وتمرن على التفكير` → `{t('entertainment.triviaSubtitle')}`
- `السؤال` → `{t('entertainment.question')}`
- `النتيجة:` → `{t('entertainment.score')}`
- `السؤال التالي` → `{t('entertainment.nextQuestion')}`
- `النتيجة النهائية:` → `{t('entertainment.finalScore')}`
- `العب مرة تانية` → `{t('entertainment.playAgain')}`

Update trivia answer TTS:
```ts
Speech.speak(t('entertainment.correctAnswer'), { language: language === 'ar' ? 'ar' : 'en' });
```

```ts
Speech.speak(`${t('entertainment.correctAnswerIs')} ${q.options[q.correctIndex]}`, { language: language === 'ar' ? 'ar' : 'en' });
```

Update segmented buttons labels:
- `الأخبار` → `{t('entertainment.news')}`
- `الألعاب الذهنية` → `{t('entertainment.trivia')}`

- [ ] **Step 4: Translate trivia questions**

The trivia questions in `TRIVIA_QUESTIONS` are hardcoded in Arabic. Update `src/data/defaults.ts` to include translation keys:

```ts
export const TRIVIA_QUESTIONS: TriviaQuestion[] = [
  { id: '1', questionAr: 'ما هي عاصمة مصر؟', questionEn: 'What is the capital of Egypt?', options: ['القاهرة', 'الاسكندرية', 'الجيزة', 'أسوان'], optionsEn: ['Cairo', 'Alexandria', 'Giza', 'Aswan'], correctIndex: 0 },
  // ... etc for all 8 questions
];
```

Update `TriviaQuestion` type in `src/types/index.ts`:

```ts
export interface TriviaQuestion {
  id: string;
  questionAr: string;
  questionEn: string;
  options: string[];
  optionsEn: string[];
  correctIndex: number;
}
```

In the trivia rendering, use `language === 'ar' ? trivia.questionAr : trivia.questionEn` and same for options.

- [ ] **Step 5: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 6: Commit**

```bash
git add app/(tabs)/entertainment.tsx src/data/defaults.ts src/types/index.ts
git commit -m "feat: translate entertainment screen, bilingual trivia questions"
```

---

### Task 10: Add Tile & Manage Tiles Translations

**Files:**
- Modify: `app/add-tile.tsx`
- Modify: `app/manage-tiles.tsx`

**Interfaces:**
- Consumes: `useLanguage()` from `src/i18n`

- [ ] **Step 1: Translate add-tile.tsx**

Add `useLanguage` import and destructure `t` and `language`.

Replace all hardcoded strings:
- `إضافة سريعة` → `{t('addTile.quickAdd')}`
- `إنشاء كرت مخصص` → `{t('addTile.createCustom')}`
- `النص بالعربي` → `{t('addTile.arabicText')}`
- `مثال: عايز مية` → `{t('addTile.arabicPlaceholder')}`
- `النص بالإنجليزي` → `{t('addTile.englishText')}`
- `e.g. I want water` → `{t('addTile.englishPlaceholder')}`
- `أيقونة` → `{t('addTile.icon')}`
- `لون` → `{t('addTile.color')}`
- `إضافة` → `{t('addTile.add')}`

Update font families based on language:
```ts
fontFamily: language === 'ar' ? Fonts.arabic.bold : Fonts.english.bold
```

- [ ] **Step 2: Translate manage-tiles.tsx**

Add `useLanguage` import and destructure `t` and `language`.

Replace hardcoded strings:
- `الكروت الأساسية محمية ولا يمكن حذفها` → `{t('manageTiles.protected')}`
- `Alert.alert('تنبيه', 'لا يمكن حذف الكروت الأساسية')` → `Alert.alert(t('manageTiles.deleteWarning'), t('manageTiles.cannotDelete'))`
- `Alert.alert('حذف', ...)` → `Alert.alert(t('manageTiles.deleteTitle'), ...)`
- `'حذف'` (button) → `t('manageTiles.deleteConfirm')`
- `'إلغاء'` → `t('manageTiles.deleteCancel')`

Update bilingual tile display — show both `labelAr` and `labelEn` in the list:

```tsx
<Text style={[styles.labelAr, { color: colors.text, fontFamily: language === 'ar' ? Fonts.arabic.bold : Fonts.english.bold }]}>
  {language === 'ar' ? item.labelAr : item.labelEn}
</Text>
<Text style={[styles.labelEn, { color: colors.muted, fontFamily: language === 'ar' ? Fonts.english.regular : Fonts.arabic.regular }]}>
  {language === 'ar' ? item.labelEn : item.labelAr}
</Text>
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add app/add-tile.tsx app/manage-tiles.tsx
git commit -m "feat: translate add-tile and manage-tiles screens"
```

---

### Task 11: RTL Style Fixes

**Files:**
- Modify: `app/(tabs)/settings.tsx`
- Modify: `app/(tabs)/index.tsx`
- Modify: `app/(tabs)/entertainment.tsx`

**Interfaces:**
- Consumes: `isRTL` from `useLanguage()`

- [ ] **Step 1: Fix hardcoded right/left in settings.tsx**

The `cameraBadge` uses `right: '35%'`. Replace with conditional:

```ts
cameraBadge: {
  position: 'absolute',
  top: 20,
  ...(isRTL ? { right: '35%' } : { left: '35%' }),
},
```

Wait — StyleSheet.create doesn't have access to `isRTL` at creation time. We need to apply this as an inline style. Change the camera badge to:

```tsx
<IconButton
  icon="camera"
  size={12}
  iconColor={colors.white}
  style={[styles.cameraBadge, { backgroundColor: colors.secondary, right: isRTL ? '35%' : undefined, left: isRTL ? undefined : '35%' }]}
  onPress={pickImage}
/>
```

Fix `feedUrl` `marginRight` → conditional:
```tsx
<Text style={[styles.feedUrl, { color: colors.text, fontFamily: Fonts.english.regular, marginRight: isRTL ? 8 : undefined, marginLeft: isRTL ? undefined : 8 }]} numberOfLines={1}>
```

Fix `settingValue` `marginLeft` → conditional:
```tsx
<Text style={[styles.settingValue, { color: colors.primary, fontFamily: Fonts.english.bold, marginLeft: isRTL ? 'auto' : undefined, marginRight: isRTL ? undefined : 'auto' }]}>
```

- [ ] **Step 2: Fix textAlign in index.tsx**

In `renderTile`, the `tileTextPrimary` and `tileTextSecondary` styles use `textAlign: 'center'` which is fine for both directions. No change needed.

In the greeting, `textAlign: 'right'` should become conditional:
```ts
greetingText: {
  fontSize: 24,
  textAlign: 'right', // keep as-is since greeting is always at top
  marginBottom: 10,
},
```

Actually, greetings look fine centered or right-aligned in both languages. Keep as-is.

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add app/(tabs)/settings.tsx app/(tabs)/index.tsx app/(tabs)/entertainment.tsx
git commit -m "fix: conditional RTL/LTR positioning for hardcoded right/left styles"
```

---

### Task 12: Tests for LanguageContext

**Files:**
- Create: `src/i18n/__tests__/LanguageContext.test.tsx`

**Interfaces:**
- Consumes: `LanguageProvider`, `useLanguage` from `src/i18n`

- [ ] **Step 1: Create test file**

Create `src/i18n/__tests__/LanguageContext.test.tsx`:

```tsx
import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { LanguageProvider, useLanguage } from '../index';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LanguageProvider>{children}</LanguageProvider>
);

describe('LanguageContext', () => {
  it('defaults to Arabic', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    expect(result.current.language).toBe('ar');
    expect(result.current.isRTL).toBe(true);
  });

  it('t() returns Arabic translation for known key', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    expect(result.current.t('tabs.home')).toBe('الرئيسية');
  });

  it('t() returns key itself for unknown key', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    expect(result.current.t('unknown.key')).toBe('unknown.key');
  });

  it('switches language to English', async () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    await act(async () => {
      result.current.setLanguage('en');
    });
    expect(result.current.language).toBe('en');
    expect(result.current.isRTL).toBe(false);
    expect(result.current.t('tabs.home')).toBe('Home');
  });

  it('persists language to AsyncStorage', async () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    await act(async () => {
      result.current.setLanguage('en');
    });
    // AsyncStorage persistence is tested implicitly through the setLanguage function
    expect(result.current.language).toBe('en');
  });
});
```

- [ ] **Step 2: Run tests**

Run: `npx jest src/i18n/__tests__/LanguageContext.test.tsx`
Expected: All tests pass (may need to mock AsyncStorage)

- [ ] **Step 3: Add AsyncStorage mock if needed**

If AsyncStorage errors occur, add mock at top of test file:

```ts
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
```

- [ ] **Step 4: Run tests again**

Run: `npx jest src/i18n/__tests__/LanguageContext.test.tsx`
Expected: All tests pass

- [ ] **Step 5: Commit**

```bash
git add src/i18n/__tests__/
git commit -m "test: add LanguageContext tests"
```

---

### Task 13: Tests for SmartDashboard

**Files:**
- Create: `app/(tabs)/__tests__/index.test.tsx`

**Interfaces:**
- Consumes: `SmartDashboard` component, `LanguageProvider`, `ThemeProvider`

- [ ] **Step 1: Create test file**

Create `app/(tabs)/__tests__/index.test.tsx`:

```tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import { LanguageProvider } from '../../../src/i18n';
import { ThemeProvider } from '../../../src/context/ThemeContext';
import SmartDashboard from '../index';

const AllProviders = ({ children }: { children: React.ReactNode }) => (
  <LanguageProvider>
    <ThemeProvider>{children}</ThemeProvider>
  </LanguageProvider>
);

describe('SmartDashboard', () => {
  it('renders default tiles', () => {
    const { getByText } = render(<SmartDashboard />, { wrapper: AllProviders });
    expect(getByText('عايز أكل')).toBeTruthy();
    expect(getByText('عايز مية')).toBeTruthy();
  });

  it('shows bilingual labels in Arabic mode', () => {
    const { getByText } = render(<SmartDashboard />, { wrapper: AllProviders });
    expect(getByText('I want food')).toBeTruthy();
    expect(getByText('I want water')).toBeTruthy();
  });

  it('renders greeting', () => {
    const { getByText } = render(<SmartDashboard />, { wrapper: AllProviders });
    expect(getByText(/أهلاً/)).toBeTruthy();
  });

  it('renders quick action ribbon', () => {
    const { getByText } = render(<SmartDashboard />, { wrapper: AllProviders });
    expect(getByText('ايوه')).toBeTruthy();
    expect(getByText('لأ')).toBeTruthy();
    expect(getByText('شكراً')).toBeTruthy();
    expect(getByText('النجدة')).toBeTruthy();
  });

  it('renders add button', () => {
    const { getByText } = render(<SmartDashboard />, { wrapper: AllProviders });
    expect(getByText('إضافة')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Add necessary mocks**

Add at top of test file:

```ts
jest.mock('expo-speech', () => ({
  speak: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
  useLocalSearchParams: () => ({}),
}));
```

- [ ] **Step 3: Run tests**

Run: `npx jest app/(tabs)/__tests__/index.test.tsx`
Expected: All tests pass

- [ ] **Step 4: Commit**

```bash
git add app/(tabs)/__tests__/
git commit -m "test: add SmartDashboard tests for bilingual rendering"
```

---

### Task 14: Tests for Settings

**Files:**
- Create: `app/(tabs)/__tests__/settings.test.tsx`

**Interfaces:**
- Consumes: `SettingsScreen` component, `LanguageProvider`, `ThemeProvider`

- [ ] **Step 1: Create test file**

Create `app/(tabs)/__tests__/settings.test.tsx`:

```tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { LanguageProvider } from '../../../src/i18n';
import { ThemeProvider } from '../../../src/context/ThemeContext';
import SettingsScreen from '../settings';

const AllProviders = ({ children }: { children: React.ReactNode }) => (
  <LanguageProvider>
    <ThemeProvider>{children}</ThemeProvider>
  </LanguageProvider>
);

describe('SettingsScreen', () => {
  it('shows language selector without login', () => {
    const { getByText } = render(<SettingsScreen />, { wrapper: AllProviders });
    expect(getByText('اللغة')).toBeTruthy();
  });

  it('shows login form when not logged in', () => {
    const { getByText } = render(<SettingsScreen />, { wrapper: AllProviders });
    expect(getByText('تسجيل الدخول')).toBeTruthy();
  });

  it('shows login button', () => {
    const { getByText } = render(<SettingsScreen />, { wrapper: AllProviders });
    expect(getByText('دخول')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Add mocks**

Add at top:

```ts
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('expo-updates', () => ({
  reloadAsync: jest.fn(),
}));
```

- [ ] **Step 3: Run tests**

Run: `npx jest app/(tabs)/__tests__/settings.test.tsx`
Expected: All tests pass

- [ ] **Step 4: Commit**

```bash
git add app/(tabs)/__tests__/settings.test.tsx
git commit -m "test: add Settings screen tests for language selector"
```

---

### Task 15: Final Verification & Cleanup

**Files:**
- All modified files

**Interfaces:**
- N/A

- [ ] **Step 1: Run full typecheck**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 2: Run full lint**

Run: `npx expo lint`
Expected: No errors

- [ ] **Step 3: Run all tests**

Run: `npx jest`
Expected: All tests pass

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: final cleanup and verification"
git push
```
