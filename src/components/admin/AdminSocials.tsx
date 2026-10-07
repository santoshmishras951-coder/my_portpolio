import React, { useState } from 'react';
import { SocialLink } from '../../types/portfolio.js';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.js';
import { Plus, Edit2, Trash2, Eye, EyeOff, X, Save, Globe } from 'lucide-react';

interface AdminSocialsProps {
  socials: SocialLink[];
  onRefresh: () => void;
}

export const AdminSocials: React.FC<AdminSocialsProps> = ({ socials, onRefresh }) => {
  const { success, error } = useToast();
  const [editingSocial, setEditingSocial] = useState<Partial<SocialLink> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenCreate = () => {
    setEditingSocial({
      platform: '',
      url: '',
      iconName: 'Globe',
      displayName: '',
      isVisible: true,
      displayOrder: socials.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (social: SocialLink) => {
    setEditingSocial({ ...social });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, platform: string) => {
    if (!confirm(`Delete link for "${platform}"?`)) return;
    try {
      await api.deleteSocial(id);
      success('Social link removed.');
      onRefresh();
    } catch (err: any) {
      error(err.message || 'Failed to delete social link.');
    }
  };

  const handleToggleVisibility = async (social: SocialLink) => {
    try {
      await api.updateSocial(social.id, { isVisible: !social.isVisible });
      success(`Link "${social.platform}" visibility updated.`);
      onRefresh();
    } catch (err: any) {
      error(err.message || 'Failed to update visibility.');
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSocial?.platform || !editingSocial?.url) {
      error('Platform name and URL are required.');
      return;
    }

    setIsSaving(true);
    try {
      if (editingSocial.id) {
        await api.updateSocial(editingSocial.id, editingSocial);
        success('Social link updated.');
      } else {
        await api.createSocial(editingSocial);
        success('Social link added.');
      }
      setIsModalOpen(false);
      setEditingSocial(null);
      onRefresh();
    } catch (err: any) {
      error(err.message || 'Failed to save social link.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-100">Social Links & External Profiles</h2>
          <p className="text-xs text-neutral-400 mt-1">
            Manage links for GitHub, LinkedIn, Email, and other professional channels.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-neutral-950 bg-neutral-100 hover:bg-white rounded-xl transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Social Link</span>
        </button>
      </div>

      <div className="space-y-3">
        {socials.map(link => (
          <div
            key={link.id}
            className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/30 flex items-center justify-between gap-4 hover:border-neutral-700 transition-colors"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" />
                <h4 className="text-sm font-bold text-neutral-100">{link.platform}</h4>
                {!link.isVisible && (
                  <span className="text-[10px] text-neutral-500 bg-neutral-800 px-1.5 py-0.5 rounded">
                    Hidden
                  </span>
                )}
              </div>
              <div className="text-xs text-neutral-400">
                <a href={link.url} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
                  {link.url}
                </a>
                <span className="mx-2">·</span>
                <span className="text-neutral-500">Order: {link.displayOrder}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => handleToggleVisibility(link)}
                className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800"
                title={link.isVisible ? 'Hide' : 'Show'}
              >
                {link.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => handleOpenEdit(link)}
                className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800"
                title="Edit"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(link.id, link.platform)}
                className="p-1.5 text-rose-400 hover:text-rose-300 rounded hover:bg-rose-500/10"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && editingSocial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-md w-full bg-neutral-950 border border-neutral-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-100">
                {editingSocial.id ? 'Edit Social Link' : 'Add Social Link'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-neutral-300">Platform Name *</label>
                <input
                  type="text"
                  required
                  value={editingSocial.platform}
                  onChange={e => setEditingSocial({ ...editingSocial, platform: e.target.value })}
                  placeholder="e.g. GitHub, LinkedIn, X / Twitter"
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-neutral-300">URL *</label>
                <input
                  type="url"
                  required
                  value={editingSocial.url}
                  onChange={e => setEditingSocial({ ...editingSocial, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-neutral-300">Display Handle/Text</label>
                  <input
                    type="text"
                    value={editingSocial.displayName}
                    onChange={e => setEditingSocial({ ...editingSocial, displayName: e.target.value })}
                    placeholder="e.g. github.com/santosh"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-neutral-300">Display Order</label>
                  <input
                    type="number"
                    value={editingSocial.displayOrder || 1}
                    onChange={e => setEditingSocial({ ...editingSocial, displayOrder: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-hidden"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingSocial.isVisible}
                  onChange={e => setEditingSocial({ ...editingSocial, isVisible: e.target.checked })}
                  className="rounded border-neutral-800"
                />
                <span>Visible to Public</span>
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
                  <span>{isSaving ? 'Saving...' : 'Save Link'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
