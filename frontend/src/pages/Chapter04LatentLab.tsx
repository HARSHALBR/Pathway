import React, { useState, useEffect } from 'react';
import { runLatent, sweepLatent } from '../services/api';
import type { LatentRunResponse, LatentSweepResponse } from '../types/api';
import { EvidenceBadge } from '../components/common/EvidenceBadge';
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
    <div className="lab-container py-8 md:py-10 space-y-10">
      {/* ============================================================
          TOP: Chapter Header
          ============================================================ */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 font-semibold">
            CHAPTER 04 // LATENT LAB
          </span>
          <EvidenceBadge type="live" />
          <EvidenceBadge type="toy" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Latent Reasoning Laboratory: Reactive Recurrence Sandbox
        </h1>

        <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-4xl">
          Directly manipulate recurrence rounds <span className="font-mono text-cyan-300 font-bold">R</span>. 
          Every slider adjustment triggers a live forward pass through the pure NumPy recurrence engine, 
          generating the exact trajectory <span className="font-mono text-cyan-300">S₀ → S₁ → ... → S_R</span>.
        </p>
      </div>

      {/* ============================================================
          FULL-WIDTH CONTROL PANEL:
          - TOP ROW: Left (R=4 + Causal Explanation) | Right (Prediction / Ground Truth)
          - BOTTOM: Large Full-Width Slider
          - TASK CONFIGURATION BAR
          ============================================================ */}
      <div className="hierarchy-control p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-semibold flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>[1. What I Control] Recurrent Iteration Sandbox</span>
          </span>
          <span className="text-[11px] font-mono text-slate-400">Interactive Depth Control</span>
        </div>

        {/* Top Row: R value & Explanation (Left) vs Prediction/Ground Truth (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left: R Value & Causal Explanation */}
          <div className="lg:col-span-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex items-baseline gap-2 shrink-0">
              <span className="text-4xl sm:text-5xl font-extrabold font-mono text-cyan-300">
                R = {R}
              </span>
              <span className="text-xs text-slate-400 font-mono">rounds</span>
            </div>

            <div className="info-card p-3.5 text-xs text-slate-300 leading-relaxed space-y-1 flex-1">
              <span className="text-[11px] font-mono text-cyan-400 font-semibold flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                <span>Causal Mechanism of Recurrence Parameter R</span>
              </span>
              <p>
                R controls how many sequential non-linear transformations (<code className="text-cyan-300 font-mono">W₂ tanh(W₁ S_t + b₁)</code>) occur in latent space before the readout classification head.
                {R === 1
                  ? " At R = 1, only a single transition (S₀ ➔ S₁) occurs."
                  : R <= 4
                  ? ` At R = ${R}, the state undergoes ${R} sequential vector transformations in ℝ⁴⁸ without emitting any tokens.`
                  : ` At R = ${R}, deep latent recurrence takes place. Notice whether confidence or state deltas saturate.`}
              </p>
            </div>
          </div>

          {/* Right: Prediction & Ground Truth Status Card */}
          <div className="lg:col-span-4 flex items-center justify-end gap-3">
            <div className={`p-3.5 rounded-lg border flex-1 text-center ${
              isCorrect
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
            }`}>
              <span className="text-[10px] font-mono uppercase tracking-wider block text-slate-400">Prediction</span>
              <span className="text-xl font-mono font-bold">{latentData?.prediction ?? '...'}</span>
              <span className="text-[11px] block mt-0.5">{isCorrect ? '✓ Match' : '✗ Mispredict'}</span>
            </div>

            <div className="p-3.5 rounded-lg info-card border border-white/[0.08] flex-1 text-center">
              <span className="text-[10px] font-mono uppercase tracking-wider block text-slate-400">Ground Truth</span>
              <span className="text-xl font-mono font-bold text-white">{latentData?.ground_truth ?? '...'}</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">Native Math</span>
            </div>
          </div>
        </div>

        {/* Large Full-Width Slider */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between items-center text-xs font-mono text-slate-400">
            <span className="text-cyan-300 font-semibold">Slide to Adjust Recurrence Depth (R = 1 to 10):</span>
            <span>Current: R={R}</span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={R}
            onChange={(e) => setR(Number(e.target.value))}
            className="w-full h-3 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400 border border-slate-800"
          />
          <div className="flex justify-between text-[11px] font-mono text-slate-400 px-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
              <span
                key={val}
                onClick={() => setR(val)}
                className={`cursor-pointer transition-colors ${R === val ? 'text-cyan-300 font-bold' : 'hover:text-slate-200'}`}
              >
                {val}
              </span>
            ))}
          </div>
        </div>

        {/* Task Configuration Bar */}
        <div className="pt-3 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="text-slate-400 uppercase text-[11px]">Task:</span>
            <span className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-white font-bold text-sm">
              {latentData?.expression || 'Loading...'}
            </span>
            <button
              onClick={() => setSeed(Math.floor(Math.random() * 1000))}
              className="text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
            >
              Randomize (Seed {seed})
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Mod:</span>
              <select
                value={modulus}
                onChange={(e) => setModulus(Number(e.target.value))}
                className="py-1 px-2 rounded bg-slate-900 border border-slate-800 text-slate-200 text-xs cursor-pointer"
              >
                {[7, 11, 13, 17, 19, 23].map((m) => (
                  <option key={m} value={m}>Mod {m}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-slate-400">Diff:</span>
              {[1, 2, 3, 4].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevel(lvl)}
                  className={`px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
                    level === lvl ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  L{lvl}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          FULL-WIDTH VISUALIZATION AREA:
          ┌───────────────────────────────────┐
          │ State Evolution Matrix (Large)    │
          └───────────────────────────────────┘
          ┌─────────────────┬─────────────────┐
          │ Delta Norms     │ PCA Trajectory  │
          └─────────────────┴─────────────────┘
          ============================================================ */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>[2. What the Model Computed] Latent Recurrence Microscope</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">Fixed Dimension d = 48</span>
        </div>

        {/* 1. Large State Evolution Matrix Spanning Full Width */}
        <div className="instrument-panel p-6 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono border-b border-white/[0.08] pb-2.5">
            <span className="font-semibold text-slate-300">State Evolution Matrix S₀ → S_{R}</span>
            <span>Rows: Recurrence Rounds | Columns: 48 Continuous Latent Coordinates</span>
          </div>

          <div className="space-y-2 py-1">
            {states.map((st, roundIdx) => (
              <div key={roundIdx} className="flex items-center gap-3">
                <span className="w-14 text-right font-mono text-xs text-cyan-300 font-bold shrink-0">
                  S_{roundIdx}
                </span>
                <div className="flex gap-1 flex-1 overflow-x-auto py-0.5">
                  {st.map((val, dimIdx) => {
                    const normalized = Math.max(-1, Math.min(1, val));
                    const isPositive = normalized >= 0;
                    const alpha = Math.abs(normalized);
                    const bg = isPositive
                      ? `rgba(6, 182, 212, ${Math.max(0.18, alpha)})`
                      : `rgba(239, 68, 68, ${Math.max(0.18, alpha)})`;
                    return (
                      <div
                        key={dimIdx}
                        title={`Round S_${roundIdx}, Coordinate ${dimIdx}: ${val.toFixed(3)}`}
                        className="flex-1 min-w-[12px] h-7 rounded-xs matrix-cell cursor-pointer"
                        style={{ backgroundColor: bg }}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-[11px] text-slate-400 pt-2 font-mono border-t border-white/[0.06]">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-xs bg-rose-500/80 inline-block" /> Negative Activation</span>
            <span className="text-slate-500 text-[10px]">Inspect individual coordinates by hovering over cells</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-xs bg-cyan-500/80 inline-block" /> Positive Activation</span>
          </div>
        </div>

        {/* 2. Side-by-Side: Delta Norms (Left) and PCA Trajectory (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Delta Norms (||ΔS||₂) */}
          <div className="instrument-panel p-5 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-300 font-mono border-b border-white/[0.08] pb-2.5">
              <span className="font-semibold text-slate-200">State Transition Magnitudes</span>
              <code className="text-cyan-400 text-[11px]">||S_{`{t+1}`} - S_t||₂</code>
            </div>

            <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
              {deltas.map((norm, idx) => {
                const maxNorm = Math.max(...deltas, 1.0);
                const pct = Math.round((norm / maxNorm) * 100);
                const isLarge = norm > 0.5;
                return (
                  <div key={idx} className="p-3 rounded-lg info-card space-y-1.5">
                    <div className="flex justify-between text-xs font-mono text-slate-300">
                      <span className="font-semibold text-cyan-300">Recurrent Step S_{idx} ➔ S_{idx + 1}</span>
                      <span className="text-slate-200 font-bold">||ΔS||₂ = {norm.toFixed(4)}</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-cyan-500 rounded-full transition-all duration-200"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      Round {idx + 1} {isLarge ? 'substantially reshaped' : 'fine-tuned'} internal coordinates (magnitude {norm.toFixed(3)}) with 0 tokens emitted.
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: 2D PCA Trajectory */}
          <div className="instrument-panel p-5 space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-300 font-mono border-b border-white/[0.08] pb-2.5">
              <span className="font-semibold text-slate-200">2D Principal Component Trajectory</span>
              <span className="text-slate-500 text-[10px]">Projection of ℝ⁴⁸</span>
            </div>

            <div className="w-full flex-1 flex flex-col items-center justify-center p-4 bg-[#070A0F] rounded-lg border border-white/[0.06]">
              <svg viewBox="-65 -65 130 130" className="w-full max-w-sm h-64 overflow-visible">
                {/* Axes */}
                <line x1="-55" y1="0" x2="55" y2="0" stroke="#1E293B" strokeWidth="0.5" strokeDasharray="2 2" />
                <line x1="0" y1="-55" x2="0" y2="55" stroke="#1E293B" strokeWidth="0.5" strokeDasharray="2 2" />

                {/* Trajectory Polyline */}
                {pcaPoints.length > 1 && (
                  <polyline
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    points={pcaPoints.map((p) => `${p.x * 30},${-p.y * 30}`).join(' ')}
                  />
                )}

                {/* Trajectory Nodes */}
                {pcaPoints.map((p, idx) => (
                  <g key={idx} transform={`translate(${p.x * 30}, ${-p.y * 30})`}>
                    <circle
                      r={idx === pcaPoints.length - 1 ? 4 : 3}
                      fill={idx === 0 ? '#10b981' : idx === pcaPoints.length - 1 ? '#f59e0b' : '#06b6d4'}
                      stroke="#05070a"
                      strokeWidth="1"
                    />
                    <text
                      y={-5}
                      textAnchor="middle"
                      fill="#cbd5e1"
                      fontSize="4"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {p.label}
                    </text>
                  </g>
                ))}
              </svg>

              <div className="flex items-center gap-5 text-[11px] font-mono text-slate-400 mt-2">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Start (S₀)</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-400" /> Updates</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" /> Final (S_{R})</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-snug">
              PCA projects the 48-dimensional continuous state vector into 2D to trace how recurrence moves representations through geometric space.
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================
          3. OBSERVED DYNAMICS: R-Sweep Confidence Curve
          ============================================================ */}
      <div className="hierarchy-observed p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-violet-400" />
              <span>[3. WHAT CHANGED] R-Sweep Confidence Curve (R = 1 → 10)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Observe how model confidence and correctness change as recurrence depth R increases.
            </p>
          </div>

          <button
            onClick={handleRunSweep}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-mono border border-slate-700 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Generate Sweep Curve</span>
          </button>
        </div>

        {sweepData && (
          <div className="p-4 rounded-lg bg-[#070A0F] border border-white/[0.06] space-y-3">
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {sweepData.curve.map((pt) => (
                <div
                  key={pt.R}
                  onClick={() => setR(pt.R)}
                  className={`p-2 rounded-md border text-center cursor-pointer transition-all ${
                    R === pt.R
                      ? 'border-cyan-400 bg-cyan-950/60'
                      : pt.correct
                      ? 'border-emerald-700/40 bg-emerald-950/20'
                      : 'border-rose-700/40 bg-rose-950/20'
                  }`}
                >
                  <span className="text-[10px] font-mono text-slate-400 block">R={pt.R}</span>
                  <span className={`text-xs font-bold font-mono ${pt.correct ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {pt.prediction}
                  </span>
                  <span className="text-[9px] text-slate-400 block font-mono">
                    {(pt.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 text-center italic font-mono">
              Notice: Increasing R does not universally guarantee monotonic accuracy gains. Saturations and representation drift can occur.
            </p>
          </div>
        )}
      </div>

      {/* ============================================================
          5. WHAT THIS MEANS: Empirical Failure Boundary
          ============================================================ */}
      <div className="hierarchy-meaning p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-rose-400" />
            <h3 className="text-base font-bold text-white">
              [5. WHAT THIS MEANS] Empirical Failure Boundary: Where Does This Break?
            </h3>
          </div>
          <EvidenceBadge type="limitation" />
        </div>

        <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
          Scientific honesty requires demonstrating where toy systems fail. 
          An educational toy model is useful because we can inspect not only where it works, but also where it fails:
        </p>

        {/* Failure Parameters Inspection Table */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs font-mono">
          <div className="p-2.5 rounded-lg info-card">
            <span className="text-[10px] text-slate-400 block font-sans">Ground Truth</span>
            <span className="text-sm font-bold text-emerald-400">{latentData?.ground_truth}</span>
          </div>
          <div className="p-2.5 rounded-lg info-card">
            <span className="text-[10px] text-slate-400 block font-sans">Prediction</span>
            <span className={`text-sm font-bold ${latentData?.correct ? 'text-emerald-400' : 'text-rose-400'}`}>
              {latentData?.prediction} {latentData?.correct ? '✓' : '✗'}
            </span>
          </div>
          <div className="p-2.5 rounded-lg info-card">
            <span className="text-[10px] text-slate-400 block font-sans">Confidence</span>
            <span className="text-sm font-bold text-cyan-300">{((latentData?.confidence || 0) * 100).toFixed(1)}%</span>
          </div>
          <div className="p-2.5 rounded-lg info-card">
            <span className="text-[10px] text-slate-400 block font-sans">Difficulty</span>
            <span className="text-sm font-bold text-slate-300">Level {level}</span>
          </div>
          <div className="p-2.5 rounded-lg info-card">
            <span className="text-[10px] text-slate-400 block font-sans">Modulus (n)</span>
            <span className="text-sm font-bold text-slate-300">Mod {modulus}</span>
          </div>
          <div className="p-2.5 rounded-lg info-card">
            <span className="text-[10px] text-slate-400 block font-sans">Recurrence R</span>
            <span className="text-sm font-bold text-cyan-300">R = {R}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-rose-950/20 border border-rose-900/50 space-y-1 text-xs text-rose-200">
          <div>• <strong>Current Task:</strong> <code className="font-mono text-white">{latentData?.expression}</code></div>
          <div>• <strong>Key Takeaway:</strong> A toy recurrent MLP cannot magically solve arbitrary compositional arithmetic simply by increasing latent iterations without structured working memory (such as BDH synaptic plasticity).</div>
        </div>
      </div>

      {/* Storytelling Transition to Next Chapter */}
      <div className="p-6 rounded-xl instrument-panel flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block">
            PEDAGOGICAL PROGRESSION: CHAPTER 04 ➔ CHAPTER 05
          </span>
          <p className="text-xs sm:text-sm text-slate-200 font-medium">
            What happens when the architecture provides memory through a completely different mechanism — replacing growing KV-caches with dynamic synaptic plasticity?
          </p>
        </div>
        <button
          onClick={onNextChapter}
          className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors cursor-pointer"
        >
          <span>Continue → BDH Research Frontier</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
