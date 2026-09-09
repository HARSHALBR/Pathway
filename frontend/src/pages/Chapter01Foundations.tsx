import React, { useState, useEffect } from 'react';
import { runTransformerForward } from '../services/api';
import type { TransformerForwardResponse } from '../types/api';
import { EvidenceBadge } from '../components/common/EvidenceBadge';
import { EquationCard } from '../components/common/EquationCard';
import { Sparkles, Hash, Layers, ArrowRight } from 'lucide-react';

interface Props {
  onNextChapter: () => void;
}

export const Chapter01Foundations: React.FC<Props> = ({ onNextChapter }) => {
  const [sentence, setSentence] = useState('The cat sat on the mat');
  const [data, setData] = useState<TransformerForwardResponse | null>(null);
  const [selectedTokenIdx, setSelectedTokenIdx] = useState(1); // 'cat'
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);

  useEffect(() => {
    let isMounted = true;
    runTransformerForward(sentence)
      .then((res) => {
        if (isMounted) {
          setData(res);
          if (selectedTokenIdx >= res.tokens.length) {
            setSelectedTokenIdx(0);
          }
        }
      })
      .catch((err) => console.error('Failed to load transformer data:', err));

    return () => { isMounted = false; };
  }, [sentence]);

  const tokens = data?.tokens || ['the', 'cat', 'sat', 'on', 'the', 'mat'];
  const tokenIds = data?.token_ids || [1, 2, 10, 11, 1, 12];
  const X = data?.X || [];
  const P = data?.P || [];
  const H0 = data?.H0 || [];

  const currentX = X[selectedTokenIdx] || [0, 0, 0, 0];
  const currentP = P[selectedTokenIdx] || [0, 0, 0, 0];
  const currentH0 = H0[selectedTokenIdx] || [0, 0, 0, 0];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Chapter Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-indigo-950 text-indigo-300 border border-indigo-700/50 font-semibold">
            CHAPTER 01
          </span>
          <EvidenceBadge type="live" />
          <EvidenceBadge type="toy" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Transformer Foundations: Tokens, Embeddings & Positions
        </h1>

        <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-3xl">
          Before attention can compare tokens, human language must be converted into continuous geometric coordinates. 
          Deconstruct how discrete words map into embedding vectors <span className="font-mono text-indigo-300">X</span>, 
          absorb positional coordinates <span className="font-mono text-emerald-300">P</span>, and form initial hidden representations <span className="font-mono text-amber-300">H₀ = X + P</span>.
        </p>
      </div>

      {/* Preset Sentence Selector */}
      <div className="lab-glass-card p-5 space-y-3">
        <label className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold block">
          Input Sequence for Laboratory Inspection:
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            'The cat sat on the mat',
            'The dog runs fast',
            'A bird was on the mat',
            'The cat chased a mouse'
          ].map((s) => (
            <button
              key={s}
              onClick={() => setSentence(s)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                sentence === s
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-indigo-700/60'
              }`}
            >
              "{s}"
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Token Inspection Chips */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>1. Interactive Token Breakdown (Click to Inspect)</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Sequence Length L = {tokens.length}
          </span>
        </div>

        <div className="flex flex-wrap gap-2.5 p-4 bg-slate-950/80 rounded-xl border border-slate-800">
          {tokens.map((token, idx) => {
            const isSelected = idx === selectedTokenIdx;
            return (
              <button
                key={idx}
                onClick={() => setSelectedTokenIdx(idx)}
                className={`flex flex-col items-center px-4 py-2 rounded-lg transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-500/30 scale-105'
                    : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <span className="font-mono text-xs text-indigo-300/80 font-normal">pos {idx}</span>
                <span className="font-bold text-sm tracking-wide">"{token}"</span>
                <span className="font-mono text-[10px] text-slate-400 mt-0.5">ID: {tokenIds[idx]}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Token Vectors Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Semantic Embedding X */}
          <div className="p-4 rounded-xl bg-indigo-950/25 border border-indigo-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-indigo-300">Semantic Embedding X</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-900/60 text-indigo-200">
                E[ID={tokenIds[selectedTokenIdx]}] ∈ ℝ⁴
              </span>
            </div>
            <div className="p-2.5 bg-slate-950/80 rounded border border-indigo-800/40 font-mono text-xs text-indigo-200">
              [{currentX.map((val, i) => (
                <span key={i} className="inline-block px-1 py-0.5 m-0.5 rounded bg-indigo-900/40 text-indigo-300">
                  {val.toFixed(3)}
                </span>
              ))}]
            </div>
            <p className="text-[11px] text-slate-400">
              Static meaning coordinate looked up from vocabulary matrix <code className="text-indigo-300 font-mono">E ∈ ℝ²⁴ˣ⁴</code>.
            </p>
          </div>

          {/* Positional Vector P */}
          <div className="p-4 rounded-xl bg-emerald-950/25 border border-emerald-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-300">Position Vector P</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-200">
                P[pos={selectedTokenIdx}] ∈ ℝ⁴
              </span>
            </div>
            <div className="p-2.5 bg-slate-950/80 rounded border border-emerald-800/40 font-mono text-xs text-emerald-200">
              [{currentP.map((val, i) => (
                <span key={i} className="inline-block px-1 py-0.5 m-0.5 rounded bg-emerald-900/40 text-emerald-300">
                  {val.toFixed(3)}
                </span>
              ))}]
            </div>
            <p className="text-[11px] text-slate-400">
              Encodes order in the sequence so "cat sat" differs from "sat cat".
            </p>
          </div>

          {/* Combined Hidden State H0 */}
          <div className="p-4 rounded-xl bg-amber-950/25 border border-amber-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-300">Combined State H₀</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-900/60 text-amber-200">
                X + P ∈ ℝ⁴
              </span>
            </div>
            <div className="p-2.5 bg-slate-950/80 rounded border border-amber-800/40 font-mono text-xs text-amber-200">
              [{currentH0.map((val, i) => (
                <span key={i} className="inline-block px-1 py-0.5 m-0.5 rounded bg-amber-900/40 text-amber-300">
                  {val.toFixed(3)}
                </span>
              ))}]
            </div>
            <p className="text-[11px] text-slate-400">
              Elementwise sum entering the self-attention Query, Key, and Value projections.
            </p>
          </div>
        </div>
      </div>

      {/* Critical Conceptual Distinction: V vs d */}
      <div className="lab-glass-card p-5 border-l-4 border-l-purple-500 space-y-3">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Hash className="w-4 h-4 text-purple-400" />
          <span>Fundamental Distinction: Vocabulary Size (V) vs. Embedding Dimension (d)</span>
        </h3>
        <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
          Beginners often conflate vocabulary size and embedding dimension. They are entirely different mathematical concepts:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="p-3.5 rounded bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-xs font-mono font-bold text-purple-400 uppercase">Vocabulary Size (V = 24)</span>
            <p className="text-xs text-slate-300">
              The total count of unique words/tokens known by the dictionary (e.g. 24 words in this toy model; ~100,000 in production LLMs).
            </p>
          </div>
          <div className="p-3.5 rounded bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase">Embedding Dimension (d = 4)</span>
            <p className="text-xs text-slate-300">
              The length of each continuous vector coordinate used to represent a token in semantic space (d=4 here for inspectability; d=4096 in Llama 3).
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Matrix Addition Table: X + P = H0 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>2. Live Matrix Addition Table: X + P = H₀ (Hover Cells to Inspect)</span>
          </h3>
          {hoveredCell && (
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-700/50">
              Token "{tokens[hoveredCell.row]}" | Dim d{hoveredCell.col}: X({X[hoveredCell.row]?.[hoveredCell.col]?.toFixed(2)}) + P({P[hoveredCell.row]?.[hoveredCell.col]?.toFixed(2)}) = H₀({H0[hoveredCell.row]?.[hoveredCell.col]?.toFixed(2)})
            </span>
          )}
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/90">
          <table className="w-full text-xs font-mono text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400">
                <th className="p-3">Pos</th>
                <th className="p-3">Token</th>
                <th className="p-3 text-center" colSpan={4}>Embedding X ∈ ℝ⁴</th>
                <th className="p-3 text-center" colSpan={4}>Positional P ∈ ℝ⁴</th>
                <th className="p-3 text-center" colSpan={4}>Combined H₀ ∈ ℝ⁴</th>
              </tr>
              <tr className="border-b border-slate-800/80 text-[10px] text-slate-400 text-center">
                <th></th>
                <th></th>
                <th>d0</th><th>d1</th><th>d2</th><th>d3</th>
                <th>d0</th><th>d1</th><th>d2</th><th>d3</th>
                <th>d0</th><th>d1</th><th>d2</th><th>d3</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((tok, rIdx) => {
                const isSelected = rIdx === selectedTokenIdx;
                return (
                  <tr
                    key={rIdx}
                    onClick={() => setSelectedTokenIdx(rIdx)}
                    className={`border-b border-slate-900 cursor-pointer transition-colors ${
                      isSelected ? 'bg-indigo-950/50 text-white font-semibold' : 'hover:bg-slate-900/50 text-slate-300'
                    }`}
                  >
                    <td className="p-2.5 text-slate-400 text-center">{rIdx}</td>
                    <td className="p-2.5 font-bold text-indigo-300">"{tok}"</td>
                    {/* X */}
                    {X[rIdx]?.map((val, cIdx) => (
                      <td
                        key={`x-${cIdx}`}
                        onMouseEnter={() => setHoveredCell({ row: rIdx, col: cIdx })}
                        onMouseLeave={() => setHoveredCell(null)}
                        className="p-2 text-center text-indigo-200 hover:bg-indigo-600/30"
                      >
                        {val.toFixed(2)}
                      </td>
                    ))}
                    {/* P */}
                    {P[rIdx]?.map((val, cIdx) => (
                      <td
                        key={`p-${cIdx}`}
                        onMouseEnter={() => setHoveredCell({ row: rIdx, col: cIdx })}
                        onMouseLeave={() => setHoveredCell(null)}
                        className="p-2 text-center text-emerald-300 hover:bg-emerald-600/30"
                      >
                        {val.toFixed(2)}
                      </td>
                    ))}
                    {/* H0 */}
                    {H0[rIdx]?.map((val, cIdx) => (
                      <td
                        key={`h-${cIdx}`}
                        onMouseEnter={() => setHoveredCell({ row: rIdx, col: cIdx })}
                        onMouseLeave={() => setHoveredCell(null)}
                        className="p-2 text-center text-amber-300 font-bold hover:bg-amber-600/30"
                      >
                        {val.toFixed(2)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Equation Cards */}
      <EquationCard
        title="1. Semantic Embedding Lookup Matrix"
        formula="X = E[token_ids], \quad E \in \mathbb{R}^{V \times d}, \quad X \in \mathbb{R}^{L \times d}"
        plainEnglish="Each integer token ID indexes a unique row in the embedding matrix E, extracting a dense d-dimensional coordinate vector representing the token's semantic meaning."
        numericExample={`For token "${tokens[selectedTokenIdx]}" (ID ${tokenIds[selectedTokenIdx]}): X = [${currentX.map(v => v.toFixed(2)).join(', ')}]`}
        source="Vaswani et al. (2017) 'Attention Is All You Need'"
      />

      <EquationCard
        title="2. Positional Encoding Injection"
        formula="H_0 = X + P, \quad P \in \mathbb{R}^{L \times d}, \quad H_0 \in \mathbb{R}^{L \times d}"
        plainEnglish="Transformers have no built-in recurrent loops or convolutions, so word order must be injected directly by adding position coordinate vectors P to the semantic embeddings X."
        numericExample={`H₀[${selectedTokenIdx}] = [${currentX.map(v => v.toFixed(2)).join(', ')}] + [${currentP.map(v => v.toFixed(2)).join(', ')}] = [${currentH0.map(v => v.toFixed(2)).join(', ')}]`}
      />

      {/* Transition to Next Chapter */}
      <div className="flex justify-between items-center pt-6 border-t border-slate-800">
        <div className="text-xs text-slate-400">
          Next: Discover how <span className="text-indigo-300 font-mono">H₀</span> projects into Queries, Keys, and Values to calculate self-attention.
        </div>
        <button
          onClick={onNextChapter}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
        >
          <span>Continue to Chapter 02: Attention Lab</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
