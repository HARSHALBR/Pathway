import React, { useState } from 'react';
import { EvidenceBadge } from '../components/common/EvidenceBadge';
import { renderMathText } from '../components/common/MathFormula';
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
    question: "What is the fundamental mathematical difference between Vocabulary Size ($V$) and Embedding Dimension ($d$) in a Transformer?",
    options: [
      { label: "A", text: "Vocabulary size $V$ is the maximum sequence length processed in a context window, while embedding dimension $d$ is the count of parallel self-attention heads allocated across layers.", correct: false },
      { label: "B", text: "Vocabulary size $V$ represents the total count of trainable weight matrices across all blocks, while embedding dimension $d$ is the mini-batch size used during gradient descent updates.", correct: false },
      { label: "C", text: "Vocabulary size $V$ is the total count of discrete token entries in the dictionary, while embedding dimension $d$ is the length of the continuous coordinate vector representing each token.", correct: true },
      { label: "D", text: "Vocabulary size $V$ denotes the number of subword tokens observed in the training dataset, while embedding dimension $d$ is the floating-point precision format used for layer activations.", correct: false }
    ],
    explanation: "Vocabulary size $V$ is the discrete dictionary size ($V=24$ in our toy model; $\\sim 100,000$ in modern LLMs). Embedding dimension $d$ is the geometric vector coordinate length per token ($d=4$ in our toy model; $d=4096$ in Llama 3)."
  },
  {
    id: 2,
    question: "When computing self-attention between tokens, what specific computational role do the Query ($Q$) and Key ($K$) vectors serve?",
    options: [
      { label: "A", text: "The Query vector represents what information a token is seeking, and its dot product with another token's Key vector computes a compatibility score that scales into attention weights.", correct: true },
      { label: "B", text: "The Query vector generates the candidate next-token probability distribution, while the Key vector acts as a residual gate that determines how much positional information is preserved.", correct: false },
      { label: "C", text: "The Query vector projects token representations into an associative memory matrix, while the Key vector normalizes activation variance across layers to prevent vanishing gradients.", correct: false },
      { label: "D", text: "The Query vector extracts syntactic dependencies from previous sequence positions, while the Key vector computes the linear value aggregation transmitted directly to the feedforward sublayer.", correct: false }
    ],
    explanation: "Self-attention evaluates compatibility through scaled dot products ($\\frac{Q K^T}{\\sqrt{d_k}}$): Query $Q$ acts as the retrieval prompt, Key $K$ acts as the indexing descriptor, and their normalized interaction routes Value $V$ vectors."
  },
  {
    id: 3,
    question: "When solving multi-step arithmetic via Explicit Chain-of-Thought (Mode A) versus Latent Reasoning (Mode B), what is the primary architectural difference in how intermediate steps are represented?",
    options: [
      { label: "A", text: "Mode A trains separate specialist neural networks for each arithmetic step, whereas Mode B runs the entire computation through a single frozen embedding lookup table.", correct: false },
      { label: "B", text: "Mode A evaluates intermediate steps using symbolic Python execution engines, whereas Mode B approximates arithmetic using continuous gradient descent at inference time.", correct: false },
      { label: "C", text: "Mode A executes non-linear transformations inside the feedforward layers, whereas Mode B routes all mathematical computation through multi-head attention projection weights.", correct: false },
      { label: "D", text: "Mode A externalizes each intermediate step as generated text tokens in the sequence context, whereas Mode B updates continuous internal state vectors without emitting text.", correct: true }
    ],
    explanation: "The fundamental divergence is the computational substrate: Mode A serializes intermediate thoughts into context tokens (growing KV-cache), whereas Mode B refines continuous hidden vectors $S_t$ in-place without generating token text."
  },
  {
    id: 4,
    question: "If the same modular arithmetic task is evaluated in our Latent Reasoning Laboratory with $R=2$ and then re-evaluated with $R=8$, what architectural quantity has changed?",
    options: [
      { label: "A", text: "The sequence context length has expanded by 6 tokens, increasing the total memory consumption of the attention KV-cache.", correct: false },
      { label: "B", text: "The model executes 6 additional recurrent state-update iterations ($S_t \\rightarrow S_{t+1}$) before passing the vector to the readout head.", correct: true },
      { label: "C", text: "The dimensionality of the latent state vector has increased by a factor of 4, expanding the coordinate space from $\\mathbb{R}^{12}$ to $\\mathbb{R}^{48}$.", correct: false },
      { label: "D", text: "The model has dynamically re-indexed its vocabulary size, allowing it to predict higher modulus values during the classification pass.", correct: false }
    ],
    explanation: "Recurrence parameter $R$ governs computational depth in latent space: $R=8$ executes 8 sequential non-linear transformations ($s_{t+1} = s_t + \\alpha W_2 \\tanh(W_1 s_t + b_1)$) on the fixed-size vector $\\mathbb{R}^{48}$ without altering sequence length."
  },
  {
    id: 5,
    question: "Why does the standard autoregressive Transformer KV-cache become a scaling bottleneck when an explicit model generates a long Chain-of-Thought sequence?",
    options: [
      { label: "A", text: "The embedding weights must be re-initialized at every step, causing parameter memory to multiply proportionally with sequence length.", correct: false },
      { label: "B", text: "Positional encodings lose numerical precision beyond small contexts, causing dot-product attention scores to collapse uniformly to zero.", correct: false },
      { label: "C", text: "Every emitted token appends Key and Value vectors to memory ($O(L)$ space), and subsequent token queries must attend over all cached keys ($O(L^2)$ compute).", correct: true },
      { label: "D", text: "The vocabulary softmax normalization layer requires exponential time to compute whenever the accumulated output sequence exceeds the batch size.", correct: false }
    ],
    explanation: "Because Transformers maintain exact representations of all previous tokens, each emitted token inflates the KV-cache by $d_k$ dimensions ($O(L)$ memory) and requires every future query to calculate dot-products against all prior keys ($O(L^2)$ cumulative operations)."
  },
  {
    id: 6,
    question: "How does the working memory mechanism in Pathway's Baby Dragon Hatchling (BDH) architecture differ conceptually from a standard Transformer KV-cache?",
    options: [
      { label: "A", text: "BDH compresses past sequence tokens into an external key-value database that is retrieved using approximate nearest neighbor indexing.", correct: false },
      { label: "B", text: "BDH permanently deletes older attention weights from GPU memory whenever the sequence exceeds a predetermined hard context window.", correct: false },
      { label: "C", text: "BDH replaces continuous matrix multiplications with discrete boolean logic gates that operate directly on integer token coordinates.", correct: false },
      { label: "D", text: "BDH maintains a fixed-size synaptic matrix updated by outer products with decay ($S_t = \\lambda S_{t-1} + K_t^T V_t$), avoiding expanding token caches.", correct: true }
    ],
    explanation: "BDH replaces the token-by-token expanding KV-cache with dynamic synaptic plasticity: associations are stored directly in a fixed-size fast-weight matrix via outer products ($K_t^T V_t$) with plastic decay $\\lambda$."
  },
  {
    id: 7,
    question: "In Pathway's published BDH-CQ architecture (Engdahl et al., 2026), what is the key function of the Context-Query (CQ) framework during reasoning?",
    options: [
      { label: "A", text: "It converts natural language prompts into compiled SQL queries that are evaluated against an external real-time data streaming engine.", correct: false },
      { label: "B", text: "It structures recurrent in-context reasoning in continuous latent space ($z^{(r)}$), refining internal representations without emitting reasoning tokens.", correct: true },
      { label: "C", text: "It enforces strict chain-of-thought token generation by requiring the language model to output verification tokens before returning an answer.", correct: false },
      { label: "D", text: "It duplicates the feedforward layers into parallel candidate paths, voting on the highest-confidence token prediction via ensemble averaging.", correct: false }
    ],
    explanation: "BDH-CQ separates the context representation from recurrent query evaluation, executing multi-round in-context reasoning entirely within continuous latent trajectories $z^{(r)}$ without token expansion."
  },
  {
    id: 8,
    question: "How does the toy latent reasoning simulator in this educational laboratory relate to Pathway's official BDH and BDH-CQ research?",
    options: [
      { label: "A", text: "It is a simplified educational abstraction illustrating recurrent state updates and Hebbian decay, not the production multi-layer continuous ODE architecture.", correct: true },
      { label: "B", text: "It is a 1-to-1 exact production clone of BDH-CQ, running the identical weights and neural ODE equations published in the arXiv research paper.", correct: false },
      { label: "C", text: "It is an unrelated computer vision model adapted to arithmetic that shares mathematical formulas with Transformers only by coincidence.", correct: false },
      { label: "D", text: "It is a purely cosmetic user-interface mock that displays simulated numbers without executing genuine NumPy tensor operations on the backend.", correct: false }
    ],
    explanation: "Scientific demarcation is essential: our laboratory model is an inspectable pedagogical baseline exposing core mathematics (NumPy recurrence and $4 \\times 4$ fast weights), deliberately distinguished from Pathway's full multi-layer research implementations."
  }
];

interface Props {
  onRestartLab: () => void;
  onNavigateToChapter?: (chapterId: number) => void;
}

export const Chapter06Challenge: React.FC<Props> = ({ onRestartLab, onNavigateToChapter }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [revealedQuestions, setRevealedQuestions] = useState<Record<number, boolean>>({});

  const handleSelect = (qId: number, label: string) => {
    if (revealedQuestions[qId]) return; // locked after reveal
    setSelectedAnswers((prev) => ({ ...prev, [qId]: label }));
    setRevealedQuestions((prev) => ({ ...prev, [qId]: true }));
  };

  const totalAnswered = Object.keys(revealedQuestions).length;
  
  const isQuestionCorrect = (qId: number) => {
    const q = QUESTIONS.find((item) => item.id === qId);
    const correctOption = q?.options.find((o) => o.correct);
    return selectedAnswers[qId] === correctOption?.label;
  };

  const score = QUESTIONS.reduce((acc, q) => {
    const selected = selectedAnswers[q.id];
    const correctOpt = q.options.find((o) => o.correct)?.label;
    return selected === correctOpt ? acc + 1 : acc;
  }, 0);

  const allComplete = totalAnswered === QUESTIONS.length;

  return (
    <div className="lab-container py-8 md:py-12 space-y-10">
      {/* Chapter Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
            Chapter 06 • Diagnostic Assessment
          </span>
          <EvidenceBadge type="live" />
          <EvidenceBadge type="toy" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Diagnostic Challenge: Conceptual Architecture Assessment
        </h1>

        <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-4xl">
          Verify your architectural comprehension across 8 diagnostic problems. 
          Every question evaluates conceptual and mathematical principles, providing immediate rationale on selection.
        </p>
      </div>

      {/* Progress & Score Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Assessment Progress:</span>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3.5 py-1.5 rounded-xl border border-indigo-200">
            {totalAnswered} / {QUESTIONS.length} Answered
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Telemetry Score:</span>
          <span className={`text-sm font-bold font-mono px-3.5 py-1 rounded-xl border ${
            score >= 6
              ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
              : 'text-indigo-700 bg-indigo-50 border-indigo-200'
          }`}>
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
              className={`bg-white rounded-2xl p-6 md:p-7 space-y-5 border transition-all shadow-xs ${
                isAnswered
                  ? isCorrect
                    ? 'border-emerald-300 ring-1 ring-emerald-100'
                    : 'border-rose-300 ring-1 ring-rose-100'
                  : 'border-slate-200/90'
              }`}
            >
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                  DIAGNOSTIC 0{idx + 1} / 0{QUESTIONS.length}
                </span>

                {isAnswered && (
                  <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${
                    isCorrect
                      ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                      : 'text-rose-700 bg-rose-50 border-rose-200'
                  }`}>
                    {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    <span>{isCorrect ? 'VERIFIED ACCURATE' : 'MISPREDICTION'}</span>
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {renderMathText(q.question)}
              </h3>

              {/* Options */}
              <div className="space-y-2.5">
                {q.options.map((opt) => {
                  const isSelected = chosenLabel === opt.label;
                  let optStyle = 'bg-slate-50 border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-slate-100/80';

                  if (isAnswered) {
                    if (opt.correct) {
                      optStyle = 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-medium ring-1 ring-emerald-200';
                    } else if (isSelected && !opt.correct) {
                      optStyle = 'bg-rose-50/80 border-rose-300 text-rose-950';
                    } else {
                      optStyle = 'bg-slate-50/50 border-slate-200 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={opt.label}
                      disabled={isAnswered}
                      onClick={() => handleSelect(q.id, opt.label)}
                      className={`w-full text-left p-4 rounded-xl border text-xs md:text-sm transition-all flex items-start gap-3.5 cursor-pointer disabled:cursor-default ${optStyle}`}
                    >
                      <span className={`font-bold px-2.5 py-0.5 rounded-lg border text-xs shrink-0 ${
                        isAnswered && opt.correct
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : isAnswered && isSelected && !opt.correct
                          ? 'bg-rose-600 text-white border-rose-600'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}>
                        {opt.label}
                      </span>
                      <span className="flex-1 leading-relaxed">{renderMathText(opt.text)}</span>
                    </button>
                  );
                })}
              </div>

              {/* Immediate Feedback Explanation */}
              {isAnswered && (
                <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
                  isCorrect
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50 border-rose-200 text-rose-950'
                }`}>
                  <strong className="block mb-1 text-xs uppercase tracking-wider font-bold">
                    {isCorrect ? '✓ Verification Rationale:' : `✗ Canonical Answer: Option ${correctOption?.label}`}
                  </strong>
                  {renderMathText(q.explanation)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Completion Card */}
      {allComplete && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-8 md:p-10 shadow-xs text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-teal-600 mx-auto flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Trophy className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Laboratory Diagnostic Complete!</h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Diagnostic Telemetry Score: <strong className="text-indigo-700 font-bold text-base">{score} / {QUESTIONS.length}</strong>. 
              {score === 8
                ? " Outstanding! You have demonstrated complete conceptual mastery across Transformer attention, explicit/latent reasoning, and BDH research concepts."
                : score >= 6
                ? " Great work! You have a solid grasp of explicit vs. latent computation trade-offs."
                : " Good effort! We recommend reviewing Modules 02, 04, and 05 to revisit attention mechanics and latent recurrence."}
            </p>
          </div>

          {/* Curriculum Mastery Matrix */}
          <div className="max-w-xl mx-auto p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-3">
            <span className="text-xs text-indigo-700 font-bold uppercase tracking-wider block border-b border-slate-200 pb-2">
              Curriculum Mastery Matrix
            </span>
            <div className="space-y-2 pt-1">
              {[
                { name: '1. Transformer Foundations', ch: 1, correct: isQuestionCorrect(1) },
                { name: '2. Attention Mechanics', ch: 2, correct: isQuestionCorrect(2) && isQuestionCorrect(5) },
                { name: '3. Explicit vs Latent Reasoning', ch: 3, correct: isQuestionCorrect(3) },
                { name: '4. Recurrent Latent Reasoning', ch: 4, correct: isQuestionCorrect(4) },
                { name: '5. BDH Synaptic Memory', ch: 5, correct: isQuestionCorrect(6) && isQuestionCorrect(7) && isQuestionCorrect(8) },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-200/60 last:border-0">
                  <span className="text-slate-800 font-medium text-xs">{item.name}</span>
                  <div className="flex items-center gap-2.5">
                    <span className={`font-semibold ${item.correct ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {item.correct ? '✓ Mastered' : '✗ Review Recommended'}
                    </span>
                    {!item.correct && onNavigateToChapter && (
                      <button
                        onClick={() => onNavigateToChapter(item.ch)}
                        className="text-xs px-2.5 py-1 rounded-lg bg-white text-indigo-700 border border-slate-200 hover:bg-indigo-50 cursor-pointer font-medium transition-colors"
                      >
                        Review Ch 0{item.ch}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-4 pt-2">
            <button
              onClick={() => {
                setSelectedAnswers({});
                setRevealedQuestions({});
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Quiz</span>
            </button>

            <button
              onClick={onRestartLab}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 cursor-pointer transition-all"
            >
              <span>Back to Overview</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
