import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import streamlit as st
import numpy as np
import matplotlib.pyplot as plt
from models.transformer_demo import TinyTransformer
from components.ui_theme import inject_custom_css, render_header, render_badge, render_equation_card
from components.attention_visualizer import plot_attention_heatmap, plot_token_attention_bars, plot_matrix

st.set_page_config(page_title="02 Attention Laboratory", page_icon="🔍", layout="wide")
inject_custom_css()

render_header(
    title="Chapter 02: Attention Laboratory",
    subtitle="Operating live Query-Key matching, score scaling, softmax probability weighting, and Value aggregation.",
    badge=render_badge("live") + render_badge("toy")
)

st.markdown("""
Self-attention is the core communication mechanism of Transformers. It allows each token to query all other tokens in the sequence 
and aggregate their information based on mathematical compatibility scores.
""")

@st.cache_resource
def load_transformer():
    return TinyTransformer(d_model=4, seed=42)

model = load_transformer()

# Sequence selection
col_seq1, col_seq2 = st.columns([2, 1])
with col_seq1:
    sentence = st.selectbox(
        "Interactive Sequence",
        ["the cat chased the mouse", "the cat sleeps on mat", "a big dog runs fast"]
    )
with col_seq2:
    st.markdown("<div style='height: 28px;'></div>", unsafe_allow_html=True)
    st.caption("Each word is projected into Query, Key, and Value spaces ($d_k=4$).")

# Forward pass
out = model.forward(sentence)
tokens = out['tokens']
L = len(tokens)

st.markdown("### 1. Select a Query Token to Drive Attention")
st.markdown("Choose which token acts as the **Active Query ($Q$)** to see which **Keys ($K$)** it attends to:")

q_idx = st.radio(
    "Query Token:",
    range(L),
    format_func=lambda i: f"#{i+1}: [{tokens[i]}]",
    horizontal=True
)

breakdown = model.get_token_query_breakdown(sentence, q_idx)
active_token = breakdown['token']

st.markdown(f"""
<div class="lab-card" style="border-left: 5px solid #2563eb; background: #f8fafc;">
    <div style="font-size: 1.1rem; font-weight: 700; color: #1e3a8a;">
        Active Query: [{active_token}] (Token #{q_idx+1})
    </div>
    <div style="font-size: 0.92rem; color: #475569; margin-top: 0.25rem;">
        Comparing Query vector <code>Q_{q_idx+1}</code> against Key vectors <code>K₁ ... K_{L}</code> of all sequence tokens.
    </div>
</div>
""", unsafe_allow_html=True)

# Step by step execution cards
c_q, c_k, c_s, c_w = st.columns([1.1, 1.1, 1.2, 1.2])

with c_q:
    st.markdown(f"""
    <div class="lab-card">
        <strong>1. Query Vector (Q)</strong>
        <p style="font-size: 0.82rem; color: #64748b;">What [{active_token}] is looking for</p>
        <pre style="font-size: 0.78rem;">{np.array2string(breakdown['query_vector'], precision=2)}</pre>
    </div>
    """, unsafe_allow_html=True)

with c_k:
    st.markdown(f"""
    <div class="lab-card">
        <strong>2. Target Keys (K)</strong>
        <p style="font-size: 0.82rem; color: #64748b;">What all {L} tokens advertise</p>
        <pre style="font-size: 0.78rem;">{L} keys in ℝ⁴</pre>
    </div>
    """, unsafe_allow_html=True)

with c_s:
    st.markdown(f"""
    <div class="lab-card">
        <strong>3. Scaled Scores (S)</strong>
        <p style="font-size: 0.82rem; color: #64748b;">S = (Q · Kᵀ) / √4</p>
        <pre style="font-size: 0.78rem;">{np.array2string(breakdown['scaled_scores'], precision=2)}</pre>
    </div>
    """, unsafe_allow_html=True)

with c_w:
    st.markdown(f"""
    <div class="lab-card">
        <strong>4. Softmax Weights (A)</strong>
        <p style="font-size: 0.82rem; color: #64748b;">Sum = 1.0 (Probabilities)</p>
        <pre style="font-size: 0.78rem;">{np.array2string(breakdown['weights'], precision=2)}</pre>
    </div>
    """, unsafe_allow_html=True)

st.markdown("### 2. Live Attention Distribution")

col_v1, col_v2 = st.columns([1, 1])

with col_v1:
    st.markdown(f"#### Attention Paid by [{active_token}] across Sequence")
    fig_bars = plot_token_attention_bars(breakdown['weights'], tokens, active_token)
    st.pyplot(fig_bars)
    plt.close(fig_bars)

with col_v2:
    st.markdown("#### Complete Sequence Attention Matrix ($A \\in \\mathbb{R}^{L \\times L}$)")
    fig_heatmap = plot_attention_heatmap(out['attention_weights'], tokens)
    st.pyplot(fig_heatmap)
    plt.close(fig_heatmap)

st.markdown("### 3. Value Aggregation & Updated Representation")
st.markdown("""
Each token's new representation is formed by taking a **weighted sum of Value vectors ($V$)** according to the attention probabilities:
""")

render_equation_card(
    title="Value Vector Aggregation",
    latex_eq=r"\text{Attention Output}_i = \sum_{j=1}^L A_{ij} \cdot V_j = A_i \cdot V",
    plain_english=f"Token '{active_token}' pulls information from every token according to its computed attention weight, blending their Value vectors into a single contextual vector.",
    numbers_example=f"Accumulated Value Vector: [{', '.join([f'{v:+.3f}' for v in breakdown['accumulated_value']])}]"
)

# Full matrix inspector
with st.expander("🔬 Deep Dive: Inspect All Intermediate Weight & Projection Matrices"):
    st.markdown("🟢 **LIVE MATRICES COMPUTED FOR THIS SEQUENCE:**")
    m_col1, m_col2, m_col3 = st.columns(3)
    with m_col1:
        st.caption("Query Matrix Q = H₀ W_Q")
        fig_q = plot_matrix(out['Q'], title="Queries (Q)", row_labels=tokens)
        st.pyplot(fig_q)
        plt.close(fig_q)
    with m_col2:
        st.caption("Key Matrix K = H₀ W_K")
        fig_k = plot_matrix(out['K'], title="Keys (K)", row_labels=tokens)
        st.pyplot(fig_k)
        plt.close(fig_k)
    with m_col3:
        st.caption("Value Matrix V = H₀ W_V")
        fig_v = plot_matrix(out['V'], title="Values (V)", row_labels=tokens)
        st.pyplot(fig_v)
        plt.close(fig_v)

    st.markdown("---")
    st.markdown("#### After Attention: Residual Connection & Layer Normalization")
    r_col1, r_col2 = st.columns(2)
    with r_col1:
        st.caption("Residual 1 = H₀ + (Attn · V) W_O")
        fig_res1 = plot_matrix(out['residual_1'], title="Residual 1", row_labels=tokens)
        st.pyplot(fig_res1)
        plt.close(fig_res1)
    with r_col2:
        st.caption("LayerNorm(Residual 1) — Zero-mean, unit-variance normalized activations")
        fig_ln1 = plot_matrix(out['ln_1'], title="LayerNorm 1", row_labels=tokens)
        st.pyplot(fig_ln1)
        plt.close(fig_ln1)

st.markdown("---")
st.markdown("""
<div class="lab-card" style="background: #f8fafc;">
    <strong>The Core Problem with CoT Reasoning in Attention:</strong><br>
    Notice that the attention matrix has size $L \\times L$. As reasoning generates more intermediate tokens (e.g., 500 reasoning steps), 
    the sequence length $L$ grows. The model must store all past keys and values (the <strong>KV-cache</strong>), which grows linearly in memory, 
    and computing attention over all past tokens scales quadratically ($O(L^2)$).
    <br><br>
    👉 <em>How does Latent Reasoning avoid this sequence expansion? Proceed to <strong>03 Explicit vs Latent</strong>.</em>
</div>
""", unsafe_allow_html=True)
