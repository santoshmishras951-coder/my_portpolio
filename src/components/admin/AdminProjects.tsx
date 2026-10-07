import React, { useState } from 'react';
import { Project } from '../../types/portfolio.js';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.js';
import { Plus, Edit2, Trash2, Eye, EyeOff, Star, Upload, X, Save } from 'lucide-react';

interface AdminProjectsProps {
  projects: Project[];
  onRefresh: () => void;
}

export const AdminProjects: React.FC<AdminProjectsProps> = ({ projects, onRefresh }) => {
  const { success, error } = useToast();
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenCreate = () => {
    setEditingProject({
      title: '',
      shortDescription: '',
      detailedDescription: '',
      category: 'Full-Stack Web App',
      projectImage: '',
      galleryImages: [],
      technologies: ['React', 'Node.js', 'Express.js', 'Tailwind CSS'],
      githubUrl: '',
      liveDemoUrl: '',
      caseStudyUrl: '',
      startDate: '',
      completionDate: '',
      isFeatured: false,
      displayOrder: projects.length + 1,
      challenges: '',
      solution: '',
      keyFeatures: [],
      myContribution: '',
      results: '',
      architectureExplanation: '',
      isVisible: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject({ ...project });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete the project "${title}"?`)) return;
    try {
      await api.deleteProject(id);
      success('Project removed.');
      onRefresh();
    } catch (err: any) {
      error(err.message || 'Failed to delete project.');
    }
  };

  const handleToggleVisibility = async (project: Project) => {
    try {
      await api.updateProject(project.id, { isVisible: !project.isVisible });
      success(`Project "${project.title}" ${!project.isVisible ? 'published' : 'hidden'}.`);
      onRefresh();
    } catch (err: any) {
      error(err.message || 'Failed to toggle visibility.');
    }
  };

  const handleToggleFeatured = async (project: Project) => {
    try {
      await api.updateProject(project.id, { isFeatured: !project.isFeatured });
      success(`Project "${project.title}" ${!project.isFeatured ? 'marked featured' : 'unmarked featured'}.`);
      onRefresh();
    } catch (err: any) {
      error(err.message || 'Failed to toggle featured status.');
    }
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await api.uploadFile(file, editingProject?.title || 'Project Image');
      setEditingProject(prev => ({ ...prev, projectImage: res.file.url }));
      success('Image uploaded.');
    } catch (err: any) {
      error(err.message || 'Image upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title || !editingProject?.shortDescription) {
      error('Title and short description are required.');
      return;
    }

    setIsSaving(true);
    try {
      if (editingProject.id) {
        await api.updateProject(editingProject.id, editingProject);
        success('Project updated.');
      } else {
        await api.createProject(editingProject);
        success('New project created.');
      }
      setIsModalOpen(false);
      setEditingProject(null);
      onRefresh();
    } catch (err: any) {
      error(err.message || 'Failed to save project.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-100">Projects Showcase CMS</h2>
          <p className="text-xs text-neutral-400 mt-1">
            Manage projects, case study narratives, technology tags, and live links.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-neutral-950 bg-neutral-100 hover:bg-white rounded-xl transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Projects List */}
      <div className="space-y-3">
        {projects.map(project => (
          <div
            key={project.id}
            className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-neutral-700 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-12 rounded-lg bg-neutral-950 border border-neutral-800 overflow-hidden shrink-0">
                {project.projectImage && (
                  <img
                    src={project.projectImage}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-neutral-100">{project.title}</h4>
                  {project.isFeatured && (
                    <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 font-medium">
                      Featured
                    </span>
                  )}
                  {!project.isVisible && (
                    <span className="text-[10px] text-neutral-400 bg-neutral-800 px-1.5 py-0.5 rounded font-medium">
                      Hidden / Draft
                    </span>
                  )}
                </div>

                <div className="text-xs text-neutral-400 line-clamp-1">
                  {project.shortDescription}
                </div>

                <div className="text-[11px] text-neutral-500 flex items-center gap-2">
                  <span>Category: {project.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>Order: {project.displayOrder}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => handleToggleFeatured(project)}
                className={`p-2 rounded-lg border text-xs transition-colors ${
                  project.isFeatured
                    ? 'border-amber-500/30 text-amber-400 bg-amber-500/10'
                    : 'border-neutral-800 text-neutral-500 hover:text-neutral-300'
                }`}
                title={project.isFeatured ? 'Unmark Featured' : 'Mark Featured'}
              >
                <Star className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleToggleVisibility(project)}
                className={`p-2 rounded-lg border text-xs transition-colors ${
                  project.isVisible
                    ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                    : 'border-neutral-800 text-neutral-500 hover:text-neutral-300'
                }`}
                title={project.isVisible ? 'Hide from public' : 'Publish to public'}
              >
                {project.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>

              <button
                onClick={() => handleOpenEdit(project)}
                className="p-2 rounded-lg border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
                title="Edit Project"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleDelete(project.id, project.title)}
                className="p-2 rounded-lg border border-neutral-800 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-colors"
                title="Delete Project"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Project Modal */}
      {isModalOpen && editingProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
          role="dialog"
        >
          <div
            className="relative max-w-3xl w-full max-h-[90vh] overflow-y-auto bg-neutral-950 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 scrollbar-thin"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-base font-bold text-neutral-100">
                {editingProject.id ? 'Edit Project' : 'Create New Project'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-medium text-neutral-300">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={editingProject.title}
                    onChange={e => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-neutral-300">Category</label>
                  <input
                    type="text"
                    value={editingProject.category}
                    onChange={e => setEditingProject({ ...editingProject, category: e.target.value })}
                    placeholder="e.g. Full-Stack Web App, EdTech, E-Commerce"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-neutral-300">Short Card Description *</label>
                <textarea
                  rows={2}
                  required
                  value={editingProject.shortDescription}
                  onChange={e => setEditingProject({ ...editingProject, shortDescription: e.target.value })}
                  placeholder="Concise 1-2 sentence overview for the public card..."
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-neutral-300">Detailed Case Study Overview</label>
                <textarea
                  rows={4}
                  value={editingProject.detailedDescription}
                  onChange={e => setEditingProject({ ...editingProject, detailedDescription: e.target.value })}
                  placeholder="In-depth project background, problem space, and architecture..."
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-hidden"
                />
              </div>

              {/* Technologies & Links */}
              <div className="space-y-1">
                <label className="font-medium text-neutral-300">Technologies (comma-separated)</label>
                <input
                  type="text"
                  value={(editingProject.technologies || []).join(', ')}
                  onChange={e => setEditingProject({
                    ...editingProject,
                    technologies: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  placeholder="React, TypeScript, Node.js, Express, PostgreSQL"
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-medium text-neutral-300">GitHub Repository URL</label>
                  <input
                    type="url"
                    value={editingProject.githubUrl}
                    onChange={e => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-neutral-300">Live Demo URL</label>
                  <input
                    type="url"
                    value={editingProject.liveDemoUrl}
                    onChange={e => setEditingProject({ ...editingProject, liveDemoUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Cover Image Upload / URL */}
              <div className="space-y-2 p-4 rounded-xl border border-neutral-800 bg-neutral-900/40">
                <label className="font-medium text-neutral-300">Project Screenshot / Cover Image</label>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-1.5 px-3 py-1.5 font-medium text-neutral-200 bg-neutral-800 hover:bg-neutral-700 rounded-lg cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadImage}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    placeholder="Or enter direct image path / URL"
                    value={editingProject.projectImage}
                    onChange={e => setEditingProject({ ...editingProject, projectImage: e.target.value })}
                    className="flex-1 min-w-[200px] px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-200 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Challenges & Solutions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-medium text-neutral-300">Technical Challenges</label>
                  <textarea
                    rows={3}
                    value={editingProject.challenges}
                    onChange={e => setEditingProject({ ...editingProject, challenges: e.target.value })}
                    placeholder="Key architectural or scalability challenges encountered..."
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-neutral-300">Engineering Solution</label>
                  <textarea
                    rows={3}
                    value={editingProject.solution}
                    onChange={e => setEditingProject({ ...editingProject, solution: e.target.value })}
                    placeholder="How the technical problem was resolved..."
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Key Features (One per line) */}
              <div className="space-y-1">
                <label className="font-medium text-neutral-300">Key Features (one per line)</label>
                <textarea
                  rows={3}
                  value={(editingProject.keyFeatures || []).join('\n')}
                  onChange={e => setEditingProject({
                    ...editingProject,
                    keyFeatures: e.target.value.split('\n').map(s => s.trim()).filter(Boolean)
                  })}
                  placeholder="Real-time appointment calendar&#10;Pharmacy stock tracking&#10;Role-based access view"
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-hidden"
                />
              </div>

              {/* Contribution, Results, Architecture */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-medium text-neutral-300">My Role & Contribution</label>
                  <textarea
                    rows={2}
                    value={editingProject.myContribution}
                    onChange={e => setEditingProject({ ...editingProject, myContribution: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-neutral-300">Impact & Results</label>
                  <textarea
                    rows={2}
                    value={editingProject.results}
                    onChange={e => setEditingProject({ ...editingProject, results: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-neutral-300">Architecture Explanation</label>
                <input
                  type="text"
                  value={editingProject.architectureExplanation}
                  onChange={e => setEditingProject({ ...editingProject, architectureExplanation: e.target.value })}
                  placeholder="Express.js REST API with PostgreSQL connection pool & React frontend"
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-hidden"
                />
              </div>

              {/* Toggles & Order */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProject.isFeatured}
                    onChange={e => setEditingProject({ ...editingProject, isFeatured: e.target.checked })}
                    className="rounded border-neutral-800"
                  />
                  <span>Mark as Featured Project</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProject.isVisible}
                    onChange={e => setEditingProject({ ...editingProject, isVisible: e.target.checked })}
                    className="rounded border-neutral-800"
                  />
                  <span>Visible to Public</span>
                </label>

                <div className="flex items-center gap-2">
                  <span>Display Order:</span>
                  <input
                    type="number"
                    value={editingProject.displayOrder || 1}
                    onChange={e => setEditingProject({ ...editingProject, displayOrder: Number(e.target.value) })}
                    className="w-16 px-2 py-1 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-5 py-2 font-semibold text-neutral-950 bg-neutral-100 hover:bg-white rounded-lg transition-colors disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Saving...' : 'Save Project'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};
