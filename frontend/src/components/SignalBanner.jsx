import React from 'react';

export default function SignalBanner({ prediction, lang }) {
  if (!prediction) return null;

  const { recommendation_signal, confidence_score, price_change_percent, reasoning_te, reasoning_ta, reasoning_en } = prediction;

  const isHold = recommendation_signal === 'HOLD';

  const getSignalLabel = () => {
    if (isHold) {
      if (lang === 'te') return 'వాయిదా వేయండి (HOLD)';
      if (lang === 'ta') return 'தள்ளி வையுங்கள் (HOLD)';
      return 'HOLD (PRICES RISING)';
    } else if (recommendation_signal === 'SELL_TODAY') {
      if (lang === 'te') return 'ఈరోజే అమ్మండి (SELL TODAY)';
      if (lang === 'ta') return 'இன்றே விக்கவும் (SELL TODAY)';
      return 'SELL TODAY';
    } else {
      if (lang === 'te') return 'స్థిరమైన ధర (STABLE)';
      if (lang === 'ta') return 'நிலையான விலை (STABLE)';
      return 'STABLE PRICES';
    }
  };

  const getReasoningText = () => {
    if (lang === 'te') return reasoning_te;
    if (lang === 'ta') return reasoning_ta;
    return reasoning_en;
  };

  return (
    <div className={`glass-card signal-card ${recommendation_signal}`}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className={`signal-badge ${recommendation_signal}`}>
          <span>{isHold ? '🟢' : (recommendation_signal === 'SELL_TODAY' ? '🔴' : '🟡')}</span>
          <span>{getSignalLabel()}</span>
        </span>
        <span style={{ fontSize: '0.8rem', fontWeight: '700', color: isHold ? '#34d399' : '#f87171' }}>
          {price_change_percent > 0 ? `+${price_change_percent}%` : `${price_change_percent}%`} (3 Days)
        </span>
      </div>

      <p className="signal-reason">
        {getReasoningText()}
      </p>

      <div style={{ marginTop: '12px', fontSize: '0.75rem', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
        <span>AI Model Confidence: <strong style={{ color: '#f8fafc' }}>{confidence_score}%</strong></span>
        <span>Based on Agmarknet Arrivals</span>
      </div>
    </div>
  );
}
