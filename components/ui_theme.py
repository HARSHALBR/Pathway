"""Shared UI Design System and Theme Utilities for Latent Reasoning Laboratory.
Provides cohesive academic styling, reusable badges, equation cards, and visual components.
"""
from __future__ import annotations
import streamlit as st

def inject_custom_css() -> None:
    """Injects high-quality, academic-grade CSS for clean and responsive UI."""
    css = """
    <style>
        /* Base typography & aesthetics */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
        
        html, body, [class*="css"] {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        code, pre {
            font-family: 'JetBrains Mono', monospace !important;
        }

        /* Top Page Header Banner */
        .page-header {
            padding: 1.25rem 1.5rem;
            background: linear-gradient(135deg, rgba(30, 41, 59, 0.05) 0%, rgba(51, 65, 85, 0.08) 100%);
            border-radius: 12px;
            border-left: 5px solid #2563eb;
            margin-bottom: 1.5rem;
        }
        .page-header h1 {
            font-size: 1.9rem;
            font-weight: 700;
            color: #0f172a;
            margin: 0 0 0.25rem 0;
            letter-spacing: -0.02em;
        }
        .page-header p {
            font-size: 1.05rem;
            color: #475569;
            margin: 0;
        }
        
        /* Educational Cards */
        .lab-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 1.25rem 1.5rem;
            margin-bottom: 1rem;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .lab-card:hover {
            border-color: #cbd5e1;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.07);
        }
        .lab-card h4 {
            margin-top: 0;
            color: #1e293b;
            font-weight: 600;
        }

        /* Equation Cards */
        .eq-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-left: 4px solid #3b82f6;
            border-radius: 8px;
            padding: 1rem 1.25rem;
            margin: 0.75rem 0 1rem 0;
        }
        .eq-card .eq-title {
            font-size: 0.85rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #2563eb;
            margin-bottom: 0.5rem;
        }
        .eq-card .eq-desc {
            font-size: 0.92rem;
            color: #334155;
            margin-top: 0.5rem;
            line-height: 1.4;
        }

        /* Scientific Badges */
        .badge {
            display: inline-flex;
            align-items: center;
            font-size: 0.75rem;
            font-weight: 600;
            padding: 0.2rem 0.55rem;
            border-radius: 9999px;
            letter-spacing: 0.03em;
            text-transform: uppercase;
            margin-right: 0.4rem;
            vertical-align: middle;
        }
        .badge-live {
            background-color: #dcfce7;
            color: #15803d;
            border: 1px solid #bbf7d0;
        }
        .badge-toy {
            background-color: #fef9c3;
            color: #a16207;
            border: 1px solid #fef08a;
        }
        .badge-published {
            background-color: #dbeafe;
            color: #1d4ed8;
            border: 1px solid #bfdbfe;
        }
        .badge-primary {
            background-color: #f1f5f9;
            color: #475569;
            border: 1px solid #e2e8f0;
        }
        .badge-limitation {
            background-color: #fee2e2;
            color: #b91c1c;
            border: 1px solid #fecaca;
        }
        .badge-control {
            background-color: #ede9fe;
            color: #6d28d9;
            border: 1px solid #ddd6fe;
        }

        /* Interactive Pathway Comparison Flow */
        .flow-container {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            padding: 1rem;
            background: #f8fafc;
            border-radius: 8px;
            border: 1px dashed #cbd5e1;
            margin: 0.5rem 0;
        }
        .flow-node {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 0.5rem 0.75rem;
            font-size: 0.9rem;
            font-weight: 500;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .flow-node-token {
            border-left: 3px solid #f59e0b;
        }
        .flow-node-state {
            border-left: 3px solid #10b981;
        }
        .flow-arrow {
            text-align: center;
            color: #94a3b8;
            font-size: 0.8rem;
            margin: -0.2rem 0;
        }

        /* Metric Highlight Callout */
        .metric-banner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.85rem 1.25rem;
            border-radius: 8px;
            margin: 0.5rem 0 1rem 0;
            border: 1px solid transparent;
        }
        .metric-success {
            background-color: #f0fdf4;
            border-color: #bbf7d0;
            color: #166534;
        }
        .metric-failure {
            background-color: #fef2f2;
            border-color: #fecaca;
            color: #991b1b;
        }

        /* Custom Token Pill */
        .token-pill {
            display: inline-block;
            background: #e0e7ff;
            color: #3730a3;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.85rem;
            font-weight: 600;
            padding: 0.2rem 0.6rem;
            border-radius: 6px;
            margin: 0.15rem;
            border: 1px solid #c7d2fe;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
            .page-header h1 { font-size: 1.5rem; }
            .page-header p { font-size: 0.95rem; }
        }
    </style>
    """
    st.markdown(css, unsafe_allow_html=True)

def render_header(title: str, subtitle: str, badge: str | None = None) -> None:
    """Renders a standardized page header with optional badge."""
    badge_html = f"<div style='margin-bottom: 0.5rem;'>{badge}</div>" if badge else ""
    header_html = f"""
    <div class="page-header">
        {badge_html}
        <h1>{title}</h1>
        <p>{subtitle}</p>
    </div>
    """
    st.markdown(header_html, unsafe_allow_html=True)

def render_badge(badge_type: str, text: str | None = None) -> str:
    """Returns HTML for a scientific evidence/status badge.
    Types: 'live', 'toy', 'published', 'primary', 'limitation', 'control'
    """
    labels = {
        'live': '🟢 LIVE COMPUTATION',
        'toy': '🟡 TOY MODEL',
        'published': '🔵 PUBLISHED RESULT',
        'primary': '⚪ PRIMARY SOURCE',
        'limitation': '⚠️ FAILURE / LIMITATION',
        'control': '🧪 EXPERIMENT CONTROL'
    }
    css_classes = {
        'live': 'badge badge-live',
        'toy': 'badge badge-toy',
        'published': 'badge badge-published',
        'primary': 'badge badge-primary',
        'limitation': 'badge badge-limitation',
        'control': 'badge badge-control'
    }
    label = text if text else labels.get(badge_type, badge_type.upper())
    css_cls = css_classes.get(badge_type, 'badge badge-primary')
    return f'<span class="{css_cls}">{label}</span>'

def render_equation_card(title: str, latex_eq: str, plain_english: str, numbers_example: str | None = None) -> None:
    """Renders a clean educational equation card with:
    1. Title
    2. LaTeX equation
    3. Plain-English interpretation
    4. Optional concrete numerical trace
    """
    st.markdown(f"""
    <div class="eq-card">
        <div class="eq-title">{title}</div>
    </div>
    """, unsafe_allow_html=True)
    st.latex(latex_eq)
    st.markdown(f"""
    <div style="font-size: 0.95rem; color: #334155; margin-top: -0.5rem; margin-bottom: 0.5rem;">
        <strong>Meaning:</strong> {plain_english}
    </div>
    """, unsafe_allow_html=True)
    if numbers_example:
        st.caption(f"**Numerical instance:** {numbers_example}")
