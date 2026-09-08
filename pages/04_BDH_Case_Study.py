import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import streamlit as st

st.title('BDH / BDH-CQ Case Study')
st.subheader('From Toy Experiment to Research Architecture')

st.markdown('### What is BDH?')
st.markdown('''
- **Full name:** Baby Dragon Hatchling
- **Paper:** "The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain"
- **Authors:** Adrian Kosowski, Przemysław Uznański, Jan Chorowski, Zuzanna Stamirowska, Michał Bartoszkiewicz
- **Affiliation:** Pathway
- **arXiv:** 2509.26507 (September 2025)

BDH introduces an architecture that connects standard attention mechanisms with brain-like synaptic state tracking.
''')
st.caption('⚪ PRIMARY SOURCE')

st.markdown('### Synaptic State — Dynamic Working Memory')
st.markdown('Hebbian plasticity equation:')
st.latex(r'\frac{d\sigma_{ij}}{dt} = \eta \cdot Y_i \cdot X_j - \lambda \cdot \sigma_{ij}')
st.markdown('''
Where $\eta$ is learning rate, $Y, X$ are activations, and $\lambda$ is decay.

GPU formulation:
''')
st.latex(r'S_t = \lambda \cdot S_{t-1} + K_t^T \cdot V_t')
st.latex(r'O_t = Q_t \cdot S_t')
st.markdown('This dynamic working memory contrasts with the static KV-cache of standard Transformers, allowing the model to refine internal representations over time.')
st.caption('⚪ PRIMARY SOURCE — Equation from arXiv:2509.26507')

st.markdown('### BDH vs Standard Transformer')
st.markdown('''
| Feature | Standard Transformer | BDH |
|---------|----------------------|-----|
| Attention mechanism | Token-to-token via KV-cache | Token-to-synaptic-state |
| Working memory | Static (KV-cache grows with sequence) | Dynamic (Fixed-size matrix updated over time) |
| Weights at inference | Frozen | Dynamic (Synaptic state acts as fast weights) |
| Activation profile | Feed-forward per layer | Recurrent state updates |
| Interpretability | Attention weights highlight tokens | State projections highlight abstract concepts |
''')
st.caption('🟡 ILLUSTRATIVE — Simplified comparison')

st.markdown('### What BDH-CQ Contributes')
st.markdown('''
- **Paper:** "BDH-CQ: In-Context Learning with Recurrent Latent Reasoning"
- **Authors:** Björn Engdahl, Adrian Kosowski, Jan Chorowski
- **Affiliations:** Pathway, Bielik AI, NYU
- **arXiv:** 2608.09888 (August 2026)

BDH-CQ extends BDH with a **Context-Query (CQ)** framework, explicitly structuring recurrent latent reasoning:
''')
st.latex(r'z^{(0)} = f_{\text{init}}(x^*, M_K)')
st.latex(r'z^{(r)} = R(z^{(r-1)}, M_K, \psi(x^*))')
st.latex(r'\hat{y}^* = \text{Decode}(z^{(R)})')
st.markdown('''
Unlike CoT which iterates over token generation, BDH-CQ iterates purely in the continuous latent space $z$.
''')
st.caption('⚪ PRIMARY SOURCE')

st.markdown('### Published Results')
st.markdown('''
On the ARC-AGI-1 benchmark:
- 29.5% pass@2
- 150M parameters
- $0.0007 / task
''')
st.caption('🔵 PUBLISHED — Not reproduced live')

st.markdown('### Connection to Our Experiment')
st.markdown('#### Conceptual Similarity')
st.markdown('''
Our toy: $s_{t+1} = s_t + \alpha \cdot f(s_t)$
BDH-CQ: $z^{(r)} = R(z^{(r-1)}, M_K, \psi(x^*))$
**Both iterate on internal state without emitting tokens.**
''')
st.markdown('#### Architectural Differences')
st.markdown('BDH possesses explicit memory keys and associative binding lacking in our simple MLPs.')
st.markdown('#### What Our Toy Does NOT Capture')
st.markdown('''
- Real dynamic KV state
- Associative recall
- Scale (ours is tiny)
''')
st.caption('🟡 ILLUSTRATIVE')

st.markdown('### Failure Cases and Limitations')
st.markdown('''
- **BDH-CQ:** degrades on color-swap compositions and deep recursive nesting.
- **Our toy:** fails on high-difficulty tasks, insufficient R, out-of-distribution moduli.
- **Conclusion:** Latent reasoning ≠ universally superior to CoT.
''')
st.caption('🔵 PUBLISHED + 🟢 OUR RESULTS')

st.markdown('### Related Work')
st.markdown('Other explorations in this direction include: Coconut (arXiv:2412.06769), Pause Tokens (arXiv:2310.02226), Quiet-STaR (arXiv:2403.09629), and the Universal Transformer.')
st.caption('⚪ PRIMARY SOURCE')
