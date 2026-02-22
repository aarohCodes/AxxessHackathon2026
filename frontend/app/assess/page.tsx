"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PatientForm from "@/components/PatientForm";
import { predictRisk } from "@/lib/api";
import { PatientData } from "@/lib/types";

export default function AssessPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: PatientData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await predictRisk(data);
      // Store results in sessionStorage for the results page
      sessionStorage.setItem("maternalguard_results", JSON.stringify(result));
      sessionStorage.setItem("maternalguard_patient", JSON.stringify(data));
      router.push("/results");
    } catch (err: any) {
      setError(
        err.message?.includes("fetch")
          ? "Cannot connect to the backend. Make sure the FastAPI server is running on port 8000."
          : err.message || "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Patient Risk Assessment
          </h1>
          <p className="mt-2 text-gray-500">
            Enter patient data below to generate postpartum risk predictions.
            Use the sample buttons for a quick demo.
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <PatientForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
}
