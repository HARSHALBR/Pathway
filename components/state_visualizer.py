import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import matplotlib.pyplot as plt
import numpy as np
from sklearn.decomposition import PCA

def plot_state_heatmap(states: list[np.ndarray], title: str = 'Latent State Evolution Across Rounds') -> plt.Figure:
    """Heatmap with states as rows, dimensions as columns. Color = activation value."""
    fig, ax = plt.subplots(figsize=(10, max(3.5, len(states) * 0.5)))
    data = np.stack(states)
    
    cax = ax.imshow(data, aspect='auto', cmap='magma', interpolation='nearest')
    cbar = fig.colorbar(cax, ax=ax, pad=0.02)
    cbar.set_label('Activation Value', fontsize=10)
    
    ax.set_title(title, fontsize=12, fontweight='bold', pad=10)
    ax.set_xlabel('Latent State Dimension (d)', fontsize=10)
    ax.set_ylabel('Reasoning Round', fontsize=10)
    ax.set_yticks(range(len(states)))
    ax.set_yticklabels([f"Round {i} (S_{i})" for i in range(len(states))], fontsize=9)
    plt.tight_layout()
    return fig

def plot_state_deltas(state_deltas: list[float], title: str = 'State Change Magnitude per Round (||ΔS||₂)') -> plt.Figure:
    """Bar chart of L2 norm of state changes per round."""
    fig, ax = plt.subplots(figsize=(7, 3.8))
    rounds = np.arange(1, len(state_deltas) + 1)
    
    bars = ax.bar(rounds, state_deltas, color='#10b981', edgecolor='#059669', width=0.55, alpha=0.9)
    ax.set_title(title, fontsize=12, fontweight='bold', pad=10)
    ax.set_xlabel('Reasoning Round (t → t+1)', fontsize=10)
    ax.set_ylabel('L2 Norm of Delta ||S_{t+1} - S_t||₂', fontsize=10)
    ax.set_xticks(rounds)
    ax.set_xticklabels([f"R{r}" for r in rounds])
    
    # Add numerical labels on top of bars
    for bar in bars:
        h = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2., h + max(state_deltas)*0.03,
                f'{h:.3f}', ha='center', va='bottom', fontsize=9, fontweight='semibold')
        
    ax.set_ylim(0, max(state_deltas) * 1.25 if state_deltas and max(state_deltas) > 0 else 1.0)
    ax.grid(axis='y', linestyle='--', alpha=0.4)
    plt.tight_layout()
    return fig

def plot_pca_trajectory(states: list[np.ndarray], title: str = '2D PCA Projection of State Trajectory') -> plt.Figure:
    """2D PCA scatter plot of states with directed arrows showing trajectory."""
    fig, ax = plt.subplots(figsize=(7.5, 5))
    data = np.stack(states)
    
    if data.shape[0] >= 2 and data.shape[1] >= 2:
        try:
            pca = PCA(n_components=2)
            projected = pca.fit_transform(data)
            
            # Plot trajectory line
            ax.plot(projected[:, 0], projected[:, 1], marker='o', markersize=7, 
                    linestyle='-', color='#6366f1', alpha=0.6, label='Trajectory')
            
            # Label each state node
            for i, (x, y) in enumerate(projected):
                color = '#22c55e' if i == 0 else ('#ef4444' if i == len(projected)-1 else '#3b82f6')
                label = 'S₀ (Initial)' if i == 0 else (f'S_{i} (Final)' if i == len(projected)-1 else f'S_{i}')
                ax.scatter(x, y, color=color, s=80, zorder=5)
                ax.annotate(label, (x, y), textcoords="offset points", xytext=(8, 5), 
                            fontsize=9, fontweight='bold', color='#1e293b')
                
            # Draw directed arrows between consecutive points
            for i in range(len(projected) - 1):
                dx = projected[i+1, 0] - projected[i, 0]
                dy = projected[i+1, 1] - projected[i, 1]
                ax.arrow(projected[i, 0], projected[i, 1], dx*0.85, dy*0.85, 
                         head_width=max(0.01, (np.ptp(projected[:,0]) + np.ptp(projected[:,1])) * 0.02),
                         head_length=max(0.015, (np.ptp(projected[:,0]) + np.ptp(projected[:,1])) * 0.03),
                         fc='#4f46e5', ec='#4f46e5', length_includes_head=True, alpha=0.7)
                
            exp_var = pca.explained_variance_ratio_
            ax.set_xlabel(f'Principal Component 1 ({exp_var[0]*100:.1f}% var)', fontsize=10)
            ax.set_ylabel(f'Principal Component 2 ({exp_var[1]*100:.1f}% var)', fontsize=10)
        except Exception as e:
            ax.text(0.5, 0.5, f"PCA projection unavailable: {e}", ha='center', va='center')
    else:
        ax.text(0.5, 0.5, "Need at least 2 states and dimensions for PCA trajectory", ha='center', va='center')
    
    ax.set_title(title, fontsize=12, fontweight='bold', pad=10)
    ax.grid(True, linestyle='--', alpha=0.3)
    ax.text(0.5, -0.15, '⚠️ Note: 2D PCA projection for visualization — internal model computation occurs in full latent dimension', 
            ha='center', va='center', transform=ax.transAxes, fontsize=8.5, color='#64748b')
    plt.tight_layout()
    return fig
