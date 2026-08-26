import React from 'react';

export const SkeletonBox: React.FC<{
  className?: string;
  style?: React.CSSProperties;
}> = ({ className = '', style }) => {
  return (
    <div
      className={`bg-[var(--bg-element)] rounded-lg relative overflow-hidden animate-pulse ${className}`}
      style={style}
    >
      <div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_1.8s_infinite]"
        style={{
          backgroundImage:
            'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.06) 50%, transparent 100%)',
        }}
      />
    </div>
  );
};

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border)] p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <SkeletonBox className="h-3 w-20" />
            <SkeletonBox className="h-7 w-7 rounded-lg" />
          </div>
          <div className="space-y-1.5">
            <SkeletonBox className="h-6 w-28" />
            <SkeletonBox className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 6,
}) => {
  return (
    <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border)] p-5 space-y-4 shadow-subtle">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
        <div className="space-y-1.5">
          <SkeletonBox className="h-5 w-48" />
          <SkeletonBox className="h-3 w-64" />
        </div>
        <div className="flex items-center gap-2">
          <SkeletonBox className="h-9 w-32 rounded-xl" />
          <SkeletonBox className="h-9 w-28 rounded-xl" />
        </div>
      </div>

      <div className="space-y-3">
        {/* Table Header Row */}
        <div className="grid grid-cols-6 gap-4 py-2 border-b border-[var(--border)]">
          {Array.from({ length: columns }).map((_, i) => (
            <SkeletonBox key={i} className="h-3 w-3/4" />
          ))}
        </div>

        {/* Table Data Rows */}
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-6 gap-4 py-3 border-b border-[var(--border)]/50 last:border-0 items-center"
          >
            <div className="space-y-1">
              <SkeletonBox className="h-3.5 w-24" />
              <SkeletonBox className="h-2.5 w-16" />
            </div>
            <SkeletonBox className="h-3.5 w-32" />
            <SkeletonBox className="h-3.5 w-20" />
            <SkeletonBox className="h-3.5 w-20" />
            <SkeletonBox className="h-6 w-20 rounded-full" />
            <div className="flex items-center gap-2 justify-end">
              <SkeletonBox className="h-7 w-7 rounded-lg" />
              <SkeletonBox className="h-7 w-7 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ChartSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Area Chart Skeleton */}
      <div className="lg:col-span-7 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border)] p-5 space-y-4 shadow-subtle">
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <SkeletonBox className="h-5 w-44" />
            <SkeletonBox className="h-3 w-56" />
          </div>
          <SkeletonBox className="h-8 w-36 rounded-xl" />
        </div>
        <div className="h-64 bg-[var(--bg-element)]/50 rounded-xl flex items-end justify-between p-4 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonBox
              key={i}
              className="w-full rounded-t-lg"
              style={{ height: `${25 + ((i * 19) % 65)}%` }}
            />
          ))}
        </div>
      </div>

      {/* Donut Chart Skeleton */}
      <div className="lg:col-span-5 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border)] p-5 space-y-4 shadow-subtle">
        <div className="space-y-1.5">
          <SkeletonBox className="h-5 w-40" />
          <SkeletonBox className="h-3 w-48" />
        </div>
        <div className="h-64 flex flex-col items-center justify-center gap-4">
          <SkeletonBox className="w-36 h-36 rounded-full" />
          <div className="flex items-center gap-3">
            <SkeletonBox className="h-3 w-16" />
            <SkeletonBox className="h-3 w-16" />
            <SkeletonBox className="h-3 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const ActivitySkeleton: React.FC = () => {
  return (
    <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border)] p-5 space-y-4 shadow-subtle">
      <div className="space-y-1.5">
        <SkeletonBox className="h-5 w-36" />
        <SkeletonBox className="h-3 w-48" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bg-element)]/40">
            <SkeletonBox className="w-8 h-8 rounded-lg shrink-0" />
            <div className="flex-1 space-y-1.5">
              <SkeletonBox className="h-3.5 w-3/4" />
              <SkeletonBox className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Full Dashboard Skeleton Body
 * Matches the layout of DashboardHeader, DashboardStats, DashboardCharts,
 * QuickActions, DashboardTable, Safety & Operations.
 */
export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="dashboard-root pb-12 space-y-6 animate-fadeIn">
      {/* 1. Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border)] shadow-subtle">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <SkeletonBox className="h-6 w-56" />
            <SkeletonBox className="h-5 w-24 rounded-full" />
          </div>
          <SkeletonBox className="h-3.5 w-72" />
        </div>
        <div className="flex items-center gap-2.5">
          <SkeletonBox className="h-9 w-36 rounded-xl" />
          <SkeletonBox className="h-9 w-28 rounded-xl" />
        </div>
      </div>

      {/* 2. 6 KPI Metric Cards Skeleton */}
      <CardSkeleton count={6} />

      {/* 3. Charts Area & Donut Skeleton */}
      <ChartSkeleton />

      {/* 4. Quick Actions Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] space-y-2"
          >
            <SkeletonBox className="w-8 h-8 rounded-lg" />
            <SkeletonBox className="h-3.5 w-20" />
            <SkeletonBox className="h-2.5 w-14" />
          </div>
        ))}
      </div>

      {/* 5. Recent Batches Table Skeleton */}
      <TableSkeleton rows={5} />

      {/* 6. Dual Safety & Recalls Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <ActivitySkeleton />
        </div>
        <div className="lg:col-span-6">
          <ActivitySkeleton />
        </div>
      </div>
    </div>
  );
};
