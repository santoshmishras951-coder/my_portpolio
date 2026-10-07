import React, { useState, useEffect } from 'react';
import { Home, FolderGit2, Sparkles, FileText, Send, MessageCircle } from 'lucide-react';

interface MobileBottomNavProps {
  onOpenResume: () => void;
  onOpenWhatsApp: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onOpenResume,
  onOpenWhatsApp
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'projects' | 'skills' | 'resume' | 'contact'>('home');

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      const sections = [
        { id: 'contact', name: 'contact' as const },
        { id: 'resume', name: 'resume' as const },
        { id: 'skills', name: 'skills' as const },
        { id: 'projects', name: 'projects' as const },
        { id: 'home', name: 'home' as const }
      ];

      for (const sec of sections) {
        const el = document.getElementById(sec.id);
        if (el) {
          const top = el.offsetTop - 200;
          if (scrollY >= top) {
            setActiveTab(sec.name);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string, tabName: 'home' | 'projects' | 'skills' | 'resume' | 'contact') => {
    setActiveTab(tabName);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-xl border-t border-neutral-200/80 dark:border-neutral-800/80 shadow-[0_-8px_24px_rgba(0,0,0,0.12)] px-2 pt-1 pb-safe"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 8px), 8px)' }}
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        
        {/* 1. HOME */}
        <button
          type="button"
          onClick={() => scrollToSection('home', 'home')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer active:scale-95 ${
            activeTab === 'home'
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
          }`}
        >
          <div className="relative">
            <Home className="w-5 h-5 transition-transform" />
            {activeTab === 'home' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-600 dark:bg-blue-400" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Home</span>
        </button>

        {/* 2. PROJECTS (Feed/Grid like Insta) */}
        <button
          type="button"
          onClick={() => scrollToSection('projects', 'projects')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer active:scale-95 ${
            activeTab === 'projects'
              ? 'text-purple-600 dark:text-purple-400 font-bold'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
          }`}
        >
          <div className="relative">
            <FolderGit2 className="w-5 h-5 transition-transform" />
            {activeTab === 'projects' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-purple-600 dark:bg-purple-400" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Projects</span>
        </button>

        {/* 3. SKILLS / TECH */}
        <button
          type="button"
          onClick={() => scrollToSection('skills', 'skills')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer active:scale-95 ${
            activeTab === 'skills'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
          }`}
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 transition-transform" />
            {activeTab === 'skills' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-600 dark:bg-emerald-400" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Skills</span>
        </button>

        {/* 4. RESUME CV */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('resume');
            onOpenResume();
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer active:scale-95 ${
            activeTab === 'resume'
              ? 'text-amber-600 dark:text-amber-400 font-bold'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
          }`}
        >
          <div className="relative">
            <FileText className="w-5 h-5 transition-transform" />
            {activeTab === 'resume' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-600 dark:bg-amber-400" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Resume</span>
        </button>

        {/* 5. CONTACT / DM (Instagram DM style) */}
        <button
          type="button"
          onClick={() => scrollToSection('contact', 'contact')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer active:scale-95 ${
            activeTab === 'contact'
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
          }`}
        >
          <div className="relative">
            <Send className="w-5 h-5 transition-transform" />
            {/* Unread message green status dot like Instagram DM */}
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-neutral-950" />
            {activeTab === 'contact' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-600 dark:bg-blue-400" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Contact</span>
        </button>

      </div>
    </nav>
  );
};
