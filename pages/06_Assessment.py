import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import streamlit as st
from components.ui_theme import inject_custom_css, render_header, render_badge

st.set_page_config(page_title="06 Challenge / 60-Second Test", page_icon="🎯", layout="wide")
inject_custom_css()

render_header(
    title="Chapter 06: Challenge / 60-Second Knowledge Test",
    subtitle="Verify your conceptual understanding of embeddings, attention mechanics, explicit vs. latent reasoning, and BDH architectures.",
    badge=render_badge("control")
)

st.markdown("""
This concise diagnostic test evaluates your core architectural intuition across 8 key concepts. 
Submit your answers to receive **immediate mathematical and conceptual feedback**.
""")

with st.form("assessment_form"):
    q1 = st.radio(
        "1. What is the fundamental difference between Vocabulary Size (V) and Embedding Dimension (d)?",
        [
            "A: Vocabulary size is the number of tokens in the dictionary; embedding dimension is the number of continuous numerical coordinates representing each token in vector space.",
            "B: Vocabulary size is the length of the sentence; embedding dimension is the number of layers in the model.",
            "C: They are identical terms for the number of neurons in the output head.",
            "D: Embedding dimension is always fixed at 4 for all production language models."
        ],
        index=None
    )

    q2 = st.radio(
        "2. In Transformer self-attention, what is the role of the Query (Q) and Key (K) matrices?",
        [
            "A: They permanently delete unnecessary words from the input sequence.",
            "B: The Query vector from each token is compared via dot-product against all Key vectors to compute mathematical compatibility scores, which are scaled and normalized via softmax into attention weights.",
            "C: They store the final vocabulary predictions of the model.",
            "D: They add positional information to prevent words from moving."
        ],
        index=None
    )

    q3 = st.radio(
        "3. What is the primary operational difference between Explicit Reasoning (Chain-of-Thought) and Latent Reasoning?",
        [
            "A: Explicit reasoning uses neural networks while latent reasoning only uses Python if-statements.",
            "B: Explicit reasoning emits intermediate thoughts as visible tokens in the context window; latent reasoning performs multi-step computation inside continuous internal state vectors without emitting tokens.",
            "C: Latent reasoning is 100% accurate on all mathematical tasks, whereas explicit reasoning always fails.",
            "D: Latent reasoning eliminates all computation by directly looking up answers in an external cache."
        ],
        index=None
    )
    
    q4 = st.radio(
        "4. In our Latent Reasoning Laboratory, what actually happens when you increase reasoning rounds (R)?",
        [
            "A: The model generates longer text paragraphs in the output.",
            "B: The UI merely scales an illustrative animation without executing computation.",
            "C: The model executes additional recurrent state updates (s_{t+1} = s_t + α W₂ tanh(W₁ s_t + b₁)), genuinely updating the state vector S_R before the readout head.",
            "D: The model doubles its parameter count by downloading larger weights."
        ],
        index=None
    )
    
    q5 = st.radio(
        "5. Why does the standard Transformer KV-cache become a computational bottleneck for long Chain-of-Thought reasoning?",
        [
            "A: Because every generated intermediate token must be appended to the KV-cache, causing memory to grow linearly O(L) and subsequent attention computation to grow quadratically O(L²).",
            "B: Because the Transformer vocabulary runs out of unique words.",
            "C: Because positional encodings cannot count higher than 10.",
            "D: Because softmax cannot normalize more than 5 numbers."
        ],
        index=None
    )
    
    q6 = st.radio(
        "6. How does Pathway's BDH (Baby Dragon Hatchling) architecture conceptually differ from the standard Transformer KV-cache?",
        [
            "A: BDH replaces the growing token-by-token KV-cache with a fixed-size dynamic synaptic state matrix updated via Hebbian plasticity (S_t = λ S_{t-1} + K_t^T V_t).",
            "B: BDH is simply a standard Transformer running on faster hardware.",
            "C: BDH converts all numbers into text strings before computing attention.",
            "D: BDH eliminates Query and Key projections entirely."
        ],
        index=None
    )

    q7 = st.radio(
        "7. What is the core contribution of Pathway's BDH-CQ architecture (Engdahl et al., 2026)?",
        [
            "A: It introduces a Context-Query (CQ) framework that performs recurrent in-context reasoning entirely in continuous latent space (z^(r)) without intermediate token generation.",
            "B: It forces the model to emit twice as many Chain-of-Thought tokens.",
            "C: It eliminates attention and replaces all weights with hardcoded decision trees.",
            "D: It trains an image classifier on modular arithmetic."
        ],
        index=None
    )
    
    q8 = st.radio(
        "8. Is the toy latent reasoning model in this educational laboratory identical to the BDH or BDH-CQ architecture?",
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
    total = 8
    
    st.markdown("---")
    st.markdown("### 📋 Diagnostic Results & Explanations")
    
    # Q1
    if q1 and q1.startswith("A"):
        st.success("✅ **Q1 Correct!** Vocabulary size V is total unique tokens; embedding dimension d is the length of each continuous representation vector.")
        score += 1
    else:
        st.error("❌ **Q1 Incorrect.** Correct Answer: **A**. Vocabulary size V is the dictionary size; embedding dimension d is coordinate count per vector.")
        
    # Q2
    if q2 and q2.startswith("B"):
        st.success("✅ **Q2 Correct!** Queries match against Keys via scaled dot-product: S = QK^T / √d_k, producing attention weights.")
        score += 1
    else:
        st.error("❌ **Q2 Incorrect.** Correct Answer: **B**. Queries and Keys compute mathematical compatibility scores, which are normalized via softmax into attention weights.")

    # Q3
    if q3 and q3.startswith("B"):
        st.success("✅ **Q3 Correct!** Mode A serializes thought into context tokens; Mode B refines internal state vectors.")
        score += 1
    else:
        st.error("❌ **Q3 Incorrect.** Correct Answer: **B**. The central distinction is WHERE intermediate computation is represented: in context tokens vs. inside internal state.")
        
    # Q4
    if q4 and q4.startswith("C"):
        st.success("✅ **Q4 Correct!** R genuinely controls the number of recurrent matrix-vector updates executed in code.")
        score += 1
    else:
        st.error("❌ **Q4 Incorrect.** Correct Answer: **C**. R is a genuine computational variable in our model; increasing R executes additional recurrent transformations.")
        
    # Q5
    if q5 and q5.startswith("A"):
        st.success("✅ **Q5 Correct!** Emitting tokens expands sequence length L, driving KV-cache memory and O(L²) attention cost.")
        score += 1
    else:
        st.error("❌ **Q5 Incorrect.** Correct Answer: **A**. The KV-cache grows with each emitted token, creating a major memory and latency footprint.")
        
    # Q6
    if q6 and q6.startswith("A"):
        st.success("✅ **Q6 Correct!** BDH introduces a dynamic synaptic working memory matrix updated via Hebbian fast weights.")
        score += 1
    else:
        st.error("❌ **Q6 Incorrect.** Correct Answer: **A**. BDH maintains a fixed-size synaptic matrix S_t updated by outer products K_t^T V_t with decay λ.")

    # Q7
    if q7 and q7.startswith("A"):
        st.success("✅ **Q7 Correct!** BDH-CQ structures in-context latent reasoning across recurrence rounds z^(r) in continuous vector space.")
        score += 1
    else:
        st.error("❌ **Q7 Incorrect.** Correct Answer: **A**. BDH-CQ executes recurrent latent updates z^(r) using Context-Query separation.")
        
    # Q8
    if q8 and q8.startswith("B"):
        st.success("✅ **Q8 Correct!** Scientific honesty is paramount: our toy MLP is an educational prototype, not BDH.")
        score += 1
    else:
        st.error("❌ **Q8 Incorrect.** Correct Answer: **B**. Our lab model is a toy educational baseline designed to teach the concept of state updates, distinct from Pathway's BDH architecture.")
        
    st.markdown(f"""
    <div class="lab-card" style="text-align: center; border-left: 5px solid {'#15803d' if score >= 7 else '#d97706'};">
        <h3 style="margin: 0; color: #0f172a;">Final Assessment Score: {score} / {total}</h3>
        <p style="font-size: 1.05rem; color: #475569; margin: 0.5rem 0 0 0;">
            {'🎉 Outstanding! You have demonstrated comprehensive mastery of Transformer foundations, attention mechanics, latent recurrence, and BDH research concepts.' if score == 8 else
             '👍 Great job! You have a solid grasp of explicit vs. latent computation. Review any highlighted questions above to solidify your understanding.' if score >= 6 else
             '📖 We recommend reviewing Chapters 02, 04, and 05 to revisit attention mechanics and latent recurrence.'}
        </p>
    </div>
    """, unsafe_allow_html=True)
