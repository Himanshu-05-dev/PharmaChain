import React from 'react';
import { useDashboard } from '../../features/dashboard/Hooks/dashboard.hooks';
import { useToast } from '../../context/ToastContext';
import {
  ShieldCheck,
  Key,
  Lock,
  Copy,
  CheckCircle2,
  Server,
  FileCode,
  Radio,
  ExternalLink,
} from 'lucide-react';

export const SecuritySettingsView: React.FC = () => {
  const { profile } = useDashboard();
  const { showToast } = useToast();

  const handleCopy = (text: string, title: string) => {
    navigator.clipboard.writeText(text);
    showToast({
      type: 'info',
      title: 'Copied',
      message: `${title} copied to clipboard.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Cryptographic Key Vault & Security</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              AES-256-GCM Keystore Active
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Zero-trust asymmetric keypair provisioning isolating domain applications from raw cryptographic key material
          </p>
        </div>
      </div>

      {/* Security Architecture Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Key Parameters & Status */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border)] p-6 shadow-subtle space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
                <Key className="w-4 h-4 text-emerald-400" />
                Active ES256 Keypair Metadata
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Hardware Vault Protected
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[var(--bg-element)] border border-[var(--border)]">
                <span className="text-[10px] text-[var(--text-muted)] font-semibold uppercase block">
                  Key Identifier (`kid`)
                </span>
                <span className="font-mono font-bold text-emerald-400 mt-0.5 block">
                  {profile.keyId}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[var(--bg-element)] border border-[var(--border)]">
                <span className="text-[10px] text-[var(--text-muted)] font-semibold uppercase block">
                  Signing Algorithm & Elliptic Curve
                </span>
                <span className="font-bold text-[var(--text-primary)] mt-0.5 block">
                  {profile.keyAlgorithm} (prime256v1)
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[var(--bg-element)] border border-[var(--border)]">
                <span className="text-[10px] text-[var(--text-muted)] font-semibold uppercase block">
                  Vault Encryption Standard
                </span>
                <span className="font-bold text-[var(--text-primary)] mt-0.5 block">
                  {profile.keyStatus}
                </span>
                <span className="text-[10px] text-[var(--text-muted)] mt-0.5 block">
                  scrypt KDF + 128-bit Authentication Tag
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[var(--bg-element)] border border-[var(--border)] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] font-semibold uppercase block">
                    Public JWKS Discovery URL
                  </span>
                  <span className="font-mono text-xs text-[var(--text-primary)] mt-0.5 block">
                    /.well-known/jwks.json
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">24h Cached</span>
              </div>
            </div>
          </div>

          {/* Microservice Security Boundaries */}
          <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border)] p-6 shadow-subtle space-y-3 text-xs">
            <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              Strict Trust Boundaries (Architecture §2.3)
            </h3>
            <ul className="space-y-2 text-[var(--text-muted)]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-[var(--text-primary)]">Private Key Isolation:</strong> Raw private keys never touch ingress. They exist only in isolated RAM for token signing.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-[var(--text-primary)]">Service-to-Service Secret:</strong> All calls to pharma-core require static cluster <code className="font-mono bg-[var(--bg-element)] text-emerald-400 px-1 rounded">X-Service-Token</code>.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-[var(--text-primary)]">Asymmetric Token Verification:</strong> POS and patient scanners validate tokens locally against JWKS public key.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Public Key PEM Visual Representation */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border)] p-6 shadow-subtle space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
                <FileCode className="w-4 h-4 text-emerald-400" />
                Public Key PEM Representation
              </h3>
              <button
                onClick={() => handleCopy(profile.publicKeyPem, 'Public Key PEM')}
                className="p-1.5 rounded-lg bg-[var(--bg-element)] hover:bg-[var(--bg-active)] text-[var(--text-primary)] border border-[var(--border)] transition-colors"
                title="Copy PEM"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-[var(--bg-element)] text-emerald-400 font-mono text-[11px] overflow-x-auto leading-relaxed border border-[var(--border)]">
              {profile.publicKeyPem}
            </pre>

            <div className="text-[11px] text-[var(--text-muted)] leading-relaxed">
              This public key is distributed to consumer mobile verification clients and pharmacy intake scanners for instantaneous offline / Tier-1 signature verification.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
