import React from 'react';

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 6 }) => {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-14 bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl" />
      <div className="h-10 bg-[var(--bg-element)] rounded-xl" />
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-12 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl" />
        ))}
      </div>
    </div>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] animate-pulse space-y-3">
      <div className="h-4 bg-[var(--bg-element)] rounded w-1/3" />
      <div className="h-8 bg-[var(--bg-element)] rounded w-1/2" />
      <div className="h-3 bg-[var(--bg-element)] rounded w-2/3" />
    </div>
  );
};
