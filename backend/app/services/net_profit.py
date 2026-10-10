import math
from typing import List, Dict
from sqlalchemy.orm import Session
from ..models import Crop, Mandi, PriceRecord

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    # Earth radius in kilometers
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 1)

def compare_mandis_net_profit(
    db: Session,
    crop_id: int,
    farmer_lat: float,
    farmer_lon: float,
    quantity_kg: float = 500.0,
    transport_rate_per_km: float = 12.0 # ₹12 per km for small tempo
) -> Dict:
    crop = db.query(Crop).filter(Crop.id == crop_id).first()
    mandis = db.query(Mandi).all()

    comparison_list = []
    
    for mandi in mandis:
        dist_km = haversine_distance(farmer_lat, farmer_lon, mandi.latitude, mandi.longitude)
        
        # Fetch latest modal price
        latest_record = db.query(PriceRecord).filter(
            PriceRecord.crop_id == crop_id,
            PriceRecord.mandi_id == mandi.id
        ).order_by(PriceRecord.date.desc()).first()

        raw_price_per_kg = latest_record.modal_price if latest_record else 20.0

        # Calculate Freight
        total_freight_cost = dist_km * transport_rate_per_km
        freight_per_kg = total_freight_cost / quantity_kg
        
        net_price_per_kg = round(max(0.0, raw_price_per_kg - freight_per_kg), 2)
        net_profit_total = round(net_price_per_kg * quantity_kg, 2)

        comparison_list.append({
            "mandi_id": mandi.id,
            "mandi_name": mandi.name,
            "district": mandi.district,
            "distance_km": dist_km,
            "raw_price_per_kg": raw_price_per_kg,
            "estimated_freight_cost": round(total_freight_cost, 2),
            "net_realized_price_per_kg": net_price_per_kg,
            "net_profit_total": net_profit_total,
            "is_best_choice": False
        })

    # Sort by Net Realized Price / Net Profit Total descending
    comparison_list.sort(key=lambda x: x["net_profit_total"], reverse=True)
    
    if comparison_list:
        comparison_list[0]["is_best_choice"] = True

    return {
        "crop": crop.name if crop else "Unknown",
        "quantity_kg": quantity_kg,
        "transport_rate_per_km": transport_rate_per_km,
        "mandis": comparison_list
    }
