import React, { useState, useRef, useCallback } from 'react';
import type { ContractType, Language } from '../types';
import { t } from '../lib/i18n';

interface Props {
  lang: Language;
  onLangChange: (l: Language) => void;
  onAnalyze: (text: string, type: ContractType) => void;
  loading: boolean;
  error: string | null;
}

const CONTRACT_TYPES: ContractType[] = ['Rental', 'Freelance', 'Internship', 'Other'];
const MAX_CHARS = 15000;

export const HomeScreen: React.FC<Props> = ({ lang, onLangChange, onAnalyze, loading, error }) => {
  const [text, setText] = useState('');
  const [contractType, setContractType] = useState<ContractType>('Rental');
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    setFileError(null);
    if (!file.name.endsWith('.txt') && !file.name.endsWith('.pdf')) {
      setFileError('Only .txt and .pdf files are supported.');
      return;
    }
    if (file.name.endsWith('.txt')) {
      const content = await file.text();
      setText(content.slice(0, MAX_CHARS));
    } else {
      // PDF: send to backend for extraction
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetch('/api/extract-pdf', { method: 'POST', body: formData });
        if (!res.ok) throw new Error('PDF extraction failed');
        const { text: extracted } = await res.json();
        setText((extracted as string).slice(0, MAX_CHARS));
      } catch {
        setFileError('Could not read the PDF. Please paste the text manually.');
      }
    }
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(text, contractType);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg,#f0f6ff 0%,#f8fafc 60%)' }}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#1e3a5f' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            <span className="font-bold text-lg" style={{ color: '#1e3a5f' }}>PlainClause</span>
          </div>
          {/* Language toggle */}
          <div className="flex items-center bg-slate-100 rounded-full p-1">
            {(['en', 'hi'] as Language[]).map(l => (
              <button
                key={l}
                onClick={() => onLangChange(l)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  lang === l
                    ? 'bg-white text-navy shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
                style={lang === l ? { color: '#1e3a5f' } : {}}
              >
                {l === 'en' ? 'EN' : 'हिं'}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">
        <div className="text-center mb-10 fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight" style={{ color: '#1e3a5f' }}>
            {t('tagline', lang)}
          </h1>
          <p className="text-slate-500 text-lg">
            {lang === 'en'
              ? 'Paste or upload any contract. Get plain-language summaries and risk flags in seconds.'
              : 'कोई भी अनुबंध चिपकाएं या अपलोड करें। कुछ ही सेकंड में सरल सारांश और जोखिम चेतावनियाँ पाएं।'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contract type + Language row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1.5">
                {t('contractType', lang)}
              </label>
              <select
                value={contractType}
                onChange={e => setContractType(e.target.value as ContractType)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              >
                {CONTRACT_TYPES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1.5">
                {t('language', lang)}
              </label>
              <select
                value={lang}
                onChange={e => onLangChange(e.target.value as Language)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
              </select>
            </div>
          </div>

          {/* Text area */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1.5">
              {t('pasteLabel', lang)}
            </label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value.slice(0, MAX_CHARS))}
              rows={10}
              placeholder={t('pastePlaceholder', lang)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none leading-relaxed"
            />
            <p className={`text-xs mt-1 text-right ${text.length > MAX_CHARS * 0.9 ? 'text-amber-500' : 'text-slate-400'}`}>
              {text.length.toLocaleString()} / {MAX_CHARS.toLocaleString()} {t('charCount', lang)}
            </p>
          </div>

          {/* File upload dropzone */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1.5">
              {t('uploadLabel', lang)}
            </label>
            <div
              className={`rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 text-center cursor-pointer transition-all ${dragOver ? 'drop-active' : 'hover:border-blue-300 hover:bg-blue-50/40'}`}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileRef.current?.click()}
            >
              <svg className="mx-auto mb-3 text-slate-300" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <p className="text-sm text-slate-500">{t('dropzone', lang)}</p>
              <p className="text-xs text-slate-400 mt-1">.txt · .pdf</p>
              <input
                ref={fileRef}
                type="file"
                accept=".txt,.pdf"
                className="hidden"
                onChange={onFileChange}
              />
            </div>
            {fileError && (
              <p className="text-xs text-red-500 mt-1.5">⚠ {fileError}</p>
            )}
          </div>

          {/* Error banner */}
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-5 py-4 text-sm text-red-700 flex items-start gap-3">
              <span className="text-lg">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl py-4 font-bold text-white text-base transition-all flex items-center justify-center gap-3 disabled:opacity-60"
            style={{ background: loading ? '#94a3b8' : 'linear-gradient(135deg,#1e3a5f,#3b82f6)', boxShadow: loading ? 'none' : '0 4px 20px rgba(59,130,246,0.35)' }}
          >
            {loading ? (
              <>
                <svg className="spinner w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
                {t('analyzing', lang)}
              </>
            ) : t('analyze', lang)}
          </button>
        </form>
      </main>
    </div>
  );
};
