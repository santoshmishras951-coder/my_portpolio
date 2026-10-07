import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebaseClient.js';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useToast } from '../../context/ToastContext.js';
import { 
  User, 
  Mail, 
  Trash2, 
  Search, 
  RefreshCw, 
  Phone, 
  Users,
  Inbox,
  MessageSquare
} from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const { success, error } = useToast();
  const [activeView, setActiveTab] = useState<'contacts' | 'users'>('contacts');
  const [contacts, setContacts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      // Fetch Contact Form Submissions from Firestore
      const contactsSnap = await getDocs(collection(db, 'contacts'));
      const contactsList = contactsSnap.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      setContacts(contactsList);

      // Fetch Registered User Accounts from Firestore
      const usersSnap = await getDocs(collection(db, 'users'));
      const usersList = usersSnap.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      setUsers(usersList);
    } catch (err: any) {
      console.error('[Firestore Admin Fetch Error]', err);
      error('Failed to fetch records from Firestore.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleDeleteContact = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the form submission from "${name}"?`)) return;
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, 'contacts', id));
      setContacts(prev => prev.filter(c => c.id !== id));
      success(`Form submission from "${name}" deleted successfully.`);
    } catch (err: any) {
      console.error('[Delete Error]', err);
      error('Failed to delete submission from Firestore.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteUser = async (id: string, email: string) => {
    if (!window.confirm(`Are you sure you want to delete user account "${email || id}"?`)) return;
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, 'users', id));
      setUsers(prev => prev.filter(u => u.id !== id));
      success(`User account "${email || id}" deleted successfully.`);
    } catch (err: any) {
      console.error('[Delete User Error]', err);
      error('Failed to delete user account from Firestore.');
    } finally {
      setDeletingId(null);
    }
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

    // Primary: Mailto link for default email client
    const mailtoUrl = `mailto:${cleanEmail}?subject=${sub}&body=${body}`;
    window.location.href = mailtoUrl;

    // Fallback: Gmail compose on the web in new tab
    setTimeout(() => {
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(cleanEmail)}&su=${sub}&body=${body}`;
      window.open(gmailUrl, '_blank');
    }, 400);

    success(`Redirecting to email compose for ${cleanEmail}...`);
  };

  const handleCallPhone = (e: React.MouseEvent, phone?: string) => {
    e.stopPropagation();
    const cleanPhone = (phone || '').replace(/[^\d+]/g, '');
    if (!cleanPhone) {
      error('No phone number available to call.');
      return;
    }
    window.location.href = `tel:${cleanPhone}`;
  };

  const handleWhatsApp = (e: React.MouseEvent, phone?: string, name?: string, subject?: string) => {
    e.stopPropagation();
    const cleanPhone = (phone || '').replace(/[^\d]/g, '');
    if (!cleanPhone) {
      error('No phone number provided for WhatsApp.');
      return;
    }
    const prefilledText = encodeURIComponent(
      `Hi ${name || 'there'}, thank you for contacting me via my portfolio regarding "${subject || 'your inquiry'}".`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${prefilledText}`, '_blank');
  };

  const filteredContacts = contacts.filter(c => {
    const q = searchQuery.toLowerCase();
    return !searchQuery ||
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.subject && c.subject.toLowerCase().includes(q)) ||
      (c.organization && c.organization.toLowerCase().includes(q)) ||
      (c.message && c.message.toLowerCase().includes(q));
  });

  const filteredUsers = users.filter(u => {
    const q = searchQuery.toLowerCase();
    return !searchQuery ||
      (u.displayName && u.displayName.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.phone && u.phone.toLowerCase().includes(q)) ||
      (u.uid && u.uid.toLowerCase().includes(q));
  });

  const formatTimestamp = (ts: any) => {
    if (!ts) return 'Recently';
    if (ts.toDate) return ts.toDate().toLocaleString();
    if (typeof ts === 'string' || typeof ts === 'number') return new Date(ts).toLocaleString();
    return 'Recently';
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-100 flex items-center gap-2">
            <span>User Submissions & Registered Accounts</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Manage everyone who filled out the contact form or created an account. You can review details and delete records directly.
          </p>
        </div>

        <button
          onClick={fetchRecords}
          disabled={loading}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-neutral-200 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 rounded-xl transition-all shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-neutral-900 border border-neutral-800 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('contacts')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeView === 'contacts'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Form Submissions ({contacts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeView === 'users'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>User Accounts ({users.length})</span>
          </button>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, subject..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-100 placeholder:text-neutral-500 focus:outline-hidden focus:border-blue-500"
          />
        </div>
      </div>

      {/* VIEW 1: CONTACT FORM SUBMISSIONS */}
      {activeView === 'contacts' && (
        <div className="space-y-4">
          {loading ? (
            <div className="p-12 text-center text-xs text-neutral-500">Loading form submissions from Firestore...</div>
          ) : filteredContacts.length === 0 ? (
            <div className="p-12 border border-dashed border-neutral-800 rounded-2xl text-center space-y-2">
              <Inbox className="w-8 h-8 text-neutral-600 mx-auto" />
              <div className="text-xs font-semibold text-neutral-400">No form submissions found</div>
              <p className="text-[11px] text-neutral-500">Submissions filled out by visitors on your website will appear here in real-time.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredContacts.map(c => (
                <div key={c.id} className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/40 hover:border-neutral-700 transition-all space-y-4">
                  
                  {/* Top Bar: Name, Email, Phone, Organization & Actions */}
                  <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-neutral-800">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black text-neutral-100">{c.name || 'Anonymous Submitter'}</span>
                        {c.organization && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-800 text-neutral-300 border border-neutral-700">
                            {c.organization}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400">
                        <button
                          type="button"
                          onClick={e => handleReplyEmail(e, c.email, c.name, c.subject)}
                          className="text-blue-400 hover:underline flex items-center gap-1 cursor-pointer font-mono"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>{c.email}</span>
                        </button>
                        {c.phone && (
                          <button
                            type="button"
                            onClick={e => handleCallPhone(e, c.phone)}
                            className="flex items-center gap-1 text-emerald-400 hover:underline cursor-pointer font-mono"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>{c.phone}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={e => handleReplyEmail(e, c.email, c.name, c.subject)}
                        className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                        title="Redirect to email compose"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Email Reply</span>
                      </button>

                      <button
                        type="button"
                        onClick={e => handleCallPhone(e, c.phone)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                        title="Call user directly"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call User</span>
                      </button>

                      <button
                        type="button"
                        onClick={e => handleWhatsApp(e, c.phone, c.name, c.subject)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400 hover:bg-emerald-900 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                        title="Redirect to user's WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </button>

                      <button
                        type="button"
                        disabled={deletingId === c.id}
                        onClick={() => handleDeleteContact(c.id, c.name || c.email)}
                        className="px-3.5 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        title="Delete this submission"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Subject & Message Content */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-neutral-200">
                      Subject: <span className="text-neutral-100 font-semibold">{c.subject || 'General Portfolio Inquiry'}</span>
                    </div>

                    <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800/80 text-xs text-neutral-300 whitespace-pre-wrap leading-relaxed font-sans">
                      {c.message}
                    </div>
                  </div>

                  {/* Footer Meta */}
                  <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1 font-mono">
                    <span>Submitted: {formatTimestamp(c.createdAt)}</span>
                    <span>Document ID: {c.id}</span>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: REGISTERED USER ACCOUNTS */}
      {activeView === 'users' && (
        <div className="space-y-4">
          {loading ? (
            <div className="p-12 text-center text-xs text-neutral-500">Loading registered users from Firestore...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 border border-dashed border-neutral-800 rounded-2xl text-center space-y-2">
              <Users className="w-8 h-8 text-neutral-600 mx-auto" />
              <div className="text-xs font-semibold text-neutral-400">No user accounts found</div>
              <p className="text-[11px] text-neutral-500">User accounts created via sign-in/sign-up before filling the form will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredUsers.map(u => (
                <div key={u.id} className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/40 hover:border-neutral-700 transition-all space-y-3">
                  
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${u.isGuest || u.role === 'guest' ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400' : 'bg-blue-600/10 border border-blue-500/20 text-blue-400'} font-bold flex items-center justify-center text-sm shrink-0`}>
                        {(u.displayName || u.email || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-neutral-100">{u.displayName || 'Portfolio User'}</h4>
                          {(u.isGuest || u.role === 'guest') && (
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                              Guest (1-Hr)
                            </span>
                          )}
                        </div>
                        {u.email && !u.email.includes('@guest.portfolio') && (
                          <button
                            type="button"
                            onClick={e => handleReplyEmail(e, u.email, u.displayName)}
                            className="text-xs text-blue-400 hover:underline font-mono block text-left cursor-pointer"
                          >
                            {u.email}
                          </button>
                        )}
                        {u.phone && (
                          <div className="text-xs text-amber-300 font-mono flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 text-amber-400" />
                            <span>{u.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={deletingId === u.id}
                      onClick={() => handleDeleteUser(u.id, u.email || u.displayName || u.phone)}
                      className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer disabled:opacity-50"
                      title="Delete User Account"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Actions for users with phone */}
                  {u.phone && (
                    <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-neutral-800/60">
                      <button
                        type="button"
                        onClick={e => handleCallPhone(e, u.phone)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Call User</span>
                      </button>

                      <button
                        type="button"
                        onClick={e => handleWhatsApp(e, u.phone, u.displayName)}
                        className="px-3 py-1.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </button>
                    </div>
                  )}

                  <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 text-[11px] text-neutral-400 space-y-1 font-mono">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">UID:</span>
                      <span className="text-neutral-300 truncate max-w-[160px]">{u.uid || u.id}</span>
                    </div>
                    {u.phone && (
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Phone:</span>
                        <span className="text-neutral-200">{u.phone}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Last Login:</span>
                      <span className="text-neutral-300">{formatTimestamp(u.lastLoginAt)}</span>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
