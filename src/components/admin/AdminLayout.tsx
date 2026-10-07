import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { PortfolioData } from '../../types/portfolio.js';
import { AdminOverview } from './AdminOverview.js';
import { AdminProfile } from './AdminProfile.js';
import { AdminProjects } from './AdminProjects.js';
import { AdminSkills } from './AdminSkills.js';
import { AdminExperience } from './AdminExperience.js';
import { AdminEducation } from './AdminEducation.js';
import { AdminAchievements } from './AdminAchievements.js';
import { AdminResume } from './AdminResume.js';
import { AdminMessages } from './AdminMessages.js';
import { AdminUsers } from './AdminUsers.js';
import { AdminSocials } from './AdminSocials.js';
import { AdminMedia } from './AdminMedia.js';
import { AdminSEO } from './AdminSEO.js';
import { AdminSettings } from './AdminSettings.js';
import { AdminCodeModal } from '../public/AdminCodeModal.js';
import {
  LayoutDashboard,
  User,
  FolderGit2,
  Wrench,
  Briefcase,
  GraduationCap,
  Trophy,
  FileText,
  Mail,
  Share2,
  Image,
  Globe,
  Settings,
  LogOut,
  ExternalLink,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

interface AdminLayoutProps {
  data: PortfolioData;
  onRefreshData: () => void;
  onExitToPublic: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  data,
  onRefreshData,
  onExitToPublic
}) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [showExitModal, setShowExitModal] = useState(false);

  const unreadCount = data.messages.filter(m => m.status === 'unread').length;

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'Profile & Hero', icon: User },
    { id: 'projects', label: 'Projects Showcase', icon: FolderGit2, badge: data.projects.length },
    { id: 'skills', label: 'Skills & Tech', icon: Wrench, badge: data.skills.length },
    { id: 'experience', label: 'Experience Timeline', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'resume', label: 'Resume & CV', icon: FileText },
    { id: 'messages', label: 'Contact Messages', icon: Mail, alertBadge: unreadCount > 0 ? unreadCount : undefined },
    { id: 'users', label: 'Registered Users', icon: User },
    { id: 'socials', label: 'Social Links', icon: Share2 },
    { id: 'media', label: 'Media Library', icon: Image },
    { id: 'seo', label: 'SEO & Metadata', icon: Globe },
    { id: 'settings', label: 'Settings & Security', icon: Settings },
  ];

  const handleLogout = () => {
    setShowExitModal(true);
  };

  const currentTabItem = navItems.find(i => i.id === activeTab);

  return (
    <div className="min-h-screen flex bg-neutral-950 text-neutral-100 font-sans">
      
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar (260px wide, single elevation) */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 border-r border-neutral-800 bg-neutral-950 flex flex-col justify-between transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-5 space-y-6 flex-1 overflow-y-auto scrollbar-thin">
          
          {/* Brand Wordmark & Role */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-sm font-bold text-neutral-100 block">
                Santosh Mishra
              </span>
              <span className="text-[11px] text-neutral-500 font-medium">
                Portfolio CMS Admin
              </span>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-neutral-800 text-white shadow-xs'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-neutral-500'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.alertBadge !== undefined && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 tabular-nums">
                      {item.alertBadge}
                    </span>
                  )}
                  {item.badge !== undefined && item.alertBadge === undefined && (
                    <span className="text-[10px] text-neutral-500 tabular-nums">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

        </div>

        {/* Sidebar Footer User info & logout */}
        <div className="p-4 border-t border-neutral-800/80 space-y-2 bg-neutral-950">
          <div className="flex items-center justify-between text-xs px-2">
            <span className="text-neutral-400 truncate max-w-[130px] font-mono text-[11px]">
              {user?.email || 'admin'}
            </span>
            <button
              onClick={handleLogout}
              className="p-1 text-neutral-500 hover:text-rose-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setShowExitModal(true)}
            className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-neutral-300 border border-neutral-800 hover:border-neutral-700 rounded-lg hover:bg-neutral-900 transition-colors cursor-pointer"
          >
            <span>Preview Public Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Bar Contract (Zone 1: Breadcrumbs, Zone 2: Empty/Status, Zone 3: Actions) */}
        <header className="sticky top-0 z-30 h-16 border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 text-neutral-400 hover:text-white lg:hidden rounded-md"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <span>Admin CMS</span>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
              <span className="font-semibold text-neutral-100">{currentTabItem?.label || 'Overview'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowExitModal(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-300 border border-neutral-800 hover:border-neutral-700 rounded-lg bg-neutral-900 transition-colors cursor-pointer"
            >
              <span>View Public Portfolio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Tab Viewport */}
        <main className="flex-1 p-4 sm:p-8 max-w-6xl w-full mx-auto">
          {activeTab === 'overview' && (
            <AdminOverview data={data} onNavigateTab={tab => setActiveTab(tab)} />
          )}

          {activeTab === 'profile' && (
            <AdminProfile
              profile={data.profile}
              onProfileUpdated={() => onRefreshData()}
            />
          )}

          {activeTab === 'projects' && (
            <AdminProjects
              projects={data.projects}
              onRefresh={onRefreshData}
            />
          )}

          {activeTab === 'skills' && (
            <AdminSkills
              skills={data.skills}
              onRefresh={onRefreshData}
            />
          )}

          {activeTab === 'experience' && (
            <AdminExperience
              experience={data.experience}
              onRefresh={onRefreshData}
            />
          )}

          {activeTab === 'education' && (
            <AdminEducation
              education={data.education}
              onRefresh={onRefreshData}
            />
          )}

          {activeTab === 'achievements' && (
            <AdminAchievements
              achievements={data.achievements}
              onRefresh={onRefreshData}
            />
          )}

          {activeTab === 'resume' && (
            <AdminResume
              resumes={data.resumes}
              onRefresh={onRefreshData}
            />
          )}

          {activeTab === 'messages' && (
            <AdminMessages
              messages={data.messages}
              onRefresh={onRefreshData}
            />
          )}

          {activeTab === 'users' && (
            <AdminUsers />
          )}

          {activeTab === 'socials' && (
            <AdminSocials
              socials={data.socialLinks}
              onRefresh={onRefreshData}
            />
          )}

          {activeTab === 'media' && (
            <AdminMedia
              media={data.media}
              onRefresh={onRefreshData}
            />
          )}

          {activeTab === 'seo' && (
            <AdminSEO
              settings={data.settings}
              onRefresh={onRefreshData}
            />
          )}

          {activeTab === 'settings' && (
            <AdminSettings
              settings={data.settings}
              onRefresh={onRefreshData}
            />
          )}
        </main>
      </div>

      <AdminCodeModal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        mode="exit"
        onSuccess={() => {
          setShowExitModal(false);
          logout();
          onExitToPublic();
        }}
      />

    </div>
  );
};
