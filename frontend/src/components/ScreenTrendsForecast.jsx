import React, { useState } from 'react';
import { ArrowLeft, Volume2, Sparkles } from 'lucide-react';
import { playVoiceReport, stopVoiceReport } from '../services/voiceHelper';

export default function ScreenTrendsForecast({
  prediction,
  cropName = 'Tomato',
  quantityKg = 500,
  onBack,
  lang = 'en'
}) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const forecastDays = [
    { day: 'Today', price: '₹30.9/kg', isActual: true },
    { day: '+1 Day', price: '₹31.5/kg', isActual: false },
    { day: '+2 Day', price: '₹32.8/kg', isActual: false },
    { day: '+3 Day', price: '₹33.2/kg', isActual: false },
    { day: '+4 Day', price: '₹32/kg', isActual: false },
    { day: '+5 Day', price: '₹34.5/kg', isActual: false },
  ];

  const handleAudioReport = () => {
    if (isPlayingAudio) {
      stopVoiceReport(setIsPlayingAudio);
    } else {
      const speech = `AI Price Forecast report for ${cropName}. Prices are predicted to peak in Guntur and Kolar markets in two days. Consider harvesting immediately to secure an estimated ₹2,400 additional profit on your ${quantityKg} kg harvest. Next five day outlook predicts values rising up to ₹34.5 per kilogram.`;
      playVoiceReport(speech, lang, setIsPlayingAudio);
    }
  };

  return (
    <div className="screen-scroll-container">
      {/* Header */}
      <header className="screen-header">
        <div className="header-left">
          <button className="back-btn" onClick={onBack}>
            <ArrowLeft size={18} />
          </button>
          <h1 className="screen-title">Price Trends & AI Forecast</h1>
        </div>
        <button 
          className={`audio-header-btn ${isPlayingAudio ? 'playing' : ''}`}
          onClick={handleAudioReport}
          title="Play Forecast Speech"
        >
          <Volume2 size={18} />
        </button>
      </header>

      {/* Card 1: 2-Week Trend & 5-Day Forecast Chart */}
      <div className="figma-card">
        <div className="card-header-row">
          <div>
            <h3 className="card-header-title">2-Week Trend & 5-Day Forecast</h3>
            <p style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '2px' }}>
              AI Predicts rising values next 72 hours
            </p>
          </div>
        </div>

        {/* High-Fidelity SVG Trend Chart */}
        <div style={{ position: 'relative', width: '100%', height: '140px', marginTop: '10px' }}>
          <svg width="100%" height="110" viewBox="0 0 320 110" fill="none">
            <defs>
              <linearGradient id="historicalGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#16A34A" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#16A34A" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Subtle background grid lines */}
            <line x1="20" y1="20" x2="300" y2="20" stroke="#F1F4F2" strokeDasharray="3 3" />
            <line x1="20" y1="50" x2="300" y2="50" stroke="#F1F4F2" strokeDasharray="3 3" />
            <line x1="20" y1="80" x2="300" y2="80" stroke="#F1F4F2" strokeDasharray="3 3" />

            {/* Historical Area Fill */}
            <path
              d="M 20 82 Q 70 70, 110 65 T 160 48 L 160 95 L 20 95 Z"
              fill="url(#historicalGrad)"
            />

            {/* Historical Solid Green Line */}
            <path
              d="M 20 82 Q 70 70, 110 65 T 160 48"
              stroke="#15803D"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />

            {/* Forecast Dashed Orange Line */}
            <path
              d="M 160 48 L 290 28"
              stroke="#F97316"
              strokeWidth="2.5"
              strokeDasharray="4 4"
              fill="none"
              strokeLinecap="round"
            />

            {/* Today Center Node Dot */}
            <circle cx="160" cy="48" r="4" fill="#15803D" stroke="#FFFFFF" strokeWidth="2" />

            {/* Target 5-Day Forecast Dot */}
            <circle cx="290" cy="28" r="4" fill="#F97316" stroke="#FFFFFF" strokeWidth="2" />

            {/* Subtle Forecast vertical divider indicator */}
            <line x1="160" y1="48" x2="160" y2="92" stroke="#CBD5E1" strokeDasharray="2 2" />
          </svg>

          {/* AI Forecast Starts Label */}
          <div style={{
            position: 'absolute',
            left: '50%',
            bottom: '24px',
            transform: 'translateX(-50%)',
            fontSize: '0.62rem',
            color: '#64748B',
            fontWeight: 600
          }}>
            AI forecast starts
          </div>

          {/* X-Axis Labels */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.7rem',
            color: '#87958C',
            fontWeight: 500,
            padding: '0 4px',
            marginTop: '-6px'
          }}>
            <span>14 days ago</span>
            <span style={{ fontWeight: 700, color: '#14532D' }}>Today</span>
            <span style={{ fontWeight: 600, color: '#C2410C' }}>+5 days</span>
          </div>
        </div>
      </div>

      {/* Card 2: AI Actionable Recommendation */}
      <div className="recommendation-card">
        <div className="recommendation-icon">
          <Sparkles size={16} />
        </div>
        <div className="recommendation-content">
          <h4>AI Actionable Recommendation</h4>
          <p>
            Tomato prices are predicted to peak in Guntur and Kolar markets in 2 days. 
            Consider harvesting immediately to secure an estimated <strong>₹2,400 additional profit</strong> on your {quantityKg} kg harvest.
          </p>
        </div>
      </div>

      {/* Section: 5-Day Daily Outlook */}
      <div>
        <div className="section-subtitle-bar" style={{ marginBottom: '8px' }}>
          5-Day Daily Outlook
        </div>

        <div className="daily-outlook-list">
          {forecastDays.map((item, idx) => (
            <div key={idx} className="daily-row">
              <span className="daily-day">{item.day}</span>
              <div className="daily-price-badge">
                <span className="daily-price">{item.price}</span>
                {item.isActual ? (
                  <span className="badge-pill green">ACTUAL</span>
                ) : (
                  <span className="badge-pill orange">PREDICTED</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
