import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
import numpy as np
from models.transformer_demo import TinyTransformer

class TestTinyTransformer:
    def setup_method(self):
        self.model = TinyTransformer(d_model=4, seed=42)
    
    def test_forward_returns_all_keys(self):
        result = self.model.forward('the cat sleeps')
        required_keys = ['tokens', 'token_ids', 'X', 'P', 'H0',
                        'W_Q', 'W_K', 'W_V', 'Q', 'K', 'V',
                        'scores', 'attention_weights', 'attention_output',
                        'residual_1', 'ffn_output', 'residual_2', 'dimensions']
        for key in required_keys:
            assert key in result, f'Missing key: {key}'
    
    def test_tokenization(self):
        result = self.model.forward('the cat sleeps')
        assert result['tokens'] == ['the', 'cat', 'sleeps']
        assert len(result['token_ids']) == 3
    
    def test_embedding_dimensions(self):
        result = self.model.forward('the cat sleeps')
        L, d = 3, 4
        assert result['X'].shape == (L, d)
        assert result['P'].shape == (L, d)
        assert result['H0'].shape == (L, d)
    
    def test_qkv_dimensions(self):
        result = self.model.forward('the cat sleeps')
        L, d_k = 3, 4
        assert result['Q'].shape == (L, d_k)
        assert result['K'].shape == (L, d_k)
        assert result['V'].shape == (L, d_k)
        assert result['W_Q'].shape == (d_k, d_k)  # or (d, d_k)
        assert result['W_K'].shape == (d_k, d_k)
        assert result['W_V'].shape == (d_k, d_k)
    
    def test_score_dimensions(self):
        result = self.model.forward('the cat sleeps')
        L = 3
        assert result['scores'].shape == (L, L)
        assert result['attention_weights'].shape == (L, L)
    
    def test_attention_weights_sum_to_one(self):
        result = self.model.forward('the cat sleeps')
        row_sums = result['attention_weights'].sum(axis=1)
        np.testing.assert_allclose(row_sums, 1.0, atol=1e-6)
    
    def test_attention_weights_non_negative(self):
        result = self.model.forward('the cat sleeps')
        assert np.all(result['attention_weights'] >= 0)
    
    def test_h0_equals_x_plus_p(self):
        result = self.model.forward('the cat sleeps')
        np.testing.assert_allclose(result['H0'], result['X'] + result['P'], atol=1e-6)
    
    def test_q_equals_h0_times_wq(self):
        result = self.model.forward('the cat sleeps')
        expected_Q = result['H0'] @ result['W_Q']
        np.testing.assert_allclose(result['Q'], expected_Q, atol=1e-6)
    
    def test_scores_formula(self):
        result = self.model.forward('the cat sleeps')
        d_k = result['dimensions']['d_k']
        expected_scores = result['Q'] @ result['K'].T / np.sqrt(d_k)
        np.testing.assert_allclose(result['scores'], expected_scores, atol=1e-6)
    
    def test_reproducibility(self):
        m1 = TinyTransformer(seed=42)
        m2 = TinyTransformer(seed=42)
        r1 = m1.forward('the cat sleeps')
        r2 = m2.forward('the cat sleeps')
        np.testing.assert_array_equal(r1['attention_weights'], r2['attention_weights'])
