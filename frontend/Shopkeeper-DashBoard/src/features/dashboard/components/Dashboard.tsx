import React, { useEffect } from 'react';
import { DashboardHeader } from './DashboardHeader';
import { DashboardStats } from './DashboardStats';
import { DashboardCharts } from './DashboardCharts';
import { DashboardQuickActions } from './DashboardQuickActions';
import { DashboardRecentSales } from './DashboardRecentSales';
import { DashboardSafety } from './DashboardSafety';
import { useDashboard } from '../Hooks/dashboard.hooks';

export const Dashboard: React.FC = () => {
  const { refreshInventory, refreshSales } = useDashboard();

  useEffect(() => {
    refreshInventory?.();
    refreshSales?.();
  }, [refreshInventory, refreshSales]);
  return (
    <div className="space-y-6">
      {/* 1. Header & Quick POS Launcher */}
      <DashboardHeader />

      {/* 2. Key Stats Strip */}
      <DashboardStats />

      {/* 3. Charts & Analytics */}
      <DashboardCharts />

      {/* 4. Action Launcher Grid */}
      <DashboardQuickActions />

      {/* 5. Recent Sales Transactions */}
      <DashboardRecentSales />

      {/* 6. Recall & Anti-Counterfeit Safety Monitor */}
      <DashboardSafety />
    </div>
  );
};
