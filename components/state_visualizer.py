import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import matplotlib.pyplot as plt
import numpy as np
from sklearn.decomposition import PCA

def plot_state_heatmap(states: list[np.ndarray], title='State Evolution') -> plt.Figure:
    """Heatmap with states as rows, dimensions as columns. Color = activation value."""
    fig, ax = plt.subplots(figsize=(10, 6))
    data = np.stack(states)
    cax = ax.imshow(data, aspect='auto', cmap='viridis')
    fig.colorbar(cax, ax=ax)
    ax.set_title(title)
    ax.set_xlabel('Dimension')
    ax.set_ylabel('Reasoning Round')
    return fig

def plot_state_deltas(state_deltas: list[float], title='State Change Magnitude') -> plt.Figure:
    """Bar chart of L2 norm of state changes per round."""
    fig, ax = plt.subplots(figsize=(8, 4))
    ax.bar(range(1, len(state_deltas) + 1), state_deltas, color='skyblue')
    ax.set_title(title)
    ax.set_xlabel('Reasoning Round')
    ax.set_ylabel('L2 Norm of Delta')
    ax.set_xticks(range(1, len(state_deltas) + 1))
    return fig

def plot_pca_trajectory(states: list[np.ndarray], title='State Trajectory (PCA Projection)') -> plt.Figure:
    """2D PCA scatter plot of states with arrows showing trajectory."""
    fig, ax = plt.subplots(figsize=(8, 6))
    data = np.stack(states)
    if data.shape[0] > 1 and data.shape[1] > 1:
        pca = PCA(n_components=2)
        try:
            projected = pca.fit_transform(data)
            ax.plot(projected[:, 0], projected[:, 1], marker='o', linestyle='-', color='b')
            for i, (x, y) in enumerate(projected):
                ax.annotate(f'S{i}', (x, y), textcoords="offset points", xytext=(5,5), ha='center')
            for i in range(len(projected) - 1):
                ax.annotate('', xy=projected[i+1], xytext=projected[i], arrowprops=dict(arrowstyle="->", color='b'))
        except Exception as e:
            ax.text(0.5, 0.5, "PCA failed", ha='center')
    else:
        ax.text(0.5, 0.5, "Not enough data for PCA", ha='center')
    
    ax.set_title(title)
    ax.text(0.5, -0.15, 'Visualization projection (PCA) — not the actual model state', 
            ha='center', va='center', transform=ax.transAxes, fontsize=10, color='gray')
    return fig
