# 🧪 Latent Reasoning Laboratory

**An interactive computational laboratory for understanding alternatives to Chain-of-Thought reasoning.**

## What Will You Learn?

After using this laboratory, you will understand:
- How Transformers process tokens through self-attention
- What Chain-of-Thought reasoning is and why it's used
- How latent/iterative reasoning offers an alternative computational approach
- The difference between emitting intermediate tokens and refining internal state
- How BDH/BDH-CQ architectures implement recurrent latent reasoning
- The trade-offs between explicit and latent reasoning (accuracy, cost, observability)

## Demo

> 📍 *Demo link placeholder — to be deployed*

> 🖼️ *Screenshots/GIF placeholder*

## Central Question

> *"Can a model perform useful multi-step reasoning by refining internal state instead of emitting every intermediate reasoning step as natural-language tokens?"*

## Architecture

```
Latent Reasoning Laboratory
├── models/          # Core computation (no UI dependencies)
│   ├── tasks.py             # Synthetic modular arithmetic task generator
│   ├── transformer_demo.py  # Tiny educational Transformer
│   ├── explicit_reasoning.py# Mode A: Symbolic step-by-step solver
│   └── latent_reasoning.py  # Mode B: Recurrent latent state model
├── components/      # Visualization helpers (matplotlib)
├── pages/           # Streamlit UI pages
├── experiments/     # Training and sweep scripts
├── tests/           # Unit tests (pytest)
└── docs/            # Sources and provenance
```

## Mathematical Formulation

### Toy Latent Reasoning Model

**Encoding:**
```
s₀ = ReLU(W_enc · x + b_enc)
```

**Recurrent update (R rounds, shared weights):**
```
s_{t+1} = s_t + α · W₂ · tanh(W₁ · s_t + b₁)
```

**Readout:**
```
ŷ = softmax(W_out · s_R + b_out)
```

This is a toy educational model, NOT the BDH/BDH-CQ architecture.

## How the Interactive Experiment Works

1. A modular arithmetic task is generated (e.g., `7 + 3 × 5 mod 11`)
2. The user selects reasoning mode: Explicit (tokenized) or Latent (state-based)
3. The user adjusts reasoning rounds R (1-10)
4. The system executes real computation — no pre-cached results
5. Ground truth, predictions, state trajectories, and computation costs are displayed
6. The user observes how changing R affects accuracy and internal state evolution

## How to Run Locally

```bash
# Install dependencies
pip install -r requirements.txt

# (Optional) Pre-train the latent model
python experiments/pretrain.py

# Run the application
streamlit run main.py
```

## How Synthetic Tasks Are Generated

- **Task type:** Modular arithmetic expressions
- **Difficulty levels:** 1 (a+b mod n) through 4 ((a+b)×c+d mod n)
- **Moduli:** Primes from {7, 11, 13, 17, 19, 23}
- **Ground truth:** Computed by Python's exact integer arithmetic
- **Reproducibility:** Seed-controlled random generation

## What Is Live Computation

🟢 All model predictions, state trajectories, and computation proxies are computed in real-time when you interact with the UI.

## What Is Precomputed

The latent model's weights are pre-trained on modular arithmetic tasks. Training can be re-run via `python experiments/pretrain.py`.

## What Is Illustrative

🟡 Simplified architectural diagrams, the BDH/Transformer comparison table, and conceptual explanations are educational simplifications.

## BDH/BDH-CQ Sources

| Paper | arXiv | Authors |
|-------|-------|---------|
| The Dragon Hatchling | [2509.26507](https://arxiv.org/abs/2509.26507) | Kosowski et al. (Pathway, 2025) |
| BDH-CQ: In-Context Learning with Recurrent Latent Reasoning | [2608.09888](https://arxiv.org/abs/2608.09888) | Engdahl, Kosowski, Chorowski (2026) |

See [docs/sources.md](docs/sources.md) for the complete provenance catalog.

## Limitations

- The toy latent model is a simple MLP-based recurrent network, NOT the BDH architecture
- The explicit reasoning mode is a symbolic solver, not a neural model
- The comparison teaches computational concepts, not benchmarking two production systems
- The toy model's accuracy is limited by its small parameter count and training distribution
- Latent reasoning is NOT universally superior to CoT — this project demonstrates both strengths and weaknesses

## AI-Assisted Development Disclosure

AI tools were used in the development of this project for:
- Coding assistance and implementation
- Debugging and testing
- Documentation writing
- Design brainstorming and architecture planning

All technical claims have been verified against primary sources. All computation is genuine.

## License

MIT License. See [LICENSE](LICENSE).

## Credits

- BDH architecture: Pathway (Kosowski et al.)
- BDH-CQ: Engdahl, Kosowski, Chorowski (Pathway, Bielik AI, NYU)
- Transformer foundations: Vaswani et al. (2017)
- Chain-of-Thought: Wei et al. (2022)
- COCONUT: Hao et al. (Meta AI, 2024)
