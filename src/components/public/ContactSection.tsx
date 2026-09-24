import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2, AlertCircle } from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import { api } from '../../services/api';
import { SectionHeading } from '../common/SectionHeading';

export const ContactSection: React.FC = () => {
  const { settings } = useSite();

  const [formData, setFormData] = useState({
    name: '',
    business: '',
    email: '',
    phone: '',
    projectType: 'Business Website',
    budget: '',
    message: '',
    honeypot: '', // anti-spam hidden field
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Client-side quick checks
    if (!formData.name.trim()) {
      setErrorMessage('Please provide your name.');
      return;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (!formData.message.trim() || formData.message.trim().length < 5) {
      setErrorMessage('Please include a project message of at least 5 characters.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await api.inquiries.submit(formData);
      if (res.success) {
        setSuccessMessage(res.message || 'Thank you! Your inquiry has been sent to our team.');
        setFormData({
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

  // WhatsApp link generation with prefilled encoded message
  const whatsappUrl = settings.whatsappNumber
    ? `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
        'Hello SH Web Studio, I would like to discuss a web development project.'
      )}`
    : null;

  return (
    <section id="contact" className="py-24 border-t border-[#1C1D24] bg-[#0B0B0F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Context & Contact Details */}
          <div className="lg:col-span-5 space-y-8">
            <SectionHeading
              kicker="Get In Touch"
              title="Start a project with SH Web Studio."
              description="Whether you have an established specification or an early-stage concept, we will review your goals and provide an architectural roadmap."
              className="mb-0"
            />

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
                    <div className="text-xs text-neutral-500 font-medium">Phone Support</div>
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

              {/* WhatsApp Option - only if configured */}
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
                  Inquiry Received
                </h3>
                <p className="text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
                  {successMessage}
                </p>
                <button
                  onClick={() => setSuccessMessage(null)}
                  className="mt-4 px-6 py-2.5 text-sm font-medium rounded-xl text-white bg-[#1C1D24] hover:bg-[#252731] border border-[#262833] transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot hidden input */}
                <input
                  type="text"
                  name="honeypot"
                  value={formData.honeypot}
                  onChange={handleChange}
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
                      value={formData.name}
                      onChange={handleChange}
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
                      value={formData.business}
                      onChange={handleChange}
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
                      value={formData.email}
                      onChange={handleChange}
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
                      value={formData.phone}
                      onChange={handleChange}
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
                      value={formData.projectType}
                      onChange={handleChange}
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
                      value={formData.budget}
                      onChange={handleChange}
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
                    value={formData.message}
                    onChange={handleChange}
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
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
