import React, { useState } from 'react';
import { ArrowLeft, Volume2, Edit2, ChevronDown } from 'lucide-react';
import { playVoiceReport, stopVoiceReport } from '../services/voiceHelper';

export default function ScreenProfileSettings({
  user,
  quantityKg = 500,
  onChangeQuantity,
  unitPreference = 'kg',
  onChangeUnit,
  lang = 'en',
  onLangChange,
  preferredMandi = 'Guntur APMC',
  onChangeMandi,
  onBack
}) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showQtyModal, setShowQtyModal] = useState(false);
  const [tempQty, setTempQty] = useState(quantityKg);
  const [showMandiMenu, setShowMandiMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const mandisList = [
    'Guntur APMC',
    'Kolar APMC',
    'Madanapalle Market',
    'Koyambedu Market',
    'Bowenpally Market'
  ];

  const languages = [
    { code: 'en', label: 'English (English)' },
    { code: 'te', label: 'Telugu (తెలుగు)' },
    { code: 'ta', label: 'Tamil (தமிழ்)' },
    { code: 'hi', label: 'Hindi (हिंदी)' },
  ];

  const handleAudioReport = () => {
    if (isPlayingAudio) {
      stopVoiceReport(setIsPlayingAudio);
    } else {
      const speech = `Farmer profile for ${user?.name || 'K. Venkata Sai'}, ID FP 839210 AP. Current harvest volume is ${quantityKg} ${unitPreference}. Notifications are currently enabled.`;
      playVoiceReport(speech, lang, setIsPlayingAudio);
    }
  };

  const handleApplyQty = () => {
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
          <h1 className="screen-title">Profile & Preferences</h1>
        </div>
        <button 
          className={`audio-header-btn ${isPlayingAudio ? 'playing' : ''}`}
          onClick={handleAudioReport}
          title="Play Profile Audio"
        >
          <Volume2 size={18} />
        </button>
      </header>

      {/* User Profile Card */}
      <div className="user-profile-badge" style={{ padding: '16px 18px' }}>
        <div className="user-profile-info">
          <div className="avatar-circle" style={{ width: '52px', height: '52px', fontSize: '1.15rem' }}>
            {user?.initials || 'KV'}
          </div>
          <div className="user-details">
            <h3 style={{ fontSize: '1.05rem' }}>{user?.name || 'K. Venkata Sai'}</h3>
            <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '3px' }}>
              ID: FP-839210-AP
            </p>
          </div>
        </div>
      </div>

      {/* Section: App Settings */}
      <div>
        <div className="section-subtitle-bar" style={{ marginBottom: '10px' }}>
          App Settings
        </div>

        <div className="settings-list">
          {/* Setting 1: Harvest Quantity */}
          <div className="setting-item">
            <div className="setting-label-grp">
              <h4>Harvest Quantity</h4>
              <p>Used to compute transport cost</p>
            </div>
            <button
              onClick={() => {
                setTempQty(quantityKg);
                setShowQtyModal(true);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#F1F4F2',
                border: '1px solid #DCE3DE',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#14532D',
                cursor: 'pointer'
              }}
            >
              <span>{quantityKg} kg</span>
              <Edit2 size={12} />
            </button>
          </div>

          {/* Setting 2: Units Preference */}
          <div className="setting-item">
            <div className="setting-label-grp">
              <h4>Units Preference</h4>
            </div>
            <div className="segmented-toggle">
              <button
                className={`segmented-option ${unitPreference === 'kg' ? 'active' : ''}`}
                onClick={() => onChangeUnit('kg')}
              >
                kg
              </button>
              <button
                className={`segmented-option ${unitPreference === 'quintal' ? 'active' : ''}`}
                onClick={() => onChangeUnit('quintal')}
              >
                quintal
              </button>
            </div>
          </div>

          {/* Setting 3: Default Language */}
          <div className="setting-item" style={{ position: 'relative' }}>
            <div className="setting-label-grp">
              <h4>Default Language</h4>
            </div>
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'transparent',
                border: 'none',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer'
              }}
            >
              <span>{languages.find(l => l.code === lang)?.label || 'English (English)'}</span>
              <ChevronDown size={14} />
            </button>

            {showLangMenu && (
              <div style={{
                position: 'absolute',
                right: '16px',
                top: '80%',
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

          {/* Setting 4: Preferred default Mandi */}
          <div className="setting-item" style={{ position: 'relative' }}>
            <div className="setting-label-grp">
              <h4>Preferred default Mandi</h4>
            </div>
            <button
              onClick={() => setShowMandiMenu(!showMandiMenu)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'transparent',
                border: 'none',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer'
              }}
            >
              <span>{preferredMandi}</span>
              <ChevronDown size={14} />
            </button>

            {showMandiMenu && (
              <div style={{
                position: 'absolute',
                right: '16px',
                top: '80%',
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                zIndex: 110,
                minWidth: '160px',
                overflow: 'hidden'
              }}>
                {mandisList.map((m) => (
                  <button
                    key={m}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '8px 12px',
                      textAlign: 'left',
                      background: preferredMandi === m ? '#F0FDF4' : 'transparent',
                      color: preferredMandi === m ? '#14532D' : '#334155',
                      fontWeight: preferredMandi === m ? '700' : '500',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.78rem'
                    }}
                    onClick={() => {
                      onChangeMandi(m);
                      setShowMandiMenu(false);
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Setting 5: Price Alert Notifications */}
          <div className="setting-item">
            <div className="setting-label-grp">
              <h4>Price Alert Notifications</h4>
            </div>
            <div
              className={`toggle-switch ${notificationsEnabled ? 'on' : ''}`}
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            >
              <div className="toggle-slider"></div>
            </div>
          </div>
        </div>
      </div>

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
              Used to compute transport cost:
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
                onClick={handleApplyQty}
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
