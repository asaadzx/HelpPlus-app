import { useState } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { TextInput, Button, Chip, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../src/context/ThemeContext';
import { useLanguage } from '../src/i18n';
import { Fonts, ICON_PRESETS, COLOR_PRESETS, TILE_PRESETS } from '../constants/theme';
import { renderIcon } from '../src/utils/icons';

export default function AddTileScreen() {
  const { colors } = useTheme();
  const { language, t } = useLanguage();
  const router = useRouter();
  const [labelAr, setLabelAr] = useState('');
  const [labelEn, setLabelEn] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(ICON_PRESETS[0]);
  const [selectedColor, setSelectedColor] = useState(COLOR_PRESETS[0]);

  const handleAdd = async () => {
    if (!labelAr.trim() && !labelEn.trim()) {
      Alert.alert(t('addTile.errorTitle'), t('addTile.errorNeedText'));
      return;
    }
    const card = {
      id: Date.now().toString() + Math.random().toString(36).slice(2, 7),
      labelAr: labelAr.trim(),
      labelEn: labelEn.trim(),
      icon: selectedIcon.name,
      iconProvider: selectedIcon.provider,
      color: selectedColor,
    };
    try {
      const saved = await AsyncStorage.getItem('customCards');
      const existing = saved ? JSON.parse(saved) : [];
      await AsyncStorage.setItem('customCards', JSON.stringify([...existing, card]));
    } catch {
      // storage write failed — card still created locally
    }
    router.back();
  };

  const handleQuickAdd = async (preset: (typeof TILE_PRESETS)[0]) => {
    const card = {
      id: Date.now().toString() + Math.random().toString(36).slice(2, 7),
      ...preset,
    };
    try {
      const saved = await AsyncStorage.getItem('customCards');
      const existing = saved ? JSON.parse(saved) : [];
      await AsyncStorage.setItem('customCards', JSON.stringify([...existing, card]));
    } catch {
      // storage write failed — card still created locally
    }
    router.back();
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text
        style={[
          styles.sectionTitle,
          { color: colors.text, fontFamily: language === 'ar' ? Fonts.arabic.bold : Fonts.english.bold },
        ]}
      >
        {t('addTile.quickAdd')}
      </Text>
      <View style={styles.quickAddGrid}>
        {TILE_PRESETS.map((preset, i) => (
          <Chip
            key={i}
            onPress={() => handleQuickAdd(preset)}
            style={[styles.quickAddChip, { backgroundColor: preset.color }]}
            textStyle={[
              styles.quickAddText,
              { color: colors.text, fontFamily: language === 'ar' ? Fonts.arabic.medium : Fonts.english.medium },
            ]}
          >
            {language === 'ar' ? preset.labelAr : preset.labelEn}
          </Chip>
        ))}
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <Text
        style={[
          styles.sectionTitle,
          { color: colors.text, fontFamily: language === 'ar' ? Fonts.arabic.bold : Fonts.english.bold },
        ]}
      >
        {t('addTile.createCustom')}
      </Text>

      <TextInput
        mode="outlined"
        label={t('addTile.arabicText')}
        value={labelAr}
        onChangeText={setLabelAr}
        placeholder={t('addTile.arabicPlaceholder')}
        style={styles.input}
        outlineColor={colors.border}
        activeOutlineColor={colors.primary}
        theme={{
          colors: { background: colors.white, onSurfaceVariant: colors.disabled },
        }}
        left={<TextInput.Icon icon="translate" color={colors.primary} />}
      />

      <TextInput
        mode="outlined"
        label={t('addTile.englishText')}
        value={labelEn}
        onChangeText={setLabelEn}
        placeholder={t('addTile.englishPlaceholder')}
        style={styles.input}
        outlineColor={colors.border}
        activeOutlineColor={colors.primary}
        theme={{
          colors: { background: colors.white, onSurfaceVariant: colors.disabled },
        }}
        left={<TextInput.Icon icon="translate" color={colors.secondary} />}
      />

      <Text
        style={[
          styles.label,
          { color: colors.muted, fontFamily: language === 'ar' ? Fonts.arabic.medium : Fonts.english.medium },
        ]}
      >
        {t('addTile.icon')}
      </Text>
      <View style={styles.iconGrid}>
        {ICON_PRESETS.map((icon, i) => {
          const isSelected = selectedIcon.name === icon.name;
          return (
            <TouchableOpacity
              key={i}
              style={[
                styles.iconOption,
                {
                  backgroundColor: isSelected
                    ? colors.primary
                    : colors.inputBg,
                },
              ]}
              onPress={() => setSelectedIcon(icon)}
            >
              {renderIcon(
                icon.provider,
                icon.name,
                24,
                isSelected ? colors.white : colors.text,
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <Text
        style={[
          styles.label,
          { color: colors.muted, fontFamily: language === 'ar' ? Fonts.arabic.medium : Fonts.english.medium },
        ]}
      >
        {t('addTile.color')}
      </Text>
      <View style={styles.colorGrid}>
        {COLOR_PRESETS.map((color, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.colorOption,
              {
                backgroundColor: color,
                borderColor:
                  selectedColor === color ? colors.text : colors.border,
                borderWidth: selectedColor === color ? 3 : 1,
              },
            ]}
            onPress={() => setSelectedColor(color)}
          />
        ))}
      </View>

      <Button
        mode="contained"
        onPress={handleAdd}
        style={styles.addButton}
        labelStyle={[styles.addButtonText, { fontFamily: language === 'ar' ? Fonts.arabic.bold : Fonts.english.bold }]}
        buttonColor={colors.action}
        icon="plus-circle"
      >
        {t('addTile.add')}
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  sectionTitle: { fontSize: 18, marginBottom: 12 },
  quickAddGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  quickAddChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  quickAddText: { fontSize: 14 },
  divider: { height: 1, marginVertical: 20 },
  label: { fontSize: 14, marginBottom: 6, marginTop: 8 },
  input: {
    marginBottom: 12,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  iconOption: {
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  addButton: {
    marginTop: 24,
    paddingVertical: 6,
  },
  addButtonText: { fontSize: 18 },
});
