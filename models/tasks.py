import numpy as np
from dataclasses import dataclass, field
from typing import List, Optional

PRIMES = [7, 11, 13, 17, 19, 23]

@dataclass
class Task:
    """A modular arithmetic reasoning task."""
    expression: str          # Human-readable, e.g. '7 + 3 × 5 mod 11'
    ground_truth: int        # Exact answer computed by Python
    operands: List[int]      # [a, b, c, d] padded with 0s to length 4
    modulus: int             # n (prime)
    level: int               # 1-4
    encoded_input: np.ndarray # Shape (6,) for model input

def generate_task(level: int = 2, seed: Optional[int] = None, modulus: Optional[int] = None) -> Task:
    """Generate a single modular arithmetic task.
    
    Level 1: a + b mod n
    Level 2: a + b * c mod n  
    Level 3: a * b + c * d mod n
    Level 4: (a + b) * c + d mod n
    
    Operands: random ints in [1, n-1]
    Modulus n: if not specified, random from {7, 11, 13, 17, 19, 23}
    Ground truth: computed by Python's exact integer arithmetic
    
    Encoding: x = [a/23, b/23, c/23, d/23, n/23, level/4]
    Unused operand slots are 0.
    """
    if seed is not None:
        np.random.seed(seed)
        
    n = modulus if modulus is not None else int(np.random.choice(PRIMES))
    
    a = int(np.random.randint(1, n))
    b = int(np.random.randint(1, n))
    c = int(np.random.randint(1, n)) if level >= 2 else 0
    d = int(np.random.randint(1, n)) if level >= 3 else 0
    
    if level == 1:
        expression = f"{a} + {b} mod {n}"
        ground_truth = (a + b) % n
        operands = [a, b, 0, 0]
    elif level == 2:
        expression = f"{a} + {b} × {c} mod {n}"
        ground_truth = (a + b * c) % n
        operands = [a, b, c, 0]
    elif level == 3:
        expression = f"{a} × {b} + {c} × {d} mod {n}"
        ground_truth = (a * b + c * d) % n
        operands = [a, b, c, d]
    elif level == 4:
        expression = f"({a} + {b}) × {c} + {d} mod {n}"
        ground_truth = ((a + b) * c + d) % n
        operands = [a, b, c, d]
    else:
        raise ValueError("Level must be between 1 and 4")
        
    encoded_input = np.array([operands[0]/23.0, operands[1]/23.0, operands[2]/23.0, operands[3]/23.0, n/23.0, level/4.0], dtype=np.float32)
    
    return Task(
        expression=expression,
        ground_truth=ground_truth,
        operands=operands,
        modulus=n,
        level=level,
        encoded_input=encoded_input
    )

def generate_batch(level: int = 2, n: int = 100, seed: int = 0, modulus: Optional[int] = None) -> List[Task]:
    """Generate n tasks at the given level."""
    np.random.seed(seed)
    tasks = []
    # Consume seed by generating random sub-seeds
    seeds = np.random.randint(0, 1000000, size=n)
    for s in seeds:
        tasks.append(generate_task(level=level, seed=int(s), modulus=modulus))
    return tasks
