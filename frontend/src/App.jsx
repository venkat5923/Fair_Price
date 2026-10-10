import React, { useState, useEffect } from 'react';
import BottomNav from './components/BottomNav';
import ScreenHome from './components/ScreenHome';
import ScreenMandiLocator from './components/ScreenMandiLocator';
import ScreenTrendsForecast from './components/ScreenTrendsForecast';
import ScreenMandiDetail from './components/ScreenMandiDetail';
import ScreenProfileSettings from './components/ScreenProfileSettings';
import ScreenMarketAlerts from './components/ScreenMarketAlerts';

import { fetchCrops, fetchPrediction, fetchMandiComparison } from './services/api';

const DEFAULT_CROPS = [
  {"id": 1, "name": "Tomato", "telugu_name": "టమోటా", "tamil_name": "தக்காளி", "icon": "🍅", "category": "Vegetables"},
  {"id": 2, "name": "Paddy/Rice", "telugu_name": "వరి (వరి ధాన్యం)", "tamil_name": "நெல்", "icon": "🌾", "category": "Grains"},
  {"id": 3, "name": "Chili", "telugu_name": "ఎండు మిరప", "tamil_name": "மிளகாய்", "icon": "🌶️", "category": "Spices"},
  {"id": 4, "name": "Potato", "telugu_name": "బంగాళాదుంప", "tamil_name": "உருளைக்கிழங்கு", "icon": "🥔", "category": "Vegetables"},
  {"id": 5, "name": "Onion", "telugu_name": "ఉల్లిపాయ", "tamil_name": "வெங்காயம்", "icon": "🧅", "category": "Vegetables"},
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
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
  const renderScreen = () => {
    switch (activeTab) {
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
    <div className="app-shell">
      <div className="app-container">
        <main className="app-main-content">
          {renderScreen()}
        </main>
        <BottomNav 
          activeTab={activeTab === 'mandi-detail' ? 'mandi' : activeTab} 
          onTabChange={handleTabChange} 
        />
      </div>
    </div>
  );
}
