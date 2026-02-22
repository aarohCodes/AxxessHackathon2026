"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PredictionResponse, RISK_COLORS, TopFactor } from "@/lib/types";
import RiskCard from "@/components/RiskCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";

export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<PredictionResponse | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("maternalguard_results");
    if (!stored) {
      router.push("/assess");
      return;
    }
    setResults(JSON.parse(stored));
  }, [router]);

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-teal-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const overallColor = RISK_COLORS[results.overall_risk_category];
  const overallPct = Math.round(results.overall_risk_score * 100);

  // Build data for global bar chart
  const globalChartData = results.global_top_factors.map((f: TopFactor) => ({
    name: f.feature,
    value: f.shap_value,
    condition: f.condition,
    absValue: Math.abs(f.shap_value),
    isRisk: f.direction === "increases_risk",
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Disclaimer Banner */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 py-2.5 text-center">
          <p className="text-sm text-amber-800">
            ⚠️ <strong>Research Prototype</strong> — Trained on synthetic data. Not for clinical use.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Overall Risk Banner */}
        <div
          className="rounded-2xl p-8 mb-8 text-white relative overflow-hidden"
          style={{ backgroundColor: overallColor }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-white/80 text-sm font-medium uppercase tracking-wider">
                Overall Postpartum Risk Assessment
              </p>
              <h1 className="text-4xl font-extrabold mt-1">
                {results.overall_risk_category.toUpperCase()} RISK
              </h1>
              <p className="text-white/80 mt-2 text-sm max-w-lg">
                Based on analysis of {results.conditions.length} postpartum conditions using machine learning with SHAP-based explainability.
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="relative">
                <svg width="130" height="130" className="-rotate-90">
                  <circle cx="65" cy="65" r="55" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="10" />
                  <circle
                    cx="65"
                    cy="65"
                    r="55"
                    fill="none"
                    stroke="white"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 55}
                    strokeDashoffset={2 * Math.PI * 55 * (1 - overallPct / 100)}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-extrabold text-white">{overallPct}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Link
            href="/assess"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Assessment
          </Link>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Report
          </button>
        </div>

        {/* Risk Score Cards — 5 conditions */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Individual Condition Risks
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-12">
          {results.conditions
            .sort((a, b) => b.risk_score - a.risk_score)
            .map((condition) => (
              <RiskCard key={condition.condition_key} result={condition} />
            ))}
        </div>

        {/* Global Risk Factor Chart — THE WOW SLIDE */}
        <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            Global Risk Factor Analysis
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Top 10 most impactful features across all conditions (SHAP values).
            Red = increases risk. Green = protective.
          </p>

          <div className="h-[420px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={globalChartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 180, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={170}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value: any) => [
                    Number(value).toFixed(4),
                    "SHAP Value",
                  ]}
                  labelFormatter={(label: any) => {
                    const item = globalChartData.find((d: any) => d.name === String(label));
                    return `${label} (${item?.condition || ""})`;
                  }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    fontSize: "13px",
                  }}
                />
                <ReferenceLine x={0} stroke="#9ca3af" />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {globalChartData.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.isRisk ? "#EF4444" : "#22C55E"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Table */}
        <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Risk Summary
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Condition</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Risk Score</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Risk Level</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Top Factor</th>
                </tr>
              </thead>
              <tbody>
                {results.conditions.map((c) => (
                  <tr key={c.condition_key} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{c.condition}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-mono font-bold" style={{ color: RISK_COLORS[c.risk_category] }}>
                        {Math.round(c.risk_score * 100)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold text-white"
                        style={{ backgroundColor: RISK_COLORS[c.risk_category] }}
                      >
                        {c.risk_category.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {c.top_factors[0]?.feature || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer disclaimer */}
        <div className="text-center py-6">
          <p className="text-xs text-gray-400">
            MaternalGuard Research Prototype — Results generated from synthetic data models.
            Not validated for clinical decision-making.
          </p>
        </div>
      </div>
    </div>
  );
}
