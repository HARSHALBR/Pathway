import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import streamlit as st
import matplotlib.pyplot as plt
from models.transformer_demo import TinyTransformer
from components.attention_visualizer import plot_matrix, plot_attention_heatmap

st.title('Transformer Foundations')
st.markdown('Before we can contrast explicit and latent reasoning, we need to understand the basic operations of a Transformer block.')

col1, col2 = st.columns([1, 2])

with col1:
    st.subheader('Concept Glossary')
    with st.expander('Token, Token ID, Vocabulary'):
        st.write('Text is split into discrete chunks (tokens), mapped to numbers (IDs) from a known dictionary (vocabulary).')
    with st.expander('Token Embedding, Embedding Dimension'):
        st.write('Each Token ID is converted to a vector of continuous numbers of a fixed size (Embedding Dimension).')
    with st.expander('Positional Information'):
        st.write('Transformers process all tokens simultaneously. Positional encoding adds sequence order information to the embeddings.')
    with st.expander('Query, Key, Value'):
        st.write('Linear projections of the input used to determine how tokens relate to one another.')
    with st.expander('Self-Attention, Attention Weights'):
        st.write('The mechanism by which each token aggregates information from other tokens based on relevance (attention weights).')
    with st.expander('Feed-Forward Network'):
        st.write('A neural network applied independently to each position to process the aggregated information.')
    with st.expander('Residual Connection, Layer Normalization'):
        st.write('Techniques to stabilize training by bypassing transformations and normalizing activations.')
    with st.expander('Transformer Block'):
        st.write('A single unit consisting of self-attention followed by a feed-forward network, both with residual connections and layer norm.')
    with st.expander('Autoregressive next-token prediction'):
        st.write('The process of generating text one token at a time, where each new token becomes part of the input for predicting the next.')

with col2:
    st.subheader('Interactive Demo')
    sentence = st.text_input('Input Sentence', value='the cat sleeps')
    
    if st.button('Run Transformer'):
        try:
            model = TinyTransformer(d_model=4, seed=42)
            out = model.forward(sentence)
            
            st.markdown('**a. Tokens and Token IDs**')
            st.write({'Tokens': out['tokens'], 'Token IDs': out['token_ids']})
            
            st.markdown('**b. Embedding matrix X**')
            st.latex(r'X \in \mathbb{R}^{L \times d}')
            fig_X = plot_matrix(out['X'], title='Embedding Matrix X')
            st.pyplot(fig_X)
            plt.close(fig_X)
            
            st.markdown('**c. Positional encoding P**')
            fig_P = plot_matrix(out['P'], title='Positional Encoding P')
            st.pyplot(fig_P)
            plt.close(fig_P)
            
            st.markdown('**d. H0 = X + P**')
            st.latex(r'H_0 = X + P')
            fig_H0 = plot_matrix(out['H0'], title='H0 Matrix')
            st.pyplot(fig_H0)
            plt.close(fig_H0)
            
            st.markdown('**e. Weight matrices W_Q, W_K, W_V**')
            c1, c2, c3 = st.columns(3)
            with c1:
                fig = plot_matrix(out['W_Q'], title='W_Q')
                st.pyplot(fig)
                plt.close(fig)
            with c2:
                fig = plot_matrix(out['W_K'], title='W_K')
                st.pyplot(fig)
                plt.close(fig)
            with c3:
                fig = plot_matrix(out['W_V'], title='W_V')
                st.pyplot(fig)
                plt.close(fig)
                
            st.markdown('**f. Q, K, V matrices**')
            st.latex(r'Q = H_0 W_Q, \quad K = H_0 W_K, \quad V = H_0 W_V')
            st.latex(r'Q \in \mathbb{R}^{L \times d_k}')
            c1, c2, c3 = st.columns(3)
            with c1:
                fig = plot_matrix(out['Q'], title='Q Matrix')
                st.pyplot(fig)
                plt.close(fig)
            with c2:
                fig = plot_matrix(out['K'], title='K Matrix')
                st.pyplot(fig)
                plt.close(fig)
            with c3:
                fig = plot_matrix(out['V'], title='V Matrix')
                st.pyplot(fig)
                plt.close(fig)
                
            st.markdown('**g. Score matrix QK^T/sqrt(d_k)**')
            st.latex(r'\frac{QK^T}{\sqrt{d_k}}')
            fig_scores = plot_matrix(out['scores'], title='Score Matrix')
            st.pyplot(fig_scores)
            plt.close(fig_scores)
            
            st.markdown('**h. Attention weights after softmax**')
            st.latex(r'\text{Attention}(Q,K,V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right) V')
            fig_att = plot_attention_heatmap(out['attention_weights'], out['tokens'])
            st.pyplot(fig_att)
            plt.close(fig_att)
            
            st.markdown('**i. Attention output**')
            fig_att_out = plot_matrix(out['attention_output'], title='Attention Output')
            st.pyplot(fig_att_out)
            plt.close(fig_att_out)
            
            st.markdown('**j. After residual + FFN**')
            fig_final = plot_matrix(out['residual_2'], title='Final Block Output')
            st.pyplot(fig_final)
            plt.close(fig_final)
            
        except Exception as e:
            st.error(f'Error running Transformer demo: {e}')
