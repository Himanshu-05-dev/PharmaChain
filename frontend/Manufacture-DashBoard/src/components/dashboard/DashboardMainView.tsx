import React from 'react';
import { DashboardHeader } from './DashboardHeader';
import { KPISection } from './KPISection';
import { ProductionAnalytics } from './ProductionAnalytics';
import { BatchLifecycleDonut } from './BatchLifecycleDonut';
import { TraceabilityHealthCard } from './TraceabilityHealthCard';
import { RecentBatchesTable } from './RecentBatchesTable';
import { QuickActionsGrid } from './QuickActionsGrid';
import { QRManagementCard } from './QRManagementCard';
import { RecallSafetySection } from './RecallSafetySection';
import { ExpiryMonitorSection } from './ExpiryMonitorSection';
import { QualityAlertsSection } from './QualityAlertsSection';
import { ManufacturerVerificationCard } from './ManufacturerVerificationCard';
import { TopProductsSection } from './TopProductsSection';
import { OrdersShipmentsPreview } from './OrdersShipmentsPreview';
import { ActivityTimeline } from './ActivityTimeline';
import { BlockchainLedgerPreview } from './BlockchainLedgerPreview';

export const DashboardMainView: React.FC = () => {
  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header with greeting, date range & primary actions */}
      <DashboardHeader />

      {/* 2. KPI Metrics Strip (6 Cards) */}
      <KPISection />

      {/* 3. Analytics & Donut & Traceability Health Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Production Area Chart (7 Cols) */}
        <div className="lg:col-span-7">
          <ProductionAnalytics />
        </div>

        {/* Batch Lifecycle Donut (5 Cols) */}
        <div className="lg:col-span-5">
          <BatchLifecycleDonut />
        </div>
      </div>

      {/* 4. Quick Actions Hub */}
      <QuickActionsGrid />

      {/* 5. Live Recent Batches Data Table */}
      <RecentBatchesTable />

      {/* 6. Recall & Safety Center Section */}
      <RecallSafetySection />

      {/* 7. Middle Grid: QR Operations + Expiry Monitor + Traceability Health */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TraceabilityHealthCard />
        <QRManagementCard />
        <ExpiryMonitorSection />
      </div>

      {/* 8. Lower Grid: Quality Alerts + Company Verification + Top Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <QualityAlertsSection />
        <ManufacturerVerificationCard />
        <TopProductsSection />
      </div>

      {/* 9. Business & Ledger Row: Orders + Activity Feed + Blockchain Ledger */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <OrdersShipmentsPreview />
        <ActivityTimeline />
        <BlockchainLedgerPreview />
      </div>
    </div>
  );
};
