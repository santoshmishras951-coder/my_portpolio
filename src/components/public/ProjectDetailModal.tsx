import React, { useEffect } from 'react';
import { Project } from '../../types/portfolio.js';
import { X, ExternalLink, Globe, CheckCircle, AlertTriangle, Lightbulb, Code, Server, User, FileText } from 'lucide-react';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-8 scrollbar-thin"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2.5 text-neutral-500 hover:text-neutral-950 dark:hover:text-white rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors z-10 cursor-pointer"
          aria-label="Close project modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-3.5 pr-10">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 dark:text-neutral-400">
            <span className="font-bold text-blue-600 dark:text-blue-400">{project.category}</span>
            {project.completionDate && (
              <>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{project.startDate} — {project.completionDate}</span>
              </>
            )}
            {project.isFeatured && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Featured Production Project</span>
              </>
            )}
          </div>

          <h3 id="modal-title" className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-neutral-100">
            {project.title}
          </h3>

          <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed font-normal">
            {project.shortDescription}
          </p>

          {/* Links: ONLY LIVE DEMO / VISIT WEBSITE (GitHub removed as requested) */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {project.liveDemoUrl && (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
              >
                <Globe className="w-4 h-4" />
                <span>Live Demo / Visit Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {project.caseStudyUrl && (
              <a
                href={project.caseStudyUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 rounded-xl transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>Open External Case Study</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Main Cover Image */}
        {project.projectImage && (
          <div className="w-full aspect-16/9 rounded-2xl overflow-hidden border border-neutral-300 dark:border-neutral-800 bg-neutral-950 shadow-md">
            <img
              src={project.projectImage}
              alt={project.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
          </div>
        )}

        {/* Technology Stack Tags */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Technology Stack & Tools
          </h4>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 font-mono text-xs font-semibold"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Detailed Narrative */}
        <div className="space-y-6 text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed border-t border-neutral-200 dark:border-neutral-800 pt-6 font-normal">
          {project.detailedDescription && (
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500">
                OVERVIEW
              </h4>
              <p className="leading-relaxed text-sm sm:text-base">
                {project.detailedDescription}
              </p>
            </div>
          )}

          {project.challenges && (
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-neutral-800 dark:text-neutral-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-600 dark:text-amber-400 text-xs sm:text-sm font-mono">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>TECHNICAL CHALLENGES</span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed">
                {project.challenges}
              </p>
            </div>
          )}

          {project.solution && (
            <div className="p-4 sm:p-5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-neutral-800 dark:text-neutral-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-mono">
                <Lightbulb className="w-4 h-4 shrink-0" />
                <span>ARCHITECTURAL SOLUTION</span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed">
                {project.solution}
              </p>
            </div>
          )}

          {project.keyFeatures && project.keyFeatures.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500">
                KEY FEATURES & CAPABILITIES
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {project.keyFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.myContribution && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-neutral-500">
                <User className="w-3.5 h-3.5 text-blue-500" />
                <span>ENGINEERING ROLE & CONTRIBUTION</span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed">
                {project.myContribution}
              </p>
            </div>
          )}

          {project.results && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs sm:text-sm space-y-1">
              <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">OUTCOME & RESULTS:</span>
              <p>{project.results}</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-800 text-xs sm:text-sm font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Close
          </button>

          {project.liveDemoUrl && (
            <a
              href={project.liveDemoUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-colors"
            >
              <span>Launch Live Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

      </div>
    </div>
  );
};
