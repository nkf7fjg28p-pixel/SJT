import { useState } from 'react';
import { readingsData } from '../data/readings';

const levelLabel = { basic: '初級', intermediate: '中級', advanced: '上級' };
const levelColor = { basic: '#5BAD6F', intermediate: '#E67E22', advanced: '#E85D5D' };

export default function Reading({ onUpdateProgress }) {
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (qIdx, optIdx) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < selected.questions.length) {
      alert('すべての問題に答えてください。');
      return;
    }
    setSubmitted(true);
    const score = selected.questions.filter((q, i) => answers[i] === q.answer).length;
    onUpdateProgress('reading', { score, total: selected.questions.length, title: selected.title });
  };

  const handleBack = () => {
    setSelected(null);
    setAnswers({});
    setSubmitted(false);
  };

  if (selected) {
    const score = submitted
      ? selected.questions.filter((q, i) => answers[i] === q.answer).length
      : 0;

    return (
      <div className="reading-detail">
        <button className="back-btn" onClick={handleBack}>← 一覧に戻る</button>

        <div className="reading-header">
          <span className="reading-emoji">{selected.image}</span>
          <div>
            <h2 className="reading-title">{selected.title}</h2>
            <p className="reading-title-ja">{selected.titleJa}</p>
            <span className="level-badge" style={{ background: levelColor[selected.level] }}>
              {levelLabel[selected.level]}
            </span>
          </div>
        </div>

        <div className="reading-text">
          {selected.text.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <div className="reading-questions">
          <h3>📝 理解度チェック</h3>
          {selected.questions.map((q, qi) => {
            const userAns = answers[qi];
            const isCorrect = userAns === q.answer;
            return (
              <div key={qi} className={`rq-block ${submitted ? (isCorrect ? 'rq-correct' : 'rq-wrong') : ''}`}>
                <p className="rq-question"><strong>Q{qi + 1}.</strong> {q.q}</p>
                <div className="rq-options">
                  {q.options.map((opt, oi) => {
                    let cls = 'rq-option';
                    if (submitted) {
                      if (oi === q.answer) cls += ' rq-ans-correct';
                      else if (oi === userAns) cls += ' rq-ans-wrong';
                    } else if (userAns === oi) {
                      cls += ' rq-selected';
                    }
                    return (
                      <button key={oi} className={cls} onClick={() => handleSelect(qi, oi)}>
                        {String.fromCharCode(65 + oi)}. {opt}
                      </button>
                    );
                  })}
                </div>
                {submitted && (
                  <div className={`rq-explanation ${isCorrect ? 'exp-correct' : 'exp-wrong'}`}>
                    {isCorrect ? '✅ 正解！' : '❌ 不正解'} — {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!submitted ? (
          <button className="start-btn" onClick={handleSubmit}>答え合わせ</button>
        ) : (
          <div className="reading-result">
            <div className="reading-score">
              {score} / {selected.questions.length} 正解
              <span className="reading-score-pct">
                ({Math.round((score / selected.questions.length) * 100)}%)
              </span>
            </div>
            <button className="outline-btn" onClick={handleBack}>他の記事を読む</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="reading-home">
      <h2 className="section-title">📖 読解問題</h2>
      <p className="section-desc">日本文化に関する英文を読んで、理解度を確認しましょう。</p>
      <div className="reading-list">
        {readingsData.map(r => (
          <button key={r.id} className="reading-card" onClick={() => { setSelected(r); setAnswers({}); setSubmitted(false); }}>
            <span className="reading-card-emoji">{r.image}</span>
            <div className="reading-card-info">
              <h3>{r.title}</h3>
              <p>{r.titleJa}</p>
              <div className="reading-card-meta">
                <span className="level-badge" style={{ background: levelColor[r.level] }}>
                  {levelLabel[r.level]}
                </span>
                <span className="q-count">🔍 {r.questions.length}問</span>
              </div>
            </div>
            <span className="reading-arrow">→</span>
          </button>
        ))}
      </div>
    </div>
  );
}
