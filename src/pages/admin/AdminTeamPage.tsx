import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ExternalLink,
  Mail,
  Github,
  Linkedin,
  Globe,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';
import { TeamMember } from '../../types';
import { api } from '../../services/api';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Spinner } from '../../components/common/Loader';
import { ImageUpload } from '../../components/common/ImageUpload';
import { AdminSubmitButton } from '../../components/admin/AdminSubmitButton';

export const AdminTeamPage: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    role: 'Co-Founder & Developer',
    email: '',
    portfolioUrl: '',
    githubUrl: '',
    linkedinUrl: '',
    bio: '',
    imageUrl: '',
    isFounder: true,
    order: 0,
    isActive: true,
  });

  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TeamMember | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSeedDefaults = async () => {
    setSeeding(true);
    setError(null);
    try {
      await api.system.seedDefaults(true);
      await fetchTeam();
      alert('Default team founders (Humayoon, Shariq, Shujaulmulk) restored successfully.');
    } catch {
      setError('Failed to restore defaults. Please check your server connection.');
    } finally {
      setSeeding(false);
    }
  };

  const fetchTeam = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.team.getAll();
      if (res.success && res.data) {
        setTeam(res.data);
      } else {
        setError(res.message || 'Failed to load team members.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error: Could not reach the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const openAddModal = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      role: 'Co-Founder & Developer',
      email: '',
      portfolioUrl: '',
      githubUrl: '',
      linkedinUrl: '',
      bio: '',
      imageUrl: '',
      isFounder: false,
      order: team.length + 1,
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role || 'Co-Founder',
      email: member.email || '',
      portfolioUrl: member.portfolioUrl || '',
      githubUrl: member.githubUrl || '',
      linkedinUrl: member.linkedinUrl || '',
      bio: member.bio || '',
      imageUrl: member.imageUrl || '',
      isFounder: member.isFounder !== undefined ? member.isFounder : true,
      order: member.order,
      isActive: member.isActive,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    setSaving(true);

    try {
      const memberId = editingMember?._id || (editingMember as any)?.id;
      if (editingMember && memberId) {
        await api.team.update(memberId, formData);
      } else {
        await api.team.create(formData);
      }
      setModalOpen(false);
      fetchTeam();
    } catch (err) {
      alert('Failed to save team member.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (member: TeamMember) => {
    const memberId = member._id || (member as any)?.id;
    if (!memberId) return;
    try {
      await api.team.update(memberId, { isActive: !member.isActive });
      fetchTeam();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const memberId = deleteTarget._id || (deleteTarget as any)?.id;
    if (!memberId) return;
    setDeleting(true);
    try {
      await api.team.delete(memberId);
      setDeleteTarget(null);
      fetchTeam();
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
            Founders & Team Members
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Manage founders (Humayoon, Shariq, Shujaulmulk) and add new engineers, designers, or team members with portfolio and contact links.
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
            <span>Reset / Load Default Founders</span>
          </button>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New Member</span>
          </button>
        </div>
      </div>

      {error ? (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center justify-between mb-8">
          <p>{error}</p>
          <button onClick={fetchTeam} className="text-xs font-bold underline hover:no-underline">Retry</button>
        </div>
      ) : loading ? (
        <div className="py-20 flex justify-center">
          <Spinner size="lg" label="Loading team members..." />
        </div>
      ) : team.length === 0 ? (
        <div className="text-center py-20 bg-[#121318] border border-[#262833] rounded-2xl p-8">
          <p className="text-neutral-400 text-sm">No team members found.</p>
          <button
            onClick={openAddModal}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Member</span>
          </button>
        </div>
      ) : (
        <div className="bg-[#121318] border border-[#262833] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#17181D] text-neutral-400 uppercase tracking-wider font-semibold border-b border-[#1C1D24]">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">Order</th>
                  <th className="py-3.5 px-4">Member</th>
                  <th className="py-3.5 px-4">Role & Status</th>
                  <th className="py-3.5 px-4">Portfolio & Email</th>
                  <th className="py-3.5 px-4">Bio</th>
                  <th className="py-3.5 px-4">Public Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1D24]">
                {team.map((member) => (
                  <tr key={member._id || (member as any).id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 text-center font-mono text-neutral-400">
                      {member.order}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {member.imageUrl ? (
                          <img
                            src={member.imageUrl}
                            alt={member.name}
                            className="w-10 h-10 rounded-xl object-cover border border-[#262833]"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-[#1A1B22] border border-[#262833] flex items-center justify-center text-blue-400 font-mono font-bold text-xs">
                            {member.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white text-sm font-heading">
                              {member.name}
                            </span>
                            {member.isFounder && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                <ShieldCheck className="w-3 h-3" />
                                Founder
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-neutral-400 mt-0.5">{member.role}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-neutral-300 font-medium">{member.role}</span>
                    </td>

                    <td className="py-3.5 px-4 space-y-1">
                      {member.email ? (
                        <a
                          href={`mailto:${member.email}`}
                          className="inline-flex items-center gap-1.5 text-neutral-300 hover:text-blue-400 transition-colors"
                        >
                          <Mail className="w-3 h-3 text-blue-400 shrink-0" />
                          <span className="truncate max-w-[140px]">{member.email}</span>
                        </a>
                      ) : (
                        <span className="text-neutral-600 block italic text-[11px]">No email</span>
                      )}

                      {member.portfolioUrl ? (
                        <div>
                          <a
                            href={member.portfolioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:underline"
                          >
                            <Globe className="w-3 h-3 shrink-0" />
                            <span>Portfolio</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      ) : null}

                      <div className="flex items-center gap-2 pt-0.5">
                        {member.githubUrl && (
                          <a
                            href={member.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-400 hover:text-white"
                            title="GitHub"
                          >
                            <Github className="w-3 h-3" />
                          </a>
                        )}
                        {member.linkedinUrl && (
                          <a
                            href={member.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-400 hover:text-blue-400"
                            title="LinkedIn"
                          >
                            <Linkedin className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs text-neutral-400 truncate">
                      {member.bio || <span className="italic text-neutral-600">No bio set</span>}
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleActive(member)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                          member.isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                        }`}
                      >
                        {member.isActive ? (
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
                        onClick={() => openEditModal(member)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                        title="Edit Member"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(member)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete Member"
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

      {/* Add / Edit Member Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingMember ? `Edit Member: ${editingMember.name}` : 'Add New Team Member / Founder'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Humayoon"
                className="w-full px-3 py-2 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Role / Title *
              </label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g. Co-Founder & Lead Engineer"
                className="w-full px-3 py-2 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Member / Founder Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. humayoonkhan003@gmail.com"
                className="w-full px-3 py-2 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Personal Portfolio URL
              </label>
              <input
                type="url"
                value={formData.portfolioUrl}
                onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                placeholder="https://humayoon-portfolio.vercel.app/"
                className="w-full px-3 py-2 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                GitHub Profile URL
              </label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                placeholder="https://github.com/humayoonhaider"
                className="w-full px-3 py-2 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/in/username"
                className="w-full px-3 py-2 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <ImageUpload
              label="Member Photo / Avatar"
              helperText="Upload profile photo (PNG, JPG, WebP) - Auto compressed"
              value={formData.imageUrl}
              onChange={(url) => setFormData({ ...formData, imageUrl: url })}
              onProcessingChange={setIsUploadingPhoto}
              aspectRatio="avatar"
              maxDimension={600}
            />
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

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
              Bio / Technical Background
            </label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Brief founder or engineer bio, engineering focus, and background..."
              className="w-full px-3 py-2 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500 resize-y"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-neutral-300 p-2.5 rounded-xl bg-[#17181D] border border-[#262833]">
              <input
                type="checkbox"
                checked={formData.isFounder}
                onChange={(e) => setFormData({ ...formData, isFounder: e.target.checked })}
                className="w-4 h-4 rounded bg-[#0B0B0F] border border-[#262833] text-blue-600 focus:ring-0 cursor-pointer"
              />
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>Mark as Co-Founder</span>
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
              isUploading={isUploadingPhoto}
              loadingText="Saving Member..."
              uploadingText="Uploading Profile Photo..."
              size="sm"
            >
              {editingMember ? 'Save Changes' : 'Create Member'}
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
        title="Delete Team Member"
        message={`Are you sure you want to remove "${deleteTarget?.name}" from the team list?`}
        confirmLabel="Remove Member"
      />
    </div>
  );
};
