from models.tasks import Task
from typing import Dict, List

class ExplicitSolver:
    """Mode A: Explicit/tokenized reasoning.
    
    Decomposes modular arithmetic into step-by-step tokens
    following operator precedence.
    
    NOT a neural network — a rule-based symbolic solver.
    This is clearly labeled as such.
    """
    
    def solve(self, task: Task) -> Dict:
        """Solve a task with serialized intermediate steps.
        
        Returns:
            {
                'steps': [
                    {'description': '3 × 5 = 15', 'operation': 'multiply', 'result': 15},
                    {'description': '7 + 15 = 22', 'operation': 'add', 'result': 22},
                    {'description': '22 mod 11 = 0', 'operation': 'mod', 'result': 0},
                ],
                'tokens': ['3 × 5 = 15', '7 + 15 = 22', '22 mod 11 = 0', 'Answer: 0'],
                'answer': 0,
                'token_count': 4,
                'correct': True,
                'computation_proxy': {
                    'reasoning_tokens_emitted': 4,
                    'internal_state_updates': 0,
                    'description': 'Serialized 4 intermediate reasoning tokens'
                }
            }
        """
        level = task.level
        a, b, c, d = task.operands
        n = task.modulus
        
        steps = []
        tokens = []
        
        if level == 1:
            x = a + b
            steps.append({'description': f'{a} + {b} = {x}', 'operation': 'add', 'result': x})
            tokens.append(f'{a} + {b} = {x}')
            
            y = x % n
            steps.append({'description': f'{x} mod {n} = {y}', 'operation': 'mod', 'result': y})
            tokens.append(f'{x} mod {n} = {y}')
            
            ans = y
            
        elif level == 2:
            x = b * c
            steps.append({'description': f'{b} × {c} = {x}', 'operation': 'multiply', 'result': x})
            tokens.append(f'{b} × {c} = {x}')
            
            y = a + x
            steps.append({'description': f'{a} + {x} = {y}', 'operation': 'add', 'result': y})
            tokens.append(f'{a} + {x} = {y}')
            
            z = y % n
            steps.append({'description': f'{y} mod {n} = {z}', 'operation': 'mod', 'result': z})
            tokens.append(f'{y} mod {n} = {z}')
            
            ans = z
            
        elif level == 3:
            x = a * b
            steps.append({'description': f'{a} × {b} = {x}', 'operation': 'multiply', 'result': x})
            tokens.append(f'{a} × {b} = {x}')
            
            y = c * d
            steps.append({'description': f'{c} × {d} = {y}', 'operation': 'multiply', 'result': y})
            tokens.append(f'{c} × {d} = {y}')
            
            z = x + y
            steps.append({'description': f'{x} + {y} = {z}', 'operation': 'add', 'result': z})
            tokens.append(f'{x} + {y} = {z}')
            
            w = z % n
            steps.append({'description': f'{z} mod {n} = {w}', 'operation': 'mod', 'result': w})
            tokens.append(f'{z} mod {n} = {w}')
            
            ans = w
            
        elif level == 4:
            x = a + b
            steps.append({'description': f'{a} + {b} = {x}', 'operation': 'add', 'result': x})
            tokens.append(f'{a} + {b} = {x}')
            
            y = x * c
            steps.append({'description': f'{x} × {c} = {y}', 'operation': 'multiply', 'result': y})
            tokens.append(f'{x} × {c} = {y}')
            
            z = y + d
            steps.append({'description': f'{y} + {d} = {z}', 'operation': 'add', 'result': z})
            tokens.append(f'{y} + {d} = {z}')
            
            w = z % n
            steps.append({'description': f'{z} mod {n} = {w}', 'operation': 'mod', 'result': w})
            tokens.append(f'{z} mod {n} = {w}')
            
            ans = w
        else:
            raise ValueError("Level must be between 1 and 4")
            
        tokens.append(f'Answer: {ans}')
        
        return {
            'steps': steps,
            'tokens': tokens,
            'answer': ans,
            'token_count': len(tokens),
            'correct': ans == task.ground_truth,
            'computation_proxy': {
                'reasoning_tokens_emitted': len(tokens),
                'internal_state_updates': 0,
                'description': f'Serialized {len(tokens)} intermediate reasoning tokens'
            }
        }
