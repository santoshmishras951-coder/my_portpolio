import React, { useState } from 'react';
import { Achievement } from '../../types/portfolio.js';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.js';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';

interface AdminAchievementsProps {
  achievements: Achievement[];
  onRefresh: () => void;
}

export const AdminAchievements: React.FC<AdminAchievementsProps> = ({ achievements, onRefresh }) => {
  const { success, error } = useToast();
  const [editingAch, setEditingAch] = useState<Partial<Achievement> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const categories: Achievement['category'][] = [
    'Hackathon',
    'Internship',
    'Academic',
    'Certification',
    'Competition',
    'Other'
  ];

  const handleOpenCreate = () => {
    setEditingAch({
      title: '',
      organization: '',
      date: '',
      description: '',
      certificateImage: '',
      verificationUrl: '',
      category: 'Hackathon',
      displayOrder: achievements.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ach: Achievement) => {
    setEditingAch({ ...ach });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete achievement "${title}"?`)) return;
    try {
      await api.deleteAchievement(id);
      success('Achievement removed.');
      onRefresh();
    } catch (err: any) {
      error(err.message || 'Failed to delete achievement.');
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAch?.title || !editingAch?.organization) {
      error('Title and organization are required.');
      return;
    }

    setIsSaving(true);
    try {
      if (editingAch.id) {
        await api.updateAchievement(editingAch.id, editingAch);
        success('Achievement updated.');
      } else {
        await api.createAchievement(editingAch);
        success('Achievement created.');
      }
      setIsModalOpen(false);
      setEditingAch(null);
      onRefresh();
    } catch (err: any) {
      error(err.message || 'Failed to save achievement.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-100">Achievements & Certifications CMS</h2>
          <p className="text-xs text-neutral-400 mt-1">
            Showcase hackathon recognitions, technical certificates, and academic honors.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-neutral-950 bg-neutral-100 hover:bg-white rounded-xl transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Achievement</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map(item => (
          <div
            key={item.id}
            className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/30 flex flex-col justify-between space-y-4 hover:border-neutral-700 transition-colors"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>{item.category}</span>
                <span className="tabular-nums">{item.date}</span>
              </div>
              <h4 className="text-sm font-bold text-neutral-100">{item.title}</h4>
              <p className="text-xs text-blue-400 font-medium">{item.organization}</p>
              {item.description && (
                <p className="text-xs text-neutral-400 line-clamp-2 pt-1">{item.description}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800/40">
              <button
                onClick={() => handleOpenEdit(item)}
                className="p-1.5 rounded-lg border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800"
                title="Edit"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(item.id, item.title)}
                className="p-1.5 rounded-lg border border-neutral-800 text-rose-400 hover:bg-rose-500/10"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && editingAch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-lg w-full bg-neutral-950 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-100">
                {editingAch.id ? 'Edit Achievement' : 'New Achievement'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-neutral-300">Achievement Title *</label>
                <input
                  type="text"
                  required
                  value={editingAch.title}
                  onChange={e => setEditingAch({ ...editingAch, title: e.target.value })}
                  placeholder="e.g. Finalist - Inter-College Hackathon 2024"
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-neutral-300">Issuing Organization *</label>
                  <input
                    type="text"
                    required
                    value={editingAch.organization}
                    onChange={e => setEditingAch({ ...editingAch, organization: e.target.value })}
                    placeholder="e.g. State Tech University"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-neutral-300">Category</label>
                  <select
                    value={editingAch.category}
                    onChange={e => setEditingAch({ ...editingAch, category: e.target.value as Achievement['category'] })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-hidden"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-neutral-300">Date / Year</label>
                  <input
                    type="text"
                    value={editingAch.date}
                    onChange={e => setEditingAch({ ...editingAch, date: e.target.value })}
                    placeholder="e.g. Oct 2024"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-neutral-300">Verification URL</label>
                  <input
                    type="url"
                    value={editingAch.verificationUrl}
                    onChange={e => setEditingAch({ ...editingAch, verificationUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-neutral-300">Description</label>
                <textarea
                  rows={3}
                  value={editingAch.description}
                  onChange={e => setEditingAch({ ...editingAch, description: e.target.value })}
                  placeholder="Details of the project prototype, competition scope, or certificate..."
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
                  <span>{isSaving ? 'Saving...' : 'Save Achievement'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
