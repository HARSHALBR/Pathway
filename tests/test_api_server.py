import pytest
from fastapi.testclient import TestClient
from api.server import app

client = TestClient(app)

class TestApiServer:
    def test_health_check(self):
        resp = client.get("/api/health")
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "healthy"
        assert "transformer" in data["models"]
        assert "latent_reasoning" in data["models"]
        assert data["models"]["transformer"]["d_model"] == 4

    def test_transformer_forward_valid(self):
        payload = {"sentence": "The cat sat on the mat"}
        resp = client.post("/api/transformer/forward", json=payload)
        assert resp.status_code == 200
        data = resp.json()
        tokens = data["tokens"]
        assert len(tokens) == 6
        assert len(data["X"]) == 6
        assert len(data["X"][0]) == 4
        assert len(data["scores"]) == 6
        assert len(data["scores"][0]) == 6
        assert len(data["attention_weights"]) == 6
        # Softmax rows should sum to 1.0
        for row in data["attention_weights"]:
            assert pytest.approx(sum(row), abs=1e-5) == 1.0

    def test_attention_analyze_valid(self):
        payload = {"sentence": "The cat sat on the mat", "query_token_idx": 1}
        resp = client.post("/api/attention/analyze", json=payload)
        assert resp.status_code == 200
        data = resp.json()
        assert data["query_token"] == "cat"
        assert len(data["query_vector"]) == 4
        assert len(data["comparisons"]) == 6
        for comp in data["comparisons"]:
            assert "dot_product" in comp
            assert "scaled_score" in comp
            assert "attention_weight" in comp
            assert len(comp["key_vector"]) == 4

    def test_attention_analyze_invalid_index(self):
        payload = {"sentence": "The cat sat", "query_token_idx": 10}
        resp = client.post("/api/attention/analyze", json=payload)
        assert resp.status_code == 400
        assert "out of range" in resp.json()["detail"]

    def test_task_generate_deterministic(self):
        payload = {"level": 2, "modulus": 11, "seed": 42}
        resp1 = client.post("/api/task/generate", json=payload)
        resp2 = client.post("/api/task/generate", json=payload)
        assert resp1.status_code == 200
        assert resp1.json() == resp2.json()
        data = resp1.json()
        assert data["modulus"] == 11
        assert data["level"] == 2
        assert len(data["encoded_input"]) == 6

    def test_explicit_solve_valid(self):
        payload = {"level": 2, "modulus": 11, "seed": 42}
        resp = client.post("/api/explicit/solve", json=payload)
        assert resp.status_code == 200
        data = resp.json()
        assert "steps" in data
        assert len(data["steps"]) > 0
        assert data["token_count"] == len(data["tokens"])
        assert data["correct"] is True
        assert data["computation_proxy"]["internal_state_updates"] == 0

    def test_latent_run_trajectory(self):
        for r_val in [1, 3, 5]:
            payload = {"level": 2, "modulus": 11, "seed": 42, "R": r_val}
            resp = client.post("/api/latent/run", json=payload)
            assert resp.status_code == 200
            data = resp.json()
            assert data["R"] == r_val
            assert len(data["states"]) == r_val + 1
            assert len(data["state_deltas"]) == r_val
            assert len(data["pca_trajectory"]) == r_val + 1
            assert len(data["states"][0]) == 48

    def test_latent_sweep_curve(self):
        payload = {"level": 2, "modulus": 11, "seed": 42, "max_R": 10}
        resp = client.post("/api/latent/sweep", json=payload)
        assert resp.status_code == 200
        data = resp.json()
        assert len(data["curve"]) == 10
        for pt in data["curve"]:
            assert 1 <= pt["R"] <= 10
            assert "confidence" in pt
            assert "correct" in pt

    def test_bdh_simulate_step(self):
        payload = {"decay_lambda": 0.85, "step": 1}
        resp = client.post("/api/bdh/simulate", json=payload)
        assert resp.status_code == 200
        data = resp.json()
        assert len(data["S_prev"]) == 4
        assert len(data["S_prev"][0]) == 4
        assert len(data["outer_product"]) == 4
        assert len(data["outer_product"][0]) == 4
        assert len(data["S_new"]) == 4
        assert len(data["O_t"]) == 4

    def test_bdh_simulate_decay_extremes(self):
        # Lambda = 0: decayed past memory must be all zeros
        resp_zero = client.post("/api/bdh/simulate", json={"decay_lambda": 0.0, "step": 2})
        assert resp_zero.status_code == 200
        decayed = resp_zero.json()["decayed_S_prev"]
        for row in decayed:
            for val in row:
                assert val == 0.0
