import React, { useState } from 'react';
import { EvidenceBadge } from '../components/common/EvidenceBadge';
import { CheckCircle2, XCircle, Trophy, RotateCcw, ArrowRight } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: { label: string; text: string; correct: boolean }[];
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "What is the fundamental mathematical difference between Vocabulary Size (V) and Embedding Dimension (d)?",
    options: [
      { label: "A", text: "Vocabulary size is the dictionary word count; embedding dimension is the continuous coordinate length representing each token in vector space.", correct: true },
      { label: "B", text: "Vocabulary size is sentence length; embedding dimension is number of attention layers.", correct: false },
      { label: "C", text: "They are identical terms for model parameters.", correct: false },
      { label: "D", text: "Embedding dimension is universally fixed at 4 for all production LLMs.", correct: false }
    ],
    explanation: "Vocabulary size V is the total unique token count (V=24 in our toy model); embedding dimension d is the coordinate vector length per token (d=4 in our toy model; d=4096 in Llama 3)."
  },
  {
    id: 2,
    question: "In Transformer self-attention, what is the role of Query (Q) and Key (K) matrices?",
    options: [
      { label: "A", text: "They permanently delete unnecessary tokens from the sequence.", correct: false },
      { label: "B", text: "The Query vector from each token is compared via dot-product against all Key vectors to compute compatibility scores, normalized by softmax into attention weights.", correct: true },
      { label: "C", text: "They store the model's final vocabulary predictions.", correct: false },
      { label: "D", text: "They add positional information to prevent words from drifting.", correct: false }
    ],
    explanation: "Scaled dot products (Q · K^T / √d_k) measure compatibility between what a token seeks (Query) and what other tokens provide (Key)."
  },
  {
    id: 3,
    question: "What is the primary conceptual distinction between Explicit Reasoning (Chain-of-Thought) and Latent Reasoning?",
    options: [
      { label: "A", text: "Explicit reasoning uses neural networks while latent reasoning only uses Python if-statements.", correct: false },
      { label: "B", text: "WHERE the intermediate computation is represented: Explicit reasoning serializes thoughts into visible text tokens; Latent reasoning refines continuous internal state vectors without emitting tokens.", correct: true },
      { label: "C", text: "Latent reasoning is 100% accurate on all arithmetic tasks.", correct: false },
      { label: "D", text: "Latent reasoning eliminates computation by using an external database.", correct: false }
    ],
    explanation: "The core difference is the substrate of intermediate thought: visible context window tokens (Mode A) vs. internal continuous state vectors S_t (Mode B)."
  },
  {
    id: 4,
    question: "In our Latent Reasoning Laboratory, what actually happens when you increase reasoning rounds (R)?",
    options: [
      { label: "A", text: "The model outputs longer paragraphs of text.", correct: false },
      { label: "B", text: "The UI merely changes a cosmetic animation without running computation.", correct: false },
      { label: "C", text: "The model executes additional recurrent state updates (s_{t+1} = s_t + α W_2 tanh(W_1 s_t + b_1)), genuinely modifying state vector S_R before the readout head.", correct: true },
      { label: "D", text: "The model doubles its parameter count by downloading larger weights.", correct: false }
    ],
    explanation: "R is a real computational parameter: increasing R executes additional recurrent matrix-vector updates on the state vector in Python."
  },
  {
    id: 5,
    question: "Why does the standard Transformer KV-cache become a computational bottleneck for long Chain-of-Thought reasoning?",
    options: [
      { label: "A", text: "Every generated reasoning token must be appended to the KV-cache, causing memory to grow linearly O(L) and subsequent attention computation to grow quadratically O(L²).", correct: true },
      { label: "B", text: "Because the vocabulary runs out of unique words.", correct: false },
      { label: "C", text: "Because positional encodings cannot count higher than 10.", correct: false },
      { label: "D", text: "Because softmax cannot normalize more than 5 numbers.", correct: false }
    ],
    explanation: "Expanding context length L inflates KV-cache VRAM linearly and makes all-pairs attention scale quadratically O(L²)."
  },
  {
    id: 6,
    question: "How does Pathway's BDH (Baby Dragon Hatchling) architecture conceptually differ from the standard Transformer KV-cache?",
    options: [
      { label: "A", text: "BDH replaces the growing token-by-token KV-cache with a fixed-size dynamic synaptic state matrix updated via Hebbian plasticity (S_t = λ S_{t-1} + K_t^T V_t).", correct: true },
      { label: "B", text: "BDH is simply a standard Transformer running on faster hardware.", correct: false },
      { label: "C", text: "BDH converts all numbers into text strings before computing attention.", correct: false },
      { label: "D", text: "BDH eliminates Query and Key projections entirely.", correct: false }
    ],
    explanation: "BDH maintains fixed-size dynamic synaptic working memory updated by outer products with retention decay λ."
  },
  {
    id: 7,
    question: "What is the core contribution of Pathway's BDH-CQ architecture (Engdahl et al., 2026)?",
    options: [
      { label: "A", text: "It introduces a Context-Query (CQ) framework that performs recurrent in-context reasoning entirely in continuous latent space (z^(r)) without intermediate token generation.", correct: true },
      { label: "B", text: "It forces the model to emit twice as many Chain-of-Thought tokens.", correct: false },
      { label: "C", text: "It eliminates attention and replaces all weights with hardcoded decision trees.", correct: false },
      { label: "D", text: "It trains an image classifier on modular arithmetic.", correct: false }
    ],
    explanation: "BDH-CQ structures multi-round reasoning entirely in continuous latent space z^(r) without external token serialization."
  },
  {
    id: 8,
    question: "Is the toy latent reasoning model in this educational laboratory identical to the BDH or BDH-CQ architecture?",
    options: [
      { label: "A", text: "Yes, our Python script is the official production implementation of BDH-CQ.", correct: false },
      { label: "B", text: "No. Our model is a simplified educational MLP demonstrating the concept of recurrent state updates; genuine BDH utilizes dynamic synaptic state matrices and BDH-CQ utilizes a Context-Query in-context formulation.", correct: true },
      { label: "C", text: "Yes, because both models use the letter 's' for state.", correct: false },
      { label: "D", text: "No, because BDH was built for image processing only.", correct: false }
    ],
    explanation: "Scientific honesty is paramount: our model is an inspectable educational baseline, distinct from the published BDH and BDH-CQ architectures."
  }
];

interface Props {
  onRestartLab: () => void;
}

export const Chapter06Challenge: React.FC<Props> = ({ onRestartLab }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [revealedQuestions, setRevealedQuestions] = useState<Record<number, boolean>>({});

  const handleSelect = (qId: number, label: string) => {
    if (revealedQuestions[qId]) return; // locked after reveal
    setSelectedAnswers((prev) => ({ ...prev, [qId]: label }));
    setRevealedQuestions((prev) => ({ ...prev, [qId]: true }));
  };

  const totalAnswered = Object.keys(revealedQuestions).length;
  const score = QUESTIONS.reduce((acc, q) => {
    const selected = selectedAnswers[q.id];
    const correctOpt = q.options.find((o) => o.correct)?.label;
    return selected === correctOpt ? acc + 1 : acc;
  }, 0);

  const allComplete = totalAnswered === QUESTIONS.length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      {/* Chapter Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-indigo-950 text-indigo-300 border border-indigo-700/50 font-semibold">
            CHAPTER 06
          </span>
          <EvidenceBadge type="live" />
          <EvidenceBadge type="toy" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Diagnostic Challenge: 60-Second Conceptual Assessment
        </h1>

        <p className="text-slate-300 text-sm md:text-base leading-relaxed">
          Verify your architectural intuition across 8 diagnostic questions. 
          Each choice provides immediate mathematical and conceptual feedback.
        </p>
      </div>

      {/* Progress & Score Bar */}
      <div className="lab-glass-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400">Progress:</span>
          <span className="text-sm font-bold font-mono text-indigo-400">{totalAnswered} / {QUESTIONS.length} Answered</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400">Current Score:</span>
          <span className={`text-base font-bold font-mono ${score >= 6 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {score} / {QUESTIONS.length}
          </span>
        </div>
      </div>

      {/* Questions Cards */}
      <div className="space-y-6">
        {QUESTIONS.map((q, idx) => {
          const isAnswered = revealedQuestions[q.id];
          const chosenLabel = selectedAnswers[q.id];
          const correctOption = q.options.find((o) => o.correct);
          const isCorrect = chosenLabel === correctOption?.label;

          return (
            <div
              key={q.id}
              className={`lab-glass-card p-5 space-y-4 border transition-all ${
                isAnswered
                  ? isCorrect
                    ? 'border-emerald-500/50 bg-emerald-950/10'
                    : 'border-rose-500/50 bg-rose-950/10'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800">
                  Question {idx + 1} of {QUESTIONS.length}
                </span>

                {isAnswered && (
                  <span className={`flex items-center gap-1 text-xs font-bold font-mono ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    <span>{isCorrect ? 'Correct' : 'Incorrect'}</span>
                  </span>
                )}
              </div>

              <h3 className="text-sm md:text-base font-bold text-white leading-snug">
                {q.question}
              </h3>

              {/* Options */}
              <div className="space-y-2">
                {q.options.map((opt) => {
                  const isSelected = chosenLabel === opt.label;
                  let optStyle = 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-indigo-500/50';

                  if (isAnswered) {
                    if (opt.correct) {
                      optStyle = 'bg-emerald-950/50 border-emerald-500 text-emerald-200 font-semibold';
                    } else if (isSelected && !opt.correct) {
                      optStyle = 'bg-rose-950/50 border-rose-500 text-rose-200';
                    } else {
                      optStyle = 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={opt.label}
                      disabled={isAnswered}
                      onClick={() => handleSelect(q.id, opt.label)}
                      className={`w-full text-left p-3 rounded-xl border text-xs md:text-sm transition-all flex items-start gap-3 cursor-pointer disabled:cursor-default ${optStyle}`}
                    >
                      <span className="font-mono font-bold px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-xs">
                        {opt.label}
                      </span>
                      <span className="flex-1 leading-relaxed">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Immediate Feedback Explanation */}
              {isAnswered && (
                <div className={`p-3.5 rounded-lg border text-xs leading-relaxed ${
                  isCorrect
                    ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
                    : 'bg-rose-950/40 border-rose-800/60 text-rose-200'
                }`}>
                  <strong className="block mb-1 font-mono uppercase tracking-wider text-[10px]">
                    {isCorrect ? '✓ Mathematical Explanation:' : `✗ Correct Answer: ${correctOption?.label}`}
                  </strong>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Completion Card */}
      {allComplete && (
        <div className="lab-glass-card p-6 border-2 border-indigo-500/60 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-emerald-400 mx-auto flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Trophy className="w-6 h-6" />
          </div>

          <h2 className="text-2xl font-bold text-white">Laboratory Diagnostic Complete!</h2>
          <p className="text-sm text-slate-300 max-w-md mx-auto">
            You scored <strong className="text-indigo-300 font-mono text-base">{score} / {QUESTIONS.length}</strong>. 
            {score === 8
              ? " Outstanding! You have demonstrated complete mastery across Transformer attention, explicit/latent reasoning, and BDH research concepts."
              : score >= 6
              ? " Great work! You have a solid grasp of explicit vs. latent computation trade-offs."
              : " Good effort! We recommend reviewing Chapters 02, 04, and 05 to revisit attention mechanics and latent recurrence."}
          </p>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setSelectedAnswers({});
                setRevealedQuestions({});
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-mono font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Quiz</span>
            </button>

            <button
              onClick={onRestartLab}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-semibold shadow-md shadow-indigo-600/30"
            >
              <span>Back to Overview</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
