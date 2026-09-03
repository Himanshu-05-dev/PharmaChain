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
  sparklineData,
  onClick,
  badge,
}) => {
  return (
    <div
      onClick={onClick}
      className={`group relative bg-[var(--bg-surface)] rounded-2xl border border-[var(--border)] p-4 sm:p-5 shadow-xs transition-all duration-200 hover:border-amber-500/40 hover:shadow-md ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] truncate">
              {title}
            </span>
            {badge && (
              <span className="px-1.5 py-0.2 text-[9px] font-bold rounded-md bg-[var(--bg-element)] text-[var(--text-muted)] border border-[var(--border)]">
                {badge}
              </span>
            )}
          </div>
          <div className="mt-2 flex items-baseline gap-1.5 flex-wrap">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)] font-mono">
              {value}
            </span>
            {subtitle && (
              <span className="text-[11px] font-medium text-[var(--text-muted)] truncate">
                {subtitle}
              </span>
            )}
          </div>
        </div>

        {/* Uniform Professional Icon Container */}
        <div className="p-2.5 rounded-xl shrink-0 bg-[var(--bg-element)] text-[var(--text-primary)] border border-[var(--border)] group-hover:border-amber-500/30 group-hover:text-amber-500 transition-colors">
          {icon}
        </div>
      </div>

      {/* Bottom Trend & Micro Spark Indicator */}
      <div className="mt-3.5 flex items-center justify-between pt-2.5 border-t border-[var(--border)]">
        {trend !== undefined ? (
          <div className="flex items-center gap-1.5 text-xs">
            {trend > 0 ? (
              <span className="inline-flex items-center text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
                +{trend}%
              </span>
            ) : trend < 0 ? (
              <span className="inline-flex items-center text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                <TrendingDown className="w-2.5 h-2.5 mr-0.5" />
                {trend}%
              </span>
            ) : (
              <span className="inline-flex items-center text-[10px] font-bold text-[var(--text-muted)] bg-[var(--bg-element)] px-1.5 py-0.5 rounded border border-[var(--border)]">
                <Minus className="w-2.5 h-2.5 mr-0.5" />
                0%
              </span>
            )}
            <span className="text-[10px] text-[var(--text-muted)] truncate">{trendLabel}</span>
          </div>
        ) : (
          <span className="text-[10px] text-[var(--text-muted)]">{trendLabel}</span>
        )}

        {sparklineData && (
          <div className="w-14 h-5 flex items-end gap-0.5 shrink-0">
            {sparklineData.map((val, idx) => {
              const max = Math.max(...sparklineData, 1);
              const heightPct = Math.max(15, (val / max) * 100);
              return (
                <div
                  key={idx}
                  className="flex-1 rounded-t-xs transition-all duration-300 bg-[var(--text-muted)]/30 group-hover:bg-amber-500/50"
                  style={{
                    height: `${heightPct}%`,
                    opacity: idx === sparklineData.length - 1 ? 0.9 : 0.3 + idx * 0.08,
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

export default StatCard;
