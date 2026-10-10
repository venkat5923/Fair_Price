import React from 'react';

export default function CropSelector({ crops, selectedCropId, onSelectCrop, lang }) {
  const getCropName = (crop) => {
    if (lang === 'te') return crop.telugu_name;
    if (lang === 'ta') return crop.tamil_name;
    return crop.name;
  };

  return (
    <div className="glass-card">
      <div className="section-header">
        <h2 className="section-title">
          <span>🌱</span>
          <span>{lang === 'te' ? 'పంటను ఎంచుకోండి' : (lang === 'ta' ? 'பயிரைத் தேர்ந்தெடுக்கவும்' : 'Select Crop')}</span>
        </h2>
      </div>
      <div className="crop-grid">
        {crops.map((crop) => (
          <button
            key={crop.id}
            className={`crop-chip ${selectedCropId === crop.id ? 'active' : ''}`}
            onClick={() => onSelectCrop(crop.id)}
          >
            <span className="crop-icon">{crop.icon}</span>
            <span className="crop-name">{getCropName(crop)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
