"""
MaternalGuard — Prediction Engine
Loads trained XGBoost models, runs inference, and generates SHAP explanations.
"""

import os
import numpy as np
import pandas as pd
import shap
import joblib
from typing import Dict, List, Any

MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "ml", "saved_models")

TARGETS = [
    "pph_outcome",
    "preeclampsia_postpartum",
    "sepsis_outcome",
    "cardiomyopathy_outcome",
    "ppd_outcome",
]

CONDITION_NAMES = {
    "pph_outcome": "Postpartum Hemorrhage",
    "preeclampsia_postpartum": "Postpartum Preeclampsia",
    "sepsis_outcome": "Postpartum Sepsis",
    "cardiomyopathy_outcome": "Peripartum Cardiomyopathy",
    "ppd_outcome": "Postpartum Depression",
}

CATEGORICAL_FEATURES = ["race_ethnicity", "insurance_type", "mode_of_delivery"]

# ─── Human-readable feature explanations ───
FEATURE_EXPLANATIONS = {
    "age": {
        "display": "Patient Age",
        "context": "Advanced maternal age (>35) is associated with increased risk for several postpartum complications."
    },
    "race_ethnicity": {
        "display": "Race/Ethnicity",
        "context": "Racial disparities in maternal outcomes reflect systemic healthcare inequities and social determinants of health."
    },
    "insurance_type": {
        "display": "Insurance Type",
        "context": "Insurance status affects access to prenatal care and postpartum follow-up."
    },
    "bmi_pre_pregnancy": {
        "display": "Pre-pregnancy BMI",
        "context": "Elevated BMI increases risk for hypertensive disorders, hemorrhage, and surgical complications."
    },
    "gravidity": {
        "display": "Number of Pregnancies",
        "context": "Grand multigravidity is associated with increased uterine atony and hemorrhage risk."
    },
    "parity": {
        "display": "Number of Prior Births",
        "context": "Parity influences uterine tone and risk for postpartum complications."
    },
    "previous_cesarean": {
        "display": "Previous Cesarean Section",
        "context": "Prior cesarean increases risk of surgical complications, placental abnormalities, and hemorrhage."
    },
    "previous_pph": {
        "display": "Previous PPH History",
        "context": "History of previous PPH significantly increases recurrence risk in subsequent deliveries."
    },
    "previous_preeclampsia": {
        "display": "Previous Preeclampsia",
        "context": "Prior preeclampsia is the strongest predictor of recurrence in future pregnancies."
    },
    "gestational_age_at_delivery": {
        "display": "Gestational Age at Delivery",
        "context": "Preterm delivery (<37 weeks) is associated with increased infection risk and maternal complications."
    },
    "multiple_gestation": {
        "display": "Multiple Gestation (Twins+)",
        "context": "Multiple gestation increases risk of hemorrhage, preeclampsia, and cardiomyopathy."
    },
    "mode_of_delivery": {
        "display": "Mode of Delivery",
        "context": "Cesarean delivery carries higher risk of hemorrhage, infection, and thromboembolic events."
    },
    "systolic_bp": {
        "display": "Systolic Blood Pressure",
        "context": "Elevated systolic BP (>140 mmHg) may indicate preeclampsia or hypertensive emergency."
    },
    "diastolic_bp": {
        "display": "Diastolic Blood Pressure",
        "context": "Diastolic BP >90 mmHg is a key diagnostic criterion for hypertensive disorders."
    },
    "heart_rate": {
        "display": "Heart Rate",
        "context": "Tachycardia may indicate hemorrhage, sepsis, or cardiac dysfunction."
    },
    "temperature": {
        "display": "Temperature (°F)",
        "context": "Fever >100.4°F in the postpartum period raises concern for endometritis or sepsis."
    },
    "respiratory_rate": {
        "display": "Respiratory Rate",
        "context": "Tachypnea may indicate pulmonary edema, sepsis, or cardiovascular compromise."
    },
    "hemoglobin": {
        "display": "Hemoglobin (g/dL)",
        "context": "Low hemoglobin indicates anemia and increases vulnerability to hemorrhage-related morbidity."
    },
    "platelet_count": {
        "display": "Platelet Count (×10³/µL)",
        "context": "Thrombocytopenia (<150K) may indicate HELLP syndrome or DIC."
    },
    "white_blood_cell_count": {
        "display": "WBC Count (×10³/µL)",
        "context": "Elevated WBC (>15K) may indicate infection, though mild leukocytosis is normal postpartum."
    },
    "creatinine": {
        "display": "Creatinine (mg/dL)",
        "context": "Elevated creatinine suggests renal impairment, which may complicate preeclampsia."
    },
    "ast_level": {
        "display": "AST Level (U/L)",
        "context": "Elevated AST may indicate liver dysfunction associated with HELLP syndrome."
    },
    "alt_level": {
        "display": "ALT Level (U/L)",
        "context": "Elevated ALT suggests hepatic injury, often seen in severe preeclampsia."
    },
    "blood_glucose": {
        "display": "Blood Glucose (mg/dL)",
        "context": "Abnormal glucose levels indicate diabetes, a risk factor for infection and preeclampsia."
    },
    "chronic_hypertension": {
        "display": "Chronic Hypertension",
        "context": "Pre-existing hypertension significantly increases risk of superimposed preeclampsia."
    },
    "pregestational_diabetes": {
        "display": "Pre-gestational Diabetes",
        "context": "Pre-existing diabetes increases risk of preeclampsia, infection, and cardiomyopathy."
    },
    "gestational_diabetes": {
        "display": "Gestational Diabetes",
        "context": "Gestational diabetes is associated with macrosomia and increased cesarean delivery risk."
    },
    "anemia_during_pregnancy": {
        "display": "Anemia During Pregnancy",
        "context": "Antepartum anemia reduces physiologic reserve for blood loss during delivery."
    },
    "uterine_fibroids": {
        "display": "Uterine Fibroids",
        "context": "Fibroids can impair uterine contraction, increasing hemorrhage risk."
    },
    "placenta_previa": {
        "display": "Placenta Previa",
        "context": "Placenta previa is a major risk factor for antepartum and postpartum hemorrhage."
    },
    "placental_abruption": {
        "display": "Placental Abruption",
        "context": "Abruption causes severe hemorrhage and may lead to DIC and coagulopathy."
    },
    "chorioamnionitis": {
        "display": "Chorioamnionitis",
        "context": "Intra-amniotic infection is a leading risk factor for postpartum endometritis and sepsis."
    },
    "autoimmune_disorder": {
        "display": "Autoimmune Disorder",
        "context": "Autoimmune conditions increase risk of preeclampsia and thrombotic complications."
    },
    "labor_induction": {
        "display": "Labor Induction",
        "context": "Induced labor may be prolonged and is associated with increased intervention rates."
    },
    "labor_augmentation_oxytocin": {
        "display": "Oxytocin Augmentation",
        "context": "Oxytocin use during labor can cause uterine atony after delivery, increasing hemorrhage risk."
    },
    "epidural_anesthesia": {
        "display": "Epidural Anesthesia",
        "context": "Epidural use may prolong labor and increase need for instrumental delivery."
    },
    "general_anesthesia": {
        "display": "General Anesthesia",
        "context": "General anesthesia carries higher risk of aspiration, hemorrhage, and delayed bonding."
    },
    "perineal_laceration_degree": {
        "display": "Perineal Laceration Degree",
        "context": "Severe lacerations (3rd-4th degree) increase blood loss and infection risk."
    },
    "estimated_blood_loss_ml": {
        "display": "Estimated Blood Loss (mL)",
        "context": "EBL >500mL (vaginal) or >1000mL (cesarean) defines postpartum hemorrhage."
    },
    "newborn_weight_g": {
        "display": "Newborn Weight (g)",
        "context": "Macrosomia (>4000g) increases risk of lacerations and uterine atony."
    },
    "labor_duration_hours": {
        "display": "Labor Duration (hours)",
        "context": "Prolonged labor increases risk of infection, hemorrhage, and maternal exhaustion."
    },
    "smoking_during_pregnancy": {
        "display": "Smoking During Pregnancy",
        "context": "Smoking impairs wound healing and is associated with placental complications."
    },
    "substance_use": {
        "display": "Substance Use",
        "context": "Substance use is associated with preterm birth, poor prenatal care, and postpartum depression."
    },
    "prenatal_visits_count": {
        "display": "Number of Prenatal Visits",
        "context": "Fewer prenatal visits indicate reduced access to care and missed screening opportunities."
    },
    "distance_to_hospital_miles": {
        "display": "Distance to Hospital (miles)",
        "context": "Greater distance may delay emergency intervention for postpartum complications."
    },
}

# ─── Risk-level-specific recommendations ───
RECOMMENDATIONS = {
    "pph_outcome": {
        "low": [
            "Routine postpartum monitoring per standard protocol",
            "Ensure IV access is established",
        ],
        "moderate": [
            "Type and screen on admission",
            "Ensure large-bore IV access",
            "Active management of third stage of labor",
            "Monitor for signs of uterine atony",
        ],
        "high": [
            "Type and crossmatch 2 units pRBCs",
            "Ensure large-bore IV access (two sites)",
            "Active management of third stage of labor",
            "Have uterotonics readily available",
            "Notify anesthesia team of high-risk status",
            "Consider cell saver availability",
        ],
        "critical": [
            "ACTIVATE Massive Transfusion Protocol readiness",
            "Type and crossmatch 4 units pRBCs",
            "Ensure dual large-bore IV access",
            "Anesthesia and surgery teams on standby",
            "Have uterotonic agents drawn and ready",
            "Prepare for possible interventional radiology",
            "Consider ICU bed reservation",
        ],
    },
    "preeclampsia_postpartum": {
        "low": [
            "Routine blood pressure monitoring postpartum",
            "Standard discharge BP instructions",
        ],
        "moderate": [
            "Serial blood pressure monitoring every 4 hours",
            "Monitor for headache, visual changes, epigastric pain",
            "Check labs: CBC, CMP, LDH",
            "Consider 24-48 hour magnesium sulfate prophylaxis",
        ],
        "high": [
            "Continuous blood pressure monitoring",
            "Magnesium sulfate for seizure prophylaxis",
            "Serial labs every 6 hours (CBC, CMP, LDH, uric acid)",
            "Consider antihypertensive therapy",
            "Monitor strict I&O",
            "Notify attending of high-risk status",
        ],
        "critical": [
            "IMMEDIATE magnesium sulfate infusion",
            "IV labetalol or hydralazine for blood pressure control",
            "Continuous telemetry monitoring",
            "Serial labs every 4 hours",
            "ICU consultation",
            "Consider delivery if still antepartum",
            "Strict I&O and daily weights",
        ],
    },
    "sepsis_outcome": {
        "low": [
            "Routine postpartum infection surveillance",
            "Monitor temperature every 8 hours",
        ],
        "moderate": [
            "Monitor temperature every 4 hours",
            "Monitor for signs of endometritis (uterine tenderness, lochia)",
            "Review CBC and differential",
            "Low threshold for blood cultures if febrile",
        ],
        "high": [
            "Blood cultures before any antibiotic administration",
            "Broad-spectrum antibiotics within 1 hour if sepsis suspected",
            "Serial vital signs every 2 hours",
            "Lactate level monitoring",
            "Consider CT imaging if source unclear",
            "Infectious disease consultation",
        ],
        "critical": [
            "ACTIVATE Sepsis Bundle protocol",
            "Blood cultures x2 STAT",
            "Broad-spectrum IV antibiotics within 1 hour",
            "30 mL/kg IV crystalloid bolus",
            "Continuous vital sign monitoring",
            "Serial lactate levels q2h",
            "ICU admission for vasopressor support if needed",
            "Source control: imaging and surgical consultation",
        ],
    },
    "cardiomyopathy_outcome": {
        "low": [
            "Routine postpartum cardiac assessment",
            "Educate on symptoms: dyspnea, edema, palpitations",
        ],
        "moderate": [
            "Echocardiogram within 48 hours postpartum",
            "BNP or NT-proBNP level",
            "Daily weight and fluid balance monitoring",
            "Cardiology consultation recommended",
        ],
        "high": [
            "STAT echocardiogram",
            "BNP, troponin, and CRP levels",
            "Cardiology consultation",
            "Continuous telemetry monitoring",
            "Restrict IV fluids to avoid volume overload",
            "Consider ACE inhibitor initiation if not breastfeeding",
        ],
        "critical": [
            "STAT echocardiogram and cardiology consult",
            "ICU admission for hemodynamic monitoring",
            "BNP, troponin, CRP, full metabolic panel",
            "Diuresis for volume overload",
            "Inotropic support if EF severely reduced",
            "Evaluate for mechanical circulatory support",
            "Lactation team consultation re: medication safety",
        ],
    },
    "ppd_outcome": {
        "low": [
            "Edinburgh Postnatal Depression Scale at 2-week follow-up",
            "Provide postpartum mental health resource information",
        ],
        "moderate": [
            "Edinburgh Postnatal Depression Scale before discharge",
            "Schedule early postpartum follow-up at 1-2 weeks",
            "Provide crisis hotline information",
            "Screen for social support and resources",
            "Consider referral to social work",
        ],
        "high": [
            "Psychiatric or psychology consultation before discharge",
            "Edinburgh Postnatal Depression Scale at discharge",
            "Safety assessment including suicidal ideation screening",
            "Establish outpatient mental health follow-up within 1 week",
            "Consider SSRI initiation with lactation guidance",
            "Social work consultation for support services",
        ],
        "critical": [
            "IMMEDIATE psychiatric consultation",
            "Comprehensive safety assessment including SI/HI",
            "Consider inpatient psychiatric observation",
            "1:1 monitoring if suicidal/homicidal ideation present",
            "Initiate pharmacotherapy with lactation-safe agent",
            "Coordinate intensive outpatient program on discharge",
            "Involve social work for child protective coordination",
        ],
    },
}


def categorize_risk(score: float) -> str:
    if score < 0.2:
        return "low"
    elif score < 0.5:
        return "moderate"
    elif score < 0.8:
        return "high"
    else:
        return "critical"


class PredictionEngine:
    def __init__(self):
        self.models = {}
        self.explainers = {}
        self.label_encoders = {}
        self.feature_names = []
        self._loaded = False

    def load_models(self):
        """Load all saved models and create SHAP explainers."""
        model_dir = os.path.normpath(MODEL_DIR)

        # Load label encoders and feature names
        self.label_encoders = joblib.load(os.path.join(model_dir, "label_encoders.joblib"))
        self.feature_names = joblib.load(os.path.join(model_dir, "feature_names.joblib"))

        # Load each model and create explainer
        for target in TARGETS:
            model_path = os.path.join(model_dir, f"{target}_model.joblib")
            model = joblib.load(model_path)
            self.models[target] = model
            self.explainers[target] = shap.TreeExplainer(model)

        self._loaded = True
        print(f"✓ Loaded {len(self.models)} models with SHAP explainers")

    def _prepare_input(self, patient_data: Dict[str, Any]) -> pd.DataFrame:
        """Convert patient JSON to model-ready DataFrame."""
        df = pd.DataFrame([patient_data])

        # Ensure all expected features exist
        for col in self.feature_names:
            if col not in df.columns:
                df[col] = 0

        # Encode categoricals  
        for col in CATEGORICAL_FEATURES:
            if col in df.columns and col in self.label_encoders:
                le = self.label_encoders[col]
                val = str(df[col].iloc[0])
                if val in le.classes_:
                    df[col] = le.transform([val])[0]
                else:
                    df[col] = 0  # Default for unseen categories

        # Reorder columns to match training
        df = df[self.feature_names]
        return df

    def predict(self, patient_data: Dict[str, Any]) -> Dict[str, Any]:
        """Run prediction for all 5 conditions and return SHAP explanations."""
        if not self._loaded:
            self.load_models()

        # Keep raw values for display
        raw_values = dict(patient_data)
        
        # Prepare encoded input
        X = self._prepare_input(patient_data)

        results = []
        all_shap_values = []

        for target in TARGETS:
            model = self.models[target]
            explainer = self.explainers[target]

            # Get probability
            prob = float(model.predict_proba(X)[:, 1][0])
            risk_category = categorize_risk(prob)

            # Get SHAP values
            shap_values = explainer.shap_values(X)
            if isinstance(shap_values, list):
                sv = shap_values[1][0]  # class 1 (positive)
            else:
                sv = shap_values[0]

            # Build top factors (sorted by absolute SHAP value)
            feature_impacts = []
            for i, fname in enumerate(self.feature_names):
                shap_val = float(sv[i])
                if abs(shap_val) < 0.001:
                    continue

                display_name = FEATURE_EXPLANATIONS.get(fname, {}).get("display", fname)
                explanation = FEATURE_EXPLANATIONS.get(fname, {}).get(
                    "context", f"This feature contributes to the risk prediction."
                )

                feat_val = raw_values.get(fname, X[fname].iloc[0])

                feature_impacts.append({
                    "feature": display_name,
                    "feature_key": fname,
                    "value": feat_val if not isinstance(feat_val, (np.integer, np.floating)) else (
                        int(feat_val) if isinstance(feat_val, np.integer) else float(feat_val)
                    ),
                    "direction": "increases_risk" if shap_val > 0 else "decreases_risk",
                    "impact": "high" if abs(shap_val) > 0.3 else ("moderate" if abs(shap_val) > 0.1 else "low"),
                    "shap_value": round(shap_val, 4),
                    "explanation": explanation,
                })

            # Sort by absolute SHAP value, take top 8
            feature_impacts.sort(key=lambda x: abs(x["shap_value"]), reverse=True)
            top_factors = feature_impacts[:8]

            # Get recommendations based on risk level
            recs = RECOMMENDATIONS.get(target, {}).get(risk_category, [])

            # Generate clinical summary
            summary = _generate_summary(CONDITION_NAMES[target], prob, risk_category, top_factors)

            results.append({
                "condition": CONDITION_NAMES[target],
                "condition_key": target,
                "risk_score": round(prob, 4),
                "risk_category": risk_category,
                "top_factors": top_factors,
                "recommendations": recs,
                "clinical_summary": summary,
            })

            # Track for global view
            for fi in feature_impacts:
                all_shap_values.append({
                    **fi,
                    "condition": CONDITION_NAMES[target],
                })

        # Overall risk = highest individual risk category
        risk_order = {"low": 0, "moderate": 1, "high": 2, "critical": 3}
        overall_category = max(
            [r["risk_category"] for r in results],
            key=lambda x: risk_order[x],
        )
        overall_score = max(r["risk_score"] for r in results)

        # Top 10 global factors across all conditions
        all_shap_values.sort(key=lambda x: abs(x["shap_value"]), reverse=True)
        # Deduplicate by feature name, keeping highest impact
        seen = set()
        global_top = []
        for item in all_shap_values:
            key = item["feature_key"]
            if key not in seen and len(global_top) < 10:
                seen.add(key)
                global_top.append(item)

        return {
            "overall_risk_score": round(overall_score, 4),
            "overall_risk_category": overall_category,
            "conditions": results,
            "global_top_factors": global_top,
        }


def _generate_summary(condition: str, prob: float, category: str, top_factors: list) -> str:
    """Generate a plain-language clinical summary."""
    pct = round(prob * 100, 1)

    if category == "low":
        risk_desc = "low"
        action = "Standard postpartum monitoring protocols are appropriate."
    elif category == "moderate":
        risk_desc = "moderate"
        action = "Enhanced monitoring and early intervention planning are recommended."
    elif category == "high":
        risk_desc = "elevated"
        action = "Close monitoring and proactive clinical measures are strongly recommended."
    else:
        risk_desc = "critically elevated"
        action = "Immediate clinical attention and intensive monitoring protocols are indicated."

    # Pick top 2 risk-increasing factors for the narrative
    increasing = [f for f in top_factors if f["direction"] == "increases_risk"][:2]
    if increasing:
        factors_str = " and ".join([f["feature"] for f in increasing])
        factor_sentence = f" Key contributing factors include {factors_str}."
    else:
        factor_sentence = ""

    return (
        f"This patient's predicted risk for {condition} is {risk_desc} at {pct}%.{factor_sentence} "
        f"{action}"
    )


# Singleton engine
engine = PredictionEngine()
