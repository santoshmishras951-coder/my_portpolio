import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Project } from '../../types/portfolio.js';
import { ExternalLink, Search, Layers, Globe, ArrowRight, Sparkles } from 'lucide-react';
import { ProjectDetailModal } from './ProjectDetailModal.js';
import { Signature } from './Signature.js';

interface ProjectsSectionProps {
  projects: Project[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = projects.filter(project => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.technologies.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const handleCardClick = (project: Project) => {
    if (project.liveDemoUrl) {
      window.open(project.liveDemoUrl, '_blank', 'noopener,noreferrer');
    } else {
      setSelectedProject(project);
    }
  };

  const handleCaseStudyClick = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    setSelectedProject(project);
  };

  const handleVisitWebsiteClick = (e: React.MouseEvent, url?: string) => {
    e.stopPropagation();
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.section 
      id="projects" 
      className="py-14 sm:py-20 border-t border-neutral-200 dark:border-neutral-800/80 snap-start scroll-mt-18 sm:scroll-mt-20"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-mono font-bold text-purple-500 uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              <span>03 // FEATURED PROJECTS</span>
            </div>

            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 dark:from-purple-400 dark:via-fuchsia-300 dark:to-pink-400 bg-clip-text text-transparent">
                Selected Software Projects
              </span>
            </h3>
          </div>

          {/* Quick Search */}
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search projects or technologies..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-hidden focus:border-blue-500 shadow-xs transition-colors"
            />
          </div>
        </div>

        {/* Project Cards Grid (All Projects) */}
        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-neutral-300 dark:border-neutral-800 rounded-2xl space-y-2">
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">No projects found matching search query.</p>
            <p className="text-xs text-neutral-500">Try clearing the search term to view all projects.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {filteredProjects.map(project => (
              <div
                key={project.id}
                className="group flex flex-col justify-between rounded-3xl border border-neutral-200/90 dark:border-neutral-800/90 bg-white dark:bg-neutral-900/70 hover:border-blue-500 dark:hover:border-blue-500 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                {/* Instagram / Social Post Header */}
                <div className="p-3.5 sm:p-4 border-b border-neutral-100 dark:border-neutral-800/70 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-0.5 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-900 border border-white dark:border-neutral-900">
                        <img
                          src="/src/assets/images/santosh_yy.jpeg"
                          alt="Santosh"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center">
                        <Signature size="xs" />
                      </div>
                      <p className="text-[10px] text-neutral-500 font-mono">
                        Project • {project.category}
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-[10px] font-mono font-bold">
                    Featured
                  </span>
                </div>

                {/* Project Image Preview with Click to Visit */}
                <div
                  onClick={() => handleCardClick(project)}
                  className="aspect-16/9 w-full overflow-hidden bg-neutral-950 relative cursor-pointer group"
                  title={project.liveDemoUrl ? `Visit ${project.title}` : `View ${project.title}`}
                >
                  {project.projectImage ? (
                    <img
                      src={project.projectImage}
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-600">
                      <Layers className="w-8 h-8" />
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent opacity-70 group-hover:opacity-85 transition-opacity" />

                  {/* Direct Visit Website Pill on Image */}
                  {project.liveDemoUrl && (
                    <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white flex items-center gap-1.5 shadow-lg transition-transform group-hover:scale-105">
                      <Globe className="w-3.5 h-3.5" />
                      <span>Live App</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between space-y-3.5">
                  <div className="space-y-2">
                    <h4
                      onClick={() => handleCardClick(project)}
                      className="text-base sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer flex items-center justify-between gap-2"
                      title={project.liveDemoUrl ? `Visit ${project.title}` : `View ${project.title}`}
                    >
                      <span>{project.title}</span>
                      {project.liveDemoUrl && (
                        <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors shrink-0" />
                      )}
                    </h4>

                    <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-normal">
                      {project.shortDescription}
                    </p>
                  </div>

                  {/* Technology Hashtags */}
                  <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/60">
                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-mono text-[11px] font-semibold border border-blue-200 dark:border-blue-900/60"
                        >
                          #{tech.replace(/\s+/g, '')}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Action Buttons: Full Case Study & Visit Website */}
                  <div className="pt-3 border-t border-neutral-200/80 dark:border-neutral-800/80 flex items-center justify-between gap-2">
                    {/* Full Case Study Button */}
                    <button
                      type="button"
                      onClick={(e) => handleCaseStudyClick(e, project)}
                      className="flex-1 flex items-center justify-center gap-1.5 min-h-[42px] px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800/90 text-neutral-800 dark:text-neutral-200 hover:text-blue-600 dark:hover:text-blue-400 font-bold text-xs active:scale-95 transition-all cursor-pointer"
                      title="View Detailed Case Study & Architecture"
                    >
                      <ArrowRight className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>Case Study</span>
                    </button>

                    {/* Prominent Visit Website Button */}
                    {project.liveDemoUrl ? (
                      <button
                        type="button"
                        onClick={(e) => handleVisitWebsiteClick(e, project.liveDemoUrl)}
                        className="flex-1 flex items-center justify-center gap-1.5 min-h-[42px] px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl shadow-md font-bold text-xs active:scale-95 transition-all cursor-pointer"
                        title={`Visit live website: ${project.liveDemoUrl}`}
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Visit Website</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => handleCaseStudyClick(e, project)}
                        className="flex-1 min-h-[42px] flex items-center justify-center gap-1 px-3 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-xl text-xs font-semibold"
                      >
                        <span>Details</span>
                      </button>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Case Study Modal */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </motion.section>
  );
};
