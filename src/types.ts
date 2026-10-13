export type Language = 'en' | 'hi';

export type ContractType = 'Rental' | 'Freelance' | 'Internship' | 'Other';

export type RiskLevel = 'high' | 'medium' | 'low';

export interface RiskyClause {
  original: string;       // exact text copied from the contract
  explanation: string;    // plain-language meaning
  risk: RiskLevel;
  whyRisky: string;       // one sentence on the potential harm
  suggestion: string;     // what to ask for or change
}

export interface AnalysisResult {
  riskScore: number;          // 0–100
  summary: string[];          // 5 plain-language lines
  riskyClauses: RiskyClause[];
  questions: string[];        // questions to ask before signing
  missingClauses: string[];   // important things the contract doesn't mention
  contractType: ContractType;
  language: Language;
}

export interface AnalyzeRequest {
  text: string;
  contractType: ContractType;
  language: Language;
}
