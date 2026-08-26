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
} from 'lucide-react';

export const CryptoRegistryPage: React.FC = () => {
  const { manufacturers } = useAdminData();
  const [selectedMfr, setSelectedMfr] = useState<ManufacturerRecord | null>(null);

  const activeKeyMfrs = manufacturers.filter((m) => m.hasSigningKey);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-3 py-0.5 rounded-full border border-emerald-200/80 dark:border-emerald-800/80 uppercase inline-flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3 h-3 text-emerald-500" />
            Cryptographic Root of Trust
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Cryptographic Keypair Registry
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Live inspection of ECDSA P-256 digital signing keys provisioned across authenticated pharmaceutical manufacturers.
        </p>
      </div>

      {/* Security Engine Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-panel glass-panel-hover p-5 sm:p-6 rounded-2xl flex flex-col justify-between card-highlight">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/20 shadow-sm">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Standard</span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">ECDSA P-256 (secp256r1)</h3>
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
            Meets CDSCO digital drug pedigree standards. 256-bit elliptic curve digital signatures signed over SHA-256 batch token digests.
          </p>
        </div>

        <div className="glass-panel glass-panel-hover p-5 sm:p-6 rounded-2xl flex flex-col justify-between card-highlight">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold border border-blue-500/20 shadow-sm">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Authority</span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">pharma-core JWKS Proxy</h3>
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
            Public keys exposed at <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-800 dark:text-slate-200 font-mono">/.well-known/jwks.json</code> for instant consumer tier 1 cryptographic verification.
          </p>
        </div>

        <div className="glass-panel glass-panel-hover p-5 sm:p-6 rounded-2xl flex flex-col justify-between card-highlight">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold border border-purple-500/20 shadow-sm">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Hardware Level</span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">FIPS 140-2 Level 3</h3>
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
            Private signing keys remain encrypted inside isolated Kubernetes container volumes with zero unauthorized export capability.
          </p>
        </div>
      </div>

      {/* Active Provisioned Keys Directory */}
      <div className="glass-panel rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4.5 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0f1b33]/70 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Provisioned Digital Signing Keys ({activeKeyMfrs.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Active manufacturer nodes authorized to mint cryptographic 2D DataMatrix packaging
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/90 dark:bg-[#0f1b33]/90 border-b border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-4">Manufacturer</th>
                <th className="px-6 py-4">Drug License</th>
                <th className="px-6 py-4">Algorithm</th>
                <th className="px-6 py-4">Keystore Status</th>
                <th className="px-6 py-4 text-right">Certificate Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
              {activeKeyMfrs.map((mfr) => (
                <tr key={mfr.manufacturerId} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group">
                  <td className="px-6 py-4.5">
                    <div className="font-bold text-slate-900 dark:text-white text-xs">{mfr.companyName}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">{mfr.manufacturerId}</div>
                  </td>

                  <td className="px-6 py-4.5 font-mono font-bold text-slate-800 dark:text-slate-200">
                    {mfr.licenseNumber}
                  </td>

                  <td className="px-6 py-4.5">
                    <span className="font-mono text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800 text-[11px] font-semibold">
                      ES256 / secp256r1
                    </span>
                  </td>

                  <td className="px-6 py-4.5">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
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
                      View Public Key PEM
                    </Button>
                  </td>
                </tr>
              ))}
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
