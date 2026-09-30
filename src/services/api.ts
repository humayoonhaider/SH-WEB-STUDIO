import {
  SiteSettings,
  Service,
  Project,
  TeamMember,
  ProcessStep,
  ContactInquiry,
  SEOSettings,
  AdminUser,
  DashboardStats,
  Testimonial,
  PricingPlan,
} from '../types';
import { defaultTestimonials } from '../data/defaultTestimonials';

// Force same-origin relative paths to avoid any cached/incorrect environment variables
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const TOKEN_KEY = 'sh_admin_auth_token_v3';

// Clear any legacy insecure tokens from previous versions
try {
  localStorage.removeItem('sh_studio_admin_token');
  sessionStorage.removeItem('sh_studio_admin_token');
} catch {}

export const getToken = (): string | null => {
  // Check sessionStorage first (per-tab/session), then localStorage (persistent)
  return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string, remember = false): void => {
  if (remember) {
    localStorage.setItem(TOKEN_KEY, token);
    sessionStorage.removeItem(TOKEN_KEY);
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const removeToken = (): void => {
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_KEY);
};

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  token?: string;
  admin?: AdminUser;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  retries = 2
): Promise<ApiResponse<T>> {
  // Robust URL construction
  let cleanEndpoint = endpoint;
  let finalBaseUrl = BASE_URL;
  
  // If BASE_URL ends with /api and endpoint starts with /api, remove one /api to avoid doubling
  if (finalBaseUrl.endsWith('/api') && endpoint.startsWith('/api')) {
    cleanEndpoint = endpoint.substring(4); // Remove "/api"
  } else if (!finalBaseUrl && !endpoint.startsWith('/')) {
    cleanEndpoint = `/${endpoint}`;
  }

  const url = `${finalBaseUrl}${cleanEndpoint}`;
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (networkError: any) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return request<T>(endpoint, options, retries - 1);
    }

    // Diagnostic info for the user
    console.error('API Connection Error:', {
      url,
      method: options.method || 'GET',
      error: networkError.message,
    });

    throw new Error(`Connection failed: ${networkError.message || 'The server could not be reached.'}`);
  }

  const data = await response.json().catch(() => ({
    success: false,
    message: 'Network response was not valid JSON.',
  }));

  if (response.status === 401 && endpoint !== '/api/auth/login') {
    // Session expired
    removeToken();
    if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
      window.location.href = '/admin/login?expired=true';
    }
  }

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  auth: {
    login: (credentials: { email: string; password: string }) =>
      request<{ token: string; admin: AdminUser }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    logout: () => request<void>('/api/auth/logout', { method: 'POST' }),
    getMe: () => request<AdminUser>('/api/auth/me'),
    updateProfile: (data: { name: string; email: string }) =>
      request<AdminUser>('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    updatePassword: (data: { currentPassword: string; newPassword: string }) =>
      request<void>('/api/auth/password', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },

  settings: {
    get: () => request<SiteSettings>('/api/settings'),
    update: (data: Partial<SiteSettings>) =>
      request<SiteSettings>('/api/settings', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },

  services: {
    getPublic: () => request<Service[]>('/api/services'),
    getAll: () => request<Service[]>('/api/services/all'),
    getById: (id: string) => request<Service>(`/api/services/${id}`),
    create: (data: Partial<Service>) =>
      request<Service>('/api/services', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<Service>) =>
      request<Service>(`/api/services/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<void>(`/api/services/${id}`, {
        method: 'DELETE',
      }),
  },

  projects: {
    getPublic: () => request<Project[]>('/api/projects'),
    getAll: () => request<Project[]>('/api/projects/all'),
    getBySlug: (slug: string) => request<Project>(`/api/projects/slug/${slug}`),
    getById: (id: string) => request<Project>(`/api/projects/${id}`),
    create: (data: Partial<Project>) =>
      request<Project>('/api/projects', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<Project>) =>
      request<Project>(`/api/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<void>(`/api/projects/${id}`, {
        method: 'DELETE',
      }),
  },

  team: {
    getPublic: () => request<TeamMember[]>('/api/team'),
    getAll: () => request<TeamMember[]>('/api/team/all'),
    create: (data: Partial<TeamMember>) =>
      request<TeamMember>('/api/team', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<TeamMember>) =>
      request<TeamMember>(`/api/team/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<void>(`/api/team/${id}`, {
        method: 'DELETE',
      }),
  },

  process: {
    getPublic: () => request<ProcessStep[]>('/api/process'),
    getAll: () => request<ProcessStep[]>('/api/process/all'),
    create: (data: Partial<ProcessStep>) =>
      request<ProcessStep>('/api/process', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<ProcessStep>) =>
      request<ProcessStep>(`/api/process/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<void>(`/api/process/${id}`, {
        method: 'DELETE',
      }),
  },

  inquiries: {
    submit: (data: {
      name: string;
      business?: string;
      email: string;
      phone?: string;
      projectType?: string;
      budget?: string;
      message: string;
      honeypot?: string;
      inquiryType?: 'client' | 'developer_application';
      portfolioUrl?: string;
      githubUrl?: string;
      experience?: string;
      skills?: string;
    }) =>
      request<{ id: string }>('/api/inquiries', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getAll: (params?: { status?: string; search?: string; type?: string }) => {
      const q = new URLSearchParams();
      if (params?.status) q.set('status', params.status);
      if (params?.type) q.set('type', params.type);
      if (params?.search) q.set('search', params.search);
      const queryStr = q.toString() ? `?${q.toString()}` : '';
      return request<ContactInquiry[]>(`/api/inquiries${queryStr}`);
    },
    getById: (id: string) => request<ContactInquiry>(`/api/inquiries/${id}`),
    getAnalytics: () => request<{ daily: any[]; byType: any[] }>('/api/inquiries/analytics'),
    updateStatus: (id: string, status: string) =>
      request<ContactInquiry>(`/api/inquiries/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      }),
    delete: (id: string) =>
      request<void>(`/api/inquiries/${id}`, {
        method: 'DELETE',
      }),
  },

  seo: {
    get: () => request<SEOSettings>('/api/seo'),
    update: (data: Partial<SEOSettings>) =>
      request<SEOSettings>('/api/seo', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    getSearchConsole: (googleAccessToken: string) =>
      request<any>('/api/seo/search-console', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${googleAccessToken}`,
        },
      }),
  },

  stats: {
    get: () => request<DashboardStats>('/api/stats'),
  },

  testimonials: {
    getAll: async () => {
      try {
        const res = await request<Testimonial[]>('/api/testimonials');
        if (res.success && res.data && res.data.length > 0) {
          return res;
        }
        return { success: true, data: defaultTestimonials };
      } catch {
        return { success: true, data: defaultTestimonials };
      }
    },
    getAdminAll: () => request<Testimonial[]>('/api/testimonials/admin'),
    create: (data: Partial<Testimonial>) =>
      request<Testimonial>('/api/testimonials', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    submitReview: (data: {
      name: string;
      role?: string;
      company?: string;
      content: string;
      rating: number;
      projectTag?: string;
    }) =>
      request<Testimonial>('/api/testimonials/submit', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<Testimonial>) =>
      request<Testimonial>(`/api/testimonials/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<void>(`/api/testimonials/${id}`, {
        method: 'DELETE',
      }),
  },

  pricing: {
    getPublic: () => request<PricingPlan[]>('/api/pricing'),
    getAll: () => request<PricingPlan[]>('/api/pricing/all'),
    create: (data: Partial<PricingPlan>) =>
      request<PricingPlan>('/api/pricing', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<PricingPlan>) =>
      request<PricingPlan>(`/api/pricing/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<void>(`/api/pricing/${id}`, {
        method: 'DELETE',
      }),
  },

  system: {
    getStorageStatus: () => request<{
      isAtlasConnected: boolean;
      storageMode: 'atlas' | 'local';
      clusterHost: string | null;
      notice: string;
    }>('/api/system/storage-status'),
    retryAtlas: () => request<any>('/api/system/retry-atlas', { method: 'POST' }),
    seedDefaults: (force = false) =>
      request<any>('/api/system/seed-defaults', {
        method: 'POST',
        body: JSON.stringify({ force }),
      }),
  },
};
