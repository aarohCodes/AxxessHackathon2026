// MaternalGuard API client

import { PatientData, PredictionResponse } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function predictRisk(
  patientData: PatientData
): Promise<PredictionResponse> {
  const response = await fetch(`${API_URL}/api/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patientData),
  });

  if (!response.ok) {
    throw new Error(`Prediction failed: ${response.statusText}`);
  }

  return response.json();
}

export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/api/health`);
    const data = await response.json();
    return data.status === "ok";
  } catch {
    return false;
  }
}
