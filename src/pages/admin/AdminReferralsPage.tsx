import React, { useState, useEffect } from 'react';
import {
  Users,
  DollarSign,
  Share2,
  CheckCircle2,
  Clock,
  CreditCard,
  Search,
  Filter,
  RefreshCw,
  Plus,
  Settings,
  ShieldCheck,
  AlertCircle,
  Eye,
  Check,
  X,
  Building,
  Mail,
  Phone,
} from 'lucide-react';
import { api } from '../../services/api';
import {
  AdminReferralItem,
  AdminReferralStats,
  ReferralSettingsData,
} from '../../types';
import { Spinner } from '../../components/common/Loader';

export const AdminReferralsPage: React.FC = () => {
  const [stats, setStats] = useState<AdminReferralStats>({
    totalUsers: 0,
    totalReferrals: 0,
    convertedClients: 0,
    totalRevenue: 0,
    totalCommissions: 0,
    pendingCommissions: 0,
    approvedCommissions: 0,
    paidCommissions: 0,
    commissionRate: 10,
    referralProgramEnabled: true,
  });

  const [referrals, setReferrals] = useState<AdminReferralItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Record Payment Modal State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState<AdminReferralItem | null>(null);
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    currency: 'USD',
    projectTitle: 'Custom Web Application',
    paymentReference: '',
    notes: '',
  });
  const [submittingPayment, setSubmittingPayment] = useState(false);

  // Commission Action Modal State (Approve / Reject / Pay)
  const [commissionModal, setCommissionModal] = useState<{
    open: boolean;
    commissionId: string;
    action: 'approved' | 'rejected' | 'paid';
    amount: number;
    referrerName: string;
  } | null>(null);
  const [payoutDetailsForm, setPayoutDetailsForm] = useState({
    payoutMethod: 'Bank Transfer',
    payoutReference: '',
    adminNote: '',
  });
  const [submittingCommissionAction, setSubmittingCommissionAction] = useState(false);

  // Settings Modal State
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [settingsForm, setSettingsForm] = useState<ReferralSettingsData>({
    referralProgramEnabled: true,
    commissionRate: 10,
    minPayoutAmount: 0,
    payoutNotice: '',
    termsText: '',
  });
  const [savingSettings, setSavingSettings] = useState(false);

  // View Details Modal State
  const [detailModalItem, setDetailModalItem] = useState<AdminReferralItem | null>(null);

  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, listRes, settingsRes] = await Promise.all([
        api.adminReferrals.getStats(),
        api.adminReferrals.getAll({ status: statusFilter, search }),
        api.adminReferrals.getSettings(),
      ]);

      if (statsRes.success && statsRes.data) setStats(statsRes.data);
      if (listRes.success && listRes.data) setReferrals(listRes.data);
      if (settingsRes.success && settingsRes.data) setSettingsForm(settingsRes.data);
    } catch (err: any) {
      showToast('error', 'Failed to load referral data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const handleRecordPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReferral || !paymentForm.amount) return;

    setSubmittingPayment(true);
    try {
      const res = await api.adminReferrals.recordPayment({
        referralId: selectedReferral.id,
        amount: Number(paymentForm.amount),
        currency: paymentForm.currency,
        projectTitle: paymentForm.projectTitle,
        paymentReference: paymentForm.paymentReference || `TXN-${Date.now()}`,
        notes: paymentForm.notes,
      });

      if (res.success) {
        showToast('success', res.message || 'Payment and commission recorded successfully.');
        setPaymentModalOpen(false);
        setPaymentForm({
          amount: '',
          currency: 'USD',
          projectTitle: 'Custom Web Application',
          paymentReference: '',
          notes: '',
        });
        fetchData();
      } else {
        showToast('error', res.message || 'Failed to record payment.');
      }
    } catch (err: any) {
      showToast('error', err.message || 'Error recording payment.');
    } finally {
      setSubmittingPayment(false);
    }
  };

  const handleCommissionActionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commissionModal) return;

    setSubmittingCommissionAction(true);
    try {
      const res = await api.adminReferrals.updateCommissionStatus(commissionModal.commissionId, {
        status: commissionModal.action,
        payoutMethod: payoutDetailsForm.payoutMethod,
        payoutReference: payoutDetailsForm.payoutReference,
        adminNote: payoutDetailsForm.adminNote,
      });

      if (res.success) {
        showToast('success', res.message || `Commission marked as ${commissionModal.action.toUpperCase()}.`);
        setCommissionModal(null);
        setPayoutDetailsForm({
          payoutMethod: 'Bank Transfer',
          payoutReference: '',
          adminNote: '',
        });
        fetchData();
      } else {
        showToast('error', res.message || 'Failed to update commission.');
      }
    } catch (err: any) {
      showToast('error', err.message || 'Error updating commission.');
    } finally {
      setSubmittingCommissionAction(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await api.adminReferrals.updateSettings(settingsForm);
      if (res.success) {
        showToast('success', 'Referral program settings updated successfully.');
        setSettingsModalOpen(false);
        fetchData();
      } else {
        showToast('error', res.message || 'Failed to save settings.');
      }
    } catch (err: any) {
      showToast('error', err.message || 'Error saving settings.');
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed top-6 right-6 z-50 p-4 rounded-2xl shadow-2xl flex items-center gap-3 border text-xs font-semibold animate-in fade-in slide-in-from-top-3 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40'
              : 'bg-rose-950/90 text-rose-200 border-rose-500/40'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Referral Program & Commissions
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-blue-600/20 text-blue-400 border border-blue-500/30">
              {stats.commissionRate}% Flat Rate
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Manage client referrals, record qualifying project payments, and process 10% partner payouts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSettingsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#17181F] hover:bg-[#20222B] border border-[#262833] text-neutral-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4" />
            <span>Settings ({stats.commissionRate}%)</span>
          </button>

          <button
            onClick={fetchData}
            className="p-2.5 rounded-xl bg-[#17181F] hover:bg-[#20222B] border border-[#262833] text-neutral-300 hover:text-white transition-colors cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Summary Analytics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-[#121318] border border-[#20222B]">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
            <span>Total Referrals</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{stats.totalReferrals}</div>
          <div className="text-[10px] text-neutral-400 mt-1">{stats.totalUsers} registered users</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#121318] border border-[#20222B]">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
            <span>Converted Clients</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{stats.convertedClients}</div>
          <div className="text-[10px] text-emerald-400 mt-1">Paying clients</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#121318] border border-[#20222B]">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
            <span>Total Revenue</span>
            <DollarSign className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            ${stats.totalRevenue.toLocaleString()}
          </div>
          <div className="text-[10px] text-neutral-400 mt-1">From referral leads</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#121318] border border-[#20222B]">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
            <span>Total 10% Cut</span>
            <CreditCard className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-400 font-mono">
            ${stats.totalCommissions.toLocaleString()}
          </div>
          <div className="text-[10px] text-neutral-400 mt-1">Total partner cut</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#121318] border border-[#20222B]">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
            <span>Pending Payout</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono">
            ${stats.pendingCommissions.toLocaleString()}
          </div>
          <div className="text-[10px] text-neutral-400 mt-1">Needs review</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#121318] border border-[#20222B]">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
            <span>Paid Out</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">
            ${stats.paidCommissions.toLocaleString()}
          </div>
          <div className="text-[10px] text-neutral-400 mt-1">Completed payouts</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-[#121318] border border-[#20222B] flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by referrer, client name, email, or code..."
            className="w-full pl-10 pr-4 py-2 bg-[#0B0B0F] border border-[#262833] rounded-xl text-xs text-white placeholder-neutral-400 outline-none focus:border-blue-500"
          />
        </form>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-neutral-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-[#0B0B0F] border border-[#262833] rounded-xl text-xs text-neutral-300 outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="REGISTERED">Registered</option>
              <option value="QUALIFIED">Qualified</option>
              <option value="CLIENT">Client</option>
              <option value="COMMISSION_PENDING">Commission Pending</option>
              <option value="COMMISSION_APPROVED">Commission Approved</option>
              <option value="COMMISSION_PAID">Commission Paid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Referrals & Commissions Master Table */}
      <div className="rounded-3xl bg-[#121318] border border-[#20222B] overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-16 text-center">
            <Spinner size="md" />
            <p className="text-xs text-neutral-400 mt-2">Loading referral records...</p>
          </div>
        ) : referrals.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <Users className="w-8 h-8 text-neutral-400 mx-auto" />
            <h4 className="text-sm font-bold text-white">No referral records found</h4>
            <p className="text-xs text-neutral-400">
              When visitors register via partner links, their attributions appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#20222B] bg-[#0E0F14] text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-4 px-4">Referrer (Partner)</th>
                  <th className="py-4 px-4">Referred User (Client)</th>
                  <th className="py-4 px-4">Code</th>
                  <th className="py-4 px-4">Registered</th>
                  <th className="py-4 px-4">Client Status</th>
                  <th className="py-4 px-4">Payment</th>
                  <th className="py-4 px-4">10% Commission</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1B24]">
                {referrals.map((item) => {
                  const isClient = [
                    'CLIENT',
                    'PAYMENT_PENDING',
                    'COMMISSION_PENDING',
                    'COMMISSION_APPROVED',
                    'COMMISSION_PAID',
                  ].includes(item.status);

                  return (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Referrer */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-white">
                          {item.referrer?.name || 'Unknown User'}
                        </div>
                        <div className="text-[11px] text-neutral-400 font-mono">
                          {item.referrer?.email}
                        </div>
                        {item.referrer?.paymentDetails?.method && (
                          <div className="text-[10px] text-blue-400 font-mono">
                            Payout: {item.referrer.paymentDetails.method}
                          </div>
                        )}
                      </td>

                      {/* Referred User */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-white">
                          {item.referredUser?.name || 'Unknown User'}
                        </div>
                        <div className="text-[11px] text-neutral-400 font-mono">
                          {item.referredUser?.email}
                        </div>
                        {item.referredUser?.company && (
                          <div className="text-[10px] text-neutral-400">
                            {item.referredUser.company}
                          </div>
                        )}
                      </td>

                      {/* Code */}
                      <td className="py-4 px-4">
                        <span className="font-mono text-blue-400 font-semibold">
                          {item.referralCode}
                        </span>
                      </td>

                      {/* Registered Date */}
                      <td className="py-4 px-4 text-neutral-400 font-mono text-[11px]">
                        {new Date(item.registeredAt).toLocaleDateString()}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold uppercase ${
                            isClient
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-neutral-800 text-neutral-300 border border-neutral-700'
                          }`}
                        >
                          {item.status.replace(/_/g, ' ')}
                        </span>
                      </td>

                      {/* Payment */}
                      <td className="py-4 px-4 font-mono font-bold text-white">
                        {item.totalQualifyingPayment > 0 ? `$${item.totalQualifyingPayment}` : '—'}
                      </td>

                      {/* Commission */}
                      <td className="py-4 px-4">
                        <div className="font-mono font-extrabold text-blue-400">
                          {item.totalCommission > 0 ? `$${item.totalCommission}` : '—'}
                        </div>
                        {item.commissions.length > 0 && (
                          <div className="flex items-center gap-1 mt-1">
                            {item.commissions.map((c) => (
                              <span
                                key={c.id}
                                className={`px-1.5 py-0.2 rounded text-[9px] font-mono uppercase font-semibold ${
                                  c.status === 'paid'
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : c.status === 'approved'
                                    ? 'bg-blue-500/20 text-blue-300'
                                    : c.status === 'rejected'
                                    ? 'bg-rose-500/20 text-rose-300'
                                    : 'bg-amber-500/20 text-amber-300'
                                }`}
                              >
                                {c.status}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedReferral(item);
                            setPaymentModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30 font-semibold text-xs cursor-pointer"
                          title="Record Qualifying Client Payment"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Record Payment</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setDetailModalItem(item)}
                          className="p-1.5 rounded-lg bg-[#181920] hover:bg-[#20222B] text-neutral-300 hover:text-white border border-[#262833]"
                          title="View Full Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL 1: Record Qualifying Payment Modal */}
      {paymentModalOpen && selectedReferral && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121318] border border-[#262838] rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#20222B]">
              <div>
                <h3 className="text-lg font-bold text-white">Record Qualifying Client Payment</h3>
                <p className="text-xs text-neutral-400">
                  Calculates 10% commission automatically for the referring partner.
                </p>
              </div>
              <button
                onClick={() => setPaymentModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Attribution Summary */}
            <div className="p-4 rounded-2xl bg-[#0B0B0F] border border-[#1E202A] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-400">Client (Referred User):</span>
                <strong className="text-white">{selectedReferral.referredUser?.name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Referrer (Partner):</span>
                <strong className="text-blue-400">{selectedReferral.referrer?.name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Commission Rate Snapshot:</span>
                <span className="font-bold text-white font-mono">{stats.commissionRate}%</span>
              </div>
            </div>

            <form onSubmit={handleRecordPaymentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1 uppercase">
                  Payment Amount ($ USD) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  step="0.01"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                  placeholder="e.g. 500"
                  className="w-full px-4 py-2.5 bg-[#0B0B0F] border border-[#262833] focus:border-blue-500 rounded-xl text-base font-mono text-white outline-none"
                />
              </div>

              {paymentForm.amount && Number(paymentForm.amount) > 0 && (
                <div className="p-3 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-between text-xs">
                  <span className="text-blue-300 font-medium">Calculated 10% Commission:</span>
                  <span className="text-lg font-bold font-mono text-white">
                    ${((Number(paymentForm.amount) * stats.commissionRate) / 100).toFixed(2)}
                  </span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1 uppercase">
                  Project Title / Scope
                </label>
                <input
                  type="text"
                  value={paymentForm.projectTitle}
                  onChange={(e) => setPaymentForm({ ...paymentForm, projectTitle: e.target.value })}
                  placeholder="e.g. E-Commerce Platform / Web Application"
                  className="w-full px-4 py-2 bg-[#0B0B0F] border border-[#262833] rounded-xl text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1 uppercase">
                  Payment Reference / Invoice #
                </label>
                <input
                  type="text"
                  value={paymentForm.paymentReference}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, paymentReference: e.target.value })
                  }
                  placeholder="e.g. INV-2026-0042"
                  className="w-full px-4 py-2 bg-[#0B0B0F] border border-[#262833] rounded-xl text-xs text-white outline-none font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#20222B]">
                <button
                  type="button"
                  onClick={() => setPaymentModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white bg-[#17181F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingPayment}
                  className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all flex items-center gap-2"
                >
                  {submittingPayment ? <Spinner size="sm" /> : <Check className="w-4 h-4" />}
                  <span>Save Payment & Generate Commission</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Referral Detail & Commission Actions Modal */}
      {detailModalItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121318] border border-[#262838] rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#20222B]">
              <div>
                <h3 className="text-lg font-bold text-white">Referral Details & Payout Record</h3>
                <p className="text-xs text-neutral-400 font-mono">
                  Attribution Code: {detailModalItem.referralCode}
                </p>
              </div>
              <button
                onClick={() => setDetailModalItem(null)}
                className="p-1.5 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Partner & Client Info Split */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#0B0B0F] border border-[#1E202A] space-y-2 text-xs">
                <span className="text-[10px] uppercase font-mono tracking-wider text-blue-400 font-bold block">
                  Referrer (Partner)
                </span>
                <div className="text-sm font-bold text-white">{detailModalItem.referrer?.name}</div>
                <div className="text-neutral-400">{detailModalItem.referrer?.email}</div>
                <div className="text-neutral-400">{detailModalItem.referrer?.phone || 'No phone'}</div>
                
                {/* Referrer Payout Details */}
                <div className="pt-2 mt-2 border-t border-[#1C1D24] space-y-1">
                  <span className="text-[10px] text-neutral-400 uppercase font-semibold">
                    Payout Info:
                  </span>
                  {detailModalItem.referrer?.paymentDetails?.accountNumber ? (
                    <div className="text-neutral-200">
                      <div>Method: <strong>{detailModalItem.referrer.paymentDetails.method}</strong></div>
                      <div>Holder: {detailModalItem.referrer.paymentDetails.accountHolderName}</div>
                      <div>Bank: {detailModalItem.referrer.paymentDetails.bankName || 'N/A'}</div>
                      <div className="font-mono">Account/IBAN: {detailModalItem.referrer.paymentDetails.accountNumber}</div>
                    </div>
                  ) : (
                    <div className="text-neutral-400 italic">No payout details added yet by user.</div>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0B0B0F] border border-[#1E202A] space-y-2 text-xs">
                <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 font-bold block">
                  Referred User (Client)
                </span>
                <div className="text-sm font-bold text-white">{detailModalItem.referredUser?.name}</div>
                <div className="text-neutral-400">{detailModalItem.referredUser?.email}</div>
                <div className="text-neutral-400">{detailModalItem.referredUser?.phone || 'No phone'}</div>
                <div className="text-neutral-400">{detailModalItem.referredUser?.company || 'No company'}</div>
              </div>
            </div>

            {/* Commissions List & Action Buttons */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-300 font-semibold">
                Generated Commissions ({detailModalItem.commissions.length})
              </h4>

              {detailModalItem.commissions.length === 0 ? (
                <div className="p-4 rounded-xl bg-[#0B0B0F] border border-[#1C1D24] text-center text-xs text-neutral-400">
                  No commissions generated yet. Use "Record Payment" to log qualifying client payments.
                </div>
              ) : (
                <div className="space-y-3">
                  {detailModalItem.commissions.map((c) => (
                    <div
                      key={c.id}
                      className="p-4 rounded-2xl bg-[#0B0B0F] border border-[#1F212C] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold font-mono text-white">
                            ${c.commissionAmount}
                          </span>
                          <span className="text-[10px] text-neutral-400">
                            ({c.commissionRate}% of ${c.paymentAmount})
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                              c.status === 'paid'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : c.status === 'approved'
                                ? 'bg-blue-500/20 text-blue-300'
                                : c.status === 'rejected'
                                ? 'bg-rose-500/20 text-rose-300'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {c.status}
                          </span>
                        </div>
                        {c.payoutReference && (
                          <div className="text-[11px] text-neutral-400 font-mono">
                            Ref: {c.payoutReference} ({c.payoutMethod})
                          </div>
                        )}
                        {c.adminNote && (
                          <div className="text-[11px] text-neutral-400 italic">
                            Note: {c.adminNote}
                          </div>
                        )}
                      </div>

                      {/* Action buttons per commission */}
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        {c.status === 'pending' && (
                          <button
                            type="button"
                            onClick={() => {
                              setCommissionModal({
                                open: true,
                                commissionId: c.id,
                                action: 'approved',
                                amount: c.commissionAmount,
                                referrerName: detailModalItem.referrer?.name || 'Partner',
                              });
                            }}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-500"
                          >
                            Approve
                          </button>
                        )}

                        {c.status === 'approved' && (
                          <button
                            type="button"
                            onClick={() => {
                              setCommissionModal({
                                open: true,
                                commissionId: c.id,
                                action: 'paid',
                                amount: c.commissionAmount,
                                referrerName: detailModalItem.referrer?.name || 'Partner',
                              });
                            }}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-500"
                          >
                            Mark as Paid
                          </button>
                        )}

                        {c.status !== 'rejected' && c.status !== 'paid' && (
                          <button
                            type="button"
                            onClick={() => {
                              setCommissionModal({
                                open: true,
                                commissionId: c.id,
                                action: 'rejected',
                                amount: c.commissionAmount,
                                referrerName: detailModalItem.referrer?.name || 'Partner',
                              });
                            }}
                            className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Commission Action Confirmation Dialog (Approve, Reject, Pay) */}
      {commissionModal && commissionModal.open && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121318] border border-[#262838] rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#20222B]">
              <h3 className="text-lg font-bold text-white capitalize">
                {commissionModal.action === 'paid'
                  ? 'Confirm Commission Payout'
                  : `${commissionModal.action} Commission`}
              </h3>
              <button
                onClick={() => setCommissionModal(null)}
                className="p-1.5 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#0B0B0F] border border-[#1E202A] space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-400">Partner:</span>
                <strong className="text-white">{commissionModal.referrerName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Amount:</span>
                <strong className="text-blue-400 font-mono font-bold">
                  ${commissionModal.amount}
                </strong>
              </div>
            </div>

            <form onSubmit={handleCommissionActionSubmit} className="space-y-4 text-xs">
              {commissionModal.action === 'paid' && (
                <>
                  <div>
                    <label className="block text-neutral-300 font-semibold mb-1 uppercase">
                      Payout Method
                    </label>
                    <select
                      value={payoutDetailsForm.payoutMethod}
                      onChange={(e) =>
                        setPayoutDetailsForm({ ...payoutDetailsForm, payoutMethod: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-[#0B0B0F] border border-[#262833] rounded-xl text-white outline-none"
                    >
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Easypaisa">Easypaisa</option>
                      <option value="JazzCash">JazzCash</option>
                      <option value="PayPal">PayPal</option>
                      <option value="Cash / Other">Cash / Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-semibold mb-1 uppercase">
                      Transaction ID / Reference
                    </label>
                    <input
                      type="text"
                      required
                      value={payoutDetailsForm.payoutReference}
                      onChange={(e) =>
                        setPayoutDetailsForm({ ...payoutDetailsForm, payoutReference: e.target.value })
                      }
                      placeholder="e.g. TXN-98472918"
                      className="w-full px-3 py-2 bg-[#0B0B0F] border border-[#262833] rounded-xl text-white font-mono outline-none"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-neutral-300 font-semibold mb-1 uppercase">
                  Admin Note (Optional)
                </label>
                <input
                  type="text"
                  value={payoutDetailsForm.adminNote}
                  onChange={(e) =>
                    setPayoutDetailsForm({ ...payoutDetailsForm, adminNote: e.target.value })
                  }
                  placeholder="Notes for internal record"
                  className="w-full px-3 py-2 bg-[#0B0B0F] border border-[#262833] rounded-xl text-white outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#20222B]">
                <button
                  type="button"
                  onClick={() => setCommissionModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white bg-[#17181F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingCommissionAction}
                  className={`px-5 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2 ${
                    commissionModal.action === 'paid'
                      ? 'bg-emerald-600 hover:bg-emerald-500'
                      : commissionModal.action === 'approved'
                      ? 'bg-blue-600 hover:bg-blue-500'
                      : 'bg-rose-600 hover:bg-rose-500'
                  }`}
                >
                  {submittingCommissionAction ? (
                    <Spinner size="sm" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>Confirm {commissionModal.action.toUpperCase()}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Referral Program Settings Modal */}
      {settingsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121318] border border-[#262838] rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#20222B]">
              <h3 className="text-lg font-bold text-white">Referral Program Configuration</h3>
              <button
                onClick={() => setSettingsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B0B0F] border border-[#20222B]">
                <div>
                  <div className="text-white font-semibold">Enable Referral Program</div>
                  <div className="text-neutral-400 text-[11px]">
                    Allows public user registration and referral link tracking.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settingsForm.referralProgramEnabled}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, referralProgramEnabled: e.target.checked })
                  }
                  className="w-5 h-5 accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1 uppercase">
                  Default Commission Rate (%)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="100"
                  value={settingsForm.commissionRate}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, commissionRate: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 bg-[#0B0B0F] border border-[#262833] rounded-xl text-white font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1 uppercase">
                  Payout Terms Notice
                </label>
                <textarea
                  rows={3}
                  value={settingsForm.payoutNotice}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, payoutNotice: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#0B0B0F] border border-[#262833] rounded-xl text-white outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#20222B]">
                <button
                  type="button"
                  onClick={() => setSettingsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white bg-[#17181F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all flex items-center gap-2"
                >
                  {savingSettings ? <Spinner size="sm" /> : <Check className="w-4 h-4" />}
                  <span>Save Configuration</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
