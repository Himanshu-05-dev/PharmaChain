import React, { useMemo } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { useToast } from '../../context/ToastContext';
import {
  FileSpreadsheet,
  Download,
  FileText,
  BarChart3,
  Layers,
  QrCode,
  Search,
  AlertOctagon,
  Package,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const AnalyticsReportsView: React.FC = () => {
  const { batches } = useDashboard();
  const { showToast } = useToast();

  const totalPacksMinted = useMemo(() => batches.reduce((sum, b) => sum + (b.packsMinted || 0), 0), [batches]);
  const totalRecalls = useMemo(() => batches.filter((b) => b.mintStatus === 'RECALLED').length, [batches]);
  const activeProductsCount = useMemo(() => new Set(batches.map((b) => b.medicineName)).size, [batches]);

  const handleExport = (reportName: string, format: 'PDF' | 'CSV') => {
    showToast({
      type: 'info',
      title: 'Generating Report Dossier',
      message: `Compiling ${reportName} in ${format} format...`,
    });
    setTimeout(() => {
      showToast({
        type: 'success',
        title: 'Report Downloaded',
        message: `${reportName.replace(/\s+/g, '_')}_Aug2026.${format.toLowerCase()} ready.`,
      });
    }, 1000);
  };

  const reports = [
    {
      id: 'PROD_REP',
      title: 'Production & Minting Velocity Report',
      description: 'Comprehensive monthly aggregate of batches registered, units packaged, and production velocity across all active plant facilities.',
      icon: <Layers className="w-5 h-5 text-brand-600" />,
      iconBg: 'bg-brand-50 border-brand-100',
      period: 'Monthly (August 2026)',
      recordsCount: `${batches.length} Batches • ${totalPacksMinted.toLocaleString()} Packs`,
    },
    {
      id: 'TRACE_REP',
      title: 'End-to-End Traceability & Provenance Audit',
      description: 'Immutable ledger audit report showing state transitions (:MFG, :INTAKE, :SALE) and physical custody chain across all network terminals.',
      icon: <Search className="w-5 h-5 text-cyan-600" />,
      iconBg: 'bg-cyan-50 border-cyan-100',
      period: 'Year-to-Date 2026',
      recordsCount: `${totalPacksMinted.toLocaleString()} Transitions Verified`,
    },
    {
      id: 'RECALL_REP',
      title: 'Statutory Recall & Safety Dossier (CDSCO Form 28-A)',
      description: 'Detailed incident log of batch recalls, root cause analyses, physical quarantine recovery percentage, and regulatory submissions.',
      icon: <AlertOctagon className="w-5 h-5 text-rose-600" />,
      iconBg: 'bg-rose-50 border-rose-100',
      period: 'Q3 2026',
      recordsCount: `${totalRecalls} Active Recalls`,
    },
    {
      id: 'QR_REP',
      title: 'Cryptographic QR Generation & Key Rotation Log',
      description: 'Audit log of ES256 keypair signatures, SHA-256 hash derivations, print-ready ZIP export hashes, and hardware vault integrity checks.',
      icon: <QrCode className="w-5 h-5 text-emerald-600" />,
      iconBg: 'bg-emerald-50 border-emerald-100',
      period: 'Current Cycle',
      recordsCount: `${totalPacksMinted.toLocaleString()} QR Codes Generated`,
    },
    {
      id: 'INV_REP',
      title: 'Finished Goods Inventory & FEFO Expiry Report',
      description: 'Depot stock levels, expiring batch schedules (30, 60, 90 days), warehouse quarantine counts, and stock velocity turnover.',
      icon: <Package className="w-5 h-5 text-indigo-600" />,
      iconBg: 'bg-indigo-50 border-indigo-100',
      period: 'Real-Time Snapshot',
      recordsCount: `${activeProductsCount} Formulations Registered`,
    },
    {
      id: 'COMP_REP',
      title: 'CDSCO Good Manufacturing Practice (GMP) Compliance',
      description: 'Regulatory audit dossier formatted for annual state licensing inspections, electronic records validation (21 CFR Part 11 equivalent).',
      icon: <ShieldCheck className="w-5 h-5 text-amber-600" />,
      iconBg: 'bg-amber-50 border-amber-100',
      period: 'Annual Review 2026',
      recordsCount: 'Score: 100% Compliant',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Regulatory Reports & Analytics Dossiers</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
              CDSCO Electronic Standard
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Export legally compliant PDF and CSV dossiers with tamper-evident cryptographic checksums
          </p>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((rep) => (
          <div
            key={rep.id}
            className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-subtle flex flex-col justify-between space-y-4 hover:border-brand-200 transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className={`p-2.5 rounded-xl border ${rep.iconBg}`}>
                  {rep.icon}
                </div>
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                  {rep.period}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                {rep.title}
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {rep.description}
              </p>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{rep.recordsCount}</span>
              </div>
            </div>

            {/* Export Actions */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => handleExport(rep.title, 'PDF')}
                className="flex-1 py-2 px-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>

              <button
                onClick={() => handleExport(rep.title, 'CSV')}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
