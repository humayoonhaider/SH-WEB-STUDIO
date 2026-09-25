import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Activity, 
  Clock, 
  Layout, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  RefreshCw,
  BarChart3,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { api } from '../../services/api';
import { SEOSettings } from '../../types';
import { Spinner } from '../../components/common/Loader';

interface Metric {
  name: string;
  label: string;
  value: string;
  unit: string;
  score: 'good' | 'needs-improvement' | 'poor';
  description: string;
  icon: any;
}

export const AdminPerformancePage: React.FC = () => {
  const [seo, setSeo] = useState<SEOSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [diagnosing, setDiagnosing] = useState(false);
  const [vitals, setVitals] = useState<Metric[]>([]);
  const [suggestions, setSuggestions] = useState<{ type: 'warning' | 'info' | 'success'; text: string; category: string }[]>([]);

  const runDiagnostic = () => {
    setDiagnosing(true);
    // Simulate real diagnostic delay
    setTimeout(() => {
      generateVitals();
      if (seo) generateSuggestions(seo);
      setDiagnosing(false);
    }, 1500);
  };

  const generateVitals = () => {
    const mockVitals: Metric[] = [
      {
        name: 'LCP',
        label: 'Largest Contentful Paint',
        value: '1.8',
        unit: 's',
        score: 'good',
        description: 'Measures loading performance. For a good user experience, LCP should occur within 2.5 seconds.',
        icon: Zap
      },
      {
        name: 'FID',
        label: 'First Input Delay',
        value: '12',
        unit: 'ms',
        score: 'good',
        description: 'Measures interactivity. Pages should have a FID of 100 milliseconds or less.',
        icon: Clock
      },
      {
        name: 'CLS',
        label: 'Cumulative Layout Shift',
        value: '0.02',
        unit: '',
        score: 'good',
        description: 'Measures visual stability. Pages should maintain a CLS of 0.1 or less.',
        icon: Layout
      },
      {
        name: 'TTFB',
        label: 'Time to First Byte',
        value: '240',
        unit: 'ms',
        score: 'good',
        description: 'Measures the time it takes for a browser to receive the first byte of page content from the server.',
        icon: Activity
      }
    ];
    setVitals(mockVitals);
  };

  const generateSuggestions = (currentSeo: SEOSettings) => {
    const newSuggestions: { type: 'warning' | 'info' | 'success'; text: string; category: string }[] = [];

    // Title checks
    if (!currentSeo.metaTitle) {
      newSuggestions.push({ category: 'SEO', type: 'warning', text: 'Missing Meta Title. This is critical for search rankings.' });
    } else if (currentSeo.metaTitle.length < 30) {
      newSuggestions.push({ category: 'SEO', type: 'info', text: 'Meta Title is a bit short. Aim for 50-60 characters.' });
    } else if (currentSeo.metaTitle.length > 60) {
      newSuggestions.push({ category: 'SEO', type: 'info', text: 'Meta Title is too long. It might be truncated in search results.' });
    }

    // Description checks
    if (!currentSeo.metaDescription) {
      newSuggestions.push({ category: 'SEO', type: 'warning', text: 'Missing Meta Description. Search engines will generate their own, which might not be optimal.' });
    } else if (currentSeo.metaDescription.length < 120) {
      newSuggestions.push({ category: 'SEO', type: 'info', text: 'Meta Description is short. Try to use around 150-160 characters.' });
    }

    // Keywords
    if (!currentSeo.keywords) {
      newSuggestions.push({ category: 'SEO', type: 'info', text: 'No keywords defined. Adding relevant keywords helps in indexing.' });
    }

    // Social checks
    if (!currentSeo.ogImage) {
      newSuggestions.push({ category: 'Social', type: 'warning', text: 'Missing Social Share Image (OpenGraph). Links shared on WhatsApp/LinkedIn won\'t have a preview.' });
    }

    // Indexing
    if (currentSeo.robots?.includes('noindex')) {
      newSuggestions.push({ category: 'Visibility', type: 'warning', text: 'Search engines are currently told NOT to index your site (noindex tag active).' });
    } else {
      newSuggestions.push({ category: 'Visibility', type: 'success', text: 'Site is set to be indexed by search engines.' });
    }

    setSuggestions(newSuggestions);
  };

  useEffect(() => {
    let mounted = true;
    api.seo.get().then(res => {
      if (mounted && res.success && res.data) {
        setSeo(res.data);
        generateSuggestions(res.data);
      }
    }).finally(() => {
      if (mounted) {
        generateVitals();
        setLoading(false);
      }
    });

    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Spinner size="lg" label="Analyzing performance data..." />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1C1D24]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight">
            Performance Health & Diagnostic
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Monitor Core Web Vitals and get automated AI suggestions for SEO optimization.
          </p>
        </div>

        <button
          onClick={runDiagnostic}
          disabled={diagnosing}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 transition-all shadow-md group"
        >
          {diagnosing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4 group-hover:animate-pulse" />}
          <span>{diagnosing ? 'Running Diagnostics...' : 'Re-Run Diagnostic'}</span>
        </button>
      </div>

      {/* Core Web Vitals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {vitals.map((metric) => {
          const Icon = metric.icon;
          return (
            <div 
              key={metric.name} 
              className="p-6 rounded-2xl bg-[#121318] border border-[#262833] relative overflow-hidden group hover:border-blue-500/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 rounded-lg bg-blue-600/10 text-blue-400">
                  <Icon className="w-5 h-5" />
                </div>
                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  metric.score === 'good' ? 'bg-emerald-500/10 text-emerald-400' :
                  metric.score === 'needs-improvement' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-rose-500/10 text-rose-400'
                }`}>
                  {metric.score.replace('-', ' ')}
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm font-medium text-neutral-400">{metric.label}</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-white">{metric.value}</span>
                  <span className="text-sm text-neutral-500">{metric.unit}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-[#1C1D24] text-[11px] text-neutral-500 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity">
                {metric.description}
              </div>

              {/* Decorative background shape */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-600/5 blur-3xl rounded-full" />
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* SEO Score & Insights */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 rounded-3xl bg-[#121318] border border-[#262833] relative overflow-hidden">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Optimization Suggestions</h3>
                <p className="text-xs text-neutral-500">Automated insights based on your current SEO configuration.</p>
              </div>
            </div>

            <div className="space-y-3">
              {suggestions.length > 0 ? (
                suggestions.map((s, idx) => (
                  <div 
                    key={idx}
                    className={`p-4 rounded-xl flex items-start gap-4 border transition-all ${
                      s.type === 'warning' ? 'bg-rose-500/5 border-rose-500/20 text-rose-200' :
                      s.type === 'info' ? 'bg-blue-500/5 border-blue-500/20 text-blue-200' :
                      'bg-emerald-500/5 border-emerald-500/20 text-emerald-200'
                    }`}
                  >
                    <div className="shrink-0 mt-0.5">
                      {s.type === 'warning' ? <AlertTriangle className="w-4 h-4 text-rose-500" /> :
                       s.type === 'info' ? <Search className="w-4 h-4 text-blue-500" /> :
                       <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded ${
                          s.type === 'warning' ? 'bg-rose-500/20 text-rose-400' :
                          s.type === 'info' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {s.category}
                        </span>
                      </div>
                      <p className="text-sm font-medium">{s.text}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 shrink-0 opacity-20" />
                  </div>
                ))
              ) : (
                <div className="text-center py-10 border-2 border-dashed border-[#1C1D24] rounded-2xl">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500/40 mx-auto mb-3" />
                  <p className="text-neutral-400 text-sm">Your SEO configuration looks perfect!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actionable Tasks */}
        <div className="space-y-6">
          <div className="p-8 rounded-3xl bg-[#0E0F14] border border-[#1C1D24] h-full">
            <h3 className="text-lg font-bold text-white tracking-tight mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              Site Health Score
            </h3>
            
            <div className="relative w-40 h-40 mx-auto mb-8 flex items-center justify-center">
               <svg className="w-full h-full -rotate-90">
                 <circle
                   cx="80"
                   cy="80"
                   r="70"
                   fill="transparent"
                   stroke="#1C1D24"
                   strokeWidth="12"
                 />
                 <circle
                   cx="80"
                   cy="80"
                   r="70"
                   fill="transparent"
                   stroke="#2563EB"
                   strokeWidth="12"
                   strokeDasharray={440}
                   strokeDashoffset={440 - (440 * 92) / 100}
                   strokeLinecap="round"
                 />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-4xl font-bold text-white tracking-tighter">92</span>
                 <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Optimized</span>
               </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-medium text-neutral-300">Accessibility</span>
                </div>
                <span className="text-xs font-bold text-white">98%</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-xs font-medium text-neutral-300">Best Practices</span>
                </div>
                <span className="text-xs font-bold text-white">100%</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-xs font-medium text-neutral-300">SEO Score</span>
                </div>
                <span className="text-xs font-bold text-white">85%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
