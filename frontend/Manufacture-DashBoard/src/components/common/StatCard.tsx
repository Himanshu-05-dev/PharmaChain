import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: number;
  trendLabel?: string;
  icon: React.ReactNode;
  variant?: 'primary' | 'emerald' | 'amber' | 'crimson' | 'slate' | 'indigo';
  sparklineData?: number[];
  onClick?: () => void;
  badge?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  trendLabel = 'vs last month',
  icon,
  variant = 'slate',
  sparklineData,
  onClick,
  badge,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          iconBg: 'bg-brand-50 text-brand-600 border border-brand-100',
          hoverBorder: 'hover:border-brand-300',
          accent: 'border-l-4 border-l-brand-600',
          sparkColor: '#0c87eb',
        };
      case 'emerald':
        return {
          iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
          hoverBorder: 'hover:border-emerald-300',
          accent: 'border-l-4 border-l-emerald-600',
          sparkColor: '#10b981',
        };
      case 'amber':
        return {
          iconBg: 'bg-amber-50 text-amber-600 border border-amber-100',
          hoverBorder: 'hover:border-amber-300',
          accent: 'border-l-4 border-l-amber-500',
          sparkColor: '#f59e0b',
        };
      case 'crimson':
        return {
          iconBg: 'bg-rose-50 text-rose-600 border border-rose-100',
          hoverBorder: 'hover:border-rose-300',
          accent: 'border-l-4 border-l-rose-600',
          sparkColor: '#f43f5e',
        };
      case 'indigo':
        return {
          iconBg: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
          hoverBorder: 'hover:border-indigo-300',
          accent: 'border-l-4 border-l-indigo-600',
          sparkColor: '#6366f1',
        };
      case 'slate':
      default:
        return {
          iconBg: 'bg-slate-100 text-slate-700 border border-slate-200',
          hoverBorder: 'hover:border-slate-300',
          accent: 'border-l-4 border-l-slate-700',
          sparkColor: '#64748b',
        };
    }
  };

  const vStyle = getVariantStyles();

  return (
    <div
      onClick={onClick}
      className={`relative bg-white rounded-xl border border-slate-200/90 p-5 shadow-subtle transition-all duration-200 ${
        vStyle.hoverBorder
      } ${vStyle.accent} ${onClick ? 'cursor-pointer hover:shadow-card hover:-translate-y-0.5' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 truncate">
              {title}
            </span>
            {badge && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-700">
                {badge}
              </span>
            )}
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-sans">
              {value}
            </span>
            {subtitle && (
              <span className="text-xs font-medium text-slate-500 truncate">
                {subtitle}
              </span>
            )}
          </div>
        </div>
        <div className={`p-2.5 rounded-xl shrink-0 ${vStyle.iconBg}`}>
          {icon}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
        {trend !== undefined ? (
          <div className="flex items-center gap-1.5">
            {trend > 0 ? (
              <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                <TrendingUp className="w-3 h-3 mr-0.5" />
                +{trend}%
              </span>
            ) : trend < 0 ? (
              <span className="inline-flex items-center text-xs font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                <TrendingDown className="w-3 h-3 mr-0.5" />
                {trend}%
              </span>
            ) : (
              <span className="inline-flex items-center text-xs font-semibold text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded">
                <Minus className="w-3 h-3 mr-0.5" />
                0%
              </span>
            )}
            <span className="text-xs text-slate-500 truncate">{trendLabel}</span>
          </div>
        ) : (
          <span className="text-xs text-slate-400">{trendLabel}</span>
        )}

        {sparklineData && (
          <div className="w-16 h-6 flex items-end gap-0.5">
            {sparklineData.map((val, idx) => {
              const max = Math.max(...sparklineData);
              const heightPct = Math.max(15, (val / max) * 100);
              return (
                <div
                  key={idx}
                  className="flex-1 rounded-t-sm transition-all duration-300"
                  style={{
                    height: `${heightPct}%`,
                    backgroundColor: vStyle.sparkColor,
                    opacity: idx === sparklineData.length - 1 ? 1 : 0.4 + idx * 0.08,
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
