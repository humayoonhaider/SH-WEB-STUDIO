import React from 'react';
import { Eye, Compass, Sparkles, Layers, Cpu, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SectionHeading } from '../common/SectionHeading';

export const VisionSection: React.FC = () => {
  const visionElements = [
    {
      icon: Layers,
      title: 'Global Engineering Standards',
      description:
        'To establish SH Web Studio as an internationally recognized benchmark for clean architecture, resilient infrastructure, and production-grade full-stack delivery.',
    },
    {
      icon: Cpu,
      title: 'Architectural Innovation',
      description:
        'Continuously bridging cutting-edge web technologies—from headless APIs and cloud native deployments to intelligent automation—into usable, robust digital products.',
    },
    {
      icon: Users,
      title: 'Fostering Developer Excellence',
      description:
        'Cultivating a collaborative environment where world-class engineers, designers, and creators come together to solve complex business problems with pride.',
    },
  ];

  return (
    <section id="our-vision" className="py-24 border-t border-[#1C1D24] bg-[#0B0B0F] relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[350px] bg-blue-500/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>Our Vision</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
            Defining the Next Generation of Modern Web Development.
          </h2>

          <p className="text-base sm:text-lg text-neutral-400 leading-relaxed font-normal">
            We envision a web ecosystem where ambitious businesses of all sizes possess the digital leverage to compete with industry giants through world-class software.
          </p>
        </div>

        {/* 3 Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {visionElements.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group rounded-3xl bg-[#121318] border border-[#262833] hover:border-blue-500/40 p-8 transition-all duration-300 flex flex-col justify-between shadow-xl hover:-translate-y-1 relative overflow-hidden"
              >
                {/* Subtle corner index */}
                <div className="absolute top-6 right-6 font-mono text-xs text-neutral-600 font-bold group-hover:text-blue-500/60 transition-colors">
                  0{index + 1}
                </div>

                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#17181D] border border-[#262833] flex items-center justify-center text-blue-400 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-bold font-heading text-white tracking-tight group-hover:text-blue-400 transition-colors mb-3">
                    {item.title}
                  </h3>

                  <p className="text-sm text-neutral-400 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-[#1C1D24] flex items-center text-xs font-mono text-neutral-500 group-hover:text-neutral-300 transition-colors">
                  <span>SH WEB STUDIO · 2026 ROADMAP</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Studio Culture Callout */}
        <div className="mt-16 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#121318] via-[#151722] to-[#121318] border border-[#262833] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h4 className="text-lg sm:text-xl font-bold font-heading text-white">
              Want to be part of our vision?
            </h4>
            <p className="text-sm text-neutral-400 max-w-xl">
              We are actively looking for talented developers, designers, and creative engineers to build alongside us.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/contact?tab=join"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
            >
              <span>Join SH Web Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
