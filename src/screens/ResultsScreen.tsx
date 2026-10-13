import React from 'react';
import type { AnalysisResult, Language } from '../types';
import { RiskGauge } from '../components/RiskGauge';
import { ClauseCard } from '../components/ClauseCard';
import { Footer } from '../components/Footer';
import { t } from '../lib/i18n';

interface Props {
  result: AnalysisResult;
  lang: Language;
  onLangChange: (l: Language) => void;
  onBack: () => void;
}

function generateReport(result: AnalysisResult, lang: Language): string {
  const lines: string[] = [
    `PlainClause — Contract Analysis Report`,
    `Generated: ${new Date().toLocaleString()}`,
    `Language: ${lang === 'en' ? 'English' : 'Hindi'}`,
    `Contract Type: ${result.contractType}`,
    `Risk Score: ${result.riskScore}/100`,
    ``,
    `=== SUMMARY ===`,
    ...result.summary.map((s, i) => `${i + 1}. ${s}`),
    ``,
    `=== RISKY CLAUSES ===`,
    ...result.riskyClauses.map((c, i) => [
      `[${i + 1}] Risk: ${c.risk.toUpperCase()}`,
      `Original Text: ${c.original}`,
      `Plain Explanation: ${c.explanation}`,
      c.whyRisky ? `Why Risky: ${c.whyRisky}` : '',
      c.suggestion ? `Suggested Action: ${c.suggestion}` : '',
      ``,
    ].filter(Boolean)).flat(),
    `=== QUESTIONS TO ASK BEFORE SIGNING ===`,
    ...result.questions.map((q, i) => `${i + 1}. ${q}`),
    ``,
    ...(result.missingClauses && result.missingClauses.length > 0 ? [
      `=== MISSING CLAUSES & PROTECTIONS ===`,
      ...result.missingClauses.map((m, i) => `${i + 1}. ${m}`),
      ``,
    ] : []),
    `---`,
    `PlainClause is not legal advice. Please consult a lawyer for important decisions.`,
  ];
  return lines.join('\n');
}

export const ResultsScreen: React.FC<Props> = ({ result, lang, onLangChange, onBack }) => {
  const handleDownload = () => {
    const content = generateReport(result, lang);
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plainclause-report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="19" y1="12" x2="5" y2="12"/>
                <polyline points="12 19 5 12 12 5"/>
              </svg>
              {t('newAnalysis', lang)}
            </button>
            <span className="text-slate-300">|</span>
            <span className="font-bold" style={{ color: '#1e3a5f' }}>PlainClause</span>
          </div>
          <div className="flex items-center gap-3">
            {/* Lang toggle */}
            <div className="flex items-center bg-slate-100 rounded-full p-1">
              {(['en', 'hi'] as Language[]).map(l => (
                <button
                  key={l}
                  onClick={() => onLangChange(l)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                    lang === l ? 'bg-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                  style={lang === l ? { color: '#1e3a5f' } : {}}
                >
                  {l === 'en' ? 'EN' : 'हिं'}
                </button>
              ))}
            </div>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-95 cursor-pointer shadow-xs"
              style={{ background: '#1e3a5f' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              {t('download', lang)}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10 space-y-10">

        {/* Risk Score card */}
        <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col md:flex-row items-center gap-8 fade-in">
          <RiskGauge score={result.riskScore} />
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-1" style={{ color: '#1e3a5f' }}>
              {t('riskScore', lang)}: <span className="text-3xl">{result.riskScore}</span>
              <span className="text-base font-normal text-slate-400"> / 100</span>
            </h2>
            <p className="text-slate-500 text-sm">
              {lang === 'en'
                ? `This ${result.contractType} contract has been analyzed for ${result.riskyClauses.length} risky clause${result.riskyClauses.length !== 1 ? 's' : ''}.`
                : `इस ${result.contractType} अनुबंध में ${result.riskyClauses.length} जोखिम भरी धाराएँ पाई गईं।`}
            </p>
            <div className="mt-4 flex gap-3 flex-wrap">
              {(['high', 'medium', 'low'] as const).map(r => {
                const count = result.riskyClauses.filter(c => c.risk === r).length;
                return count > 0 ? (
                  <span key={r} className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    r === 'high' ? 'bg-red-50 text-red-600 border-red-200' :
                    r === 'medium' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                    'bg-green-50 text-green-600 border-green-200'
                  }`}>
                    {count} {t(r, lang)}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        </section>

        {/* Summary */}
        <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 fade-in fade-in-delay-1">
          <h2 className="text-lg font-bold mb-5" style={{ color: '#1e3a5f' }}>
            📋 {t('summary', lang)}
          </h2>
          <ol className="space-y-3">
            {result.summary.map((line, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 text-blue-600 text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <p className="text-slate-700 text-sm leading-relaxed">{line}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Risky Clauses */}
        <section className="fade-in fade-in-delay-2">
          <h2 className="text-lg font-bold mb-5" style={{ color: '#1e3a5f' }}>
            ⚠️ {t('riskyClauses', lang)}
          </h2>
          <div className="space-y-4">
            {result.riskyClauses.length === 0 ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center text-green-700 font-medium text-sm">
                🎉 {lang === 'en' ? 'No risky clauses found!' : 'कोई जोखिम भरी धारा नहीं मिली!'}
              </div>
            ) : result.riskyClauses.map((clause, i) => (
              <ClauseCard key={i} clause={clause} lang={lang} index={i} />
            ))}
          </div>
        </section>

        {/* Missing Clauses */}
        {result.missingClauses && result.missingClauses.length > 0 && (
          <section className="bg-white rounded-3xl shadow-sm border border-amber-100 p-8 fade-in fade-in-delay-3">
            <h2 className="text-lg font-bold mb-2 flex items-center gap-2" style={{ color: '#1e3a5f' }}>
              🛡️ {t('missingClauses', lang)}
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              {lang === 'en'
                ? 'Important standard protections and terms that appear to be missing from this contract.'
                : 'महत्वपूर्ण मानक सुरक्षा और नियम जो इस अनुबंध में अनुपस्थित प्रतीत होते हैं।'}
            </p>
            <ul className="space-y-3">
              {result.missingClauses.map((clause, i) => (
                <li key={i} className="flex gap-3 items-start bg-amber-50/50 p-3.5 rounded-xl border border-amber-100">
                  <span className="flex-shrink-0 text-amber-600 font-bold mt-0.5">🔍</span>
                  <p className="text-slate-700 text-sm leading-relaxed">{clause}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Questions */}
        <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 fade-in fade-in-delay-3">
          <h2 className="text-lg font-bold mb-5" style={{ color: '#1e3a5f' }}>
            ❓ {t('questions', lang)}
          </h2>
          <ul className="space-y-3">
            {result.questions.map((q, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="flex-shrink-0 text-blue-500 mt-0.5 font-bold">→</span>
                <p className="text-slate-700 text-sm leading-relaxed">{q}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Download CTA */}
        <div className="text-center fade-in fade-in-delay-4">
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-white text-base transition-all cursor-pointer hover:opacity-95"
            style={{ background: 'linear-gradient(135deg,#1e3a5f,#3b82f6)', boxShadow: '0 4px 20px rgba(59,130,246,0.35)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            {t('download', lang)}
          </button>
        </div>
      </main>

      <Footer lang={lang} />
    </div>
  );
};
