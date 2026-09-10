import React, { useState } from 'react';
import { ArrowRight, Sparkles, Brain, Cpu, Layers, Split, Atom, CheckCircle2, Network, ShieldCheck, Activity, Terminal } from 'lucide-react';
import { EvidenceBadge } from '../components/common/EvidenceBadge';

interface Props {
  onStartLab: (chapterId: number) => void;
}

export const LandingPage: React.FC<Props> = ({ onStartLab }) => {
  const [activePathway, setActivePathway] = useState<'both' | 'explicit' | 'latent'>('both');

  return (
    <div className="w-[94%] max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-16 relative">
      {/* Background ambient lighting effects */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-5xl h-72 bg-gradient-to-b from-cyan-500/8 via-indigo-500/4 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium shadow-[0_0_15px_rgba(6,182,212,0.15)]">
          <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="tracking-normal">NumPy Scientific Engine // Runtime Verified</span>
        </div>

        <div className="space-y-3">
          <span className="block text-xs uppercase tracking-wider text-cyan-400 font-semibold font-mono">
            Pathway Research Laboratory
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Latent Reasoning{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400">
              Laboratory
            </span>
          </h1>
        </div>

        <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
          From tokens and attention to continuous hidden-state reasoning — and the research frontier beyond conventional token-by-token generation.
        </p>

        <div className="inline-block p-2.5 px-4 rounded-lg bg-slate-900/80 border border-slate-800 text-xs sm:text-sm text-cyan-300/90 shadow-inner">
          <span className="text-slate-400 font-medium">Fundamental Inquiry: </span>
          <em className="italic">Why must machine reasoning be externalized as generated text tokens?</em>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <EvidenceBadge type="live" />
          <EvidenceBadge type="toy" />
          <EvidenceBadge type="published" />
          <EvidenceBadge type="primary" />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => onStartLab(1)}
            className="group relative inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-semibold text-sm tracking-normal shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border border-cyan-400/30"
          >
            <span>Enter Laboratory Curriculum</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 2-Minute Evaluator Fast-Track Banner */}
        <div className="max-w-5xl mx-auto p-5 md:p-6 rounded-2xl instrument-panel text-left space-y-4 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-500/15 pb-2.5">
            <span className="text-xs font-mono font-bold text-cyan-300 uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              2-Minute Fast-Track Evaluator Tour
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
              TARGET TIME: 120s
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Short on time? Follow this structured 5-step evaluation pathway to experience the complete computational progression:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 pt-1 text-xs">
            {[
              {
                step: 1,
                time: '0:00–0:20',
                title: '1. Foundations',
                desc: 'X + P = H₀ vectors',
                border: 'hover:border-cyan-400 hover:shadow-[0_0_12px_rgba(6,182,212,0.2)]',
                color: 'text-cyan-400',
              },
              {
                step: 2,
                time: '0:20–0:50',
                title: '2. Attention',
                desc: 'Q·Kᵀ scaled dot products',
                border: 'hover:border-emerald-400 hover:shadow-[0_0_12px_rgba(16,185,129,0.2)]',
                color: 'text-emerald-400',
              },
              {
                step: 3,
                time: '0:50–1:15',
                title: '3. Explicit vs Latent',
                desc: 'Tokens vs S₀→S_R vectors',
                border: 'hover:border-amber-400 hover:shadow-[0_0_12px_rgba(245,158,11,0.2)]',
                color: 'text-amber-400',
              },
              {
                step: 4,
                time: '1:15–1:40',
                title: '4. Latent Lab',
                desc: 'R-slider & 2D PCA trace',
                border: 'hover:border-teal-400 hover:shadow-[0_0_12px_rgba(20,184,166,0.2)]',
                color: 'text-teal-400',
              },
              {
                step: 5,
                time: '1:40–2:00',
                title: '5. BDH Memory',
                desc: 'λ decay & fast weights',
                border: 'hover:border-purple-400 hover:shadow-[0_0_12px_rgba(168,85,247,0.2)]',
                color: 'text-purple-400',
              },
            ].map((tour) => (
              <button
                key={tour.step}
                onClick={() => onStartLab(tour.step)}
                className={`p-3 rounded-xl bg-slate-950/70 border border-slate-800/90 text-left transition-all cursor-pointer group ${tour.border}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-mono font-bold ${tour.color}`}>{tour.time}</span>
                  <span className="text-[9px] font-mono text-slate-500">CH-0{tour.step}</span>
                </div>
                <span className="font-bold text-white block text-xs group-hover:text-slate-100">
                  {tour.title}
                </span>
                <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                  {tour.desc}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* The Central Question: Visual Interactive Contrast */}
      <div className="instrument-panel p-6 md:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-indigo-950/50 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>ARCHITECTURAL DICHOTOMY</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            How Should an Intelligence Represent Multi-Step Reasoning?
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed">
            Conventional LLMs externalize their reasoning steps into serialized text tokens.
            Latent architectures maintain and refine continuous hidden-state trajectories internally.
          </p>
        </div>

        {/* Interactive Mode Selector */}
        <div className="flex justify-center gap-2 pt-1">
          {(['both', 'explicit', 'latent'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setActivePathway(mode)}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activePathway === mode
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {mode === 'both' ? '⚡ Compare Both Pipelines' : mode === 'explicit' ? 'Mode A: Serialized Tokens' : 'Mode B: Continuous Latent'}
            </button>
          ))}
        </div>

        {/* Dual Pipeline Interactive Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Mode A: Explicit */}
          {(activePathway === 'both' || activePathway === 'explicit') && (
            <div
              className={`p-5 rounded-xl border transition-all ${
                activePathway === 'explicit' ? 'md:col-span-2' : ''
              } bg-amber-950/20 border-amber-500/40 space-y-4 shadow-lg shadow-amber-950/20`}
            >
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-2.5">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-amber-900/60 text-amber-300 border border-amber-600/40">
                    CHANNEL A // EXPLICIT CoT
                  </span>
                  <h3 className="text-base font-bold text-slate-100 mt-1">Serialized Token Generation</h3>
                </div>
                <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-700/40 text-amber-400">
                  <Brain className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-2 font-mono text-xs">
                <div className="p-2.5 rounded-lg bg-slate-950/90 border border-slate-800/90 text-slate-300">
                  <span className="text-slate-500">Prompt: </span>
                  <span className="text-amber-300">"Calculate 7 + 3 × 5 mod 11"</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 text-amber-500 text-[11px] font-mono py-0.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                  emits token sequence 1
                </div>
                <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-800/60 text-amber-200">
                  <span className="text-amber-400 font-bold">Step 1 Token: </span>
                  <span>"3 × 5 = 15"</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 text-amber-500 text-[11px] font-mono py-0.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                  emits token sequence 2
                </div>
                <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-800/60 text-amber-200">
                  <span className="text-amber-400 font-bold">Step 2 Token: </span>
                  <span>"7 + 15 = 22"</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 text-amber-500 text-[11px] font-mono py-0.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  emits terminal answer token
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-950/50 border border-emerald-600/50 text-emerald-300 font-bold">
                  <span className="text-emerald-400">Answer: </span>
                  <span>"22 mod 11 = 0"</span>
                </div>
              </div>

              <div className="text-xs text-slate-400 border-t border-amber-500/20 pt-3 space-y-1">
                <p>• <strong>State Storage:</strong> Externalized into context window as discrete language tokens.</p>
                <p>• <strong>Cost Scaling:</strong> KV-cache memory and self-attention compute scale quadratic: <code className="text-amber-300 font-mono">O(L²)</code>.</p>
              </div>
            </div>
          )}

          {/* Mode B: Latent */}
          {(activePathway === 'both' || activePathway === 'latent') && (
            <div
              className={`p-5 rounded-xl border transition-all ${
                activePathway === 'latent' ? 'md:col-span-2' : ''
              } bg-cyan-950/20 border-cyan-500/40 space-y-4 shadow-lg shadow-cyan-950/20`}
            >
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2.5">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-300 border border-cyan-500/40">
                    CHANNEL B // LATENT STATE
                  </span>
                  <h3 className="text-base font-bold text-slate-100 mt-1">Continuous Internal Recurrence</h3>
                </div>
                <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
                  <Cpu className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-2 font-mono text-xs">
                <div className="p-2.5 rounded-lg bg-slate-950/90 border border-slate-800/90 text-slate-300">
                  <span className="text-slate-500">Input: </span>
                  <span className="text-cyan-300">x ∈ ℝ⁶ (Task Encoding Coordinate)</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 text-cyan-400 text-[11px] font-mono py-0.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  initial projection W_in
                </div>
                <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-800/60 text-cyan-200">
                  <span className="text-cyan-400 font-bold">State S₀: </span>
                  <span>[0.34, -0.12, 0.88, ... ∈ ℝ⁴⁸]</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 text-cyan-400 text-[11px] font-mono py-0.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  recurrent reasoning round R=1
                </div>
                <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-800/60 text-cyan-200">
                  <span className="text-cyan-400 font-bold">State S₁: </span>
                  <span>S₀ + α W₂ tanh(W₁ S₀) (||ΔS||₂ = 0.420)</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 text-cyan-400 text-[11px] font-mono py-0.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  classification readout head
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-950/50 border border-emerald-600/50 text-emerald-300 font-bold">
                  <span className="text-emerald-400">Prediction: </span>
                  <span>0 (argmax softmax(W_out S_R))</span>
                </div>
              </div>

              <div className="text-xs text-slate-400 border-t border-cyan-500/20 pt-3 space-y-1">
                <p>• <strong>State Storage:</strong> Internalized in continuous vectors; 0 intermediate tokens emitted.</p>
                <p>• <strong>Cost Scaling:</strong> Fixed memory footprint in <code className="text-cyan-300 font-mono">ℝᵈ</code>; reasoning capacity governed by depth <code className="text-cyan-300 font-mono">R</code>.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 6-Chapter Educational Roadmap */}
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-cyan-400 font-semibold">
            INSTRUMENTED CURRICULUM
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            The Six Laboratory Modules
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
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
              accent: "border-cyan-500/20 group-hover:border-cyan-400/60",
              badge: "text-cyan-300 bg-cyan-950/60 border-cyan-500/30",
            },
            {
              id: 2,
              title: "02. Attention Laboratory",
              question: "How does one token query and aggregate context from other tokens?",
              icon: <Layers className="w-5 h-5 text-emerald-400" />,
              desc: "Trace Query (Q) against Keys (K), scaled dot-products QKᵀ/√dₖ, row-wise softmax normalization, and Value (V) aggregation.",
              accent: "border-emerald-500/20 group-hover:border-emerald-400/60",
              badge: "text-emerald-300 bg-emerald-950/60 border-emerald-500/30",
            },
            {
              id: 3,
              title: "03. Explicit vs. Latent",
              question: "What happens when multi-step reasoning is performed inside hidden state vectors?",
              icon: <Split className="w-5 h-5 text-amber-400" />,
              desc: "Direct side-by-side execution on deterministic modular arithmetic. Compare emitted external tokens against internal continuous updates.",
              accent: "border-amber-500/20 group-hover:border-amber-400/60",
              badge: "text-amber-300 bg-amber-950/60 border-amber-500/30",
            },
            {
              id: 4,
              title: "04. Latent Reasoning Lab",
              question: "Can reasoning depth be controlled as a continuous recurrence parameter?",
              icon: <Cpu className="w-5 h-5 text-teal-400" />,
              desc: "Manipulate reasoning rounds R ∈ [1, 10]. Watch live state heatmaps, delta norms, 2D PCA trajectories, and empirical failure boundaries.",
              accent: "border-teal-500/20 group-hover:border-teal-400/60",
              badge: "text-teal-300 bg-teal-950/60 border-teal-500/30",
            },
            {
              id: 5,
              title: "05. BDH & BDH-CQ Research",
              question: "How does synaptic plasticity provide associative memory without KV caches?",
              icon: <Network className="w-5 h-5 text-purple-400" />,
              desc: "Explore Pathway's research frontier: simulate 4×4 Hebbian synaptic memory updates (S_t = λS_{t-1} + K_tᵀV_t) and review BDH-CQ published findings.",
              accent: "border-purple-500/20 group-hover:border-purple-400/60",
              badge: "text-purple-300 bg-purple-950/60 border-purple-500/30",
            },
            {
              id: 6,
              title: "06. Diagnostic Challenge",
              question: "Can you diagnose architectural trade-offs across the full journey?",
              icon: <CheckCircle2 className="w-5 h-5 text-rose-400" />,
              desc: "Evaluate your conceptual mastery across 8 rigorous diagnostic problems with immediate feedback, telemetry verification, and summary reviews.",
              accent: "border-rose-500/20 group-hover:border-rose-400/60",
              badge: "text-rose-300 bg-rose-950/60 border-rose-500/30",
            },
          ].map((card) => (
            <div
              key={card.id}
              onClick={() => onStartLab(card.id)}
              className={`instrument-panel instrument-panel-hover p-5 space-y-3 cursor-pointer group border ${card.accent} transition-all`}
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80 group-hover:scale-105 transition-transform">
                  {card.icon}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${card.badge}`}>
                    MODULE 0{card.id}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-100 text-base group-hover:text-cyan-300 transition-colors">
                  {card.title}
                </h3>
                <span className="text-[11px] font-mono text-cyan-300/90 block font-semibold leading-snug">
                  {card.question}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Scientific Integrity & Provenance Footer */}
      <div className="instrument-panel p-5 border border-cyan-500/20 flex flex-col sm:flex-row items-center gap-4 text-xs text-slate-400">
        <div className="p-2 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <strong className="text-slate-200">Interactive Teaching-Learning Laboratory: </strong>
          The recurrent model in this lab is a simplified educational MLP baseline designed to expose the computational mechanics of latent recurrence. 
          It is <strong>NOT</strong> an official implementation of Pathway's BDH or BDH-CQ architectures. 
          All forward passes are computed deterministically by pure NumPy on the Python backend with full tensor provenance.
        </div>
      </div>
    </div>
  );
};
