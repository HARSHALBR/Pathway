import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import streamlit as st
import numpy as np
import matplotlib.pyplot as plt
from models.tasks import generate_task
from models.explicit_reasoning import ExplicitSolver
from models.latent_reasoning import LatentReasoningModel
from components.ui_theme import inject_custom_css, render_header, render_badge, render_equation_card
from components.state_visualizer import plot_state_heatmap, plot_state_deltas, plot_pca_trajectory
from components.computation_tracker import render_computation_comparison

st.set_page_config(page_title="04 Latent Reasoning Lab", page_icon="🧪", layout="wide")
inject_custom_css()

render_header(
    title="Chapter 04: Latent Reasoning Laboratory",
    subtitle="Interactive exploration of recurrent state refinement, trajectory geometry, and computational limits.",
    badge=render_badge("live") + render_badge("toy")
)

st.markdown("""
This is the core experimental sandbox. Here, you directly control the **reasoning rounds ($R$)**, problem difficulty, 
and modulus to observe how continuous internal representations evolve over time without generating text.
""")

# Load model with fixed validated educational configuration
@st.cache_resource
def load_latent_model():
    # Validated educational configuration: state_dim=48, hidden_dim=96 matching pretrained_weights.npz
    model = LatentReasoningModel(state_dim=48, hidden_dim=96, max_classes=23, alpha=0.5, seed=42)
    weights_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'generated', 'pretrained_weights.npz')
    if os.path.exists(weights_path):
        try:
            model.load_weights(weights_path)
        except Exception as e:
            st.warning(f"Could not load weights ({e}); using initialized weights.")
    return model

latent_model = load_latent_model()
explicit_solver = ExplicitSolver()

# Sidebar: Controls that REACTIVELY trigger recomputation
st.sidebar.markdown("### 🎛️ Experiment Controls")
level = st.sidebar.slider("Task Difficulty Level", 1, 4, 2,
                          help="Level 1: a+b | Level 2: a+b*c | Level 3: a*b+c*d | Level 4: (a+b)*c+d")
modulus = st.sidebar.selectbox("Modulus (n)", [7, 11, 13, 17, 19, 23], index=0,
                               help="Prime modulus. Note: Model was trained on moduli 7 and 11.")
rounds = st.sidebar.slider("Reasoning Rounds (R)", min_value=1, max_value=10, value=5,
                           help="Controls how many internal recurrence updates s_{t+1} = s_t + α W₂ tanh(W₁ s_t + b₁) are executed.")
seed = st.sidebar.number_input("Task Seed", value=42, step=1)

# Display fixed architecture note
st.sidebar.markdown("---")
st.sidebar.caption(f"**Model Architecture:** Fixed pure-NumPy recurrent model ($d={latent_model.state_dim}, d_h={latent_model.hidden_dim}$). Trained on Levels 1–2, Moduli 7 & 11 via BPTT.")

# LIVE REACTIVE COMPUTATION: No button gate!
task = generate_task(level=level, modulus=modulus, seed=seed)
explicit_res = explicit_solver.solve(task)
latent_res = latent_model.forward(task.encoded_input, R=rounds, modulus=task.modulus)

is_correct = (latent_res['prediction'] == task.ground_truth)
status_color = "#15803d" if is_correct else "#b91c1c"
status_bg = "#f0fdf4" if is_correct else "#fef2f2"
status_border = "#bbf7d0" if is_correct else "#fecaca"
status_icon = "✅ CORRECT" if is_correct else "❌ INCORRECT"

st.markdown(f"""
<div class="lab-card" style="border-left: 5px solid {status_color}; background: #ffffff; margin-bottom: 1.25rem;">
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
        <div>
            <span class="badge badge-live">Live Reactive Execution</span>
            <span class="badge badge-toy">R = {rounds} Rounds</span>
            <h3 style="margin: 0.35rem 0; font-family: 'JetBrains Mono', monospace;">
                {task.expression}
            </h3>
            <span style="font-size: 0.95rem; color: #475569;">Ground Truth: <strong>{task.ground_truth}</strong></span>
        </div>
        <div style="background: {status_bg}; border: 1px solid {status_border}; padding: 0.5rem 1rem; border-radius: 8px; text-align: center;">
            <div style="font-size: 0.8rem; color: {status_color}; font-weight: 600;">LATENT MODEL PREDICTION</div>
            <div style="font-size: 1.6rem; font-weight: 800; color: {status_color};">
                {latent_res['prediction']} {status_icon}
            </div>
        </div>
    </div>
</div>
""", unsafe_allow_html=True)

# Performance & State summary metrics
m_col1, m_col2, m_col3, m_col4 = st.columns(4)
with m_col1:
    st.metric("Ground Truth", task.ground_truth)
with m_col2:
    st.metric("Explicit (Mode A)", f"{explicit_res['answer']} ✓")
with m_col3:
    st.metric("Latent (Mode B)", f"{latent_res['prediction']} {'✓' if is_correct else '✗'}")
with m_col4:
    pred_prob = latent_res['probabilities'][latent_res['prediction']]
    st.metric("Top Class Confidence", f"{pred_prob*100:.1f}%")

st.markdown("### 1. Mathematical Recurrence Engine")

render_equation_card(
    title="Recurrent State Update Step",
    latex_eq=r"s_{t+1} = s_t + \alpha \cdot W_2 \tanh(W_1 s_t + b_1) \quad \text{for } t=0 \dots R-1",
    plain_english=f"The model executes {rounds} genuine iterations of matrix-vector updates. The state evolves from S₀ through S_{rounds}, refining internal numerical activations without emitting a single token.",
    numbers_example=f"State magnitude ||S₀||₂ = {np.linalg.norm(latent_res['states'][0]):.2f} → Final ||S_{rounds}||₂ = {np.linalg.norm(latent_res['states'][-1]):.2f}"
)

# State Visualizations Tabs
st.markdown("### 2. Internal State Trajectory Visualization")
st.markdown("Inspect how the latent representations $S_0, S_1, \\dots, S_R$ evolve inside the network:")

tab_heat, tab_delta, tab_pca, tab_drill = st.tabs([
    "📈 State Evolution Heatmap", 
    "📊 State Change Magnitudes (||ΔS||₂)", 
    "🗺️ 2D PCA Trajectory", 
    "🔍 Inspect Vector Values"
])

with tab_heat:
    st.caption(f"🟢 LIVE COMPUTATION — Heatmap of the {rounds+1} state vectors across {latent_model.state_dim} dimensions.")
    fig_heat = plot_state_heatmap(latent_res['states'])
    st.pyplot(fig_heat)
    plt.close(fig_heat)

with tab_delta:
    st.caption("🟢 LIVE COMPUTATION — L2 norm of the state change vector at each round: ||S_{t+1} - S_t||₂.")
    fig_delta = plot_state_deltas(latent_res['state_deltas'])
    st.pyplot(fig_delta)
    plt.close(fig_delta)

with tab_pca:
    st.caption("🟢 LIVE COMPUTATION — Principal Component Analysis projecting high-dimensional state trajectory into 2D space.")
    fig_pca = plot_pca_trajectory(latent_res['states'])
    st.pyplot(fig_pca)
    plt.close(fig_pca)

with tab_drill:
    st.markdown("#### Drill Down into Exact Numerical State Vectors")
    selected_round = st.slider("Select State to Inspect:", 0, rounds, rounds, format="State S_%d")
    inspect_vec = latent_res['states'][selected_round]
    
    st.write(f"**State $S_{{{selected_round}}}$ ($d={len(inspect_vec)}$ components):**")
    st.dataframe(
        {f"Dim {i:02d}": [f"{v:+.4f}"] for i, v in enumerate(inspect_vec)},
        use_container_width=True
    )
    if selected_round > 0:
        prev_vec = latent_res['states'][selected_round - 1]
        delta_vec = inspect_vec - prev_vec
        st.caption(f"Delta from previous state $S_{{{selected_round-1}}}$: L2 norm = **{np.linalg.norm(delta_vec):.4f}**")

st.markdown("---")

# Computation comparison
render_computation_comparison(explicit_res['computation_proxy'], latent_res['computation_proxy'])

st.markdown("---")

# R-Sweep Analysis
st.markdown("### 3. Reasoning Rounds Sweep Analysis")
st.markdown("Observe how increasing recurrence depth $R$ from 1 to 10 affects confidence in the correct answer:")

if st.button("🚀 Run R-Sweep Curve (R = 1 to 10)"):
    rs = list(range(1, 11))
    probs_correct = []
    top_preds = []
    
    for r in rs:
        res_r = latent_model.forward(task.encoded_input, R=r, modulus=task.modulus)
        probs_correct.append(res_r['probabilities'][task.ground_truth])
        top_preds.append(res_r['prediction'])
        
    fig_sweep, ax = plt.subplots(figsize=(8, 4))
    ax.plot(rs, probs_correct, marker='o', color='#2563eb', linewidth=2.2, label='P(Ground Truth)')
    ax.axhline(y=1.0/task.modulus, color='#94a3b8', linestyle=':', label=f'Random Chance (1/{task.modulus})')
    ax.axhline(y=0.5, color='#ef4444', linestyle='--', alpha=0.7, label='50% Decision Threshold')
    
    ax.set_xlabel("Reasoning Rounds (R)", fontsize=10, fontweight='bold')
    ax.set_ylabel("Probability Assigned to Ground Truth", fontsize=10, fontweight='bold')
    ax.set_title(f"Effect of Reasoning Depth R on Task: {task.expression}", fontsize=12, fontweight='bold')
    ax.set_xticks(rs)
    ax.set_ylim(0, 1.05)
    ax.grid(True, linestyle='--', alpha=0.4)
    ax.legend(loc='best')
    plt.tight_layout()
    st.pyplot(fig_sweep)
    plt.close(fig_sweep)
    
    st.caption(f"Predictions across R: " + ", ".join([f"R{r}={p}" for r, p in zip(rs, top_preds)]))

st.markdown("---")

# Mandatory Limitations / Break It Section
st.markdown("### 4. ⚠️ Limitations & Failure Modes: Where Does This Break?")

st.markdown(rf"""
<div class="lab-card" style="border-left: 5px solid #ef4444; background: #fff5f5;">
    <span class="badge badge-limitation">Scientific Honesty</span>
    <h4 style="color: #991b1b; margin: 0.4rem 0;">Empirical Boundaries of Our Toy Educational Model</h4>
    <p style="font-size: 0.92rem; color: #7f1d1d;">
        This toy recurrent model exhibits clear empirical failure boundaries on these synthetic arithmetic cases. 
        <strong>Crucially, behavior on this simplified toy task should not be generalized to large, production-scale neural architectures.</strong>
    </p>
    <ul style="font-size: 0.9rem; color: #7f1d1d; margin-bottom: 0.5rem;">
        <li><strong>Distribution Shifts:</strong> The toy weights were trained on prime moduli 7 and 11. Testing on moduli 13, 17, 19, or 23 causes accuracy to degrade toward random baseline guessing.</li>
        <li><strong>Compositional Depth:</strong> Tasks with nested operations (Levels 3 & 4) frequently fail because a simple unstructured vector in $\mathbb{R}^{48}$ cannot reliably bind multiple intermediate variables.</li>
        <li><strong>Diminishing Returns of R:</strong> For tasks beyond the model's capacity, increasing $R$ does not solve the problem and may lead to representation drift.</li>
        <li><strong>Interpretability Trade-Off:</strong> When Mode B fails, a learner or auditor cannot inspect intermediate textual steps to diagnose where the calculation went wrong.</li>
    </ul>
</div>
""", unsafe_allow_html=True)

st.markdown("""
<div class="lab-card" style="background: #f8fafc;">
    <strong>Next Horizon:</strong> How do modern research architectures like Pathway's <strong>BDH</strong> and <strong>BDH-CQ</strong> address 
    these working memory limitations without emitting tokens?
    <br><br>
    👉 <em>Explore the research frontier in <strong>05 BDH & BDH-CQ</strong>.</em>
</div>
""", unsafe_allow_html=True)
