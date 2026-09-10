import React, { useState, useEffect } from 'react';
import { generateTask, solveExplicit, runLatent } from '../services/api';
import type { TaskGenerateResponse, ExplicitSolveResponse, LatentRunResponse } from '../types/api';
import { EvidenceBadge } from '../components/common/EvidenceBadge';
import { EquationCard } from '../components/common/EquationCard';
import { Play, ArrowRight, Brain, Cpu, AlertTriangle, Sliders, RefreshCw } from 'lucide-react';

interface Props {
  onNextChapter: () => void;
}

export const Chapter03ExplicitVsLatent: React.FC<Props> = ({ onNextChapter }) => {
  const [level, setLevel] = useState(2);
  const [modulus, setModulus] = useState(11);
  const [seed, setSeed] = useState(42);

  const [task, setTask] = useState<TaskGenerateResponse | null>(null);
  const [explicitResult, setExplicitResult] = useState<ExplicitSolveResponse | null>(null);
  const [latentResult, setLatentResult] = useState<LatentRunResponse | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [revealedStep, setRevealedStep] = useState<number>(0);

  const executePipelines = async () => {
    setIsRunning(true);
    try {
      const t = await generateTask(level, modulus, seed);
      setTask(t);
      const [exp, lat] = await Promise.all([
        solveExplicit(level, modulus, seed),
        runLatent(level, modulus, seed, 3)
      ]);
      setExplicitResult(exp);
      setLatentResult(lat);
      setRevealedStep(0);

      // Progressive reveal animation
      for (let i = 1; i <= Math.max(exp.tokens.length, lat.states.length); i++) {
        await new Promise((r) => setTimeout(r, 220));
        setRevealedStep(i);
      }
    } catch (err) {
      console.error('Pipeline execution error:', err);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    executePipelines();
  }, [level, modulus, seed]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
      {/* Chapter Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 font-semibold shadow-[0_0_12px_rgba(6,182,212,0.15)]">
            CHAPTER 03 // DUAL PIPELINES
          </span>
          <EvidenceBadge type="live" />
          <EvidenceBadge type="toy" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Explicit vs. Latent Reasoning: Where Does Computation Happen?
        </h1>

        <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-3xl">
          The essential architectural question between Chain-of-Thought reasoning and latent reasoning is 
          <strong className="text-white"> WHERE the intermediate computation is represented</strong>: 
          externalized as discrete language tokens in the sequence context, or internalized within continuous state vectors without emitting text.
        </p>
      </div>

      {/* 1. CONTROL SURFACE: Task Controls */}
      <div className="hierarchy-control p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyan-500/20 pb-3">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-semibold flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>[1. WHAT I CONTROL] Synthetic Modular Arithmetic Generator:</span>
            </span>
            <div className="text-xl md:text-2xl font-mono font-bold text-white mt-1">
              {task?.expression || 'Loading...'}
            </div>
            <span className="text-xs font-mono text-emerald-400">
              Ground Truth Target: <strong>{task?.ground_truth}</strong> (Native Python integer arithmetic)
            </span>
          </div>

          <button
            onClick={executePipelines}
            disabled={isRunning}
            className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:shadow-[0_0_25px_rgba(6,182,212,0.55)] cursor-pointer disabled:opacity-50 border border-cyan-300/30"
          >
            <Play className={`w-3.5 h-3.5 fill-white ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'EXECUTING PIPELINES...' : 'RUN BOTH PATHWAYS'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1">Arithmetic Difficulty:</label>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevel(lvl)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    level === lvl
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                      : 'bg-slate-900/90 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  L{lvl}
                </button>
              ))}
            </div>
            <span className="text-[10px] font-mono text-slate-400 mt-1 block">
              {level === 1 ? 'a+b' : level === 2 ? 'a+b×c' : level === 3 ? 'a×b+c×d' : '(a+b)×c+d'}
            </span>
          </div>

          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1">Prime Modulus (n):</label>
            <select
              value={modulus}
              onChange={(e) => setModulus(Number(e.target.value))}
              className="w-full py-1.5 px-3 rounded-lg text-xs font-mono bg-slate-900/90 border border-slate-800 text-slate-200 cursor-pointer"
            >
              {[7, 11, 13, 17, 19, 23].map((m) => (
                <option key={m} value={m}>Mod {m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1">Deterministic Seed:</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={seed}
                onChange={(e) => setSeed(Number(e.target.value))}
                className="w-full py-1.5 px-3 rounded-lg text-xs font-mono bg-slate-900/90 border border-slate-800 text-slate-200"
              />
              <button
                onClick={() => setSeed(Math.floor(Math.random() * 1000))}
                className="px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. COMPUTED APPARATUS: Side-by-Side Pathway Execution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mode A: Explicit Reasoning */}
        <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/40 space-y-4 shadow-xl shadow-amber-950/20">
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-2.5">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-amber-900/60 text-amber-300 border border-amber-600/40">
                CHANNEL A // SERIALIZED TOKENS
              </span>
              <h3 className="text-base font-bold text-white mt-1">Serialized Chain-of-Thought Tokens</h3>
            </div>
            <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-700/40 text-amber-400">
              <Brain className="w-5 h-5" />
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Every intermediate arithmetic step is emitted as a discrete string token into the context window.
          </p>

          <div className="space-y-2.5 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-slate-300">
              <span className="text-slate-500 font-bold">Input: </span>
              <span className="text-amber-300">"{task?.expression}"</span>
            </div>

            {explicitResult?.tokens.slice(0, -1).map((tok, idx) => {
              const visible = revealedStep >= idx + 1;
              return (
                <div
                  key={idx}
                  className={`transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
                >
                  <div className="flex items-center justify-center gap-1.5 text-amber-500 text-[10px] my-1 font-mono">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    generates token {idx + 1}
                  </div>
                  <div className="p-2.5 rounded-lg bg-amber-950/50 border border-amber-700/50 text-amber-200 shadow-sm">
                    <span className="text-amber-400 font-bold">Step {idx + 1}: </span>
                    <span>"{tok}"</span>
                  </div>
                </div>
              );
            })}

            {/* Final Answer */}
            {revealedStep >= (explicitResult?.tokens.length || 0) && (
              <div>
                <div className="flex items-center justify-center gap-1.5 text-amber-500 text-[10px] my-1 font-mono">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  final answer token
                </div>
                <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/60 text-emerald-300 font-bold flex items-center justify-between shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                  <span>Prediction: {explicitResult?.answer}</span>
                  <span className="text-[10px] font-normal text-emerald-400">Ground Truth: {task?.ground_truth} (✓ Correct)</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 rounded-lg bg-slate-950/90 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
            <div className="text-amber-300 font-semibold uppercase text-[10px]">Resource Profile:</div>
            <div>• Emitted Tokens: <strong className="text-amber-300">{explicitResult?.token_count}</strong></div>
            <div>• Internal State Updates: <strong className="text-slate-300">0</strong></div>
            <div>• Memory Footprint: Grows linearly with each token (<code className="text-amber-300 font-mono">O(L)</code> KV-cache).</div>
          </div>
        </div>

        {/* Mode B: Latent State Reasoning */}
        <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/40 space-y-4 shadow-xl shadow-cyan-950/20">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2.5">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-300 border border-cyan-500/40">
                CHANNEL B // CONTINUOUS LATENT
              </span>
              <h3 className="text-base font-bold text-white mt-1">Continuous Internal Recurrence</h3>
            </div>
            <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Intermediate reasoning is performed through continuous state vector updates <code className="text-cyan-300 font-mono">S_t ∈ ℝ⁴⁸</code> without emitting tokens.
          </p>

          <div className="space-y-2.5 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-slate-300">
              <span className="text-slate-500 font-bold">Input: </span>
              <span className="text-cyan-300">Encoded Float Vector x ∈ ℝ⁶</span>
            </div>

            <div className="p-2.5 rounded-lg bg-cyan-950/50 border border-cyan-800/50 text-cyan-200 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-cyan-400 font-bold">Initial State S₀:</span>
                <span className="text-[10px] text-slate-400 font-mono">S₀ ∈ ℝ⁴⁸</span>
              </div>
              <div className="text-[11px] text-slate-300 font-mono">
                ReLU(W_enc · x + b_enc)
              </div>
              {latentResult?.states[0] && (
                <div className="text-[10px] font-mono text-cyan-300/80 bg-slate-950/80 p-1.5 rounded border border-cyan-900/30">
                  [{latentResult.states[0].slice(0, 5).map((v) => v.toFixed(2)).join(', ')}, ... +43 coords]
                </div>
              )}
            </div>

            {latentResult?.state_deltas.map((delta, idx) => {
              const visible = revealedStep >= idx + 1;
              const nextState = latentResult?.states[idx + 1];
              return (
                <div
                  key={idx}
                  className={`transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
                >
                  <div className="flex items-center justify-center gap-1.5 text-cyan-400 text-[10px] my-1 font-mono">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    recurrent update R={idx + 1} (||ΔS||₂ = {delta.toFixed(3)})
                  </div>
                  <div className="p-2.5 rounded-lg bg-cyan-950/50 border border-cyan-700/50 text-cyan-200 space-y-1 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-cyan-400 font-bold">State S_{idx + 1}:</span>
                      <span className="text-[10px] text-slate-400 font-mono">S_{idx + 1} ∈ ℝ⁴⁸</span>
                    </div>
                    <div className="text-[11px] text-slate-300 font-mono">
                      S_{idx} + α W₂ tanh(W₁ S_{idx} + b₁)
                    </div>
                    {nextState && (
                      <div className="text-[10px] font-mono text-cyan-300/80 bg-slate-950/80 p-1.5 rounded border border-cyan-900/30">
                        [{nextState.slice(0, 5).map((v) => v.toFixed(2)).join(', ')}, ... +43 coords]
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Readout Prediction */}
            {revealedStep >= (latentResult?.states.length || 0) && (
              <div>
                <div className="flex items-center justify-center gap-1.5 text-cyan-400 text-[10px] my-1 font-mono">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  classification readout head (modulus softmax)
                </div>
                <div className={`p-3 rounded-xl border flex items-center justify-between ${
                  latentResult?.correct
                    ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-300 font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                    : 'bg-rose-950/70 border-rose-500/60 text-rose-300 font-bold shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                }`}>
                  <span>Prediction: {latentResult?.prediction} {latentResult?.correct ? '✓' : '✗'}</span>
                  <span className="text-[10px] font-normal">
                    Ground Truth: {task?.ground_truth} | Conf: {((latentResult?.confidence || 0) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 rounded-lg bg-slate-950/90 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
            <div className="text-cyan-300 font-semibold uppercase text-[10px]">Resource Profile:</div>
            <div>• Emitted Tokens: <strong className="text-slate-300">0</strong></div>
            <div>• Internal State Updates: <strong className="text-cyan-300">{latentResult?.R}</strong></div>
            <div>• Memory Footprint: Fixed-size vector (<code className="text-cyan-300 font-mono">d = 48</code> coordinates).</div>
          </div>
        </div>
      </div>

      {/* 3. OBSERVED DYNAMICS: Central Conceptual Principle */}
      <div className="hierarchy-observed p-6 space-y-3">
        <h3 className="text-base font-bold text-white">
          [3. WHAT CHANGED] The Central Question: Where is Intermediate Computation Represented?
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          The distinction between Chain-of-Thought (Mode A) and Latent Reasoning (Mode B) is not merely cosmetic. It defines the mathematical substrate of machine thought:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
          <div className="p-3.5 rounded-xl bg-slate-950/90 border border-amber-800/50 space-y-1.5">
            <span className="font-bold text-amber-300 block font-mono text-xs uppercase">Mode A: Serialized Tokens</span>
            <p className="text-slate-300 leading-relaxed">
              Intermediate computation is converted into human language text and appended to the context window. 
              Memory scales linearly <code className="text-amber-300 font-mono">O(L)</code> and future all-pairs attention computation grows quadratically <code className="text-amber-300 font-mono">O(L²)</code>.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/90 border border-cyan-800/50 space-y-1.5">
            <span className="font-bold text-cyan-300 block font-mono text-xs uppercase">Mode B: Continuous Hidden State</span>
            <p className="text-slate-300 leading-relaxed">
              Intermediate computation is executed inside a fixed-size state vector <code className="text-cyan-300 font-mono">S_t ∈ ℝ⁴⁸</code>. 
              Zero reasoning tokens are emitted into the context sequence; working memory footprint remains fixed <code className="text-cyan-300 font-mono">O(1)</code>.
            </p>
          </div>
        </div>
      </div>

      {/* Structured Computational Proxy Comparison */}
      <div className="instrument-panel p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-cyan-500/15 pb-3">
          <h3 className="text-base font-bold text-white">📊 Computational Proxy Telemetry Comparison</h3>
          <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/40">
            NUMPY ENGINE TELEMETRY
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Computational proxy comparing token emission against recurrent vector updates on synthetic modular arithmetic.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-amber-300 block font-mono">Mode A: Explicit / CoT</span>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400 block font-mono">Tokens Emitted</span>
                <span className="text-lg font-bold text-amber-400 font-mono">{explicitResult?.token_count}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400 block font-mono">Internal Updates</span>
                <span className="text-lg font-bold text-slate-400 font-mono">0</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-cyan-300 block font-mono">Mode B: Latent State</span>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400 block font-mono">Tokens Emitted</span>
                <span className="text-lg font-bold text-slate-400 font-mono">0</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400 block font-mono">Internal Updates</span>
                <span className="text-lg font-bold text-cyan-400 font-mono">{latentResult?.R}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="hierarchy-meaning p-3.5 rounded-xl text-xs text-amber-200 flex items-start gap-2.5 leading-relaxed">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong>[5. WHAT THIS MEANS] Scientific Honesty Note:</strong> These toy metrics illustrate the architectural mechanics on synthetic arithmetic. 
            They are <strong>not proof</strong> of general speed, cost, or scaling superiority for full-scale real-world LLMs.
          </span>
        </div>
      </div>

      {/* Equation Cards */}
      <EquationCard
        title="Latent Recurrence Formulation"
        formula="s_{t+1} = s_t + \alpha \cdot W_2 \tanh(W_1 s_t + b_1), \quad s_t \in \mathbb{R}^{48}"
        plainEnglish="Rather than appending new tokens to sequence length, the model refines a fixed-size vector representation through residual multi-layer perceptron (MLP) updates."
        numericExample={`For R=3 updates, state changes by L2 norm deltas: [${latentResult?.state_deltas.map(d => d.toFixed(2)).join(', ')}]`}
      />

      {/* Storytelling Transition to Next Chapter */}
      <div className="p-6 rounded-2xl instrument-panel border border-cyan-500/25 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block">
            PEDAGOGICAL PROGRESSION: CHAPTER 03 ➔ CHAPTER 04
          </span>
          <p className="text-xs sm:text-sm text-slate-200 font-medium">
            Instead of writing every step as text, can we directly control the depth of computation inside this hidden state?
          </p>
        </div>
        <button
          onClick={onNextChapter}
          className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] cursor-pointer border border-cyan-300/30"
        >
          <span>Continue → Latent Reasoning Lab</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
