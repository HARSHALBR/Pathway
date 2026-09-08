# Sources and Evidence Provenance

This document catalogs all external claims, results, and references used in the Latent Reasoning Laboratory.

## Evidence Categories

| Label | Meaning |
|-------|--------|
| 🟢 OUR RESULTS | Computed live by our implementation |
| 🔵 PUBLISHED | From cited papers, not reproduced by us |
| 🟡 ILLUSTRATIVE | Simplified diagrams or explanations |
| ⚪ PRIMARY SOURCE | Direct from original research papers |
| 🟠 SECONDARY SOURCE | Explanatory material (blogs, videos) |

## Primary Sources

### BDH (Baby Dragon Hatchling)
- **Title:** The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain
- **Authors:** Adrian Kosowski, Przemysław Uznański, Jan Chorowski, Zuzanna Stamirowska, Michał Bartoszkiewicz
- **Affiliation:** Pathway
- **arXiv:** [2509.26507](https://arxiv.org/abs/2509.26507)
- **Date:** September 2025
- **Used for:** BDH architecture description, synaptic state dynamics equation, comparison with Transformers

### BDH-CQ
- **Title:** BDH-CQ: In-Context Learning with Recurrent Latent Reasoning
- **Authors:** Björn Engdahl, Adrian Kosowski, Jan Chorowski
- **Affiliations:** Pathway, Bielik AI, New York University
- **arXiv:** [2608.09888](https://arxiv.org/abs/2608.09888)
- **Date:** August 2026
- **Used for:** Recurrent latent reasoning formulation, ARC-AGI-1 results, cost-accuracy comparison

### Coconut (COCONUT)
- **Title:** Training Large Language Models to Reason in a Continuous Latent Space
- **Authors:** Shibo Hao, Sainbayar Sukhbaatar, DiJia Su, Xian Li, Zhiting Hu, Jason Weston, Yuandong Tian
- **Affiliations:** Meta AI, UCSD
- **arXiv:** [2412.06769](https://arxiv.org/abs/2412.06769)
- **Venue:** COLM 2025
- **Used for:** Related work on continuous latent reasoning

### Pause Tokens
- **Title:** Think before you speak: Training Language Models with Pause Tokens
- **Authors:** Sachin Goyal, Ziwei Ji, Ankit Singh Rawat, Aditya Krishna Menon, Sanjiv Kumar, Vaishnavh Nagarajan
- **Affiliations:** Google DeepMind, CMU
- **arXiv:** [2310.02226](https://arxiv.org/abs/2310.02226)
- **Venue:** ICLR 2024
- **Used for:** Related work on additional test-time computation

### Quiet-STaR
- **Title:** Quiet-STaR: Language Models Can Teach Themselves to Think Before Speaking
- **Authors:** Eric Zelikman, Georges Harik, Yijia Shao, Varuna Jayasiri, Nick Haber, Noah D. Goodman
- **Affiliation:** Stanford University
- **arXiv:** [2403.09629](https://arxiv.org/abs/2403.09629)
- **Date:** March 2024
- **Used for:** Related work on hidden rationale tokens

### Attention Is All You Need
- **Title:** Attention Is All You Need
- **Authors:** Vaswani, Shazeer, Parmar, Uszkoreit, Jones, Gomez, Kaiser, Polosukhin
- **Venue:** NeurIPS 2017
- **Used for:** Transformer architecture fundamentals, self-attention equations

### Chain-of-Thought Prompting
- **Title:** Chain-of-Thought Prompting Elicits Reasoning in Large Language Models
- **Authors:** Jason Wei, Xuezhi Wang, Dale Schuurmans, Maarten Bosma, Brian Ichter, Fei Xia, Ed Chi, Quoc Le, Denny Zhou
- **Venue:** NeurIPS 2022
- **Used for:** CoT concept and terminology

## Published Results Used

| Result | Source | Label |
|--------|--------|-------|
| BDH-CQ: 29.5% pass@2 on ARC-AGI-1 | arXiv:2608.09888 | 🔵 PUBLISHED |
| BDH-CQ: $0.0007 inference cost per task | arXiv:2608.09888 | 🔵 PUBLISHED |
| BDH-CQ: 150M parameters | arXiv:2608.09888 | 🔵 PUBLISHED |
| Synaptic state Hebbian dynamics equation | arXiv:2509.26507 | ⚪ PRIMARY SOURCE |
| BDH-CQ recurrent reasoning loop | arXiv:2608.09888 | ⚪ PRIMARY SOURCE |

## Our Results

All results labeled 🟢 OUR RESULTS are computed live by the toy model implementation in this project. They are NOT BDH or BDH-CQ results.

## Illustrative Content

All diagrams, simplified comparisons, and conceptual explanations labeled 🟡 ILLUSTRATIVE are educational simplifications and may not capture the full complexity of the referenced architectures.
