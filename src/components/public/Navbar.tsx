import React, { useState, useEffect, useRef } from 'react';
import { X, Shield, ArrowRight, User, Code2, FolderGit2, Briefcase, GraduationCap, Award, FileText, Send, Home, MessageCircle, Play, Pause } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle.js';

interface NavbarProps {
  onOpenAdmin: () => void;
  onOpenResume?: () => void;
  onOpenWhatsApp?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAdmin,
  onOpenResume,
  onOpenWhatsApp
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('home');
  const scrollAnimRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const scrollPos = window.scrollY + 160;
      const sectionIds = ['contact', 'resume', 'achievements', 'education', 'experience', 'projects', 'skills', 'about', 'home'];

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && scrollPos >= el.offsetTop) {
          setActiveSection(id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleAutoScroll = () => {
    setIsAutoScrolling(prev => !prev);
  };

  const navLinks = [
    {
      id: 'about',
      label: 'About',
      activeColor: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/30'
    },
    {
      id: 'skills',
      label: 'Skills',
      activeColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'
    },
    {
      id: 'projects',
      label: 'Projects',
      activeColor: 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border border-purple-500/30'
    },
    {
      id: 'experience',
      label: 'Experience',
      activeColor: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/30'
    },
    {
      id: 'education',
      label: 'Education',
      activeColor: 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/30'
    },
    {
      id: 'contact',
      label: 'Contact',
      activeColor: 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border border-cyan-500/30'
    }
  ];

  useEffect(() => {
    if (!isAutoScrolling) {
      if (scrollAnimRef.current) cancelAnimationFrame(scrollAnimRef.current);
      return;
    }

    const step = () => {
      window.scrollBy(0, 1.8);

      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 10) {
        setIsAutoScrolling(false);
        return;
      }

      scrollAnimRef.current = requestAnimationFrame(step);
    };

    scrollAnimRef.current = requestAnimationFrame(step);

    return () => {
      if (scrollAnimRef.current) cancelAnimationFrame(scrollAnimRef.current);
    };
  }, [isAutoScrolling]);

  const allSections = [
    { id: '#home', number: '00', label: 'Home Overview', icon: <Home className="w-4 h-4 text-blue-500" />, desc: 'Intro, titles & action buttons' },
    { id: '#about', number: '01', label: 'About Me', icon: <User className="w-4 h-4 text-cyan-500" />, desc: 'Background, philosophy & interests' },
    { id: '#skills', number: '02', label: 'Technical Stack', icon: <Code2 className="w-4 h-4 text-indigo-500" />, desc: 'Core frameworks, DBs & tools' },
    { id: '#projects', number: '03', label: 'Featured Projects', icon: <FolderGit2 className="w-4 h-4 text-emerald-500" />, desc: 'Production-ready web applications' },
    { id: '#experience', number: '04', label: 'Practical Experience', icon: <Briefcase className="w-4 h-4 text-amber-500" />, desc: 'Work history & engineering roles' },
    { id: '#education', number: '05', label: 'Academics & Degrees', icon: <GraduationCap className="w-4 h-4 text-purple-500" />, desc: 'B.Tech CSE & education history' },
    { id: '#achievements', number: '06', label: 'Honors & Certifications', icon: <Award className="w-4 h-4 text-rose-500" />, desc: 'Verified credentials & achievements' },
    { id: '#resume', number: '07', label: 'Curriculum Vitae', icon: <FileText className="w-4 h-4 text-blue-500" />, desc: 'Interactive resume & qualifications' },
    { id: '#contact', number: '08', label: 'Contact & Messaging', icon: <Send className="w-4 h-4 text-emerald-500" />, desc: 'Direct email, WhatsApp & inquiries' },
  ];

  const handleSectionClick = (id: string) => {
    setDrawerOpen(false);
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          isScrolled
            ? 'bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800/80 shadow-xs'
            : 'bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xs border-b border-neutral-200/50 dark:border-neutral-800/40'
        }`}
      >
        <div className="max-w-6xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* THREE STRAIGHT LINES AT LEFT + BRAND PROFILE BADGE */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-neutral-300 dark:border-neutral-800 bg-neutral-100/90 dark:bg-neutral-900/90 text-neutral-800 dark:text-neutral-200 hover:text-blue-600 dark:hover:text-white hover:border-blue-500 dark:hover:border-blue-500 shadow-xs hover:shadow-md transition-all cursor-pointer group active:scale-95 shrink-0"
              aria-label="Open all sections menu"
              title="Click to view all sections"
            >
              {/* Three Straight Horizontal Lines */}
              <div className="flex flex-col gap-1 justify-center items-center py-0.5">
                <span className="w-4 h-0.5 bg-neutral-800 dark:bg-neutral-200 group-hover:bg-blue-600 dark:group-hover:bg-blue-400 transition-colors rounded-full" />
                <span className="w-4 h-0.5 bg-neutral-800 dark:bg-neutral-200 group-hover:bg-blue-600 dark:group-hover:bg-blue-400 transition-colors rounded-full" />
                <span className="w-4 h-0.5 bg-neutral-800 dark:bg-neutral-200 group-hover:bg-blue-600 dark:group-hover:bg-blue-400 transition-colors rounded-full" />
              </div>
              <span className="text-[11px] sm:text-xs font-mono font-bold tracking-wider text-neutral-800 dark:text-neutral-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                MENU
              </span>
            </button>

            {/* Brand / Profile Header */}
            <a
              href="#home"
              className="flex items-center gap-2 group cursor-pointer shrink-0"
              title="Santosh Mishra"
            >
              <div className="p-0.5 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shadow-xs">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-neutral-900 border border-white dark:border-neutral-900">
                  <img
                    src="/src/assets/images/santosh_yy.jpeg"
                    alt="Santosh"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-xs sm:text-sm font-black text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight whitespace-nowrap">
                  Santosh
                </span>
              </div>
            </a>
          </div>

          {/* Navigation Links on desktop - with ample margin, pill padding & color changes during scroll */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2.5 ml-6 lg:ml-10">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  className={`px-3 py-1.5 rounded-xl text-xs lg:text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? `${link.activeColor} shadow-xs font-bold scale-[1.03]`
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Right Controls: Quick WhatsApp (mobile) + Auto Scroll (AS) + Theme Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Quick WhatsApp Pill on Mobile */}
            {onOpenWhatsApp && (
              <button
                type="button"
                onClick={onOpenWhatsApp}
                className="flex md:hidden items-center justify-center p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 transition-all active:scale-95 cursor-pointer"
                title="Quick WhatsApp Chat"
                aria-label="Chat on WhatsApp"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
              </button>
            )}

            {/* Auto Scroll (AS) Button */}
            <button
              type="button"
              onClick={toggleAutoScroll}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl border text-[11px] sm:text-xs font-mono font-bold transition-all shadow-xs cursor-pointer active:scale-95 whitespace-nowrap shrink-0 ${
                isAutoScrolling
                  ? 'bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 text-white border-rose-400 ring-2 ring-rose-500/40 animate-pulse'
                  : 'bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 hover:border-blue-500'
              }`}
              title={isAutoScrolling ? 'Pause Auto Scroll' : 'Start Auto Scroll (AS)'}
            >
              {isAutoScrolling ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-white" />
                  <span>AS: ON</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-blue-500" />
                  <span className="hidden sm:inline">Auto Scroll (AS)</span>
                  <span className="sm:hidden">AS</span>
                </>
              )}
            </button>

            <ThemeToggle />
          </div>

        </div>
      </header>

      {/* FULL SECTIONS DRAWER (Triggered by 3 straight lines at left) */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex animate-in fade-in duration-200">
          
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Sidebar Content */}
          <div className="relative w-full max-w-sm sm:max-w-md bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-250">
            
            {/* Drawer Header */}
            <div className="p-5 sm:p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400">
                  <div className="flex flex-col gap-0.5 w-3.5 items-center">
                    <span className="w-3.5 h-0.5 bg-current rounded-full" />
                    <span className="w-3.5 h-0.5 bg-current rounded-full" />
                    <span className="w-3.5 h-0.5 bg-current rounded-full" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-mono uppercase tracking-wider">
                    ALL SECTIONS DIRECTORY
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Jump to any section on the page
                  </p>
                </div>
              </div>

              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 rounded-xl text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sections Scrollable List */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-1.5 flex-1 scrollbar-thin">
              {allSections.map(sec => (
                <button
                  key={sec.id}
                  onClick={() => handleSectionClick(sec.id)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-neutral-200 dark:hover:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900/70 text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 group-hover:scale-110 transition-transform">
                      {sec.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400">
                          {sec.number}
                        </span>
                        <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                          {sec.label}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 truncate">
                        {sec.desc}
                      </p>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                </button>
              ))}
            </div>

          </div>
        </div>
      )}
    </>
  );
};
