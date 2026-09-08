import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import streamlit as st
from components.ui_theme import inject_custom_css, render_header, render_badge, render_equation_card
from components.bdh_bridge import render_bdh_interactive_simulator

st.set_page_config(page_title="05 BDH & BDH-CQ", page_icon="🐉", layout="wide")
inject_custom_css()

render_header(
    title="Chapter 05: BDH & BDH-CQ Research Frontier",
    subtitle="Bridging toy latent models to Pathway's dynamic synaptic working memory and recurrent in-context architectures.",
    badge=render_badge("primary") + render_badge("published")
)

st.markdown(f"""
<div class="lab-card" style="border-left: 5px solid #2563eb; background: #f8fafc;">
    <span class="badge badge-primary">DISCLAIMER & SCOPE</span>
    <h4 style="margin: 0.3rem 0; color: #1e3a8a;">Educational Scope & Scientific Integrity</h4>
    <p style="font-size: 0.92rem; color: #334155; margin-bottom: 0;">
        The toy recurrent model in Chapter 04 is a simple educational MLP demonstrating iterative state updates. 
        <strong>It is NOT the official BDH or BDH-CQ architecture.</strong> 
        This chapter outlines the genuine architectural innovations published by Pathway researchers that connect 
        recurrent latent reasoning with brain-inspired synaptic plasticity.
    </p>
</div>
""", unsafe_allow_html=True)

st.markdown("### 1. What is BDH (Baby Dragon Hatchling)?")
st.markdown("""
- **Primary Paper:** *"The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain"*
- **Authors:** Adrian Kosowski, Przemysław Uznański, Jan Chorowski, Zuzanna Stamirowska, Michał Bartoszkiewicz
- **Affiliation:** **Pathway** (Research, September 2025) | [arXiv:2509.26507](https://arxiv.org/abs/2509.26507)
""")

render_equation_card(
    title="Hebbian Synaptic Working Memory Dynamics (Kosowski et al., 2025)",
    latex_eq=r"\frac{d\sigma_{ij}}{dt} = \eta \cdot Y_i \cdot X_j - \lambda \cdot \sigma_{ij} \implies S_t = \lambda \cdot S_{t-1} + K_t^T \cdot V_t, \quad O_t = Q_t \cdot S_t",
    plain_english="Instead of caching all past token keys and values in an ever-growing sequence cache, BDH maintains a fixed-size synaptic matrix S_t updated via outer products (Hebbian plasticity). Query Q_t retrieves associations directly from this dynamic synaptic memory.",
    numbers_example="Outer product of Key K_t and Value V_t forms an instantaneous associative matrix added into S_t."
)

# Interactive Hebbian simulator
st.markdown("### 2. Interactive Conceptual Bridge: Hebbian Synaptic Dynamics")
st.markdown("Operate the live 4×4 Hebbian synaptic update simulator below to see how associative working memory changes without emitting tokens:")

render_bdh_interactive_simulator()

st.markdown("---")

st.markdown("### 3. What is BDH-CQ?")
st.markdown("""
- **Primary Paper:** *"BDH-CQ: In-Context Learning with Recurrent Latent Reasoning"*
- **Authors:** Björn Engdahl, Adrian Kosowski, Jan Chorowski
- **Affiliations:** **Pathway**, Bielik AI, New York University (August 2026) | [arXiv:2608.09888](https://arxiv.org/abs/2608.09888)
""")

render_equation_card(
    title="Context-Query (CQ) Recurrent Latent Reasoning Formulation",
    latex_eq=r"z^{(0)} = f_{\text{init}}(x^*, M_K), \quad z^{(r)} = R\left(z^{(r-1)}, M_K, \psi(x^*)\right), \quad \hat{y}^* = \text{Decode}\left(z^{(R)}\right)",
    plain_english="BDH-CQ separates context memory (M_K) from query reasoning. It iterates a continuous latent vector z over R recurrence rounds in latent space without generating natural-language tokens, decoding only the final answer y*.",
    numbers_example="z^(0) -> z^(1) -> ... -> z^(R) all occur in continuous vector space; 0 intermediate tokens emitted."
)

st.markdown("#### Published Benchmark Results (arXiv:2608.09888)")
c_res1, c_res2, c_res3 = st.columns(3)
with c_res1:
    st.markdown(f"""
    <div class="lab-card" style="text-align: center;">
        <span class="badge badge-published">ARC-AGI-1 Benchmark</span>
        <div style="font-size: 1.8rem; font-weight: 800; color: #2563eb; margin: 0.3rem 0;">29.5%</div>
        <span style="font-size: 0.85rem; color: #64748b;">pass@2 accuracy</span>
    </div>
    """, unsafe_allow_html=True)

with c_res2:
    st.markdown(f"""
    <div class="lab-card" style="text-align: center;">
        <span class="badge badge-published">Parameter Scale</span>
        <div style="font-size: 1.8rem; font-weight: 800; color: #059669; margin: 0.3rem 0;">150M</div>
        <span style="font-size: 0.85rem; color: #64748b;">Compact model parameters</span>
    </div>
    """, unsafe_allow_html=True)

with c_res3:
    st.markdown(f"""
    <div class="lab-card" style="text-align: center;">
        <span class="badge badge-published">Inference Cost</span>
        <div style="font-size: 1.8rem; font-weight: 800; color: #d97706; margin: 0.3rem 0;">$0.0007</div>
        <span style="font-size: 0.85rem; color: #64748b;">Per task cost efficiency</span>
    </div>
    """, unsafe_allow_html=True)

st.caption("🔵 PUBLISHED RESULTS — Cited directly from Engdahl et al. (2026). Not reproduced in this educational repository.")

st.markdown("---")

st.markdown("### 4. Architectural Comparison")

st.markdown(r"""
| Architectural Dimension | Standard Transformer (CoT) | Our Educational Toy Model | Pathway BDH / BDH-CQ |
|---|---|---|---|
| **Intermediate Reasoning** | Emits textual tokens | Iterates continuous state $s_t$ | Recurrent latent state $z^{(r)}$ |
| **Working Memory** | Static KV-cache grows $O(L)$ | Single vector $s_t \in \mathbb{R}^{48}$ | Dynamic Synaptic Matrix $S_t \in \mathbb{R}^{d \times d}$ |
| **Attention Mechanism** | Token-to-token all-pairs | Feed-forward MLP recurrence | Synaptic fast weights + Context-Query |
| **Memory Retention** | Exact retention of all tokens | Residual addition ($s + \alpha \Delta$) | Exponential Hebbian decay ($\lambda \cdot S_{t-1}$) |
| **Interpretability** | Natural language CoT steps | Vector heatmaps & PCA projections | Abstract associative projections |
| **Computational Bottleneck** | Sequence length expansion | Parameter capacity & representation drift | Associative interference at extreme depth |
""")

st.caption("🟡 ILLUSTRATIVE COMPARISON — Educational conceptual synthesis of architectural paradigms.")

st.markdown("---")

st.markdown("""
<div class="lab-card" style="background: #f8fafc;">
    <strong>Ready for the Knowledge Check?</strong><br>
    Now that you have explored tokenization, self-attention, explicit vs latent reasoning pathways, 
    iterative recurrence depth, and BDH research concepts, test your understanding.
    <br><br>
    👉 <em>Take the final diagnostic in <strong>06 Challenge / 60-Second Test</strong>.</em>
</div>
""", unsafe_allow_html=True)
