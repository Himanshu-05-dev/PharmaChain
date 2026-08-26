import React from 'react';
import { Sidebar } from './layout/Sidebar';
import { Navbar } from './layout/Navbar';

interface LayoutProps {
  centerWorkspace: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ centerWorkspace }) => {
  return (
    <div className="flex min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <Navbar />

        {/* Dynamic Center Workspace */}
        <main className="flex-1 p-4 sm:p-6 max-w-[1440px] w-full mx-auto">
          {centerWorkspace}
        </main>
      </div>
    </div>
  );
};

export default Layout;
