import React, { useState, useEffect } from 'react';
import { PortfolioData } from '../../types/portfolio.js';
import { FolderGit2, Wrench, Mail, FileText, ArrowRight, CheckCircle2, User, Trash2, X, Phone, Building2, MessageSquare, ExternalLink } from 'lucide-react';
import { db } from '../../services/firebaseClient.js';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useToast } from '../../context/ToastContext.js';

interface AdminOverviewProps {
  data: PortfolioData;
  onNavigateTab: (tab: string) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ data, onNavigateTab }) => {
  const { success, error } = useToast();
  const [firestoreContacts, setFirestoreContacts] = useState<any[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchContacts = async () => {
    setLoadingContacts(true);
    try {
      const snap = await getDocs(collection(db, 'contacts'));
      const list = snap.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      setFirestoreContacts(list);
    } catch (err) {
      console.error('Failed to fetch Firestore contacts:', err);
    } finally {
      setLoadingContacts(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDeleteContact = async (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete the contact inquiry from "${name}"?`)) return;
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, 'contacts', id));
      setFirestoreContacts(prev => prev.filter(c => c.id !== id));
      if (selectedInquiry?.id === id) setSelectedInquiry(null);
      success(`Inquiry from "${name}" deleted successfully.`);
    } catch (err: any) {
      console.error('Failed to delete contact:', err);
      error('Failed to delete inquiry from Firestore.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatTimestamp = (ts: any) => {
    if (!ts) return 'Recently';
    if (ts.toDate) return ts.toDate().toLocaleDateString();
    if (typeof ts === 'string' || typeof ts === 'number') return new Date(ts).toLocaleDateString();
    return 'Recently';
  };

  const handleReplyEmail = (e: React.MouseEvent, email: string, name?: string, subject?: string) => {
    e.stopPropagation();
    const cleanEmail = (email || '').trim();
    if (!cleanEmail) {
      error('No email address provided.');
      return;
    }

    const sub = encodeURIComponent('Re: ' + (subject || 'Portfolio Inquiry'));
    const body = encodeURIComponent(
      `Hi ${name || 'there'},\n\nThank you for reaching out via my portfolio website regarding "${subject || 'your message'}". I would be glad to discuss this further with you.\n\nBest regards,\nSantosh Mishra\nhttps://santosh-mishra.dev`
    );

    // 1. Primary trigger: mailto: for default desktop/mobile email client
    const mailtoUrl = `mailto:${cleanEmail}?subject=${sub}&body=${body}`;
    window.location.href = mailtoUrl;

    // 2. Secondary fallback: Open Gmail compose tab directly
    setTimeout(() => {
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(cleanEmail)}&su=${sub}&body=${body}`;
      window.open(gmailUrl, '_blank');
    }, 400);

    success(`Opening email compose for ${cleanEmail}...`);
  };

  const handleCallPhone = (e: React.MouseEvent, phone: string) => {
    e.stopPropagation();
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    if (!cleanPhone) {
      error('No phone number available.');
      return;
    }
    window.location.href = `tel:${cleanPhone}`;
  };

  const visibleProjects = data.projects.filter(p => p.isVisible);
  const currentResume = data.resumes.find(r => r.isCurrent);
  const allInquiries = firestoreContacts.length > 0 ? firestoreContacts : data.messages;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-neutral-100">
          Portfolio CMS Overview
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          Monitor content status, public availability, and incoming recruiter inquiries.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div
          onClick={() => onNavigateTab('projects')}
          className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/40 hover:border-neutral-700 transition-colors cursor-pointer space-y-3"
        >
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium">Projects</span>
            <FolderGit2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-neutral-100 tabular-nums">
            {visibleProjects.length}
            <span className="text-xs font-normal text-neutral-500 ml-1.5">active</span>
          </div>
          <p className="text-[11px] text-neutral-500">
            Total {data.projects.length} recorded
          </p>
        </div>

        <div
          onClick={() => onNavigateTab('skills')}
          className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/40 hover:border-neutral-700 transition-colors cursor-pointer space-y-3"
        >
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium">Technical Skills</span>
            <Wrench className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-neutral-100 tabular-nums">
            {data.skills.filter(s => s.isVisible).length}
            <span className="text-xs font-normal text-neutral-500 ml-1.5">published</span>
          </div>
          <p className="text-[11px] text-neutral-500">
            Across 6 practical engineering categories
          </p>
        </div>

        <div
          onClick={() => onNavigateTab('users')}
          className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/40 hover:border-neutral-700 transition-colors cursor-pointer space-y-3"
        >
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium">Recent Inquiries</span>
            <Mail className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-neutral-100 tabular-nums flex items-center gap-2">
            <span>{allInquiries.length}</span>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Live Firestore
            </span>
          </div>
          <p className="text-[11px] text-neutral-500">
            {allInquiries.length > 0 ? `${allInquiries.length} total message(s) stored` : 'No inquiries yet'}
          </p>
        </div>

        <div
          onClick={() => onNavigateTab('resume')}
          className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/40 hover:border-neutral-700 transition-colors cursor-pointer space-y-3"
        >
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium">Current Resume</span>
            <FileText className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-lg font-bold text-neutral-100 truncate">
            {currentResume ? currentResume.version : 'Default PDF'}
          </div>
          <p className="text-[11px] text-neutral-500">
            {currentResume ? `Updated ${currentResume.uploadDate}` : 'Dynamic generation active'}
          </p>
        </div>

      </div>

      {/* Profile Status */}
      <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Profile System Status: Active</span>
          </div>
          <h3 className="text-base font-bold text-neutral-100">
            {data.profile.name} — {data.profile.headline}
          </h3>
          <p className="text-xs text-neutral-400">
            Current Status: {data.profile.currentStatus}. All updates made here reflect instantly on the public website.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('profile')}
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-neutral-950 bg-neutral-100 hover:bg-white rounded-xl transition-colors shrink-0 cursor-pointer"
        >
          <User className="w-3.5 h-3.5" />
          <span>Edit Profile Bio & Status</span>
        </button>
      </div>

      {/* Recent Contact Inquiries */}
      <div className="border border-neutral-800 rounded-2xl p-6 bg-neutral-900/30 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-neutral-100">
            Recent Contact Inquiries
          </h3>
          <button
            onClick={() => onNavigateTab('users')}
            className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
          >
            <span>View All ({allInquiries.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loadingContacts ? (
          <div className="py-8 text-center text-xs text-neutral-500 border border-dashed border-neutral-800 rounded-xl">
            Loading inquiries from Firestore...
          </div>
        ) : allInquiries.length === 0 ? (
          <div className="py-8 text-center text-xs text-neutral-500 border border-dashed border-neutral-800 rounded-xl">
            No contact inquiries submitted yet.
          </div>
        ) : (
          <div className="divide-y divide-neutral-800/60">
            {allInquiries.slice(0, 5).map(msg => (
              <div
                key={msg.id}
                onClick={() => setSelectedInquiry(msg)}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-900/60 px-3 rounded-xl cursor-pointer transition-all border border-transparent hover:border-neutral-800"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-neutral-100">{msg.name || 'Anonymous Submitter'}</span>
                    <span className="text-xs text-neutral-400 font-mono">({msg.email})</span>
                    {msg.status === 'unread' || !msg.status ? (
                      <span className="text-[10px] text-amber-400 font-medium bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                        New
                      </span>
                    ) : null}
                  </div>
                  <div className="text-xs text-neutral-300 truncate font-medium">
                    {msg.subject || 'Portfolio Contact Inquiry'}
                  </div>
                  {msg.organization && (
                    <div className="text-[11px] text-neutral-500 flex items-center gap-1">
                      <span>Org: {msg.organization}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={e => handleReplyEmail(e, msg.email, msg.name, msg.subject)}
                    className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                    title="Reply via Email"
                  >
                    <Mail className="w-3 h-3" />
                    <span>Reply</span>
                  </button>

                  {msg.phone && (
                    <button
                      type="button"
                      onClick={e => handleCallPhone(e, msg.phone)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                      title="Call Phone Number"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Call</span>
                    </button>
                  )}

                  <span className="text-[11px] text-neutral-500 tabular-nums ml-1">
                    {formatTimestamp(msg.createdAt)}
                  </span>

                  <button
                    type="button"
                    disabled={deletingId === msg.id}
                    onClick={e => handleDeleteContact(e, msg.id, msg.name || msg.email)}
                    className="p-1.5 text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                    title="Delete Inquiry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-800">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-neutral-100">{selectedInquiry.name}</h3>
                <button
                  type="button"
                  onClick={e => handleReplyEmail(e, selectedInquiry.email, selectedInquiry.name, selectedInquiry.subject)}
                  className="text-xs text-blue-400 hover:underline block font-mono cursor-pointer"
                >
                  {selectedInquiry.email}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-neutral-300">
              {selectedInquiry.phone && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span>Phone: <strong className="text-neutral-100">{selectedInquiry.phone}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={e => handleCallPhone(e, selectedInquiry.phone)}
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Call Now</span>
                    </button>
                    <a
                      href={`https://wa.me/${selectedInquiry.phone.replace(/[^\d]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-400 hover:bg-emerald-900 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              )}

              {selectedInquiry.organization && (
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-neutral-500" />
                  <span>Organization: <strong className="text-neutral-100">{selectedInquiry.organization}</strong></span>
                </div>
              )}

              <div className="space-y-1 pt-2">
                <div className="font-bold text-neutral-200">Subject:</div>
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200">
                  {selectedInquiry.subject || 'Portfolio Inquiry'}
                </div>
              </div>

              <div className="space-y-1">
                <div className="font-bold text-neutral-200">Message:</div>
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                  {selectedInquiry.message}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-800 text-xs">
              <button
                type="button"
                onClick={e => handleReplyEmail(e, selectedInquiry.email, selectedInquiry.name, selectedInquiry.subject)}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Reply via Email</span>
              </button>

              {selectedInquiry.phone && (
                <button
                  type="button"
                  onClick={e => handleCallPhone(e, selectedInquiry.phone)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {selectedInquiry.phone}</span>
                </button>
              )}

              <button
                type="button"
                onClick={e => handleDeleteContact(e, selectedInquiry.id, selectedInquiry.name || selectedInquiry.email)}
                className="px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Inquiry</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
