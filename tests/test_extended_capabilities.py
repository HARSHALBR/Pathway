import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
import numpy as np
from models.transformer_demo import TinyTransformer
from models.latent_reasoning import LatentReasoningModel
from models.tasks import generate_task, generate_batch
from components.bdh_bridge import simulate_hebbian_synaptic_step

class TestExtendedCapabilities:
    def test_transformer_layernorm_properties(self):
        """Verify that TinyTransformer applies valid Layer Normalization."""
        model = TinyTransformer(d_model=4, seed=42)
        out = model.forward('the cat chased the mouse')
        
        # Check keys exist
        assert 'ln_1' in out
        assert 'ln_2' in out
        
        # Check dimensions
        L, d = out['ln_1'].shape
        assert d == 4
        assert L == 5
        
        # Check LayerNorm properties: approximately zero mean and unit variance per token vector
        for i in range(L):
            mean_ln1 = np.mean(out['ln_1'][i])
            std_ln1 = np.std(out['ln_1'][i])
            np.testing.assert_allclose(mean_ln1, 0.0, atol=1e-5)
            np.testing.assert_allclose(std_ln1, 1.0, atol=1e-2)

    def test_token_query_breakdown(self):
        """Verify the interactive Query-Key breakdown matches manual math."""
        model = TinyTransformer(d_model=4, seed=42)
        breakdown = model.get_token_query_breakdown('the cat chased the mouse', token_idx=1)
        
        assert breakdown['token'] == 'cat'
        assert breakdown['token_idx'] == 1
        assert len(breakdown['all_tokens']) == 5
        
        # Shape checks
        assert breakdown['query_vector'].shape == (4,)
        assert breakdown['keys'].shape == (5, 4)
        assert breakdown['values'].shape == (5, 4)
        assert breakdown['scaled_scores'].shape == (5,)
        assert breakdown['weights'].shape == (5,)
        assert breakdown['accumulated_value'].shape == (4,)
        
        # Mathematical verification of scaled dot product
        expected_scaled = (breakdown['keys'] @ breakdown['query_vector']) / np.sqrt(4)
        np.testing.assert_allclose(breakdown['scaled_scores'], expected_scaled, atol=1e-6)
        
        # Softmax sum to 1
        np.testing.assert_allclose(np.sum(breakdown['weights']), 1.0, atol=1e-6)
        
        # Value accumulation matches weights @ values
        expected_accum = breakdown['weights'] @ breakdown['values']
        np.testing.assert_allclose(breakdown['accumulated_value'], expected_accum, atol=1e-6)

    def test_hebbian_synaptic_step(self):
        """Verify the Hebbian synaptic working memory formula: S_t = lambda * S_{t-1} + K_t^T * V_t."""
        d = 4
        rng = np.random.default_rng(123)
        S_prev = rng.normal(0, 1.0, size=(d, d))
        K_t = rng.normal(0, 1.0, size=d)
        V_t = rng.normal(0, 1.0, size=d)
        Q_t = rng.normal(0, 1.0, size=d)
        
        # Test with decay = 0.8
        S_t, outer_prod, O_t = simulate_hebbian_synaptic_step(S_prev, K_t, V_t, Q_t, decay_lambda=0.8)
        
        expected_outer = np.outer(K_t, V_t)
        np.testing.assert_allclose(outer_prod, expected_outer, atol=1e-6)
        
        expected_S = 0.8 * S_prev + expected_outer
        np.testing.assert_allclose(S_t, expected_S, atol=1e-6)
        
        expected_O = Q_t @ S_t
        np.testing.assert_allclose(O_t, expected_O, atol=1e-6)

    def test_latent_trajectory_progression(self):
        """Verify that R=1, R=2, R=5 execute the exact number of steps and track trajectory."""
        model = LatentReasoningModel(state_dim=16, hidden_dim=32, seed=42)
        task = generate_task(level=2, seed=10, modulus=7)
        
        res1 = model.forward(task.encoded_input, R=1, modulus=7)
        res2 = model.forward(task.encoded_input, R=2, modulus=7)
        res5 = model.forward(task.encoded_input, R=5, modulus=7)
        
        # State counts
        assert len(res1['states']) == 2  # s0, s1
        assert len(res2['states']) == 3  # s0, s1, s2
        assert len(res5['states']) == 6  # s0, s1, s2, s3, s4, s5
        
        # Trajectory prefix consistency
        np.testing.assert_allclose(res1['states'][0], res5['states'][0], atol=1e-10)
        np.testing.assert_allclose(res1['states'][1], res5['states'][1], atol=1e-10)
        np.testing.assert_allclose(res2['states'][2], res5['states'][2], atol=1e-10)
        
        # Divergence of final states
        assert not np.allclose(res1['states'][-1], res5['states'][-1])

    def test_independent_ground_truth_integrity(self):
        """Verify that ground truth is computed purely via Python integer arithmetic."""
        for lvl in [1, 2, 3, 4]:
            for seed in range(10):
                t = generate_task(level=lvl, seed=seed, modulus=11)
                a, b, c, d = t.operands
                n = t.modulus
                if lvl == 1:
                    expected = (a + b) % n
                elif lvl == 2:
                    expected = (a + b * c) % n
                elif lvl == 3:
                    expected = (a * b + c * d) % n
                elif lvl == 4:
                    expected = ((a + b) * c + d) % n
                assert t.ground_truth == expected
