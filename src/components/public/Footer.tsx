import React from 'react';
import { ArrowUp, Shield } from 'lucide-react';
import { SocialLink } from '../../types/portfolio.js';
import { Signature } from './Signature.js';

interface FooterProps {
  name: string;
  socialLinks: SocialLink[];
  onOpenAdmin: () => void;
  onOpenPrivacy: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  name,
  socialLinks,
  onOpenAdmin,
  onOpenPrivacy
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800/80 bg-neutral-50 dark:bg-neutral-950/60 text-neutral-600 dark:text-neutral-400 py-12 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center sm:items-start space-y-2 text-center sm:text-left">
            {/* Attractive Signature above */}
            <div className="group relative inline-flex items-center">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-emerald-500/10 rounded-2xl blur-md opacity-70 group-hover:opacity-100 transition duration-300" />
              <div className="relative">
                <Signature size="lg" />
              </div>
            </div>

            {/* [Designer & Developer] attractive badge immediately below the sign */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100/90 dark:bg-neutral-900/90 border border-neutral-300/80 dark:border-neutral-800 shadow-xs">
              <span className="text-blue-500 dark:text-blue-400 font-black text-sm sm:text-base leading-none">[</span>
              <span 
                className="bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 dark:from-blue-400 dark:via-indigo-300 dark:to-cyan-300 bg-clip-text text-transparent text-xs sm:text-sm font-mono font-bold tracking-wider uppercase leading-none"
                style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                Designer &amp; Developer
              </span>
              <span className="text-blue-500 dark:text-blue-400 font-black text-sm sm:text-base leading-none">]</span>
            </div>

            <p className="text-xs text-neutral-500 dark:text-neutral-400 pt-0.5">
              Computer Science & Engineering Undergraduate · Odisha, India
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-medium">
            {socialLinks.filter(s => s.isVisible).map(link => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="hover:text-blue-600 dark:hover:text-white transition-colors"
              >
                {link.platform}
              </a>
            ))}
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-800 text-xs text-neutral-700 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-400 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900 transition-colors"
            aria-label="Back to top"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            © {new Date().getFullYear()} {name || 'SANTOSH MISHRA'}. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenPrivacy}
              className="hover:text-neutral-800 dark:hover:text-neutral-300 transition-colors"
            >
              Privacy Notice
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={onOpenAdmin}
              className="text-neutral-400/80 dark:text-neutral-600 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors text-[11px] font-medium cursor-pointer"
              title="Admin Portal"
            >
              Admin
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
