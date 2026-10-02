import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { Container } from '../components/ui/Container';
import { ROUTES } from '../constants/routes';
import { AdminSidebar } from '../components/admin/AdminSidebar';

export interface AdminOutletContext {
  openMobileSidebar: () => void;
}

export const AdminLayout: React.FC = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const openMobileSidebar = () => setIsMobileSidebarOpen(true);
  const closeMobileSidebar = () => setIsMobileSidebarOpen(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F2] text-[#222222]">
      {/* Top Admin Status Bar */}
      <header className="bg-[#171717] text-white sticky top-0 z-30 border-b border-white/10">
        <Container size="xl">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-[#C66A4A]">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                Estate<span className="text-[#C66A4A]">X</span> Admin Console
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/70">
                v2.4 Production Demo
              </span>
            </div>

            <Link
              to={ROUTES.HOME}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Marketplace</span>
            </Link>
          </div>
        </Container>
      </header>

      {/* Main Admin Section with Sidebar & Dynamic Outlet */}
      <div className="flex-1 py-6 sm:py-8">
        <Container size="xl">
          <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
            {/* Sidebar (Desktop sticky + Mobile drawer) */}
            <AdminSidebar
              isMobileOpen={isMobileSidebarOpen}
              onCloseMobile={closeMobileSidebar}
            />

            {/* Main Content Viewport */}
            <main className="flex-1 min-w-0 w-full">
              <Outlet context={{ openMobileSidebar } satisfies AdminOutletContext} />
            </main>
          </div>
        </Container>
      </div>
    </div>
  );
};
