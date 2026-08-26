import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { ToastProvider } from './context/ToastContext';
import { useDashboard } from './features/dashboard/Hooks/dashboard.hooks';
import { useAuth } from './features/auth/hooks/auth.hooks';
import { Layout } from './components/Layout';
import { ToastContainer } from './components/common/Toast';
import { GlobalSearchModal } from './components/layout/GlobalSearchModal';
import { HelpSupportModal } from './components/layout/HelpSupportModal';
import { BatchDetailsModal } from './components/batches/BatchDetailsModal';
import { InitiateRecallModal } from './components/recall/InitiateRecallModal';

// Auth Components
import { AuthLayout } from './features/auth/components/AuthLayout';

// Views
import { Dashboard } from './features/dashboard/components/Dashboard';
import { BatchesView } from './components/batches/BatchesView';
import { CreateBatchWizard } from './components/create-batch/CreateBatchWizard';
import { MedicineInventoryView } from './components/inventory/MedicineInventoryView';
import { QRCodeHubView } from './components/qr/QRCodeHubView';
import { TraceabilityExplorerView } from './components/traceability/TraceabilityExplorerView';
import { BlockchainLedgerView } from './components/traceability/BlockchainLedgerView';
import { RecallCenterView } from './components/recall/RecallCenterView';
import { QualityAlertsView } from './components/alerts/QualityAlertsView';
import { AnalyticsReportsView } from './components/analytics/AnalyticsReportsView';
import { OrdersShipmentsView } from './components/orders/OrdersShipmentsView';
import { CompanyProfileView } from './components/settings/CompanyProfileView';
import { SecuritySettingsView } from './components/settings/SecuritySettingsView';
import { Clock, ShieldAlert, CheckCircle2, Zap } from 'lucide-react';

import './App.scss';

const AppOrchestrator: React.FC = () => {
  const { activeRoute, navigateTo, theme } = useDashboard();
  const { isAuthenticated, kycStatus, simulateKYCApproval, user } = useAuth();

  // Theme initialization on boot before paint
  useEffect(() => {
    const isLight = localStorage.getItem('theme') === 'light' || theme === 'light';
    if (isLight) {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.remove('light-theme');
      document.documentElement.classList.add('dark');
    }
  }, [theme]);


  // Sync active route to browser URL search params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const routeInUrl = params.get('route');
    if (routeInUrl && routeInUrl !== activeRoute) {
      navigateTo(routeInUrl as any);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('route', activeRoute);
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  }, [activeRoute]);

  // If user is not authenticated, render the high-tech Auth portal
  if (!isAuthenticated) {
    return (
      <div className="app-container">
        <AuthLayout />
        <ToastContainer />
      </div>
    );
  }

  const renderActiveView = () => {
    switch (activeRoute) {
      case 'dashboard':
        return <Dashboard />;
      case 'batches':
        return <BatchesView />;
      case 'create-batch':
        return <CreateBatchWizard />;
      case 'inventory':
        return <MedicineInventoryView />;
      case 'qr-codes':
        return <QRCodeHubView />;
      case 'traceability':
        return <TraceabilityExplorerView />;
      case 'ledger':
        return <BlockchainLedgerView />;
      case 'recalls':
        return <RecallCenterView />;
      case 'alerts':
        return <QualityAlertsView />;
      case 'analytics':
      case 'reports':
        return <AnalyticsReportsView />;
      case 'orders':
        return <OrdersShipmentsView />;
      case 'profile':
        return <CompanyProfileView />;
      case 'security':
      case 'settings':
        return <SecuritySettingsView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      {/* Top Banner when KYC Status is PENDING */}
      {kycStatus === 'PENDING' && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-amber-200 sticky top-0 z-30 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
            <span>
              <strong className="text-amber-300">CDSCO KYC Application Pending Review</strong> — ES256 keypair vault provisioning and batch minting are locked until approval.
            </span>
          </div>
          <button
            onClick={simulateKYCApproval}
            className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-sm transition-all shrink-0 cursor-pointer"
          >
            <Zap className="w-3 h-3" />
            <span>Simulate CDSCO Approval</span>
          </button>
        </div>
      )}

      <Layout centerWorkspace={renderActiveView()} />

      {/* Global Modals & Portals */}
      <GlobalSearchModal />
      <HelpSupportModal />
      <BatchDetailsModal />
      <InitiateRecallModal />
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ToastProvider>
        <AppOrchestrator />
      </ToastProvider>
    </Provider>
  );
};

export default App;

