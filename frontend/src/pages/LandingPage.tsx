import React, { useState } from 'react';
import { ArrowRight, Sparkles, Brain, Cpu, Layers, Split, Atom, CheckCircle2, Network, ShieldCheck } from 'lucide-react';
import { EvidenceBadge } from '../components/common/EvidenceBadge';

interface Props {
  onStartLab: (chapterId: number) => void;
}

export const LandingPage: React.FC<Props> = ({ onStartLab }) => {
  const [activePathway, setActivePathway] = useState<'both' | 'explicit' | 'latent'>('both');

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-14">
      {/* Hero Section */}
      <div className="text-center space-y-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Interactive Computational & Pedagogical Laboratory</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white">
          Latent Reasoning <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-emerald-400 to-teal-300">Laboratory</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
          From token embeddings and self-attention mechanics to hidden-state reasoning, 
          and the research frontier beyond standard Transformers.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <EvidenceBadge type="live" />
          <EvidenceBadge type="toy" />
          <EvidenceBadge type="published" />
          <EvidenceBadge type="primary" />
        </div>

        <div className="pt-4">
          <button
            onClick={() => onStartLab(1)}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 text-white font-semibold text-base shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-emerald-500 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>ENTER THE LAB</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* The Central Question: Visual Interactive Contrast */}
      <div className="lab-glass-card p-6 md:p-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-semibold">The Central Architectural Question</span>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            How Should a Machine Represent Multi-Step Reasoning?
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            Traditional LLMs serialize their thought process into human-readable text tokens. 
            Latent reasoning architectures keep intermediate computation inside continuous hidden state vectors.
          </p>
        </div>

        {/* Interactive Selector */}
        <div className="flex justify-center gap-2">
          {(['both', 'explicit', 'latent'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setActivePathway(mode)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                activePathway === mode
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {mode === 'both' ? 'Compare Both' : mode === 'explicit' ? 'Mode A: Explicit (CoT)' : 'Mode B: Latent State'}
            </button>
          ))}
        </div>

        {/* Dual Pipeline Interactive Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Mode A: Explicit */}
          {(activePathway === 'both' || activePathway === 'explicit') && (
            <div className={`p-5 rounded-xl border transition-all ${activePathway === 'explicit' ? 'md:col-span-2' : ''} bg-amber-950/20 border-amber-500/40 space-y-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-amber-900/60 text-amber-300 border border-amber-600/40">
                    MODE A: EXPLICIT / CoT
                  </span>
                  <h3 className="text-base font-bold text-slate-100 mt-1">Serialized Token Generation</h3>
                </div>
                <Brain className="w-5 h-5 text-amber-400" />
              </div>

              <div className="space-y-2 font-mono text-xs">
                <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800 text-slate-300">
                  <span className="text-slate-500">Input: </span>
                  <span className="text-amber-300">"Calculate 7 + 3 × 5 mod 11"</span>
                </div>
                <div className="flex justify-center text-amber-500 text-xs">↓ emits token 1</div>
                <div className="p-2.5 rounded bg-amber-950/40 border border-amber-800/60 text-amber-200">
                  <span className="text-amber-400 font-bold">Thought 1: </span>
                  <span>"3 × 5 = 15"</span>
                </div>
                <div className="flex justify-center text-amber-500 text-xs">↓ emits token 2</div>
                <div className="p-2.5 rounded bg-amber-950/40 border border-amber-800/60 text-amber-200">
                  <span className="text-amber-400 font-bold">Thought 2: </span>
                  <span>"7 + 15 = 22"</span>
                </div>
                <div className="flex justify-center text-amber-500 text-xs">↓ emits final token</div>
                <div className="p-2.5 rounded bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 font-bold">
                  <span className="text-emerald-400">Answer: </span>
                  <span>"22 mod 11 = 0"</span>
                </div>
              </div>

              <div className="text-xs text-slate-400 border-t border-slate-800 pt-3 space-y-1">
                <p>• <strong>Representation:</strong> Externalized into context window as discrete language tokens.</p>
                <p>• <strong>Cost:</strong> Memory & attention compute grow with sequence length: <code className="text-amber-300 font-mono">O(L²)</code>.</p>
              </div>
            </div>
          )}

          {/* Mode B: Latent */}
          {(activePathway === 'both' || activePathway === 'latent') && (
            <div className={`p-5 rounded-xl border transition-all ${activePathway === 'latent' ? 'md:col-span-2' : ''} bg-indigo-950/20 border-indigo-500/40 space-y-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-indigo-900/60 text-indigo-300 border border-indigo-600/40">
                    MODE B: LATENT STATE
                  </span>
                  <h3 className="text-base font-bold text-slate-100 mt-1">Continuous Internal Recurrence</h3>
                </div>
                <Cpu className="w-5 h-5 text-indigo-400" />
              </div>

              <div className="space-y-2 font-mono text-xs">
                <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800 text-slate-300">
                  <span className="text-slate-500">Input: </span>
                  <span className="text-indigo-300">x ∈ ℝ⁶ (Task Encoding)</span>
                </div>
                <div className="flex justify-center text-indigo-400 text-xs">↓ initial projection</div>
                <div className="p-2.5 rounded bg-indigo-950/40 border border-indigo-800/60 text-indigo-200">
                  <span className="text-indigo-400 font-bold">State S₀: </span>
                  <span>[0.34, -0.12, 0.88, ... ∈ ℝ⁴⁸]</span>
                </div>
                <div className="flex justify-center text-indigo-400 text-xs">↓ recurrent round R=1</div>
                <div className="p-2.5 rounded bg-indigo-950/40 border border-indigo-800/60 text-indigo-200">
                  <span className="text-indigo-400 font-bold">State S₁: </span>
                  <span>S₀ + α W₂ tanh(W₁ S₀) (||ΔS||₂ = 0.42)</span>
                </div>
                <div className="flex justify-center text-indigo-400 text-xs">↓ classification readout head</div>
                <div className="p-2.5 rounded bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 font-bold">
                  <span className="text-emerald-400">Prediction: </span>
                  <span>0 (argmax softmax(W_out S_R))</span>
                </div>
              </div>

              <div className="text-xs text-slate-400 border-t border-slate-800 pt-3 space-y-1">
                <p>• <strong>Representation:</strong> Internalized in continuous vectors; 0 intermediate tokens emitted.</p>
                <p>• <strong>Cost:</strong> Memory footprint is fixed in <code className="text-indigo-300 font-mono">ℝᵈ</code>; computation depth governed by <code className="text-indigo-300 font-mono">R</code>.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 6-Chapter Educational Roadmap */}
      <div className="space-y-6">
        <div className="text-center">
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold">Guided Curriculum</span>
          <h2 className="text-2xl font-bold text-white mt-1">The Six Laboratory Chapters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              id: 1,
              title: "01. Transformer Foundations",
              icon: <Atom className="w-5 h-5 text-indigo-400" />,
              desc: "Deconstruct text into Token IDs, embeddings X ∈ ℝ⁴, positional vectors P, and combined H₀ = X + P. Understand V vs. d."
            },
            {
              id: 2,
              title: "02. Attention Laboratory",
              icon: <Layers className="w-5 h-5 text-emerald-400" />,
              desc: "Trace Query (Q) against Keys (K), scaled dot-products QKᵀ/√dₖ, softmax normalization, and Value (V) aggregation."
            },
            {
              id: 3,
              title: "03. Explicit vs. Latent",
              icon: <Split className="w-5 h-5 text-amber-400" />,
              desc: "Direct side-by-side execution on deterministic modular arithmetic. Compare emitted tokens against internal state updates."
            },
            {
              id: 4,
              title: "04. Latent Reasoning Lab",
              icon: <Cpu className="w-5 h-5 text-teal-400" />,
              desc: "Manipulate reasoning rounds R ∈ [1, 10]. Watch live state heatmaps, delta norms, 2D PCA trajectories, and failure cases."
            },
            {
              id: 5,
              title: "05. BDH & BDH-CQ Research",
              icon: <Network className="w-5 h-5 text-purple-400" />,
              desc: "Pathway research frontier: simulate 4×4 Hebbian synaptic memory updates (S_t = λS_{t-1} + K_tᵀV_t) and review BDH-CQ papers."
            },
            {
              id: 6,
              title: "06. Diagnostic Challenge",
              icon: <CheckCircle2 className="w-5 h-5 text-rose-400" />,
              desc: "Test your conceptual understanding across 8 diagnostic questions with immediate feedback and learning summaries."
            },
          ].map((card) => (
            <div
              key={card.id}
              onClick={() => onStartLab(card.id)}
              className="lab-glass-card lab-glass-card-hover p-5 space-y-3 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-indigo-400 group-hover:scale-110 transition-transform">
                  {card.icon}
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-bold text-slate-100 text-base group-hover:text-indigo-300 transition-colors">
                {card.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Scientific Integrity & Core Principle Footer */}
      <div className="lab-glass-card p-5 border border-slate-800 flex flex-col sm:flex-row items-center gap-4 text-xs text-slate-400">
        <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
        <div>
          <strong className="text-slate-200">Interactive Teaching-Learning Laboratory: </strong>
          Our toy model is a simplified educational MLP baseline designed to expose the computational mathematics. 
          It is <strong>NOT</strong> an official implementation of Pathway's BDH or BDH-CQ architectures. 
          All computations are executed live by pure NumPy without external GPU or black-box dependencies.
        </div>
      </div>
    </div>
  );
};
