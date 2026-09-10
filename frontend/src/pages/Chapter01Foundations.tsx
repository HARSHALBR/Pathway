import React, { useState, useEffect } from 'react';
import { runTransformerForward } from '../services/api';
import type { TransformerForwardResponse } from '../types/api';
import { EvidenceBadge } from '../components/common/EvidenceBadge';
import { EquationCard } from '../components/common/EquationCard';
import { MathInline } from '../components/common/MathFormula';
import { Sparkles, Hash, Layers, ArrowRight, Sliders, Info } from 'lucide-react';

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
    <div className="lab-container py-8 md:py-12 space-y-10">
      {/* Chapter Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Chapter 01 • Foundations
          </span>
          <EvidenceBadge type="live" />
          <EvidenceBadge type="toy" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Transformer Foundations: Tokens, Embeddings & Positions
        </h1>

        <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-4xl">
          Before attention can compare tokens, human language must be converted into continuous geometric coordinates. 
          Deconstruct how discrete words map into embedding vectors <MathInline math="X" className="text-blue-700 font-semibold" />, 
          absorb positional coordinates <MathInline math="P" className="text-indigo-700 font-semibold" />, and form initial hidden representations <MathInline math="H_0 = X + P" className="text-purple-700 font-semibold" />.
        </p>
      </div>

      {/* 1. CONTROL SURFACE: Preset Sentence Selector */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-indigo-600" />
            <span>Sequence Input Configuration</span>
          </label>
          <span className="text-xs text-slate-400 font-medium">Select Input Sentence</span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {[
            'The cat sat on the mat',
            'The dog runs fast',
            'A bird was on the mat',
            'The cat chased a mouse'
          ].map((s) => (
            <button
              key={s}
              onClick={() => setSentence(s)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                sentence === s
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm shadow-indigo-500/20'
                  : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              "{s}"
            </button>
          ))}
        </div>
      </div>

      {/* 2. COMPUTED APPARATUS: Interactive Token Inspection Chips */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 md:p-7 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Interactive Token Coordinate Breakdown</span>
          </h3>
          <span className="text-xs text-slate-600 font-medium px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">
            Sequence Length L = {tokens.length}
          </span>
        </div>

        <p className="text-xs text-slate-500">
          Click any token below to inspect its exact mathematical coordinates in continuous space <MathInline math="\mathbb{R}^4" className="text-indigo-600 font-semibold" />:
        </p>

        <div className="flex flex-wrap gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
          {tokens.map((token, idx) => {
            const isSelected = idx === selectedTokenIdx;
            return (
              <button
                key={idx}
                onClick={() => setSelectedTokenIdx(idx)}
                className={`flex flex-col items-center px-4 py-2.5 rounded-xl transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20 scale-105'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className={`font-mono text-[10px] font-semibold ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                  POS {idx}
                </span>
                <span className={`font-bold text-sm tracking-wide ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                  "{token}"
                </span>
                <span className={`font-mono text-[10px] mt-0.5 ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                  ID: {tokenIds[idx]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Token Vectors Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Semantic Embedding X */}
          <div className="p-4 rounded-xl bg-blue-50/40 border border-blue-200/70 space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-blue-200/50 pb-2">
              <span className="text-xs font-bold text-blue-900">Semantic Embedding X</span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-semibold">
                <MathInline math={`E[\\text{ID}=${tokenIds[selectedTokenIdx]}] \\in \\mathbb{R}^4`} />
              </span>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-blue-200 font-mono text-xs text-blue-900 flex flex-wrap gap-1.5 shadow-2xs">
              {currentX.map((val, i) => (
                <span key={i} className="inline-block px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-800 font-semibold">
                  {val.toFixed(3)}
                </span>
              ))}
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Static meaning vector extracted from vocabulary matrix <MathInline math="E \in \mathbb{R}^{24 \times 4}" className="text-blue-700" />.
            </p>
          </div>

          {/* Positional Vector P */}
          <div className="p-4 rounded-xl bg-indigo-50/40 border border-indigo-200/70 space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-indigo-200/50 pb-2">
              <span className="text-xs font-bold text-indigo-900">Position Vector P</span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 font-semibold">
                <MathInline math={`P[\\text{pos}=${selectedTokenIdx}] \\in \\mathbb{R}^4`} />
              </span>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-indigo-200 font-mono text-xs text-indigo-900 flex flex-wrap gap-1.5 shadow-2xs">
              {currentP.map((val, i) => (
                <span key={i} className="inline-block px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-800 font-semibold">
                  {val.toFixed(3)}
                </span>
              ))}
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Encodes sequence order coordinates so "cat sat" is distinct from "sat cat".
            </p>
          </div>

          {/* Combined Hidden State H0 */}
          <div className="p-4 rounded-xl bg-purple-50/40 border border-purple-200/70 space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-purple-200/50 pb-2">
              <span className="text-xs font-bold text-purple-900">Combined State H₀</span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 font-semibold">
                <MathInline math="X + P \in \mathbb{R}^4" />
              </span>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-purple-200 font-mono text-xs text-purple-900 flex flex-wrap gap-1.5 shadow-2xs">
              {currentH0.map((val, i) => (
                <span key={i} className="inline-block px-2 py-0.5 rounded bg-purple-50 border border-purple-200 text-purple-800 font-bold">
                  {val.toFixed(3)}
                </span>
              ))}
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Elementwise sum entering the self-attention Query, Key, and Value projections.
            </p>
          </div>
        </div>
      </div>

      {/* 3. OBSERVED DYNAMICS: Arithmetic Breakdown Micro-Experiment */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 md:p-7 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block">
              Coordinate-Level Addition
            </span>
            <h3 className="text-sm md:text-base font-bold text-slate-900 flex items-center gap-1.5 flex-wrap mt-0.5">
              <span>Micro-Breakdown:</span>
              <MathInline math={`X_{${selectedTokenIdx}} + P_{${selectedTokenIdx}} = H_{0,${selectedTokenIdx}}`} className="text-purple-700 font-semibold" />
              <span>for "{tokens[selectedTokenIdx]}"</span>
            </h3>
          </div>
          <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
            Embedding Dimension d = 4
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
          {[0, 1, 2, 3].map((dim) => {
            const xVal = currentX[dim] ?? 0;
            const pVal = currentP[dim] ?? 0;
            const hVal = currentH0[dim] ?? 0;
            return (
              <div key={dim} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 font-mono text-xs shadow-2xs">
                <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
                  <span className="font-bold text-slate-800 font-sans">Coordinate {dim + 1}</span>
                  <span className="text-[10px] text-slate-400 font-mono">dim={dim}</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-indigo-700">
                    <MathInline math={`X_{${dim}}`} />
                    <span className="font-semibold font-mono">{xVal.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between text-teal-700">
                    <MathInline math={`+ P_{${dim}}`} />
                    <span className="font-semibold font-mono">{pVal.toFixed(3)}</span>
                  </div>
                  <div className="pt-1.5 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                    <MathInline math={`= H_{0,${dim}}`} />
                    <span className="font-mono">{hVal.toFixed(3)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200/70 flex items-start gap-3 text-xs text-blue-950 leading-relaxed">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <strong>Pedagogical Rationale:</strong> The token embedding <span className="text-blue-700 font-mono font-semibold">X</span> provides the token's semantic identity. Positional coordinate <span className="text-indigo-700 font-mono font-semibold">P</span> is directly superimposed so that self-attention layers can distinguish word order without recurrent loops.
          </div>
        </div>
      </div>

      {/* Fundamental Distinction: Vocabulary Size (V) vs Dimension (d) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 md:p-7 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Hash className="w-4 h-4 text-indigo-600" />
          <span>Fundamental Distinction: Vocabulary Size (V) vs. Embedding Dimension (d)</span>
        </h3>
        <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
          Beginners often conflate vocabulary size and embedding dimension. They are entirely separate mathematical spaces:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">Vocabulary Size (V = 24)</span>
            <p className="text-xs text-slate-600 leading-relaxed">
              The total count of unique words/tokens known by the dictionary (e.g. 24 words in this toy model; ~100,000 in production LLMs).
            </p>
          </div>
          <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200/70 space-y-1.5">
            <span className="text-xs font-bold text-indigo-900 uppercase tracking-wide">Embedding Dimension (d = 4)</span>
            <p className="text-xs text-slate-600 leading-relaxed">
              The length of each continuous vector coordinate used to represent a token in semantic space (d=4 here for inspectability; d=4096 in Llama 3).
            </p>
          </div>
        </div>
      </div>

      {/* 12-Stage Micro-Level Computational Pipeline Map */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Full Micro-Level Transformer Pipeline: From Text to LayerNorm</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Click any stage in the computational chain to inspect its exact mathematical operation, tensor shape, and meaning.
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
            STAGE {activePipelineStage + 1} / 12
          </span>
        </div>

        {/* Pipeline Stepper Buttons */}
        <div className="flex flex-wrap gap-2 p-2 bg-slate-50 rounded-2xl border border-slate-200">
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
              className={`px-3 py-1.5 rounded-xl text-xs font-sans transition-all cursor-pointer ${
                activePipelineStage === stg.id
                  ? 'bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-500/20'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="font-semibold">{stg.label}</div>
              <div className={`text-[10px] ${activePipelineStage === stg.id ? 'text-indigo-100' : 'text-slate-400'}`}>{stg.sub}</div>
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
              color: "border-blue-200 bg-blue-50/50 text-blue-900"
            },
            {
              title: "Stage 2: Tokenization",
              input: `String "${sentence}"`,
              operation: `Wordpiece / BPE lookup against vocabulary V = ${data?.vocab_size || 24}`,
              output: `Tokens: [${tokens.map(t => `"${t}"`).join(', ')}]`,
              shape: `List of string tokens (L = ${tokens.length})`,
              meaning: "Maps raw text characters into discrete vocabulary tokens.",
              color: "border-blue-200 bg-blue-50/50 text-blue-900"
            },
            {
              title: "Stage 3: Token ID Indexing",
              input: `Tokens: [${tokens.map(t => `"${t}"`).join(', ')}]`,
              operation: "Dict lookup: token_id = VOCAB[token]",
              output: `Token IDs: [${tokenIds.join(', ')}]`,
              shape: `Array of integers (L = ${tokens.length})`,
              meaning: "Each vocabulary word is assigned an index from 0 to V-1 (0 to 23).",
              color: "border-blue-200 bg-blue-50/50 text-blue-900"
            },
            {
              title: "Stage 4: Semantic Embedding Lookup",
              input: `Token IDs [${tokenIds.join(', ')}] and Weight Matrix E ∈ ℝ²⁴ˣ⁴`,
              operation: "Row slicing: X[i] = E[token_ids[i]]",
              output: `Semantic matrix X (row for "${tokens[selectedTokenIdx]}": [${currentX.map(v => v.toFixed(2)).join(', ')}])`,
              shape: `Matrix X ∈ ℝ^(${tokens.length} × 4)`,
              meaning: "Extracts static semantic meaning coordinates in continuous space.",
              color: "border-blue-200 bg-blue-50/50 text-blue-900"
            },
            {
              title: "Stage 5: Positional Encoding Injection",
              input: `Position indices [0, 1, ..., ${tokens.length - 1}] and P_matrix ∈ ℝ¹⁰ˣ⁴`,
              operation: "Position slice: P = P_matrix[:L]",
              output: `Position matrix P (row for pos ${selectedTokenIdx}: [${currentP.map(v => v.toFixed(2)).join(', ')}])`,
              shape: `Matrix P ∈ ℝ^(${tokens.length} × 4)`,
              meaning: "Provides spatial order information so word order matters.",
              color: "border-indigo-200 bg-indigo-50/50 text-indigo-900"
            },
            {
              title: "Stage 6: Initial Hidden State Formation",
              input: `Embedding X ∈ ℝ^(${tokens.length}×4) and Position P ∈ ℝ^(${tokens.length}×4)`,
              operation: "Elementwise addition: H₀ = X + P",
              output: `Hidden matrix H₀ (row for pos ${selectedTokenIdx}: [${currentH0.map(v => v.toFixed(2)).join(', ')}])`,
              shape: `Matrix H₀ ∈ ℝ^(${tokens.length} × 4)`,
              meaning: "Combined state carrying both semantic meaning and positional sequence order.",
              color: "border-purple-200 bg-purple-50/50 text-purple-900"
            },
            {
              title: "Stage 7: Linear Projections (Q, K, V)",
              input: `Hidden State H₀ ∈ ℝ^(${tokens.length}×4) and weight matrices W_Q, W_K, W_V ∈ ℝ⁴ˣ⁴`,
              operation: "Matrix multiplications: Q = H₀ W_Q, K = H₀ W_K, V = H₀ W_V",
              output: `Projections Q, K, V each in ℝ^(${tokens.length} × 4)`,
              shape: `Q ∈ ℝ^(${tokens.length}×4), K ∈ ℝ^(${tokens.length}×4), V ∈ ℝ^(${tokens.length}×4)`,
              meaning: "Specializes the representation into Queries (seeking info), Keys (indexing info), and Values (transmitting info).",
              color: "border-blue-200 bg-blue-50/50 text-blue-900"
            },
            {
              title: "Stage 8: Scaled Dot-Product Attention Scores",
              input: `Queries Q ∈ ℝ^(${tokens.length}×4) and Keys K ∈ ℝ^(${tokens.length}×4)`,
              operation: "Score matrix: S = Q Kᵀ / √d_k (where d_k = 4, √d_k = 2.0)",
              output: `Raw score matrix S with shape (${tokens.length} × ${tokens.length})`,
              shape: `S ∈ ℝ^(${tokens.length} × ${tokens.length})`,
              meaning: "Measures mutual pairwise geometric compatibility between all tokens.",
              color: "border-blue-200 bg-blue-50/50 text-blue-900"
            },
            {
              title: "Stage 9: Softmax Attention Weights",
              input: `Score matrix S ∈ ℝ^(${tokens.length}×${tokens.length})`,
              operation: "Row-wise softmax: A_ij = exp(S_ij - max S_i) / Σ exp(S_ik - max S_i)",
              output: `Attention probability matrix A (rows strictly sum to 1.0000)`,
              shape: `A ∈ ℝ^(${tokens.length} × ${tokens.length})`,
              meaning: "Converts compatibility scores into probability distributions over sequence keys.",
              color: "border-blue-200 bg-blue-50/50 text-blue-900"
            },
            {
              title: "Stage 10: Value Aggregation",
              input: `Attention weights A ∈ ℝ^(${tokens.length}×${tokens.length}) and Values V ∈ ℝ^(${tokens.length}×4)`,
              operation: "Weighted sum: Attn_Out = (A · V) W_O",
              output: `Aggregated Value representation`,
              shape: `Attn_Out ∈ ℝ^(${tokens.length} × 4)`,
              meaning: "Blends information from other tokens according to their attention weights.",
              color: "border-indigo-200 bg-indigo-50/50 text-indigo-900"
            },
            {
              title: "Stage 11: Residual Connection",
              input: `Input H₀ ∈ ℝ^(${tokens.length}×4) and Attention Output Attn_Out ∈ ℝ^(${tokens.length}×4)`,
              operation: "Skip-connection addition: H₁ = H₀ + Attn_Out",
              output: `Residual state H₁`,
              shape: `H₁ ∈ ℝ^(${tokens.length} × 4)`,
              meaning: "Prevents gradient vanishing and preserves initial identity while incorporating contextual features.",
              color: "border-emerald-200 bg-emerald-50/50 text-emerald-900"
            },
            {
              title: "Stage 12: Layer Normalization (LN)",
              input: `State z ∈ ℝ^(${tokens.length}×4)`,
              operation: "Normalization: LN(z) = (z - μ) / √(σ² + ε)",
              output: `Zero-mean, unit-variance normalized activations (mean ≈ 0.0, std ≈ 1.0)`,
              shape: `Output ∈ ℝ^(${tokens.length} × 4)`,
              meaning: "Stabilizes signal dynamics across forward and backward propagation.",
              color: "border-teal-200 bg-teal-50/50 text-teal-900"
            }
          ];

          const info = stagesInfo[activePipelineStage] || stagesInfo[0];
          return (
            <div className={`p-5 rounded-2xl border ${info.color} space-y-3`}>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-900 font-sans">{info.title}</span>
                <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700">
                  Shape: {info.shape}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Input Data:</span>
                  <span className="text-slate-800 font-mono mt-0.5 block">{info.input}</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Mathematical Operation:</span>
                  <span className="text-indigo-700 font-mono font-semibold mt-0.5 block">{info.operation}</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs shadow-2xs">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Output Result:</span>
                <span className="text-emerald-700 font-mono font-semibold mt-0.5 block">{info.output}</span>
              </div>
              <p className="text-xs text-slate-600 italic pt-1 leading-relaxed">
                💡 <strong>Plain-English Meaning:</strong> {info.meaning}
              </p>
            </div>
          );
        })()}
      </div>

      {/* Live Matrix Addition Table: X + P = H0 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Live Matrix Addition Table: X + P = H₀</span>
          </h3>
          {hoveredCell && (
            <span className="text-xs font-mono text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200 font-medium">
              Token "{tokens[hoveredCell.row]}" | Dim d{hoveredCell.col}: X({X[hoveredCell.row]?.[hoveredCell.col]?.toFixed(2)}) + P({P[hoveredCell.row]?.[hoveredCell.col]?.toFixed(2)}) = H₀({H0[hoveredCell.row]?.[hoveredCell.col]?.toFixed(2)})
            </span>
          )}
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
          <table className="w-full text-xs font-mono text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-sans">
                <th className="p-3 font-semibold">Pos</th>
                <th className="p-3 font-semibold">Token</th>
                <th className="p-3 text-center font-semibold text-indigo-700" colSpan={4}>Embedding <MathInline math="X \in \mathbb{R}^4" /></th>
                <th className="p-3 text-center font-semibold text-teal-700" colSpan={4}>Positional <MathInline math="P \in \mathbb{R}^4" /></th>
                <th className="p-3 text-center font-semibold text-indigo-900" colSpan={4}>Combined <MathInline math="H_0 \in \mathbb{R}^4" /></th>
              </tr>
              <tr className="border-b border-slate-100 text-[10px] text-slate-500 text-center font-mono bg-slate-50/50">
                <th></th>
                <th></th>
                <th><MathInline math="d_0" /></th><th><MathInline math="d_1" /></th><th><MathInline math="d_2" /></th><th><MathInline math="d_3" /></th>
                <th><MathInline math="d_0" /></th><th><MathInline math="d_1" /></th><th><MathInline math="d_2" /></th><th><MathInline math="d_3" /></th>
                <th><MathInline math="d_0" /></th><th><MathInline math="d_1" /></th><th><MathInline math="d_2" /></th><th><MathInline math="d_3" /></th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((tok, rIdx) => {
                const isSelected = rIdx === selectedTokenIdx;
                return (
                  <tr
                    key={rIdx}
                    onClick={() => setSelectedTokenIdx(rIdx)}
                    className={`border-b border-slate-100 cursor-pointer transition-colors ${
                      isSelected ? 'bg-indigo-50/70 text-slate-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <td className="p-3 text-slate-400 text-center font-mono">{rIdx}</td>
                    <td className="p-3 font-bold text-indigo-700 font-sans">"{tok}"</td>
                    {/* X */}
                    {X[rIdx]?.map((val, cIdx) => (
                      <td
                        key={`x-${cIdx}`}
                        onMouseEnter={() => setHoveredCell({ row: rIdx, col: cIdx })}
                        onMouseLeave={() => setHoveredCell(null)}
                        className="p-2 text-center text-blue-700 hover:bg-blue-100/50 transition-colors"
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
                        className="p-2 text-center text-indigo-700 hover:bg-indigo-100/50 transition-colors"
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
                        className="p-2 text-center text-purple-700 font-bold hover:bg-purple-100/50 transition-colors"
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
        formula="X = E[\text{token\_ids}], \qquad E \in \mathbb{R}^{V \times d}, \qquad X \in \mathbb{R}^{L \times d}"
        plainEnglish="Each integer token ID indexes a unique row in the embedding matrix E, extracting a dense d-dimensional coordinate vector representing the token's semantic meaning."
        numericExample={`For token "${tokens[selectedTokenIdx]}" (ID ${tokenIds[selectedTokenIdx]}): X = [${currentX.map(v => v.toFixed(2)).join(', ')}]`}
        source="Vaswani et al. (2017) 'Attention Is All You Need'"
      />

      <EquationCard
        title="2. Positional Encoding Injection"
        formula="H_0 = X + P, \qquad P \in \mathbb{R}^{L \times d}, \qquad H_0 \in \mathbb{R}^{L \times d}"
        plainEnglish="Transformers have no built-in recurrent loops or convolutions, so word order must be injected directly by adding position coordinate vectors P to the semantic embeddings X."
        numericExample={`H₀[${selectedTokenIdx}] = [${currentX.map(v => v.toFixed(2)).join(', ')}] + [${currentP.map(v => v.toFixed(2)).join(', ')}] = [${currentH0.map(v => v.toFixed(2)).join(', ')}]`}
      />

      {/* Storytelling Transition to Next Chapter */}
      <div className="p-6 md:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs uppercase tracking-wider text-indigo-600 font-bold block">
            Pedagogical Progression: Chapter 01 ➔ Chapter 02
          </span>
          <p className="text-xs sm:text-sm text-slate-700 font-medium">
            Every token now has a position-aware vector in <MathInline math="\mathbb{R}^4" className="text-indigo-600 font-semibold" />. But how do tokens communicate context with one another?
          </p>
        </div>
        <button
          onClick={onNextChapter}
          className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 hover:shadow-lg hover:brightness-105 transition-all cursor-pointer"
        >
          <span>Continue → Attention Laboratory</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
