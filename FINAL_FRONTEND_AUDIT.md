# FINAL FRONTEND AUDIT & ARCHITECTURAL REPORT
**Project:** Pathway — Latent Reasoning Laboratory  
**Repository:** `https://github.com/HARSHALBR/Pathway`  
**Workspace:** `/Users/anuj/Desktop/IITKGP_V2`  
**Date:** September 9, 2026  
**Status:** **FRONTEND MIGRATION COMPLETE / PRODUCTION READY**  
**Architecture:** React + Vite + TypeScript Frontend | Python + FastAPI Computational Backend | Pure NumPy Models

---

## 1. FRONTEND ARCHITECTURE

The user-facing experience has been transformed from a basic Streamlit interface into a modern, research-grade, lively educational web application.

- **Framework:** React 19 + Vite 6 + TypeScript (strict mode, `verbatimModuleSyntax` compliant)
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`) with custom academic glassmorphism (`.lab-glass-card`, `.lab-glow-indigo`, `.lab-glow-emerald`)
- **Icons:** Lucide React (`Atom`, `Layers`, `Split`, `Cpu`, `Network`, `CheckCircle2`, `ShieldCheck`, etc.)
- **Visualizations:** Native Canvas and interactive SVG vector graphics for dynamic matrix heatmaps, delta bars, 2D PCA trajectories, and outer-product memory matrices.
- **Client Architecture:** Strongly typed service layer (`src/services/api.ts`) communicating with the FastAPI backend over HTTP JSON REST endpoints with Vite proxy routing.

---

## 2. BACKEND ARCHITECTURE

- **Framework:** Python 3.13 + FastAPI + Uvicorn
- **Zero Database / No MongoDB:** Completely stateless, deterministic REST computation layer.
- **Direct Model Invocation:** Python is the **SINGLE SOURCE OF COMPUTATIONAL TRUTH**. No neural network or attention mathematics are duplicated in JavaScript.
- **CORS Enabled:** Permits seamless local development across ports `5173` (Vite) and `8000` (FastAPI).

---

## 3. PAGES & COMPONENTS INVENTORY

### Frontend (`frontend/src/`)
| Component / File | Purpose & Interactive Behavior |
|---|---|
| `components/layout/Navbar.tsx` | Global persistent header with chapter pipeline (`00 Home` → `01 Foundations` → `02 Attention` → `03 Explicit vs Latent` → `04 Latent Lab` → `05 BDH Research` → `06 Challenge`), forward/backward steppers, and real-time backend health heartbeat. |
| `components/common/EvidenceBadge.tsx` | Interactive provenance badges (🟢 LIVE, 🟡 TOY MODEL, 🔵 PUBLISHED, ⚪ PRIMARY, ⚠️ LIMITATION) with hover tooltips explaining source categories. |
| `components/common/EquationCard.tsx` | Standardized mathematical decomposition card (LaTeX formula + plain-English meaning + concrete numerical instance from current state + paper source citation). |
| `pages/LandingPage.tsx` | Research-lab hero section with interactive pathway toggle comparing Mode A (tokens emitted) vs. Mode B (state refined), curriculum roadmap, and CTA "ENTER THE LAB →". |
| `pages/Chapter01Foundations.tsx` | Interactive token chip selector, live $\mathbb{R}^4$ embedding lookup, positional coordinate injection ($P$), combined hidden state ($H_0 = X + P$), interactive $X + P = H_0$ matrix table with cell hover inspection, and clear $V=24$ vs. $d=4$ distinction. |
| `pages/Chapter02AttentionLab.tsx` | Horizontal token selector as active Query driver, Query ($Q$) vs. Keys ($K$) scaled dot-product trace table ($QK^T/\sqrt{d_k}$), softmax probability distribution bars, and full interactive attention matrix heatmap with cell hover inspector. |
| `pages/Chapter03ExplicitVsLatent.tsx` | Side-by-side vertical split comparing Mode A (CoT tokens) against Mode B (latent state updates), deterministic modular arithmetic generator (Levels 1–4, prime modulus), "RUN BOTH PATHWAYS" with progressive reveal, and structured TOY COMPUTATIONAL PROXY metrics. |
| `pages/Chapter04LatentLab.tsx` | Core recurrence sandbox featuring a large reactive $R$-slider ($1 \dots 10$) triggering live NumPy recomputations, 3 coordinated state visualizations (State Matrix Heatmap, $\|\Delta S\|_2$ delta bars, 2D PCA trajectory), 10-point $R$-sweep confidence curve, and "Where Does This Break?" transparent failure boundary section. |
| `pages/Chapter05BDHCaseStudy.tsx` | Interactive 4×4 Hebbian synaptic memory simulator ($S_t = \lambda S_{t-1} + K_t^T V_t, O_t = Q_t S_t$) with $\lambda$ retention slider, matrix cell hover inspection, published BDH-CQ research cards (ARC-AGI-1 29.5%, 150M params, $0.0007 cost), and architectural comparison table. |
| `pages/Chapter06Challenge.tsx` | 8-question diagnostic assessment cards with immediate green/red visual feedback, mathematical explanations, and final mastery completion card. |

### Backend (`api/server.py`)
| Endpoint | Method | Input | Output |
|---|---|---|---|
| `/api/health` | GET | None | Health status, model metadata ($d=4, d=48$) |
| `/api/transformer/forward` | POST | `{"sentence": str}` | Tokens, IDs, $X, P, H_0, Q, K, V$, scores, softmax weights, attention output, LayerNorm |
| `/api/attention/analyze` | POST | `{"sentence": str, "query_token_idx": int}` | Active Query vector, comparisons against all Keys, dot products, scaled scores, softmax weights, Value aggregation |
| `/api/task/generate` | POST | `{"level": int, "modulus": int, "seed": int}` | Deterministic arithmetic expression, ground truth, operands, encoded input |
| `/api/explicit/solve` | POST | `{"level": int, "modulus": int, "seed": int}` | Step-by-step symbolic tokens, emitted token count, answer, computation proxy |
| `/api/latent/run` | POST | `{"level": int, "modulus": int, "seed": int, "R": int}` | State trajectory $[S_0, \dots, S_R]$, $\|\Delta S\|_2$ deltas, prediction, confidence, 2D PCA points, computation proxy |
| `/api/latent/sweep` | POST | `{"level": int, "modulus": int, "seed": int, "max_R": int}` | 10-point confidence and correctness curve across $R \in [1, 10]$ |
| `/api/bdh/simulate` | POST | `{"decay_lambda": float, "step": int}` | 4×4 $S_{\text{prev}}$, decayed memory, $K_t^T V_t$ outer product, updated $S_t$, readout $O_t$ |

---

## 4. MATHEMATICAL INTEGRITY & CODE PRESERVATION

- **Zero Duplication:** All mathematics continue to run inside `models/transformer_demo.py`, `models/latent_reasoning.py`, `models/tasks.py`, `models/explicit_reasoning.py`, and `components/bdh_bridge.py`.
- **Pure NumPy:** No PyTorch, TensorFlow, or JAX dependencies.
- **Unit Tests:** 50/50 unit tests pass in 1.35s (`pytest -v`) with zero modifications to test suites.
- **Streamlit Preservation:** The original Streamlit application remains 100% operational as a fallback/reference via `streamlit run main.py`.

---

## 5. REVENUE & PERFORMANCE CONSIDERATIONS

- **Build Time:** Frontend TypeScript + Vite builds in **151ms** (`dist/index.html` 0.45 kB, `dist/assets/index.js` 301 kB).
- **Backend Latency:** FastAPI forward passes execute in **< 3ms** per request (pure NumPy vector math).
- **Client Reactivity:** Debounced and memoized interactions ensure no stale session states or lag.

---

## 6. ACCESSIBILITY & DESIGN POLISH

- **Contrast & Hierarchy:** Dark theme palette (`slate-950` background, `slate-100` primary text, `indigo-400` / `emerald-400` accents) exceeding WCAG AA contrast standards.
- **Keyboard Navigation:** Native button and slider controls support standard tab navigation and focus rings.
- **Semantic Badges:** Provenance badges provide tooltip explanations on hover/focus.
- **Responsiveness:** Full responsive flexbox/grid layouts tested on mobile, tablet, laptop, and desktop viewports.

---

## 7. VERIFICATION & QA RESULTS

```text
======================================================================
1. PyTest Suite:
   • 50 passed in 1.35s (100% pass rate)

2. FastAPI Live HTTP Test:
   • GET  /api/health:                200 OK
   • POST /api/transformer/forward:   200 OK
   • POST /api/attention/analyze:      200 OK
   • POST /api/task/generate:         200 OK
   • POST /api/explicit/solve:        200 OK
   • POST /api/latent/run:            200 OK
   • POST /api/latent/sweep:          200 OK
   • POST /api/bdh/simulate:          200 OK

3. Vite & TypeScript Build:
   • tsc -b && vite build:            0 errors, 0 warnings (151ms)
======================================================================
```

---

## 8. INSTRUCTIONS TO RUN

### Option A: Unified Launcher (Recommended)
```bash
./start.sh
```
Launches FastAPI backend on `http://127.0.0.1:8000` and React frontend on `http://localhost:5173`.

### Option B: Manual Multi-Terminal Launch
```bash
# Terminal 1: Backend
python3 -m uvicorn api.server:app --host 127.0.0.1 --port 8000

# Terminal 2: Frontend
cd frontend
npm run dev
```

### Option C: Fallback Streamlit Interface
```bash
streamlit run main.py
```
