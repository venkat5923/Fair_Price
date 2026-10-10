import React, { useState } from 'react';
import { ArrowLeft, Volume2, Star, Edit2 } from 'lucide-react';
import { playVoiceReport, stopVoiceReport } from '../services/voiceHelper';

export default function ScreenMandiLocator({
  comparisonData,
  quantityKg,
  onChangeQuantity,
  isGpsActive,
  onUseLiveGps,
  onBack,
  onSelectMandiDetail,
  lang = 'en'
}) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showQtyModal, setShowQtyModal] = useState(false);
  const [tempQty, setTempQty] = useState(quantityKg || 500);

  // Fallback data if API data is loading or empty
  const defaultMandis = [
    {
      mandi_id: 5,
      mandi_name: "Kolar APMC Market",
      distance_km: 81.0,
      transport_cost: 732,
      raw_price_per_kg: 39.4,
      net_realized_price_per_kg: 37.94,
      diff: "+₹7.5",
      is_best_choice: true
    },
    {
      mandi_id: 2,
      mandi_name: "Madanapalle Tomato Market",
      distance_km: 0.0,
      transport_cost: 0,
      raw_price_per_kg: 35.1,
      net_realized_price_per_kg: 35.1,
      diff: "+₹5.0",
      is_best_choice: false
    },
    {
      mandi_id: 1,
      mandi_name: "Guntur APMC Mandi",
      distance_km: 370.5,
      transport_cost: 4446,
      raw_price_per_kg: 30.9,
      net_realized_price_per_kg: 22.01,
      diff: "-₹8.9",
      is_best_choice: false
    },
    {
      mandi_id: 3,
      mandi_name: "Koyambedu Wholesale Market",
      distance_km: 191.0,
      transport_cost: 4438,
      raw_price_per_kg: 25.6,
      net_realized_price_per_kg: 16.72,
      diff: "-₹15.9",
      is_best_choice: false
    },
    {
      mandi_id: 4,
      mandi_name: "Bowenpally Agri Market",
      distance_km: 436.2,
      transport_cost: 4335,
      raw_price_per_kg: 23.8,
      net_realized_price_per_kg: 14.13,
      diff: "-₹16.7",
      is_best_choice: false
    }
  ];

  // Merge live API response with display formatting
  const mandis = (comparisonData?.mandis && comparisonData.mandis.length > 0)
    ? comparisonData.mandis.map((m, idx) => {
        const localBaseline = comparisonData.mandis.find(x => x.distance_km === 0)?.raw_price_per_kg || 30.9;
        const diffVal = m.net_realized_price_per_kg - localBaseline;
        const diffSign = diffVal >= 0 ? `+₹${diffVal.toFixed(1)}` : `-₹${Math.abs(diffVal).toFixed(1)}`;
        return {
          mandi_id: m.mandi_id,
          mandi_name: m.mandi_name,
          distance_km: m.distance_km,
          transport_cost: Math.round(m.estimated_freight_cost),
          raw_price_per_kg: m.raw_price_per_kg,
          net_realized_price_per_kg: m.net_realized_price_per_kg,
          diff: diffSign,
          is_best_choice: m.is_best_choice || idx === 0
        };
      })
    : defaultMandis;

  const handleAudioReport = () => {
    if (isPlayingAudio) {
      stopVoiceReport(setIsPlayingAudio);
    } else {
      const best = mandis[0];
      const speech = `Best Mandi Locator report. For your ${quantityKg} kg harvest, ${best.mandi_name} is your best choice, offering a net realized price of ₹${best.net_realized_price_per_kg} per kilogram after deducting ₹${best.transport_cost} transport cost.`;
      playVoiceReport(speech, lang, setIsPlayingAudio);
    }
  };

  const handleSaveQty = () => {
    if (tempQty > 0) {
      onChangeQuantity(Number(tempQty));
      setShowQtyModal(false);
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
          <h1 className="screen-title">Best Mandi Locator</h1>
        </div>
        <button 
          className={`audio-header-btn ${isPlayingAudio ? 'playing' : ''}`}
          onClick={handleAudioReport}
          title="Listen to Mandi Route Audio"
        >
          <Volume2 size={18} />
        </button>
      </header>

      {/* GPS & Harvest Strip */}
      <div className="mandi-locator-strip">
        <div 
          className="live-gps-dot" 
          onClick={onUseLiveGps}
          style={{ cursor: 'pointer' }}
          title="Click to refresh live GPS"
        >
          <div className="pulsing-dot"></div>
          <span>Live GPS Detection</span>
        </div>

        <button 
          className="harvest-pill-select"
          onClick={() => {
            setTempQty(quantityKg);
            setShowQtyModal(true);
          }}
        >
          Calculated Net Return for: <strong>{quantityKg} kg harvest ✏️</strong>
        </button>
      </div>

      <div className="section-subtitle-bar">
        Ranked by Net Realized Profit
      </div>

      {/* Mandi Cards */}
      {mandis.map((mandi) => {
        const isDiffPositive = mandi.diff.startsWith('+');
        return (
          <div 
            key={mandi.mandi_id || mandi.mandi_name}
            className="mandi-card"
            onClick={() => onSelectMandiDetail(mandi.mandi_name)}
            title="Click to view detailed trends"
          >
            <div className="mandi-top-row">
              <div className="mandi-name-group">
                <span className="mandi-title">{mandi.mandi_name}</span>
                {mandi.is_best_choice && (
                  <span className="badge-pill gold">
                    <Star size={10} fill="#B45309" stroke="#B45309" />
                    BEST CHOICE
                  </span>
                )}
              </div>
              <div className="mandi-net-price">
                ₹{mandi.net_realized_price_per_kg}/kg
                <span className="mandi-net-label">Net Price realized</span>
              </div>
            </div>

            <div className="mandi-mid-row">
              <span>{mandi.distance_km} km</span>
              <span>Transport: ₹{mandi.transport_cost}</span>
            </div>

            <div className="mandi-bot-row">
              <span>Raw Mandi Price: ₹{mandi.raw_price_per_kg}/kg</span>
              <span className={isDiffPositive ? 'diff-positive' : 'diff-negative'}>
                Diff: {mandi.diff}
              </span>
            </div>
          </div>
        );
      })}

      {/* Edit Quantity Modal */}
      {showQtyModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          padding: '20px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            padding: '24px',
            width: '100%',
            maxWidth: '320px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>Harvest Quantity</h3>
            <p style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '16px' }}>
              Used to compute transport cost & realized profits:
            </p>
            
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              {[250, 500, 1000, 2000].map(q => (
                <button
                  key={q}
                  onClick={() => setTempQty(q)}
                  style={{
                    flex: 1,
                    padding: '8px 0',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: tempQty === q ? '#14532D' : '#E2E8F0',
                    background: tempQty === q ? '#DCFCE7' : '#FFFFFF',
                    color: tempQty === q ? '#14532D' : '#334155',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {q} kg
                </button>
              ))}
            </div>

            <input 
              type="number"
              value={tempQty}
              onChange={(e) => setTempQty(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #CBD5E1',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: 600,
                marginBottom: '18px'
              }}
            />

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowQtyModal(false)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  background: '#F8FAFC',
                  fontWeight: 600,
                  fontSize: '0.84rem',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveQty}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '12px',
                  border: 'none',
                  background: '#14532D',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  cursor: 'pointer'
                }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
