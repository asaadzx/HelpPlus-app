import { useState, useRef, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { TextInput, Button, Chip, Surface } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { useTheme } from '../../src/context/ThemeContext';
import { useLanguage } from '../../src/i18n';
import { Fonts } from '../../constants/theme';

export default function TalkScreen() {
  const { colors, autoSpeakDelay } = useTheme();
  const { language, t } = useLanguage();
  const [text, setText] = useState('');
  const prevLenRef = useRef(0);

  useEffect(() => {
    prevLenRef.current = text.length;
  }, [text]);

  const quickPhrases = [
    t('talk.quickPhrases.yes'),
    t('talk.quickPhrases.no'),
    t('talk.quickPhrases.thanks'),
    t('talk.quickPhrases.help'),
    t('talk.quickPhrases.water'),
    t('talk.quickPhrases.tired'),
  ];

  const speak = () => {
    if (!text.trim()) return;
    try {
      Speech.speak(text, { language: language === 'ar' ? 'ar' : 'en', pitch: 1.0, rate: 0.85 });
    } catch {}
  };

  const handleTextChange = (value: string) => {
    const isAdding = value.length > prevLenRef.current;
    setText(value);
    prevLenRef.current = value.length;
    if (isAdding && value.trim().length > 0 && value.endsWith(' ')) {
      const words = value.trim().split(' ');
      const lastWord = words[words.length - 1];
      setTimeout(() => {
        try {
          Speech.speak(lastWord, { language: language === 'ar' ? 'ar' : 'en', pitch: 1.0, rate: 0.85 });
        } catch {}
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
          {quickPhrases.map((phrase, i) => (
            <Chip
              key={i}
              onPress={() =>
                setText((prev) => (prev ? `${prev} ${phrase}` : phrase))
              }
              style={styles.quickPill}
              textStyle={[
                styles.quickPillText,
                { color: colors.text, fontFamily: language === 'ar' ? Fonts.arabic.medium : Fonts.english.medium },
              ]}
            >
              {phrase}
            </Chip>
          ))}
        </ScrollView>
      </Surface>

      <View style={styles.inputArea}>
        <TextInput
          mode="outlined"
          value={text}
          onChangeText={handleTextChange}
          placeholder={t('talk.placeholder')}
          multiline
          textAlignVertical="top"
          style={[styles.textInput, { fontFamily: language === 'ar' ? Fonts.arabic.medium : Fonts.english.medium }]}
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
            { color: colors.emergency, fontFamily: language === 'ar' ? Fonts.arabic.medium : Fonts.english.medium },
          ]}
        >
          {t('talk.clear')}
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
          labelStyle={[styles.speakBtnText, { fontFamily: language === 'ar' ? Fonts.arabic.bold : Fonts.english.bold }]}
          buttonColor={text.trim() ? colors.action : colors.disabled}
        >
          {t('talk.say')}
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
