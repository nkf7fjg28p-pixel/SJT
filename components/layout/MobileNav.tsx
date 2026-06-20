'use client';
import { useAppStore } from '@/lib/store/appStore';

const navItems = [
  { id: 'dashboard', icon: '⬡', label: 'Home' },
  { id: 'conversation', icon: '💬', label: 'Chat' },
  { id: 'academy', icon: '📚', label: 'Learn' },
  { id: 'news', icon: '📰', label: 'News' },
  { id: 'vocabulary', icon: '🔤', label: 'Words' },
];

export default function MobileNav() {
  const { activeSection, setActiveSection } = useAppStore();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#111113] border-t border-[#27272A] flex">
      {navItems.map((item) => {
        const active = activeSection === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
              active ? 'text-[#F59E0B]' : 'text-[#52525B]'
            }`}
          >
            <span className="text-lg leading-none">{item.icon}</span>
            <span className="text-[9px] font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
