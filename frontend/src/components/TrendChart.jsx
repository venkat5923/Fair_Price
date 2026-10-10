import React from 'react';

export default function TrendChart({ prediction, lang }) {
  if (!prediction || !prediction.historical_trends) return null;

  const history = prediction.historical_trends;
  const forecast = prediction.forecast_next_5_days || [];

  const allPoints = [
    ...history.map(h => ({ date: h.date.slice(5), price: h.modal_price, isForecast: false })),
    ...forecast.map(f => ({ date: f.date.slice(5), price: f.predicted_price, isForecast: true }))
  ];

  const prices = allPoints.map(p => p.price);
  const minP = Math.min(...prices) * 0.95;
  const maxP = Math.max(...prices) * 1.05;
  
  const width = 460;
  const height = 130;

  const getX = (index) => (index / (allPoints.length - 1)) * (width - 40) + 20;
  const getY = (price) => height - 15 - ((price - minP) / (maxP - minP)) * (height - 30);

  const histPoints = allPoints.filter(p => !p.isForecast);
  const pathD = histPoints.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getY(p.price)}`).join(' ');

  const forecastStartIndex = histPoints.length - 1;
  const forecastPoints = allPoints.slice(forecastStartIndex);
  const forecastPathD = forecastPoints.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(forecastStartIndex + idx)} ${getY(p.price)}`).join(' ');

  return (
    <div className="glass-card">
      <div className="section-header">
        <h2 className="section-title">
          <span>📈</span>
          <span>
            {lang === 'te' ? 'ధరల ట్రెండ్ & 5 రోజుల ముందస్తు అంచనా' : 
             (lang === 'ta' ? 'விலை போக்கு & 5 நாள் கணிப்பு' : 
              '2-Week Price Trend & 5-Day Forecast')}
          </span>
        </h2>
      </div>

      <div className="chart-container">
        <svg viewBox={`0 0 ${width} ${height}`} className="chart-svg">
          {/* Grid lines */}
          <line x1="0" y1={height/2} x2={width} y2={height/2} stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
          
          {/* Historical Solid Line */}
          <path d={pathD} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
          
          {/* Forecast Dashed Line */}
          <path d={forecastPathD} fill="none" stroke="#06b6d4" strokeWidth="3" strokeDasharray="6 4" strokeLinecap="round" />

          {/* Dots */}
          {allPoints.map((p, idx) => (
            <circle
              key={idx}
              cx={getX(idx)}
              cy={getY(p.price)}
              r={p.isForecast ? "4.5" : "3.5"}
              fill={p.isForecast ? "#06b6d4" : "#10b981"}
              stroke="#090d16"
              strokeWidth="1.5"
            >
              <title>{p.date}: ₹{p.price}/kg {p.isForecast ? '(Forecast)' : ''}</title>
            </circle>
          ))}
        </svg>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8', marginTop: '8px' }}>
        <span style={{ color: '#10b981' }}>━━ Past 14 Days</span>
        <span style={{ color: '#06b6d4' }}>╍╍ AI Forecast (Next 5 Days)</span>
      </div>
    </div>
  );
}
