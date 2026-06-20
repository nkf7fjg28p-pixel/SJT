import { useSpeech } from '../hooks/useSpeech';

export function SpeakButton({ text, size = 'md', rate, label }) {
  const { supported, speaking, speak, stop } = useSpeech();
  if (!supported) return null;

  const handleClick = (e) => {
    e.stopPropagation();
    if (speaking) { stop(); return; }
    speak(text, rate ? { rate } : undefined);
  };

  const sizes = {
    sm: { fontSize: 16, padding: '4px 8px' },
    md: { fontSize: 20, padding: '6px 10px' },
    lg: { fontSize: 26, padding: '8px 14px' },
  };

  return (
    <button
      className={`speak-btn ${speaking ? 'speaking' : ''}`}
      onClick={handleClick}
      style={sizes[size]}
      title={`Pronounce: ${text}`}
      aria-label={`Play pronunciation of ${text}`}
    >
      {speaking ? '⏹' : '🔊'}
      {label && <span className="speak-label">{label}</span>}
    </button>
  );
}

// Inline pronunciation widget: word + IPA + speak button
export function PronunciationBar({ word, ipa, rate }) {
  const { supported, speaking, speak, stop } = useSpeech();

  const handleClick = () => {
    if (speaking) { stop(); return; }
    speak(word, rate ? { rate } : { rate: 0.75 });
  };

  return (
    <div className="pron-bar">
      {ipa && <span className="pron-ipa">/{ipa}/</span>}
      {supported && (
        <button
          className={`pron-btn ${speaking ? 'speaking' : ''}`}
          onClick={handleClick}
          title="発音を聞く"
        >
          {speaking ? (
            <span className="pron-wave">
              <span/><span/><span/><span/>
            </span>
          ) : '🔊 発音を聞く'}
        </button>
      )}
      {!supported && ipa && (
        <span className="pron-no-support">音声非対応ブラウザ</span>
      )}
    </div>
  );
}
