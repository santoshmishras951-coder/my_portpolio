import React from 'react';
import { motion } from 'motion/react';
import { Education } from '../../types/portfolio.js';
import { GraduationCap, Award, Calendar } from 'lucide-react';

interface EducationSectionProps {
  education: Education[];
}

export const EducationSection: React.FC<EducationSectionProps> = ({ education }) => {
  return (
    <motion.section 
      id="education" 
      className="py-14 sm:py-20 border-t border-neutral-200 dark:border-neutral-800/80 snap-start scroll-mt-18 sm:scroll-mt-20"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-8 sm:mb-12">
          <div className="text-[11px] font-mono uppercase tracking-widest text-blue-600 dark:text-blue-400 font-semibold mb-1">
            05 // ACADEMICS
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
            Education
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {education.map(edu => (
            <div
              key={edu.id}
              className="p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-neutral-300 dark:border-neutral-800/80 bg-white/90 dark:bg-neutral-900/40 shadow-sm flex flex-col justify-between space-y-4 hover:border-neutral-400 dark:hover:border-neutral-700 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-neutral-500 tabular-nums font-mono">
                      <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>{edu.startYear} — {edu.endYear}</span>
                    </div>

                    <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                      {edu.degree}
                    </h4>

                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                      {edu.institution}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/60 text-neutral-700 dark:text-neutral-300">
                    <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>

                {edu.currentStatus && (
                  <div className="text-xs text-neutral-600 dark:text-neutral-400">
                    <span className="font-semibold text-neutral-800 dark:text-neutral-300">Status:</span> {edu.currentStatus}
                  </div>
                )}

                {edu.grade && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                    <Award className="w-3.5 h-3.5" />
                    <span>Grade / Evaluation: <strong className="font-semibold tabular-nums">{edu.grade}</strong></span>
                  </div>
                )}

                {edu.description && (
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed pt-1">
                    {edu.description}
                  </p>
                )}
              </div>

              {edu.field && (
                <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800/40 text-[11px] text-neutral-500 font-mono">
                  FOCUS_AREA: {edu.field}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </motion.section>
  );
};
