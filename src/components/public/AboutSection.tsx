import React from 'react';
import { motion } from 'motion/react';
import { Profile } from '../../types/portfolio.js';
import { Terminal, Layers, Sparkles, Code, Cpu, Database, Globe, CheckCircle2 } from 'lucide-react';

interface AboutSectionProps {
  profile: Profile;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile }) => {
  const defaultInterests = [
    'Frontend Architecture',
    'Full-Stack Development',
    'Distributed Web Systems',
    'Database Engineering',
    'UI/UX Design Systems',
    'Open Source Projects'
  ];

  const interestsList = profile.interests && profile.interests.length > 0
    ? profile.interests
    : defaultInterests;

  return (
    <motion.section 
      id="about" 
      className="py-14 sm:py-20 border-t border-neutral-200 dark:border-neutral-800/80 snap-start scroll-mt-18 sm:scroll-mt-20"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Colorful Section Header */}
        <div className="max-w-3xl mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-xs font-mono font-bold text-rose-500 uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>01 // PROFILE & BACKGROUND</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-400 dark:from-rose-400 dark:via-orange-400 dark:to-amber-300 bg-clip-text text-transparent">
              ABOUT ME
            </span>
          </h2>

          <div className="h-1.5 w-24 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-400 rounded-full mt-3 shadow-sm shadow-rose-500/20" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Main Prose - Medium Size, User Attractive & High Contrast */}
          <div className="lg:col-span-7 space-y-6 text-neutral-800 dark:text-neutral-200 text-base sm:text-lg leading-relaxed font-normal">
            <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
              <p>
                {profile.bio || `I am an undergraduate student pursuing my Bachelor of Technology in Computer Science & Engineering in Odisha, India. My journey into software development is driven by a deep curiosity about how modern distributed systems and responsive user interfaces fit together.`}
              </p>

              <p>
                Rather than merely studying theory or copying templates, I focus on building and shipping real-world software. Whether architecting database schemas for healthcare clinic systems or creating responsive student web portals, I prioritize clean component modularity, strict type safety, and real practical user value.
              </p>
            </div>

            {/* HIGHLIGHTED ENGINEERING PHILOSOPHY */}
            <div className="relative group overflow-hidden rounded-2xl p-6 sm:p-7 bg-gradient-to-br from-blue-600/10 via-indigo-600/5 to-cyan-500/10 border-2 border-blue-500/40 dark:border-blue-400/40 shadow-lg shadow-blue-500/5 transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold font-mono text-blue-600 dark:text-blue-400 mb-3">
                <div className="p-1.5 rounded-lg bg-blue-600 text-white shadow-xs">
                  <Terminal className="w-4 h-4" />
                </div>
                <span className="tracking-wider uppercase">HIGHLIGHT: ENGINEERING PHILOSOPHY</span>
              </div>

              <blockquote className="text-base sm:text-lg font-medium text-neutral-900 dark:text-neutral-100 italic leading-relaxed border-l-4 border-blue-600 dark:border-blue-400 pl-4 py-1">
                "{profile.philosophy || 'Write clean code, understand the core mechanics before reaching for abstractions, and design user interfaces that are fast, accessible, and respect user attention.'}"
              </blockquote>
            </div>
          </div>

          {/* Right Column: HIGHLIGHTED TECHNICAL INTERESTS */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-white to-blue-50/30 dark:from-neutral-900/60 dark:to-neutral-900/30 border-2 border-indigo-200 dark:border-indigo-900/50 shadow-md space-y-5">
              
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xs">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                    Technical Interests
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Core areas of active focus and exploration
                  </p>
                </div>
              </div>

              {/* Colorful Highlighted Interest Pills */}
              <div className="flex flex-wrap gap-2.5 pt-1">
                {interestsList.map((interest, idx) => {
                  const colors = [
                    'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300',
                    'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300',
                    'bg-cyan-50 dark:bg-cyan-950/50 border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300',
                    'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300',
                    'bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300',
                    'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
                  ];
                  const colorClass = colors[idx % colors.length];

                  return (
                    <div
                      key={interest}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border font-semibold text-xs sm:text-sm shadow-xs hover:scale-105 transition-transform ${colorClass}`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 opacity-80" />
                      <span>{interest}</span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800/60 flex items-center justify-between text-xs font-mono text-neutral-500">
                <span>FOCUS: Production Web Tech</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">ACTIVE</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </motion.section>
  );
};
