import { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert, RefreshControl } from 'react-native';
import { Surface, Text, IconButton, Avatar, Divider } from 'react-native-paper';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../src/context/ThemeContext';
import { Fonts } from '../constants/theme';

const iconMap: Record<string, any> = { Ionicons, MaterialCommunityIcons };

interface PhraseCard {
  id: string;
  labelAr: string;
  labelEn: string;
  icon: string;
  iconProvider: 'Ionicons' | 'MaterialCommunityIcons';
  color: string;
  isDefault?: boolean;
}

const DEFAULT_CARDS: PhraseCard[] = [
  { id: '1', labelAr: 'عايز أكل', labelEn: 'I want food', icon: 'silverware-fork-knife', iconProvider: 'MaterialCommunityIcons', color: '#E0F2FE', isDefault: true },
  { id: '2', labelAr: 'عايز مية', labelEn: 'I want water', icon: 'water', iconProvider: 'Ionicons', color: '#E0F2FE', isDefault: true },
  { id: '3', labelAr: 'الدوا', labelEn: 'Medicine', icon: 'pill', iconProvider: 'MaterialCommunityIcons', color: '#FEF3C7', isDefault: true },
  { id: '4', labelAr: 'الحمام', labelEn: 'Restroom', icon: 'toilet', iconProvider: 'MaterialCommunityIcons', color: '#E0F2FE', isDefault: true },
  { id: '5', labelAr: 'تعبان', labelEn: 'I am tired', icon: 'emoticon-sad-outline', iconProvider: 'MaterialCommunityIcons', color: '#FEE2E2', isDefault: true },
  { id: '6', labelAr: 'شاي', labelEn: 'Tea', icon: 'coffee', iconProvider: 'MaterialCommunityIcons', color: '#E0F2FE', isDefault: true },
];

export default function ManageTilesScreen() {
  const { colors } = useTheme();
  const [cards, setCards] = useState<PhraseCard[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    const saved = await AsyncStorage.getItem('customCards');
    const custom = saved ? JSON.parse(saved) : [];
    setCards([...DEFAULT_CARDS, ...custom.map((c: PhraseCard) => ({ ...c, isDefault: false }))]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCards();
    setRefreshing(false);
  };

  const deleteCard = (id: string) => {
    const card = cards.find((c) => c.id === id);
    if (card?.isDefault) {
      Alert.alert('تنبيه', 'لا يمكن حذف الكروت الأساسية');
      return;
    }
    Alert.alert('حذف', `حذف "${card?.labelAr}"؟`, [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'حذف',
        style: 'destructive',
        onPress: async () => {
          const next = cards.filter((c) => c.id !== id);
          setCards(next);
          const customOnly = next.filter((c) => !c.isDefault);
          await AsyncStorage.setItem('customCards', JSON.stringify(customOnly));
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: PhraseCard }) => {
    const IconComp = iconMap[item.iconProvider];
    return (
      <Surface style={[styles.row]} elevation={1}>
        <View style={styles.rowLeft}>
          <Avatar.Icon
            size={44}
            icon={() => <IconComp name={item.icon} size={24} color={colors.text} />}
            style={[styles.iconCircle, { backgroundColor: item.color }]}
          />
          <View>
            <Text style={[styles.labelAr, { color: colors.text, fontFamily: Fonts.arabic.bold }]}>{item.labelAr}</Text>
            <Text style={[styles.labelEn, { color: colors.muted, fontFamily: Fonts.english.regular }]}>{item.labelEn}</Text>
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
          <IconButton
            icon="lock"
            size={18}
            iconColor={colors.disabled}
            disabled
          />
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
          <Text style={[styles.header, { color: colors.muted, fontFamily: Fonts.arabic.medium }]}>
            الكروت الأساسية محمية ولا يمكن حذفها
          </Text>
        }
        ItemSeparatorComponent={() => <Divider />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
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
