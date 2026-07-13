import { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Linking,
  RefreshControl,
} from 'react-native';
import {
  Surface,
  Text,
  Button,
  Card,
  Chip,
  ActivityIndicator,
  IconButton,
  SegmentedButtons,
} from 'react-native-paper';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../src/context/ThemeContext';
import { Fonts } from '../../constants/theme';
import { FeedItem } from '../../src/types';
import { TRIVIA_QUESTIONS } from '../../src/data/defaults';
import { parseRSS } from '../../src/utils/rss';

function getFeedTitle(url: string): string {
  if (url.includes('npr')) return 'NPR';
  if (url.includes('bbc')) return 'BBC';
  if (url.includes('megaphone')) return 'Megaphone';
  return 'Feed';
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

  const fetchFeeds = useCallback(
    async (showLoader = true) => {
      if (rssUrls.length === 0) return;
      if (showLoader) setLoadingFeeds(true);

      try {
        const results = await Promise.allSettled(
          rssUrls.map(async (url) => {
            const res = await fetch(url);
            const text = await res.text();
            return parseRSS(text, getFeedTitle(url));
          }),
        );

        const allItems: FeedItem[] = [];
        for (const result of results) {
          if (result.status === 'fulfilled') {
            allItems.push(...result.value);
          }
        }

        const sorted = allItems.sort((a, b) =>
          b.pubDate > a.pubDate ? 1 : -1,
        );
        setFeeds(sorted);
        AsyncStorage.setItem('rssFeedsCache', JSON.stringify(sorted));
      } catch {
        // Network or parsing error — silently ignore, cache stays
      }

      setLoadingFeeds(false);
    },
    [rssUrls],
  );

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
      Speech.speak(
        `الإجابة الصحيحة هي: ${q.options[q.correctIndex]}`,
        { language: 'ar' },
      );
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
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.primary]}
        />
      }
    >
      <SegmentedButtons
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as 'news' | 'trivia')}
        buttons={[
          {
            value: 'news',
            label: 'الأخبار',
            icon: () => (
              <Ionicons
                name="newspaper"
                size={18}
                color={activeTab === 'news' ? colors.white : colors.muted}
              />
            ),
          },
          {
            value: 'trivia',
            label: 'الألعاب الذهنية',
            icon: () => (
              <MaterialCommunityIcons
                name="brain"
                size={18}
                color={activeTab === 'trivia' ? colors.white : colors.muted}
              />
            ),
          },
        ]}
        style={styles.segmentedControl}
      />

      {activeTab === 'news' ? (
        <NewsTab
          rssUrls={rssUrls}
          loadingFeeds={loadingFeeds}
          feeds={feeds}
          colors={colors}
          onRefreshFeeds={() => fetchFeeds()}
        />
      ) : (
        <TriviaTab
          trivia={trivia}
          triviaIndex={currentTrivia}
          triviaTotal={TRIVIA_QUESTIONS.length}
          score={score}
          selectedAnswer={selectedAnswer}
          showResult={showResult}
          colors={colors}
          onAnswer={handleTriviaAnswer}
          onNext={nextTrivia}
          onReset={resetTrivia}
        />
      )}
    </ScrollView>
  );
}

function NewsTab({
  rssUrls,
  loadingFeeds,
  feeds,
  colors,
  onRefreshFeeds,
}: {
  rssUrls: string[];
  loadingFeeds: boolean;
  feeds: FeedItem[];
  colors: any;
  onRefreshFeeds: () => void;
}) {
  return (
    <>
      <View style={styles.sectionHeader}>
        <Text
          style={[
            styles.sectionTitle,
            { color: colors.text, fontFamily: Fonts.arabic.bold },
          ]}
        >
          آخر الأخبار 📰
        </Text>
        <IconButton
          icon="refresh"
          size={22}
          iconColor={colors.primary}
          onPress={onRefreshFeeds}
        />
      </View>

      {rssUrls.length === 0 ? (
        <Surface style={styles.emptyState} elevation={0}>
          <Ionicons name="cloud-offline" size={48} color={colors.disabled} />
          <Text
            style={[
              styles.emptyText,
              { color: colors.muted, fontFamily: Fonts.arabic.medium },
            ]}
          >
            لا توجد مصادر أخبار
          </Text>
          <Text
            style={[
              styles.emptySub,
              { color: colors.disabled, fontFamily: Fonts.arabic.regular },
            ]}
          >
            أضف RSS feeds من الإعدادات
          </Text>
        </Surface>
      ) : loadingFeeds ? (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{ marginTop: 40 }}
        />
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
                textStyle={[
                  styles.feedBadgeText,
                  { color: colors.primary, fontFamily: Fonts.english.bold },
                ]}
              >
                {item.feedTitle}
              </Chip>
              <Text
                style={[
                  styles.newsTitle,
                  { color: colors.text, fontFamily: Fonts.arabic.bold },
                ]}
                numberOfLines={2}
              >
                {item.title}
              </Text>
              {item.description ? (
                <Text
                  style={[
                    styles.newsDesc,
                    { color: colors.muted, fontFamily: Fonts.arabic.regular },
                  ]}
                  numberOfLines={3}
                >
                  {item.description}
                </Text>
              ) : null}
              <Button
                mode="text"
                onPress={() =>
                  Speech.speak(`${item.title}. ${item.description}`, {
                    language: 'ar',
                    rate: 0.85,
                  })
                }
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
  );
}

function TriviaTab({
  trivia,
  triviaIndex,
  triviaTotal,
  score,
  selectedAnswer,
  showResult,
  colors,
  onAnswer,
  onNext,
  onReset,
}: {
  trivia: { questionAr: string; options: string[]; correctIndex: number };
  triviaIndex: number;
  triviaTotal: number;
  score: number;
  selectedAnswer: number | null;
  showResult: boolean;
  colors: any;
  onAnswer: (index: number) => void;
  onNext: () => void;
  onReset: () => void;
}) {
  return (
    <>
      <Text
        style={[
          styles.sectionTitle,
          { color: colors.text, fontFamily: Fonts.arabic.bold },
        ]}
      >
        الألعاب الذهنية 🧠
      </Text>
      <Text
        style={[
          styles.sectionSub,
          { color: colors.muted, fontFamily: Fonts.arabic.medium },
        ]}
      >
        اختبر ذكاءك وتمرن على التفكير
      </Text>

      <Surface style={styles.scoreBar} elevation={1}>
        <Text
          style={[
            styles.scoreText,
            { color: colors.text, fontFamily: Fonts.arabic.medium },
          ]}
        >
          السؤال {triviaIndex + 1} / {triviaTotal}
        </Text>
        <Text
          style={[
            styles.scoreText,
            { color: colors.primary, fontFamily: Fonts.english.bold },
          ]}
        >
          النتيجة: {score}
        </Text>
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
          <Text
            style={[
              styles.questionText,
              { color: colors.text, fontFamily: Fonts.arabic.bold },
            ]}
          >
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
            onPress={() => onAnswer(i)}
            disabled={selectedAnswer !== null}
            style={[
              styles.optionBtn,
              { backgroundColor: bgColor, borderColor },
            ]}
            labelStyle={[
              styles.optionText,
              { color: textColor, fontFamily: Fonts.arabic.medium },
            ]}
          >
            {opt}
          </Button>
        );
      })}

      {showResult && (
        <View style={styles.triviaActions}>
          {triviaIndex < triviaTotal - 1 ? (
            <Button
              mode="contained"
              onPress={onNext}
              style={styles.nextBtn}
              labelStyle={[
                styles.nextBtnText,
                { fontFamily: Fonts.arabic.bold },
              ]}
              buttonColor={colors.primary}
            >
              السؤال التالي
            </Button>
          ) : (
            <View style={styles.triviaActions}>
              <Text
                style={[
                  styles.finalScore,
                  { color: colors.text, fontFamily: Fonts.arabic.bold },
                ]}
              >
                النتيجة النهائية: {score} / {triviaTotal}
              </Text>
              <Button
                mode="contained"
                onPress={onReset}
                style={styles.nextBtn}
                labelStyle={[
                  styles.nextBtnText,
                  { fontFamily: Fonts.arabic.bold },
                ]}
                buttonColor={colors.secondary}
              >
                العب مرة تانية
              </Button>
            </View>
          )}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  segmentedControl: { marginBottom: 20 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionTitle: { fontSize: 22, textAlign: 'right', marginBottom: 4 },
  sectionSub: { fontSize: 14, textAlign: 'right', marginBottom: 16 },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    borderRadius: 16,
  },
  emptyText: { fontSize: 18, marginTop: 12 },
  emptySub: { fontSize: 13, marginTop: 4 },
  newsCard: { marginBottom: 12 },
  feedBadge: { alignSelf: 'flex-start', marginBottom: 8 },
  feedBadgeText: { fontSize: 11 },
  newsTitle: { fontSize: 16, textAlign: 'right', marginBottom: 4 },
  newsDesc: { fontSize: 13, textAlign: 'right', lineHeight: 20 },
  speakNewsBtn: { alignSelf: 'flex-end', marginTop: 8 },
  scoreBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
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
