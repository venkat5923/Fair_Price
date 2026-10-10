import React, { useState } from 'react';

export const DISTRICT_COORDS = {
  'Guntur': { lat: 16.3067, lon: 80.4365 },
  'Annamayya': { lat: 13.5500, lon: 78.5000 },
  'Chennai': { lat: 13.0694, lon: 80.1948 },
  'Hyderabad': { lat: 17.4725, lon: 78.4722 },
  'Kolar': { lat: 13.1367, lon: 78.1292 }
};

export default function LoginPage({ onLogin, lang, setLang }) {
  const [farmerName, setFarmerName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [district, setDistrict] = useState('Annamayya');

  const handleSubmit = (e) => {
    e.preventDefault();
    const coords = DISTRICT_COORDS[district] || DISTRICT_COORDS['Guntur'];
    const userObj = {
      name: farmerName || (lang === 'te' ? 'రైతు సోదరుడు' : (lang === 'ta' ? 'விவசாயி' : 'Farmer User')),
      mobile: mobileNumber || '9876543210',
      district: district,
      lat: coords.lat,
      lon: coords.lon
    };
    onLogin(userObj);
  };

  const handleQuickDemoLogin = (name, dist) => {
    const coords = DISTRICT_COORDS[dist] || DISTRICT_COORDS['Guntur'];
    onLogin({ 
      name, 
      mobile: '9876543210', 
      district: dist,
      lat: coords.lat,
      lon: coords.lon
    });
  };

  return (
    <div className="app-container" style={{ justifyContent: 'center', minHeight: '100vh' }}>
      <div className="glass-card" style={{ padding: '30px 20px', textAlign: 'center' }}>
        
        {/* Brand Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🌾</div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: '800', background: 'linear-gradient(135deg, #10b981, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            FAIRPRICE
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '6px' }}>
            {lang === 'te' ? 'రైతుల కోసం డిజిటల్ మండి ధరలు & వాయిస్ సలహా' : 
             (lang === 'ta' ? 'விவசாயிகளுக்கான டிஜிட்டல் சந்தை விலை & குரல் வழிகாட்டி' : 
              'Digital Mandi Price Intelligence & Voice Guide for Farmers')}
          </p>
        </div>

        {/* Language Selection Bar */}
        <div className="lang-selector" style={{ justifyContent: 'center', margin: '0 auto 24px auto', width: 'fit-content' }}>
          <button 
            className={`lang-btn ${lang === 'te' ? 'active' : ''}`}
            onClick={() => setLang('te')}
          >
            తెలుగు
          </button>
          <button 
            className={`lang-btn ${lang === 'ta' ? 'active' : ''}`}
            onClick={() => setLang('ta')}
          >
            தமிழ்
          </button>
          <button 
            className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
            onClick={() => setLang('en')}
          >
            English
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: '600' }}>
              👤 {lang === 'te' ? 'రైతు పేరు (Farmer Name)' : (lang === 'ta' ? 'விவசாயி பெயர்' : 'Farmer Name')}
            </label>
            <input 
              type="text"
              placeholder={lang === 'te' ? 'ఉదా: ఎం. మధన్' : (lang === 'ta' ? 'எ.கா: எம். மதன்' : 'e.g. M. Madhan')}
              value={farmerName}
              onChange={(e) => setFarmerName(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-card)',
                borderRadius: 'var(--radius-md)',
                color: '#fff',
                fontSize: '0.95rem',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: '600' }}>
              📱 {lang === 'te' ? 'మొబైల్ సంఖ్య (Mobile Number)' : (lang === 'ta' ? 'கைபேசி எண்' : 'Mobile Number')}
            </label>
            <input 
              type="tel"
              placeholder="10-digit Mobile Number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-card)',
                borderRadius: 'var(--radius-md)',
                color: '#fff',
                fontSize: '0.95rem',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: '600' }}>
              📍 {lang === 'te' ? 'జిల్లా / గ్రామం (District / Location)' : (lang === 'ta' ? 'மாவட்டம் / கிராமம்' : 'District / Location')}
            </label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px',
                background: '#151e2f',
                border: '1px solid var(--border-card)',
                borderRadius: 'var(--radius-md)',
                color: '#fff',
                fontSize: '0.95rem',
                outline: 'none'
              }}
            >
              <option value="Annamayya">Annamayya / Madanapalle (అన్నమయ్య)</option>
              <option value="Guntur">Guntur (గుంటూరు / குண்டூர்)</option>
              <option value="Chennai">Chennai / Koyambedu (சென்னை)</option>
              <option value="Hyderabad">Hyderabad / Bowenpally (హైదరాబాద్)</option>
              <option value="Kolar">Kolar (కోలార్)</option>
            </select>
          </div>

          <button 
            type="submit"
            className="voice-btn"
            style={{ marginTop: '8px', padding: '16px' }}
          >
            <span>
              {lang === 'te' ? 'మండి ధరలు చూడండి ➔' : 
               (lang === 'ta' ? 'சந்தை விலையைக் காண்க ➔' : 
                'Login & View Mandi Rates ➔')}
            </span>
          </button>
        </form>

        {/* Quick Demo Login Presets */}
        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-card)' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '10px' }}>
            ⚡ {lang === 'te' ? 'త్వరిత డెమో లాగిన్:' : (lang === 'ta' ? 'விரைவு உள்நுழைவு:' : 'Quick Demo Login:')}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button 
              className="lang-btn"
              style={{ background: 'rgba(255,255,255,0.06)', color: '#fff', padding: '10px', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)' }}
              onClick={() => handleQuickDemoLogin('K. Venkata Sai', 'Annamayya')}
            >
              👨‍🌾 K. Venkata Sai (Annamayya)
            </button>
            <button 
              className="lang-btn"
              style={{ background: 'rgba(255,255,255,0.06)', color: '#fff', padding: '10px', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)' }}
              onClick={() => handleQuickDemoLogin('M. Madhan', 'Guntur')}
            >
              👨‍🌾 M. Madhan (Guntur)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
