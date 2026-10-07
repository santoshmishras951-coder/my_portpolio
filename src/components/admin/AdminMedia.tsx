import React, { useState } from 'react';
import { MediaItem } from '../../types/portfolio.js';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.js';
import { Upload, Trash2, Copy, Check, FileText, Image as ImageIcon } from 'lucide-react';

interface AdminMediaProps {
  media: MediaItem[];
  onRefresh: () => void;
}

export const AdminMedia: React.FC<AdminMediaProps> = ({ media, onRefresh }) => {
  const { success, error } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await api.uploadFile(file, file.name);
      success('File uploaded to media library.');
      onRefresh();
    } catch (err: any) {
      error(err.message || 'Upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete media asset "${name}"?`)) return;
    try {
      await api.deleteMedia(id);
      success('Media asset removed.');
      onRefresh();
    } catch (err: any) {
      error(err.message || 'Failed to delete asset.');
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    success('Media URL copied to clipboard.');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-100">Media Library & Storage</h2>
          <p className="text-xs text-neutral-400 mt-1">
            Upload and manage screenshots, certificates, headshots, and documents.
          </p>
        </div>

        <label className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-neutral-950 bg-neutral-100 hover:bg-white rounded-xl cursor-pointer transition-colors shrink-0">
          <Upload className="w-4 h-4" />
          <span>{isUploading ? 'Uploading...' : 'Upload File'}</span>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleUpload}
            disabled={isUploading}
            className="hidden"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {media.map(item => {
          const isImage = item.mimeType?.startsWith('image/') || item.url.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i);

          return (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl border border-neutral-800 bg-neutral-900/30 flex flex-col justify-between space-y-3 hover:border-neutral-700 transition-colors"
            >
              <div className="aspect-4/3 w-full rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 flex items-center justify-center">
                {isImage ? (
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FileText className="w-8 h-8 text-neutral-500" />
                )}
              </div>

              <div className="space-y-1">
                <div className="text-xs font-bold text-neutral-200 truncate" title={item.name}>
                  {item.name}
                </div>
                <div className="text-[11px] text-neutral-500 flex items-center justify-between">
                  <span className="tabular-nums">{Math.round(item.size / 1024)} KB</span>
                  <span className="truncate max-w-[120px]">{item.mimeType || 'file'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-neutral-800/60">
                <button
                  onClick={() => handleCopyUrl(item.url, item.id)}
                  className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white"
                  title="Copy URL path"
                >
                  {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === item.id ? 'Copied' : 'Copy Path'}</span>
                </button>

                <button
                  onClick={() => handleDelete(item.id, item.name)}
                  className="p-1 text-rose-400 hover:text-rose-300"
                  title="Delete file"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
