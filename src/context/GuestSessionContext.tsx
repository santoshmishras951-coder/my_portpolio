import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { saveUserProfileToFirestore } from '../services/firebaseClient.js';
import { useToast } from './ToastContext.js';
import { Clock, Phone, AlertCircle, Lock, ArrowRight, ShieldCheck, X } from 'lucide-react';

export interface GuestSession {
  phone: string;
  loginTime: number;
  expiresAt: number;
  uid: string;
}

interface GuestSessionContextType {
  guestSession: GuestSession | null;
  timeLeft: number;
  isExpired: boolean;
  showPhoneModal: boolean;
  openPhoneModal: () => void;
  closePhoneModal: () => void;
  startGuestSession: (phone: string) => Promise<void>;
  logoutGuest: () => void;
  resetExpiredState: () => void;
  openPermanentAuth: () => void;
}

const GuestSessionContext = createContext<GuestSessionContextType | undefined>(undefined);

const GUEST_STORAGE_KEY = 'portfolio_guest_session';
const GUEST_DURATION_MS = 60 * 60 * 1000; // 1 hour in milliseconds

export const GuestSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { success, error } = useToast();
  const [guestSession, setGuestSession] = useState<GuestSession | null>(() => {
    try {
      const stored = localStorage.getItem(GUEST_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as GuestSession;
        if (Date.now() < parsed.expiresAt) {
          return parsed;
        } else {
          localStorage.removeItem(GUEST_STORAGE_KEY);
        }
      }
    } catch {
      localStorage.removeItem(GUEST_STORAGE_KEY);
    }
    return null;
  });

  const [timeLeft, setTimeLeft] = useState<number>(() => {
    if (guestSession) {
      return Math.max(0, Math.floor((guestSession.expiresAt - Date.now()) / 1000));
    }
    return 0;
  });

  const [isExpired, setIsExpired] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(GUEST_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as GuestSession;
        if (Date.now() >= parsed.expiresAt) {
          return true;
        }
      }
    } catch {}
    return false;
  });

  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [phoneNumberInput, setPhoneNumberInput] = useState('');
  const [isStartingGuest, setIsStartingGuest] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (!guestSession) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((guestSession.expiresAt - now) / 1000));
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        localStorage.removeItem(GUEST_STORAGE_KEY);
        setGuestSession(null);
        setIsExpired(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [guestSession]);

  const startGuestSession = useCallback(async (phone: string) => {
    const cleanPhone = phone.trim();
    if (!cleanPhone || cleanPhone.replace(/\D/g, '').length < 7) {
      error('Please enter a valid phone number (at least 7-10 digits).');
      return;
    }

    setIsStartingGuest(true);
    try {
      const now = Date.now();
      const expiresAt = now + GUEST_DURATION_MS;
      const uid = `guest_${cleanPhone.replace(/\D/g, '')}_${now}`;

      const newSession: GuestSession = {
        phone: cleanPhone,
        loginTime: now,
        expiresAt,
        uid
      };

      // 1. Save to Firestore users collection
      await saveUserProfileToFirestore({
        uid,
        displayName: `Guest (${cleanPhone})`,
        phone: cleanPhone,
        role: 'guest',
        isGuest: true,
        expiresAt: new Date(expiresAt).toISOString()
      });

      // 2. Persist session
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(newSession));
      setGuestSession(newSession);
      setTimeLeft(Math.floor(GUEST_DURATION_MS / 1000));
      setIsExpired(false);
      setShowPhoneModal(false);
      setPhoneNumberInput('');

      // 3. Automatically redirect to top of website
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // 4. Show friendly notice that user has 1 hour and must sign in to stay permanently
      success(`Welcome! Guest session activated. Notice: You will automatically log out in 1 hour. Sign in with Google or Email to stay permanently!`);
    } catch (err: any) {
      console.error('[Guest Session Error]', err);
      error('Failed to initialize guest session. Please try again.');
    } finally {
      setIsStartingGuest(false);
    }
  }, [error, success]);

  const logoutGuest = useCallback(() => {
    localStorage.removeItem(GUEST_STORAGE_KEY);
    setGuestSession(null);
    setTimeLeft(0);
    success('Logged out from guest session.');
  }, [success]);

  const resetExpiredState = useCallback(() => {
    setIsExpired(false);
  }, []);

  const openPhoneModal = useCallback(() => {
    setShowPhoneModal(true);
  }, []);

  const closePhoneModal = useCallback(() => {
    setShowPhoneModal(false);
  }, []);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startGuestSession(phoneNumberInput);
  };

  const openPermanentAuth = useCallback(() => {
    window.dispatchEvent(new CustomEvent('open-portfolio-auth-modal'));
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds < 10 ? '0' : ''}${seconds}s`;
  };

  const contextValue = useMemo(() => ({
    guestSession,
    timeLeft,
    isExpired,
    showPhoneModal,
    openPhoneModal,
    closePhoneModal,
    startGuestSession,
    logoutGuest,
    resetExpiredState,
    openPermanentAuth
  }), [
    guestSession,
    timeLeft,
    isExpired,
    showPhoneModal,
    openPhoneModal,
    closePhoneModal,
    startGuestSession,
    logoutGuest,
    resetExpiredState,
    openPermanentAuth
  ]);

  return (
    <GuestSessionContext.Provider value={contextValue}>
      {/* 1. FLOATING GUEST COUNTDOWN BANNER (Sticky top notification) */}
      {guestSession && !isExpired && (
        <div className="sticky top-0 left-0 right-0 z-45 bg-gradient-to-r from-neutral-900 via-amber-950/90 to-neutral-900 border-b border-amber-500/40 text-neutral-100 shadow-xl backdrop-blur-md px-3 sm:px-4 py-2">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 font-medium">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 inline" />
                Guest Session ({guestSession.phone}):
              </span>
              <span className="font-mono bg-black/40 px-2 py-0.5 rounded border border-amber-500/30 text-amber-300 font-bold">
                {formatTime(timeLeft)} remaining
              </span>
              <span className="hidden md:inline text-neutral-300">
                — You will automatically log out in 1 hour. Sign in to stay permanently!
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={openPermanentAuth}
                className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-[11px] transition-all shadow-sm flex items-center gap-1 cursor-pointer"
              >
                <ShieldCheck className="w-3 h-3" />
                <span>Sign In Permanently</span>
              </button>
              <button
                type="button"
                onClick={logoutGuest}
                className="px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white text-[11px] transition-all cursor-pointer"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. GUEST PHONE NUMBER ENTRY MODAL */}
      {showPhoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-left animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-neutral-900 dark:text-white tracking-tight">
                    Continue as Guest
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Enter your phone number to browse for 1 hour
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closePhoneModal}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white font-bold text-lg p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notice / Warning banner */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>1-Hour Temporary Guest Access</span>
              </div>
              <p className="text-[11px] text-amber-700/90 dark:text-amber-300/80 leading-relaxed">
                Notice: As a guest, you will automatically log out after 1 hour and will no longer be able to view the website. Sign in with Google or Email if you want permanent access.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-300">
                  Your Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  autoFocus
                  value={phoneNumberInput}
                  onChange={e => setPhoneNumberInput(e.target.value)}
                  placeholder="e.g. +91 96681 39559 or 9876543210"
                  className="w-full px-4 py-3 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-2xl text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-hidden focus:border-amber-500 font-mono"
                />
                <span className="text-[11px] text-neutral-500">Only your phone number is needed. No password required.</span>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isStartingGuest}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>{isStartingGuest ? 'Entering Website...' : 'Enter Website as Guest (1 Hour)'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={closePhoneModal}
                  className="w-full py-2.5 px-4 rounded-2xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* 3. FULLSCREEN LOCKOUT OVERLAY (When 1 hour guest session expires) */}
      {isExpired && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="relative w-full max-w-md bg-neutral-900 border border-rose-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-200">
            
            <div className="mx-auto w-16 h-16 rounded-full bg-rose-500/10 border-2 border-rose-500/30 flex items-center justify-center text-rose-500 shadow-xl shadow-rose-500/20">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                Guest Session Expired
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Your 1-hour temporary guest session has automatically ended. To keep browsing Santosh Mishra&apos;s portfolio website, please sign in permanently or renew your session.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-400 space-y-1 text-left">
              <div className="font-bold text-neutral-200">Why did this happen?</div>
              <p className="text-[11px] leading-relaxed">
                Guest sessions are strictly limited to 1 hour. Creating an account or signing in gives you permanent, uninterrupted access to all portfolio features, resumes, and contact inquiries.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsExpired(false);
                  openPermanentAuth();
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Sign In Permanently (Google or Email)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsExpired(false);
                  setShowPhoneModal(true);
                }}
                className="w-full py-3 px-4 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs transition-colors cursor-pointer"
              >
                Re-enter Phone for Another Guest Session
              </button>
            </div>

          </div>
        </div>
      )}

      {children}
    </GuestSessionContext.Provider>
  );
};

export const useGuestSession = () => {
  const context = useContext(GuestSessionContext);
  if (!context) {
    throw new Error('useGuestSession must be used within a GuestSessionProvider');
  }
  return context;
};
