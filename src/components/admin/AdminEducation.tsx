import React, { useState } from 'react';
import { Education } from '../../types/portfolio.js';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.js';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';

interface AdminEducationProps {
  education: Education[];
  onRefresh: () => void;
}

export const AdminEducation: React.FC<AdminEducationProps> = ({ education, onRefresh }) => {
  const { success, error } = useToast();
  const [editingEdu, setEditingEdu] = useState<Partial<Education> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenCreate = () => {
    setEditingEdu({
      institution: '',
      degree: '',
      field: 'Computer Science & Engineering',
      startYear: '2023',
      endYear: '2027',
      currentStatus: 'Currently in 3rd Year',
      grade: '',
      description: '',
      displayOrder: education.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (edu: Education) => {
    setEditingEdu({ ...edu });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, inst: string) => {
    if (!confirm(`Delete education record "${inst}"?`)) return;
    try {
      await api.deleteEducation(id);
      success('Education record removed.');
      onRefresh();
    } catch (err: any) {
      error(err.message || 'Failed to delete record.');
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEdu?.institution || !editingEdu?.degree || !editingEdu?.startYear) {
      error('Institution, degree, and start year are required.');
      return;
    }

    setIsSaving(true);
    try {
      if (editingEdu.id) {
        await api.updateEducation(editingEdu.id, editingEdu);
        success('Education updated.');
      } else {
        await api.createEducation(editingEdu);
        success('Education record created.');
      }
      setIsModalOpen(false);
      setEditingEdu(null);
      onRefresh();
    } catch (err: any) {
      error(err.message || 'Failed to save education record.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-100">Education Timeline CMS</h2>
          <p className="text-xs text-neutral-400 mt-1">
            Manage degrees, colleges/schools, GPA, and curriculum details.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-neutral-950 bg-neutral-100 hover:bg-white rounded-xl transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Education</span>
        </button>
      </div>

      <div className="space-y-3">
        {education.map(item => (
          <div
            key={item.id}
            className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-neutral-700 transition-colors"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-neutral-100">{item.degree}</h4>
                <span className="text-xs text-blue-400 font-medium">{item.institution}</span>
              </div>
              <div className="text-xs text-neutral-400">
                <span className="tabular-nums">{item.startYear} — {item.endYear}</span>
                {item.grade && (
                  <>
                    <span className="mx-2">·</span>
                    <span className="text-emerald-400 font-medium">Grade: {item.grade}</span>
                  </>
                )}
                {item.currentStatus && (
                  <>
                    <span className="mx-2">·</span>
                    <span>{item.currentStatus}</span>
                  </>
                )}
              </div>
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
                onClick={() => handleDelete(item.id, item.institution)}
                className="p-2 rounded-lg border border-neutral-800 text-rose-400 hover:bg-rose-500/10"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && editingEdu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-lg w-full bg-neutral-950 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-100">
                {editingEdu.id ? 'Edit Education Record' : 'New Education Record'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-neutral-300">Degree / Qualification *</label>
                <input
                  type="text"
                  required
                  value={editingEdu.degree}
                  onChange={e => setEditingEdu({ ...editingEdu, degree: e.target.value })}
                  placeholder="e.g. B.Tech in Computer Science & Engineering"
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-neutral-300">Institution / University *</label>
                <input
                  type="text"
                  required
                  value={editingEdu.institution}
                  onChange={e => setEditingEdu({ ...editingEdu, institution: e.target.value })}
                  placeholder="e.g. Engineering College / University in Odisha"
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-neutral-300">Start Year *</label>
                  <input
                    type="text"
                    required
                    value={editingEdu.startYear}
                    onChange={e => setEditingEdu({ ...editingEdu, startYear: e.target.value })}
                    placeholder="2023"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-neutral-300">End Year (or Expected)</label>
                  <input
                    type="text"
                    value={editingEdu.endYear}
                    onChange={e => setEditingEdu({ ...editingEdu, endYear: e.target.value })}
                    placeholder="2027"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-neutral-300">Grade / CGPA</label>
                  <input
                    type="text"
                    value={editingEdu.grade}
                    onChange={e => setEditingEdu({ ...editingEdu, grade: e.target.value })}
                    placeholder="e.g. 8.4 / 10 CGPA"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-neutral-300">Status</label>
                  <input
                    type="text"
                    value={editingEdu.currentStatus}
                    onChange={e => setEditingEdu({ ...editingEdu, currentStatus: e.target.value })}
                    placeholder="e.g. Currently in 3rd Year"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-neutral-300">Coursework & Description</label>
                <textarea
                  rows={3}
                  value={editingEdu.description}
                  onChange={e => setEditingEdu({ ...editingEdu, description: e.target.value })}
                  placeholder="Data Structures, Algorithms, DBMS, Operating Systems..."
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
                  <span>{isSaving ? 'Saving...' : 'Save Education'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
