# MaternalGuard 🩺

**AI-Powered Postpartum Risk Prediction for Clinicians**

> 80% of maternal deaths are preventable. Zero ML models have been clinically deployed for postpartum prediction. We're changing that.

MaternalGuard is an AI-powered clinical decision support tool that predicts risk for 5 major postpartum complications using machine learning with SHAP-based explainability.

---

## 🎯 What It Does

A clinician inputs patient data and instantly receives ML-powered risk predictions for:

| Condition | Description |
|---|---|
| **Postpartum Hemorrhage (PPH)** | Excessive bleeding after delivery |
| **Postpartum Preeclampsia** | Hypertensive disorder after delivery |
| **Postpartum Sepsis** | Severe maternal infection |
| **Peripartum Cardiomyopathy** | Heart failure during/after pregnancy |
| **Postpartum Depression (PPD)** | Mood disorder affecting new mothers |

Each prediction includes:
- **Risk Score** (0-100%) with categorical risk level (Low/Moderate/High/Critical)
- **Top Contributing Factors** with real SHAP values and clinical explanations
- **Actionable Recommendations** that vary by risk level
- **Global Risk Factor Analysis** across all conditions

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS, Recharts |
| **Backend** | FastAPI, Python 3.11 |
| **ML** | XGBoost, SHAP, scikit-learn, pandas |
| **Data** | Synthetic (10,000 records) — no database needed |

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+ with pip
- Node.js 18+ with npm
- Git

### 1. Clone the repository
```bash
git clone https://github.com/aarohCodes/AxxessHackathon2026.git
cd AxxessHackathon2026
```

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python ml/synthetic_data.py       # Generate 10,000 synthetic training records
python ml/train_model.py          # Train 5 XGBoost models
python -m uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup (new terminal)
```bash
cd frontend
npm install
npm run dev
```

### 4. Open the app
Navigate to **http://localhost:3000**

---

## 📁 Project Structure

```
maternalguard/
├── frontend/                  # Next.js 14 App Router
│   ├── .env.local             # API URL config
│   ├── app/
│   │   ├── layout.tsx         # Root layout with Navbar
│   │   ├── page.tsx           # Landing page
│   │   ├── globals.css        # Tailwind styles
│   │   ├── assess/page.tsx    # Patient data input form
│   │   └── results/page.tsx   # Risk prediction results (the money page)
│   ├── components/
│   │   ├── PatientForm.tsx    # Full patient data form with sample buttons
│   │   ├── RiskCard.tsx       # Individual risk score card with gauge
│   │   ├── RiskFactors.tsx    # SHAP explanation bars
│   │   └── Navbar.tsx         # Top navigation
│   └── lib/
│       ├── api.ts             # Fetch wrapper to backend
│       └── types.ts           # TypeScript types + sample patients
│
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI entry + CORS + /api/predict endpoint
│   │   └── prediction.py      # Model loading, SHAP explanations, recommendations
│   ├── ml/
│   │   ├── synthetic_data.py  # Generate 10,000 synthetic records
│   │   ├── train_model.py     # Train 5 XGBoost models
│   │   └── saved_models/      # Trained .joblib models + data
│   └── requirements.txt
│
└── README.md
```

---

## 🎮 Demo Tips

1. Click **"Load High-Risk Sample"** on the assessment page for an instant demo
2. The **Results Page** is the showstopper — expand each condition card for detailed SHAP explanations
3. The **Global Risk Factor Chart** shows the top 10 most impactful features across all conditions
4. Try **"Load Low-Risk Sample"** to see the contrast

---

## ⚠️ Disclaimer

**Research Prototype** — This tool is trained on synthetic data and is NOT validated for clinical use. It is intended as a technology demonstration only. Do not use for actual clinical decision-making.

---

## 🏆 Built for Axxess Hackathon 2026

MaternalGuard © 2026
