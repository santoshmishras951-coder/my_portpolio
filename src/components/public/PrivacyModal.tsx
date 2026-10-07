import React, { useEffect } from 'react';
import { X, ShieldCheck } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  customContent?: string;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose, customContent }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative max-w-xl w-full bg-neutral-950 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-5 max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2 font-bold text-sm text-neutral-100">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <span>Privacy Policy & Data Handling</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="text-xs text-neutral-300 leading-relaxed space-y-4">
          <p>
            {customContent || `This website values your privacy. We collect only minimal information required for direct professional communication between prospective recruiters, collaborators, and Santosh Mishra.`}
          </p>

          <div className="space-y-2">
            <h5 className="font-semibold text-neutral-100">1. Contact Data Collected</h5>
            <p className="text-neutral-400">
              When you submit the contact form, we store your name, email, optional phone number, optional organization, subject, and message. This information is stored securely in our private database and is never shared, rented, or sold to third parties.
            </p>
          </div>

          <div className="space-y-2">
            <h5 className="font-semibold text-neutral-100">2. Cookies & Analytics</h5>
            <p className="text-neutral-400">
              This site does not use invasive third-party cross-site tracking cookies or advertising pixels. Local storage is used strictly for storing your chosen theme preference (dark/light/system) and private admin authentication tokens when logged in.
            </p>
          </div>

          <div className="space-y-2">
            <h5 className="font-semibold text-neutral-100">3. Rights & Inquiries</h5>
            <p className="text-neutral-400">
              If you have submitted a message and wish to request removal of your submission record from our database, please contact santoshmishras951@gmail.com and we will delete it promptly.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-neutral-950 bg-neutral-100 hover:bg-white rounded-lg transition-colors"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
