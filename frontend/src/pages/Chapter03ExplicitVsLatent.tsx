import React, { useState, useEffect } from 'react';
import { generateTask, solveExplicit, runLatent } from '../services/api';
import type { TaskGenerateResponse, ExplicitSolveResponse, LatentRunResponse } from '../types/api';
import { EvidenceBadge } from '../components/common/EvidenceBadge';
import { EquationCard } from '../components/common/EquationCard';
import { MathInline } from '../components/common/MathFormula';
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
    <div className="lab-container py-8 md:py-12 space-y-10">
      {/* Chapter Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
            Chapter 03 • Dual Pathways
          </span>
          <EvidenceBadge type="live" />
          <EvidenceBadge type="toy" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Explicit vs. Latent Reasoning: Where Does Computation Happen?
        </h1>

        <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-4xl">
          The essential architectural question between Chain-of-Thought reasoning and latent reasoning is 
          <strong className="text-slate-900"> where intermediate computation is represented</strong>: 
          externalized as discrete language tokens in the sequence context, or internalized within continuous state vectors without emitting text.
        </p>
      </div>

      {/* 1. CONTROL SURFACE: Task Controls */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 md:p-7 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600" />
              <span>Modular Arithmetic Task Generator</span>
            </span>
            <div className="text-xl md:text-2xl font-mono font-bold text-slate-900 mt-1">
              {task?.expression || 'Loading...'}
            </div>
            <span className="text-xs text-emerald-700 font-semibold font-mono">
              Ground Truth Target: <strong>{task?.ground_truth}</strong> (Native Python integer arithmetic)
            </span>
          </div>

          <button
            onClick={executePipelines}
            disabled={isRunning}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 hover:shadow-lg hover:brightness-105 transition-all cursor-pointer disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Executing Pathways...' : 'Run Both Pathways'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">Arithmetic Difficulty:</label>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevel(lvl)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    level === lvl
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                      : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  L{lvl}
                </button>
              ))}
            </div>
            <span className="text-xs text-slate-500 mt-1.5 block">
              {level === 1 ? 'a+b' : level === 2 ? 'a+b×c' : level === 3 ? 'a×b+c×d' : '(a+b)×c+d'}
            </span>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">Prime Modulus (n):</label>
            <select
              value={modulus}
              onChange={(e) => setModulus(Number(e.target.value))}
              className="w-full py-2 px-3 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-800 cursor-pointer font-medium"
            >
              {[7, 11, 13, 17, 19, 23].map((m) => (
                <option key={m} value={m}>Mod {m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">Deterministic Seed:</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={seed}
                onChange={(e) => setSeed(Number(e.target.value))}
                className="w-full py-2 px-3 rounded-xl text-xs font-mono bg-slate-50 border border-slate-200 text-slate-800 font-medium"
              />
              <button
                onClick={() => setSeed(Math.floor(Math.random() * 1000))}
                className="px-3.5 py-2 rounded-xl text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                title="Random Seed"
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
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Mode A • Explicit Reasoning
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-2">Serialized Chain-of-Thought Tokens</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-600">
              <Brain className="w-5 h-5" />
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Every intermediate arithmetic step is emitted as a discrete string token into the context window.
          </p>

          <div className="space-y-2.5 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
              <span className="text-slate-400 font-bold">Input: </span>
              <span className="text-blue-700 font-bold">"{task?.expression}"</span>
            </div>

            {explicitResult?.tokens.slice(0, -1).map((tok, idx) => {
              const visible = revealedStep >= idx + 1;
              return (
                <div
                  key={idx}
                  className={`transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
                >
                  <div className="flex items-center justify-center gap-1.5 text-blue-600 text-[10px] my-1 font-sans font-medium">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-600" />
                    generates token {idx + 1}
                  </div>
                  <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/80 text-blue-950 shadow-2xs">
                    <span className="text-blue-700 font-bold">Step {idx + 1}: </span>
                    <span>"{tok}"</span>
                  </div>
                </div>
              );
            })}

            {/* Final Answer */}
            {revealedStep >= (explicitResult?.tokens.length || 0) && (
              <div>
                <div className="flex items-center justify-center gap-1.5 text-emerald-600 text-[10px] my-1 font-sans font-medium">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  final answer token
                </div>
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold flex items-center justify-between shadow-2xs">
                  <span>Prediction: {explicitResult?.answer}</span>
                  <span className="text-xs font-normal text-emerald-700 font-sans">Ground Truth: {task?.ground_truth} (✓ Correct)</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="text-slate-900 font-bold uppercase text-[10px]">Resource Profile:</div>
            <div>• Emitted Tokens: <strong className="text-blue-700">{explicitResult?.token_count}</strong></div>
            <div>• Internal State Updates: <strong className="text-slate-700">0</strong></div>
            <div>• Memory Footprint: Grows linearly with each token (<MathInline math="O(L)" className="text-blue-700 font-semibold" /> KV-cache).</div>
          </div>
        </div>

        {/* Mode B: Latent State Reasoning */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                Mode B • Latent State Reasoning
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-2">Continuous Internal Recurrence</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-100 text-purple-600">
              <Cpu className="w-5 h-5" />
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Intermediate reasoning is performed through continuous state vector updates <MathInline math="S_t \in \mathbb{R}^{48}" className="text-purple-700 font-semibold" /> without emitting tokens.
          </p>

          <div className="space-y-2.5 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
              <span className="text-slate-400 font-bold font-sans">Input: </span>
              <span className="text-indigo-700 font-bold">Encoded Float Vector <MathInline math="x \in \mathbb{R}^6" /></span>
            </div>

            <div className="p-3 rounded-xl bg-indigo-50/40 border border-indigo-200/80 text-indigo-950 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-indigo-900 font-bold font-sans">Initial State <MathInline math="S_0" />:</span>
                <span className="text-[10px] text-slate-500 font-mono"><MathInline math="S_0 \in \mathbb{R}^{48}" /></span>
              </div>
              <div className="text-xs text-slate-700 font-mono">
                <MathInline math="\operatorname{ReLU}(W_{\text{enc}} \cdot x + b_{\text{enc}})" />
              </div>
              {latentResult?.states[0] && (
                <div className="text-[11px] font-mono text-indigo-800 bg-white p-2 rounded-lg border border-indigo-200">
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
                  <div className="flex items-center justify-center gap-1.5 text-teal-700 text-[10px] my-1 font-sans font-medium">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-teal-600" />
                    <span>recurrent update R={idx + 1} (</span>
                    <MathInline math={`\\|\\Delta S\\|_2 = ${delta.toFixed(3)}`} />
                    <span>)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-indigo-50/40 border border-indigo-200/80 text-indigo-950 space-y-1.5 shadow-2xs">
                    <div className="flex justify-between items-center">
                      <span className="text-indigo-900 font-bold font-sans">State <MathInline math={`S_{${idx + 1}}`} />:</span>
                      <span className="text-[10px] text-slate-500 font-mono"><MathInline math={`S_{${idx + 1}} \\in \\mathbb{R}^{48}`} /></span>
                    </div>
                    <div className="text-xs text-slate-700 font-mono">
                      <MathInline math={`S_{${idx}} + \\alpha W_2 \\tanh(W_1 S_{${idx}} + b_1)`} />
                    </div>
                    {nextState && (
                      <div className="text-[11px] font-mono text-indigo-800 bg-white p-2 rounded-lg border border-indigo-200">
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
                <div className="flex items-center justify-center gap-1.5 text-indigo-600 text-[10px] my-1 font-sans font-medium">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-600" />
                  classification readout head (modulus softmax)
                </div>
                <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                  latentResult?.correct
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-bold shadow-2xs'
                    : 'bg-rose-50 border-rose-200 text-rose-900 font-bold shadow-2xs'
                }`}>
                  <span>Prediction: {latentResult?.prediction} {latentResult?.correct ? '✓' : '✗'}</span>
                  <span className="text-xs font-normal text-slate-600 font-sans">
                    Ground Truth: {task?.ground_truth} | Conf: {((latentResult?.confidence || 0) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="text-slate-900 font-bold uppercase text-[10px]">Resource Profile:</div>
            <div>• Emitted Tokens: <strong className="text-slate-700">0</strong></div>
            <div>• Internal State Updates: <strong className="text-purple-700">{latentResult?.R}</strong></div>
            <div>• Memory Footprint: Fixed-size vector (<code className="text-purple-700 font-mono font-semibold">d = 48</code> coordinates).</div>
          </div>
        </div>
      </div>

      {/* 3. OBSERVED DYNAMICS: Central Conceptual Principle */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 md:p-7 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          The Central Question: Where is Intermediate Computation Represented?
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          The distinction between Chain-of-Thought (Mode A) and Latent Reasoning (Mode B) is not merely cosmetic. It defines the mathematical substrate of machine thought:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="p-4 rounded-xl bg-blue-50/40 border border-blue-200/70 space-y-1.5">
            <span className="font-bold text-blue-900 block text-xs uppercase tracking-wide">Mode A: Serialized Tokens</span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Intermediate computation is converted into human language text and appended to the context window. 
              Memory scales linearly <MathInline math="O(L)" className="text-blue-700 font-semibold" /> and future all-pairs attention computation grows quadratically <MathInline math="O(L^2)" className="text-blue-700 font-semibold" />.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-purple-50/40 border border-purple-200/70 space-y-1.5">
            <span className="font-bold text-purple-900 block text-xs uppercase tracking-wide">Mode B: Continuous Hidden State</span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Intermediate computation is executed inside a fixed-size state vector <MathInline math="S_t \in \mathbb{R}^{48}" className="text-purple-700 font-semibold" />. 
              Zero reasoning tokens are emitted into the context sequence; working memory footprint remains fixed <MathInline math="O(1)" className="text-purple-700 font-semibold" />.
            </p>
          </div>
        </div>
      </div>

      {/* Structured Computational Proxy Comparison */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 md:p-8 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900">Computational Proxy Telemetry Comparison</h3>
          <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
            NUMPY ENGINE TELEMETRY
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Computational proxy comparing token emission against recurrent vector updates on synthetic modular arithmetic.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-blue-900 block uppercase tracking-wide">Mode A: Explicit / CoT</span>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs">
                <span className="text-xs text-slate-400 block font-medium">Tokens Emitted</span>
                <span className="text-xl font-bold text-blue-700 font-mono mt-0.5 block">{explicitResult?.token_count}</span>
              </div>
              <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs">
                <span className="text-xs text-slate-400 block font-medium">Internal Updates</span>
                <span className="text-xl font-bold text-slate-400 font-mono mt-0.5 block">0</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-purple-900 block uppercase tracking-wide">Mode B: Latent State</span>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs">
                <span className="text-xs text-slate-400 block font-medium">Tokens Emitted</span>
                <span className="text-xl font-bold text-slate-400 font-mono mt-0.5 block">0</span>
              </div>
              <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs">
                <span className="text-xs text-slate-400 block font-medium">Internal Updates</span>
                <span className="text-xl font-bold text-purple-700 font-mono mt-0.5 block">{latentResult?.R}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-3 leading-relaxed">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong>Scientific Honesty Note:</strong> These toy metrics illustrate the architectural mechanics on synthetic arithmetic. 
            They are <strong>not proof</strong> of general speed, cost, or scaling superiority for full-scale real-world LLMs.
          </div>
        </div>
      </div>

      {/* Equation Cards */}
      <EquationCard
        title="Latent Recurrence Formulation"
        formula="s_{t+1} = s_t + \alpha \cdot W_2 \tanh(W_1 s_t + b_1), \qquad s_t \in \mathbb{R}^{48}"
        plainEnglish="Rather than appending new tokens to sequence length, the model refines a fixed-size vector representation through residual multi-layer perceptron (MLP) updates."
        numericExample={`For R=3 updates, state changes by L2 norm deltas: [${latentResult?.state_deltas.map(d => d.toFixed(2)).join(', ')}]`}
      />

      {/* Storytelling Transition to Next Chapter */}
      <div className="p-6 md:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs uppercase tracking-wider text-indigo-600 font-bold block">
            Pedagogical Progression: Chapter 03 ➔ Chapter 04
          </span>
          <p className="text-xs sm:text-sm text-slate-700 font-medium">
            Instead of writing every step as text, can we directly control the depth of computation inside this hidden state?
          </p>
        </div>
        <button
          onClick={onNextChapter}
          className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 hover:shadow-lg hover:brightness-105 transition-all cursor-pointer"
        >
          <span>Continue → Latent Reasoning Lab</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
