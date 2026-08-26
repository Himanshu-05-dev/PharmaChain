import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAdminData } from '../../context/AdminDataContext';
import { useTheme } from '../../context/ThemeContext';
import { USE_MOCKS } from '../../services/api';
import { Bell, UserCheck, RefreshCw, Sun, Moon, Shield, Radio } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminHeader: React.FC = () => {
  const { user } = useAuth();
  const { stats, refreshData, isLoading } = useAdminData();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const totalUrgent = stats?.urgentActionRequired ?? 0;

  return (
    <header className="h-16 bg-white/95 dark:bg-[#0a1222]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] transition-colors duration-300">
      {/* Left: Security Status Badge & Refresh */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/60 text-xs shadow-inner">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-slate-700 dark:text-slate-200 text-[11px] sm:text-xs">
            CDSCO Central Gateway Active
          </span>
        </div>

        {USE_MOCKS && (
          <span className="hidden md:inline-flex text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/80">
            Mock Fixtures
          </span>
        )}

        <button
          onClick={refreshData}
          disabled={isLoading}
          className="p-2 text-slate-400 hover:text-navy-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all active:scale-95"
          title="Refresh All Queues"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-600 dark:text-blue-400' : ''}`} />
        </button>
      </div>

      {/* Right: Theme Switch, Notifications & Officer Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Tactile Pill Theme Switch */}
        <div className="flex items-center bg-slate-100/90 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/60 shadow-inner">
          <button
            type="button"
            onClick={() => theme === 'dark' && toggleTheme()}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${
              theme === 'light'
                ? 'bg-white text-amber-600 shadow-sm'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
            title="Switch to Light Theme"
          >
            <Sun className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Light</span>
          </button>
          
          <button
            type="button"
            onClick={() => theme === 'light' && toggleTheme()}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${
              theme === 'dark'
                ? 'bg-[#15233d] text-blue-400 shadow-sm border border-blue-500/30'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
            title="Switch to Dark Theme"
          >
            <Moon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Dark</span>
          </button>
        </div>

        {/* Urgent Alert Trigger */}
        <button
          onClick={() => navigate('/manufacturers')}
          className="relative p-2 text-slate-500 dark:text-slate-300 hover:text-navy-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
          title={`${totalUrgent} items pending inspection`}
        >
          <Bell className="w-5 h-5" />
          {totalUrgent > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-white dark:border-[#0a1222] shadow-sm animate-pulse">
              {totalUrgent}
            </span>
          )}
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />

        {/* Officer Profile Card */}
        <div className="flex items-center gap-2.5 pl-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-navy-800 to-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-blue-900/20 border border-white/20">
            {user?.fullName?.charAt(0) || 'A'}
          </div>
          <div className="text-left hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-900 dark:text-white font-display">
                {user?.fullName || 'Dr. A. K. Verma'}
              </span>
              <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-400 font-semibold uppercase tracking-wider block">
              {user?.role || 'SUPERADMIN'} • {user?.department || 'CDSCO'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
