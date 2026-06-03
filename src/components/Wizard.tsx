import React, { useState } from "react";
import { Sparkles, HelpCircle } from "lucide-react";
import { Decision } from "../types";

interface WizardProps {
  onSubmit: (decisionData: {
    question: string;
    context: string;
    options?: string[];
    importance: number;
  }) => void;
  isPending: boolean;
}

const PRESETS = [
  {
    question: "Should I buy an Electric Vehicle or a Hybrid?",
    context: "I commute 40 miles roundtrip daily in Seattle. My apartment complex has free slow-charging level-1 ports, but fast chargers are a 10-minute drive away. Looking at a 5-year total cost of ownership and convenience.",
    options: ["All-Electric SUV", "Plug-in Hybrid Hatchback"],
    importance: 4,
  },
  {
    question: "Should I accept a senior Dev job in Seattle or stay remote at my current startup?",
    context: "The Seattle job pays 25% higher base salary + bonuses, but requires relocating from sunny Colorado and working hybrid 3 days/week. Current startup has dynamic growth, full remote freedom, but less job security and lower cash pay.",
    options: ["Accept Seattle Offer & Relocate", "Stay Remote at Current Startup"],
    importance: 5,
  },
  {
    question: "Should I focus my summer on learning Rust or Python for AI?",
    context: "I have 2 years of JavaScript experience. I want to build backend services and dip my toes into local LLMs. Want to choose the language that yields maximum career edge over the next 24 months.",
    options: ["Master Rust & Systems Programming", "Master Python, PyTorch & LLM tooling"],
    importance: 3,
  },
];

export default function Wizard({ onSubmit, isPending }: WizardProps) {
  const [question, setQuestion] = useState("");
  const [context, setContext] = useState("");
  const [options, setOptions] = useState<string[] | undefined>(undefined);
  const [importance, setImportance] = useState(3);

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setQuestion(preset.question);
    setContext(preset.context);
    setOptions([...preset.options]);
    setImportance(preset.importance);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    onSubmit({
      question: question.trim(),
      context: context.trim(),
      options: options,
      importance,
    });
  };

  return (
    <div id="decision-wizard" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
      {/* Visual background gradient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <h2 id="wizard-heading" className="text-2xl font-bold font-display text-white mb-2 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
        Prepare Your Tiebreaker
      </h2>
      <p className="text-slate-400 text-sm mb-6">
        Specify your main dilemma, customize details, and unleash Gemini AI to automatically extract comparison options and generate strategic bento-grid decision assessments.
      </p>

      {/* Preset Pills */}
      <div className="mb-8 bg-slate-950/40 p-4 border border-slate-850 rounded-2xl">
        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] block mb-3">Try a strategic scenario:</span>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p, index) => (
            <button
              key={index}
              type="button"
              onClick={() => applyPreset(p)}
              className="text-[11px] font-mono px-3.5 py-2 rounded-full border border-slate-800 bg-slate-950/80 text-slate-300 hover:text-white hover:border-indigo-500/50 transition duration-150 text-left line-clamp-1 max-w-full cursor-pointer"
            >
              {p.question}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Question */}
        <div>
          <label className="block text-slate-300 text-sm font-semibold mb-2 flex items-center justify-between">
            <span>What decision are you facing? <span className="text-indigo-400">*</span></span>
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Required field</span>
          </label>
          <input
            type="text"
            required
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
              // Clear options when the user types a custom question to force Gemini dynamic extraction
              setOptions(undefined);
            }}
            placeholder="Should I buy a cargo e-bike or a second compact car?"
            className="w-full bg-slate-950 border border-slate-850 rounded-2xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 hover:border-slate-75o transition text-sm font-semibold"
          />
        </div>

        {/* Supporting Context */}
        <div>
          <label className="block text-slate-300 text-sm font-semibold mb-2 flex items-center justify-between">
            <span>Provide details or context (highly recommended)</span>
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">AI parameters</span>
          </label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            rows={4}
            placeholder="Describe your budget, long-term goals, feelings, worries, and any specific constraints that make this choice difficult..."
            className="w-full bg-slate-950 border border-slate-850 rounded-2xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 hover:border-slate-755 transition resize-none text-xs leading-relaxed"
          />
        </div>

        {/* Importance Rating */}
        <div>
          <label className="block text-slate-300 text-sm font-semibold mb-2 flex items-center justify-between">
            <span>Decision Importance Weight</span>
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Weight factor</span>
          </label>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setImportance(val)}
                className={`flex-1 py-3 rounded-2xl border text-sm font-bold transition cursor-pointer relative overflow-hidden ${
                  importance === val
                    ? "bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                    : "bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                }`}
              >
                {val}
                <span className={`text-[9px] block font-semibold uppercase mt-1 ${importance === val ? "text-indigo-400" : "text-slate-500"}`}>
                  {val === 1 && "Casual"}
                  {val === 3 && "Standard"}
                  {val === 5 && "Critical"}
                  {val !== 1 && val !== 3 && val !== 5 && `Lvl ${val}`}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-display font-bold tracking-tight text-md py-4 px-6 rounded-2xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center gap-2.5 cursor-pointer mt-2 shadow-xl shadow-indigo-500/10"
        >
          {isPending ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Compiling Analytical Matrices...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Resolve with Tiebreaker AI
            </>
          )}
        </button>
      </form>
    </div>
  );
}
