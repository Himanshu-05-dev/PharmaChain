import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Activity, PieChart as PieIcon, ShieldCheck } from 'lucide-react';

const HOURLY_SALES = [
  { time: '09:00', packs: 12, revenue: 1450 },
  { time: '11:00', packs: 28, revenue: 3890 },
  { time: '13:00', packs: 45, revenue: 6200 },
  { time: '15:00', packs: 34, revenue: 4920 },
  { time: '17:00', packs: 62, revenue: 8900 },
  { time: '19:00', packs: 85, revenue: 12400 },
  { time: '21:00', packs: 54, revenue: 7600 },
];

const CATEGORY_DATA = [
  { name: 'Gastrointestinal', value: 35, color: '#10B981' },
  { name: 'Antibiotics', value: 25, color: '#3B82F6' },
  { name: 'Cardiovascular', value: 20, color: '#F59E0B' },
  { name: 'Antidiabetic', value: 12, color: '#8B5CF6' },
  { name: 'Analgesics', value: 8, color: '#EC4899' },
];

export const DashboardCharts: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* 1. Counter Dispense Velocity Chart (7 Cols) */}
      <div className="lg:col-span-7 bg-[var(--bg-surface)] p-6 rounded-3xl border border-[var(--border)] shadow-subtle flex flex-col justify-between space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                Hourly Dispense Velocity & Revenue
              </h3>
              <p className="text-[11px] text-[var(--text-muted)]">
                Real-time Point-of-Sale billing telemetry and blockchain state commitments
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Peak: 19:00 IST
          </span>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={HOURLY_SALES} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={10} tickLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border)',
                  borderRadius: '12px',
                  fontSize: '11px',
                  color: 'var(--text-primary)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10B981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorSales)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Therapeutic Category Stock Mix (5 Cols) */}
      <div className="lg:col-span-5 bg-[var(--bg-surface)] p-6 rounded-3xl border border-[var(--border)] shadow-subtle flex flex-col justify-between space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-500">
              <PieIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                Therapeutic Formulation Mix
              </h3>
              <p className="text-[11px] text-[var(--text-muted)]">Active shelf inventory by category</p>
            </div>
          </div>
        </div>

        <div className="h-44 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={CATEGORY_DATA}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={65}
                paddingAngle={4}
                dataKey="value"
              >
                {CATEGORY_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border)',
                  borderRadius: '12px',
                  fontSize: '11px',
                  color: 'var(--text-primary)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[var(--border)]">
          {CATEGORY_DATA.map((cat, idx) => (
            <div key={idx} className="flex items-center gap-1.5 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
              <span className="text-[11px] text-[var(--text-muted)] truncate">{cat.name}</span>
              <span className="text-[11px] font-bold text-[var(--text-primary)] ml-auto font-mono">{cat.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
