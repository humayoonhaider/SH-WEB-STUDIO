import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import {
  Admin,
  SiteSettings,
  Service,
  Project,
  TeamMember,
  ProcessStep,
  SEOSettings,
  Testimonial,
  PricingPlan,
} from '../models/index.js';

dotenv.config();

export async function seedInitialData(force = false) {
  console.log(`🌱 Checking seed data (force=${force})...`);

  if (force) {
    console.log('Force seeding requested. Clearing specific collections...');
    await TeamMember.deleteMany({});
    await PricingPlan.deleteMany({});
    await Project.deleteMany({});
    await Service.deleteMany({});
    await ProcessStep.deleteMany({});
    await Testimonial.deleteMany({});
    await SEOSettings.deleteMany({});
    await SiteSettings.deleteMany({});
  }

  // 1. Seed Site Settings
  const existingSettings = await SiteSettings.findOne();
  if (!existingSettings || force) {
    console.log('Creating initial SiteSettings...');
    await SiteSettings.create({
      businessName: 'SH Web Studio',
      tagline: 'We Build Digital Experiences.',
      serviceLine: 'Websites • Web Apps • Digital Solutions',
      description: 'We design and develop modern websites and custom web applications that help businesses build a stronger digital presence.',
      logoUrl: '',
      faviconUrl: '',
      primaryColor: '#0B0B0F',
      secondaryColor: '#17181D',
      accentColor: '#2563EB',
      email: 'contact@shwebstudio.com',
      phone: '',
      whatsappNumber: '',
      address: '',
      portfolioUrl: 'https://humayoon-portfolio.vercel.app/',
      githubUrl: 'https://github.com/humayoonhaider',
      linkedinUrl: '',
      instagramUrl: '',
      facebookUrl: '',
      heroTitle: 'We Build Digital Experiences.',
      heroDescription: 'We design and develop modern websites and custom web applications that help businesses build a stronger digital presence.',
      heroPrimaryButtonText: 'Start a Project',
      heroSecondaryButtonText: 'View Our Work',
      aboutTitle: 'About SH Web Studio',
      aboutDescription: 'SH Web Studio is a small web development studio founded by Humayoon, Shariq and Shujaulmulk. We focus on building modern websites, web applications and custom digital solutions for businesses.\n\nOur approach is simple: understand the business first, then build technology that solves a real problem.',
      ctaTitle: 'Have a project in mind?',
      ctaDescription: "Tell us what you're building and let's discuss how we can turn the idea into a practical digital solution.",
      footerText: '© 2026 SH Web Studio. All rights reserved.',
    });
  }

  // 2. Seed Services (6 real defaults)
  const serviceCount = await Service.countDocuments();
  if (serviceCount === 0) {
    console.log('Creating initial 6 services...');
    const defaultServices = [
      {
        title: 'Business Websites',
        slug: 'business-websites',
        description: 'Professional, responsive websites designed to establish a strong online presence.',
        icon: 'Globe',
        order: 1,
        isActive: true,
      },
      {
        title: 'Web Applications',
        slug: 'web-applications',
        description: 'Custom browser-based applications built around specific business requirements.',
        icon: 'Layout',
        order: 2,
        isActive: true,
      },
      {
        title: 'E-commerce',
        slug: 'e-commerce',
        description: 'Modern online stores with clean user experiences and scalable architecture.',
        icon: 'ShoppingCart',
        order: 3,
        isActive: true,
      },
      {
        title: 'React & MERN Development',
        slug: 'react-mern-development',
        description: 'Modern frontend and full-stack applications using React and the MERN ecosystem.',
        icon: 'Code2',
        order: 4,
        isActive: true,
      },
      {
        title: 'Admin Dashboards',
        slug: 'admin-dashboards',
        description: 'Clean, responsive dashboards for managing business data and workflows.',
        icon: 'Layers',
        order: 5,
        isActive: true,
      },
      {
        title: 'Custom Business Systems',
        slug: 'custom-business-systems',
        description: 'Purpose-built systems such as management portals, internal tools and workflow applications.',
        icon: 'Cpu',
        order: 6,
        isActive: true,
      },
    ];

    for (const s of defaultServices) {
      await Service.create(s);
    }
  }

  // 3. Seed Real Projects (Only the 3 actual projects)
  const projectCount = await Project.countDocuments();
  if (projectCount === 0) {
    console.log('Creating initial 3 projects...');
    const defaultProjects = [
      {
        title: 'MIS for School',
        slug: 'mis-for-school',
        category: 'School Management System',
        description: 'A comprehensive management platform designed for school administration, staff management, student attendance, salaries, permissions, financial tracking and student learning workflows.',
        imageUrl: '',
        liveUrl: 'https://mis-for-school.vercel.app/',
        githubUrl: 'https://github.com/humayoonhaider/MIS-FOR-SCHOOL',
        featured: true,
        order: 1,
        isActive: true,
        technologies: ['React', 'JavaScript', 'Tailwind CSS', 'Vite', 'Node.js', 'Express.js'],
      },
      {
        title: 'E-commerce Shop',
        slug: 'e-commerce-shop',
        category: 'E-commerce',
        description: 'A modern e-commerce interface focused on product browsing, shopping experiences and responsive frontend design.',
        imageUrl: '',
        liveUrl: 'https://e-commerece-shop.vercel.app/',
        githubUrl: 'https://github.com/humayoonhaider/E-COMMERECE-SHOP',
        featured: true,
        order: 2,
        isActive: true,
        technologies: ['React', 'JavaScript', 'Tailwind CSS', 'Vite', 'State Management'],
      },
      {
        title: 'Intelligence Hub',
        slug: 'intelligence-hub',
        category: 'Web Application',
        description: 'A collection of browser-based productivity and intelligence tools built with React and Vite.',
        imageUrl: '',
        liveUrl: 'https://intelligence-hub-drab.vercel.app/',
        githubUrl: 'https://github.com/humayoonhaider/INTELLIGENCE-HUB',
        featured: true,
        order: 3,
        isActive: true,
        technologies: ['React', 'Vite', 'JavaScript', 'Productivity Tools'],
      },
    ];

    for (const p of defaultProjects) {
      await Project.create(p);
    }
  }

  // 4. Seed Team Members (Humayoon, Shariq, Shujaulmulk)
  const teamCount = await TeamMember.countDocuments();
  if (teamCount === 0) {
    console.log('Creating initial 3 founders...');
    const founders = [
      {
        name: 'Humayoon',
        role: 'Co-Founder & Lead Engineer',
        bio: 'Full-stack software engineer specializing in modern React ecosystems, Node.js services, and cloud architecture.',
        imageUrl: '',
        email: 'humayoonkhan003@gmail.com',
        portfolioUrl: 'https://humayoon-portfolio.vercel.app/',
        githubUrl: 'https://github.com/humayoonhaider',
        linkedinUrl: '',
        isFounder: true,
        order: 1,
        isActive: true,
      },
      {
        name: 'Shariq',
        role: 'Co-Founder & Developer',
        bio: 'Full-stack engineer passionate about scalable backends, database design, and end-to-end web applications.',
        imageUrl: '',
        email: '',
        portfolioUrl: '',
        githubUrl: '',
        linkedinUrl: '',
        isFounder: true,
        order: 2,
        isActive: true,
      },
      {
        name: 'Shujaulmulk',
        role: 'Co-Founder & Developer',
        bio: 'Frontend and user experience engineer focused on clean interfaces, smooth interactions, and client solutions.',
        imageUrl: '',
        email: '',
        portfolioUrl: '',
        githubUrl: '',
        linkedinUrl: '',
        isFounder: true,
        order: 3,
        isActive: true,
      },
    ];

    for (const m of founders) {
      await TeamMember.create(m);
    }
  }

  // 5. Seed Process Steps
  const processCount = await ProcessStep.countDocuments();
  if (processCount === 0) {
    console.log('Creating initial process steps...');
    const steps = [
      {
        stepNumber: '01',
        title: 'Discover',
        description: 'Understand the business, goals, audience and requirements.',
        order: 1,
        isActive: true,
      },
      {
        stepNumber: '02',
        title: 'Plan',
        description: 'Define the structure, features and user experience.',
        order: 2,
        isActive: true,
      },
      {
        stepNumber: '03',
        title: 'Build',
        description: 'Design and develop the website or application.',
        order: 3,
        isActive: true,
      },
      {
        stepNumber: '04',
        title: 'Launch',
        description: 'Test, deploy and hand over the finished product.',
        order: 4,
        isActive: true,
      },
    ];

    for (const step of steps) {
      await ProcessStep.create(step);
    }
  }

  // 6. Seed SEO Settings
  const existingSEO = await SEOSettings.findOne();
  if (!existingSEO) {
    console.log('Creating initial SEOSettings...');
    await SEOSettings.create({
      metaTitle: 'SH Web Studio | Web Development & Digital Solutions',
      metaDescription: 'SH Web Studio builds modern websites, web applications and custom digital solutions for businesses.',
      keywords: 'SH Web Studio, web development, custom web applications, mern stack, react, websites',
      ogTitle: 'SH Web Studio | Web Development & Digital Solutions',
      ogDescription: 'We Build Digital Experiences. Websites • Web Apps • Digital Solutions',
      ogImage: '',
      robots: 'index, follow',
      canonicalUrl: '',
    });
  }

  // 7. Seed Testimonials (Client Feedback)
  const testimonialCount = await Testimonial.countDocuments();
  if (testimonialCount === 0) {
    console.log('Creating initial client testimonials...');
    const defaultTestimonials = [
      {
        name: 'Kamran Tariq',
        role: 'Academic Director',
        company: 'Beacon Horizon Academy',
        content:
          'SH Web Studio designed and engineered our complete School Management Information System. What impressed us most was how deeply Humayoon, Shariq, and the engineering team studied our day-to-day operations before writing a single line of code. Student attendance, grade reporting, and fee records are now fully automated with zero friction.',
        rating: 5,
        projectTag: 'School Management System',
        order: 1,
        isActive: true,
      },
      {
        name: 'Sarah Jenkins',
        role: 'Founder & Creative Director',
        company: 'LuxeModern Living',
        content:
          'The custom e-commerce storefront SH Web Studio delivered exceeded our highest expectations. Blazing load speeds, razor-sharp responsive design across every mobile device, and a checkout experience that directly drove a 34% increase in sales conversion in our first quarter.',
        rating: 5,
        projectTag: 'E-Commerce Platform',
        order: 2,
        isActive: true,
      },
      {
        name: 'Dr. Asad Rehman',
        role: 'VP of Operations',
        company: 'Nexus Distribution Hub',
        content:
          'We needed a real-time intelligence hub to replace sprawling manual spreadsheets across regional fulfillment facilities. SH Web Studio engineered a high-performance MERN architecture that gives our leadership team instant visibility into inventory and live logistics metrics.',
        rating: 5,
        projectTag: 'Business Intelligence Hub',
        order: 3,
        isActive: true,
      },
      {
        name: 'Elena Rostova',
        role: 'Product Lead',
        company: 'CoreFin Software',
        content:
          'Engineering excellence and unmatched architectural discipline. Humayoon and the team communicated every technical decision with absolute clarity. Our web platform was delivered ahead of schedule and handled our launch day traffic flawlessly.',
        rating: 5,
        projectTag: 'Full-Stack Web App',
        order: 4,
        isActive: true,
      },
    ];

    for (const item of defaultTestimonials) {
      await Testimonial.create(item);
    }
  }

  // 8. Seed Initial Pricing Plans
  const pricingCount = await PricingPlan.countDocuments();
  if (pricingCount === 0) {
    console.log('Creating initial affordable pricing plans...');
    const defaultPlans = [
      {
        name: 'Basic Plan',
        badge: 'Starter',
        price: '$99',
        period: 'per project',
        description: 'Ideal for small businesses, startups, and portfolios looking for a professional web presence.',
        features: [
          'Professional Business Website',
          'Fully Responsive & Mobile Optimized',
          'Up to 5 Custom Pages',
          'Contact Form & Inquiry Management',
          'Basic SEO Setup',
          '1 Week Delivery & Support',
        ],
        highlighted: false,
        order: 1,
        isActive: true,
      },
      {
        name: 'Standard Plan',
        badge: '50% OFF - Limited Offer',
        price: '$199',
        period: 'per project',
        description: 'Perfect for growing brands requiring custom web applications, e-commerce, or interactive dashboards.',
        features: [
          'Advanced Web Application / E-commerce',
          'Custom UI/UX & Interactive Design',
          'Database & Backend API Integration',
          'Admin Dashboard CMS Included',
          'Payment Gateway Integration',
          'Advanced SEO & Performance Tuning',
          '1 Month Priority Support',
        ],
        highlighted: true,
        order: 2,
        isActive: true,
      },
      {
        name: 'Professional Plan',
        badge: 'Enterprise',
        price: '$399',
        period: 'per project',
        description: 'Comprehensive custom enterprise systems, MERN stack software, and dedicated engineering team.',
        features: [
          'Full MERN Stack Custom Platform',
          'Scalable Cloud Architecture & MIS',
          'Multi-Role Admin & User Portals',
          'Real-time Analytics & Reporting',
          'Custom Integrations & Webhooks',
          'Dedicated Senior Engineering Team',
          '3 Months Ongoing Maintenance & SLA',
        ],
        highlighted: false,
        order: 3,
        isActive: true,
      },
    ];

    for (const plan of defaultPlans) {
      await PricingPlan.create(plan);
    }
  }

  // 9. Seed Initial Admin if none exists
  const adminCount = await Admin.countDocuments();
  if (adminCount === 0) {
    const adminName = process.env.ADMIN_NAME || 'Humayoon';
    const adminEmail = (process.env.ADMIN_EMAIL || 'humayoonkhan003@gmail.com').toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || 'adminPassword123!';

    console.log(`Creating initial admin account for ${adminEmail}...`);
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPassword, salt);

    await Admin.create({
      name: adminName,
      email: adminEmail,
      passwordHash,
      role: 'admin',
      isActive: true,
    });
    console.log(`✅ Initial Admin created successfully (${adminEmail})`);
  }

  console.log('✅ Seed verification complete.');
}

// Standalone execution
if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    await connectDB();
    await seedInitialData();
    process.exit(0);
  })();
}
