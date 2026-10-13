import type { Language } from '../types';

export const labels: Record<string, Record<Language, string>> = {
  appName:         { en: 'PlainClause', hi: 'PlainClause' },
  tagline:         { en: 'Understand any contract in plain language — instantly.', hi: 'किसी भी अनुबंध को सरल भाषा में तुरंत समझें।' },
  pasteLabel:      { en: 'Paste your contract text', hi: 'अनुबंध का पाठ यहाँ चिपकाएँ' },
  pastePlaceholder:{ en: 'Paste the full contract text here…', hi: 'पूरा अनुबंध पाठ यहाँ चिपकाएँ…' },
  uploadLabel:     { en: 'Or upload a file (.txt or .pdf)', hi: 'या फ़ाइल अपलोड करें (.txt या .pdf)' },
  contractType:    { en: 'Contract type', hi: 'अनुबंध प्रकार' },
  language:        { en: 'Language', hi: 'भाषा' },
  analyze:         { en: 'Analyze Contract', hi: 'अनुबंध विश्लेषण करें' },
  analyzing:       { en: 'Analyzing…', hi: 'विश्लेषण हो रहा है…' },
  riskScore:       { en: 'Risk Score', hi: 'जोखिम स्कोर' },
  summary:         { en: 'Plain-Language Summary', hi: 'सरल भाषा सारांश' },
  riskyClauses:    { en: 'Risky Clauses', hi: 'जोखिम भरी धाराएँ' },
  original:        { en: 'Original Clause', hi: 'मूल धारा' },
  explanation:     { en: 'Plain Explanation', hi: 'सरल व्याख्या' },
  risk:            { en: 'Risk', hi: 'जोखिम' },
  questions:       { en: 'Questions to Ask Before Signing', hi: 'हस्ताक्षर से पहले पूछने वाले प्रश्न' },
  missingClauses:  { en: 'Missing Clauses & Protections', hi: 'छूटी हुई महत्वपूर्ण सुरक्षा शर्तें' },
  whyRisky:        { en: 'Why this could hurt you', hi: 'यह आपको नुकसान क्यों पहुंचा सकता है' },
  suggestion:      { en: 'What to ask for or change', hi: 'क्या बदलाव या मांग करें' },
  download:        { en: 'Download Report', hi: 'रिपोर्ट डाउनलोड करें' },
  newAnalysis:     { en: '← New Analysis', hi: '← नया विश्लेषण' },
  disclaimer:      { en: 'PlainClause is not legal advice. Please consult a lawyer for important decisions.', hi: 'PlainClause कानूनी सलाह नहीं है। महत्वपूर्ण निर्णयों के लिए कृपया वकील से परामर्श करें।' },
  high:            { en: 'High Risk', hi: 'उच्च जोखिम' },
  medium:          { en: 'Medium Risk', hi: 'मध्यम जोखिम' },
  low:             { en: 'Low Risk', hi: 'कम जोखिम' },
  dropzone:        { en: 'Drop file here or click to browse', hi: 'फ़ाइल यहाँ छोड़ें या ब्राउज़ करें' },
  charCount:       { en: 'characters', hi: 'अक्षर' },
  maxChars:        { en: 'Max 15,000 characters', hi: 'अधिकतम 15,000 अक्षर' },
};

export function t(key: string, lang: Language): string {
  return labels[key]?.[lang] ?? labels[key]?.['en'] ?? key;
}
