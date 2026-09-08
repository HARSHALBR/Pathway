import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import streamlit as st
from components.ui_theme import inject_custom_css, render_header, render_badge

st.set_page_config(page_title="06 Challenge / 60-Second Test", page_icon="🎯", layout="wide")
inject_custom_css()

render_header(
    title="Chapter 06: Challenge / 60-Second Knowledge Test",
    subtitle="Verify your conceptual understanding of attention mechanics, explicit vs. latent reasoning, and BDH architectures.",
    badge=render_badge("control")
)

st.markdown("""
This concise diagnostic test evaluates your core architectural intuition. 
Submit your answers to receive **immediate mathematical and conceptual feedback**.
""")

with st.form("assessment_form"):
    q1 = st.radio(
        "1. What is the primary difference between Explicit Reasoning (Chain-of-Thought) and Latent Reasoning?",
        [
            "A: Explicit reasoning uses neural networks while latent reasoning only uses Python if-statements.",
            "B: Explicit reasoning emits intermediate thoughts as visible tokens in the context window; latent reasoning performs multi-step computation inside continuous internal state vectors without emitting tokens.",
            "C: Latent reasoning is 100% accurate on all mathematical tasks, whereas explicit reasoning always fails.",
            "D: Latent reasoning eliminates all computation by directly looking up answers in an external cache."
        ],
        index=None
    )
    
    q2 = st.radio(
        "2. In Transformer self-attention, what is the role of the Query (Q) and Key (K) matrices?",
        [
            "A: They store the final vocabulary predictions of the model.",
            "B: The Query vector from each token is compared via dot-product against all Key vectors to compute mathematical compatibility scores, which are scaled and normalized via softmax into attention weights.",
            "C: They permanently delete unnecessary words from the input sequence.",
            "D: They add positional information to prevent words from moving."
        ],
        index=None
    )
    
    q3 = st.radio(
        "3. In our Latent Reasoning Laboratory, what actually happens when you increase reasoning rounds (R)?",
        [
            "A: The model generates longer text paragraphs in the output.",
            "B: The UI merely scales an illustrative animation without executing computation.",
            "C: The model executes additional recurrent state updates (s_{t+1} = s_t + α W₂ tanh(W₁ s_t + b₁)), genuinely updating the state vector S_R before the readout head.",
            "D: The model doubles its parameter count by downloading larger weights."
        ],
        index=None
    )
    
    q4 = st.radio(
        "4. Why does the standard Transformer KV-cache become a computational bottleneck for long Chain-of-Thought reasoning?",
        [
            "A: Because every generated intermediate token must be appended to the KV-cache, causing memory to grow linearly O(L) and subsequent attention computation to grow quadratically O(L²).",
            "B: Because the Transformer vocabulary runs out of unique words.",
            "C: Because positional encodings cannot count higher than 10.",
            "D: Because softmax cannot normalize more than 5 numbers."
        ],
        index=None
    )
    
    q5 = st.radio(
        "5. How does Pathway's BDH (Baby Dragon Hatchling) architecture conceptually differ from the standard Transformer KV-cache?",
        [
            "A: BDH replaces the growing token-by-token KV-cache with a fixed-size dynamic synaptic state matrix updated via Hebbian plasticity (S_t = λ S_{t-1} + K_t^T V_t).",
            "B: BDH is simply a standard Transformer running on faster hardware.",
            "C: BDH converts all numbers into text strings before computing attention.",
            "D: BDH eliminates Query and Key projections entirely."
        ],
        index=None
    )
    
    q6 = st.radio(
        "6. Is the toy latent reasoning model in this educational laboratory identical to the BDH or BDH-CQ architecture?",
        [
            "A: Yes, our Python script is the official production implementation of BDH-CQ.",
            "B: No. Our model is a simplified educational MLP demonstrating the concept of recurrent state updates; genuine BDH utilizes dynamic synaptic state matrices and BDH-CQ utilizes a Context-Query in-context formulation.",
            "C: Yes, because both models use the letter 's' for state.",
            "D: No, because BDH was built for image processing only."
        ],
        index=None
    )
    
    submitted = st.form_submit_button("Submit Answers & Check Feedback")

if submitted:
    score = 0
    total = 6
    
    st.markdown("---")
    st.markdown("### 📋 Diagnostic Results & Explanations")
    
    # Q1
    if q1 and q1.startswith("B"):
        st.success("✅ **Q1 Correct!** Mode A serializes thought into context tokens; Mode B refines internal state vectors.")
        score += 1
    else:
        st.error("❌ **Q1 Incorrect.** Correct Answer: **B**. The central distinction is whether intermediate computation is externalized into context tokens or contained inside internal state vectors.")
        
    # Q2
    if q2 and q2.startswith("B"):
        st.success("✅ **Q2 Correct!** Queries match against Keys via scaled dot-product: S = QK^T / √d_k.")
        score += 1
    else:
        st.error("❌ **Q2 Incorrect.** Correct Answer: **B**. Queries and Keys compute mathematical compatibility scores, which are normalized via softmax into attention weights.")
        
    # Q3
    if q3 and q3.startswith("C"):
        st.success("✅ **Q3 Correct!** R genuinely controls the number of recurrent matrix-vector updates executed in code.")
        score += 1
    else:
        st.error("❌ **Q3 Incorrect.** Correct Answer: **C**. R is a genuine computational variable in our model; increasing R executes additional recurrent transformations on the state.")
        
    # Q4
    if q4 and q4.startswith("A"):
        st.success("✅ **Q4 Correct!** Emitting tokens expands sequence length L, driving KV-cache memory and O(L²) attention cost.")
        score += 1
    else:
        st.error("❌ **Q4 Incorrect.** Correct Answer: **A**. The KV-cache grows with each emitted token, creating a major memory and latency footprint.")
        
    # Q5
    if q5 and q5.startswith("A"):
        st.success("✅ **Q5 Correct!** BDH introduces a dynamic synaptic working memory matrix updated via Hebbian fast weights.")
        score += 1
    else:
        st.error("❌ **Q5 Incorrect.** Correct Answer: **A**. BDH maintains a fixed-size synaptic matrix S_t updated by outer products K_t^T V_t with decay λ.")
        
    # Q6
    if q6 and q6.startswith("B"):
        st.success("✅ **Q6 Correct!** Scientific honesty is paramount: our toy MLP is an educational prototype, not BDH.")
        score += 1
    else:
        st.error("❌ **Q6 Incorrect.** Correct Answer: **B**. Our lab model is a toy educational baseline designed to teach the concept of state updates, distinct from Pathway's BDH architecture.")
        
    st.markdown(f"""
    <div class="lab-card" style="text-align: center; border-left: 5px solid {'#15803d' if score >= 5 else '#d97706'};">
        <h3 style="margin: 0; color: #0f172a;">Final Assessment Score: {score} / {total}</h3>
        <p style="font-size: 1.05rem; color: #475569; margin: 0.5rem 0 0 0;">
            {'🎉 Outstanding! You have mastered both the Transformer foundations and the frontiers of latent reasoning architectures.' if score == 6 else
             '👍 Great job! You have a solid grasp of explicit vs. latent computation. Review any highlighted questions above to solidify your understanding.' if score >= 4 else
             '📖 We recommend reviewing Chapters 02, 04, and 05 to revisit attention mechanics and latent recurrence.'}
        </p>
    </div>
    """, unsafe_allow_html=True)
