import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-white to-orange-50" />
        <div className="relative max-w-6xl mx-auto px-4 py-24 sm:py-32 text-center">
          <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
            AI-Powered Clinical Decision Support
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold text-gray-900 tracking-tight">
            Maternal<span className="text-teal-600">Guard</span>
          </h1>
          <p className="mt-4 text-xl sm:text-2xl text-gray-600 font-light">
            AI-Powered Postpartum Risk Prediction
          </p>

          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-500 leading-relaxed">
            <strong className="text-gray-700">80% of maternal deaths are preventable.</strong>{" "}
            Zero ML models have been clinically deployed for postpartum prediction.{" "}
            <span className="text-teal-600 font-semibold">We&apos;re changing that.</span>
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/assess"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-teal-600 text-white text-lg font-semibold rounded-xl hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/25 hover:shadow-xl hover:shadow-teal-600/30 hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Start Assessment
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-4 -mt-8 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard value="80%" label="Preventable" desc="Of maternal deaths could be avoided with timely intervention" color="text-red-500" />
          <StatCard value="0" label="Deployed Models" desc="No ML models are currently deployed for postpartum risk prediction" color="text-orange-500" />
          <StatCard value="5" label="Conditions" desc="Simultaneous risk prediction across major postpartum complications" color="text-teal-600" />
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
            Three simple steps to generate actionable, explainable risk predictions
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              step={1}
              icon={
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              }
              title="Input Patient Data"
              desc="Enter demographics, vitals, labs, and obstetric history using our streamlined clinical form."
            />
            <StepCard
              step={2}
              icon={
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
              title="ML Analysis"
              desc="Five specialized XGBoost models analyze the data with SHAP-based explainability."
            />
            <StepCard
              step={3}
              icon={
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              title="Actionable Results"
              desc="Get risk scores, top contributing factors, and clinical recommendations for each condition."
            />
          </div>
        </div>
      </section>

      {/* Conditions */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          5 Conditions Predicted
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: "Postpartum Hemorrhage", icon: "🩸", desc: "Excessive bleeding after delivery" },
            { name: "Postpartum Preeclampsia", icon: "💓", desc: "Hypertensive disorder after delivery" },
            { name: "Postpartum Sepsis", icon: "🦠", desc: "Severe maternal infection" },
            { name: "Peripartum Cardiomyopathy", icon: "❤️", desc: "Heart failure during/after pregnancy" },
            { name: "Postpartum Depression", icon: "🧠", desc: "Mood disorder affecting new mothers" },
          ].map((c) => (
            <div key={c.name} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
              <span className="text-2xl">{c.icon}</span>
              <h3 className="font-semibold text-gray-900 mt-2">{c.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-sm">
            ⚠️ <strong className="text-gray-300">Research Prototype</strong> — Trained on synthetic data. Not for clinical use.
          </p>
          <p className="text-xs mt-2">
            MaternalGuard © 2026 — Built for Axxess Hackathon
          </p>
        </div>
      </footer>
    </main>
  );
}

function StatCard({ value, label, desc, color }: { value: string; label: string; desc: string; color: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 text-center border border-gray-100">
      <div className={`text-4xl font-extrabold ${color}`}>{value}</div>
      <div className="text-sm font-semibold text-gray-700 mt-1 uppercase tracking-wide">{label}</div>
      <p className="text-xs text-gray-500 mt-2">{desc}</p>
    </div>
  );
}

function StepCard({ step, icon, title, desc }: { step: number; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 mb-4">
        {icon}
      </div>
      <div className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-1">Step {step}</div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500 mt-2">{desc}</p>
    </div>
  );
}
