'use client';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store/appStore';
import { scenarios } from '@/lib/data/scenarios';
import { topics } from '@/lib/data/topics';

const fade = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

function StatCard({ icon, value, label, color }: { icon: string; value: string | number; label: string; color: string }) {
  return (
    <motion.div variants={fade} className="bg-[#111113] border border-[#27272A] rounded-2xl p-4 flex flex-col gap-3">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg`} style={{ background: `${color}20` }}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-white tabular-nums">{value}</p>
        <p className="text-xs text-[#71717A] mt-0.5">{label}</p>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const { stats, setActiveSection, completedTopics } = useAppStore();

  const dailyScenarios = scenarios.slice(0, 3);
  const suggestedTopics = topics.filter((t) => !completedTopics.includes(t.id)).slice(0, 4);

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.06 } } }}
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Hero */}
      <motion.div variants={fade} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1A1205] via-[#1C1408] to-[#111113] border border-[#F59E0B]/20 p-6 md:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F59E0B]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="relative">
          <p className="text-xs font-semibold text-[#F59E0B] tracking-widest uppercase mb-2">Today's Mission</p>
          <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-3">
            Explain Japan.<br />
            <span className="text-[#F59E0B]">Think in English.</span>
          </h1>
          <p className="text-sm text-[#A1A1AA] mb-6 max-w-md">
            One conversation a day compounds. In 90 days, you will think about Japan in English naturally.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveSection('conversation')}
              className="px-5 py-2.5 bg-[#F59E0B] text-black text-sm font-bold rounded-xl hover:bg-[#FBBF24] transition-colors"
            >
              Start Today's Conversation →
            </button>
            <button
              onClick={() => setActiveSection('academy')}
              className="px-5 py-2.5 bg-[#1A1A1E] text-[#A1A1AA] text-sm font-medium rounded-xl border border-[#27272A] hover:text-white hover:border-[#3F3F46] transition-colors"
            >
              Browse Academy
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div>
        <motion.h2 variants={fade} className="text-sm font-semibold text-[#71717A] mb-3 uppercase tracking-wider">Your Progress</motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard icon="🔥" value={stats.streakDays} label="Day streak" color="#F59E0B" />
          <StatCard icon="🔤" value={stats.totalWords} label="Words saved" color="#8B5CF6" />
          <StatCard icon="📚" value={stats.topicsCompleted} label="Topics completed" color="#22C55E" />
          <StatCard icon="⭐" value={`${stats.speakingScore}%`} label="Speaking score" color="#3B82F6" />
        </div>
      </div>

      {/* Weekly Progress Bar */}
      <motion.div variants={fade} className="bg-[#111113] border border-[#27272A] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-white">This Week</p>
          <p className="text-xs text-[#71717A]">{stats.weeklyMinutes} / 200 min</p>
        </div>
        <div className="h-2 bg-[#1A1A1E] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (stats.weeklyMinutes / 200) * 100)}%` }}
            transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-[#F59E0B] to-[#EF4444] rounded-full"
          />
        </div>
        <div className="flex justify-between mt-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
            <div key={day} className="flex flex-col items-center gap-1">
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                  i < 3 ? 'bg-[#F59E0B]/20 text-[#F59E0B]' : 'bg-[#1A1A1E] text-[#52525B]'
                }`}
              >
                {i < 3 ? '✓' : '·'}
              </div>
              <p className="text-[9px] text-[#52525B]">{day}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick start conversations */}
      <div>
        <motion.div variants={fade} className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[#71717A] uppercase tracking-wider">Quick Start</h2>
          <button onClick={() => setActiveSection('conversation')} className="text-xs text-[#F59E0B] hover:underline">See all →</button>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-3">
          {dailyScenarios.map((s) => (
            <motion.button
              key={s.id}
              variants={fade}
              onClick={() => setActiveSection('conversation')}
              className="group bg-[#111113] border border-[#27272A] rounded-2xl p-4 text-left hover:border-[#F59E0B]/40 hover:bg-[#1A1A1E] transition-all duration-200"
            >
              <div className="text-2xl mb-3">{s.icon}</div>
              <p className="text-sm font-semibold text-white mb-1 group-hover:text-[#F59E0B] transition-colors">{s.title}</p>
              <p className="text-xs text-[#71717A] line-clamp-2">{s.description}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  s.difficulty === 'beginner' ? 'bg-[#22C55E]/10 text-[#22C55E]' :
                  s.difficulty === 'intermediate' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                  'bg-[#EF4444]/10 text-[#EF4444]'
                }`}>
                  {s.difficulty}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Suggested topics */}
      <div>
        <motion.div variants={fade} className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[#71717A] uppercase tracking-wider">Recommended for You</h2>
          <button onClick={() => setActiveSection('academy')} className="text-xs text-[#F59E0B] hover:underline">Academy →</button>
        </motion.div>
        <div className="space-y-2">
          {suggestedTopics.map((topic) => (
            <motion.button
              key={topic.id}
              variants={fade}
              onClick={() => setActiveSection('academy')}
              className="w-full flex items-center gap-4 p-4 bg-[#111113] border border-[#27272A] rounded-xl text-left hover:border-[#3F3F46] hover:bg-[#1A1A1E] transition-all"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: `${topic.color}15` }}
              >
                {topic.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{topic.title}</p>
                <p className="text-xs text-[#71717A] truncate">{topic.summary}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[10px] text-[#52525B]">{topic.readTime}m</span>
                <span className="text-[#52525B]">→</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
