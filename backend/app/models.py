from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class Crop(Base):
    __tablename__ = "crops"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    telugu_name = Column(String)
    tamil_name = Column(String)
    icon = Column(String) # Emoji or icon name
    category = Column(String, default="Vegetables")

    prices = relationship("PriceRecord", back_populates="crop")

class Mandi(Base):
    __tablename__ = "mandis"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    district = Column(String, index=True)
    state = Column(String, index=True)
    latitude = Column(Float)
    longitude = Column(Float)
    
    prices = relationship("PriceRecord", back_populates="mandi")

class PriceRecord(Base):
    __tablename__ = "price_records"

    id = Column(Integer, primary_key=True, index=True)
    crop_id = Column(Integer, ForeignKey("crops.id"))
    mandi_id = Column(Integer, ForeignKey("mandis.id"))
    date = Column(String, index=True) # YYYY-MM-DD
    min_price = Column(Float)
    max_price = Column(Float)
    modal_price = Column(Float) # Average price per kg or quintal
    arrival_volume_tonnes = Column(Float)

    crop = relationship("Crop", back_populates="prices")
    mandi = relationship("Mandi", back_populates="prices")
