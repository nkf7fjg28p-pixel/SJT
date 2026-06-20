export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  feedback?: {
    corrected?: string;
    suggestion?: string;
    vocabulary?: { word: string; meaning: string }[];
  };
}

export interface Scenario {
  id: string;
  title: string;
  titleJa: string;
  description: string;
  category: ScenarioCategory;
  icon: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  systemPrompt: string;
}

export type ScenarioCategory =
  | 'tourism' | 'culture' | 'food' | 'history'
  | 'society' | 'business' | 'travel' | 'nature';

export interface TouristPersona {
  id: string;
  name: string;
  nationality: string;
  flag: string;
  background: string;
  personality: string;
  typicalQuestions: string[];
}

export interface Topic {
  id: string;
  title: string;
  titleJa: string;
  category: TopicCategory;
  icon: string;
  color: string;
  level: 'foundation' | 'intermediate' | 'advanced';
  readTime: number;
  tags: string[];
  summary: string;
  keyVocabulary: { word: string; meaning: string; ipa: string }[];
  modelAnswer: string;
  commonQuestions: string[];
}

export type TopicCategory =
  | 'history' | 'religion' | 'culture' | 'society'
  | 'economy' | 'nature' | 'food' | 'technology';

export interface VocabularyWord {
  id: string;
  word: string;
  ipa: string;
  japanese: string;
  definition: string;
  example: string;
  collocations: string[];
  relatedWords: string[];
  masteryLevel: number; // 0-5
  nextReview: Date;
  savedAt: Date;
  category: string;
  notes?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  category: string;
  readTime: number;
  date: string;
  imageEmoji: string;
  body: string;
  vocabulary: { word: string; meaning: string; ipa: string }[];
  discussionQuestions: string[];
}

export interface UserStats {
  streakDays: number;
  totalWords: number;
  conversationsToday: number;
  weeklyMinutes: number;
  topicsCompleted: number;
  speakingScore: number;
}
