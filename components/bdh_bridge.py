"""Interactive Conceptual Bridge between Toy Latent Reasoning and BDH / BDH-CQ.
Provides interactive inspection of Hebbian synaptic state dynamics and architectural comparison.
"""
from __future__ import annotations
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import streamlit as st

def simulate_hebbian_synaptic_step(S_prev: np.ndarray, K_t: np.ndarray, V_t: np.ndarray, Q_t: np.ndarray, decay_lambda: float = 0.9) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    """Computes one step of BDH synaptic state working memory update:
    S_t = lambda * S_{t-1} + K_t^T * V_t
    O_t = Q_t * S_t
    
    Args:
        S_prev: Previous synaptic state matrix (d x d)
        K_t: Key vector at step t (d,)
        V_t: Value vector at step t (d,)
        Q_t: Query vector at step t (d,)
        decay_lambda: Retention/decay coefficient in [0, 1]
        
    Returns:
        (S_t, outer_product, O_t)
    """
    # Outer product delta = K_t^T (x) V_t -> shape (d, d)
    outer_product = np.outer(K_t, V_t)
    S_t = decay_lambda * S_prev + outer_product
    O_t = Q_t @ S_t  # Shape (d,)
    return S_t, outer_product, O_t

def plot_synaptic_matrices(S_prev: np.ndarray, delta: np.ndarray, S_new: np.ndarray) -> plt.Figure:
    """Visualizes the Hebbian synaptic update: S_{t-1} + delta = S_t."""
    fig, axes = plt.subplots(1, 3, figsize=(11, 3.2))
    
    sns.heatmap(S_prev, annot=True, fmt='.2f', cmap='Blues', cbar=False, ax=axes[0])
    axes[0].set_title(r"$\lambda \cdot S_{t-1}$ (Decayed Memory)", fontsize=10, fontweight='bold')
    
    sns.heatmap(delta, annot=True, fmt='.2f', cmap='Greens', cbar=False, ax=axes[1])
    axes[1].set_title(r"$K_t^T \cdot V_t$ (New Association)", fontsize=10, fontweight='bold')
    
    sns.heatmap(S_new, annot=True, fmt='.2f', cmap='Purples', cbar=True, ax=axes[2])
    axes[2].set_title(r"$S_t$ (Updated Synaptic State)", fontsize=10, fontweight='bold')
    
    for ax in axes:
        ax.set_xticks([])
        ax.set_yticks([])
    plt.tight_layout()
    return fig

def render_bdh_interactive_simulator() -> None:
    """Renders the interactive educational Hebbian synaptic memory simulator."""
    st.markdown("""
    <div style="border: 1px solid #bfdbfe; background-color: #eff6ff; border-radius: 8px; padding: 1rem; margin-bottom: 1rem;">
        <span class="badge badge-toy">Conceptual / Simplified Hebbian Memory Abstraction</span>
        <div style="font-weight: 700; color: #1e40af; font-size: 1.05rem; margin-top: 0.35rem; margin-bottom: 0.35rem;">
            🧪 Outer-Product Associative Memory Simulation (4×4 Matrix)
        </div>
        <div style="font-size: 0.9rem; color: #1e3a8a; line-height: 1.45;">
            This simplified simulator illustrates the idea of persistent state updated through an outer-product-style memory mechanism. 
            It is inspired by the mathematical ideas discussed in the BDH literature (Kosowski et al., 2025) but is 
            <strong>not an implementation of the complete BDH architecture</strong>.
        </div>
    </div>
    """, unsafe_allow_html=True)
    
    col_c1, col_c2 = st.columns([1, 1])
    with col_c1:
        decay = st.slider("Synaptic Memory Retention (λ)", min_value=0.0, max_value=1.0, value=0.85, step=0.05,
                          help="Controls how much previous associative memory is preserved vs. forgotten.")
    with col_c2:
        token_role = st.selectbox("Input Association Context", 
                                  ["Association: [Subject -> Action]", "Association: [Entity -> Attribute]", "Association: [Operator -> Operand]"])

    # Deterministic vectors based on selection
    seed_map = {
        "Association: [Subject -> Action]": 101,
        "Association: [Entity -> Attribute]": 202,
        "Association: [Operator -> Operand]": 303
    }
    rng = np.random.default_rng(seed_map[token_role])
    d = 4
    
    # Generate S_{t-1}, K_t, V_t, Q_t
    S_prev = rng.normal(0, 0.5, size=(d, d))
    K_t = rng.normal(0, 1.0, size=d)
    V_t = rng.normal(0, 1.0, size=d)
    Q_t = rng.normal(0, 1.0, size=d)
    
    S_new, delta, O_t = simulate_hebbian_synaptic_step(S_prev, K_t, V_t, Q_t, decay_lambda=decay)
    
    fig = plot_synaptic_matrices(decay * S_prev, delta, S_new)
    st.pyplot(fig)
    plt.close(fig)
    
    st.markdown(rf"""
    **Computed Readout:** Query $Q_t$ interacting with synaptic memory $S_t$:  
    $O_t = Q_t \cdot S_t = [{", ".join([f"{v:.2f}" for v in O_t])}]$  
    *(Notice: As you adjust retention $\lambda$, older associations are preserved or discounted in the output.)*
    """)
