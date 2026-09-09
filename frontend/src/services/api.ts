import type {
  TransformerForwardResponse,
  AttentionAnalyzeResponse,
  TaskGenerateResponse,
  ExplicitSolveResponse,
  LatentRunResponse,
  LatentSweepResponse,
  BDHSimulateResponse
} from '../types/api';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

async function postJson<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(errData.detail || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export async function fetchHealth(): Promise<{ status: string; models: Record<string, unknown> }> {
  const response = await fetch(`${API_BASE}/api/health`);
  if (!response.ok) {
    throw new Error('Backend health check failed');
  }
  return response.json();
}

export async function runTransformerForward(sentence: string): Promise<TransformerForwardResponse> {
  return postJson<TransformerForwardResponse>('/api/transformer/forward', { sentence });
}

export async function analyzeAttention(sentence: string, queryTokenIdx: number): Promise<AttentionAnalyzeResponse> {
  return postJson<AttentionAnalyzeResponse>('/api/attention/analyze', { sentence, query_token_idx: queryTokenIdx });
}

export async function generateTask(level: number = 2, modulus: number = 11, seed: number = 42): Promise<TaskGenerateResponse> {
  return postJson<TaskGenerateResponse>('/api/task/generate', { level, modulus, seed });
}

export async function solveExplicit(level: number = 2, modulus: number = 11, seed: number = 42): Promise<ExplicitSolveResponse> {
  return postJson<ExplicitSolveResponse>('/api/explicit/solve', { level, modulus, seed });
}

export async function runLatent(level: number = 2, modulus: number = 11, seed: number = 42, R: number = 3): Promise<LatentRunResponse> {
  return postJson<LatentRunResponse>('/api/latent/run', { level, modulus, seed, R });
}

export async function sweepLatent(level: number = 2, modulus: number = 11, seed: number = 42, maxR: number = 10): Promise<LatentSweepResponse> {
  return postJson<LatentSweepResponse>('/api/latent/sweep', { level, modulus, seed, max_R: maxR });
}

export async function simulateBDH(decayLambda: number = 0.85, step: number = 1): Promise<BDHSimulateResponse> {
  return postJson<BDHSimulateResponse>('/api/bdh/simulate', { decay_lambda: decayLambda, step });
}
