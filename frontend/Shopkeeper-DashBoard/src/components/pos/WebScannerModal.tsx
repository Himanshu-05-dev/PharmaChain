import React, { useState } from 'react';
import { useDashboard } from '../../features/dashboard/Hooks/dashboard.hooks';
import { Modal } from '../common/Modal';
import {
  QrCode,
  Camera,
  Upload,
  CheckCircle2,
  AlertOctagon,
  Sparkles,
  Zap,
} from 'lucide-react';

export const WebScannerModal: React.FC = () => {
  const {
    isScanModalOpen,
    setIsScanModalOpen,
    activeScanMode,
    setActiveScanMode,
    verifyScan,
    loading,
  } = useDashboard();

  const [inputVal, setInputVal] = useState('');

  if (!isScanModalOpen) return null;

  const handleScanSample = (code: string) => {
    verifyScan(code, activeScanMode);
    setIsScanModalOpen(false);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    verifyScan(inputVal.trim(), activeScanMode);
    setIsScanModalOpen(false);
  };

  return (
    <Modal
      isOpen={isScanModalOpen}
      onClose={() => setIsScanModalOpen(false)}
      title="High-Speed QR Barcode Scanner"
      subtitle={`Operating Mode: ${activeScanMode === 'DISPENSE' ? 'POS Counter Dispense' : 'Inbound Delivery Intake'}`}
      icon={<QrCode className="w-5 h-5 text-emerald-500" />}
      size="md"
    >
      <div className="space-y-5">
        {/* Mode Switcher Pills */}
        <div className="flex bg-[var(--bg-element)] p-1 rounded-xl border border-[var(--border)] text-xs font-semibold">
          <button
            onClick={() => setActiveScanMode('DISPENSE')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeScanMode === 'DISPENSE'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Counter Dispense (POS)
          </button>
          <button
            onClick={() => setActiveScanMode('RECEIVE')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeScanMode === 'RECEIVE'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Inbound Intake (Stock)
          </button>
        </div>

        {/* Camera Viewfinder Mock / Live Target */}
        <div className="relative aspect-video rounded-2xl bg-black border-2 border-emerald-500/50 overflow-hidden flex flex-col items-center justify-center p-6 text-center shadow-inner">
          <div className="absolute inset-8 border border-dashed border-emerald-400/70 rounded-xl pointer-events-none flex items-center justify-center animate-pulse">
            <span className="text-[10px] text-emerald-400/80 font-mono tracking-widest uppercase">
              Position 2D Barcode in Frame
            </span>
          </div>

          <Camera className="w-10 h-10 text-emerald-400 mb-2 opacity-80" />
          <p className="text-xs text-white/90 font-medium">Ready for USB Barcode Scanner or Camera</p>
          <p className="text-[10px] text-white/60 mt-0.5">Supports 2D DataMatrix, GS1 QR, and URL tokens</p>
        </div>

        {/* Fast Simulated Scans */}
        <div className="space-y-2 text-xs">
          <span className="font-semibold text-[var(--text-muted)] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> One-Click Test Tokens:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() =>
                handleScanSample(
                  'https://pharmachain.gov.in/verify/0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069?token=valid_panto_2026'
                )
              }
              className="p-2.5 rounded-xl bg-[var(--bg-element)] hover:bg-[var(--bg-active)] border border-emerald-500/30 text-left transition-colors text-xs"
            >
              <div className="font-bold text-emerald-600 dark:text-emerald-400">Pantoprazole 40mg</div>
              <div className="text-[10px] text-[var(--text-muted)] font-mono">BATCH-2026-005 (Valid)</div>
            </button>

            <button
              onClick={() =>
                handleScanSample(
                  'https://pharmachain.gov.in/verify/0x4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a?token=valid_azithro_2026'
                )
              }
              className="p-2.5 rounded-xl bg-[var(--bg-element)] hover:bg-[var(--bg-active)] border border-emerald-500/30 text-left transition-colors text-xs"
            >
              <div className="font-bold text-emerald-600 dark:text-emerald-400">Azithromycin 500mg</div>
              <div className="text-[10px] text-[var(--text-muted)] font-mono">BATCH-2026-001 (Valid)</div>
            </button>
          </div>
        </div>

        {/* Manual Paste */}
        <form onSubmit={handleManualSubmit} className="pt-2 border-t border-[var(--border)] flex gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Or paste QR Token / Serial..."
            className="flex-1 px-3 py-2 rounded-xl bg-[var(--bg-element)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-emerald-500 font-mono"
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || loading}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer transition-all disabled:opacity-50"
          >
            Submit
          </button>
        </form>
      </div>
    </Modal>
  );
};
