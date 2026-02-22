"""
MaternalGuard — Synthetic Training Data Generator
Generates 10,000 clinically-realistic postpartum patient records.
"""

import numpy as np
import pandas as pd
import os

np.random.seed(42)
N = 10_000


def sigmoid(x):
    return 1 / (1 + np.exp(-x))


def generate_data():
    # ── DEMOGRAPHICS ──
    age = np.random.randint(15, 51, N)
    race_ethnicity = np.random.choice(
        ["White", "Black", "Hispanic", "Asian", "Native American", "Other"],
        N, p=[0.40, 0.18, 0.22, 0.10, 0.03, 0.07],
    )
    insurance_type = np.random.choice(
        ["Private", "Medicaid", "Medicare", "Uninsured"],
        N, p=[0.45, 0.40, 0.05, 0.10],
    )
    bmi_pre_pregnancy = np.clip(np.random.normal(27, 6, N), 16, 55).round(1)

    # ── OBSTETRIC ──
    gravidity = np.random.choice(range(1, 10), N, p=[0.25, 0.30, 0.20, 0.12, 0.06, 0.03, 0.02, 0.01, 0.01])
    parity = np.minimum(gravidity - np.random.randint(0, 2, N), gravidity).clip(0)
    previous_cesarean = (np.random.random(N) < 0.25).astype(int)
    previous_pph = (np.random.random(N) < 0.05).astype(int)
    previous_preeclampsia = (np.random.random(N) < 0.06).astype(int)
    gestational_age_at_delivery = np.clip(np.random.normal(39, 2, N).astype(int), 24, 42)
    multiple_gestation = (np.random.random(N) < 0.03).astype(int)
    mode_of_delivery = np.random.choice(
        ["Vaginal", "Cesarean", "Assisted Vaginal"],
        N, p=[0.60, 0.32, 0.08],
    )

    # ── VITALS ──
    systolic_bp = np.clip(np.random.normal(120, 15, N), 85, 200).astype(int)
    diastolic_bp = np.clip(np.random.normal(75, 10, N), 50, 130).astype(int)
    heart_rate = np.clip(np.random.normal(82, 12, N), 50, 150).astype(int)
    temperature = np.clip(np.random.normal(98.6, 0.5, N), 96.0, 104.0).round(1)
    respiratory_rate = np.clip(np.random.normal(18, 3, N), 10, 35).astype(int)

    # ── LABS ──
    hemoglobin = np.clip(np.random.normal(12.0, 1.5, N), 5.0, 17.0).round(1)
    platelet_count = np.clip(np.random.normal(250, 60, N), 50, 500).astype(int)
    white_blood_cell_count = np.clip(np.random.normal(10, 3, N), 3.0, 30.0).round(1)
    creatinine = np.clip(np.random.normal(0.8, 0.2, N), 0.3, 3.0).round(2)
    ast_level = np.clip(np.random.normal(25, 12, N), 8, 200).astype(int)
    alt_level = np.clip(np.random.normal(22, 10, N), 5, 200).astype(int)
    blood_glucose = np.clip(np.random.normal(100, 20, N), 50, 300).astype(int)

    # ── MEDICAL HISTORY ──
    chronic_hypertension = (np.random.random(N) < 0.08).astype(int)
    pregestational_diabetes = (np.random.random(N) < 0.04).astype(int)
    gestational_diabetes = (np.random.random(N) < 0.10).astype(int)
    anemia_during_pregnancy = (np.random.random(N) < 0.12).astype(int)
    uterine_fibroids = (np.random.random(N) < 0.05).astype(int)
    placenta_previa = (np.random.random(N) < 0.03).astype(int)
    placental_abruption = (np.random.random(N) < 0.01).astype(int)
    chorioamnionitis = (np.random.random(N) < 0.03).astype(int)
    autoimmune_disorder = (np.random.random(N) < 0.03).astype(int)

    # ── DELIVERY ──
    labor_induction = (np.random.random(N) < 0.30).astype(int)
    labor_augmentation_oxytocin = (np.random.random(N) < 0.20).astype(int)
    epidural_anesthesia = (np.random.random(N) < 0.60).astype(int)
    general_anesthesia = (np.random.random(N) < 0.05).astype(int)
    perineal_laceration_degree = np.random.choice(range(5), N, p=[0.40, 0.30, 0.20, 0.08, 0.02])
    estimated_blood_loss_ml = np.clip(np.random.lognormal(6.2, 0.5, N), 100, 5000).astype(int)
    newborn_weight_g = np.clip(np.random.normal(3300, 500, N), 500, 5500).astype(int)
    labor_duration_hours = np.clip(np.random.lognormal(2.2, 0.6, N), 0.5, 48).round(1)

    # ── SOCIAL ──
    smoking_during_pregnancy = (np.random.random(N) < 0.08).astype(int)
    substance_use = (np.random.random(N) < 0.04).astype(int)
    prenatal_visits_count = np.clip(np.random.normal(10, 3, N), 0, 20).astype(int)
    distance_to_hospital_miles = np.clip(np.random.lognormal(2.5, 0.8, N), 0.5, 100).round(1)

    # ── TARGET OUTCOMES ──
    is_cesarean = (mode_of_delivery == "Cesarean").astype(float)
    is_black = (race_ethnicity == "Black").astype(float)

    # PPH (~5% base rate)
    pph_logit = (
        -3.0
        + 1.8 * previous_pph
        + 0.8 * (estimated_blood_loss_ml > 800).astype(float)
        + 0.6 * multiple_gestation
        + 0.5 * placenta_previa
        + 0.7 * placental_abruption
        + 0.4 * uterine_fibroids
        + 0.3 * is_cesarean
        + 0.4 * labor_augmentation_oxytocin
        + 0.3 * (labor_duration_hours > 18).astype(float)
        - 0.3 * (hemoglobin / 12.0)
        + 0.2 * (bmi_pre_pregnancy > 35).astype(float)
        + 0.3 * general_anesthesia
        + 0.2 * (perineal_laceration_degree >= 3).astype(float)
        + np.random.normal(0, 0.3, N)
    )
    pph_outcome = (np.random.random(N) < sigmoid(pph_logit)).astype(int)

    # Preeclampsia (~2% base rate)
    preeclampsia_logit = (
        -4.0
        + 1.5 * previous_preeclampsia
        + 1.0 * chronic_hypertension
        + 0.8 * (systolic_bp > 140).astype(float)
        + 0.6 * (diastolic_bp > 90).astype(float)
        + 0.5 * multiple_gestation
        + 0.4 * pregestational_diabetes
        + 0.3 * (bmi_pre_pregnancy > 30).astype(float)
        + 0.3 * (age > 35).astype(float)
        + 0.4 * (creatinine > 1.1).astype(float)
        + 0.3 * (platelet_count < 150).astype(float)
        + 0.3 * autoimmune_disorder
        + np.random.normal(0, 0.3, N)
    )
    preeclampsia_postpartum = (np.random.random(N) < sigmoid(preeclampsia_logit)).astype(int)

    # Sepsis (~1% base rate)
    sepsis_logit = (
        -4.6
        + 1.2 * chorioamnionitis
        + 0.8 * (temperature > 100.0).astype(float)
        + 0.5 * is_cesarean
        + 0.4 * (white_blood_cell_count > 15).astype(float)
        + 0.3 * (labor_duration_hours > 24).astype(float)
        + 0.4 * (gestational_age_at_delivery < 34).astype(float)
        + 0.3 * (prenatal_visits_count < 4).astype(float)
        + 0.3 * substance_use
        + 0.2 * anemia_during_pregnancy
        + 0.3 * (perineal_laceration_degree >= 3).astype(float)
        + np.random.normal(0, 0.3, N)
    )
    sepsis_outcome = (np.random.random(N) < sigmoid(sepsis_logit)).astype(int)

    # Cardiomyopathy (~0.1% base rate)
    cardiomyopathy_logit = (
        -7.0
        + 1.0 * is_black
        + 0.8 * (age > 35).astype(float)
        + 0.6 * chronic_hypertension
        + 0.5 * multiple_gestation
        + 0.5 * pregestational_diabetes
        + 0.4 * (bmi_pre_pregnancy > 35).astype(float)
        + 0.3 * previous_preeclampsia
        + 0.3 * anemia_during_pregnancy
        + 0.2 * smoking_during_pregnancy
        + np.random.normal(0, 0.3, N)
    )
    cardiomyopathy_outcome = (np.random.random(N) < sigmoid(cardiomyopathy_logit)).astype(int)

    # PPD (~15% base rate)
    ppd_logit = (
        -1.7
        + 0.4 * (age < 20).astype(float)
        + 0.3 * (insurance_type == "Uninsured").astype(float)
        + 0.3 * (insurance_type == "Medicaid").astype(float)
        + 0.3 * substance_use
        + 0.4 * smoking_during_pregnancy
        + 0.3 * (prenatal_visits_count < 5).astype(float)
        + 0.2 * (distance_to_hospital_miles > 30).astype(float)
        + 0.3 * (gestational_age_at_delivery < 34).astype(float)
        + 0.3 * is_cesarean
        + 0.2 * (parity == 0).astype(float)
        + 0.2 * multiple_gestation
        + np.random.normal(0, 0.4, N)
    )
    ppd_outcome = (np.random.random(N) < sigmoid(ppd_logit)).astype(int)

    df = pd.DataFrame({
        # Demographics
        "age": age,
        "race_ethnicity": race_ethnicity,
        "insurance_type": insurance_type,
        "bmi_pre_pregnancy": bmi_pre_pregnancy,
        # Obstetric
        "gravidity": gravidity,
        "parity": parity,
        "previous_cesarean": previous_cesarean,
        "previous_pph": previous_pph,
        "previous_preeclampsia": previous_preeclampsia,
        "gestational_age_at_delivery": gestational_age_at_delivery,
        "multiple_gestation": multiple_gestation,
        "mode_of_delivery": mode_of_delivery,
        # Vitals
        "systolic_bp": systolic_bp,
        "diastolic_bp": diastolic_bp,
        "heart_rate": heart_rate,
        "temperature": temperature,
        "respiratory_rate": respiratory_rate,
        # Labs
        "hemoglobin": hemoglobin,
        "platelet_count": platelet_count,
        "white_blood_cell_count": white_blood_cell_count,
        "creatinine": creatinine,
        "ast_level": ast_level,
        "alt_level": alt_level,
        "blood_glucose": blood_glucose,
        # Medical history
        "chronic_hypertension": chronic_hypertension,
        "pregestational_diabetes": pregestational_diabetes,
        "gestational_diabetes": gestational_diabetes,
        "anemia_during_pregnancy": anemia_during_pregnancy,
        "uterine_fibroids": uterine_fibroids,
        "placenta_previa": placenta_previa,
        "placental_abruption": placental_abruption,
        "chorioamnionitis": chorioamnionitis,
        "autoimmune_disorder": autoimmune_disorder,
        # Delivery
        "labor_induction": labor_induction,
        "labor_augmentation_oxytocin": labor_augmentation_oxytocin,
        "epidural_anesthesia": epidural_anesthesia,
        "general_anesthesia": general_anesthesia,
        "perineal_laceration_degree": perineal_laceration_degree,
        "estimated_blood_loss_ml": estimated_blood_loss_ml,
        "newborn_weight_g": newborn_weight_g,
        "labor_duration_hours": labor_duration_hours,
        # Social
        "smoking_during_pregnancy": smoking_during_pregnancy,
        "substance_use": substance_use,
        "prenatal_visits_count": prenatal_visits_count,
        "distance_to_hospital_miles": distance_to_hospital_miles,
        # Targets
        "pph_outcome": pph_outcome,
        "preeclampsia_postpartum": preeclampsia_postpartum,
        "sepsis_outcome": sepsis_outcome,
        "cardiomyopathy_outcome": cardiomyopathy_outcome,
        "ppd_outcome": ppd_outcome,
    })

    out_dir = os.path.join(os.path.dirname(__file__), "saved_models")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "synthetic_patients.csv")
    df.to_csv(out_path, index=False)

    print(f"✓ Generated {len(df)} records → {out_path}")
    print(f"\nOutcome prevalence:")
    for col in ["pph_outcome", "preeclampsia_postpartum", "sepsis_outcome",
                 "cardiomyopathy_outcome", "ppd_outcome"]:
        print(f"  {col}: {df[col].mean():.2%}")

    return df


if __name__ == "__main__":
    generate_data()
