import React from 'react';
import { motion } from 'motion/react';
import { Experience } from '../../types/portfolio.js';
import { Briefcase, Calendar, MapPin, CheckCircle } from 'lucide-react';

interface ExperienceSectionProps {
  experience: Experience[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experience }) => {
  return (
    <motion.section 
      id="experience" 
      className="py-14 sm:py-20 border-t border-neutral-200 dark:border-neutral-800/80 snap-start scroll-mt-18 sm:scroll-mt-20"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-mono font-bold text-amber-500 uppercase tracking-widest mb-3">
            <span>04 // PRACTICAL EXPERIENCE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 dark:from-amber-400 dark:via-yellow-300 dark:to-orange-400 bg-clip-text text-transparent">
              Practical Work & Roles
            </span>
          </h2>
          <div className="h-1.5 w-24 bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 rounded-full mt-3 shadow-sm shadow-amber-500/20" />
        </div>

        {experience.length === 0 ? (
          <div className="p-8 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-xl text-center text-xs text-neutral-500">
            No professional experience records currently posted.
          </div>
        ) : (
          <div className="relative pl-6 sm:pl-8 border-l border-neutral-300 dark:border-neutral-800 space-y-12">
            {experience.map(item => (
              <div key={item.id} className="relative group">
                
                {/* Timeline node */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-neutral-950 bg-neutral-400 dark:bg-neutral-700 group-hover:bg-blue-600 transition-colors" />

                <div className="space-y-3">
                  
                  {/* Position & Company */}
                  <div>
                    <h4 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                      {item.position}
                    </h4>
                    
                    <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                      <span className="font-semibold text-neutral-900 dark:text-neutral-200">{item.company}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.employmentType}</span>
                      {item.location && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-neutral-500" />
                            {item.location}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Dates unboxed metadata */}
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500 tabular-nums font-mono">
                    <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>{item.startDate} — {item.currentlyWorking ? 'Present' : item.endDate}</span>
                  </div>

                  {/* Description */}
                  {item.description && (
                    <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed max-w-3xl">
                      {item.description}
                    </p>
                  )}

                  {/* Responsibilities */}
                  {item.responsibilities && item.responsibilities.length > 0 && (
                    <ul className="space-y-1.5 pt-1 text-xs text-neutral-600 dark:text-neutral-400 max-w-3xl">
                      {item.responsibilities.map((resp, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Technologies */}
                  {item.technologies && item.technologies.length > 0 && (
                    <div className="pt-2 flex flex-wrap items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400 font-mono">
                      <span className="text-[11px] text-neutral-500 font-sans">Used:</span>
                      {item.technologies.map(t => (
                        <span key={t} className="after:content-['·'] last:after:content-none after:ml-1.5 text-neutral-700 dark:text-neutral-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </motion.section>
  );
};
