import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Factory,
  Store,
  ScrollText,
  KeyRound,
  ShieldCheck,
  LogOut,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { useAuth } from '../../context/AuthContext';

export const AdminSidebar: React.FC = () => {
  const { stats } = useAdminData();
  const { logout } = useAuth();

  const pendingMfrs = stats?.manufacturers.pending ?? 0;
  const pendingShops = stats?.shopkeepers.pending ?? 0;

  const navItems = [
    {
      to: '/dashboard',
      label: 'Executive Overview',
      icon: LayoutDashboard,
    },
    {
      to: '/manufacturers',
      label: 'Manufacturer KYC',
      icon: Factory,
      badge: pendingMfrs > 0 ? pendingMfrs : undefined,
      badgeColor: 'bg-amber-500 text-white shadow-sm shadow-amber-500/30',
    },
    {
      to: '/shopkeepers',
      label: 'Pharmacy Approvals',
      icon: Store,
      badge: pendingShops > 0 ? pendingShops : undefined,
      badgeColor: 'bg-blue-600 text-white shadow-sm shadow-blue-600/30',
    },
    {
      to: '/audit-logs',
      label: 'Regulatory Audit Log',
      icon: ScrollText,
    },
    {
      to: '/keys',
      label: 'Cryptographic Registry',
      icon: KeyRound,
    },
  ];

  return (
    <aside className="w-64 bg-[#08101f] text-white flex flex-col flex-shrink-0 border-r border-slate-800/80 min-h-screen relative z-20 shadow-xl">
      {/* Brand Header */}
      <div className="px-5 py-5 border-b border-slate-800/80 bg-[#050b16]/70 flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-blue-600/25 flex-shrink-0 border border-white/20">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-display font-black text-sm tracking-tight text-white flex items-center gap-1.5">
            <span>PHARMACHAIN</span>
            <span className="text-[10px] bg-blue-500/20 text-blue-300 font-bold px-1.5 py-0.5 rounded border border-blue-400/30">
              CDSCO
            </span>
          </h1>
          <p className="text-[11px] text-slate-400 font-medium">National Regulatory Portal</p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Oversight & Verification</span>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                      }`}
                    />
                    <span className="tracking-wide">{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-[11px] font-black px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-700 text-slate-200'}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Quick Status / Urgent Action Box */}
      {(pendingMfrs > 0 || pendingShops > 0) && (
        <div className="mx-3 mb-3 p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs backdrop-blur-sm">
          <div className="flex items-center gap-2 text-amber-400 font-bold mb-1">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>Action Required</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {pendingMfrs + pendingShops} registrations awaiting officer review & key provisioning.
          </p>
        </div>
      )}

      {/* Footer / User Profile & Logout */}
      <div className="p-3 border-t border-slate-800/80 bg-[#050b16]/50">
        <button
          onClick={logout}
          className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-rose-950/60 hover:text-rose-300 rounded-xl transition-all border border-transparent hover:border-rose-800/50"
        >
          <div className="flex items-center gap-2">
            <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-400" />
            <span>Sign Out Session</span>
          </div>
        </button>
      </div>
    </aside>
  );
};
