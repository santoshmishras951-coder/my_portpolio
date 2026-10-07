import React from 'react';
import { motion } from 'motion/react';
import { ResumeItem } from '../../types/portfolio.js';
import { FileText, CheckCircle, Calendar, ArrowRight, Sparkles } from 'lucide-react';

interface ResumeSectionProps {
  currentResume: ResumeItem | null;
  onOpenResume: () => void;
}

export const ResumeSection: React.FC<ResumeSectionProps> = ({ currentResume, onOpenResume }) => {
  return (
    <motion.section 
      id="resume" 
      className="py-14 sm:py-20 border-t border-neutral-200 dark:border-neutral-800/80 snap-start scroll-mt-18 sm:scroll-mt-20"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="p-6 sm:p-12 rounded-3xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-8">
          
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span>07 // CURRICULUM VITAE</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
              Resume & Technical Qualifications
            </h3>

            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-normal">
              Complete overview of academic qualifications, key software engineering projects, technical stack proficiencies, and direct contact channels.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
              <span className="flex items-center gap-1 font-semibold text-neutral-800 dark:text-neutral-200">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                <span>Santosh_Mishra_Resume.pdf</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums flex items-center gap-1 font-mono">
                <Calendar className="w-3 h-3" />
                <span>Updated 2026</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-blue-600 dark:text-blue-400 font-bold font-mono">B.Tech CSE (2024–2028)</span>
            </div>
          </div>

          {/* Action button to open resume viewer */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenResume}
              className="flex items-center justify-center gap-2.5 px-7 py-3.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/30 ring-1 ring-blue-400/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4 text-blue-100" />
              <span>View Full Resume</span>
              <ArrowRight className="w-4 h-4 text-blue-200" />
            </button>
          </div>

        </div>

      </div>
    </motion.section>
  );
};
