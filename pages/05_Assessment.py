import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import streamlit as st

st.title('📝 Knowledge Check')
st.markdown('Test your understanding of the concepts explored in this laboratory.')

q1 = st.radio(
    '1. Which statement best describes the difference between explicit and latent reasoning?',
    ['A: Latent reasoning always gives better answers than explicit reasoning.',
     'B: Latent reasoning performs iterative computation in internal representations without requiring every intermediate step to be serialized as natural-language tokens.',
     'C: Latent reasoning removes computation entirely — it just guesses the answer.',
     'D: BDH is simply a Transformer with fewer layers.']
)

q2 = st.radio(
    '2. In our experiment, what happens when you increase reasoning rounds R?',
    ['A: More text tokens are generated as intermediate reasoning steps.',
     'B: The model performs additional internal state updates before producing an answer, potentially improving accuracy.',
     'C: The model uses a larger vocabulary.',
     'D: Nothing changes — R is purely decorative.']
)

q3 = st.radio(
    '3. Why might latent reasoning fail on certain tasks?',
    ['A: Because latent reasoning never works on any task.',
     'B: Because more computation always guarantees better results.',
     'C: Because some tasks require compositional reasoning that iterative state refinement alone may not capture, or because accumulated errors in state updates can degrade the representation.',
     'D: Because the model has too many parameters.']
)

if st.button('Check Answers'):
    score = 0
    
    if q1.startswith('B'):
        st.success('Q1 Correct! Latent reasoning shifts the computational burden from external token generation to internal state updates.')
        score += 1
    else:
        st.error('Q1 Incorrect. The correct answer is B. Latent reasoning performs iterative computation in internal representations without requiring every intermediate step to be serialized as natural-language tokens.')
        
    if q2.startswith('B'):
        st.success('Q2 Correct! R controls the number of internal state updates before decoding the final answer.')
        score += 1
    else:
        st.error('Q2 Incorrect. The correct answer is B. The model performs additional internal state updates before producing an answer, potentially improving accuracy.')
        
    if q3.startswith('C'):
        st.success('Q3 Correct! Iterative state refinement has limits and can accumulate noise or fail on complex nested reasoning.')
        score += 1
    else:
        st.error('Q3 Incorrect. The correct answer is C. Because some tasks require compositional reasoning that iterative state refinement alone may not capture, or because accumulated errors in state updates can degrade the representation.')
        
    st.markdown(f"### Score: {score}/3")
    if score == 3:
        st.markdown('Excellent! You have a solid understanding of latent vs explicit reasoning.')
    elif score == 2:
        st.markdown('Good understanding! Review the sections where you made a mistake.')
    else:
        st.markdown('Consider revisiting the lab sections to solidify your understanding.')
