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

## ⚠️ Disclaimer

**Research Prototype** — This tool is trained on synthetic data and is NOT validated for clinical use. It is intended as a technology demonstration only. Do not use for actual clinical decision-making.

---

## 🏆 Built for Axxess Hackathon 2026

MaternalGuard © 2026
