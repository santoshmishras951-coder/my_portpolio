import {
  Profile,
  Skill,
  Project,
  Experience,
  Education,
  Achievement,
  ResumeItem,
  ContactMessage,
  SocialLink,
  SiteSettings,
  MediaItem
} from '../types/portfolio.js';
import { saveContactMessageToFirestore } from './firebaseClient.js';
import { saveContactMessageToSupabase } from './supabaseClient.js';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('santosh_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(errorData.error || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Public
  getProfile: () => fetch(`${API_BASE}/profile`).then(res => handleResponse<Profile>(res)),
  getSkills: () => fetch(`${API_BASE}/skills`).then(res => handleResponse<Skill[]>(res)),
  getProjects: (category?: string) => {
    const url = category && category !== 'All' 
      ? `${API_BASE}/projects?category=${encodeURIComponent(category)}`
      : `${API_BASE}/projects`;
    return fetch(url).then(res => handleResponse<Project[]>(res));
  },
  getProjectById: (id: string) => fetch(`${API_BASE}/projects/${id}`).then(res => handleResponse<Project>(res)),
  getExperience: () => fetch(`${API_BASE}/experience`).then(res => handleResponse<Experience[]>(res)),
  getEducation: () => fetch(`${API_BASE}/education`).then(res => handleResponse<Education[]>(res)),
  getAchievements: () => fetch(`${API_BASE}/achievements`).then(res => handleResponse<Achievement[]>(res)),
  getCurrentResume: () => fetch(`${API_BASE}/resumes`).then(res => handleResponse<{ current: ResumeItem | null; allowDownload: boolean }>(res)),
  getSocialLinks: () => fetch(`${API_BASE}/socials`).then(res => handleResponse<SocialLink[]>(res)),
  getSettings: () => fetch(`${API_BASE}/settings`).then(res => handleResponse<Partial<SiteSettings>>(res)),
  
  submitContact: async (data: { name: string; email: string; phone?: string; company?: string; subject?: string; message: string }) => {
    try {
      await saveContactMessageToFirestore(data);
    } catch (err) {
      console.warn('Firestore store warning:', err);
    }
    try {
      await saveContactMessageToSupabase(data);
    } catch (err) {
      console.warn('Supabase store warning:', err);
    }
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  },

  // Auth
  login: (credentials: { username: string; password: string }) =>
    fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    }).then(res => handleResponse<{ token: string; user: { username: string; email: string } }>(res)),

  getMe: () =>
    fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    }).then(res => handleResponse<{ user: { username: string; email: string } }>(res)),

  changePassword: (passwords: { currentPassword: string; newPassword: string }) =>
    fetch(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(passwords)
    }).then(res => handleResponse<{ success: boolean; message: string }>(res)),

  // Admin Profile
  updateProfile: (profile: Partial<Profile>) =>
    fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profile)
    }).then(res => handleResponse<{ success: boolean; profile: Profile }>(res)),

  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return fetch(`${API_BASE}/profile/avatar`, {
      method: 'POST',
      body: formData
    }).then(res => handleResponse<{ success: boolean; avatarUrl: string; profile: Profile }>(res));
  },

  // Admin Skills
  getAllSkills: () => fetch(`${API_BASE}/skills/all`, { headers: getAuthHeaders() }).then(res => handleResponse<Skill[]>(res)),
  createSkill: (skill: Partial<Skill>) =>
    fetch(`${API_BASE}/skills`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(skill)
    }).then(res => handleResponse<Skill>(res)),
  updateSkill: (id: string, skill: Partial<Skill>) =>
    fetch(`${API_BASE}/skills/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(skill)
    }).then(res => handleResponse<{ success: boolean; skill: Skill }>(res)),
  deleteSkill: (id: string) =>
    fetch(`${API_BASE}/skills/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    }).then(res => handleResponse<{ success: boolean }>(res)),

  // Admin Projects
  getAllProjects: () => fetch(`${API_BASE}/projects/admin/all`, { headers: getAuthHeaders() }).then(res => handleResponse<Project[]>(res)),
  createProject: (project: Partial<Project>) =>
    fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(project)
    }).then(res => handleResponse<Project>(res)),
  updateProject: (id: string, project: Partial<Project>) =>
    fetch(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(project)
    }).then(res => handleResponse<{ success: boolean; project: Project }>(res)),
  deleteProject: (id: string) =>
    fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    }).then(res => handleResponse<{ success: boolean }>(res)),

  // Admin Experience
  createExperience: (exp: Partial<Experience>) =>
    fetch(`${API_BASE}/experience`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(exp)
    }).then(res => handleResponse<Experience>(res)),
  updateExperience: (id: string, exp: Partial<Experience>) =>
    fetch(`${API_BASE}/experience/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(exp)
    }).then(res => handleResponse<{ success: boolean; experience: Experience }>(res)),
  deleteExperience: (id: string) =>
    fetch(`${API_BASE}/experience/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    }).then(res => handleResponse<{ success: boolean }>(res)),

  // Admin Education
  createEducation: (edu: Partial<Education>) =>
    fetch(`${API_BASE}/education`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(edu)
    }).then(res => handleResponse<Education>(res)),
  updateEducation: (id: string, edu: Partial<Education>) =>
    fetch(`${API_BASE}/education/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(edu)
    }).then(res => handleResponse<{ success: boolean; education: Education }>(res)),
  deleteEducation: (id: string) =>
    fetch(`${API_BASE}/education/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    }).then(res => handleResponse<{ success: boolean }>(res)),

  // Admin Achievements
  createAchievement: (ach: Partial<Achievement>) =>
    fetch(`${API_BASE}/achievements`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(ach)
    }).then(res => handleResponse<Achievement>(res)),
  updateAchievement: (id: string, ach: Partial<Achievement>) =>
    fetch(`${API_BASE}/achievements/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(ach)
    }).then(res => handleResponse<{ success: boolean; achievement: Achievement }>(res)),
  deleteAchievement: (id: string) =>
    fetch(`${API_BASE}/achievements/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    }).then(res => handleResponse<{ success: boolean }>(res)),

  // Admin Resumes
  getAllResumes: () => fetch(`${API_BASE}/resumes/all`, { headers: getAuthHeaders() }).then(res => handleResponse<ResumeItem[]>(res)),
  createResume: (resume: Partial<ResumeItem>) =>
    fetch(`${API_BASE}/resumes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(resume)
    }).then(res => handleResponse<ResumeItem>(res)),
  setCurrentResume: (id: string) =>
    fetch(`${API_BASE}/resumes/${id}/current`, {
      method: 'PUT',
      headers: getAuthHeaders()
    }).then(res => handleResponse<{ success: boolean }>(res)),
  deleteResume: (id: string) =>
    fetch(`${API_BASE}/resumes/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    }).then(res => handleResponse<{ success: boolean }>(res)),

  // Admin Messages
  getMessages: (status?: string, search?: string) => {
    const params = new URLSearchParams();
    if (status && status !== 'all') params.append('status', status);
    if (search) params.append('search', search);
    return fetch(`${API_BASE}/admin/messages?${params.toString()}`, {
      headers: getAuthHeaders()
    }).then(res => handleResponse<ContactMessage[]>(res));
  },
  updateMessageStatus: (id: string, status: string, notes?: string) =>
    fetch(`${API_BASE}/admin/messages/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, notes })
    }).then(res => handleResponse<{ success: boolean; message: ContactMessage }>(res)),
  deleteMessage: (id: string) =>
    fetch(`${API_BASE}/admin/messages/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    }).then(res => handleResponse<{ success: boolean }>(res)),

  // Admin Socials
  getAllSocials: () => fetch(`${API_BASE}/socials/all`, { headers: getAuthHeaders() }).then(res => handleResponse<SocialLink[]>(res)),
  createSocial: (social: Partial<SocialLink>) =>
    fetch(`${API_BASE}/socials`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(social)
    }).then(res => handleResponse<SocialLink>(res)),
  updateSocial: (id: string, social: Partial<SocialLink>) =>
    fetch(`${API_BASE}/socials/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(social)
    }).then(res => handleResponse<{ success: boolean; link: SocialLink }>(res)),
  deleteSocial: (id: string) =>
    fetch(`${API_BASE}/socials/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    }).then(res => handleResponse<{ success: boolean }>(res)),

  // Admin Settings
  getAllSettings: () => fetch(`${API_BASE}/settings/all`, { headers: getAuthHeaders() }).then(res => handleResponse<SiteSettings>(res)),
  updateSettings: (settings: Partial<SiteSettings>) =>
    fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings)
    }).then(res => handleResponse<{ success: boolean; settings: SiteSettings }>(res)),

  // Admin Media
  getMedia: () => fetch(`${API_BASE}/admin/media`, { headers: getAuthHeaders() }).then(res => handleResponse<MediaItem[]>(res)),
  uploadFile: (file: File, title?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (title) formData.append('title', title);
    const token = localStorage.getItem('santosh_admin_token');
    return fetch(`${API_BASE}/admin/media/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData
    }).then(res => handleResponse<{ success: boolean; file: MediaItem }>(res));
  },
  deleteMedia: (id: string) =>
    fetch(`${API_BASE}/admin/media/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    }).then(res => handleResponse<{ success: boolean }>(res))
};
