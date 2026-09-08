import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import streamlit as st

def render_computation_comparison(explicit_proxy: dict, latent_proxy: dict) -> None:
    """Renders a structured comparison of computational proxies between Mode A and Mode B."""
    st.markdown("### 📊 Computational Proxy Comparison")
    st.caption("🟡 TOY-MODEL COMPUTATION PROXY — Conceptual metric comparison, not measured physical hardware joules/flops.")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("""
        <div style="border: 1px solid #fed7aa; background-color: #fffaf5; border-radius: 8px; padding: 1rem; margin-bottom: 0.5rem;">
            <div style="font-weight: 700; color: #c2410c; margin-bottom: 0.5rem; font-size: 1.05rem;">
                Mode A: Explicit / Tokenized (CoT)
            </div>
            <div style="font-size: 0.88rem; color: #431407;">Serializes thought steps into natural-language tokens in context window.</div>
        </div>
        """, unsafe_allow_html=True)
        m1, m2 = st.columns(2)
        with m1:
            st.metric("Tokens Emitted", explicit_proxy.get('reasoning_tokens_emitted', 0))
        with m2:
            st.metric("Internal Updates", explicit_proxy.get('internal_state_updates', 0))
        st.caption(f"📝 {explicit_proxy.get('description', '')}")
        
    with col2:
        st.markdown("""
        <div style="border: 1px solid #bbf7d0; background-color: #f0fdf4; border-radius: 8px; padding: 1rem; margin-bottom: 0.5rem;">
            <div style="font-weight: 700; color: #15803d; margin-bottom: 0.5rem; font-size: 1.05rem;">
                Mode B: Latent / Iterative State
            </div>
            <div style="font-size: 0.88rem; color: #14532d;">Refines continuous vector representation across recurrence rounds.</div>
        </div>
        """, unsafe_allow_html=True)
        m3, m4 = st.columns(2)
        with m3:
            st.metric("Tokens Emitted", latent_proxy.get('reasoning_tokens_emitted', 0))
        with m4:
            st.metric("Internal Updates", latent_proxy.get('internal_state_updates', 0))
        if 'total_ops' in latent_proxy:
            st.caption(f"⚙️ Approx. Operations: **{latent_proxy['total_ops']:,} FLOPs** | {latent_proxy.get('description', '')}")
        else:
            st.caption(f"⚙️ {latent_proxy.get('description', '')}")
    
    st.markdown("""
    > **Fundamental Conceptual Distinction (WHERE computation is represented):**
    > - **Mode A (Explicit / CoT):** Intermediate reasoning is represented and emitted as *tokens* in the context window. Highly readable, but sequence length grows, expanding the KV-cache.
    > - **Mode B (Latent State):** Intermediate reasoning is represented and refined inside an *internal continuous state vector* ($S_0 \to S_1 \to \dots \to S_R$). No sequence tokens emitted, but intermediate states are unreadable vectors.
    >
    > ⚠️ **Scientific Honesty Note:** These toy proxies illustrate the architectural mechanics on synthetic arithmetic. They are **not proof** of general speed, cost, or scaling superiority for full-scale real-world LLMs.
    """)
