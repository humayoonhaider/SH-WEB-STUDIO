import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ExternalLink, Github, Linkedin, Instagram, Facebook, Lock } from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import { BrandLogo } from './BrandLogo';

export const Footer: React.FC = () => {
  const { settings } = useSite();

  const hasContactInfo = Boolean(settings.email || settings.phone || settings.address);
  const hasSocials = Boolean(
    settings.githubUrl ||
    settings.linkedinUrl ||
    settings.instagramUrl ||
    settings.facebookUrl ||
    settings.portfolioUrl
  );

  return (
    <footer className="bg-[#08080C] border-t border-[#262833] text-neutral-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand & Mission */}
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
            {settings.portfolioUrl && (
              <div className="pt-2">
                <a
                  href={settings.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <span>Founder Portfolio</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
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
