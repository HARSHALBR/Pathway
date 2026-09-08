import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
import numpy as np
from models.latent_reasoning import LatentReasoningModel
from models.tasks import generate_task, generate_batch

class TestLatentModel:
    def setup_method(self):
        self.model = LatentReasoningModel(state_dim=16, hidden_dim=32, seed=42)
    
    def test_forward_returns_all_keys(self):
        task = generate_task(level=1, seed=0, modulus=7)
        result = self.model.forward(task.encoded_input, R=3, modulus=7)
        required = ['states', 'prediction', 'probabilities', 'state_deltas', 'computation_proxy']
        for key in required:
            assert key in result, f'Missing key: {key}'
    
    def test_state_trajectory_length(self):
        """states should have R+1 elements (s0 through sR)."""
        task = generate_task(level=1, seed=0, modulus=7)
        for R in [1, 3, 5, 8]:
            result = self.model.forward(task.encoded_input, R=R, modulus=7)
            assert len(result['states']) == R + 1
    
    def test_state_dimensions(self):
        task = generate_task(level=1, seed=0, modulus=7)
        result = self.model.forward(task.encoded_input, R=3, modulus=7)
        for s in result['states']:
            assert s.shape == (16,)  # state_dim=16
    
    def test_prediction_in_range(self):
        task = generate_task(level=1, seed=0, modulus=7)
        result = self.model.forward(task.encoded_input, R=3, modulus=7)
        assert 0 <= result['prediction'] < 7
    
    def test_probabilities_sum_to_one(self):
        task = generate_task(level=1, seed=0, modulus=7)
        result = self.model.forward(task.encoded_input, R=3, modulus=7)
        np.testing.assert_allclose(result['probabilities'].sum(), 1.0, atol=1e-6)
    
    def test_probabilities_shape(self):
        task = generate_task(level=1, seed=0, modulus=7)
        result = self.model.forward(task.encoded_input, R=3, modulus=7)
        assert result['probabilities'].shape == (7,)
    
    def test_changing_R_changes_output(self):
        """Different R should produce different state trajectories."""
        task = generate_task(level=1, seed=0, modulus=7)
        r1 = self.model.forward(task.encoded_input, R=1, modulus=7)
        r5 = self.model.forward(task.encoded_input, R=5, modulus=7)
        # States at s1 should be same (same first round)
        np.testing.assert_allclose(r1['states'][1], r5['states'][1], atol=1e-10)
        # But final states differ because R differs
        assert not np.allclose(r1['states'][-1], r5['states'][-1])
    
    def test_changing_task_changes_output(self):
        t1 = generate_task(level=1, seed=0, modulus=7)
        t2 = generate_task(level=1, seed=1, modulus=7)
        r1 = self.model.forward(t1.encoded_input, R=3, modulus=7)
        r2 = self.model.forward(t2.encoded_input, R=3, modulus=7)
        assert not np.allclose(r1['states'][0], r2['states'][0])
    
    def test_state_deltas_length(self):
        task = generate_task(level=1, seed=0, modulus=7)
        result = self.model.forward(task.encoded_input, R=5, modulus=7)
        assert len(result['state_deltas']) == 5
    
    def test_state_deltas_are_positive(self):
        task = generate_task(level=1, seed=0, modulus=7)
        result = self.model.forward(task.encoded_input, R=5, modulus=7)
        for d in result['state_deltas']:
            assert d >= 0
    
    def test_computation_proxy(self):
        task = generate_task(level=1, seed=0, modulus=7)
        result = self.model.forward(task.encoded_input, R=3, modulus=7)
        proxy = result['computation_proxy']
        assert proxy['reasoning_tokens_emitted'] == 0
        assert proxy['internal_state_updates'] == 3
    
    def test_save_load_weights(self, tmp_path):
        task = generate_task(level=1, seed=0, modulus=7)
        r_before = self.model.forward(task.encoded_input, R=3, modulus=7)
        
        path = str(tmp_path / 'weights.npz')
        self.model.save_weights(path)
        
        model2 = LatentReasoningModel(state_dim=16, hidden_dim=32, seed=99)  # different seed
        model2.load_weights(path)
        r_after = model2.forward(task.encoded_input, R=3, modulus=7)
        
        assert r_before['prediction'] == r_after['prediction']
        np.testing.assert_allclose(r_before['states'][-1], r_after['states'][-1], atol=1e-10)
    
    def test_reproducibility(self):
        m1 = LatentReasoningModel(state_dim=16, hidden_dim=32, seed=42)
        m2 = LatentReasoningModel(state_dim=16, hidden_dim=32, seed=42)
        task = generate_task(level=1, seed=0, modulus=7)
        r1 = m1.forward(task.encoded_input, R=3, modulus=7)
        r2 = m2.forward(task.encoded_input, R=3, modulus=7)
        np.testing.assert_array_equal(r1['states'][-1], r2['states'][-1])
    
    def test_param_count(self):
        assert self.model.param_count > 0
        assert isinstance(self.model.param_count, int)
