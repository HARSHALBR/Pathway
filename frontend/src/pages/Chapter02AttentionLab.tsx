import React, { useState, useEffect } from 'react';
import { runTransformerForward, analyzeAttention } from '../services/api';
import type { TransformerForwardResponse, AttentionAnalyzeResponse } from '../types/api';
import { EvidenceBadge } from '../components/common/EvidenceBadge';
import { EquationCard } from '../components/common/EquationCard';
import { Layers, ArrowRight, Info, Eye } from 'lucide-react';

interface Props {
  onNextChapter: () => void;
}

export const Chapter02AttentionLab: React.FC<Props> = ({ onNextChapter }) => {
  const [sentence] = useState('The cat sat on the mat');
  const [transformerData, setTransformerData] = useState<TransformerForwardResponse | null>(null);
  const [activeQueryIdx, setActiveQueryIdx] = useState(1); // 'cat'
  const [activeKeyIdx, setActiveKeyIdx] = useState(5); // 'mat'
  const [attentionData, setAttentionData] = useState<AttentionAnalyzeResponse | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ qIdx: number; kIdx: number } | null>(null);
  const [selectedCell, setSelectedCell] = useState<{ qIdx: number; kIdx: number }>({ qIdx: 1, kIdx: 5 });

  useEffect(() => {
    runTransformerForward(sentence)
      .then((res) => {
        setTransformerData(res);
      })
      .catch((err) => console.error('Failed to load transformer data:', err));
  }, [sentence]);

  useEffect(() => {
    analyzeAttention(sentence, activeQueryIdx)
      .then((res) => {
        setAttentionData(res);
      })
      .catch((err) => console.error('Failed to load attention breakdown:', err));
  }, [sentence, activeQueryIdx]);

  const tokens = transformerData?.tokens || ['the', 'cat', 'sat', 'on', 'the', 'mat'];
  const scores = transformerData?.scores || [];
  const weights = transformerData?.attention_weights || [];
  const comparisons = attentionData?.comparisons || [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Chapter Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-indigo-950 text-indigo-300 border border-indigo-700/50 font-semibold">
            CHAPTER 02
          </span>
          <EvidenceBadge type="live" />
          <EvidenceBadge type="toy" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Attention Laboratory: Query-Key Matching & Value Aggregation
        </h1>

        <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-3xl">
          Self-attention allows every token to dynamic look at every other token in the sequence. 
          Select any active token as a <strong className="text-indigo-400">Query (Q)</strong> and watch it compare against all <strong className="text-emerald-400">Keys (K)</strong> 
          via scaled dot-products to normalize into attention weights and aggregate <strong className="text-amber-400">Values (V)</strong>.
        </p>
      </div>

      {/* Interactive Query & Key Token Drivers */}
      <div className="lab-glass-card p-5 space-y-5">
        {/* Driver 1: Query Token A */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-400" />
              <span>Select Query Token A (What is Looking):</span>
            </span>
            <span className="text-xs font-mono text-indigo-300">
              Query A: <strong>"{tokens[activeQueryIdx]}" (pos {activeQueryIdx})</strong>
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {tokens.map((tok, idx) => {
              const isQuery = idx === activeQueryIdx;
              return (
                <button
                  key={`q-${idx}`}
                  onClick={() => {
                    setActiveQueryIdx(idx);
                    setSelectedCell({ qIdx: idx, kIdx: activeKeyIdx });
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-mono text-xs transition-all cursor-pointer border ${
                    isQuery
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold border-indigo-400 shadow-md shadow-indigo-500/30 scale-105'
                      : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="text-[10px] text-slate-400 font-normal">#{idx}</span>
                  <span className="text-xs tracking-wide">"{tok}"</span>
                  {isQuery && <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-200">Q</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Driver 2: Key Token B */}
        <div className="space-y-2 pt-3 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Select Key Token B (What is Being Evaluated):</span>
            </span>
            <span className="text-xs font-mono text-emerald-300">
              Key B: <strong>"{tokens[activeKeyIdx]}" (pos {activeKeyIdx})</strong>
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {tokens.map((tok, idx) => {
              const isKey = idx === activeKeyIdx;
              return (
                <button
                  key={`k-${idx}`}
                  onClick={() => {
                    setActiveKeyIdx(idx);
                    setSelectedCell({ qIdx: activeQueryIdx, kIdx: idx });
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-mono text-xs transition-all cursor-pointer border ${
                    isKey
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold border-emerald-400 shadow-md shadow-emerald-500/30 scale-105'
                      : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="text-[10px] text-slate-400 font-normal">#{idx}</span>
                  <span className="text-xs tracking-wide">"{tok}"</span>
                  {isKey && <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-200">K</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Required Micro-Experiment: Pairwise Query-Key Computational Walkthrough */}
      <div className="lab-glass-card p-6 border-l-4 border-l-indigo-500 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider block">
              Step-by-Step Attention Computation Walkthrough
            </span>
            <h3 className="text-sm md:text-base font-bold text-white">
              Comparing Query #{activeQueryIdx} "{tokens[activeQueryIdx]}" with Key #{activeKeyIdx} "{tokens[activeKeyIdx]}"
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800">
            Softmax Attention Weight A[{activeQueryIdx},{activeKeyIdx}] = {((weights[activeQueryIdx]?.[activeKeyIdx] || 0) * 100).toFixed(1)}%
          </span>
        </div>

        {/* 3 computational columns: Projections -> Dot Product & Scale -> Softmax & Value Agg */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
          {/* Step 1: Q and K Projections */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <span className="text-[10px] font-sans font-bold text-indigo-400 uppercase block">1. Linear Projections</span>
            <div className="text-slate-300 space-y-2">
              <div>
                <span className="text-indigo-300 font-bold">Q_{tokens[activeQueryIdx]} = H₀ · W_Q:</span>
                <div className="text-[11px] text-indigo-200 mt-0.5">
                  [{transformerData?.Q[activeQueryIdx]?.map(v => v.toFixed(2)).join(', ')}]
                </div>
              </div>
              <div className="pt-1.5 border-t border-slate-900">
                <span className="text-emerald-300 font-bold">K_{tokens[activeKeyIdx]} = H₀ · W_K:</span>
                <div className="text-[11px] text-emerald-200 mt-0.5">
                  [{transformerData?.K[activeKeyIdx]?.map(v => v.toFixed(2)).join(', ')}]
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Dot Product & Scaling */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <span className="text-[10px] font-sans font-bold text-purple-400 uppercase block">2. Dot Product & Scaling</span>
            {(() => {
              const q = transformerData?.Q[activeQueryIdx] || [0, 0, 0, 0];
              const k = transformerData?.K[activeKeyIdx] || [0, 0, 0, 0];
              const dot = q.reduce((acc, val, i) => acc + val * (k[i] || 0), 0);
              const scaled = dot / 2.0;
              return (
                <div className="text-slate-300 space-y-1.5">
                  <div className="text-[10px] text-slate-400 font-mono">
                    q₁k₁ + q₂k₂ + q₃k₃ + q₄k₄
                  </div>
                  <div className="text-purple-300 font-bold text-xs">
                    Q · K = {dot.toFixed(3)}
                  </div>
                  <div className="pt-1 border-t border-slate-900 text-indigo-300 text-xs">
                    Score S = {dot.toFixed(3)} ÷ √4 = <strong className="text-white">{scaled.toFixed(3)}</strong>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Step 3: Softmax Distribution & Value Output */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <span className="text-[10px] font-sans font-bold text-amber-400 uppercase block">3. Softmax & Value Output</span>
            {(() => {
              const w = weights[activeQueryIdx]?.[activeKeyIdx] || 0;
              const v = transformerData?.V[activeKeyIdx] || [0, 0, 0, 0];
              const weightedV = v.map(val => val * w);
              return (
                <div className="text-slate-300 space-y-1.5">
                  <div className="text-emerald-400 font-bold text-xs">
                    Attention Weight = {(w * 100).toFixed(1)}%
                  </div>
                  <div className="text-[11px] text-slate-400">
                    V_{tokens[activeKeyIdx]}: [{v.map(val => val.toFixed(2)).join(', ')}]
                  </div>
                  <div className="pt-1 border-t border-slate-900 text-amber-300 text-[11px]">
                    A · V = [{weightedV.map(val => val.toFixed(2)).join(', ')}]
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-slate-300 leading-relaxed">
          💡 <strong>Dynamic Explanation:</strong> The query is being compared against every key. The resulting softmax distribution determines how strongly this token uses each token's value.
          Here, "{tokens[activeQueryIdx]}" allocates <strong>{((weights[activeQueryIdx]?.[activeKeyIdx] || 0) * 100).toFixed(1)}%</strong> of its contextual attention to the value representation provided by "{tokens[activeKeyIdx]}".
        </div>
      </div>

      {/* Active Query vs All Keys Breakdown Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>1. Live Query-Key Compatibility Trace for Query "{tokens[activeQueryIdx]}"</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">
            d_k = 4, √d_k = 2.0
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/90">
          <table className="w-full text-xs font-mono text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400">
                <th className="p-3">Key Token</th>
                <th className="p-3 text-center">Raw Dot Product (Q · K)</th>
                <th className="p-3 text-center">Scaled Score (S = Q·K / 2)</th>
                <th className="p-3 text-center">Softmax Attention Weight (A)</th>
                <th className="p-3">Attention Distribution Bar</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((c) => {
                const isSelf = c.key_idx === activeQueryIdx;
                const pct = Math.round(c.attention_weight * 100);
                return (
                  <tr
                    key={c.key_idx}
                    className={`border-b border-slate-900 transition-colors ${
                      isSelf ? 'bg-indigo-950/40 text-white' : 'hover:bg-slate-900/40 text-slate-300'
                    }`}
                  >
                    <td className="p-3 font-bold text-emerald-300">
                      #{c.key_idx} "{c.key_token}" {isSelf && <span className="text-[10px] text-slate-400 font-normal">(self)</span>}
                    </td>
                    <td className="p-3 text-center text-slate-200">
                      {c.dot_product.toFixed(3)}
                    </td>
                    <td className="p-3 text-center text-indigo-300 font-semibold">
                      {c.scaled_score.toFixed(3)}
                    </td>
                    <td className="p-3 text-center text-emerald-400 font-bold text-sm">
                      {(c.attention_weight).toFixed(4)}
                    </td>
                    <td className="p-3 w-48">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-mono text-slate-300 w-10 text-right">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Full Attention Matrix Heatmap */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>2. Full Attention Weight Matrix A ∈ ℝᴸˣᴸ (Row Sums = 1.00)</span>
          </h3>
          {hoveredCell && (
            <div className="text-xs font-mono text-indigo-300 bg-indigo-950/80 px-2.5 py-1 rounded border border-indigo-700/50">
              Q: "{tokens[hoveredCell.qIdx]}" → K: "{tokens[hoveredCell.kIdx]}" | Score: {scores[hoveredCell.qIdx]?.[hoveredCell.kIdx]?.toFixed(2)} | Attention Weight: {weights[hoveredCell.qIdx]?.[hoveredCell.kIdx]?.toFixed(4)}
            </div>
          )}
        </div>

        <p className="text-xs text-slate-400">
          Hover any matrix cell to inspect why this token attends to another token. Each row represents a Query token; columns represent Key tokens.
        </p>

        <div className="overflow-x-auto p-4 bg-slate-950/90 rounded-xl border border-slate-800 flex justify-center">
          <div className="inline-block">
            {/* Column Headers (Keys) */}
            <div className="flex items-center ml-24 mb-2">
              {tokens.map((kTok, kIdx) => (
                <div key={kIdx} className="w-16 text-center font-mono text-xs text-emerald-400 font-bold truncate px-1">
                  "{kTok}"
                </div>
              ))}
            </div>

            {/* Rows (Queries) */}
            {tokens.map((qTok, qIdx) => (
              <div key={qIdx} className="flex items-center mb-1.5">
                <div className="w-24 font-mono text-xs text-indigo-300 font-bold text-right pr-3 truncate">
                  "{qTok}"
                </div>
                <div className="flex gap-1.5">
                  {tokens.map((_, kIdx) => {
                    const weight = weights[qIdx]?.[kIdx] || 0;
                    const opacity = Math.min(1, Math.max(0.12, weight * 2.2));
                    const isHovered = hoveredCell?.qIdx === qIdx && hoveredCell?.kIdx === kIdx;
                    return (
                      <div
                        key={kIdx}
                        onMouseEnter={() => setHoveredCell({ qIdx, kIdx })}
                        onMouseLeave={() => setHoveredCell(null)}
                        onClick={() => setSelectedCell({ qIdx, kIdx })}
                        className={`w-16 h-12 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all border ${
                          isHovered || (selectedCell.qIdx === qIdx && selectedCell.kIdx === kIdx)
                            ? 'border-white scale-110 shadow-lg z-10'
                            : 'border-slate-800 hover:border-indigo-400'
                        }`}
                        style={{
                          backgroundColor: `rgba(99, 102, 241, ${opacity})`,
                        }}
                      >
                        <span className="font-mono text-xs font-bold text-white drop-shadow">
                          {weight.toFixed(2)}
                        </span>
                        <span className="text-[9px] font-mono text-indigo-200/90">
                          {Math.round(weight * 100)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Attention Cell Mathematical Inspector Card */}
        {(() => {
          const insp = hoveredCell || selectedCell;
          const qIdx = insp.qIdx;
          const kIdx = insp.kIdx;
          const qTok = tokens[qIdx] || 'Query';
          const kTok = tokens[kIdx] || 'Key';
          const qVec = transformerData?.Q[qIdx] || [0, 0, 0, 0];
          const kVec = transformerData?.K[kIdx] || [0, 0, 0, 0];
          const vVec = transformerData?.V[kIdx] || [0, 0, 0, 0];
          const rawDot = qVec.reduce((sum, qVal, i) => sum + qVal * (kVec[i] || 0), 0);
          const scaledScore = rawDot / 2.0;
          const attnWeight = weights[qIdx]?.[kIdx] || 0;
          const weightedV = vVec.map((v) => v * attnWeight);

          return (
            <div className="p-5 rounded-xl bg-slate-900/90 border border-indigo-500/50 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-700 font-bold">
                    ACTIVE CELL INSPECTOR
                  </span>
                  <h4 className="text-sm font-bold text-white font-mono">
                    Query #{qIdx} "{qTok}" ➔ Key #{kIdx} "{kTok}"
                  </h4>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  (Click any cell in matrix above to lock inspection)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                {/* Q Vector */}
                <div className="p-3 rounded-lg bg-slate-950 border border-indigo-900/60 space-y-1">
                  <span className="text-indigo-400 block text-[10px] font-sans uppercase font-bold">Query Vector Q({qTok})</span>
                  <div className="text-indigo-200">[{qVec.map(v => v.toFixed(3)).join(', ')}]</div>
                </div>

                {/* K Vector */}
                <div className="p-3 rounded-lg bg-slate-950 border border-emerald-900/60 space-y-1">
                  <span className="text-emerald-400 block text-[10px] font-sans uppercase font-bold">Key Vector K({kTok})</span>
                  <div className="text-emerald-200">[{kVec.map(v => v.toFixed(3)).join(', ')}]</div>
                </div>

                {/* Raw Dot Product & Scaling */}
                <div className="p-3 rounded-lg bg-slate-950 border border-purple-900/60 space-y-1">
                  <span className="text-purple-400 block text-[10px] font-sans uppercase font-bold">Dot Product & Scale (/√d_k)</span>
                  <div className="text-purple-200">Q·K = {rawDot.toFixed(3)}</div>
                  <div className="text-indigo-300 font-bold">S = {rawDot.toFixed(3)} / 2 = {scaledScore.toFixed(3)}</div>
                </div>

                {/* Normalized Weight & Weighted Value */}
                <div className="p-3 rounded-lg bg-slate-950 border border-amber-900/60 space-y-1">
                  <span className="text-amber-400 block text-[10px] font-sans uppercase font-bold">Softmax Weight A & Value Agg</span>
                  <div className="text-emerald-400 font-bold text-sm">A = {attnWeight.toFixed(4)} ({Math.round(attnWeight * 100)}%)</div>
                  <div className="text-amber-200 text-[10px]">A·V = [{weightedV.map(v => v.toFixed(3)).join(', ')}]</div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-950/60 p-2.5 rounded border border-slate-800">
                💡 <strong>Why this weight?</strong> The dot product between Query vector "{qTok}" and Key vector "{kTok}" yields raw similarity {rawDot.toFixed(3)}. Dividing by √d_k = 2.0 scales it to {scaledScore.toFixed(3)}. When exponentiated and normalized against all tokens in the row via softmax, it allocates exactly <strong>{(attnWeight * 100).toFixed(1)}%</strong> of "{qTok}"'s contextual attention to the value information carried by "{kTok}".
              </p>
            </div>
          );
        })()}
      </div>

      {/* Equation Cards */}
      <EquationCard
        title="Scaled Dot-Product Attention Formula"
        formula="A = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right), \quad \text{Attention}(Q, K, V) = A \cdot V"
        plainEnglish="The Query vector (what this token is looking for) is compared via dot product with Key vectors (what other tokens offer). We scale by 1/√d_k to prevent extreme values from causing vanishing gradients in the softmax."
        numericExample={`For Query "${tokens[activeQueryIdx]}", max attention is ${Math.max(...(weights[activeQueryIdx] || [0])).toFixed(3)}.`}
        source="Vaswani et al. (2017) 'Attention Is All You Need'"
      />

      <EquationCard
        title="Why Scale by √d_k?"
        formula="\text{Var}(q \cdot k) = d_k \implies \text{Var}\left(\frac{q \cdot k}{\sqrt{d_k}}\right) = 1.0"
        plainEnglish="As dimension d_k increases, the magnitude of dot products grows proportionally to d_k, pushing softmax into regions with near-zero gradients. Dividing by √d_k keeps the variance equal to 1."
      />

      {/* Educational Note */}
      <div className="lab-glass-card p-4 border-l-4 border-l-amber-500 text-xs text-slate-300 space-y-1">
        <div className="font-bold text-amber-300 flex items-center gap-1.5">
          <Info className="w-4 h-4" />
          <span>Notice: The KV-Cache Memory Consequence</span>
        </div>
        <p>
          In standard autoregressive Transformers, every time a new token is generated, its Query must compute attention against all existing Keys. 
          To avoid recomputing past representations, keys and values are cached (the <strong>KV-cache</strong>). 
          This cache grows linearly <code className="text-amber-300 font-mono">O(L)</code> in memory and requires quadratic <code className="text-amber-300 font-mono">O(L²)</code> total attention computation over a long Chain-of-Thought sequence.
        </p>
      </div>

      {/* Storytelling Transition to Next Chapter */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-indigo-950/40 border border-indigo-700/40 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold block">
            THE INTELLECTUAL JOURNEY: CHAPTER 02 ➔ CHAPTER 03
          </span>
          <p className="text-xs sm:text-sm text-slate-200 font-medium">
            Attention lets tokens communicate. But reasoning sometimes requires more than one computational step.
          </p>
        </div>
        <button
          onClick={onNextChapter}
          className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
        >
          <span>Continue → Explicit vs Latent Reasoning</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
