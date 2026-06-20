import { useState, useCallback } from 'react';
import { vocabularyData, categories } from '../data/vocabulary';
import {
  loadMastery, saveMastery, updateMastery,
  getQuestionType, getMasteryLabel, getMasteryColor,
  selectSessionWords
} from '../data/masteryStore';
import { SpeakButton, PronunciationBar } from './SpeakButton';

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

function buildQuestion(wordData, allWords, qType) {
  const word = wordData;

  if (qType === 'ja-meaning') {
    const others = shuffle(allWords.filter(w => w.id !== word.id)).slice(0, 3);
    const options = shuffle([word.japanese, ...others.map(w => w.japanese)]);
    return {
      type: qType,
      typeLabel: '日本語の意味は？',
      prompt: word.word,
      sub: `"${word.exampleFull}"`,
      options,
      correct: word.japanese,
    };
  }

  if (qType === 'en-definition') {
    return {
      type: qType,
      typeLabel: '英語の定義を選べ',
      prompt: word.word,
      sub: `Japanese: ${word.japanese}`,
      options: shuffle(word.definitionOptions),
      correct: word.definition,
    };
  }

  if (qType === 'fill-blank') {
    return {
      type: qType,
      typeLabel: '空欄を埋めよ',
      prompt: word.blank,
      sub: null,
      options: shuffle(word.blankOptions),
      correct: word.word,
    };
  }

  if (qType === 'usage') {
    return {
      type: qType,
      typeLabel: '正しい用法を選べ',
      prompt: `"${word.word}" (${word.japanese})`,
      sub: word.definition,
      options: word.usageOptions,
      correct: word.usageOptions[word.correctUsage],
    };
  }
}

const TYPE_BADGE = {
  'ja-meaning':     { label: 'LEVEL 1 — 日本語訳', color: '#27AE60' },
  'en-definition':  { label: 'LEVEL 2 — 英語定義', color: '#2980B9' },
  'fill-blank':     { label: 'LEVEL 3 — 空欄補充', color: '#8E44AD' },
  'usage':          { label: 'LEVEL 4 — 用法判断', color: '#C0392B' },
};

export default function Quiz({ onUpdateProgress }) {
  const [mastery, setMastery] = useState(loadMastery);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [questionCount, setQuestionCount] = useState(10);
  const [session, setSession] = useState(null);
  const [view, setView] = useState('setup'); // setup | quiz | result | words

  const pool = selectedCategory === 'all'
    ? vocabularyData
    : vocabularyData.filter(w => w.category === selectedCategory);

  const startQuiz = useCallback(() => {
    const m = loadMastery();
    const words = selectSessionWords(pool, m, questionCount);
    const questions = words.map(w => {
      const qType = getQuestionType(m[w.id] ?? 0);
      return { word: w, question: buildQuestion(w, vocabularyData, qType), selected: null };
    });
    setSession({ questions, current: 0, score: 0, results: [] });
    setView('quiz');
  }, [pool, questionCount]);

  const handleAnswer = (option) => {
    if (!session) return;
    const q = session.questions[session.current];
    if (q.selected !== null) return;

    const correct = option === q.question.correct;
    const newMastery = updateMastery(mastery, q.word.id, correct);
    setMastery(newMastery);
    saveMastery(newMastery);

    const updated = session.questions.map((item, i) =>
      i === session.current ? { ...item, selected: option } : item
    );
    setSession(prev => ({
      ...prev,
      questions: updated,
      score: correct ? prev.score + 1 : prev.score,
      results: [...prev.results, { word: q.word, question: q.question, chosen: option, correct }],
    }));
  };

  const handleNext = () => {
    if (!session) return;
    if (session.current + 1 >= session.questions.length) {
      const pct = Math.round((session.score / session.questions.length) * 100);
      onUpdateProgress('quiz', { score: session.score, total: session.questions.length, pct });
      setView('result');
    } else {
      setSession(prev => ({ ...prev, current: prev.current + 1 }));
    }
  };

  // ===== SETUP VIEW =====
  if (view === 'setup') {
    const masteredCount = Object.values(mastery).filter(v => v >= 4).length;
    const seenCount = Object.keys(mastery).length;
    return (
      <div className="quiz-setup">
        <h2 className="section-title">🎯 適応型単語クイズ</h2>
        <p className="section-desc">
          正答率に応じて問題が難化します。C1〜C2レベルの語彙を習得しましょう。
        </p>

        {seenCount > 0 && (
          <div className="mastery-overview">
            <div className="mo-stat"><span className="mo-num">{seenCount}</span><span className="mo-label">学習済み</span></div>
            <div className="mo-stat"><span className="mo-num" style={{ color: '#27AE60' }}>{masteredCount}</span><span className="mo-label">習得済み</span></div>
            <div className="mo-stat"><span className="mo-num">{vocabularyData.length}</span><span className="mo-label">総単語数</span></div>
            <button className="words-btn" onClick={() => setView('words')}>単語一覧 →</button>
          </div>
        )}

        <div className="level-guide">
          <h4>問題レベルガイド</h4>
          {Object.entries(TYPE_BADGE).map(([k, v]) => (
            <div key={k} className="level-row">
              <span className="level-dot" style={{ background: v.color }} />
              <span>{v.label}</span>
            </div>
          ))}
        </div>

        <div className="setup-card">
          <div className="setup-group">
            <label>カテゴリ</label>
            <div className="category-grid">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`cat-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
          </div>
          <div className="setup-group">
            <label>問題数</label>
            <div className="count-options">
              {[5, 10, 15, 20].map(n => (
                <button
                  key={n}
                  className={`count-btn ${questionCount === n ? 'active' : ''}`}
                  onClick={() => setQuestionCount(n)}
                >
                  {n}問
                </button>
              ))}
            </div>
          </div>
          <button className="start-btn" onClick={startQuiz}>スタート ▶</button>
        </div>
      </div>
    );
  }

  // ===== WORDS VIEW =====
  if (view === 'words') {
    return (
      <div className="words-view">
        <button className="back-btn" onClick={() => setView('setup')}>← 戻る</button>
        <h2 className="section-title">📚 単語一覧</h2>
        <div className="words-list">
          {vocabularyData.map(w => {
            const m = mastery[w.id] ?? 0;
            return (
              <div key={w.id} className="word-row">
                <div className="word-row-left">
                  <div className="word-row-head">
                    <span className="word-row-en">{w.word}</span>
                    <SpeakButton text={w.word} size="sm" />
                  </div>
                  {w.ipa && <span className="word-row-ipa">/{w.ipa}/</span>}
                  <span className="word-row-ja">{w.japanese}</span>
                  <span className="word-row-def">{w.definition}</span>
                </div>
                <div className="word-row-right">
                  <span className="mastery-badge" style={{ background: getMasteryColor(m) }}>
                    {getMasteryLabel(m)}
                  </span>
                  <div className="mastery-pips">
                    {[0,1,2,3,4].map(i => (
                      <span key={i} className="pip" style={{ background: i < m ? getMasteryColor(m) : '#E0E0E0' }} />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ===== QUIZ VIEW =====
  if (view === 'quiz' && session) {
    const qi = session.current;
    const item = session.questions[qi];
    const q = item.question;
    const selected = item.selected;
    const badge = TYPE_BADGE[q.type];
    const progress = ((qi + 1) / session.questions.length) * 100;
    const wordMastery = mastery[item.word.id] ?? 0;

    return (
      <div className="quiz-game">
        <div className="quiz-header">
          <span className="quiz-counter">{qi + 1} / {session.questions.length}</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="quiz-score">✅ {session.score}</span>
        </div>

        <div className="q-level-badge" style={{ background: badge.color }}>{badge.label}</div>

        <div className="question-card">
          {q.type === 'fill-blank' ? (
            <>
              <p className="q-ask-small">正しい単語を選んで文を完成させよ</p>
              <h3 className="q-blank">{q.prompt}</h3>
              <PronunciationBar word={item.word.word} ipa={item.word.ipa} />
            </>
          ) : q.type === 'usage' ? (
            <>
              <p className="q-ask-small">どの文が単語を正しく使っているか</p>
              <h3 className="q-word">{q.prompt}</h3>
              <PronunciationBar word={item.word.word} ipa={item.word.ipa} />
              {q.sub && <p className="q-sub">{q.sub}</p>}
            </>
          ) : (
            <>
              <h3 className="q-word">{q.prompt}</h3>
              <PronunciationBar word={item.word.word} ipa={item.word.ipa} />
              {q.sub && <p className="q-sub">{q.sub}</p>}
              <p className="q-ask">{q.typeLabel}</p>
            </>
          )}

          <div className="word-mastery-row">
            <span style={{ color: getMasteryColor(wordMastery), fontSize: 12, fontWeight: 700 }}>
              {getMasteryLabel(wordMastery)}
            </span>
            <div className="mastery-pips">
              {[0,1,2,3,4].map(i => (
                <span key={i} className="pip" style={{ background: i < wordMastery ? getMasteryColor(wordMastery) : '#E0E0E0' }} />
              ))}
            </div>
          </div>
        </div>

        <div className={`options-grid ${q.type === 'usage' ? 'options-col' : ''}`}>
          {q.options.map((opt, i) => {
            let cls = 'option-btn';
            if (q.type === 'usage') cls += ' option-usage';
            if (selected !== null) {
              if (opt === q.correct) cls += ' correct';
              else if (opt === selected) cls += ' wrong';
            }
            return (
              <button key={i} className={cls} onClick={() => handleAnswer(opt)}>
                {q.type === 'usage' && <span className="usage-letter">{String.fromCharCode(65+i)}</span>}
                {opt}
              </button>
            );
          })}
        </div>

        {selected !== null && (
          <div className={`feedback ${selected === q.correct ? 'fb-correct' : 'fb-wrong'}`}>
            {selected === q.correct
              ? `🎉 正解！ → 習熟度: ${getMasteryLabel(Math.min(5, (mastery[item.word.id]??0)))}`
              : `❌ 不正解 → 正解: 「${q.correct}」`
            }
          </div>
        )}

        {selected !== null && (
          <button className="next-btn" onClick={handleNext}>
            {qi + 1 >= session.questions.length ? '結果を見る' : '次の問題 →'}
          </button>
        )}
      </div>
    );
  }

  // ===== RESULT VIEW =====
  if (view === 'result' && session) {
    const pct = Math.round((session.score / session.questions.length) * 100);
    const typeBreakdown = {};
    session.results.forEach(r => {
      const t = r.question.type;
      if (!typeBreakdown[t]) typeBreakdown[t] = { correct: 0, total: 0 };
      typeBreakdown[t].total++;
      if (r.correct) typeBreakdown[t].correct++;
    });

    return (
      <div className="quiz-result">
        <h2 className="section-title">クイズ結果</h2>
        <div className="result-score">
          <div className="score-circle" style={{ '--pct': pct }}>
            <span className="score-num">{pct}%</span>
          </div>
          <p className="score-label">{session.score} / {session.questions.length} 正解</p>
          <p className="score-comment">
            {pct >= 90 ? '🏆 Outstanding!' : pct >= 75 ? '🌟 Well done!' : pct >= 55 ? '👍 Good effort!' : '📚 Keep studying!'}
          </p>
        </div>

        <div className="type-breakdown">
          <h3>レベル別成績</h3>
          {Object.entries(typeBreakdown).map(([type, stat]) => {
            const badge = TYPE_BADGE[type];
            const typePct = Math.round((stat.correct / stat.total) * 100);
            return (
              <div key={type} className="tb-row">
                <span className="tb-badge" style={{ background: badge.color }}>{badge.label}</span>
                <div className="tb-bar-wrap">
                  <div className="tb-bar" style={{ width: `${typePct}%`, background: badge.color }} />
                </div>
                <span className="tb-pct">{typePct}% ({stat.correct}/{stat.total})</span>
              </div>
            );
          })}
        </div>

        <div className="result-list">
          <h3>問題の振り返り</h3>
          {session.results.map((r, i) => (
            <div key={i} className={`result-item ${r.correct ? 'correct' : 'wrong'}`}>
              <span className="result-icon">{r.correct ? '✅' : '❌'}</span>
              <div className="result-content">
                <strong>{r.word.word}</strong>
                <span className="result-ja">{r.word.japanese}</span>
                {!r.correct && (
                  <span className="result-ans">
                    正解: <span className="right-ans">{r.question.correct}</span>
                  </span>
                )}
              </div>
              <span className="result-type" style={{ background: TYPE_BADGE[r.question.type].color }}>
                L{Object.keys(TYPE_BADGE).indexOf(r.question.type) + 1}
              </span>
            </div>
          ))}
        </div>

        <div className="result-actions">
          <button className="start-btn" onClick={startQuiz}>もう一度</button>
          <button className="outline-btn" onClick={() => setView('setup')}>設定に戻る</button>
          <button className="outline-btn" onClick={() => setView('words')}>単語一覧を見る</button>
        </div>
      </div>
    );
  }

  return null;
}
