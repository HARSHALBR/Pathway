import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import streamlit as st
from components.ui_theme import inject_custom_css, render_header, render_badge

st.set_page_config(
    page_title="Latent Reasoning Laboratory",
    page_icon="🧪",
    layout="wide",
    initial_sidebar_state="expanded"
)

inject_custom_css()

render_header(
    title="🧪 Latent Reasoning Laboratory",
    subtitle="An interactive computational laboratory exploring alternatives to Chain-of-Thought reasoning.",
    badge=render_badge("toy") + render_badge("live")
)

st.markdown("""
<div class="lab-card" style="border-left: 5px solid #2563eb; margin-bottom: 1.5rem;">
    <h3 style="margin-top: 0; color: #0f172a; font-size: 1.25rem;">The Central Question</h3>
    <p style="font-size: 1.15rem; color: #1e293b; font-style: italic; margin-bottom: 0;">
        "Can a model perform useful multi-step reasoning by refining its internal state, 
        instead of emitting every intermediate reasoning step as natural-language tokens?"
    </p>
</div>
""", unsafe_allow_html=True)

col_exp, col_lat = st.columns(2)

with col_exp:
    st.markdown("""
    <div class="lab-card" style="border-top: 4px solid #f59e0b;">
        <h4 style="color: #b45309;">Mode A: Explicit Reasoning (Chain-of-Thought)</h4>
        <p style="font-size: 0.92rem; color: #64748b;">
            Current LLMs solve complex problems by emitting serialized intermediate natural language tokens.
        </p>
        <div class="flow-container">
            <div class="flow-node flow-node-token"><strong>Input:</strong> "7 + 3 × 5 mod 11"</div>
            <div class="flow-arrow">↓ emits token</div>
            <div class="flow-node flow-node-token"><strong>Step 1:</strong> "3 × 5 = 15"</div>
            <div class="flow-arrow">↓ emits token</div>
            <div class="flow-node flow-node-token"><strong>Step 2:</strong> "7 + 15 = 22"</div>
            <div class="flow-arrow">↓ emits token</div>
            <div class="flow-node flow-node-token"><strong>Step 3:</strong> "22 mod 11 = 0"</div>
            <div class="flow-arrow">↓ emits token</div>
            <div class="flow-node flow-node-token" style="background: #fef3c7;"><strong>Output:</strong> "Answer: 0"</div>
        </div>
        <p style="font-size: 0.82rem; color: #78350f; margin-top: 0.5rem;">
            ⚠️ <em>Drawback:</em> Linear latency penalty, quadratic KV-cache growth, error cascade.
        </p>
    </div>
    """, unsafe_allow_html=True)

with col_lat:
    st.markdown("""
    <div class="lab-card" style="border-top: 4px solid #10b981;">
        <h4 style="color: #047857;">Mode B: Latent State Reasoning (e.g., BDH / BDH-CQ)</h4>
        <p style="font-size: 0.92rem; color: #64748b;">
            Alternative architectures keep reasoning inside continuous internal vectors over recurrence rounds.
        </p>
        <div class="flow-container">
            <div class="flow-node flow-node-state"><strong>Input:</strong> "7 + 3 × 5 mod 11" (Encoded x)</div>
            <div class="flow-arrow">↓ initial state</div>
            <div class="flow-node flow-node-state"><strong>State S₀:</strong> Raw task representation</div>
            <div class="flow-arrow">↓ internal update (round 1)</div>
            <div class="flow-node flow-node-state"><strong>State S₁:</strong> Multiplicative binding</div>
            <div class="flow-arrow">↓ internal update (round 2)</div>
            <div class="flow-node flow-node-state"><strong>State S₂:</strong> Additive & modulo refinement</div>
            <div class="flow-arrow">↓ readout head</div>
            <div class="flow-node flow-node-state" style="background: #d1fae5;"><strong>Output:</strong> Argmax class = 0</div>
        </div>
        <p style="font-size: 0.82rem; color: #064e3b; margin-top: 0.5rem;">
            ✨ <em>Benefit:</em> Zero context token expansion, constant working memory, fast execution.
        </p>
    </div>
    """, unsafe_allow_html=True)

st.markdown("### 🗺️ Guided Learning Curriculum")
st.markdown("""
This laboratory follows a strict **DO → SEE → UNDERSTAND → EXPLAIN** educational progression. 
You will manipulate real computational matrices, observe live consequences, and connect toy models to modern research.
""")

col_p1, col_p2, col_p3 = st.columns(3)
with col_p1:
    st.markdown("""
    <div class="lab-card">
        <strong>01 — Transformer Foundations</strong><br>
        <span style="font-size: 0.88rem; color: #64748b;">Deconstruct token IDs, continuous embeddings, and positional encoding vectors.</span>
    </div>
    <div class="lab-card">
        <strong>02 — Attention Laboratory</strong><br>
        <span style="font-size: 0.88rem; color: #64748b;">Operate live Query-Key dot products, scaling, softmax weights, and Value aggregation.</span>
    </div>
    """, unsafe_allow_html=True)

with col_p2:
    st.markdown("""
    <div class="lab-card">
        <strong>03 — Explicit vs Latent</strong><br>
        <span style="font-size: 0.88rem; color: #64748b;">Compare serialized token generation side-by-side with continuous state transitions.</span>
    </div>
    <div class="lab-card">
        <strong>04 — Latent Reasoning Lab</strong><br>
        <span style="font-size: 0.88rem; color: #64748b;">The core experiment: adjust recurrence depth (R), inspect state trajectories and failure modes.</span>
    </div>
    """, unsafe_allow_html=True)

with col_p3:
    st.markdown("""
    <div class="lab-card">
        <strong>05 — BDH & BDH-CQ</strong><br>
        <span style="font-size: 0.88rem; color: #64748b;">Explore Pathway's Hebbian synaptic fast-weights and recurrent context-query reasoning.</span>
    </div>
    <div class="lab-card">
        <strong>06 — 60-Second Challenge</strong><br>
        <span style="font-size: 0.88rem; color: #64748b;">Validate your conceptual mastery through a 6-question diagnostic test with instant feedback.</span>
    </div>
    """, unsafe_allow_html=True)

st.markdown("---")
c_cta1, c_cta2 = st.columns([1, 4])
with c_cta1:
    st.markdown("👉 **Get Started:**")
with c_cta2:
    st.markdown("*Select **01 Transformer Foundations** in the sidebar to begin.*")
