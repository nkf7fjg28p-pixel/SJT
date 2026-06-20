import { useState } from 'react';
import { phrasesData } from '../data/phrases';

export default function Phrases() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [flipped, setFlipped] = useState({});

  const toggleFlip = (catId, sceneIdx, phraseIdx) => {
    const key = `${catId}-${sceneIdx}-${phraseIdx}`;
    setFlipped(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (selectedCategory) {
    const cat = phrasesData.find(c => c.id === selectedCategory);
    return (
      <div className="phrases-detail">
        <button className="back-btn" onClick={() => setSelectedCategory(null)}>
          ← カテゴリ一覧に戻る
        </button>
        <h2 className="section-title" style={{ color: cat.color }}>
          {cat.icon} {cat.title}
        </h2>
        {cat.scenes.map((scene, si) => (
          <div key={si} className="scene-block">
            <h3 className="scene-title">📍 {scene.scene}</h3>
            <div className="phrase-list">
              {scene.phrases.map((phrase, pi) => {
                const key = `${cat.id}-${si}-${pi}`;
                const isFlipped = flipped[key];
                return (
                  <div
                    key={pi}
                    className={`phrase-card ${isFlipped ? 'flipped' : ''}`}
                    onClick={() => toggleFlip(cat.id, si, pi)}
                  >
                    <div className="phrase-front">
                      <span className="phrase-en">{phrase.en}</span>
                      <span className="tap-hint">タップして日本語を表示</span>
                    </div>
                    <div className="phrase-back">
                      <span className="phrase-ja">{phrase.ja}</span>
                      <span className="phrase-en-small">{phrase.en}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="phrases-home">
      <h2 className="section-title">💬 フレーズ練習</h2>
      <p className="section-desc">シーン別の会話フレーズを学びましょう。カードをタップすると日本語訳が表示されます。</p>
      <div className="phrases-grid">
        {phrasesData.map(cat => (
          <button
            key={cat.id}
            className="phrase-cat-card"
            style={{ '--cat-color': cat.color }}
            onClick={() => setSelectedCategory(cat.id)}
          >
            <span className="phrase-cat-icon">{cat.icon}</span>
            <span className="phrase-cat-title">{cat.title}</span>
            <span className="phrase-cat-count">
              {cat.scenes.reduce((acc, s) => acc + s.phrases.length, 0)} フレーズ
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
