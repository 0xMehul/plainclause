import { useState } from 'react';
import { HomeScreen } from './screens/HomeScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { Footer } from './components/Footer';
import { analyzeContract } from './lib/api';
import type { AnalysisResult, ContractType, Language } from './types';
import './index.css';

type View = 'home' | 'results';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [lang, setLang] = useState<Language>('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async (text: string, contractType: ContractType) => {
    setError(null);
    setLoading(true);
    try {
      const data = await analyzeContract({ text, contractType, language: lang });
      setResult(data);
      setView('results');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (view === 'results' && result) {
    return (
      <ResultsScreen
        result={result}
        lang={lang}
        onLangChange={setLang}
        onBack={() => { setView('home'); setResult(null); }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <HomeScreen
        lang={lang}
        onLangChange={setLang}
        onAnalyze={handleAnalyze}
        loading={loading}
        error={error}
      />
      <Footer lang={lang} />
    </div>
  );
}
