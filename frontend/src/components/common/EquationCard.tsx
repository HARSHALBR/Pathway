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
    <div className="instrument-panel p-5 border-l-4 border-l-cyan-500 my-5 text-left shadow-lg">
      <div className="flex items-center justify-between cursor-pointer group" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold block">
              MATHEMATICAL FORMULATION
            </span>
            <h4 className="font-bold text-slate-100 text-sm tracking-wide group-hover:text-cyan-300 transition-colors">
              {title}
            </h4>
          </div>
        </div>
        <button 
          type="button"
          aria-label={expanded ? "Collapse equation details" : "Expand equation details"}
          className="text-slate-400 hover:text-cyan-300 p-1.5 rounded-lg bg-slate-900/60 border border-slate-800 transition-colors"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      <div className="my-3 p-3.5 bg-[#03060C]/90 rounded-xl border border-cyan-500/20 font-mono text-cyan-300 text-sm md:text-base overflow-x-auto text-center tracking-wider shadow-inner">
        {formula}
      </div>

      {expanded && (
        <div className="mt-3.5 space-y-2.5 text-xs md:text-sm text-slate-300 border-t border-slate-800/80 pt-3">
          <div>
            <span className="font-bold text-cyan-400 uppercase tracking-wider text-[10px] font-mono block mb-1">
              Physical & Mathematical Interpretation:
            </span>
            <p className="text-slate-300 leading-relaxed">{plainEnglish}</p>
          </div>

          {numericExample && (
            <div className="bg-[#070D18]/90 p-3 rounded-lg border border-emerald-500/30 font-mono text-xs text-emerald-300 space-y-1">
              <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px] block">
                Live Numeric Instance (From Current Model):
              </span>
              <div className="text-slate-200">{numericExample}</div>
            </div>
          )}

          {source && (
            <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 pt-1">
              <span className="font-bold text-slate-400 uppercase text-[10px]">Primary Citation:</span>
              <span className="text-slate-300">{source}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
