import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a contract-review assistant that helps non-lawyers understand contracts. You are not a lawyer and you do not give legal advice.

The user will give you a contract and its type. Analyze it and respond with ONLY valid JSON, no extra text and no markdown fences, in exactly this format:

{
  "summary": "5 short lines in simple language, written for someone with no legal background",
  "risk_score": 0-100,
  "risky_clauses": [
    {
      "original_text": "exact text copied from the contract",
      "explanation": "what this means in plain language",
      "risk_level": "high | medium | low",
      "why_risky": "one sentence on why this could hurt the signer",
      "suggestion": "what to ask for or change"
    }
  ],
  "questions_before_signing": ["question 1", "question 2", "question 3"],
  "missing_clauses": ["important things this contract does not mention"]
}

RULES
- Copy original_text exactly from the contract. Never invent or change it.
- Look especially for: heavy penalties, auto-renewal, one-sided termination, unlimited liability, unclear payment terms, non-compete limits, IP ownership transfer, hidden fees, and security deposit rules.
- Use simple words. Explain any legal term you must use.
- Be honest. If the contract looks fair, give a low score. Do not exaggerate risks.
- If the text is not a contract, return {"error": "This does not look like a contract."}
- Write explanations in the language requested by the user.`;

function buildUserMessage(text: string, contractType: string, language: string): string {
  const langNote = language === 'hi'
    ? 'Please write all explanations, summary, questions, and missing clauses in Hindi (Devanagari script). Keep the JSON keys in English.'
    : 'Please write all explanations in English.';

  return `Contract type: ${contractType}
${langNote}

Contract text:
"""
${text}
"""`;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'Server configuration error: missing API key.' });
  }

  const { text, contractType, language } = req.body as {
    text?: string;
    contractType?: string;
    language?: string;
  };

  if (!text || text.trim().length === 0) {
    return res.status(400).json({ error: 'Contract text is required.' });
  }
  if (text.length > 15000) {
    return res.status(400).json({ error: 'Contract text is too long. Max 15,000 characters.' });
  }

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 3000,
      system: SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: buildUserMessage(text.trim(), contractType ?? 'Other', language ?? 'en'),
      }],
    });

    const raw = (message.content[0] as { type: string; text: string }).text.trim();

    // Strip any accidental markdown fences
    const jsonStr = raw
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    const parsed = JSON.parse(jsonStr);

    // If the model flagged a non-contract, forward the error
    if (parsed.error) {
      return res.status(422).json({ error: parsed.error });
    }

    // Flexible summary parsing: handles array of strings or newline/sentence separated string
    let summaryLines: string[] = [];
    if (Array.isArray(parsed.summary)) {
      summaryLines = parsed.summary.map((s: any) => String(s).trim()).filter(Boolean);
    } else if (typeof parsed.summary === 'string') {
      summaryLines = parsed.summary
        .split(/\r?\n/)
        .map((s: string) => s.replace(/^[-*•\d.)\s]+/, '').trim())
        .filter(Boolean);

      // If it was a single paragraph of sentences instead of newlines
      if (summaryLines.length === 1 && summaryLines[0].includes('.')) {
        const splitBySentences = summaryLines[0]
          .split(/(?<=[.!?])\s+/)
          .map((s: string) => s.trim())
          .filter(Boolean);
        if (splitBySentences.length > 1) {
          summaryLines = splitBySentences;
        }
      }
    }

    // Normalise keys (model returns snake_case, frontend uses camelCase)
    const result = {
      riskScore:      Math.min(100, Math.max(0, Number(parsed.risk_score) || 0)),
      summary:        summaryLines.slice(0, 5),
      riskyClauses:   (parsed.risky_clauses ?? []).map((c: any) => ({
        original:    String(c.original_text ?? '').slice(0, 500),
        explanation: String(c.explanation ?? ''),
        risk:        (['high', 'medium', 'low'].includes(c.risk_level) ? c.risk_level : 'medium') as 'high' | 'medium' | 'low',
        whyRisky:    String(c.why_risky ?? ''),
        suggestion:  String(c.suggestion ?? ''),
      })),
      questions:       (parsed.questions_before_signing ?? []).slice(0, 10),
      missingClauses:  (parsed.missing_clauses ?? []).slice(0, 10),
      contractType:    contractType ?? 'Other',
      language:        language ?? 'en',
    };

    return res.status(200).json(result);
  } catch (err: unknown) {
    console.error('Analyze error:', err);
    const msg = err instanceof Error ? err.message : 'Unknown error';
    if (msg.includes('JSON')) {
      return res.status(500).json({ error: 'AI returned an unexpected format. Please try again.' });
    }
    return res.status(500).json({ error: 'Analysis failed. Please try again in a moment.' });
  }
}
