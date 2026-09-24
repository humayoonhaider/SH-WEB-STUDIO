import React from 'react';
import { AboutSection } from '../../components/public/AboutSection';
import { ProcessSection } from '../../components/public/ProcessSection';
import { FooterCta } from '../../components/public/FooterCta';

export const AboutPage: React.FC = () => {
  return (
    <div className="pt-28 pb-16">
      <AboutSection showFounders={true} />
      <ProcessSection />
      <FooterCta />
    </div>
  );
};
