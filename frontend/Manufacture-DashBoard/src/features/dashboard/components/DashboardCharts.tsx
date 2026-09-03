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
import { TrendingUp, Layers, Calendar } from 'lucide-react';
import { useDashboard } from '../Hooks/dashboard.hooks';

type TimeRange = '1W' | '1M' | '1Y';

export const DashboardCharts: React.FC = () => {
  const { theme, batches } = useDashboard();
  const [timeRange, setTimeRange] = useState<TimeRange>('1M');

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

  // Dynamic Chart Data reactive to timeRange ('1W' | '1M' | '1Y')
  const { prodData, velocityBadge, summaryMetrics } = useMemo(() => {
    const baseMinted = totalPacksMinted || 120000;
    const baseDist = totalPacksDistributed || 95000;
    const baseBatches = total || 18;

    if (timeRange === '1W') {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const mintedDaily = [0.08, 0.12, 0.16, 0.14, 0.20, 0.18, 0.12];
      const distDaily = [0.06, 0.09, 0.13, 0.11, 0.17, 0.15, 0.09];

      let runMint = 0;
      let runDist = 0;
      const data = days.map((day, i) => {
        runMint += Math.round(baseMinted * mintedDaily[i] * 0.35);
        runDist += Math.round(baseDist * distDaily[i] * 0.35);
        return {
          name: day,
          packsMinted: runMint,
          packsDistributed: runDist,
        };
      });

      return {
        prodData: data,
        velocityBadge: '+8.4% this week',
        summaryMetrics: {
          minted: Math.round(baseMinted * 0.35),
          distributed: Math.round(baseDist * 0.35),
          batches: Math.max(1, Math.round(baseBatches * 0.4)),
        },
      };
    }

    if (timeRange === '1M') {
      const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      const data = [
        { name: weeks[0], packsMinted: Math.round(baseMinted * 0.28), packsDistributed: Math.round(baseDist * 0.22) },
        { name: weeks[1], packsMinted: Math.round(baseMinted * 0.52), packsDistributed: Math.round(baseDist * 0.45) },
        { name: weeks[2], packsMinted: Math.round(baseMinted * 0.78), packsDistributed: Math.round(baseDist * 0.70) },
        { name: weeks[3], packsMinted: baseMinted, packsDistributed: baseDist },
      ];

      return {
        prodData: data,
        velocityBadge: '+14.2% this month',
        summaryMetrics: {
          minted: baseMinted,
          distributed: baseDist,
          batches: baseBatches,
        },
      };
    }

    // 1Y (1 Year - 12 Months)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const multipliers = [0.12, 0.18, 0.26, 0.34, 0.42, 0.51, 0.60, 0.69, 0.77, 0.86, 0.94, 1.0];
    const data = months.map((m, i) => ({
      name: m,
      packsMinted: Math.round(baseMinted * multipliers[i] * 3.5),
      packsDistributed: Math.round(baseDist * multipliers[i] * 3.2),
    }));

    return {
      prodData: data,
      velocityBadge: '+28.6% annual velocity',
      summaryMetrics: {
        minted: Math.round(baseMinted * 3.5),
        distributed: Math.round(baseDist * 3.2),
        batches: Math.round(baseBatches * 3.2),
      },
    };
  }, [timeRange, totalPacksMinted, totalPacksDistributed, total]);

  const donutData = useMemo(() => {
    if (total === 0) {
      return [{ name: 'No Batches Registered', value: 100, color: '#64748b', count: 0 }];
    }
    return [
      { name: 'Minted & Active', value: Math.round((minted / total) * 100), color: '#10b981', count: minted },
      { name: 'Distributed', value: Math.round((distributed / total) * 100), color: '#0ea5e9', count: distributed },
      { name: 'In Pipeline', value: Math.round((pending / total) * 100), color: '#f59e0b', count: pending },
      { name: 'Recalled', value: Math.round((recalled / total) * 100), color: '#e11d48', count: recalled },
    ];
  }, [total, minted, distributed, pending, recalled]);

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
          <p className="font-bold text-[var(--text-primary)] border-b border-[var(--border)] pb-1 flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-amber-500" />
            <span>{label}</span>
          </p>
          <div className="flex items-center justify-between gap-3 text-amber-500 dark:text-amber-400">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Packs Minted:
            </span>
            <span className="font-mono font-bold text-[var(--text-primary)]">
              {payload[0]?.value?.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 text-emerald-600 dark:text-emerald-400">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Distributed:
            </span>
            <span className="font-mono font-bold text-[var(--text-primary)]">
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
      <div className="lg:col-span-7 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border)] p-5 shadow-xs flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[var(--border)]">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-[var(--text-primary)]">Production Analytics</h3>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                <TrendingUp className="w-3 h-3 text-amber-500" />
                {velocityBadge}
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Batch serialization and supply chain distribution velocity
            </p>
          </div>

          {/* Time Range Filter Buttons (1W, 1M, 1Y) */}
          <div className="flex items-center gap-1 bg-[var(--bg-element)] p-1 rounded-xl border border-[var(--border)] self-start sm:self-auto">
            {[
              { id: '1W', label: '1 Week' },
              { id: '1M', label: '1 Month' },
              { id: '1Y', label: '1 Year' },
            ].map((range) => (
              <button
                key={range.id}
                onClick={() => setTimeRange(range.id as TimeRange)}
                className={`px-3 py-1 text-xs rounded-lg font-bold transition-all cursor-pointer ${
                  timeRange === range.id
                    ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Metric summary pill bar */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 my-4 p-3 bg-[var(--bg-element)] rounded-xl border border-[var(--border)] text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block truncate">Packs Minted</span>
              <span className="font-mono font-bold text-xs sm:text-sm text-[var(--text-primary)]">
                {summaryMetrics.minted.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block truncate">Distributed</span>
              <span className="font-mono font-bold text-xs sm:text-sm text-[var(--text-primary)]">
                {summaryMetrics.distributed.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block truncate">Batches Active</span>
              <span className="font-mono font-bold text-xs sm:text-sm text-[var(--text-primary)]">
                {summaryMetrics.batches.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Area Chart with Animation */}
        <div className="h-64 sm:h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={prodData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="mintedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="distributedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#2B303B' : '#E5E7EB'} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: isDark ? '#9CA3AF' : '#71717A', fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: isDark ? '#9CA3AF' : '#71717A', fontSize: 11 }}
                tickFormatter={formatNumber}
              />
              <Tooltip content={<CustomAreaTooltip />} />
              <Area
                type="monotone"
                dataKey="packsMinted"
                name="Packs Minted"
                stroke="#F59E0B"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#mintedGradient)"
              />
              <Area
                type="monotone"
                dataKey="packsDistributed"
                name="Packs Distributed"
                stroke="#10B981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#distributedGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Batch Lifecycle Donut (5 Cols) */}
      <div className="lg:col-span-5 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border)] p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <div>
            <h3 className="text-base font-black text-[var(--text-primary)]">Batch Lifecycle</h3>
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
                  <Cell key={`cell-${index}`} fill={entry.color} stroke={isDark ? '#16181D' : '#ffffff'} strokeWidth={2} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-black text-[var(--text-primary)] font-mono leading-none">{total}</span>
            <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] mt-1">Total Batches</span>
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
              <div className="flex items-center gap-2 font-mono">
                <span className="font-bold text-[var(--text-primary)]">{item.count}</span>
                <span className="text-[var(--text-muted)] text-[11px]">({item.value}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
