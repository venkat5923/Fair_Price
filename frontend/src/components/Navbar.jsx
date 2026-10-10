import React from 'react';

export default function Navbar({ currentLang, onLangChange, user, onLogout }) {
  return (
    <nav className="navbar">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div className="brand-logo">
          <span className="brand-badge">🌾 FAIRPRICE</span>
        </div>
        {user && (
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>👨‍🌾 {user.name}</span>
            <span>•</span>
            <span style={{ color: '#10b981' }}>📍 {user.district}</span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div className="lang-selector">
          <button 
            className={`lang-btn ${currentLang === 'te' ? 'active' : ''}`}
            onClick={() => onLangChange('te')}
          >
            తెలుగు
          </button>
          <button 
            className={`lang-btn ${currentLang === 'ta' ? 'active' : ''}`}
            onClick={() => onLangChange('ta')}
          >
            தமிழ்
          </button>
          <button 
            className={`lang-btn ${currentLang === 'en' ? 'active' : ''}`}
            onClick={() => onLangChange('en')}
          >
            ENG
          </button>
        </div>

        {user && (
          <button
            onClick={onLogout}
            title="Logout / Change Profile"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid var(--border-card)',
              color: '#f87171',
              padding: '6px 10px',
              borderRadius: '16px',
              fontSize: '0.75rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            🚪
          </button>
        )}
      </div>
    </nav>
  );
}
