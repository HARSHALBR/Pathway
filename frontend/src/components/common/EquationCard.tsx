import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { MathFormula } from './MathFormula';

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
    <div className="bg-white p-5 my-5 text-left border border-slate-200 rounded-2xl shadow-xs">
      <div className="flex items-center justify-between cursor-pointer group select-none" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[10px] font-sans uppercase tracking-wider text-indigo-600 font-semibold block">
              MATHEMATICAL FORMULATION
            </span>
            <h4 className="font-bold text-slate-900 text-sm tracking-normal group-hover:text-indigo-600 transition-colors">
              {title}
            </h4>
          </div>
        </div>
        <button 
          type="button"
          aria-label={expanded ? "Collapse equation details" : "Expand equation details"}
          className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg bg-slate-50 border border-slate-200 transition-colors"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Prominent Mathematical Stage Rendered with KaTeX */}
      <div className="my-4 py-4 px-6 bg-[#F8FAFC] rounded-xl border border-slate-200 text-slate-900 text-base md:text-lg overflow-x-auto text-center font-medium">
        <MathFormula math={formula} displayMode={true} />
      </div>

      {expanded && (
        <div className="mt-3.5 space-y-2.5 text-xs md:text-sm text-slate-600 border-t border-slate-100 pt-3">
          <div>
            <span className="font-semibold text-indigo-600 uppercase tracking-wider text-[10px] font-sans block mb-1">
              Physical & Mathematical Interpretation
            </span>
            <p className="text-slate-600 leading-relaxed font-sans">{plainEnglish}</p>
          </div>

          {numericExample && (
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
              <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px] font-sans block">
                Live Numeric Instance (Current Model):
              </span>
              <div className="text-slate-800 font-mono text-[11px]">{numericExample}</div>
            </div>
          )}

          {source && (
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
              <span className="font-semibold text-slate-400 uppercase text-[10px]">Citation:</span>
              <span className="text-slate-600">{source}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
