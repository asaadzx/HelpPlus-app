import { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, FlatList, RefreshControl } from 'react-native';
import { Surface, Text, IconButton, TouchableRipple } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../src/context/ThemeContext';
import { useLanguage } from '../../src/i18n';
import { Fonts } from '../../constants/theme';
import { PhraseCard } from '../../src/types';
import { DEFAULT_CARDS } from '../../src/data/defaults';
import { renderIcon } from '../../src/utils/icons';

const { width } = Dimensions.get('window');

const COLUMN_COUNT = 2;
const GRID_PADDING = 16;
const CARD_GAP = 10;
const CARD_WIDTH = (width - GRID_PADDING * 2 - CARD_GAP * (COLUMN_COUNT - 1)) / COLUMN_COUNT;
const CARD_HEIGHT = CARD_WIDTH * 1.05;

function darkenColor(hex: string, factor = 0.4): string {
  const h = hex.replace('#', '');
  const r = Math.round(parseInt(h.substring(0, 2), 16) * (1 - factor));
  const g = Math.round(parseInt(h.substring(2, 4), 16) * (1 - factor));
  const b = Math.round(parseInt(h.substring(4, 6), 16) * (1 - factor));
  return `rgb(${r},${g},${b})`;
}

export default function SmartDashboard() {
  const { colors, user, autoSpeakDelay, isDark } = useTheme();
  const { language, t } = useLanguage();
  const router = useRouter();
  const params = useLocalSearchParams<{ newTile?: string }>();
  const [cards, setCards] = useState<PhraseCard[]>(DEFAULT_CARDS);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCards();
  }, []);

  useEffect(() => {
    if (params.newTile) {
      try {
        const newTile = JSON.parse(params.newTile);
        const card: PhraseCard = { id: Date.now().toString(), ...newTile };
        setCards((prev) => {
          const next = [...prev, card];
          const custom = next.filter(
            (c) => !DEFAULT_CARDS.find((d) => d.id === c.id),
          );
          AsyncStorage.setItem('customCards', JSON.stringify(custom));
          return next;
        });
      } catch {
        // Invalid JSON from navigation params — ignore
      }
    }
  }, [params.newTile]);

  const loadCards = async () => {
    const saved = await AsyncStorage.getItem('customCards');
    if (saved) {
      setCards([...DEFAULT_CARDS, ...JSON.parse(saved)]);
    } else {
      setCards([...DEFAULT_CARDS]);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCards();
    setRefreshing(false);
  };

  const onTilePress = (card: PhraseCard) => {
    const text = language === 'ar' ? card.labelAr : card.labelEn;
    setTimeout(() => {
      Speech.speak(text, { language: language === 'ar' ? 'ar' : 'en', pitch: 1.0, rate: 0.85 });
    }, autoSpeakDelay);
  };

  const renderTile = ({ item }: { item: PhraseCard }) => {
    return (
      <TouchableRipple
        key={item.id}
        onPress={() => onTilePress(item)}
        style={styles.tileWrapper}
      >
        <Surface
          style={[styles.tileCard, { backgroundColor: isDark ? darkenColor(item.color) : item.color }]}
          elevation={2}
        >
          <View style={styles.iconPlacement}>
            {renderIcon(item.iconProvider, item.icon, 48, colors.cardIcon)}
          </View>
          <Text
            style={[
              styles.tileTextPrimary,
              { color: colors.text, fontFamily: language === 'ar' ? Fonts.arabic.bold : Fonts.english.bold },
            ]}
          >
            {language === 'ar' ? item.labelAr : item.labelEn}
          </Text>
          <Text
            style={[
              styles.tileTextSecondary,
              { color: colors.muted, fontFamily: language === 'ar' ? Fonts.english.regular : Fonts.arabic.regular },
            ]}
          >
            {language === 'ar' ? item.labelEn : item.labelAr}
          </Text>
        </Surface>
      </TouchableRipple>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        numColumns={COLUMN_COUNT}
        ListHeaderComponent={
          <View style={styles.greetingRow}>
            <Text
              style={[
                styles.greetingText,
              { color: colors.text, fontFamily: language === 'ar' ? Fonts.arabic.bold : Fonts.english.bold },
              ]}
            >
              {t('home.greeting')} {user?.name || t('home.greetingFallback')}
            </Text>
            <View style={styles.ribbonWrapper}>
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
                onPress={() =>
                  Speech.speak(t('home.ribbon.helpPhrase'), {
                    language: language === 'ar' ? 'ar' : 'en',
                  })
                }
              />
            </View>
          </View>
        }
        ListFooterComponent={
          <TouchableRipple
            onPress={() => router.push('/add-tile')}
            style={styles.tileWrapper}
          >
            <Surface
              style={[
                styles.tileCard,
                styles.addCard,
                { backgroundColor: colors.inputBg },
              ]}
              elevation={0}
            >
              <IconButton
                icon="plus-circle-outline"
                size={48}
                iconColor={colors.primary}
                onPress={() => router.push('/add-tile')}
              />
              <Text
                style={[
                  styles.addCardText,
                  { color: colors.primary, fontFamily: language === 'ar' ? Fonts.arabic.medium : Fonts.english.medium },
                ]}
              >
                {t('home.add')}
              </Text>
            </Surface>
          </TouchableRipple>
        }
        contentContainerStyle={styles.gridContainer}
        columnWrapperStyle={styles.row}
        renderItem={renderTile}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
      />
    </View>
  );
}

function QuickRibbon({
  label,
  icon,
  bg,
  textColor,
  onPress,
}: {
  label: string;
  icon?: string;
  bg: string;
  textColor: string;
  onPress: () => void;
}) {
  return (
    <View style={[styles.ribbonPill, { backgroundColor: bg }]}>
      {icon && (
        <Ionicons name={icon as any} size={20} color={textColor} />
      )}
      <Text
        style={[
          styles.ribbonPillText,
          { fontFamily: Fonts.arabic.bold, color: textColor },
        ]}
        onPress={onPress}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  greetingRow: {
    paddingHorizontal: GRID_PADDING,
    paddingTop: 12,
    paddingBottom: 8,
  },
  greetingText: {
    fontSize: 24,
    textAlign: 'right',
    marginBottom: 10,
  },
  ribbonWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'flex-end',
  },
  ribbonPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  ribbonPillText: { fontSize: 18 },
  gridContainer: {
    padding: GRID_PADDING,
    paddingBottom: 32,
  },
  row: {
    justifyContent: 'space-between',
  },
  tileWrapper: {
    width: CARD_WIDTH,
    marginBottom: CARD_GAP,
  },
  tileCard: {
    width: '100%',
    height: CARD_HEIGHT,
    borderRadius: 18,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconPlacement: { marginBottom: 10 },
  tileTextPrimary: { fontSize: 20, textAlign: 'center' },
  tileTextSecondary: { fontSize: 14, textAlign: 'center', marginTop: 4 },
  addCard: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#E2E8F0',
  },
  addCardText: { fontSize: 16, marginTop: 2 },
});
