export interface TransformerForwardResponse {
  sentence: string;
  tokens: string[];
  token_ids: number[];
  X: number[][];
  P: number[][];
  H0: number[][];
  Q: number[][];
  K: number[][];
  V: number[][];
  scores: number[][];
  attention_weights: number[][];
  attention_output: number[][];
  residual_1: number[][];
  ln_1: number[][];
  ffn_output: number[][];
  ln_2: number[][];
  vocab: Record<string, number>;
  vocab_size: number;
  d_model: number;
}

export interface ComparisonItem {
  key_idx: number;
  key_token: string;
  key_vector: number[];
  dot_product: number;
  scaled_score: number;
  attention_weight: number;
  value_vector: number[];
  weighted_value: number[];
}

export interface AttentionAnalyzeResponse {
  query_token_idx: number;
  query_token: string;
  query_vector: number[];
  tokens: string[];
  accumulated_value: number[];
  out_representation: number[];
  comparisons: ComparisonItem[];
}

export interface TaskGenerateResponse {
  expression: string;
  ground_truth: number;
  operands: number[];
  modulus: number;
  level: number;
  encoded_input: number[];
}

export interface StepItem {
  description: string;
  operation: string;
  result: number;
}

export interface ComputationProxy {
  reasoning_tokens_emitted?: number;
  internal_state_updates?: number;
  description: string;
  total_ops?: number;
}

export interface ExplicitSolveResponse {
  expression: string;
  ground_truth: number;
  modulus: number;
  level: number;
  steps: StepItem[];
  tokens: string[];
  answer: number;
  token_count: number;
  correct: boolean;
  computation_proxy: ComputationProxy;
}

export interface PcaPoint {
  round: number;
  label: string;
  x: number;
  y: number;
}

export interface LatentRunResponse {
  expression: string;
  ground_truth: number;
  modulus: number;
  level: number;
  R: number;
  states: number[][];
  state_deltas: number[];
  prediction: number;
  correct: boolean;
  confidence: number;
  probabilities: number[];
  pca_trajectory: PcaPoint[];
  computation_proxy: ComputationProxy;
}

export interface SweepPoint {
  R: number;
  prediction: number;
  ground_truth: number;
  correct: boolean;
  confidence: number;
  gt_prob: number;
}

export interface LatentSweepResponse {
  expression: string;
  ground_truth: number;
  modulus: number;
  level: number;
  curve: SweepPoint[];
}

export interface BDHSimulateResponse {
  decay_lambda: number;
  step: number;
  S_prev: number[][];
  decayed_S_prev: number[][];
  K_t: number[];
  V_t: number[];
  Q_t: number[];
  outer_product: number[][];
  S_new: number[][];
  O_t: number[];
}
