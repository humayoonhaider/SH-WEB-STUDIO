import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SiteSettings, SEOSettings } from '../types';
import { api } from '../services/api';

interface SiteContextType {
  settings: SiteSettings;
  seo: SEOSettings;
  loading: boolean;
  refreshSiteData: () => Promise<void>;
  updateSettingsState: (updated: Partial<SiteSettings>) => void;
  updateSeoState: (updated: Partial<SEOSettings>) => void;
}

const defaultSettings: SiteSettings = {
  businessName: 'SH Web Studio',
  tagline: 'We Build Digital Experiences.',
  serviceLine: 'Websites • Web Apps • Digital Solutions',
  description: 'We design and develop modern websites and custom web applications that help businesses build a stronger digital presence.',
  logoUrl: '',
  faviconUrl: '',
  primaryColor: '#0B0B0F',
  secondaryColor: '#17181D',
  accentColor: '#2563EB',
  email: 'humayoonkhan003@gmail.com',
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
  customPortfolios: [],
};

const defaultSEO: SEOSettings = {
  metaTitle: 'SH Web Studio | Web Development & Digital Solutions',
  metaDescription: 'SH Web Studio builds modern websites, web applications and custom digital solutions for businesses.',
  keywords: 'SH Web Studio, web development, custom web applications, mern stack, react, websites',
  ogTitle: 'SH Web Studio | Web Development & Digital Solutions',
  ogDescription: 'We Build Digital Experiences. Websites • Web Apps • Digital Solutions',
  ogImage: '/og-image.jpg',
  robots: 'index, follow',
  canonicalUrl: '',
};

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [seo, setSeo] = useState<SEOSettings>(defaultSEO);
  const [loading, setLoading] = useState(true);

  const refreshSiteData = useCallback(async () => {
    try {
      const [settingsRes, seoRes] = await Promise.all([
        api.settings.get().catch(() => null),
        api.seo.get().catch(() => null),
      ]);

      if (settingsRes?.success && settingsRes.data) {
        setSettings((prev) => ({ ...prev, ...settingsRes.data }));
      }
      if (seoRes?.success && seoRes.data) {
        setSeo((prev) => ({ ...prev, ...seoRes.data }));
      }
    } catch {
      // Keep defaults on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSiteData();
  }, [refreshSiteData]);

  // Sync title and meta tags with database settings
  useEffect(() => {
    if (seo.metaTitle) {
      document.title = seo.metaTitle;
    }

    const updateMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const updateOg = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    if (seo.metaDescription) {
      updateMeta('description', seo.metaDescription);
      updateOg('og:description', seo.ogDescription || seo.metaDescription);
    }
    if (seo.ogTitle) {
      updateOg('og:title', seo.ogTitle);
    }
    if (seo.keywords) {
      updateMeta('keywords', seo.keywords);
    }
    if (seo.robots) {
      updateMeta('robots', seo.robots);
    }
    if (seo.ogImage) {
      updateOg('og:image', seo.ogImage);
    }

    // Favicon update if configured
    if (settings.faviconUrl) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = settings.faviconUrl;
    }
  }, [seo, settings.faviconUrl]);

  const updateSettingsState = (updated: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...updated }));
  };

  const updateSeoState = (updated: Partial<SEOSettings>) => {
    setSeo((prev) => ({ ...prev, ...updated }));
  };

  return (
    <SiteContext.Provider
      value={{
        settings,
        seo,
        loading,
        refreshSiteData,
        updateSettingsState,
        updateSeoState,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = (): SiteContextType => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
};
