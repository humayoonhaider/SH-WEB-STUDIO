import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ExternalLink, Github, Linkedin, Instagram, Facebook, Globe, ShieldCheck } from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import { BrandLogo } from './BrandLogo';
import { api } from '../../services/api';
import { TeamMember } from '../../types';

export const Footer: React.FC = () => {
  const { settings } = useSite();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    let mounted = true;
    api.team
      .getPublic()
      .then((res) => {
        if (mounted && res.success && res.data) {
          setTeamMembers(res.data);
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  // Compile all founder & creator portfolios dynamically
  const allPortfolios: Array<{ name: string; url: string; title?: string }> = [];

  // 1. From settings.customPortfolios (custom configured in Admin)
  if (settings.customPortfolios && settings.customPortfolios.length > 0) {
    settings.customPortfolios.forEach((p) => {
      if (p.url && p.url.trim()) {
        allPortfolios.push({
          name: p.name || 'Founder Portfolio',
          url: p.url.trim(),
          title: p.title || 'Portfolio',
        });
      }
    });
  }

  // 2. From registered team members who have portfolioUrl
  teamMembers.forEach((t) => {
    const pUrl = t.portfolioUrl ? t.portfolioUrl.trim() : '';
    if (pUrl && !allPortfolios.some((p) => p.url === pUrl)) {
      allPortfolios.push({
        name: t.name ? `${t.name}'s Portfolio` : 'Founder Portfolio',
        url: pUrl,
        title: t.isFounder ? 'Founder' : (t.role || 'Portfolio'),
      });
    }
  });

  // 3. Fallback to settings.portfolioUrl if list is still empty
  if (allPortfolios.length === 0 && settings.portfolioUrl && settings.portfolioUrl.trim()) {
    allPortfolios.push({
      name: 'Founder Portfolio',
      url: settings.portfolioUrl.trim(),
      title: 'Founder Portfolio',
    });
  }

  const hasContactInfo = Boolean(settings.email || settings.phone || settings.address);
  const hasSocials = Boolean(
    settings.githubUrl ||
    settings.linkedinUrl ||
    settings.instagramUrl ||
    settings.facebookUrl
  );

  return (
    <footer className="bg-[#08080C] border-t border-[#262833] text-neutral-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand & Mission & Founder Portfolios */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={settings.businessName || 'SH Web Studio'}
                  className="h-8 max-w-[160px] object-contain"
                />
              ) : (
                <BrandLogo variant="full" size="md" />
              )}
            </Link>
            <p className="text-xs text-neutral-500 leading-relaxed pt-1">
              {settings.serviceLine || 'Websites • Web Apps • Digital Solutions'}
            </p>

            {/* Multiple Founder Portfolios List */}
            {allPortfolios.length > 0 && (
              <div className="pt-3 space-y-2 border-t border-[#1C1D24]">
                <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold flex items-center justify-between">
                  <span>Founder Portfolios</span>
                  <span className="text-blue-400 font-mono text-[10px]">
                    {allPortfolios.length} {allPortfolios.length === 1 ? 'Link' : 'Links'}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {allPortfolios.map((item, idx) => (
                    <a
                      key={idx}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between text-xs text-neutral-300 hover:text-white bg-[#121318] hover:bg-[#1A1B22] border border-[#262833] hover:border-blue-500/40 px-2.5 py-1.5 rounded-lg transition-all"
                      title={`${item.name} (${item.url})`}
                    >
                      <span className="truncate group-hover:text-blue-400 transition-colors font-medium">
                        {item.name}
                      </span>
                      <ExternalLink className="w-3 h-3 text-neutral-500 group-hover:text-blue-400 shrink-0 ml-1.5" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="font-heading text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Navigation
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/work" className="hover:text-white transition-colors">
                  Selected Work
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="hover:text-white transition-colors">
                  Reviews & Feedback
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact & Inquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Services Quicklist */}
          <div>
            <h3 className="font-heading text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Solutions
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Business Websites
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Web Applications
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  E-commerce Platforms
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  React & MERN Systems
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Admin Dashboards
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Configured Socials */}
          <div className="space-y-4">
            <h3 className="font-heading text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Get in Touch
            </h3>

            {hasContactInfo ? (
              <div className="space-y-2.5 text-xs text-neutral-400">
                {settings.email && (
                  <a
                    href={`mailto:${settings.email}`}
                    className="flex items-center gap-2 hover:text-blue-400 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-neutral-500 shrink-0" />
                    <span>{settings.email}</span>
                  </a>
                )}
                {settings.phone && (
                  <a
                    href={`tel:${settings.phone}`}
                    className="flex items-center gap-2 hover:text-blue-400 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-neutral-500 shrink-0" />
                    <span>{settings.phone}</span>
                  </a>
                )}
                {settings.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                    <span>{settings.address}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-neutral-500">
                Use our project inquiry form to contact our team directly.
              </p>
            )}

            {/* Social Links - ONLY displayed if configured! */}
            {hasSocials && (
              <div className="pt-2">
                <div className="flex items-center gap-3">
                  {settings.githubUrl && (
                    <a
                      href={settings.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-[#121318] border border-[#262833] text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors"
                      aria-label="GitHub Profile"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {settings.linkedinUrl && (
                    <a
                      href={settings.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-[#121318] border border-[#262833] text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors"
                      aria-label="LinkedIn Profile"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {settings.instagramUrl && (
                    <a
                      href={settings.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-[#121318] border border-[#262833] text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors"
                      aria-label="Instagram Profile"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                  {settings.facebookUrl && (
                    <a
                      href={settings.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-[#121318] border border-[#262833] text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors"
                      aria-label="Facebook Page"
                    >
                      <Facebook className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#1C1D24] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>{settings.footerText || '© 2026 SH Web Studio. All rights reserved.'}</p>
        </div>
      </div>
    </footer>
  );
};
