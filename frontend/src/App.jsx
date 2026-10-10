import React, { useState, useEffect } from 'react';
import StatusBar, { HomeIndicator } from './components/StatusBar';
import BottomNav from './components/BottomNav';
import ScreenHome from './components/ScreenHome';
import ScreenMandiLocator from './components/ScreenMandiLocator';
import ScreenTrendsForecast from './components/ScreenTrendsForecast';
import ScreenMandiDetail from './components/ScreenMandiDetail';
import ScreenProfileSettings from './components/ScreenProfileSettings';
import ScreenMarketAlerts from './components/ScreenMarketAlerts';

import { fetchCrops, fetchPrediction, fetchMandiComparison } from './services/api';
import { Smartphone, LayoutGrid } from 'lucide-react';

const DEFAULT_CROPS = [
  {"id": 1, "name": "Tomato", "telugu_name": "టమోటా", "tamil_name": "தக்காளி", "icon": "🍅", "category": "Vegetables"},
  {"id": 2, "name": "Paddy/Rice", "telugu_name": "వరి (వరి ధాన్యం)", "tamil_name": "நெல்", "icon": "🌾", "category": "Grains"},
  {"id": 3, "name": "Chili", "telugu_name": "ఎండు మిరప", "tamil_name": "மிளகாய்", "icon": "🌶️", "category": "Spices"},
  {"id": 4, "name": "Potato", "telugu_name": "బంగాళాదుంప", "tamil_name": "உருளைக்கிழங்கு", "icon": "🥔", "category": "Vegetables"},
  {"id": 5, "name": "Onion", "telugu_name": "ఉల్లిపాయ", "tamil_name": "வெங்காயம்", "icon": "🧅", "category": "Vegetables"},
];

export default function App() {
  const [viewMode, setViewMode] = useState('single'); // 'single' | 'gallery'
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'mandi' | 'trends' | 'alerts' | 'settings' | 'mandi-detail'
  const [previousTab, setPreviousTab] = useState('home');

  const [lang, setLang] = useState('en');
  const [crops, setCrops] = useState(DEFAULT_CROPS);
  const [selectedCropId, setSelectedCropId] = useState(1);
  const [quantityKg, setQuantityKg] = useState(500);
  const [unitPreference, setUnitPreference] = useState('kg');
  const [preferredMandi, setPreferredMandi] = useState('Guntur APMC');
  const [detailMandiName, setDetailMandiName] = useState('Guntur APMC');

  const [isGpsActive, setIsGpsActive] = useState(true);
  const [userCoords, setUserCoords] = useState({ lat: 13.5500, lon: 78.5000 }); // Madanapalle, Annamayya

  const [prediction, setPrediction] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);

  const currentUser = {
    name: 'K. Venkata Sai',
    initials: 'KV',
    district: 'Annamayya',
    id: 'FP-839210-AP'
  };

  // Load Crops on mount
  useEffect(() => {
    fetchCrops()
      .then((data) => {
        if (data && data.length > 0) {
          setCrops(data);
          setSelectedCropId(data[0].id);
        }
      })
      .catch((err) => console.log('Using default crops seed:', err));
  }, []);

  // Fetch prediction and comparison data
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchPrediction(selectedCropId, 1).catch(() => null),
      fetchMandiComparison(selectedCropId, userCoords.lat, userCoords.lon, quantityKg, 12.0).catch(() => null)
    ])
      .then(([predData, compData]) => {
        if (predData) setPrediction(predData);
        if (compData) setComparisonData(compData);
      })
      .finally(() => setLoading(false));
  }, [selectedCropId, quantityKg, userCoords]);

  // Live GPS geolocation trigger
  const handleUseLiveGps = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
          setIsGpsActive(true);
        },
        () => {
          alert('GPS permission not granted. Using default Annamayya coordinates.');
        }
      );
    }
  };

  // Navigation handlers
  const handleTabChange = (tabId) => {
    setPreviousTab(activeTab === 'mandi-detail' ? 'mandi' : activeTab);
    setActiveTab(tabId);
  };

  const handleOpenMandiDetail = (mandiName = 'Guntur APMC') => {
    setDetailMandiName(mandiName);
    setPreviousTab(activeTab);
    setActiveTab('mandi-detail');
  };

  const handleBack = () => {
    if (activeTab === 'mandi-detail') {
      setActiveTab(previousTab || 'mandi');
    } else {
      setActiveTab('home');
    }
  };

  const selectedCrop = crops.find(c => c.id === selectedCropId) || crops[0];

  // Helper to render the active screen content
  const renderScreen = (screenName = activeTab) => {
    switch (screenName) {
      case 'home':
        return (
          <ScreenHome
            user={currentUser}
            crops={crops}
            selectedCropId={selectedCropId}
            onSelectCrop={setSelectedCropId}
            prediction={prediction}
            comparisonData={comparisonData}
            lang={lang}
            onLangChange={setLang}
            onNavigateTab={handleTabChange}
            onOpenMandiDetail={handleOpenMandiDetail}
          />
        );
      case 'mandi':
        return (
          <ScreenMandiLocator
            comparisonData={comparisonData}
            quantityKg={quantityKg}
            onChangeQuantity={setQuantityKg}
            isGpsActive={isGpsActive}
            onUseLiveGps={handleUseLiveGps}
            onBack={handleBack}
            onSelectMandiDetail={handleOpenMandiDetail}
            lang={lang}
          />
        );
      case 'trends':
        return (
          <ScreenTrendsForecast
            prediction={prediction}
            cropName={selectedCrop.name.split(' ')[0]}
            quantityKg={quantityKg}
            onBack={handleBack}
            lang={lang}
          />
        );
      case 'mandi-detail':
        return (
          <ScreenMandiDetail
            mandiName={detailMandiName}
            cropName={selectedCrop.name.split(' ')[0]}
            onBack={handleBack}
            lang={lang}
          />
        );
      case 'settings':
        return (
          <ScreenProfileSettings
            user={currentUser}
            quantityKg={quantityKg}
            onChangeQuantity={setQuantityKg}
            unitPreference={unitPreference}
            onChangeUnit={setUnitPreference}
            lang={lang}
            onLangChange={setLang}
            preferredMandi={preferredMandi}
            onChangeMandi={setPreferredMandi}
            onBack={handleBack}
          />
        );
      case 'alerts':
        return (
          <ScreenMarketAlerts
            onBack={handleBack}
            lang={lang}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="desktop-preview-container">
      {/* Top Preview Control Bar for Desktop */}
      <div className="preview-toolbar">
        <div className="preview-logo">
          <span style={{ fontSize: '1.2rem' }}>🌱</span>
          <span>FairPrice Mobile App</span>
          <span className="preview-logo-badge">Figma UI</span>
        </div>

        <div className="view-mode-buttons">
          <button 
            className={`view-mode-btn ${viewMode === 'single' ? 'active' : ''}`}
            onClick={() => setViewMode('single')}
          >
            <Smartphone size={16} />
            <span>Interactive Mobile</span>
          </button>
          <button 
            className={`view-mode-btn ${viewMode === 'gallery' ? 'active' : ''}`}
            onClick={() => setViewMode('gallery')}
          >
            <LayoutGrid size={16} />
            <span>All 6 Figma Screens</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Single Interactive Mobile Phone */}
      {viewMode === 'single' ? (
        <div className="device-frame">
          <StatusBar />
          {renderScreen()}
          <BottomNav 
            activeTab={activeTab === 'mandi-detail' ? 'mandi' : activeTab} 
            onTabChange={handleTabChange} 
          />
          <HomeIndicator />
        </div>
      ) : (
        /* Mode 2: Gallery showing all 6 Figma screens side-by-side */
        <div className="artboards-gallery">
          {/* Screen 1: Home */}
          <div className="artboard-item">
            <div className="artboard-title">1. FairPrice Intelligence (Home)</div>
            <div className="device-frame" style={{ width: '360px', height: '780px' }}>
              <StatusBar />
              {renderScreen('home')}
              <BottomNav activeTab="home" onTabChange={() => {}} />
              <HomeIndicator />
            </div>
          </div>

          {/* Screen 2: Mandi Locator */}
          <div className="artboard-item">
            <div className="artboard-title">2. Best Mandi Locator</div>
            <div className="device-frame" style={{ width: '360px', height: '780px' }}>
              <StatusBar />
              {renderScreen('mandi')}
              <BottomNav activeTab="mandi" onTabChange={() => {}} />
              <HomeIndicator />
            </div>
          </div>

          {/* Screen 3: Trends & Forecast */}
          <div className="artboard-item">
            <div className="artboard-title">3. Price Trends & AI Forecast</div>
            <div className="device-frame" style={{ width: '360px', height: '780px' }}>
              <StatusBar />
              {renderScreen('trends')}
              <BottomNav activeTab="trends" onTabChange={() => {}} />
              <HomeIndicator />
            </div>
          </div>

          {/* Screen 4: Mandi Detail */}
          <div className="artboard-item">
            <div className="artboard-title">4. Guntur APMC — Tomato Detail</div>
            <div className="device-frame" style={{ width: '360px', height: '780px' }}>
              <StatusBar />
              {renderScreen('mandi-detail')}
              <BottomNav activeTab="mandi" onTabChange={() => {}} />
              <HomeIndicator />
            </div>
          </div>

          {/* Screen 5: Profile & Settings */}
          <div className="artboard-item">
            <div className="artboard-title">5. Profile & Preferences</div>
            <div className="device-frame" style={{ width: '360px', height: '780px' }}>
              <StatusBar />
              {renderScreen('settings')}
              <BottomNav activeTab="settings" onTabChange={() => {}} />
              <HomeIndicator />
            </div>
          </div>

          {/* Screen 6: Live Alerts */}
          <div className="artboard-item">
            <div className="artboard-title">6. Live Market Price Alerts</div>
            <div className="device-frame" style={{ width: '360px', height: '780px' }}>
              <StatusBar />
              {renderScreen('alerts')}
              <BottomNav activeTab="alerts" onTabChange={() => {}} />
              <HomeIndicator />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
