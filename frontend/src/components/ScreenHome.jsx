import React, { useState } from 'react';
import { Volume2, MapPin, ChevronDown, Sparkles, Play, Pause, ChevronRight } from 'lucide-react';
import { playVoiceReport, stopVoiceReport } from '../services/voiceHelper';

export default function ScreenHome({
  user,
  crops,
  selectedCropId,
  onSelectCrop,
  prediction,
  comparisonData,
  lang,
  onLangChange,
  onNavigateTab,
  onOpenMandiDetail
}) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const selectedCrop = crops.find(c => c.id === selectedCropId) || { name: 'Tomato', icon: '🍅' };
  const cropName = selectedCrop.name.split(' ')[0]; // 'Tomato'

  // Modal rates
  const currentModal = prediction?.current_price ?? 30.9;
  const minRate = prediction?.historical_trends?.[0]?.min_price ?? Math.round(currentModal * 0.9);
  const maxRate = prediction?.historical_trends?.[0]?.max_price ?? Math.round(currentModal * 1.1);

  // Confidence & Stability
  const confidence = prediction?.confidence_score ? Math.round(prediction.confidence_score) : 82;
  const priceChange = prediction?.price_change_percent ? (prediction.price_change_percent > 0 ? `+${prediction.price_change_percent.toFixed(1)}%` : `${prediction.price_change_percent.toFixed(1)}%`) : '+2.8%';

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      stopVoiceReport(setIsPlayingAudio);
    } else {
      const summaryText = lang === 'te' 
        ? `${selectedCrop.telugu_name || 'టమోటా'} ధరలు క్వింటాల్ కు స్థిరంగా ఉన్నాయి. గరిష్ట ధర కేజీకి ₹${maxRate}. ప్రస్తుతం నష్టభయం తక్కువగా ఉంది.`
        : `FairPrice Intelligence for ${cropName}. Current modal rate at Guntur APMC is ₹${currentModal} per kilogram. Price stability is highly stable with 3 days forecast horizon and ${confidence}% AI confidence. Consider harvesting within the next 48 hours for optimal realized profits.`;
      playVoiceReport(summaryText, lang, setIsPlayingAudio);
    }
  };

  const languages = [
    { code: 'en', label: 'English (EN)' },
    { code: 'te', label: 'Telugu (తెలుగు)' },
    { code: 'ta', label: 'Tamil (தமிழ்)' },
    { code: 'hi', label: 'Hindi (हिंदी)' },
  ];

  return (
    <div className="screen-scroll-container">
      {/* Top Header */}
      <header className="screen-header">
        <h1 className="screen-title">FairPrice Intelligence</h1>
        <button 
          className={`audio-header-btn ${isPlayingAudio ? 'playing' : ''}`}
          onClick={handleToggleAudio}
          title="Play Audio Intelligence Report"
        >
          <Volume2 size={18} />
        </button>
      </header>

      {/* User Profile Card */}
      <div className="user-profile-badge">
        <div className="user-profile-info">
          <div className="avatar-circle">
            {user?.initials || 'KV'}
          </div>
          <div className="user-details">
            <h3>{user?.name || 'K. Venkata Sai'}</h3>
            <p>
              <MapPin size={12} color="#16A34A" />
              <span>{user?.district || 'Annamayya'}, AP</span>
            </p>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <button 
            className="lang-pill-btn"
            onClick={() => setShowLangMenu(!showLangMenu)}
          >
            <span>{languages.find(l => l.code === lang)?.label || 'English (EN)'}</span>
            <ChevronDown size={14} />
          </button>

          {showLangMenu && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '110%',
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
              zIndex: 110,
              minWidth: '150px',
              overflow: 'hidden'
            }}>
              {languages.map((l) => (
                <button
                  key={l.code}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '8px 12px',
                    textAlign: 'left',
                    background: lang === l.code ? '#F0FDF4' : 'transparent',
                    color: lang === l.code ? '#14532D' : '#334155',
                    fontWeight: lang === l.code ? '700' : '500',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.78rem'
                  }}
                  onClick={() => {
                    onLangChange(l.code);
                    setShowLangMenu(false);
                  }}
                >
                  {l.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Selected Crop Section */}
      <div>
        <p className="crop-section-title">Selected Crop</p>
        <div className="crops-scroll-row" style={{ marginTop: '8px' }}>
          {crops.map((crop) => {
            const isActive = crop.id === selectedCropId;
            return (
              <button
                key={crop.id}
                className={`crop-pill ${isActive ? 'active' : ''}`}
                onClick={() => onSelectCrop(crop.id)}
              >
                <span>{crop.icon}</span>
                <span>{crop.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Card 1: AI Price Stability */}
      <div className="figma-card">
        <div className="card-header-row">
          <div className="card-header-title">
            <Sparkles size={16} color="#16A34A" />
            <span>AI Price Stability ({cropName})</span>
          </div>
          <span className="badge-pill green">
            ▲ {priceChange}
          </span>
        </div>

        <div className="metrics-3col">
          <div className="metric-col">
            <span className="metric-label">Forecast Horizon</span>
            <span className="metric-value">3 Days Ahead</span>
          </div>
          <div className="metric-col">
            <span className="metric-label">Market State</span>
            <span className="metric-value" style={{ color: '#166534' }}>Highly Stable</span>
          </div>
          <div className="metric-col">
            <span className="metric-label">AI Confidence</span>
            <span className="metric-value">{confidence}%</span>
          </div>
        </div>

        {/* Audio Report CTA */}
        <div className="audio-report-bar">
          <div className="audio-report-text">
            <Volume2 size={16} color="#166534" />
            <span>Listen to Today's Audio Report</span>
          </div>
          <button 
            className="play-pill-btn"
            onClick={handleToggleAudio}
          >
            {isPlayingAudio ? (
              <>
                <Pause size={12} fill="white" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play size={12} fill="white" />
                <span>PLAY</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Card 2: Today's Rates */}
      <div 
        className="figma-card" 
        style={{ cursor: 'pointer' }}
        onClick={() => onOpenMandiDetail('Guntur APMC Mandi')}
        title="Tap to view Mandi Details"
      >
        <div className="card-header-row">
          <span className="card-header-title">Today's {cropName} Rates</span>
          <ChevronRight size={16} color="#87958C" />
        </div>
        <p className="rates-subtitle">Guntur APMC Mandi (Live updates)</p>

        <div className="rates-3box">
          <div className="rate-box">
            <div className="rate-box-label">MIN RATE</div>
            <div className="rate-box-val">₹{minRate}/kg</div>
          </div>
          <div className="rate-box accented">
            <div className="rate-box-label">MODAL (AVG)</div>
            <div className="rate-box-val">₹{currentModal}/kg</div>
          </div>
          <div className="rate-box">
            <div className="rate-box-label">MAX RATE</div>
            <div className="rate-box-val">₹{maxRate}/kg</div>
          </div>
        </div>
      </div>
    </div>
  );
}
