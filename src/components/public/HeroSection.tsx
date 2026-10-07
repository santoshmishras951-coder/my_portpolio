import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, Github, Linkedin, MessageCircle, MapPin, ArrowRight, FolderGit2, Send, FileText, Sparkles, Briefcase, GraduationCap, Award, Phone, CheckCircle2, Share2 } from 'lucide-react';
import { Profile, SocialLink } from '../../types/portfolio.js';
import { useToast } from '../../context/ToastContext.js';
import { Signature } from './Signature.js';

interface HeroSectionProps {
  profile: Profile;
  socialLinks: SocialLink[];
  onOpenResume: () => void;
  onOpenWhatsApp: () => void;
  onAvatarUpdated?: (newUrl: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  profile,
  socialLinks,
  onOpenResume,
  onOpenWhatsApp
}) => {
  const { success } = useToast();
  // Permanent lock on Santosh's exact photo (yy.jpeg)
  const fixedPortraitPhoto = '/src/assets/images/santosh_yy.jpeg';

  const [titleIndex, setTitleIndex] = useState(0);
  const titles = profile.typingTitles && profile.typingTitles.length > 0
    ? profile.typingTitles
    : ['Frontend Developer', 'Full-Stack Engineer', 'Software Engineering Student'];

  useEffect(() => {
    const timer = setInterval(() => {
      setTitleIndex(prev => (prev + 1) % titles.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [titles.length]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Santosh Mishra - Software Engineer Portfolio',
          text: 'Explore Santosh Mishra\'s developer portfolio, projects, and skills.',
          url: window.location.href,
        });
      } catch {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      success('Portfolio link copied to clipboard!');
    }
  };

  const storyHighlights = [
    { label: 'Projects', icon: <FolderGit2 className="w-5 h-5 text-purple-400" />, href: '#projects', isAction: false },
    { label: 'Skills', icon: <Sparkles className="w-5 h-5 text-emerald-400" />, href: '#skills', isAction: false },
    { label: 'Experience', icon: <Briefcase className="w-5 h-5 text-amber-400" />, href: '#experience', isAction: false },
    { label: 'Education', icon: <GraduationCap className="w-5 h-5 text-blue-400" />, href: '#education', isAction: false },
    { label: 'Honors', icon: <Award className="w-5 h-5 text-rose-400" />, href: '#achievements', isAction: false },
    { label: 'Resume', icon: <FileText className="w-5 h-5 text-cyan-400" />, action: onOpenResume, isAction: true },
    { label: 'WhatsApp', icon: <MessageCircle className="w-5 h-5 text-emerald-400" />, action: onOpenWhatsApp, isAction: true }
  ];

  return (
    <motion.section 
      id="home" 
      className="relative pt-4 pb-10 sm:pt-16 sm:pb-24 overflow-hidden snap-start scroll-mt-18 sm:scroll-mt-20"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      
      {/* Precision Grid Background Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />
      
      {/* Ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* ======================================================== */}
        {/* MOBILE INSTAGRAM / FACEBOOK APP-STYLE PROFILE CARD (md:hidden) */}
        {/* ======================================================== */}
        <div className="block md:hidden">
          <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-200/80 dark:border-neutral-800/80 rounded-3xl p-5 shadow-xl shadow-black/5 space-y-4">
            
            {/* Top Row: Story Ring Avatar + Profile Stats */}
            <div className="flex items-center justify-between gap-4">
              
              {/* Instagram Story Gradient Ring Avatar */}
              <div className="relative group shrink-0">
                {/* Authentic Instagram gradient story ring */}
                <div className="p-[3px] rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shadow-md shadow-rose-500/20 active:scale-95 transition-transform">
                  <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full overflow-hidden border-2 border-white dark:border-neutral-950 bg-neutral-950">
                    <img
                      src={fixedPortraitPhoto}
                      alt="Santosh Mishra"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = fixedPortraitPhoto;
                      }}
                    />
                  </div>
                </div>

                {/* Live Online Badge */}
                <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-neutral-950 flex items-center justify-center" title="Active & Available">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                </span>
              </div>

              {/* Instagram-style Profile Stats */}
              <div className="flex-1 flex items-center justify-around text-center py-1">
                <a href="#projects" className="flex flex-col items-center group cursor-pointer">
                  <span className="text-base sm:text-lg font-black text-neutral-900 dark:text-white group-hover:text-purple-500 transition-colors">15+</span>
                  <span className="text-[11px] text-neutral-500 font-medium">Projects</span>
                </a>
                <a href="#experience" className="flex flex-col items-center group cursor-pointer">
                  <span className="text-base sm:text-lg font-black text-neutral-900 dark:text-white group-hover:text-blue-500 transition-colors">3+</span>
                  <span className="text-[11px] text-neutral-500 font-medium">Years Exp</span>
                </a>
                <a href="#contact" className="flex flex-col items-center group cursor-pointer">
                  <span className="text-base sm:text-lg font-black text-neutral-900 dark:text-white group-hover:text-emerald-500 transition-colors">100%</span>
                  <span className="text-[11px] text-neutral-500 font-medium">Rating</span>
                </a>
              </div>

            </div>

            {/* Name & Handles */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Signature size="md" />
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  ENG
                </span>
              </div>

              <div className="text-xs font-mono font-bold text-neutral-500 dark:text-neutral-400">
                @santoshmishras951 • Software Engineer
              </div>

              {/* Dynamic typing title badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{titles[titleIndex]}</span>
              </div>
            </div>

            {/* Bio summary */}
            <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {profile.subheadline || profile.bio}
            </p>

            {/* Quick Badges: Location & Academics */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-neutral-600 dark:text-neutral-400">
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/60 font-medium">
                <MapPin className="w-3 h-3 text-blue-500" />
                <span>{profile.location}</span>
              </span>
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/60 font-medium">
                <GraduationCap className="w-3 h-3 text-purple-500" />
                <span>B.Tech CSE</span>
              </span>
            </div>

            {/* INSTAGRAM-STYLE ACTION BUTTONS (Thumb-friendly & tactile) */}
            <div className="pt-2 space-y-2">
              
              {/* Primary Row: Message / Contact + WhatsApp */}
              <div className="flex items-center gap-2">
                
                {/* 1. Message (Instagram Primary CTA) */}
                <a
                  href="#contact"
                  className="flex-1 min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 active:scale-95 transition-all text-center"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </a>

                {/* 2. WhatsApp (Direct Chat) */}
                <button
                  type="button"
                  onClick={onOpenWhatsApp}
                  className="flex-1 min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                  <span>WhatsApp</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                </button>

                {/* 3. Share Button */}
                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Share Portfolio"
                  className="min-h-[44px] px-3 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                  title="Share Portfolio"
                >
                  <Share2 className="w-4 h-4" />
                </button>

              </div>

              {/* Secondary Row: Projects + Resume */}
              <div className="flex items-center gap-2">
                <a
                  href="#projects"
                  className="flex-1 min-h-[40px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 font-bold text-xs active:scale-95 transition-all"
                >
                  <FolderGit2 className="w-3.5 h-3.5 text-purple-500" />
                  <span>Explore Projects</span>
                </a>

                <button
                  type="button"
                  onClick={onOpenResume}
                  className="flex-1 min-h-[40px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 font-bold text-xs active:scale-95 transition-all cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-500" />
                  <span>View Resume</span>
                </button>
              </div>

            </div>

          </div>

          {/* INSTAGRAM STORY HIGHLIGHTS BUBBLES CAROUSEL (Horizontal Scroll on Mobile) */}
          <div className="mt-4">
            <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-2 font-bold px-1">
              Story Highlights / Quick Jump:
            </div>

            <div className="flex items-center gap-3.5 overflow-x-auto pb-2 scrollbar-none px-1">
              {storyHighlights.map((item, idx) => {
                if (item.isAction) {
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={item.action}
                      className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer active:scale-90 transition-transform"
                    >
                      <div className="p-0.5 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shadow-sm">
                        <div className="w-14 h-14 rounded-full bg-white dark:bg-neutral-900 border-2 border-white dark:border-neutral-950 flex items-center justify-center group-hover:scale-105 transition-transform">
                          {item.icon}
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-neutral-700 dark:text-neutral-300 tracking-tight">
                        {item.label}
                      </span>
                    </button>
                  );
                }

                return (
                  <a
                    key={idx}
                    href={item.href}
                    className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer active:scale-90 transition-transform"
                  >
                    <div className="p-0.5 rounded-full bg-gradient-to-tr from-blue-500 via-indigo-500 to-cyan-500 shadow-sm">
                      <div className="w-14 h-14 rounded-full bg-white dark:bg-neutral-900 border-2 border-white dark:border-neutral-950 flex items-center justify-center group-hover:scale-105 transition-transform">
                        {item.icon}
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-neutral-700 dark:text-neutral-300 tracking-tight">
                      {item.label}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* DESKTOP 12-COLUMN PROFILE HERO (hidden md:grid) */}
        {/* ======================================================== */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Main Info Column */}
          <div className="md:col-span-7 flex flex-col items-start space-y-5 sm:space-y-6">
            
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="text-[11px] font-mono tracking-widest uppercase text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>SOFTWARE ENGINEERING PORTFOLIO</span>
              </div>

              {/* Heading */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                <span 
                  className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 dark:from-blue-400 dark:via-indigo-300 dark:to-cyan-300 bg-clip-text text-transparent"
                  style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                >
                  FULL-STACK WEB DEVELOPER
                </span>
              </h1>
            </div>

            {/* Signature */}
            <div className="py-1">
              <Signature size="sm" />
            </div>

            {/* ROTATING TYPING TITLE */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-100/80 dark:bg-neutral-900/80 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs sm:text-sm font-bold text-neutral-800 dark:text-neutral-200 font-mono">
                {titles[titleIndex]}
              </span>
            </div>

            {/* SUBHEADLINE / BIO SUMMARY */}
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed font-normal max-w-xl">
              {profile.subheadline || profile.bio}
            </p>

            {/* LOCATION & ACADEMIC STATUS */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-neutral-500 dark:text-neutral-400">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                <span>{profile.location}</span>
              </div>
              <span className="hidden sm:inline" aria-hidden="true">•</span>
              <div>{profile.currentStatus}</div>
            </div>

            {/* PRIMARY CALL-TO-ACTION BUTTONS */}
            <div className="w-full pt-2">
              <div className="flex flex-wrap items-center gap-3">
                
                {/* 1. Projects Button */}
                <a
                  href="#projects"
                  style={{ backgroundColor: 'var(--accent-color)' }}
                  className="group flex-1 flex items-center justify-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold text-white rounded-xl shadow-lg shadow-black/10 ring-1 ring-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <FolderGit2 className="w-4 h-4 text-white group-hover:rotate-6 transition-transform" />
                  <span>Projects</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white/80 group-hover:translate-x-1 transition-transform" />
                </a>

                {/* 2. Resume Button */}
                <button
                  type="button"
                  onClick={onOpenResume}
                  style={{ borderColor: 'var(--accent-border)' }}
                  className="group flex-1 flex items-center justify-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold rounded-xl shadow-xs border bg-neutral-100 hover:bg-neutral-200/70 dark:bg-neutral-900/80 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-100 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  title="View Official Resume"
                >
                  <FileText className="w-4 h-4 text-[var(--accent-color)] group-hover:-translate-y-0.5 transition-transform" />
                  <span>Resume</span>
                </button>

                {/* 3. Contact Me Button */}
                <a
                  href="#contact"
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold text-neutral-800 dark:text-neutral-100 bg-neutral-100 hover:bg-neutral-200/70 dark:bg-neutral-900/80 dark:hover:bg-neutral-800 border border-neutral-300 dark:border-neutral-800 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Send className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                  <span>Contact Me</span>
                </a>

              </div>
            </div>

            {/* SOCIAL LINKS */}
            <div className="w-full pt-3 border-t border-neutral-200 dark:border-neutral-800/80">
              <div className="text-xs font-mono uppercase tracking-wider text-neutral-500 mb-2 font-semibold">
                Direct Channels & Social Links:
              </div>

              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                
                {/* 1. GitHub */}
                <a
                  href="https://github.com/santoshmishras951-coder"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 text-neutral-800 dark:text-neutral-200 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500 dark:hover:border-blue-500 shadow-xs hover:shadow-md transition-all font-medium text-xs sm:text-sm active:scale-95"
                  title="View GitHub: santoshmishras951-coder"
                >
                  <Github className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                  <span>GitHub</span>
                </a>

                {/* 2. LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/santosh-mishra-3rd-year-499b86331/?isSelfProfile=true"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 text-neutral-800 dark:text-neutral-200 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500 dark:hover:border-blue-500 shadow-xs hover:shadow-md transition-all font-medium text-xs sm:text-sm active:scale-95"
                  title="View LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>LinkedIn</span>
                </a>

                {/* 3. Gmail */}
                <a
                  href="https://mail.google.com/mail/u/0/#inbox?compose=new"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 text-neutral-800 dark:text-neutral-200 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-400 shadow-xs hover:shadow-md transition-all font-medium text-xs sm:text-sm active:scale-95"
                  title="Compose message on Gmail"
                >
                  <Mail className="w-4 h-4 text-rose-500" />
                  <span>Gmail</span>
                </a>

                {/* 4. WhatsApp */}
                <button
                  type="button"
                  onClick={onOpenWhatsApp}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all font-semibold text-xs sm:text-sm active:scale-95 cursor-pointer"
                  title="Contact on WhatsApp (9668139559)"
                >
                  <MessageCircle className="w-4 h-4 fill-emerald-600 text-emerald-600 dark:fill-emerald-400 dark:text-emerald-400" />
                  <span>WhatsApp</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
                </button>

              </div>
            </div>

          </div>

          {/* LARGE SCREENS PORTRAIT COLUMN */}
          <div className="hidden md:flex md:col-span-5 justify-end">
            <div className="relative group max-w-sm lg:max-w-md w-full">
              
              {/* Vibrant ambient lighting halo */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-blue-600/40 via-indigo-600/30 to-cyan-500/40 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition duration-500" />
              
              {/* Large Image Container */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden border-2 border-neutral-300 dark:border-neutral-800 bg-neutral-950 shadow-2xl">
                <img
                  src={fixedPortraitPhoto}
                  alt="Profile Portrait"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center contrast-105 group-hover:scale-102 transition-all duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = fixedPortraitPhoto;
                  }}
                />
              </div>

              {/* Technical Caption underneath */}
              <div className="mt-3 flex items-center justify-between text-xs font-mono text-neutral-500 dark:text-neutral-400 px-1">
                <span className="font-bold text-neutral-800 dark:text-neutral-200">PORTFOLIO</span>
                <span className="text-blue-600 dark:text-blue-400">FULL-STACK ENGINEER</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </motion.section>
  );
};
