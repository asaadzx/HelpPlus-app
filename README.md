# معًا (HelpPlus)

An assistive communication app for stroke patients, built with Expo + React Native + React Native Paper.

## Features

- **Smart Dashboard** — 2-column tile grid with instant Arabic TTS on tap
- **Quick Actions** — yes/no/thanks/help buttons for instant communication
- **Type-to-Talk** — free typing with auto-speak on spacebar + quick phrase pills
- **Custom Tiles** — create your own communication cards (Arabic + English, icon, color)
- **Manage Tiles** — view and delete custom tiles, defaults are locked
- **Entertainment Hub** — RSS news reader + Arabic trivia game
- **Dark / Light Mode** — full theme toggle persisted to AsyncStorage
- **Auto-Speak Delay** — configurable 10ms–500ms delay for TTS
- **Profile** — login/logout + profile image picker
- **Pull-to-Refresh** — refresh tiles, news, and settings by pulling down
- **News Caching** — RSS feeds cached for instant display, background refresh

## Screens

| Screen | Description |
|--------|-------------|
| الرئيسية | Tile grid + quick action ribbon |
| اكتب لتتحدث | Free typing with auto-speak |
| الترفيه | RSS news + trivia game |
| الإعدادات | Login, theme, RSS feeds, tile management |

## Tech Stack

- Expo SDK 54 + React Native 0.81
- React Native Paper (Material Design 3)
- expo-router (file-based navigation)
- expo-speech (Arabic TTS)
- expo-av, expo-sqlite, expo-image-picker
- AsyncStorage (persistence)
- Tajawal (Arabic) + Fredoka (English) fonts

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Run on Android (USB)
adb reverse tcp:8081 tcp:8081
npx expo start --android
```

## Project Structure

```
app/
  (tabs)/
    _layout.tsx          # Bottom tab navigator
    index.tsx            # Home — tile grid
    talk.tsx             # Type-to-Talk
    entertainment.tsx    # News + trivia
    settings.tsx         # Settings + auth
  add-tile.tsx           # Create custom tile
  manage-tiles.tsx       # Delete custom tiles
  _layout.tsx            # Root layout + providers
src/
  context/
    ThemeContext.tsx      # Theme + auth + settings state
constants/
  theme.ts               # Colors, fonts, Paper MD3 theme
```

## Roadmap

- [ ] Smart Predictive AI Suggestion Bar
- [ ] Emergency SOS Trigger (shake/volume)
- [ ] Google Play Store release
- [ ] F-Droid open-source distribution
- [ ] SQLite-backed tile storage
- [ ] Real backend auth
- [ ] Caregiver dashboard
