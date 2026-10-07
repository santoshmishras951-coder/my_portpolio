import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Achievement } from '../../types/portfolio.js';
import { Trophy, Award, ExternalLink, Calendar, Sparkles } from 'lucide-react';

interface AchievementsSectionProps {
  achievements: Achievement[];
}

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({ achievements }) => {
  const [activeCert, setActiveCert] = useState<Achievement | null>(null);

  return (
    <motion.section 
      id="achievements" 
      className="py-14 sm:py-20 border-t border-neutral-200 dark:border-neutral-800/80 snap-start scroll-mt-18 sm:scroll-mt-20"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>06 // HONORS & CERTIFICATIONS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
            Achievements & Certifications
          </h2>
        </div>

        {achievements.length === 0 ? (
          <div className="p-8 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-xl text-center text-xs text-neutral-500">
            No achievement records currently displayed.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map(item => (
              <div
                key={item.id}
                className="p-5 sm:p-6 rounded-2xl border border-neutral-300 dark:border-neutral-800/80 bg-white/90 dark:bg-neutral-900/40 shadow-sm flex flex-col justify-between space-y-4 hover:border-blue-400 dark:hover:border-neutral-700 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono text-neutral-500 font-semibold uppercase">{item.category}</span>
                    {item.date && (
                      <span className="text-xs text-neutral-500 tabular-nums flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3 text-blue-500" />
                        {item.date}
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                    {item.title}
                  </h4>

                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {item.organization}
                  </p>

                  {item.description && (
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800/40 flex items-center justify-between">
                  {item.verificationUrl ? (
                    <a
                      href={item.verificationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline transition-colors"
                    >
                      <span>View Credential</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-[11px] font-mono text-neutral-400">
                      HONOR RECORD
                    </span>
                  )}

                  {item.certificateImage && (
                    <button
                      onClick={() => setActiveCert(item)}
                      className="text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-white underline underline-offset-4 cursor-pointer"
                    >
                      View Certificate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Certificate Preview Modal */}
      {activeCert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
          onClick={() => setActiveCert(null)}
        >
          <div
            className="max-w-xl w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-2xl p-6 space-y-4 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{activeCert.title}</h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{activeCert.organization}</p>
              </div>
              <button
                onClick={() => setActiveCert(null)}
                className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white px-2.5 py-1 border border-neutral-300 dark:border-neutral-700 rounded-md cursor-pointer"
              >
                Close
              </button>
            </div>

            {activeCert.certificateImage && (
              <div className="aspect-4/3 rounded-lg overflow-hidden bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
                <img
                  src={activeCert.certificateImage}
                  alt={activeCert.title}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </motion.section>
  );
};
