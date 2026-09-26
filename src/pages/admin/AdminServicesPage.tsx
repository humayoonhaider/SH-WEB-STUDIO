import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { Service } from '../../types';
import { api } from '../../services/api';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Spinner } from '../../components/common/Loader';
import { AdminSubmitButton } from '../../components/admin/AdminSubmitButton';

const availableIcons = [
  'Globe',
  'Layout',
  'ShoppingCart',
  'Code2',
  'Layers',
  'Cpu',
  'Smartphone',
  'ShieldCheck',
  'Server',
];

export const AdminServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    icon: 'Code2',
    order: 0,
    isActive: true,
  });

  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.services.getAll();
      if (res.success && res.data) {
        setServices(res.data);
      } else {
        setError(res.message || 'Failed to load services.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error: Could not reach the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openAddModal = () => {
    setEditingService(null);
    setFormData({
      title: '',
      slug: '',
      description: '',
      icon: 'Code2',
      order: services.length + 1,
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      slug: service.slug,
      description: service.description,
      icon: service.icon || 'Code2',
      order: service.order,
      isActive: service.isActive,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingService) {
        await api.services.update(editingService._id, formData);
      } else {
        await api.services.create(formData);
      }
      setModalOpen(false);
      fetchServices();
    } catch (err) {
      alert('Failed to save service.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (service: Service) => {
    try {
      await api.services.update(service._id, { isActive: !service.isActive });
      fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.services.delete(deleteTarget._id);
      setDeleteTarget(null);
      fetchServices();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1C1D24]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight">
            Services Management
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Configure solutions offered by SH Web Studio. Active services appear on the public website.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {error ? (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center justify-between mb-8">
          <p>{error}</p>
          <button onClick={fetchServices} className="text-xs font-bold underline hover:no-underline">Retry</button>
        </div>
      ) : loading ? (
        <div className="py-20 flex justify-center">
          <Spinner size="lg" label="Loading services..." />
        </div>
      ) : services.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-[#262833] rounded-2xl text-neutral-500 text-sm">
          No services defined yet. Click "Add New Service" to create one.
        </div>
      ) : (
        <div className="bg-[#121318] border border-[#262833] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="bg-[#0E0F14] border-b border-[#262833] text-[11px] uppercase tracking-wider text-neutral-400 font-mono">
                <tr>
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4">Icon</th>
                  <th className="py-3 px-4">Title & Slug</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1D24]">
                {services.map((service) => (
                  <tr key={service._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-mono text-neutral-400">{service.order}</td>
                    <td className="py-3.5 px-4 font-mono text-blue-400">{service.icon}</td>
                    <td className="py-3.5 px-4 font-medium text-white">
                      <div>{service.title}</div>
                      <div className="text-[11px] font-mono text-neutral-500">{service.slug}</div>
                    </td>
                    <td className="py-3.5 px-4 max-w-sm truncate text-neutral-400">
                      {service.description}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleActive(service)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                          service.isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                        }`}
                      >
                        {service.isActive ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            <span>Inactive</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(service)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                        title="Edit Service"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(service)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete Service"
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

      {/* Add / Edit Service Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingService ? 'Edit Service' : 'Add New Service'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Service Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Business Websites"
                className="w-full px-3 py-2 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Slug (Optional)
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="auto-generated from title"
                className="w-full px-3 py-2 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Icon
              </label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
              >
                {availableIcons.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </div>

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

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-neutral-300">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded bg-[#17181D] border border-[#262833] text-blue-600 focus:ring-0 cursor-pointer"
                />
                <span>Active & Published</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
              Description *
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Explain the purpose and deliverables of this service..."
              className="w-full px-3 py-2 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500 resize-y"
            />
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
              loadingText="Saving Service..."
              size="sm"
            >
              {editingService ? 'Update Service' : 'Create Service'}
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
        title="Delete Service"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmLabel="Delete Service"
      />
    </div>
  );
};
