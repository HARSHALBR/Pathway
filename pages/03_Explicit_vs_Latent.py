import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import streamlit as st
from models.tasks import generate_task
from models.explicit_reasoning import ExplicitSolver
from models.latent_reasoning import LatentReasoningModel
from components.ui_theme import inject_custom_css, render_header, render_badge
from components.computation_tracker import render_computation_comparison

st.set_page_config(page_title="03 Explicit vs Latent", page_icon="⚖️", layout="wide")
inject_custom_css()

render_header(
    title="Chapter 03: Explicit vs. Latent Reasoning",
    subtitle="Contrasting serialized token generation (Chain-of-Thought) against internal continuous state transitions.",
    badge=render_badge("live") + render_badge("toy")
)

st.markdown("""
When a system solves a multi-step problem, where should the intermediate computation happen?

The essential conceptual distinction between Explicit Reasoning and Latent Reasoning is **WHERE the intermediate computation is represented**:
- **Explicit Reasoning (Mode A):** Intermediate thoughts are externalized and serialized as **visible text tokens** in the context window.
- **Latent Reasoning (Mode B):** Intermediate computation is internalized and performed inside a **continuous state vector** ($S_0 \\to S_1 \\to \\dots \\to S_R$) without emitting tokens.

It is not simply that "one has more steps" — it is a structural difference in how memory and state are maintained across computational steps.
""")

# Setup models
@st.cache_resource
def get_models():
    latent = LatentReasoningModel(state_dim=48, hidden_dim=96, max_classes=23, alpha=0.5, seed=42)
    weights_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'generated', 'pretrained_weights.npz')
    if os.path.exists(weights_path):
        try:
            latent.load_weights(weights_path)
        except Exception:
            pass
    explicit = ExplicitSolver()
    return explicit, latent

explicit_solver, latent_model = get_models()

st.sidebar.header("🧪 Task Configuration")
level = st.sidebar.slider("Arithmetic Level", 1, 4, 2, 
                          help="Level 1: a+b | Level 2: a+b*c | Level 3: a*b+c*d | Level 4: (a+b)*c+d")
modulus = st.sidebar.selectbox("Prime Modulus (n)", [7, 11, 13, 17, 19, 23], index=1)
seed = st.sidebar.number_input("Task Seed", value=42, step=1)

# Task generation is deterministic based on level, modulus, seed
task = generate_task(level=level, modulus=modulus, seed=seed)

st.markdown(f"""
<div class="lab-card" style="border-left: 5px solid #2563eb; background: #ffffff;">
    <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
            <span class="badge badge-live">Deterministic Task</span>
            <h3 style="margin: 0.3rem 0; color: #0f172a; font-family: 'JetBrains Mono', monospace;">
                {task.expression}
            </h3>
            <span style="font-size: 0.9rem; color: #475569;">Modulus: <strong>{task.modulus}</strong> | Ground Truth: <strong>{task.ground_truth}</strong></span>
        </div>
        <div style="text-align: right;">
            <span style="font-size: 0.85rem; color: #64748b;">Difficulty Level</span>
            <div style="font-size: 1.25rem; font-weight: 700; color: #2563eb;">Level {task.level}</div>
        </div>
    </div>
</div>
""", unsafe_allow_html=True)

# Compute both pathways live
explicit_res = explicit_solver.solve(task)
latent_res = latent_model.forward(task.encoded_input, R=explicit_res['token_count'] - 1, modulus=task.modulus)

st.markdown("### The Two Computational Pathways")

col_mode_a, col_mode_b = st.columns(2)

with col_mode_a:
    st.markdown("""
    <div style="padding: 0.75rem 1rem; background: #fffaf0; border-radius: 8px 8px 0 0; border: 1px solid #fed7aa; border-bottom: none;">
        <span class="badge badge-toy">Mode A</span>
        <strong style="color: #9a3412; font-size: 1.05rem;">Explicit Reasoning (Chain-of-Thought)</strong>
        <div style="font-size: 0.85rem; color: #7c2d12;">Emits serialized intermediate text tokens into the sequence context.</div>
    </div>
    """, unsafe_allow_html=True)
    
    flow_a = '<div class="flow-container" style="border-radius: 0 0 8px 8px; border-top: none;">'
    flow_a += f'<div class="flow-node flow-node-token"><strong>Input:</strong> <code>{task.expression}</code></div>'
    for i, token in enumerate(explicit_res['tokens'][:-1]):
        flow_a += f'<div class="flow-arrow">↓ emits token {i+1}</div>'
        flow_a += f'<div class="flow-node flow-node-token"><strong>Step {i+1}:</strong> <code>"{token}"</code></div>'
    flow_a += f'<div class="flow-arrow">↓ final answer token</div>'
    flow_a += f'<div class="flow-node flow-node-token" style="background: #fef3c7; border: 1px solid #f59e0b;"><strong>Prediction:</strong> {explicit_res["answer"]} (Ground Truth: {task.ground_truth})</div>'
    flow_a += '</div>'
    st.markdown(flow_a, unsafe_allow_html=True)
    
    st.markdown("""
    **Characteristics:**
    - Intermediate reasoning steps are human-readable strings.
    - Each step requires a full autoregressive forward pass.
    - KV-cache grows by 1 entry per token emitted.
    """)

with col_mode_b:
    st.markdown("""
    <div style="padding: 0.75rem 1rem; background: #f0fdf4; border-radius: 8px 8px 0 0; border: 1px solid #bbf7d0; border-bottom: none;">
        <span class="badge badge-toy">Mode B</span>
        <strong style="color: #166534; font-size: 1.05rem;">Latent State Reasoning</strong>
        <div style="font-size: 0.85rem; color: #14532d;">Refines continuous internal state vector without emitting tokens.</div>
    </div>
    """, unsafe_allow_html=True)
    
    flow_b = '<div class="flow-container" style="border-radius: 0 0 8px 8px; border-top: none;">'
    flow_b += f'<div class="flow-node flow-node-state"><strong>Input:</strong> <code>Encoded vector x ∈ ℝ⁶</code></div>'
    flow_b += f'<div class="flow-arrow">↓ encoder projection</div>'
    flow_b += f'<div class="flow-node flow-node-state"><strong>State S₀:</strong> Raw task embedding ∈ ℝ⁴⁸</div>'
    for r in range(1, len(latent_res['states'])):
        delta_norm = latent_res['state_deltas'][r-1]
        flow_b += f'<div class="flow-arrow">↓ recurrence round {r} (||ΔS||₂ = {delta_norm:.2f})</div>'
        flow_b += f'<div class="flow-node flow-node-state"><strong>State S_{r}:</strong> Iterative refinement</div>'
    flow_b += f'<div class="flow-arrow">↓ classification readout head</div>'
    is_correct = latent_res['prediction'] == task.ground_truth
    bg_color = "#dcfce7" if is_correct else "#fee2e2"
    border_color = "#22c55e" if is_correct else "#ef4444"
    icon = "✓" if is_correct else "✗"
    flow_b += f'<div class="flow-node flow-node-state" style="background: {bg_color}; border: 1px solid {border_color};"><strong>Prediction:</strong> {latent_res["prediction"]} {icon} (Ground Truth: {task.ground_truth})</div>'
    flow_b += '</div>'
    st.markdown(flow_b, unsafe_allow_html=True)
    
    st.markdown("""
    **Characteristics:**
    - Zero tokens emitted during reasoning.
    - Operates through continuous state transitions: $S_{t+1} = S_t + \\alpha W_2 \\tanh(W_1 S_t + b_1)$.
    - Working memory size remains fixed in $\\mathbb{R}^{48}$.
    """)

st.markdown("---")
render_computation_comparison(explicit_res['computation_proxy'], latent_res['computation_proxy'])

st.markdown("---")
st.markdown("""
<div class="lab-card" style="background: #f8fafc;">
    <strong>Crucial Question:</strong> What happens when we increase or decrease the number of reasoning rounds $R$? 
    Does more internal computation actually improve confidence and accuracy, and where does it fail?
    <br><br>
    👉 <em>Explore the live recurrence engine in <strong>04 Latent Reasoning Laboratory</strong>.</em>
</div>
""", unsafe_allow_html=True)
