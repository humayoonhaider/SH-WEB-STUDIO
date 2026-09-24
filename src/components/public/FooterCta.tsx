import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare } from 'lucide-react';
import { useSite } from '../../context/SiteContext';

export const FooterCta: React.FC = () => {
  const { settings } = useSite();

  const whatsappUrl = settings.whatsappNumber
    ? `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
        'Hello SH Web Studio, I would like to discuss a web development project.'
      )}`
    : null;

  return (
    <section className="py-20 bg-[#0E0F14] border-t border-[#1C1D24] relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-heading">
          {settings.ctaTitle || 'Have a project in mind?'}
        </h2>
        <p className="mt-4 text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          {settings.ctaDescription ||
            "Tell us what you're building and let's discuss how we can turn the idea into a practical digital solution."}
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-all shadow-lg shadow-blue-600/20"
          >
            <span>Start a Project</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl text-base font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 hover:bg-emerald-900/40 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
};
