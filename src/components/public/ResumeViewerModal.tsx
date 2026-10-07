import React from 'react';
import { X, FileText, CheckCircle, MapPin, Mail, Phone, ExternalLink, Calendar, GraduationCap, Code2, Briefcase } from 'lucide-react';
import { Profile, Skill, Project, Experience, Education } from '../../types/portfolio.js';

interface ResumeViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
  skills: Skill[];
  projects: Project[];
  experience: Experience[];
  education: Education[];
}

export const ResumeViewerModal: React.FC<ResumeViewerModalProps> = ({
  isOpen,
  onClose,
  profile,
  skills,
  projects,
  experience,
  education
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl h-[92vh] flex flex-col rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="resume-doc-title"
      >
        {/* Document Header Bar */}
        <div className="px-5 py-3.5 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div id="resume-doc-title" className="text-sm font-bold text-neutral-900 dark:text-white font-mono flex items-center gap-2">
                <span>kaka.pdf</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-sans font-semibold">
                  Official Resume Document
                </span>
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                Santosh Mishra — Software Engineering Undergraduate
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Close Resume Viewer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Printable Document Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-neutral-200/60 dark:bg-neutral-950/80">
          <div className="max-w-3xl mx-auto bg-white dark:bg-neutral-900 p-6 sm:p-10 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 space-y-8">
            
            {/* Document Header */}
            <div className="border-b border-neutral-200 dark:border-neutral-800 pb-6 text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-950 dark:text-white">
                  SANTOSH MISHRA
                </h1>
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-1">
                  Computer Science & Engineering Undergraduate (3rd Year)
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  FULL-STACK WEB DEVELOPER & SOFTWARE SYSTEMS ENTHUSIAST
                </p>
              </div>

              {/* Contact meta */}
              <div className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1 sm:text-right font-mono">
                <div className="flex items-center sm:justify-end gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-500" />
                  <span>santoshmishras951@gmail.com</span>
                </div>
                <div className="flex items-center sm:justify-end gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-500" />
                  <span>+91 9668139559</span>
                </div>
                <div className="flex items-center sm:justify-end gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Odisha, India</span>
                </div>
              </div>
            </div>

            {/* Profile Summary */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 font-mono border-b border-neutral-200 dark:border-neutral-800 pb-1">
                Executive Profile
              </h2>
              <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {profile.bio || 'Third-year Computer Science & Engineering undergraduate with hands-on experience developing production-grade web applications with modern React, TypeScript, Node.js, and SQL/NoSQL databases. Passionate about performant, accessible UI engineering, clean systems architecture, and solving regional community problems through technology.'}
              </p>
            </div>

            {/* Education */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 font-mono border-b border-neutral-200 dark:border-neutral-800 pb-1 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4" />
                <span>Education</span>
              </h2>
              <div className="space-y-4">
                {education.map(edu => (
                  <div key={edu.id} className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
                    <div>
                      <div className="text-sm font-bold text-neutral-900 dark:text-white">
                        {edu.degree}
                      </div>
                      <div className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                        {edu.institution}
                      </div>
                      {edu.grade && (
                        <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                          Grade / CGPA: {edu.grade}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-neutral-500 font-mono">
                      {edu.startYear} — {edu.endYear}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Skills */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 font-mono border-b border-neutral-200 dark:border-neutral-800 pb-1 flex items-center gap-1.5">
                <Code2 className="w-4 h-4" />
                <span>Technical Stack</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="font-semibold text-neutral-900 dark:text-neutral-200">Frontend: </span>
                  <span className="text-neutral-600 dark:text-neutral-400">React, TypeScript, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS, Responsive UI</span>
                </div>
                <div>
                  <span className="font-semibold text-neutral-900 dark:text-neutral-200">Backend: </span>
                  <span className="text-neutral-600 dark:text-neutral-400">Node.js, Express.js, RESTful APIs, JWT Authentication, Server Middleware</span>
                </div>
                <div>
                  <span className="font-semibold text-neutral-900 dark:text-neutral-200">Databases: </span>
                  <span className="text-neutral-600 dark:text-neutral-400">PostgreSQL, SQL queries, Relational Schema Design, MongoDB</span>
                </div>
                <div>
                  <span className="font-semibold text-neutral-900 dark:text-neutral-200">Tools & Methodologies: </span>
                  <span className="text-neutral-600 dark:text-neutral-400">Git, GitHub, Vite, Postman, Linux CLI, Agile Scrum</span>
                </div>
              </div>
            </div>

            {/* Featured Projects */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 font-mono border-b border-neutral-200 dark:border-neutral-800 pb-1">
                Featured Engineering Projects
              </h2>
              <div className="space-y-4">
                {projects.slice(0, 3).map(proj => (
                  <div key={proj.id} className="space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                      <div className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                        <span>{proj.title}</span>
                        {proj.liveDemoUrl && (
                          <span className="text-[10px] text-blue-500 font-mono underline">
                            [Live Demo]
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-neutral-500">
                        {proj.technologies.slice(0, 3).join(' · ')}
                      </div>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                      {proj.shortDescription}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience / Roles */}
            {experience.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 font-mono border-b border-neutral-200 dark:border-neutral-800 pb-1 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" />
                  <span>Practical Experience & Roles</span>
                </h2>
                <div className="space-y-4">
                  {experience.map(exp => (
                    <div key={exp.id} className="space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <div className="text-sm font-bold text-neutral-900 dark:text-white">
                          {exp.position} — <span className="text-neutral-600 dark:text-neutral-300 font-medium">{exp.company}</span>
                        </div>
                        <div className="text-xs text-neutral-500 font-mono">
                          {exp.startDate} — {exp.endDate || 'Present'}
                        </div>
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer toolbar without download option */}
        <div className="px-5 py-3 bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500 shrink-0">
          <span>Viewing kaka.pdf in browser viewer</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 transition-colors"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
