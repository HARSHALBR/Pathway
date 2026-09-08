# Project Architecture: Latent Reasoning Laboratory

## 1. Application Architecture

The application follows a strict decoupled architecture separating the **computational engine** (Pure NumPy, mathematically transparent) from the **interactive UI** (Streamlit).

### Core Principles
- **No Black Boxes:** All matrices, vectors, and weights must be extractable and visualizable.
- **Stateless Computation, Stateful UI:** The models are stateless mathematical functions. Streamlit's `st.session_state` manages the learner's interactive session.
- **Reactive Recomputation:** UI controls (sliders, dropdowns) directly trigger model forward passes in real-time.

## 2. Directory Structure

```text
pathway/
├── main.py                          # Page 1: Landing / Motivation
├── pages/
│   ├── 02_Tokens_and_Embeddings.py  # Micro-experiments: Token ID, Vector, Dimension
│   ├── 03_Attention_Mechanics.py    # Micro-experiments: Position, Q/K/V matching
│   ├── 04_Explicit_vs_Latent.py     # Micro-experiments: Serialize vs Internal State
│   ├── 05_Reasoning_Rounds.py       # Micro-experiments: R slider, failure modes
│   ├── 06_State_Visualization.py    # Micro-experiments: Trajectory, Heatmaps
│   ├── 07_BDH_Case_Study.py         # Academic connection (BDH & BDH-CQ)
│   └── 08_Learning_Test.py          # Assessment
├── engine/
│   ├── __init__.py
│   ├── tasks.py                     # Synthetic deterministic ground-truth generator
│   ├── transformer_micro.py         # Highly mutable toy transformer
│   ├── explicit_solver.py           # Rule-based CoT token generator
│   └── latent_model.py              # Recurrent state BPTT model
├── components/
│   ├── __init__.py
│   ├── micro_interactions.py        # Streamlit helper blocks (DO -> SEE widgets)
│   └── visualizers.py               # Matplotlib/Seaborn rendering
└── docs/
    └── sources.md                   # Strict evidence labeling guidelines
```

## 3. Data Flow (DO → SEE → UNDERSTAND)

1. **User Interaction (DO):** Learner interacts with a widget.
2. **State Update:** `st.session_state` captures the new parameter.
3. **Reactive Recompute:** UI layer calls the `engine` module.
4. **Data Extraction:** Engine returns raw mathematical artifacts.
5. **Visualization (SEE):** Render the array as an annotated matrix.
6. **Contextual Text (UNDERSTAND/EXPLAIN):** Streamlit explains the transformation.
