import React from 'react';
import { X, MessageCircle, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber?: string;
  name?: string;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  phoneNumber = '9668139559',
  name = 'SANTOSH MISHRA'
}) => {
  if (!isOpen) return null;

  // Ensure exact valid Indian WhatsApp number: 919668139559
  let digits = (phoneNumber || '9668139559').replace(/[^0-9]/g, '');
  if (digits.startsWith('91') && digits.length === 12) {
    // already starts with 91 and is 12 digits
  } else if (digits.length === 10) {
    digits = `91${digits}`;
  } else {
    digits = '919668139559';
  }

  const formattedNumber = '+91 9668139559';
  const whatsappUrl = `https://wa.me/${digits}?text=Hi%20Santosh,%20I%20visited%20your%20portfolio%20website%20and%20would%20like%20to%20connect!`;

  const handleOpenWhatsApp = () => {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md rounded-3xl border border-neutral-300 dark:border-neutral-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 bg-white/95 dark:bg-neutral-950/95"
        role="dialog"
        aria-modal="true"
        aria-labelledby="whatsapp-modal-title"
      >
        {/* BACKGROUND IMAGE LAYER: Santosh's formal portrait photo (yy.jpeg) blurred and softly visible */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <img
            src="/src/assets/images/santosh_formal_suit_portrait_1791041720230.jpg"
            alt="Santosh Mishra Portrait"
            className="w-full h-full object-cover object-top scale-110 filter blur-[6px] opacity-20 dark:opacity-25 transition-transform"
          />
          {/* Subtle gradient vignette to guarantee 100% crystal text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/90 to-white/95 dark:from-neutral-950/80 dark:via-neutral-950/90 dark:to-neutral-950/95" />
        </div>

        {/* WhatsApp Brand Header Banner */}
        <div className="relative z-10 bg-gradient-to-r from-emerald-600/90 to-teal-600/90 backdrop-blur-md px-6 py-5 text-white flex items-center justify-between border-b border-white/10 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-xs ring-2 ring-white/40 shadow-xs">
              <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
            </div>
            <div>
              <h3 id="whatsapp-modal-title" className="text-base font-bold text-white leading-tight">
                WhatsApp Direct Chat
              </h3>
              <p className="text-xs text-emerald-100 font-medium">
                Connect with Santosh Mishra
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="relative z-10 p-6 space-y-5">
          <div className="p-4 rounded-2xl bg-white/80 dark:bg-neutral-900/80 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs backdrop-blur-sm space-y-2">
            <div className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-mono">
              DIRECT DEVELOPER CHANNEL
            </div>
            <div className="text-lg font-black tracking-tight text-neutral-900 dark:text-white">
              {name}
            </div>
            <div className="flex items-center gap-2 text-sm font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              <span>{formattedNumber}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-sans font-bold">
                Online & Available
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-normal">
            Click the button below to start a direct WhatsApp conversation with <strong>{name}</strong> for internships, project discussions, or inquiries.
          </p>

          <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Opens official WhatsApp Web / Mobile directly</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-3 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white rounded-xl border border-neutral-300 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Close
            </button>

            <button
              onClick={handleOpenWhatsApp}
              className="w-full flex-1 flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-600/30 ring-1 ring-emerald-400/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Start WhatsApp Chat</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
