import React, { useState } from 'react';
import { useDashboard } from '../../features/dashboard/Hooks/dashboard.hooks';
import {
  ShieldCheck,
  KeyRound,
  Lock,
  Volume2,
  VolumeX,
  Laptop,
  CheckCircle2,
  Save,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const SecuritySettingsView: React.FC = () => {
  const { showToast } = useToast();
  const [audioBeep, setAudioBeep] = useState(true);
  const [autoLockMinutes, setAutoLockMinutes] = useState('30');
  const [hardwareScanner, setHardwareScanner] = useState('USB_HID');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast({
      type: 'success',
      title: 'Security Settings Saved',
      message: 'Terminal hardware and POS preferences updated.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-subtle">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">POS Hardware & Terminal Security</h2>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          Configure USB 2D barcode scanner integration, sound notifications, and session locks
        </p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
        {/* Terminal Audio & Scanner */}
        <div className="bg-[var(--bg-surface)] p-6 rounded-3xl border border-[var(--border)] shadow-subtle space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border)] pb-2.5">
            Barcode Scanner & Audio Feedback
          </h3>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-[var(--bg-element)] border border-[var(--border)]">
            <div className="space-y-0.5">
              <span className="font-semibold text-[var(--text-primary)] block">POS Verification Audio Beep</span>
              <span className="text-[11px] text-[var(--text-muted)]">Play chime on success and alert tone on counterfeit</span>
            </div>
            <button
              type="button"
              onClick={() => setAudioBeep(!audioBeep)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                audioBeep
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border)]'
              }`}
            >
              {audioBeep ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          <div>
            <label className="block font-semibold text-[var(--text-primary)] mb-1">Hardware Scanner Protocol</label>
            <select
              value={hardwareScanner}
              onChange={(e) => setHardwareScanner(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-element)] border border-[var(--border)] text-[var(--text-primary)] font-bold focus:outline-none"
            >
              <option value="USB_HID">USB Barcode Scanner (HID Keyboard Emulation)</option>
              <option value="WEBCAM">Built-in / External HD Web Camera</option>
              <option value="BLUETOOTH">Bluetooth Wireless Ring / Gun Scanner</option>
            </select>
          </div>
        </div>

        {/* Security & Cryptography */}
        <div className="bg-[var(--bg-surface)] p-6 rounded-3xl border border-[var(--border)] shadow-subtle space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border)] pb-2.5">
            Cryptographic Authentication
          </h3>

          <div className="p-3.5 rounded-2xl bg-[var(--bg-element)] border border-[var(--border)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-muted)]">Signature Standard:</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">ECDSA ES256 (NIST P-256)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-muted)]">Fabric Channel:</span>
              <span className="font-mono text-[var(--text-primary)]">mychannel (TLS-gated)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-muted)]">State Check Before Sale:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Enforced (Must be AT_SHOP)</span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
