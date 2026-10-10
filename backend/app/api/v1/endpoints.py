from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List

from ...database import get_db
from ...models import Crop, Mandi
from ...schemas import CropSchema, MandiSchema, PredictionResponse, MandiComparisonResponse, VoicePayloadResponse
from ...services.forecasting import predict_crop_price
from ...services.net_profit import compare_mandis_net_profit
from ...services.tts import generate_voice_payload

router = APIRouter()

@router.get("/crops", response_model=List[CropSchema])
def get_crops(db: Session = Depends(get_db)):
    return db.query(Crop).all()

@router.get("/mandis", response_model=List[MandiSchema])
def get_mandis(db: Session = Depends(get_db)):
    return db.query(Mandi).all()

@router.get("/predict", response_model=PredictionResponse)
def get_prediction(
    crop_id: int = Query(1, description="ID of the crop"),
    mandi_id: int = Query(1, description="ID of the mandi"),
    db: Session = Depends(get_db)
):
    try:
        res = predict_crop_price(db, crop_id, mandi_id)
        return res
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/compare-mandis", response_model=MandiComparisonResponse)
def get_mandi_comparison(
    crop_id: int = Query(1),
    lat: float = Query(16.3067, description="Farmer Latitude"),
    lon: float = Query(80.4365, description="Farmer Longitude"),
    quantity_kg: float = Query(500.0, description="Harvest Quantity in kg"),
    freight_rate: float = Query(12.0, description="Transport rate ₹/km"),
    db: Session = Depends(get_db)
):
    try:
        res = compare_mandis_net_profit(db, crop_id, lat, lon, quantity_kg, freight_rate)
        return res
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/voice/synthesize", response_model=VoicePayloadResponse)
def synthesize_voice(
    text: str = Query(..., description="Text script to pronounce"),
    language: str = Query("te", description="Language code: 'te' for Telugu, 'ta' for Tamil, 'en' for English")
):
    return generate_voice_payload(text, language)
