import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import streamlit as st
import matplotlib.pyplot as plt
from models.transformer_demo import TinyTransformer
from components.ui_theme import inject_custom_css, render_header, render_badge, render_equation_card
from components.attention_visualizer import plot_matrix

st.set_page_config(page_title="01 Transformer Foundations", page_icon="🧬", layout="wide")
inject_custom_css()

render_header(
    title="Chapter 01: Transformer Foundations",
    subtitle="Deconstructing raw natural language into numerical tokens, dense embeddings, and positional matrices.",
    badge=render_badge("live") + render_badge("toy")
)

st.markdown("""
Before contrasting explicit and latent reasoning, we must look inside the computational engine of modern language models:
**The Transformer**. Language models cannot directly process text; every word must undergo a multi-stage transformation into numbers.
""")

# Setup model
@st.cache_resource
def load_transformer():
    return TinyTransformer(d_model=4, seed=42)

model = load_transformer()

st.markdown("### 1. Interactive Tokenization & Embedding Experiment")
st.markdown("Select a sample sentence or type your own using our educational vocabulary:")

col_in1, col_in2 = st.columns([2, 1])
with col_in1:
    preset = st.selectbox(
        "Example Sequences",
        ["the cat sleeps", "the dog runs", "the cat chased the mouse", "a big bird sits on mat"]
    )
with col_in2:
    sentence = st.text_input("Active Sentence", value=preset)

# Run live computation
out = model.forward(sentence)
tokens = out['tokens']
token_ids = out['token_ids']
L = len(tokens)

st.markdown("#### Click a Token to Inspect its Internal Representation:")
selected_idx = st.radio(
    "Select Token:",
    range(L),
    format_func=lambda i: f"Token #{i+1}: [{tokens[i]}] (ID: {token_ids[i]})",
    horizontal=True
)

sel_token = tokens[selected_idx]
sel_id = token_ids[selected_idx]
sel_vec = out['X'][selected_idx]
sel_pos = out['P'][selected_idx]
sel_h0 = out['H0'][selected_idx]

col_tok1, col_tok2, col_tok3 = st.columns(3)

with col_tok1:
    st.markdown(f"""
    <div class="lab-card" style="border-left: 4px solid #3b82f6;">
        <span class="badge badge-live">Live Vector</span>
        <h4 style="margin: 0.35rem 0 0.2rem 0;">Token: "{sel_token}"</h4>
        <p style="color: #64748b; font-size: 0.88rem; margin-bottom: 0.5rem;">Vocabulary Index ID: <code>{sel_id}</code></p>
        <strong>Embedding Vector (X):</strong>
        <pre style="background: #f1f5f9; padding: 0.5rem; border-radius: 4px; font-size: 0.85rem;">[{", ".join([f"{v:+.3f}" for v in sel_vec])}]</pre>
        <span style="font-size: 0.8rem; color: #475569;">Embedding Dimension d = 4</span>
    </div>
    """, unsafe_allow_html=True)

with col_tok2:
    st.markdown(f"""
    <div class="lab-card" style="border-left: 4px solid #8b5cf6;">
        <span class="badge badge-live">Live Vector</span>
        <h4 style="margin: 0.35rem 0 0.2rem 0;">Position: #{selected_idx + 1}</h4>
        <p style="color: #64748b; font-size: 0.88rem; margin-bottom: 0.5rem;">Index in Sequence (0 to {L-1})</p>
        <strong>Positional Vector (P):</strong>
        <pre style="background: #f1f5f9; padding: 0.5rem; border-radius: 4px; font-size: 0.85rem;">[{", ".join([f"{v:+.3f}" for v in sel_pos])}]</pre>
        <span style="font-size: 0.8rem; color: #475569;">Injected sequence order vector</span>
    </div>
    """, unsafe_allow_html=True)

with col_tok3:
    st.markdown(f"""
    <div class="lab-card" style="border-left: 4px solid #10b981;">
        <span class="badge badge-live">Live Vector</span>
        <h4 style="margin: 0.35rem 0 0.2rem 0;">Input Representation (H₀)</h4>
        <p style="color: #64748b; font-size: 0.88rem; margin-bottom: 0.5rem;">Sum: H₀ = X + P</p>
        <strong>Initial Hidden State:</strong>
        <pre style="background: #f1f5f9; padding: 0.5rem; border-radius: 4px; font-size: 0.85rem;">[{", ".join([f"{v:+.3f}" for v in sel_h0])}]</pre>
        <span style="font-size: 0.8rem; color: #475569;">Fed into Self-Attention layers</span>
    </div>
    """, unsafe_allow_html=True)

st.markdown("---")

st.markdown("### 2. Full Sequence Matrix Deconstruction")
st.markdown("Observe the full sequence matrices $X, P, H_0 \\in \\mathbb{R}^{L \\times d}$ computed live:")

render_equation_card(
    title="Positional Embedding Addition",
    latex_eq=r"H_0 = X + P \quad \text{where } X, P \in \mathbb{R}^{L \times d}",
    plain_english="The Transformer has no intrinsic sense of sequence order. The learned positional vector P is added element-wise to the semantic token embedding X so the network knows where each word appears.",
    numbers_example=f"For '{sel_token}': [{', '.join([f'{v:+.2f}' for v in sel_vec])}] + [{', '.join([f'{v:+.2f}' for v in sel_pos])}] = [{', '.join([f'{v:+.2f}' for v in sel_h0])}]"
)

tab_m1, tab_m2, tab_m3 = st.tabs(["Combined Input Matrix (H₀)", "Token Embeddings Matrix (X)", "Positional Encodings (P)"])

with tab_m1:
    st.caption("🟢 LIVE COMPUTATION — Each row represents a token's complete initial representation fed into attention.")
    fig_h0 = plot_matrix(out['H0'], title="Input Matrix H₀ = X + P", row_labels=[f"{t} (#{i})" for i, t in enumerate(tokens)])
    st.pyplot(fig_h0)
    plt.close(fig_h0)

with tab_m2:
    st.caption("🟢 LIVE COMPUTATION — Pure semantic embeddings extracted from embedding table E.")
    fig_x = plot_matrix(out['X'], title="Embedding Matrix X", row_labels=tokens)
    st.pyplot(fig_x)
    plt.close(fig_x)

with tab_m3:
    st.caption("🟢 LIVE COMPUTATION — Positional encodings indexed by sequence position.")
    fig_p = plot_matrix(out['P'], title="Positional Matrix P", row_labels=[f"Pos {i}" for i in range(L)])
    st.pyplot(fig_p)
    plt.close(fig_p)

st.markdown("---")
st.markdown(r"""
<div class="lab-card" style="background: #f8fafc; border-left: 4px solid #3b82f6;">
    <h4 style="margin-top: 0; color: #1e3a8a;">Core Takeaway: Vocabulary Size ($V$) vs. Embedding Dimension ($d$)</h4>
    <p style="font-size: 0.92rem; color: #334155; margin-bottom: 0.5rem;">
        These are two fundamentally different concepts in Transformer architecture:
    </p>
    <ul style="font-size: 0.9rem; color: #334155; margin-bottom: 0.75rem;">
        <li><strong>Vocabulary Size ($V = 24$):</strong> The total number of distinct words recognized by the model dictionary.</li>
        <li><strong>Embedding Dimension ($d = 4$):</strong> The number of continuous numerical features used to represent each word ($E \in \mathbb{R}^{V \times d}$).</li>
    </ul>
    <p style="font-size: 0.88rem; color: #64748b; margin-bottom: 0;">
        💡 <em>Note:</em> We deliberately use $d=4$ so every matrix and activation is fully inspectable on screen. In production frontier LLMs, $V$ is typically 32,000 to 128,000 and $d$ is 4,096 or 8,192.
    </p>
</div>
""", unsafe_allow_html=True)
