import { useState, useEffect } from 'react';
import Quiz from './components/Quiz';
import Phrases from './components/Phrases';
import Reading from './components/Reading';
import Progress from './components/Progress';
import './App.css';

const STORAGE_KEY = 'sjt-progress';

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { quizHistory: [], readingHistory: [] };
}

function saveProgress(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

const tabs = [
  { id: 'quiz', label: 'クイズ', icon: '🎯' },
  { id: 'phrases', label: 'フレーズ', icon: '💬' },
  { id: 'reading', label: '読解', icon: '📖' },
  { id: 'progress', label: '進捗', icon: '📊' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('quiz');
  const [progress, setProgress] = useState(loadProgress);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const handleUpdateProgress = (type, data) => {
    setProgress(prev => {
      if (type === 'quiz') {
        return { ...prev, quizHistory: [...prev.quizHistory, { ...data, date: Date.now() }] };
      } else if (type === 'reading') {
        return { ...prev, readingHistory: [...prev.readingHistory, { ...data, date: Date.now() }] };
      }
      return prev;
    });
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">🗾</span>
            <div>
              <h1>Japan English</h1>
              <p>日本文化で学ぶ英語</p>
            </div>
          </div>
        </div>
      </header>

      <main className="app-main">
        {activeTab === 'quiz' && <Quiz onUpdateProgress={handleUpdateProgress} />}
        {activeTab === 'phrases' && <Phrases />}
        {activeTab === 'reading' && <Reading onUpdateProgress={handleUpdateProgress} />}
        {activeTab === 'progress' && <Progress progress={progress} />}
      </main>

      <nav className="bottom-nav">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`nav-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="nav-icon">{tab.icon}</span>
            <span className="nav-label">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
