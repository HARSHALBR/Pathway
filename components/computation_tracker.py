import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import streamlit as st

def render_computation_comparison(explicit_proxy: dict, latent_proxy: dict) -> None:
    """Renders a Streamlit comparison of computation costs using st.columns and st.metric.
    
    Labels everything as 'Toy-model computation proxy'.
    
    Expected proxy dict keys (from model APIs):
      - reasoning_tokens_emitted: int
      - internal_state_updates: int
      - total_ops: int (optional)
      - ops_per_round: int (optional)
      - description: str
    """
    st.markdown("### Computation Comparison")
    st.caption("Toy-model computation proxy — not real hardware costs")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("**Mode A: Explicit Reasoning**")
        st.metric("Reasoning Tokens Emitted", explicit_proxy.get('reasoning_tokens_emitted', 0))
        st.metric("Internal State Updates", explicit_proxy.get('internal_state_updates', 0))
        st.info(explicit_proxy.get('description', ''))
        
    with col2:
        st.markdown("**Mode B: Latent Reasoning**")
        st.metric("Reasoning Tokens Emitted", latent_proxy.get('reasoning_tokens_emitted', 0))
        st.metric("Internal State Updates", latent_proxy.get('internal_state_updates', 0))
        if 'total_ops' in latent_proxy:
            st.metric("Approx. Operations", f"{latent_proxy['total_ops']:,}")
        st.info(latent_proxy.get('description', ''))
    
    st.markdown("""
    **Key Insight:** Explicit reasoning emits intermediate tokens (visible, costly per token). 
    Latent reasoning performs internal state updates (invisible, cost scales with rounds R, not token length).
    """)
