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

  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactInquiry | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchInquiries = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.inquiries.getAll(
        statusFilter === 'all' ? undefined : { status: statusFilter }
      );
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
  }, [statusFilter]);

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

  const filteredInquiries = inquiries.filter((inq) =>
    inq.name.toLowerCase().includes(search.toLowerCase()) ||
    inq.email.toLowerCase().includes(search.toLowerCase()) ||
    (inq.business && inq.business.toLowerCase().includes(search.toLowerCase())) ||
    inq.message.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1C1D24]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight">
            Client Inquiries
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Manage incoming project requests, respond directly via email/WhatsApp, and track statuses.
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
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Project Type</th>
                  <th className="py-3 px-4">Message</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1D24]">
                {filteredInquiries.map((inq) => (
                  <tr key={inq._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-mono text-neutral-500 whitespace-nowrap">
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-white">
                      <div>{inq.name}</div>
                      <div className="text-[11px] text-neutral-400">{inq.email}</div>
                      {inq.business && (
                        <div className="text-[10px] text-blue-400">{inq.business}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-300">
                      <div>{inq.projectType || 'General'}</div>
                      {inq.budget && (
                        <div className="text-[10px] text-neutral-500 font-mono">{inq.budget}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate text-neutral-400">
                      {inq.message}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={inq.status}
                        onChange={(e) => handleStatusChange(inq._id, e.target.value)}
                        className={`text-[11px] font-mono px-2 py-1 rounded bg-[#17181D] border border-[#262833] focus:outline-none ${
                          inq.status === 'new'
                            ? 'text-amber-400'
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
                        title="View Full Inquiry"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(inq)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete Inquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Full Inquiry Modal */}
      {selectedInquiry && (
        <Modal
          isOpen={!!selectedInquiry}
          onClose={() => setSelectedInquiry(null)}
          title="Inquiry Details"
        >
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#262833]">
              <div>
                <h4 className="text-lg font-bold text-white font-heading">
                  {selectedInquiry.name}
                </h4>
                {selectedInquiry.business && (
                  <p className="text-xs text-blue-400">{selectedInquiry.business}</p>
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
                    href={`mailto:${selectedInquiry.email}?subject=Regarding your SH Web Studio inquiry`}
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

            {/* Scope & Budget Info */}
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

            {/* Full Message Body */}
            <div>
              <div className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                Project Message
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
                <span>Delete Inquiry</span>
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
