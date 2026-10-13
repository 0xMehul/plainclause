import type { AnalyzeRequest, AnalysisResult } from '../types';

const MAX_CHARS = 15000;

export async function analyzeContract(req: AnalyzeRequest): Promise<AnalysisResult> {
  if (!req.text || req.text.trim().length === 0) {
    throw new Error('Please paste or upload a contract first.');
  }
  if (req.text.length > MAX_CHARS) {
    throw new Error(`Your contract is too long (${req.text.length.toLocaleString()} chars). Please paste the first ${MAX_CHARS.toLocaleString()} characters.`);
  }

  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error ?? `Server error ${response.status}`);
  }

  return response.json() as Promise<AnalysisResult>;
}
