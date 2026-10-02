import React, { useState } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Users,
  AlertOctagon,
  Globe,
  LogOut,
  X,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';
import { ROUTES } from '../../constants/routes';

export interface AdminSidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  className?: string;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isMobileOpen = false,
  onCloseMobile,
  className = '',
}) => {
  const location = useLocation();
  const [showSignOutNotice, setShowSignOutNotice] = useState(false);

  const navigation = [
    {
      name: 'Dashboard',
      href: ROUTES.ADMIN.ROOT,
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: 'Properties',
      href: ROUTES.ADMIN.PROPERTIES,
      icon: Building2,
    },
    {
      name: 'Users',
      href: ROUTES.ADMIN.USERS,
      icon: Users,
    },
    {
      name: 'Reports',
      href: ROUTES.ADMIN.REPORTS,
      icon: AlertOctagon,
      badge: '7',
    },
  ];

  const handleSignOutClick = () => {
    setShowSignOutNotice(true);
    setTimeout(() => setShowSignOutNotice(false), 3000);
  };

  const navContent = (
    <div className="flex flex-col h-full justify-between">
      <div className="space-y-6">
        {/* Brand header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E2DF]">
          <Link to={ROUTES.ADMIN.ROOT} className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#171717] flex items-center justify-center font-bold text-white shadow-sm">
              <ShieldAlert className="w-5 h-5 text-[#C66A4A]" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-[#171717] tracking-tight">
                Estate<span className="text-[#C66A4A]">X</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider block text-[#737373]">
                Admin Console
              </span>
            </div>
          </Link>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close navigation drawer"
            className="md:hidden p-1.5 rounded-lg text-[#737373] hover:text-[#171717] hover:bg-[#F5F5F2]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#A3A3A3] px-3 block mb-2">
            Management
          </span>
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = item.exact
                ? location.pathname === item.href
                : location.pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={onCloseMobile}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#F8EBE6] text-[#C66A4A] font-bold shadow-2xs border border-[#C66A4A]/20'
                      : 'text-[#737373] hover:text-[#171717] hover:bg-[#F5F5F2]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-[#C66A4A]' : 'text-[#737373]'
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="w-5 h-5 rounded-full bg-[#C66A4A] text-white text-[11px] font-bold flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Actions: View Website & Sign Out */}
      <div className="pt-6 border-t border-[#E2E2DF] space-y-2">
        {showSignOutNotice && (
          <div
            role="status"
            className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2 animate-in fade-in"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Admin session signed out (UI only).</span>
          </div>
        )}

        <Link
          to={ROUTES.HOME}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#222222] hover:bg-[#F5F5F2] hover:text-[#171717] transition-colors"
        >
          <Globe className="w-4 h-4 text-[#737373]" />
          <span>View Website</span>
        </Link>

        <button
          type="button"
          onClick={handleSignOutClick}
          aria-label="Sign out from admin panel"
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#DC2626] hover:bg-red-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC2626]"
        >
          <LogOut className="w-4 h-4 text-[#DC2626]" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside
        className={`hidden md:block w-64 shrink-0 bg-white rounded-2xl border border-[#E2E2DF] p-5 shadow-sm self-start sticky top-24 ${className}`}
      >
        {navContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-[#171717]/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl p-5 flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
