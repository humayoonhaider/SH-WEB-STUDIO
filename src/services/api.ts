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
  PublicUser,
  UserReferralItem,
  UserReferralStats,
  ReferralSettingsData,
  AdminReferralItem,
  AdminReferralStats,
  UserPaymentDetails,
} from '../types';
import { defaultTestimonials } from '../data/defaultTestimonials';
import { defaultProjects } from '../data/defaultProjects';

// Force same-origin relative paths to avoid any cached/incorrect environment variables
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const ADMIN_TOKEN_KEY = 'sh_admin_auth_token_v3';
const USER_TOKEN_KEY = 'sh_user_auth_token_v1';

// Clear any legacy insecure tokens from previous versions
try {
  localStorage.removeItem('sh_studio_admin_token');
  sessionStorage.removeItem('sh_studio_admin_token');
} catch {}

export const getToken = (): string | null => {
  return sessionStorage.getItem(ADMIN_TOKEN_KEY) || localStorage.getItem(ADMIN_TOKEN_KEY);
};

export const setToken = (token: string, remember = false): void => {
  if (remember) {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  } else {
    sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  }
};

export const removeToken = (): void => {
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_TOKEN_KEY);
};

// Public User Token Management
export const getUserToken = (): string | null => {
  return sessionStorage.getItem(USER_TOKEN_KEY) || localStorage.getItem(USER_TOKEN_KEY);
};

export const setUserToken = (token: string, remember = true): void => {
  if (remember) {
    localStorage.setItem(USER_TOKEN_KEY, token);
    sessionStorage.removeItem(USER_TOKEN_KEY);
  } else {
    sessionStorage.setItem(USER_TOKEN_KEY, token);
    localStorage.removeItem(USER_TOKEN_KEY);
  }
};

export const removeUserToken = (): void => {
  sessionStorage.removeItem(USER_TOKEN_KEY);
  localStorage.removeItem(USER_TOKEN_KEY);
};

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  token?: string;
  admin?: AdminUser;
  user?: PublicUser;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  retries = 2
): Promise<ApiResponse<T>> {
  // Robust URL construction
  let cleanEndpoint = endpoint;
  let finalBaseUrl = BASE_URL;
  
  if (finalBaseUrl.endsWith('/api') && endpoint.startsWith('/api')) {
    cleanEndpoint = endpoint.substring(4);
  } else if (!finalBaseUrl && !endpoint.startsWith('/')) {
    cleanEndpoint = `/${endpoint}`;
  }

  const url = `${finalBaseUrl}${cleanEndpoint}`;

  // Determine which token to send: user token for user routes, admin token for admin routes
  const isUserSpecificRoute =
    cleanEndpoint.startsWith('/api/user') ||
    cleanEndpoint.startsWith('/api/referrals/me') ||
    cleanEndpoint.startsWith('/api/referrals/my-stats');

  const token = isUserSpecificRoute
    ? getUserToken() || getToken()
    : getToken() || getUserToken();

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
    getPublic: async () => {
      try {
        const res = await request<Project[]>('/api/projects');
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          return res;
        }
        return { success: true, data: defaultProjects };
      } catch {
        return { success: true, data: defaultProjects };
      }
    },
    getAll: async () => {
      try {
        const res = await request<Project[]>('/api/projects/all');
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          return res;
        }
        return { success: true, data: defaultProjects };
      } catch {
        return { success: true, data: defaultProjects };
      }
    },
    getBySlug: async (slug: string) => {
      try {
        const res = await request<Project>(`/api/projects/slug/${encodeURIComponent(slug)}`);
        if (res.success && res.data) {
          return res;
        }
        throw new Error('Not found from server');
      } catch {
        const decoded = decodeURIComponent(slug).toLowerCase().trim();
        const found = defaultProjects.find(
          (p) =>
            (p.slug && p.slug.toLowerCase() === decoded) ||
            p._id === slug ||
            p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === decoded ||
            p.title.toLowerCase() === decoded
        );
        if (found) {
          return { success: true, data: found };
        }
        return { success: false, message: 'Project not found.' };
      }
    },
    getById: async (id: string) => {
      try {
        const res = await request<Project>(`/api/projects/${encodeURIComponent(id)}`);
        if (res.success && res.data) {
          return res;
        }
        throw new Error('Not found from server');
      } catch {
        const found = defaultProjects.find((p) => p._id === id || p.slug === id);
        if (found) {
          return { success: true, data: found };
        }
        return { success: false, message: 'Project not found.' };
      }
    },
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

  // Public User Authentication & Profile
  userAuth: {
    register: (data: {
      name: string;
      email: string;
      password: string;
      phone?: string;
      company?: string;
      referralCode?: string;
    }) =>
      request<PublicUser>('/api/user/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    login: (credentials: { email: string; password: string }) =>
      request<PublicUser>('/api/user/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    getMe: () => request<PublicUser>('/api/user/auth/me'),
    updateProfile: (data: { name?: string; phone?: string; company?: string }) =>
      request<PublicUser>('/api/user/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    updatePaymentDetails: (data: UserPaymentDetails) =>
      request<UserPaymentDetails>('/api/user/auth/payment-details', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },

  // Referral System (Public & Authenticated User)
  referrals: {
    validate: (code: string) =>
      request<{ code: string; referrerName: string; discountReward: string }>(
        `/api/referrals/validate/${encodeURIComponent(code)}`
      ),
    getPublicSettings: () => request<ReferralSettingsData>('/api/referrals/public-settings'),
    getMyReferrals: () => request<UserReferralItem[]>('/api/referrals/me'),
    getMyStats: () => request<UserReferralStats & { availableBalance?: number }>('/api/referrals/my-stats'),
    requestWithdrawal: (data: {
      amount: number;
      payoutMethod?: string;
      accountNumber?: string;
      accountHolderName?: string;
      bankName?: string;
      notes?: string;
    }) =>
      request<{
        transactionId: string;
        amount: number;
        payoutMethod: string;
        payoutDetails: string;
        status: string;
        processedAt: string;
      }>('/api/referrals/withdraw', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  // Admin Referral Management
  adminReferrals: {
    getStats: () => request<AdminReferralStats>('/api/admin/referrals/stats'),
    getAll: (params?: { status?: string; search?: string }) => {
      const query = new URLSearchParams();
      if (params?.status && params.status !== 'all') query.set('status', params.status);
      if (params?.search) query.set('search', params.search);
      const qs = query.toString() ? `?${query.toString()}` : '';
      return request<AdminReferralItem[]>(`/api/admin/referrals${qs}`);
    },
    getDetail: (id: string) => request<any>(`/api/admin/referrals/${id}`),
    updateStatus: (id: string, status: string, notes?: string) =>
      request<any>(`/api/admin/referrals/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, notes }),
      }),
    recordPayment: (data: {
      referralId: string;
      amount: number;
      currency?: string;
      projectTitle?: string;
      paymentReference?: string;
      notes?: string;
    }) =>
      request<any>('/api/admin/referrals/payments', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    updateCommissionStatus: (
      id: string,
      data: {
        status: 'pending' | 'approved' | 'paid' | 'rejected';
        payoutMethod?: string;
        payoutReference?: string;
        adminNote?: string;
      }
    ) =>
      request<any>(`/api/admin/referrals/commissions/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    getSettings: () => request<ReferralSettingsData>('/api/admin/referrals/settings'),
    updateSettings: (data: Partial<ReferralSettingsData>) =>
      request<ReferralSettingsData>('/api/admin/referrals/settings', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },

  chat: {
    sendMessage: (messages: { role: string; content: string }[], message?: string) =>
      request<{ role: string; reply: string; timestamp: string }>('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ messages, message }),
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
