# CURRENT IMPLEMENTATION AUDIT REPORT
**Repository:** `HARSHALBR/Pathway`  
**Workspace:** `/Users/anuj/Desktop/IITKGP_V2`  
**Audit Date:** September 8, 2026  
**Auditor:** Autonomous Systems & Architecture Code Review  
**Status:** COMPLETE / CODE FREEZE MAINTAINED (NO APPLICATION CODE MODIFIED)

---

## 1. PROJECT OVERVIEW

### What the Current Project Does
The project, titled **"Latent Reasoning Laboratory"**, is an educational, interactive web application built with **Streamlit** and **pure NumPy** (no PyTorch, TensorFlow, or JAX). Its primary educational goal is to demonstrate the fundamental computational difference between:
1. **Mode A: Explicit / Tokenized Reasoning (Chain-of-Thought)** — where intermediate reasoning steps are serialized into discrete textual tokens.
2. **Mode B: Latent / Iterative State Reasoning** — where reasoning is performed by updating a continuous internal hidden vector over $R$ recurrence rounds without emitting intermediate tokens.

The laboratory grounds this comparison using a synthetic **modular arithmetic** task domain (e.g., $7 + 3 \times 5 \pmod{11}$), allowing users to adjust parameters such as problem difficulty, prime modulus, reasoning rounds $R$, and state dimension. It also introduces foundational Transformer mechanics (embeddings, positional encoding, $Q/K/V$ self-attention) and bridges the toy implementation with published research on **Pathway's Baby Dragon Hatchling (BDH)** and **BDH-CQ**.

### Current Application Architecture
The project follows a two-tier decoupled architecture:
- **Computational Core (`models/`)**: Pure NumPy mathematical models and deterministic task generators. They are completely stateless functions with no Streamlit or UI dependencies.
- **Visualization & UI Tier (`components/`, `pages/`, `main.py`)**: Streamlit pages that maintain session state, render controls, invoke model forward passes, and plot mathematical matrices via Matplotlib/Seaborn.

### Main Entry Point & User Flow
- **Entry Point:** `main.py` (run via `streamlit run main.py`).
- **User Navigation Flow (Streamlit Multi-Page Sidebar):**
  1. `main.py`: Welcome page, central question, and 5-stage learning path overview.
  2. `pages/01_Transformer_Foundations.py`: Concept glossary + live forward pass of a toy single-head Transformer (`TinyTransformer`) on an input sentence.
  3. `pages/02_Chain_of_Thought.py`: Generates a modular arithmetic task and demonstrates how Mode A serializes intermediate steps into tokens.
  4. `pages/03_Latent_Reasoning_Lab.py`: Main interactive lab comparing Mode A vs. Mode B, exposing state heatmaps, delta bar charts, 2D PCA trajectories, computation proxy metrics, and an $R$-sweep curve.
  5. `pages/04_BDH_Case_Study.py`: Conceptual and mathematical overview of BDH synaptic working memory and BDH-CQ in-context learning.
  6. `pages/05_Assessment.py`: 3-question multiple-choice interactive knowledge check.

### Major Modules & Communication
```
                    ┌───────────────────────────────┐
                    │            main.py            │
                    └───────────────┬───────────────┘
                                    │ Streamlit Router
        ┌───────────────────────────┼───────────────────────────┐
        ▼                           ▼                           ▼
┌──────────────────┐    ┌───────────────────────┐   ┌───────────────────────┐
│ 01_Transformer_  │    │  02_Chain_of_Thought  │   │  03_Latent_Reasoning_ │
│ Foundations.py   │    │  .py                  │   │  Lab.py               │
└────────┬─────────┘    └───────────┬───────────┘   └───────────┬───────────┘
         │                          │                           │
         ▼                          ▼                           ▼
┌──────────────────┐    ┌───────────────────────┐   ┌───────────────────────┐
│ TinyTransformer  │    │    ExplicitSolver     │   │ LatentReasoningModel  │
│ (models/         │    │    (models/           │   │ (models/              │
│  transformer_    │    │     explicit_         │   │  latent_reasoning.py) │
│  demo.py)        │    │     reasoning.py)     │   │                       │
└────────┬─────────┘    └───────────┬───────────┘   └───────────┬───────────┘
         │                          │                           │
         │                          │ Generates Tasks           │ Evaluates Tasks
         │                          └───────────┬───────────────┘
         │                                      ▼
         │                          ┌───────────────────────┐
         │                          │     generate_task     │
         │                          │  (models/tasks.py)    │
         │                          └───────────────────────┘
         ▼                                                      ▼
┌──────────────────┐                                ┌───────────────────────┐
│ components/      │                                │ components/           │
│ attention_       │                                │ state_visualizer.py   │
│ visualizer.py    │                                │ computation_tracker.py│
└──────────────────┘                                └───────────────────────┘
```

### Current Technologies & Frameworks
- **Python:** 3.13.12 (CPython on macOS ARM64).
- **Streamlit:** 1.41.1 (Multi-page interactive web UI).
- **NumPy:** 2.4.4 (Array manipulation, matrix multiplications, BPTT optimization).
- **Matplotlib:** 3.10.8 & **Seaborn:** 0.13.2 (Static visualization heatmaps, bar charts, line plots).
- **scikit-learn:** 1.8.0 (PCA dimensionality reduction for 2D latent state trajectories).
- **PyTest:** 9.1.1 (Test runner, 45 passing unit tests).

---

## 2. CURRENT FILE-BY-FILE IMPLEMENTATION

### `main.py`
- **Purpose:** Entry point for the Streamlit application.
- **Main functions:** Top-level Streamlit script execution (`st.set_page_config`, `st.title`, `st.markdown`).
- **Inputs:** None.
- **Outputs:** Streamlit landing page with introduction, central question, and learning path overview.
- **Dependencies:** `streamlit`, `sys`, `os`.
- **Current role:** Landing page and navigation launcher.

### `models/tasks.py`
- **Purpose:** Deterministic synthetic modular arithmetic task generator.
- **Main classes/functions:**
  - `Task`: Dataclass containing `expression`, `ground_truth`, `operands`, `modulus`, `level`, and `encoded_input`.
  - `generate_task(level=2, seed=None, modulus=None) -> Task`: Generates single arithmetic problem for levels 1–4.
  - `generate_batch(level=2, n=100, seed=0, modulus=None) -> List[Task]`: Generates a batch of tasks.
- **Inputs:** Integer `level` (1–4), integer `seed`, integer prime `modulus`.
- **Outputs:** `Task` instance with ground truth computed via Python integer arithmetic and normalized float vector $x \in \mathbb{R}^6$.
- **Dependencies:** `numpy`, `dataclasses`, `typing`.
- **Current role:** Single source of ground truth for all reasoning experiments.

### `models/transformer_demo.py`
- **Purpose:** Transparent, educational single-head, single-layer Transformer in pure NumPy.
- **Main classes/functions:**
  - `TinyTransformer(d_model=4, seed=42)`:
    - `VOCAB`: 20-word fixed dictionary.
    - `forward(sentence: str) -> dict`: Executes a forward pass returning every intermediate matrix ($X, P, H_0, Q, K, V, \text{scores}, \text{attention\_weights}, \text{attention\_output}, \text{residual\_1}, \text{ffn\_intermediate}, \text{ffn\_output}, \text{residual\_2}$).
- **Inputs:** Input string sentence (e.g. `'the cat sleeps'`).
- **Outputs:** Dictionary containing all tensor intermediate representations.
- **Dependencies:** `numpy`.
- **Current role:** Powers the Transformer Foundations interactive demo on Page 1.

### `models/explicit_reasoning.py`
- **Purpose:** Symbolic Mode A solver that decomposes arithmetic into explicit serialized tokens.
- **Main classes/functions:**
  - `ExplicitSolver`:
    - `solve(task: Task) -> Dict`: Resolves the task step-by-step based on operator precedence, emitting strings like `['3 × 5 = 15', '7 + 15 = 22', '22 mod 11 = 0', 'Answer: 0']`.
- **Inputs:** `Task` instance.
- **Outputs:** Dictionary with `steps`, `tokens`, `answer`, `token_count`, `correct`, and `computation_proxy`.
- **Dependencies:** `models.tasks.Task`, `typing`.
- **Current role:** Serves as the Chain-of-Thought (CoT) baseline for Pages 2 and 3.

### `models/latent_reasoning.py`
- **Purpose:** Mode B recurrent latent state model executing iterative state updates with parameter sharing.
- **Main classes/functions:**
  - `LatentReasoningModel(state_dim=32, hidden_dim=64, max_classes=23, alpha=0.5, seed=42)`:
    - `forward(encoded_input, R, modulus) -> dict`: Computes $s_0$, iterates $s_{t+1} = s_t + \alpha W_2 \tanh(W_1 s_t + b_1)$ for $R$ rounds, evaluates softmax logits over $0 \dots \text{modulus}-1$.
    - `train(tasks, R=5, epochs=500, lr=0.005, verbose=False) -> dict`: Full Backpropagation Through Time (BPTT) implementation in pure NumPy with gradient clipping.
    - `save_weights(path)` / `load_weights(path)`: Serializes/deserializes weights to `.npz`.
    - `param_count`: Property calculating total trainable parameters.
- **Inputs:** Encoded vector $x \in \mathbb{R}^6$, integer rounds $R$, integer modulus $n$.
- **Outputs:** Dictionary containing state trajectory $[s_0, \dots, s_R]$, deltas, predicted class, probability distribution, and computation proxy.
- **Dependencies:** `numpy`, `typing`.
- **Current role:** Core neural model powering the Latent Reasoning Lab (Page 3) and pretraining script.

### `components/attention_visualizer.py`
- **Purpose:** Matplotlib/Seaborn visualization functions for Transformer matrices.
- **Main functions:**
  - `plot_attention_heatmap(weights, tokens, title)`: 2D heatmap of attention weights with token labels.
  - `plot_matrix(matrix, title, row_labels, col_labels, fmt)`: General-purpose annotated matrix heatmap.
- **Inputs:** NumPy 2D array, token label lists.
- **Outputs:** `matplotlib.figure.Figure`.
- **Dependencies:** `matplotlib.pyplot`, `numpy`, `seaborn`.
- **Current role:** Renders matrices on Page 1 (`01_Transformer_Foundations.py`).

### `components/computation_tracker.py`
- **Purpose:** Formats computation metrics comparing Mode A and Mode B.
- **Main functions:**
  - `render_computation_comparison(explicit_proxy, latent_proxy)`: Displays metrics via `st.columns` and `st.metric`.
- **Inputs:** Two proxy dictionaries containing token emissions, state updates, and operation counts.
- **Outputs:** None (renders directly to Streamlit DOM).
- **Dependencies:** `streamlit`.
- **Current role:** Renders computation comparison cards on Page 3.

### `components/state_visualizer.py`
- **Purpose:** Visualizers for inspecting latent state trajectory across rounds.
- **Main functions:**
  - `plot_state_heatmap(states, title)`: Plots state dimension activations across rounds $0 \dots R$.
  - `plot_state_deltas(state_deltas, title)`: Bar chart of $\|s_{t+1} - s_t\|_2$ per round.
  - `plot_pca_trajectory(states, title)`: 2D projection of state trajectory via Scikit-Learn PCA with directed arrows.
- **Inputs:** List of state vectors $[s_0, \dots, s_R]$.
- **Outputs:** `matplotlib.figure.Figure`.
- **Dependencies:** `matplotlib.pyplot`, `numpy`, `sklearn.decomposition.PCA`.
- **Current role:** Renders the three tabs of state visualization on Page 3.

### `pages/01_Transformer_Foundations.py`
- **Purpose:** Interactive UI page explaining Transformer concepts and visualizing forward pass matrices.
- **Current role:** Educational introduction to attention mechanics.

### `pages/02_Chain_of_Thought.py`
- **Purpose:** Interactive UI page demonstrating explicit step-by-step serialization and outlining CoT limitations.
- **Current role:** Stage 2 of the learning path.

### `pages/03_Latent_Reasoning_Lab.py`
- **Purpose:** Main laboratory page providing side-by-side comparison of Mode A and Mode B with sliders, state visualizers, and an $R$-sweep curve.
- **Current role:** Core interactive experiment of the repository.

### `pages/04_BDH_Case_Study.py`
- **Purpose:** Text and mathematical exposition connecting the toy lab to BDH (synaptic working memory) and BDH-CQ (recurrent latent reasoning).
- **Current role:** Theoretical and literature grounding.

### `pages/05_Assessment.py`
- **Purpose:** 3-question multiple choice quiz providing instant feedback.
- **Current role:** Knowledge verification.

### `experiments/pretrain.py`
- **Purpose:** Standalone script that trains `LatentReasoningModel(state_dim=48, hidden_dim=96)` on 1,000 tasks (Levels 1–2, Moduli 7 & 11) for 1,000 epochs using pure NumPy BPTT and saves weights to `data/generated/pretrained_weights.npz`.
- **Current role:** Pre-training pipeline for model weights.

### `data/generated/pretrained_weights.npz`
- **Purpose:** Serialized NumPy archive containing weights: `W_enc`, `b_enc`, `W_1`, `b_1`, `W_2`, `alpha`, `W_out`, `b_out`, `state_dim` (48), and `hidden_dim` (96).
- **Current role:** Pre-computed weight asset loaded at runtime.

### `tests/`
- `tests/test_explicit_model.py`: 8 unit tests checking correctness and format of `ExplicitSolver`.
- `tests/test_latent_model.py`: 14 unit tests checking `LatentReasoningModel` forward pass, shapes, state changes across $R$, weight saving/loading, and parameter counts.
- `tests/test_tasks.py`: 12 unit tests verifying ground truth formulas, operand bounds, and normalized encodings.
- `tests/test_transformer.py`: 11 unit tests verifying tokenization, matrix shapes, softmax sum-to-one, and $QK^T/\sqrt{d_k}$ arithmetic.

---

## 3. TRANSFORMER IMPLEMENTATION AUDIT

The Transformer is implemented in `models/transformer_demo.py` within `TinyTransformer`.

| Component | Status | Implementation Details / Equations | Tensor / Matrix Dimensions |
|---|---|---|---|
| **Tokenization / Token IDs** | **IMPLEMENTED** | Whitespace `.lower().split()`, dict lookup with fallback to 0 (`<pad>`) | Input: String $\to$ Output: List of length $L \le 10$ |
| **Embeddings ($X$)** | **IMPLEMENTED** | Table lookup: $X = E[\text{token\_ids}]$ | $E \in \mathbb{R}^{20 \times 4}$, $X \in \mathbb{R}^{L \times 4}$ |
| **Positional Information ($P$)** | **IMPLEMENTED** | Sliced learned/random positional matrix: $P = P_{\text{matrix}}[:L]$, $H_0 = X + P$ | $P_{\text{matrix}} \in \mathbb{R}^{10 \times 4}$, $H_0 \in \mathbb{R}^{L \times 4}$ |
| **Query Projection ($Q$)** | **IMPLEMENTED** | $Q = H_0 W_Q$ | $W_Q \in \mathbb{R}^{4 \times 4}$, $Q \in \mathbb{R}^{L \times 4}$ |
| **Key Projection ($K$)** | **IMPLEMENTED** | $K = H_0 W_K$ | $W_K \in \mathbb{R}^{4 \times 4}$, $K \in \mathbb{R}^{L \times 4}$ |
| **Value Projection ($V$)** | **IMPLEMENTED** | $V = H_0 W_V$ | $W_V \in \mathbb{R}^{4 \times 4}$, $V \in \mathbb{R}^{L \times 4}$ |
| **Raw Dot Product ($QK^T$)** | **IMPLEMENTED** | Matrix multiplication: $Q @ K^T$ | $QK^T \in \mathbb{R}^{L \times L}$ |
| **Scaling by $\sqrt{d_k}$** | **IMPLEMENTED** | $\text{Scores} = \frac{Q K^T}{\sqrt{d_k}}$ with $d_k = 4$ | $\text{Scores} \in \mathbb{R}^{L \times L}$ |
| **Softmax** | **IMPLEMENTED** | Numerically stable: $\text{softmax}(S)_{ij} = \frac{\exp(S_{ij} - \max_k S_{ik})}{\sum_k \exp(S_{ik} - \max_m S_{im})}$ | $\mathbb{R}^{L \times L}$ |
| **Attention Weights** | **IMPLEMENTED** | Directly returned as normalized rows summing to 1.0 | $A \in \mathbb{R}^{L \times L}$ |
| **Weighted Value Aggregation** | **IMPLEMENTED** | Output projection: $\text{Out} = (A \cdot V) W_O$ | $(A \cdot V) \in \mathbb{R}^{L \times 4}$, $W_O \in \mathbb{R}^{4 \times 4} \to \mathbb{R}^{L \times 4}$ |
| **Residual Connection 1** | **IMPLEMENTED** | $\text{Res}_1 = H_0 + \text{Out}$ | $\mathbb{R}^{L \times 4}$ |
| **Feed-Forward Network (FFN)** | **IMPLEMENTED** | Two-layer with ReLU: $\text{FFN}(z) = \max(0, z W_{\text{ff1}}) W_{\text{ff2}}$ | $W_{\text{ff1}} \in \mathbb{R}^{4 \times 8}$, $W_{\text{ff2}} \in \mathbb{R}^{8 \times 4}$ |
| **Residual Connection 2** | **IMPLEMENTED** | $\text{Res}_2 = \text{Res}_1 + \text{FFN}(\text{Res}_1)$ | $\mathbb{R}^{L \times 4}$ |
| **Layer Normalization** | **NOT IMPLEMENTED** | Mentioned in glossary on Page 1, but completely omitted from code | N/A |
| **Causal Masking** | **NOT IMPLEMENTED** | Bidirectional attention only; autoregressive causal mask is not implemented | N/A |
| **Output Head / Unembedding** | **NOT IMPLEMENTED** | Stops at `residual_2`; no projection to vocabulary logits or next-token sampling | N/A |

---

## 4. EMBEDDING IMPLEMENTATION

### Vocabulary Representation
- Implemented as a fixed Python dictionary in `TinyTransformer.VOCAB` with 20 entries:
  `{'<pad>': 0, 'the': 1, 'cat': 2, 'sleeps': 3, 'dog': 4, 'runs': 5, 'a': 6, 'big': 7, 'small': 8, 'fast': 9, 'sits': 10, 'on': 11, 'mat': 12, 'red': 13, 'blue': 14, 'and': 15, 'or': 16, 'is': 17, 'was': 18, 'bird': 19}`.
- Unknown tokens silently fall back to index `0` (`<pad>`).

### Embedding Matrix & Dimension
- Initialized in `TinyTransformer.__init__`:
  `self.E = np.random.randn(self.vocab_size, self.d_model) * 0.1`
- Fixed default dimension: $d_{\text{model}} = 4$.
- Vocabulary size: $|V| = 20$. Matrix $E \in \mathbb{R}^{20 \times 4}$.

### Token $\to$ Vector Conversion
- Executed via standard NumPy array indexing:
  `token_ids = [self.VOCAB.get(t, 0) for t in tokens]`
  `X = self.E[token_ids]` $\to$ shape $(L, 4)$.

### Nature of Vectors (Learned vs. Random)
- **Status:** **DETERMINISTIC PSEUDO-RANDOM (UNTRAINED)**.
- Generated via `np.random.seed(42)` followed by Gaussian sampling scaled by $0.1$. The vectors possess no semantic clustering (e.g., `'cat'` and `'dog'` have arbitrary dot products).

### Impact of Changing Embedding Dimension
- In the class constructor `TinyTransformer(d_model=...)`, passing a different `d_model` properly resizes $W_Q, W_K, W_V, W_O, E, P_{\text{matrix}}$.
- **Discrepancy:** In the UI (`pages/01_Transformer_Foundations.py`), `d_model=4` is hardcoded. There is **no UI slider or control** allowing the user to change the embedding dimension, despite `LEARNING_JOURNEY.md` stating: *"Micro-Experiment 2 (Dimension): Slider for Embedding Dimension ($d \in \{2, 4, 8\}$). Watch the matrix physically resize on screen."*

---

## 5. ATTENTION IMPLEMENTATION

### End-to-End Mathematical Trace in Code
```
Input Sentence: "the cat sleeps"
  │
  ▼ Tokenization
tokens = ['the', 'cat', 'sleeps'], token_ids = [1, 2, 3]  (L = 3)
  │
  ▼ Embedding Lookup + Positional Addition
X = E[[1, 2, 3]]  ∈ ℝ^(3 × 4)
P = P_matrix[:3]   ∈ ℝ^(3 × 4)
H₀ = X + P         ∈ ℝ^(3 × 4)
  │
  ▼ Linear Projections
Q = H₀ @ W_Q       ∈ ℝ^(3 × 4)     (W_Q ∈ ℝ^(4 × 4))
K = H₀ @ W_K       ∈ ℝ^(3 × 4)     (W_K ∈ ℝ^(4 × 4))
V = H₀ @ W_V       ∈ ℝ^(3 × 4)     (W_V ∈ ℝ^(4 × 4))
  │
  ▼ Scaled Dot-Product Scores
Scores = (Q @ K.T) / √4  ∈ ℝ^(3 × 3)
  │
  ▼ Row-wise Numerically Stable Softmax
Scores_shifted = Scores - max(Scores, axis=-1, keepdims=True)
Attn_Weights = exp(Scores_shifted) / sum(exp(Scores_shifted), axis=-1, keepdims=True)  ∈ ℝ^(3 × 3)
  │
  ▼ Value Aggregation & Output Projection
Context = Attn_Weights @ V  ∈ ℝ^(3 × 4)
Attn_Output = Context @ W_O ∈ ℝ^(3 × 4)     (W_O ∈ ℝ^(4 × 4))
  │
  ▼ Residual 1 + FFN + Residual 2
Res₁ = H₀ + Attn_Output                      ∈ ℝ^(3 × 4)
FFN_int = ReLU(Res₁ @ W_ff1)                 ∈ ℝ^(3 × 8)     (W_ff1 ∈ ℝ^(4 × 8))
FFN_out = FFN_int @ W_ff2                    ∈ ℝ^(3 × 4)     (W_ff2 ∈ ℝ^(8 × 4))
Res₂ = Res₁ + FFN_out                        ∈ ℝ^(3 × 4)
```

### Genuine Computation vs. Visualization
- **Status:** **GENUINE LIVE COMPUTATION**.
- Every matrix is computed on the fly by NumPy when the user clicks "Run Transformer".
- The unit tests verify that $\sum_j A_{ij} = 1.0$, $Q = H_0 W_Q$, and $\text{Scores} = \frac{QK^T}{\sqrt{d_k}}$ to numerical tolerance $10^{-6}$.

---

## 6. EXPLICIT REASONING IMPLEMENTATION

### Representation of Reasoning Steps
In `models/explicit_reasoning.py`, `ExplicitSolver` implements Mode A reasoning:
- It receives a `Task` instance containing operands $a, b, c, d$ and modulus $n$.
- Intermediate arithmetic steps are serialized as dictionaries:
  `{'description': '3 × 5 = 15', 'operation': 'multiply', 'result': 15}`
- A parallel list of string tokens is accumulated:
  `['3 × 5 = 15', '7 + 15 = 22', '22 mod 11 = 0', 'Answer: 0']`

### Token Generation Nature
- **Are tokens generated?** Yes, as formatted Python strings.
- **Is this a neural model?** **NO**. It is a rule-based symbolic Python solver executing native integer arithmetic according to standard algebraic order of operations. The code and UI explicitly disclaim this: *"NOT a neural network — a rule-based symbolic solver."*
- **Is the sequential computation real?** Yes. The intermediate values are genuinely computed sequentially (e.g., $x = b \times c$, then $y = a + x$, then $z = y \pmod n$).
- **Intermediate steps:** Genuinely computed per task, not pre-scripted lookup tables.

---

## 7. LATENT REASONING IMPLEMENTATION

### Exact Mathematical State-Update Mechanism
Located in `models/latent_reasoning.py` within `LatentReasoningModel`:

#### 1. Initial State Encoding ($s_0$):
$$s_0 = \text{ReLU}(W_{\text{enc}} \cdot x + b_{\text{enc}})$$
- $x \in \mathbb{R}^6$: Normalized input vector $[\frac{a}{23}, \frac{b}{23}, \frac{c}{23}, \frac{d}{23}, \frac{n}{23}, \frac{\text{level}}{4}]$.
- $W_{\text{enc}} \in \mathbb{R}^{\text{state\_dim} \times 6}$, $b_{\text{enc}} \in \mathbb{R}^{\text{state\_dim}}$.
- $\text{ReLU}(z) = \max(0, z)$.

#### 2. Recurrent State Update ($s_{t+1}$ for $t = 0 \dots R-1$):
$$s_{t+1} = s_t + \alpha \cdot W_2 \tanh(W_1 s_t + b_1)$$
- $s_t \in \mathbb{R}^{\text{state\_dim}}$: Current internal latent state.
- $W_1 \in \mathbb{R}^{\text{hidden\_dim} \times \text{state\_dim}}$, $b_1 \in \mathbb{R}^{\text{hidden\_dim}}$: First recurrent projection.
- $\tanh$: Hyperbolic tangent non-linearity.
- $W_2 \in \mathbb{R}^{\text{state\_dim} \times \text{hidden\_dim}}$: Second recurrent projection (weights shared across all $R$ steps).
- $\alpha \in \mathbb{R}$: Learnable residual step scale factor (scalar, initialized to $0.5$).

#### 3. Output Readout ($\hat{y}$):
$$\text{logits} = W_{\text{out}} s_R + b_{\text{out}} \in \mathbb{R}^{23}$$
$$\text{mod\_logits} = \text{logits}[:n] \in \mathbb{R}^n$$
$$P(\hat{y} = k) = \frac{\exp(\text{mod\_logits}_k)}{\sum_{j=0}^{n-1} \exp(\text{mod\_logits}_j)}$$
$$\hat{y} = \arg\max_{k \in \{0, \dots, n-1\}} P(\hat{y} = k)$$
- $W_{\text{out}} \in \mathbb{R}^{23 \times \text{state\_dim}}$, $b_{\text{out}} \in \mathbb{R}^{23}$.
- The output softmax is dynamically restricted to the specific prime modulus $n \le 23$.

### Computational Properties Verification
- **Does the hidden state change between rounds?** **YES**. The model records $[s_0, s_1, \dots, s_R]$. Unit tests verify that $\|s_{t+1} - s_t\|_2 > 0$ and state deltas are non-zero.
- **Does changing $R$ execute additional computation?** **YES**. The `for t in range(R):` loop runs exactly $R$ iterations. Each iteration performs two matrix-vector multiplications, a $\tanh$ activation, a scaled vector addition, and norm calculation.
- **Is $R$ a genuine computational variable?** **YES**. The final prediction $\hat{y}$ is read from $s_R$. If $R$ changes, $s_R$ changes, altering logits and predictions.
- **Can the model produce incorrect predictions?** **YES**. It regularly fails on unseen moduli, higher levels, and small $R$.
- **Are weights trained or random?** Pre-trained weights exist in `data/generated/pretrained_weights.npz` ($W_{\text{enc}}, W_1, W_2, W_{\text{out}}$ with $\text{state\_dim}=48, \text{hidden\_dim}=96$).
- **Live generation:** Forward passes are executed live via pure NumPy on every user run.

---

## 8. SYNTHETIC TASK / DATA GENERATION

### Task Specifications (`models/tasks.py`)
- **Domain:** Modular arithmetic over primes $n \in \{7, 11, 13, 17, 19, 23\}$.
- **Operands:** $a, b, c, d \in \{1, \dots, n-1\}$.
- **Four Difficulty Levels:**
  - **Level 1:** $a + b \pmod n$ (2 operands)
  - **Level 2:** $a + b \times c \pmod n$ (3 operands)
  - **Level 3:** $a \times b + c \times d \pmod n$ (4 operands)
  - **Level 4:** $(a + b) \times c + d \pmod n$ (4 operands)
- **Input Encoding:** $x = [\frac{a}{23}, \frac{b}{23}, \frac{c}{23}, \frac{d}{23}, \frac{n}{23}, \frac{\text{level}}{4}] \in [0, 1]^6$. Unused operands are zero-padded.
- **Ground Truth Independence:** Ground truth is strictly evaluated via Python's native integer arithmetic: `(a + b * c) % n`. It is completely decoupled from any neural model.
- **Stochasticity vs. Determinism:** Controlled by an optional `seed` parameter; without a seed, it is stochastic.
- **Training vs. Evaluation Distribution:**
  - Pretraining in `experiments/pretrain.py` trains **strictly on Levels 1 & 2** with moduli **7 and 11**.
  - Evaluation in the lab allows generating **Levels 3 & 4** with moduli **13, 17, 19, 23** (completely out-of-distribution test cases to demonstrate failure modes).

---

## 9. GROUND TRUTH AND EVALUATION

### Independence of Ground Truth and Predictions
- **Ground Truth Generation:** Native integer arithmetic in `models/tasks.py`.
- **Mode A Prediction:** Symbolic integer evaluation in `models/explicit_reasoning.py`.
- **Mode B Prediction:** Neural class argmax over softmax logits in `models/latent_reasoning.py`.
- **Correctness Evaluation:**
  - Mode A: `explicit_res['answer'] == task.ground_truth`
  - Mode B: `latent_res['prediction'] == task.ground_truth`
  - Completely live; zero hardcoded or pre-scripted evaluation results.

### Measured Accuracy of the Pretrained Model Asset
Empirical evaluation of the saved `pretrained_weights.npz` across 50 samples per configuration ($R=5$):

| Level | Modulus 7 | Modulus 11 | Modulus 13 (Unseen) |
|---|---|---|---|
| **Level 1** | 28.0% (14/50) | 18.0% (9/50) | 10.0% (5/50) |
| **Level 2** | 14.0% (7/50) | 8.0% (4/50) | 4.0% (2/50) |
| **Level 3 (Unseen)** | 16.0% (8/50) | 6.0% (3/50) | 6.0% (3/50) |
| **Level 4 (Unseen)** | 12.0% (6/50) | 10.0% (5/50) | 10.0% (5/50) |

*(Note: Random guess baseline is $1/7 \approx 14.3\%$, $1/11 \approx 9.1\%$, $1/13 \approx 7.7\%$. The model performs slightly above chance on Level 1, mod 7, but struggles with higher difficulty and unseen moduli.)*

---

## 10. REASONING-ROUND EXPERIMENT

### What Happens When Adjusting $R \in \{1, 2, 3, 4, 5\}$
1. The user selects $R$ via Streamlit slider.
2. When the forward pass is triggered, `model.forward(x, R, modulus)` is executed.
3. The recurrent loop iterates $t = 0 \dots R-1$:
   - $R=1$: States recorded: $[s_0, s_1]$. 1 update.
   - $R=5$: States recorded: $[s_0, s_1, s_2, s_3, s_4, s_5]$. 5 updates.
4. Intermediate states $s_1$ are identical between $R=1$ and $R=5$ (deterministic recurrence), but final state $s_R$ diverges.
5. The output logits $\hat{y} = \text{argmax}(W_{\text{out}} s_R + b_{\text{out}})$ change dynamically.
6. The state heatmap renders an array of shape $(R+1, \text{state\_dim})$.
7. The delta bar chart renders $R$ vertical bars.
8. The PCA plot displays $R+1$ points connected by $R$ arrows.

### UI Reactivity Flaw Found in Current Implementation
In `pages/03_Latent_Reasoning_Lab.py` (lines 49–56):
```python
if run_exp or 'exp_run' not in st.session_state:
    st.session_state.exp_run = True
    explicit_res = explicit_solver.solve(task)
    latent_res = latent_model.forward(task.encoded_input, rounds, task.modulus)
    st.session_state.explicit_res = explicit_res
    st.session_state.latent_res = latent_res
```
- When a user moves the $R$ slider or clicks "Generate New Task", Streamlit reruns the script.
- However, `run_exp` is `False` (it only becomes `True` when clicking "🚀 Run Experiment"), and `'exp_run'` is already in `st.session_state`.
- **Result:** The model forward pass is **NOT re-executed** on slider change alone! The UI continues displaying the cached results until the user explicitly clicks the "🚀 Run Experiment" button. This breaks the expected reactive flow.

---

## 11. CURRENT UI / LEARNING EXPERIENCE

| Page / Screen | Concept Taught | Controls Present | Computation Triggered | Visual Feedback Shown | Learning Takeaway | Rating |
|---|---|---|---|---|---|---|
| **`main.py`** | High-level motivation & roadmap | None | None | Formatted markdown text, info callout | Sets expectations for reasoning without intermediate tokens | Static Overview |
| **`01_Transformer_Foundations.py`** | Attention mechanics ($Q, K, V$, softmax, residual) | Text input (`sentence`), "Run Transformer" button | Live forward pass of `TinyTransformer` | 9 Matplotlib heatmaps showing $X, P, H_0, W_Q, W_K, W_V, Q, K, V, \text{Scores}, A, \text{Out}, \text{Res}_2$ | Attention computes mathematical compatibility weights between token vectors | Moderately Interactive |
| **`02_Chain_of_Thought.py`** | CoT token emission & sequential bottlenecks | Level slider (1–4), "Generate New Problem" button | `generate_task()`, `ExplicitSolver.solve()` | Sequential token emission pipeline with arrow connectors | CoT externalizes reasoning into tokens; costly and error-prone | Moderately Interactive |
| **`03_Latent_Reasoning_Lab.py`** | Explicit vs. Latent comparison, recurrence rounds $R$, state trajectories | Level slider (1–4), Modulus selectbox, $R$ slider (1–10), State dim selectbox, Seed input, Mode radio, "Run Exp" button, "$R$ Sweep" button | Live forward pass of both models, optional 10-point $R$-sweep loop | Metrics (GT, Mode A, Mode B), token sequence vs. state transitions, state heatmap, delta bars, PCA plot, computation cards, confidence curve | Latent reasoning updates internal state vectors without emitting tokens | Highly Interactive (with button caveat) |
| **`04_BDH_Case_Study.py`** | BDH synaptic memory & BDH-CQ recurrent latent reasoning | None | None | Formatted LaTeX equations, comparison table, source citation badges | Real research uses dynamic synaptic state matrices and continuous latent updates | Static Reading |
| **`05_Assessment.py`** | Knowledge check | 3 radio buttons, "Check Answers" button | Answer checking logic | Green success / red error alerts, score metric ($X/3$) | Reinforces core conceptual distinctions | Interactive Quiz |

---

## 12. BDH IMPLEMENTATION AUDIT

### Is BDH Implemented in Code?
**NO. BDH IS NOT IMPLEMENTED IN THE COMPUTATIONAL ENGINE.**

### Evidence in Code vs. Literature
- In `models/latent_reasoning.py`, the model is an **MLP-based recurrent neural network** with additive residual updates:
  $$s_{t+1} = s_t + \alpha W_2 \tanh(W_1 s_t + b_1)$$
- In contrast, the actual BDH architecture (Kosowski et al., arXiv:2509.26507) centers on **Hebbian synaptic state dynamics**:
  $$S_t = \lambda S_{t-1} + K_t^T V_t, \quad O_t = Q_t S_t$$
  where $S_t \in \mathbb{R}^{d \times d}$ is a dynamic working memory matrix updated via outer products of keys and values.
- **Repository Disclaimers:**
  - `README.md` line 60: *"This is a toy educational model, NOT the BDH/BDH-CQ architecture."*
  - `README.md` line 115: *"The toy latent model is a simple MLP-based recurrent network, NOT the BDH architecture."*
  - `pages/04_BDH_Case_Study.py` line 80: *"BDH possesses explicit memory keys and associative binding lacking in our simple MLPs."*
  - `docs/sources.md` line 81: *"All results labeled 🟢 OUR RESULTS are computed live by the toy model implementation in this project. They are NOT BDH or BDH-CQ results."*

### Breakdown of BDH Representation
- **Actual Implementation:** 0% (No synaptic state matrix $S_t$, no Hebbian plasticity in code).
- **Simplified Conceptual Explanation:** 100% (Accurately explains the difference between static KV-caches and dynamic synaptic working memory).
- **Static Visualization:** Markdown tables and LaTeX equations on Page 4.
- **External/Published Information:** Sourced from arXiv:2509.26507 with authors and venue credited.

---

## 13. BDH-CQ IMPLEMENTATION AUDIT

### Is BDH-CQ Implemented in Code?
**NO. BDH-CQ IS NOT IMPLEMENTED IN THE COMPUTATIONAL ENGINE.**

### Comparison
- BDH-CQ (Engdahl, Kosowski, Chorowski, arXiv:2608.09888) is an in-context learning architecture using a Context-Query formulation over a continuous latent vector $z$:
  $$z^{(0)} = f_{\text{init}}(x^*, M_K), \quad z^{(r)} = R(z^{(r-1)}, M_K, \psi(x^*)), \quad \hat{y}^* = \text{Decode}(z^{(R)})$$
- The toy latent model in `models/latent_reasoning.py` shares the abstract property of updating a state vector without emitting tokens ($s_0 \to s_1 \to \dots \to s_R$), but lacks:
  - Context-query memory matrices ($M_K$).
  - In-context example demonstration support.
  - Multi-head attention or associative retrieval mechanisms.
- **Wording Audit:**
  - Does any text falsely claim that our code *is* BDH-CQ? **No**. The documentation and UI repeatedly label our model as a "toy educational model" and explicitly distinguish between 🟢 OUR RESULTS and 🔵 PUBLISHED results.

---

## 14. TECHNICAL CORRECTNESS AUDIT

### Identified Issues and Classification

#### 1. [CRITICAL] `state_dim` Selection in UI is Overwritten by Saved Weights
- **Location:** `pages/03_Latent_Reasoning_Lab.py` line 19 & `models/latent_reasoning.py` line 220.
- **Issue:** The UI provides a sidebar dropdown for `State Dimension: [8, 16, 32, 48, 64]`. However, when `model.load_weights(...)` loads `pretrained_weights.npz`, it forcibly overwrites `self.state_dim = 48` from the file!
- **Why Critical:** A user selecting `state_dim = 16` expects a 16-dimensional model, but the model remains 48-dimensional. If weights fail to load, an untrained model of dimension 16 is used, causing an inconsistent experience.

#### 2. [HIGH] UI Non-Reactivity on Slider Change
- **Location:** `pages/03_Latent_Reasoning_Lab.py` lines 49–56.
- **Issue:** Due to the `if run_exp or 'exp_run' not in st.session_state:` gate, dragging the `R` slider or changing `Modulus` or `Level` does not trigger recomputation unless the user explicitly clicks the "🚀 Run Experiment" button.
- **Why High:** In Streamlit, users expect immediate reactive recalculation when manipulating sliders. It creates the false impression that changing $R$ does nothing.

#### 3. [MEDIUM] LayerNorm Mentioned in Glossary but Omitted in Code
- **Location:** `pages/01_Transformer_Foundations.py` line 28 vs. `models/transformer_demo.py` line 98–105.
- **Issue:** The glossary explains "Residual Connection, Layer Normalization", but `TinyTransformer` applies only residual addition ($H_0 + \text{Attn}$, $\text{Res}_1 + \text{FFN}$) without layer normalization.
- **Why Medium:** Educational discrepancy between glossary definition and code implementation.

#### 4. [MEDIUM] Architectural Plan Discrepancy (8 Planned Pages vs. 5 Actual Pages)
- **Location:** `PROJECT_ARCHITECTURE.md` lines 17–24 vs. `pages/`.
- **Issue:** `PROJECT_ARCHITECTURE.md` documents an 8-page architecture (`02_Tokens_and_Embeddings.py`, `03_Attention_Mechanics.py`, `04_Explicit_vs_Latent.py`, `05_Reasoning_Rounds.py`, `06_State_Visualization.py`, `07_BDH_Case_Study.py`, `08_Learning_Test.py`) inside an `engine/` directory. The codebase actually has 5 pages in `pages/` and code in `models/`.
- **Why Medium:** Causes confusion during architecture review.

#### 5. [LOW] Pretrained Model Low Accuracy on Higher Difficulty
- **Location:** `data/generated/pretrained_weights.npz`.
- **Issue:** The model achieves ~28% on Level 1 mod 7, but only 4%–12% on Levels 2–4. While intentional as a "Break It" feature to demonstrate limitations, the low Level 2 accuracy (~14%) means it often fails even on nominal tasks.

---

## 15. EDUCATIONAL QUALITY AUDIT

### Criteria Evaluation
1. **Is the concept understandable?** **YES**. The central contrast between emitting text tokens (Mode A) versus refining hidden states (Mode B) is clear and intuitive.
2. **Can a learner interact with the concept?** **YES**. Sliders exist for difficulty, modulus, and reasoning rounds $R$.
3. **Does every major control correspond to a real variable?**
   - $R$ slider: Directly controls recurrent loop depth.
   - Level slider: Directly alters synthetic expression composition.
   - Modulus selectbox: Directly changes arithmetic base and softmax readout width.
   - State Dimension selectbox: Flawed (overwritten by weights file).
4. **Does the learner immediately see consequences?** Yes, upon clicking "🚀 Run Experiment", but impaired by the button gate.
5. **Are mathematical operations visible?** **EXCELLENT**. All matrices ($X, P, H_0, Q, K, V, QK^T/\sqrt{d_k}, A, S_t$) are displayed with explicit mathematical labels and color annotations.
6. **Are failures visible?** **YES**. Selecting Level 3 or 4 visibly causes Mode B to predict incorrect answers while Mode A remains correct.
7. **Is there a clear central claim?** Yes: *"Reasoning can occur via internal state updates rather than token generation, saving output sequence bandwidth at the cost of interpretability."*
8. **Is there a 60-second learning test?** **YES**. Page 5 features a concise 3-question diagnostic quiz.

---

## 16. LIVE / PRECOMPUTED / SYNTHETIC / ANIMATED CLASSIFICATION

| Asset / Output | Classification | Evidence / Source |
|---|---|---|
| **Synthetic Arithmetic Tasks** | **SYNTHETIC DATA (LIVE)** | Generated via `models/tasks.py` using NumPy random seeds |
| **Ground Truth Answers** | **LIVE COMPUTATION** | Evaluated dynamically via Python integer arithmetic `(a + b * c) % n` |
| **Mode A Reasoning Steps** | **LIVE COMPUTATION** | Sequentially evaluated by `ExplicitSolver` per generated task |
| **Mode B Forward Pass** | **LIVE COMPUTATION** | Evaluated by `LatentReasoningModel.forward()` on every execution |
| **Pretrained Model Weights** | **PRECOMPUTED** | Stored in `data/generated/pretrained_weights.npz` |
| **TinyTransformer Forward Matrices** | **LIVE COMPUTATION** | Evaluated on user sentence via `TinyTransformer.forward()` |
| **Attention & Matrix Heatmaps** | **LIVE COMPUTATION** | Plotted dynamically by Matplotlib/Seaborn from live output arrays |
| **State Evolution Heatmap** | **LIVE COMPUTATION** | Plotted dynamically from `latent_res['states']` |
| **State Delta Bar Chart** | **LIVE COMPUTATION** | Plotted dynamically from `latent_res['state_deltas']` |
| **PCA State Trajectory** | **LIVE COMPUTATION** | Scikit-Learn `PCA.fit_transform()` executed live on $[s_0, \dots, s_R]$ |
| **$R$-Sweep Confidence Curve** | **LIVE COMPUTATION** | 10 consecutive forward passes run live in a loop on button click |
| **ARC-AGI-1 Benchmark Figures** | **STATIC / ILLUSTRATIVE** | Hardcoded text on Page 4 citing arXiv:2608.09888 (29.5% pass@2, $0.0007 cost) |
| **Synaptic Plasticity Equations** | **STATIC / ILLUSTRATIVE** | LaTeX text referencing arXiv:2509.26507 |

---

## 17. TESTING AUDIT

### Test Suite Overview
- **Framework:** PyTest.
- **Test Files:** 4 (`tests/test_explicit_model.py`, `tests/test_latent_model.py`, `tests/test_tasks.py`, `tests/test_transformer.py`).
- **Total Tests:** 45.
- **Pass Rate:** **100% (45 passed in 0.13s)**.

### What is Thoroughly Tested
- **Mathematical Invariants:**
  - Softmax rows sum to $1.0 \pm 10^{-6}$.
  - $H_0 = X + P$.
  - $Q = H_0 W_Q$.
  - $\text{Scores} = QK^T / \sqrt{d_k}$.
  - Modulo ground truth for all 4 difficulty levels across multiple seeds.
- **Shapes and Dimensions:**
  - Tensor shapes across all Transformer layers.
  - State trajectory length matches $R+1$.
  - Latent probability vector length matches modulus $n$.
- **Model Behaviors:**
  - Modifying $R$ changes the final state $s_R$ while keeping $s_1$ identical.
  - State deltas $\|s_{t+1} - s_t\|_2$ are strictly positive.
  - Weight serialization and reloading produces bit-exact outputs.
  - Seed reproducibility across distinct model instantiations.

### Critical Missing Tests
- **UI Tests:** No Streamlit app testing (e.g., via `streamlit.testing.v1.AppTest`).
- **BPTT Training Tests:** `model.train()` is never called in unit tests (only tested in standalone `experiments/pretrain.py`).
- **Weight Loading Dimension Mismatch Test:** No test verifying what happens when loading weights with mismatched `state_dim`.
- **Pretrained Weights Integrity Test:** No test verifying that `data/generated/pretrained_weights.npz` exists and loads without error.

---

## 18. DOCUMENTATION AUDIT

| Document | Current Status | Findings & Discrepancies |
|---|---|---|
| **`README.md`** | **ACCURATE** | Excellent mathematical formulation, clear usage instructions, honest limitations section, explicit disclaimer that the toy model is not BDH, full provenance citations. |
| **`PROJECT_ARCHITECTURE.md`** | **INCONSISTENT** | Describes an 8-page UI structure (`02_Tokens_and_Embeddings.py` to `08_Learning_Test.py`) and an `engine/` directory that does not exist in the actual repo (the repo has 5 pages in `pages/` and computation in `models/`). |
| **`LEARNING_JOURNEY.md`** | **INCOMPLETE / OUTDATED** | Outlines an 8-step screen-by-screen flow with specific micro-experiments (e.g., token drag-and-drop, dimension slider resizing matrices, interactive Q/K vector selection) that were never implemented in `pages/01_Transformer_Foundations.py`. |
| **`TECHNICAL_SPEC.md`** | **PARTIALLY ACCURATE** | Accurate regarding modular arithmetic encoding, explicit vs. latent solver mechanics, and evidence labeling. Inaccurate regarding micro-experiments 1–4 which were condensed into a single page. |
| **`docs/sources.md`** | **ACCURATE** | Outstanding evidence provenance catalog cleanly classifying claims into 🟢 OUR RESULTS, 🔵 PUBLISHED, 🟡 ILLUSTRATIVE, and ⚪ PRIMARY SOURCE. |

---

## 19. HACKATHON REQUIREMENT COVERAGE

| Hackathon Requirement / Objective | Current Status | Evidence in Repository | Missing Work |
|---|---|---|---|
| **Explain Transformer Foundations** | **DONE** | `pages/01_Transformer_Foundations.py`, `models/transformer_demo.py` | Add LayerNorm and allow dynamic embedding dimension tuning in UI. |
| **Explain Chain-of-Thought (CoT)** | **DONE** | `pages/02_Chain_of_Thought.py`, `models/explicit_reasoning.py` | None; clearly contrasts sequential tokenization. |
| **Demonstrate Latent Reasoning Alternative** | **DONE** | `pages/03_Latent_Reasoning_Lab.py`, `models/latent_reasoning.py` | Make UI fully reactive without requiring button click. |
| **Interactive Reasoning Rounds ($R$)** | **DONE** | Slider in `pages/03_Latent_Reasoning_Lab.py` driving live recurrence | Fix button caching bug; add direct visual comparison across $R$. |
| **Internal State Visualization** | **DONE** | `components/state_visualizer.py` (Heatmap, Deltas, PCA trajectory) | None; all three views are functional and live. |
| **Connect to BDH Architecture** | **PARTIAL** | `pages/04_BDH_Case_Study.py`, `docs/sources.md` | Currently static explanation; could benefit from a toy Hebbian state toy demo ($S_t = \lambda S_{t-1} + K^T V$). |
| **Connect to BDH-CQ Architecture** | **PARTIAL** | `pages/04_BDH_Case_Study.py`, `docs/sources.md` | Currently static explanation of continuous latent reasoning. |
| **Demonstrate Limitations & Failure Modes** | **DONE** | Levels 3–4 arithmetic tasks cause Mode B failure; documented in UI & README | Could add specific out-of-distribution modulus toggle. |
| **Transparent Pure-Math Engine** | **DONE** | 100% pure NumPy in `models/`; zero black-box dependencies | Fully achieved. |
| **Rigorous Evidence Labeling** | **DONE** | Schema defined in `docs/sources.md` and applied across pages | Ensure all callouts strictly follow the 🟢/🔵/🟡/⚪ badges. |

---

## 20. CURRENT STRENGTHS

1. **Pure NumPy Mathematical Rigor:** The computational engine is 100% transparent. Every matrix multiplication, non-linearity, softmax, and backward pass is written in plain NumPy without opaque framework abstractions.
2. **Honest Scientific Framing:** The repository avoids hyping the toy model. It explicitly clarifies that the toy model is not BDH, documents failure modes, distinguishes live computations from literature citations, and utilizes a four-tier evidence badge schema.
3. **Comprehensive Test Suite:** 45 fast, robust unit tests covering mathematical invariants (softmax normalization, dot product scaling, residual additions, ground truth correctness, reproducibility).
4. **End-to-End State Trajectory Tracking:** The latent model records complete state histories $[s_0, \dots, s_R]$, enabling rich visual diagnostics (heatmaps, L2 norm deltas, and 2D PCA trajectories).
5. **Clean Decoupling:** Complete separation of computational logic (`models/`) from presentation logic (`pages/`, `components/`), adhering to good software engineering standards.

---

## 21. CURRENT WEAKNESSES

1. **UI Reactivity Gate Bug:** Storing experiment outputs behind an `if run_exp or 'exp_run' not in st.session_state:` condition prevents the app from reactively updating when sliders are manipulated, degrading user experience.
2. **`state_dim` Selectbox Bug:** The sidebar dropdown allows selecting state dimensions, but `load_weights` unconditionally overwrites `state_dim = 48` from the `.npz` archive.
3. **Low Task Accuracy on Level 2:** Even on in-distribution Level 2 tasks, the pretrained model achieves only ~14% accuracy, which may lead users to perceive the model as broken rather than learning.
4. **Static BDH / BDH-CQ Integration:** While the theoretical explanation on Page 4 is accurate, it is entirely static text and equations. There is no interactive widget demonstrating Hebbian fast weights or associative memory.
5. **Documentation vs. Implementation Divergence:** `PROJECT_ARCHITECTURE.md` and `LEARNING_JOURNEY.md` reference an 8-page architecture that does not match the actual 5-page layout.

---

## 22. FINAL READINESS SCORE

| Category | Score (out of 10) | Justification |
|---|---|---|
| **Technical Correctness** | **7.5 / 10** | Pure NumPy math is solid, but `state_dim` overwrite and missing LayerNorm deduct points. |
| **Educational Effectiveness** | **8.0 / 10** | Strong pedagogy; clearly illustrates CoT vs. latent trade-offs. |
| **Interactivity** | **6.5 / 10** | Good controls, but crippled by the `run_exp` session state button caching issue. |
| **Transformer Explanation** | **7.5 / 10** | Excellent matrix breakdown, but lacks interactive dimension tuning and LayerNorm. |
| **Latent Reasoning Explanation** | **8.5 / 10** | Best part of the app; state trajectories and computation proxies are clear. |
| **BDH Integration** | **5.5 / 10** | Sourced accurately with good disclaimers, but purely static markdown. |
| **BDH-CQ Integration** | **5.5 / 10** | Same as above; well-referenced literature, but no live code demonstration. |
| **Documentation** | **7.0 / 10** | `README.md` and `sources.md` are top-tier, but `PROJECT_ARCHITECTURE.md` is out of sync. |
| **Reproducibility** | **9.5 / 10** | Deterministic random seeds, pure NumPy, fast unit tests, no GPU requirements. |
| **Round-One Hackathon Readiness**| **7.2 / 10** | A strong, working project with passing tests, but needs UI reactivity and documentation alignment. |

---

## 23. PRIORITY ACTION LIST

### P0 — Must Fix Before Submission
- **Fix UI Reactivity Gate in `pages/03_Latent_Reasoning_Lab.py`:** Ensure changing the $R$ slider, modulus, or level immediately and reactively re-evaluates the models without requiring a manual button click.
- **Fix `state_dim` Selection Conflict:** Either disable the `state_dim` dropdown when using pretrained weights (with an explanatory notice) or train separate weight checkpoints for each dimension.
- **Sync Architecture Documentation:** Update `PROJECT_ARCHITECTURE.md` and `LEARNING_JOURNEY.md` so that file paths, page counts, and module names match the actual 5-page implementation.

### P1 — Important
- **Enhance Pretrained Model Accuracy:** Retrain `pretrained_weights.npz` with improved hyperparameters or sinusoidal positional encodings so Level 1 & 2 accuracy reaches $\ge 60\%$, ensuring the comparison is compelling before demonstrating failure on Levels 3 & 4.
- **Interactive BDH Hebbian Toy Demonstration:** Add an interactive micro-widget to Page 4 showing the Hebbian synaptic update $S_t = \lambda S_{t-1} + K_t^T V_t$ on a $4 \times 4$ matrix.
- **Add LayerNorm to `TinyTransformer`:** Align the code with the concept glossary on Page 1.

### P2 — Polish
- **Interactive Embedding Dimension Slider on Page 1:** Implement the planned feature where adjusting $d_{\text{model}} \in \{2, 4, 8\}$ dynamically regenerates and resizes the Transformer matrices.
- **Direct Multi-$R$ State Overlay:** Allow plotting state trajectories for $R=2, 5, 8$ simultaneously on the PCA plot to visualize convergence.

### P3 — Optional
- **Automated Streamlit App Tests:** Add `streamlit.testing.v1` test cases in `tests/test_ui.py` to ensure zero regressions in UI rendering.

---

## 24. WHAT WE SHOULD NOT CHANGE

The following core components are technically sound, well-tested, and should be **strictly preserved**:

1. **`models/tasks.py`:** The modular arithmetic task generation logic, prime modulus selection, and integer ground truth arithmetic are completely correct and well-tested.
2. **`models/explicit_reasoning.py`:** The symbolic rule-based solver faithfully models Chain-of-Thought token generation without unnecessary complexity.
3. **`models/latent_reasoning.py` Forward Pass Math:** The formulation $s_{t+1} = s_t + \alpha W_2 \tanh(W_1 s_t + b_1)$ with softmax readout is mathematically clean, stable, and executes genuine recurrent updates.
4. **`models/transformer_demo.py` Attention Math:** The scaled dot-product attention calculation $\text{softmax}(QK^T/\sqrt{d_k})V$ is mathematically exact and verified by tests.
5. **`components/state_visualizer.py`:** The heatmap, delta bar chart, and PCA projection functions work reliably and provide excellent visual insight into internal representations.
6. **`docs/sources.md`:** The evidence provenance catalog and labeling schema (🟢/🔵/🟡/⚪) are rigorous and should be maintained as the standard for hackathon submission integrity.
7. **Existing PyTest Test Suite (`tests/`):** All 45 tests pass and form an essential safety net for future improvements.
