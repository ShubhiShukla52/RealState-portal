import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Building2, ArrowLeft } from 'lucide-react';
import { ROUTES } from '../constants/routes';
import { AuthVisualPanel } from '../pages/auth/components/AuthVisualPanel';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F5F5F2] flex">
      {/* Left/Main Form Section */}
      <div className="flex-1 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-12 xl:px-16 min-h-screen">
        {/* Top Header / Back Link */}
        <div className="w-full max-w-md mx-auto flex items-center justify-between">
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#737373] hover:text-[#171717] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] rounded-md px-1 py-0.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to home</span>
          </Link>

          {/* Compact Logo for Mobile/Tablet */}
          <Link to={ROUTES.HOME} className="flex lg:hidden items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#171717] flex items-center justify-center text-white">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-[#171717]">
              Estate<span className="text-[#C66A4A]">X</span>
            </span>
          </Link>
        </div>

        {/* Center Auth Form Container */}
        <main className="my-auto w-full max-w-md mx-auto py-8">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E2DF] shadow-sm">
            <Outlet />
          </div>
        </main>

        {/* Bottom subtle copyright */}
        <div className="w-full max-w-md mx-auto text-center text-xs text-[#A3A3A3] pt-4">
          <p>© {new Date().getFullYear()} EstateX. All rights reserved.</p>
        </div>
      </div>

      {/* Right Visual Panel (Hidden on Mobile/Tablet, visible on Desktop) */}
      <div className="hidden lg:block lg:w-1/2 xl:w-5/12 shrink-0">
        <AuthVisualPanel />
      </div>
    </div>
  );
};
