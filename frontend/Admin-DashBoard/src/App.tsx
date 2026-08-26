import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { AdminDataProvider } from './context/AdminDataContext';
import { AdminLayout } from './components/layout/AdminLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardOverviewPage } from './pages/DashboardOverviewPage';
import { ManufacturersPage } from './pages/ManufacturersPage';
import { ShopkeepersPage } from './pages/ShopkeepersPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { CryptoRegistryPage } from './pages/CryptoRegistryPage';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase">
            Verifying Government Inspector Session...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ToastProvider>
          <AuthProvider>
            <AdminDataProvider>
            <Routes>
              {/* Public Route */}
              <Route path="/login" element={<LoginPage />} />

              {/* Protected Admin Routes */}
              <Route
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardOverviewPage />} />
                <Route path="/manufacturers" element={<ManufacturersPage />} />
                <Route path="/shopkeepers" element={<ShopkeepersPage />} />
                <Route path="/audit-logs" element={<AuditLogsPage />} />
                <Route path="/keys" element={<CryptoRegistryPage />} />
              </Route>

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AdminDataProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </ThemeProvider>
  );
};
