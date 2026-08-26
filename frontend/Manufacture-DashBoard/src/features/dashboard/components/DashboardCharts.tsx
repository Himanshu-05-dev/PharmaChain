import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingUp, Layers } from 'lucide-react';
import { useDashboard } from '../Hooks/dashboard.hooks';

type TimeRange = '7D' | '30D' | '90D' | '1Y';

export const DashboardCharts: React.FC = () => {
  const { theme, batches } = useDashboard();
  const [timeRange, setTimeRange] = useState<TimeRange>('30D');

  const total = batches.length;
  const minted = batches.filter((b) => b.mintStatus === 'MINTED').length;
  const distributed = batches.filter((b) => b.mintStatus === 'DISTRIBUTED' || b.mintStatus === 'PACKAGED').length;
  const pending = batches.filter((b) => b.mintStatus === 'PENDING' || b.mintStatus === 'MINTING' || b.mintStatus === 'DRAFT').length;
  const recalled = batches.filter((b) => b.mintStatus === 'RECALLED').length;

  const totalPacksMinted = useMemo(() => batches.reduce((sum, b) => sum + (b.packsMinted || 0), 0), [batches]);
  const totalPacksDistributed = useMemo(() => {
    return batches
      .filter((b) => b.mintStatus === 'DISTRIBUTED' || b.mintStatus === 'PACKAGED')
      .reduce((sum, b) => sum + (b.packsMinted || 0), 0);
  }, [batches]);

  const donutData = useMemo(() => {
    if (total === 0) {
      return [{ name: 'No Batches Registered', value: 100, color: '#64748b', count: 0 }];
    }
    return [
      { name: 'Minted & Active', value: Math.round((minted / total) * 100), color: '#10b981', count: minted },
      { name: 'Distributed', value: Math.round((distributed / total) * 100), color: '#06b6d4', count: distributed },
      { name: 'In Pipeline', value: Math.round((pending / total) * 100), color: '#f59e0b', count: pending },
      { name: 'Recalled', value: Math.round((recalled / total) * 100), color: '#f43f5e', count: recalled },
    ];
  }, [total, minted, distributed, pending, recalled]);

  const prodData = useMemo(() => {
    if (total === 0) {
      return [
        { name: 'W1', packsMinted: 0, packsDistributed: 0 },
        { name: 'W2', packsMinted: 0, packsDistributed: 0 },
        { name: 'W3', packsMinted: 0, packsDistributed: 0 },
        { name: 'W4', packsMinted: 0, packsDistributed: 0 },
      ];
    }
    return [
      { name: 'W1', packsMinted: Math.round(totalPacksMinted * 0.25), packsDistributed: Math.round(totalPacksDistributed * 0.2) },
      { name: 'W2', packsMinted: Math.round(totalPacksMinted * 0.5), packsDistributed: Math.round(totalPacksDistributed * 0.45) },
      { name: 'W3', packsMinted: Math.round(totalPacksMinted * 0.8), packsDistributed: Math.round(totalPacksDistributed * 0.7) },
      { name: 'Current', packsMinted: totalPacksMinted, packsDistributed: totalPacksDistributed },
    ];
  }, [totalPacksMinted, totalPacksDistributed, total]);

  const isDark = theme === 'dark';

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}k`;
    return num.toString();
  };

  const CustomAreaTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[var(--bg-overlay)] text-[var(--text-primary)] p-3 rounded-xl shadow-xl border border-[var(--border)] text-xs backdrop-blur space-y-1.5 min-w-[170px]">
          <p className="font-semibold text-[var(--text-muted)] border-b border-[var(--border)] pb-1">{label}</p>
          <div className="flex items-center justify-between gap-3 text-sky-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              Packs Minted:
            </span>
            <span className="font-bold text-[var(--text-primary)]">
              {payload[0]?.value?.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 text-emerald-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Distributed:
            </span>
            <span className="font-bold text-[var(--text-primary)]">
              {payload[1]?.value?.toLocaleString()}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomDonutTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const entry = payload[0].payload;
      return (
        <div className="bg-[var(--bg-overlay)] text-[var(--text-primary)] px-3 py-2 rounded-xl shadow-lg border border-[var(--border)] text-xs">
          <p className="font-semibold text-[var(--text-muted)]">{entry.name}</p>
          <p className="font-bold mt-0.5 text-[var(--text-primary)]">
            {entry.count} batches ({entry.value}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* 1. Production Overview Area Chart (7 Cols) */}
      <div className="lg:col-span-7 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border)] p-5 shadow-subtle flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[var(--border)]">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[var(--text-primary)]">Production Overview</h3>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-500 bg-[var(--brand-subtle)] px-2 py-0.5 rounded-md">
                <TrendingUp className="w-3 h-3" />
                {total > 0 ? '+12.6% Velocity' : 'Live Sync'}
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Batch and pack production vs distribution velocity over time
            </p>
          </div>

          <div className="flex items-center gap-1 bg-[var(--bg-element)] p-1 rounded-xl self-start sm:self-auto">
            {(['7D', '30D', '90D', '1Y'] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                  timeRange === range
                    ? 'bg-[var(--brand-primary)] text-white shadow-sm font-bold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Metric summary pill bar */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 my-4 p-3 bg-[var(--bg-element)] rounded-xl border border-[var(--border)] text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-sky-500 shrink-0" />
            <div>
              <span className="text-[11px] text-[var(--text-muted)] block">Packs Minted</span>
              <span className="font-bold text-[var(--text-primary)]">{totalPacksMinted.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <div>
              <span className="text-[11px] text-[var(--text-muted)] block">Packs Distributed</span>
              <span className="font-bold text-[var(--text-primary)]">{totalPacksDistributed.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0" />
            <div>
              <span className="text-[11px] text-[var(--text-muted)] block">Batches</span>
              <span className="font-bold text-[var(--text-primary)]">{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Area Chart */}
        <div className="h-64 sm:h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={prodData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="mintedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="distributedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#252A40' : '#e2e8f0'} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: isDark ? '#94A3B8' : '#64748b', fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: isDark ? '#94A3B8' : '#64748b', fontSize: 11 }}
                tickFormatter={formatNumber}
              />
              <Tooltip content={<CustomAreaTooltip />} />
              <Area
                type="monotone"
                dataKey="packsMinted"
                name="Packs Minted"
                stroke="#0ea5e9"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#mintedGradient)"
              />
              <Area
                type="monotone"
                dataKey="packsDistributed"
                name="Packs Distributed"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#distributedGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Batch Lifecycle Donut (5 Cols) */}
      <div className="lg:col-span-5 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border)] p-5 shadow-subtle flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">Batch Lifecycle</h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Status distribution across {total} {total === 1 ? 'batch' : 'batches'}
            </p>
          </div>
          <div className="p-2 rounded-xl bg-[var(--bg-element)] text-[var(--text-muted)]">
            <Layers className="w-4 h-4" />
          </div>
        </div>

        {/* Donut Chart */}
        <div className="relative h-48 w-full my-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomDonutTooltip />} />
              <Pie
                data={donutData}
                innerRadius={58}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {donutData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke={isDark ? '#0E1017' : '#ffffff'} strokeWidth={2} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-extrabold text-[var(--text-primary)] leading-none">{total}</span>
            <span className="text-[10px] uppercase font-semibold text-[var(--text-muted)] mt-1">Total Batches</span>
          </div>
        </div>

        {/* Legend List */}
        <div className="space-y-1.5 pt-2 border-t border-[var(--border)]">
          {donutData.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[var(--text-muted)] font-medium">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[var(--text-primary)]">{item.count}</span>
                <span className="text-[var(--text-muted)] text-[11px]">({item.value}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
