import React, { useState, useEffect } from 'react';
import { runLatent, sweepLatent } from '../services/api';
import type { LatentRunResponse, LatentSweepResponse } from '../types/api';
import { EvidenceBadge } from '../components/common/EvidenceBadge';
import { Cpu, ArrowRight, RefreshCw, AlertOctagon, TrendingUp } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'matrix' | 'deltas' | 'pca'>('matrix');

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
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Chapter Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-indigo-950 text-indigo-300 border border-indigo-700/50 font-semibold">
            CHAPTER 04
          </span>
          <EvidenceBadge type="live" />
          <EvidenceBadge type="toy" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Latent Reasoning Laboratory: Reactive Recurrence Sandbox
        </h1>

        <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-3xl">
          Directly manipulate recurrence rounds <span className="font-mono text-indigo-300 font-bold">R</span>. 
          Every slider adjustment triggers a live forward pass through the pure NumPy recurrence engine, 
          generating the exact trajectory <span className="font-mono text-indigo-300">S₀ → S₁ → ... → S_R</span>.
        </p>
      </div>

      {/* Primary Control: Large Reactive R Slider */}
      <div className="lab-glass-card p-6 border-indigo-500/50 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold block">
              Core Recurrence Control
            </span>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-3xl md:text-4xl font-extrabold font-mono text-white">
                R = {R}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ({R} recurrent updates executed in code)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 ${
              isCorrect
                ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-300 font-bold'
                : 'bg-rose-950/70 border-rose-500/60 text-rose-300 font-bold'
            }`}>
              <span className="text-sm font-mono">Prediction: {latentData?.prediction}</span>
              <span className="text-xs">({isCorrect ? '✓ Match' : '✗ Mispredict'})</span>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-mono uppercase">Ground Truth</span>
              <span className="text-base font-mono font-bold text-white">{latentData?.ground_truth}</span>
            </div>
          </div>
        </div>

        {/* The Slider */}
        <div className="space-y-2">
          <input
            type="range"
            min={1}
            max={10}
            value={R}
            onChange={(e) => setR(Number(e.target.value))}
            className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span>R = 1 (Single update)</span>
            <span>R = 5 (Standard depth)</span>
            <span>R = 10 (Deep recurrence)</span>
          </div>
        </div>

        {/* Dynamic Causal Explanation of R */}
        <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/40 text-xs text-slate-200 leading-relaxed space-y-1">
          <div className="flex items-center gap-2 text-indigo-300 font-bold font-mono">
            <span>R = {R} Recurrent Computation Rounds Active</span>
          </div>
          <p>
            💡 <strong>Pedagogical Insight:</strong> R controls how many internal recurrent computation rounds occur before the final readout. Increasing R gives the model additional opportunities to transform its internal state (<code className="text-indigo-300 font-mono">S_t ∈ ℝ⁴⁸</code>) without emitting another reasoning token.
            {R === 1
              ? " At R = 1, only a single transition (S₀ ➔ S₁) occurs, providing minimal opportunity for non-linear state refinement."
              : R <= 4
              ? ` At R = ${R}, the state undergoes ${R} sequential non-linear matrix transformations before the readout classification head.`
              : ` At R = ${R}, deep latent recurrence takes place. Notice that beyond a certain depth, state adjustments diminish or saturate; increasing R does not automatically guarantee higher accuracy.`}
          </p>
        </div>

        {/* Task Parameter Subcontrols */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-slate-400">Task Expression:</span>
              <button
                onClick={() => setSeed(Math.floor(Math.random() * 1000))}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 font-mono underline cursor-pointer"
              >
                Randomize (Seed {seed})
              </button>
            </div>
            <span className="font-mono font-bold text-white text-sm">
              {latentData?.expression || 'Loading...'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block mb-1">Modulus (n):</span>
            <select
              value={modulus}
              onChange={(e) => setModulus(Number(e.target.value))}
              className="w-full py-1 px-2.5 rounded bg-slate-900 border border-slate-800 text-slate-200 font-mono"
            >
              {[7, 11, 13, 17, 19, 23].map((m) => (
                <option key={m} value={m}>Mod {m}</option>
              ))}
            </select>
          </div>

          <div>
            <span className="text-slate-400 block mb-1">Difficulty:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevel(lvl)}
                  className={`flex-1 py-1 rounded text-xs font-mono font-bold ${
                    level === lvl ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  L{lvl}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Three Coordinated Visualizations */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span>Coordinated State Dynamics Visualizations</span>
          </h3>

          {/* Tab Selector */}
          <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === 'matrix' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              State Matrix Heatmap
            </button>
            <button
              onClick={() => setActiveTab('deltas')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === 'deltas' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Delta Norms (||ΔS||₂)
            </button>
            <button
              onClick={() => setActiveTab('pca')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === 'pca' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              2D PCA Trajectory
            </button>
          </div>
        </div>

        {/* Tab 1: State Matrix Heatmap */}
        {activeTab === 'matrix' && (
          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Rows: Reasoning Rounds (S₀ → S_R) | Columns: 48 Latent Dimensions</span>
              <span className="font-mono text-indigo-400">Fixed Dimension d = 48</span>
            </div>

            <div className="overflow-x-auto space-y-1 py-2">
              {states.map((st, roundIdx) => (
                <div key={roundIdx} className="flex items-center gap-2">
                  <span className="w-14 text-right font-mono text-xs text-indigo-300 font-bold shrink-0">
                    S_{roundIdx}
                  </span>
                  <div className="flex gap-0.5 overflow-x-auto">
                    {st.map((val, dimIdx) => {
                      const normalized = Math.max(-1, Math.min(1, val));
                      const isPositive = normalized >= 0;
                      const alpha = Math.abs(normalized);
                      const bg = isPositive
                        ? `rgba(99, 102, 241, ${Math.max(0.15, alpha)})`
                        : `rgba(239, 68, 68, ${Math.max(0.15, alpha)})`;
                      return (
                        <div
                          key={dimIdx}
                          title={`Round S_${roundIdx}, Dim ${dimIdx}: ${val.toFixed(3)}`}
                          className="w-3.5 h-6 rounded-xs hover:scale-125 transition-transform cursor-pointer"
                          style={{ backgroundColor: bg }}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 font-mono border-t border-slate-900">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-xs bg-rose-500/80 inline-block" /> Negative Activation</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-xs bg-indigo-500/80 inline-block" /> Positive Activation</span>
            </div>
          </div>
        )}

        {/* Tab 2: State Change Deltas */}
        {activeTab === 'deltas' && (
          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-4">
            <div className="text-xs text-slate-400">
              L2 Norm of State Change per Round: <code className="text-emerald-300 font-mono">||S_{`{t+1}`} - S_t||₂</code>
            </div>

            <div className="space-y-3 pt-2">
              {deltas.map((norm, idx) => {
                const maxNorm = Math.max(...deltas, 1.0);
                const pct = Math.round((norm / maxNorm) * 100);
                const isLarge = norm > 0.5;
                return (
                  <div key={idx} className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1.5">
                    <div className="flex justify-between text-xs font-mono text-slate-300">
                      <span className="font-bold text-indigo-300">Recurrent Step S_{idx} ➔ S_{idx + 1}</span>
                      <span className="text-emerald-400 font-bold">||ΔS||₂ = {norm.toFixed(4)}</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      💡 <strong>Pedagogical Meaning:</strong> Round {idx + 1} {isLarge ? 'substantially reshaped' : 'moderately fine-tuned'} the continuous internal representation (magnitude {norm.toFixed(3)}). 
                      The model executed another round of non-linear matrix computation (<code className="text-indigo-300 font-mono">W₂ tanh(W₁ s + b₁)</code>) <strong>without adding a single token to the context window</strong>.
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: 2D PCA Trajectory */}
        {activeTab === 'pca' && (
          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>2D Principal Component Projection of 48-Dimensional Trajectory</span>
              <span className="text-amber-400 font-mono text-[10px]">⚠️ Visualization projection only; not raw model state</span>
            </div>

            <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-800/80 flex flex-col items-center">
              <svg viewBox="-60 -60 120 120" className="w-full max-w-md h-64 overflow-visible">
                {/* Axes */}
                <line x1="-50" y1="0" x2="50" y2="0" stroke="#334155" strokeWidth="0.5" strokeDasharray="2 2" />
                <line x1="0" y1="-50" x2="0" y2="50" stroke="#334155" strokeWidth="0.5" strokeDasharray="2 2" />

                {/* Trajectory Polyline */}
                {pcaPoints.length > 1 && (
                  <polyline
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    points={pcaPoints.map((p) => `${p.x * 30},${-p.y * 30}`).join(' ')}
                  />
                )}

                {/* Trajectory Nodes */}
                {pcaPoints.map((p, idx) => (
                  <g key={idx} transform={`translate(${p.x * 30}, ${-p.y * 30})`}>
                    <circle
                      r={idx === pcaPoints.length - 1 ? 4.5 : 3}
                      fill={idx === 0 ? '#10b981' : idx === pcaPoints.length - 1 ? '#f59e0b' : '#6366f1'}
                      stroke="#0f172a"
                      strokeWidth="1"
                    />
                    <text
                      y={-6}
                      textAnchor="middle"
                      fill="#e2e8f0"
                      fontSize="4.5"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {p.label}
                    </text>
                  </g>
                ))}
              </svg>

              <div className="flex items-center gap-4 text-xs font-mono text-slate-400 mt-2">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Start (S₀)</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Latent Updates</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Final State (S_{R})</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* R-Sweep Confidence Curve */}
      <div className="lab-glass-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>R-Sweep Confidence Curve (R = 1 → 10)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Observe how model confidence and correctness change as recurrence depth R increases.
            </p>
          </div>

          <button
            onClick={handleRunSweep}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Generate Curve</span>
          </button>
        </div>

        {sweepData && (
          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {sweepData.curve.map((pt) => (
                <div
                  key={pt.R}
                  onClick={() => setR(pt.R)}
                  className={`p-2 rounded-lg border text-center cursor-pointer transition-all ${
                    R === pt.R
                      ? 'border-indigo-400 bg-indigo-950/60 scale-105'
                      : pt.correct
                      ? 'border-emerald-700/40 bg-emerald-950/20'
                      : 'border-rose-700/40 bg-rose-950/20'
                  }`}
                >
                  <span className="text-[10px] font-mono text-slate-400 block">R={pt.R}</span>
                  <span className={`text-xs font-bold font-mono ${pt.correct ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {pt.prediction}
                  </span>
                  <span className="text-[9px] text-slate-400 block">
                    {(pt.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 text-center italic">
              Notice: Increasing R does not universally guarantee monotonic accuracy gains. Saturations and representation drift can occur.
            </p>
          </div>
        )}
      </div>

      {/* Failure Mode Section: WHERE DOES THIS BREAK? */}
      <div className="lab-glass-card p-5 border-l-4 border-l-rose-500 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-rose-400" />
            <h3 className="text-base font-bold text-white">Where Does This Break? (Empirical Failure Boundary)</h3>
          </div>
          <EvidenceBadge type="limitation" />
        </div>

        <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
          Scientific honesty requires demonstrating where toy systems fail. 
          An educational toy model is useful because we can inspect not only where it works, but also where it fails:
        </p>

        {/* Failure Parameters Inspection Table */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs font-mono">
          <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-sans">Ground Truth</span>
            <span className="text-sm font-bold text-emerald-400">{latentData?.ground_truth}</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-sans">Prediction</span>
            <span className={`text-sm font-bold ${latentData?.correct ? 'text-emerald-400' : 'text-rose-400'}`}>
              {latentData?.prediction} {latentData?.correct ? '✓' : '✗'}
            </span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-sans">Confidence</span>
            <span className="text-sm font-bold text-indigo-300">{((latentData?.confidence || 0) * 100).toFixed(1)}%</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-sans">Difficulty</span>
            <span className="text-sm font-bold text-amber-300">Level {level}</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-sans">Modulus (n)</span>
            <span className="text-sm font-bold text-purple-300">Mod {modulus}</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-sans">Recurrence R</span>
            <span className="text-sm font-bold text-teal-300">R = {R}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-rose-950/20 border border-rose-900/50 space-y-1.5 text-xs text-rose-200">
          <div>• <strong>Current Task:</strong> <code className="font-mono text-white">{latentData?.expression}</code></div>
          <div>• <strong>Key Takeaway:</strong> A toy recurrent MLP cannot magically solve arbitrary compositional arithmetic simply by increasing latent iterations without structured working memory (e.g. BDH-style synaptic plasticity).</div>
        </div>
      </div>

      {/* Storytelling Transition to Next Chapter */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-indigo-950/40 border border-indigo-700/40 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold block">
            THE INTELLECTUAL JOURNEY: CHAPTER 04 ➔ CHAPTER 05
          </span>
          <p className="text-xs sm:text-sm text-slate-200 font-medium">
            What happens when the architecture itself gives memory a different mechanism — replacing the growing KV-cache with dynamic synaptic plasticity?
          </p>
        </div>
        <button
          onClick={onNextChapter}
          className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
        >
          <span>Continue → BDH Research Frontier</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
