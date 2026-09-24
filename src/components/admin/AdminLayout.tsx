import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  Briefcase,
  Layers,
  Users,
  GitPullRequest,
  MessageSquare,
  Search,
  User,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldAlert,
  Star,
  DollarSign,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSite } from '../../context/SiteContext';
import { BrandLogo } from '../common/BrandLogo';

export const AdminLayout: React.FC = () => {
  const { admin, logout } = useAuth();
  const { settings } = useSite();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Website Settings', path: '/admin/settings', icon: Settings },
    { label: 'Services', path: '/admin/services', icon: Layers },
    { label: 'Projects', path: '/admin/projects', icon: Briefcase },
    { label: 'Pricing & Offers', path: '/admin/pricing', icon: DollarSign },
    { label: 'Reviews & Testimonials', path: '/admin/testimonials', icon: Star },
    { label: 'Team & Founders', path: '/admin/team', icon: Users },
    { label: 'Process Steps', path: '/admin/process', icon: GitPullRequest },
    { label: 'Inquiries', path: '/admin/inquiries', icon: MessageSquare },
    { label: 'SEO & Metadata', path: '/admin/seo', icon: Search },
    { label: 'Admin Profile', path: '/admin/profile', icon: User },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] flex flex-col md:flex-row text-neutral-200">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0E0F14] border-r border-[#1C1D24] shrink-0 sticky top-0 h-screen">
        {/* Brand Header */}
        <div className="p-6 border-b border-[#1C1D24] flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-2">
            <BrandLogo variant="nav" size="sm" />
            <span className="text-[10px] font-mono uppercase bg-blue-600/20 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/30">
              CMS
            </span>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === '/admin'
                ? location.pathname === '/admin'
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom User Area */}
        <div className="p-4 border-t border-[#1C1D24] space-y-3">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-neutral-400 hover:text-white bg-[#121318] hover:bg-[#1A1B22] border border-[#262833] rounded-lg transition-colors"
          >
            <span>Live Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <div className="pt-2 flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <p className="text-xs font-semibold text-white truncate">
                {admin?.name || 'Administrator'}
              </p>
              <p className="text-[11px] text-neutral-500 truncate">{admin?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
              title="Log Out"
              aria-label="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0E0F14] border-b border-[#1C1D24] sticky top-0 z-40">
        <Link to="/admin">
          <BrandLogo variant="nav" size="sm" />
        </Link>
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="p-2 text-neutral-400 hover:text-white rounded-lg"
          aria-label="Toggle Navigation"
        >
          {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
          <div className="fixed inset-y-0 left-0 w-72 bg-[#0E0F14] border-r border-[#1C1D24] p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <BrandLogo variant="nav" size="sm" />
                <button
                  onClick={() => setMobileNavOpen(false)}
                  className="p-1.5 text-neutral-400 hover:text-white rounded-lg"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.path === '/admin'
                      ? location.pathname === '/admin'
                      : location.pathname.startsWith(item.path);

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileNavOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                        isActive
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-6 border-t border-[#1C1D24] space-y-3">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
};
