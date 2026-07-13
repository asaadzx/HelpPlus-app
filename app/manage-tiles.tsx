import { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { Surface, Text, IconButton, Avatar, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../src/context/ThemeContext';
import { useLanguage } from '../src/i18n';
import { Fonts } from '../constants/theme';
import { PhraseCard } from '../src/types';
import { DEFAULT_CARDS } from '../src/data/defaults';
import { renderIcon } from '../src/utils/icons';

export default function ManageTilesScreen() {
  const { colors } = useTheme();
  const { language, t } = useLanguage();
  const [cards, setCards] = useState<PhraseCard[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    const saved = await AsyncStorage.getItem('customCards');
    const custom = saved ? JSON.parse(saved) : [];
    setCards([
      ...DEFAULT_CARDS,
      ...custom.map((c: PhraseCard) => ({ ...c, isDefault: false })),
    ]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCards();
    setRefreshing(false);
  };

  const deleteCard = (id: string) => {
    const card = cards.find((c) => c.id === id);
    if (card?.isDefault) {
      Alert.alert(t('manageTiles.deleteWarning'), t('manageTiles.cannotDelete'));
      return;
    }

    Alert.alert(t('manageTiles.deleteTitle'), `${t('manageTiles.deleteMessage')} "${language === 'ar' ? card?.labelAr : card?.labelEn}"?`, [
      { text: t('manageTiles.deleteCancel'), style: 'cancel' },
      {
        text: t('manageTiles.deleteConfirm'),
        style: 'destructive',
        onPress: async () => {
          const next = cards.filter((c) => c.id !== id);
          setCards(next);
          const customOnly = next.filter((c) => !c.isDefault);
          await AsyncStorage.setItem(
            'customCards',
            JSON.stringify(customOnly),
          );
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: PhraseCard }) => {
    return (
      <Surface style={styles.row} elevation={1}>
        <View style={styles.rowLeft}>
          <Avatar.Icon
            size={44}
            icon={() => renderIcon(item.iconProvider, item.icon, 24, colors.cardIcon)}
            style={[styles.iconCircle, { backgroundColor: item.color }]}
          />
          <View>
            <Text
              style={[
                styles.labelAr,
                { color: colors.text, fontFamily: language === 'ar' ? Fonts.arabic.bold : Fonts.english.bold },
              ]}
            >
              {language === 'ar' ? item.labelAr : item.labelEn}
            </Text>
            <Text
              style={[
                styles.labelEn,
                { color: colors.muted, fontFamily: language === 'ar' ? Fonts.english.regular : Fonts.arabic.regular },
              ]}
            >
              {language === 'ar' ? item.labelEn : item.labelAr}
            </Text>
          </View>
        </View>
        {!item.isDefault ? (
          <IconButton
            icon="delete-outline"
            size={22}
            iconColor={colors.emergency}
            onPress={() => deleteCard(item.id)}
          />
        ) : (
          <IconButton icon="lock" size={18} iconColor={colors.disabled} disabled />
        )}
      </Surface>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text
            style={[
              styles.header,
              { color: colors.muted, fontFamily: language === 'ar' ? Fonts.arabic.medium : Fonts.english.medium },
            ]}
          >
            {t('manageTiles.protected')}
          </Text>
        }
        ItemSeparatorComponent={() => <Divider />}
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

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 16 },
  header: { fontSize: 13, marginBottom: 12, textAlign: 'center' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelAr: { fontSize: 16 },
  labelEn: { fontSize: 12, marginTop: 2 },
});
