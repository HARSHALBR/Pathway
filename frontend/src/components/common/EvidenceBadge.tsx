import React, { useState } from 'react';

export type BadgeType = 'live' | 'toy' | 'published' | 'primary' | 'limitation';

interface Props {
  type: BadgeType;
  label?: string;
}

const BADGE_CONFIG: Record<BadgeType, { text: string; bg: string; textCol: string; border: string; desc: string }> = {
  live: {
    text: '🟢 LIVE COMPUTATION',
    bg: 'bg-emerald-950/70',
    textCol: 'text-emerald-300',
    border: 'border-emerald-500/40',
    desc: 'Computed on the fly in real time by the local pure NumPy mathematical engine.'
  },
  toy: {
    text: '🟡 TOY MODEL',
    bg: 'bg-amber-950/70',
    textCol: 'text-amber-300',
    border: 'border-amber-500/40',
    desc: 'Educational inspectable baseline model designed for learning, not production scale.'
  },
  published: {
    text: '🔵 PUBLISHED RESULT',
    bg: 'bg-blue-950/70',
    textCol: 'text-blue-300',
    border: 'border-blue-500/40',
    desc: 'Reported in peer-reviewed or preprint research papers (not reproduced locally).'
  },
  primary: {
    text: '⚪ PRIMARY SOURCE',
    bg: 'bg-slate-900/80',
    textCol: 'text-slate-300',
    border: 'border-slate-500/40',
    desc: 'Direct citations, definitions, and equations from original published papers.'
  },
  limitation: {
    text: '⚠️ FAILURE / LIMITATION',
    bg: 'bg-rose-950/70',
    textCol: 'text-rose-300',
    border: 'border-rose-500/40',
    desc: 'Empirical boundary condition or failure mode of the simplified toy architecture.'
  }
};

export const EvidenceBadge: React.FC<Props> = ({ type, label }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const cfg = BADGE_CONFIG[type];

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border cursor-help transition-colors ${cfg.bg} ${cfg.textCol} ${cfg.border}`}>
        {label || cfg.text}
      </span>
      {showTooltip && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2 bg-slate-900/95 backdrop-blur border border-slate-700 text-slate-200 text-xs rounded-lg shadow-xl pointer-events-none text-center">
          {cfg.desc}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900/95" />
        </div>
      )}
    </div>
  );
};
