# Learning Journey: Latent Reasoning Laboratory

## Learner Persona
A developer, researcher, or student who understands basic machine learning concepts (vectors, matrices, neural networks) but lacks deep intuitive clarity on:
1. Exact intermediate calculations inside self-attention ($Q, K, V$, scaling, softmax normalization, value aggregation).
2. The computational consequences of Chain-of-Thought token generation (memory and latency penalties of the KV-cache).
3. How recurrent latent reasoning works without emitting intermediate tokens.
4. How modern research architectures (Pathway's BDH and BDH-CQ) implement dynamic working memory and recurrent in-context learning.

## Core Educational Philosophy
**DO → SEE → UNDERSTAND → EXPLAIN**  
Never present a concept as abstract prose without giving the learner an interactive widget that executes the underlying mathematics live on screen.

---

## Chapter-by-Chapter Guided Journey

### LANDING: The Central Question (`main.py`)
- **Concept:** Why are we here?
- **Interaction:** Visual comparison of Mode A (emitting reasoning tokens) vs Mode B (refining internal states) + curriculum roadmap.
- **Takeaway:** Reasoning can occur either outside the model (as context tokens) or inside the model (as state vectors).

### CHAPTER 01: Transformer Foundations (`pages/01_Transformer_Foundations.py`)
- **Concept:** From text words to continuous mathematical representations.
- **Micro-Experiment 1 (Token Selection):** Click any token in a sentence to inspect its Token ID, dense embedding vector $X \in \mathbb{R}^4$, positional encoding vector $P \in \mathbb{R}^4$, and combined hidden state $H_0 = X + P$.
- **Micro-Experiment 2 (Full Sequence Matrices):** View live heatmaps of the full sequence matrices $X, P, H_0$.
- **Takeaway:** Transformers operate on continuous geometric vectors, and sequence position is injected explicitly via vector addition.

### CHAPTER 02: Attention Laboratory (`pages/02_Attention_Laboratory.py`)
- **Concept:** Information routing via mathematical compatibility scoring.
- **Micro-Experiment 3 (Query Selection):** Select an active query token (e.g., `[cat]`). Observe its Query vector $Q$ compared against Key vectors $K$ of all sequence tokens.
- **Micro-Experiment 4 (Score & Weight Calculation):** Trace raw dot-products, scaling by $\sqrt{d_k}$, softmax probabilities, and the resulting attention distribution bar chart.
- **Micro-Experiment 5 (Value Aggregation & LayerNorm):** Observe how attention weights blend Value vectors $V$ into the output representation, followed by residual addition and Layer Normalization.
- **Takeaway:** Self-attention is a dynamic, content-based weighted averaging of Value vectors.

### CHAPTER 03: Explicit vs. Latent Reasoning (`pages/03_Explicit_vs_Latent.py`)
- **Concept:** Externalizing thought into tokens vs. internalizing thought into state.
- **Micro-Experiment 6 (Side-by-Side Execution):** Generate a synthetic arithmetic task ($7 + 3 \times 5 \pmod{11}$). Observe Mode A emit sequential tokens (`"3 × 5 = 15"`, `"7 + 15 = 22"`) while Mode B executes continuous state transitions ($S_0 \to S_1 \to S_2 \to \hat{y}$).
- **Micro-Experiment 7 (Computational Proxy Cards):** Compare reasoning tokens emitted (4 vs. 0) against internal state updates.
- **Takeaway:** Mode A is human-readable but increases context size; Mode B is compact and fast but mathematically opaque.

### CHAPTER 04: Latent Reasoning Laboratory (`pages/04_Latent_Reasoning_Lab.py`)
- **Concept:** Recurrent state refinement depth and its limitations.
- **Micro-Experiment 8 (Reactive Recurrence Slider $R$):** Adjust $R$ from 1 to 10 and immediately see model predictions, confidence, and internal state evolution update in real-time.
- **Micro-Experiment 9 (State Trajectory Inspection):** Inspect state evolution via heatmaps, $\|\Delta S\|_2$ delta magnitude bar charts, 2D PCA trajectories, and numerical vector drill-downs.
- **Micro-Experiment 10 ($R$-Sweep Curve):** Run an automated 10-point sweep plotting $P(\text{Ground Truth})$ against $R$.
- **Micro-Experiment 11 ("Where Does This Break?"):** Switch to Levels 3 & 4 or unseen moduli (13, 17, 19, 23) to observe failure modes where more rounds fail to solve the problem.
- **Takeaway:** Latent reasoning is not magic; without structured memory, continuous recurrence has clear accuracy boundaries.

### CHAPTER 05: BDH & BDH-CQ Research Frontier (`pages/05_BDH_Case_Study.py`)
- **Concept:** Connecting educational toy models to real research architectures.
- **Micro-Experiment 12 (Hebbian Synaptic Memory Simulator):** Adjust memory retention $\lambda$ and observe the Hebbian synaptic update $S_t = \lambda S_{t-1} + K_t^T V_t$ on a 4×4 associative matrix.
- **Study:** Review BDH dynamic synaptic memory (arXiv:2509.26507) and BDH-CQ continuous latent reasoning (arXiv:2608.09888).
- **Takeaway:** Production latent reasoning replaces static KV-caches with dynamic synaptic fast weights.

### CHAPTER 06: Challenge / 60-Second Test (`pages/06_Assessment.py`)
- **Concept:** Verification of conceptual mastery.
- **Interaction:** 6 targeted diagnostic questions with instant explanatory feedback.
- **Takeaway:** Confirms that the learner understands the difference between explicit and latent reasoning, the role of $R$, and the scope of toy models.
