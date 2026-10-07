import React, { useState } from 'react';
import { ContactMessage } from '../../types/portfolio.js';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.js';
import { Mail, Search, MessageSquare, Phone, Copy, Check, ExternalLink, Trash2, X, Send } from 'lucide-react';

interface AdminMessagesProps {
  messages: ContactMessage[];
  onRefresh: () => void;
}

export const AdminMessages: React.FC<AdminMessagesProps> = ({ messages, onRefresh }) => {
  const { success, error } = useToast();
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const statuses = ['all', 'unread', 'read', 'replied', 'archived'];

  const filteredMessages = messages.filter(m => {
    const matchesStatus = filterStatus === 'all' || m.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery ||
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.subject.toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const handleOpenMessage = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    setInternalNotes(msg.notes || '');

    // If unread, mark read automatically
    if (msg.status === 'unread') {
      try {
        await api.updateMessageStatus(msg.id, 'read');
        onRefresh();
      } catch {
        // quiet
      }
    }
  };

  const handleUpdateStatus = async (status: ContactMessage['status']) => {
    if (!selectedMessage) return;
    try {
      await api.updateMessageStatus(selectedMessage.id, status, internalNotes);
      setSelectedMessage(prev => prev ? { ...prev, status, notes: internalNotes } : null);
      success(`Status updated to "${status}".`);
      onRefresh();
    } catch (err: any) {
      error(err.message || 'Failed to update status.');
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedMessage) return;
    try {
      await api.updateMessageStatus(selectedMessage.id, selectedMessage.status, internalNotes);
      setSelectedMessage(prev => prev ? { ...prev, notes: internalNotes } : null);
      success('Internal notes saved.');
      onRefresh();
    } catch (err: any) {
      error(err.message || 'Failed to save notes.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      await api.deleteMessage(id);
      success('Message deleted.');
      if (selectedMessage?.id === id) setSelectedMessage(null);
      onRefresh();
    } catch (err: any) {
      error(err.message || 'Failed to delete message.');
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    success(`${label} copied to clipboard.`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getWhatsAppLink = (phone: string, name: string, subject: string) => {
    const cleanDigits = phone.replace(/[^\d]/g, '');
    const prefilled = encodeURIComponent(
      `Hello ${name}, thank you for reaching out via my portfolio website regarding "${subject}".`
    );
    return `https://wa.me/${cleanDigits}?text=${prefilled}`;
  };

  const getEmailReplyLink = (email: string, name: string, subject: string) => {
    const prefilledSubject = encodeURIComponent(`Re: ${subject}`);
    const prefilledBody = encodeURIComponent(
      `Hi ${name},\n\nThank you for reaching out through my portfolio website. I would be glad to discuss this further.\n\nBest regards,\nSantosh Mishra\nhttps://santosh-mishra.dev`
    );
    return `mailto:${email}?subject=${prefilledSubject}&body=${prefilledBody}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-100">Contact Inquiries Inbox</h2>
          <p className="text-xs text-neutral-400 mt-1">
            Review incoming recruiter and collaboration messages, mark statuses, and reply directly.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search inquiries..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-neutral-900 border border-neutral-800 rounded-xl w-fit">
        {statuses.map(st => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${
              filterStatus === st
                ? 'bg-neutral-800 text-white shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {st} {st !== 'all' && `(${messages.filter(m => m.status === st).length})`}
          </button>
        ))}
      </div>

      {/* Messages List & Detail split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Message Items */}
        <div className="lg:col-span-6 space-y-3">
          {filteredMessages.length === 0 ? (
            <div className="p-8 border border-dashed border-neutral-800 rounded-2xl text-center text-xs text-neutral-500">
              No messages found under "{filterStatus}".
            </div>
          ) : (
            filteredMessages.map(msg => (
              <div
                key={msg.id}
                onClick={() => handleOpenMessage(msg)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedMessage?.id === msg.id
                    ? 'border-blue-500/50 bg-blue-500/5'
                    : 'border-neutral-800 bg-neutral-900/30 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-neutral-100">{msg.name}</span>
                      {msg.company && (
                        <span className="text-xs text-neutral-500">· {msg.company}</span>
                      )}
                      {msg.status === 'unread' && (
                        <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 font-medium">
                          New
                        </span>
                      )}
                      {msg.status === 'replied' && (
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-medium">
                          Replied
                        </span>
                      )}
                    </div>

                    <h5 className="text-xs font-semibold text-neutral-200 line-clamp-1">
                      {msg.subject}
                    </h5>

                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                      {msg.message}
                    </p>
                  </div>

                  <div className="text-[11px] text-neutral-500 tabular-nums shrink-0">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right: Message Detail Viewer */}
        <div className="lg:col-span-6">
          {selectedMessage ? (
            <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/40 space-y-6">
              
              {/* Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-800">
                <div className="space-y-1">
                  <div className="text-base font-bold text-neutral-100">{selectedMessage.name}</div>
                  <div className="text-xs text-neutral-400 flex flex-wrap items-center gap-2">
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="text-blue-400 hover:underline"
                    >
                      {selectedMessage.email}
                    </a>
                    {selectedMessage.phone && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{selectedMessage.phone}</span>
                      </>
                    )}
                    {selectedMessage.company && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{selectedMessage.company}</span>
                      </>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  title="Delete message"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Subject & Body */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-neutral-300">
                  Subject: {selectedMessage.subject}
                </div>

                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800/80 text-xs text-neutral-200 whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.message}
                </div>

                <div className="text-[11px] text-neutral-500 flex items-center justify-between pt-1">
                  <span>Sent: {new Date(selectedMessage.createdAt).toLocaleString()}</span>
                  <span>IP: {selectedMessage.ip || '127.0.0.1'}</span>
                </div>
              </div>

              {/* Quick Response Actions */}
              <div className="space-y-3 pt-2">
                <h5 className="text-xs font-semibold text-neutral-300">Reply & Contact Actions</h5>
                
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={getEmailReplyLink(selectedMessage.email, selectedMessage.name, selectedMessage.subject)}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-neutral-950 bg-neutral-100 hover:bg-white rounded-lg transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Reply via Email</span>
                  </a>

                  {selectedMessage.phone && (
                    <a
                      href={getWhatsAppLink(selectedMessage.phone, selectedMessage.name, selectedMessage.subject)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-300 bg-emerald-950 border border-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Reply via WhatsApp</span>
                    </a>
                  )}

                  <button
                    onClick={() => handleCopy(selectedMessage.email, 'Email')}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-300 border border-neutral-800 hover:border-neutral-700 bg-neutral-900 rounded-lg transition-colors"
                  >
                    {copiedField === 'Email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy Email</span>
                  </button>

                  {selectedMessage.phone && (
                    <button
                      onClick={() => handleCopy(selectedMessage.phone!, 'Phone')}
                      className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-300 border border-neutral-800 hover:border-neutral-700 bg-neutral-900 rounded-lg transition-colors"
                    >
                      {copiedField === 'Phone' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy Phone</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Status Switcher */}
              <div className="space-y-2 pt-2 border-t border-neutral-800">
                <label className="text-xs font-medium text-neutral-400">Mark Inquiry Status:</label>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {(['unread', 'read', 'replied', 'archived'] as const).map(st => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(st)}
                      className={`px-3 py-1 rounded-md capitalize transition-colors ${
                        selectedMessage.status === st
                          ? 'bg-neutral-200 text-neutral-950 font-semibold'
                          : 'border border-neutral-800 text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Internal Notes */}
              <div className="space-y-2 pt-2 border-t border-neutral-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-neutral-400">Internal Admin Notes</label>
                  <button
                    onClick={handleSaveNotes}
                    className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                  >
                    Save Notes
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={internalNotes}
                  onChange={e => setInternalNotes(e.target.value)}
                  placeholder="Private internal notes regarding interview dates or followup steps..."
                  className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-200 focus:outline-hidden"
                />
              </div>

            </div>
          ) : (
            <div className="p-12 border border-dashed border-neutral-800 rounded-2xl text-center text-xs text-neutral-500">
              Select an inquiry on the left to review details and generate reply links.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
