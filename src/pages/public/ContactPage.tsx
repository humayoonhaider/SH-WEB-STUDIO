import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ContactSection } from '../../components/public/ContactSection';
import { Users, Briefcase, Code2, Sparkles, ArrowDown, Send } from 'lucide-react';

export const ContactPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Contact SH Web Studio | Start a Project or Join Us';
  }, []);

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'client';

  const handleSelectTab = (tab: 'client' | 'join') => {
    setSearchParams({ tab });
    const target = document.getElementById('contact');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="pt-28 pb-16">
      {/* Contact Page Hero Header with Prominent Join Studio CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="rounded-3xl bg-gradient-to-b from-[#121318] to-[#0B0B0F] border border-[#262833] p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
          {/* Subtle architectural background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Connect & Collaborate</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
              Get in Touch with SH Web Studio
            </h1>

            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed max-w-2xl mx-auto">
              Whether you are looking to build a high-performance web application or want to join our engineering collective, we are ready to talk.
            </p>

            {/* Two Action Buttons: Start Project vs Join Studio */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => handleSelectTab('client')}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab !== 'join'
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25'
                    : 'bg-[#17181D] hover:bg-[#1C1D24] text-neutral-300 border border-[#262833]'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Start a Client Project</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTab('join')}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all relative ${
                  activeTab === 'join'
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25'
                    : 'bg-[#17181D] hover:bg-[#1E202A] text-emerald-400 border border-emerald-500/40 hover:border-emerald-500/70'
                }`}
              >
                <Code2 className="w-4 h-4" />
                <span>Join SH Web Studio (Developer / Creator)</span>
                <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  WE'RE HIRING
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Contact & Application Section */}
      <ContactSection />
    </div>
  );
};
