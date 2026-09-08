# Project Architecture: Latent Reasoning Laboratory

## 1. Application Architecture

The application follows a decoupled two-tier architecture separating the **computational engine** (Pure NumPy, mathematically transparent, stateless) from the **interactive UI** (Streamlit, session-state management, reactive rendering).

### Core Architectural Principles
- **No Black Boxes:** All matrices, vectors, weights, and intermediate activations are extractable and visualizable in pure NumPy.
- **Stateless Computation, Stateful UI:** The models in `models/` are stateless mathematical functions. Streamlit manages user parameters and session persistence.
- **Reactive Recomputation:** UI controls (sliders, selectboxes, text inputs) directly trigger model forward passes in real-time without stale caching gates.
- **Educational Provenance:** Every claim and visualization is labeled with strict scientific evidence badges (🟢 LIVE COMPUTATION, 🟡 TOY MODEL, 🔵 PUBLISHED RESULT, ⚪ PRIMARY SOURCE).

---

## 2. Final Directory Structure

```text
IITKGP_V2/
├── main.py                         # Application landing page & curriculum launcher
├── requirements.txt                # Python package dependencies
├── components/                     # Reusable UI & visualization components
│   ├── ui_theme.py                 # Academic CSS design system, equation cards, badges
│   ├── attention_visualizer.py     # Attention heatmaps, token attention bars, matrix plots
│   ├── state_visualizer.py         # State evolution heatmaps, delta bars, 2D PCA trajectories
│   ├── computation_tracker.py      # Structured computational proxy cards (tokens vs. updates)
│   └── bdh_bridge.py               # Interactive Hebbian synaptic working memory simulator
├── models/                         # Pure NumPy computational engine
│   ├── tasks.py                    # Deterministic modular arithmetic task generator (Levels 1–4)
│   ├── transformer_demo.py         # Educational single-head, single-layer Transformer with LayerNorm
│   ├── explicit_reasoning.py       # Mode A: Symbolic step-by-step solver emitting tokens
│   └── latent_reasoning.py         # Mode B: Recurrent latent state model trained via pure NumPy BPTT
├── pages/                          # Multi-page interactive Streamlit UI
│   ├── 01_Transformer_Foundations.py # Token IDs, embeddings, positional encoding, representation
│   ├── 02_Attention_Laboratory.py    # Query-Key dot products, softmax weights, Value aggregation
│   ├── 03_Explicit_vs_Latent.py      # Side-by-side comparison of Mode A vs Mode B pathways
│   ├── 04_Latent_Reasoning_Lab.py    # Reactive R rounds, state trajectories, PCA, R-sweep, limitations
│   ├── 05_BDH_Case_Study.py          # Pathway's BDH & BDH-CQ research frontier & Hebbian simulator
│   └── 06_Assessment.py              # 60-second diagnostic knowledge check with instant feedback
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
    └── sources.md                  # Evidence provenance catalog (🟢/🔵/🟡/⚪)
```

---

## 3. Data Flow (DO → SEE → UNDERSTAND → EXPLAIN)

```
[1. User Interaction (DO)]
       │
       ▼
[2. Parameter Capture in Streamlit]
       │
       ▼
[3. Reactive Model Execution in models/]
       ├── TinyTransformer.forward()
       ├── ExplicitSolver.solve()
       └── LatentReasoningModel.forward()
       │
       ▼
[4. Raw Matrix & Trajectory Extraction]
       ├── Attention weights, Q, K, V, Residuals, LayerNorm
       ├── Intermediate string tokens
       └── Latent states [S₀, S₁, ..., S_R], deltas ||ΔS||₂
       │
       ▼
[5. Dynamic Visualization in components/ (SEE)]
       ├── plot_attention_heatmap() & plot_token_attention_bars()
       ├── plot_state_heatmap() & plot_pca_trajectory()
       └── render_computation_comparison()
       │
       ▼
[6. Contextual Explanation & Provenance Badges (UNDERSTAND / EXPLAIN)]
       ├── Equation cards with plain-English meaning & numerical instance
       └── Explicit disclaimers on toy models vs. published architectures
```
