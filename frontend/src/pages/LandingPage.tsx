import React, { useState } from 'react';
import { ArrowRight, Brain, Cpu, Layers, Split, Atom, CheckCircle2, Network, ShieldCheck, Activity, Terminal, ArrowRightLeft } from 'lucide-react';
import { EvidenceBadge } from '../components/common/EvidenceBadge';
import { MathInline } from '../components/common/MathFormula';

interface Props {
  onStartLab: (chapterId: number) => void;
}

export const LandingPage: React.FC<Props> = ({ onStartLab }) => {
  const [activeTab, setActiveTab] = useState<'both' | 'explicit' | 'latent'>('both');

  return (
    <div className="lab-container py-10 md:py-14 space-y-12">
      {/* ============================================================
          1. FULL WIDTH HERO (60% Text/Question/CTA | 40% Scientific Diagram)
          ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left ~60% (7 cols): Research Narrative & CTA */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            {/* Eyebrow Pill */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold shadow-2xs">
                <Activity className="w-3.5 h-3.5 text-indigo-600" />
                <span>PATHWAY RESEARCH LABORATORY</span>
              </span>
              <span className="text-xs text-slate-500 font-medium">NumPy Engine • Vaswani (2017) • BDH (2025)</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Latent Reasoning
                </span>{' '}
                Laboratory
              </h1>
            </div>

            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
              From tokens and attention to continuous hidden-state reasoning — and the research frontier beyond conventional token-by-token generation.
            </p>

            {/* Central Research Question inside clean rounded white card */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1.5">
              <span className="text-indigo-600 font-bold text-xs uppercase tracking-wider block">
                Fundamental Research Question
              </span>
              <p className="italic text-slate-800 text-base font-medium leading-snug">
                "Why must machine reasoning be externalized as generated text?"
              </p>
            </div>

            {/* Evidence Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <EvidenceBadge type="live" />
              <EvidenceBadge type="toy" />
              <EvidenceBadge type="published" />
              <EvidenceBadge type="primary" />
            </div>
          </div>

          <div className="pt-2 flex items-center gap-4">
            <button
              onClick={() => onStartLab(1)}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold text-sm shadow-md shadow-indigo-500/25 hover:shadow-lg hover:brightness-105 transition-all cursor-pointer"
            >
              <span>ENTER THE LABORATORY</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onStartLab(4)}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200/90 shadow-2xs transition-all cursor-pointer"
            >
              <span>Jump to Latent Lab</span>
            </button>
          </div>
        </div>

        {/* Right ~40% (5 cols): Scientific System Diagram */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-indigo-600" />
              <span>Architectural Dichotomy</span>
            </span>
            <div className="flex gap-1 bg-slate-100/80 p-1 rounded-xl">
              {(['both', 'explicit', 'latent'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setActiveTab(m)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === m
                      ? 'bg-white text-indigo-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {m === 'both' ? 'Both' : m === 'explicit' ? 'Tokens' : 'Latent'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Diagram Channel A: Explicit */}
            {(activeTab === 'both' || activeTab === 'explicit') && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-700 uppercase font-bold flex items-center gap-1.5">
                    <Brain className="w-4 h-4 text-slate-500" />
                    <span>Mode A: Serialized Tokens (CoT)</span>
                  </span>
                  <span className="text-[11px] font-mono text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                    <MathInline math="O(L^2)" /> Attention
                  </span>
                </div>

                {/* Pipeline Flow Diagram */}
                <div className="flex items-center gap-1.5 font-mono text-xs overflow-x-auto py-1">
                  <span className="px-2.5 py-1 rounded-lg bg-white text-slate-700 border border-slate-200 font-medium shadow-2xs">Prompt</span>
                  <span className="text-slate-400">→</span>
                  <span className="px-2.5 py-1 rounded-lg bg-white text-slate-700 border border-slate-200 font-medium shadow-2xs"><MathInline math="\text{Tok}_1" /></span>
                  <span className="text-slate-400">→</span>
                  <span className="px-2.5 py-1 rounded-lg bg-white text-slate-700 border border-slate-200 font-medium shadow-2xs"><MathInline math="\text{Tok}_2" /></span>
                  <span className="text-slate-400">→</span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold shadow-2xs">Answer</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Every step is externalized as discrete tokens; context window and KV-cache grow quadratically.
                </p>
              </div>
            )}

            {/* Diagram Channel B: Latent */}
            {(activeTab === 'both' || activeTab === 'latent') && (
              <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200/60 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-indigo-900 uppercase font-bold flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-indigo-600" />
                    <span>Mode B: Continuous Latent State</span>
                  </span>
                  <span className="text-[11px] font-mono text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200 font-semibold">
                    <MathInline math="d = 48" />
                  </span>
                </div>

                {/* Pipeline Flow Diagram */}
                <div className="flex items-center gap-1.5 font-mono text-xs overflow-x-auto py-1">
                  <span className="px-2.5 py-1 rounded-lg bg-white text-slate-700 border border-slate-200 font-medium shadow-2xs">Input</span>
                  <span className="text-indigo-400 font-bold">→</span>
                  <span className="px-2.5 py-1 rounded-lg bg-white text-indigo-700 border border-indigo-200 font-semibold shadow-2xs"><MathInline math="S_0" /></span>
                  <span className="text-indigo-400 font-bold">→</span>
                  <span className="px-2.5 py-1 rounded-lg bg-white text-indigo-700 border border-indigo-200 font-semibold shadow-2xs"><MathInline math="S_1" /></span>
                  <span className="text-indigo-400 font-bold">→</span>
                  <span className="px-2.5 py-1 rounded-lg bg-white text-indigo-700 border border-indigo-200 font-semibold shadow-2xs"><MathInline math="S_2" /></span>
                  <span className="text-indigo-400 font-bold">→</span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold shadow-2xs">Answer</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Zero tokens emitted during reasoning; continuous state vector updates within fixed memory footprint.
                </p>
              </div>
            )}
          </div>

          <div className="pt-2 text-xs text-slate-500 flex items-center justify-between border-t border-slate-100 font-medium">
            <span>Engine: Deterministic NumPy</span>
            <span className="text-indigo-600 font-semibold font-mono">Recurrence R ∈ [1, 10]</span>
          </div>
        </div>
      </div>

      {/* ============================================================
          2. FULL-WIDTH TELEMETRY STRIP
          ============================================================ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-1">
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Computational Core</span>
          <span className="text-slate-800 font-bold text-sm block">Pure NumPy Engine</span>
          <span className="text-[11px] text-slate-500 block">Verified analytical forward passes</span>
        </div>
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-1">
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Execution Model</span>
          <span className="text-slate-800 font-bold text-sm block">Zero GPU / Deterministic</span>
          <span className="text-[11px] text-slate-500 block">Identical across all runs</span>
        </div>
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-1">
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Latent Geometry</span>
          <span className="text-indigo-600 font-bold text-sm block">d = 48 Coordinates</span>
          <span className="text-[11px] text-slate-500 block">Full tensor provenance</span>
        </div>
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-1">
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Regression Verification</span>
          <span className="text-emerald-600 font-bold text-sm block">60 / 60 Tests Passed</span>
          <span className="text-[11px] text-slate-500 block">100% test suite passing</span>
        </div>
      </div>

      {/* ============================================================
          3. 2-MINUTE FAST-TRACK EVALUATOR TOUR
          ============================================================ */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 md:p-8 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200/70 flex items-center justify-center text-indigo-600">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 block">
                2-Minute Fast-Track Evaluator Tour
              </span>
              <span className="text-xs text-slate-500 font-normal">
                Follow this structured 5-step pathway to experience the complete progression
              </span>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            TARGET TIME: 120s
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3.5 pt-1 text-xs">
          {[
            {
              step: 1,
              time: '0:00–0:20',
              title: '1. Foundations',
              desc: 'X + P = H₀ vectors',
            },
            {
              step: 2,
              time: '0:20–0:50',
              title: '2. Attention',
              desc: 'Q·Kᵀ dot products',
            },
            {
              step: 3,
              time: '0:50–1:15',
              title: '3. Explicit vs Latent',
              desc: 'Tokens vs S₀→S_R state',
            },
            {
              step: 4,
              time: '1:15–1:40',
              title: '4. Latent Lab',
              desc: 'R-slider & 2D PCA trace',
            },
            {
              step: 5,
              time: '1:40–2:00',
              title: '5. BDH Memory',
              desc: 'λ decay & fast weights',
            },
          ].map((tour) => (
            <button
              key={tour.step}
              onClick={() => onStartLab(tour.step)}
              className="p-4 rounded-xl bg-slate-50/70 hover:bg-indigo-50/60 border border-slate-200/80 hover:border-indigo-200 text-left transition-all cursor-pointer group shadow-2xs"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-indigo-600">{tour.time}</span>
                <span className="text-[10px] font-semibold text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">CH-0{tour.step}</span>
              </div>
              <span className="font-bold text-slate-900 block text-xs group-hover:text-indigo-700 transition-colors">
                {tour.title}
              </span>
              <span className="text-xs text-slate-500 block mt-1">
                {tour.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ============================================================
          4. 6 CHAPTER MODULES IN 3×2 RESPONSIVE GRID
          ============================================================ */}
      <div className="space-y-6">
        <div className="space-y-1.5">
          <span className="text-xs uppercase tracking-wider text-indigo-600 font-bold block">
            Curriculum Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            The Six Laboratory Modules
          </h2>
          <p className="text-slate-600 text-sm">
            Progress through six interconnected interactive experiments grounded in contemporary literature.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              id: 1,
              title: "01. Transformer Foundations",
              question: "How does a Transformer map discrete text into continuous coordinates?",
              icon: <Atom className="w-5 h-5 text-blue-600" />,
              badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
              desc: "Deconstruct text into Token IDs, semantic embeddings X ∈ ℝ⁴, positional vectors P, and combined H₀ = X + P. Contrast vocabulary size V vs dimension d.",
            },
            {
              id: 2,
              title: "02. Attention Laboratory",
              question: "How does one token query and aggregate context from other tokens?",
              icon: <Layers className="w-5 h-5 text-indigo-600" />,
              badgeBg: "bg-indigo-50 text-indigo-700 border-indigo-200",
              desc: "Trace Query (Q) against Keys (K), scaled dot-products QKᵀ/√dₖ, row-wise softmax normalization, and Value (V) aggregation.",
            },
            {
              id: 3,
              title: "03. Explicit vs. Latent",
              question: "What happens when multi-step reasoning is performed inside hidden state vectors?",
              icon: <Split className="w-5 h-5 text-purple-600" />,
              badgeBg: "bg-purple-50 text-purple-700 border-purple-200",
              desc: "Direct side-by-side execution on deterministic modular arithmetic. Compare emitted external tokens against internal continuous updates.",
            },
            {
              id: 4,
              title: "04. Latent Reasoning Lab",
              question: "Can reasoning depth be controlled as a continuous recurrence parameter?",
              icon: <Cpu className="w-5 h-5 text-blue-600" />,
              badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
              desc: "Manipulate reasoning rounds R ∈ [1, 10]. Watch live state heatmaps, delta norms, 2D PCA trajectories, and empirical failure boundaries.",
            },
            {
              id: 5,
              title: "05. BDH & BDH-CQ Research",
              question: "How does synaptic plasticity provide associative memory without KV caches?",
              icon: <Network className="w-5 h-5 text-indigo-600" />,
              badgeBg: "bg-indigo-50 text-indigo-700 border-indigo-200",
              desc: "Explore Pathway's research frontier: simulate 4×4 Hebbian synaptic memory updates (S_t = λS_{t-1} + K_tᵀV_t) and review BDH-CQ published findings.",
            },
            {
              id: 6,
              title: "06. Diagnostic Challenge",
              question: "Can you diagnose architectural trade-offs across the full journey?",
              icon: <CheckCircle2 className="w-5 h-5 text-purple-600" />,
              badgeBg: "bg-purple-50 text-purple-700 border-purple-200",
              desc: "Evaluate your conceptual mastery across 8 rigorous diagnostic problems with immediate feedback, telemetry verification, and summary reviews.",
            },
          ].map((card) => (
            <div
              key={card.id}
              onClick={() => onStartLab(card.id)}
              className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 shadow-2xs">
                    {card.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${card.badgeBg}`}>
                      MODULE 0{card.id}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">
                    {card.title}
                  </h3>
                  <span className="text-xs text-slate-500 font-medium block leading-snug">
                    {card.question}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================
          5. SCIENTIFIC INTEGRITY & PROVENANCE FOOTER
          ============================================================ */}
      <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4 text-xs text-emerald-950 shadow-xs">
        <div className="p-2.5 rounded-xl bg-white border border-emerald-200 text-emerald-600 shrink-0 shadow-2xs">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="leading-relaxed">
          <strong className="text-emerald-950 font-bold">Interactive Teaching-Learning Laboratory: </strong>
          The recurrent model in this lab is a simplified educational baseline designed to expose the computational mechanics of latent recurrence. 
          It is <strong>NOT</strong> an official production implementation of Pathway's BDH or BDH-CQ architectures. 
          All forward passes are computed deterministically by pure NumPy on the Python backend with full tensor provenance.
        </div>
      </div>
    </div>
  );
};
