import { PhraseCard, TriviaQuestion } from '../types';

export const DEFAULT_CARDS: PhraseCard[] = [
  { id: '1', labelAr: 'عايز أكل', labelEn: 'I want food', icon: 'silverware-fork-knife', iconProvider: 'MaterialCommunityIcons', color: '#E0F2FE', isDefault: true },
  { id: '2', labelAr: 'عايز مية', labelEn: 'I want water', icon: 'water', iconProvider: 'Ionicons', color: '#E0F2FE', isDefault: true },
  { id: '3', labelAr: 'الدوا', labelEn: 'Medicine', icon: 'pill', iconProvider: 'MaterialCommunityIcons', color: '#FEF3C7', isDefault: true },
  { id: '4', labelAr: 'الحمام', labelEn: 'Restroom', icon: 'toilet', iconProvider: 'MaterialCommunityIcons', color: '#E0F2FE', isDefault: true },
  { id: '5', labelAr: 'تعبان', labelEn: 'I am tired', icon: 'emoticon-sad-outline', iconProvider: 'MaterialCommunityIcons', color: '#FEE2E2', isDefault: true },
  { id: '6', labelAr: 'شاي', labelEn: 'Tea', icon: 'coffee', iconProvider: 'MaterialCommunityIcons', color: '#E0F2FE', isDefault: true },
];

export const TRIVIA_QUESTIONS: TriviaQuestion[] = [
  { id: '1', questionAr: 'ما هي عاصمة مصر؟', options: ['القاهرة', 'الاسكندرية', 'الجيزة', 'أسوان'], correctIndex: 0 },
  { id: '2', questionAr: 'كم عدد أرجل العنكبوت؟', options: ['6', '8', '10', '12'], correctIndex: 1 },
  { id: '3', questionAr: 'ما هو أكبر كوكب في المجموعة الشمسية؟', options: ['زحل', 'المشتري', 'نبتون', 'أورانوس'], correctIndex: 1 },
  { id: '4', questionAr: 'ما هو اللون الذي ينتج من خلط الأحمر والأبيض؟', options: ['برتقالي', 'بنفسجي', 'وردي', 'بني'], correctIndex: 2 },
  { id: '5', questionAr: 'كم عدد ألوان قوس قزح؟', options: ['5', '6', '7', '8'], correctIndex: 2 },
  { id: '6', questionAr: 'ما هو الحيوان الأسرع في العالم؟', options: ['الأسد', 'الفهد', 'الحصان', 'النسر'], correctIndex: 1 },
  { id: '7', questionAr: 'في أي قارة تقع مصر؟', options: ['آسيا', 'أوروبا', 'أفريقيا', 'أمريكا الجنوبية'], correctIndex: 2 },
  { id: '8', questionAr: 'ما هو أكبر محيط في العالم؟', options: ['الأطلسي', 'الهندي', 'الهادئ', 'المتجمد الشمالي'], correctIndex: 2 },
];

export const PRESET_FEEDS = [
  { label: 'BBC World News', url: 'https://feeds.bbci.co.uk/news/world/rss.xml' },
  { label: 'NPR News', url: 'https://feeds.npr.org/510333/podcast.xml' },
  { label: 'Megaphone ESP', url: 'https://feeds.megaphone.fm/ESP5765452710' },
];
