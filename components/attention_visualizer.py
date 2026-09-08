import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns

def plot_attention_heatmap(weights: np.ndarray, tokens: list[str], title='Attention Weights') -> plt.Figure:
    """Heatmap of attention weights with token labels."""
    fig, ax = plt.subplots(figsize=(8, 6))
    sns.heatmap(weights, xticklabels=tokens, yticklabels=tokens, annot=True, cmap='Blues', fmt='.2f', ax=ax)
    ax.set_title(title)
    return fig

def plot_matrix(matrix: np.ndarray, title='Matrix', row_labels=None, col_labels=None, fmt='.2f') -> plt.Figure:
    """General-purpose matrix visualization with cell values annotated."""
    fig, ax = plt.subplots(figsize=(6, max(4, matrix.shape[0] * 0.5)))
    sns.heatmap(matrix, xticklabels=col_labels if col_labels else False, 
                yticklabels=row_labels if row_labels else False, 
                annot=True, cmap='viridis', fmt=fmt, ax=ax)
    ax.set_title(title)
    return fig
