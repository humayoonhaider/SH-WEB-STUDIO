import React from 'react';
import { SectionHeading } from '../common/SectionHeading';

export const IntroSection: React.FC = () => {
  const technologies = [
    'React',
    'JavaScript',
    'Node.js',
    'Express.js',
    'MongoDB',
    'REST APIs',
  ];

  return (
    <section className="py-20 border-t border-[#1C1D24] bg-[#0B0B0F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="text-xs uppercase tracking-widest text-blue-500 font-semibold">
              Approach & Architecture
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-heading leading-tight">
              Digital solutions built around your business.
            </h2>
            <p className="text-base sm:text-lg text-neutral-400 leading-relaxed font-normal">
              From professional business websites to custom web applications, SH Web Studio combines modern design with practical development to create digital experiences that are built for real-world use.
            </p>
          </div>

          <div className="lg:col-span-5 bg-[#121318] border border-[#262833] rounded-2xl p-6 sm:p-8 space-y-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-300 font-heading">
              Core Production Stack
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              We engineer dependable systems using battle-tested web standards, modern React component architecture, and high-performance server runtimes.
            </p>

            {/* Zero-pill clean unboxed metadata with typographic separators */}
            <div className="pt-2 border-t border-[#262833]/60 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-neutral-300 font-mono">
              {technologies.map((tech, idx) => (
                <React.Fragment key={tech}>
                  <span className="hover:text-blue-400 transition-colors">{tech}</span>
                  {idx < technologies.length - 1 && (
                    <span className="text-neutral-600 select-none" aria-hidden="true">
                      ·
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
