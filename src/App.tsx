import React, { useState, useEffect } from "react";
import { Scale, Sparkles, AlertCircle, RefreshCw, BarChart2, PlusCircle, HelpCircle } from "lucide-react";
import Wizard from "./components/Wizard";
import DecisionHistory from "./components/DecisionHistory";
import AnalysisView from "./components/AnalysisView";
import { Decision, DecisionResult } from "./types";

export default function App() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize decisions on mount from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("the_tiebreaker_decisions");
      if (stored) {
        const parsed = JSON.parse(stored);
        setDecisions(parsed);
        if (parsed.length > 0) {
          setActiveId(parsed[0].id);
        }
      }
    } catch (e) {
      console.error("Failed to load decisions from state", e);
    }
  }, []);

  // Sync to LocalStorage
  const saveDecisions = (updatedList: Decision[]) => {
    setDecisions(updatedList);
    try {
      localStorage.setItem("the_tiebreaker_decisions", JSON.stringify(updatedList));
    } catch (e) {
      console.error("Local persistence limit exceeded.");
    }
  };

  const activeDecision = decisions.find((d) => d.id === activeId) || null;

  const handleCreateDecision = async (data: {
    question: string;
    context: string;
    options?: string[];
    importance: number;
  }) => {
    setIsPending(true);
    setError(null);

    // Create immediate placeholder draft in list
    const newDecision: Decision = {
      id: "dec_" + Date.now(),
      question: data.question,
      context: data.context,
      options: data.options || [],
      importance: data.importance,
      createdAt: new Date().toISOString(),
    };

    // Prepend to list & set active
    const newList = [newDecision, ...decisions];
    saveDecisions(newList);
    setActiveId(newDecision.id);

    try {
      const response = await fetch("/api/decide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to retrieve analysis.");
      }

      const result: DecisionResult = await response.json();

      // Merge results back to saved log
      const updatedList = newList.map((d) => {
        if (d.id === newDecision.id) {
          return { ...d, result, options: result.options || d.options };
        }
        return d;
      });
      saveDecisions(updatedList);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred. Please try again.");
      // Remove failed draft to avoid cluttering
      saveDecisions(decisions);
      setActiveId(decisions[0]?.id || null);
    } finally {
      setIsPending(false);
    }
  };

  const handleDeleteDecision = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = decisions.filter((d) => d.id !== id);
    saveDecisions(updated);

    if (activeId === id) {
      setActiveId(updated.length > 0 ? updated[0].id : null);
    }
  };

  const handleStartNew = () => {
    setActiveId(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-teal-500/30 selection:text-teal-200">
      
      {/* Dynamic Glow Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 flex flex-col min-h-screen">
        
        {/* Elegant Top Header */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white font-display">
                The Tiebreaker
              </h1>
              <p className="text-slate-400 text-xs mt-0.5">
                Multi-Factor Decision Matrix
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Engine Active</span>
            </div>
            {activeId && (
              <button
                onClick={handleStartNew}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                New Decision
              </button>
            )}
          </div>
        </header>

        {/* Outer Grid Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start flex-1">
          
          {/* LEFT COLUMN: History Vault Panel */}
          <div className="lg:col-span-3">
            <DecisionHistory
              decisions={decisions}
              activeId={activeId}
              onSelect={(id) => {
                setError(null);
                setActiveId(id);
              }}
              onDelete={handleDeleteDecision}
              onNew={handleStartNew}
            />
          </div>

          {/* RIGHT COLUMN: Interactive Workstage */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Display error warning if present */}
            {error && (
              <div className="bg-rose-950/20 border border-rose-900/60 p-4 rounded-xl flex items-start gap-3 text-rose-300 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-semibold block">Analysis Failure</span>
                  <p className="text-xs leading-relaxed text-rose-450">{error}</p>
                </div>
              </div>
            )}

            {!activeId ? (
              /* Create wizard screen if no active decision selected */
              <Wizard onSubmit={handleCreateDecision} isPending={isPending} />
            ) : isPending ? (
              /* Active analysis progress screen */
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 shadow-2xl flex flex-col items-center justify-center text-center space-y-6 min-h-[400px]">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-teal-500/10 border border-teal-500/35 flex items-center justify-center animate-pulse">
                    <Scale className="w-8 h-8 text-teal-400 animate-spin-slow" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center shadow animate-bounce">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                </div>

                <div className="space-y-2 max-w-sm">
                  <h3 className="font-semibold text-lg text-white font-mono uppercase tracking-wider">
                    Engaging Decision Engine
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Analyzing options through Pros/Cons matrix, SWOT framework & generating final scored recommendations...
                  </p>
                </div>

                {/* Simulated dynamic loading prompts to feel incredibly polished */}
                <span className="text-[10px] font-mono uppercase text-slate-500 px-3 py-1 bg-slate-950 rounded border border-slate-850 animate-pulse">
                  Tuning weights & attributes
                </span>
              </div>
            ) : activeDecision?.result ? (
              /* Display resolution tabs once AI results are complete */
              <AnalysisView result={activeDecision.result} options={activeDecision.options} />
            ) : (
              /* Selected draft placeholder fallback */
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 shadow-2xl flex flex-col items-center justify-center text-center space-y-4 min-h-[400px]">
                <BarChart2 className="w-12 h-12 text-slate-600 opacity-40 animate-pulse" />
                <div className="space-y-1">
                  <h3 className="font-semibold text-white">Draft Saved</h3>
                  <p className="text-slate-400 text-xs max-w-sm">
                    This decision draft request lacks resolved calculations. Initiate compilation below.
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleCreateDecision({
                      question: activeDecision.question,
                      context: activeDecision.context,
                      options: activeDecision.options,
                      importance: activeDecision.importance,
                    })
                  }
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold rounded-lg text-sm transition cursor-pointer"
                >
                  Regenerate Analysis
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Elegant Footer attribution */}
        <footer className="mt-12 pt-6 border-t border-slate-900 text-center text-[10px] text-slate-500 font-mono tracking-wider flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>&copy; {new Date().getFullYear()} THE TIEBREAKER. Powered by Gemini 3.5.</span>
          <div className="flex gap-4">
            <span className="hover:text-slate-400 transition cursor-help">Security Sandbox Enforced</span>
            <span className="text-slate-700">|</span>
            <span className="hover:text-slate-400 transition cursor-help">Offline History Log</span>
          </div>
        </footer>

      </div>
    </div>
  );
}
