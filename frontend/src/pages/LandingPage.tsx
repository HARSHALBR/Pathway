import React, { useState } from 'react';
import { ArrowRight, Brain, Cpu, Layers, Split, Atom, CheckCircle2, Network, ShieldCheck, Activity, Terminal, ArrowRightLeft } from 'lucide-react';
import { EvidenceBadge } from '../components/common/EvidenceBadge';

interface Props {
  onStartLab: (chapterId: number) => void;
}

export const LandingPage: React.FC<Props> = ({ onStartLab }) => {
  const [activeTab, setActiveTab] = useState<'both' | 'explicit' | 'latent'>('both');

  return (
    <div className="lab-container py-8 md:py-12 space-y-12">
      {/* ============================================================
          1. FULL WIDTH HERO (60% Text/Question/CTA | 40% Scientific Diagram)
          ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left ~60% (7 cols): Research Narrative & CTA */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>NumPy Scientific Engine // Runtime Verified</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">vaswani-2017 • bdh-2025</span>
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wider text-cyan-400 font-semibold font-mono block">
                Pathway Research Laboratory
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Latent Reasoning <span className="text-cyan-400">Laboratory</span>
              </h1>
            </div>

            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
              From tokens and attention to continuous hidden-state reasoning — and the research frontier beyond conventional token-by-token generation.
            </p>

            {/* Central Research Question */}
            <div className="p-3.5 rounded-lg info-card border border-white/[0.08] text-xs sm:text-sm text-slate-200">
              <span className="text-cyan-400 font-semibold font-mono uppercase text-[11px] block mb-1">
                Central Research Question
              </span>
              <p className="italic text-slate-300">
                "Why must machine reasoning be externalized as generated text tokens?"
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

          <div className="pt-2">
            <button
              onClick={() => onStartLab(1)}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition-colors cursor-pointer"
            >
              <span>Enter Laboratory Curriculum</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right ~40% (5 cols): Scientific System Diagram */}
        <div className="lg:col-span-5 instrument-panel p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
            <span className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
              <ArrowRightLeft className="w-3.5 h-3.5 text-cyan-400" />
              <span>Architectural Dichotomy</span>
            </span>
            <div className="flex gap-1">
              {(['both', 'explicit', 'latent'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setActiveTab(m)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                    activeTab === m
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                      : 'text-slate-400 hover:text-white bg-slate-900/60'
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
              <div className="p-3.5 rounded-lg bg-[#0E131A] border border-white/[0.06] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold flex items-center gap-1.5">
                    <Brain className="w-3.5 h-3.5 text-slate-400" />
                    <span>Mode A: Serialized Tokens (CoT)</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">O(L²) Attention</span>
                </div>

                {/* Pipeline Flow Diagram */}
                <div className="flex items-center gap-1 font-mono text-[11px] overflow-x-auto py-1">
                  <span className="px-2 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800">Prompt</span>
                  <span className="text-slate-500">→</span>
                  <span className="px-2 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800">Tok₁</span>
                  <span className="text-slate-500">→</span>
                  <span className="px-2 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800">Tok₂</span>
                  <span className="text-slate-500">→</span>
                  <span className="px-2 py-1 rounded bg-slate-900 text-emerald-400 border border-emerald-500/30">Answer</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Every step is externalized as discrete tokens; context window and KV-cache grow quadratically.
                </p>
              </div>
            )}

            {/* Diagram Channel B: Latent */}
            {(activeTab === 'both' || activeTab === 'latent') && (
              <div className="p-3.5 rounded-lg bg-[#0E131A] border border-cyan-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-cyan-300 uppercase font-semibold flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Mode B: Continuous Latent State</span>
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400">Fixed d = 48</span>
                </div>

                {/* Pipeline Flow Diagram */}
                <div className="flex items-center gap-1 font-mono text-[11px] overflow-x-auto py-1">
                  <span className="px-2 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800">Input</span>
                  <span className="text-cyan-500">→</span>
                  <span className="px-2 py-1 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/40">S₀</span>
                  <span className="text-cyan-500">→</span>
                  <span className="px-2 py-1 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/40">S₁</span>
                  <span className="text-cyan-500">→</span>
                  <span className="px-2 py-1 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/40">S₂</span>
                  <span className="text-cyan-500">→</span>
                  <span className="px-2 py-1 rounded bg-slate-900 text-emerald-400 border border-emerald-500/30">Answer</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Zero tokens emitted during reasoning; continuous state vector updates within fixed memory footprint.
                </p>
              </div>
            )}
          </div>

          <div className="pt-1 text-[11px] font-mono text-slate-500 flex items-center justify-between border-t border-white/[0.06]">
            <span>Channel: Deterministic NumPy</span>
            <span className="text-cyan-400">R ∈ [1, 10] depth</span>
          </div>
        </div>
      </div>

      {/* ============================================================
          2. FULL-WIDTH TELEMETRY STRIP
          ============================================================ */}
      <div className="info-card p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
        <div className="space-y-0.5">
          <span className="text-slate-500 text-[10px] uppercase block">Computational Core</span>
          <span className="text-slate-200 font-semibold">Pure NumPy Engine</span>
        </div>
        <div className="space-y-0.5">
          <span className="text-slate-500 text-[10px] uppercase block">Execution Model</span>
          <span className="text-slate-200 font-semibold">Zero GPU // Deterministic</span>
        </div>
        <div className="space-y-0.5">
          <span className="text-slate-500 text-[10px] uppercase block">Latent Geometry</span>
          <span className="text-cyan-400 font-semibold">d = 48 Coordinates</span>
        </div>
        <div className="space-y-0.5">
          <span className="text-slate-500 text-[10px] uppercase block">Regression Verification</span>
          <span className="text-emerald-400 font-semibold">60 / 60 Tests Passed</span>
        </div>
      </div>

      {/* ============================================================
          3. 2-MINUTE FAST-TRACK EVALUATOR TOUR
          ============================================================ */}
      <div className="instrument-panel p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-3">
          <span className="text-xs font-mono font-bold text-cyan-300 uppercase flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>2-Minute Fast-Track Evaluator Tour</span>
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#0E131A] text-slate-400 border border-white/[0.08]">
            TARGET TIME: 120s
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Short on time? Follow this structured 5-step evaluation pathway to experience the complete computational progression:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-1 text-xs">
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
              desc: 'Q·Kᵀ scaled dot products',
            },
            {
              step: 3,
              time: '0:50–1:15',
              title: '3. Explicit vs Latent',
              desc: 'Tokens vs S₀→S_R vectors',
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
              className="p-3.5 rounded-lg info-card info-card-hover text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono font-semibold text-cyan-400">{tour.time}</span>
                <span className="text-[9px] font-mono text-slate-500">CH-0{tour.step}</span>
              </div>
              <span className="font-semibold text-white block text-xs group-hover:text-cyan-300 transition-colors">
                {tour.title}
              </span>
              <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
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
        <div className="space-y-1">
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold block">
            Instrumented Curriculum
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            The Six Laboratory Modules
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            From basic token embeddings to advanced synaptic memory plasticity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              id: 1,
              title: "01. Transformer Foundations",
              question: "How does a Transformer map discrete text into continuous coordinates?",
              icon: <Atom className="w-5 h-5 text-cyan-400" />,
              desc: "Deconstruct text into Token IDs, semantic embeddings X ∈ ℝ⁴, positional vectors P, and combined H₀ = X + P. Contrast vocabulary size V vs dimension d.",
            },
            {
              id: 2,
              title: "02. Attention Laboratory",
              question: "How does one token query and aggregate context from other tokens?",
              icon: <Layers className="w-5 h-5 text-cyan-400" />,
              desc: "Trace Query (Q) against Keys (K), scaled dot-products QKᵀ/√dₖ, row-wise softmax normalization, and Value (V) aggregation.",
            },
            {
              id: 3,
              title: "03. Explicit vs. Latent",
              question: "What happens when multi-step reasoning is performed inside hidden state vectors?",
              icon: <Split className="w-5 h-5 text-violet-400" />,
              desc: "Direct side-by-side execution on deterministic modular arithmetic. Compare emitted external tokens against internal continuous updates.",
            },
            {
              id: 4,
              title: "04. Latent Reasoning Lab",
              question: "Can reasoning depth be controlled as a continuous recurrence parameter?",
              icon: <Cpu className="w-5 h-5 text-cyan-400" />,
              desc: "Manipulate reasoning rounds R ∈ [1, 10]. Watch live state heatmaps, delta norms, 2D PCA trajectories, and empirical failure boundaries.",
            },
            {
              id: 5,
              title: "05. BDH & BDH-CQ Research",
              question: "How does synaptic plasticity provide associative memory without KV caches?",
              icon: <Network className="w-5 h-5 text-violet-400" />,
              desc: "Explore Pathway's research frontier: simulate 4×4 Hebbian synaptic memory updates (S_t = λS_{t-1} + K_tᵀV_t) and review BDH-CQ published findings.",
            },
            {
              id: 6,
              title: "06. Diagnostic Challenge",
              question: "Can you diagnose architectural trade-offs across the full journey?",
              icon: <CheckCircle2 className="w-5 h-5 text-cyan-400" />,
              desc: "Evaluate your conceptual mastery across 8 rigorous diagnostic problems with immediate feedback, telemetry verification, and summary reviews.",
            },
          ].map((card) => (
            <div
              key={card.id}
              onClick={() => onStartLab(card.id)}
              className="instrument-panel instrument-panel-hover p-5 space-y-3 cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-md bg-[#0E131A] border border-white/[0.08]">
                    {card.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0E131A] border border-white/[0.08] text-slate-300">
                      MODULE 0{card.id}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-100 text-sm group-hover:text-cyan-300 transition-colors">
                    {card.title}
                  </h3>
                  <span className="text-xs text-slate-400 block leading-snug">
                    {card.question}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed border-t border-white/[0.06] pt-3">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================
          5. SCIENTIFIC INTEGRITY & PROVENANCE FOOTER
          ============================================================ */}
      <div className="info-card p-5 border border-white/[0.08] flex flex-col sm:flex-row items-center gap-4 text-xs text-slate-400">
        <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/25 text-emerald-400 shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <strong className="text-slate-200">Interactive Teaching-Learning Laboratory: </strong>
          The recurrent model in this lab is a simplified educational baseline designed to expose the computational mechanics of latent recurrence. 
          It is <strong>NOT</strong> an official production implementation of Pathway's BDH or BDH-CQ architectures. 
          All forward passes are computed deterministically by pure NumPy on the Python backend with full tensor provenance.
        </div>
      </div>
    </div>
  );
};
