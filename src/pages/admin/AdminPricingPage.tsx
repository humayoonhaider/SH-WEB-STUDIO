import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, RefreshCw, Tag, DollarSign, Sparkles } from 'lucide-react';
import { PricingPlan } from '../../types';
import { api } from '../../services/api';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Spinner } from '../../components/common/Loader';
import { AdminSubmitButton } from '../../components/admin/AdminSubmitButton';

export const AdminPricingPage: React.FC = () => {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    badge: 'Starter',
    price: '$99',
    period: 'per project',
    description: '',
    featuresStr: '',
    highlighted: false,
    order: 0,
    isActive: true,
  });

  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PricingPlan | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSeedDefaults = async () => {
    setSeeding(true);
    setError(null);
    try {
      await api.system.seedDefaults(true);
      await fetchPlans();
      alert('Default pricing plans restored successfully.');
    } catch {
      setError('Failed to restore default pricing plans.');
    } finally {
      setSeeding(false);
    }
  };

  const fetchPlans = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.pricing.getAll();
      if (res.success && res.data) {
        setPlans(res.data);
      } else {
        setError(res.message || 'Failed to load pricing plans.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error: Could not reach the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const openAddModal = () => {
    setEditingPlan(null);
    setFormData({
      name: '',
      badge: 'Starter',
      price: '$99',
      period: 'per project',
      description: '',
      featuresStr: 'Feature 1\nFeature 2\nFeature 3',
      highlighted: false,
      order: plans.length + 1,
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (plan: PricingPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      badge: plan.badge || 'Starter',
      price: plan.price,
      period: plan.period || 'per project',
      description: plan.description || '',
      featuresStr: Array.isArray(plan.features) ? plan.features.join('\n') : '',
      highlighted: plan.highlighted || false,
      order: plan.order || 0,
      isActive: plan.isActive !== undefined ? plan.isActive : true,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price.trim()) return;
    setSaving(true);

    try {
      const payload = {
        name: formData.name,
        badge: formData.badge,
        price: formData.price,
        period: formData.period,
        description: formData.description,
        features: formData.featuresStr.split('\n').map((f) => f.trim()).filter(Boolean),
        highlighted: formData.highlighted,
        order: Number(formData.order),
        isActive: formData.isActive,
      };

      const planId = editingPlan?._id || editingPlan?.id;
      if (editingPlan && planId) {
        await api.pricing.update(planId, payload);
      } else {
        await api.pricing.create(payload);
      }
      setModalOpen(false);
      fetchPlans();
    } catch (err) {
      alert('Failed to save pricing plan.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (plan: PricingPlan) => {
    const planId = plan._id || plan.id;
    if (!planId) return;
    try {
      await api.pricing.update(planId, { isActive: !plan.isActive });
      fetchPlans();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const planId = deleteTarget._id || deleteTarget.id;
    if (!planId) return;
    setDeleting(true);
    try {
      await api.pricing.delete(planId);
      setDeleteTarget(null);
      fetchPlans();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1C1D24]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight">
            Pricing Plans & Special Offers
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Manage studio development tiers, prices, and promotional offers (such as 50% OFF discounts) displayed on the website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSeedDefaults}
            disabled={seeding}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-300 bg-[#17181D] hover:bg-[#20222C] border border-[#262833] transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${seeding ? 'animate-spin' : ''}`} />
            <span>Reset / Load Defaults</span>
          </button>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Pricing Plan</span>
          </button>
        </div>
      </div>

      {error ? (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center justify-between mb-8">
          <p>{error}</p>
          <button onClick={fetchPlans} className="text-xs font-bold underline hover:no-underline">Retry</button>
        </div>
      ) : loading ? (
        <div className="py-20 flex justify-center">
          <Spinner size="lg" label="Loading pricing plans..." />
        </div>
      ) : plans.length === 0 ? (
        <div className="text-center py-20 bg-[#121318] border border-[#262833] rounded-2xl p-8">
          <p className="text-neutral-400 text-sm">No pricing plans found.</p>
          <button
            onClick={openAddModal}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Plan</span>
          </button>
        </div>
      ) : (
        <div className="bg-[#121318] border border-[#262833] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#17181D] text-neutral-400 uppercase tracking-wider font-semibold border-b border-[#1C1D24]">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">Order</th>
                  <th className="py-3.5 px-4">Plan Name</th>
                  <th className="py-3.5 px-4">Badge / Offer</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Features</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1D24]">
                {plans.map((plan) => (
                  <tr key={plan._id || plan.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 text-center font-mono text-neutral-400">
                      {plan.order}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-sm font-heading">
                          {plan.name}
                        </span>
                        {plan.highlighted && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            <Sparkles className="w-3 h-3" />
                            Highlighted
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-400 mt-0.5 truncate max-w-xs">{plan.description}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#1A1B22] text-blue-400 border border-[#262833]">
                        <Tag className="w-3 h-3" />
                        {plan.badge || 'Starter'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-sm">
                        {plan.price} <span className="text-xs font-normal text-neutral-400">/ {plan.period}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-neutral-300 font-mono text-[11px]">
                        {plan.features?.length || 0} features included
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleActive(plan)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                          plan.isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                        }`}
                      >
                        {plan.isActive ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            <span>Hidden</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(plan)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                        title="Edit Plan"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(plan)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete Plan"
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

      {/* Add / Edit Pricing Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingPlan ? `Edit Pricing Plan: ${editingPlan.name}` : 'Add New Pricing Plan / Offer'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Plan Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Standard Plan"
                className="w-full px-3 py-2 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Badge / Offer Tag (e.g. 50% OFF)
              </label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                placeholder="e.g. 50% OFF - Limited Offer"
                className="w-full px-3 py-2 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Price * (e.g. $199)
              </label>
              <input
                type="text"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="e.g. $199"
                className="w-full px-3 py-2 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Period (e.g. per project)
              </label>
              <input
                type="text"
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                placeholder="e.g. per project"
                className="w-full px-3 py-2 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of who this plan is for..."
              className="w-full px-3 py-2 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
              Features (One feature per line)
            </label>
            <textarea
              rows={5}
              value={formData.featuresStr}
              onChange={(e) => setFormData({ ...formData, featuresStr: e.target.value })}
              placeholder="Professional Business Website&#10;Fully Responsive&#10;CMS Included"
              className="w-full px-3 py-2 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500 resize-y font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Display Order
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-neutral-300 p-2.5 rounded-xl bg-[#17181D] border border-[#262833]">
              <input
                type="checkbox"
                checked={formData.highlighted}
                onChange={(e) => setFormData({ ...formData, highlighted: e.target.checked })}
                className="w-4 h-4 rounded bg-[#0B0B0F] border border-[#262833] text-blue-600 focus:ring-0 cursor-pointer"
              />
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Highlight as Most Popular / Featured</span>
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-neutral-300 p-2.5 rounded-xl bg-[#17181D] border border-[#262833]">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 rounded bg-[#0B0B0F] border border-[#262833] text-blue-600 focus:ring-0 cursor-pointer"
              />
              <span>Display on public website</span>
            </label>
          </div>

          <div className="pt-4 border-t border-[#262833] flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
            <AdminSubmitButton
              loading={saving}
              loadingText="Saving Plan..."
              size="sm"
            >
              {editingPlan ? 'Save Changes' : 'Create Plan'}
            </AdminSubmitButton>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={deleting}
        title="Delete Pricing Plan"
        message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        confirmLabel="Delete Plan"
      />
    </div>
  );
};
