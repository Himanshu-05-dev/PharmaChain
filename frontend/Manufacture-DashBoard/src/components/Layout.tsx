import React, { useState } from 'react';
import { GovTopNav } from './layout/GovTopNav';
import { GovMegaMenu } from './layout/GovMegaMenu';

interface LayoutProps {
  centerWorkspace: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ centerWorkspace }) => {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] font-sans antialiased selection:bg-teal-600 selection:text-white">
      {/* 1. Official Government Header */}
      <GovTopNav
        onToggleMegaMenu={() => setIsMegaMenuOpen((prev) => !prev)}
        isMegaMenuOpen={isMegaMenuOpen}
      />

      {/* 2. Horizontal Category Ribbon & Collapsible Mega Menu */}
      <GovMegaMenu
        isOpen={isMegaMenuOpen}
        onClose={() => setIsMegaMenuOpen(false)}
      />

      {/* 3. Balanced Dynamic Center Workspace with Proper Margins & Padding */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 py-6">
        {centerWorkspace}
      </main>

      {/* 4. Enterprise Compliance Micro-Footer */}
      <footer className="border-t border-[var(--border)] bg-[var(--bg-surface)] py-3 px-4 sm:px-8 text-xs text-[var(--text-muted)] mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[var(--text-primary)]">CDSCO National Track & Trace System</span>
            <span>•</span>
            <span>Gazette GSR 1337(E) Compliant</span>
          </div>
          <div className="font-mono text-[10px]">
            Hyperledger Fabric 2.5 • ECDSA ES256 Key Vault • Zero-Trust Node
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

