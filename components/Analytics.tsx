'use client';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store/appStore';

const weekData = [32, 45, 28, 60, 40, 55, 20];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function Bar({ value, max, label, color }: { value: number; max: number; label: string; color: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <p className="text-[9px] text-[#52525B] font-mono">{value}m</p>
      <div className="w-8 bg-[#1A1A1E] rounded-full overflow-hidden" style={{ height: 80 }}>
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${(value / max) * 100}%` }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          className="w-full rounded-full mt-auto"
          style={{ background: color, marginTop: 'auto' }}
        />
      </div>
      <p className="text-[9px] text-[#52525B]">{label}</p>
    </div>
  );
}

function SkillBar({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <p className="text-xs text-[#A1A1AA]">{label}</p>
        <p className="text-xs font-bold" style={{ color }}>{score}%</p>
      </div>
      <div className="h-1.5 bg-[#1A1A1E] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
    </div>
  );
}

export default function Analytics() {
  const { stats, savedWords, completedTopics } = useAppStore();
  const maxMin = Math.max(...weekData);

  const masteredWords = savedWords.filter((w) => w.masteryLevel >= 4).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      <div>
        <h1 className="text-xl font-bold text-white">Learning Analytics</h1>
        <p className="text-sm text-[#71717A] mt-1">Track your progress. See where you're growing.</p>
      </div>

      {/* Streak + overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: '🔥', value: stats.streakDays, label: 'Day Streak', color: '#F59E0B' },
          { icon: '🔤', value: savedWords.length, label: 'Words Saved', color: '#8B5CF6' },
          { icon: '📚', value: completedTopics.length, label: 'Topics Done', color: '#22C55E' },
          { icon: '⭐', value: `${stats.speakingScore}%`, label: 'Speaking', color: '#3B82F6' },
        ].map((s) => (
          <div key={s.label} className="bg-[#111113] border border-[#27272A] rounded-2xl p-4">
            <div className="text-2xl mb-2">{s.icon}</div>
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-[#71717A]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Weekly Activity */}
      <div className="bg-[#111113] border border-[#27272A] rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-white mb-4">Weekly Study Time</h2>
        <div className="flex items-end justify-around">
          {weekData.map((v, i) => (
            <Bar key={days[i]} value={v} max={maxMin} label={days[i]} color={i === 3 ? '#F59E0B' : '#27272A'} />
          ))}
        </div>
        <p className="text-xs text-[#71717A] mt-4 text-center">{stats.weeklyMinutes} minutes this week · Best day: Thursday (60 min)</p>
      </div>

      {/* Skill Breakdown */}
      <div className="bg-[#111113] border border-[#27272A] rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-white mb-5">Skill Breakdown</h2>
        <div className="space-y-4">
          <SkillBar label="Vocabulary Range" score={Math.min(100, Math.round((savedWords.length / 200) * 100) + 23)} color="#8B5CF6" />
          <SkillBar label="Reading Comprehension" score={72} color="#3B82F6" />
          <SkillBar label="Conversation Confidence" score={stats.speakingScore} color="#22C55E" />
          <SkillBar label="Cultural Knowledge" score={Math.min(100, completedTopics.length * 12 + 20)} color="#F59E0B" />
          <SkillBar label="Grammar Accuracy" score={68} color="#EF4444" />
        </div>
      </div>

      {/* Vocabulary mastery */}
      <div className="bg-[#111113] border border-[#27272A] rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-white mb-4">Vocabulary Mastery</h2>
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 flex-shrink-0">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="30" stroke="#1A1A1E" strokeWidth="8" fill="none" />
              <motion.circle
                cx="40" cy="40" r="30"
                stroke="#22C55E" strokeWidth="8" fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 30}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 30 }}
                animate={{ strokeDashoffset: savedWords.length > 0 ? 2 * Math.PI * 30 * (1 - masteredWords / savedWords.length) : 2 * Math.PI * 30 }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-xs font-bold text-white">
                {savedWords.length > 0 ? Math.round((masteredWords / savedWords.length) * 100) : 0}%
              </p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-white">{masteredWords} words mastered</p>
            <p className="text-xs text-[#71717A]">{savedWords.length - masteredWords} still in review</p>
            <p className="text-xs text-[#52525B]">Target: 500 words for C1 fluency</p>
          </div>
        </div>
      </div>

      {/* Monthly summary */}
      <div className="bg-gradient-to-br from-[#1A1205] to-[#111113] border border-[#F59E0B]/20 rounded-2xl p-5">
        <p className="text-xs font-bold text-[#F59E0B] uppercase tracking-wider mb-3">March 2025 Summary</p>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-white">142</p>
            <p className="text-[10px] text-[#71717A]">Minutes studied</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">47</p>
            <p className="text-[10px] text-[#71717A]">Words saved</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">8</p>
            <p className="text-[10px] text-[#71717A]">Conversations</p>
          </div>
        </div>
        <div className="mt-4 p-3 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-xl">
          <p className="text-xs text-[#22C55E] font-medium">🚀 You're improving! Speaking confidence up 12% this month.</p>
        </div>
      </div>
    </motion.div>
  );
}
