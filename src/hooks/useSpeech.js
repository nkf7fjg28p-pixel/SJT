import { useState, useEffect, useCallback } from 'react';

export function useSpeech() {
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    setSupported(true);

    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      setVoices(v);
    };
    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
  }, []);

  // Pick the best English voice available
  const getVoice = useCallback(() => {
    // Prefer: native en-US or en-GB voices, avoid "Google" TTS which can sound robotic
    const preferred = [
      v => v.lang === 'en-US' && v.localService,
      v => v.lang === 'en-GB' && v.localService,
      v => v.lang.startsWith('en') && v.localService,
      v => v.lang === 'en-US',
      v => v.lang === 'en-GB',
      v => v.lang.startsWith('en'),
    ];
    for (const test of preferred) {
      const match = voices.find(test);
      if (match) return match;
    }
    return null;
  }, [voices]);

  const speak = useCallback((text, { rate = 0.82, pitch = 1 } = {}) => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'en-US';
    utt.rate = rate;
    utt.pitch = pitch;
    const voice = getVoice();
    if (voice) utt.voice = voice;
    utt.onstart = () => setSpeaking(true);
    utt.onend = () => setSpeaking(false);
    utt.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utt);
  }, [supported, getVoice]);

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  return { supported, speaking, speak, stop };
}
