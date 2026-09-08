import numpy as np

class TinyTransformer:
    """Educational single-head, single-layer Transformer.
    
    Designed for inspecting all intermediate matrices.
    d_model = 4, d_k = d_v = 4, 1 head, 1 layer.
    """
    
    VOCAB = {
        '<pad>': 0, 'the': 1, 'cat': 2, 'sleeps': 3,
        'dog': 4, 'runs': 5, 'a': 6, 'big': 7,
        'small': 8, 'fast': 9, 'sits': 10, 'on': 11,
        'mat': 12, 'red': 13, 'blue': 14, 'and': 15,
        'or': 16, 'is': 17, 'was': 18, 'bird': 19
    }
    ID_TO_TOKEN = {v: k for k, v in VOCAB.items()}
    
    def __init__(self, d_model: int = 4, seed: int = 42):
        """Initialize with deterministic random weights."""
        self.d_model = d_model
        self.d_k = d_model
        self.d_v = d_model
        self.d_ff = 8
        self.vocab_size = len(self.VOCAB)
        
        np.random.seed(seed)
        
        # W_Q, W_K, W_V in R^{d_model x d_model}
        self.W_Q = np.random.randn(self.d_model, self.d_k) * 0.1
        self.W_K = np.random.randn(self.d_model, self.d_k) * 0.1
        self.W_V = np.random.randn(self.d_model, self.d_v) * 0.1
        
        # W_O in R^{d_model x d_model}
        self.W_O = np.random.randn(self.d_v, self.d_model) * 0.1
        
        # FFN: W_ff1 in R^{d_model x d_ff}, W_ff2 in R^{d_ff x d_model}, d_ff = 8
        self.W_ff1 = np.random.randn(self.d_model, self.d_ff) * 0.1
        self.W_ff2 = np.random.randn(self.d_ff, self.d_model) * 0.1
        
        # Embedding matrix E in R^{|V| x d_model}
        self.E = np.random.randn(self.vocab_size, self.d_model) * 0.1
        
        # Positional encoding P (learned, for max_len=10)
        self.max_len = 10
        self.P_matrix = np.random.randn(self.max_len, self.d_model) * 0.1
    
    def forward(self, sentence: str) -> dict:
        """Run forward pass, returning ALL intermediate values.
        
        Returns dict with keys:
        - 'tokens': list[str] e.g. ['the', 'cat', 'sleeps']
        - 'token_ids': list[int]
        - 'X': np.ndarray (L, d) - token embeddings
        - 'P': np.ndarray (L, d) - positional encodings  
        - 'H0': np.ndarray (L, d) - X + P
        - 'W_Q', 'W_K', 'W_V': np.ndarray (d, d_k) - weight matrices
        - 'Q': np.ndarray (L, d_k) - queries
        - 'K': np.ndarray (L, d_k) - keys
        - 'V': np.ndarray (L, d_v) - values
        - 'scores': np.ndarray (L, L) - QK^T / sqrt(d_k)
        - 'attention_weights': np.ndarray (L, L) - softmax(scores)
        - 'attention_output': np.ndarray (L, d_v) - attention_weights @ V
        - 'residual_1': np.ndarray (L, d) - H0 + attention_output (after first residual)
        - 'ffn_intermediate': np.ndarray (L, d_ff) - ReLU(residual_1 @ W_ff1)
        - 'ffn_output': np.ndarray (L, d) - ffn_intermediate @ W_ff2
        - 'residual_2': np.ndarray (L, d) - residual_1 + ffn_output
        - 'dimensions': dict with d_model, d_k, d_v, d_ff, L, vocab_size
        """
        # Tokenization
        tokens = sentence.lower().split()
        token_ids = [self.VOCAB.get(t, 0) for t in tokens]
        L = len(token_ids)
        
        # Limit L to max_len for positional encoding
        if L > self.max_len:
            tokens = tokens[:self.max_len]
            token_ids = token_ids[:self.max_len]
            L = self.max_len
            
        X = self.E[token_ids]
        P = self.P_matrix[:L]
        H0 = X + P
        
        Q = H0 @ self.W_Q
        K = H0 @ self.W_K
        V = H0 @ self.W_V
        
        scores = (Q @ K.T) / np.sqrt(self.d_k)
        
        # Softmax with numerical stability
        scores_shifted = scores - np.max(scores, axis=-1, keepdims=True)
        exp_scores = np.exp(scores_shifted)
        attention_weights = exp_scores / np.sum(exp_scores, axis=-1, keepdims=True)
        
        attention_output = (attention_weights @ V) @ self.W_O
        
        residual_1 = H0 + attention_output
        
        # FFN
        ffn_intermediate = np.maximum(0, residual_1 @ self.W_ff1)
        ffn_output = ffn_intermediate @ self.W_ff2
        
        residual_2 = residual_1 + ffn_output
        
        return {
            'tokens': tokens,
            'token_ids': token_ids,
            'X': X,
            'P': P,
            'H0': H0,
            'W_Q': self.W_Q,
            'W_K': self.W_K,
            'W_V': self.W_V,
            'Q': Q,
            'K': K,
            'V': V,
            'scores': scores,
            'attention_weights': attention_weights,
            'attention_output': attention_output,
            'residual_1': residual_1,
            'ffn_intermediate': ffn_intermediate,
            'ffn_output': ffn_output,
            'residual_2': residual_2,
            'dimensions': {
                'd_model': self.d_model,
                'd_k': self.d_k,
                'd_v': self.d_v,
                'd_ff': self.d_ff,
                'L': L,
                'vocab_size': self.vocab_size
            }
        }
