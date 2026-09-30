import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowDown, Code, Server, Database } from 'lucide-react';
import { useSite } from '../../context/SiteContext';

export const Hero: React.FC = () => {
  const { settings } = useSite();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-20 overflow-hidden">
      {/* Subtle architectural background grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(to right, #ffffff 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Subtle radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Unboxed agency kicker */}
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-6">
          <span className="w-2 h-2 rounded-full bg-blue-500 inline-block animate-pulse" />
          <span>{settings.serviceLine || 'Websites • Web Apps • Digital Solutions'}</span>
        </div>

        {/* Hero Heading */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white font-heading max-w-5xl mx-auto leading-[1.1]">
          {settings.heroTitle || 'We Build Digital Experiences.'}
        </h1>

        {/* Hero Supporting Text */}
        <p className="mt-6 sm:mt-8 text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto font-normal leading-relaxed">
          {settings.heroDescription ||
            'We design and develop modern websites and custom web applications that help businesses build a stronger digital presence.'}
        </p>

        {/* CTAs */}
        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-all shadow-lg shadow-blue-600/20"
          >
            <span>{settings.heroPrimaryButtonText || 'Start a Project'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/work"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-base font-medium text-neutral-300 hover:text-white bg-[#17181D] hover:bg-[#1C1D24] border border-[#262833] transition-all"
          >
            <span>{settings.heroSecondaryButtonText || 'View Our Work'}</span>
          </Link>
        </div>

        {/* Architectural Tech Indicators */}
        <div className="mt-20 pt-8 border-t border-[#1C1D24] max-w-3xl mx-auto flex items-center justify-between text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-blue-500/80" />
            <span>Modern Frontend (React & Vite)</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-500/80" />
            <span>Robust Backend (Node.js & Express)</span>
          </div>
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-purple-500/80" />
            <span>Scalable Database (MongoDB)</span>
          </div>
        </div>
      </div>
    </section>
  );
};
