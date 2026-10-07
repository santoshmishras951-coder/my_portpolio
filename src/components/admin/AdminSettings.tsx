import React, { useState } from 'react';
import { SiteSettings } from '../../types/portfolio.js';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.js';
import { Lock, Save, Bell, Shield, Sliders } from 'lucide-react';

interface AdminSettingsProps {
  settings: SiteSettings;
  onRefresh: () => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ settings, onRefresh }) => {
  const { success, error } = useToast();

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Settings state
  const [formData, setFormData] = useState({
    notificationEmail: settings.notificationEmail || 'santoshmishras951@gmail.com',
    emailNotificationsEnabled: settings.emailNotificationsEnabled || false,
    allowPublicResumeDownload: settings.allowPublicResumeDownload !== false,
    showAvailabilityBadge: settings.showAvailabilityBadge !== false,
    privacyPolicyContent: settings.privacyPolicyContent || ''
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      error('New passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      error('New password must be at least 8 characters long.');
      return;
    }

    setIsChangingPassword(true);
    try {
      await api.changePassword({ currentPassword, newPassword });
      success('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      error(err.message || 'Failed to change password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      await api.updateSettings(formData);
      success('Site preferences saved.');
      onRefresh();
    } catch (err: any) {
      error(err.message || 'Failed to update preferences.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-neutral-100">Site Settings & Security</h2>
        <p className="text-xs text-neutral-400 mt-1">
          Update administrative password, notification recipients, and public display toggles.
        </p>
      </div>

      {/* Security Credentials Box */}
      <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/40 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-neutral-100">
          <Lock className="w-4 h-4 text-blue-400" />
          <span>Change Administrative Password</span>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4 text-xs max-w-md">
          <div className="space-y-1">
            <label className="font-medium text-neutral-300">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="font-medium text-neutral-300">New Password (min 8 characters)</label>
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="font-medium text-neutral-300">Confirm New Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-hidden"
            />
          </div>

          <button
            type="submit"
            disabled={isChangingPassword}
            className="flex items-center gap-1.5 px-4 py-2 font-semibold text-neutral-950 bg-neutral-100 hover:bg-white rounded-lg transition-colors disabled:opacity-50"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{isChangingPassword ? 'Updating...' : 'Update Password'}</span>
          </button>
        </form>
      </div>

      {/* General Settings & Toggles */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        
        <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/40 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-neutral-100">
            <Bell className="w-4 h-4 text-amber-400" />
            <span>Notification Preferences</span>
          </div>

          <div className="space-y-1.5 max-w-md">
            <label className="text-xs font-medium text-neutral-300">Inquiry Notification Email</label>
            <input
              type="email"
              required
              value={formData.notificationEmail}
              onChange={e => setFormData({ ...formData, notificationEmail: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-hidden"
            />
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/40 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-neutral-100">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span>Display & Feature Toggles</span>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.allowPublicResumeDownload}
                onChange={e => setFormData({ ...formData, allowPublicResumeDownload: e.target.checked })}
                className="rounded border-neutral-800"
              />
              <span>Enable public "Download Resume" button across hero, navbar, and resume sections</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.showAvailabilityBadge}
                onChange={e => setFormData({ ...formData, showAvailabilityBadge: e.target.checked })}
                className="rounded border-neutral-800"
              />
              <span>Show glowing availability status indicator on hero</span>
            </label>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/40 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-neutral-100">
            <Shield className="w-4 h-4 text-purple-400" />
            <span>Privacy Policy Statement</span>
          </div>

          <div className="space-y-1">
            <textarea
              rows={4}
              value={formData.privacyPolicyContent}
              onChange={e => setFormData({ ...formData, privacyPolicyContent: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-hidden"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSavingSettings}
            className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-neutral-950 bg-neutral-100 hover:bg-white rounded-xl transition-colors disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSavingSettings ? 'Saving...' : 'Save Site Settings'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
