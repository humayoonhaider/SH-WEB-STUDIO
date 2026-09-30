export interface SiteSettings {
  _id?: string;
  businessName: string;
  tagline: string;
  serviceLine: string;
  description: string;
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  address: string;
  portfolioUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  heroTitle: string;
  heroDescription: string;
  heroPrimaryButtonText: string;
  heroSecondaryButtonText: string;
  aboutTitle: string;
  aboutDescription: string;
  ctaTitle: string;
  ctaDescription: string;
  footerText: string;
  customPortfolios?: Array<{
    name: string;
    url: string;
    title?: string;
  }>;
}

export interface Service {
  _id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  _id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  imageUrl: string;
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
  order: number;
  isActive: boolean;
  technologies: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface TeamMember {
  _id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  email?: string;
  portfolioUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  isFounder?: boolean;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProcessStep {
  _id: string;
  stepNumber: string;
  title: string;
  description: string;
  order: number;
  isActive: boolean;
}

export interface ContactInquiry {
  _id: string;
  name: string;
  business?: string;
  email: string;
  phone?: string;
  projectType?: string;
  budget?: string;
  message: string;
  inquiryType?: 'client' | 'developer_application';
  portfolioUrl?: string;
  githubUrl?: string;
  experience?: string;
  skills?: string;
  status: 'new' | 'read' | 'contacted' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface SEOSettings {
  _id?: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  robots: string;
  canonicalUrl: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin?: string;
  createdAt?: string;
}

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  activeServices: number;
  teamMembers: number;
  newInquiries: number;
  totalInquiries: number;
  recentInquiries: ContactInquiry[];
}

export interface Testimonial {
  _id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatarUrl?: string;
  rating: number;
  projectTag?: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PricingPlan {
  _id?: string;
  id?: string;
  name: string;
  badge: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
