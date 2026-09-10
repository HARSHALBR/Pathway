import React, { useState, useEffect } from 'react';
import { simulateBDH } from '../services/api';
import type { BDHSimulateResponse } from '../types/api';
import { EvidenceBadge } from '../components/common/EvidenceBadge';
import { MathFormula, MathInline } from '../components/common/MathFormula';
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
    <div className="lab-container py-8 md:py-12 space-y-10">
      {/* Chapter Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
            Chapter 05 • BDH Research Frontier
          </span>
          <EvidenceBadge type="primary" />
          <EvidenceBadge type="published" />
          <EvidenceBadge type="toy" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          BDH & BDH-CQ Research Frontier: Dynamic Synaptic Working Memory
        </h1>

        <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-4xl">
          Bridging educational toy models to Pathway's published research on 
          <strong className="text-slate-900"> Baby Dragon Hatchling (BDH)</strong> and <strong className="text-slate-900">BDH-CQ</strong>. 
          Discover how fixed-size synaptic state matrices replace expanding KV-caches through brain-inspired Hebbian plasticity.
        </p>
      </div>

      {/* Prominent Scientific Demarcation Card */}
      <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Scientific Demarcation & Provenance Notice
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <EvidenceBadge type="toy" />
            <EvidenceBadge type="published" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          <div className="p-5 rounded-xl bg-indigo-50/50 border border-indigo-200/70 space-y-2">
            <span className="font-bold text-indigo-900 block text-xs uppercase flex items-center gap-1.5">
              <span>🟢</span> What you are seeing:
            </span>
            <p className="text-slate-700 leading-relaxed text-sm">
              A simplified, inspectable <strong>BDH-inspired educational abstraction</strong> (4×4 Hebbian fast-weight matrix) designed to make the mathematical mechanics of dynamic synaptic working memory transparent to learners.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-rose-800 block text-xs uppercase flex items-center gap-1.5">
              <span>⚠️</span> What you are not seeing:
            </span>
            <p className="text-slate-600 leading-relaxed text-sm">
              The <strong>official production implementation of BDH or BDH-CQ</strong>. This toy simulation does not duplicate the multi-layer continuous-time neural ODEs or Context-Query reasoning loops published in Pathway's literature.
            </p>
          </div>
        </div>
      </div>

      {/* 1. CONTROL SURFACE & HEBBIAN SIMULATOR */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Interactive 4×4 Hebbian Synaptic Simulator
              </h3>
            </div>
            <div className="mt-2 py-1 px-3 rounded-xl bg-slate-50 border border-slate-200 inline-block">
              <MathFormula math="S_t = \lambda S_{t-1} + K_t^T V_t, \qquad O_t = Q_t S_t" displayMode={false} className="text-slate-900 text-xs md:text-sm font-semibold" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500 mr-1 font-medium">Preset Pattern:</span>
            {[
              { id: 1, label: 'Semantic (cat ➔ pet)' },
              { id: 2, label: 'Action (chased ➔ mouse)' },
              { id: 3, label: 'Inhibitory (decay test)' },
              { id: 4, label: 'Orthogonal step' }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setStep(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  step === p.id
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm shadow-indigo-500/20'
                    : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Incoming K and V Vectors Display */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold font-sans">
              Incoming Key Vector <MathInline math="K_t \in \mathbb{R}^4" className="text-indigo-700" />
            </span>
            <span className="text-indigo-900 font-semibold">[{simData?.K_t.map(v => v.toFixed(2)).join(', ')}]</span>
          </div>
          <span className="text-slate-400 font-bold text-sm">⊗</span>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold font-sans">
              Incoming Value Vector <MathInline math="V_t \in \mathbb{R}^4" className="text-teal-700" />
            </span>
            <span className="text-teal-900 font-semibold">[{simData?.V_t.map(v => v.toFixed(2)).join(', ')}]</span>
          </div>
          <span className="text-slate-400 font-bold text-sm">=</span>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold font-sans">
              Outer-Product Association <MathInline math="\Delta S = K_t^T V_t" className="text-indigo-700 font-semibold" />
            </span>
            <span className="text-slate-700 font-sans">4×4 instantaneous fast-weight matrix</span>
          </div>
        </div>

        {/* Retention Slider */}
        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex justify-between items-baseline">
            <span className="text-xs text-indigo-900 font-bold flex items-center gap-1.5">
              <span>Memory Retention Coefficient (</span>
              <MathInline math={`\\lambda = ${decayLambda.toFixed(2)}`} />
              <span>)</span>
            </span>
            <span className="text-xs text-slate-500 font-medium">
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
            className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 border border-slate-300"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>λ = 0.0</span>
            <span>λ = 0.5 (Balanced)</span>
            <span>λ = 1.0 (Lossless)</span>
          </div>

          {/* Dynamic Explanation of λ */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 leading-relaxed shadow-2xs">
            💡 <strong>Causal Plasticity:</strong>{' '}
            {decayLambda === 0 ? (
              <span>
                Past memory contributes nothing to the new state (<MathInline math="0 \cdot S_{t-1}" />). The synaptic state is completely overwritten by the immediate incoming association <MathInline math="K_t^T V_t" />.
              </span>
            ) : decayLambda === 1 ? (
              <span>
                Previous memory is fully retained in this simplified accumulator (<MathInline math="1.0 \cdot S_{t-1} + K_t^T V_t" />). History accumulates indefinitely without decay.
              </span>
            ) : (
              <span>
                Previous memory is retained with reduced strength (scaled by <MathInline math={`\\lambda = ${decayLambda.toFixed(2)}`} />) while the new outer-product association <MathInline math="K_t^T V_t" /> is added, mimicking biological synaptic plasticity.
              </span>
            )}
          </div>
        </div>

        {/* 3 Matrix Panels: Decayed + Outer Product = S_new */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-500">
            <span>Hover matrix cells to view exact values</span>
            {hoveredMatrixCell && (
              <span className="font-mono text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-200 font-semibold">
                {hoveredMatrixCell.name}[{hoveredMatrixCell.r},{hoveredMatrixCell.c}] = {hoveredMatrixCell.val.toFixed(3)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Decayed Memory */}
            <div className="p-4 rounded-xl bg-teal-50/40 border border-teal-200/70 space-y-2.5 shadow-2xs">
              <span className="text-xs font-bold text-teal-900 block text-center">
                <MathInline math="\lambda \cdot S_{t-1}" /> (Decayed Past Memory)
              </span>
              <div className="grid grid-cols-4 gap-1.5 p-2.5 bg-white rounded-xl border border-teal-200">
                {decayedSPrev.map((row, r) =>
                  row.map((val, c) => (
                    <div
                      key={`dec-${r}-${c}`}
                      onMouseEnter={() => setHoveredMatrixCell({ name: 'λ·S_{t-1}', r, c, val })}
                      onMouseLeave={() => setHoveredMatrixCell(null)}
                      className="p-2 rounded-lg text-center font-mono text-[11px] bg-teal-50 text-teal-800 hover:bg-teal-100 cursor-pointer transition-colors font-medium"
                    >
                      {val.toFixed(2)}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* New Association */}
            <div className="p-4 rounded-xl bg-indigo-50/40 border border-indigo-200/70 space-y-2.5 shadow-2xs">
              <span className="text-xs font-bold text-indigo-900 block text-center">
                <MathInline math="K_t^T \cdot V_t" /> (New Association)
              </span>
              <div className="grid grid-cols-4 gap-1.5 p-2.5 bg-white rounded-xl border border-indigo-200">
                {outerProd.map((row, r) =>
                  row.map((val, c) => (
                    <div
                      key={`out-${r}-${c}`}
                      onMouseEnter={() => setHoveredMatrixCell({ name: 'K_t^T·V_t', r, c, val })}
                      onMouseLeave={() => setHoveredMatrixCell(null)}
                      className="p-2 rounded-lg text-center font-mono text-[11px] bg-indigo-50 text-indigo-800 hover:bg-indigo-100 cursor-pointer transition-colors font-medium"
                    >
                      {val.toFixed(2)}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Updated Synaptic State */}
            <div className="p-4 rounded-xl bg-purple-50/40 border border-purple-200/70 space-y-2.5 shadow-2xs">
              <span className="text-xs font-bold text-purple-900 block text-center">
                <MathInline math="S_t" /> (Updated Synaptic State)
              </span>
              <div className="grid grid-cols-4 gap-1.5 p-2.5 bg-white rounded-xl border border-purple-200">
                {SNew.map((row, r) =>
                  row.map((val, c) => (
                    <div
                      key={`snew-${r}-${c}`}
                      onMouseEnter={() => setHoveredMatrixCell({ name: 'S_t', r, c, val })}
                      onMouseLeave={() => setHoveredMatrixCell(null)}
                      className="p-2 rounded-lg text-center font-mono text-[11px] bg-purple-50 text-purple-900 hover:bg-purple-100 cursor-pointer font-bold transition-colors"
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
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-600 flex items-center gap-1.5 font-sans">
            <span className="font-semibold">Associative Readout:</span>
            <MathInline math="O_t = Q_t \cdot S_t \in \mathbb{R}^4" className="text-indigo-700 font-semibold" />
          </span>
          <span className="text-indigo-700 font-bold text-sm">
            [{Ot.map((v) => v.toFixed(3)).join(', ')}]
          </span>
        </div>
      </div>

      {/* Published Literature & Benchmarks */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 md:p-8 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>Published Literature: Pathway BDH & BDH-CQ Research</span>
          </h3>
          <EvidenceBadge type="published" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Paper 1: The Dragon Hatchling */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                PRIMARY PAPER
              </span>
              <span className="text-xs text-slate-400 font-mono">arXiv:2509.26507</span>
            </div>
            <h4 className="font-bold text-slate-900 text-sm">
              The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              Kosowski, Uznański, Chorowski, Stamirowska, Bartoszkiewicz (Pathway, Sept 2025)
            </p>
            <div className="text-xs text-slate-600 leading-relaxed space-y-2">
              <p>Replaces static token KV-caches with a fixed-size dynamic synaptic state matrix updated via continuous Hebbian plasticity:</p>
              <div className="py-2 px-3 rounded-xl bg-white border border-slate-200">
                <MathFormula math="\frac{d\sigma_{ij}}{dt} = \eta \cdot Y_i \cdot X_j - \lambda \cdot \sigma_{ij}" displayMode={false} className="text-indigo-700 text-xs font-semibold" />
              </div>
            </div>
          </div>

          {/* Paper 2: BDH-CQ */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                PRIMARY PAPER
              </span>
              <span className="text-xs text-slate-400 font-mono">arXiv:2608.09888</span>
            </div>
            <h4 className="font-bold text-slate-900 text-sm">
              BDH-CQ: In-Context Learning with Recurrent Latent Reasoning
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              Engdahl, Kosowski, Chorowski (Pathway, Bielik AI, NYU, Aug 2026)
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Introduces the Context-Query (CQ) framework for recurrent in-context reasoning in continuous latent space without emitting intermediate tokens.
            </p>
          </div>
        </div>

        {/* Published Benchmark Card */}
        <div className="p-6 rounded-2xl bg-indigo-50/50 border border-indigo-200/80 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-indigo-200/50 pb-3">
            <span className="text-xs font-bold text-indigo-900 uppercase tracking-wide">
              Reported Benchmark Telemetry for BDH-CQ (Engdahl et al., 2026)
            </span>
            <span className="text-[10px] font-semibold text-indigo-700 bg-white px-2.5 py-0.5 rounded-full border border-indigo-200">
              PUBLISHED EVIDENCE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-white border border-indigo-200/70 shadow-2xs">
              <span className="text-xs text-slate-500 block font-medium">ARC-AGI-1 Benchmark</span>
              <span className="text-2xl font-extrabold text-indigo-700 font-mono mt-1 block">29.5%</span>
              <span className="text-xs text-slate-400 block mt-0.5">pass@2 accuracy</span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-indigo-200/70 shadow-2xs">
              <span className="text-xs text-slate-500 block font-medium">Parameter Count</span>
              <span className="text-2xl font-extrabold text-teal-700 font-mono mt-1 block">150M</span>
              <span className="text-xs text-slate-400 block mt-0.5">compact scale</span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-indigo-200/70 shadow-2xs">
              <span className="text-xs text-slate-500 block font-medium">Inference Cost</span>
              <span className="text-2xl font-extrabold text-purple-700 font-mono mt-1 block">$0.0007</span>
              <span className="text-xs text-slate-400 block mt-0.5">per task evaluated</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. WHAT THIS MEANS: Scientific Demarcation Matrix */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 md:p-8 shadow-xs space-y-5">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          <span>Scientific Demarcation: Toy Simulator vs. Real BDH vs. BDH-CQ</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-600">
          To ensure strict scientific integrity, this table explicitly demarcates what is shared conceptually versus what is simplified:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Column 1: Toy Model */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
            <span className="text-xs font-bold text-indigo-700 uppercase block">1. Our Educational Simulator</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
              EDUCATIONAL ABSTRACTION
            </span>
            <ul className="text-slate-600 space-y-2 list-disc pl-4 pt-1 leading-relaxed">
              <li><strong>Concept Shared:</strong> Outer-product fast weights update a persistent matrix without sequence token expansion.</li>
              <li><strong>Simplification:</strong> Single 4×4 educational matrix; scalar decay <MathInline math="\lambda" />; synthetic arithmetic vectors.</li>
              <li><strong>Purpose:</strong> Transparent interactive inspection of matrix mechanics for learners.</li>
            </ul>
          </div>

          {/* Column 2: Real BDH */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
            <span className="text-xs font-bold text-slate-800 uppercase block">2. Real BDH (Pathway 2025)</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 border border-slate-300">
              PRIMARY RESEARCH
            </span>
            <ul className="text-slate-600 space-y-2 list-disc pl-4 pt-1 leading-relaxed">
              <li><strong>Core Contribution:</strong> Continuous-time Hebbian plasticity replaces the growing KV-cache.</li>
              <li><strong>Dynamics:</strong> <MathInline math="\frac{d\sigma_{ij}}{dt} = \eta Y_i X_j - \lambda \sigma_{ij}" /> operating across multi-layer neural networks.</li>
              <li><strong>Theoretical Proof:</strong> Establishes mathematical equivalence between Transformers and synaptic brain models.</li>
            </ul>
          </div>

          {/* Column 3: BDH-CQ */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
            <span className="text-xs font-bold text-purple-700 uppercase block">3. BDH-CQ (Pathway 2026)</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
              PUBLISHED BENCHMARK
            </span>
            <ul className="text-slate-600 space-y-2 list-disc pl-4 pt-1 leading-relaxed">
              <li><strong>Core Contribution:</strong> Context-Query (CQ) separation for in-context latent reasoning.</li>
              <li><strong>Latent Loop:</strong> Continuous state recurrence <MathInline math="z^{(r)} = \mathcal{R}(z^{(r-1)}, M_K, \psi(x^*))" /> with zero intermediate tokens.</li>
              <li><strong>ARC-AGI-1 Result:</strong> 29.5% pass@2 at 150M parameter scale and $0.0007 cost per task.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Architectural Comparison Matrix */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Architectural Comparison Matrix</h3>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                <th className="p-3.5">Dimension</th>
                <th className="p-3.5">Standard Transformer</th>
                <th className="p-3.5 text-indigo-700">Our Toy Laboratory Model</th>
                <th className="p-3.5 text-purple-700">Pathway BDH / BDH-CQ</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  dim: 'Intermediate Reasoning',
                  t: 'Discrete text tokens',
                  toy: <span>Continuous vector <MathInline math="S_t" /></span>,
                  bdh: <span>Recurrent latent state <MathInline math="z^{(r)}" /></span>
                },
                {
                  dim: 'Working Memory',
                  t: <span>KV-cache grows <MathInline math="O(L)" /></span>,
                  toy: <span>Fixed vector in <MathInline math="\mathbb{R}^{48}" /></span>,
                  bdh: <span>Dynamic synaptic matrix <MathInline math="S_t \in \mathbb{R}^{d \times d}" /></span>
                },
                {
                  dim: 'Memory Dynamics',
                  t: 'Static exact caching',
                  toy: <span>Residual addition <MathInline math="(s + \alpha \Delta)" /></span>,
                  bdh: <span>Hebbian plasticity with decay <MathInline math="(\lambda S)" /></span>
                },
                {
                  dim: 'Interpretability',
                  t: 'Human readable text',
                  toy: 'Vector heatmaps & PCA',
                  bdh: 'Associative memory projections'
                },
                {
                  dim: 'Scaling Bottleneck',
                  t: <span>Quadratic <MathInline math="O(L^2)" /> attention</span>,
                  toy: 'MLP parameter capacity',
                  bdh: 'Synaptic capacity limits'
                },
              ].map((row, i) => (
                <tr key={i} className="border-b border-slate-100 hover:bg-slate-50/70 text-slate-600 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">{row.dim}</td>
                  <td className="p-3.5 text-slate-600">{row.t}</td>
                  <td className="p-3.5 text-indigo-700 font-medium">{row.toy}</td>
                  <td className="p-3.5 text-purple-800 font-semibold">{row.bdh}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Storytelling Transition to Next Chapter */}
      <div className="p-6 md:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs uppercase tracking-wider text-indigo-600 font-bold block">
            Pedagogical Progression: Chapter 05 ➔ Chapter 06
          </span>
          <p className="text-xs sm:text-sm text-slate-700 font-medium">
            Can YOU now explain it? Test your architectural intuition in the 60-Second Diagnostic Challenge.
          </p>
        </div>
        <button
          onClick={onNextChapter}
          className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
        >
          <span>Continue → Diagnostic Challenge</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
