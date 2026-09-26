import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Layers,
  Users,
  MessageSquare,
  ArrowUpRight,
  Plus,
  Settings,
  Mail,
  CheckCircle2,
  Clock,
  Phone,
  Star,
} from 'lucide-react';
import { DashboardStats, ContactInquiry } from '../../types';
import { api } from '../../services/api';
import { Spinner } from '../../components/common/Loader';
import { useAuth } from '../../context/AuthContext';
import { InquiryAnalyticsChart } from '../../components/admin/InquiryAnalyticsChart';
import { RefreshCw, Database, AlertCircle } from 'lucide-react';

export const AdminDashboardHome: React.FC = () => {
  const { admin } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [storageStatus, setStorageStatus] = useState<any>(null);
  const [retryingAtlas, setRetryingAtlas] = useState(false);

  const fetchData = async () => {
    try {
      const [statsRes, statusRes] = await Promise.all([
        api.stats.get(),
        api.system.getStorageStatus()
      ]);
      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
      }
      if (statusRes.success && statusRes.data) {
        setStorageStatus(statusRes.data);
      }
    } catch {
      // stats error fallback
    } finally {
      setLoading(false);
    }
  };

  const handleRetryAtlas = async () => {
    setRetryingAtlas(true);
    try {
      const res = await api.system.retryAtlas();
      if (res.data) {
        setStorageStatus(res.data);
      }
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setRetryingAtlas(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.inquiries.updateStatus(id, newStatus);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <Spinner size="lg" label="Loading studio metrics..." />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Projects',
      value: stats?.totalProjects ?? 0,
      sub: `${stats?.activeProjects ?? 0} active in production`,
      icon: Briefcase,
      link: '/admin/projects',
      color: 'text-blue-400',
    },
    {
      title: 'Active Services',
      value: stats?.activeServices ?? 0,
      sub: 'Published solution offerings',
      icon: Layers,
      link: '/admin/services',
      color: 'text-emerald-400',
    },
    {
      title: 'Team Members',
      value: stats?.teamMembers ?? 0,
      sub: 'Founders & core developers',
      icon: Users,
      link: '/admin/team',
      color: 'text-purple-400',
    },
    {
      title: 'New Inquiries',
      value: stats?.newInquiries ?? 0,
      sub: `${stats?.totalInquiries ?? 0} total client requests`,
      icon: MessageSquare,
      link: '/admin/inquiries',
      color: 'text-amber-400',
    },
  ];

  return (
    <div className="space-y-10">
      {/* Storage Status Notice */}
      {storageStatus && (
        <div className={`p-4 sm:p-5 rounded-2xl border ${storageStatus.isAtlasConnected ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-amber-500/5 border-amber-500/20'} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
          <div className="flex items-start sm:items-center gap-3.5">
            <div className={`w-10 h-10 rounded-xl ${storageStatus.isAtlasConnected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'} flex items-center justify-center shrink-0 mt-0.5 sm:mt-0`}>
              {storageStatus.isAtlasConnected ? (
                <Database className="w-5 h-5 text-emerald-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-white">
                  Storage Mode: {storageStatus.storageMode === 'atlas' ? 'MongoDB Atlas (Cloud Database)' : 'Local File Storage'}
                </p>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md uppercase font-bold ${storageStatus.isAtlasConnected ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`}>
                  {storageStatus.isAtlasConnected ? 'LIVE' : 'FALLBACK'}
                </span>
              </div>
              <p className="text-xs text-neutral-300 mt-1">
                {storageStatus.notice}
              </p>
              {!storageStatus.isAtlasConnected && (
                <p className="text-[11px] text-amber-400/90 mt-1 font-medium">
                  Quick Fix: 1. Add <code className="bg-neutral-800 px-1 py-0.5 rounded text-amber-300 font-mono">0.0.0.0/0</code> in MongoDB Atlas Network Access. 2. Set <code className="bg-neutral-800 px-1 py-0.5 rounded text-amber-300 font-mono">MONGODB_URI</code> in Railway Variables.
                </p>
              )}
            </div>
          </div>
          {!storageStatus.isAtlasConnected && (
            <button 
              onClick={handleRetryAtlas}
              disabled={retryingAtlas}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-semibold text-amber-200 disabled:opacity-50 transition-all shrink-0 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${retryingAtlas ? 'animate-spin' : ''}`} />
              <span>{retryingAtlas ? 'Connecting to Atlas...' : 'Test & Connect Atlas'}</span>
            </button>
          )}
        </div>
      )}

      {/* Header & Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1C1D24]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight">
            Agency Overview
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Welcome back, {admin?.name || 'Humayoon'}. Real-time statistics from database storage.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/admin/projects"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Project</span>
          </Link>
          <Link
            to="/admin/services"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-neutral-300 bg-[#17181D] hover:bg-[#1E2028] border border-[#262833] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Service</span>
          </Link>
          <Link
            to="/admin/testimonials"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-neutral-300 bg-[#17181D] hover:bg-[#1E2028] border border-[#262833] transition-colors"
          >
            <Star className="w-3.5 h-3.5 text-amber-400" />
            <span>Reviews</span>
          </Link>
          <Link
            to="/admin/settings"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-neutral-300 bg-[#17181D] hover:bg-[#1E2028] border border-[#262833] transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Edit Website</span>
          </Link>
        </div>
      </div>

      {/* Real Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              to={card.link}
              className="group p-6 rounded-2xl bg-[#121318] border border-[#262833] hover:border-neutral-600 transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  {card.title}
                </span>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>

              <div className="mt-4">
                <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white">
                  {card.value}
                </div>
                <div className="text-xs text-neutral-500 mt-1">{card.sub}</div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Analytics Visualization */}
      <InquiryAnalyticsChart />

      {/* Recent Inquiries Section */}
      <div className="bg-[#121318] border border-[#262833] rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-[#262833] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white font-heading tracking-tight">
              Recent Inquiries
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Client requests submitted through the contact form
            </p>
          </div>
          <Link
            to="/admin/inquiries"
            className="text-xs font-medium text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
          >
            <span>View all inquiries</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {(!stats?.recentInquiries || stats.recentInquiries.length === 0) ? (
          <div className="p-12 text-center text-neutral-500 text-sm">
            No inquiries yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="bg-[#0E0F14] border-b border-[#262833] text-[11px] uppercase tracking-wider text-neutral-400 font-mono">
                <tr>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Project Type</th>
                  <th className="py-3 px-4">Message Preview</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1D24]">
                {stats.recentInquiries.map((inq) => (
                  <tr key={inq._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-medium text-white">
                      <div>{inq.name}</div>
                      <div className="text-[11px] text-neutral-500">{inq.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-400">
                      {inq.projectType || 'General'}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate text-neutral-400">
                      {inq.message}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono capitalize ${
                          inq.status === 'new'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : inq.status === 'contacted'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : inq.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                        }`}
                      >
                        {inq.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <select
                        value={inq.status}
                        onChange={(e) => handleStatusChange(inq._id, e.target.value)}
                        className="bg-[#17181D] border border-[#262833] rounded px-2 py-1 text-[11px] text-neutral-300 focus:outline-none"
                      >
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="contacted">Contacted</option>
                        <option value="completed">Completed</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
