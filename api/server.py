import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import numpy as np
from sklearn.decomposition import PCA

from models.transformer_demo import TinyTransformer
from models.latent_reasoning import LatentReasoningModel
from models.tasks import generate_task, Task
from models.explicit_reasoning import ExplicitSolver
from components.bdh_bridge import simulate_hebbian_synaptic_step

app = FastAPI(
    title="Pathway Latent Reasoning Laboratory API",
    description="Computational backend serving pure NumPy models for Transformer attention, explicit/latent reasoning, and BDH Hebbian memory.",
    version="2.0.0"
)

# Enable CORS for local React/Vite development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize models deterministically
transformer_model = TinyTransformer(d_model=4, seed=42)
latent_model = LatentReasoningModel(state_dim=48, hidden_dim=96, max_classes=23, alpha=0.5, seed=42)

weights_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'generated', 'pretrained_weights.npz')
if os.path.exists(weights_path):
    try:
        latent_model.load_weights(weights_path)
    except Exception as e:
        print(f"Warning: Could not load pretrained weights: {e}")

explicit_solver = ExplicitSolver()

# --- Schemas ---

class TransformerForwardRequest(BaseModel):
    sentence: str = Field(default="The cat sat on the mat", description="Input sentence containing vocabulary tokens")

class AttentionAnalyzeRequest(BaseModel):
    sentence: str = Field(default="The cat sat on the mat")
    query_token_idx: int = Field(default=1, description="0-indexed position of query token")

class TaskGenerateRequest(BaseModel):
    level: int = Field(default=2, ge=1, le=4)
    modulus: Optional[int] = Field(default=11)
    seed: Optional[int] = Field(default=42)

class ExplicitSolveRequest(BaseModel):
    level: int = Field(default=2, ge=1, le=4)
    modulus: int = Field(default=11)
    seed: Optional[int] = Field(default=42)

class LatentRunRequest(BaseModel):
    level: int = Field(default=2, ge=1, le=4)
    modulus: int = Field(default=11)
    seed: Optional[int] = Field(default=42)
    R: int = Field(default=3, ge=1, le=10)

class LatentSweepRequest(BaseModel):
    level: int = Field(default=2, ge=1, le=4)
    modulus: int = Field(default=11)
    seed: Optional[int] = Field(default=42)
    max_R: int = Field(default=10, ge=1, le=10)

class BDHSimulateRequest(BaseModel):
    decay_lambda: float = Field(default=0.85, ge=0.0, le=1.0)
    step: int = Field(default=1, ge=1, le=10)

# --- Endpoints ---

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Pathway Latent Reasoning Laboratory API",
        "models": {
            "transformer": {"d_model": 4, "vocab_size": len(TinyTransformer.VOCAB)},
            "latent_reasoning": {"state_dim": latent_model.state_dim, "hidden_dim": latent_model.hidden_dim},
            "explicit_solver": {"ready": True}
        }
    }

@app.post("/api/transformer/forward")
def transformer_forward(req: TransformerForwardRequest):
    try:
        res = transformer_model.forward(req.sentence)
        return {
            "sentence": req.sentence,
            "tokens": res["tokens"],
            "token_ids": res["token_ids"],
            "X": res["X"].tolist(),
            "P": res["P"].tolist(),
            "H0": res["H0"].tolist(),
            "Q": res["Q"].tolist(),
            "K": res["K"].tolist(),
            "V": res["V"].tolist(),
            "scores": res["scores"].tolist(),
            "attention_weights": res["attention_weights"].tolist(),
            "attention_output": res["attention_output"].tolist(),
            "residual_1": res["residual_1"].tolist(),
            "ln_1": res["ln_1"].tolist(),
            "ffn_output": res["ffn_output"].tolist(),
            "ln_2": res["ln_2"].tolist(),
            "vocab": TinyTransformer.VOCAB,
            "vocab_size": len(TinyTransformer.VOCAB),
            "d_model": transformer_model.d_model
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Transformer forward error: {str(e)}")

@app.post("/api/attention/analyze")
def attention_analyze(req: AttentionAnalyzeRequest):
    try:
        res = transformer_model.forward(req.sentence)
        tokens = res["tokens"]
        if req.query_token_idx < 0 or req.query_token_idx >= len(tokens):
            raise HTTPException(status_code=400, detail=f"query_token_idx {req.query_token_idx} out of range (0-{len(tokens)-1})")
        
        breakdown = transformer_model.get_token_query_breakdown(req.sentence, req.query_token_idx)
        all_tokens = breakdown["all_tokens"]
        comparisons = []
        for i, tok in enumerate(all_tokens):
            comparisons.append({
                "key_idx": i,
                "key_token": tok,
                "key_vector": breakdown["keys"][i].tolist(),
                "dot_product": round(float(breakdown["raw_dots"][i]), 4),
                "scaled_score": round(float(breakdown["scaled_scores"][i]), 4),
                "attention_weight": round(float(breakdown["weights"][i]), 4),
                "value_vector": breakdown["values"][i].tolist(),
                "weighted_value": breakdown["weighted_values"][i].tolist()
            })
            
        return {
            "query_token_idx": breakdown["token_idx"],
            "query_token": breakdown["token"],
            "query_vector": breakdown["query_vector"].tolist(),
            "tokens": all_tokens,
            "accumulated_value": breakdown["accumulated_value"].tolist(),
            "out_representation": breakdown["out_representation"].tolist(),
            "comparisons": comparisons
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Attention analysis error: {str(e)}")

@app.post("/api/task/generate")
def task_generate(req: TaskGenerateRequest):
    try:
        t = generate_task(level=req.level, seed=req.seed, modulus=req.modulus)
        return {
            "expression": t.expression,
            "ground_truth": int(t.ground_truth),
            "operands": t.operands,
            "modulus": int(t.modulus),
            "level": int(t.level),
            "encoded_input": t.encoded_input.tolist()
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Task generation error: {str(e)}")

@app.post("/api/explicit/solve")
def explicit_solve(req: ExplicitSolveRequest):
    try:
        t = generate_task(level=req.level, seed=req.seed, modulus=req.modulus)
        res = explicit_solver.solve(t)
        return {
            "expression": t.expression,
            "ground_truth": int(t.ground_truth),
            "modulus": int(t.modulus),
            "level": int(t.level),
            "steps": res["steps"],
            "tokens": res["tokens"],
            "answer": int(res["answer"]),
            "token_count": int(res["token_count"]),
            "correct": bool(res["correct"]),
            "computation_proxy": res["computation_proxy"]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Explicit solver error: {str(e)}")

@app.post("/api/latent/run")
def latent_run(req: LatentRunRequest):
    try:
        t = generate_task(level=req.level, seed=req.seed, modulus=req.modulus)
        res = latent_model.forward(t.encoded_input, R=req.R, modulus=t.modulus)
        
        states = res["states"]
        state_deltas = res["state_deltas"]
        probs = res["probabilities"].tolist()
        
        # 2D PCA projection for trajectory
        pca_points = []
        data = np.stack(states)
        if len(states) >= 2 and data.shape[1] >= 2:
            pca = PCA(n_components=2)
            coords = pca.fit_transform(data)
            for i, c in enumerate(coords):
                pca_points.append({
                    "round": i,
                    "label": f"S_{i}",
                    "x": round(float(c[0]), 4),
                    "y": round(float(c[1]), 4)
                })
        else:
            pca_points = [{"round": 0, "label": "S_0", "x": 0.0, "y": 0.0}]
            
        prediction = int(res["prediction"])
        confidence = float(probs[prediction]) if prediction < len(probs) else 0.0
        
        return {
            "expression": t.expression,
            "ground_truth": int(t.ground_truth),
            "modulus": int(t.modulus),
            "level": int(t.level),
            "R": req.R,
            "states": [s.tolist() for s in states],
            "state_deltas": [float(d) for d in state_deltas],
            "prediction": prediction,
            "correct": bool(prediction == t.ground_truth),
            "confidence": confidence,
            "probabilities": probs,
            "pca_trajectory": pca_points,
            "computation_proxy": res["computation_proxy"]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Latent run error: {str(e)}")

@app.post("/api/latent/sweep")
def latent_sweep(req: LatentSweepRequest):
    try:
        t = generate_task(level=req.level, seed=req.seed, modulus=req.modulus)
        curve = []
        for r in range(1, req.max_R + 1):
            res = latent_model.forward(t.encoded_input, R=r, modulus=t.modulus)
            pred = int(res["prediction"])
            probs = res["probabilities"]
            conf = float(probs[pred]) if pred < len(probs) else 0.0
            gt_prob = float(probs[t.ground_truth]) if t.ground_truth < len(probs) else 0.0
            curve.append({
                "R": r,
                "prediction": pred,
                "ground_truth": int(t.ground_truth),
                "correct": bool(pred == t.ground_truth),
                "confidence": round(conf, 4),
                "gt_prob": round(gt_prob, 4)
            })
        return {
            "expression": t.expression,
            "ground_truth": int(t.ground_truth),
            "modulus": int(t.modulus),
            "level": int(t.level),
            "curve": curve
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Latent sweep error: {str(e)}")

@app.post("/api/bdh/simulate")
def bdh_simulate(req: BDHSimulateRequest):
    try:
        np.random.seed(req.step * 17)
        # Deterministic 4x4 initial state and key/value/query vectors
        d = 4
        S_prev = np.random.uniform(-0.5, 0.5, size=(d, d))
        K_t = np.random.uniform(-1.0, 1.0, size=(d,))
        V_t = np.random.uniform(-1.0, 1.0, size=(d,))
        Q_t = np.random.uniform(-1.0, 1.0, size=(d,))
        
        S_new, outer_prod, O_t = simulate_hebbian_synaptic_step(
            S_prev=S_prev, K_t=K_t, V_t=V_t, Q_t=Q_t, decay_lambda=req.decay_lambda
        )
        
        return {
            "decay_lambda": req.decay_lambda,
            "step": req.step,
            "S_prev": S_prev.tolist(),
            "decayed_S_prev": (req.decay_lambda * S_prev).tolist(),
            "K_t": K_t.tolist(),
            "V_t": V_t.tolist(),
            "Q_t": Q_t.tolist(),
            "outer_product": outer_prod.tolist(),
            "S_new": S_new.tolist(),
            "O_t": O_t.tolist()
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"BDH simulator error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api.server:app", host="127.0.0.1", port=8000, reload=True)
