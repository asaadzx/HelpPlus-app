import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, ScrollView, Linking, RefreshControl } from 'react-native';
import { Surface, Text, Button, Card, Chip, ActivityIndicator, IconButton, SegmentedButtons } from 'react-native-paper';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../src/context/ThemeContext';
import { Fonts } from '../../constants/theme';

interface TriviaQuestion {
  id: string;
  questionAr: string;
  options: string[];
  correctIndex: number;
}

interface FeedItem {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  feedTitle: string;
}

const TRIVIA_QUESTIONS: TriviaQuestion[] = [
  { id: '1', questionAr: 'ما هي عاصمة مصر؟', options: ['القاهرة', 'الاسكندرية', 'الجيزة', 'أسوان'], correctIndex: 0 },
  { id: '2', questionAr: 'كم عدد أرجل العنكبوت؟', options: ['6', '8', '10', '12'], correctIndex: 1 },
  { id: '3', questionAr: 'ما هو أكبر كوكب في المجموعة الشمسية؟', options: ['زحل', 'المشتري', 'نبتون', 'أورانوس'], correctIndex: 1 },
  { id: '4', questionAr: 'ما هو اللون الذي ينتج من خلط الأحمر والأبيض؟', options: ['برتقالي', 'بنفسجي', 'وردي', 'بني'], correctIndex: 2 },
  { id: '5', questionAr: 'كم عدد ألوان قوس قزح؟', options: ['5', '6', '7', '8'], correctIndex: 2 },
  { id: '6', questionAr: 'ما هو الحيوان الأسرع في العالم؟', options: ['الأسد', 'الفهد', 'الحصان', 'النسر'], correctIndex: 1 },
  { id: '7', questionAr: 'في أي قارة تقع مصر؟', options: ['آسيا', 'أوروبا', 'أفريقيا', 'أمريكا الجنوبية'], correctIndex: 2 },
  { id: '8', questionAr: 'ما هو أكبر محيط في العالم؟', options: ['الأطلسي', 'الهندي', 'الهادئ', 'المتجمد الشمالي'], correctIndex: 2 },
];

function parseRSS(xml: string, feedTitle: string): FeedItem[] {
  const items: FeedItem[] = [];
  const itemMatches = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];
  for (const item of itemMatches.slice(0, 10)) {
    const title = (item.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) || item.match(/<title>([\s\S]*?)<\/title>/))?.[1]?.trim() || '';
    const description = (item.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) || item.match(/<description>([\s\S]*?)<\/description>/))?.[1]?.replace(/<[^>]*>/g, '').trim() || '';
    const link = (item.match(/<link>([\s\S]*?)<\/link>/))?.[1]?.trim() || '';
    const pubDate = (item.match(/<pubDate>([\s\S]*?)<\/pubDate>/))?.[1]?.trim() || '';
    if (title) {
      items.push({ id: `${feedTitle}-${items.length}`, title, description: description.slice(0, 200), link, pubDate, feedTitle });
    }
  }
  return items;
}

export default function EntertainmentHub() {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<'news' | 'trivia'>('news');
  const [feeds, setFeeds] = useState<FeedItem[]>([]);
  const [loadingFeeds, setLoadingFeeds] = useState(false);
  const [currentTrivia, setCurrentTrivia] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [rssUrls, setRssUrls] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('rssFeeds');
      if (saved) setRssUrls(JSON.parse(saved));
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const cached = await AsyncStorage.getItem('rssFeedsCache');
      if (cached) setFeeds(JSON.parse(cached));
    })();
  }, []);

  const fetchFeeds = useCallback(async (showLoader = true) => {
    if (rssUrls.length === 0) return;
    if (showLoader) setLoadingFeeds(true);

    try {
      const results = await Promise.allSettled(
        rssUrls.map(async (url) => {
          const res = await fetch(url);
          const text = await res.text();
          const feedTitle = url.includes('npr') ? 'NPR' : url.includes('bbc') ? 'BBC' : url.includes('megaphone') ? 'Megaphone' : 'Feed';
          return parseRSS(text, feedTitle);
        })
      );

      const allItems: FeedItem[] = [];
      for (const result of results) {
        if (result.status === 'fulfilled') {
          allItems.push(...result.value);
        }
      }
      const sorted = allItems.sort((a, b) => (b.pubDate > a.pubDate ? 1 : -1));
      setFeeds(sorted);
      AsyncStorage.setItem('rssFeedsCache', JSON.stringify(sorted));
    } catch {}

    setLoadingFeeds(false);
  }, [rssUrls]);

  useEffect(() => {
    fetchFeeds(false);
  }, [fetchFeeds]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFeeds(false);
    setRefreshing(false);
  };

  const handleTriviaAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    setShowResult(true);
    const q = TRIVIA_QUESTIONS[currentTrivia];
    if (index === q.correctIndex) {
      setScore((s) => s + 1);
      Speech.speak('أحسنت! إجابة صحيحة', { language: 'ar' });
    } else {
      Speech.speak(`الإجابة الصحيحة هي: ${q.options[q.correctIndex]}`, { language: 'ar' });
    }
  };

  const nextTrivia = () => {
    if (currentTrivia < TRIVIA_QUESTIONS.length - 1) {
      setCurrentTrivia((c) => c + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const resetTrivia = () => {
    setCurrentTrivia(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
  };

  const trivia = TRIVIA_QUESTIONS[currentTrivia];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
    >
      <SegmentedButtons
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as 'news' | 'trivia')}
        buttons={[
          {
            value: 'news',
            label: 'الأخبار',
            icon: () => <Ionicons name="newspaper" size={18} color={activeTab === 'news' ? colors.white : colors.muted} />,
          },
          {
            value: 'trivia',
            label: 'الألعاب الذهنية',
            icon: () => <MaterialCommunityIcons name="brain" size={18} color={activeTab === 'trivia' ? colors.white : colors.muted} />,
          },
        ]}
        style={styles.segmentedControl}
      />

      {activeTab === 'news' ? (
        <>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: Fonts.arabic.bold }]}>آخر الأخبار 📰</Text>
            <IconButton
              icon="refresh"
              size={22}
              iconColor={colors.primary}
              onPress={() => fetchFeeds()}
            />
          </View>

          {rssUrls.length === 0 ? (
            <Surface style={[styles.emptyState]} elevation={0}>
              <Ionicons name="cloud-offline" size={48} color={colors.disabled} />
              <Text style={[styles.emptyText, { color: colors.muted, fontFamily: Fonts.arabic.medium }]}>لا توجد مصادر أخبار</Text>
              <Text style={[styles.emptySub, { color: colors.disabled, fontFamily: Fonts.arabic.regular }]}>أضف RSS feeds من الإعدادات</Text>
            </Surface>
          ) : loadingFeeds ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
          ) : (
            feeds.map((item) => (
              <Card
                key={item.id}
                style={styles.newsCard}
                onPress={() => item.link && Linking.openURL(item.link)}
              >
                <Card.Content>
                  <Chip
                    compact
                    style={[styles.feedBadge, { backgroundColor: colors.inputBg }]}
                    textStyle={[styles.feedBadgeText, { color: colors.primary, fontFamily: Fonts.english.bold }]}
                  >
                    {item.feedTitle}
                  </Chip>
                  <Text style={[styles.newsTitle, { color: colors.text, fontFamily: Fonts.arabic.bold }]} numberOfLines={2}>
                    {item.title}
                  </Text>
                  {item.description ? (
                    <Text style={[styles.newsDesc, { color: colors.muted, fontFamily: Fonts.arabic.regular }]} numberOfLines={3}>
                      {item.description}
                    </Text>
                  ) : null}
                  <Button
                    mode="text"
                    onPress={() => Speech.speak(`${item.title}. ${item.description}`, { language: 'ar', rate: 0.85 })}
                    style={styles.speakNewsBtn}
                    labelStyle={{ color: colors.primary }}
                    icon="volume-high"
                  >
                    اسمع
                  </Button>
                </Card.Content>
              </Card>
            ))
          )}
        </>
      ) : (
        <>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: Fonts.arabic.bold }]}>الألعاب الذهنية 🧠</Text>
          <Text style={[styles.sectionSub, { color: colors.muted, fontFamily: Fonts.arabic.medium }]}>اختبر ذكاءك وتمرن على التفكير</Text>

          <Surface style={[styles.scoreBar]} elevation={1}>
            <Text style={[styles.scoreText, { color: colors.text, fontFamily: Fonts.arabic.medium }]}>السؤال {currentTrivia + 1} / {TRIVIA_QUESTIONS.length}</Text>
            <Text style={[styles.scoreText, { color: colors.primary, fontFamily: Fonts.english.bold }]}>النتيجة: {score}</Text>
          </Surface>

          <Card style={styles.questionCard}>
            <Card.Content style={styles.questionContent}>
              <IconButton
                icon="volume-high"
                size={22}
                iconColor={colors.primary}
                onPress={() => Speech.speak(trivia.questionAr, { language: 'ar' })}
                style={styles.speakerBtn}
              />
              <Text style={[styles.questionText, { color: colors.text, fontFamily: Fonts.arabic.bold }]}>
                {trivia.questionAr}
              </Text>
            </Card.Content>
          </Card>

          {trivia.options.map((opt, i) => {
            let bgColor = colors.inputBg;
            let borderColor = colors.border;
            let textColor = colors.text;
            if (showResult) {
              if (i === trivia.correctIndex) {
                bgColor = '#D1FAE5';
                borderColor = colors.action;
                textColor = '#065F46';
              } else if (i === selectedAnswer) {
                bgColor = '#FEE2E2';
                borderColor = colors.emergency;
                textColor = '#991B1B';
              }
            }
            return (
              <Button
                key={i}
                mode="outlined"
                onPress={() => handleTriviaAnswer(i)}
                disabled={selectedAnswer !== null}
                style={[styles.optionBtn, { backgroundColor: bgColor, borderColor }]}
                labelStyle={[styles.optionText, { color: textColor, fontFamily: Fonts.arabic.medium }]}
              >
                {opt}
              </Button>
            );
          })}

          {showResult && (
            <View style={styles.triviaActions}>
              {currentTrivia < TRIVIA_QUESTIONS.length - 1 ? (
                <Button
                  mode="contained"
                  onPress={nextTrivia}
                  style={styles.nextBtn}
                  labelStyle={[styles.nextBtnText, { fontFamily: Fonts.arabic.bold }]}
                  buttonColor={colors.primary}
                >
                  السؤال التالي
                </Button>
              ) : (
                <View style={styles.triviaActions}>
                  <Text style={[styles.finalScore, { color: colors.text, fontFamily: Fonts.arabic.bold }]}>
                    النتيجة النهائية: {score} / {TRIVIA_QUESTIONS.length}
                  </Text>
                  <Button
                    mode="contained"
                    onPress={resetTrivia}
                    style={styles.nextBtn}
                    labelStyle={[styles.nextBtnText, { fontFamily: Fonts.arabic.bold }]}
                    buttonColor={colors.secondary}
                  >
                    العب مرة تانية
                  </Button>
                </View>
              )}
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  segmentedControl: { marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  sectionTitle: { fontSize: 22, textAlign: 'right', marginBottom: 4 },
  sectionSub: { fontSize: 14, textAlign: 'right', marginBottom: 16 },
  emptyState: { alignItems: 'center', paddingVertical: 60, borderRadius: 16 },
  emptyText: { fontSize: 18, marginTop: 12 },
  emptySub: { fontSize: 13, marginTop: 4 },
  newsCard: { marginBottom: 12 },
  feedBadge: { alignSelf: 'flex-start', marginBottom: 8 },
  feedBadgeText: { fontSize: 11 },
  newsTitle: { fontSize: 16, textAlign: 'right', marginBottom: 4 },
  newsDesc: { fontSize: 13, textAlign: 'right', lineHeight: 20 },
  speakNewsBtn: { alignSelf: 'flex-end', marginTop: 8 },
  scoreBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderRadius: 12, marginBottom: 16 },
  scoreText: { fontSize: 14 },
  questionCard: { marginBottom: 16 },
  questionContent: { alignItems: 'center' },
  speakerBtn: { marginBottom: 10 },
  questionText: { fontSize: 22, textAlign: 'center', lineHeight: 34 },
  optionBtn: { marginBottom: 10, paddingVertical: 6 },
  optionText: { fontSize: 18 },
  triviaActions: { alignItems: 'center', marginTop: 16, gap: 12 },
  nextBtn: { paddingVertical: 6, paddingHorizontal: 20 },
  nextBtnText: { fontSize: 18 },
  finalScore: { fontSize: 20, textAlign: 'center' },
});
