import React, { useEffect } from 'react';
import { useDashboard } from '../Hooks/dashboard.hooks';
import { DashboardStats } from './DashboardStats';
import { DashboardCharts } from './DashboardCharts';
import { DashboardQuickActions } from './DashboardQuickActions';
import { DashboardTable } from './DashboardTable';
import { DashboardSafety } from './DashboardSafety';
import { DashboardSkeleton } from '../../../components/common/SkeletonLoader';
import './Dashboard.scss';

export const Dashboard: React.FC = () => {
  const { loadDashboard, loading } = useDashboard();

  useEffect(() => {
    loadDashboard().catch(() => { });
  }, [loadDashboard]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="dashboard-root pb-12 space-y-6">
      {/* 1. 6 KPI Metric Cards */}
      <DashboardStats />

      {/* 3. Production Analytics Area Chart & Lifecycle Donut */}
      <DashboardCharts />

      {/* 4. Quick Action Hub */}
      <DashboardQuickActions />

      {/* 5. Live Recent Batches Table */}
      <DashboardTable />

      {/* 6. Active Recall Command Center & Quality Alerts */}
      <DashboardSafety />
    </div>
  );
};

export default Dashboard;

