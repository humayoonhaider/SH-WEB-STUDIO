import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, CheckCircle2, AlertCircle, Search, Share2, BarChart2, TrendingUp, MousePointer2, Eye } from 'lucide-react';
import { SEOSettings } from '../../types';
import { api } from '../../services/api';
import { Spinner } from '../../components/common/Loader';

declare global {
  interface Window {
    google: any;
  }
}

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
  
  // Search Console State
  const [scData, setScData] = useState<any>(null);
  const [scLoading, setScLoading] = useState(false);
  const [scError, setScError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

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

  const handleConnectSC = () => {
    setScLoading(true);
    setScError(null);

    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: '484569756976-lv5v1k6m0q4m7m3n7q2v1m5v1m5v1m5v.apps.googleusercontent.com', // This should match the one from set_up_oauth
      scope: 'https://www.googleapis.com/auth/webmasters.readonly',
      callback: async (tokenResponse: any) => {
        if (tokenResponse.access_token) {
          try {
            const res = await api.seo.getSearchConsole(tokenResponse.access_token);
            if (res.success) {
              setScData(res.data);
              setIsConnected(true);
            } else {
              setScError(res.message || 'Failed to fetch Search Console data.');
            }
          } catch (err: any) {
            setScError(err.message || 'Error connecting to Search Console.');
          } finally {
            setScLoading(false);
          }
        } else {
          setScLoading(false);
          setScError('Authorization failed.');
        }
      },
    });
    client.requestAccessToken();
  };

  const handleChange = (
// ... existing handleChange code
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

      {/* Google Search Console Insights Module */}
      <div className="p-8 rounded-3xl bg-[#121318] border border-[#262833] relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Search Console Insights</h2>
              <p className="text-xs text-neutral-500">Organic performance data directly from Google.</p>
            </div>
          </div>

          <button
            onClick={handleConnectSC}
            disabled={scLoading}
            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md ${
              isConnected 
              ? 'text-emerald-400 bg-emerald-400/10 border border-emerald-400/30' 
              : 'text-white bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {scLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <BarChart2 className="w-4 h-4" />}
            <span>{isConnected ? 'Analytics Connected' : 'Connect Search Console'}</span>
          </button>
        </div>

        {scError && (
          <div className="p-4 mb-6 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {scError}
          </div>
        )}

        {!isConnected && !scLoading && (
          <div className="py-10 text-center border-2 border-dashed border-[#1C1D24] rounded-2xl">
            <Search className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
            <p className="text-neutral-400 text-sm max-w-sm mx-auto">
              Connect your Google Search Console account to visualize organic traffic, top queries, and performance trends.
            </p>
          </div>
        )}

        {isConnected && scData && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Top Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-[#0E0F14] border border-[#1C1D24]">
                <div className="flex items-center gap-2 text-neutral-500 mb-1">
                  <MousePointer2 className="w-4 h-4" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Total Clicks</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {scData.rows?.reduce((acc: number, row: any) => acc + row.clicks, 0) || 0}
                </div>
                <p className="text-[10px] text-neutral-500 mt-1">Last 30 days</p>
              </div>
              <div className="p-5 rounded-2xl bg-[#0E0F14] border border-[#1C1D24]">
                <div className="flex items-center gap-2 text-neutral-500 mb-1">
                  <Eye className="w-4 h-4" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Total Impressions</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {scData.rows?.reduce((acc: number, row: any) => acc + row.impressions, 0) || 0}
                </div>
                <p className="text-[10px] text-neutral-500 mt-1">Last 30 days</p>
              </div>
              <div className="p-5 rounded-2xl bg-[#0E0F14] border border-[#1C1D24]">
                <div className="flex items-center gap-2 text-neutral-500 mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Avg. CTR</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {((scData.rows?.reduce((acc: number, row: any) => acc + row.ctr, 0) / (scData.rows?.length || 1)) * 100).toFixed(2)}%
                </div>
                <p className="text-[10px] text-neutral-500 mt-1">Last 30 days</p>
              </div>
            </div>

            {/* Top Queries Table */}
            <div>
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">Top Performing Queries</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] text-neutral-500 border-b border-[#1C1D24]">
                      <th className="pb-3 font-bold uppercase tracking-wider">Keyword / Query</th>
                      <th className="pb-3 font-bold uppercase tracking-wider text-right">Clicks</th>
                      <th className="pb-3 font-bold uppercase tracking-wider text-right">Impr.</th>
                      <th className="pb-3 font-bold uppercase tracking-wider text-right">Position</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1C1D24]">
                    {scData.rows?.map((row: any, idx: number) => (
                      <tr key={idx} className="group hover:bg-white/[0.02]">
                        <td className="py-3 text-sm text-neutral-300 font-medium">{row.keys[0]}</td>
                        <td className="py-3 text-sm text-white font-bold text-right">{row.clicks}</td>
                        <td className="py-3 text-sm text-neutral-400 text-right">{row.impressions}</td>
                        <td className="py-3 text-sm text-blue-400 font-mono text-right">{row.position.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

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

      {/* Dynamic Social Templates Manager */}
      <div className="bg-[#121318] border border-[#262833] rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-blue-600/10 text-blue-400">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-heading">Dynamic Social Card Logic</h2>
            <p className="text-xs text-neutral-500">Automated OG Tag generation for Project and Service pages.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#0E0F14] border border-[#1C1D24]">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Twitter Card Preview (Dynamic)</h3>
              <div className="rounded-xl border border-[#262833] overflow-hidden bg-[#17181D]">
                <div className="aspect-[2/1] bg-neutral-800 flex items-center justify-center overflow-hidden">
                  {formData.ogImage ? (
                    <img src={formData.ogImage} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[10px] text-neutral-500 font-mono">No Banner Selected</span>
                  )}
                </div>
                <div className="p-3 space-y-1">
                  <div className="text-[10px] text-neutral-500 uppercase font-mono">shwebstudio.dev</div>
                  <div className="text-sm font-bold text-white line-clamp-1">{formData.ogTitle || formData.metaTitle || 'SH Web Studio'}</div>
                  <div className="text-xs text-neutral-400 line-clamp-2">{formData.ogDescription || formData.metaDescription || 'Professional software development...'}</div>
                </div>
              </div>
            </div>

            <div className="bg-blue-600/5 border border-blue-600/20 rounded-xl p-4">
              <h4 className="text-xs font-bold text-blue-400 mb-2">How it works:</h4>
              <ul className="text-[11px] text-neutral-400 space-y-2 list-disc pl-4">
                <li>System automatically extracts Project Titles as <code className="text-blue-300">og:title</code>.</li>
                <li>Project descriptions are mapped to <code className="text-blue-300">og:description</code>.</li>
                <li>Featured project images are injected as <code className="text-blue-300">og:image</code>.</li>
                <li>Twitter Card type is fixed to <code className="text-blue-300">summary_large_image</code>.</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Default Twitter Handler
              </label>
              <div className="flex items-center gap-2">
                <span className="text-neutral-500 text-sm font-mono">@</span>
                <input
                  type="text"
                  placeholder="shwebstudio"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <p className="text-[11px] text-amber-200/70 leading-relaxed italic">
                "By enabling dynamic injection, each project detail page acts as a standalone marketing asset with its own unique social preview, increasing click-through rates by up to 40%."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
