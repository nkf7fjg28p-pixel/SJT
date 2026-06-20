'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Message, VocabularyWord, UserStats } from '@/types';

interface AppState {
  // Navigation
  activeSection: string;
  setActiveSection: (s: string) => void;

  // Conversation
  conversationHistory: Record<string, Message[]>;
  addMessage: (scenarioId: string, msg: Message) => void;
  clearConversation: (scenarioId: string) => void;

  // Vocabulary
  savedWords: VocabularyWord[];
  saveWord: (word: VocabularyWord) => void;
  removeWord: (id: string) => void;
  updateWordMastery: (id: string, correct: boolean) => void;

  // Stats
  stats: UserStats;
  incrementStreak: () => void;
  addConversation: () => void;
  addWords: (n: number) => void;

  // Completed topics
  completedTopics: string[];
  markTopicComplete: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      activeSection: 'dashboard',
      setActiveSection: (s) => set({ activeSection: s }),

      conversationHistory: {},
      addMessage: (scenarioId, msg) =>
        set((state) => ({
          conversationHistory: {
            ...state.conversationHistory,
            [scenarioId]: [...(state.conversationHistory[scenarioId] ?? []), msg],
          },
        })),
      clearConversation: (scenarioId) =>
        set((state) => ({
          conversationHistory: { ...state.conversationHistory, [scenarioId]: [] },
        })),

      savedWords: [],
      saveWord: (word) =>
        set((state) => ({
          savedWords: state.savedWords.some((w) => w.id === word.id)
            ? state.savedWords
            : [...state.savedWords, word],
        })),
      removeWord: (id) =>
        set((state) => ({ savedWords: state.savedWords.filter((w) => w.id !== id) })),
      updateWordMastery: (id, correct) =>
        set((state) => ({
          savedWords: state.savedWords.map((w) =>
            w.id === id
              ? { ...w, masteryLevel: correct ? Math.min(5, w.masteryLevel + 1) : Math.max(0, w.masteryLevel - 1) }
              : w
          ),
        })),

      stats: {
        streakDays: 3,
        totalWords: 47,
        conversationsToday: 1,
        weeklyMinutes: 142,
        topicsCompleted: 5,
        speakingScore: 72,
      },
      incrementStreak: () =>
        set((state) => ({ stats: { ...state.stats, streakDays: state.stats.streakDays + 1 } })),
      addConversation: () =>
        set((state) => ({ stats: { ...state.stats, conversationsToday: state.stats.conversationsToday + 1 } })),
      addWords: (n) =>
        set((state) => ({ stats: { ...state.stats, totalWords: state.stats.totalWords + n } })),

      completedTopics: [],
      markTopicComplete: (id) =>
        set((state) => ({
          completedTopics: state.completedTopics.includes(id)
            ? state.completedTopics
            : [...state.completedTopics, id],
          stats: { ...state.stats, topicsCompleted: state.stats.topicsCompleted + 1 },
        })),
    }),
    { name: 'japanspeak-store' }
  )
);
