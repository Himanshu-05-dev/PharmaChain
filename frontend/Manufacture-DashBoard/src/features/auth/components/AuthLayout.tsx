import React from 'react';
import { useAuth } from '../hooks/auth.hooks';
import { useDashboard } from '../../dashboard/Hooks/dashboard.hooks';
import {
  ShieldCheck,
  Building2,
  Lock,
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
      {/* Dynamic Background Glows & Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-[32rem] h-[32rem] bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07]"
          style={{
            backgroundImage: `radial-gradient(var(--text-primary) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* Top Navigation Bar */}
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
                Manufacturer Portal
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">
              CDSCO National Drug Traceability System
            </p>
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleThemeMode()}
            className="p-2.5 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-element)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all cursor-pointer shadow-xs"
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
      </header>

      {/* Main Form Center Stage */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 my-4">
        <div className="w-full max-w-6xl">
          {authView === 'register' ? (
            <RegisterWizard />
          ) : authView === 'pending-kyc' || (isAuthenticated && kycStatus === 'PENDING') ? (
            <PendingKYCView />
          ) : (
            <LoginForm />
          )}
        </div>
      </main>


      {/* Global Modals in Auth */}
      {authView === 'forgot-password' && <ForgotPasswordModal />}

      {/* Bottom Compliance Footer */}
      <footer className="relative z-10 border-t border-[var(--border)] bg-[var(--bg-surface)]/80 backdrop-blur-md py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Complies with CDSCO Gazette GSR 1337(E) & Drugs and Cosmetics Rules</span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span>Secure TLS 1.3</span>
            <span>•</span>
            <span>AES-256-GCM Keystore</span>
            <span>•</span>
            <span>Zero-Trust Enterprise Access</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
