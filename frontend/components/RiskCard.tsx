"use client";

import { ConditionResult, RISK_COLORS } from "@/lib/types";
import { useState } from "react";
import RiskFactors from "./RiskFactors";

interface RiskCardProps {
  result: ConditionResult;
}

export default function RiskCard({ result }: RiskCardProps) {
  const [expanded, setExpanded] = useState(false);
  const pct = Math.round(result.risk_score * 100);
  const color = RISK_COLORS[result.risk_category];

  // SVG circular gauge
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  return (
    <div
      className={`bg-white rounded-2xl shadow-md border-l-4 overflow-hidden transition-all duration-300 ${
        expanded ? "col-span-1 lg:col-span-2" : ""
      }`}
      style={{ borderLeftColor: color }}
    >
      <div
        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-6">
          {/* Circular Gauge */}
          <div className="relative flex-shrink-0">
            <svg width="110" height="110" className="-rotate-90">
              <circle
                cx="55"
                cy="55"
                r={radius}
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="8"
              />
              <circle
                cx="55"
                cy="55"
                r={radius}
                fill="none"
                stroke={color}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold" style={{ color }}>
                {pct}%
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900">
              {result.condition}
            </h3>
            <span
              className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide text-white"
              style={{ backgroundColor: color }}
            >
              {result.risk_category} Risk
            </span>
            <p className="mt-2 text-sm text-gray-500 line-clamp-2">
              {result.clinical_summary}
            </p>
          </div>

          {/* Expand icon */}
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-gray-100 p-6 bg-gray-50 space-y-6">
          {/* SHAP Factors */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
              Top Contributing Factors
            </h4>
            <RiskFactors factors={result.top_factors} />
          </div>

          {/* Recommendations */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Recommended Actions
            </h4>
            <ul className="space-y-2">
              {result.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Clinical Summary */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Clinical Summary
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              {result.clinical_summary}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
