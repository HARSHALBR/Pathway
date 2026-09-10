import React, { useState, useEffect } from 'react';
import { runTransformerForward, analyzeAttention } from '../services/api';
import type { TransformerForwardResponse, AttentionAnalyzeResponse } from '../types/api';
import { EvidenceBadge } from '../components/common/EvidenceBadge';
import { EquationCard } from '../components/common/EquationCard';
import { MathInline } from '../components/common/MathFormula';
import { Layers, ArrowRight, Info, Eye, Sliders } from 'lucide-react';

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
    <div className="lab-container py-8 md:py-12 space-y-10">
      {/* Chapter Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
            Chapter 02 • Attention Laboratory
          </span>
          <EvidenceBadge type="live" />
          <EvidenceBadge type="toy" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Attention Laboratory: Query-Key Matching & Value Aggregation
        </h1>

        <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-4xl">
          Self-attention allows every token to dynamically look at every other token in the sequence. 
          Select any active token as a <strong className="text-blue-700">Query (Q)</strong> and watch it compare against all <strong className="text-indigo-700">Keys (K)</strong> 
          via scaled dot-products to normalize into attention weights and aggregate <strong className="text-purple-700">Values (V)</strong>.
        </p>
      </div>

      {/* 1. CONTROL SURFACE: Interactive Query & Key Token Drivers */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 md:p-7 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-600" />
            <span>Dual-Channel Attention Drivers</span>
          </span>
          <span className="text-xs text-slate-400 font-medium">Interactive Coordinate Selection</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Driver 1: Query Token A */}
          <div className="space-y-3 p-4 rounded-xl bg-blue-50/40 border border-blue-200/70">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-blue-600" />
                <span>Active Query Token (Q):</span>
              </span>
              <span className="text-xs font-mono text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-lg border border-blue-200 font-semibold">
                Q: <strong>"{tokens[activeQueryIdx]}" (#{activeQueryIdx})</strong>
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
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer border ${
                      isQuery
                        ? 'bg-blue-600 text-white font-semibold border-blue-600 shadow-sm shadow-blue-500/20 scale-105'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`text-[10px] font-mono ${isQuery ? 'text-blue-100' : 'text-slate-400'}`}>#{idx}</span>
                    <span className="font-semibold">"{tok}"</span>
                    {isQuery && <span className="text-[9px] px-1 rounded bg-blue-700 text-white font-bold font-mono">Q</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Driver 2: Key Token B */}
          <div className="space-y-3 p-4 rounded-xl bg-indigo-50/40 border border-indigo-200/70">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                <span>Target Key Token (K):</span>
              </span>
              <span className="text-xs font-mono text-indigo-800 bg-indigo-100 px-2.5 py-0.5 rounded-lg border border-indigo-200 font-semibold">
                K: <strong>"{tokens[activeKeyIdx]}" (#{activeKeyIdx})</strong>
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
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer border ${
                      isKey
                        ? 'bg-indigo-600 text-white font-semibold border-indigo-600 shadow-sm shadow-indigo-500/20 scale-105'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`text-[10px] font-mono ${isKey ? 'text-indigo-100' : 'text-slate-400'}`}>#{idx}</span>
                    <span className="font-semibold">"{tok}"</span>
                    {isKey && <span className="text-[9px] px-1 rounded bg-indigo-700 text-white font-bold font-mono">K</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 2. COMPUTED APPARATUS: Pairwise Query-Key Walkthrough */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 md:p-7 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block">
              Pairwise Attention Microscope
            </span>
            <h3 className="text-sm md:text-base font-bold text-slate-900 mt-0.5">
              Comparing Query #{activeQueryIdx} "{tokens[activeQueryIdx]}" with Key #{activeKeyIdx} "{tokens[activeKeyIdx]}"
            </h3>
          </div>
          <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
            Attention Weight A[{activeQueryIdx},{activeKeyIdx}] = {((weights[activeQueryIdx]?.[activeKeyIdx] || 0) * 100).toFixed(1)}%
          </span>
        </div>

        {/* 3 computational columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          {/* Step 1: Q and K Projections */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
            <span className="text-[10px] font-sans font-bold text-slate-500 uppercase block">1. Linear Projections</span>
            <div className="text-slate-700 space-y-2">
              <div>
                <span className="text-blue-700 font-bold font-sans">Q_{tokens[activeQueryIdx]} = H₀ · W_Q:</span>
                <div className="text-[11px] text-blue-900 mt-0.5 bg-white p-1.5 rounded border border-slate-200">
                  [{transformerData?.Q[activeQueryIdx]?.map(v => v.toFixed(2)).join(', ')}]
                </div>
              </div>
              <div className="pt-1.5 border-t border-slate-200">
                <span className="text-indigo-700 font-bold font-sans">K_{tokens[activeKeyIdx]} = H₀ · W_K:</span>
                <div className="text-[11px] text-indigo-900 mt-0.5 bg-white p-1.5 rounded border border-slate-200">
                  [{transformerData?.K[activeKeyIdx]?.map(v => v.toFixed(2)).join(', ')}]
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Dot Product & Scaling */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
            <span className="text-[10px] font-sans font-bold text-slate-500 uppercase block">2. Dot Product & Scaling</span>
            {(() => {
              const q = transformerData?.Q[activeQueryIdx] || [0, 0, 0, 0];
              const k = transformerData?.K[activeKeyIdx] || [0, 0, 0, 0];
              const dot = q.reduce((acc, val, i) => acc + val * (k[i] || 0), 0);
              const scaled = dot / 2.0;
              return (
                <div className="text-slate-700 space-y-2">
                  <div className="text-[11px] text-slate-500 font-sans">
                    <MathInline math="q_1 k_1 + q_2 k_2 + q_3 k_3 + q_4 k_4" />
                  </div>
                  <div className="text-slate-900 font-bold text-xs bg-white p-2 rounded-lg border border-slate-200">
                    <MathInline math={`Q \\cdot K = ${dot.toFixed(3)}`} />
                  </div>
                  <div className="pt-1.5 border-t border-slate-200 text-indigo-700 text-xs">
                    <MathInline math={`S = \\frac{Q \\cdot K}{\\sqrt{d_k}} = \\frac{${dot.toFixed(3)}}{2.0} = ${scaled.toFixed(3)}`} />
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Step 3: Softmax & Value Output */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
            <span className="text-[10px] font-sans font-bold text-slate-500 uppercase block">3. Softmax & Value Output</span>
            {(() => {
              const w = weights[activeQueryIdx]?.[activeKeyIdx] || 0;
              const v = transformerData?.V[activeKeyIdx] || [0, 0, 0, 0];
              const weightedV = v.map(val => val * w);
              return (
                <div className="text-slate-700 space-y-2">
                  <div className="text-teal-700 font-bold text-xs bg-white p-2 rounded-lg border border-slate-200">
                    <MathInline math={`A_{${activeQueryIdx},${activeKeyIdx}} = ${(w * 100).toFixed(1)}\\%`} />
                  </div>
                  <div className="text-[11px] text-slate-600">
                    <MathInline math={`V_{\\text{${tokens[activeKeyIdx]}}}`} />: [{v.map(val => val.toFixed(2)).join(', ')}]
                  </div>
                  <div className="pt-1.5 border-t border-slate-200 text-indigo-700 font-bold text-xs">
                    <MathInline math="A \\cdot V" /> = [{weightedV.map(val => val.toFixed(2)).join(', ')}]
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200/70 flex items-start gap-3 text-xs text-blue-950 leading-relaxed">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <strong>Causal Mechanism:</strong> The query token is projected and compared against every key token in the sequence. Softmax normalization enforces a convex combination (weights sum to 1.0).
            Here, "{tokens[activeQueryIdx]}" allocates <strong>{((weights[activeQueryIdx]?.[activeKeyIdx] || 0) * 100).toFixed(1)}%</strong> of its contextual attention to the value representation provided by "{tokens[activeKeyIdx]}".
          </div>
        </div>
      </div>

      {/* 3. OBSERVED DYNAMICS: Active Query vs All Keys Breakdown Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 md:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Compatibility Trace for Query "{tokens[activeQueryIdx]}"</span>
          </h3>
          <span className="text-xs text-slate-600 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 font-medium">
            <MathInline math="d_k = 4, \quad \sqrt{d_k} = 2.0" />
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-xs font-mono text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-sans">
                <th className="p-3 font-semibold">Key Token</th>
                <th className="p-3 text-center font-semibold">Raw Dot Product (<MathInline math="Q \cdot K" />)</th>
                <th className="p-3 text-center font-semibold">Scaled Score (<MathInline math="S = \frac{Q \cdot K}{\sqrt{d_k}}" />)</th>
                <th className="p-3 text-center font-semibold">Softmax Weight (<MathInline math="A_{ij}" />)</th>
                <th className="p-3 font-semibold">Attention Distribution Bar</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((c) => {
                const isSelf = c.key_idx === activeQueryIdx;
                const pct = Math.round(c.attention_weight * 100);
                return (
                  <tr
                    key={c.key_idx}
                    className={`border-b border-slate-100 transition-colors ${
                      isSelf ? 'bg-indigo-50/70 text-slate-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <td className="p-3 font-bold text-indigo-700 font-sans">
                      #{c.key_idx} "{c.key_token}" {isSelf && <span className="text-[10px] text-slate-500 font-normal font-sans">(self)</span>}
                    </td>
                    <td className="p-3 text-center text-slate-700">
                      {c.dot_product.toFixed(3)}
                    </td>
                    <td className="p-3 text-center text-blue-700 font-semibold">
                      {c.scaled_score.toFixed(3)}
                    </td>
                    <td className="p-3 text-center text-indigo-700 font-bold text-sm">
                      {(c.attention_weight).toFixed(4)}
                    </td>
                    <td className="p-3 w-48">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                          <div
                            className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-mono text-slate-600 w-10 text-right">{pct}%</span>
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
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 md:p-8 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Full Attention Weight Matrix A ∈ ℝᴸˣᴸ (Row Sums = 1.0000)</span>
          </h3>
          {hoveredCell && (
            <div className="text-xs font-mono text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200 font-semibold">
              Q: "{tokens[hoveredCell.qIdx]}" → K: "{tokens[hoveredCell.kIdx]}" | Score: {scores[hoveredCell.qIdx]?.[hoveredCell.kIdx]?.toFixed(2)} | Weight: {weights[hoveredCell.qIdx]?.[hoveredCell.kIdx]?.toFixed(4)}
            </div>
          )}
        </div>

        <p className="text-xs text-slate-500">
          Hover any matrix cell to inspect pairwise similarity. Click any cell to lock the active mathematical inspector reticle.
        </p>

        <div className="overflow-x-auto p-6 bg-slate-50/60 rounded-2xl border border-slate-200 flex justify-center">
          <div className="inline-block">
            {/* Column Headers (Keys) */}
            <div className="flex items-center ml-24 mb-2">
              {tokens.map((kTok, kIdx) => (
                <div key={kIdx} className="w-16 text-center font-sans text-xs text-indigo-700 font-bold truncate px-1">
                  "{kTok}"
                </div>
              ))}
            </div>

            {/* Rows (Queries) */}
            {tokens.map((qTok, qIdx) => (
              <div key={qIdx} className="flex items-center mb-2">
                <div className="w-24 font-sans text-xs text-blue-700 font-bold text-right pr-3 truncate">
                  "{qTok}"
                </div>
                <div className="flex gap-2">
                  {tokens.map((_, kIdx) => {
                    const weight = weights[qIdx]?.[kIdx] || 0;
                    const opacity = Math.min(1, Math.max(0.08, weight * 1.8));
                    const isHovered = hoveredCell?.qIdx === qIdx && hoveredCell?.kIdx === kIdx;
                    const isSelected = selectedCell.qIdx === qIdx && selectedCell.kIdx === kIdx;
                    return (
                      <div
                        key={kIdx}
                        onMouseEnter={() => setHoveredCell({ qIdx, kIdx })}
                        onMouseLeave={() => setHoveredCell(null)}
                        onClick={() => setSelectedCell({ qIdx, kIdx })}
                        className={`w-16 h-12 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all border ${
                          isHovered || isSelected
                            ? 'border-indigo-600 scale-105 shadow-md shadow-indigo-500/20 z-10 bg-indigo-100'
                            : 'border-slate-200 hover:border-indigo-300'
                        }`}
                        style={{
                          backgroundColor: isHovered || isSelected ? undefined : `rgba(79, 70, 229, ${opacity})`,
                        }}
                      >
                        <span className={`font-mono text-xs font-bold ${weight > 0.35 ? 'text-white' : 'text-slate-900'}`}>
                          {weight.toFixed(2)}
                        </span>
                        <span className={`text-[9px] font-mono ${weight > 0.35 ? 'text-indigo-100' : 'text-slate-500'}`}>
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
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                    Cell Inspector
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 font-sans">
                    Query #{qIdx} "{qTok}" ➔ Key #{kIdx} "{kTok}"
                  </h4>
                </div>
                <span className="text-xs text-slate-400">
                  (Click any cell in matrix to pin inspection)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 text-xs font-mono">
                {/* Q Vector */}
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1 shadow-2xs">
                  <span className="text-blue-700 block text-[10px] font-sans uppercase font-bold">Query Vector Q({qTok})</span>
                  <div className="text-slate-800">[{qVec.map(v => v.toFixed(3)).join(', ')}]</div>
                </div>

                {/* K Vector */}
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1 shadow-2xs">
                  <span className="text-indigo-700 block text-[10px] font-sans uppercase font-bold">Key Vector K({kTok})</span>
                  <div className="text-slate-800">[{kVec.map(v => v.toFixed(3)).join(', ')}]</div>
                </div>

                {/* Raw Dot Product & Scaling */}
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1 shadow-2xs">
                  <span className="text-slate-500 block text-[10px] font-sans uppercase font-bold">
                    Dot Product & Scale (<MathInline math="\frac{1}{\sqrt{d_k}}" />)
                  </span>
                  <div className="text-slate-800"><MathInline math={`Q \\cdot K = ${rawDot.toFixed(3)}`} /></div>
                  <div className="text-indigo-700 font-bold"><MathInline math={`S = \\frac{${rawDot.toFixed(3)}}{\\sqrt{d_k}} = ${scaledScore.toFixed(3)}`} /></div>
                </div>

                {/* Normalized Weight & Weighted Value */}
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1 shadow-2xs">
                  <span className="text-slate-500 block text-[10px] font-sans uppercase font-bold">Softmax Weight A & Value Agg</span>
                  <div className="text-indigo-700 font-bold text-sm"><MathInline math={`A_{${qIdx},${kIdx}} = ${attnWeight.toFixed(4)}`} /> ({Math.round(attnWeight * 100)}%)</div>
                  <div className="text-slate-600 text-[10px]"><MathInline math="A \\cdot V" /> = [{weightedV.map(v => v.toFixed(3)).join(', ')}]</div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed italic bg-white p-3.5 rounded-xl border border-slate-200">
                💡 <strong>Calculation Rationale:</strong> The dot product between Query vector "{qTok}" and Key vector "{kTok}" yields raw similarity {rawDot.toFixed(3)}. Dividing by <MathInline math="\sqrt{d_k} = 2.0" /> scales it to {scaledScore.toFixed(3)}. When exponentiated and normalized against all tokens in the row via softmax, it allocates exactly <strong>{(attnWeight * 100).toFixed(1)}%</strong> of "{qTok}"'s contextual attention to the value information carried by "{kTok}".
              </p>
            </div>
          );
        })()}
      </div>

      {/* Equation Cards */}
      <EquationCard
        title="Scaled Dot-Product Attention Formula"
        formula="A = \operatorname{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right), \qquad \text{Attention}(Q, K, V) = A \cdot V"
        plainEnglish="The Query vector (what this token is looking for) is compared via dot product with Key vectors (what other tokens offer). We scale by 1/√d_k to prevent extreme values from causing vanishing gradients in the softmax."
        numericExample={`For Query "${tokens[activeQueryIdx]}", max attention is ${Math.max(...(weights[activeQueryIdx] || [0])).toFixed(3)}.`}
        source="Vaswani et al. (2017) 'Attention Is All You Need'"
      />

      <EquationCard
        title="Why Scale by √d_k?"
        formula="\operatorname{Var}(q \cdot k) = d_k \implies \operatorname{Var}\left(\frac{q \cdot k}{\sqrt{d_k}}\right) = 1.0"
        plainEnglish="As dimension d_k increases, the magnitude of dot products grows proportionally to d_k, pushing softmax into regions with near-zero gradients. Dividing by √d_k keeps the variance equal to 1."
      />

      {/* 5. WHAT THIS MEANS: KV-Cache Memory Note */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-2">
        <div className="font-bold text-slate-900 flex items-center gap-2">
          <Info className="w-4 h-4 text-indigo-600" />
          <span>The KV-Cache Memory Consequence</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          In standard autoregressive Transformers, every time a new token is generated, its Query must compute attention against all existing Keys. 
          To avoid recomputing past representations, keys and values are cached (the <strong>KV-cache</strong>). 
          This cache grows linearly <MathInline math="O(L)" className="text-indigo-600 font-semibold" /> in memory and requires quadratic <MathInline math="O(L^2)" className="text-indigo-600 font-semibold" /> total attention computation over a long Chain-of-Thought sequence.
        </p>
      </div>

      {/* Storytelling Transition to Next Chapter */}
      <div className="p-6 md:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs uppercase tracking-wider text-indigo-600 font-bold block">
            Pedagogical Progression: Chapter 02 ➔ Chapter 03
          </span>
          <p className="text-xs sm:text-sm text-slate-700 font-medium">
            Attention lets tokens communicate across a context window. But what happens when multi-step reasoning is needed?
          </p>
        </div>
        <button
          onClick={onNextChapter}
          className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 hover:shadow-lg hover:brightness-105 transition-all cursor-pointer"
        >
          <span>Continue → Explicit vs Latent Reasoning</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
