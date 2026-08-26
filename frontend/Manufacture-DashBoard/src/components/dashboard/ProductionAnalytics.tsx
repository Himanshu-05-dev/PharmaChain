import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useDashboard } from '../../context/DashboardContext';
import { TrendingUp, Layers, PackageCheck, Truck } from 'lucide-react';

type TimeRange = '7D' | '30D' | '90D' | '1Y';

export const ProductionAnalytics: React.FC = () => {
  const { batches } = useDashboard();
  const [timeRange, setTimeRange] = useState<TimeRange>('30D');

  const data = useMemo(() => {
    const totalPacks = batches.reduce((acc, b) => acc + (b.packsMinted || 0), 0);
    if (batches.length === 0) {
      return [
        { label: 'Week 1', packsMinted: 0, packsDistributed: 0 },
        { label: 'Week 2', packsMinted: 0, packsDistributed: 0 },
        { label: 'Week 3', packsMinted: 0, packsDistributed: 0 },
        { label: 'Week 4', packsMinted: 0, packsDistributed: 0 },
      ];
    }
    return [
      { label: 'Week 1', packsMinted: Math.round(totalPacks * 0.25), packsDistributed: Math.round(totalPacks * 0.2) },
      { label: 'Week 2', packsMinted: Math.round(totalPacks * 0.5), packsDistributed: Math.round(totalPacks * 0.45) },
      { label: 'Week 3', packsMinted: Math.round(totalPacks * 0.75), packsDistributed: Math.round(totalPacks * 0.65) },
      { label: 'Current', packsMinted: totalPacks, packsDistributed: Math.round(totalPacks * 0.9) },
    ];
  }, [batches]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}k`;
    return num.toString();
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 text-white p-3 rounded-xl shadow-xl border border-slate-800 text-xs backdrop-blur space-y-1.5 min-w-[170px]">
          <p className="font-semibold text-slate-300 border-b border-slate-800 pb-1">{label}</p>
          <div className="flex items-center justify-between gap-3 text-brand-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand-400" />
              Packs Minted:
            </span>
            <span className="font-bold text-white">
              {payload[0]?.value?.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 text-emerald-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Distributed:
            </span>
            <span className="font-bold text-white">
              {payload[1]?.value?.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 text-indigo-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              Batches:
            </span>
            <span className="font-bold text-white">
              {payload[2]?.value?.toLocaleString()}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  const totalPacksMinted = useMemo(() => batches.reduce((sum, b) => sum + (b.packsMinted || 0), 0), [batches]);
  const totalDistributed = useMemo(() => {
    return batches
      .filter((b: any) => b.mintStatus === 'DISTRIBUTED' || b.mintStatus === 'PACKAGED')
      .reduce((sum: number, b: any) => sum + (b.packsMinted || 0), 0);
  }, [batches]);

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-subtle flex flex-col justify-between">
      {/* Header with Title and Time Range Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">Production Overview</h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <TrendingUp className="w-3 h-3" />
              {batches.length > 0 ? '+12.6% Velocity' : 'Live Sync'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time batch serialization & dispatch tracking
          </p>
        </div>

        {/* Time Filters */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          {(['7D', '30D', '90D', '1Y'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                timeRange === range
                  ? 'bg-white text-slate-900 shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Metric summary pill bar */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 my-4 p-3 bg-slate-50/75 rounded-xl border border-slate-100 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-brand-500 shrink-0" />
          <div>
            <span className="text-[11px] text-slate-500 block">Packs Minted</span>
            <span className="font-bold text-slate-900">{totalPacksMinted.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
          <div>
            <span className="text-[11px] text-slate-500 block">Packs Distributed</span>
            <span className="font-bold text-slate-900">{totalDistributed.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0" />
          <div>
            <span className="text-[11px] text-slate-500 block">Batches Registered</span>
            <span className="font-bold text-slate-900">{batches.length.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="mintedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0c87eb" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0c87eb" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="distributedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 11 }}
              tickFormatter={formatNumber}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="packsMinted"
              name="Packs Minted"
              stroke="#0c87eb"
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
  );
};
