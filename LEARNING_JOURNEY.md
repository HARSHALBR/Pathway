# Learning Journey: Latent Reasoning Laboratory

## Learner Persona
A developer or student who understands basic machine learning concepts but lacks deep intuition about Transformer internals (Q/K/V, embeddings) and has no exposure to "latent reasoning" or evolving hidden states.

## Core Educational Philosophy
**DO → SEE → UNDERSTAND → EXPLAIN**
Never present a block of text explaining a concept without first having the user click, slide, or toggle a parameter that visibly executes the math of that concept.

---

## Screen-by-Screen Journey

### PAGE 1: Start Here (Motivation)
- **Concept:** Why are we here?
- **Interaction:** A simple, hard reasoning problem that a standard model fails on. A button: "Can you make a machine understand this?"
- **Takeaway:** Reasoning is hard for machines. We need to look inside to understand why.

### PAGE 2: Tokens & Embeddings
- **Concept:** Text to Numbers.
- **Micro-Experiment 1 (Tokens):** Click a word in "The cat sleeps". See its integer ID and resulting vector.
- **Micro-Experiment 2 (Dimension):** Slider for Embedding Dimension ($d \in \{2, 4, 8\}$). Watch the matrix physically resize on screen.
- **Takeaway:** Words are just points in a high-dimensional mathematical space.

### PAGE 3: Attention Mechanics
- **Concept:** Position and Context.
- **Micro-Experiment 3 (Position):** Drag/swap words "The cat eats". Watch the positional encoding vector change visually.
- **Micro-Experiment 4 (Q/K/V Matching):** Select a token (e.g., "cat"). Display its "Query" vector. Display the "Key" vectors for all other words. Show the dot-product similarity scores lighting up a heatmap.
- **Takeaway:** Attention is just mathematical compatibility scoring between words.

### PAGE 4: Explicit vs. Latent Reasoning
- **Concept:** Emitting vs. Internalizing.
- **Micro-Experiment 5 (CoT):** Solve `7 + 3 * 5 mod 11`. Watch the explicit model emit token 1, token 2, token 3.
- **Micro-Experiment 6 (Latent Shift):** Toggle to Latent mode. Watch tokens disappear, replaced by $H_0 \rightarrow H_1 \rightarrow H_2$.
- **Takeaway:** Reasoning can happen inside the model's state instead of on the screen.

### PAGE 5: Reasoning Rounds & "Break It"
- **Concept:** Iterative updates.
- **Micro-Experiment 7 (Rounds):** Slider for Reasoning Rounds ($R \in \{1, 2, ..., 5\}$). See how accuracy changes on a hard task.
- **Micro-Experiment 8 (Break It):** Set task difficulty to "Hard" and $R=1$. Watch it fail. Increase $R=5$. Watch it succeed. 
- **Takeaway:** More internal computation can help, but it is not magic. It has limits.

### PAGE 6: State Visualization
- **Concept:** Opening the black box.
- **Micro-Experiment 9 (Trajectory):** View the latent state trajectory across $R$ rounds via Heatmap and PCA projection.
- **Takeaway:** Latent reasoning is an iterative geometric transformation of vectors.

### PAGE 7: BDH & BDH-CQ Integration
- **Concept:** Connecting toy concepts to real research.
- **Information:** Explain how BDH uses a dynamic synaptic state instead of our simple MLP update. Explain BDH-CQ's continuous recurrent loop. 
- **Labels:** Strictly partition "Our Toy Results" 🟢 from "Published Results" 🔵.
- **Takeaway:** Toy models build intuition; real architectures handle scale, associative recall, and complexity.

### PAGE 8: Learning Test
- **Concept:** Verification.
- **Interaction:** 3-5 multiple choice questions testing the conceptual takeaways from the journey. Immediate feedback.
