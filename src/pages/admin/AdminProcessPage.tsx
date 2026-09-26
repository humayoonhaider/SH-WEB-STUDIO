import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, RefreshCw } from 'lucide-react';
import { ProcessStep } from '../../types';
import { api } from '../../services/api';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Spinner } from '../../components/common/Loader';
import { AdminSubmitButton } from '../../components/admin/AdminSubmitButton';

export const AdminProcessPage: React.FC = () => {
  const [steps, setSteps] = useState<ProcessStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<ProcessStep | null>(null);

  const [formData, setFormData] = useState({
    stepNumber: '01',
    title: '',
    description: '',
    order: 0,
    isActive: true,
  });

  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ProcessStep | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchSteps = async () => {
    try {
      const res = await api.process.getAll();
      if (res.success && res.data) {
        setSteps(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSteps();
  }, []);

  const openAddModal = () => {
    setEditingStep(null);
    const nextNum = String(steps.length + 1).padStart(2, '0');
    setFormData({
      stepNumber: nextNum,
      title: '',
      description: '',
      order: steps.length + 1,
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (step: ProcessStep) => {
    setEditingStep(step);
    setFormData({
      stepNumber: step.stepNumber,
      title: step.title,
      description: step.description,
      order: step.order,
      isActive: step.isActive,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingStep) {
        await api.process.update(editingStep._id, formData);
      } else {
        await api.process.create(formData);
      }
      setModalOpen(false);
      fetchSteps();
    } catch (err) {
      alert('Failed to save step.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.process.delete(deleteTarget._id);
      setDeleteTarget(null);
      fetchSteps();
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
            Development Process
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Configure the 4 development milestones shown on the public website (Discover, Plan, Build, Launch).
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Process Step</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <Spinner size="lg" label="Loading process steps..." />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step) => (
            <div
              key={step._id}
              className="p-6 rounded-2xl bg-[#121318] border border-[#262833] flex flex-col justify-between space-y-4 hover:border-neutral-600 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-mono font-bold text-blue-500">
                    {step.stepNumber}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(step)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                      title="Edit Step"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(step)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete Step"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white font-heading mt-3 mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#1C1D24] flex items-center justify-between text-[11px] text-neutral-500 font-mono">
                <span>Display Order: {step.order}</span>
                <span className={step.isActive ? 'text-emerald-400' : 'text-neutral-500'}>
                  {step.isActive ? 'Active' : 'Hidden'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Step Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingStep ? 'Edit Process Step' : 'Add Process Step'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Step Number (e.g. 01, 02) *
              </label>
              <input
                type="text"
                required
                value={formData.stepNumber}
                onChange={(e) => setFormData({ ...formData, stepNumber: e.target.value })}
                placeholder="01"
                className="w-full px-3 py-2 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Step Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Discover"
                className="w-full px-3 py-2 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
              />
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
              placeholder="Explain the objectives of this development phase..."
              className="w-full px-3 py-2 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500 resize-y"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-neutral-300">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded bg-[#17181D] border border-[#262833] text-blue-600 focus:ring-0 cursor-pointer"
                />
                <span>Active on public website</span>
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
            <AdminSubmitButton
              loading={saving}
              loadingText="Saving Step..."
              size="sm"
            >
              {editingStep ? 'Save Changes' : 'Create Step'}
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
        title="Delete Process Step"
        message={`Are you sure you want to delete step ${deleteTarget?.stepNumber} (${deleteTarget?.title})?`}
        confirmLabel="Delete Step"
      />
    </div>
  );
};
