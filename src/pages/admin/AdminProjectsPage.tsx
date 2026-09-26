import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ExternalLink, Github, CheckCircle2, XCircle, RefreshCw, Search } from 'lucide-react';
import { Project } from '../../types';
import { api } from '../../services/api';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Spinner } from '../../components/common/Loader';
import { ImageUpload } from '../../components/common/ImageUpload';
import { AdminSubmitButton } from '../../components/admin/AdminSubmitButton';

export const AdminProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isUploadingImg, setIsUploadingImg] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: '',
    description: '',
    imageUrl: '',
    liveUrl: '',
    githubUrl: '',
    technologies: '',
    featured: false,
    order: 0,
    isActive: true,
  });

  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSeedDefaults = async () => {
    setSeeding(true);
    setError(null);
    try {
      await api.system.seedDefaults(true);
      await fetchProjects();
      alert('Default projects ("MIS for School", "E-commerce Shop", "Intelligence Hub") restored successfully.');
    } catch {
      setError('Failed to restore default projects.');
    } finally {
      setSeeding(false);
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.projects.getAll();
      if (res.success && res.data) {
        setProjects(res.data);
      } else {
        setError(res.message || 'Failed to load projects.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error: Could not reach the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openAddModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Web Application',
      description: '',
      imageUrl: '',
      liveUrl: '',
      githubUrl: '',
      technologies: 'React, Vite, JavaScript',
      featured: false,
      order: projects.length + 1,
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      slug: project.slug,
      category: project.category,
      description: project.description,
      imageUrl: project.imageUrl || '',
      liveUrl: project.liveUrl || '',
      githubUrl: project.githubUrl || '',
      technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : '',
      featured: project.featured,
      order: project.order,
      isActive: project.isActive,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingProject) {
        await api.projects.update(editingProject._id, formData as any);
      } else {
        await api.projects.create(formData as any);
      }
      setModalOpen(false);
      fetchProjects();
    } catch (err) {
      alert('Failed to save project.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (project: Project) => {
    try {
      await api.projects.update(project._id, { isActive: !project.isActive });
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFeatured = async (project: Project) => {
    try {
      await api.projects.update(project._id, { featured: !project.featured });
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.projects.delete(deleteTarget._id);
      setDeleteTarget(null);
      fetchProjects();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1C1D24]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight">
            Projects Management
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Manage your agency portfolio. Seeded projects: MIS for School, E-commerce Shop, Intelligence Hub.
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
            <span>Reset / Load Default Projects</span>
          </button>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Project</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects by title or category..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#121318] border border-[#262833] text-white text-xs focus:outline-none focus:border-blue-500"
        />
        <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
      </div>

      {error ? (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center justify-between mb-8">
          <p>{error}</p>
          <button onClick={fetchProjects} className="text-xs font-bold underline hover:no-underline">Retry</button>
        </div>
      ) : loading ? (
        <div className="py-20 flex justify-center">
          <Spinner size="lg" label="Loading projects..." />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-[#262833] rounded-2xl text-neutral-500 text-sm">
          No projects found.
        </div>
      ) : (
        <div className="bg-[#121318] border border-[#262833] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="bg-[#0E0F14] border-b border-[#262833] text-[11px] uppercase tracking-wider text-neutral-400 font-mono">
                <tr>
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Featured</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Links</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1D24]">
                {filteredProjects.map((project) => (
                  <tr key={project._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-mono text-neutral-400">{project.order}</td>
                    <td className="py-3.5 px-4 font-medium text-white">
                      <div>{project.title}</div>
                      <div className="text-[11px] font-mono text-neutral-500">/work/{project.slug}</div>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-400">{project.category}</td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleFeatured(project)}
                        className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                          project.featured
                            ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                            : 'bg-neutral-800 text-neutral-500'
                        }`}
                      >
                        {project.featured ? 'Featured' : 'Standard'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleActive(project)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                          project.isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                        }`}
                      >
                        {project.isActive ? (
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
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-blue-400 hover:text-blue-300"
                            title="Visit Live"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-neutral-400 hover:text-white"
                            title="GitHub Repo"
                          >
                            <Github className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(project)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                        title="Edit Project"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(project)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete Project"
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

      {/* Add / Edit Project Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProject ? 'Edit Project' : 'Add New Project'}
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. MIS for School"
                className="w-full px-3 py-2 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Category *
              </label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g. School Management System, E-commerce, Web Application"
                className="w-full px-3 py-2 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Slug (Optional URL Identifier)
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="auto-generated from title"
                className="w-full px-3 py-2 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
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
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
              Project Description *
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the application scope, architecture, and business features..."
              className="w-full px-3 py-2 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500 resize-y"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Live URL
              </label>
              <input
                type="url"
                value={formData.liveUrl}
                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                GitHub URL
              </label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full px-3 py-2 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Project Screenshot / Cover Image Upload */}
          <div className="pt-2">
            <ImageUpload
              label="Project Screenshot / Cover Image"
              helperText="Upload project mockup, UI screenshot, or banner (WebP, PNG, JPG)"
              value={formData.imageUrl}
              onChange={(url) => setFormData({ ...formData, imageUrl: url })}
              onProcessingChange={setIsUploadingImg}
              aspectRatio="video"
              maxDimension={1600}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
              Technologies (comma separated)
            </label>
            <input
              type="text"
              value={formData.technologies}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
              placeholder="e.g. React, Node.js, Express, MongoDB, Tailwind CSS"
              className="w-full px-3 py-2 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-neutral-300">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 rounded bg-[#17181D] border border-[#262833] text-blue-600 focus:ring-0 cursor-pointer"
              />
              <span>Featured Project (Highlighted)</span>
            </label>

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
              isUploading={isUploadingImg}
              loadingText="Saving Project..."
              uploadingText="Optimizing & Uploading Image..."
              size="sm"
            >
              {editingProject ? 'Update Project' : 'Create Project'}
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
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete Project"
      />
    </div>
  );
};
