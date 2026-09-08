# 🧪 Latent Reasoning Laboratory

**An interactive computational laboratory for understanding alternatives to Chain-of-Thought reasoning.**

---

## 🎯 What Will You Learn?

After using this laboratory, you will understand:
- How **Transformers** process words through tokenization, dense embeddings, positional encoding, and self-attention.
- How **Query-Key scaled dot-products** and softmax probabilities drive Value vector aggregation.
- What **Chain-of-Thought (CoT)** reasoning is and why serializing tokens incurs a linear latency and memory penalty.
- How **latent/iterative reasoning** provides an alternative computational pathway by updating continuous hidden states.
- How changing the **reasoning rounds ($R$)** parameter directly governs internal computational depth.
- How **Pathway's BDH** (Baby Dragon Hatchling) and **BDH-CQ** architectures implement dynamic synaptic working memory and recurrent latent in-context reasoning.
- The fundamental engineering **trade-offs** between explicit and latent reasoning (interpretability vs. latency, context size, and verifiability).

---

## 💡 The Central Question

> *"Can a model perform useful multi-step reasoning by refining its internal state instead of emitting every intermediate reasoning step as natural-language tokens?"*

---

## 🧭 The 6-Chapter Learning Curriculum

The laboratory follows a strict **DO → SEE → UNDERSTAND → EXPLAIN** pedagogical progression:

1. **`01 — Transformer Foundations`**: Interactive token selector, token IDs, $\mathbb{R}^4$ embedding lookup, positional vector injection ($H_0 = X + P$), and sequence matrices.
2. **`02 — Attention Laboratory`**: Live Query ($Q$) vs. Key ($K$) scaled dot-product matching, softmax probability weights ($A$), Value ($V$) aggregation, output projection, residual addition, and Layer Normalization.
3. **`03 — Explicit vs. Latent Reasoning`**: Direct side-by-side pathway comparison: Mode A (CoT token emission) vs. Mode B (continuous state transitions) on synthetic modular arithmetic.
4. **`04 — Latent Reasoning Laboratory`**: The core interactive sandbox. Reactive reasoning rounds slider ($R=1 \dots 10$), state evolution heatmaps, $\|\Delta S\|_2$ delta magnitude bar charts, 2D PCA state trajectories, $R$-sweep confidence curves, and a transparent "Where does this break?" limitations section.
5. **`05 — BDH & BDH-CQ Research Frontier`**: Primary source grounding in Pathway's published research (Kosowski et al., 2025; Engdahl et al., 2026). Features an interactive 4×4 Hebbian synaptic state simulator ($S_t = \lambda S_{t-1} + K_t^T V_t$) and architectural comparison tables.
6. **`06 — Challenge / 60-Second Test`**: 6 diagnostic conceptual questions providing instant mathematical and architectural feedback.

---

## 🏗️ Repository Architecture

```text
IITKGP_V2/
├── main.py                         # Application entry point & curriculum launcher
├── requirements.txt                # Lightweight dependencies (streamlit, numpy, matplotlib, seaborn, scikit-learn, pytest)
├── components/                     # Reusable UI & visualization components
│   ├── ui_theme.py                 # Academic CSS design system, equation cards, badges
│   ├── attention_visualizer.py     # Attention heatmaps, token attention bars, matrix plots
│   ├── state_visualizer.py         # State evolution heatmaps, delta bars, 2D PCA trajectories
│   ├── computation_tracker.py      # Structured computational proxy cards (tokens vs. updates)
│   └── bdh_bridge.py               # Interactive Hebbian synaptic working memory simulator
├── models/                         # Pure NumPy computational engine (no framework black-boxes)
│   ├── tasks.py                    # Deterministic modular arithmetic task generator (Levels 1–4)
│   ├── transformer_demo.py         # Educational single-head, single-layer Transformer with LayerNorm
│   ├── explicit_reasoning.py       # Mode A: Symbolic step-by-step solver emitting tokens
│   └── latent_reasoning.py         # Mode B: Recurrent latent state model trained via pure NumPy BPTT
├── pages/                          # Multi-page interactive Streamlit UI
│   ├── 01_Transformer_Foundations.py
│   ├── 02_Attention_Laboratory.py
│   ├── 03_Explicit_vs_Latent.py
│   ├── 04_Latent_Reasoning_Lab.py
│   ├── 05_BDH_Case_Study.py
│   └── 06_Assessment.py
├── experiments/
│   └── pretrain.py                 # Pure NumPy BPTT training script
├── data/generated/
│   └── pretrained_weights.npz      # Trained weights for latent model (state_dim=48, hidden_dim=96)
├── tests/                          # 50 comprehensive unit tests (100% pass rate)
│   ├── test_explicit_model.py
│   ├── test_extended_capabilities.py
│   ├── test_latent_model.py
│   ├── test_tasks.py
│   └── test_transformer.py
└── docs/
    └── sources.md                  # Strict evidence provenance catalog (🟢/🔵/🟡/⚪)
```

---

## 📐 Mathematical Formulation

### 1. Transformer Self-Attention (`models/transformer_demo.py`)
- Input Projection: $Q = H_0 W_Q, \quad K = H_0 W_K, \quad V = H_0 W_V$
- Attention Scores: $S = \frac{QK^T}{\sqrt{d_k}}$
- Softmax Weights: $A_{ij} = \frac{\exp(S_{ij} - \max_m S_{im})}{\sum_k \exp(S_{ik} - \max_m S_{im})}$
- Output & LayerNorm: $\text{Out} = (A \cdot V) W_O, \quad \text{LN}(z) = \frac{z - \mu}{\sqrt{\sigma^2 + \epsilon}}$

### 2. Educational Latent Reasoning Model (`models/latent_reasoning.py`)
- **Initial Encoding:**
  $$s_0 = \text{ReLU}(W_{\text{enc}} x + b_{\text{enc}}) \in \mathbb{R}^{48}$$
- **Recurrent State Update ($R$ rounds with shared parameters):**
  $$s_{t+1} = s_t + \alpha \cdot W_2 \tanh(W_1 s_t + b_1)$$
- **Output Readout Head:**
  $$\hat{y} = \arg\max_{k \in \{0 \dots n-1\}} \text{softmax}(W_{\text{out}} s_R + b_{\text{out}})_k$$

### 3. BDH Hebbian Synaptic Dynamics (`components/bdh_bridge.py`)
- **Continuous Plasticity Equation:** $\frac{d\sigma_{ij}}{dt} = \eta Y_i X_j - \lambda \sigma_{ij}$
- **Discrete Matrix Memory Update:**
  $$S_t = \lambda \cdot S_{t-1} + K_t^T \cdot V_t, \quad O_t = Q_t \cdot S_t$$

---

## 🚀 How to Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/HARSHALBR/Pathway.git
cd Pathway

# 2. Install lightweight dependencies
pip install -r requirements.txt

# 3. Run unit test suite (50 tests)
pytest

# 4. Launch interactive Streamlit application
streamlit run main.py
```

---

## 🏷️ Evidence & Provenance Schema

All text, claims, and figures across the application follow strict labeling:
- 🟢 **LIVE COMPUTATION:** Evaluated on the fly by pure NumPy code in this repository.
- 🟡 **TOY MODEL / ILLUSTRATIVE:** Educational baseline model or simplified conceptual diagram.
- 🔵 **PUBLISHED RESULT:** Reported in peer-reviewed or preprint research papers (not reproduced live).
- ⚪ **PRIMARY SOURCE:** Citations and equations transcribed directly from primary papers.
- ⚠️ **FAILURE / LIMITATION:** Empirical boundary or failure mode of the approach.

---

## 🔬 Scientific Honesty & Limitations

- **Toy Model Boundary:** The recurrent latent model in Chapter 04 is an educational MLP baseline, **NOT the official BDH architecture**. BDH uses dynamic synaptic state matrices ($S_t \in \mathbb{R}^{d \times d}$) and BDH-CQ uses Context-Query continuous latent iterations ($z^{(r)}$).
- **Mode A Baseline:** Mode A is a deterministic symbolic solver illustrating token serialization, not a multibillion-parameter LLM.
- **Where Latent Reasoning Fails:** In Chapter 04, testing on unseen prime moduli (13, 17, 19, 23) or high compositional depth (Levels 3 & 4) causes latent accuracy to drop, demonstrating that iterative state updates without structured working memory have distinct limits.

---

## 📜 Primary Sources & Citations

1. **BDH (The Dragon Hatchling):** Kosowski, Uznański, Chorowski, Stamirowska, Bartoszkiewicz (Pathway, September 2025). [arXiv:2509.26507](https://arxiv.org/abs/2509.26507).
2. **BDH-CQ (Recurrent Latent Reasoning):** Engdahl, Kosowski, Chorowski (Pathway, Bielik AI, NYU, August 2026). [arXiv:2608.09888](https://arxiv.org/abs/2608.09888).
3. **Attention Is All You Need:** Vaswani et al. (NeurIPS 2017).
4. **Chain-of-Thought Prompting:** Wei et al. (NeurIPS 2022).
5. **COCONUT (Continuous Latent Space Reasoning):** Hao et al. (Meta AI, COLM 2025).

---

## 🤖 AI-Assisted Development Disclosure

AI coding assistants were used in the development of this project for implementation assistance, refactoring, documentation structuring, and test writing. All mathematical formulations and claims were verified against primary sources.

---

## 📄 License

MIT License. See [LICENSE](LICENSE).
