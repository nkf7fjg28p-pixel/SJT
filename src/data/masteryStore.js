const KEY = 'sjt-mastery';

export function loadMastery() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch {
    return {};
  }
}

export function saveMastery(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

// mastery level 0-5 per word id
// 0 = never seen, 1 = seen once wrong, 2 = seen correct once
// 3 = correct multiple times, 4 = proficient, 5 = mastered
export function updateMastery(mastery, wordId, correct) {
  const current = mastery[wordId] ?? 0;
  let next;
  if (correct) {
    next = Math.min(5, current + 1);
  } else {
    next = Math.max(0, current - 1);
  }
  return { ...mastery, [wordId]: next };
}

// Returns question type based on word mastery level
// 0-1: ja-meaning (choose Japanese meaning from 4 options)
// 2:   en-definition (choose English definition from 4 options)
// 3:   fill-blank (choose word that fills blank in sentence)
// 4-5: usage (choose sentence that correctly uses the word)
export function getQuestionType(masteryLevel) {
  if (masteryLevel <= 1) return 'ja-meaning';
  if (masteryLevel === 2) return 'en-definition';
  if (masteryLevel === 3) return 'fill-blank';
  return 'usage';
}

export function getMasteryLabel(level) {
  const labels = ['未学習', '初見', '基礎', '理解中', '習熟', '完全習得'];
  return labels[level] ?? '未学習';
}

export function getMasteryColor(level) {
  const colors = ['#BDC3C7', '#E74C3C', '#E67E22', '#F1C40F', '#2ECC71', '#27AE60'];
  return colors[level] ?? '#BDC3C7';
}

// Select words for a session using spaced repetition priority:
// Priority: lower mastery = higher priority
// Mix: 60% low mastery (0-2), 30% medium (3), 10% high (4-5)
export function selectSessionWords(allWords, mastery, count) {
  const withMastery = allWords.map(w => ({ ...w, m: mastery[w.id] ?? 0 }));
  const low = withMastery.filter(w => w.m <= 2);
  const mid = withMastery.filter(w => w.m === 3);
  const high = withMastery.filter(w => w.m >= 4);

  function pick(pool, n) {
    return shuffle(pool).slice(0, n);
  }

  const nLow = Math.min(Math.ceil(count * 0.6), low.length);
  const nMid = Math.min(Math.ceil(count * 0.3), mid.length);
  const nHigh = Math.min(count - nLow - nMid, high.length);

  const selected = [...pick(low, nLow), ...pick(mid, nMid), ...pick(high, nHigh)];
  // Fill remaining slots if needed
  if (selected.length < count) {
    const used = new Set(selected.map(w => w.id));
    const rest = shuffle(withMastery.filter(w => !used.has(w.id)));
    selected.push(...rest.slice(0, count - selected.length));
  }

  return shuffle(selected).slice(0, count);
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}
