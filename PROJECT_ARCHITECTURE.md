# Project Architecture: Latent Reasoning Laboratory

## 1. Application Architecture

The application follows a decoupled modern architecture separating the **computational engine** (Pure NumPy, mathematically transparent, stateless) from the **REST API layer** (FastAPI) and the **interactive UI** (React 19 + Vite 6 + TypeScript + Tailwind CSS).

### Core Architectural Principles
- **No Black Boxes:** All matrices, vectors, weights, and intermediate activations are extractable and visualizable in pure NumPy.
- **Python Single Source of Truth:** Mathematical calculations are executed in Python. No neural network mathematics are duplicated in JavaScript.
- **Stateless Computation, Reactive UI:** The models in `models/` are stateless mathematical functions. React manages interactive UI state and visual transitions.
- **Zero Database / No MongoDB:** Lightweight, stateless REST API requiring zero database setup.
- **Educational Provenance:** Every claim and visualization is labeled with strict scientific evidence badges (🟢 LIVE COMPUTATION, 🟡 TOY MODEL, 🔵 PUBLISHED RESULT, ⚪ PRIMARY SOURCE, ⚠️ LIMITATION).

---

## 2. Final Directory Structure

```text
IITKGP_V2/
├── start.sh                        # Unified launcher for FastAPI backend and React frontend
├── api/
│   └── server.py                   # FastAPI REST server exposing pure NumPy endpoints
├── frontend/                       # Modern React + Vite + TypeScript frontend
│   ├── package.json
│   ├── vite.config.ts              # Vite config with proxy to FastAPI on port 8000
│   ├── src/
│   │   ├── types/api.ts            # Strongly typed TypeScript API response schemas
│   │   ├── services/api.ts         # Typed API client for live computation
│   │   ├── components/
│   │   │   ├── common/             # EvidenceBadge, EquationCard
│   │   │   └── layout/             # Persistent Navbar with chapter pipeline
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx     # Overview, hero, Mode A vs Mode B contrast
│   │   │   ├── Chapter01Foundations.tsx # Token IDs, embeddings X ∈ ℝ⁴, positional P, H₀
│   │   │   ├── Chapter02AttentionLab.tsx# Q vs K dot-products, scaled scores, softmax, heatmap
│   │   │   ├── Chapter03ExplicitVsLatent.tsx # Side-by-side pathways, toy computation proxy
│   │   │   ├── Chapter04LatentLab.tsx   # Reactive R slider, state matrix, delta bars, 2D PCA
│   │   │   ├── Chapter05BDHCaseStudy.tsx# 4x4 Hebbian memory simulator, λ retention, research papers
│   │   │   └── Chapter06Challenge.tsx   # 8-question diagnostic assessment with instant feedback
│   │   └── App.tsx                 # Root coordinator component
├── models/                         # Pure NumPy computational engine (Single Source of Truth)
│   ├── tasks.py                    # Deterministic modular arithmetic task generator (Levels 1–4)
│   ├── transformer_demo.py         # Educational single-head, single-layer Transformer with LayerNorm
│   ├── explicit_reasoning.py       # Mode A: Symbolic step-by-step solver emitting tokens
│   └── latent_reasoning.py         # Mode B: Recurrent latent state model trained via pure NumPy BPTT
├── main.py                         # Streamlit fallback / reference application entrypoint
├── pages/                          # Streamlit fallback / reference pages
├── components/                     # Python visualization components (Matplotlib/Seaborn)
├── experiments/                    # Pure NumPy BPTT training script
├── data/generated/                 # Pretrained weights (d=48, hidden_dim=96)
├── tests/                          # 50 comprehensive unit tests (100% pass rate)
└── docs/                           # Evidence provenance catalog (🟢/🔵/🟡/⚪)
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
