import { useState, useEffect, useCallback } from 'react';
import { vocabularyData, categories } from '../data/vocabulary';

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function generateQuestion(word, allWords) {
  const otherWords = allWords.filter(w => w.id !== word.id);
  const wrongOptions = shuffle(otherWords).slice(0, 3).map(w => w.japanese);
  const options = shuffle([word.japanese, ...wrongOptions]);
  return {
    word: word.word,
    example: word.example,
    category: word.category,
    correct: word.japanese,
    options,
  };
}

export default function Quiz({ onUpdateProgress }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [started, setStarted] = useState(false);
  const [questionCount, setQuestionCount] = useState(10);
  const [results, setResults] = useState([]);

  const startQuiz = useCallback(() => {
    const pool = selectedCategory === 'all'
      ? vocabularyData
      : vocabularyData.filter(w => w.category === selectedCategory);
    const shuffled = shuffle(pool).slice(0, questionCount);
    const qs = shuffled.map(w => generateQuestion(w, vocabularyData));
    setQuestions(qs);
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setResults([]);
    setStarted(true);
  }, [selectedCategory, questionCount]);

  const handleAnswer = (option) => {
    if (selected !== null) return;
    setSelected(option);
    const correct = option === questions[current].correct;
    const newScore = correct ? score + 1 : score;
    if (correct) setScore(newScore);
    setResults(prev => [...prev, { ...questions[current], chosen: option, correct }]);
  };

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      setFinished(true);
      const pct = Math.round((score / questions.length) * 100);
      onUpdateProgress('quiz', { score, total: questions.length, pct });
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
    }
  };

  if (!started) {
    return (
      <div className="quiz-setup">
        <h2 className="section-title">🎯 単語クイズ</h2>
        <p className="section-desc">日本文化・観光の英単語を四択問題で学びましょう</p>
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

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="quiz-result">
        <h2 className="section-title">クイズ結果</h2>
        <div className="result-score">
          <div className="score-circle" style={{ '--pct': pct }}>
            <span className="score-num">{pct}%</span>
          </div>
          <p className="score-label">{score} / {questions.length} 正解</p>
          <p className="score-comment">
            {pct >= 90 ? '🏆 素晴らしい！' : pct >= 70 ? '🌟 よくできました！' : pct >= 50 ? '👍 もう少し！' : '📚 もっと練習しよう！'}
          </p>
        </div>
        <div className="result-list">
          <h3>問題の振り返り</h3>
          {results.map((r, i) => (
            <div key={i} className={`result-item ${r.correct ? 'correct' : 'wrong'}`}>
              <span className="result-icon">{r.correct ? '✅' : '❌'}</span>
              <div>
                <strong>{r.word}</strong>
                <span className="result-ans">
                  {r.correct ? r.correct : <><span className="wrong-ans">{r.chosen}</span> → <span className="right-ans">{r.correct}</span></>}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="result-actions">
          <button className="start-btn" onClick={() => startQuiz()}>もう一度</button>
          <button className="outline-btn" onClick={() => setStarted(false)}>設定に戻る</button>
        </div>
      </div>
    );
  }

  const q = questions[current];
  const progress = ((current + 1) / questions.length) * 100;

  return (
    <div className="quiz-game">
      <div className="quiz-header">
        <span className="quiz-counter">{current + 1} / {questions.length}</span>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="quiz-score">✅ {score}</span>
      </div>

      <div className="question-card">
        <p className="q-example">"{q.example}"</p>
        <h3 className="q-word">{q.word}</h3>
        <p className="q-ask">日本語の意味は？</p>
      </div>

      <div className="options-grid">
        {q.options.map((opt, i) => {
          let cls = 'option-btn';
          if (selected !== null) {
            if (opt === q.correct) cls += ' correct';
            else if (opt === selected) cls += ' wrong';
          }
          return (
            <button key={i} className={cls} onClick={() => handleAnswer(opt)}>
              {opt}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className={`feedback ${selected === q.correct ? 'fb-correct' : 'fb-wrong'}`}>
          {selected === q.correct ? '🎉 正解！' : `❌ 不正解 → 正解は「${q.correct}」`}
        </div>
      )}

      {selected !== null && (
        <button className="next-btn" onClick={handleNext}>
          {current + 1 >= questions.length ? '結果を見る' : '次の問題 →'}
        </button>
      )}
    </div>
  );
}
