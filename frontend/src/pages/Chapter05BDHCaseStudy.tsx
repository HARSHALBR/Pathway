import React, { useState, useEffect } from 'react';
import { simulateBDH } from '../services/api';
import type { BDHSimulateResponse } from '../types/api';
import { EvidenceBadge } from '../components/common/EvidenceBadge';
import { ArrowRight, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';

interface Props {
  onNextChapter: () => void;
}

export const Chapter05BDHCaseStudy: React.FC<Props> = ({ onNextChapter }) => {
  const [decayLambda, setDecayLambda] = useState<number>(0.85);
  const [step, setStep] = useState<number>(1);
  const [simData, setSimData] = useState<BDHSimulateResponse | null>(null);
  const [hoveredMatrixCell, setHoveredMatrixCell] = useState<{ name: string; r: number; c: number; val: number } | null>(null);

  useEffect(() => {
    simulateBDH(decayLambda, step)
      .then((res) => setSimData(res))
      .catch((err) => console.error('BDH simulate error:', err));
  }, [decayLambda, step]);

  const decayedSPrev = simData?.decayed_S_prev || [];
  const outerProd = simData?.outer_product || [];
  const SNew = simData?.S_new || [];
  const Ot = simData?.O_t || [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Chapter Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-indigo-950 text-indigo-300 border border-indigo-700/50 font-semibold">
            CHAPTER 05
          </span>
          <EvidenceBadge type="primary" />
          <EvidenceBadge type="published" />
          <EvidenceBadge type="toy" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          BDH & BDH-CQ Research Frontier: Dynamic Synaptic Working Memory
        </h1>

        <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-3xl">
          Bridging educational toy models to Pathway's published research on 
          <strong className="text-white"> Baby Dragon Hatchling (BDH)</strong> and <strong className="text-white">BDH-CQ</strong>. 
          Discover how fixed-size synaptic state matrices replace expanding KV-caches through brain-inspired Hebbian plasticity.
        </p>
      </div>

      {/* Prominent Scientific Demarcation Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-purple-950/30 to-slate-950 border-2 border-purple-500/50 space-y-3 shadow-xl">
        <div className="flex items-center justify-between border-b border-purple-900/40 pb-2.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-400" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Scientific Demarcation & Honesty Notice
            </h4>
          </div>
          <div className="flex items-center gap-1.5">
            <EvidenceBadge type="toy" />
            <EvidenceBadge type="published" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/60 space-y-1">
            <span className="font-bold text-purple-300 font-mono block text-xs uppercase flex items-center gap-1.5">
              <span>🟢</span> WHAT YOU ARE SEEING:
            </span>
            <p className="text-slate-200 leading-relaxed">
              A simplified, inspectable <strong>BDH-inspired educational abstraction</strong> (4×4 Hebbian fast-weight matrix) designed to make the mathematical mechanics of dynamic synaptic working memory transparent to learners.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="font-bold text-rose-300 font-mono block text-xs uppercase flex items-center gap-1.5">
              <span>⚠️</span> WHAT YOU ARE NOT SEEING:
            </span>
            <p className="text-slate-300 leading-relaxed">
              The <strong>official production implementation of BDH or BDH-CQ</strong>. This toy simulation does not duplicate the multi-layer neural continuous-time ODEs or Context-Query reasoning loops published in Pathway's literature.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Hebbian Memory Simulator */}
      <div className="lab-glass-card p-6 border-slate-800 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h3 className="text-base font-bold text-white">
                Interactive 4×4 Hebbian Synaptic Simulator
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Formula: <code className="text-purple-300 font-mono">S_t = λ · S_{`{t-1}`} + K_t^T · V_t, \quad O_t = Q_t · S_t</code>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Incoming Pattern:</span>
            {[
              { id: 1, label: 'Semantic (cat ➔ pet)' },
              { id: 2, label: 'Action (chased ➔ mouse)' },
              { id: 3, label: 'Inhibitory (decay test)' },
              { id: 4, label: 'Orthogonal step' }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setStep(p.id)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                  step === p.id
                    ? 'bg-purple-600 text-white font-bold'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-purple-600/50'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Incoming K and V Vectors Display */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div>
            <span className="text-emerald-400 block text-[10px] uppercase font-bold">Incoming Key Vector K_t ∈ ℝ⁴</span>
            <span className="text-emerald-200">[{simData?.K_t.map(v => v.toFixed(2)).join(', ')}]</span>
          </div>
          <span className="text-slate-500 font-bold">⊗</span>
          <div>
            <span className="text-purple-400 block text-[10px] uppercase font-bold">Incoming Value Vector V_t ∈ ℝ⁴</span>
            <span className="text-purple-200">[{simData?.V_t.map(v => v.toFixed(2)).join(', ')}]</span>
          </div>
          <span className="text-slate-500 font-bold">=</span>
          <div>
            <span className="text-indigo-400 block text-[10px] uppercase font-bold">Outer-Product Association ΔS = K_t^T · V_t</span>
            <span className="text-indigo-200">4×4 instantaneous fast-weight matrix</span>
          </div>
        </div>

        {/* Retention Slider */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex justify-between items-baseline">
            <span className="text-xs font-mono text-purple-300 font-bold">
              Memory Retention Coefficient (λ = {decayLambda.toFixed(2)})
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {decayLambda === 0 ? 'Rapid Forgetting (λ=0)' : decayLambda === 1 ? 'Infinite Retention (λ=1)' : 'Exponential Plastic Decay'}
            </span>
          </div>
          <input
            type="range"
            min={0.0}
            max={1.0}
            step={0.05}
            value={decayLambda}
            onChange={(e) => setDecayLambda(Number(e.target.value))}
            className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>λ = 0.0</span>
            <span>λ = 0.5 (Balanced)</span>
            <span>λ = 1.0 (Lossless)</span>
          </div>

          {/* Dynamic Explanation of λ */}
          <div className="p-3 rounded-lg bg-purple-950/30 border border-purple-800/40 text-xs text-purple-200 leading-relaxed">
            💡 <strong>Dynamic Causal Explanation:</strong>{' '}
            {decayLambda === 0
              ? 'Past memory contributes nothing to the new state (0 · S_{t-1}). The synaptic state is completely overwritten by the immediate incoming association K_t^T · V_t.'
              : decayLambda === 1
              ? 'Previous memory is fully retained in this simplified accumulator (1.0 · S_{t-1} + K_t^T · V_t). History accumulates indefinitely without decay.'
              : `Previous memory is retained with reduced strength (scaled by λ = ${decayLambda.toFixed(2)}) while the new outer-product association K_t^T · V_t is added, mimicking biological synaptic plasticity.`}
          </div>
        </div>

        {/* 3 Matrix Panels: Decayed + Outer Product = S_new */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Hover matrix cells to view exact values</span>
            {hoveredMatrixCell && (
              <span className="font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800">
                {hoveredMatrixCell.name}[{hoveredMatrixCell.r},{hoveredMatrixCell.c}] = {hoveredMatrixCell.val.toFixed(3)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Decayed Memory */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold text-blue-400 block text-center">
                λ · S_{`{t-1}`} (Decayed Past Memory)
              </span>
              <div className="grid grid-cols-4 gap-1 p-2 bg-slate-950 rounded border border-slate-800">
                {decayedSPrev.map((row, r) =>
                  row.map((val, c) => (
                    <div
                      key={`dec-${r}-${c}`}
                      onMouseEnter={() => setHoveredMatrixCell({ name: 'λ·S_{t-1}', r, c, val })}
                      onMouseLeave={() => setHoveredMatrixCell(null)}
                      className="p-1.5 rounded text-center font-mono text-[10px] bg-blue-950/40 text-blue-300 hover:bg-blue-600/40 cursor-pointer"
                    >
                      {val.toFixed(2)}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* New Association */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-400 block text-center">
                K_t^T · V_t (New Association)
              </span>
              <div className="grid grid-cols-4 gap-1 p-2 bg-slate-950 rounded border border-slate-800">
                {outerProd.map((row, r) =>
                  row.map((val, c) => (
                    <div
                      key={`out-${r}-${c}`}
                      onMouseEnter={() => setHoveredMatrixCell({ name: 'K_t^T·V_t', r, c, val })}
                      onMouseLeave={() => setHoveredMatrixCell(null)}
                      className="p-1.5 rounded text-center font-mono text-[10px] bg-emerald-950/40 text-emerald-300 hover:bg-emerald-600/40 cursor-pointer"
                    >
                      {val.toFixed(2)}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Updated Synaptic State */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-purple-500/40 space-y-2">
              <span className="text-xs font-mono font-bold text-purple-300 block text-center">
                S_t (Updated Synaptic State)
              </span>
              <div className="grid grid-cols-4 gap-1 p-2 bg-slate-950 rounded border border-purple-900/50">
                {SNew.map((row, r) =>
                  row.map((val, c) => (
                    <div
                      key={`snew-${r}-${c}`}
                      onMouseEnter={() => setHoveredMatrixCell({ name: 'S_t', r, c, val })}
                      onMouseLeave={() => setHoveredMatrixCell(null)}
                      className="p-1.5 rounded text-center font-mono text-[10px] bg-purple-950/60 text-purple-200 hover:bg-purple-600/40 cursor-pointer font-bold"
                    >
                      {val.toFixed(2)}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Readout Vector */}
        <div className="p-3 rounded-lg bg-slate-950/90 border border-slate-800 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">Associative Readout: <code className="text-purple-300">O_t = Q_t · S_t ∈ ℝ⁴</code></span>
          <span className="text-purple-300 font-bold">
            [{Ot.map((v) => v.toFixed(3)).join(', ')}]
          </span>
        </div>
      </div>

      {/* Published Research Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-400" />
            <span>Published Literature: Pathway BDH & BDH-CQ Research</span>
          </h3>
          <EvidenceBadge type="published" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Paper 1: The Dragon Hatchling */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-700/50">
                PRIMARY PAPER
              </span>
              <span className="text-xs font-mono text-slate-400">arXiv:2509.26507</span>
            </div>
            <h4 className="font-bold text-white text-sm">
              The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain
            </h4>
            <p className="text-xs text-slate-400">
              Kosowski, Uznański, Chorowski, Stamirowska, Bartoszkiewicz (Pathway, Sept 2025)
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              Replaces static token KV-caches with a fixed-size dynamic synaptic state matrix updated via continuous Hebbian plasticity: 
              <code className="text-blue-300 block my-1 font-mono">dσ_ij / dt = η · Y_i · X_j - λ · σ_ij</code>
            </p>
          </div>

          {/* Paper 2: BDH-CQ */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-700/50">
                PRIMARY PAPER
              </span>
              <span className="text-xs font-mono text-slate-400">arXiv:2608.09888</span>
            </div>
            <h4 className="font-bold text-white text-sm">
              BDH-CQ: In-Context Learning with Recurrent Latent Reasoning
            </h4>
            <p className="text-xs text-slate-400">
              Engdahl, Kosowski, Chorowski (Pathway, Bielik AI, NYU, Aug 2026)
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              Introduces the Context-Query (CQ) framework for recurrent in-context reasoning in continuous latent space without emitting intermediate tokens.
            </p>
          </div>
        </div>

        {/* Published Benchmark Card */}
        <div className="p-5 rounded-xl bg-blue-950/20 border border-blue-500/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-blue-300">
              Reported Benchmark Results for BDH-CQ (Engdahl et al., 2026)
            </span>
            <span className="text-[10px] font-mono text-slate-400">🔵 PUBLISHED RESULT</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
              <span className="text-xs text-slate-400 block font-mono">ARC-AGI-1 Benchmark</span>
              <span className="text-xl font-bold text-blue-400 font-mono">29.5%</span>
              <span className="text-[10px] text-slate-500 block">pass@2 accuracy</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
              <span className="text-xs text-slate-400 block font-mono">Parameter Count</span>
              <span className="text-xl font-bold text-emerald-400 font-mono">150M</span>
              <span className="text-[10px] text-slate-500 block">compact scale</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
              <span className="text-xs text-slate-400 block font-mono">Inference Cost</span>
              <span className="text-xl font-bold text-amber-400 font-mono">$0.0007</span>
              <span className="text-[10px] text-slate-500 block">per task evaluated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Crucial Demarcation: Toy vs Real BDH vs BDH-CQ */}
      <div className="lab-glass-card p-6 border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-400" />
          <span>Scientific Demarcation: Our Toy Simulator vs. Real BDH vs. BDH-CQ</span>
        </h3>
        <p className="text-xs text-slate-300">
          To ensure strict scientific integrity, this table explicitly demarcates what is shared conceptually versus what is simplified:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Column 1: Toy Model */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-indigo-500/40 space-y-2">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase block">1. Our Educational Simulator</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
              🟡 TOY ABSTRACTION
            </span>
            <ul className="text-slate-300 space-y-1.5 list-disc pl-4 pt-1">
              <li><strong>Concept Shared:</strong> Outer-product fast weights update a persistent matrix without sequence token expansion.</li>
              <li><strong>Simplification:</strong> Single 4×4 educational matrix; scalar decay λ; synthetic arithmetic vectors.</li>
              <li><strong>Purpose:</strong> Transparent interactive inspection of matrix mechanics for learners.</li>
            </ul>
          </div>

          {/* Column 2: Real BDH */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-blue-500/40 space-y-2">
            <span className="text-xs font-mono font-bold text-blue-400 uppercase block">2. Real BDH (Pathway 2025)</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
              ⚪ PRIMARY RESEARCH
            </span>
            <ul className="text-slate-300 space-y-1.5 list-disc pl-4 pt-1">
              <li><strong>Core Contribution:</strong> Continuous-time Hebbian plasticity replaces the growing KV-cache.</li>
              <li><strong>Dynamics:</strong> dσ_ij/dt = η Y_i X_j - λ σ_ij operating across multi-layer neural networks.</li>
              <li><strong>Theoretical Proof:</strong> Establishes mathematical equivalence between Transformers and synaptic brain models.</li>
            </ul>
          </div>

          {/* Column 3: BDH-CQ */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-purple-500/40 space-y-2">
            <span className="text-xs font-mono font-bold text-purple-400 uppercase block">3. BDH-CQ (Pathway 2026)</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
              🔵 PUBLISHED BENCHMARK
            </span>
            <ul className="text-slate-300 space-y-1.5 list-disc pl-4 pt-1">
              <li><strong>Core Contribution:</strong> Context-Query (CQ) separation for in-context latent reasoning.</li>
              <li><strong>Latent Loop:</strong> Continuous state recurrence z^(r) = R(z^(r-1), M_K, ψ(x*)) with zero intermediate tokens.</li>
              <li><strong>ARC-AGI-1 Result:</strong> 29.5% pass@2 at 150M parameter scale and $0.0007 cost per task.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Architectural Comparison Table */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">Architectural Comparison Matrix</h3>
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/90">
          <table className="w-full text-xs font-mono text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-300">
                <th className="p-3">Dimension</th>
                <th className="p-3">Standard Transformer</th>
                <th className="p-3">Our Toy Laboratory Model</th>
                <th className="p-3">Pathway BDH / BDH-CQ</th>
              </tr>
            </thead>
            <tbody>
              {[
                { dim: 'Intermediate Reasoning', t: 'Discrete text tokens', toy: 'Continuous vector S_t', bdh: 'Recurrent latent state z^(r)' },
                { dim: 'Working Memory', t: 'KV-cache grows O(L)', toy: 'Fixed vector in ℝ⁴⁸', bdh: 'Dynamic synaptic matrix S_t ∈ ℝᵈˣᵈ' },
                { dim: 'Memory Dynamics', t: 'Static exact caching', toy: 'Residual addition (s + αΔ)', bdh: 'Hebbian plasticity with decay (λ·S)' },
                { dim: 'Interpretability', t: 'Human readable text', toy: 'Vector heatmaps & PCA', bdh: 'Associative memory projections' },
                { dim: 'Scaling Bottleneck', t: 'Quadratic O(L²) attention', toy: 'MLP parameter capacity', bdh: 'Synaptic capacity limits' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-slate-900 hover:bg-slate-900/40 text-slate-300">
                  <td className="p-3 font-bold text-white">{row.dim}</td>
                  <td className="p-3 text-amber-300">{row.t}</td>
                  <td className="p-3 text-indigo-300">{row.toy}</td>
                  <td className="p-3 text-purple-300 font-bold">{row.bdh}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Storytelling Transition to Next Chapter */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-indigo-950/40 border border-indigo-700/40 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold block">
            THE INTELLECTUAL JOURNEY: CHAPTER 05 ➔ CHAPTER 06
          </span>
          <p className="text-xs sm:text-sm text-slate-200 font-medium">
            Can YOU now explain it? Test your architectural intuition in the 60-Second Diagnostic Challenge.
          </p>
        </div>
        <button
          onClick={onNextChapter}
          className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
        >
          <span>Continue → Diagnostic Challenge</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
