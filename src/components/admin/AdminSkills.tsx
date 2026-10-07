import React, { useState } from 'react';
import { Skill, SkillCategory, SkillProficiency } from '../../types/portfolio.js';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.js';
import { Plus, Edit2, Trash2, Eye, EyeOff, X, Save } from 'lucide-react';

interface AdminSkillsProps {
  skills: Skill[];
  onRefresh: () => void;
}

export const AdminSkills: React.FC<AdminSkillsProps> = ({ skills, onRefresh }) => {
  const { success, error } = useToast();
  const [editingSkill, setEditingSkill] = useState<Partial<Skill> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const categories: SkillCategory[] = [
    'Frontend',
    'Backend',
    'Database',
    'Programming',
    'Tools',
    'Cloud',
    'Other'
  ];

  const proficiencies: SkillProficiency[] = [
    'Beginner',
    'Intermediate',
    'Proficient',
    'Advanced'
  ];

  const handleOpenCreate = () => {
    setEditingSkill({
      name: '',
      category: 'Frontend',
      proficiency: 'Intermediate',
      yearsExperience: '1 yr',
      description: '',
      displayOrder: skills.length + 1,
      isVisible: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (skill: Skill) => {
    setEditingSkill({ ...skill });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete skill "${name}"?`)) return;
    try {
      await api.deleteSkill(id);
      success('Skill deleted.');
      onRefresh();
    } catch (err: any) {
      error(err.message || 'Failed to delete skill.');
    }
  };

  const handleToggleVisibility = async (skill: Skill) => {
    try {
      await api.updateSkill(skill.id, { isVisible: !skill.isVisible });
      success(`Skill "${skill.name}" visibility updated.`);
      onRefresh();
    } catch (err: any) {
      error(err.message || 'Failed to update visibility.');
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill?.name?.trim()) {
      error('Skill name is required.');
      return;
    }

    setIsSaving(true);
    try {
      if (editingSkill.id) {
        await api.updateSkill(editingSkill.id, editingSkill);
        success('Skill updated.');
      } else {
        await api.createSkill(editingSkill);
        success('Skill added.');
      }
      setIsModalOpen(false);
      setEditingSkill(null);
      onRefresh();
    } catch (err: any) {
      error(err.message || 'Failed to save skill.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-100">Technical Skills CMS</h2>
          <p className="text-xs text-neutral-400 mt-1">
            Categorize technologies, set honest proficiencies, and toggle public visibility.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-neutral-950 bg-neutral-100 hover:bg-white rounded-xl transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Skill</span>
        </button>
      </div>

      {/* Grid of skills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {skills.map(skill => (
          <div
            key={skill.id}
            className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/30 flex items-center justify-between gap-3 hover:border-neutral-700 transition-colors"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-neutral-100">{skill.name}</h4>
                {!skill.isVisible && (
                  <span className="text-[10px] text-neutral-500 bg-neutral-800 px-1.5 py-0.5 rounded">
                    Hidden
                  </span>
                )}
              </div>
              <div className="text-[11px] text-neutral-400">
                <span>{skill.category}</span>
                <span className="mx-1.5">·</span>
                <span className="text-blue-400 font-medium">{skill.proficiency}</span>
                {skill.yearsExperience && (
                  <>
                    <span className="mx-1.5">·</span>
                    <span className="text-neutral-500">{skill.yearsExperience}</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => handleToggleVisibility(skill)}
                className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
                title={skill.isVisible ? 'Hide' : 'Show'}
              >
                {skill.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-neutral-600" />}
              </button>
              <button
                onClick={() => handleOpenEdit(skill)}
                className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
                title="Edit"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(skill.id, skill.name)}
                className="p-1.5 text-rose-400 hover:text-rose-300 rounded hover:bg-rose-500/10 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && editingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-md w-full bg-neutral-950 border border-neutral-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-100">
                {editingSkill.id ? 'Edit Skill' : 'Add New Skill'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-neutral-300">Skill Name *</label>
                <input
                  type="text"
                  required
                  value={editingSkill.name}
                  onChange={e => setEditingSkill({ ...editingSkill, name: e.target.value })}
                  placeholder="e.g. React, PostgreSQL, Docker"
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-neutral-300">Category</label>
                  <select
                    value={editingSkill.category}
                    onChange={e => setEditingSkill({ ...editingSkill, category: e.target.value as SkillCategory })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-hidden"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-neutral-300">Proficiency Level</label>
                  <select
                    value={editingSkill.proficiency}
                    onChange={e => setEditingSkill({ ...editingSkill, proficiency: e.target.value as SkillProficiency })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-hidden"
                  >
                    {proficiencies.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-neutral-300">Experience Period</label>
                  <input
                    type="text"
                    value={editingSkill.yearsExperience}
                    onChange={e => setEditingSkill({ ...editingSkill, yearsExperience: e.target.value })}
                    placeholder="e.g. 2 yrs, 1 yr"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-neutral-300">Display Order</label>
                  <input
                    type="number"
                    value={editingSkill.displayOrder || 1}
                    onChange={e => setEditingSkill({ ...editingSkill, displayOrder: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-neutral-300">Description / Focus Note</label>
                <textarea
                  rows={2}
                  value={editingSkill.description}
                  onChange={e => setEditingSkill({ ...editingSkill, description: e.target.value })}
                  placeholder="Key concepts or libraries used..."
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-hidden"
                />
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingSkill.isVisible}
                  onChange={e => setEditingSkill({ ...editingSkill, isVisible: e.target.checked })}
                  className="rounded border-neutral-800"
                />
                <span>Visible to Public Visitors</span>
              </label>

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
                  <span>{isSaving ? 'Saving...' : 'Save Skill'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
