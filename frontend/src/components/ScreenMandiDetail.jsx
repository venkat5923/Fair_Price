import React, { useState } from 'react';
import { ArrowLeft, Volume2 } from 'lucide-react';
import { playVoiceReport, stopVoiceReport } from '../services/voiceHelper';

export default function ScreenMandiDetail({
  mandiName = 'Guntur APMC',
  cropName = 'Tomato',
  onBack,
  lang = 'en'
}) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const seasonalArrivals = [
    { period: 'Jan (Peak Supply)', volume: 'Mandi Arrivals: 420 Tons', badge: 'Optimal', badgeClass: 'green' },
    { period: 'Feb (Normal)', volume: 'Mandi Arrivals: 310 Tons', badge: 'Moderate', badgeClass: 'blue' },
    { period: 'Mar (Lean Season)', volume: 'Mandi Arrivals: 150 Tons', badge: 'Scarce', badgeClass: 'red' },
  ];

  const historicalRates = [
    { week: 'Week 1 (Latest)', rate: '₹30.90 / kg', growth: '+4.2%', isPositive: true },
    { week: 'Week 2', rate: '₹29.65 / kg', growth: '+1.8%', isPositive: true },
    { week: 'Week 3', rate: '₹29.12 / kg', growth: '-2.4%', isPositive: false },
  ];

  const handleAudioReport = () => {
    if (isPlayingAudio) {
      stopVoiceReport(setIsPlayingAudio);
    } else {
      const speech = `Historical performance report for ${mandiName} on ${cropName}. Based on five-year cyclical arrivals, January is peak supply with 420 tons. Recent modal rates show a 4.2 percent growth in week one to ₹30.90 per kilogram.`;
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
          <h1 className="screen-title">{mandiName.split(' ')[0]} APMC — {cropName}</h1>
        </div>
        <button 
          className={`audio-header-btn ${isPlayingAudio ? 'playing' : ''}`}
          onClick={handleAudioReport}
          title="Play Mandi Analysis Audio"
        >
          <Volume2 size={18} />
        </button>
      </header>

      {/* Card 1: Historical Performance & Supply */}
      <div className="figma-card">
        <div>
          <h3 className="card-header-title">Historical Performance & Supply</h3>
          <p style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '2px' }}>
            Based on {mandiName.split(' ')[0]} APMC 5-year cyclical arrivals
          </p>
        </div>

        {/* Current Season Arrival Trends */}
        <div style={{ marginTop: '6px' }}>
          <p style={{ fontSize: '0.76rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
            Current Season Arrival Trends
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {seasonalArrivals.map((item, idx) => (
              <div 
                key={idx} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  background: '#F8FAF9',
                  borderRadius: '10px',
                  border: '1px solid #EBEFEA'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1E293B' }}>{item.period}</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{item.volume}</div>
                </div>
                <span className={`badge-pill ${item.badgeClass}`}>
                  {item.badge}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Historical Rates */}
        <div style={{ marginTop: '10px' }}>
          <p style={{ fontSize: '0.76rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
            Recent Historical Rates
          </p>
          <table className="historical-table">
            <thead>
              <tr>
                <th>WEEK</th>
                <th>AVG MODAL RATE</th>
                <th style={{ textAlign: 'right' }}>GROWTH</th>
              </tr>
            </thead>
            <tbody>
              {historicalRates.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.week}</td>
                  <td>{row.rate}</td>
                  <td style={{ 
                    textAlign: 'right', 
                    color: row.isPositive ? '#16A34A' : '#DC2626' 
                  }}>
                    {row.growth}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
