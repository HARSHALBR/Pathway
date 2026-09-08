import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import streamlit as st
from models.tasks import generate_task
from models.explicit_reasoning import ExplicitSolver

st.title('Chain-of-Thought Reasoning')

st.markdown('Chain-of-Thought (CoT) is the dominant paradigm for complex reasoning in current LLMs.')

st.info('**Key Terminology:** When we say a model is using "Chain-of-Thought", we mean it is generating **Externally serialized intermediate reasoning tokens**. These are NOT "the model\'s true internal thoughts" but rather a linguistic representation of a reasoning process that the model is forced to output sequentially.')

st.subheader('Interactive Example')

col1, col2 = st.columns([1, 3])

with col1:
    level = st.slider('Difficulty Level', 1, 4, 2)
    if st.button('Generate New Problem') or 'cot_task' not in st.session_state:
        st.session_state.cot_task = generate_task(level=level)
        
task = st.session_state.cot_task

with col2:
    st.markdown(f"**Task Expression:** `{task.expression}`")
    st.markdown(f"**Modulus (n):** `{task.modulus}`")
    
    solver = ExplicitSolver()
    result = solver.solve(task)
    
    st.markdown('**Reasoning Pipeline:**')
    pipeline_str = "Input"
    for idx, token in enumerate(result['tokens']):
        pipeline_str += f" &rarr; Token {idx+1}: `{token}`"
    pipeline_str += f" &rarr; **Answer: {result['answer']}**"
    
    st.markdown(pipeline_str, unsafe_allow_html=True)
    
st.subheader('Limitations of CoT')
st.markdown('''
- **Token cost:** more steps = more tokens = more compute and latency.
- **Sequential dependency:** each token depends on the previous one.
- **Error propagation:** one wrong step corrupts everything after.
- **Linguistic overhead:** reasoning must be expressible in natural language, which may not be the most efficient representation for abstract logic or math.
''')

st.success('**The Key Question:** What if we could reason without emitting these intermediate tokens? Can we just iterate on the model\'s internal, latent state instead?')
