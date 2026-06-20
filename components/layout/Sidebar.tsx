'use client';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store/appStore';

const navItems = [
  { id: 'dashboard', icon: '⬡', label: 'Dashboard' },
  { id: 'conversation', icon: '💬', label: 'AI Conversation' },
  { id: 'academy', icon: '📚', label: 'Academy' },
  { id: 'news', icon: '📰', label: 'News Explorer' },
  { id: 'vocabulary', icon: '🔤', label: 'Vocabulary' },
  { id: 'analytics', icon: '📊', label: 'Analytics' },
];

export default function Sidebar() {
  const { activeSection, setActiveSection, stats } = useAppStore();

  return (
    <aside className="hidden md:flex flex-col w-60 min-h-screen bg-[#111113] border-r border-[#27272A] fixed left-0 top-0 bottom-0 z-40">
      {/* Logo */}
      <div className="p-5 border-b border-[#27272A]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F59E0B] to-[#EF4444] flex items-center justify-center text-sm">🗾</div>
          <div>
            <p className="text-[13px] font-bold tracking-tight text-white">JapanSpeak</p>
            <p className="text-[10px] text-[#71717A]">Think in English</p>
          </div>
        </div>
      </div>

      {/* Streak */}
      <div className="mx-3 mt-3 p-3 rounded-xl bg-gradient-to-r from-[#F59E0B]/10 to-transparent border border-[#F59E0B]/20">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔥</span>
          <div>
            <p className="text-xs font-bold text-[#F59E0B]">{stats.streakDays} day streak</p>
            <p className="text-[10px] text-[#71717A]">Keep it going!</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 mt-2">
        {navItems.map((item) => {
          const active = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 group ${
                active
                  ? 'bg-[#F59E0B]/10 text-[#F59E0B]'
                  : 'text-[#71717A] hover:text-white hover:bg-[#1A1A1E]'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span className="text-[13px] font-medium">{item.label}</span>
              {active && (
                <motion.div
                  layoutId="activeIndicator"
                  className="ml-auto w-1 h-4 rounded-full bg-[#F59E0B]"
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-[#27272A]">
        <div className="flex items-center gap-3 p-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#3B82F6] flex items-center justify-center text-xs font-bold text-white">
            U
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">User</p>
            <p className="text-[10px] text-[#71717A]">{stats.totalWords} words saved</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
