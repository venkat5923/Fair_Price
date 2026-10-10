import React from 'react';

export default function PriceCard({ prediction, lang }) {
  if (!prediction) return null;

  const currentPrice = prediction.current_price;
  const minPrice = Math.round(currentPrice * 0.9);
  const maxPrice = Math.round(currentPrice * 1.1);

  return (
    <div className="glass-card">
      <div className="section-header">
        <h2 className="section-title">
          <span>📊</span>
          <span>
            {lang === 'te' ? `${prediction.mandi} ధరల వివరాలు` : 
             (lang === 'ta' ? `${prediction.mandi} சந்தை விலை` : 
              `Today's Rates at ${prediction.mandi}`)}
          </span>
        </h2>
      </div>

      <div className="price-stats-grid">
        <div className="price-stat-box">
          <div className="price-stat-label">Min Rate</div>
          <div className="price-stat-value" style={{ color: '#94a3b8' }}>₹{minPrice}/kg</div>
        </div>

        <div className="price-stat-box" style={{ background: 'rgba(16, 185, 129, 0.1)', borderColor: 'var(--primary-green)' }}>
          <div className="price-stat-label" style={{ color: '#34d399' }}>Average (Modal)</div>
          <div className="price-stat-value" style={{ color: '#10b981' }}>₹{currentPrice}/kg</div>
        </div>

        <div className="price-stat-box">
          <div className="price-stat-label">Max Rate</div>
          <div className="price-stat-value" style={{ color: '#38bdf8' }}>₹{maxPrice}/kg</div>
        </div>
      </div>
    </div>
  );
}
