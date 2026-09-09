import React, { useState, useEffect } from 'react';
import { generateTask, solveExplicit, runLatent } from '../services/api';
import type { TaskGenerateResponse, ExplicitSolveResponse, LatentRunResponse } from '../types/api';
import { EvidenceBadge } from '../components/common/EvidenceBadge';
import { EquationCard } from '../components/common/EquationCard';
import { Play, ArrowRight, Brain, Cpu, AlertTriangle } from 'lucide-react';

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
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Chapter Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-indigo-950 text-indigo-300 border border-indigo-700/50 font-semibold">
            CHAPTER 03
          </span>
          <EvidenceBadge type="live" />
          <EvidenceBadge type="toy" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Explicit vs. Latent Reasoning: Where Does Computation Happen?
        </h1>

        <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-3xl">
          The essential conceptual distinction between Chain-of-Thought reasoning and latent reasoning is 
          <strong className="text-white"> WHERE the intermediate computation is represented</strong>: 
          externalized as discrete language tokens in the sequence context, or internalized within continuous state vectors without emitting text.
        </p>
      </div>

      {/* Task Controls Card */}
      <div className="lab-glass-card p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold block">
              Synthetic Modular Arithmetic Task:
            </span>
            <div className="text-xl md:text-2xl font-mono font-bold text-white mt-1">
              {task?.expression || 'Loading...'}
            </div>
            <span className="text-xs font-mono text-emerald-400">
              Ground Truth: <strong>{task?.ground_truth}</strong> (Native Python integer arithmetic)
            </span>
          </div>

          <button
            onClick={executePipelines}
            disabled={isRunning}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-md shadow-indigo-600/20 cursor-pointer disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{isRunning ? 'Computing...' : 'Run Both Pathways'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-800">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Arithmetic Difficulty:</label>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevel(lvl)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                    level === lvl ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  L{lvl}
                </button>
              ))}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              {level === 1 ? 'a+b' : level === 2 ? 'a+b×c' : level === 3 ? 'a×b+c×d' : '(a+b)×c+d'}
            </span>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Prime Modulus (n):</label>
            <select
              value={modulus}
              onChange={(e) => setModulus(Number(e.target.value))}
              className="w-full py-1.5 px-3 rounded-lg text-xs font-mono bg-slate-900 border border-slate-800 text-slate-200"
            >
              {[7, 11, 13, 17, 19, 23].map((m) => (
                <option key={m} value={m}>Mod {m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Deterministic Seed:</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={seed}
                onChange={(e) => setSeed(Number(e.target.value))}
                className="w-full py-1.5 px-3 rounded-lg text-xs font-mono bg-slate-900 border border-slate-800 text-slate-200"
              />
              <button
                onClick={() => setSeed(Math.floor(Math.random() * 1000))}
                className="px-3 py-1.5 rounded-lg text-xs bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Random
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Pathway Execution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mode A: Explicit Reasoning */}
        <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/40 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-amber-900/60 text-amber-300 border border-amber-600/40">
                MODE A: EXPLICIT / CoT
              </span>
              <h3 className="text-base font-bold text-white mt-1">Serialized Chain-of-Thought Tokens</h3>
            </div>
            <Brain className="w-6 h-6 text-amber-400" />
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Every intermediate arithmetic transformation is emitted as a discrete string token into the context window.
          </p>

          <div className="space-y-2.5 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300">
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
                  <div className="flex justify-center text-amber-500 text-[10px] my-1">
                    ↓ generates token {idx + 1}
                  </div>
                  <div className="p-2.5 rounded-lg bg-amber-950/50 border border-amber-700/50 text-amber-200">
                    <span className="text-amber-400 font-bold">Step {idx + 1}: </span>
                    <span>"{tok}"</span>
                  </div>
                </div>
              );
            })}

            {/* Final Answer */}
            {revealedStep >= (explicitResult?.tokens.length || 0) && (
              <div>
                <div className="flex justify-center text-amber-500 text-[10px] my-1">
                  ↓ final answer token
                </div>
                <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/60 text-emerald-300 font-bold flex items-center justify-between">
                  <span>Prediction: {explicitResult?.answer}</span>
                  <span className="text-[10px] font-normal text-emerald-400">Ground Truth: {task?.ground_truth} (✓ Correct)</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="text-amber-300 font-semibold">Characteristics:</div>
            <div>• Emitted Tokens: <strong>{explicitResult?.token_count}</strong></div>
            <div>• Internal State Updates: <strong>0</strong></div>
            <div>• Memory Footprint: Grows with each emitted token (<code className="text-amber-300">O(L)</code> cache).</div>
          </div>
        </div>

        {/* Mode B: Latent State Reasoning */}
        <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/40 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-indigo-900/60 text-indigo-300 border border-indigo-600/40">
                MODE B: LATENT STATE
              </span>
              <h3 className="text-base font-bold text-white mt-1">Continuous Internal Recurrence</h3>
            </div>
            <Cpu className="w-6 h-6 text-indigo-400" />
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Intermediate reasoning is performed through continuous state vector updates <code className="text-indigo-300">S_t ∈ ℝ⁴⁸</code> without emitting tokens.
          </p>

          <div className="space-y-2.5 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300">
              <span className="text-slate-500 font-bold">Input: </span>
              <span className="text-indigo-300">Encoded Float Vector x ∈ ℝ⁶</span>
            </div>

            <div className="p-2.5 rounded-lg bg-indigo-950/50 border border-indigo-800/50 text-indigo-200">
              <span className="text-indigo-400 font-bold">Initial State S₀: </span>
              <span>ReLU(W_enc · x + b_enc) ∈ ℝ⁴⁸</span>
            </div>

            {latentResult?.state_deltas.map((delta, idx) => {
              const visible = revealedStep >= idx + 1;
              return (
                <div
                  key={idx}
                  className={`transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
                >
                  <div className="flex justify-center text-indigo-400 text-[10px] my-1">
                    ↓ recurrent update R={idx + 1} (||ΔS||₂ = {delta.toFixed(3)})
                  </div>
                  <div className="p-2.5 rounded-lg bg-indigo-950/50 border border-indigo-700/50 text-indigo-200">
                    <span className="text-indigo-400 font-bold">State S_{idx + 1}: </span>
                    <span>S_{idx} + α W₂ tanh(W₁ S_{idx})</span>
                  </div>
                </div>
              );
            })}

            {/* Readout Prediction */}
            {revealedStep >= (latentResult?.states.length || 0) && (
              <div>
                <div className="flex justify-center text-indigo-400 text-[10px] my-1">
                  ↓ classification readout head (modulus softmax)
                </div>
                <div className={`p-3 rounded-xl border flex items-center justify-between ${
                  latentResult?.correct
                    ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-300 font-bold'
                    : 'bg-rose-950/70 border-rose-500/60 text-rose-300 font-bold'
                }`}>
                  <span>Prediction: {latentResult?.prediction} {latentResult?.correct ? '✓' : '✗'}</span>
                  <span className="text-[10px] font-normal">
                    Ground Truth: {task?.ground_truth} | Conf: {((latentResult?.confidence || 0) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="text-indigo-300 font-semibold">Characteristics:</div>
            <div>• Emitted Tokens: <strong>0</strong></div>
            <div>• Internal State Updates: <strong>{latentResult?.R}</strong></div>
            <div>• Memory Footprint: Fixed-size vector (<code className="text-indigo-300">d = 48</code> coordinates).</div>
          </div>
        </div>
      </div>

      {/* Structured Computational Proxy Comparison */}
      <div className="lab-glass-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">📊 Computational Proxy Comparison</h3>
          <span className="text-[11px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-700/50">
            🟡 TOY COMPUTATIONAL PROXY
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Conceptual proxy comparing token emission against recurrent vector updates on synthetic modular arithmetic.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-amber-300 block">Mode A: Explicit / CoT</span>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-xs text-slate-400 block">Tokens Emitted</span>
                <span className="text-lg font-bold text-amber-400">{explicitResult?.token_count}</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-xs text-slate-400 block">Internal Updates</span>
                <span className="text-lg font-bold text-slate-400">0</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-indigo-300 block">Mode B: Latent State</span>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-xs text-slate-400 block">Tokens Emitted</span>
                <span className="text-lg font-bold text-slate-400">0</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-xs text-slate-400 block">Internal Updates</span>
                <span className="text-lg font-bold text-indigo-400">{latentResult?.R}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-600/40 text-xs text-amber-200 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong>Scientific Honesty Note:</strong> These toy metrics illustrate the architectural mechanics on synthetic arithmetic. 
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

      {/* Transition to Next Chapter */}
      <div className="flex justify-between items-center pt-6 border-t border-slate-800">
        <div className="text-xs text-slate-400">
          Next: Take direct interactive control of recurrence depth <span className="text-indigo-300 font-mono">R</span> in the laboratory.
        </div>
        <button
          onClick={onNextChapter}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
        >
          <span>Continue to Chapter 04: Latent Lab</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
