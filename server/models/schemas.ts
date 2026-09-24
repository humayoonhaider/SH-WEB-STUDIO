import mongoose, { Schema, Document } from 'mongoose';

// 1. Admin Interface & Schema
export interface IAdmin extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'superadmin';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

export const AdminSchema = new Schema<IAdmin>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'superadmin'], default: 'admin' },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date }
}, { timestamps: true });

// 2. SiteSettings Interface & Schema
export interface ISiteSettings extends Document {
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
  createdAt: Date;
  updatedAt: Date;
}

export const SiteSettingsSchema = new Schema<ISiteSettings>({
  businessName: { type: String, default: 'SH Web Studio' },
  tagline: { type: String, default: 'We Build Digital Experiences.' },
  serviceLine: { type: String, default: 'Websites • Web Apps • Digital Solutions' },
  description: { type: String, default: 'We design and develop modern websites and custom web applications that help businesses build a stronger digital presence.' },
  logoUrl: { type: String, default: '' },
  faviconUrl: { type: String, default: '' },
  primaryColor: { type: String, default: '#0B0B0F' },
  secondaryColor: { type: String, default: '#17181D' },
  accentColor: { type: String, default: '#2563EB' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  whatsappNumber: { type: String, default: '' },
  address: { type: String, default: '' },
  portfolioUrl: { type: String, default: 'https://humayoon-portfolio.vercel.app/' },
  githubUrl: { type: String, default: 'https://github.com/humayoonhaider' },
  linkedinUrl: { type: String, default: '' },
  instagramUrl: { type: String, default: '' },
  facebookUrl: { type: String, default: '' },
  heroTitle: { type: String, default: 'We Build Digital Experiences.' },
  heroDescription: { type: String, default: 'We design and develop modern websites and custom web applications that help businesses build a stronger digital presence.' },
  heroPrimaryButtonText: { type: String, default: 'Start a Project' },
  heroSecondaryButtonText: { type: String, default: 'View Our Work' },
  aboutTitle: { type: String, default: 'About SH Web Studio' },
  aboutDescription: { type: String, default: 'SH Web Studio is a small web development studio founded by Humayoon, Shariq and Shujaulmulk. We focus on building modern websites, web applications and custom digital solutions for businesses.\n\nOur approach is simple: understand the business first, then build technology that solves a real problem.' },
  ctaTitle: { type: String, default: 'Have a project in mind?' },
  ctaDescription: { type: String, default: "Tell us what you're building and let's discuss how we can turn the idea into a practical digital solution." },
  footerText: { type: String, default: '© 2026 SH Web Studio. All rights reserved.' }
}, { timestamps: true });

// 3. Service Interface & Schema
export interface IService extends Document {
  title: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const ServiceSchema = new Schema<IService>({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  description: { type: String, required: true },
  icon: { type: String, default: 'Code' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true, index: true }
}, { timestamps: true });

// 4. Project Interface & Schema
export interface IProject extends Document {
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
  createdAt: Date;
  updatedAt: Date;
}

export const ProjectSchema = new Schema<IProject>({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  category: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  liveUrl: { type: String, default: '' },
  githubUrl: { type: String, default: '' },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true, index: true },
  technologies: [{ type: String, trim: true }]
}, { timestamps: true });

// 5. TeamMember Interface & Schema
export interface ITeamMember extends Document {
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
  createdAt: Date;
  updatedAt: Date;
}

export const TeamMemberSchema = new Schema<ITeamMember>({
  name: { type: String, required: true, trim: true },
  role: { type: String, default: 'Co-Founder & Developer' },
  bio: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  email: { type: String, default: '', trim: true },
  portfolioUrl: { type: String, default: '', trim: true },
  githubUrl: { type: String, default: '', trim: true },
  linkedinUrl: { type: String, default: '', trim: true },
  isFounder: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true, index: true }
}, { timestamps: true });

// 6. ProcessStep Interface & Schema
export interface IProcessStep extends Document {
  stepNumber: string;
  title: string;
  description: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const ProcessStepSchema = new Schema<IProcessStep>({
  stepNumber: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// 7. ContactInquiry Interface & Schema
export interface IContactInquiry extends Document {
  name: string;
  business: string;
  email: string;
  phone: string;
  projectType: string;
  budget: string;
  message: string;
  status: 'new' | 'read' | 'contacted' | 'completed' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export const ContactInquirySchema = new Schema<IContactInquiry>({
  name: { type: String, required: true, trim: true },
  business: { type: String, default: '', trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, default: '', trim: true },
  projectType: { type: String, default: 'Web Development', trim: true },
  budget: { type: String, default: '', trim: true },
  message: { type: String, required: true },
  status: {
    type: String,
    enum: ['new', 'read', 'contacted', 'completed', 'archived'],
    default: 'new',
    index: true
  }
}, { timestamps: true });

// 8. SEOSettings Interface & Schema
export interface ISEOSettings extends Document {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  robots: string;
  canonicalUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export const SEOSettingsSchema = new Schema<ISEOSettings>({
  metaTitle: { type: String, default: 'SH Web Studio | Web Development & Digital Solutions' },
  metaDescription: { type: String, default: 'SH Web Studio builds modern websites, web applications and custom digital solutions for businesses.' },
  keywords: { type: String, default: 'web development, react, mern, web applications, custom websites, software studio' },
  ogTitle: { type: String, default: 'SH Web Studio | Web Development & Digital Solutions' },
  ogDescription: { type: String, default: 'We Build Digital Experiences. Websites • Web Apps • Digital Solutions' },
  ogImage: { type: String, default: '' },
  robots: { type: String, default: 'index, follow' },
  canonicalUrl: { type: String, default: '' }
}, { timestamps: true });

// 9. Testimonial Interface & Schema
export interface ITestimonial extends Document {
  name: string;
  role: string;
  company: string;
  content: string;
  avatarUrl?: string;
  rating: number;
  projectTag?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const TestimonialSchema = new Schema<ITestimonial>({
  name: { type: String, required: true, trim: true },
  role: { type: String, default: 'Client', trim: true },
  company: { type: String, default: '', trim: true },
  content: { type: String, required: true },
  avatarUrl: { type: String, default: '' },
  rating: { type: Number, default: 5, min: 1, max: 5 },
  projectTag: { type: String, default: '', trim: true },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true, index: true }
}, { timestamps: true });

// 10. PricingPlan Interface & Schema
export interface IPricingPlan extends Document {
  name: string;
  badge: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const PricingPlanSchema = new Schema<IPricingPlan>({
  name: { type: String, required: true, trim: true },
  badge: { type: String, default: 'Starter', trim: true },
  price: { type: String, required: true, trim: true },
  period: { type: String, default: 'per project', trim: true },
  description: { type: String, required: true },
  features: [{ type: String, trim: true }],
  highlighted: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true, index: true }
}, { timestamps: true });

// Mongoose Models
export const AdminModel = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);
export const SiteSettingsModel = mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
export const ServiceModel = mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);
export const ProjectModel = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
export const TeamMemberModel = mongoose.models.TeamMember || mongoose.model<ITeamMember>('TeamMember', TeamMemberSchema);
export const ProcessStepModel = mongoose.models.ProcessStep || mongoose.model<IProcessStep>('ProcessStep', ProcessStepSchema);
export const ContactInquiryModel = mongoose.models.ContactInquiry || mongoose.model<IContactInquiry>('ContactInquiry', ContactInquirySchema);
export const SEOSettingsModel = mongoose.models.SEOSettings || mongoose.model<ISEOSettings>('SEOSettings', SEOSettingsSchema);
export const TestimonialModel = mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
export const PricingPlanModel = mongoose.models.PricingPlan || mongoose.model<IPricingPlan>('PricingPlan', PricingPlanSchema);
