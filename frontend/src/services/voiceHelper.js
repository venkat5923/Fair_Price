import { synthesizeVoice } from './api';

let activeAudio = null;

export async function playVoiceReport(text, language = 'en', onPlayingChange) {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio = null;
    if (onPlayingChange) onPlayingChange(false);
    return;
  }

  if (onPlayingChange) onPlayingChange(true);

  try {
    const langCode = language === 'te' ? 'te' : (language === 'ta' ? 'ta' : 'en');
    const res = await synthesizeVoice(text, langCode);
    
    if (res && res.audio_url) {
      const audio = new Audio(res.audio_url);
      activeAudio = audio;
      audio.onended = () => {
        activeAudio = null;
        if (onPlayingChange) onPlayingChange(false);
      };
      audio.onerror = () => {
        fallbackSpeech(text, langCode, onPlayingChange);
      };
      await audio.play();
      return;
    }
  } catch (err) {
    console.warn("Backend TTS failed, using Web Speech API fallback:", err);
  }

  fallbackSpeech(text, language, onPlayingChange);
}

function fallbackSpeech(text, langCode, onPlayingChange) {
  if (!('speechSynthesis' in window)) {
    if (onPlayingChange) onPlayingChange(false);
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = langCode === 'te' ? 'te-IN' : (langCode === 'ta' ? 'ta-IN' : 'en-IN');
  utterance.rate = 0.95;

  utterance.onend = () => {
    activeAudio = null;
    if (onPlayingChange) onPlayingChange(false);
  };
  utterance.onerror = () => {
    activeAudio = null;
    if (onPlayingChange) onPlayingChange(false);
  };

  window.speechSynthesis.speak(utterance);
}

export function stopVoiceReport(onPlayingChange) {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio = null;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  if (onPlayingChange) onPlayingChange(false);
}
