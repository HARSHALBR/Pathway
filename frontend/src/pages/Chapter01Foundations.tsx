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
  const [activePipelineStage, setActivePipelineStage] = useState<number>(0);

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

      {/* 12-Stage Micro-Level Computational Pipeline Map */}
      <div className="lab-glass-card p-6 border-slate-800 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Full Micro-Level Transformer Pipeline: From Text to LayerNorm</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any stage in the computational chain to inspect its input, exact mathematical operation, output shape, and meaning.
            </p>
          </div>
          <span className="text-xs font-mono text-indigo-300 bg-indigo-950/70 px-2.5 py-1 rounded border border-indigo-700/50">
            Micro-Stage {activePipelineStage + 1} of 12
          </span>
        </div>

        {/* Pipeline Stepper Buttons */}
        <div className="flex flex-wrap gap-1.5 p-2 bg-slate-950/80 rounded-xl border border-slate-800">
          {[
            { id: 0, label: '1. Text', sub: 'String' },
            { id: 1, label: '2. Tokenize', sub: 'Subwords' },
            { id: 2, label: '3. Token IDs', sub: 'Integers' },
            { id: 3, label: '4. Embedding', sub: 'X ∈ ℝ⁴' },
            { id: 4, label: '5. Position P', sub: 'P ∈ ℝ⁴' },
            { id: 5, label: '6. H₀ = X+P', sub: 'Initial State' },
            { id: 6, label: '7. Q, K, V', sub: 'Projections' },
            { id: 7, label: '8. Scores S', sub: 'QKᵀ / √d' },
            { id: 8, label: '9. Softmax A', sub: 'Weights' },
            { id: 9, label: '10. Value Agg', sub: 'A · V' },
            { id: 10, label: '11. Residual', sub: 'H₀ + Attn' },
            { id: 11, label: '12. LayerNorm', sub: 'LN(z)' },
          ].map((stg) => (
            <button
              key={stg.id}
              onClick={() => setActivePipelineStage(stg.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                activePipelineStage === stg.id
                  ? 'bg-indigo-600 text-white font-bold border border-indigo-400 shadow-sm'
                  : 'bg-slate-900/80 text-slate-300 border border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div>{stg.label}</div>
              <div className="text-[9px] text-slate-400 font-normal">{stg.sub}</div>
            </button>
          ))}
        </div>

        {/* Selected Stage Detail Card */}
        {(() => {
          const stagesInfo = [
            {
              title: "Stage 1: Raw Natural Language Input",
              input: 'Human sentence: "The cat sat on the mat"',
              operation: "Character stream ingestion & normalization",
              output: `String sequence (length ${sentence.length} chars)`,
              shape: "Scalar string",
              meaning: "Computers cannot directly multiply words. Text must be structured into discrete categorical units.",
              color: "border-indigo-500/50 bg-indigo-950/20 text-indigo-300"
            },
            {
              title: "Stage 2: Tokenization",
              input: `String "${sentence}"`,
              operation: `Wordpiece / BPE lookup against vocabulary V = ${data?.vocab_size || 24}`,
              output: `Tokens: [${tokens.map(t => `"${t}"`).join(', ')}]`,
              shape: `List of string tokens (L = ${tokens.length})`,
              meaning: "Maps raw text characters into discrete vocabulary tokens.",
              color: "border-indigo-500/50 bg-indigo-950/20 text-indigo-300"
            },
            {
              title: "Stage 3: Token ID Indexing",
              input: `Tokens: [${tokens.map(t => `"${t}"`).join(', ')}]`,
              operation: "Dict lookup: token_id = VOCAB[token]",
              output: `Token IDs: [${tokenIds.join(', ')}]`,
              shape: `Array of integers (L = ${tokens.length})`,
              meaning: "Each vocabulary word is assigned an index from 0 to V-1 (0 to 23).",
              color: "border-indigo-500/50 bg-indigo-950/20 text-indigo-300"
            },
            {
              title: "Stage 4: Semantic Embedding Lookup",
              input: `Token IDs [${tokenIds.join(', ')}] and Weight Matrix E ∈ ℝ²⁴ˣ⁴`,
              operation: "Row slicing: X[i] = E[token_ids[i]]",
              output: `Semantic matrix X (row for "${tokens[selectedTokenIdx]}": [${currentX.map(v => v.toFixed(2)).join(', ')}])`,
              shape: `Matrix X ∈ ℝ^(${tokens.length} × 4)`,
              meaning: "Extracts static semantic meaning coordinates in continuous space.",
              color: "border-indigo-500/50 bg-indigo-950/20 text-indigo-300"
            },
            {
              title: "Stage 5: Positional Encoding Injection",
              input: `Position indices [0, 1, ..., ${tokens.length - 1}] and P_matrix ∈ ℝ¹⁰ˣ⁴`,
              operation: "Position slice: P = P_matrix[:L]",
              output: `Position matrix P (row for pos ${selectedTokenIdx}: [${currentP.map(v => v.toFixed(2)).join(', ')}])`,
              shape: `Matrix P ∈ ℝ^(${tokens.length} × 4)`,
              meaning: "Provides spatial order information so word order matters.",
              color: "border-emerald-500/50 bg-emerald-950/20 text-emerald-300"
            },
            {
              title: "Stage 6: Initial Hidden State Formation",
              input: `Embedding X ∈ ℝ^(${tokens.length}×4) and Position P ∈ ℝ^(${tokens.length}×4)`,
              operation: "Elementwise addition: H₀ = X + P",
              output: `Hidden matrix H₀ (row for pos ${selectedTokenIdx}: [${currentH0.map(v => v.toFixed(2)).join(', ')}])`,
              shape: `Matrix H₀ ∈ ℝ^(${tokens.length} × 4)`,
              meaning: "Combined state carrying both semantic meaning and positional sequence order.",
              color: "border-amber-500/50 bg-amber-950/20 text-amber-300"
            },
            {
              title: "Stage 7: Linear Projections (Q, K, V)",
              input: `Hidden State H₀ ∈ ℝ^(${tokens.length}×4) and weight matrices W_Q, W_K, W_V ∈ ℝ⁴ˣ⁴`,
              operation: "Matrix multiplications: Q = H₀ W_Q, K = H₀ W_K, V = H₀ W_V",
              output: `Projections Q, K, V each in ℝ^(${tokens.length} × 4)`,
              shape: `Q ∈ ℝ^(${tokens.length}×4), K ∈ ℝ^(${tokens.length}×4), V ∈ ℝ^(${tokens.length}×4)`,
              meaning: "Specializes the representation into Queries (seeking info), Keys (indexing info), and Values (transmitting info).",
              color: "border-purple-500/50 bg-purple-950/20 text-purple-300"
            },
            {
              title: "Stage 8: Scaled Dot-Product Attention Scores",
              input: `Queries Q ∈ ℝ^(${tokens.length}×4) and Keys K ∈ ℝ^(${tokens.length}×4)`,
              operation: "Score matrix: S = Q Kᵀ / √d_k (where d_k = 4, √d_k = 2.0)",
              output: `Raw score matrix S with shape (${tokens.length} × ${tokens.length})`,
              shape: `S ∈ ℝ^(${tokens.length} × ${tokens.length})`,
              meaning: "Measures mutual pairwise geometric compatibility between all tokens.",
              color: "border-purple-500/50 bg-purple-950/20 text-purple-300"
            },
            {
              title: "Stage 9: Softmax Attention Weights",
              input: `Score matrix S ∈ ℝ^(${tokens.length}×${tokens.length})`,
              operation: "Row-wise softmax: A_ij = exp(S_ij - max S_i) / Σ exp(S_ik - max S_i)",
              output: `Attention probability matrix A (rows strictly sum to 1.0000)`,
              shape: `A ∈ ℝ^(${tokens.length} × ${tokens.length})`,
              meaning: "Converts compatibility scores into probability distributions over sequence keys.",
              color: "border-purple-500/50 bg-purple-950/20 text-purple-300"
            },
            {
              title: "Stage 10: Value Aggregation",
              input: `Attention weights A ∈ ℝ^(${tokens.length}×${tokens.length}) and Values V ∈ ℝ^(${tokens.length}×4)`,
              operation: "Weighted sum: Attn_Out = (A · V) W_O",
              output: `Aggregated Value representation`,
              shape: `Attn_Out ∈ ℝ^(${tokens.length} × 4)`,
              meaning: "Blends information from other tokens according to their attention weights.",
              color: "border-blue-500/50 bg-blue-950/20 text-blue-300"
            },
            {
              title: "Stage 11: Residual Connection",
              input: `Input H₀ ∈ ℝ^(${tokens.length}×4) and Attention Output Attn_Out ∈ ℝ^(${tokens.length}×4)`,
              operation: "Skip-connection addition: H₁ = H₀ + Attn_Out",
              output: `Residual state H₁`,
              shape: `H₁ ∈ ℝ^(${tokens.length} × 4)`,
              meaning: "Prevents gradient vanishing and preserves initial identity while incorporating contextual features.",
              color: "border-emerald-500/50 bg-emerald-950/20 text-emerald-300"
            },
            {
              title: "Stage 12: Layer Normalization (LN)",
              input: `State z ∈ ℝ^(${tokens.length}×4)`,
              operation: "Normalization: LN(z) = (z - μ) / √(σ² + ε)",
              output: `Zero-mean, unit-variance normalized activations (mean ≈ 0.0, std ≈ 1.0)`,
              shape: `Output ∈ ℝ^(${tokens.length} × 4)`,
              meaning: "Stabilizes signal dynamics across forward and backward propagation.",
              color: "border-teal-500/50 bg-teal-950/20 text-teal-300"
            }
          ];

          const info = stagesInfo[activePipelineStage] || stagesInfo[0];
          return (
            <div className={`p-4 rounded-xl border ${info.color} space-y-2.5`}>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-white font-mono">{info.title}</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                  Shape: {info.shape}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px] uppercase font-sans">Input Data:</span>
                  <span className="text-slate-200">{info.input}</span>
                </div>
                <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px] uppercase font-sans">Mathematical Operation:</span>
                  <span className="text-indigo-300 font-semibold">{info.operation}</span>
                </div>
              </div>
              <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800/80 text-xs font-mono">
                <span className="text-slate-400 block text-[10px] uppercase font-sans">Output Result:</span>
                <span className="text-emerald-300">{info.output}</span>
              </div>
              <p className="text-xs text-slate-300 italic pt-1">
                💡 <strong>Plain-English Meaning:</strong> {info.meaning}
              </p>
            </div>
          );
        })()}
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
