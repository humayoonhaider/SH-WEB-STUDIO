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
  showTopOfferBanner?: boolean;
  topOfferBadgeText?: string;
  topOfferTitle?: string;
  topOfferHighlightText?: string;
  topOfferButtonText?: string;
  topOfferButtonUrl?: string;
  topOfferExpiryText?: string;
  customPortfolios: Array<{
    name: string;
    url: string;
    title?: string;
  }>;
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
  footerText: { type: String, default: '© 2026 SH Web Studio. All rights reserved.' },
  showTopOfferBanner: { type: Boolean, default: true },
  topOfferBadgeText: { type: String, default: '🔥 LIMITED TIME PARTNER OPPORTUNITY' },
  topOfferTitle: { type: String, default: 'Refer a business & earn 10% direct commission on their web project' },
  topOfferHighlightText: { type: String, default: '10% Direct Payout' },
  topOfferButtonText: { type: String, default: 'Claim Your Partner Link' },
  topOfferButtonUrl: { type: String, default: '/referral-program' },
  topOfferExpiryText: { type: String, default: 'Limited slots available' },
  customPortfolios: [
    {
      name: { type: String, default: '', trim: true },
      url: { type: String, default: '', trim: true },
      title: { type: String, default: 'Founder Portfolio', trim: true }
    }
  ]
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
  inquiryType: 'client' | 'developer_application';
  portfolioUrl?: string;
  githubUrl?: string;
  experience?: string;
  skills?: string;
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
  inquiryType: { type: String, enum: ['client', 'developer_application'], default: 'client', index: true },
  portfolioUrl: { type: String, default: '', trim: true },
  githubUrl: { type: String, default: '', trim: true },
  experience: { type: String, default: '', trim: true },
  skills: { type: String, default: '', trim: true },
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

// 11. User Interface & Schema (Public Users / Referral Partners)
export interface IUserPaymentDetails {
  method: 'Bank Transfer' | 'Easypaisa' | 'JazzCash' | 'PayPal' | 'Other' | '';
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  routingOrSwift?: string;
  notes?: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  company?: string;
  passwordHash: string;
  role: 'user' | 'admin';
  referralCode: string;
  referredBy?: string;
  referredByCode?: string;
  paymentDetails?: IUserPaymentDetails;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

export const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  phone: { type: String, default: '', trim: true },
  company: { type: String, default: '', trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user', index: true },
  referralCode: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
  referredBy: { type: String, default: '', index: true },
  referredByCode: { type: String, default: '', uppercase: true, trim: true },
  paymentDetails: {
    method: { type: String, default: '' },
    accountHolderName: { type: String, default: '' },
    bankName: { type: String, default: '' },
    accountNumber: { type: String, default: '' },
    routingOrSwift: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date }
}, { timestamps: true });

// 12. Referral Record Interface & Schema
export interface IReferral extends Document {
  referrer: string; // User ID of referrer
  referredUser: string; // User ID of referred person
  referralCode: string;
  status:
    | 'REGISTERED'
    | 'CONTACTED'
    | 'QUALIFIED'
    | 'CLIENT'
    | 'PAYMENT_PENDING'
    | 'COMMISSION_PENDING'
    | 'COMMISSION_APPROVED'
    | 'COMMISSION_PAID'
    | 'REJECTED';
  registeredAt: Date;
  convertedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const ReferralSchema = new Schema<IReferral>({
  referrer: { type: String, required: true, index: true },
  referredUser: { type: String, required: true, unique: true, index: true },
  referralCode: { type: String, required: true, uppercase: true, trim: true },
  status: {
    type: String,
    enum: [
      'REGISTERED',
      'CONTACTED',
      'QUALIFIED',
      'CLIENT',
      'PAYMENT_PENDING',
      'COMMISSION_PENDING',
      'COMMISSION_APPROVED',
      'COMMISSION_PAID',
      'REJECTED',
    ],
    default: 'REGISTERED',
    index: true,
  },
  registeredAt: { type: Date, default: Date.now },
  convertedAt: { type: Date },
  notes: { type: String, default: '' },
}, { timestamps: true });

// 13. Payment Interface & Schema
export interface IPayment extends Document {
  clientName: string;
  clientEmail: string;
  userId?: string;
  referralId?: string;
  referrerId?: string;
  projectTitle: string;
  amount: number;
  currency: string;
  paymentDate: Date;
  paymentReference: string;
  status: 'completed' | 'pending' | 'refunded';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const PaymentSchema = new Schema<IPayment>({
  clientName: { type: String, required: true, trim: true },
  clientEmail: { type: String, required: true, lowercase: true, trim: true },
  userId: { type: String, default: '', index: true },
  referralId: { type: String, default: '', index: true },
  referrerId: { type: String, default: '', index: true },
  projectTitle: { type: String, default: 'Custom Web Application', trim: true },
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'USD', uppercase: true, trim: true },
  paymentDate: { type: Date, default: Date.now },
  paymentReference: { type: String, default: '', trim: true },
  status: { type: String, enum: ['completed', 'pending', 'refunded'], default: 'completed' },
  notes: { type: String, default: '' },
}, { timestamps: true });

// 14. Commission Interface & Schema
export interface ICommission extends Document {
  referrer: string; // User ID receiving commission
  referredUser: string; // User ID who paid
  referral?: string; // Referral Record ID
  payment: string; // Payment Record ID (Ensures 1:1 and prevents duplicate commission)
  paymentAmount: number;
  commissionRate: number; // Immutable snapshot rate e.g. 10 (%)
  commissionAmount: number; // Calculated: (paymentAmount * commissionRate) / 100
  currency: string;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  approvedAt?: Date;
  paidAt?: Date;
  rejectedAt?: Date;
  payoutMethod?: string;
  payoutReference?: string;
  adminNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const CommissionSchema = new Schema<ICommission>({
  referrer: { type: String, required: true, index: true },
  referredUser: { type: String, required: true, index: true },
  referral: { type: String, default: '', index: true },
  payment: { type: String, required: true, unique: true, index: true },
  paymentAmount: { type: Number, required: true, min: 0 },
  commissionRate: { type: Number, required: true, default: 10 },
  commissionAmount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'USD', uppercase: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'paid', 'rejected'],
    default: 'pending',
    index: true,
  },
  approvedAt: { type: Date },
  paidAt: { type: Date },
  rejectedAt: { type: Date },
  payoutMethod: { type: String, default: '' },
  payoutReference: { type: String, default: '' },
  adminNote: { type: String, default: '' },
}, { timestamps: true });

// 15. Referral Program Settings Interface & Schema
export interface IReferralSettings extends Document {
  referralProgramEnabled: boolean;
  commissionRate: number; // e.g. 10 (%)
  minPayoutAmount: number;
  payoutNotice: string;
  termsText: string;
  createdAt: Date;
  updatedAt: Date;
}

export const ReferralSettingsSchema = new Schema<IReferralSettings>({
  referralProgramEnabled: { type: Boolean, default: true },
  commissionRate: { type: Number, default: 10, min: 0, max: 100 },
  minPayoutAmount: { type: Number, default: 0, min: 0 },
  payoutNotice: { type: String, default: 'Commissions are processed and paid via Bank Transfer, Easypaisa, JazzCash, or PayPal within 5-7 business days of client payment verification.' },
  termsText: { type: String, default: 'Referral commission is 10% on qualifying payments made by clients you refer. Payouts require admin verification of cleared client funds.' },
}, { timestamps: true });

// 16. Withdrawal Request Interface & Schema
export interface IWithdrawalRequest extends Document {
  user: string; // User ID
  userName?: string;
  userEmail?: string;
  amount: number;
  currency: string;
  payoutMethod: string;
  accountNumber: string;
  accountHolderName: string;
  bankName?: string;
  notes?: string;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  adminNote?: string;
  payoutReference?: string;
  requestedAt: Date;
  approvedAt?: Date;
  paidAt?: Date;
  rejectedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const WithdrawalRequestSchema = new Schema<IWithdrawalRequest>({
  user: { type: String, required: true, index: true },
  userName: { type: String, default: '' },
  userEmail: { type: String, default: '' },
  amount: { type: Number, required: true, min: 1 },
  currency: { type: String, default: 'USD', uppercase: true },
  payoutMethod: { type: String, required: true, default: 'JazzCash' },
  accountNumber: { type: String, required: true },
  accountHolderName: { type: String, required: true },
  bankName: { type: String, default: '' },
  notes: { type: String, default: '' },
  status: {
    type: String,
    enum: ['pending', 'approved', 'paid', 'rejected'],
    default: 'pending',
    index: true,
  },
  adminNote: { type: String, default: '' },
  payoutReference: { type: String, default: '' },
  requestedAt: { type: Date, default: Date.now },
  approvedAt: { type: Date },
  paidAt: { type: Date },
  rejectedAt: { type: Date },
}, { timestamps: true });

export const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export const ReferralModel = mongoose.models.Referral || mongoose.model<IReferral>('Referral', ReferralSchema);
export const PaymentModel = mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
export const CommissionModel = mongoose.models.Commission || mongoose.model<ICommission>('Commission', CommissionSchema);
export const ReferralSettingsModel = mongoose.models.ReferralSettings || mongoose.model<IReferralSettings>('ReferralSettings', ReferralSettingsSchema);
export const WithdrawalRequestModel = mongoose.models.WithdrawalRequest || mongoose.model<IWithdrawalRequest>('WithdrawalRequest', WithdrawalRequestSchema);


