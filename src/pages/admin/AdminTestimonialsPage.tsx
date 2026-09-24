import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Star, CheckCircle2, RefreshCw, MessageSquare } from 'lucide-react';
import { Testimonial } from '../../types';
import { api } from '../../services/api';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Spinner } from '../../components/common/Loader';

export const AdminTestimonialsPage: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    content: '',
    avatarUrl: '',
    rating: 5,
    projectTag: '',
    order: 0,
    isActive: true,
  });

  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTestimonials = async () => {
    try {
      const res = await api.testimonials.getAdminAll();
      if (res.success && res.data) {
        setTestimonials(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      role: 'Founder / CEO',
      company: '',
      content: '',
      avatarUrl: '',
      rating: 5,
      projectTag: '',
      order: testimonials.length + 1,
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (item: Testimonial) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      role: item.role,
      company: item.company,
      content: item.content,
      avatarUrl: item.avatarUrl || '',
      rating: item.rating,
      projectTag: item.projectTag || '',
      order: item.order,
      isActive: item.isActive,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingItem) {
        await api.testimonials.update(editingItem._id, formData);
      } else {
        await api.testimonials.create(formData);
      }
      setModalOpen(false);
      fetchTestimonials();
    } catch (err) {
      alert('Failed to save testimonial.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.testimonials.delete(deleteTarget._id);
      setDeleteTarget(null);
      fetchTestimonials();
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
            Client Reviews & Testimonials
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Manage authentic client reviews and feedback showcased in the public reviews board and homepage.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <Spinner size="lg" label="Loading testimonials..." />
        </div>
      ) : testimonials.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-[#262833] rounded-2xl text-neutral-500 text-sm">
          No testimonials created yet. Click "Add Testimonial" to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((item) => (
            <div
              key={item._id}
              className="p-6 rounded-2xl bg-[#121318] border border-[#262833] flex flex-col justify-between space-y-4 hover:border-neutral-600 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                    {item.projectTag && (
                      <span className="text-[10px] font-mono text-blue-400 ml-2">
                        {item.projectTag}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                      title="Edit Testimonial"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(item)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete Testimonial"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed italic line-clamp-4">
                  "{item.content}"
                </p>

                <div className="pt-3 border-t border-[#1C1D24] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#17181D] border border-blue-500/20 flex items-center justify-center text-xs font-bold font-mono text-blue-400">
                    {item.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{item.name}</h4>
                    <p className="text-[11px] text-neutral-500">
                      {item.role} {item.company ? `• ${item.company}` : ''}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#1C1D24] flex items-center justify-between text-[11px] text-neutral-500 font-mono">
                <span>Display Order: {item.order}</span>
                <span className={item.isActive ? 'text-emerald-400' : 'text-neutral-500'}>
                  {item.isActive ? 'Active on Carousel' : 'Hidden'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Testimonial Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Edit Client Testimonial' : 'Add Client Testimonial'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Client Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Kamran Tariq"
                className="w-full px-3 py-2 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Client Role
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g. Principal & Academic Director"
                className="w-full px-3 py-2 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Company / Organization
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. Beacon Horizon Academy"
                className="w-full px-3 py-2 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Project / Service Tag
              </label>
              <input
                type="text"
                value={formData.projectTag}
                onChange={(e) => setFormData({ ...formData, projectTag: e.target.value })}
                placeholder="e.g. School Management System"
                className="w-full px-3 py-2 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
              Client Feedback / Review *
            </label>
            <textarea
              required
              rows={4}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="What did the client say about working with SH Web Studio and the project impact?"
              className="w-full px-3 py-2 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500 resize-y"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Star Rating (1 - 5)
              </label>
              <select
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
              >
                <option value={5}>5 Stars - Exceptional</option>
                <option value={4}>4 Stars - Great</option>
                <option value={3}>3 Stars - Good</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Order
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-neutral-300">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded bg-[#17181D] border border-[#262833] text-blue-600 focus:ring-0 cursor-pointer"
                />
                <span>Active on carousel</span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-[#262833] flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-1.5"
            >
              {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              <span>{saving ? 'Saving...' : 'Save Testimonial'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={deleting}
        title="Delete Testimonial"
        message={`Are you sure you want to delete the testimonial from "${deleteTarget?.name}"?`}
        confirmLabel="Delete Testimonial"
      />
    </div>
  );
};
