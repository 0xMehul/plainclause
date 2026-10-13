import React from 'react';

interface Props {
  score: number; // 0–100
}

function getColor(score: number): { stroke: string; text: string; label: string } {
  if (score <= 33) return { stroke: '#22c55e', text: 'text-green-600', label: 'Low Risk' };
  if (score <= 66) return { stroke: '#f59e0b', text: 'text-amber-500', label: 'Medium Risk' };
  return { stroke: '#ef4444', text: 'text-red-500', label: 'High Risk' };
}

export const RiskGauge: React.FC<Props> = ({ score }) => {
  const radius = 70;
  const stroke = 12;
  const normalizedRadius = radius - stroke / 2;
  // Half-circle gauge: circumference of a semicircle
  const circumference = Math.PI * normalizedRadius; // ~220 for r=70
  const dashOffset = circumference - (score / 100) * circumference;
  const { stroke: strokeColor, text, label } = getColor(score);

  const cx = 110;
  const cy = 100;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox="0 0 220 120" className="w-56 h-32" aria-label={`Risk score: ${score}`}>
        {/* Track */}
        <path
          d={`M ${cx - normalizedRadius} ${cy} A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${cx + normalizedRadius} ${cy}`}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        {/* Filled arc */}
        <path
          className="gauge-arc"
          d={`M ${cx - normalizedRadius} ${cy} A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${cx + normalizedRadius} ${cy}`}
          fill="none"
          stroke={strokeColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
        {/* Score text */}
        <text
          x={cx}
          y={cy - 8}
          textAnchor="middle"
          fontSize="32"
          fontWeight="800"
          fill="#1e293b"
          fontFamily="Inter, sans-serif"
        >
          {score}
        </text>
        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          fontSize="11"
          fill="#64748b"
          fontFamily="Inter, sans-serif"
        >
          / 100
        </text>
      </svg>
      <span className={`text-sm font-semibold ${text} bg-slate-50 px-3 py-1 rounded-full border`}>
        {label}
      </span>
    </div>
  );
};
