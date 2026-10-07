import React, { useState } from 'react';
import { Profile } from '../../types/portfolio.js';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.js';
import { Save, User } from 'lucide-react';

interface AdminProfileProps {
  profile: Profile;
  onProfileUpdated: (updated: Profile) => void;
}

export const AdminProfile: React.FC<AdminProfileProps> = ({ profile, onProfileUpdated }) => {
  const { success, error } = useToast();
  const fixedPortraitPhoto = '/src/assets/images/santosh_yy.jpeg';

  const [formData, setFormData] = useState({
    name: profile.name || '',
    headline: profile.headline || '',
    subheadline: profile.subheadline || '',
    typingTitles: (profile.typingTitles || []).join(', '),
    bio: profile.bio || '',
    location: profile.location || '',
    currentStatus: profile.currentStatus || '',
    availabilityStatus: profile.availabilityStatus || '',
    avatarUrl: fixedPortraitPhoto,
    email: profile.email || '',
    phone: profile.phone || '',
    philosophy: profile.philosophy || '',
    interests: (profile.interests || []).join(', ')
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload: Partial<Profile> = {
        name: formData.name.trim(),
        headline: formData.headline.trim(),
        subheadline: formData.subheadline.trim(),
        typingTitles: formData.typingTitles.split(',').map(s => s.trim()).filter(Boolean),
        bio: formData.bio.trim(),
        location: formData.location.trim(),
        currentStatus: formData.currentStatus.trim(),
        availabilityStatus: formData.availabilityStatus.trim(),
        avatarUrl: fixedPortraitPhoto,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        philosophy: formData.philosophy.trim(),
        interests: formData.interests.split(',').map(s => s.trim()).filter(Boolean)
      };

      const res = await api.updateProfile(payload);
      onProfileUpdated(res.profile);
      success('Profile details saved and updated live on the portfolio.');
    } catch (err: any) {
      error(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-neutral-100">Profile Management</h2>
        <p className="text-xs text-neutral-400 mt-1">
          Edit your core identity, hero headlines, availability badge, bio, and academic status.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Fixed Avatar Section */}
        <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/40 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950 shrink-0">
            <img
              src={fixedPortraitPhoto}
              alt="Profile Avatar"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-1 text-center sm:text-left flex-1">
            <h4 className="text-sm font-semibold text-neutral-200">Official Profile Photo</h4>
            <p className="text-xs text-neutral-400 font-medium">
              Santosh Mishra's formal suit portrait is permanently set as the official profile photo.
            </p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-md text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
              Formal Suit Portrait Locked
            </span>
          </div>
        </div>

        {/* Identity & Headline Fields */}
        <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/40 space-y-4">
          <h3 className="text-sm font-bold text-neutral-200">Personal Details & Headlines</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-300">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-hidden"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-300">Location *</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-300">Professional Headline *</label>
            <input
              type="text"
              required
              value={formData.headline}
              onChange={e => setFormData({ ...formData, headline: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-300">
              Hero Rotating Typing Roles (comma-separated)
            </label>
            <input
              type="text"
              value={formData.typingTitles}
              onChange={e => setFormData({ ...formData, typingTitles: e.target.value })}
              placeholder="Frontend Developer, Web Developer, Software Engineering Enthusiast"
              className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-300">Supporting Subheadline</label>
            <textarea
              rows={2}
              value={formData.subheadline}
              onChange={e => setFormData({ ...formData, subheadline: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-300">Current Academic Status</label>
              <input
                type="text"
                value={formData.currentStatus}
                onChange={e => setFormData({ ...formData, currentStatus: e.target.value })}
                placeholder="3rd-year B.Tech CSE student"
                className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-hidden"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-300">Availability Badge Text</label>
              <input
                type="text"
                value={formData.availabilityStatus}
                onChange={e => setFormData({ ...formData, availabilityStatus: e.target.value })}
                placeholder="Open to internships & software opportunities"
                className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Bio, Philosophy, and Interests */}
        <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/40 space-y-4">
          <h3 className="text-sm font-bold text-neutral-200">About Narrative & Philosophy</h3>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-300">Full Bio</label>
            <textarea
              rows={5}
              value={formData.bio}
              onChange={e => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-300">Engineering Philosophy Quote</label>
            <input
              type="text"
              value={formData.philosophy}
              onChange={e => setFormData({ ...formData, philosophy: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-300">Technical Interests (comma-separated)</label>
            <input
              type="text"
              value={formData.interests}
              onChange={e => setFormData({ ...formData, interests: e.target.value })}
              placeholder="Frontend Engineering, Distributed Web Systems, Database Architecture"
              className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/40 space-y-4">
          <h3 className="text-sm font-bold text-neutral-200">Contact Information</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-300">Public Contact Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-hidden"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-300">Phone (Optional)</label>
              <input
                type="text"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 9668139559"
                className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-neutral-950 bg-neutral-100 hover:bg-white rounded-xl transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
