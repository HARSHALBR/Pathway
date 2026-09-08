import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
from models.explicit_reasoning import ExplicitSolver
from models.tasks import generate_task

class TestExplicitSolver:
    def setup_method(self):
        self.solver = ExplicitSolver()
    
    def test_level1_correct(self):
        for seed in range(20):
            task = generate_task(level=1, seed=seed, modulus=11)
            result = self.solver.solve(task)
            assert result['answer'] == task.ground_truth
            assert result['correct'] == True
    
    def test_level2_correct(self):
        for seed in range(20):
            task = generate_task(level=2, seed=seed, modulus=11)
            result = self.solver.solve(task)
            assert result['answer'] == task.ground_truth
            assert result['correct'] == True
    
    def test_level3_correct(self):
        for seed in range(20):
            task = generate_task(level=3, seed=seed, modulus=13)
            result = self.solver.solve(task)
            assert result['answer'] == task.ground_truth
    
    def test_level4_correct(self):
        for seed in range(20):
            task = generate_task(level=4, seed=seed, modulus=7)
            result = self.solver.solve(task)
            assert result['answer'] == task.ground_truth
    
    def test_returns_steps(self):
        task = generate_task(level=2, seed=0, modulus=11)
        result = self.solver.solve(task)
        assert 'steps' in result
        assert len(result['steps']) >= 2
        for step in result['steps']:
            assert 'description' in step
            assert 'operation' in step
            assert 'result' in step
    
    def test_returns_tokens(self):
        task = generate_task(level=2, seed=0, modulus=11)
        result = self.solver.solve(task)
        assert 'tokens' in result
        assert len(result['tokens']) >= 2
        assert all(isinstance(t, str) for t in result['tokens'])
    
    def test_token_count(self):
        task = generate_task(level=2, seed=0, modulus=11)
        result = self.solver.solve(task)
        assert result['token_count'] == len(result['tokens'])
    
    def test_computation_proxy(self):
        task = generate_task(level=2, seed=0, modulus=11)
        result = self.solver.solve(task)
        proxy = result['computation_proxy']
        assert proxy['reasoning_tokens_emitted'] > 0
        assert proxy['internal_state_updates'] == 0
