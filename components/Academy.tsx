'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store/appStore';
import { topics, topicCategories } from '@/lib/data/topics';
import type { Topic } from '@/types';

function TopicDetail({ topic, onClose }: { topic: Topic; onClose: () => void }) {
  const { completedTopics, markTopicComplete, saveWord } = useAppStore();
  const [tab, setTab] = useState<'read' | 'vocab' | 'practice'>('read');
  const isCompleted = completedTopics.includes(topic.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="max-w-3xl mx-auto"
    >
      <button onClick={onClose} className="text-sm text-[#71717A] hover:text-white transition-colors mb-4">
        ← Academy
      </button>

      {/* Header */}
      <div className="rounded-2xl p-6 mb-6 border border-[#27272A]" style={{ background: `${topic.color}10` }}>
        <div className="flex items-start justify-between mb-3">
          <span className="text-4xl">{topic.icon}</span>
          {isCompleted && (
            <span className="text-xs font-bold px-3 py-1 bg-[#22C55E]/10 text-[#22C55E] rounded-full border border-[#22C55E]/20">
              ✓ Completed
            </span>
          )}
        </div>
        <h1 className="text-xl font-bold text-white mb-1">{topic.title}</h1>
        <p className="text-sm text-[#71717A] mb-3">{topic.titleJa}</p>
        <p className="text-sm text-[#A1A1AA] leading-relaxed">{topic.summary}</p>
        <div className="flex gap-2 mt-3">
          <span className="text-[10px] px-2 py-1 bg-[#1A1A1E] text-[#71717A] rounded-full border border-[#27272A]">
            📖 {topic.readTime} min read
          </span>
          {topic.tags.map((t) => (
            <span key={t} className="text-[10px] px-2 py-1 bg-[#1A1A1E] text-[#71717A] rounded-full border border-[#27272A]">{t}</span>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-[#111113] border border-[#27272A] rounded-xl p-1">
        {(['read', 'vocab', 'practice'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all capitalize ${
              tab === t ? 'bg-[#1A1A1E] text-white' : 'text-[#71717A] hover:text-white'
            }`}
          >
            {t === 'read' ? '📖 Read' : t === 'vocab' ? '🔤 Vocabulary' : '💬 Practice'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'read' && (
        <div className="space-y-6">
          <div className="bg-[#111113] border border-[#27272A] rounded-2xl p-6">
            {topic.modelAnswer.split('\n\n').map((para, i) => (
              <p key={i} className="text-sm text-[#E4E4E7] leading-relaxed mb-4 last:mb-0">{para}</p>
            ))}
          </div>

          <div className="bg-[#111113] border border-[#27272A] rounded-2xl p-5">
            <h3 className="text-sm font-bold text-white mb-3">💡 Common Questions from Foreigners</h3>
            <div className="space-y-2">
              {topic.commonQuestions.map((q, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-[#1A1A1E] rounded-xl">
                  <span className="text-[#F59E0B] text-sm font-bold flex-shrink-0">Q</span>
                  <p className="text-sm text-[#A1A1AA]">{q}</p>
                </div>
              ))}
            </div>
          </div>

          {!isCompleted && (
            <button
              onClick={() => markTopicComplete(topic.id)}
              className="w-full py-3 bg-[#F59E0B] text-black font-bold text-sm rounded-xl hover:bg-[#FBBF24] transition-colors"
            >
              ✓ Mark as Complete
            </button>
          )}
        </div>
      )}

      {tab === 'vocab' && (
        <div className="space-y-3">
          <p className="text-xs text-[#71717A]">Key vocabulary for this topic. Tap + to save to your vault.</p>
          {topic.keyVocabulary.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-[#111113] border border-[#27272A] rounded-xl p-4 flex items-start justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base font-bold text-white">{v.word}</span>
                  <span className="text-xs text-[#8B5CF6] font-mono bg-[#8B5CF6]/10 px-2 py-0.5 rounded">/{v.ipa}/</span>
                </div>
                <p className="text-xs text-[#A1A1AA]">{v.meaning}</p>
              </div>
              <button
                onClick={() => saveWord({
                  id: `${topic.id}-${i}`,
                  word: v.word, ipa: v.ipa, japanese: v.meaning.split(' — ')[0],
                  definition: v.meaning.split(' — ')[1] ?? v.meaning,
                  example: '', collocations: [], relatedWords: [],
                  masteryLevel: 0, nextReview: new Date(), savedAt: new Date(),
                  category: topic.category,
                })}
                className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#F59E0B]/10 text-[#F59E0B] hover:bg-[#F59E0B] hover:text-black transition-all flex items-center justify-center font-bold text-sm"
              >
                +
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {tab === 'practice' && (
        <div className="space-y-4">
          <div className="bg-[#1A1205] border border-[#F59E0B]/20 rounded-2xl p-5">
            <p className="text-xs font-bold text-[#F59E0B] mb-2 uppercase tracking-wide">Speaking Challenge</p>
            <p className="text-sm text-[#E4E4E7] mb-4">
              Imagine a tourist asks you: <span className="text-white font-semibold">"{topic.commonQuestions[0]}"</span>
            </p>
            <p className="text-xs text-[#71717A]">Try answering out loud, then compare with the model answer above.</p>
          </div>
          {topic.commonQuestions.slice(1).map((q, i) => (
            <div key={i} className="bg-[#111113] border border-[#27272A] rounded-xl p-4">
              <p className="text-xs text-[#71717A] mb-2">Discussion Question {i + 2}</p>
              <p className="text-sm text-white">{q}</p>
            </div>
          ))}
          <div className="bg-[#111113] border border-[#27272A] rounded-xl p-4">
            <p className="text-xs text-[#22C55E] font-bold mb-2">🎯 Next Step</p>
            <p className="text-sm text-[#A1A1AA]">Now go to <span className="text-white font-semibold">AI Conversation</span> and practice explaining this topic to a real AI tourist.</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function Academy() {
  const { completedTopics } = useAppStore();
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [category, setCategory] = useState('all');

  const filtered = category === 'all' ? topics : topics.filter((t) => t.category === category);

  return (
    <AnimatePresence mode="wait">
      {selectedTopic ? (
        <TopicDetail key="detail" topic={selectedTopic} onClose={() => setSelectedTopic(null)} />
      ) : (
        <motion.div
          key="list"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          <div>
            <h1 className="text-xl font-bold text-white">Japan Knowledge Academy</h1>
            <p className="text-sm text-[#71717A] mt-1">
              Master the topics that matter — {completedTopics.length}/{topics.length} completed
            </p>
          </div>

          {/* Progress */}
          <div className="h-1.5 bg-[#1A1A1E] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(completedTopics.length / topics.length) * 100}%` }}
              className="h-full bg-gradient-to-r from-[#F59E0B] to-[#EF4444] rounded-full"
            />
          </div>

          {/* Category filter */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {topicCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  category === cat.id
                    ? 'bg-[#F59E0B] text-black border-[#F59E0B] font-bold'
                    : 'bg-[#111113] text-[#71717A] border-[#27272A] hover:border-[#3F3F46]'
                }`}
              >
                <span>{cat.icon}</span> {cat.label}
              </button>
            ))}
          </div>

          {/* Topics grid */}
          <div className="grid sm:grid-cols-2 gap-3">
            {filtered.map((topic, i) => {
              const done = completedTopics.includes(topic.id);
              return (
                <motion.button
                  key={topic.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => setSelectedTopic(topic)}
                  className={`text-left bg-[#111113] border rounded-2xl p-5 hover:bg-[#1A1A1E] transition-all group ${
                    done ? 'border-[#22C55E]/30' : 'border-[#27272A] hover:border-[#3F3F46]'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                      style={{ background: `${topic.color}15` }}
                    >
                      {topic.icon}
                    </div>
                    <div className="flex items-center gap-2">
                      {done && <span className="text-[10px] text-[#22C55E] font-bold">✓ Done</span>}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        topic.level === 'foundation' ? 'bg-[#22C55E]/10 text-[#22C55E]' :
                        topic.level === 'intermediate' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                        'bg-[#EF4444]/10 text-[#EF4444]'
                      }`}>{topic.level}</span>
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1 group-hover:text-[#F59E0B] transition-colors">
                    {topic.title}
                  </h3>
                  <p className="text-[11px] text-[#71717A] leading-relaxed line-clamp-2 mb-3">{topic.summary}</p>
                  <div className="flex items-center gap-3 text-[10px] text-[#52525B]">
                    <span>📖 {topic.readTime} min</span>
                    <span>🔤 {topic.keyVocabulary.length} words</span>
                    <span>💬 {topic.commonQuestions.length} Q&As</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
