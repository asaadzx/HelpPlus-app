# Design: Internationalization (i18n) & Testing

**Date:** 2026-07-13
**Status:** Approved
**Scope:** Language switching (Arabic/English), RTL/LTR layout, bilingual tiles, TTS language, testing setup

---

## Overview

Add language selection (Arabic/English) to the HelpPlus app with RTL/LTR layout switching, bilingual tile display, TTS language support, and a foundational testing setup.

## Requirements

1. Language selector in Settings — accessible without login
2. Bilingual tile labels — show both languages, primary language bold/large, secondary smaller/muted
3. TTS switches language — speaks Arabic when Arabic selected, English when English selected
4. Layout flips RTL/LTR — Arabic = RTL, English = LTR
5. Language preference persists across app restarts (AsyncStorage)
6. Dropdown language selector for future language additions
7. Testing setup with Jest + React Native Testing Library

## Architecture

### File Structure

```
src/
  i18n/
    index.ts              # LanguageContext, useLanguage hook, t() function
    ar.json               # Arabic translations (~75 keys)
    en.json               # English translations (~75 keys)
  types/
    index.ts              # Language type added
  data/
    defaults.ts           # (existing) bilingual default cards
  utils/
    icons.tsx             # (existing)
    rss.ts                # (existing)
```

### Translation Files (ar.json / en.json)

Flat key structure with dot-notation namespacing:

```json
{
  "tabs.home": "الرئيسية",
  "tabs.talk": "اكتب لتتحدث",
  "tabs.entertainment": "الترفيه",
  "tabs.settings": "الإعدادات",
  "home.greeting": "!أهلاً",
  "home.greetingFallback": "صديقي",
  "home.add": "إضافة",
  "home.ribbon.yes": "ايوه",
  "home.ribbon.no": "لأ",
  "home.ribbon.thanks": "شكراً",
  "home.ribbon.help": "النجدة",
  "home.ribbon.helpPhrase": "يا كابتن لو سمحت المساعدة",
  "settings.login": "تسجيل الدخول",
  "settings.email": "البريد الإلكتروني",
  "settings.password": "كلمة المرور",
  "settings.loginButton": "دخول",
  "settings.userFallback": "مستخدم",
  "settings.themeDay": "النهاري",
  "settings.themeNight": "الليلي",
  "settings.autoSpeakDelay": "تأخير النطق التلقائي",
  "settings.manageCards": "إدارة الكروت",
  "settings.newsSources": "مصادر الأخبار (RSS)",
  "settings.addFromList": "أضف من القائمة:",
  "settings.addCustomLink": "أضف رابط مخصص:",
  "settings.logout": "تسجيل الخروج",
  "talk.placeholder": "اكتب هنا...",
  "talk.clear": "مسح",
  "talk.say": "قُـول",
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
  "manageTiles.deleteConfirm": "حذف",
  "manageTiles.deleteCancel": "إلغاء",
  "dialog.restartTitle": "تغيير اللغة",
  "dialog.restartMessage": "يجب إعادة تشغيل التطبيق لتطبيق التغييرات",
  "dialog.restart": "إعادة تشغيل",
  "dialog.cancel": "إلغاء"
}
```

### LanguageContext

```ts
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}
```

- `t(key)` looks up the key in the current language's JSON file
- Falls back to Arabic if key not found
- `setLanguage` persists to AsyncStorage, updates `I18nManager`, shows restart alert

### RTL/LTR Layout Handling

React Native's `I18nManager.forceRTL(bool)` + `I18nManager.allowRTL(bool)` flips the entire layout.

On language change:
1. Update context state
2. Call `I18nManager.allowRTL(isRTL)` and `I18nManager.forceRTL(isRTL)`
3. Persist to AsyncStorage
4. Show restart alert using `Updates.reloadAsync()` from `expo-updates`

Hardcoded `textAlign: 'right'` replaced with conditional styles:
```ts
{ textAlign: isRTL ? 'right' : 'left' }
```

### Settings Screen Changes

Language selector (dropdown) added above the login gate — always visible:

```
┌─────────────────────┐
│  اللغة / Language    │
│  [ العربية ▼ ]       │
├─────────────────────┤
│  Login Card         │  ← Only if not logged in
└─────────────────────┘
```

Available languages shown with native names:
- العربية (Arabic)
- English

### Bilingual Tiles

`PhraseCard` already has `labelAr` and `labelEn`. The tile component picks primary/secondary based on language:

**Arabic selected:** `labelAr` large + bold, `labelEn` smaller + muted
**English selected:** `labelEn` large + bold, `labelAr` smaller + muted

### TTS Language Switching

All `Speech.speak()` calls use `language` from context:
- Arabic mode: `{ language: 'ar', rate: 0.85 }`
- English mode: `{ language: 'en', rate: 0.85 }`

Tiles speak `labelAr` in Arabic mode, `labelEn` in English mode.
Quick phrases pick from the `ar`/`en` field based on language.

### Default Cards Update

Default cards and tile presets will have both `labelAr` and `labelEn` (already present). No data changes needed — the rendering logic handles language selection.

## Testing Setup

### Dependencies

- `jest-expo` — Expo-compatible Jest preset
- `@testing-library/react-native` — component testing
- `@testing-library/jest-native` — custom matchers

### Configuration

`jest.config.js`:
```js
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterSetup: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|react-native-paper|react-native-vector-icons)',
  ],
};
```

### Test Script

`package.json`:
```json
"scripts": {
  "test": "jest"
}
```

### Test Files

```
src/i18n/__tests__/LanguageContext.test.tsx
app/(tabs)/__tests__/index.test.tsx
app/(tabs)/__tests__/settings.test.tsx
src/context/__tests__/ThemeContext.test.tsx
```

### Example Tests

**LanguageContext:**
- defaults to Arabic
- switches language and persists to AsyncStorage
- t() returns correct translation
- isRTL flips on language change

**SmartDashboard:**
- renders default tiles
- shows bilingual labels based on language
- ribbon phrases use correct language

**Settings:**
- language selector visible without login
- changes language on selection
- shows restart alert

**ThemeContext:**
- toggles dark/light mode
- persists preference

## Scope

### In Scope
- Language switching (Arabic/English)
- RTL/LTR layout flip
- Bilingual tile display
- TTS language switching
- Language persistence (AsyncStorage)
- Restart prompt on language change
- Jest + RNTL testing setup
- Example tests for core features

### Out of Scope
- Additional languages beyond Arabic/English (architecture supports it, but only 2 languages included)
- Content translation of tile labels (user-created tiles stay as-is)
- Locale-aware date/number formatting
- Pluralization or complex interpolation

## Risks

1. **RTL requires restart** — React Native's I18nManager needs app restart for full layout flip. Mitigated with restart alert + `Updates.reloadAsync()`.
2. **Icon positioning** — some icons use hardcoded `right` positioning (e.g., camera badge). Will need conditional `left`/`right` based on `isRTL`.
3. **Test setup complexity** — Expo + Jest can have transform issues with some dependencies. Mitigated with `jest-expo` preset and careful `transformIgnorePatterns`.
