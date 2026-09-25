import React, { useState, useEffect } from 'react';
import {
  Search,
  Mail,
  Phone,
  MessageSquare,
  Trash2,
  Copy,
  ExternalLink,
  Check,
  Eye,
  Filter,
  RefreshCw,
  Code2,
  Briefcase,
  Github,
  Globe,
  Sparkles,
} from 'lucide-react';
import { ContactInquiry } from '../../types';
import { api } from '../../services/api';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Spinner } from '../../components/common/Loader';

export const AdminInquiriesPage: React.FC = () => {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'client' | 'developer_application'>('all');

  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactInquiry | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchInquiries = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.inquiries.getAll({
        status: statusFilter === 'all' ? undefined : statusFilter,
        type: typeFilter === 'all' ? undefined : typeFilter,
      });
      if (res.success && res.data) {
        setInquiries(res.data);
      } else {
        setError(res.message || 'Failed to load inquiries.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error: Could not reach the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [statusFilter, typeFilter]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.inquiries.updateStatus(id, newStatus);
      fetchInquiries();
      if (selectedInquiry && selectedInquiry._id === id) {
        setSelectedInquiry({ ...selectedInquiry, status: newStatus as any });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.inquiries.delete(deleteTarget._id);
      if (selectedInquiry && selectedInquiry._id === deleteTarget._id) {
        setSelectedInquiry(null);
      }
      setDeleteTarget(null);
      fetchInquiries();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const filteredInquiries = inquiries.filter((inq) => {
    const q = search.toLowerCase();
    const matchesSearch =
      inq.name.toLowerCase().includes(q) ||
      inq.email.toLowerCase().includes(q) ||
      (inq.business && inq.business.toLowerCase().includes(q)) ||
      (inq.projectType && inq.projectType.toLowerCase().includes(q)) ||
      (inq.skills && inq.skills.toLowerCase().includes(q)) ||
      inq.message.toLowerCase().includes(q);

    const matchesType =
      typeFilter === 'all'
        ? true
        : typeFilter === 'developer_application'
        ? inq.inquiryType === 'developer_application'
        : inq.inquiryType !== 'developer_application';

    return matchesSearch && matchesType;
  });

  const devCount = inquiries.filter((i) => i.inquiryType === 'developer_application').length;
  const clientCount = inquiries.filter((i) => i.inquiryType !== 'developer_application').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1C1D24]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight">
            Inquiries & Developer Applications
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Manage incoming client project requests and developer applications to join SH Web Studio.
          </p>
        </div>

        <button
          onClick={fetchInquiries}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-neutral-300 bg-[#121318] hover:bg-[#1A1B22] border border-[#262833] transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center justify-between mb-8">
          <p>{error}</p>
          <button onClick={fetchInquiries} className="text-xs font-bold underline hover:no-underline">Retry</button>
        </div>
      )}

      {/* Category Tabs (All / Client Projects / Developer Applications) */}
      <div className="flex items-center gap-2 p-1.5 bg-[#121318] border border-[#262833] rounded-2xl w-fit flex-wrap">
        <button
          type="button"
          onClick={() => setTypeFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider transition-all flex items-center gap-2 ${
            typeFilter === 'all'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <span>All Messages</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/30">
            {inquiries.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setTypeFilter('client')}
          className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider transition-all flex items-center gap-2 ${
            typeFilter === 'client'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Client Projects</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/30">
            {clientCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setTypeFilter('developer_application')}
          className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider transition-all flex items-center gap-2 ${
            typeFilter === 'developer_application'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Join Us (Developers)</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            {devCount}
          </span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client name, email, company, or message..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#121318] border border-[#262833] text-white text-xs focus:outline-none focus:border-blue-500"
          />
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto p-1 bg-[#121318] border border-[#262833] rounded-xl text-xs">
          {['all', 'new', 'read', 'contacted', 'completed', 'archived'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                statusFilter === status
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <Spinner size="lg" label="Loading inquiries..." />
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-[#262833] rounded-2xl text-neutral-500 text-sm">
          No inquiries found matching your filters.
        </div>
      ) : (
        <div className="bg-[#121318] border border-[#262833] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="bg-[#0E0F14] border-b border-[#262833] text-[11px] uppercase tracking-wider text-neutral-400 font-mono">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Sender / Applicant</th>
                  <th className="py-3 px-4">Role / Scope</th>
                  <th className="py-3 px-4">Links / Budget</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1D24]">
                {filteredInquiries.map((inq) => {
                  const isDev = inq.inquiryType === 'developer_application';
                  return (
                    <tr key={inq._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-mono text-neutral-500 whitespace-nowrap">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </td>

                      {/* Type Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {isDev ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                            <Code2 className="w-3 h-3" />
                            Join Us
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/25">
                            <Briefcase className="w-3 h-3" />
                            Client
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-medium text-white">
                        <div className="flex items-center gap-1.5">
                          <span>{inq.name}</span>
                          {inq.status === 'new' && (
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                          )}
                        </div>
                        <div className="text-[11px] text-neutral-400">{inq.email}</div>
                        {inq.business && !isDev && (
                          <div className="text-[10px] text-blue-400">{inq.business}</div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-neutral-300">
                        <div className="font-medium text-neutral-200">
                          {inq.projectType || (isDev ? 'Developer Application' : 'General')}
                        </div>
                        {isDev && inq.experience && (
                          <div className="text-[10px] text-emerald-400 font-mono">
                            Exp: {inq.experience}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {isDev ? (
                          <div className="flex items-center gap-2">
                            {inq.githubUrl && (
                              <a
                                href={inq.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-[#17181D] hover:bg-[#252833] text-neutral-300 hover:text-white transition-colors"
                                title="Open GitHub Profile"
                              >
                                <Github className="w-3.5 h-3.5" />
                              </a>
                            )}
                            {inq.portfolioUrl && (
                              <a
                                href={inq.portfolioUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-[#17181D] hover:bg-[#252833] text-blue-400 hover:text-blue-300 transition-colors"
                                title="Open Portfolio"
                              >
                                <Globe className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        ) : (
                          <div className="text-[11px] text-neutral-400 font-mono">
                            {inq.budget || 'Not specified'}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={inq.status}
                          onChange={(e) => handleStatusChange(inq._id, e.target.value)}
                          className={`text-[11px] font-mono px-2 py-1 rounded bg-[#17181D] border border-[#262833] focus:outline-none ${
                            inq.status === 'new'
                              ? 'text-amber-400 border-amber-500/30'
                              : inq.status === 'contacted'
                              ? 'text-blue-400'
                              : inq.status === 'completed'
                              ? 'text-emerald-400'
                              : 'text-neutral-400'
                          }`}
                        >
                          <option value="new">New</option>
                          <option value="read">Read</option>
                          <option value="contacted">Contacted</option>
                          <option value="completed">Completed</option>
                          <option value="archived">Archived</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedInquiry(inq)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(inq)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Full Inquiry / Developer Application Modal */}
      {selectedInquiry && (
        <Modal
          isOpen={!!selectedInquiry}
          onClose={() => setSelectedInquiry(null)}
          title={
            selectedInquiry.inquiryType === 'developer_application'
              ? 'Developer Application Details'
              : 'Client Inquiry Details'
          }
        >
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#262833]">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-bold text-white font-heading">
                    {selectedInquiry.name}
                  </h4>
                  {selectedInquiry.inquiryType === 'developer_application' ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                      Join Us Application
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/25">
                      Client Project
                    </span>
                  )}
                </div>
                {selectedInquiry.business && selectedInquiry.inquiryType !== 'developer_application' && (
                  <p className="text-xs text-blue-400 mt-0.5">{selectedInquiry.business}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500 font-mono">Status:</span>
                <select
                  value={selectedInquiry.status}
                  onChange={(e) => handleStatusChange(selectedInquiry._id, e.target.value)}
                  className="bg-[#17181D] border border-[#262833] rounded px-2.5 py-1 text-xs text-white"
                >
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="contacted">Contacted</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Quick Contact & Copy Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-[#17181D] border border-[#262833] flex items-center justify-between">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="text-xs text-white truncate">{selectedInquiry.email}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <a
                    href={`mailto:${selectedInquiry.email}?subject=${
                      selectedInquiry.inquiryType === 'developer_application'
                        ? 'Regarding your developer application at SH Web Studio'
                        : 'Regarding your SH Web Studio inquiry'
                    }`}
                    className="p-1.5 text-neutral-400 hover:text-white"
                    title="Direct Mail"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => copyToClipboard(selectedInquiry.email, 'email')}
                    className="p-1.5 text-neutral-400 hover:text-white"
                    title="Copy Email"
                  >
                    {copiedField === 'email' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {selectedInquiry.phone ? (
                <div className="p-3 rounded-xl bg-[#17181D] border border-[#262833] flex items-center justify-between">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-xs text-white truncate">{selectedInquiry.phone}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <a
                      href={`https://wa.me/${selectedInquiry.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-emerald-400 hover:text-emerald-300"
                      title="Open in WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => copyToClipboard(selectedInquiry.phone!, 'phone')}
                      className="p-1.5 text-neutral-400 hover:text-white"
                      title="Copy Phone"
                    >
                      {copiedField === 'phone' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-[#17181D] border border-[#262833] flex items-center text-xs text-neutral-500">
                  No phone number provided.
                </div>
              )}
            </div>

            {/* Developer Application Specific Data */}
            {selectedInquiry.inquiryType === 'developer_application' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#17181D] border border-[#262833]">
                    <div className="text-neutral-500 mb-1">Specialization / Role</div>
                    <div className="font-semibold text-white">
                      {selectedInquiry.projectType || 'Full-Stack Developer'}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#17181D] border border-[#262833]">
                    <div className="text-neutral-500 mb-1">Experience Level</div>
                    <div className="font-semibold text-emerald-400 font-mono">
                      {selectedInquiry.experience || 'Not specified'}
                    </div>
                  </div>
                </div>

                {/* GitHub & Portfolio Links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {selectedInquiry.githubUrl ? (
                    <div className="p-3 rounded-xl bg-[#17181D] border border-[#262833] flex items-center justify-between">
                      <div className="overflow-hidden">
                        <div className="text-neutral-500 mb-0.5 text-[10px] uppercase font-mono">GitHub Profile</div>
                        <div className="font-mono text-white truncate text-xs">{selectedInquiry.githubUrl}</div>
                      </div>
                      <a
                        href={selectedInquiry.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-[#252833] hover:bg-blue-600 text-white shrink-0 ml-2"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ) : null}

                  {selectedInquiry.portfolioUrl ? (
                    <div className="p-3 rounded-xl bg-[#17181D] border border-[#262833] flex items-center justify-between">
                      <div className="overflow-hidden">
                        <div className="text-neutral-500 mb-0.5 text-[10px] uppercase font-mono">Portfolio Website</div>
                        <div className="font-mono text-blue-400 truncate text-xs">{selectedInquiry.portfolioUrl}</div>
                      </div>
                      <a
                        href={selectedInquiry.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-[#252833] hover:bg-blue-600 text-white shrink-0 ml-2"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ) : null}
                </div>

                {selectedInquiry.skills && (
                  <div className="p-3 rounded-xl bg-[#17181D] border border-[#262833]">
                    <div className="text-neutral-500 mb-1.5 text-xs">Technical Skills & Tech Stack:</div>
                    <div className="font-mono text-xs text-neutral-200">
                      {selectedInquiry.skills}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Scope & Budget Info for Clients */
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-[#17181D] border border-[#262833]">
                  <div className="text-neutral-500 mb-1">Project Type</div>
                  <div className="font-semibold text-white">
                    {selectedInquiry.projectType || 'Not specified'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#17181D] border border-[#262833]">
                  <div className="text-neutral-500 mb-1">Estimated Budget</div>
                  <div className="font-semibold text-white">
                    {selectedInquiry.budget || 'Not specified'}
                  </div>
                </div>
              </div>
            )}

            {/* Message Body */}
            <div>
              <div className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                {selectedInquiry.inquiryType === 'developer_application'
                  ? 'Candidate Statement & Note'
                  : 'Project Message'}
              </div>
              <div className="p-4 rounded-xl bg-[#17181D] border border-[#262833] text-neutral-200 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                {selectedInquiry.message}
              </div>
            </div>

            <div className="pt-4 border-t border-[#262833] flex justify-between items-center">
              <button
                type="button"
                onClick={() => setDeleteTarget(selectedInquiry)}
                className="px-4 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#17181D] hover:bg-[#1E2028] border border-[#262833] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={deleting}
        title="Delete Inquiry"
        message={`Are you sure you want to permanently delete the inquiry from "${deleteTarget?.name}"?`}
        confirmLabel="Delete Inquiry"
      />
    </div>
  );
};
