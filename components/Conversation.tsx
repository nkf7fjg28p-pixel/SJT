'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store/appStore';
import { scenarios, touristPersonas } from '@/lib/data/scenarios';
import { sendMessage } from '@/lib/ai';
import type { Message, Scenario } from '@/types';

function ScenarioCard({ s, onSelect }: { s: Scenario; onSelect: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className="group text-left bg-[#111113] border border-[#27272A] rounded-2xl p-5 hover:border-[#F59E0B]/50 hover:bg-[#1A1205] transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-3xl">{s.icon}</span>
        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
          s.difficulty === 'beginner' ? 'bg-[#22C55E]/10 text-[#22C55E]' :
          s.difficulty === 'intermediate' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
          'bg-[#EF4444]/10 text-[#EF4444]'
        }`}>
          {s.difficulty.toUpperCase()}
        </span>
      </div>
      <h3 className="text-sm font-bold text-white mb-1 group-hover:text-[#F59E0B] transition-colors">{s.title}</h3>
      <p className="text-[11px] text-[#71717A] mb-3 leading-relaxed">{s.description}</p>
      <div className="flex flex-wrap gap-1">
        {s.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full bg-[#1A1A1E] text-[#52525B] border border-[#27272A]">{tag}</span>
        ))}
      </div>
    </motion.button>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user';
  const [showFeedback, setShowFeedback] = useState(false);

  // Parse coach notes from assistant message
  const coachMatch = msg.content.match(/\[Coach: ([^\]]+)\]/);
  const cleanContent = msg.content.replace(/\[Coach: [^\]]+\]/g, '').trim();
  const coachNote = coachMatch?.[1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#EF4444] flex items-center justify-center text-sm flex-shrink-0 mt-1">
          🌍
        </div>
      )}
      <div className={`max-w-[80%] space-y-2`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? 'bg-[#F59E0B] text-black font-medium rounded-br-sm'
              : 'bg-[#1A1A1E] text-[#E4E4E7] rounded-bl-sm border border-[#27272A]'
          }`}
        >
          {cleanContent}
        </div>
        {coachNote && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-start gap-2 bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 rounded-xl px-3 py-2"
          >
            <span className="text-sm flex-shrink-0">🎓</span>
            <p className="text-[11px] text-[#A78BFA] leading-relaxed">{coachNote}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#EF4444] flex items-center justify-center text-sm flex-shrink-0">
        🌍
      </div>
      <div className="bg-[#1A1A1E] border border-[#27272A] rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 items-center">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
            className="w-1.5 h-1.5 rounded-full bg-[#52525B]"
          />
        ))}
      </div>
    </div>
  );
}

export default function Conversation() {
  const { conversationHistory, addMessage, clearConversation, addConversation } = useAppStore();
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiModal, setShowApiModal] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const messages = selectedScenario ? (conversationHistory[selectedScenario.id] ?? []) : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const startConversation = async (scenario: Scenario) => {
    setSelectedScenario(scenario);
    if ((conversationHistory[scenario.id] ?? []).length === 0) {
      setIsLoading(true);
      try {
        const { content } = await sendMessage([], scenario.systemPrompt, apiKey || undefined);
        const msg: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content,
          timestamp: new Date(),
        };
        addMessage(scenario.id, msg);
        addConversation();
      } finally {
        setIsLoading(false);
      }
    }
  };

  const sendUserMessage = async () => {
    if (!input.trim() || !selectedScenario || isLoading) return;
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };
    addMessage(selectedScenario.id, userMsg);
    setInput('');
    setIsLoading(true);
    try {
      const { content } = await sendMessage(
        [...messages, userMsg],
        selectedScenario.systemPrompt,
        apiKey || undefined
      );
      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content,
        timestamp: new Date(),
      };
      addMessage(selectedScenario.id, assistantMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = ['all', 'tourism', 'culture', 'food', 'history', 'society', 'business', 'nature'];
  const filtered = filter === 'all' ? scenarios : scenarios.filter((s) => s.category === filter);

  if (!selectedScenario) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">AI Conversation</h1>
            <p className="text-sm text-[#71717A] mt-1">Choose a scenario. The AI becomes a real tourist. Explain Japan naturally.</p>
          </div>
          <button
            onClick={() => setShowApiModal(true)}
            className="text-xs px-3 py-1.5 rounded-lg border border-[#27272A] text-[#71717A] hover:text-white hover:border-[#3F3F46] transition-colors"
          >
            {apiKey ? '🟢 AI Connected' : '⚙️ Groqキー追加'}
          </button>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors capitalize ${
                filter === cat
                  ? 'bg-[#F59E0B] text-black border-[#F59E0B] font-bold'
                  : 'bg-[#111113] text-[#71717A] border-[#27272A] hover:border-[#3F3F46]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((s) => (
            <ScenarioCard key={s.id} s={s} onSelect={() => startConversation(s)} />
          ))}
        </div>

        {/* Tourist Personas */}
        <div>
          <h2 className="text-sm font-semibold text-[#71717A] uppercase tracking-wider mb-3">Tourist Personalities</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {touristPersonas.map((p) => (
              <div key={p.id} className="flex-shrink-0 bg-[#111113] border border-[#27272A] rounded-xl p-4 w-52">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{p.flag}</span>
                  <div>
                    <p className="text-xs font-bold text-white">{p.name}</p>
                    <p className="text-[10px] text-[#71717A]">{p.nationality}</p>
                  </div>
                </div>
                <p className="text-[11px] text-[#71717A] leading-relaxed">{p.background}</p>
              </div>
            ))}
          </div>
        </div>

        {/* API Key Modal */}
        <AnimatePresence>
          {showApiModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowApiModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-[#111113] border border-[#27272A] rounded-2xl p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-base font-bold text-white mb-2">Connect to Real AI</h3>
                <p className="text-sm text-[#71717A] mb-4">Groqの無料APIキーを追加するとリアルAIと会話できます。<a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" className="text-[#F59E0B] underline">console.groq.com</a>で無料取得できます。キーなしでもデモ会話を楽しめます。</p>
                <input
                  type="password"
                  placeholder="gsk_..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-[#1A1A1E] border border-[#27272A] rounded-xl px-4 py-3 text-sm text-white placeholder-[#52525B] focus:outline-none focus:border-[#F59E0B]/50 mb-4"
                />
                <button
                  onClick={() => setShowApiModal(false)}
                  className="w-full py-2.5 bg-[#F59E0B] text-black font-bold text-sm rounded-xl hover:bg-[#FBBF24] transition-colors"
                >
                  {apiKey ? 'Save & Connect' : 'Continue with Demo Mode'}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Chat Interface
  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-120px)] md:h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#27272A]">
        <button
          onClick={() => setSelectedScenario(null)}
          className="text-[#71717A] hover:text-white transition-colors text-sm"
        >
          ← Back
        </button>
        <div className="w-px h-4 bg-[#27272A]" />
        <span className="text-2xl">{selectedScenario.icon}</span>
        <div className="flex-1">
          <p className="text-sm font-bold text-white">{selectedScenario.title}</p>
          <p className="text-xs text-[#71717A]">{selectedScenario.titleJa}</p>
        </div>
        <button
          onClick={() => {
            clearConversation(selectedScenario.id);
            startConversation(selectedScenario);
          }}
          className="text-xs text-[#71717A] hover:text-white px-3 py-1.5 rounded-lg border border-[#27272A] hover:border-[#3F3F46] transition-colors"
        >
          ↺ Reset
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}
        </AnimatePresence>
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="pt-4 border-t border-[#27272A]">
        <div className="flex gap-3 items-end">
          <div className="flex-1 bg-[#1A1A1E] border border-[#27272A] rounded-2xl overflow-hidden focus-within:border-[#F59E0B]/50 transition-colors">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendUserMessage();
                }
              }}
              placeholder="Reply to the tourist... (Enter to send)"
              rows={2}
              className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder-[#52525B] resize-none focus:outline-none"
            />
          </div>
          <button
            onClick={sendUserMessage}
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 rounded-xl bg-[#F59E0B] hover:bg-[#FBBF24] disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-black font-bold text-lg flex-shrink-0"
          >
            ↑
          </button>
        </div>
        <p className="text-[10px] text-[#52525B] mt-2 text-center">
          {apiKey ? '🟢 Groq AI connected' : '⚡ デモモード — Groqキーを追加するとリアルAIに切り替わります（無料）'}
        </p>
      </div>
    </div>
  );
}
