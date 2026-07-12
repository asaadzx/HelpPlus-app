import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, FlatList, RefreshControl } from 'react-native';
import { Surface, Text, IconButton, TouchableRipple } from 'react-native-paper';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../src/context/ThemeContext';
import { Fonts } from '../../constants/theme';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 2;
const GRID_PADDING = 16;
const CARD_GAP = 10;
const CARD_WIDTH = (width - GRID_PADDING * 2 - CARD_GAP * (COLUMN_COUNT - 1)) / COLUMN_COUNT;
const CARD_HEIGHT = CARD_WIDTH * 1.05;

const iconMap: Record<string, any> = { Ionicons, MaterialCommunityIcons };

interface PhraseCard {
  id: string;
  labelAr: string;
  labelEn: string;
  icon: string;
  iconProvider: 'Ionicons' | 'MaterialCommunityIcons';
  color: string;
}

const DEFAULT_CARDS: PhraseCard[] = [
  { id: '1', labelAr: 'عايز أكل', labelEn: 'I want food', icon: 'silverware-fork-knife', iconProvider: 'MaterialCommunityIcons', color: '#E0F2FE' },
  { id: '2', labelAr: 'عايز مية', labelEn: 'I want water', icon: 'water', iconProvider: 'Ionicons', color: '#E0F2FE' },
  { id: '3', labelAr: 'الدوا', labelEn: 'Medicine', icon: 'pill', iconProvider: 'MaterialCommunityIcons', color: '#FEF3C7' },
  { id: '4', labelAr: 'الحمام', labelEn: 'Restroom', icon: 'toilet', iconProvider: 'MaterialCommunityIcons', color: '#E0F2FE' },
  { id: '5', labelAr: 'تعبان', labelEn: 'I am tired', icon: 'emoticon-sad-outline', iconProvider: 'MaterialCommunityIcons', color: '#FEE2E2' },
  { id: '6', labelAr: 'شاي', labelEn: 'Tea', icon: 'coffee', iconProvider: 'MaterialCommunityIcons', color: '#E0F2FE' },
];

export default function SmartDashboard() {
  const { colors, user, autoSpeakDelay } = useTheme();
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
          const custom = next.filter((c) => !DEFAULT_CARDS.find((d) => d.id === c.id));
          AsyncStorage.setItem('customCards', JSON.stringify(custom));
          return next;
        });
      } catch {}
    }
  }, [params.newTile]);

  const loadCards = async () => {
    const saved = await AsyncStorage.getItem('customCards');
    if (saved) setCards([...DEFAULT_CARDS, ...JSON.parse(saved)]);
    else setCards([...DEFAULT_CARDS]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCards();
    setRefreshing(false);
  };

  const onTilePress = (phrase: string) => {
    setTimeout(() => {
      Speech.speak(phrase, { language: 'ar', pitch: 1.0, rate: 0.85 });
    }, autoSpeakDelay);
  };

  const renderTile = ({ item }: { item: PhraseCard }) => {
    const IconComp = iconMap[item.iconProvider];
    return (
      <TouchableRipple onPress={() => onTilePress(item.labelAr)} style={styles.tileWrapper}>
        <Surface
          style={[styles.tileCard, { backgroundColor: item.color }]}
          elevation={2}
        >
          <View style={styles.iconPlacement}>
            <IconComp name={item.icon} size={48} color={colors.text} />
          </View>
          <Text style={[styles.tileTextAr, { color: colors.text, fontFamily: Fonts.arabic.bold }]}>
            {item.labelAr}
          </Text>
          <Text style={[styles.tileTextEn, { color: colors.muted, fontFamily: Fonts.english.regular }]}>
            {item.labelEn}
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
            <Text style={[styles.greetingText, { color: colors.text, fontFamily: Fonts.arabic.bold }]}>
              !أهلاً {user?.name || 'صديقي'}
            </Text>
            <View style={styles.ribbonWrapper}>
              <View style={[styles.ribbonPill, { backgroundColor: colors.action }]}>
                <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                <Text style={[styles.ribbonPillText, { fontFamily: Fonts.arabic.bold, color: '#FFFFFF' }]} onPress={() => Speech.speak('ايوه', { language: 'ar' })}>ايوه</Text>
              </View>
              <View style={[styles.ribbonPill, { backgroundColor: colors.emergency }]}>
                <Ionicons name="close-circle" size={20} color="#FFFFFF" />
                <Text style={[styles.ribbonPillText, { fontFamily: Fonts.arabic.bold, color: '#FFFFFF' }]} onPress={() => Speech.speak('لأ', { language: 'ar' })}>لأ</Text>
              </View>
              <View style={[styles.ribbonPill, { backgroundColor: colors.primary }]}>
                <Text style={[styles.ribbonPillText, { fontFamily: Fonts.arabic.bold, color: '#FFFFFF' }]} onPress={() => Speech.speak('شكرا', { language: 'ar' })}>شكراً</Text>
              </View>
              <View style={[styles.ribbonPill, { backgroundColor: colors.secondary }]}>
                <Ionicons name="alert-circle" size={20} color={colors.text} />
                <Text style={[styles.ribbonPillText, { fontFamily: Fonts.arabic.bold, color: colors.text }]} onPress={() => Speech.speak('يا كابتن لو سمحت المساعدة', { language: 'ar' })}>النجدة</Text>
              </View>
            </View>
          </View>
        }
        ListFooterComponent={
          <TouchableRipple onPress={() => router.push('/add-tile')} style={styles.tileWrapper}>
            <Surface
              style={[styles.tileCard, styles.addCard, { backgroundColor: colors.inputBg }]}
              elevation={0}
            >
              <IconButton
                icon="plus-circle-outline"
                size={48}
                iconColor={colors.primary}
                onPress={() => router.push('/add-tile')}
              />
              <Text style={[styles.addCardText, { color: colors.primary, fontFamily: Fonts.arabic.medium }]}>
                إضافة
              </Text>
            </Surface>
          </TouchableRipple>
        }
        contentContainerStyle={styles.gridContainer}
        columnWrapperStyle={styles.row}
        renderItem={renderTile}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
      />
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
  tileTextAr: { fontSize: 20, textAlign: 'center' },
  tileTextEn: { fontSize: 14, textAlign: 'center', marginTop: 4 },
  addCard: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#E2E8F0',
  },
  addCardText: { fontSize: 16, marginTop: 2 },
});
