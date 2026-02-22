// MaternalGuard TypeScript Types

export interface TopFactor {
  feature: string;
  feature_key: string;
  value: any;
  direction: "increases_risk" | "decreases_risk";
  impact: "high" | "moderate" | "low";
  shap_value: number;
  explanation: string;
  condition?: string;
}

export interface ConditionResult {
  condition: string;
  condition_key: string;
  risk_score: number;
  risk_category: "low" | "moderate" | "high" | "critical";
  top_factors: TopFactor[];
  recommendations: string[];
  clinical_summary: string;
}

export interface PredictionResponse {
  overall_risk_score: number;
  overall_risk_category: "low" | "moderate" | "high" | "critical";
  conditions: ConditionResult[];
  global_top_factors: TopFactor[];
}

export interface PatientData {
  // Demographics
  age: number;
  race_ethnicity: string;
  insurance_type: string;
  bmi_pre_pregnancy: number;
  // Obstetric
  gravidity: number;
  parity: number;
  previous_cesarean: number;
  previous_pph: number;
  previous_preeclampsia: number;
  gestational_age_at_delivery: number;
  multiple_gestation: number;
  mode_of_delivery: string;
  // Vitals
  systolic_bp: number;
  diastolic_bp: number;
  heart_rate: number;
  temperature: number;
  respiratory_rate: number;
  // Labs
  hemoglobin: number;
  platelet_count: number;
  white_blood_cell_count: number;
  creatinine: number;
  ast_level: number;
  alt_level: number;
  blood_glucose: number;
  // Medical History
  chronic_hypertension: number;
  pregestational_diabetes: number;
  gestational_diabetes: number;
  anemia_during_pregnancy: number;
  uterine_fibroids: number;
  placenta_previa: number;
  placental_abruption: number;
  chorioamnionitis: number;
  autoimmune_disorder: number;
  // Delivery
  labor_induction: number;
  labor_augmentation_oxytocin: number;
  epidural_anesthesia: number;
  general_anesthesia: number;
  perineal_laceration_degree: number;
  estimated_blood_loss_ml: number;
  newborn_weight_g: number;
  labor_duration_hours: number;
  // Social
  smoking_during_pregnancy: number;
  substance_use: number;
  prenatal_visits_count: number;
  distance_to_hospital_miles: number;
}

export const RISK_COLORS = {
  low: "#22C55E",
  moderate: "#F59E0B",
  high: "#F97316",
  critical: "#EF4444",
} as const;

export const HIGH_RISK_SAMPLE: PatientData = {
  age: 38,
  race_ethnicity: "Black",
  insurance_type: "Medicaid",
  bmi_pre_pregnancy: 39.2,
  gravidity: 5,
  parity: 4,
  previous_cesarean: 1,
  previous_pph: 1,
  previous_preeclampsia: 1,
  gestational_age_at_delivery: 34,
  multiple_gestation: 1,
  mode_of_delivery: "Cesarean",
  systolic_bp: 162,
  diastolic_bp: 102,
  heart_rate: 112,
  temperature: 100.8,
  respiratory_rate: 24,
  hemoglobin: 8.5,
  platelet_count: 118,
  white_blood_cell_count: 18.5,
  creatinine: 1.4,
  ast_level: 72,
  alt_level: 65,
  blood_glucose: 185,
  chronic_hypertension: 1,
  pregestational_diabetes: 1,
  gestational_diabetes: 0,
  anemia_during_pregnancy: 1,
  uterine_fibroids: 1,
  placenta_previa: 1,
  placental_abruption: 0,
  chorioamnionitis: 1,
  autoimmune_disorder: 0,
  labor_induction: 1,
  labor_augmentation_oxytocin: 1,
  epidural_anesthesia: 0,
  general_anesthesia: 1,
  perineal_laceration_degree: 3,
  estimated_blood_loss_ml: 1800,
  newborn_weight_g: 4500,
  labor_duration_hours: 28.0,
  smoking_during_pregnancy: 1,
  substance_use: 1,
  prenatal_visits_count: 3,
  distance_to_hospital_miles: 45.0,
};

export const LOW_RISK_SAMPLE: PatientData = {
  age: 28,
  race_ethnicity: "White",
  insurance_type: "Private",
  bmi_pre_pregnancy: 23.5,
  gravidity: 2,
  parity: 1,
  previous_cesarean: 0,
  previous_pph: 0,
  previous_preeclampsia: 0,
  gestational_age_at_delivery: 39,
  multiple_gestation: 0,
  mode_of_delivery: "Vaginal",
  systolic_bp: 118,
  diastolic_bp: 72,
  heart_rate: 78,
  temperature: 98.4,
  respiratory_rate: 16,
  hemoglobin: 13.2,
  platelet_count: 265,
  white_blood_cell_count: 9.0,
  creatinine: 0.7,
  ast_level: 20,
  alt_level: 18,
  blood_glucose: 92,
  chronic_hypertension: 0,
  pregestational_diabetes: 0,
  gestational_diabetes: 0,
  anemia_during_pregnancy: 0,
  uterine_fibroids: 0,
  placenta_previa: 0,
  placental_abruption: 0,
  chorioamnionitis: 0,
  autoimmune_disorder: 0,
  labor_induction: 0,
  labor_augmentation_oxytocin: 0,
  epidural_anesthesia: 1,
  general_anesthesia: 0,
  perineal_laceration_degree: 1,
  estimated_blood_loss_ml: 300,
  newborn_weight_g: 3200,
  labor_duration_hours: 8.5,
  smoking_during_pregnancy: 0,
  substance_use: 0,
  prenatal_visits_count: 12,
  distance_to_hospital_miles: 8.0,
};
