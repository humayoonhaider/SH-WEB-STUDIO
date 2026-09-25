import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, AlertCircle, RefreshCw, Palette, Globe, Phone, Share2, Home, FileText, Plus, Trash2, ExternalLink } from 'lucide-react';
import { SiteSettings } from '../../types';
import { api } from '../../services/api';
import { useSite } from '../../context/SiteContext';

type TabType = 'general' | 'branding' | 'contact' | 'social' | 'homepage' | 'footer';

export const AdminSettingsPage: React.FC = () => {
  const { settings: initialSettings, updateSettingsState } = useSite();
  const [formData, setFormData] = useState<SiteSettings>(initialSettings);
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    setFormData(initialSettings);
  }, [initialSettings]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddPortfolio = () => {
    setFormData((prev) => ({
      ...prev,
      customPortfolios: [
        ...(prev.customPortfolios || []),
        { name: '', url: '', title: 'Founder Portfolio' },
      ],
    }));
  };

  const handlePortfolioChange = (index: number, field: string, value: string) => {
    setFormData((prev) => {
      const updated = [...(prev.customPortfolios || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, customPortfolios: updated };
    });
  };

  const handleRemovePortfolio = (index: number) => {
    setFormData((prev) => {
      const updated = [...(prev.customPortfolios || [])];
      updated.splice(index, 1);
      return { ...prev, customPortfolios: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await api.settings.update(formData);
      if (res.success && res.data) {
        updateSettingsState(res.data);
        setMessage({ type: 'success', text: 'Website settings saved successfully.' });
      } else {
        setMessage({ type: 'error', text: res.message || 'Failed to save settings.' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Network error saving settings.' });
    } finally {
      setSaving(false);
    }
  };

  const tabs: { id: TabType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'general', label: 'General Info', icon: Globe },
    { id: 'branding', label: 'Branding & Theme', icon: Palette },
    { id: 'contact', label: 'Contact & WhatsApp', icon: Phone },
    { id: 'social', label: 'Social & Links', icon: Share2 },
    { id: 'homepage', label: 'Homepage Content', icon: Home },
    { id: 'footer', label: 'Footer & Legal', icon: FileText },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1C1D24]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight">
            Website Settings
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Update your business branding, contact points, homepage copy, and social profiles in database.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 transition-all shadow-md"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-xs sm:text-sm flex items-start gap-3 ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Tabs Row */}
      <div className="flex overflow-x-auto gap-2 border-b border-[#262833] pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Settings Form Body */}
      <form onSubmit={handleSubmit} className="bg-[#121318] border border-[#262833] rounded-3xl p-6 sm:p-8 space-y-6">
        {/* Tab 1: General Info */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-white font-heading border-b border-[#1C1D24] pb-3">
              General Business Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                  Business Name
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                  Tagline
                </label>
                <input
                  type="text"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Service Line
              </label>
              <input
                type="text"
                name="serviceLine"
                value={formData.serviceLine}
                onChange={handleChange}
                placeholder="Websites • Web Apps • Digital Solutions"
                className="w-full px-4 py-2.5 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Agency Description
              </label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500 resize-y"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Branding */}
        {activeTab === 'branding' && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-white font-heading border-b border-[#1C1D24] pb-3">
              Branding Assets & Colors
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                  Logo URL
                </label>
                <input
                  type="url"
                  name="logoUrl"
                  value={formData.logoUrl}
                  onChange={handleChange}
                  placeholder="https://your-domain.com/logo.svg (optional fallback to text wordmark)"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
                />
                <p className="text-[11px] text-neutral-500 mt-1.5">
                  If left blank, the website renders the typographic "SH Web Studio" wordmark.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                  Favicon URL
                </label>
                <input
                  type="url"
                  name="faviconUrl"
                  value={formData.faviconUrl}
                  onChange={handleChange}
                  placeholder="https://your-domain.com/favicon.ico"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                  Primary Dark Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    name="primaryColor"
                    value={formData.primaryColor || '#0B0B0F'}
                    onChange={handleChange}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-[#262833]"
                  />
                  <input
                    type="text"
                    name="primaryColor"
                    value={formData.primaryColor}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl bg-[#17181D] border border-[#262833] text-xs font-mono text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                  Secondary Charcoal Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    name="secondaryColor"
                    value={formData.secondaryColor || '#17181D'}
                    onChange={handleChange}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-[#262833]"
                  />
                  <input
                    type="text"
                    name="secondaryColor"
                    value={formData.secondaryColor}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl bg-[#17181D] border border-[#262833] text-xs font-mono text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                  Accent Blue Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    name="accentColor"
                    value={formData.accentColor || '#2563EB'}
                    onChange={handleChange}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-[#262833]"
                  />
                  <input
                    type="text"
                    name="accentColor"
                    value={formData.accentColor}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl bg-[#17181D] border border-[#262833] text-xs font-mono text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Contact & WhatsApp */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-white font-heading border-b border-[#1C1D24] pb-3">
              Direct Contact & WhatsApp Configuration
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                  Public Contact Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="humayoonkhan003@gmail.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                  Public Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                  WhatsApp Number
                </label>
                <input
                  type="text"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  placeholder="e.g. 923001234567 (with country code, no + or spaces)"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
                />
                <p className="text-[11px] text-neutral-500 mt-1.5">
                  If left empty, WhatsApp buttons are hidden automatically from the public site.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                  Physical / Studio Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="City, Country"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Social & Links */}
        {activeTab === 'social' && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-white font-heading border-b border-[#1C1D24] pb-3">
              Configured Social & External Profiles
            </h2>
            <p className="text-xs text-neutral-400">
              Only filled links will be shown on the public site footer. Empty fields are hidden automatically.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                  Portfolio Link
                </label>
                <input
                  type="url"
                  name="portfolioUrl"
                  value={formData.portfolioUrl}
                  onChange={handleChange}
                  placeholder="https://humayoon-portfolio.vercel.app/"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                  GitHub Profile URL
                </label>
                <input
                  type="url"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleChange}
                  placeholder="https://github.com/humayoonhaider"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                  Instagram URL
                </label>
                <input
                  type="url"
                  name="instagramUrl"
                  value={formData.instagramUrl}
                  onChange={handleChange}
                  placeholder="https://instagram.com/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                  Facebook URL
                </label>
                <input
                  type="url"
                  name="facebookUrl"
                  value={formData.facebookUrl}
                  onChange={handleChange}
                  placeholder="https://facebook.com/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Multiple Founder & Team Portfolios Section */}
            <div className="pt-6 border-t border-[#1C1D24] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white font-heading">
                    Founder & Creator Portfolios (Footer Multi-Links)
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Add as many founder or developer portfolios as you want. Each one will be listed in the website footer.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddPortfolio}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shrink-0 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Founder Portfolio</span>
                </button>
              </div>

              {formData.customPortfolios && formData.customPortfolios.length > 0 ? (
                <div className="space-y-3">
                  {formData.customPortfolios.map((portfolio, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-[#17181D] border border-[#262833] flex flex-col sm:flex-row items-center gap-3"
                    >
                      <div className="w-full sm:w-1/3">
                        <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                          Founder Name / Title
                        </label>
                        <input
                          type="text"
                          value={portfolio.name}
                          onChange={(e) => handlePortfolioChange(idx, 'name', e.target.value)}
                          placeholder="e.g. Humayoon (Lead Engineer)"
                          className="w-full px-3 py-2 rounded-xl bg-[#121318] border border-[#262833] text-white text-xs focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="w-full sm:w-1/2">
                        <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                          Portfolio URL
                        </label>
                        <input
                          type="url"
                          value={portfolio.url}
                          onChange={(e) => handlePortfolioChange(idx, 'url', e.target.value)}
                          placeholder="https://yourportfolio.dev"
                          className="w-full px-3 py-2 rounded-xl bg-[#121318] border border-[#262833] text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="w-full sm:w-auto flex items-end sm:pt-4">
                        <button
                          type="button"
                          onClick={() => handleRemovePortfolio(idx)}
                          className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                          title="Remove this portfolio"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-[#17181D] border border-dashed border-[#262833] text-center text-xs text-neutral-400 space-y-2">
                  <p>No custom founder portfolios added yet. (Registered team members with portfolios are also shown automatically).</p>
                  <button
                    type="button"
                    onClick={handleAddPortfolio}
                    className="text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Click to add your first custom founder portfolio</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 5: Homepage Content */}
        {activeTab === 'homepage' && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-white font-heading border-b border-[#1C1D24] pb-3">
              Homepage Copy & Hero Section
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                  Hero Title
                </label>
                <input
                  type="text"
                  name="heroTitle"
                  value={formData.heroTitle}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                  Hero Primary Button Text
                </label>
                <input
                  type="text"
                  name="heroPrimaryButtonText"
                  value={formData.heroPrimaryButtonText}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Hero Description
              </label>
              <textarea
                name="heroDescription"
                rows={3}
                value={formData.heroDescription}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500 resize-y"
              />
            </div>

            <div className="border-t border-[#1C1D24] pt-6 space-y-6">
              <h3 className="text-sm font-semibold text-white font-heading">
                About Section Copy
              </h3>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                  About Title
                </label>
                <input
                  type="text"
                  name="aboutTitle"
                  value={formData.aboutTitle}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                  About Description
                </label>
                <textarea
                  name="aboutDescription"
                  rows={4}
                  value={formData.aboutDescription}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500 resize-y font-mono text-xs"
                />
              </div>
            </div>

            <div className="border-t border-[#1C1D24] pt-6 space-y-6">
              <h3 className="text-sm font-semibold text-white font-heading">
                Call to Action Section Copy
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                    CTA Title
                  </label>
                  <input
                    type="text"
                    name="ctaTitle"
                    value={formData.ctaTitle}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                    CTA Description
                  </label>
                  <input
                    type="text"
                    name="ctaDescription"
                    value={formData.ctaDescription}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Footer */}
        {activeTab === 'footer' && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-white font-heading border-b border-[#1C1D24] pb-3">
              Footer & Copyright Information
            </h2>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Footer Copyright Text
              </label>
              <input
                type="text"
                name="footerText"
                value={formData.footerText}
                onChange={handleChange}
                placeholder="© 2026 SH Web Studio. All rights reserved."
                className="w-full px-4 py-2.5 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}

        <div className="pt-6 border-t border-[#1C1D24] flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 transition-all shadow-md"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Saving changes...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
