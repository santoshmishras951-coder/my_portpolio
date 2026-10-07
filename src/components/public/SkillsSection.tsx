import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Skill } from '../../types/portfolio.js';
import { Code2, Server, Database, Terminal, Wrench, Cloud, Sparkles } from 'lucide-react';

interface SkillsSectionProps {
  skills: Skill[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories: string[] = [
    'All',
    'Frontend',
    'Backend',
    'Database',
    'Programming',
    'Tools',
    'Cloud'
  ];

  const filteredSkills = selectedCategory === 'All'
    ? skills
    : skills.filter(s => s.category === selectedCategory);

  const getCategoryConfig = (category: string) => {
    switch (category) {
      case 'Frontend':
        return {
          icon: <Code2 className="w-5 h-5 text-blue-500" />,
          badgeBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
          cardHover: 'hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-blue-500/10'
        };
      case 'Backend':
        return {
          icon: <Server className="w-5 h-5 text-emerald-500" />,
          badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
          cardHover: 'hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-emerald-500/10'
        };
      case 'Database':
        return {
          icon: <Database className="w-5 h-5 text-amber-500" />,
          badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
          cardHover: 'hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-amber-500/10'
        };
      case 'Programming':
        return {
          icon: <Terminal className="w-5 h-5 text-purple-500" />,
          badgeBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
          cardHover: 'hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-purple-500/10'
        };
      case 'Tools':
        return {
          icon: <Wrench className="w-5 h-5 text-cyan-500" />,
          badgeBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
          cardHover: 'hover:border-cyan-400 dark:hover:border-cyan-500 hover:shadow-cyan-500/10'
        };
      case 'Cloud':
        return {
          icon: <Cloud className="w-5 h-5 text-sky-500" />,
          badgeBg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
          cardHover: 'hover:border-sky-400 dark:hover:border-sky-500 hover:shadow-sky-500/10'
        };
      default:
        return {
          icon: <Code2 className="w-5 h-5 text-blue-500" />,
          badgeBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
          cardHover: 'hover:border-blue-400 dark:hover:border-blue-500'
        };
    }
  };

  return (
    <motion.section 
      id="skills" 
      className="py-14 sm:py-20 border-t border-neutral-200 dark:border-neutral-800/80 snap-start scroll-mt-18 sm:scroll-mt-20"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Colorful Section Header */}
        <div className="mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono font-bold text-emerald-500 uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>02 // CAPABILITIES & TOOLS</span>
          </div>

          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-300 bg-clip-text text-transparent">
              Technical Stack & Skills
            </span>
          </h3>

          <div className="h-1.5 w-24 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-full mt-3 shadow-sm shadow-emerald-500/20" />
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-2xl overflow-x-auto mb-6 sm:mb-8 scrollbar-none shadow-xs">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer min-h-[38px] active:scale-95 ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20 scale-[1.02]'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Colorful Skills Grid (All 'Intermediate' and No Years) */}
        {filteredSkills.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-neutral-300 dark:border-neutral-800 rounded-2xl text-xs text-neutral-500">
            No skills cataloged in this category yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSkills.map(skill => {
              const cfg = getCategoryConfig(skill.category);

              return (
                <div
                  key={skill.id}
                  className={`group p-5 sm:p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800/90 bg-white dark:bg-neutral-900/50 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between ${cfg.cardHover}`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/60 group-hover:scale-110 transition-transform">
                          {cfg.icon}
                        </div>
                        <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {skill.name}
                        </h4>
                      </div>

                      {/* Explicit Intermediate Badge (No years anywhere) */}
                      <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 dark:bg-blue-400/10 border border-blue-500/25 text-blue-600 dark:text-blue-400 font-mono text-[11px] font-bold shadow-xs">
                        Intermediate
                      </span>
                    </div>

                    {skill.description && (
                      <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed pt-1">
                        {skill.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-neutral-800/60 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                    <span>CATEGORY: {skill.category.toUpperCase()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </motion.section>
  );
};
