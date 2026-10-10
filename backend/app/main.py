import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .database import engine, Base, SessionLocal
from .api.v1.endpoints import router as api_v1_router
from .services.agmarknet import seed_database_if_empty

# Create DB Tables
Base.metadata.create_all(bind=engine)

# Seed Initial Crops, Mandis & 30-Day Historical Price Data
db = SessionLocal()
seed_database_if_empty(db)
db.close()

app = FastAPI(
    title="FairPrice API",
    description="Mandi Price Intelligence & Short-Term Forecasting API for Smallholder Farmers",
    version="1.0.0"
)

# CORS Setup for Mobile PWA Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Audio Static Directory
static_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")
os.makedirs(os.path.join(static_dir, "audio"), exist_ok=True)
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Include API Router
app.include_router(api_v1_router, prefix="/api")

@app.get("/")
def read_root():
    return {
        "app": "FairPrice Mandi Intelligence API",
        "status": "Online",
        "version": "1.0.0",
        "docs": "/docs"
    }
