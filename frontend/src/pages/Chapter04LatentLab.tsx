import React, { useState, useEffect } from 'react';
import { runLatent, sweepLatent } from '../services/api';
import type { LatentRunResponse, LatentSweepResponse } from '../types/api';
import { EvidenceBadge } from '../components/common/EvidenceBadge';
import { MathInline } from '../components/common/MathFormula';
import { Cpu, ArrowRight, RefreshCw, AlertOctagon, TrendingUp, Sliders, Info } from 'lucide-react';

interface Props {
  onNextChapter: () => void;
}

export const Chapter04LatentLab: React.FC<Props> = ({ onNextChapter }) => {
  const [R, setR] = useState<number>(4);
  const [level, setLevel] = useState<number>(2);
  const [modulus, setModulus] = useState<number>(11);
  const [seed, setSeed] = useState<number>(42);

  const [latentData, setLatentData] = useState<LatentRunResponse | null>(null);
  const [sweepData, setSweepData] = useState<LatentSweepResponse | null>(null);

  // Recompute live when R, level, modulus, or seed change
  useEffect(() => {
    let isMounted = true;
    runLatent(level, modulus, seed, R)
      .then((res) => {
        if (isMounted) setLatentData(res);
      })
      .catch((err) => console.error('Error running latent model:', err));

    return () => { isMounted = false; };
  }, [R, level, modulus, seed]);

  // Run R sweep
  const handleRunSweep = () => {
    sweepLatent(level, modulus, seed, 10)
      .then((res) => setSweepData(res))
      .catch((err) => console.error('Error running sweep:', err));
  };

  const states = latentData?.states || [];
  const deltas = latentData?.state_deltas || [];
  const pcaPoints = latentData?.pca_trajectory || [];
  const isCorrect = latentData?.correct || false;

  return (
    <div className="lab-container py-8 md:py-12 space-y-10">
      {/* Chapter Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
            Chapter 04 • Latent Reasoning Laboratory
          </span>
          <EvidenceBadge type="live" />
          <EvidenceBadge type="toy" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Latent Reasoning Laboratory: Reactive Recurrence Sandbox
        </h1>

        <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-4xl">
          Directly manipulate recurrence rounds <span className="font-mono text-indigo-700 font-bold">R</span>. 
          Every slider adjustment triggers a live forward pass through the pure NumPy recurrence engine, 
          generating the exact trajectory <MathInline math="S_0 \to S_1 \to \dots \to S_R" className="text-indigo-700 font-semibold" />.
        </p>
      </div>

      {/* Control Surface */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-600" />
            <span>Recurrent Iteration Sandbox</span>
          </span>
          <span className="text-xs text-slate-400 font-medium">Interactive Depth Control</span>
        </div>

        {/* Top Row: R value & Explanation (Left) vs Prediction/Ground Truth (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left: R Value & Causal Explanation */}
          <div className="lg:col-span-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex items-baseline gap-2 shrink-0">
              <span className="text-5xl font-extrabold font-mono text-indigo-700">
                R = {R}
              </span>
              <span className="text-xs text-slate-500 font-medium">rounds</span>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50/40 border border-indigo-200/70 text-xs text-slate-600 leading-relaxed space-y-1.5 flex-1">
              <span className="text-xs text-indigo-900 font-bold flex items-center gap-1.5">
                <Info className="w-4 h-4 text-indigo-600" />
                <span>Causal Mechanism of Recurrence Parameter R</span>
              </span>
              <p>
                R controls how many sequential non-linear transformations (<MathInline math="W_2 \tanh(W_1 S_t + b_1)" className="text-indigo-700 font-semibold" />) occur in latent space before the readout classification head.
                {R === 1 ? (
                  <span> At R = 1, only a single transition (<MathInline math="S_0 \to S_1" />) occurs.</span>
                ) : R <= 4 ? (
                  <span> At R = {R}, the state undergoes {R} sequential vector transformations in <MathInline math="\mathbb{R}^{48}" /> without emitting any tokens.</span>
                ) : (
                  <span> At R = {R}, deep latent recurrence takes place. Notice whether confidence or state deltas saturate.</span>
                )}
              </p>
            </div>
          </div>

          {/* Right: Prediction & Ground Truth Status Card */}
          <div className="lg:col-span-4 flex items-center justify-end gap-3">
            <div className={`p-4 rounded-2xl border flex-1 text-center shadow-2xs ${
              isCorrect
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              <span className="text-[10px] uppercase tracking-wider block font-bold text-slate-400">Prediction</span>
              <span className="text-2xl font-mono font-bold mt-0.5 block">{latentData?.prediction ?? '...'}</span>
              <span className="text-xs font-semibold block mt-0.5">{isCorrect ? '✓ Match' : '✗ Mispredict'}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex-1 text-center shadow-2xs">
              <span className="text-[10px] uppercase tracking-wider block font-bold text-slate-400">Ground Truth</span>
              <span className="text-2xl font-mono font-bold text-slate-900 mt-0.5 block">{latentData?.ground_truth ?? '...'}</span>
              <span className="text-xs text-slate-500 font-medium block mt-0.5">Native Math</span>
            </div>
          </div>
        </div>

        {/* Large Full-Width Slider */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between items-center text-xs text-slate-600 font-medium">
            <span className="text-indigo-700 font-bold">Slide to Adjust Recurrence Depth (R = 1 to 10):</span>
            <span className="font-mono font-bold">Current: R={R}</span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={R}
            onChange={(e) => setR(Number(e.target.value))}
            className="w-full h-2.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 border border-slate-200"
          />
          <div className="flex justify-between text-xs font-mono text-slate-400 px-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
              <span
                key={val}
                onClick={() => setR(val)}
                className={`cursor-pointer transition-colors ${R === val ? 'text-indigo-700 font-bold' : 'hover:text-slate-700'}`}
              >
                {val}
              </span>
            ))}
          </div>
        </div>

        {/* Task Configuration Bar */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-500 uppercase text-xs font-bold">Task:</span>
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 font-bold text-sm font-mono">
              {latentData?.expression || 'Loading...'}
            </span>
            <button
              onClick={() => setSeed(Math.floor(Math.random() * 1000))}
              className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer underline"
            >
              Randomize (Seed {seed})
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Mod:</span>
              <select
                value={modulus}
                onChange={(e) => setModulus(Number(e.target.value))}
                className="py-1 px-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs cursor-pointer font-medium"
              >
                {[7, 11, 13, 17, 19, 23].map((m) => (
                  <option key={m} value={m}>Mod {m}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-slate-500 font-medium">Diff:</span>
              {[1, 2, 3, 4].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevel(lvl)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    level === lvl ? 'bg-indigo-600 text-white shadow-2xs' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  L{lvl}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Visualizations Area */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-600" />
            <span>Latent Recurrence Microscope</span>
          </h3>
          <span className="text-xs text-slate-500 font-mono">Fixed Dimension <MathInline math="d = 48" /></span>
        </div>

        {/* 1. Large State Evolution Matrix Spanning Full Width */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 md:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-600 border-b border-slate-100 pb-3">
            <span className="font-bold text-slate-800">State Evolution Matrix <MathInline math={`S_0 \\to S_{${R}}`} /></span>
            <span className="text-slate-500 font-mono">Rows: Recurrence Rounds | Columns: 48 Continuous Latent Coordinates</span>
          </div>

          <div className="space-y-2 py-2">
            {states.map((st, roundIdx) => (
              <div key={roundIdx} className="flex items-center gap-3">
                <span className="w-14 text-right text-xs text-indigo-700 font-bold shrink-0">
                  <MathInline math={`S_{${roundIdx}}`} />
                </span>
                <div className="flex gap-1 flex-1 overflow-x-auto py-0.5">
                  {st.map((val, dimIdx) => {
                    const normalized = Math.max(-1, Math.min(1, val));
                    const isPositive = normalized >= 0;
                    const alpha = Math.abs(normalized);
                    const bg = isPositive
                      ? `rgba(79, 70, 229, ${Math.max(0.12, alpha * 0.85)})`
                      : `rgba(239, 68, 68, ${Math.max(0.12, alpha * 0.85)})`;
                    return (
                      <div
                        key={dimIdx}
                        title={`Round S_${roundIdx}, Coordinate ${dimIdx}: ${val.toFixed(3)}`}
                        className="flex-1 min-w-[12px] h-7 rounded-sm cursor-pointer hover:ring-1 hover:ring-indigo-400 transition-all"
                        style={{ backgroundColor: bg }}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-xs text-slate-500 pt-3 border-t border-slate-100 font-sans">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block" /> Negative Activation</span>
            <span className="text-slate-400 text-xs">Hover over cells to view coordinate values</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-indigo-600 inline-block" /> Positive Activation</span>
          </div>
        </div>

        {/* 2. Side-by-Side: Delta Norms (Left) and PCA Trajectory (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Delta Norms (||ΔS||₂) */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-700 border-b border-slate-100 pb-3">
              <span className="font-bold text-slate-900">State Transition Magnitudes</span>
              <MathInline math="\|S_{t+1} - S_t\|_2" className="text-indigo-700 font-semibold text-xs" />
            </div>

            <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
              {deltas.map((norm, idx) => {
                const maxNorm = Math.max(...deltas, 1.0);
                const pct = Math.round((norm / maxNorm) * 100);
                const isLarge = norm > 0.5;
                return (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="font-bold text-indigo-700">
                        Recurrent Step <MathInline math={`S_{${idx}} \\to S_{${idx + 1}}`} />
                      </span>
                      <MathInline math={`\\|\\Delta S\\|_2 = ${norm.toFixed(4)}`} className="text-slate-900 font-bold" />
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-600 to-teal-600 rounded-full transition-all duration-200"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 leading-snug">
                      Round {idx + 1} {isLarge ? 'substantially reshaped' : 'fine-tuned'} internal coordinates (magnitude {norm.toFixed(3)}) with 0 tokens emitted.
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: 2D PCA Trajectory */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-700 border-b border-slate-100 pb-3">
              <span className="font-bold text-slate-900">2D Principal Component Trajectory</span>
              <span className="text-slate-500 text-xs">Projection of <MathInline math="\mathbb{R}^{48}" /></span>
            </div>

            <div className="w-full flex-1 flex flex-col items-center justify-center p-4 bg-slate-50/80 rounded-xl border border-slate-200">
              <svg viewBox="-65 -65 130 130" className="w-full max-w-sm h-64 overflow-visible">
                {/* Axes */}
                <line x1="-55" y1="0" x2="55" y2="0" stroke="#CBD5E1" strokeWidth="0.8" strokeDasharray="2 2" />
                <line x1="0" y1="-55" x2="0" y2="55" stroke="#CBD5E1" strokeWidth="0.8" strokeDasharray="2 2" />

                {/* Trajectory Polyline */}
                {pcaPoints.length > 1 && (
                  <polyline
                    fill="none"
                    stroke="#4F46E5"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    points={pcaPoints.map((p) => `${p.x * 30},${-p.y * 30}`).join(' ')}
                  />
                )}

                {/* Trajectory Nodes */}
                {pcaPoints.map((p, idx) => (
                  <g key={idx} transform={`translate(${p.x * 30}, ${-p.y * 30})`}>
                    <circle
                      r={idx === pcaPoints.length - 1 ? 4.5 : 3.5}
                      fill={idx === 0 ? '#10B981' : idx === pcaPoints.length - 1 ? '#0D9488' : '#4F46E5'}
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />
                    <text
                      y={-6}
                      textAnchor="middle"
                      fill="#1E293B"
                      fontSize="4.5"
                      fontFamily="system-ui, sans-serif"
                      fontWeight="bold"
                    >
                      {p.label}
                    </text>
                  </g>
                ))}
              </svg>

              <div className="flex items-center gap-5 text-xs text-slate-600 mt-2">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Start (<MathInline math="S_0" />)</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-600" /> Updates</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-teal-600" /> Final (<MathInline math="S_R" />)</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              PCA projects the 48-dimensional continuous state vector into 2D to trace how recurrence moves representations through geometric space.
            </p>
          </div>
        </div>
      </div>

      {/* R-Sweep Confidence Curve */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 md:p-8 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <span>R-Sweep Confidence Curve (R = 1 → 10)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Observe how model confidence and correctness change as recurrence depth R increases.
            </p>
          </div>

          <button
            onClick={handleRunSweep}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Generate Sweep Curve</span>
          </button>
        </div>

        {sweepData && (
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2.5">
              {sweepData.curve.map((pt) => (
                <div
                  key={pt.R}
                  onClick={() => setR(pt.R)}
                  className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                    R === pt.R
                      ? 'border-indigo-600 bg-white shadow-sm ring-2 ring-indigo-500/20'
                      : pt.correct
                      ? 'border-emerald-200 bg-emerald-50/60'
                      : 'border-rose-200 bg-rose-50/60'
                  }`}
                >
                  <span className="text-[10px] font-mono text-slate-400 block font-bold">R={pt.R}</span>
                  <span className={`text-sm font-bold font-mono ${pt.correct ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {pt.prediction}
                  </span>
                  <span className="text-[10px] text-slate-500 block font-mono">
                    {(pt.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 text-center italic">
              Notice: Increasing R does not universally guarantee monotonic accuracy gains. Saturations and representation drift can occur.
            </p>
          </div>
        )}
      </div>

      {/* Empirical Failure Boundary */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 md:p-8 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-rose-600" />
            <h3 className="text-base font-bold text-slate-900">
              Empirical Failure Boundary: Where Does This Break?
            </h3>
          </div>
          <EvidenceBadge type="limitation" />
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Scientific honesty requires demonstrating where toy systems fail. 
          An educational toy model is useful because we can inspect not only where it works, but also where it fails:
        </p>

        {/* Failure Parameters Inspection Table */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-center text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-400 block font-bold uppercase">Ground Truth</span>
            <span className="text-base font-bold text-emerald-700 font-mono mt-0.5 block">{latentData?.ground_truth}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-400 block font-bold uppercase">Prediction</span>
            <span className={`text-base font-bold font-mono mt-0.5 block ${latentData?.correct ? 'text-emerald-700' : 'text-rose-700'}`}>
              {latentData?.prediction} {latentData?.correct ? '✓' : '✗'}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-400 block font-bold uppercase">Confidence</span>
            <span className="text-base font-bold text-indigo-700 font-mono mt-0.5 block">{((latentData?.confidence || 0) * 100).toFixed(1)}%</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-400 block font-bold uppercase">Difficulty</span>
            <span className="text-base font-bold text-slate-800 font-mono mt-0.5 block">Level {level}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-400 block font-bold uppercase">Modulus (n)</span>
            <span className="text-base font-bold text-slate-800 font-mono mt-0.5 block">Mod {modulus}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-400 block font-bold uppercase">Recurrence R</span>
            <span className="text-base font-bold text-indigo-700 font-mono mt-0.5 block">R = {R}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-950 space-y-1">
          <div>• <strong>Current Task:</strong> <code className="font-mono text-rose-900 font-semibold">{latentData?.expression}</code></div>
          <div>• <strong>Key Takeaway:</strong> A toy recurrent MLP cannot magically solve arbitrary compositional arithmetic simply by increasing latent iterations without structured working memory (such as BDH synaptic plasticity).</div>
        </div>
      </div>

      {/* Storytelling Transition to Next Chapter */}
      <div className="p-6 md:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs uppercase tracking-wider text-indigo-600 font-bold block">
            Pedagogical Progression: Chapter 04 ➔ Chapter 05
          </span>
          <p className="text-xs sm:text-sm text-slate-700 font-medium">
            What happens when the architecture provides memory through a completely different mechanism — replacing growing KV-caches with dynamic synaptic plasticity?
          </p>
        </div>
        <button
          onClick={onNextChapter}
          className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
        >
          <span>Continue → BDH Research Frontier</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
