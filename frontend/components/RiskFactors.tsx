"use client";

import { TopFactor } from "@/lib/types";

interface RiskFactorsProps {
  factors: TopFactor[];
}

export default function RiskFactors({ factors }: RiskFactorsProps) {
  if (!factors.length) return null;

  const maxAbsShap = Math.max(...factors.map((f) => Math.abs(f.shap_value)), 0.01);

  return (
    <div className="space-y-4">
      {factors.map((factor, i) => {
        const isRisk = factor.direction === "increases_risk";
        const barColor = isRisk ? "#EF4444" : "#22C55E";
        const barWidth = Math.min((Math.abs(factor.shap_value) / maxAbsShap) * 100, 100);
        const displayVal =
          typeof factor.value === "boolean"
            ? factor.value
              ? "Yes"
              : "No"
            : factor.value === 1 && (factor.feature_key?.includes("_") || factor.feature_key?.includes("previous"))
            ? "Yes"
            : factor.value === 0 && (factor.feature_key?.includes("_") || factor.feature_key?.includes("previous"))
            ? "No"
            : factor.value;

        return (
          <div key={i} className="group">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block w-2 h-2 rounded-full`}
                  style={{ backgroundColor: barColor }}
                />
                <span className="text-sm font-medium text-gray-800">
                  {factor.feature}
                </span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  {displayVal}
                </span>
              </div>
              <span className="text-xs font-mono text-gray-400">
                {factor.shap_value > 0 ? "+" : ""}
                {factor.shap_value.toFixed(3)}
              </span>
            </div>

            {/* Horizontal bar */}
            <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="absolute top-0 h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  backgroundColor: barColor,
                  width: `${barWidth}%`,
                  left: isRisk ? "0%" : undefined,
                  right: isRisk ? undefined : "0%",
                }}
              />
            </div>

            {/* Explanation */}
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              {factor.explanation}
            </p>
          </div>
        );
      })}
    </div>
  );
}
