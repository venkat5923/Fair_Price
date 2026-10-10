# FairPrice - Mandi Price Intelligence & Forecasting Platform

FairPrice is an AI-powered Mandi Price Intelligence and Short-Term Forecasting platform designed for smallholder farmers. It provides real-time mandi prices, 7-day price forecasting, net profit locators factoring in transport costs, and localized Telugu and Tamil audio readouts.

---

## 🚀 Features

- **Live Mandi Rates:** Real-time prices across local agricultural markets (mandis).
- **Short-Term Forecasting:** 7-day predictive pricing models using historical market trends.
- **Net Profit Locator:** Calculates nearest mandis and net profit by factoring in freight/transportation costs per kilometer.
- **Multilingual Voice Playback:** Text-to-speech audio updates in regional languages (Telugu & Tamil) for accessibility.
- **Mobile-Responsive Interface:** Modern, clean PWA interface built with React and Tailwind-style styling.

---

## 🛠️ Tech Stack

### Backend
- **Python 3.10+ / FastAPI**
- **Uvicorn** (ASGI Server)
- **SQLAlchemy & SQLite**
- **scikit-learn / statsmodels / pandas / numpy** (Forecasting & Trend Analysis)
- **gTTS** (Google Text-to-Speech)

### Frontend
- **React 18**
- **Vite**
- **Lucide React** (Icons)

---

## 💻 Getting Started

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python run.py
```
- API Server runs at: `http://localhost:8000`
- Interactive API Docs (Swagger): `http://localhost:8000/docs`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
- Web Application runs at: `http://localhost:3000`