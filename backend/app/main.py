"""
MaternalGuard — FastAPI Backend
Single prediction endpoint with CORS for local development.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any, Dict, Optional
from app.prediction import engine

app = FastAPI(
    title="MaternalGuard API",
    description="AI-Powered Postpartum Risk Prediction",
    version="1.0.0",
)

# CORS for local Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def load_models():
    """Load ML models on server startup."""
    engine.load_models()


class PatientData(BaseModel):
    """Patient input features — all fields optional with sensible defaults."""
    # Demographics
    age: int = 28
    race_ethnicity: str = "White"
    insurance_type: str = "Private"
    bmi_pre_pregnancy: float = 25.0

    # Obstetric
    gravidity: int = 1
    parity: int = 0
    previous_cesarean: int = 0
    previous_pph: int = 0
    previous_preeclampsia: int = 0
    gestational_age_at_delivery: int = 39
    multiple_gestation: int = 0
    mode_of_delivery: str = "Vaginal"

    # Vitals
    systolic_bp: int = 120
    diastolic_bp: int = 75
    heart_rate: int = 80
    temperature: float = 98.6
    respiratory_rate: int = 18

    # Labs
    hemoglobin: float = 12.0
    platelet_count: int = 250
    white_blood_cell_count: float = 10.0
    creatinine: float = 0.8
    ast_level: int = 25
    alt_level: int = 22
    blood_glucose: int = 100

    # Medical history
    chronic_hypertension: int = 0
    pregestational_diabetes: int = 0
    gestational_diabetes: int = 0
    anemia_during_pregnancy: int = 0
    uterine_fibroids: int = 0
    placenta_previa: int = 0
    placental_abruption: int = 0
    chorioamnionitis: int = 0
    autoimmune_disorder: int = 0

    # Delivery
    labor_induction: int = 0
    labor_augmentation_oxytocin: int = 0
    epidural_anesthesia: int = 0
    general_anesthesia: int = 0
    perineal_laceration_degree: int = 0
    estimated_blood_loss_ml: int = 350
    newborn_weight_g: int = 3300
    labor_duration_hours: float = 10.0

    # Social
    smoking_during_pregnancy: int = 0
    substance_use: int = 0
    prenatal_visits_count: int = 10
    distance_to_hospital_miles: float = 12.0


@app.post("/api/predict")
async def predict(patient: PatientData):
    """Run risk prediction for all 5 postpartum conditions."""
    try:
        patient_dict = patient.model_dump()
        result = engine.predict(patient_dict)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/health")
async def health():
    """Health check endpoint."""
    return {"status": "ok", "models_loaded": engine._loaded}
