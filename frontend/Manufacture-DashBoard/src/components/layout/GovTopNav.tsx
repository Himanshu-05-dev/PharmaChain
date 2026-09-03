import React, { useState, useRef, useEffect } from 'react';
import { useDashboard } from '../../features/dashboard/Hooks/dashboard.hooks';
import { useAuth } from '../../features/auth/hooks/auth.hooks';
import { PharmaChainLogo } from '../common/PharmaChainLogo';
import {
  Menu,
  Search,
  Bell,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  LogOut,
  User,
  ChevronDown,
  Clock,
  Sun,
  Moon,
  Radio,
  Building2,
  KeyRound,
  Grid,
  MoreVertical,
  Check,
  X,
} from 'lucide-react';

interface GovTopNavProps {
  onToggleMegaMenu: () => void;
  isMegaMenuOpen: boolean;
}

export const GovTopNav: React.FC<GovTopNavProps> = ({ onToggleMegaMenu, isMegaMenuOpen }) => {
  const {
    profile,
    alerts,
    recalls,
    setIsSearchOpen,
    setIsHelpOpen,
    navigateTo,
    theme,
    toggleThemeMode,
  } = useDashboard();

  const { user, kycStatus, logout } = useAuth();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAccessOpen, setIsAccessOpen] = useState(false);
  const [notifTab, setNotifTab] = useState<'all' | 'recalls' | 'alerts'>('all');
  const [fontSizeLevel, setFontSizeLevel] = useState<0 | 1 | 2>(0);
  const [isHighContrast, setIsHighContrast] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const accessRef = useRef<HTMLDivElement>(null);

  const activeRecalls = recalls.filter((r) => r.status === 'ACTIVE');
  const unresolvedAlerts = alerts.filter((a) => !a.resolved);
  const totalUnreadCount = activeRecalls.length + unresolvedAlerts.length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (accessRef.current && !accessRef.current.contains(event.target as Node)) {
        setIsAccessOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFontSizeChange = (direction: 'increase' | 'decrease' | 'reset') => {
    let nextLevel: 0 | 1 | 2 = 0;
    if (direction === 'increase') {
      nextLevel = fontSizeLevel === 0 ? 1 : 2;
    } else if (direction === 'decrease') {
      nextLevel = fontSizeLevel === 2 ? 1 : 0;
    } else {
      nextLevel = 0;
    }
    setFontSizeLevel(nextLevel);
    document.documentElement.classList.remove('font-size-large', 'font-size-xlarge');
    if (nextLevel === 1) document.documentElement.classList.add('font-size-large');
    if (nextLevel === 2) document.documentElement.classList.add('font-size-xlarge');
  };

  const toggleHighContrast = () => {
    const next = !isHighContrast;
    setIsHighContrast(next);
    if (next) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[var(--bg-surface)] border-b border-[var(--border)] shadow-xs">
      {/* 1. Official Government Utility Strip */}
      <div className="bg-[#0A192F] text-slate-300 text-[11px] border-b border-slate-800/80 px-4 sm:px-8 lg:px-10 py-1">
        <div className="flex flex-wrap items-center justify-between gap-2 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-3.5 h-2 bg-gradient-to-b from-[#FF9933] via-white to-[#138808] rounded-xs inline-block shadow-xs" />
            <span className="text-slate-100 font-semibold">भारत सरकार | GOVERNMENT OF INDIA</span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="text-slate-400 hidden sm:inline">Central Drugs Standard Control Organisation (CDSCO)</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Ledger Status Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-teal-300 font-mono bg-teal-950/80 px-2 py-0.5 rounded border border-teal-800/50">
              <Radio className="w-2.5 h-2.5 text-teal-400 animate-pulse" />
              <span>Hyperledger Fabric 2.5: Synchronized</span>
            </div>

            {/* Accessibility Quick Menu */}
            <div className="relative" ref={accessRef}>
              <button
                onClick={() => setIsAccessOpen(!isAccessOpen)}
                className="text-slate-300 hover:text-white px-1.5 py-0.5 rounded hover:bg-slate-800 transition-colors cursor-pointer"
                title="Accessibility Tools"
              >
                ♿ Accessibility
              </button>

              {isAccessOpen && (
                <div className="absolute right-0 mt-1.5 w-56 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-3 z-50 text-xs space-y-2.5">
                  <div className="font-bold text-slate-100 border-b border-slate-800 pb-1 flex items-center justify-between">
                    <span>Text & Display</span>
                    <button onClick={() => setIsAccessOpen(false)} className="text-slate-400 hover:text-white">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Text Zoom</div>
                    <div className="flex gap-1">
                      <button onClick={() => handleFontSizeChange('decrease')} className="flex-1 py-1 rounded bg-slate-800 border border-slate-700 text-center font-bold text-slate-200">A-</button>
                      <button onClick={() => handleFontSizeChange('reset')} className="flex-1 py-1 rounded bg-slate-800 border border-slate-700 text-center font-bold text-slate-200">A</button>
                      <button onClick={() => handleFontSizeChange('increase')} className="flex-1 py-1 rounded bg-slate-800 border border-slate-700 text-center font-bold text-slate-200">A+</button>
                    </div>
                  </div>
                  <button
                    onClick={toggleHighContrast}
                    className={`w-full py-1 px-2 rounded border text-left text-xs font-semibold flex items-center justify-between ${
                      isHighContrast ? 'bg-yellow-400 text-black border-yellow-300' : 'bg-slate-800 text-slate-200 border-slate-700'
                    }`}
                  >
                    <span>{isHighContrast ? 'Standard Mode' : 'High Contrast'}</span>
                    {isHighContrast && <Check className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Executive Header */}
      <div className="px-4 sm:px-8 lg:px-10 py-2.5 flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left: 3-Dots Menu Trigger + Brand Identity */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMegaMenu}
            className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isMegaMenuOpen
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25'
                : 'bg-[var(--bg-element)] text-[var(--text-primary)] hover:bg-[var(--bg-active)] border border-[var(--border)]'
            }`}
            title="Navigation Menu (All Modules & Workspaces)"
            aria-label="Toggle navigation menu"
          >
            <MoreVertical className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          </button>

          <div
            onClick={() => navigateTo('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
            title="Go to Dashboard Overview"
          >
            <PharmaChainLogo size={32} withGlow={true} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-[var(--text-primary)] group-hover:text-amber-500 transition-colors">
                  PharmaChain
                </span>
                <span className="hidden md:inline-block text-[10px] font-extrabold uppercase px-2 py-0.2 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30">
                  Manufacturer Portal
                </span>
              </div>
              <p className="text-[10px] text-[var(--text-muted)] font-medium truncate max-w-[220px] hidden sm:block">
                CDSCO National Track & Trace System
              </p>
            </div>
          </div>
        </div>

        {/* Center: Global Spotlight Search */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-[var(--bg-element)] hover:bg-[var(--bg-active)] border border-[var(--border)] text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all group w-full cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-teal-500" />
            <span className="font-medium flex-1 text-left">Search batches, medicine packs, recalls...</span>
            <kbd className="inline-block px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-[var(--bg-surface)] text-[var(--text-muted)] rounded border border-[var(--border)]">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Right: Quick Tools, Notifications, KYC Badge, Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Mobile Search Icon */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="md:hidden p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-element)] border border-transparent hover:border-[var(--border)]"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Help & SOPs */}
          <button
            onClick={() => setIsHelpOpen(true)}
            className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-element)] border border-transparent hover:border-[var(--border)] transition-all cursor-pointer"
            title="Help, SOP Guides & CDSCO Regulations"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Notifications Popover */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-element)] border border-transparent hover:border-[var(--border)] relative transition-all cursor-pointer"
              title="Notifications & Regulatory Alerts"
            >
              <Bell className="w-4 h-4" />
              {totalUnreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[var(--bg-surface)] animate-pulse" />
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[var(--bg-overlay)] border border-[var(--border)] shadow-2xl z-50 overflow-hidden text-xs">
                <div className="p-3.5 border-b border-[var(--border)] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[var(--text-primary)]">Notifications & Alerts</span>
                    {totalUnreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                        {totalUnreadCount} Active
                      </span>
                    )}
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-[var(--border)] bg-[var(--bg-element)] px-2 pt-1 gap-1">
                  {(['all', 'recalls', 'alerts'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setNotifTab(tab)}
                      className={`px-3 py-1.5 text-xs font-semibold capitalize transition-all border-b-2 cursor-pointer ${
                        notifTab === tab
                          ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                          : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {tab === 'all'
                        ? `All (${totalUnreadCount})`
                        : tab === 'recalls'
                        ? `Recalls (${activeRecalls.length})`
                        : `Security (${unresolvedAlerts.length})`}
                    </button>
                  ))}
                </div>

                {/* Filtered Notification List */}
                <div className="max-h-72 overflow-y-auto divide-y divide-[var(--border)]">
                  {(notifTab === 'all' || notifTab === 'recalls') &&
                    activeRecalls.map((recall) => (
                      <div
                        key={recall.id}
                        onClick={() => {
                          navigateTo('recalls');
                          setIsNotifOpen(false);
                        }}
                        className="p-3 hover:bg-[var(--bg-active)] cursor-pointer flex items-start gap-2.5 transition-colors"
                      >
                        <AlertOctagon className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-rose-600 dark:text-rose-400">Recall: {recall.batchId}</span>
                            <span className="text-[10px] text-[var(--text-muted)] font-mono">{recall.date}</span>
                          </div>
                          <p className="text-[11px] text-[var(--text-muted)] line-clamp-1 mt-0.5">{recall.reason}</p>
                        </div>
                      </div>
                    ))}

                  {(notifTab === 'all' || notifTab === 'alerts') &&
                    unresolvedAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        onClick={() => {
                          navigateTo('alerts');
                          setIsNotifOpen(false);
                        }}
                        className="p-3 hover:bg-[var(--bg-active)] cursor-pointer flex items-start gap-2.5 transition-colors"
                      >
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-[var(--text-primary)]">{alert.title}</span>
                            <span className="text-[10px] text-[var(--text-muted)]">{alert.timestamp}</span>
                          </div>
                          <p className="text-[11px] text-[var(--text-muted)] line-clamp-1 mt-0.5">{alert.description}</p>
                        </div>
                      </div>
                    ))}

                  {((notifTab === 'recalls' && activeRecalls.length === 0) ||
                    (notifTab === 'alerts' && unresolvedAlerts.length === 0) ||
                    (notifTab === 'all' && totalUnreadCount === 0)) && (
                    <div className="p-6 text-center text-xs text-[var(--text-muted)]">
                      No active notifications in this category.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-xl hover:bg-[var(--bg-element)] border border-transparent hover:border-[var(--border)] transition-all cursor-pointer"
            >
              <div
                className={`w-7 h-7 rounded-lg text-white font-bold text-xs flex items-center justify-center shadow-xs ${
                  kycStatus === 'APPROVED' ? 'bg-teal-700' : 'bg-amber-600'
                }`}
              >
                {(user?.name || profile.name).slice(0, 2).toUpperCase()}
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-[var(--text-primary)] leading-none truncate max-w-[130px]">
                  {user?.name || profile.name}
                </div>
                <div className="text-[10px] flex items-center gap-1 mt-0.5 font-mono">
                  {kycStatus === 'APPROVED' ? (
                    <span className="text-teal-600 dark:text-teal-400 font-semibold flex items-center gap-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5" /> CDSCO Verified
                    </span>
                  ) : (
                    <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" /> KYC Pending
                    </span>
                  )}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[var(--bg-overlay)] border border-[var(--border)] shadow-2xl z-50 p-2 text-xs space-y-1">
                <div className="px-2.5 py-2 border-b border-[var(--border)]">
                  <div className="font-bold text-[var(--text-primary)] truncate">{user?.name || profile.name}</div>
                  <div className="text-[10px] text-[var(--text-muted)] font-mono truncate">
                    {user?.licenseNumber || profile.licenseNumber}
                  </div>
                </div>

                <button
                  onClick={() => {
                    navigateTo('profile');
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-[var(--text-primary)] hover:bg-[var(--bg-element)] text-left transition-colors cursor-pointer"
                >
                  <Building2 className="w-3.5 h-3.5 text-teal-500" />
                  <span>Company Legal Profile</span>
                </button>

                <button
                  onClick={() => {
                    navigateTo('security');
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-[var(--text-primary)] hover:bg-[var(--bg-element)] text-left transition-colors cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5 text-teal-500" />
                  <span>ECDSA Cryptographic Key Vault</span>
                </button>

                {/* Theme toggle row in dropdown */}
                <button
                  onClick={() => toggleThemeMode()}
                  className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-[var(--text-primary)] hover:bg-[var(--bg-element)] text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    {theme === 'dark' ? (
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <Moon className="w-3.5 h-3.5 text-slate-700" />
                    )}
                    <span>{theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[var(--text-muted)] bg-[var(--bg-element)] px-1.5 py-0.5 rounded border border-[var(--border)]">
                    {theme === 'dark' ? 'DARK' : 'LIGHT'}
                  </span>
                </button>

                {/* Sign out */}
                <div className="pt-1 border-t border-[var(--border)]">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-rose-500 hover:bg-rose-500/10 text-left transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="font-semibold">Sign Out from Portal</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default GovTopNav;
