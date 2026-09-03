import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

export const AdminLayout: React.FC = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f1f5f9] dark:bg-[#070d18] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Viewport-locked Sidebar */}
      <AdminSidebar />

      {/* Right Content Column */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl w-full mx-auto pb-12">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
