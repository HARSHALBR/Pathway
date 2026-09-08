#!/usr/bin/env python3
"""Pre-train the latent reasoning model on modular arithmetic tasks."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import numpy as np
from models.tasks import generate_batch
from models.latent_reasoning import LatentReasoningModel

def main():
    SEED = 42
    STATE_DIM = 48
    HIDDEN_DIM = 96
    TRAINING_R = 5
    EPOCHS = 1000  # Updated to 1000 for better convergence
    LR = 0.1  # Updated to 0.1 for better convergence
    
    np.random.seed(SEED)
    
    # Generate training data: levels 1-2, moduli 7 and 11
    tasks = []
    for level in [1, 2]:
        for mod in [7, 11]:
            tasks.extend(generate_batch(level=level, n=500, seed=SEED + level*100 + mod, modulus=mod))
    
    print(f'Training on {len(tasks)} tasks')
    print(f'Model: state_dim={STATE_DIM}, hidden_dim={HIDDEN_DIM}')
    print(f'Training R={TRAINING_R}, epochs={EPOCHS}, lr={LR}')
    
    model = LatentReasoningModel(state_dim=STATE_DIM, hidden_dim=HIDDEN_DIM, seed=SEED)
    print(f'Parameters: {model.param_count}')
    
    history = model.train(tasks, R=TRAINING_R, epochs=EPOCHS, lr=LR, verbose=True)
    
    # Save weights
    os.makedirs(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'generated'), exist_ok=True)
    weight_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'generated', 'pretrained_weights.npz')
    model.save_weights(weight_path)
    print(f'Weights saved to {weight_path}')
    
    # Validation
    print('\nValidation:')
    for level in [1, 2, 3]:
        for mod in [7, 11, 13]:
            val_tasks = generate_batch(level=level, n=50, seed=9999 + level*10 + mod, modulus=mod)
            correct = sum(1 for t in val_tasks if model.forward(t.encoded_input, R=TRAINING_R, modulus=t.modulus)['prediction'] == t.ground_truth)
            status = '(trained)' if (level <= 2 and mod in [7,11]) else '(unseen)'
            print(f'  Level {level}, mod {mod} {status}: {correct}/{len(val_tasks)} = {correct/len(val_tasks)*100:.1f}%')

if __name__ == '__main__':
    main()
