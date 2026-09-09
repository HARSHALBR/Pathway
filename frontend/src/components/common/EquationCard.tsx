import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

interface Props {
  title: string;
  formula: string;
  plainEnglish: string;
  numericExample?: string;
  source?: string;
}

export const EquationCard: React.FC<Props> = ({
  title,
  formula,
  plainEnglish,
  numericExample,
  source
}) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="lab-glass-card p-4 border-l-4 border-l-indigo-500 my-4 text-left">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          <h4 className="font-semibold text-slate-100 text-sm tracking-wide">{title}</h4>
        </div>
        <button 
          type="button"
          aria-label={expanded ? "Collapse equation details" : "Expand equation details"}
          className="text-slate-400 hover:text-slate-200 p-1"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      <div className="my-2 p-3 bg-slate-950/80 rounded-md border border-slate-800 font-mono text-indigo-300 text-sm md:text-base overflow-x-auto text-center tracking-wider">
        {formula}
      </div>

      {expanded && (
        <div className="mt-3 space-y-2 text-xs md:text-sm text-slate-300 border-t border-slate-800/80 pt-2">
          <div>
            <span className="font-semibold text-indigo-400 uppercase tracking-wider text-[11px] block">What it means:</span>
            <p className="mt-0.5 text-slate-300 leading-relaxed">{plainEnglish}</p>
          </div>

          {numericExample && (
            <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800 font-mono text-xs text-emerald-300">
              <span className="font-semibold text-emerald-400 uppercase tracking-wider text-[10px] block mb-1">Live Computation Trace:</span>
              {numericExample}
            </div>
          )}

          {source && (
            <div className="text-[11px] text-slate-400 italic">
              <span className="font-semibold text-slate-400">Source: </span>
              {source}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
