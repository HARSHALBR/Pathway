import numpy as np
from typing import List, Dict

class LatentReasoningModel:
    def __init__(self, state_dim=32, hidden_dim=64, max_classes=23, alpha=0.5, seed=42):
        self.state_dim = state_dim
        self.hidden_dim = hidden_dim
        self.max_classes = max_classes
        self.alpha = float(alpha)
        
        np.random.seed(seed)
        
        # Xavier/Glorot uniform initialization
        def xavier(fan_in, fan_out, scale=1.0):
            limit = np.sqrt(6.0 / (fan_in + fan_out))
            return np.random.uniform(-limit, limit, size=(fan_out, fan_in)) * scale
            
        self.W_enc = xavier(6, state_dim, scale=np.sqrt(2.0))
        self.b_enc = np.zeros(state_dim)
        
        self.W_1 = xavier(state_dim, hidden_dim)
        self.b_1 = np.zeros(hidden_dim)
        
        self.W_2 = xavier(hidden_dim, state_dim, scale=0.5)
        
        self.W_out = xavier(state_dim, max_classes)
        self.b_out = np.zeros(max_classes)

    def forward(self, encoded_input: np.ndarray, R: int, modulus: int) -> dict:
        """Single-sample forward pass with full state trajectory."""
        x = encoded_input
        pre_enc = self.W_enc @ x + self.b_enc
        s = np.maximum(0, pre_enc)
        
        states = [s.copy()]
        deltas = []
        state_deltas = []
        
        for t in range(R):
            h = self.W_1 @ s + self.b_1
            a = np.tanh(h)
            delta = self.W_2 @ a
            s_next = s + self.alpha * delta
            
            deltas.append(delta.copy())
            state_deltas.append(float(np.linalg.norm(s_next - s)))
            s = s_next.copy()
            states.append(s.copy())
            
        logits = self.W_out @ s + self.b_out
        
        # Softmax over first modulus classes
        mod_logits = logits[:modulus]
        mod_logits_shifted = mod_logits - np.max(mod_logits)
        exp_logits = np.exp(mod_logits_shifted)
        probs = exp_logits / np.sum(exp_logits)
        
        prediction = int(np.argmax(probs))
        
        return {
            'states': states,
            'deltas': deltas,
            'prediction': prediction,
            'probabilities': probs,
            'logits': logits,
            'state_deltas': state_deltas,
            'computation_proxy': {
                'reasoning_tokens_emitted': 0,
                'internal_state_updates': R,
                'ops_per_round': self.state_dim * self.hidden_dim * 2,  
                'total_ops': R * (self.state_dim * self.hidden_dim * 2),
                'description': f'Performed {R} internal state updates (0 tokens emitted)'
            }
        }
        
    def train(self, tasks: List['Task'], R: int = 5, epochs: int = 500, lr: float = 0.005, verbose: bool = False) -> dict:
        """Train on a list of Task objects using BPTT in pure NumPy."""
        N = len(tasks)
        X = np.stack([t.encoded_input for t in tasks])
        targets = np.array([t.ground_truth for t in tasks])
        moduli = np.array([t.modulus for t in tasks])
        
        loss_history = []
        
        for epoch in range(epochs):
            # Forward pass
            pre_enc = X @ self.W_enc.T + self.b_enc
            s = np.maximum(0, pre_enc)
            
            states = [s.copy()]
            pre_encs = [pre_enc.copy()]
            hs = []
            a_s = []
            deltas = []
            
            for t in range(R):
                h = s @ self.W_1.T + self.b_1
                a = np.tanh(h)
                delta = a @ self.W_2.T
                s = s + self.alpha * delta
                
                hs.append(h)
                a_s.append(a)
                deltas.append(delta)
                states.append(s.copy())
                
            logits = s @ self.W_out.T + self.b_out
            
            # Compute loss and d_logits
            loss = 0.0
            d_logits = np.zeros_like(logits)
            correct = 0
            
            for i in range(N):
                mod = moduli[i]
                target = targets[i]
                
                mod_logits = logits[i, :mod]
                mod_logits_shifted = mod_logits - np.max(mod_logits)
                exp_logits = np.exp(mod_logits_shifted)
                probs = exp_logits / np.sum(exp_logits)
                
                pred = np.argmax(probs)
                if pred == target:
                    correct += 1
                    
                loss += -np.log(probs[target] + 1e-10)
                
                d_logits_i = probs.copy()
                d_logits_i[target] -= 1
                d_logits[i, :mod] = d_logits_i
                
            loss /= N
            accuracy = correct / N
            loss_history.append(loss)
            
            # Backward pass
            d_W_out = d_logits.T @ states[-1]
            d_b_out = np.sum(d_logits, axis=0)
            d_s = d_logits @ self.W_out
            
            d_W_1 = np.zeros_like(self.W_1)
            d_b_1 = np.zeros_like(self.b_1)
            d_W_2 = np.zeros_like(self.W_2)
            d_alpha = 0.0
            
            for t in range(R-1, -1, -1):
                d_delta = d_s * self.alpha
                d_alpha += np.sum(d_s * deltas[t])
                
                d_W_2 += d_delta.T @ a_s[t]
                
                d_a = d_delta @ self.W_2
                d_h = d_a * (1 - a_s[t]**2)
                
                d_W_1 += d_h.T @ states[t]
                d_b_1 += np.sum(d_h, axis=0)
                
                d_s = d_s + d_h @ self.W_1
                
            d_pre_enc = d_s * (pre_encs[0] > 0)
            d_W_enc = d_pre_enc.T @ X
            d_b_enc = np.sum(d_pre_enc, axis=0)
            
            # Average gradients
            d_W_out /= N
            d_b_out /= N
            d_W_1 /= N
            d_b_1 /= N
            d_W_2 /= N
            d_alpha /= N
            d_W_enc /= N
            d_b_enc /= N
            
            # Gradient clipping
            max_norm = 5.0
            for grad in [d_W_out, d_b_out, d_W_1, d_b_1, d_W_2, d_W_enc, d_b_enc]:
                norm = np.linalg.norm(grad)
                if norm > max_norm:
                    grad *= max_norm / norm
            if np.abs(d_alpha) > max_norm:
                d_alpha *= max_norm / np.abs(d_alpha)
            
            # Update weights
            self.W_out -= lr * d_W_out
            self.b_out -= lr * d_b_out
            self.W_1 -= lr * d_W_1
            self.b_1 -= lr * d_b_1
            self.W_2 -= lr * d_W_2
            self.alpha -= lr * d_alpha
            self.W_enc -= lr * d_W_enc
            self.b_enc -= lr * d_b_enc
            
            if verbose and (epoch + 1) % 100 == 0:
                print(f"Epoch {epoch+1}/{epochs} | Loss: {loss:.4f} | Acc: {accuracy:.4f}")
                
        return {'loss_history': loss_history, 'final_accuracy': accuracy}

    def save_weights(self, path: str) -> None:
        """Save all weights to a .npz file."""
        np.savez(path,
            W_enc=self.W_enc, b_enc=self.b_enc,
            W_1=self.W_1, b_1=self.b_1,
            W_2=self.W_2, alpha=np.array([self.alpha]),
            W_out=self.W_out, b_out=self.b_out,
            state_dim=np.array([self.state_dim]),
            hidden_dim=np.array([self.hidden_dim]))
            
    def load_weights(self, path: str) -> None:
        """Load weights from a .npz file."""
        data = np.load(path)
        self.W_enc = data['W_enc']
        self.b_enc = data['b_enc']
        self.W_1 = data['W_1']
        self.b_1 = data['b_1']
        self.W_2 = data['W_2']
        self.alpha = float(data['alpha'][0])
        self.W_out = data['W_out']
        self.b_out = data['b_out']
        self.state_dim = int(data['state_dim'][0])
        self.hidden_dim = int(data['hidden_dim'][0])

    @property
    def param_count(self) -> int:
        """Total number of trainable parameters."""
        count = 0
        count += self.W_enc.size + self.b_enc.size
        count += self.W_1.size + self.b_1.size
        count += self.W_2.size
        count += 1  # alpha
        count += self.W_out.size + self.b_out.size
        return count
