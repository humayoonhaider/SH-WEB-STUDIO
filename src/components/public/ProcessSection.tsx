import React, { useState, useEffect } from 'react';
import { ProcessStep } from '../../types';
import { api } from '../../services/api';
import { SectionHeading } from '../common/SectionHeading';

const defaultSteps = [
  {
    stepNumber: '01',
    title: 'Discover',
    description: 'Understand the business, goals, audience and requirements.',
  },
  {
    stepNumber: '02',
    title: 'Plan',
    description: 'Define the structure, features and user experience.',
  },
  {
    stepNumber: '03',
    title: 'Build',
    description: 'Design and develop the website or application.',
  },
  {
    stepNumber: '04',
    title: 'Launch',
    description: 'Test, deploy and hand over the finished product.',
  },
];

export const ProcessSection: React.FC = () => {
  const [steps, setSteps] = useState<ProcessStep[]>([]);

  useEffect(() => {
    let mounted = true;
    api.process
      .getPublic()
      .then((res) => {
        if (mounted && res.success && res.data && res.data.length > 0) {
          setSteps(res.data);
        }
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  const displayedSteps = steps.length > 0 ? steps : (defaultSteps as any);

  return (
    <section id="process" className="py-24 border-t border-[#1C1D24] bg-[#08080C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="How We Work"
          title="A methodical journey from brief to deployment."
          description="Clear milestones, honest communication, and iterative refinement ensure every deliverable matches the initial vision."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedSteps.map((step: any) => (
            <div
              key={step._id || step.stepNumber}
              className="relative rounded-2xl bg-[#121318] border border-[#262833] p-7 flex flex-col justify-between hover:border-neutral-600 transition-colors"
            >
              <div>
                <div className="text-3xl font-mono font-bold text-blue-500/80 mb-6">
                  {step.stepNumber}
                </div>
                <h3 className="text-xl font-bold text-white font-heading tracking-tight mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed font-normal">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
