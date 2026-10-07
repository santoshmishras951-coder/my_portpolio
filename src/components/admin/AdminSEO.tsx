import React, { useState } from 'react';
import { SiteSettings } from '../../types/portfolio.js';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.js';
import { Save, ExternalLink, Globe, FileCode } from 'lucide-react';

interface AdminSEOProps {
  settings: SiteSettings;
  onRefresh: () => void;
}

export const AdminSEO: React.FC<AdminSEOProps> = ({ settings, onRefresh }) => {
  const { success, error } = useToast();
  const [formData, setFormData] = useState({
    siteTitle: settings.siteTitle || '',
    metaDescription: settings.metaDescription || '',
    ogTitle: settings.ogTitle || '',
    ogDescription: settings.ogDescription || '',
    ogImage: settings.ogImage || '',
    canonicalUrl: settings.canonicalUrl || 'https://santosh-mishra.dev'
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.updateSettings(formData);
      success('SEO metadata updated.');
      onRefresh();
    } catch (err: any) {
      error(err.message || 'Failed to update SEO settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-neutral-100">Search Engine Optimization & Social Cards</h2>
        <p className="text-xs text-neutral-400 mt-1">
          Configure search metadata, OpenGraph preview cards for LinkedIn/Twitter, and crawl directives.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/40 space-y-4">
          <h3 className="text-sm font-bold text-neutral-200">Meta Tags & Search Metadata</h3>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-300">Page & Site Title</label>
            <input
              type="text"
              required
              value={formData.siteTitle}
              onChange={e => setFormData({ ...formData, siteTitle: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-300">Meta Description</label>
            <textarea
              rows={3}
              required
              value={formData.metaDescription}
              onChange={e => setFormData({ ...formData, metaDescription: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-300">Canonical Website URL</label>
            <input
              type="url"
              value={formData.canonicalUrl}
              onChange={e => setFormData({ ...formData, canonicalUrl: e.target.value })}
              placeholder="https://santosh-mishra.dev"
              className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-hidden"
            />
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/40 space-y-4">
          <h3 className="text-sm font-bold text-neutral-200">Open Graph & Social Sharing Cards</h3>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-300">Open Graph Title (og:title)</label>
            <input
              type="text"
              value={formData.ogTitle}
              onChange={e => setFormData({ ...formData, ogTitle: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-300">Open Graph Description (og:description)</label>
            <textarea
              rows={2}
              value={formData.ogDescription}
              onChange={e => setFormData({ ...formData, ogDescription: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-300">Open Graph Image URL (og:image)</label>
            <input
              type="text"
              value={formData.ogImage}
              onChange={e => setFormData({ ...formData, ogImage: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Live Search Engine Files */}
        <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/40 space-y-3">
          <h3 className="text-sm font-bold text-neutral-200">Auto-Generated Search Engine Endpoints</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-xl border border-neutral-800 bg-neutral-950 flex items-center justify-between text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-blue-400" />
                <span>View Live /sitemap.xml</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
            </a>

            <a
              href="/robots.txt"
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-xl border border-neutral-800 bg-neutral-950 flex items-center justify-between text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>View Live /robots.txt</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
            </a>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-neutral-950 bg-neutral-100 hover:bg-white rounded-xl transition-colors disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save SEO Configuration'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
