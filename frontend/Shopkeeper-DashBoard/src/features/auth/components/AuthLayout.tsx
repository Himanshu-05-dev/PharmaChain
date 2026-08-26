import React from 'react';
import { useAuth } from '../hooks/auth.hooks';
import { useDashboard } from '../../dashboard/Hooks/dashboard.hooks';
import {
  Store,
  Sun,
  Moon,
  CheckCircle2,
} from 'lucide-react';
import { LoginForm } from './LoginForm';
import { RegisterWizard } from './RegisterWizard';
import { PendingKYCView } from './PendingKYCView';
import { ForgotPasswordModal } from './ForgotPasswordModal';

export const AuthLayout: React.FC = () => {
  const { authView, kycStatus, isAuthenticated } = useAuth();
  const { theme, toggleThemeMode } = useDashboard();

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col justify-between selection:bg-emerald-500 selection:text-white relative overflow-x-hidden font-sans">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-[32rem] h-[32rem] bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center font-black text-sm shadow-md shadow-emerald-600/20 ring-1 ring-white/20">
            PC
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-[var(--text-primary)]">
                PharmaChain
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Retail Chemist POS
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">
              Point-of-Sale Verification & Custody Ledger
            </p>
          </div>
        </div>

        {/* Theme Switcher */}
        <button
          onClick={() => toggleThemeMode()}
          className="p-2.5 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-element)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all cursor-pointer shadow-xs"
          title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 my-4">
        <div className="w-full max-w-md">
          {authView === 'register' ? (
            <RegisterWizard />
          ) : authView === 'pending-kyc' || (isAuthenticated && kycStatus === 'PENDING') ? (
            <PendingKYCView />
          ) : (
            <LoginForm />
          )}
        </div>
      </main>

      {/* Forgot Password Modal */}
      {authView === 'forgot-password' && <ForgotPasswordModal />}

      {/* Footer */}
      <footer className="relative z-10 border-t border-[var(--border)] bg-[var(--bg-surface)]/80 backdrop-blur-md py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>CDSCO Form 20/21 Retail Pharmacy Point-of-Sale Compliance</span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span>Channel: mychannel</span>
            <span>•</span>
            <span>Port: 3002</span>
            <span>•</span>
            <span>Zero-Trust POS Protocol</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
