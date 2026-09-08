import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
import numpy as np
from models.tasks import Task, generate_task, generate_batch

class TestTaskGeneration:
    def test_level1_ground_truth(self):
        """Level 1: (a + b) % n must be correct."""
        for seed in range(20):
            task = generate_task(level=1, seed=seed, modulus=11)
            a, b = task.operands[0], task.operands[1]
            assert task.ground_truth == (a + b) % task.modulus
    
    def test_level2_ground_truth(self):
        """Level 2: (a + b*c) % n must be correct."""
        for seed in range(20):
            task = generate_task(level=2, seed=seed, modulus=11)
            a, b, c = task.operands[0], task.operands[1], task.operands[2]
            assert task.ground_truth == (a + b * c) % task.modulus
    
    def test_level3_ground_truth(self):
        """Level 3: (a*b + c*d) % n must be correct."""
        for seed in range(20):
            task = generate_task(level=3, seed=seed, modulus=13)
            a, b, c, d = task.operands
            assert task.ground_truth == (a * b + c * d) % task.modulus
    
    def test_level4_ground_truth(self):
        """Level 4: ((a+b)*c + d) % n must be correct."""
        for seed in range(20):
            task = generate_task(level=4, seed=seed, modulus=7)
            a, b, c, d = task.operands
            assert task.ground_truth == ((a + b) * c + d) % task.modulus
    
    def test_ground_truth_range(self):
        """Ground truth must be in [0, modulus-1]."""
        for level in [1, 2, 3, 4]:
            for _ in range(50):
                task = generate_task(level=level)
                assert 0 <= task.ground_truth < task.modulus
    
    def test_operand_range(self):
        """Operands must be in [1, modulus-1]."""
        for level in [1, 2, 3, 4]:
            for _ in range(50):
                task = generate_task(level=level)
                n_operands = {1: 2, 2: 3, 3: 4, 4: 4}[level]
                for i in range(n_operands):
                    assert 1 <= task.operands[i] <= task.modulus - 1
    
    def test_encoding_shape(self):
        """Encoded input must have shape (6,)."""
        task = generate_task(level=2, seed=0)
        assert task.encoded_input.shape == (6,)
    
    def test_encoding_range(self):
        """Encoded values should be in [0, 1]."""
        for _ in range(50):
            task = generate_task(level=2)
            assert np.all(task.encoded_input >= 0)
            assert np.all(task.encoded_input <= 1)
    
    def test_reproducibility(self):
        """Same seed should produce same task."""
        t1 = generate_task(level=2, seed=42, modulus=11)
        t2 = generate_task(level=2, seed=42, modulus=11)
        assert t1.expression == t2.expression
        assert t1.ground_truth == t2.ground_truth
        assert np.array_equal(t1.encoded_input, t2.encoded_input)
    
    def test_batch_generation(self):
        """Batch should produce correct number of tasks."""
        tasks = generate_batch(level=2, n=50, seed=0, modulus=11)
        assert len(tasks) == 50
        for t in tasks:
            assert t.level == 2
            assert t.modulus == 11
    
    def test_expression_format(self):
        """Expression should be a non-empty string containing 'mod'."""
        for level in [1, 2, 3, 4]:
            task = generate_task(level=level, seed=0)
            assert isinstance(task.expression, str)
            assert 'mod' in task.expression
            assert len(task.expression) > 5
    
    def test_modulus_is_prime(self):
        """Default moduli should be from the prime list."""
        primes = {7, 11, 13, 17, 19, 23}
        for _ in range(100):
            task = generate_task(level=1)
            assert task.modulus in primes
