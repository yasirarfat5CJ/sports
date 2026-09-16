import React from 'react';
import { 
  ShieldAlert, UserCheck, BarChart3, HelpCircle, GraduationCap, 
  HelpCircle as QuestionIcon, ArrowRight, BrainCircuit, Lightbulb, FileText
} from 'lucide-react';

export const About = () => {
  const workflow = [
    { title: 'Academic Input', desc: 'Capture 6 performance indicators' },
    { title: 'FastAPI REST Endpoint', desc: 'Transport payload securely' },
    { title: 'Gradient Boosting Model', desc: 'Predict marks & assess risks' },
    { title: 'SHAP Contributions', desc: 'Calculate feature impacts' },
    { title: 'Intervention Engine', desc: 'Generate actionable guidelines' }
  ];

  return (
    <div className="space-y-10 py-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-500 border border-blue-500/20 mb-2">
          <BrainCircuit className="h-6 w-6" />
        </div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          EduPredict AI Framework
        </h1>
        <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
          An explainable AI intelligence dashboard designed for predicting exam performance and driving early mentoring interventions.
        </p>
      </div>

      {/* Presentation: 5 Keys (Problem, Input, Prediction, Explanation, Action) */}
      <section className="space-y-6">
        <h2 className="font-display text-xl font-bold text-white tracking-tight border-b border-slate-800 pb-3">
          Hackathon Presentation Pillars
        </h2>

        <div className="space-y-6">
          {/* Pillar 1: Problem */}
          <div className="glass-panel rounded-2xl p-6 flex gap-4 items-start">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-display text-base font-bold text-white">1. The Problem</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Student academic failure or drop-off is frequently identified too late—often only after final semester examinations are graded. Faculty members lack automated, real-time analytics to inspect student progress mid-semester, making early course corrections and proactive tutoring difficult to coordinate.
              </p>
            </div>
          </div>

          {/* Pillar 2: Input */}
          <div className="glass-panel rounded-2xl p-6 flex gap-4 items-start">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <FileText className="h-5 w-5" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-display text-base font-bold text-white">2. The Inputs</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                EduPredict AI takes six academic and engagement factors that represent a student's standing:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { name: 'Attendance %', range: '0–100 %' },
                  { name: 'Study Hours/Wk', range: '>= 0 hours' },
                  { name: 'Assignment Score', range: '0–100 %' },
                  { name: 'Internal Marks', range: '0–100 %' },
                  { name: 'Previous CGPA', range: '0–10.0 scale' },
                  { name: 'Academic Activity', range: '0–100 index' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-900/50 border border-slate-800/40 rounded-lg p-2.5">
                    <span className="text-[11px] font-bold text-slate-300 block">{item.name}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Range: {item.range}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pillar 3: Prediction */}
          <div className="glass-panel rounded-2xl p-6 flex gap-4 items-start">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-display text-base font-bold text-white">3. The Prediction</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                The frontend communicates directly with our FastAPI endpoint which feeds features into a pre-trained <span className="font-semibold text-slate-300">Gradient Boosting Regressor</span>. The model projects the student's expected final exam marks (formatted to 2 decimal places) and flags their risk tier (Low, Moderate, High) instantly.
              </p>
            </div>
          </div>

          {/* Pillar 4: Explanation */}
          <div className="glass-panel rounded-2xl p-6 flex gap-4 items-start">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-display text-base font-bold text-white">4. The Explanation (Explainable AI)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Instead of operating as a "black box," the system leverages <span className="font-semibold text-slate-300">SHAP (SHapley Additive exPlanations)</span> contributions computed by the backend. It plots exactly which features drove the prediction higher (positive impact) or pulled it lower (negative impact) to validate model decisions.
              </p>
            </div>
          </div>

          {/* Pillar 5: Action */}
          <div className="glass-panel rounded-2xl p-6 flex gap-4 items-start">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-display text-base font-bold text-white">5. Action (Targeted Interventions)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Predictions trigger personalized, rule-based recommendations returned by the AI Intervention Engine. Whether a student needs to boost study hours, attend office hours, or join peer coaching groups, the system highlights clear corrective steps to improve learning outcomes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* System Flow Diagram */}
      <section className="glass-panel rounded-2xl p-6">
        <h2 className="font-display text-base font-bold text-white mb-4">Pipeline Workflow Schema</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
          {workflow.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4.5 text-center space-y-1">
                <span className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">
                  Step {idx + 1}
                </span>
                <h4 className="text-xs font-bold text-white">{step.title}</h4>
                <p className="text-[10px] text-slate-400 leading-normal">{step.desc}</p>
              </div>
              {idx < workflow.length - 1 && (
                <div className="hidden md:flex justify-center text-slate-700">
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>
    </div>
  );
};
export default About;
