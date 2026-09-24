import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, CheckCircle2, AlertCircle, Search, Share2 } from 'lucide-react';
import { SEOSettings } from '../../types';
import { api } from '../../services/api';
import { Spinner } from '../../components/common/Loader';

export const AdminSeoPage: React.FC = () => {
  const [formData, setFormData] = useState<SEOSettings>({
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    canonicalUrl: '',
    robots: 'index, follow',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    let mounted = true;
    api.seo
      .get()
      .then((res) => {
        if (mounted && res.success && res.data) {
          setFormData(res.data);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev: SEOSettings) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await api.seo.update(formData);
      if (res.success && res.data) {
        setFormData(res.data);
        setMessage({ type: 'success', text: 'SEO and OpenGraph metadata updated successfully.' });
      } else {
        setMessage({ type: 'error', text: res.message || 'Failed to update SEO.' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error saving SEO data.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Spinner size="lg" label="Loading SEO metadata..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1C1D24]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight">
            SEO & Social Metadata
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Configure Google search engine optimization, OpenGraph sharing cards, and crawler indexing rules.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 transition-all shadow-md"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving...' : 'Save SEO'}</span>
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

      {/* Google SERP Preview Card */}
      <div className="p-6 rounded-2xl bg-[#121318] border border-[#262833] space-y-2">
        <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Search className="w-3.5 h-3.5 text-blue-400" />
          <span>Google Search Result Preview</span>
        </div>
        <div className="text-xs text-neutral-400 font-mono">
          https://shwebstudio.com/
        </div>
        <div className="text-base text-blue-400 font-medium hover:underline cursor-pointer">
          {formData.metaTitle || 'SH Web Studio | Full-Stack Web Development Agency'}
        </div>
        <div className="text-xs text-neutral-300 max-w-2xl leading-relaxed">
          {formData.metaDescription ||
            'We Build Digital Experiences. Complete full-stack web development agency platform for modern websites, web applications, and custom digital solutions.'}
        </div>
      </div>

      {/* SEO Form */}
      <form onSubmit={handleSubmit} className="bg-[#121318] border border-[#262833] rounded-3xl p-6 sm:p-8 space-y-6">
        <h2 className="text-base font-bold text-white font-heading border-b border-[#1C1D24] pb-3">
          Search Engine Metadata
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
              Meta Title (Tag Title)
            </label>
            <input
              type="text"
              name="metaTitle"
              value={formData.metaTitle}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
            />
            <p className="text-[11px] text-neutral-500 mt-1">Recommended: 50-60 characters</p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
              Robots Crawler Directives
            </label>
            <select
              name="robots"
              value={formData.robots}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="index, follow">index, follow (Standard Public Indexing)</option>
              <option value="noindex, nofollow">noindex, nofollow (Private / Staging)</option>
              <option value="noindex, follow">noindex, follow</option>
              <option value="index, nofollow">index, nofollow</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
            Meta Description
          </label>
          <textarea
            name="metaDescription"
            rows={3}
            value={formData.metaDescription}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500 resize-y"
          />
          <p className="text-[11px] text-neutral-500 mt-1">Recommended: 150-160 characters</p>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
            Keywords (comma separated)
          </label>
          <input
            type="text"
            name="keywords"
            value={formData.keywords}
            onChange={handleChange}
            placeholder="web development agency, React developers, full-stack website studio, MERN applications"
            className="w-full px-4 py-2.5 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
            Canonical URL
          </label>
          <input
            type="url"
            name="canonicalUrl"
            value={formData.canonicalUrl || ''}
            onChange={handleChange}
            placeholder="https://shwebstudio.com"
            className="w-full px-4 py-2.5 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <h2 className="text-base font-bold text-white font-heading border-b border-[#1C1D24] pt-6 pb-3 flex items-center gap-2">
          <Share2 className="w-4 h-4 text-blue-400" />
          <span>OpenGraph & Social Sharing Cards (Facebook, LinkedIn, Twitter/X)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
              OG Title
            </label>
            <input
              type="text"
              name="ogTitle"
              value={formData.ogTitle || ''}
              onChange={handleChange}
              placeholder="Defaults to meta title if empty"
              className="w-full px-4 py-2.5 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
              OG Social Banner Image URL
            </label>
            <input
              type="url"
              name="ogImage"
              value={formData.ogImage || ''}
              onChange={handleChange}
              placeholder="https://your-domain.com/og-image.jpg"
              className="w-full px-4 py-2.5 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
            OG Description
          </label>
          <textarea
            name="ogDescription"
            rows={2}
            value={formData.ogDescription || ''}
            onChange={handleChange}
            placeholder="Defaults to meta description if empty"
            className="w-full px-4 py-2.5 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500 resize-y"
          />
        </div>

        <div className="pt-6 border-t border-[#1C1D24] flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 transition-all shadow-md"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Updating SEO...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
