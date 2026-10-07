export type SkillCategory = 'Frontend' | 'Backend' | 'Database' | 'Programming' | 'Tools' | 'Cloud' | 'Other';
export type SkillProficiency = 'Beginner' | 'Intermediate' | 'Proficient' | 'Advanced';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency: SkillProficiency;
  yearsExperience?: string;
  description?: string;
  displayOrder: number;
  isVisible: boolean;
}

export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  detailedDescription: string;
  category: string;
  projectImage: string;
  galleryImages: string[];
  technologies: string[];
  githubUrl?: string;
  liveDemoUrl?: string;
  caseStudyUrl?: string;
  startDate?: string;
  completionDate?: string;
  isFeatured: boolean;
  displayOrder: number;
  challenges?: string;
  solution?: string;
  keyFeatures: string[];
  myContribution?: string;
  results?: string;
  architectureExplanation?: string;
  isVisible: boolean;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  employmentType: string;
  location: string;
  startDate: string;
  endDate?: string;
  currentlyWorking: boolean;
  description: string;
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
  companyLogo?: string;
  companyUrl?: string;
  displayOrder: number;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  currentStatus: string;
  grade?: string;
  description?: string;
  institutionLogo?: string;
  certificateLink?: string;
  displayOrder: number;
}

export interface Achievement {
  id: string;
  title: string;
  organization: string;
  date: string;
  description: string;
  certificateImage?: string;
  verificationUrl?: string;
  category: 'Hackathon' | 'Internship' | 'Academic' | 'Certification' | 'Competition' | 'Other';
  displayOrder: number;
}

export interface ResumeItem {
  id: string;
  title: string;
  fileUrl: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  version: string;
  isCurrent: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  ip?: string;
  notes?: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  iconName: string;
  displayName: string;
  isVisible: boolean;
  displayOrder: number;
}

export interface Profile {
  name: string;
  headline: string;
  subheadline: string;
  typingTitles: string[];
  bio: string;
  location: string;
  currentStatus: string;
  availabilityStatus: string;
  avatarUrl: string;
  email: string;
  phone?: string;
  philosophy?: string;
  interests?: string[];
}

export interface SiteSettings {
  siteTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalUrl: string;
  notificationEmail: string;
  emailNotificationsEnabled: boolean;
  allowPublicResumeDownload: boolean;
  showAvailabilityBadge: boolean;
  analyticsNoticeEnabled: boolean;
  privacyPolicyContent: string;
}

export interface MediaItem {
  id: string;
  name: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
}

export interface PortfolioData {
  profile: Profile;
  skills: Skill[];
  projects: Project[];
  experience: Experience[];
  education: Education[];
  achievements: Achievement[];
  resumes: ResumeItem[];
  messages: ContactMessage[];
  socialLinks: SocialLink[];
  settings: SiteSettings;
  media: MediaItem[];
}
