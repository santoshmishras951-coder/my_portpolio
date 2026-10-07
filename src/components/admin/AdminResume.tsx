import React, { useState } from 'react';
import { ResumeItem } from '../../types/portfolio.js';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.js';
import { Upload, FileText, CheckCircle2, Trash2, Download } from 'lucide-react';

interface AdminResumeProps {
  resumes: ResumeItem[];
  onRefresh: () => void;
}

export const AdminResume: React.FC<AdminResumeProps> = ({ resumes, onRefresh }) => {
  const { success, error } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [versionInput, setVersionInput] = useState('v2.5');

  const handleUploadResume = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      error('Please select a PDF file.');
      return;
    }

    setIsUploading(true);
    try {
      // 1. Upload file to media store
      const uploadRes = await api.uploadFile(file, `Santosh Mishra Resume ${versionInput}`);
      
      // 2. Register as new resume version in resume collection
      await api.createResume({
        title: `Santosh Mishra - Software Engineer Resume (${versionInput})`,
        fileUrl: uploadRes.file.url,
        fileName: file.name,
        fileSize: `${Math.round(file.size / 1024)} KB`,
        version: versionInput,
        isCurrent: true
      });

      success('Resume uploaded and marked as active public resume.');
      onRefresh();
    } catch (err: any) {
      error(err.message || 'Resume upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSetCurrent = async (id: string) => {
    try {
      await api.setCurrentResume(id);
      success('Active resume version updated.');
      onRefresh();
    } catch (err: any) {
      error(err.message || 'Failed to update current resume.');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete resume version "${title}"?`)) return;
    try {
      await api.deleteResume(id);
      success('Resume version deleted.');
      onRefresh();
    } catch (err: any) {
      error(err.message || 'Failed to delete resume.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-neutral-100">Resume & CV Management</h2>
        <p className="text-xs text-neutral-400 mt-1">
          Upload new resume PDFs, maintain version history, and choose which version recruiters can download.
        </p>
      </div>

      {/* Upload Box */}
      <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/40 space-y-4">
        <h3 className="text-sm font-bold text-neutral-200">Upload New Resume Version</h3>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="space-y-1 w-full sm:w-48">
            <label className="text-xs font-medium text-neutral-400">Version Label</label>
            <input
              type="text"
              value={versionInput}
              onChange={e => setVersionInput(e.target.value)}
              placeholder="e.g. v2.5 (Oct 2026)"
              className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-hidden"
            />
          </div>

          <div className="pt-5 w-full sm:w-auto">
            <label className="flex items-center justify-center gap-2 px-5 py-2 text-xs font-semibold text-neutral-950 bg-neutral-100 hover:bg-white rounded-xl cursor-pointer transition-colors w-full sm:w-auto">
              <Upload className="w-3.5 h-3.5" />
              <span>{isUploading ? 'Uploading PDF...' : 'Select & Upload PDF'}</span>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleUploadResume}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <p className="text-[11px] text-neutral-500">
          Accepts standard PDF documents up to 10MB. Uploading automatically marks the new version as current.
        </p>
      </div>

      {/* Versions List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-neutral-200">Uploaded Resume Versions</h3>

        {resumes.map(res => (
          <div
            key={res.id}
            className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
              res.isCurrent
                ? 'border-blue-500/30 bg-blue-500/5'
                : 'border-neutral-800 bg-neutral-900/30'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-blue-400 shrink-0">
                <FileText className="w-5 h-5" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-neutral-100">{res.title}</h4>
                  {res.isCurrent && (
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Active for Public Download
                    </span>
                  )}
                </div>

                <div className="text-xs text-neutral-400 flex items-center gap-2">
                  <span>Version {res.version}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{res.fileSize}</span>
                  <span aria-hidden="true">·</span>
                  <span>Uploaded {res.uploadDate}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              {!res.isCurrent && (
                <button
                  onClick={() => handleSetCurrent(res.id)}
                  className="px-3 py-1.5 text-xs font-medium text-neutral-300 border border-neutral-800 hover:border-neutral-700 rounded-lg hover:text-white transition-colors"
                >
                  Make Active
                </button>
              )}

              <a
                href={res.fileUrl}
                target="_blank"
                rel="noreferrer"
                download={res.fileName}
                className="p-2 text-neutral-400 hover:text-white rounded-lg border border-neutral-800 hover:bg-neutral-800"
                title="Download / Preview"
              >
                <Download className="w-4 h-4" />
              </a>

              {resumes.length > 1 && (
                <button
                  onClick={() => handleDelete(res.id, res.title)}
                  className="p-2 text-rose-400 hover:text-rose-300 rounded-lg border border-neutral-800 hover:bg-rose-500/10"
                  title="Delete version"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
