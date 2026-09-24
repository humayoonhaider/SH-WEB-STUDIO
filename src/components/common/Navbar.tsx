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

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
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

          {/* Right Action CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F]"
            >
              <span>Get a Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#262833] bg-[#121318] px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const isAnchor = link.path.startsWith('/#');
              const isActive = !isAnchor && (location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path)));

              return (
                <Link
                  key={link.label}
                  to={link.path}
                  onClick={(e) => handleNavClick(e, link.path)}
                  className={`px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600/10 text-blue-400 font-semibold'
                      : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="pt-2 border-t border-[#262833]">
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <span>Get a Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
