import React, { useEffect } from 'react';
import { useAuth } from './features/auth/hooks/auth.hooks';
import { useDashboard } from './features/dashboard/Hooks/dashboard.hooks';
import { AuthLayout } from './features/auth/components/AuthLayout';
import { Layout } from './components/layout/Layout';

export const App: React.FC = () => {
  const { isAuthenticated, kycStatus } = useAuth();
  const { theme } = useDashboard();

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.remove('light-theme');
      document.documentElement.classList.add('dark');
    }
  }, [theme]);

  // If not authenticated or pending initial registration KYC, render Auth Portal
  if (!isAuthenticated || kycStatus === 'PENDING') {
    return <AuthLayout />;
  }

  // Authenticated Retail Pharmacy POS & Inventory Workspace
  return <Layout />;
};
