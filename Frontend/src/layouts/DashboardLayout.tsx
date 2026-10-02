import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Container } from '../components/ui/Container';
import { DashboardSidebar } from '../components/dashboard/DashboardSidebar';

export interface DashboardOutletContext {
  openMobileSidebar: () => void;
}

export const DashboardLayout: React.FC = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const openMobileSidebar = () => setIsMobileSidebarOpen(true);
  const closeMobileSidebar = () => setIsMobileSidebarOpen(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F2] text-[#222222]">
      {/* Primary EstateX Navbar */}
      <Navbar />

      {/* Main Dashboard Section */}
      <div className="flex-1 py-6 sm:py-10">
        <Container size="xl">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Sidebar (Desktop sticky + Mobile slide-over) */}
            <DashboardSidebar
              isMobileOpen={isMobileSidebarOpen}
              onCloseMobile={closeMobileSidebar}
            />

            {/* Main Dashboard Content */}
            <main className="flex-1 min-w-0 w-full">
              <Outlet context={{ openMobileSidebar } satisfies DashboardOutletContext} />
            </main>
          </div>
        </Container>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};
