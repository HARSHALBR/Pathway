import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import streamlit as st
import numpy as np
import matplotlib.pyplot as plt
from models.tasks import generate_task
from models.explicit_reasoning import ExplicitSolver
from models.latent_reasoning import LatentReasoningModel
from components.state_visualizer import plot_state_heatmap, plot_state_deltas, plot_pca_trajectory
from components.computation_tracker import render_computation_comparison

st.title('Latent Reasoning Lab')

st.sidebar.header('Experiment Controls')
level = st.sidebar.slider('Difficulty Level', 1, 4, 2)
modulus = st.sidebar.selectbox('Modulus (n)', [7, 11, 13, 17, 19, 23], index=1)
rounds = st.sidebar.slider('Reasoning Rounds (R)', 1, 10, 5)
state_dim = st.sidebar.selectbox('State Dimension', [8, 16, 32, 48, 64], index=2)
seed = st.sidebar.number_input('Random Seed', value=42)

if st.sidebar.button('🔄 Generate New Task') or 'current_task' not in st.session_state:
    st.session_state.current_task = generate_task(level=level, modulus=modulus, seed=seed)

task = st.session_state.current_task

mode = st.sidebar.radio('Reasoning Mode', ['Both (Compare)', 'Explicit Only', 'Latent Only'])

run_exp = st.sidebar.button('🚀 Run Experiment')

@st.cache_resource
def get_latent_model(s_dim, mod):
    model = LatentReasoningModel(state_dim=s_dim, hidden_dim=64, max_classes=23, alpha=0.5, seed=42)
    weights_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'generated', 'pretrained_weights.npz')
    if os.path.exists(weights_path):
        try:
            model.load_weights(weights_path)
        except Exception as e:
            st.warning(f"Failed to load weights: {e}")
    else:
        st.warning("Pretrained weights not found. You might need to train the model.")
    return model

latent_model = get_latent_model(state_dim, modulus)
explicit_solver = ExplicitSolver()

st.subheader(f"Task: `{task.expression}` (mod {task.modulus})")

if run_exp or 'exp_run' not in st.session_state:
    st.session_state.exp_run = True
    
    explicit_res = explicit_solver.solve(task)
    latent_res = latent_model.forward(task.encoded_input, rounds, task.modulus)
    
    st.session_state.explicit_res = explicit_res
    st.session_state.latent_res = latent_res

explicit_res = st.session_state.explicit_res
latent_res = st.session_state.latent_res

col1, col2, col3 = st.columns(3)
with col1:
    st.metric("Ground Truth", task.ground_truth)
with col2:
    if mode in ['Both (Compare)', 'Explicit Only']:
        icon = "✅" if explicit_res['correct'] else "❌"
        st.metric("Explicit Prediction", f"{explicit_res['answer']} {icon}")
with col3:
    if mode in ['Both (Compare)', 'Latent Only']:
        icon = "✅" if latent_res['prediction'] == task.ground_truth else "❌"
        st.metric("Latent Prediction", f"{latent_res['prediction']} {icon}")

if mode == 'Both (Compare)':
    c1, c2 = st.columns(2)
    with c1:
        st.markdown('### Mode A: Explicit / Tokenized Reasoning')
        pipe = "Input<br>"
        for i, t in enumerate(explicit_res['tokens']):
            pipe += f"&darr;<br>Token {i+1}: `{t}`<br>"
        pipe += f"&darr;<br>**Answer: {explicit_res['answer']}**"
        st.markdown(pipe, unsafe_allow_html=True)
    with c2:
        st.markdown('### Mode B: Latent / Iterative State Reasoning')
        st.markdown(f"State trajectory: S₀ &rarr; " + " &rarr; ".join([f"S_{i+1}" for i in range(rounds)]) + f" &rarr; **{latent_res['prediction']}**", unsafe_allow_html=True)
elif mode == 'Explicit Only':
    st.markdown('### Mode A: Explicit / Tokenized Reasoning')
    pipe = "Input<br>"
    for i, t in enumerate(explicit_res['tokens']):
        pipe += f"&darr;<br>Token {i+1}: `{t}`<br>"
    pipe += f"&darr;<br>**Answer: {explicit_res['answer']}**"
    st.markdown(pipe, unsafe_allow_html=True)
elif mode == 'Latent Only':
    st.markdown('### Mode B: Latent / Iterative State Reasoning')
    st.markdown(f"State trajectory: S₀ &rarr; " + " &rarr; ".join([f"S_{i+1}" for i in range(rounds)]) + f" &rarr; **{latent_res['prediction']}**", unsafe_allow_html=True)

if mode in ['Both (Compare)', 'Latent Only']:
    st.markdown('---')
    st.markdown('### State Visualization')
    t1, t2, t3 = st.tabs(['State Heatmap', 'State Deltas', 'PCA Trajectory'])
    
    with t1:
        fig1 = plot_state_heatmap(latent_res['states'])
        st.pyplot(fig1)
        plt.close(fig1)
        
    with t2:
        fig2 = plot_state_deltas(latent_res['state_deltas'])
        st.pyplot(fig2)
        plt.close(fig2)
        
    with t3:
        fig3 = plot_pca_trajectory(latent_res['states'])
        st.pyplot(fig3)
        plt.close(fig3)

if mode == 'Both (Compare)':
    st.markdown('---')
    render_computation_comparison(explicit_res['computation_proxy'], latent_res['computation_proxy'])

st.markdown('---')
if st.button('Run R Sweep (R=1 to 10)'):
    probs_correct = []
    rs = list(range(1, 11))
    for r in rs:
        res = latent_model.forward(task.encoded_input, r, task.modulus)
        probs_correct.append(res['probabilities'][task.ground_truth])
        
    fig, ax = plt.subplots()
    ax.plot(rs, probs_correct, marker='o')
    ax.axhline(y=0.5, color='r', linestyle='--', label='50% Threshold')
    ax.set_xlabel('Reasoning Rounds (R)')
    ax.set_ylabel('Probability of Correct Answer')
    ax.set_title('Effect of Reasoning Rounds on Confidence')
    ax.legend()
    st.pyplot(fig)
    plt.close(fig)
