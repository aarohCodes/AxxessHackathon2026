"use client";

import { PatientData, HIGH_RISK_SAMPLE, LOW_RISK_SAMPLE } from "@/lib/types";
import { useState } from "react";

interface PatientFormProps {
  onSubmit: (data: PatientData) => void;
  isLoading: boolean;
}

const DEFAULT_PATIENT: PatientData = {
  age: 28,
  race_ethnicity: "White",
  insurance_type: "Private",
  bmi_pre_pregnancy: 25.0,
  gravidity: 1,
  parity: 0,
  previous_cesarean: 0,
  previous_pph: 0,
  previous_preeclampsia: 0,
  gestational_age_at_delivery: 39,
  multiple_gestation: 0,
  mode_of_delivery: "Vaginal",
  systolic_bp: 120,
  diastolic_bp: 75,
  heart_rate: 80,
  temperature: 98.6,
  respiratory_rate: 18,
  hemoglobin: 12.0,
  platelet_count: 250,
  white_blood_cell_count: 10.0,
  creatinine: 0.8,
  ast_level: 25,
  alt_level: 22,
  blood_glucose: 100,
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
  epidural_anesthesia: 0,
  general_anesthesia: 0,
  perineal_laceration_degree: 0,
  estimated_blood_loss_ml: 350,
  newborn_weight_g: 3300,
  labor_duration_hours: 10.0,
  smoking_during_pregnancy: 0,
  substance_use: 0,
  prenatal_visits_count: 10,
  distance_to_hospital_miles: 12.0,
};

export default function PatientForm({ onSubmit, isLoading }: PatientFormProps) {
  const [data, setData] = useState<PatientData>(DEFAULT_PATIENT);

  const set = (field: keyof PatientData, value: any) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Sample Patient Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setData(HIGH_RISK_SAMPLE)}
          className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
        >
          ⚡ Load High-Risk Sample
        </button>
        <button
          type="button"
          onClick={() => setData(LOW_RISK_SAMPLE)}
          className="px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
        >
          ✓ Load Low-Risk Sample
        </button>
        <button
          type="button"
          onClick={() => setData(DEFAULT_PATIENT)}
          className="px-4 py-2 bg-gray-50 text-gray-600 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
        >
          ↺ Reset Form
        </button>
      </div>

      {/* ── Demographics ── */}
      <Section title="Demographics">
        <NumberInput label="Age" value={data.age} onChange={(v) => set("age", v)} min={15} max={50} placeholder="15-50" />
        <SelectInput label="Race/Ethnicity" value={data.race_ethnicity} onChange={(v) => set("race_ethnicity", v)} options={["White", "Black", "Hispanic", "Asian", "Native American", "Other"]} />
        <SelectInput label="Insurance Type" value={data.insurance_type} onChange={(v) => set("insurance_type", v)} options={["Private", "Medicaid", "Medicare", "Uninsured"]} />
        <NumberInput label="Pre-pregnancy BMI" value={data.bmi_pre_pregnancy} onChange={(v) => set("bmi_pre_pregnancy", v)} min={16} max={55} step={0.1} placeholder="16.0 - 55.0" />
      </Section>

      {/* ── Obstetric History ── */}
      <Section title="Obstetric History">
        <NumberInput label="Gravidity (# pregnancies)" value={data.gravidity} onChange={(v) => set("gravidity", v)} min={1} max={15} />
        <NumberInput label="Parity (# prior births)" value={data.parity} onChange={(v) => set("parity", v)} min={0} max={15} />
        <SelectInput label="Mode of Delivery" value={data.mode_of_delivery} onChange={(v) => set("mode_of_delivery", v)} options={["Vaginal", "Cesarean", "Assisted Vaginal"]} />
        <NumberInput label="Gestational Age (weeks)" value={data.gestational_age_at_delivery} onChange={(v) => set("gestational_age_at_delivery", v)} min={24} max={42} placeholder="24-42 weeks" />
        <ToggleInput label="Previous Cesarean" checked={data.previous_cesarean === 1} onChange={(v) => set("previous_cesarean", v ? 1 : 0)} />
        <ToggleInput label="Previous PPH" checked={data.previous_pph === 1} onChange={(v) => set("previous_pph", v ? 1 : 0)} />
        <ToggleInput label="Previous Preeclampsia" checked={data.previous_preeclampsia === 1} onChange={(v) => set("previous_preeclampsia", v ? 1 : 0)} />
        <ToggleInput label="Multiple Gestation (Twins+)" checked={data.multiple_gestation === 1} onChange={(v) => set("multiple_gestation", v ? 1 : 0)} />
      </Section>

      {/* ── Vitals ── */}
      <Section title="Vitals">
        <NumberInput label="Systolic BP (mmHg)" value={data.systolic_bp} onChange={(v) => set("systolic_bp", v)} min={85} max={200} placeholder="Normal: 120" />
        <NumberInput label="Diastolic BP (mmHg)" value={data.diastolic_bp} onChange={(v) => set("diastolic_bp", v)} min={50} max={130} placeholder="Normal: 80" />
        <NumberInput label="Heart Rate (bpm)" value={data.heart_rate} onChange={(v) => set("heart_rate", v)} min={50} max={150} placeholder="Normal: 60-100" />
        <NumberInput label="Temperature (°F)" value={data.temperature} onChange={(v) => set("temperature", v)} min={96} max={104} step={0.1} placeholder="Normal: 98.6" />
        <NumberInput label="Respiratory Rate (/min)" value={data.respiratory_rate} onChange={(v) => set("respiratory_rate", v)} min={10} max={35} placeholder="Normal: 12-20" />
      </Section>

      {/* ── Lab Values ── */}
      <Section title="Lab Values">
        <NumberInput label="Hemoglobin (g/dL)" value={data.hemoglobin} onChange={(v) => set("hemoglobin", v)} min={5} max={17} step={0.1} placeholder="Normal: 12-16" />
        <NumberInput label="Platelet Count (×10³/µL)" value={data.platelet_count} onChange={(v) => set("platelet_count", v)} min={50} max={500} placeholder="Normal: 150-400" />
        <NumberInput label="WBC Count (×10³/µL)" value={data.white_blood_cell_count} onChange={(v) => set("white_blood_cell_count", v)} min={3} max={30} step={0.1} placeholder="Normal: 4.5-11" />
        <NumberInput label="Creatinine (mg/dL)" value={data.creatinine} onChange={(v) => set("creatinine", v)} min={0.3} max={3.0} step={0.01} placeholder="Normal: 0.6-1.1" />
        <NumberInput label="AST Level (U/L)" value={data.ast_level} onChange={(v) => set("ast_level", v)} min={8} max={200} placeholder="Normal: 10-40" />
        <NumberInput label="ALT Level (U/L)" value={data.alt_level} onChange={(v) => set("alt_level", v)} min={5} max={200} placeholder="Normal: 7-56" />
        <NumberInput label="Blood Glucose (mg/dL)" value={data.blood_glucose} onChange={(v) => set("blood_glucose", v)} min={50} max={300} placeholder="Normal: 70-100" />
      </Section>

      {/* ── Medical History ── */}
      <Section title="Medical History">
        <ToggleInput label="Chronic Hypertension" checked={data.chronic_hypertension === 1} onChange={(v) => set("chronic_hypertension", v ? 1 : 0)} />
        <ToggleInput label="Pre-gestational Diabetes" checked={data.pregestational_diabetes === 1} onChange={(v) => set("pregestational_diabetes", v ? 1 : 0)} />
        <ToggleInput label="Gestational Diabetes" checked={data.gestational_diabetes === 1} onChange={(v) => set("gestational_diabetes", v ? 1 : 0)} />
        <ToggleInput label="Anemia During Pregnancy" checked={data.anemia_during_pregnancy === 1} onChange={(v) => set("anemia_during_pregnancy", v ? 1 : 0)} />
        <ToggleInput label="Uterine Fibroids" checked={data.uterine_fibroids === 1} onChange={(v) => set("uterine_fibroids", v ? 1 : 0)} />
        <ToggleInput label="Placenta Previa" checked={data.placenta_previa === 1} onChange={(v) => set("placenta_previa", v ? 1 : 0)} />
        <ToggleInput label="Placental Abruption" checked={data.placental_abruption === 1} onChange={(v) => set("placental_abruption", v ? 1 : 0)} />
        <ToggleInput label="Chorioamnionitis" checked={data.chorioamnionitis === 1} onChange={(v) => set("chorioamnionitis", v ? 1 : 0)} />
        <ToggleInput label="Autoimmune Disorder" checked={data.autoimmune_disorder === 1} onChange={(v) => set("autoimmune_disorder", v ? 1 : 0)} />
      </Section>

      {/* ── Delivery Factors ── */}
      <Section title="Delivery Factors">
        <ToggleInput label="Labor Induction" checked={data.labor_induction === 1} onChange={(v) => set("labor_induction", v ? 1 : 0)} />
        <ToggleInput label="Oxytocin Augmentation" checked={data.labor_augmentation_oxytocin === 1} onChange={(v) => set("labor_augmentation_oxytocin", v ? 1 : 0)} />
        <ToggleInput label="Epidural Anesthesia" checked={data.epidural_anesthesia === 1} onChange={(v) => set("epidural_anesthesia", v ? 1 : 0)} />
        <ToggleInput label="General Anesthesia" checked={data.general_anesthesia === 1} onChange={(v) => set("general_anesthesia", v ? 1 : 0)} />
        <SelectInput label="Perineal Laceration Degree" value={String(data.perineal_laceration_degree)} onChange={(v) => set("perineal_laceration_degree", parseInt(v))} options={["0", "1", "2", "3", "4"]} />
        <NumberInput label="Est. Blood Loss (mL)" value={data.estimated_blood_loss_ml} onChange={(v) => set("estimated_blood_loss_ml", v)} min={100} max={5000} placeholder="Normal: 300-500" />
        <NumberInput label="Newborn Weight (g)" value={data.newborn_weight_g} onChange={(v) => set("newborn_weight_g", v)} min={500} max={5500} placeholder="Normal: 2500-4000" />
        <NumberInput label="Labor Duration (hours)" value={data.labor_duration_hours} onChange={(v) => set("labor_duration_hours", v)} min={0.5} max={48} step={0.5} placeholder="Normal: 6-12" />
      </Section>

      {/* ── Social Factors ── */}
      <Section title="Social Factors">
        <ToggleInput label="Smoking During Pregnancy" checked={data.smoking_during_pregnancy === 1} onChange={(v) => set("smoking_during_pregnancy", v ? 1 : 0)} />
        <ToggleInput label="Substance Use" checked={data.substance_use === 1} onChange={(v) => set("substance_use", v ? 1 : 0)} />
        <NumberInput label="Prenatal Visits Count" value={data.prenatal_visits_count} onChange={(v) => set("prenatal_visits_count", v)} min={0} max={20} placeholder="Recommended: 10-14" />
        <NumberInput label="Distance to Hospital (miles)" value={data.distance_to_hospital_miles} onChange={(v) => set("distance_to_hospital_miles", v)} min={0.5} max={100} step={0.5} />
      </Section>

      {/* Submit */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-teal-600 text-white text-lg font-semibold rounded-xl hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-3"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Analyzing...
            </>
          ) : (
            <>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Run Risk Assessment
            </>
          )}
        </button>
      </div>
    </form>
  );
}

// ─── Reusable form components ───

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border border-gray-200 rounded-xl p-6 bg-white">
      <legend className="text-sm font-semibold text-teal-700 uppercase tracking-wide px-2">
        {title}
      </legend>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">{children}</div>
    </fieldset>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  placeholder,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors"
      />
    </div>
  );
}

function SelectInput({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors bg-white"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function ToggleInput({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-gray-700">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? "bg-teal-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
