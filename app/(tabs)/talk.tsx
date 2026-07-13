import { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { TextInput, Button, Chip, Surface } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { useTheme } from '../../src/context/ThemeContext';
import { Fonts } from '../../constants/theme';

const QUICK_PHRASES = [
  { ar: 'ايوه', en: 'Yes' },
  { ar: 'لأ', en: 'No' },
  { ar: 'شكراً', en: 'Thanks' },
  { ar: 'النجدة', en: 'Help' },
  { ar: 'عايز مية', en: 'Water' },
  { ar: 'تعبان', en: 'Tired' },
];

export default function TalkScreen() {
  const { colors, autoSpeakDelay } = useTheme();
  const [text, setText] = useState('');

  const speak = () => {
    if (!text.trim()) return;
    Speech.speak(text, { language: 'ar', pitch: 1.0, rate: 0.85 });
  };

  const handleTextChange = (value: string) => {
    setText(value);
    if (value.trim().length > 0 && value.endsWith(' ')) {
      const words = value.trim().split(' ');
      const lastWord = words[words.length - 1];
      setTimeout(() => {
        Speech.speak(lastWord, { language: 'ar', pitch: 1.0, rate: 0.85 });
      }, autoSpeakDelay);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Surface style={styles.quickSection} elevation={0}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickScroll}
        >
          {QUICK_PHRASES.map((p, i) => (
            <Chip
              key={i}
              onPress={() =>
                setText((prev) => (prev ? `${prev} ${p.ar}` : p.ar))
              }
              style={styles.quickPill}
              textStyle={[
                styles.quickPillText,
                { color: colors.text, fontFamily: Fonts.arabic.medium },
              ]}
            >
              {p.ar}
            </Chip>
          ))}
        </ScrollView>
      </Surface>

      <View style={styles.inputArea}>
        <TextInput
          mode="outlined"
          value={text}
          onChangeText={handleTextChange}
          placeholder="اكتب هنا..."
          multiline
          textAlignVertical="top"
          style={[styles.textInput, { fontFamily: Fonts.arabic.medium }]}
          outlineColor={colors.border}
          activeOutlineColor={colors.primary}
          theme={{
            colors: { background: colors.white, onSurfaceVariant: colors.disabled },
          }}
        />
      </View>

      <View style={styles.actions}>
        <Button
          mode="outlined"
          onPress={() => setText('')}
          icon={() => (
            <Ionicons name="trash-outline" size={20} color={colors.emergency} />
          )}
          style={[styles.clearBtn, { borderColor: colors.border }]}
          labelStyle={[
            styles.clearBtnText,
            { color: colors.emergency, fontFamily: Fonts.arabic.medium },
          ]}
        >
          مسح
        </Button>

        <Button
          mode="contained"
          onPress={speak}
          disabled={!text.trim()}
          icon={() => (
            <Ionicons name="volume-medium" size={24} color={colors.white} />
          )}
          style={[
            styles.speakBtn,
            {
              backgroundColor: text.trim() ? colors.action : colors.disabled,
            },
          ]}
          labelStyle={[styles.speakBtnText, { fontFamily: Fonts.arabic.bold }]}
          buttonColor={text.trim() ? colors.action : colors.disabled}
        >
          قُـول
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  quickSection: {
    paddingVertical: 10,
  },
  quickScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  quickPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  quickPillText: { fontSize: 14 },
  inputArea: {
    flex: 1,
    padding: 16,
  },
  textInput: {
    flex: 1,
    borderRadius: 16,
    fontSize: 22,
    textAlignVertical: 'top',
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 12,
  },
  clearBtn: {
    flex: 0.3,
    paddingVertical: 4,
  },
  clearBtnText: { fontSize: 16 },
  speakBtn: {
    flex: 1,
    paddingVertical: 4,
  },
  speakBtnText: { fontSize: 18 },
});
