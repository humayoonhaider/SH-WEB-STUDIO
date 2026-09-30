import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, User, LayoutDashboard, Sparkles } from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import { useUserAuth } from '../../context/UserAuthContext';
import { BrandLogo } from './BrandLogo';
import { TopOfferBanner } from '../public/TopOfferBanner';

export const Navbar: React.FC = () => {
  const { settings } = useSite();
  const { user, isAuthenticated } = useUserAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'Portfolio', path: '/work' },
    { label: 'About', path: '/about' },
    { label: 'Reviews', path: '/reviews' },
    { label: 'Refer & Earn', path: '/referral-program', highlight: true },
    { label: 'Contact', path: '/contact' },
  ];

  const handleNavClick = (e: React.MouseEvent, path: string) => {
    if (path.startsWith('/#')) {
      e.preventDefault();
      const targetId = path.replace('/#', '');
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-200 shadow-lg shadow-black/40">
      {/* Top Banner (Integrated inside sticky header so no overlap occurs) */}
      <TopOfferBanner />

      {/* Main Navbar Bar with Clean Solid Obsidian Background */}
      <div
        className={`w-full bg-[#0B0B0F] border-b border-[#1E202B] transition-all duration-200 ${
          isScrolled ? 'py-3 bg-[#0B0B0F]/98 backdrop-blur-xl' : 'py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo / Brand Name */}
            <Link
              to="/"
              className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
            >
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={settings.businessName || 'SH Web Studio'}
                  className="h-8 max-w-[160px] object-contain"
                />
              ) : (
                <BrandLogo variant="nav" size="md" />
              )}
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center space-x-7">
              {navLinks.map((link) => {
                const isAnchor = link.path.startsWith('/#');
                const isActive =
                  !isAnchor &&
                  (location.pathname === link.path ||
                    (link.path !== '/' && location.pathname.startsWith(link.path)));

                return (
                  <Link
                    key={link.label}
                    to={link.path}
                    onClick={(e) => handleNavClick(e, link.path)}
                    className={`text-sm font-medium transition-colors hover:text-white py-1 relative flex items-center gap-1.5 ${
                      isActive ? 'text-white font-semibold' : 'text-neutral-400'
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.highlight && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase bg-blue-600/20 text-blue-400 border border-blue-500/30">
                        10%
                      </span>
                    )}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action CTAs on Large Desktop */}
            <div className="hidden xl:flex items-center gap-3">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl text-white bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 transition-all"
                >
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-[10px] flex items-center justify-center font-bold">
                    {(user?.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span>Dashboard</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                >
                  <User className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Sign In</span>
                </Link>
              )}

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-all shadow-sm"
              >
                <span>Get a Quote</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Tablet & Mobile Menu Toggle Button */}
            <div className="flex xl:hidden items-center gap-2.5">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl text-blue-400 bg-blue-600/15 border border-blue-500/30"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl text-neutral-300 bg-[#17181D] border border-[#262833]"
                >
                  <span>Sign In</span>
                </Link>
              )}

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider text-neutral-200 bg-[#17181D] hover:bg-[#20222B] border border-[#262833] transition-all shadow-sm cursor-pointer"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <>
                    <X className="w-4 h-4 text-neutral-300" />
                    <span>Close</span>
                  </>
                ) : (
                  <>
                    <Menu className="w-4 h-4 text-blue-400" />
                    <span>Menu</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tablet & Mobile Drawer Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-[#262833] bg-[#0E0F14]/98 backdrop-blur-xl px-4 sm:px-6 pt-4 pb-8 space-y-4 shadow-2xl animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#1C1D24]">
              <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-semibold">
                Menu Navigation
              </span>
              <span className="text-[11px] font-mono text-blue-400">SH Web Studio</span>
            </div>

            <nav className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {navLinks.map((link) => {
                const isAnchor = link.path.startsWith('/#');
                const isActive =
                  !isAnchor &&
                  (location.pathname === link.path ||
                    (link.path !== '/' && location.pathname.startsWith(link.path)));

                return (
                  <Link
                    key={link.label}
                    to={link.path}
                    onClick={(e) => handleNavClick(e, link.path)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-blue-600/15 text-blue-400 font-semibold border border-blue-500/30'
                        : 'text-neutral-300 hover:bg-[#1A1B22] hover:text-white border border-transparent'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {link.label}
                      {link.highlight && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-blue-500/20 text-blue-400">
                          10% CUT
                        </span>
                      )}
                    </span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-[#1C1D24] grid grid-cols-1 sm:grid-cols-2 gap-3">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-blue-600/30 border border-blue-500/40 hover:bg-blue-600/40 transition-all text-center"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>My Referral Dashboard</span>
                </Link>
              ) : (
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/25 hover:bg-blue-500/20 transition-all text-center"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Join Referral Program (10%)</span>
                </Link>
              )}

              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 text-center"
              >
                <span>Start a Project / Get Quote</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
