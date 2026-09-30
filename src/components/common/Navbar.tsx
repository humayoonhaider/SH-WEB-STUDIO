import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, ExternalLink } from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import { BrandLogo } from './BrandLogo';

export const Navbar: React.FC = () => {
  const { settings } = useSite();
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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-[#0B0B0F]/90 backdrop-blur-md border-b border-[#262833]/80 py-3 shadow-lg shadow-black/20'
          : 'bg-[#0B0B0F]/60 backdrop-blur-sm border-b border-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo / Brand Name */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded">
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

          {/* Desktop Navigation Links (Only on xl screens 1280px+ to ensure zero cramping on tablet) */}
          <nav className="hidden xl:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isAnchor = link.path.startsWith('/#');
              const isActive = !isAnchor && (location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path)));

              return (
                <Link
                  key={link.label}
                  to={link.path}
                  onClick={(e) => handleNavClick(e, link.path)}
                  className={`text-sm font-medium transition-colors hover:text-white py-1 relative ${
                    isActive ? 'text-white font-semibold' : 'text-neutral-400'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action CTAs on Large Desktop */}
          <div className="hidden xl:flex items-center gap-3">
            <Link
              to="/contact?tab=join"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
              title="Apply to join SH Web Studio as a Developer"
            >
              <span>Join Us</span>
              <span className="inline-block px-1 py-0.2 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Hiring
              </span>
            </Link>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F]"
            >
              <span>Get a Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Tablet & Mobile Menu Toggle Button (Visible on screens < 1280px) */}
          <div className="flex xl:hidden items-center gap-3">
            {/* Quick quote button for tablet screens */}
            <Link
              to="/contact"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-sm"
            >
              <span>Get a Quote</span>
            </Link>

            {/* Toggle Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider text-neutral-200 bg-[#17181D] hover:bg-[#20222B] border border-[#262833] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-all shadow-sm"
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

      {/* Tablet & Mobile Drawer Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-[#262833] bg-[#0E0F14]/98 backdrop-blur-xl px-4 sm:px-6 pt-4 pb-8 space-y-4 shadow-2xl animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#1C1D24]">
              <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-semibold">
                Menu Navigation
              </span>
              <span className="text-[11px] font-mono text-blue-400">
                SH Web Studio
              </span>
            </div>

            <nav className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {navLinks.map((link) => {
                const isAnchor = link.path.startsWith('/#');
                const isActive = !isAnchor && (location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path)));

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
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-[#1C1D24] grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                to="/contact?tab=join"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 hover:bg-emerald-500/20 transition-all text-center"
              >
                <span>Join SH Web Studio (Developer)</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-500/30 text-emerald-300">
                  HIRING
                </span>
              </Link>

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
