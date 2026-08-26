import React, { useState } from 'react';
import { useDashboard } from '../../features/dashboard/Hooks/dashboard.hooks';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Lock,
  Package,
  Truck,
  ShoppingCart,
  QrCode,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Copy,
  Clock,
  Radio,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const TraceabilityExplorerView: React.FC = () => {
  const { profile } = useDashboard();
  const { showToast } = useToast();

  const [searchToken, setSearchToken] = useState('');
  const [selectedStatePreset, setSelectedStatePreset] = useState<string>('GENUINE');

  const presets = [
    { id: 'GENUINE', label: '1. Genuine (Fresh Pack)' },
    { id: 'ALREADY_SOLD', label: '2. Already Sold (Reuse Detection)' },
    { id: 'RECALLED', label: '3. Recalled Batch' },
    { id: 'EXPIRED', label: '4. Expired Pack' },
    { id: 'INVALID_SIGNATURE', label: '5. Forged Signature' },
    { id: 'INVALID_MANUFACTURER', label: '6. Suspended License' },
    { id: 'NOT_FOUND_IN_BLOCKCHAIN', label: '7. Unminted Token' },
  ];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast({
      type: 'info',
      title: 'Copied',
      message: 'Hash copied to clipboard.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Medicine Pack Traceability & Provenance</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              End-to-End Cryptographic Verification
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Query individual serial numbers, cryptographic pack hashes, or raw signed JWT tokens across supply chain hops
          </p>
        </div>
      </div>

      {/* Search Bar & Demo State Switcher */}
      <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border)] p-5 shadow-subtle space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchToken}
              onChange={(e) => setSearchToken(e.target.value)}
              placeholder="Enter Pack Serial (e.g. 00042), SHA-256 Hash, or signed JWT token string..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-[var(--border)] bg-[var(--bg-element)] text-[var(--text-primary)] focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono placeholder-[var(--text-muted)]"
            />
          </div>
          <button className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-600/30 transition-all cursor-pointer">
            Verify & Trace Pack
          </button>
        </div>

        {/* 7 State Simulator Pills (from architecture.md §5.5) */}
        <div className="pt-2 border-t border-[var(--border)]">
          <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-2">
            Preview Verification States (Architecture §5.5 Specification):
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {presets.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedStatePreset(p.id)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedStatePreset === p.id
                    ? 'bg-emerald-600 text-white font-bold shadow-sm'
                    : 'bg-[var(--bg-element)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-active)]'
                }`}
              >
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Verification Card Result */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Verification State Banner & Metadata */}
        <div className="lg:col-span-6 space-y-4">
          {/* State 1: Genuine */}
          {selectedStatePreset === 'GENUINE' && (
            <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 text-emerald-400 space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-900/50">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-emerald-300">State: GENUINE (Valid & Authenticated)</h3>
                  <p className="text-xs text-emerald-400/80">
                    ES256 signature cryptographically verified against {profile.name} public key.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* State 2: Already Sold */}
          {selectedStatePreset === 'ALREADY_SOLD' && (
            <div className="p-5 rounded-2xl bg-[var(--alert-warning-bg)] border border-[var(--alert-warning-border)] text-[var(--alert-warning-text)] space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[var(--alert-warning-badge-bg)] text-[var(--alert-warning-icon)]">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[var(--alert-warning-heading)]">Warning: ALREADY_SOLD (Double-Dispense Detected)</h3>
                  <p className="text-xs text-[var(--alert-warning-text)] font-medium">
                    This unit was previously dispensed on 22 Aug 2026 at 14:20. Potential counterfeit clone.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* State 3: Recalled */}
          {selectedStatePreset === 'RECALLED' && (
            <div className="p-5 rounded-2xl bg-[var(--alert-danger-bg)] border border-[var(--alert-danger-border)] text-[var(--alert-danger-text)] space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[var(--alert-danger-badge-bg)] text-[var(--alert-danger-icon)]">
                  <AlertOctagon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[var(--alert-danger-heading)]">Danger: RECALLED (CDSCO Form 28-A Lock)</h3>
                  <p className="text-xs text-[var(--alert-danger-text)] font-medium">
                    Batch has been quarantined due to dissolution rate anomalies. Do not dispense.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* State 4: Expired */}
          {selectedStatePreset === 'EXPIRED' && (
            <div className="p-5 rounded-2xl bg-[var(--alert-warning-bg)] border border-[var(--alert-warning-border)] text-[var(--alert-warning-text)] space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[var(--alert-warning-badge-bg)] text-[var(--alert-warning-icon)]">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[var(--alert-warning-heading)]">Expired: EXPIRED_MEDICINE</h3>
                  <p className="text-xs text-[var(--alert-warning-text)] font-medium">
                    Product shelf life expired. Distribution forbidden by Drugs & Cosmetics Rules.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* State 5: Invalid Signature */}
          {selectedStatePreset === 'INVALID_SIGNATURE' && (
            <div className="p-5 rounded-2xl bg-[var(--alert-danger-bg)] border border-[var(--alert-danger-border)] text-[var(--alert-danger-text)] space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[var(--alert-danger-badge-bg)] text-[var(--alert-danger-icon)]">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[var(--alert-danger-heading)]">Fraud Alert: INVALID_SIGNATURE</h3>
                  <p className="text-xs text-[var(--alert-danger-text)] font-medium">
                    Cryptographic signature does not match manufacturer ES256 key. Counterfeit alert logged.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* State 6: Invalid Manufacturer */}
          {selectedStatePreset === 'INVALID_MANUFACTURER' && (
            <div className="p-5 rounded-2xl bg-[var(--alert-warning-bg)] border border-[var(--alert-warning-border)] text-[var(--alert-warning-text)] space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[var(--alert-warning-badge-bg)] text-[var(--alert-warning-icon)]">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[var(--alert-warning-heading)]">Suspended: INVALID_MANUFACTURER</h3>
                  <p className="text-xs text-[var(--alert-warning-text)] font-medium">
                    Manufacturer license inactive or revoked in national registry.
                  </p>
                </div>
              </div>
            </div>
          )}


          {/* State 7: Not Found in Blockchain */}
          {selectedStatePreset === 'NOT_FOUND_IN_BLOCKCHAIN' && (
            <div className="p-5 rounded-2xl bg-slate-800/30 border border-slate-700/40 text-slate-300 space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-800">
                  <AlertTriangle className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-200">Notice: No Blockchain Record Found</h3>
                  <p className="text-xs text-slate-400">
                    Valid token structure, but no :MFG mint transaction committed on ledger.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Unit Details Box */}
          <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border)] p-5 shadow-subtle space-y-3">
            <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Physical Unit Metadata
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[var(--bg-element)] border border-[var(--border)]">
                <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold block">Serial Number</span>
                <span className="font-mono font-bold text-[var(--text-primary)] mt-0.5 block">#00042</span>
              </div>

              <div className="p-3 rounded-xl bg-[var(--bg-element)] border border-[var(--border)]">
                <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold block">Batch Identifier</span>
                <span className="font-mono font-bold text-emerald-400 mt-0.5 block">BATCH-2026-001</span>
              </div>

              <div className="p-3 rounded-xl bg-[var(--bg-element)] border border-[var(--border)]">
                <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold block">Medicine Name</span>
                <span className="font-bold text-[var(--text-primary)] mt-0.5 block truncate">Paracetamol Tablets IP 500mg</span>
              </div>

              <div className="p-3 rounded-xl bg-[var(--bg-element)] border border-[var(--border)]">
                <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold block">Manufacturing Date</span>
                <span className="font-medium text-[var(--text-primary)] mt-0.5 block">22 Aug 2026</span>
              </div>

              <div className="p-3 rounded-xl bg-[var(--bg-element)] border border-[var(--border)]">
                <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold block">Expiry Date</span>
                <span className="font-medium text-[var(--text-primary)] mt-0.5 block">21 Aug 2028</span>
              </div>

              <div className="p-3 rounded-xl bg-[var(--bg-element)] border border-[var(--border)]">
                <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold block">Manufacturer</span>
                <span className="font-medium text-[var(--text-primary)] mt-0.5 block truncate">{profile.name}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[var(--bg-element)] border border-[var(--border)] text-[var(--text-primary)] text-xs font-mono">
              <span className="text-[10px] text-[var(--text-muted)] uppercase font-sans font-semibold block mb-1">
                SHA-256 Pack Hash
              </span>
              <p className="text-emerald-400 text-[11px] break-all">
                a8f4c910129b01e23764839201f8e9102b48925bb90f2c381294d61085f25b91
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Complete Provenance Event Timeline */}
        <div className="lg:col-span-6">
          <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border)] p-5 shadow-subtle space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div>
                <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                  Append-Only Provenance Timeline
                </h4>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                  Chronological event trail verified by Hyperledger Fabric consensus
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                4 Verified Transitions
              </span>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--border)]">
              {/* Event 1: Minting */}
              <div className="relative">
                <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="bg-[var(--bg-element)] p-3.5 rounded-xl border border-[var(--border)]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--text-primary)]">
                      1. Manufactured & Cryptographically Minted (:MFG)
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)]">22 Aug 2026, 08:30:14</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] mt-1">
                    Minted at Baddi Plant (FAC-HP-01). Signed with ES256 key <code className="font-mono text-emerald-400">{profile.keyId}</code>.
                  </p>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono mt-1.5 block">
                    Fabric Block #18421 • Tx: 0x8f19e4...
                  </span>
                </div>
              </div>

              {/* Event 2: Packaging */}
              <div className="relative">
                <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-teal-500 text-white flex items-center justify-center shadow-sm">
                  <Package className="w-3.5 h-3.5" />
                </div>
                <div className="bg-[var(--bg-element)] p-3.5 rounded-xl border border-[var(--border)]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--text-primary)]">
                      2. Secondary Packaging & QA Thermal Labeling
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)]">22 Aug 2026, 09:15:00</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] mt-1">
                    Sealed in 10-tablet blister strip. Optical barcode verification 100% passed.
                  </p>
                </div>
              </div>

              {/* Event 3: Pharmacy Intake */}
              <div className="relative">
                <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-cyan-500 text-white flex items-center justify-center shadow-sm">
                  <Truck className="w-3.5 h-3.5" />
                </div>
                <div className="bg-[var(--bg-element)] p-3.5 rounded-xl border border-[var(--border)]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--text-primary)]">
                      3. Pharmacy Inventory Intake Scan (:INTAKE)
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)]">22 Aug 2026, 11:45:00</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] mt-1">
                    Scanned at Apollo Pharmacy North Hub (DL-DL-2021-99820). Added to store inventory.
                  </p>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono mt-1.5 block">
                    Fabric Block #18422 • Tx: 0x34b11f...
                  </span>
                </div>
              </div>

              {/* Event 4: Sale or Recall */}
              <div className="relative">
                <div
                  className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center shadow-sm ${
                    selectedStatePreset === 'RECALLED'
                      ? 'bg-rose-600 text-white'
                      : selectedStatePreset === 'ALREADY_SOLD'
                      ? 'bg-amber-500 text-white'
                      : 'bg-emerald-500 text-white'
                  }`}
                >
                  {selectedStatePreset === 'RECALLED' ? (
                    <AlertOctagon className="w-3.5 h-3.5" />
                  ) : (
                    <ShoppingCart className="w-3.5 h-3.5" />
                  )}
                </div>
                <div
                  className={`p-3.5 rounded-xl border ${
                    selectedStatePreset === 'RECALLED'
                      ? 'bg-rose-950/30 border-rose-900/50'
                      : 'bg-[var(--bg-element)] border border-[var(--border)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--text-primary)]">
                      {selectedStatePreset === 'RECALLED'
                        ? '4. Batch Recall Enforced (:RECALL)'
                        : '4. Point-of-Sale Checkout Scan (:SALE)'}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)]">22 Aug 2026, 14:20:10</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] mt-1">
                    {selectedStatePreset === 'RECALLED'
                      ? 'Global batch recall transition committed to ledger. POS checkout rejected.'
                      : 'Sold to consumer. State transition :SALE appended. Unit is now consumed.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
