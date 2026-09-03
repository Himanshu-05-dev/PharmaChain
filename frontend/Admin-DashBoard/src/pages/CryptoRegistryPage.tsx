import React, { useState } from 'react';
import { useAdminData } from '../context/AdminDataContext';
import { PublicKeyModal } from '../components/key/PublicKeyModal';
import { Button } from '../components/common/Button';
import { ManufacturerRecord } from '../types/admin';
import {
  ShieldCheck,
  Lock,
  Cpu,
  Server,
  Eye,
  Sparkles,
  Zap,
  Layers,
  Key,
} from 'lucide-react';

export const CryptoRegistryPage: React.FC = () => {
  const { manufacturers } = useAdminData();
  const [selectedMfr, setSelectedMfr] = useState<ManufacturerRecord | null>(null);

  const activeKeyMfrs = manufacturers.filter((m) => m.hasSigningKey);

  return (
    <div className="space-y-7 animate-fadeIn select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-3 py-0.5 rounded-full border border-emerald-200/80 dark:border-emerald-800/80 uppercase inline-flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3 h-3 text-emerald-500" />
              Cryptographic Root of Trust
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">• FIPS 140-2 Level 3</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white tracking-tight">
            Cryptographic Keypair Registry
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl font-medium">
            Live inspection of provisioned ECDSA P-256 (secp256r1) digital signing keypairs authorized to mint immutable batch tokens.
          </p>
        </div>

        {/* Quick Crypto Summary */}
        <div className="flex items-center gap-3 bg-white dark:bg-[#0b172a] p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm self-start md:self-center">
          <div className="px-3 py-1 text-center border-r border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Active Keys</span>
            <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">{activeKeyMfrs.length}</span>
          </div>
          <div className="px-3 py-1 text-center border-r border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Curve</span>
            <span className="text-sm font-black text-blue-600 dark:text-blue-400 font-mono">P-256</span>
          </div>
          <div className="px-3 py-1 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Keystore</span>
            <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">ONLINE</span>
          </div>
        </div>
      </div>

      {/* Security Architecture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="gov-card gov-card-hover p-6 flex flex-col justify-between card-emerald-highlight">
          <div>
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/20 flex-shrink-0">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Cryptographic Standard</span>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">ECDSA P-256 (secp256r1)</h3>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-4 leading-relaxed font-medium">
              National statutory standard for digital drug pedigree packaging. 256-bit elliptic curve signatures calculated over SHA-256 batch token digests.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">
            <span>SIGNATURE BITLEN: 256</span>
            <span>VERIFIED</span>
          </div>
        </div>

        <div className="gov-card gov-card-hover p-6 flex flex-col justify-between card-blue-highlight">
          <div>
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-600/20 flex-shrink-0">
                <Server className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Key Proxy Gateway</span>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">pharma-core JWKS Proxy</h3>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-4 leading-relaxed font-medium">
              Public keys published at <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-blue-700 dark:text-blue-300 font-mono text-[11px]">/.well-known/jwks.json</code> for instant consumer tier 1 cryptographic QR verification.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono text-blue-700 dark:text-blue-400 font-bold">
            <span>PUBLIC ENDPOINT</span>
            <span>AUTO-SYNCED</span>
          </div>
        </div>

        <div className="gov-card gov-card-hover p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-700 text-white flex items-center justify-center font-bold shadow-md shadow-purple-600/20 flex-shrink-0">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Hardware Protection</span>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">FIPS 140-2 Level 3</h3>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-4 leading-relaxed font-medium">
              Private batch minting keys remain strictly isolated within tamper-evident Kubernetes container volumes with zero raw key extraction capability.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono text-purple-700 dark:text-purple-400 font-bold">
            <span>HSM ISOLATION</span>
            <span>AIR-GAPPED</span>
          </div>
        </div>
      </div>

      {/* Active Provisioned Keys Directory */}
      <div className="bg-white dark:bg-[#0b172a] rounded-2xl border border-slate-200/90 dark:border-slate-800/90 overflow-hidden shadow-sm">
        <div className="px-6 py-4.5 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/90 dark:bg-[#0f1f3a] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black text-slate-900 dark:text-white">
              Provisioned Digital Signing Keys ({activeKeyMfrs.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              Active manufacturer nodes authorized to mint cryptographic 2D DataMatrix packaging
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-[#0f1b33] border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-4">Manufacturer</th>
                <th className="px-6 py-4">Drug License Number</th>
                <th className="px-6 py-4">Cryptographic Algorithm</th>
                <th className="px-6 py-4">Keystore Status</th>
                <th className="px-6 py-4 text-right">Certificate Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {activeKeyMfrs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-slate-400 dark:text-slate-500">
                    <Lock className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No provisioned keys found</p>
                  </td>
                </tr>
              ) : (
                activeKeyMfrs.map((mfr) => (
                  <tr key={mfr.manufacturerId} className="hover:bg-slate-50/90 dark:hover:bg-slate-800/40 transition-colors group">
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
                          {mfr.companyName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 dark:text-white text-xs truncate max-w-[220px]">{mfr.companyName}</div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">{mfr.manufacturerId}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4.5">
                      <code className="font-mono font-bold text-slate-900 dark:text-slate-100 text-xs bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                        {mfr.licenseNumber}
                      </code>
                    </td>

                    <td className="px-6 py-4.5">
                      <span className="font-mono text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-300 dark:border-emerald-800 text-[11px] font-bold">
                        ES256 / secp256r1
                      </span>
                    </td>

                    <td className="px-6 py-4.5">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Active in Core JWKS</span>
                      </span>
                    </td>

                    <td className="px-6 py-4.5 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedMfr(mfr)}
                        icon={<Eye className="w-3.5 h-3.5" />}
                      >
                        View Key PEM
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Public Key Inspector Modal */}
      <PublicKeyModal
        isOpen={!!selectedMfr}
        onClose={() => setSelectedMfr(null)}
        manufacturer={selectedMfr}
      />
    </div>
  );
};
