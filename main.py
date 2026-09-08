import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import streamlit as st

st.set_page_config(page_title='Latent Reasoning Laboratory', page_icon='🧪', layout='wide')

st.title('🧪 Latent Reasoning Laboratory')
st.subheader('Interactive Exploration of Alternatives to Chain-of-Thought Reasoning')

st.info('**Central question:** Can a model perform useful multi-step reasoning by refining internal state instead of emitting every intermediate reasoning step as natural-language tokens?')

st.markdown('''
Welcome to the Latent Reasoning Laboratory! This interactive educational project explores the frontiers of AI reasoning architectures. 
While traditional Large Language Models rely on generating intermediate tokens (Chain-of-Thought) to solve complex problems, 
new approaches like Pathway's Baby Dragon Hatchling (BDH) and BDH-CQ demonstrate that reasoning can occur purely in the latent space.

In this lab, you will explore the differences between these two paradigms. You'll start by understanding the basics of Transformer models, 
then explore how explicit reasoning works, and finally dive into our interactive toy experiment to observe latent reasoning in action.
''')

st.markdown('### Learning Path')
st.markdown('''
1. Transformer Foundations
2. Chain-of-Thought Reasoning
3. Latent Reasoning Lab
4. BDH/BDH-CQ Case Study
5. Assessment
''')

st.markdown('*Estimated time: 5-10 minutes*')

st.markdown('---')
st.caption('AI-Assisted Development Disclosure: AI tools were used for coding assistance, debugging, documentation, and design brainstorming.')
