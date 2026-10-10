import React, { useState, useRef } from 'react';
import { synthesizeVoice } from '../services/api';

export default function VoicePlayer({ prediction, lang }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [statusText, setStatusText] = useState('');
  const audioRef = useRef(null);

  if (!prediction) return null;

  const getVoiceScript = () => {
    if (lang === 'te') return prediction.reasoning_te;
    if (lang === 'ta') return prediction.reasoning_ta;
    return prediction.reasoning_en;
  };

  const getLangName = () => {
    if (lang === 'te') return 'తెలుగు';
    if (lang === 'ta') return 'தமிழ்';
    return 'English';
  };

  const handlePlayVoice = async () => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
      setStatusText('');
      return;
    }

    const text = getVoiceScript();
    const langCode = lang === 'te' ? 'te' : (lang === 'ta' ? 'ta' : 'en');
    
    setStatusText(lang === 'te' ? 'ఆడియో సిద్ధమవుతోంది...' : (lang === 'ta' ? 'ஒலி தயார் செய்யப்படுகிறது...' : 'Loading Audio...'));
    setIsPlaying(true);

    try {
      // 1. Fetch Backend High-Quality MP3 from gTTS Engine
      const voiceData = await synthesizeVoice(text, langCode);

      if (voiceData && voiceData.audio_url) {
        const audio = new Audio(voiceData.audio_url);
        audioRef.current = audio;

        audio.onplaying = () => {
          setStatusText(lang === 'te' ? `వినబడుతోంది (${getLangName()})...` : (lang === 'ta' ? `கேட்கிறது (${getLangName()})...` : `Playing in ${getLangName()}...`));
        };

        audio.onended = () => {
          setIsPlaying(false);
          setStatusText('');
          audioRef.current = null;
        };

        audio.onerror = (e) => {
          console.warn("Backend audio fallback to SpeechSynthesis", e);
          playNativeSpeech(text, langCode);
        };

        await audio.play();
        return;
      }
    } catch (err) {
      console.warn("Voice synthesis endpoint error, falling back to Web Speech API", err);
    }

    // 2. Fallback to Browser Native SpeechSynthesis
    playNativeSpeech(text, langCode);
  };

  const playNativeSpeech = (text, langCode) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode === 'te' ? 'te-IN' : (langCode === 'ta' ? 'ta-IN' : 'en-US');
      utterance.rate = 0.88; // Natural speaking pace

      utterance.onstart = () => {
        setStatusText(lang === 'te' ? `వినబడుతోంది (${getLangName()})...` : (lang === 'ta' ? `கேட்கிறது (${getLangName()})...` : `Playing in ${getLangName()}...`));
        setIsPlaying(true);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setStatusText('');
      };

      utterance.onerror = () => {
        setIsPlaying(false);
        setStatusText('');
      };

      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlaying(false);
      setStatusText('Speech not supported on this browser.');
    }
  };

  const getButtonText = () => {
    if (isPlaying) {
      return statusText || (lang === 'te' ? '⏸️ ఆపుము (Stop)' : (lang === 'ta' ? '⏸️ நிறுத்துக (Stop)' : '⏸️ Stop Audio'));
    }
    if (lang === 'te') return '🔊 వాయిస్‌లో వినండి (Telugu Voice)';
    if (lang === 'ta') return '🔊 குரலில் கேட்கவும் (Tamil Voice)';
    return '🔊 Listen Audio (English Voice)';
  };

  return (
    <div style={{ width: '100%' }}>
      <button 
        className={`voice-btn ${isPlaying ? 'playing' : ''}`}
        onClick={handlePlayVoice}
        style={{
          background: isPlaying ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #10b981, #059669)',
          color: '#fff'
        }}
      >
        <span>{getButtonText()}</span>
      </button>

      {isPlaying && (
        <div style={{ marginTop: '8px', fontSize: '0.75rem', color: '#34d399', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <span style={{ animation: 'spin 2s linear infinite' }}>🎵</span>
          <span>{statusText || 'Playing High-Quality Audio'}</span>
        </div>
      )}
    </div>
  );
}
