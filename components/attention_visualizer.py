import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns

def plot_attention_heatmap(weights: np.ndarray, tokens: list[str], title: str = 'Attention Weights Matrix') -> plt.Figure:
    """Full 2D heatmap of attention weights with token labels on both axes."""
    fig, ax = plt.subplots(figsize=(6.5, 5))
    sns.heatmap(
        weights,
        xticklabels=tokens,
        yticklabels=tokens,
        annot=True,
        cmap='Blues',
        fmt='.2f',
        cbar_kws={'label': 'Weight (Probability)'},
        vmin=0.0,
        vmax=1.0,
        ax=ax
    )
    ax.set_title(title, fontsize=12, fontweight='bold', pad=10)
    ax.set_xlabel('Key Tokens (Attended To)', fontsize=10)
    ax.set_ylabel('Query Tokens (Attending From)', fontsize=10)
    plt.tight_layout()
    return fig

def plot_token_attention_bars(weights: np.ndarray, tokens: list[str], query_token: str) -> plt.Figure:
    """Horizontal bar chart showing how much attention the selected query token pays to every key token."""
    fig, ax = plt.subplots(figsize=(7, max(3, len(tokens) * 0.45)))
    y_pos = np.arange(len(tokens))
    
    # Modern clean palette
    colors = plt.cm.Blues(np.linspace(0.4, 0.9, len(tokens)))
    bars = ax.barh(y_pos, weights, color='#2563eb', alpha=0.85, edgecolor='#1d4ed8')
    
    ax.set_yticks(y_pos)
    ax.set_yticklabels([f"[{t}]" for t in tokens], fontsize=10, fontweight='bold')
    ax.invert_yaxis()  # top-down matching sentence order
    ax.set_xlabel('Attention Weight (Softmax Probability)', fontsize=10)
    ax.set_xlim(0.0, 1.05)
    ax.set_title(f'Attention Distribution for Query: "{query_token}"', fontsize=12, fontweight='bold')
    
    # Add numerical labels
    for bar, w in zip(bars, weights):
        ax.text(bar.get_width() + 0.02, bar.get_y() + bar.get_height()/2, f"{w:.3f}",
                va='center', ha='left', fontsize=9, fontweight='semibold', color='#1e293b')
        
    ax.grid(axis='x', linestyle='--', alpha=0.4)
    plt.tight_layout()
    return fig

def plot_matrix(matrix: np.ndarray, title: str = 'Matrix', row_labels=None, col_labels=None, fmt: str = '.2f') -> plt.Figure:
    """General-purpose matrix visualization with cell values annotated."""
    nrows, ncols = matrix.shape
    fig, ax = plt.subplots(figsize=(max(4.5, ncols * 1.0), max(3.0, nrows * 0.55)))
    
    sns.heatmap(
        matrix,
        xticklabels=col_labels if col_labels is not None else [f"d{i}" for i in range(ncols)], 
        yticklabels=row_labels if row_labels is not None else [f"t{i}" for i in range(nrows)], 
        annot=True,
        cmap='viridis',
        fmt=fmt,
        cbar=True,
        ax=ax
    )
    ax.set_title(title, fontsize=11, fontweight='bold', pad=8)
    plt.tight_layout()
    return fig
