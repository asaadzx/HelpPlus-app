import { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  TextInput,
  Button,
  Switch,
  Card,
  Text,
  Avatar,
  Chip,
  IconButton,
  Surface,
  Menu,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Updates from 'expo-updates';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../src/context/ThemeContext';
import { useLanguage } from '../../src/i18n';
import { Language } from '../../src/types';
import { Fonts } from '../../constants/theme';
import { PRESET_FEEDS } from '../../src/data/defaults';

export default function SettingsScreen() {
  const {
    colors,
    isDark,
    toggleTheme,
    user,
    login,
    logout,
    updateUser,
    autoSpeakDelay,
    setAutoSpeakDelay,
  } = useTheme();
  const { language, setLanguage, t, isRTL } = useLanguage();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(!!user);
  const [rssUrls, setRssUrls] = useState<string[]>([]);
  const [newFeedUrl, setNewFeedUrl] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadRss();
  }, []);

  const loadRss = async () => {
    const saved = await AsyncStorage.getItem('rssFeeds');
    if (saved) setRssUrls(JSON.parse(saved));
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRss();
    setRefreshing(false);
  };

  const handleLogin = async () => {
    if (!email || !password) return;
    const ok = await login(email, password);
    if (ok) setLoggedIn(true);
  };

  const handleLogout = () => {
    logout();
    setLoggedIn(false);
    setEmail('');
    setPassword('');
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      updateUser({ imageUri: result.assets[0].uri });
    }
  };

  const toggleRssFeed = (url: string) => {
    const next = rssUrls.includes(url)
      ? rssUrls.filter((u) => u !== url)
      : [...rssUrls, url];
    setRssUrls(next);
    AsyncStorage.setItem('rssFeeds', JSON.stringify(next));
  };

  const removeRssFeed = (index: number) => {
    const next = rssUrls.filter((_, idx) => idx !== index);
    setRssUrls(next);
    AsyncStorage.setItem('rssFeeds', JSON.stringify(next));
  };

  const addCustomFeed = () => {
    if (newFeedUrl.trim() && !rssUrls.includes(newFeedUrl.trim())) {
      const next = [...rssUrls, newFeedUrl.trim()];
      setRssUrls(next);
      AsyncStorage.setItem('rssFeeds', JSON.stringify(next));
      setNewFeedUrl('');
    }
  };

  if (!loggedIn) {
    return (
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.centerContent}
      >
        <LanguageSelector language={language} setLanguage={setLanguage} t={t} colors={colors} />
        <Card style={styles.loginCard}>
          <Card.Content style={styles.loginCardContent}>
            <Avatar.Icon
              size={64}
              icon="account-circle"
              style={{ backgroundColor: colors.primary }}
              color={colors.white}
            />
            <Text
              style={[
                styles.loginTitle,
                { color: colors.text, fontFamily: language === 'ar' ? Fonts.arabic.bold : Fonts.english.bold },
              ]}
            >
              {t('settings.login')}
            </Text>

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
              theme={{
                colors: {
                  background: colors.white,
                  onSurfaceVariant: colors.disabled,
                },
              }}
              left={
                <TextInput.Icon icon="email" color={colors.primary} />
              }
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
              theme={{
                colors: {
                  background: colors.white,
                  onSurfaceVariant: colors.disabled,
                },
              }}
              left={
                <TextInput.Icon icon="lock" color={colors.primary} />
              }
            />

            <Button
              mode="contained"
              onPress={handleLogin}
              style={styles.loginButton}
              labelStyle={[
                styles.loginButtonText,
                { fontFamily: language === 'ar' ? Fonts.arabic.bold : Fonts.english.bold },
              ]}
              buttonColor={colors.primary}
            >
              {t('settings.loginButton')}
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.primary]}
        />
      }
    >
      <Card style={styles.profileCard} onPress={pickImage}>
        <Card.Content style={styles.profileCardContent}>
          {user?.imageUri ? (
            <Avatar.Image size={88} source={{ uri: user.imageUri }} />
          ) : (
            <Avatar.Icon
              size={88}
              icon="account"
              style={{ backgroundColor: colors.primary }}
              color={colors.white}
            />
          )}
          <IconButton
            icon="camera"
            size={12}
            iconColor={colors.white}
            style={[styles.cameraBadge, { backgroundColor: colors.secondary }]}
            onPress={pickImage}
          />
          <Text
            style={[
              styles.userName,
              { color: colors.text, fontFamily: Fonts.arabic.bold },
            ]}
          >
            {user?.name || t('settings.userFallback')}
          </Text>
          <Text
            style={[
              styles.userEmail,
              { color: colors.muted, fontFamily: Fonts.english.regular },
            ]}
          >
            {user?.email}
          </Text>
        </Card.Content>
      </Card>

      <Surface style={styles.settingRow} elevation={1}>
        <View style={styles.settingLeft}>
          <Ionicons
            name={isDark ? 'moon' : 'sunny'}
            size={22}
            color={colors.primary}
          />
          <Text
            style={[
              styles.settingLabel,
              { color: colors.text, fontFamily: Fonts.arabic.medium },
            ]}
          >
            {isDark ? t('settings.themeNight') : t('settings.themeDay')}
          </Text>
        </View>
        <Switch value={isDark} onValueChange={toggleTheme} color={colors.primary} />
      </Surface>

      <Surface style={styles.settingRow} elevation={1}>
        <View style={styles.settingContent}>
          <View style={styles.settingLeft}>
            <Ionicons name="timer-outline" size={22} color={colors.primary} />
            <Text
              style={[
                styles.settingLabel,
                { color: colors.text, fontFamily: language === 'ar' ? Fonts.arabic.medium : Fonts.english.medium },
              ]}
            >
              {t('settings.autoSpeakDelay')}
            </Text>
            <Text
              style={[
                styles.settingValue,
                { color: colors.primary, fontFamily: Fonts.english.bold },
              ]}
            >
              {autoSpeakDelay}ms
            </Text>
          </View>
          <View style={styles.delayButtons}>
            {[10, 20, 30, 50, 70, 100, 200, 500].map((ms) => (
              <Chip
                key={ms}
                selected={autoSpeakDelay === ms}
                onPress={() => setAutoSpeakDelay(ms)}
                style={[
                  styles.delayChip,
                  {
                    backgroundColor:
                      autoSpeakDelay === ms ? colors.primary : colors.inputBg,
                  },
                ]}
                textStyle={[
                  styles.delayChipText,
                  {
                    color: autoSpeakDelay === ms ? colors.white : colors.text,
                    fontFamily: Fonts.english.regular,
                  },
                ]}
              >
                {ms}
              </Chip>
            ))}
          </View>
          <TextInput
            mode="outlined"
            value={String(autoSpeakDelay)}
            onChangeText={(t) => {
              const n = parseInt(t.replace(/[^0-9]/g, ''), 10);
              if (!isNaN(n)) setAutoSpeakDelay(n);
            }}
            keyboardType="number-pad"
            placeholder={t('settings.delayPlaceholder')}
            style={styles.delayInput}
            outlineColor={colors.border}
            activeOutlineColor={colors.primary}
            theme={{
              colors: {
                background: colors.inputBg,
                onSurfaceVariant: colors.disabled,
              },
            }}
          />
        </View>
      </Surface>

      <Surface style={styles.settingRow} elevation={1}>
        <View style={styles.settingLeft}>
          <Ionicons name="grid-outline" size={22} color={colors.secondary} />
          <Text
            style={[
              styles.settingLabel,
              { color: colors.text, fontFamily: language === 'ar' ? Fonts.arabic.medium : Fonts.english.medium },
            ]}
          >
            {t('settings.manageCards')}
          </Text>
        </View>
        <IconButton
          icon="chevron-right"
          size={20}
          iconColor={colors.muted}
          onPress={() => router.push('/manage-tiles')}
        />
      </Surface>

      <Card style={styles.sectionBox}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Ionicons name="newspaper-outline" size={22} color={colors.primary} />
            <Text
              style={[
                styles.settingLabel,
              { color: colors.text, fontFamily: language === 'ar' ? Fonts.arabic.bold : Fonts.english.bold },
            ]}
          >
            {t('settings.newsSources')}
            </Text>
          </View>

          {rssUrls.map((url, i) => (
            <View
              key={i}
              style={[styles.feedRow, { borderBottomColor: colors.border }]}
            >
              <Text
                style={[
                  styles.feedUrl,
                  { color: colors.text, fontFamily: Fonts.english.regular },
                ]}
                numberOfLines={1}
              >
                {url}
              </Text>
              <IconButton
                icon="close-circle"
                size={20}
                iconColor={colors.emergency}
                onPress={() => removeRssFeed(i)}
              />
            </View>
          ))}

          <Text
            style={[
              styles.presetLabel,
              { color: colors.muted, fontFamily: language === 'ar' ? Fonts.arabic.medium : Fonts.english.medium },
            ]}
          >
            {t('settings.addFromList')}
          </Text>
          <View style={styles.presetGrid}>
            {PRESET_FEEDS.map((preset) => {
              const added = rssUrls.includes(preset.url);
              return (
                <Chip
                  key={preset.url}
                  selected={added}
                  onPress={() => toggleRssFeed(preset.url)}
                  style={[
                    styles.presetChip,
                    {
                      backgroundColor: added
                        ? colors.action
                        : colors.inputBg,
                    },
                  ]}
                  textStyle={[
                    styles.presetChipText,
                    {
                      color: added ? colors.white : colors.text,
                      fontFamily: Fonts.english.regular,
                    },
                  ]}
                >
                  {preset.label}
                </Chip>
              );
            })}
          </View>

          <Text
            style={[
              styles.presetLabel,
              { color: colors.muted, fontFamily: language === 'ar' ? Fonts.arabic.medium : Fonts.english.medium },
            ]}
          >
            {t('settings.addCustomLink')}
          </Text>
          <View style={styles.customFeedRow}>
            <TextInput
              mode="outlined"
              value={newFeedUrl}
              onChangeText={setNewFeedUrl}
              placeholder="https://example.com/rss.xml"
              autoCapitalize="none"
              keyboardType="url"
              style={styles.customFeedInput}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              theme={{
                colors: {
                  background: colors.inputBg,
                  onSurfaceVariant: colors.disabled,
                },
              }}
            />
            <IconButton
              icon="plus"
              mode="contained"
              onPress={addCustomFeed}
              style={styles.addFeedBtn}
              iconColor={colors.white}
              containerColor={colors.primary}
            />
          </View>
        </Card.Content>
      </Card>

      <Surface style={styles.settingRow} elevation={1}>
        <View style={styles.settingLeft}>
          <Ionicons name="log-out-outline" size={22} color={colors.emergency} />
          <Text
            style={[
              styles.settingLabel,
              { color: colors.emergency, fontFamily: language === 'ar' ? Fonts.arabic.medium : Fonts.english.medium },
            ]}
          >
            {t('settings.logout')}
          </Text>
        </View>
        <IconButton
          icon="logout"
          size={20}
          iconColor={colors.emergency}
          onPress={handleLogout}
        />
      </Surface>
    </ScrollView>
  );
}

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
        <Text style={[styles.settingLabel, { color: colors.text, fontFamily: language === 'ar' ? Fonts.arabic.medium : Fonts.english.medium }]}>
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

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContent: { justifyContent: 'center', padding: 24 },
  scrollContent: { padding: 20 },
  loginCard: {
    borderRadius: 20,
    padding: 8,
  },
  loginCardContent: {
    gap: 4,
  },
  loginTitle: {
    fontSize: 22,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  loginButton: {
    paddingVertical: 4,
    marginTop: 8,
  },
  loginButtonText: { fontSize: 18 },
  profileCard: {
    marginBottom: 16,
  },
  profileCardContent: {
    alignItems: 'center',
    padding: 24,
  },
  cameraBadge: {
    position: 'absolute',
    top: 20,
    right: '35%',
  },
  userName: { fontSize: 20, marginTop: 12 },
  userEmail: { fontSize: 14, marginTop: 4 },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  settingContent: {
    flex: 1,
    gap: 10,
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingLabel: { fontSize: 16 },
  settingValue: { fontSize: 16, marginLeft: 'auto' },
  sectionBox: { borderRadius: 12, marginBottom: 12 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  feedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  feedUrl: { flex: 1, marginRight: 8, fontSize: 12 },
  presetLabel: { fontSize: 13, marginTop: 12, marginBottom: 8 },
  presetGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  presetChip: { paddingHorizontal: 12, paddingVertical: 6 },
  presetChipText: { fontSize: 12 },
  customFeedRow: { flexDirection: 'row', gap: 8 },
  customFeedInput: { flex: 1 },
  addFeedBtn: { minWidth: 48 },
  delayButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  delayChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  delayChipText: { fontSize: 13 },
  delayInput: {
    marginTop: 8,
  },
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
});
