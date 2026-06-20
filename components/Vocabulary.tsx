'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store/appStore';
import type { VocabularyWord } from '@/types';

const MASTERY_LABELS = ['New', 'Learning', 'Familiar', 'Confident', 'Advanced', 'Mastered'];
const MASTERY_COLORS = ['#52525B', '#EF4444', '#F97316', '#F59E0B', '#22C55E', '#3B82F6'];

function WordCard({ word }: { word: VocabularyWord }) {
  const [flipped, setFlipped] = useState(false);
  const { updateWordMastery, removeWord } = useAppStore();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-[#111113] border border-[#27272A] rounded-2xl overflow-hidden"
    >
      <div
        className="p-5 cursor-pointer hover:bg-[#1A1A1E] transition-colors"
        onClick={() => setFlipped(!flipped)}
      >
        <div className="flex items-start justify-between mb-2">
          <div>
            <span className="text-base font-bold text-white">{word.word}</span>
            <span className="ml-2 text-xs text-[#8B5CF6] font-mono bg-[#8B5CF6]/10 px-2 py-0.5 rounded">/{word.ipa}/</span>
          </div>
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{
              background: `${MASTERY_COLORS[word.masteryLevel]}20`,
              color: MASTERY_COLORS[word.masteryLevel],
            }}
          >
            {MASTERY_LABELS[word.masteryLevel]}
          </span>
        </div>

        <p className="text-sm text-[#F59E0B] font-medium mb-1">{word.japanese}</p>

        <AnimatePresence>
          {flipped && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 pt-3 border-t border-[#27272A] space-y-2"
            >
              <p className="text-sm text-[#A1A1AA]">{word.definition}</p>
              {word.example && (
                <p className="text-xs text-[#71717A] italic">"{word.example}"</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mastery controls */}
      <div className="flex border-t border-[#27272A]">
        <button
          onClick={() => updateWordMastery(word.id, false)}
          className="flex-1 py-2.5 text-xs text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors font-medium"
        >
          ✗ Forgot
        </button>
        <div className="w-px bg-[#27272A]" />
        <button
          onClick={() => updateWordMastery(word.id, true)}
          className="flex-1 py-2.5 text-xs text-[#22C55E] hover:bg-[#22C55E]/10 transition-colors font-medium"
        >
          ✓ Got it
        </button>
        <div className="w-px bg-[#27272A]" />
        <button
          onClick={() => removeWord(word.id)}
          className="px-4 py-2.5 text-xs text-[#52525B] hover:text-[#71717A] hover:bg-[#1A1A1E] transition-colors"
        >
          ×
        </button>
      </div>
    </motion.div>
  );
}

export default function Vocabulary() {
  const { savedWords } = useAppStore();
  const [filter, setFilter] = useState<'all' | 'review'>('all');

  const toReview = savedWords.filter((w) => w.masteryLevel < 4);
  const displayed = filter === 'review' ? toReview : savedWords;

  const masteryCount = MASTERY_LABELS.map((_, i) => savedWords.filter((w) => w.masteryLevel === i).length);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Vocabulary Vault</h1>
        <p className="text-sm text-[#71717A] mt-1">
          {savedWords.length} words saved — {savedWords.filter((w) => w.masteryLevel >= 4).length} mastered
        </p>
      </div>

      {/* Mastery breakdown */}
      {savedWords.length > 0 && (
        <div className="bg-[#111113] border border-[#27272A] rounded-2xl p-4">
          <p className="text-xs text-[#71717A] mb-3">Mastery Distribution</p>
          <div className="flex gap-1 h-2 rounded-full overflow-hidden">
            {masteryCount.map((count, i) => (
              count > 0 && (
                <div
                  key={i}
                  style={{
                    width: `${(count / savedWords.length) * 100}%`,
                    background: MASTERY_COLORS[i],
                  }}
                />
              )
            ))}
          </div>
          <div className="flex gap-3 mt-2 flex-wrap">
            {MASTERY_LABELS.map((label, i) => masteryCount[i] > 0 && (
              <div key={i} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ background: MASTERY_COLORS[i] }} />
                <span className="text-[10px] text-[#71717A]">{label}: {masteryCount[i]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter */}
      {savedWords.length > 0 && (
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              filter === 'all' ? 'bg-[#F59E0B] text-black border-[#F59E0B] font-bold' : 'bg-[#111113] text-[#71717A] border-[#27272A]'
            }`}
          >
            All ({savedWords.length})
          </button>
          <button
            onClick={() => setFilter('review')}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              filter === 'review' ? 'bg-[#F59E0B] text-black border-[#F59E0B] font-bold' : 'bg-[#111113] text-[#71717A] border-[#27272A]'
            }`}
          >
            Review ({toReview.length})
          </button>
        </div>
      )}

      {/* Words */}
      {displayed.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-3">
          <AnimatePresence>
            {displayed.map((word) => (
              <WordCard key={word.id} word={word} />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">🔤</p>
          <p className="text-sm font-semibold text-white mb-2">Your vocabulary vault is empty</p>
          <p className="text-xs text-[#71717A] mb-6">
            Save words from the Academy, News, or Conversation by tapping the + button.
          </p>
          <p className="text-xs text-[#52525B]">
            Words you save will appear here with spaced repetition review.
          </p>
        </div>
      )}
    </div>
  );
}
