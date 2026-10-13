import React from 'react';
import type { Language } from '../types';
import { t } from '../lib/i18n';

interface Props {
  lang: Language;
}

export const Footer: React.FC<Props> = ({ lang }) => (
  <footer className="mt-auto border-t border-slate-200 bg-white py-6">
    <div className="max-w-5xl mx-auto px-4 text-center">
      <p className="text-xs text-slate-500">
        ⚠️ {t('disclaimer', lang)}
      </p>
      <p className="text-xs text-slate-400 mt-2">
        © {new Date().getFullYear()} PlainClause
      </p>
    </div>
  </footer>
);
