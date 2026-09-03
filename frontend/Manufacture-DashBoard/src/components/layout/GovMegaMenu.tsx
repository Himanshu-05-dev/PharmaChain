import React, { useState, useRef, useEffect } from 'react';
import { useDashboard } from '../../features/dashboard/Hooks/dashboard.hooks';
import { NavRoute } from '../../features/dashboard/slice/dashboard.slice';
import {
  LayoutDashboard,
  Boxes,
  PlusCircle,
  QrCode,
  Search,
  Database,
  AlertOctagon,
  BellRing,
  BarChart3,
  FileSpreadsheet,
  Building2,
  KeyRound,
  ChevronDown,
  X,
  Truck,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface GovMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavCategory {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  routes: {
    id: NavRoute;
    label: string;
    description: string;
    icon: React.ReactNode;
    badge?: number | string;
    badgeColor?: string;
  }[];
}

export const GovMegaMenu: React.FC<GovMegaMenuProps> = ({ isOpen, onClose }) => {
  const { activeRoute, navigateTo, recalls, alerts } = useDashboard();

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeRecallsCount = recalls.filter((r) => r.status === 'ACTIVE').length;
  const unresolvedAlertsCount = alerts.filter((a) => !a.resolved).length;

  const categories: NavCategory[] = [
    {
      id: 'overview',
      label: 'Overview',
      description: 'Executive KPIs, Telemetry & Recent Activity',
      icon: <LayoutDashboard className="w-4 h-4 text-amber-500" />,
      routes: [
        {
          id: 'dashboard',
          label: 'Dashboard Overview',
          description: 'Live KPIs, batch charts & recall telemetry',
          icon: <LayoutDashboard className="w-4 h-4" />,
        },
      ],
    },
    {
      id: 'manufacturing',
      label: 'Manufacturing & Operations',
      description: 'Batch production, GS1 serialization & inventory',
      icon: <Boxes className="w-4 h-4 text-amber-500" />,
      routes: [
        {
          id: 'batches',
          label: 'Batches & Production',
          description: 'Manage active, quarantined and minted batches',
          icon: <Boxes className="w-4 h-4" />,
        },
        {
          id: 'create-batch',
          label: 'Create Production Batch',
          description: 'Step-by-step wizard & cryptographic key signing',
          icon: <PlusCircle className="w-4 h-4" />,
        },
        {
          id: 'inventory',
          label: 'Medicine Inventory',
          description: 'Formulation stock, warehouse slots & stock levels',
          icon: <Boxes className="w-4 h-4" />,
        },
        {
          id: 'qr-codes',
          label: 'QR Code Operations',
          description: 'GS1 DataMatrix hub, bulk export & label print',
          icon: <QrCode className="w-4 h-4" />,
        },
      ],
    },
    {
      id: 'traceability',
      label: 'Blockchain Traceability',
      description: 'Zero-trust Fabric ledger & node audit trails',
      icon: <Database className="w-4 h-4 text-amber-500" />,
      routes: [
        {
          id: 'traceability',
          label: 'Traceability Explorer',
          description: 'End-to-end supply chain path & custody handoffs',
          icon: <Search className="w-4 h-4" />,
        },
        {
          id: 'ledger',
          label: 'Fabric Ledger Explorer',
          description: 'Raw cryptographic block heights, transactions & hashes',
          icon: <Database className="w-4 h-4" />,
        },
      ],
    },
    {
      id: 'safety',
      label: 'Safety & Recalls',
      description: 'Emergency recall execution & quality alerts',
      icon: <AlertOctagon className="w-4 h-4 text-rose-500" />,
      routes: [
        {
          id: 'recalls',
          label: 'Recall & Safety Center',
          description: 'Immediate multi-echelon recall command center',
          icon: <AlertOctagon className="w-4 h-4" />,
          badge: activeRecallsCount > 0 ? activeRecallsCount : undefined,
          badgeColor: 'bg-rose-500 text-white',
        },
        {
          id: 'alerts',
          label: 'Quality & Security Alerts',
          description: 'Real-time suspicious verification & cold-chain breaches',
          icon: <BellRing className="w-4 h-4" />,
          badge: unresolvedAlertsCount > 0 ? unresolvedAlertsCount : undefined,
          badgeColor: 'bg-amber-500 text-slate-950',
        },
      ],
    },
    {
      id: 'analytics',
      label: 'Analytics & Logistics',
      description: 'Production intelligence & B2B shipments',
      icon: <BarChart3 className="w-4 h-4 text-amber-500" />,
      routes: [
        {
          id: 'analytics',
          label: 'Production Analytics',
          description: 'Throughput metrics, yields & seasonal trends',
          icon: <BarChart3 className="w-4 h-4" />,
        },
        {
          id: 'reports',
          label: 'Regulatory Reports',
          description: 'CDSCO compliance dossiers & CSV audit dumps',
          icon: <FileSpreadsheet className="w-4 h-4" />,
        },
        {
          id: 'orders',
          label: 'B2B Orders & Shipments',
          description: 'Wholesaler dispatches & transit custody validation',
          icon: <Truck className="w-4 h-4" />,
        },
      ],
    },
    {
      id: 'organization',
      label: 'Organization & Legal',
      description: 'Corporate license & cryptographic key vault',
      icon: <Building2 className="w-4 h-4 text-amber-500" />,
      routes: [
        {
          id: 'profile',
          label: 'Company Legal Profile',
          description: 'Manufacturing license, plant facilities & authorized signatories',
          icon: <Building2 className="w-4 h-4" />,
        },
        {
          id: 'security',
          label: 'Cryptographic Key Vault',
          description: 'ES256 Private key management & Hardware Security Module status',
          icon: <KeyRound className="w-4 h-4" />,
        },
      ],
    },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleNav = (route: NavRoute) => {
    navigateTo(route);
    setActiveDropdown(null);
    onClose();
  };

  const handleMouseEnter = (catId: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveDropdown(catId);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          1. HORIZONTAL CATEGORY NAVIGATION RIBBON
      ───────────────────────────────────────────────────────────── */}
      <nav className="bg-[var(--bg-element)] border-b border-[var(--border)] px-4 sm:px-8 lg:px-10 relative z-30 text-xs select-none overflow-visible">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-1 py-1" ref={dropdownRef}>
          <div className="flex items-center gap-1 flex-wrap">
            {/* Overview / Dashboard */}
            <button
              onClick={() => handleNav('dashboard')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeRoute === 'dashboard'
                  ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-active)]'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>

            {/* Category Dropdowns with Click and Hover Support */}
            {categories.slice(1).map((cat) => {
              const isCatActive = cat.routes.some((r) => r.id === activeRoute);
              const isDropdownOpen = activeDropdown === cat.id;

              return (
                <div
                  key={cat.id}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(cat.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    onClick={() => setActiveDropdown(isDropdownOpen ? null : cat.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isCatActive
                        ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-extrabold'
                        : isDropdownOpen
                        ? 'bg-[var(--bg-active)] text-[var(--text-primary)]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-active)]'
                    }`}
                  >
                    <span>{cat.label}</span>
                    {/* Alert Dot */}
                    {cat.id === 'safety' && (activeRecallsCount > 0 || unresolvedAlertsCount > 0) && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    )}
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-amber-500' : ''}`} />
                  </button>

                  {/* Dropdown Floating Menu */}
                  {isDropdownOpen && (
                    <div
                      className="absolute left-0 top-full mt-1.5 w-80 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-2xl p-2.5 z-50 space-y-1 backdrop-blur-xl animate-fadeIn"
                      onMouseEnter={() => handleMouseEnter(cat.id)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="px-3 py-1.5 border-b border-[var(--border)] text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider">
                        {cat.description}
                      </div>

                      <div className="space-y-1 pt-1">
                        {cat.routes.map((sub) => {
                          const isSubActive = activeRoute === sub.id;
                          return (
                            <button
                              key={sub.id}
                              onClick={() => handleNav(sub.id)}
                              className={`w-full flex items-start gap-2.5 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                                isSubActive
                                  ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-xs font-semibold'
                                  : 'hover:bg-[var(--bg-element)] text-[var(--text-primary)]'
                              }`}
                            >
                              <span className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${isSubActive ? 'bg-white/20 text-white' : 'bg-[var(--bg-element)] text-amber-500'}`}>
                                {sub.icon}
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <span className="font-bold text-xs truncate">{sub.label}</span>
                                  {sub.badge && (
                                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full shrink-0 ${sub.badgeColor || 'bg-slate-700 text-white'}`}>
                                      {sub.badge}
                                    </span>
                                  )}
                                </div>
                                <p className={`text-[10px] line-clamp-1 mt-0.5 ${isSubActive ? 'text-white/80' : 'text-[var(--text-muted)]'}`}>
                                  {sub.description}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right: Quick Action Button */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleNav('create-batch')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-bold text-[11px] shadow-xs transition-all cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Create Batch</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ─────────────────────────────────────────────────────────────
          2. FULL COLLAPSIBLE MEGA-MENU DRAWER (3-Dots Master Directory)
      ───────────────────────────────────────────────────────────── */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-start">
          {/* Backdrop */}
          <div
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Panel */}
          <div className="relative z-50 bg-[var(--bg-surface)] border-b border-[var(--border)] shadow-2xl p-4 sm:p-8 max-h-[85vh] overflow-y-auto w-full">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-[var(--text-primary)]">
                      PharmaChain Portal — Complete Operational Directory
                    </h2>
                    <p className="text-xs text-[var(--text-muted)]">
                      CDSCO Pharmaceutical Supply Chain Management & Blockchain Explorer
                    </p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-element)] border border-[var(--border)] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 3x2 Module Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="p-5 rounded-2xl bg-[var(--bg-element)] border border-[var(--border)] space-y-3 shadow-xs"
                  >
                    <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2.5">
                      <div className="p-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border)]">
                        {category.icon}
                      </div>
                      <div>
                        <h3 className="font-black text-sm text-[var(--text-primary)]">
                          {category.label}
                        </h3>
                        <p className="text-[10px] text-[var(--text-muted)]">
                          {category.description}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      {category.routes.map((route) => {
                        const isActive = activeRoute === route.id;
                        return (
                          <button
                            key={route.id}
                            onClick={() => handleNav(route.id)}
                            className={`w-full flex items-start gap-2.5 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                              isActive
                                ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-xs font-semibold'
                                : 'hover:bg-[var(--bg-surface)] text-[var(--text-primary)]'
                            }`}
                          >
                            <span className={`mt-0.5 shrink-0 ${isActive ? 'text-white' : 'text-amber-500'}`}>
                              {route.icon}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-bold text-xs truncate">{route.label}</span>
                                {route.badge && (
                                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full shrink-0 ${route.badgeColor || 'bg-slate-700 text-white'}`}>
                                    {route.badge}
                                  </span>
                                )}
                              </div>
                              <p className={`text-[10px] line-clamp-1 mt-0.5 ${isActive ? 'text-white/80' : 'text-[var(--text-muted)]'}`}>
                                {route.description}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Action Shortcuts Bar */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 font-bold text-amber-700 dark:text-amber-300">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Frequently Executed Manufacturer Workflows:</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleNav('create-batch')}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <span>+ Mint New Batch</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => handleNav('qr-codes')}
                    className="px-3.5 py-1.5 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-element)] text-[var(--text-primary)] border border-[var(--border)] font-bold transition-all cursor-pointer"
                  >
                    Print GS1 Barcodes
                  </button>

                  <button
                    onClick={() => handleNav('recalls')}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-600/15 hover:bg-rose-600/25 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-bold transition-all cursor-pointer"
                  >
                    Initiate Recall Notice
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GovMegaMenu;
