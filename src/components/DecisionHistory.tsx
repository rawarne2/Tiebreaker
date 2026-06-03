import React from "react";
import { History, Trash2, Calendar, Award, Scale } from "lucide-react";
import { Decision } from "../types";

interface DecisionHistoryProps {
  decisions: Decision[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onNew: () => void;
}

export default function DecisionHistory({
  decisions,
  activeId,
  onSelect,
  onDelete,
  onNew,
}: DecisionHistoryProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800/80">
        <h3 className="font-bold text-slate-400 flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em]">
          <History className="w-4 h-4 text-indigo-400" />
          Decision Vault
        </h3>
        <button
          onClick={onNew}
          className="text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-full bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 transition cursor-pointer"
        >
          New +
        </button>
      </div>

      {decisions.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-500">
          <Scale className="w-8 h-8 opacity-25 mb-3 text-indigo-400" />
          <p className="text-xs">Your decision vault is empty.</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[360px] md:max-h-none">
          {decisions.map((dec) => {
            const isActive = activeId === dec.id;
            const dateStr = new Date(dec.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            });

            return (
              <div
                key={dec.id}
                onClick={() => onSelect(dec.id)}
                className={`group text-left p-4 rounded-2xl border transition cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  isActive
                    ? "bg-slate-950 border-indigo-500/80 shadow-md shadow-indigo-500/5 text-teal-300"
                    : "bg-slate-950/40 border-slate-850 hover:border-slate-700 hover:bg-slate-900/40 text-slate-300"
                }`}
              >
                {isActive && (
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500" />
                )}

                <div className="flex items-start justify-between gap-2.5">
                  <span className={`font-semibold text-sm transition line-clamp-2 ${isActive ? "text-white" : "text-slate-300 group-hover:text-indigo-400"}`}>
                    {dec.question}
                  </span>
                  <button
                    onClick={(e) => onDelete(dec.id, e)}
                    className="p-1 rounded text-slate-600 hover:text-rose-450 hover:bg-rose-950/20 opacity-0 group-hover:opacity-100 focus:opacity-100 transition cursor-pointer"
                    title="Delete Decision"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mt-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-600" />
                    {dateStr}
                  </span>

                  <div className="flex items-center gap-2">
                    {dec.result ? (
                      <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold uppercase tracking-wider text-[9px]">
                        Decided
                      </span>
                    ) : (
                      <span className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 font-bold uppercase tracking-wider text-[9px]">
                        Draft
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {decisions.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-800/65 text-[10px] text-slate-500 flex justify-between font-mono">
          <span>{decisions.length} recorded</span>
          <span>Local Storage</span>
        </div>
      )}
    </div>
  );
}
