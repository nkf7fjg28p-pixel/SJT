'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { newsArticles } from '@/lib/data/news';
import { useAppStore } from '@/lib/store/appStore';
import type { NewsArticle } from '@/types';

function ArticleReader({ article, onBack }: { article: NewsArticle; onBack: () => void }) {
  const { saveWord } = useAppStore();
  const [tab, setTab] = useState<'read' | 'vocab' | 'discuss'>('read');

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
      <button onClick={onBack} className="text-sm text-[#71717A] hover:text-white transition-colors mb-4">← News</button>

      <div className="bg-[#111113] border border-[#27272A] rounded-2xl overflow-hidden mb-5">
        <div className="p-6 border-b border-[#27272A]">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-1 rounded-full">{article.category}</span>
            <span className="text-xs text-[#52525B]">{article.date}</span>
            <span className="text-xs text-[#52525B]">· {article.readTime} min read</span>
          </div>
          <div className="flex gap-4 items-start">
            <span className="text-5xl">{article.imageEmoji}</span>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight mb-2">{article.title}</h1>
              <p className="text-sm text-[#71717A]">{article.summary}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#27272A]">
          {(['read', 'vocab', 'discuss'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 text-xs font-semibold transition-colors ${
                tab === t ? 'text-[#F59E0B] border-b-2 border-[#F59E0B]' : 'text-[#71717A] hover:text-white'
              }`}
            >
              {t === 'read' ? '📰 Article' : t === 'vocab' ? '🔤 Vocabulary' : '💬 Discuss'}
            </button>
          ))}
        </div>

        <div className="p-6">
          {tab === 'read' && (
            <div className="space-y-4">
              {article.body.split('\n\n').map((para, i) => (
                <p key={i} className="text-sm text-[#E4E4E7] leading-[1.85]">{para}</p>
              ))}
            </div>
          )}

          {tab === 'vocab' && (
            <div className="space-y-3">
              <p className="text-xs text-[#71717A] mb-4">Key vocabulary from this article. Tap + to save.</p>
              {article.vocabulary.map((v, i) => (
                <div key={i} className="flex items-start justify-between gap-4 p-4 bg-[#1A1A1E] rounded-xl">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-white">{v.word}</span>
                      <span className="text-xs text-[#8B5CF6] font-mono bg-[#8B5CF6]/10 px-2 py-0.5 rounded">/{v.ipa}/</span>
                    </div>
                    <p className="text-xs text-[#A1A1AA]">{v.meaning}</p>
                  </div>
                  <button
                    onClick={() => saveWord({
                      id: `news-${article.id}-${i}`,
                      word: v.word, ipa: v.ipa,
                      japanese: v.meaning.split(' — ')[0],
                      definition: v.meaning.split(' — ')[1] ?? v.meaning,
                      example: '', collocations: [], relatedWords: [],
                      masteryLevel: 0, nextReview: new Date(), savedAt: new Date(),
                      category: article.category,
                    })}
                    className="w-8 h-8 rounded-lg bg-[#F59E0B]/10 text-[#F59E0B] hover:bg-[#F59E0B] hover:text-black transition-all flex items-center justify-center font-bold text-sm flex-shrink-0"
                  >
                    +
                  </button>
                </div>
              ))}
            </div>
          )}

          {tab === 'discuss' && (
            <div className="space-y-3">
              <div className="p-4 bg-[#1A1205] border border-[#F59E0B]/20 rounded-xl mb-5">
                <p className="text-xs font-bold text-[#F59E0B] mb-1">🎯 Speaking Challenge</p>
                <p className="text-sm text-[#E4E4E7]">Explain this article to a tourist in 3 sentences or less. Then go to AI Conversation and practice with a real tourist persona.</p>
              </div>
              {article.discussionQuestions.map((q, i) => (
                <div key={i} className="p-4 bg-[#1A1A1E] rounded-xl">
                  <p className="text-xs text-[#71717A] mb-1.5">Discussion Q{i + 1}</p>
                  <p className="text-sm text-white">{q}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function NewsExplorer() {
  const [selected, setSelected] = useState<NewsArticle | null>(null);
  const categories = ['All', 'Technology', 'Travel', 'Health', 'Economy', 'Culture'];
  const [cat, setCat] = useState('All');

  const filtered = cat === 'All' ? newsArticles : newsArticles.filter((a) => a.category === cat);

  return (
    <AnimatePresence mode="wait">
      {selected ? (
        <ArticleReader key="article" article={selected} onBack={() => setSelected(null)} />
      ) : (
        <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-xl font-bold text-white">News Explorer</h1>
            <p className="text-sm text-[#71717A] mt-1">Read. Understand. Discuss. Every article becomes a conversation.</p>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  cat === c ? 'bg-[#F59E0B] text-black border-[#F59E0B] font-bold' : 'bg-[#111113] text-[#71717A] border-[#27272A] hover:border-[#3F3F46]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map((article, i) => (
              <motion.button
                key={article.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => setSelected(article)}
                className="w-full text-left bg-[#111113] border border-[#27272A] rounded-2xl p-5 hover:bg-[#1A1A1E] hover:border-[#3F3F46] transition-all group"
              >
                <div className="flex gap-4 items-start">
                  <span className="text-4xl flex-shrink-0">{article.imageEmoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-0.5 rounded-full">{article.category}</span>
                      <span className="text-[10px] text-[#52525B]">{article.readTime} min</span>
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1 group-hover:text-[#F59E0B] transition-colors leading-tight">{article.title}</h3>
                    <p className="text-xs text-[#71717A] line-clamp-2 leading-relaxed">{article.summary}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Coming soon */}
          <div className="bg-[#111113] border border-[#27272A] rounded-2xl p-6 text-center">
            <p className="text-2xl mb-3">📡</p>
            <p className="text-sm font-semibold text-white mb-1">Live News Coming Soon</p>
            <p className="text-xs text-[#71717A]">AI-curated daily articles about Japan, translated and analyzed for English learners.</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
