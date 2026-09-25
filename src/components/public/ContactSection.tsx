import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Code2,
  Briefcase,
  Github,
  Globe,
  Sparkles,
} from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import { api } from '../../services/api';
import { SectionHeading } from '../common/SectionHeading';

export const ContactSection: React.FC = () => {
  const { settings } = useSite();
  const location = useLocation();

  // Mode: 'client' for project inquiries, 'developer' for Join Us application
  const [mode, setMode] = useState<'client' | 'developer'>('client');

  // Check query params or hash for #join or ?tab=join
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('tab') === 'join' || searchParams.get('join') === 'true' || location.hash === '#join-us') {
      setMode('developer');
    } else if (searchParams.get('tab') === 'client') {
      setMode('client');
    }
  }, [location.search, location.hash]);

  // Client form state
  const [clientData, setClientData] = useState({
    name: '',
    business: '',
    email: '',
    phone: '',
    projectType: 'Business Website',
    budget: '',
    message: '',
    honeypot: '',
  });

  // Developer application form state
  const [devData, setDevData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Full-Stack MERN Developer',
    experience: '1 - 2 Years',
    githubUrl: '',
    portfolioUrl: '',
    skills: 'React, Node.js, Express, MongoDB, TypeScript, Tailwind CSS',
    message: '',
    honeypot: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleClientChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setClientData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDevChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setDevData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!clientData.name.trim()) {
      setErrorMessage('Please provide your name.');
      return;
    }
    if (!clientData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientData.email)) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (!clientData.message.trim() || clientData.message.trim().length < 5) {
      setErrorMessage('Please include a project message of at least 5 characters.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.inquiries.submit({
        ...clientData,
        inquiryType: 'client',
      });
      if (res.success) {
        setSuccessMessage(res.message || 'Thank you! Your inquiry has been sent to our team.');
        setClientData({
          name: '',
          business: '',
          email: '',
          phone: '',
          projectType: 'Business Website',
          budget: '',
          message: '',
          honeypot: '',
        });
      } else {
        setErrorMessage(res.message || 'Failed to send inquiry.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDevSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!devData.name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!devData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(devData.email)) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (!devData.githubUrl.trim() && !devData.portfolioUrl.trim()) {
      setErrorMessage('Please provide at least your GitHub profile URL or Portfolio website link.');
      return;
    }
    if (!devData.message.trim() || devData.message.trim().length < 10) {
      setErrorMessage('Please tell us a bit about yourself and why you would like to join our studio (at least 10 characters).');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.inquiries.submit({
        name: devData.name,
        email: devData.email,
        phone: devData.phone,
        projectType: `Developer Application (${devData.role})`,
        message: devData.message,
        inquiryType: 'developer_application',
        portfolioUrl: devData.portfolioUrl,
        githubUrl: devData.githubUrl,
        experience: devData.experience,
        skills: devData.skills,
        honeypot: devData.honeypot,
      });

      if (res.success) {
        setSuccessMessage(
          res.message ||
            'Thank you for applying to join SH Web Studio! Humayoon and our lead engineering team will review your portfolio and reach out to you.'
        );
        setDevData({
          name: '',
          email: '',
          phone: '',
          role: 'Full-Stack MERN Developer',
          experience: '1 - 2 Years',
          githubUrl: '',
          portfolioUrl: '',
          skills: 'React, Node.js, Express, MongoDB, TypeScript, Tailwind CSS',
          message: '',
          honeypot: '',
        });
      } else {
        setErrorMessage(res.message || 'Failed to submit application.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // WhatsApp link generation with prefilled encoded message
  const whatsappUrl = settings.whatsappNumber
    ? `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
        mode === 'developer'
          ? 'Hello SH Web Studio, I am a developer interested in joining your team.'
          : 'Hello SH Web Studio, I would like to discuss a web development project.'
      )}`
    : null;

  return (
    <section id="contact" className="py-24 border-t border-[#1C1D24] bg-[#0B0B0F] relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Mode Switcher Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12 p-2 bg-[#121318] border border-[#262833] rounded-2xl max-w-xl mx-auto">
          <button
            type="button"
            onClick={() => {
              setMode('client');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`w-full sm:w-1/2 py-3 px-5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              mode === 'client'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                : 'text-neutral-400 hover:text-white hover:bg-[#1A1B22]'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Start a Project</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('developer');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`w-full sm:w-1/2 py-3 px-5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 relative ${
              mode === 'developer'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                : 'text-neutral-400 hover:text-white hover:bg-[#1A1B22]'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Join SH Web Studio</span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              HIRING
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Context & Contact Details */}
          <div className="lg:col-span-5 space-y-8">
            {mode === 'client' ? (
              <SectionHeading
                kicker="Get In Touch"
                title="Start a project with SH Web Studio."
                description="Whether you have an established specification or an early-stage concept, we will review your goals and provide an architectural roadmap."
                className="mb-0"
              />
            ) : (
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Careers & Developer Application</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white tracking-tight leading-tight">
                  Join the SH Web Studio Engineering Team.
                </h2>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Are you a passionate web developer, frontend specialist, or backend engineer? We are looking for talented developers who love building high-performance modern web applications, scalable architectures, and clean user interfaces.
                </p>

                <div className="p-4 rounded-2xl bg-[#121318] border border-[#262833] space-y-2.5 text-xs text-neutral-300">
                  <div className="font-semibold text-white flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-blue-400" />
                    <span>Tech Stack We Work With:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {['React', 'TypeScript', 'Node.js', 'Express', 'Tailwind CSS', 'Next.js', 'MongoDB', 'PostgreSQL', 'Vite'].map((skill) => (
                      <span key={skill} className="px-2 py-1 rounded-lg bg-[#1A1B22] border border-[#262833] font-mono text-[11px] text-neutral-300">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4 pt-4 border-t border-[#1C1D24]">
              {settings.email && (
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-[#17181D] border border-[#262833] text-neutral-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-neutral-500 font-medium">Direct Email</div>
                    <a
                      href={`mailto:${settings.email}`}
                      className="text-sm font-semibold text-white hover:text-blue-400 transition-colors"
                    >
                      {settings.email}
                    </a>
                  </div>
                </div>
              )}

              {settings.phone && (
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-[#17181D] border border-[#262833] text-neutral-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-neutral-500 font-medium">Direct Line</div>
                    <a
                      href={`tel:${settings.phone}`}
                      className="text-sm font-semibold text-white hover:text-blue-400 transition-colors"
                    >
                      {settings.phone}
                    </a>
                  </div>
                </div>
              )}

              {settings.address && (
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-[#17181D] border border-[#262833] text-neutral-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-neutral-500 font-medium">Studio Location</div>
                    <p className="text-sm text-neutral-300">{settings.address}</p>
                  </div>
                </div>
              )}

              {/* WhatsApp Option */}
              {whatsappUrl && (
                <div className="pt-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 hover:bg-emerald-900/40 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7 bg-[#121318] border border-[#262833] rounded-3xl p-6 sm:p-10 shadow-2xl">
            {successMessage ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white font-heading">
                  {mode === 'developer' ? 'Application Received!' : 'Inquiry Received'}
                </h3>
                <p className="text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
                  {successMessage}
                </p>
                <button
                  onClick={() => setSuccessMessage(null)}
                  className="mt-4 px-6 py-2.5 text-sm font-medium rounded-xl text-white bg-[#1C1D24] hover:bg-[#252731] border border-[#262833] transition-colors"
                >
                  {mode === 'developer' ? 'Submit Another Application' : 'Send Another Message'}
                </button>
              </div>
            ) : mode === 'client' ? (
              /* Client Project Form */
              <form onSubmit={handleClientSubmit} className="space-y-6">
                <input
                  type="text"
                  name="honeypot"
                  value={clientData.honeypot}
                  onChange={handleClientChange}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                {errorMessage && (
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                      Your Name <span className="text-blue-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={clientData.name}
                      onChange={handleClientChange}
                      placeholder="Humayoon Khan"
                      className="w-full px-4 py-3 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                      Business or Organization
                    </label>
                    <input
                      type="text"
                      name="business"
                      value={clientData.business}
                      onChange={handleClientChange}
                      placeholder="Company Name (Optional)"
                      className="w-full px-4 py-3 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                      Email Address <span className="text-blue-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={clientData.email}
                      onChange={handleClientChange}
                      placeholder="you@domain.com"
                      className="w-full px-4 py-3 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={clientData.phone}
                      onChange={handleClientChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-3 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                      Project Type
                    </label>
                    <select
                      name="projectType"
                      value={clientData.projectType}
                      onChange={handleClientChange}
                      className="w-full px-4 py-3 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      <option value="Business Website">Business Website</option>
                      <option value="Web Application">Web Application</option>
                      <option value="E-commerce Store">E-commerce Store</option>
                      <option value="React & MERN Stack">React & MERN Stack</option>
                      <option value="Admin Portal / Dashboard">Admin Portal / Dashboard</option>
                      <option value="Custom System">Custom System</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                      Estimated Budget
                    </label>
                    <input
                      type="text"
                      name="budget"
                      value={clientData.budget}
                      onChange={handleClientChange}
                      placeholder="e.g. $1,000 - $5,000"
                      className="w-full px-4 py-3 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                    Project Message / Description <span className="text-blue-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    value={clientData.message}
                    onChange={handleClientChange}
                    placeholder="Tell us about the project, required features, timeline, or problems you are looking to solve..."
                    className="w-full px-4 py-3 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500 transition-colors resize-y"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 transition-all shadow-lg shadow-blue-600/20"
                >
                  {submitting ? (
                    <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>{submitting ? 'Sending inquiry...' : 'Submit Inquiry'}</span>
                </button>
              </form>
            ) : (
              /* Developer Application Form ("Join Us") */
              <form onSubmit={handleDevSubmit} className="space-y-6">
                <input
                  type="text"
                  name="honeypot"
                  value={devData.honeypot}
                  onChange={handleDevChange}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="pb-3 border-b border-[#262833] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white font-heading font-semibold text-sm">
                    <Code2 className="w-4 h-4 text-blue-400" />
                    <span>Developer Application Form</span>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-400">Join SH Web Studio</span>
                </div>

                {errorMessage && (
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                      Full Name <span className="text-blue-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={devData.name}
                      onChange={handleDevChange}
                      placeholder="e.g. Ali Ahmed"
                      className="w-full px-4 py-3 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                      Email Address <span className="text-blue-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={devData.email}
                      onChange={handleDevChange}
                      placeholder="developer@gmail.com"
                      className="w-full px-4 py-3 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                      Primary Specialization <span className="text-blue-500">*</span>
                    </label>
                    <select
                      name="role"
                      value={devData.role}
                      onChange={handleDevChange}
                      className="w-full px-4 py-3 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      <option value="Full-Stack MERN Developer">Full-Stack MERN Developer</option>
                      <option value="Frontend React Developer">Frontend React / Next.js Developer</option>
                      <option value="Backend Node.js Engineer">Backend Node.js / Express Engineer</option>
                      <option value="UI/UX & Frontend Designer">UI/UX & Frontend Designer</option>
                      <option value="Database & Cloud Architect">Database & Cloud Architect</option>
                      <option value="Junior Web Developer">Junior Web Developer / Intern</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                      Experience Level
                    </label>
                    <select
                      name="experience"
                      value={devData.experience}
                      onChange={handleDevChange}
                      className="w-full px-4 py-3 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      <option value="Less than 1 Year">Less than 1 Year / Fresher</option>
                      <option value="1 - 2 Years">1 - 2 Years</option>
                      <option value="3 - 5 Years">3 - 5 Years</option>
                      <option value="5+ Years (Senior)">5+ Years (Senior)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2 flex items-center gap-1.5">
                      <Github className="w-3.5 h-3.5 text-blue-400" />
                      <span>GitHub Profile URL <span className="text-blue-500">*</span></span>
                    </label>
                    <input
                      type="url"
                      name="githubUrl"
                      value={devData.githubUrl}
                      onChange={handleDevChange}
                      placeholder="https://github.com/yourhandle"
                      className="w-full px-4 py-3 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500 transition-colors font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-blue-400" />
                      <span>Portfolio / Live Project Link</span>
                    </label>
                    <input
                      type="url"
                      name="portfolioUrl"
                      value={devData.portfolioUrl}
                      onChange={handleDevChange}
                      placeholder="https://yourportfolio.dev"
                      className="w-full px-4 py-3 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500 transition-colors font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={devData.phone}
                      onChange={handleDevChange}
                      placeholder="+92 300 1234567"
                      className="w-full px-4 py-3 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                      Key Technologies & Skills
                    </label>
                    <input
                      type="text"
                      name="skills"
                      value={devData.skills}
                      onChange={handleDevChange}
                      placeholder="React, Node.js, Express, MongoDB, TypeScript"
                      className="w-full px-4 py-3 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                    About You & Why You Want to Join SH Web Studio <span className="text-blue-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    value={devData.message}
                    onChange={handleDevChange}
                    placeholder="Briefly describe your programming background, notable projects you built, your strengths, and your availability..."
                    className="w-full px-4 py-3 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500 transition-colors resize-y"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 transition-all shadow-lg shadow-blue-600/20"
                >
                  {submitting ? (
                    <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>{submitting ? 'Submitting Application...' : 'Submit Developer Application'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
