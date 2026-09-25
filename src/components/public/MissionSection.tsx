import React from 'react';
import { Target, Zap, Shield, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SectionHeading } from '../common/SectionHeading';

export const MissionSection: React.FC = () => {
  const missionPillars = [
    {
      icon: Zap,
      number: '01',
      title: 'Precision & Speed',
      description:
        'We engineer lightweight, blazing-fast web applications built on modern React and Node.js architectures, completely eradicating sluggish page loads and digital friction.',
    },
    {
      icon: TrendingUp,
      number: '02',
      title: 'Business-Aligned Impact',
      description:
        'Technology is only as good as the problems it solves. Every feature, database schema, and interface component is calibrated to drive conversions and tangible growth.',
    },
    {
      icon: Shield,
      number: '03',
      title: 'Direct Builder Partnership',
      description:
        'No account managers, no bureaucratic delays. You collaborate directly with senior engineers who understand your domain, write pristine code, and take ownership.',
    },
  ];

  return (
    <section id="our-mission" className="py-24 border-t border-[#1C1D24] bg-[#08080C] relative overflow-hidden">
      {/* Background architectural glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[350px] bg-blue-600/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Heading & Core Mission Narrative */}
          <div className="lg:col-span-5 space-y-6">
            <SectionHeading
              kicker="Our Mission"
              title="Building High-Impact Web Solutions That Drive Real Business Growth."
              description="At SH Web Studio, our mission is straightforward: to eliminate technical friction for ambitious businesses by delivering modern, scalable, and beautifully engineered web applications."
              className="mb-0"
            />

            <div className="space-y-4 text-sm sm:text-base text-neutral-400 leading-relaxed pt-2">
              <p>
                We believe that modern businesses shouldn't have to choose between bloated enterprise agency fees and subpar cookie-cutter templates.
              </p>
              <p>
                Our mission is to bring bespoke software engineering, rock-solid security, and obsessive attention to user experience to every project we undertake.
              </p>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <Link
                to="/services"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors"
              >
                <span>Explore What We Build</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: 3 Strategic Pillars */}
          <div className="lg:col-span-7 space-y-4">
            {missionPillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.number}
                  className="group rounded-2xl bg-[#0F1015] border border-[#262833] hover:border-blue-500/40 p-6 sm:p-7 transition-all duration-300 flex flex-col sm:flex-row items-start gap-5 shadow-lg"
                >
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-[#161720] border border-[#262833] flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-xs font-bold text-neutral-500 sm:hidden">
                      {pillar.number}
                    </span>
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base sm:text-lg font-bold text-white font-heading tracking-tight group-hover:text-blue-400 transition-colors">
                        {pillar.title}
                      </h3>
                      <span className="hidden sm:inline-block font-mono text-xs text-neutral-500 font-semibold">
                        {pillar.number}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
