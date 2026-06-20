export default function Progress({ progress }) {
  const { quizHistory, readingHistory } = progress;

  const totalQuizzes = quizHistory.length;
  const avgQuizScore = totalQuizzes > 0
    ? Math.round(quizHistory.reduce((acc, q) => acc + q.pct, 0) / totalQuizzes)
    : 0;
  const totalReadings = readingHistory.length;
  const avgReadingScore = totalReadings > 0
    ? Math.round(readingHistory.reduce((acc, r) => acc + Math.round((r.score / r.total) * 100), 0) / totalReadings)
    : 0;

  const recentActivity = [
    ...quizHistory.map(q => ({ type: 'quiz', ...q })),
    ...readingHistory.map(r => ({ type: 'reading', ...r })),
  ].sort((a, b) => b.date - a.date).slice(0, 8);

  return (
    <div className="progress-page">
      <h2 className="section-title">📊 学習の進捗</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon">🎯</span>
          <span className="stat-num">{totalQuizzes}</span>
          <span className="stat-label">クイズ回数</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">✅</span>
          <span className="stat-num">{avgQuizScore}%</span>
          <span className="stat-label">クイズ平均正解率</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">📖</span>
          <span className="stat-num">{totalReadings}</span>
          <span className="stat-label">読解挑戦回数</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🌟</span>
          <span className="stat-num">{avgReadingScore}%</span>
          <span className="stat-label">読解平均正解率</span>
        </div>
      </div>

      {recentActivity.length > 0 ? (
        <div className="activity-section">
          <h3>最近の学習履歴</h3>
          <div className="activity-list">
            {recentActivity.map((item, i) => (
              <div key={i} className="activity-item">
                <span className="activity-icon">
                  {item.type === 'quiz' ? '🎯' : '📖'}
                </span>
                <div className="activity-info">
                  <span className="activity-type">
                    {item.type === 'quiz' ? 'クイズ' : '読解'}
                    {item.type === 'reading' && item.title ? ` — ${item.title}` : ''}
                  </span>
                  <span className="activity-date">
                    {new Date(item.date).toLocaleDateString('ja-JP')}
                  </span>
                </div>
                <div className="activity-score">
                  {item.type === 'quiz'
                    ? <><strong>{item.pct}%</strong> ({item.score}/{item.total})</>
                    : <><strong>{Math.round((item.score / item.total) * 100)}%</strong> ({item.score}/{item.total})</>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="empty-progress">
          <p>📚 まだ学習記録がありません。</p>
          <p>クイズや読解問題に挑戦して進捗を記録しましょう！</p>
        </div>
      )}

      {recentActivity.length > 0 && (
        <div className="motivation">
          {avgQuizScore >= 80 || avgReadingScore >= 80
            ? '🏆 素晴らしい成績です！この調子で続けましょう！'
            : totalQuizzes + totalReadings >= 5
            ? '👍 コツコツ続けることが大切です。頑張っています！'
            : '🌱 学習をスタートしました！毎日少しずつ続けましょう。'}
        </div>
      )}
    </div>
  );
}
