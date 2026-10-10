import React, { useState } from 'react';
import { ArrowLeft, Volume2, TrendingUp, Truck, AlertTriangle } from 'lucide-react';
import { playVoiceReport, stopVoiceReport } from '../services/voiceHelper';

export default function ScreenMarketAlerts({
  onBack,
  lang = 'en'
}) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const alerts = [
    {
      id: 1,
      type: 'green',
      icon: TrendingUp,
      title: 'Tomato prices rose 5% at Kolar APMC Market.',
      time: '10 mins ago'
    },
    {
      id: 2,
      type: 'green',
      icon: Truck,
      title: 'New optimal best mandi route detected for your Guntur harvest.',
      time: '2 hours ago'
    },
    {
      id: 3,
      type: 'orange',
      icon: AlertTriangle,
      title: 'AI Forecast warning: prices predicted to drop in Guntur after 3 days.',
      time: '1 day ago'
    },
  ];

  const handleAudioReport = () => {
    if (isPlayingAudio) {
      stopVoiceReport(setIsPlayingAudio);
    } else {
      const speech = `Live market price alerts. Tomato prices rose 5 percent at Kolar APMC Market 10 minutes ago. A new optimal mandi route was detected for your harvest. Warning: AI forecast predicts prices in Guntur may drop after 3 days.`;
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
          <h1 className="screen-title">Live Market Price Alerts</h1>
        </div>
        <button 
          className={`audio-header-btn ${isPlayingAudio ? 'playing' : ''}`}
          onClick={handleAudioReport}
          title="Play Alerts Audio"
        >
          <Volume2 size={18} />
        </button>
      </header>

      {/* Section: Recent Price Changes & AI Updates */}
      <div>
        <div className="section-subtitle-bar" style={{ marginBottom: '12px' }}>
          Recent Price Changes & AI Updates
        </div>

        <div className="alerts-list">
          {alerts.map((alert) => {
            const IconComponent = alert.icon;
            return (
              <div key={alert.id} className={`alert-card ${alert.type}`}>
                <div className="alert-icon-box">
                  <IconComponent size={16} />
                </div>
                <div className="alert-content">
                  <p>{alert.title}</p>
                  <span className="alert-time">{alert.time}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
