import React, { useState } from 'react';
import { Experience } from '../../types/portfolio.js';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.js';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';

interface AdminExperienceProps {
  experience: Experience[];
  onRefresh: () => void;
}

export const AdminExperience: React.FC<AdminExperienceProps> = ({ experience, onRefresh }) => {
  const { success, error } = useToast();
  const [editingExp, setEditingExp] = useState<Partial<Experience> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenCreate = () => {
    setEditingExp({
      company: '',
      position: '',
      employmentType: 'Internship / Student Project',
      location: 'Odisha, India',
      startDate: '',
      endDate: '',
      currentlyWorking: false,
      description: '',
      responsibilities: [],
      achievements: [],
      technologies: [],
      displayOrder: experience.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (exp: Experience) => {
    setEditingExp({ ...exp });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, role: string) => {
    if (!confirm(`Delete experience record "${role}"?`)) return;
    try {
      await api.deleteExperience(id);
      success('Experience removed.');
      onRefresh();
    } catch (err: any) {
      error(err.message || 'Failed to delete record.');
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp?.company || !editingExp?.position || !editingExp?.startDate) {
      error('Company, position, and start date are required.');
      return;
    }

    setIsSaving(true);
    try {
      if (editingExp.id) {
        await api.updateExperience(editingExp.id, editingExp);
        success('Experience updated.');
      } else {
        await api.createExperience(editingExp);
        success('Experience record created.');
      }
      setIsModalOpen(false);
      setEditingExp(null);
      onRefresh();
    } catch (err: any) {
      error(err.message || 'Failed to save experience record.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-100">Experience Timeline CMS</h2>
          <p className="text-xs text-neutral-400 mt-1">
            Manage student developer initiatives, internships, and work experience.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-neutral-950 bg-neutral-100 hover:bg-white rounded-xl transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Experience Record</span>
        </button>
      </div>

      <div className="space-y-3">
        {experience.map(item => (
          <div
            key={item.id}
            className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-neutral-700 transition-colors"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-neutral-100">{item.position}</h4>
                <span className="text-xs text-blue-400 font-medium">@ {item.company}</span>
              </div>
              <div className="text-xs text-neutral-400">
                <span>{item.startDate} — {item.currentlyWorking ? 'Present' : item.endDate}</span>
                <span className="mx-2">·</span>
                <span>{item.employmentType}</span>
                {item.location && <span className="ml-2 text-neutral-500">({item.location})</span>}
              </div>
              {item.description && (
                <p className="text-xs text-neutral-400 line-clamp-1">{item.description}</p>
              )}
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => handleOpenEdit(item)}
                className="p-2 rounded-lg border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(item.id, `${item.position} at ${item.company}`)}
                className="p-2 rounded-lg border border-neutral-800 text-rose-400 hover:bg-rose-500/10"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && editingExp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-xl w-full bg-neutral-950 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-100">
                {editingExp.id ? 'Edit Experience' : 'New Experience Record'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-neutral-300">Company / Organization *</label>
                  <input
                    type="text"
                    required
                    value={editingExp.company}
                    onChange={e => setEditingExp({ ...editingExp, company: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-neutral-300">Position / Title *</label>
                  <input
                    type="text"
                    required
                    value={editingExp.position}
                    onChange={e => setEditingExp({ ...editingExp, position: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-neutral-300">Employment Type</label>
                  <input
                    type="text"
                    value={editingExp.employmentType}
                    onChange={e => setEditingExp({ ...editingExp, employmentType: e.target.value })}
                    placeholder="e.g. Full-time, Internship, Lead"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-neutral-300">Location</label>
                  <input
                    type="text"
                    value={editingExp.location}
                    onChange={e => setEditingExp({ ...editingExp, location: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-neutral-300">Start Date *</label>
                  <input
                    type="text"
                    required
                    value={editingExp.startDate}
                    onChange={e => setEditingExp({ ...editingExp, startDate: e.target.value })}
                    placeholder="e.g. Aug 2024"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-neutral-300">End Date</label>
                  <input
                    type="text"
                    disabled={editingExp.currentlyWorking}
                    value={editingExp.endDate || ''}
                    onChange={e => setEditingExp({ ...editingExp, endDate: e.target.value })}
                    placeholder="e.g. Present or Nov 2024"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-hidden disabled:opacity-40"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingExp.currentlyWorking}
                  onChange={e => setEditingExp({ ...editingExp, currentlyWorking: e.target.checked })}
                  className="rounded border-neutral-800"
                />
                <span>Currently active role</span>
              </label>

              <div className="space-y-1">
                <label className="font-medium text-neutral-300">Role Summary</label>
                <textarea
                  rows={2}
                  value={editingExp.description}
                  onChange={e => setEditingExp({ ...editingExp, description: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-neutral-300">Key Responsibilities (one per line)</label>
                <textarea
                  rows={3}
                  value={(editingExp.responsibilities || []).join('\n')}
                  onChange={e => setEditingExp({
                    ...editingExp,
                    responsibilities: e.target.value.split('\n').map(s => s.trim()).filter(Boolean)
                  })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-neutral-300">Technologies (comma-separated)</label>
                <input
                  type="text"
                  value={(editingExp.technologies || []).join(', ')}
                  onChange={e => setEditingExp({
                    ...editingExp,
                    technologies: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  placeholder="React, JavaScript, Git, Tailwind CSS"
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-4 py-1.5 font-semibold text-neutral-950 bg-neutral-100 hover:bg-white rounded-lg transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Saving...' : 'Save Record'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
