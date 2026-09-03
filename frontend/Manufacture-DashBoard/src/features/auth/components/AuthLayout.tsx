import React from 'react';
import { useAuth } from '../hooks/auth.hooks';
import { useDashboard } from '../../dashboard/Hooks/dashboard.hooks';
import { PharmaChainLogo } from '../../../components/common/PharmaChainLogo';
import {
  ShieldCheck,
  Building2,
  Lock,
  Sun,
  Moon,
  CheckCircle2,
  ArrowLeft,
  Globe,
} from 'lucide-react';
import { LoginForm } from './LoginForm';
import { RegisterWizard } from './RegisterWizard';
import { PendingKYCView } from './PendingKYCView';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { LandingPage } from '../../landing/components/LandingPage';

export const AuthLayout: React.FC = () => {
  const { authView, setAuthView, kycStatus, isAuthenticated } = useAuth();
  const { theme, toggleThemeMode } = useDashboard();

  // If user is on the public landing page, render the full MyGov-inspired portal
  if (authView === 'landing') {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col justify-between selection:bg-amber-500 selection:text-black relative overflow-x-hidden font-sans">
      {/* ─── Dynamic Animated Project Background ─── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Glowing Warm Amber & Crimson Radial Halos */}
        <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] bg-amber-500/15 rounded-full blur-3xl anim-pulse-ring" />
        <div className="absolute top-1/2 -right-32 w-[32rem] h-[32rem] bg-rose-500/15 rounded-full blur-3xl anim-pulse-ring" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-32 left-1/3 w-[26rem] h-[26rem] bg-amber-600/10 rounded-full blur-3xl anim-pulse-ring" style={{ animationDelay: '4s' }} />

        {/* Ambient Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
          style={{
            backgroundImage: `radial-gradient(var(--text-primary) 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
          }}
        />

        {/* Floating Pharma & Blockchain SVG Elements */}
        <div className="absolute inset-0">
          {/* Floating Pill Capsule 1 (Top Left) */}
          <div className="absolute top-[18%] left-[8%] anim-float-slow opacity-25 dark:opacity-40">
            <svg width="60" height="30" viewBox="0 0 80 40" fill="none" className="rotate-[-25deg]">
              <rect x="2" y="2" width="76" height="36" rx="18" stroke="#F59E0B" strokeWidth="2.5" />
              <path d="M40 2 V38" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="3 3" />
              <rect x="40" y="2" width="38" height="36" rx="18" fill="#E11D48" fillOpacity="0.4" />
            </svg>
          </div>

          {/* Floating Pill Capsule 2 (Bottom Right) */}
          <div className="absolute bottom-[22%] right-[10%] anim-float-fast opacity-25 dark:opacity-40">
            <svg width="70" height="35" viewBox="0 0 80 40" fill="none" className="rotate-[35deg]">
              <rect x="2" y="2" width="76" height="36" rx="18" stroke="#E11D48" strokeWidth="2.5" />
              <path d="M40 2 V38" stroke="#E11D48" strokeWidth="2.5" strokeDasharray="3 3" />
              <rect x="2" y="2" width="38" height="36" rx="18" fill="#F59E0B" fillOpacity="0.35" />
            </svg>
          </div>

          {/* Floating Hexagonal Blockchain Node (Top Right) */}
          <div className="absolute top-[14%] right-[15%] anim-float-slow opacity-20 dark:opacity-35" style={{ animationDelay: '1.5s' }}>
            <svg width="64" height="64" viewBox="0 0 100 100" fill="none">
              <polygon points="50 5, 90 28, 90 72, 50 95, 10 72, 10 28" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4 4" />
              <circle cx="50" cy="50" r="14" fill="#F59E0B" fillOpacity="0.2" stroke="#F59E0B" strokeWidth="2" />
              <circle cx="50" cy="50" r="4" fill="#E11D48" />
            </svg>
          </div>

          {/* Floating Molecule / Blockchain Chain Link (Bottom Left) */}
          <div className="absolute bottom-[16%] left-[12%] anim-float-fast opacity-20 dark:opacity-35" style={{ animationDelay: '3s' }}>
            <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
              <line x1="25" y1="25" x2="75" y2="75" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="75" y1="25" x2="25" y2="75" stroke="#E11D48" strokeWidth="2" strokeDasharray="4 4" />
              <circle cx="25" cy="25" r="10" fill="#F59E0B" fillOpacity="0.3" stroke="#F59E0B" strokeWidth="2" />
              <circle cx="75" cy="75" r="10" fill="#E11D48" fillOpacity="0.3" stroke="#E11D48" strokeWidth="2" />
              <circle cx="75" cy="25" r="8" fill="#F59E0B" fillOpacity="0.2" stroke="#F59E0B" strokeWidth="1.5" />
              <circle cx="25" cy="75" r="8" fill="#E11D48" fillOpacity="0.2" stroke="#E11D48" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Subtitle Holographic Scan Laser Bar */}
          <div className="absolute top-[40%] left-[20%] right-[20%] h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Top Navigation Bar with Back to Portal button */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div
            onClick={() => setAuthView('landing')}
            className="cursor-pointer"
            title="Go to National Portal"
          >
            <PharmaChainLogo size={38} withGlow={true} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-[var(--text-primary)]">
                PharmaChain
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30">
                Manufacturer Portal
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">
              CDSCO National Drug Traceability System
            </p>
          </div>
        </div>

        {/* Back to Portal & Theme Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAuthView('landing')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-element)] border border-[var(--border)] text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to National Portal</span>
            <span className="sm:hidden">Portal</span>
          </button>

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
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" />
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

