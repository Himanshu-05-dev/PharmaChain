import React, { useState } from 'react';
import { useDashboard } from '../../features/dashboard/Hooks/dashboard.hooks';
import {
  ArrowDownToLine,
  QrCode,
  CheckCircle2,
  AlertOctagon,
  Truck,
  Plus,
  FileCheck2,
  Sparkles,
  ShieldCheck,
  PackageCheck,
} from 'lucide-react';
import { DataTable, Column } from '../common/DataTable';
import { InboundIntakeEvent } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

export const InboundIntakeView: React.FC = () => {
  const { inbounds, submitInboundIntake, loading, setIsScanModalOpen, setActiveScanMode } = useDashboard();

  const [challanNo, setChallanNo] = useState('');
  const [distributor, setDistributor] = useState('');
  const [packsCount, setPacksCount] = useState<number | ''>('');
  const [tokenInput, setTokenInput] = useState('');

  const handleReceiveStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!challanNo || !distributor || !packsCount) return;
    submitInboundIntake({
      scannedText: tokenInput || 'https://pharmachain.gov.in/verify/0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      deliveryChallanNo: challanNo,
      distributorName: distributor,
      packsReceived: Number(packsCount) || 50,
    });
    setTokenInput('');
    setChallanNo('');
    setDistributor('');
    setPacksCount('');
  };

  const handleLaunchCamera = () => {
    setActiveScanMode('RECEIVE');
    setIsScanModalOpen(true);
  };

  const columns: Column<InboundIntakeEvent>[] = [
    {
      key: 'deliveryChallanNo',
      header: 'Delivery Challan',
      sortable: true,
      render: (item) => (
        <div>
          <span className="font-mono font-bold text-[var(--text-primary)]">{item.deliveryChallanNo}</span>
          <span className="block text-[10px] text-[var(--text-muted)]">{item.distributorName}</span>
        </div>
      ),
    },
    {
      key: 'batchId',
      header: 'Batch & Medicine Received',
      sortable: true,
      render: (item) => (
        <div>
          <span className="font-bold text-[var(--text-primary)]">{item.medicineName}</span>
          <span className="block text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
            Batch: {item.batchId}
          </span>
        </div>
      ),
    },
    {
      key: 'packsReceived',
      header: 'Quantity',
      align: 'right',
      sortable: true,
      render: (item) => (
        <span className="font-bold font-mono text-[var(--text-primary)]">
          +{item.packsReceived.toLocaleString()} Packs
        </span>
      ),
    },
    {
      key: 'signatureVerified',
      header: 'Signature Validation',
      align: 'center',
      render: (item) => (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" /> Verified Valid
        </span>
      ),
    },
    {
      key: 'timestamp',
      header: 'Received At',
      sortable: true,
      render: (item) => (
        <span className="text-[var(--text-muted)] text-[11px]">
          {new Date(item.timestamp).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Custody State',
      align: 'center',
      render: (item) => (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
          AT_SHOP
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Inbound Delivery & Stock Intake</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
              Chain of Custody Intake
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Scan and commit stock deliveries from distributors to the Hyperledger Fabric ledger (<code className="font-mono text-emerald-500">MINTED → AT_SHOP</code>)
          </p>
        </div>

        <button
          onClick={handleLaunchCamera}
          className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-sky-600/25 transition-all cursor-pointer"
        >
          <QrCode className="w-4 h-4" />
          <span>Launch Intake Scanner</span>
        </button>
      </div>

      {/* Manual Inbound Intake Card */}
      <div className="bg-[var(--bg-surface)] p-6 rounded-3xl border border-[var(--border)] shadow-subtle space-y-4">
        <div className="flex items-center gap-2 border-b border-[var(--border)] pb-3">
          <Truck className="w-4 h-4 text-sky-500" />
          <h3 className="text-sm font-bold text-[var(--text-primary)]">Log Distributor Delivery Intake</h3>
        </div>

        <form onSubmit={handleReceiveStock} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-[var(--text-primary)] mb-1">Delivery Challan / Invoice No.</label>
            <input
              type="text"
              value={challanNo}
              onChange={(e) => setChallanNo(e.target.value)}
              placeholder="e.g. DC-APEX-2026-8812"
              className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-element)] border border-[var(--border)] text-[var(--text-primary)] font-mono focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-[var(--text-primary)] mb-1">Authorized Distributor</label>
            <input
              type="text"
              value={distributor}
              onChange={(e) => setDistributor(e.target.value)}
              placeholder="Distributor entity name"
              className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-element)] border border-[var(--border)] text-[var(--text-primary)] focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-[var(--text-primary)] mb-1">Packs Received</label>
            <input
              type="number"
              value={packsCount}
              onChange={(e) => setPacksCount(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-element)] border border-[var(--border)] text-[var(--text-primary)] font-mono focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <PackageCheck className="w-4 h-4" />
              <span>{loading ? 'Receiving...' : 'Confirm Delivery Intake'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Intakes Table */}
      <DataTable
        data={inbounds}
        columns={columns}
        keyExtractor={(item) => item.id}
        searchable={true}
        searchPlaceholder="Search by challan, distributor, batch ID..."
        searchFilter={(item, query) =>
          item.deliveryChallanNo.toLowerCase().includes(query) ||
          item.distributorName.toLowerCase().includes(query) ||
          item.batchId.toLowerCase().includes(query) ||
          item.medicineName.toLowerCase().includes(query)
        }
        pageSize={8}
      />
    </div>
  );
};
