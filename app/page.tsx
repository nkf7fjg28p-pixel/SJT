'use client';
import dynamic from 'next/dynamic';
import { useAppStore } from '@/lib/store/appStore';
import Sidebar from '@/components/layout/Sidebar';
import MobileNav from '@/components/layout/MobileNav';

const Dashboard = dynamic(() => import('@/components/Dashboard'), { ssr: false });
const Conversation = dynamic(() => import('@/components/Conversation'), { ssr: false });
const Academy = dynamic(() => import('@/components/Academy'), { ssr: false });
const NewsExplorer = dynamic(() => import('@/components/NewsExplorer'), { ssr: false });
const Vocabulary = dynamic(() => import('@/components/Vocabulary'), { ssr: false });
const Analytics = dynamic(() => import('@/components/Analytics'), { ssr: false });

export default function Home() {
  const { activeSection } = useAppStore();

  return (
    <div className="flex min-h-screen bg-[#0A0A0B]">
      <Sidebar />
      <main className="flex-1 md:ml-60 pb-20 md:pb-0 min-h-screen">
        <div className="p-4 md:p-8">
          {activeSection === 'dashboard' && <Dashboard />}
          {activeSection === 'conversation' && <Conversation />}
          {activeSection === 'academy' && <Academy />}
          {activeSection === 'news' && <NewsExplorer />}
          {activeSection === 'vocabulary' && <Vocabulary />}
          {activeSection === 'analytics' && <Analytics />}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
