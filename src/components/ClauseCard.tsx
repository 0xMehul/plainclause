import React from 'react';
import type { RiskyClause, Language } from '../types';
import { t } from '../lib/i18n';

interface Props {
  clause: RiskyClause;
  lang: Language;
  index: number;
}

const riskConfig = {
  high:   { bg: 'bg-red-50/60',   border: 'border-red-200',   badge: 'bg-red-100 text-red-700 border-red-200',   dot: 'bg-red-500'   },
  medium: { bg: 'bg-amber-50/60', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  low:    { bg: 'bg-green-50/60', border: 'border-green-200', badge: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-500' },
};

export const ClauseCard: React.FC<Props> = ({ clause, lang, index }) => {
  const cfg = riskConfig[clause.risk];

  return (
    <div
      className={`clause-card rounded-2xl border ${cfg.border} ${cfg.bg} overflow-hidden fade-in bg-white shadow-xs`}
      style={{ animationDelay: `${0.1 * index}s`, opacity: 0 }}
    >
      {/* Risk badge header */}
      <div className={`flex items-center justify-between px-5 py-3 border-b ${cfg.border} bg-white/70`}>
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${cfg.badge}`}>
            {t(clause.risk, lang)}
          </span>
        </div>
      </div>

      {/* Two-column body */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
        <div className="p-5 bg-slate-50/50">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
            {t('original', lang)}
          </p>
          <p className="text-sm text-slate-700 leading-relaxed font-mono whitespace-pre-wrap bg-white p-3 rounded-xl border border-slate-200/70">
            {clause.original}
          </p>
        </div>
        <div className="p-5 flex flex-col justify-between space-y-4">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
              {t('explanation', lang)}
            </p>
            <p className="text-sm text-slate-800 leading-relaxed">
              {clause.explanation}
            </p>
          </div>

          {clause.whyRisky && (
            <div className="rounded-xl bg-red-50/70 border border-red-100 p-3 text-xs text-red-900">
              <span className="font-semibold block mb-0.5 text-red-800 flex items-center gap-1">
                ⚠️ {t('whyRisky', lang)}:
              </span>
              <p className="leading-relaxed">{clause.whyRisky}</p>
            </div>
          )}

          {clause.suggestion && (
            <div className="rounded-xl bg-blue-50/70 border border-blue-100 p-3 text-xs text-blue-900">
              <span className="font-semibold block mb-0.5 text-blue-800 flex items-center gap-1">
                💡 {t('suggestion', lang)}:
              </span>
              <p className="leading-relaxed">{clause.suggestion}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
