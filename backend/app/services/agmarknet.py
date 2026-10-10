import datetime
import random
import requests
from sqlalchemy.orm import Session
from ..models import Crop, Mandi, PriceRecord

# Government of India Agmarknet API Endpoint on OGD Platform (data.gov.in)
AGMARKNET_API_ENDPOINT = "https://api.data.gov.in/resource/9ef74157-14e6-49d1-9b84-8052b69927ef"

INITIAL_CROPS = [
    {"name": "Tomato", "telugu_name": "టమోటా", "tamil_name": "தக்காளி", "icon": "🍅", "category": "Vegetables"},
    {"name": "Paddy (Rice)", "telugu_name": "వరి (వరి ధాన్యం)", "tamil_name": "நெல்", "icon": "🌾", "category": "Grains"},
    {"name": "Chili (Red)", "telugu_name": "ఎండు మిరప", "tamil_name": "மிளగாய்", "icon": "🌶️", "category": "Spices"},
    {"name": "Potato", "telugu_name": "బంగాళాదుంప", "tamil_name": "உருளைக்கிழங்கு", "icon": "🥔", "category": "Vegetables"},
    {"name": "Onion", "telugu_name": "ఉల్లిపాయ", "tamil_name": "வெங்காயம்", "icon": "🧅", "category": "Vegetables"},
]

INITIAL_MANDIS = [
    {"name": "Guntur APMC Mandi", "district": "Guntur", "state": "Andhra Pradesh", "latitude": 16.3067, "longitude": 80.4365},
    {"name": "Madanapalle Tomato Market", "district": "Annamayya", "state": "Andhra Pradesh", "latitude": 13.5500, "longitude": 78.5000},
    {"name": "Koyambedu Wholesale Market", "district": "Chennai", "state": "Tamil Nadu", "latitude": 13.0694, "longitude": 80.1948},
    {"name": "Bowenpally Agricultural Market", "district": "Hyderabad", "state": "Telangana", "latitude": 17.4725, "longitude": 78.4722},
    {"name": "Kolar APMC Market", "district": "Kolar", "state": "Karnataka", "latitude": 13.1367, "longitude": 78.1292},
]

BASE_PRICES = {
    "Tomato": 24.0,       # ₹/kg
    "Paddy (Rice)": 28.5, # ₹/kg
    "Chili (Red)": 180.0, # ₹/kg
    "Potato": 18.0,      # ₹/kg
    "Onion": 22.0,       # ₹/kg
}

def seed_database_if_empty(db: Session):
    if db.query(Crop).count() == 0:
        for c in INITIAL_CROPS:
            db.add(Crop(**c))
        db.commit()

    if db.query(Mandi).count() == 0:
        for m in INITIAL_MANDIS:
            db.add(Mandi(**m))
        db.commit()

    if db.query(PriceRecord).count() == 0:
        crops = db.query(Crop).all()
        mandis = db.query(Mandi).all()
        
        today = datetime.date.today()
        # Generate 30 days of historical data for each crop & mandi
        for crop in crops:
            base_p = BASE_PRICES.get(crop.name, 25.0)
            for mandi in mandis:
                mandi_mult = 1.0 + (mandi.id % 3 - 1) * 0.08
                current_p = base_p * mandi_mult
                for day_offset in range(30, -1, -1):
                    rec_date = (today - datetime.timedelta(days=day_offset)).strftime("%Y-%m-%d")
                    fluc = random.uniform(-0.04, 0.05)
                    current_p = max(5.0, current_p * (1.0 + fluc))
                    
                    min_p = round(current_p * 0.9, 1)
                    max_p = round(current_p * 1.1, 1)
                    modal_p = round(current_p, 1)
                    arrival = round(random.uniform(15.0, 120.0), 1)

                    rec = PriceRecord(
                        crop_id=crop.id,
                        mandi_id=mandi.id,
                        date=rec_date,
                        min_price=min_p,
                        max_price=max_p,
                        modal_price=modal_p,
                        arrival_volume_tonnes=arrival
                    )
                    db.add(rec)
        db.commit()

def fetch_live_agmarknet_data(api_key: str, state: str = "Andhra Pradesh", commodity: str = "Tomato"):
    """
    Fetches real-time live daily prices directly from Government of India's Agmarknet Open Data API (data.gov.in).
    """
    params = {
        "api-key": api_key,
        "format": "json",
        "offset": 0,
        "limit": 50,
        "filters[state]": state,
        "filters[commodity]": commodity
    }
    try:
        response = requests.get(AGMARKNET_API_ENDPOINT, params=params, timeout=10)
        if response.status_code == 200:
            data = response.json()
            records = data.get("records", [])
            parsed_results = []
            for r in records:
                parsed_results.append({
                    "state": r.get("state"),
                    "district": r.get("district"),
                    "mandi": r.get("market"),
                    "commodity": r.get("commodity"),
                    "arrival_date": r.get("arrival_date"),
                    "min_price_per_quintal": float(r.get("min_price", 0)),
                    "max_price_per_quintal": float(r.get("max_price", 0)),
                    "modal_price_per_kg": round(float(r.get("modal_price", 0)) / 100.0, 2)
                })
            return parsed_results
        else:
            return {"error": f"Agmarknet API HTTP {response.status_code}"}
    except Exception as e:
        return {"error": str(e)}
