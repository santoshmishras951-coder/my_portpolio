import React, { useState, useEffect, useCallback } from 'react';
import { api } from './services/api.js';
import { PortfolioData } from './types/portfolio.js';
import { ThemeProvider } from './context/ThemeContext.js';
import { ToastProvider, useToast } from './context/ToastContext.js';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { GuestSessionProvider } from './context/GuestSessionContext.js';

// Public Components
import { Navbar } from './components/public/Navbar.js';
import { HeroSection } from './components/public/HeroSection.js';
import { AboutSection } from './components/public/AboutSection.js';
import { SkillsSection } from './components/public/SkillsSection.js';
import { ProjectsSection } from './components/public/ProjectsSection.js';
import { ExperienceSection } from './components/public/ExperienceSection.js';
import { EducationSection } from './components/public/EducationSection.js';
import { AchievementsSection } from './components/public/AchievementsSection.js';
import { ResumeSection } from './components/public/ResumeSection.js';
import { ContactSection } from './components/public/ContactSection.js';
import { Footer } from './components/public/Footer.js';
import { PrivacyModal } from './components/public/PrivacyModal.js';
import { ResumeViewerModal } from './components/public/ResumeViewerModal.js';
import { WhatsAppModal } from './components/public/WhatsAppModal.js';
import { AdminCodeModal } from './components/public/AdminCodeModal.js';
import { MobileBottomNav } from './components/public/MobileBottomNav.js';
import { BackToTop } from './components/public/BackToTop.js';
import { ProgressBar } from './components/public/ProgressBar.js';

// Admin Components
import { AdminLogin } from './components/admin/AdminLogin.js';
import { AdminLayout } from './components/admin/AdminLayout.js';

function PortfolioApp() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { error } = useToast();

  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAdmin, setShowAdmin] = useState(() => {
    return window.location.hash === '#admin';
  });
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [resumeViewerOpen, setResumeViewerOpen] = useState(false);
  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);
  const [showAdminCodeModal, setShowAdminCodeModal] = useState(false);

  // Synchronize URL hash with admin state
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        const codeVerified = sessionStorage.getItem('admin_code_verified') === 'true';
        if (!codeVerified && !isAuthenticated) {
          window.location.hash = '';
          setShowAdmin(false);
          setShowAdminCodeModal(true);
        } else {
          setShowAdmin(true);
        }
      } else {
        setShowAdmin(false);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAuthenticated]);

  const fetchData = useCallback(async () => {
    try {
      // In admin mode, load all items; in public mode, load public items
      const [
        profile,
        skills,
        projects,
        experience,
        education,
        achievements,
        resumeRes,
        socialLinks,
        settings
      ] = await Promise.all([
        api.getProfile(),
        api.getSkills(),
        api.getProjects(),
        api.getExperience(),
        api.getEducation(),
        api.getAchievements(),
        api.getCurrentResume(),
        api.getSocialLinks(),
        api.getSettings()
      ]);

      // If authenticated, we also fetch admin messages and media
      let messages: any[] = [];
      let media: any[] = [];
      let allResumes: any[] = resumeRes.current ? [resumeRes.current] : [];

      if (localStorage.getItem('santosh_admin_token')) {
        try {
          const [adminMsgs, adminMedia, adminResumes] = await Promise.all([
            api.getMessages(),
            api.getMedia(),
            api.getAllResumes()
          ]);
          messages = adminMsgs;
          media = adminMedia;
          allResumes = adminResumes;
        } catch {
          // not critical
        }
      }

      const fullData: PortfolioData = {
        profile,
        skills,
        projects,
        experience,
        education,
        achievements,
        resumes: allResumes,
        messages,
        socialLinks,
        settings: settings as any,
        media
      };

      setData(fullData);

      // Dynamically update document title & meta tags from site settings
      if (settings?.siteTitle) {
        document.title = settings.siteTitle;
      }
      if (settings?.metaDescription) {
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', settings.metaDescription);
      }
    } catch (err: any) {
      console.error('Failed to load portfolio data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenAdmin = () => {
    const codeVerified = sessionStorage.getItem('admin_code_verified') === 'true';
    if (isAuthenticated || codeVerified) {
      window.location.hash = '#admin';
      setShowAdmin(true);
    } else {
      setShowAdminCodeModal(true);
    }
  };

  const handleExitAdmin = () => {
    sessionStorage.removeItem('admin_code_verified');
    window.location.hash = '';
    setShowAdmin(false);
    fetchData(); // refresh public data
  };

  if (loading || authLoading || !data) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center space-y-4 text-neutral-400">
        <div className="w-8 h-8 rounded-full border-2 border-neutral-700 border-t-neutral-200 animate-spin" />
        <div className="text-xs font-medium tracking-wide">Loading Portfolio...</div>
      </div>
    );
  }

  // Admin View
  if (showAdmin) {
    if (!isAuthenticated) {
      return <AdminLogin onBackToPublic={handleExitAdmin} />;
    }
    return (
      <AdminLayout
        data={data}
        onRefreshData={fetchData}
        onExitToPublic={handleExitAdmin}
      />
    );
  }

  // Public View
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans transition-colors duration-200">
      <ProgressBar />
      
      <Navbar
        onOpenAdmin={handleOpenAdmin}
        onOpenResume={() => setResumeViewerOpen(true)}
        onOpenWhatsApp={() => setWhatsAppModalOpen(true)}
      />

      <main className="flex-1 pb-16 md:pb-0">
        <HeroSection
          profile={data.profile}
          socialLinks={data.socialLinks}
          onOpenResume={() => setResumeViewerOpen(true)}
          onOpenWhatsApp={() => setWhatsAppModalOpen(true)}
          onAvatarUpdated={fetchData}
        />

        <AboutSection
          profile={data.profile}
        />

        <SkillsSection
          skills={data.skills}
        />

        <ProjectsSection
          projects={data.projects}
        />

        <ExperienceSection
          experience={data.experience}
        />

        <EducationSection
          education={data.education}
        />

        <AchievementsSection
          achievements={data.achievements}
        />

        <ResumeSection
          currentResume={data.resumes.find(r => r.isCurrent) || data.resumes[0] || null}
          onOpenResume={() => setResumeViewerOpen(true)}
        />

        <ContactSection
          email={data.profile.email}
          phone={data.profile.phone}
          location={data.profile.location}
          onOpenPrivacy={() => setPrivacyOpen(true)}
          onOpenWhatsApp={() => setWhatsAppModalOpen(true)}
        />
      </main>

      <Footer
        name={data.profile.name}
        socialLinks={data.socialLinks}
        onOpenAdmin={handleOpenAdmin}
        onOpenPrivacy={() => setPrivacyOpen(true)}
      />

      <PrivacyModal
        isOpen={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
        customContent={data.settings?.privacyPolicyContent}
      />

      <ResumeViewerModal
        isOpen={resumeViewerOpen}
        onClose={() => setResumeViewerOpen(false)}
        profile={data.profile}
        skills={data.skills}
        projects={data.projects}
        experience={data.experience}
        education={data.education}
      />

      <WhatsAppModal
        isOpen={whatsAppModalOpen}
        onClose={() => setWhatsAppModalOpen(false)}
        phoneNumber={data.profile.phone || '9668139559'}
        name={data.profile.name}
      />

      <AdminCodeModal
        isOpen={showAdminCodeModal}
        onClose={() => setShowAdminCodeModal(false)}
        onSuccess={() => {
          setShowAdminCodeModal(false);
          window.location.hash = '#admin';
          setShowAdmin(true);
          fetchData();
        }}
      />

      {/* Instagram / Facebook App-Style Mobile Bottom Navigation Dock */}
      <MobileBottomNav
        onOpenResume={() => setResumeViewerOpen(true)}
        onOpenWhatsApp={() => setWhatsAppModalOpen(true)}
      />

      <BackToTop />

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <GuestSessionProvider>
            <PortfolioApp />
          </GuestSessionProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
