import React, { useState } from "react";
import {
  Award,
  CheckCircle,
  TrendingUp,
  XCircle,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Columns,
  ListFilter,
  Grid,
  TrendingDown,
  Info,
  Layout,
  HelpCircle
} from "lucide-react";
import { DecisionResult } from "../types";

interface AnalysisViewProps {
  result: DecisionResult;
  options: string[];
}

export default function AnalysisView({ result, options }: AnalysisViewProps) {
  const [layoutMode, setLayoutMode] = useState<"bento" | "tabs">("bento");
  const [activeTab, setActiveTab] = useState<"verdict" | "proscons" | "comparison" | "swot">("verdict");

  const verdict = result.verdict;
  const prosCons = result.prosCons || [];
  const matrix = result.comparisonMatrix || [];
  const swot = result.swotAnalysis || { strengths: [], weaknesses: [], opportunities: [], threats: [] };

  const totalPros = prosCons.filter(p => p.type === "pro").length;
  const totalCons = prosCons.filter(p => p.type === "con").length;

  return (
    <div className="space-y-6">
      
      {/* Interactive Title Bento Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="px-3 py-1 bg-slate-950 border border-slate-850 rounded-full flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping"></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">Analysis Matrix Core</span>
          </div>

          {/* Core Layout Switcher - Bento Dashboard vs Detailed Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-full border border-slate-850">
            <button
              onClick={() => setLayoutMode("bento")}
              className={`px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full transition-all cursor-pointer flex items-center gap-1 ${
                layoutMode === "bento"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/10"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Layout className="w-3 h-3" />
              Bento Grid Layout
            </button>
            <button
              onClick={() => setLayoutMode("tabs")}
              className={`px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full transition-all cursor-pointer flex items-center gap-1 ${
                layoutMode === "tabs"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/10"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Columns className="w-3 h-3" />
              Tabbed Report
            </button>
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight font-display mb-3">
          {result.title || "The Ultimate Verdict"}
        </h2>
        <p className="text-slate-300 text-sm italic max-w-4xl leading-relaxed border-l-2 border-indigo-500/40 pl-4 py-1 bg-slate-950/20 rounded-r">
          &ldquo;{result.summary}&rdquo;
        </p>
      </div>

      {/* RENDER BENTO GRID DASHBOARD */}
      {layoutMode === "bento" && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 animate-fade-in text-sans">
          
          {/* Card 1: Dilemma Profile Box (Span 4) */}
          <div className="md:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-xl min-h-[220px]">
            <div className="space-y-4">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Inquiry Boundary</span>
              <h3 className="text-lg font-bold font-display text-white leading-snug line-clamp-2">
                {options.join(" vs. ")}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-4">
                Providing diagnostic mapping comparing options through a multi-factor weighting index.
              </p>
            </div>
            <div className="flex gap-2 flex-wrap mt-4 pt-4 border-t border-slate-800/60">
              <span className="px-2.5 py-1 bg-slate-950 border border-slate-850 rounded text-[9.5px] font-mono text-slate-500 uppercase tracking-wider">
                Strategic Import
              </span>
              <span className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded text-[9.5px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                Verified Optimal
              </span>
            </div>
          </div>

          {/* Card 2: Indigo Verdict (Span 4) - Colored exactly like Bento grid proceed tile */}
          <div className="md:col-span-4 bg-indigo-600 rounded-3xl p-6 flex flex-col justify-between shadow-2xl shadow-indigo-600/20 text-white min-h-[220px] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            <div>
              <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-[0.22em] block mb-1">Final Tiebreak Champion</span>
              <h3 className="text-2xl font-black text-white font-display tracking-tight uppercase leading-tight line-clamp-2">
                {verdict.winningOption}
              </h3>
              <p className="text-xs text-indigo-100/90 leading-relaxed mt-2.5 line-clamp-3">
                {verdict.rationale}
              </p>
            </div>
            <div className="flex items-end justify-between mt-4 border-t border-white/10 pt-3">
              <span className="text-[10px] uppercase font-mono tracking-wider text-indigo-200">Confidence</span>
              <span className="text-3xl font-black text-white/50">{verdict.confidenceScore || 82}%</span>
            </div>
          </div>

          {/* Card 3: Action Plan Steps (Span 4) */}
          <div className="md:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-xl min-h-[220px]">
            <div className="space-y-3 flex-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">Actionable Next Steps</span>
              <div className="space-y-3 overflow-y-auto max-h-[160px] pr-1">
                {verdict.nextSteps && verdict.nextSteps.slice(0, 3).map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-[10px] flex items-center justify-center font-bold tracking-normal shrink-0 font-mono">
                      {idx + 1}
                    </span>
                    <p className="text-[11px] text-slate-300 leading-normal font-medium">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 4: SWOT Quadrants Panel (Span 4) - Match exact 2x2 grid boxes of Card 3 */}
          <div className="col-span-1 md:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">SWOT Analysis Summary</h3>
              <div className="grid grid-cols-2 gap-3.5">
                {/* S */}
                <div className="aspect-square bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3 flex flex-col justify-between text-emerald-400 text-xs font-semibold relative overflow-hidden group">
                  <div className="opacity-60 text-[9px] font-bold">S</div>
                  <span className="text-[10px] leading-snug line-clamp-3 text-slate-300 font-medium">
                    {swot.strengths?.[0] || "Core synergy upsides"}
                  </span>
                </div>
                {/* W */}
                <div className="aspect-square bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3 flex flex-col justify-between text-amber-400 text-xs font-semibold relative overflow-hidden group">
                  <div className="opacity-60 text-[9px] font-bold">W</div>
                  <span className="text-[10px] leading-snug line-clamp-3 text-slate-300 font-medium font-sans">
                    {swot.weaknesses?.[0] || "Structural risks & costs"}
                  </span>
                </div>
                {/* O */}
                <div className="aspect-square bg-blue-500/10 border border-blue-500/20 rounded-2xl p-3 flex flex-col justify-between text-blue-400 text-xs font-semibold relative overflow-hidden group">
                  <div className="opacity-60 text-[9px] font-bold">O</div>
                  <span className="text-[10px] leading-snug line-clamp-3 text-slate-300 font-medium font-sans">
                    {swot.opportunities?.[0] || "Strategic developments"}
                  </span>
                </div>
                {/* T */}
                <div className="aspect-square bg-rose-500/10 border border-rose-500/20 rounded-2xl p-3 flex flex-col justify-between text-rose-400 text-xs font-semibold relative overflow-hidden group">
                  <div className="opacity-60 text-[9px] font-bold">T</div>
                  <span className="text-[10px] leading-snug line-clamp-3 text-slate-300 font-medium">
                    {swot.threats?.[0] || "External constraints"}
                  </span>
                </div>
              </div>
            </div>

            {/* Internal Sentiment metric of the design */}
            <div className="mt-6 border-t border-slate-850 pt-4">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono mb-2">Internal Sentiment</h4>
              <div className="h-11 w-full bg-slate-950 rounded-full p-1 overflow-hidden relative border border-slate-850 flex items-center">
                <div 
                  className="h-full bg-indigo-500 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.4)] flex items-center px-3 transition-all duration-1000"
                  style={{ width: `${verdict.confidenceScore || 80}%` }}
                >
                  <span className="text-[9px] font-bold text-white uppercase tracking-wider">Favorable</span>
                </div>
                <span className="absolute right-4 text-[10px] font-bold font-mono text-slate-500">
                  {verdict.confidenceScore || 80}%
                </span>
              </div>
            </div>
          </div>

          {/* Card 5: Comparative Matrix Table (Span 8) - Matches Card 2 of Bento html */}
          <div className="col-span-1 md:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between min-h-[360px]">
            <div>
              <div className="p-5 border-b border-slate-850 bg-slate-900/50 flex justify-between items-center whitespace-nowrap">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Multi-Factor Comparison</h3>
                <span className="text-xs text-indigo-400 font-semibold">{matrix.length} Variables Analyzed</span>
              </div>
              <div className="p-6 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      <th className="pb-3 text-left">Aspect Dimension</th>
                      {options.map((opt) => (
                        <th key={opt} className="pb-3 text-center w-1/3">{opt}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-xs text-slate-300 divide-y divide-slate-850/50">
                    {matrix.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-950/20 transition-colors">
                        <td className="py-3.5 font-bold text-slate-200">{item.criterion}</td>
                        {options.map((opt) => {
                          const optionRating = item.ratings?.find(
                            r => r.optionName.toLowerCase() === opt.toLowerCase() ||
                            opt.toLowerCase().includes(r.optionName.toLowerCase()) ||
                            r.optionName.toLowerCase().includes(opt.toLowerCase())
                          ) || { rating: 5, comment: "N/A" };

                          return (
                            <td key={opt} className="py-3.5 px-2">
                              <div className="flex flex-col items-center justify-center space-y-1">
                                <span className={`font-mono font-bold text-[11px] ${
                                  optionRating.rating >= 8 ? "text-emerald-400" :
                                  optionRating.rating >= 6 ? "text-teal-400" :
                                  optionRating.rating >= 4 ? "text-amber-450" : "text-rose-450"
                                }`}>
                                  {optionRating.rating}/10
                                </span>
                                <span className="text-[10px] text-slate-450 line-clamp-1 text-center max-w-[170px]" title={optionRating.comment}>
                                  {optionRating.comment}
                                </span>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="p-4 bg-slate-950/20 border-t border-slate-850 text-[10px] font-mono text-slate-500 flex justify-end">
              <span>Weighted scoring matrices calculated across active parameters</span>
            </div>
          </div>

          {/* Card 6: Side-By-Side Balanced Pros & Cons Matrix (Span 12) - Matches exact check/cross circles style */}
          <div className="col-span-1 md:col-span-12 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="border-b border-slate-800/80 pb-3.5 flex justify-between items-center gap-4 flex-wrap">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Upsides & Downsides Directory</h3>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-950 border border-slate-850 px-2.5 py-1 rounded">
                Trade-off metrics: {totalPros} Pros versus {totalCons} Cons identified
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {options.map((opt) => {
                const optionPros = prosCons.filter(x => x.optionName.toLowerCase() === opt.toLowerCase() && x.type === "pro");
                const optionCons = prosCons.filter(x => x.optionName.toLowerCase() === opt.toLowerCase() && x.type === "con");

                const matchPros = optionPros.length > 0 ? optionPros : prosCons.filter(x => x.type === 'pro' && (x.optionName.toLowerCase().includes(opt.toLowerCase()) || opt.toLowerCase().includes(x.optionName.toLowerCase())));
                const matchCons = optionCons.length > 0 ? optionCons : prosCons.filter(x => x.type === 'con' && (x.optionName.toLowerCase().includes(opt.toLowerCase()) || opt.toLowerCase().includes(x.optionName.toLowerCase())));

                return (
                  <div key={opt} className="bg-slate-950/30 border border-slate-850/80 p-5 rounded-2xl space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-850">
                      <span className="font-display font-bold text-sm text-white">{opt}</span>
                      <span className="text-[9px] font-mono uppercase bg-slate-900 border border-slate-850 px-2 py-0.5 rounded text-indigo-400 font-semibold">Active Segment</span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Pros Column */}
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase text-emerald-400 tracking-widest font-mono flex items-center gap-1.5">
                          <span className="w-5 h-5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center text-[10px] font-bold font-mono">✓</span>
                          Pros / Advantages
                        </h4>
                        <ul className="space-y-3">
                          {matchPros.length === 0 ? (
                            <li className="text-xs text-slate-600 italic">No significant advantages flagged.</li>
                          ) : (
                            matchPros.map((pro, index) => (
                              <li key={index} className="flex gap-2.5 items-start">
                                <div className="w-4 h-4 bg-emerald-500/20 text-emerald-400 rounded-full shrink-0 flex items-center justify-center text-[9px] font-mono font-bold mt-0.5">✓</div>
                                <div>
                                  <p className="text-[10.5px] font-extrabold text-slate-200 leading-snug">{pro.factor}</p>
                                  <p className="text-[10.5px]" style={{ color: "rgb(156, 163, 175)" }}>{pro.explanation}</p>
                                </div>
                              </li>
                            ))
                          )}
                        </ul>
                      </div>

                      {/* Cons Column */}
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase text-rose-400 tracking-widest font-mono flex items-center gap-1.5">
                          <span className="w-5 h-5 bg-rose-500/10 border border-rose-500/30 text-rose-450 rounded-full flex items-center justify-center text-[10px] font-bold font-mono">✕</span>
                          Cons / Disadvantages
                        </h4>
                        <ul className="space-y-3">
                          {matchCons.length === 0 ? (
                            <li className="text-xs text-slate-600 italic">No major risks specified.</li>
                          ) : (
                            matchCons.map((con, index) => (
                              <li key={index} className="flex gap-2.5 items-start">
                                <div className="w-4 h-4 bg-rose-500/20 text-rose-450 rounded-full shrink-0 flex items-center justify-center text-[9px] font-mono font-bold mt-0.5">✕</div>
                                <div>
                                  <p className="text-[10.5px] font-extrabold text-slate-200 leading-snug">{con.factor}</p>
                                  <p className="text-[10.5px]" style={{ color: "rgb(156, 163, 175)" }}>{con.explanation}</p>
                                </div>
                              </li>
                            ))
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* RENDER TABBED REPORT MODE (To preserve full existing tabs functionality) */}
      {layoutMode === "tabs" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative">
          
          {/* Internal Tab Selector */}
          <div className="flex border-b border-slate-800 mb-6 font-mono text-xs overflow-x-auto whitespace-nowrap scrollbar-none gap-1">
            <button
              onClick={() => setActiveTab("verdict")}
              className={`px-5 py-3 border-b-2 font-medium transition cursor-pointer flex items-center gap-2 ${
                activeTab === "verdict"
                  ? "border-indigo-400 text-indigo-300 bg-slate-950/40"
                  : "border-transparent text-slate-500 hover:text-slate-300 hover:border-slate-800"
              }`}
            >
              <Award className="w-4 h-4 text-indigo-400" />
              🏆 Tiebreaker Verdict
            </button>
            <button
              onClick={() => setActiveTab("proscons")}
              className={`px-5 py-3 border-b-2 font-medium transition cursor-pointer flex items-center gap-2 ${
                activeTab === "proscons"
                  ? "border-indigo-400 text-indigo-400 bg-slate-950/40"
                  : "border-transparent text-slate-500 hover:text-slate-300 hover:border-slate-800"
              }`}
            >
              <Columns className="w-4 h-4 text-emerald-400" />
              ⚖️ Pros & Cons
            </button>
            <button
              onClick={() => setActiveTab("comparison")}
              className={`px-5 py-3 border-b-2 font-medium transition cursor-pointer flex items-center gap-2 ${
                activeTab === "comparison"
                  ? "border-indigo-400 text-indigo-300 bg-slate-950/40"
                  : "border-transparent text-slate-500 hover:text-slate-300 hover:border-slate-800"
              }`}
            >
              <ListFilter className="w-4 h-4 text-blue-400" />
              📊 Comparison Matrix
            </button>
            <button
              onClick={() => setActiveTab("swot")}
              className={`px-5 py-3 border-b-2 font-medium transition cursor-pointer flex items-center gap-2 ${
                activeTab === "swot"
                  ? "border-indigo-400 text-indigo-300 bg-slate-950/40"
                  : "border-transparent text-slate-500 hover:text-slate-300 hover:border-slate-800"
              }`}
            >
              <Grid className="w-4 h-4 text-indigo-450" />
              ⚡ SWOT Analysis
            </button>
          </div>

          {/* Verdict Tab */}
          {activeTab === "verdict" && (
            <div className="space-y-6 animate-fade-in text-sans">
              <div className="bg-slate-950 border border-slate-850 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 justify-between">
                <div className="space-y-2 text-center md:text-left">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full w-fit">Decision Selection</span>
                  <h3 className="text-2xl font-black text-white font-display uppercase tracking-tight ">{verdict.winningOption}</h3>
                  <p className="text-slate-400 text-xs max-w-xl">Optimized candidate reflecting primary weights and analytical parameters.</p>
                </div>
                <div className="flex flex-col items-center justify-center p-3.5 bg-slate-900 rounded-xl border border-slate-800 min-w-[130px]">
                  <span className="text-3xl font-black text-white font-mono">{verdict.confidenceScore || 80}%</span>
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono font-bold mt-1">Confidence Score</span>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl space-y-3">
                <h4 className="text-xs uppercase font-mono tracking-widest text-indigo-400 font-bold flex items-center gap-1.5"><TrendingUp className="w-4 h-4 text-indigo-400" /> Strategic Rationale</h4>
                <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-line">{verdict.rationale}</p>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] uppercase font-mono tracking-widest text-slate-500 font-bold">Recommended Immediate Protocols</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {verdict.nextSteps && verdict.nextSteps.map((step, idx) => (
                    <div key={idx} className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex text-[10px] items-center justify-center shrink-0 font-mono text-indigo-450 font-bold">{idx + 1}</span>
                      <p className="text-xs text-slate-300 leading-normal font-sans">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ProsCons Tab */}
          {activeTab === "proscons" && (
            <div className="space-y-5 animate-fade-in text-sans">
              <div className="grid md:grid-cols-2 gap-5">
                {options.map((opt) => {
                  const optionPros = prosCons.filter(x => x.optionName.toLowerCase() === opt.toLowerCase() && x.type === "pro");
                  const optionCons = prosCons.filter(x => x.optionName.toLowerCase() === opt.toLowerCase() && x.type === "con");

                  const matchPros = optionPros.length > 0 ? optionPros : prosCons.filter(x => x.type === 'pro' && (x.optionName.toLowerCase().includes(opt.toLowerCase()) || opt.toLowerCase().includes(x.optionName.toLowerCase())));
                  const matchCons = optionCons.length > 0 ? optionCons : prosCons.filter(x => x.type === 'con' && (x.optionName.toLowerCase().includes(opt.toLowerCase()) || opt.toLowerCase().includes(x.optionName.toLowerCase())));

                  return (
                    <div key={opt} className="bg-slate-950 border border-slate-850 p-5 rounded-2xl space-y-4">
                      <h3 className="font-display font-bold text-white border-b border-slate-850 pb-2 text-md flex items-center justify-between">
                        <span>{opt}</span>
                        <span className="text-[9px] font-mono uppercase bg-slate-900 border border-slate-850 px-2 py-0.5 rounded text-slate-500 font-semibold font-mono">Comparing Boundary</span>
                      </h3>

                      <div className="space-y-3">
                        <h4 className="text-[10px] font-mono tracking-widest uppercase text-emerald-400 font-bold flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Pros</h4>
                        {matchPros.map((pro, index) => (
                          <div key={index} className="bg-slate-900/40 border-l border-emerald-500 p-3 rounded-r-lg space-y-1">
                            <span className="text-xs text-slate-100 font-bold">{pro.factor}</span>
                            <p className="text-[11px] text-slate-400 font-sans leading-normal">{pro.explanation}</p>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-[10px] font-mono tracking-widest uppercase text-rose-400 font-bold flex items-center gap-1.5"><XCircle className="w-3.5 h-3.5 text-rose-500" /> Cons</h4>
                        {matchCons.map((con, index) => (
                          <div key={index} className="bg-slate-900/40 border-l border-rose-500 p-3 rounded-r-lg space-y-1">
                            <span className="text-xs text-slate-100 font-bold">{con.factor}</span>
                            <p className="text-[11px] text-slate-400 font-sans leading-normal">{con.explanation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Comparison Matrix Tab */}
          {activeTab === "comparison" && (
            <div className="space-y-4 animate-fade-in text-sans">
              <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950">
                <table className="w-full text-left border-collapse">
                  <thead className="text-[10px] text-slate-500 uppercase tracking-widest bg-slate-900/60 border-b border-slate-800">
                    <tr>
                      <th className="py-4 px-5 font-semibold">Aspect Dimension</th>
                      {options.map((opt) => (
                        <th key={opt} className="py-4 px-5 text-center font-semibold">{opt}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {matrix.map((item, idx) => (
                      <tr key={idx} className="border-b border-slate-850/50 hover:bg-slate-900/30 transition-colors">
                        <td className="py-4 px-5 font-bold text-slate-100">{item.criterion}</td>
                        {options.map((opt) => {
                          const optionRating = item.ratings?.find(
                            r => r.optionName.toLowerCase() === opt.toLowerCase() ||
                            opt.toLowerCase().includes(r.optionName.toLowerCase()) ||
                            r.optionName.toLowerCase().includes(opt.toLowerCase())
                          ) || { rating: 5, comment: "-" };

                          return (
                            <td key={opt} className="py-4 px-5">
                              <div className="flex flex-col items-center justify-center space-y-1.5">
                                <span className="font-mono text-xs text-white bg-slate-900 px-2.5 py-0.5 rounded border border-slate-850">{optionRating.rating}/10</span>
                                <span className="text-[10px] text-slate-400 leading-normal text-center">{optionRating.comment}</span>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SWOT Tab */}
          {activeTab === "swot" && (
            <div className="space-y-5 animate-fade-in text-sans">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-950 border border-emerald-950 rounded-2xl p-5 space-y-2.5">
                  <h4 className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 font-bold border-b border-emerald-900 pb-2 flex items-center justify-between">
                    <span>S • Internal Strengths</span>
                    <span className="w-2.5-2.5 bg-emerald-500/10 border border-emerald-500/30 text-[8px] px-1 rounded">upside</span>
                  </h4>
                  <ul className="space-y-2 text-xs">
                    {swot.strengths?.map((s, idx) => (
                      <li key={idx} className="text-slate-350 flex items-start gap-1.5 leading-relaxed">
                        <span className="text-emerald-500 font-mono">•</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-950 border border-rose-950 rounded-2xl p-5 space-y-2.5">
                  <h4 className="text-[10px] uppercase font-mono tracking-widest text-rose-450 font-bold border-b border-rose-900 pb-2 flex items-center justify-between">
                    <span>W • Internal Weaknesses</span>
                    <span className="w-2.5-2.5 bg-rose-500/10 border border-rose-500/30 text-[8px] px-1 rounded">limits</span>
                  </h4>
                  <ul className="space-y-2 text-xs">
                    {swot.weaknesses?.map((w, idx) => (
                      <li key={idx} className="text-slate-350 flex items-start gap-1.5 leading-relaxed">
                        <span className="text-rose-500 font-mono">•</span>
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-950 border border-blue-950 rounded-2xl p-5 space-y-2.5">
                  <h4 className="text-[10px] uppercase font-mono tracking-widest text-blue-400 font-bold border-b border-blue-900 pb-2 flex items-center justify-between">
                    <span>O • External Opportunities</span>
                    <span className="w-2.5-2.5 bg-blue-500/10 border border-blue-500/30 text-[8px] px-1 rounded">gains</span>
                  </h4>
                  <ul className="space-y-2 text-xs">
                    {swot.opportunities?.map((o, idx) => (
                      <li key={idx} className="text-slate-350 flex items-start gap-1.5 leading-relaxed">
                        <span className="text-blue-500 font-mono">•</span>
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-950 border border-amber-950 rounded-2xl p-5 space-y-2.5">
                  <h4 className="text-[10px] uppercase font-mono tracking-widest text-amber-400 font-bold border-b border-amber-900 pb-2 flex items-center justify-between">
                    <span>T • External Threats</span>
                    <span className="w-2.5-2.5 bg-amber-500/10 border border-amber-500/30 text-[8px] px-1 rounded">risks</span>
                  </h4>
                  <ul className="space-y-2 text-xs">
                    {swot.threats?.map((t, idx) => (
                      <li key={idx} className="text-slate-350 flex items-start gap-1.5 leading-relaxed">
                        <span className="text-amber-500 font-mono">•</span>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
