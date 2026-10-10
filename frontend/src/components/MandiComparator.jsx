import React from 'react';

export default function MandiComparator({ comparisonData, lang, onUseLiveGps, isGpsActive, userLocationName }) {
  if (!comparisonData || !comparisonData.mandis) return null;

  return (
    <div className="glass-card">
      <div className="section-header" style={{ flexWrap: 'wrap', gap: '8px' }}>
        <h2 className="section-title">
          <span>🚚</span>
          <span>
            {lang === 'te' ? 'ఉత్తమ మండి ఎంపిక (రవాణా ఖర్చు తీసివేసి)' : 
             (lang === 'ta' ? 'சிறந்த சந்தை ஒப்பீடு (போக்குவரத்து செலவு கழித்து)' : 
              'Best Mandi Locator (Net Realized Profit)')}
          </span>
        </h2>

        {/* GPS Live Geolocation Button */}
        <button
          onClick={onUseLiveGps}
          style={{
            background: isGpsActive ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.08)',
            border: isGpsActive ? '1px solid #10b981' : '1px solid var(--border-card)',
            color: isGpsActive ? '#34d399' : '#94a3b8',
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '0.72rem',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <span>🎯</span>
          <span>{isGpsActive ? (lang === 'te' ? 'లొకేషన్: లైవ్ GPS' : 'GPS Active') : (lang === 'te' ? 'లైవ్ GPS పొందండి' : 'Detect My Live GPS')}</span>
        </button>
      </div>

      <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
        <span>
          {lang === 'te' ? '500 కిలోల సరుకు రవాణా ఆధారంగా నికర రాబడి:' : 
           (lang === 'ta' ? '500 கிலோ சரக்கு அடிப்படையில் நிகர வருமானம்:' : 
            'Calculated Net Return for 500 kg Harvest Quantity:')}
        </span>
        <span style={{ color: '#10b981', fontWeight: '600' }}>📍 {userLocationName}</span>
      </p>

      <div className="mandi-list">
        {comparisonData.mandis.map((item) => (
          <div key={item.mandi_id} className={`mandi-item ${item.is_best_choice ? 'best' : ''}`}>
            {item.is_best_choice && (
              <span className="mandi-item-best-badge">
                ★ {lang === 'te' ? 'ఉత్తమ లాభం' : (lang === 'ta' ? 'சிறந்த லாபம்' : 'Best Choice')}
              </span>
            )}
            
            <div>
              <div className="mandi-info-name">{item.mandi_name}</div>
              <div className="mandi-info-sub">
                📍 <strong style={{ color: '#fff' }}>{item.distance_km} km away</strong> • Transport: ₹{item.estimated_freight_cost}
              </div>
            </div>

            <div className="mandi-net-price">
              <div className="net-price-val">₹{item.net_realized_price_per_kg}/kg</div>
              <div className="net-price-raw">Raw Mandi: ₹{item.raw_price_per_kg}/kg</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
