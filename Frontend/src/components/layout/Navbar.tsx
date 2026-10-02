import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Building2,
  Menu,
  X,
  LogIn,
  UserPlus,
  Heart,
  LayoutDashboard,
} from 'lucide-react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { NotificationBell } from '../notifications/NotificationBell';
import { useFavorites } from '../../context/FavoritesContext';
import { ROUTES } from '../../constants/routes';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { favoritesCount } = useFavorites();

  const navLinks = [
    { label: 'Home', path: ROUTES.HOME },
    { label: 'Properties', path: ROUTES.PROPERTIES },
    { label: 'Inquiries', path: ROUTES.INQUIRIES },
    { label: 'Sell', path: ROUTES.SELL.ROOT },
    { label: 'About', path: ROUTES.ABOUT },
  ];

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle Escape key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const isActive = (path: string) => {
    if (path === ROUTES.HOME) {
      return location.pathname === ROUTES.HOME;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E2DF]">
      <Container size="xl">
        <div className="flex items-center justify-between h-16">
          {/* EstateX Logo / Wordmark */}
          <Link
            to={ROUTES.HOME}
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] rounded-lg p-1"
            aria-label="EstateX Home"
          >
            <div className="w-9 h-9 rounded-lg bg-[#171717] flex items-center justify-center font-bold text-white shadow-sm transition-colors group-hover:bg-[#262626]">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-[#171717]">
                Estate<span className="text-[#C66A4A]">X</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] ${
                    active
                      ? 'text-[#C66A4A] bg-[#F8EBE6] font-semibold'
                      : 'text-[#737373] hover:text-[#171717] hover:bg-[#F5F5F2]'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Action Buttons: Favorites, Notifications, Login & Register */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Favorites Icon Button */}
            <Link
              to={ROUTES.DASHBOARD.FAVORITES}
              className="relative p-2 rounded-xl border border-[#E2E2DF] bg-white text-[#222222] hover:text-[#171717] hover:bg-[#F5F5F2] hover:border-[#A3A3A3] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717]"
              title="Saved Favorites"
              aria-label={`Favorites (${favoritesCount} saved)`}
            >
              <Heart className="w-5 h-5" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-[#C66A4A] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {favoritesCount > 99 ? '99+' : favoritesCount}
                </span>
              )}
            </Link>

            {/* Notification Bell Dropdown */}
            <NotificationBell />

            {/* Dashboard / Auth Links */}
            <Link to={ROUTES.DASHBOARD.ROOT}>
              <Button variant="ghost" size="sm" icon={LayoutDashboard}>
                Dashboard
              </Button>
            </Link>

            <Link to={ROUTES.LOGIN}>
              <Button variant="secondary" size="sm" icon={LogIn}>
                Login
              </Button>
            </Link>

            <Link to={ROUTES.REGISTER}>
              <Button variant="primary" size="sm" icon={UserPlus}>
                Register
              </Button>
            </Link>
          </div>

          {/* Mobile Right Controls: Notification + Menu Trigger */}
          <div className="flex md:hidden items-center gap-2">
            <NotificationBell />

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#737373] hover:text-[#171717] rounded-lg hover:bg-[#F5F5F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717]"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div
            id="mobile-nav-menu"
            className="md:hidden py-3 border-t border-[#E2E2DF] space-y-1 animate-in fade-in slide-in-from-top-1 duration-150"
          >
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    active
                      ? 'text-[#C66A4A] bg-[#F8EBE6] font-semibold'
                      : 'text-[#737373] hover:text-[#171717] hover:bg-[#F5F5F2]'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Mobile Favorites Link */}
            <Link
              to={ROUTES.DASHBOARD.FAVORITES}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg text-[#737373] hover:text-[#171717] hover:bg-[#F5F5F2]"
            >
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#C66A4A]" />
                Saved Favorites
              </span>
              {favoritesCount > 0 && (
                <span className="text-xs bg-[#F8EBE6] text-[#C66A4A] font-bold px-2 py-0.5 rounded-full">
                  {favoritesCount}
                </span>
              )}
            </Link>

            {/* Mobile Dashboard Link */}
            <Link
              to={ROUTES.DASHBOARD.ROOT}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-[#737373] hover:text-[#171717] hover:bg-[#F5F5F2]"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>User Dashboard</span>
            </Link>

            <div className="pt-3 border-t border-[#E2E2DF] flex flex-col gap-2">
              <Link to={ROUTES.LOGIN} onClick={() => setMobileMenuOpen(false)}>
                <Button variant="secondary" size="sm" className="w-full justify-center" icon={LogIn}>
                  Login
                </Button>
              </Link>
              <Link to={ROUTES.REGISTER} onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" size="sm" className="w-full justify-center" icon={UserPlus}>
                  Register
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
};
