from pydantic import BaseModel
from typing import List, Optional

class CropSchema(BaseModel):
    id: int
    name: str
    telugu_name: str
    tamil_name: str
    icon: str
    category: str

    class Config:
        from_attributes = True

class MandiSchema(BaseModel):
    id: int
    name: str
    district: str
    state: str
    latitude: float
    longitude: float

    class Config:
        from_attributes = True

class PriceRecordSchema(BaseModel):
    id: int
    date: str
    min_price: float
    max_price: float
    modal_price: float
    arrival_volume_tonnes: float

    class Config:
        from_attributes = True

class ForecastItem(BaseModel):
    date: str
    predicted_price: float
    lower_bound: float
    upper_bound: float

class PredictionResponse(BaseModel):
    crop: str
    mandi: str
    current_price: float
    recommendation_signal: str # "HOLD" | "SELL_TODAY" | "STABLE"
    confidence_score: float # e.g. 88.5
    price_change_percent: float # e.g. +12.4%
    reasoning_te: str
    reasoning_ta: str
    reasoning_en: str
    historical_trends: List[PriceRecordSchema]
    forecast_next_5_days: List[ForecastItem]

class MandiComparisonItem(BaseModel):
    mandi_id: int
    mandi_name: str
    district: str
    distance_km: float
    raw_price_per_kg: float
    estimated_freight_cost: float
    net_realized_price_per_kg: float
    net_profit_total: float
    is_best_choice: bool

class MandiComparisonResponse(BaseModel):
    crop: str
    quantity_kg: float
    transport_rate_per_km: float
    mandis: List[MandiComparisonItem]

class VoicePayloadResponse(BaseModel):
    language: str
    text_script: str
    audio_url: Optional[str] = None
