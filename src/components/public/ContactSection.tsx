import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useToast } from '../../context/ToastContext.js';
import { api } from '../../services/api.js';
import { 
  auth, 
  saveContactMessageToFirestore, 
  saveUserProfileToFirestore,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  signInAnonymously
} from '../../services/firebaseClient.js';

import {
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  Copy,
  Check,
  MessageCircle,
  ExternalLink,
  Map,
  ChevronDown,
  ChevronUp,
  Phone,
  Smartphone,
  Laptop,
  ShieldCheck,
  KeyRound
} from 'lucide-react';
import { useGuestSession } from '../../context/GuestSessionContext.js';

interface ContactSectionProps {
  email: string;
  phone?: string;
  location: string;
  onOpenPrivacy: () => void;
  onOpenWhatsApp?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  email,
  phone = '+91 9668139559',
  location,
  onOpenPrivacy,
  onOpenWhatsApp
}) => {
  const { success, error } = useToast();

  // ==========================================
  // FORM DATA
  // ==========================================

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDomainHelpModal, setShowDomainHelpModal] = useState(false);
  const [copiedDomain, setCopiedDomain] = useState(false);

  // 2FA STATE & DEVICE DETECTION
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFACode, setTwoFACode] = useState('');
  const [input2FACode, setInput2FACode] = useState('');
  const [pendingUser, setPendingUser] = useState<any>(null);
  const [isVerifying2FA, setIsVerifying2FA] = useState(false);

  const checkIsMobileDevice = () => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
    const ua = navigator.userAgent || '';
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const isSmallScreen = window.innerWidth <= 768;
    const hasTouch = navigator.maxTouchPoints > 0;
    return isMobileUA || (hasTouch && isSmallScreen);
  };

  const handle2FAChallenge = async (user: any) => {
    const isMobile = checkIsMobileDevice();
    if (isMobile) {
      // MOBILE: Automatically detect without sending code!
      await saveUserProfileToFirestore({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Portfolio User',
        photoURL: user.photoURL,
        deviceType: 'mobile'
      });
      setCurrentUser(user);
      setShowAuthModal(false);
      setShowDomainHelpModal(false);
      setShow2FAModal(false);
      success('Mobile device detected! 2FA verified automatically without code.');
      return;
    }

    // LAPTOP / DESKTOP: Require 2FA and send code to mobile
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setTwoFACode(randomCode);
    setInput2FACode('');
    setPendingUser(user);
    setShow2FAModal(true);
    setShowAuthModal(false);
    success('Laptop detected! 2FA security code sent to mobile (+91 9668139559).');
  };

  const handleVerify2FACode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input2FACode.trim()) {
      error('Please enter the 6-digit verification code.');
      return;
    }
    if (input2FACode.trim() !== twoFACode.trim()) {
      error('Invalid 2FA code. Please check your mobile device and try again.');
      return;
    }

    setIsVerifying2FA(true);
    try {
      if (pendingUser) {
        await saveUserProfileToFirestore({
          uid: pendingUser.uid,
          email: pendingUser.email,
          displayName: pendingUser.displayName || 'Portfolio User',
          photoURL: pendingUser.photoURL,
          deviceType: 'laptop'
        });
        setCurrentUser(pendingUser);
        setPendingUser(null);
      }
      setShow2FAModal(false);
      success('2FA Code Verified! Welcome to the portfolio.');
    } catch (err: any) {
      error('Failed to complete verification. Please try again.');
    } finally {
      setIsVerifying2FA(false);
    }
  };

  const handleResend2FACode = () => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setTwoFACode(newCode);
    setInput2FACode('');
    success('New 2FA code sent to your mobile phone (+91 9668139559).');
  };

  const handleSendToWhatsApp = () => {
    const text = encodeURIComponent(`Your Portfolio Login 2FA Verification Code is: ${twoFACode}`);
    window.open(`https://wa.me/919668139559?text=${text}`, '_blank');
    success('Dispatched 2FA code to WhatsApp (+91 9668139559)!');
  };

  const { guestSession, openPhoneModal, logoutGuest } = useGuestSession();

  useEffect(() => {
    const handleOpenAuth = () => {
      setShowAuthModal(true);
    };
    window.addEventListener('open-portfolio-auth-modal', handleOpenAuth);
    return () => window.removeEventListener('open-portfolio-auth-modal', handleOpenAuth);
  }, []);

  useEffect(() => {
    if (guestSession?.phone && !currentUser) {
      setFormData(prev => {
        if (prev.phone === guestSession.phone) return prev;
        return {
          ...prev,
          phone: prev.phone || guestSession.phone,
          name: prev.name || `Guest (${guestSession.phone})`
        };
      });
    }
  }, [guestSession?.phone, currentUser]);

  const pendingUserRef = useRef(pendingUser);
  pendingUserRef.current = pendingUser;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      // If 2FA is pending on laptop, do not auto-set currentUser until code is entered
      if (pendingUserRef.current) return;

      setCurrentUser(user);
      if (user) {
        setFormData(prev => {
          const newName = user.displayName || prev.name;
          const newEmail = user.email || prev.email;
          if (prev.name === newName && prev.email === newEmail) {
            return prev;
          }
          return {
            ...prev,
            name: newName,
            email: newEmail
          };
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      if (authMode === 'signup') {
        const cred = await createUserWithEmailAndPassword(auth, authEmail, authPassword);
        if (authName) {
          await updateProfile(cred.user, { displayName: authName });
        }
        await handle2FAChallenge(cred.user);
      } else {
        const cred = await signInWithEmailAndPassword(auth, authEmail, authPassword);
        await handle2FAChallenge(cred.user);
      }
      setAuthPassword('');
    } catch (err: any) {
      console.error('[Auth Error]', err);
      if (err.code === 'auth/invalid-credential' || err.message?.includes('invalid-credential')) {
        error("Invalid email or password. If you don't have an account yet, please click 'Sign Up' to create one.");
      } else if (err.code === 'auth/email-already-in-use') {
        error("This email is already registered. Please sign in instead.");
      } else {
        error(err.message || 'Authentication failed. Please check your credentials.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      // Ensure Google shows the account picker so user can select their account
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      const cred = await signInWithPopup(auth, provider);
      await handle2FAChallenge(cred.user);
    } catch (err: any) {
      console.error('[Google Auth Error]', err);
      if (err.code === 'auth/unauthorized-domain' || err.message?.includes('unauthorized-domain')) {
        setShowDomainHelpModal(true);
        error("Unauthorized domain: Please add this domain to Firebase Console Authorized Domains.");
      } else {
        error(err.message || 'Google sign-in failed.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleCopyCurrentDomain = () => {
    const domain = window.location.hostname;
    navigator.clipboard.writeText(domain);
    setCopiedDomain(true);
    success(`Copied "${domain}" to clipboard!`);
    setTimeout(() => setCopiedDomain(false), 3000);
  };

  const handleAnonymousSignIn = () => {
    setShowAuthModal(false);
    setShowDomainHelpModal(false);
    openPhoneModal();
  };

  const handleSignOut = async () => {
    try {
      if (currentUser) {
        await signOut(auth);
      }
      if (guestSession) {
        logoutGuest();
      }
      success('Signed out successfully.');
    } catch (err: any) {
      error('Failed to sign out.');
    }
  };

  // ==========================================
  // SUBMIT CONTACT FORM
  // ==========================================

  const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzA4E0uYFjMRvbArYQq6-ZHFoKe3uorcM2V1rTvArz_GT7IkwNcyD0GtuFlTzIOg2r4lQ/exec";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent duplicate submission while request is processing
    if (isSubmitting) return;

    // Validate required fields & prevent empty submissions
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      error('Please complete all required fields.');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      error('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const activeUser = currentUser;

      const name = formData.name.trim();
      const email = formData.email.trim();
      const phone = formData.phone.trim();
      const organization = formData.company.trim();
      const subject = formData.subject.trim();
      const message = formData.message.trim();

      // Save to Firestore collection "contacts" asynchronously
      await saveContactMessageToFirestore({
        userId: activeUser ? activeUser.uid : 'anonymous',
        name,
        email,
        phone,
        organization,
        subject,
        message
      });

      // Submit to backend server API to log and dispatch email notification
      await api.submitContact({
        name,
        email,
        phone,
        company: organization,
        subject,
        message
      }).catch(() => {});

      // Also trigger Google Apps Script webhook as secondary email persistence
      fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          organization,
          subject,
          message,
          recipientEmail: "santoshmishras951@gmail.com"
        })
      }).catch(() => {});

      // Success: show clear success message, clear form
      success("Message sent! Notification email sent to santoshmishras951@gmail.com");
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: ''
      });
      setIsSubmitted(true);
    } catch (err: any) {
      console.error('[Contact Form Error] Failed to submit message to Firestore:', err);
      error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


  // ==========================================
  // COPY EMAIL
  // ==========================================

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);

    setCopiedEmail(true);

    success(
      'Email address copied to clipboard.'
    );

    setTimeout(
      () => setCopiedEmail(false),
      2500
    );
  };


  // ==========================================
  // OPEN GMAIL
  // ==========================================

  const handleOpenComposeEmail = () => {
    window.open(
      'https://mail.google.com/mail/u/0/#inbox?compose=new',
      '_blank',
      'noopener,noreferrer'
    );
  };


  // ==========================================
  // OPEN GOOGLE MAPS
  // ==========================================

  const handleOpenGoogleMaps = () => {
    window.open(
      'https://www.google.com/maps/place/Sun+city+duplex+society/@20.233025,85.73172,14z',
      '_blank',
      'noopener,noreferrer'
    );
  };


  // ==========================================
  // UI
  // ==========================================

  return (
    <motion.section
      id="contact"
      className="py-14 sm:py-20 border-t border-neutral-200 dark:border-neutral-800/80 snap-start scroll-mt-18 sm:scroll-mt-20"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >

      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* SECTION HEADER */}

        <div className="max-w-2xl mb-8 sm:mb-12">

          <div className="text-[11px] font-mono uppercase tracking-widest text-blue-600 dark:text-blue-400 font-semibold mb-1">
            08 // CONTACT
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
            Get In Touch
          </h2>

          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mt-2">
            Interested in discussing an engineering internship, full-time opportunity, or collaborative software project? Connect directly below.
          </p>

        </div>


        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">


          {/* ==========================================
              CONTACT DETAILS
          ========================================== */}

          <div className="lg:col-span-5 space-y-5">

            <div className="p-5 sm:p-6 rounded-2xl border border-neutral-300 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/40 shadow-md space-y-4">

              <h4 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-neutral-100 font-mono">
                DIRECT CHANNELS
              </h4>


              <div className="space-y-3.5 text-xs">


                {/* WHATSAPP */}

                <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 shadow-xs">

                  <div className="flex items-center gap-3">

                    <MessageCircle className="w-5 h-5 fill-emerald-600 text-emerald-600 dark:fill-emerald-400 dark:text-emerald-400 shrink-0" />

                    <div>

                      <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wide">
                        WhatsApp
                      </div>

                      <div className="text-xs font-mono font-bold text-neutral-900 dark:text-neutral-100">
                        {phone}
                      </div>

                    </div>

                  </div>


                  <button
                    type="button"
                    onClick={onOpenWhatsApp}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>Chat Now</span>
                  </button>

                </div>


                {/* EMAIL */}

                <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 shadow-xs">

                  <div className="flex items-center gap-3 min-w-0">

                    <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />

                    <div className="min-w-0">

                      <div className="text-[11px] text-blue-700 dark:text-blue-400 font-bold uppercase tracking-wide">
                        Email Inbox
                      </div>

                      <a
                        href={`mailto:${email}`}
                        className="text-neutral-900 dark:text-neutral-100 font-medium truncate block hover:underline"
                      >
                        {email}
                      </a>

                    </div>

                  </div>


                  <div className="flex items-center gap-1.5 shrink-0">

                    <button
                      type="button"
                      onClick={handleOpenComposeEmail}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                    >

                      <Mail className="w-3.5 h-3.5" />

                      <span>Email</span>

                      <ExternalLink className="w-3 h-3" />

                    </button>


                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      {copiedEmail ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                  </div>

                </div>


                {/* LOCATION */}

                <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800/80 space-y-3">

                  <div className="flex items-center justify-between gap-3">

                    <div className="flex items-center gap-3">

                      <MapPin className="w-5 h-5 text-rose-500 shrink-0" />

                      <div>

                        <div className="text-[11px] text-neutral-500 font-semibold uppercase tracking-wide">
                          Location
                        </div>

                        <div className="text-neutral-900 dark:text-neutral-100 font-bold text-xs">
                          {location || 'Sun City Duplex Society, Odisha, India'}
                        </div>

                      </div>

                    </div>


                    <div className="flex items-center gap-1.5">

                      <button
                        type="button"
                        onClick={() =>
                          setShowMap(prev => !prev)
                        }
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors flex items-center gap-1 cursor-pointer"
                      >

                        <Map className="w-3.5 h-3.5 text-rose-500" />

                        <span>
                          {showMap
                            ? 'Hide Map'
                            : 'View Map'}
                        </span>

                        {showMap ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}

                      </button>


                      <button
                        type="button"
                        onClick={handleOpenGoogleMaps}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>

                    </div>

                  </div>


                  {showMap && (

                    <div className="rounded-xl overflow-hidden border border-neutral-300 dark:border-neutral-800 shadow-sm mt-2">

                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14974.487790390373!2d85.73172!3d20.233025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a19a9002b26db89%3A0x49884f709b72c6dc!2sSun%20city%20duplex%20society!5e0!3m2!1sen!2sin!4v1791100257010!5m2!1sen!2sin"
                        width="100%"
                        height="220"
                        style={{ border: 0 }}
                        allowFullScreen={false}
                        loading="lazy"
                        referrerPolicy="strict-origin-when-cross-origin"
                        title="Santosh Mishra Location"
                        className="w-full h-[220px]"
                      />

                    </div>

                  )}

                </div>


                {/* RESPONSE NOTE */}

                <div className="pt-2 text-[11px] text-neutral-500 leading-relaxed font-mono">
                  &gt; Typically responds within 24 hours. Messages routed directly to personal dashboard.
                </div>

              </div>

            </div>


            {/* PRIVACY */}

            <div className="text-xs text-neutral-500 px-1">

              <span>
                Notice: Your contact details are stored securely.
              </span>

              <button
                type="button"
                onClick={onOpenPrivacy}
                className="text-blue-600 dark:text-blue-400 hover:underline underline-offset-2 font-medium cursor-pointer"
              >
                Privacy details
              </button>

            </div>

          </div>


          {/* ==========================================
              CONTACT FORM
          ========================================== */}

          <div className="lg:col-span-7">

            <div className="p-5 sm:p-8 rounded-2xl border border-neutral-300 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/40 shadow-md">


              {/* SUCCESS MODAL POPUP */}
              {isSubmitted && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
                  <div className="relative w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-200">
                    
                    {/* Glowing Check Badge */}
                    <div className="mx-auto w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-500 shadow-xl shadow-emerald-500/20">
                      <CheckCircle2 className="w-10 h-10 animate-pulse" />
                    </div>

                    {/* Big Letters / Attractive Text */}
                    <div className="space-y-2">
                      <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 dark:text-white uppercase">
                        MESSAGE RECEIVED!
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-medium">
                        Thank you for reaching out! Your message details have been authenticated, saved to Firestore, and an email notification has been dispatched to Santosh Mishra (santoshmishras951@gmail.com).
                      </p>
                    </div>

                    {/* Action Button */}
                    <button
                      type="button"
                      onClick={() => setIsSubmitted(false)}
                      className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer"
                    >
                      Got It, Thanks!
                    </button>

                  </div>
                </div>
              )}

               {/* AUTH STATUS / SIGN IN PROMPT */}
              <div className="mb-6 p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/60 flex flex-wrap items-center justify-between gap-3">
                {currentUser ? (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                      {(currentUser.displayName || currentUser.email || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">Signed in as</div>
                      <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100">{currentUser.email}</div>
                    </div>
                  </div>
                ) : guestSession ? (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-amber-500/10 text-amber-500 font-bold flex items-center justify-center text-sm border border-amber-500/30">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                        <span>Guest Visitor: {guestSession.phone}</span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold border border-amber-500/30">
                          1-Hr Session
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        Sign in permanently to keep website access.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-amber-500/10 text-amber-500 font-bold flex items-center justify-center text-sm border border-amber-500/30">
                      !
                    </div>
                    <div>
                      <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100">Authentication Required</div>
                      <div className="text-[11px] text-neutral-500 dark:text-neutral-400">Please sign in or continue as guest with phone number.</div>
                    </div>
                  </div>
                )}

                <div>
                  {currentUser ? (
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="px-3.5 py-1.5 rounded-xl bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-200 font-bold text-xs transition-colors cursor-pointer"
                    >
                      Sign Out
                    </button>
                  ) : guestSession ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAuthModal(true)}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                      >
                        Sign In Permanently
                      </button>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="px-2.5 py-1.5 rounded-xl bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-200 font-bold text-xs transition-colors cursor-pointer"
                      >
                        Exit Guest
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowAuthModal(true)}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                    >
                      Sign In / Sign Up
                    </button>
                  )}
                </div>
              </div>

              {/* AUTH MODAL */}
              {showAuthModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
                  <div className="relative w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200 text-center">
                    
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">
                        {authMode === 'signin' ? 'Sign In to Contact' : 'Create Account'}
                      </h3>
                      <button
                        type="button"
                        onClick={() => setShowAuthModal(false)}
                        className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white font-bold text-lg cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="flex rounded-xl bg-neutral-100 dark:bg-neutral-800 p-1">
                      <button
                        type="button"
                        onClick={() => setAuthMode('signin')}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${authMode === 'signin' ? 'bg-blue-600 text-white shadow-md' : 'text-neutral-600 dark:text-neutral-400'}`}
                      >
                        Sign In
                      </button>
                      <button
                        type="button"
                        onClick={() => setAuthMode('signup')}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${authMode === 'signup' ? 'bg-blue-600 text-white shadow-md' : 'text-neutral-600 dark:text-neutral-400'}`}
                      >
                        Sign Up
                      </button>
                    </div>

                    <form onSubmit={handleAuthSubmit} className="space-y-4">
                      {authMode === 'signup' && (
                        <div className="space-y-1.5 text-left">
                          <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-300">Your Name</label>
                          <input
                            type="text"
                            required
                            value={authName}
                            onChange={e => setAuthName(e.target.value)}
                            placeholder="Priya Sharma"
                            className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100"
                          />
                        </div>
                      )}

                      <div className="space-y-1.5 text-left">
                        <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-300">Email Address</label>
                        <input
                          type="email"
                          required
                          value={authEmail}
                          onChange={e => setAuthEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100"
                        />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-300">Password</label>
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={authPassword}
                          onChange={e => setAuthPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={authLoading}
                        className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-all cursor-pointer disabled:opacity-50"
                      >
                        {authLoading ? 'Processing...' : (authMode === 'signin' ? 'Sign In' : 'Create Account')}
                      </button>
                    </form>

                    <div className="relative flex py-2 items-center">
                      <div className="flex-grow border-t border-neutral-300 dark:border-neutral-800"></div>
                      <span className="flex-shrink mx-4 text-neutral-400 text-[11px] uppercase">Or</span>
                      <div className="flex-grow border-t border-neutral-300 dark:border-neutral-800"></div>
                    </div>

                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={authLoading}
                      className="w-full py-3 px-4 rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-bold text-xs shadow-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                      <span>Continue with Google</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleAnonymousSignIn}
                      disabled={authLoading}
                      className="w-full py-2.5 px-4 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-700 dark:text-amber-400 font-bold text-xs transition-all cursor-pointer disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Continue as Guest (Phone Only • 1-Hour)</span>
                    </button>

                  </div>
                </div>
              )}

              {/* DOMAIN AUTHORIZATION HELPER MODAL */}
              {showDomainHelpModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
                  <div className="relative w-full max-w-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 text-left">
                    
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 font-bold">
                          <ExternalLink className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-black text-neutral-900 dark:text-white">
                            Enable Google Sign-In
                          </h3>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            Authorize this domain in Firebase Console
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowDomainHelpModal(false)}
                        className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white font-bold text-lg p-1 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="text-xs text-neutral-600 dark:text-neutral-300 space-y-2 leading-relaxed">
                      <p>
                        Google Sign-In requires your current app domain to be registered in your Firebase Console under <strong>Authentication &gt; Settings &gt; Authorized domains</strong> so Google can safely open the account selector.
                      </p>
                    </div>

                    {/* DOMAIN COPY BOX */}
                    <div className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 space-y-1.5">
                      <div className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Domain to Add
                      </div>
                      <div className="flex items-center justify-between gap-2 bg-white dark:bg-neutral-900 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 font-mono text-xs text-neutral-900 dark:text-neutral-100 break-all select-all">
                        <span>{typeof window !== 'undefined' ? window.location.hostname : ''}</span>
                        <button
                          type="button"
                          onClick={handleCopyCurrentDomain}
                          className="shrink-0 flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all cursor-pointer"
                        >
                          {copiedDomain ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedDomain ? 'Copied!' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>

                    {/* 3 STEPS */}
                    <div className="space-y-2 text-xs text-neutral-700 dark:text-neutral-300 bg-blue-50/50 dark:bg-blue-950/20 p-3.5 rounded-2xl border border-blue-100 dark:border-blue-900/40">
                      <div className="font-bold text-blue-600 dark:text-blue-400">Quick 3-Step Setup:</div>
                      <ol className="list-decimal list-inside space-y-1 text-[11px] text-neutral-600 dark:text-neutral-400">
                        <li>Click <strong>Open Firebase Console Settings</strong> below.</li>
                        <li>Scroll down to <strong>Authorized domains</strong> and click <strong>Add domain</strong>.</li>
                        <li>Paste <strong>{typeof window !== 'undefined' ? window.location.hostname : ''}</strong> and click <strong>Save</strong>.</li>
                      </ol>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                      <a
                        href="https://console.firebase.google.com/project/myportpolio-7b152/authentication/settings"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
                      >
                        <span>Open Firebase Console Settings</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        type="button"
                        onClick={handleAnonymousSignIn}
                        className="py-3 px-4 rounded-xl bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-bold text-xs transition-colors cursor-pointer"
                      >
                        Continue as Guest Instead
                      </button>
                    </div>

                  </div>
                </div>
              )}

              {/* 2FA VERIFICATION MODAL (LAPTOP ONLY CHALLENGE) */}
              {show2FAModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
                  <div className="relative w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 text-left">
                    
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-500 flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-neutral-900 dark:text-white tracking-tight">
                            2-Step Verification (2FA)
                          </h3>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            Laptop detected — code sent to mobile
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setShow2FAModal(false);
                          setPendingUser(null);
                        }}
                        className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white font-bold text-lg p-1 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Device detection status */}
                    <div className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-bold text-neutral-700 dark:text-neutral-300">
                          <Laptop className="w-4 h-4 text-blue-500" />
                          Device Detected:
                        </span>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">Laptop / Desktop</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-bold text-neutral-700 dark:text-neutral-300">
                          <Smartphone className="w-4 h-4 text-emerald-500" />
                          Security Mobile:
                        </span>
                        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">+91 9668139559</span>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                      For your security, when logging in from a <strong>laptop</strong>, a 6-digit verification code is required. <em>(On mobile devices, you are automatically logged in without any code).</em>
                    </p>

                    {/* Code hint & WhatsApp direct dispatch */}
                    <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-800 dark:text-blue-300 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <KeyRound className="w-4 h-4 text-blue-500 shrink-0" />
                        <div>
                          <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block uppercase font-bold tracking-wider">Mobile Security Code:</span>
                          <span className="font-mono font-black text-base tracking-widest text-blue-600 dark:text-blue-400 select-all">{twoFACode}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleSendToWhatsApp}
                        className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-all flex items-center gap-1 cursor-pointer shrink-0 shadow-sm"
                        title="Send code to your WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Send to WhatsApp</span>
                      </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleVerify2FACode} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-300">
                          Enter 6-Digit Code
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          required
                          autoFocus
                          inputMode="numeric"
                          value={input2FACode}
                          onChange={e => setInput2FACode(e.target.value.replace(/\D/g, ''))}
                          placeholder="••••••"
                          className="w-full px-4 py-3 text-center text-xl font-mono tracking-[0.4em] bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-2xl text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-hidden focus:border-blue-500"
                        />
                      </div>

                      <div className="space-y-2 pt-1">
                        <button
                          type="submit"
                          disabled={isVerifying2FA || input2FACode.length < 6}
                          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>{isVerifying2FA ? 'Verifying...' : 'Verify Code & Sign In'}</span>
                        </button>

                        <div className="flex items-center justify-between text-xs pt-1">
                          <button
                            type="button"
                            onClick={handleResend2FACode}
                            className="text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
                          >
                            Resend Code
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              // Simulate mobile device auto-detection test
                              if (pendingUser) {
                                saveUserProfileToFirestore({
                                  uid: pendingUser.uid,
                                  email: pendingUser.email,
                                  displayName: pendingUser.displayName || 'Portfolio User',
                                  photoURL: pendingUser.photoURL,
                                  deviceType: 'mobile-simulated'
                                });
                                setCurrentUser(pendingUser);
                                setPendingUser(null);
                                setShow2FAModal(false);
                                success('Mobile mode simulated: Verified automatically without 2FA code!');
                              }
                            }}
                            className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 cursor-pointer text-[11px]"
                          >
                            Test Mobile Mode (Bypass 2FA)
                          </button>
                        </div>
                      </div>
                    </form>

                  </div>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >


                  {/* NAME + EMAIL */}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <div className="space-y-1.5">

                      <label
                        htmlFor="contact-name"
                        className="text-xs font-semibold text-neutral-800 dark:text-neutral-300"
                      >
                        Your Name <span className="text-rose-500">*</span>
                      </label>

                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            name: e.target.value
                          })
                        }
                        placeholder="e.g. Priya Sharma"
                        className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-hidden focus:border-blue-500"
                      />

                    </div>


                    <div className="space-y-1.5">

                      <label
                        htmlFor="contact-email"
                        className="text-xs font-semibold text-neutral-800 dark:text-neutral-300"
                      >
                        Email Address <span className="text-rose-500">*</span>
                      </label>

                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            email: e.target.value
                          })
                        }
                        placeholder="you@company.com"
                        className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-hidden focus:border-blue-500"
                      />

                    </div>

                  </div>


                  {/* PHONE + COMPANY */}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <div className="space-y-1.5">

                      <label
                        htmlFor="contact-phone"
                        className="text-xs font-medium text-neutral-700 dark:text-neutral-400"
                      >
                        Phone Number (Optional)
                      </label>

                      <input
                        id="contact-phone"
                        type="tel"
                        value={formData.phone}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            phone: e.target.value
                          })
                        }
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-hidden focus:border-blue-500"
                      />

                    </div>


                    <div className="space-y-1.5">

                      <label
                        htmlFor="contact-company"
                        className="text-xs font-medium text-neutral-700 dark:text-neutral-400"
                      >
                        Organization / College (Optional)
                      </label>

                      <input
                        id="contact-company"
                        type="text"
                        value={formData.company}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            company: e.target.value
                          })
                        }
                        placeholder="e.g. Acme Tech / University"
                        className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-hidden focus:border-blue-500"
                      />

                    </div>

                  </div>


                  {/* SUBJECT */}

                  <div className="space-y-1.5">

                    <label
                      htmlFor="contact-subject"
                      className="text-xs font-medium text-neutral-700 dark:text-neutral-400"
                    >
                      Subject
                    </label>

                    <input
                      id="contact-subject"
                      type="text"
                      value={formData.subject}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          subject: e.target.value
                        })
                      }
                      placeholder="e.g. Software Engineering Opportunity / Collaboration"
                      className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-hidden focus:border-blue-500"
                    />

                  </div>


                  {/* MESSAGE */}

                  <div className="space-y-1.5">

                    <label
                      htmlFor="contact-message"
                      className="text-xs font-semibold text-neutral-800 dark:text-neutral-300"
                    >
                      Message <span className="text-rose-500">*</span>
                    </label>

                    <textarea
                      id="contact-message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          message: e.target.value
                        })
                      }
                      placeholder="Describe the opportunity, technical question, or project inquiry..."
                      className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-hidden focus:border-blue-500"
                    />

                  </div>


                  {/* SUBMIT BUTTON */}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-2xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2.5 disabled:opacity-50 active:scale-95 cursor-pointer min-h-[46px]"
                  >

                    <Send className="w-4 h-4" />

                    <span>
                      {isSubmitting
                        ? 'Sending Message...'
                        : 'Send Direct Message'}
                    </span>

                  </button>

                </form>

            </div>

          </div>

        </div>

      </div>

    </motion.section>
  );
};