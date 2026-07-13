export type Language = 'ar' | 'en';

export type IconProvider = 'Ionicons' | 'MaterialCommunityIcons';

export interface PhraseCard {
  id: string;
  labelAr: string;
  labelEn: string;
  icon: string;
  iconProvider: IconProvider;
  color: string;
  isDefault?: boolean;
}

export interface FeedItem {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  feedTitle: string;
}

export interface TriviaQuestion {
  id: string;
  questionAr: string;
  questionEn: string;
  options: string[];
  optionsEn: string[];
  correctIndex: number;
}

export interface User {
  name: string;
  email: string;
  imageUri?: string;
}
